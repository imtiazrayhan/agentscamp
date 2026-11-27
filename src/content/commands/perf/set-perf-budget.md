---
description: "Define and enforce a cost and latency budget for an LLM feature or endpoint — set p95/p99 latency and cost-per-request ceilings, instrument to measure them against real traffic, and wire a check that fails when the budget is breached."
argument-hint: "<the LLM endpoint/feature to budget, plus any target numbers (e.g. 'chat API, p95 < 2s, < $0.02/req')>"
allowed-tools: "Read, Grep, Glob, Bash, Edit, Write"
model: "sonnet"
title: "Set Perf Budget"
color: "blue"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["devops-infra"]
audience: ["developers"]
related: ["guide:llm-cost-latency-engineering", "agent:llm-cost-optimizer", "skill:prompt-cache-optimizer", "guide:llm-gateways-compared"]
featured: false
summary: "Turns 'fast and cheap' into enforced ceilings for one LLM feature. It pins p95/p99 latency and cost-per-request targets, measures the baseline on representative traffic, writes a budget file and a check script that exits non-zero on a breach, and wires that check into CI or a runtime cap."
---

## Scope

Treat `$ARGUMENTS` as the LLM feature or endpoint to put a budget around — and any target numbers the user gave. The job is to turn "it should be fast and cheap" into **explicit, measured ceilings** that a build or monitor can enforce, so cost and latency can't regress silently. A budget nobody checks is a wish; this command produces one that fails loudly.

Files this command may create or edit: a budget file (`perf-budget.json`), a check script, the minimal per-request instrumentation, and the CI workflow step that runs the check. It does not optimize the feature.

## When to use

- An LLM feature is about to ship, or just shipped, with no stated latency or cost ceiling.
- A model, prompt, or retrieval change is planned and you want a regression to fail a build instead of showing up on the invoice.
- Not for finding and fixing what is slow or expensive. That comes after the budget exists.

> [!NOTE]
> This sets and enforces the budget. To then *find and cut* what's over budget, hand off to the [llm-cost-optimizer](/agents/data-ai/llm-cost-optimizer) agent; for the techniques behind the targets, see [LLM Cost and Latency Engineering](/guides/advanced/llm-cost-latency-engineering).

## Step 1 — Pin the budget numbers

Settle the ceilings before measuring anything:

- **Latency** — p50/p95/p99 targets (budget the **tail**, p95/p99, not the average — users feel the tail). Distinguish total time from time-to-first-token for streamed responses.
- **Cost** — a cost-per-request ceiling, and/or a daily/monthly spend cap for the feature.
- **Scope** — which endpoint/feature/model this budget covers, since different routes warrant different budgets.

If the user didn't give numbers, measure first (Step 2), then propose ceilings from the baseline: a starting point is the current p95 and cost-per-request plus 10 to 20 percent headroom, tightened to what the UX needs (an interactive feature is judged on time-to-first-token, a batch job on total time and cost). State the proposal and get a yes before writing it down.

Write the agreed numbers to a budget file at the repo root or next to the feature:

```json
{
  "feature": "chat-api",
  "route": "POST /api/chat",
  "latency_ms": { "ttft_p95": 800, "total_p95": 2000, "total_p99": 4000 },
  "cost_usd": { "per_request_p95": 0.02, "per_request_mean": 0.008, "daily_cap": 50 },
  "min_samples": 200,
  "prices_checked": "<date and source of the per-token prices used>"
}
```

The figures above are placeholders showing the shape, not recommendations.

## Step 2 — Establish the baseline

Measure current cost and latency against **representative** traffic — real prompt/response sizes and concurrency, not a single warm request. Pull from existing observability/traces ([Helicone](/tools/helicone), [Portkey](/tools/portkey), or your logs) where available. Report p50/p95/p99 and cost-per-request as they stand, so the budget is grounded in reality and you know the gap.

Rules for the sample:

- At least 200 requests for a p95 and about 1,000 for a p99. With fewer, report the percentile as unreliable; a p99 over 50 requests is just the slowest one.
- Use real prompts with their real context sizes, and include cold starts and cache misses in the same proportion production sees.
- Compute cost per request as `input_tokens x input price + output_tokens x output price`, with cached and reasoning tokens at their own rates. Take the per-token prices from the provider's pricing page on the day, and record the date in the budget file.

## Step 3 — Instrument the metrics

Ensure the numbers are actually captured per request: latency (and time-to-first-token), input/output tokens, and computed cost. If instrumentation is missing, add the minimal measurement needed — you can't enforce a budget you don't record.

The minimum is one structured log line (or span) per request with: `feature`, `model`, `ttft_ms`, `total_ms`, `input_tokens`, `output_tokens`, `cached_tokens`, `cost_usd`, and `status`. Read token counts from the provider's usage field on the response, not from a local estimate. Put the measurement in the one function every call to the feature passes through, not at each call site.

## Step 4 — Wire the enforcement

Make the budget fail loudly when breached, at the right gate:

- **CI / pre-merge** — a latency/cost regression test over a representative sample that fails the build when p95 or cost-per-request exceeds the ceiling.
- **Runtime** — alerts or guardrails on p95/p99 and on the daily/monthly spend cap (gateway budgets and rate limits can hard-stop runaway cost).

Pick the gate that matches the risk: regression-prone code → CI; runaway-spend risk → runtime caps.

For the CI gate, write a check script that reads the budget file and a file of per-request measurements (one JSON object per line, from a replay of the representative sample), and exits non-zero on a breach. A Python version using only the standard library:

```python
import json, math, sys

budget = json.load(open(sys.argv[1]))
rows = [json.loads(line) for line in open(sys.argv[2]) if line.strip()]

def pct(values, p):  # nearest-rank percentile
    values = sorted(values)
    return values[max(0, math.ceil(p / 100 * len(values)) - 1)]

if len(rows) < budget["min_samples"]:
    sys.exit(f"only {len(rows)} samples, need {budget['min_samples']}")

checks = [
    ("ttft_p95", pct([r["ttft_ms"] for r in rows], 95), budget["latency_ms"]["ttft_p95"]),
    ("total_p95", pct([r["total_ms"] for r in rows], 95), budget["latency_ms"]["total_p95"]),
    ("total_p99", pct([r["total_ms"] for r in rows], 99), budget["latency_ms"]["total_p99"]),
    ("cost_p95", pct([r["cost_usd"] for r in rows], 95), budget["cost_usd"]["per_request_p95"]),
    ("cost_mean", sum(r["cost_usd"] for r in rows) / len(rows), budget["cost_usd"]["per_request_mean"]),
]
failed = False
for name, actual, limit in checks:
    ok = actual <= limit
    failed |= not ok
    print(f"{'ok  ' if ok else 'FAIL'} {name}: {actual:.4g} (limit {limit})")
sys.exit(1 if failed else 0)
```

Match the project's language if it is not a Python repo. Run the script once against the baseline measurements to confirm it passes or fails as expected, then add it as a step in the existing CI workflow. Replaying real model calls in CI costs money on every run, so default to running it on changes under the feature's paths or on a schedule, and say which you chose.

For the runtime gate, use what the project already has: the gateway's budget and rate-limit settings, or the observability tool's alert rules. Read the exact setting names from that tool's current docs before writing config.

## Step 5 — Document the budget

Record the ceilings, where they're enforced, the current baseline vs. target, and what to do on a breach (route to the [llm-cost-optimizer](/agents/data-ai/llm-cost-optimizer)). A budget that lives only in someone's head isn't enforced.

## Output

Finish with this report:

```markdown
## Perf budget: <feature>

| Metric | Baseline | Budget | Headroom | Enforced by |
| --- | --- | --- | --- | --- |
| TTFT p95 | ... ms | ... ms | ...% | <CI check / alert> |
| Total p95 | ... | ... | ... | ... |
| Total p99 | ... | ... | ... | ... |
| Cost per request p95 | ... | ... | ... | ... |
| Daily spend | ... | ... cap | ... | <gateway cap / alert> |

Sample: <n> requests from <source>, <date range>
Files written or changed: <budget file, check script, instrumentation, CI step>
Check result on baseline: <pass | fail on which metric>
Already over budget: <metrics, or none>
Not enforced yet: <anything left manual, and why>
```

> [!WARNING]
> Budget the tail, not the mean. An average latency under target hides the p99 requests that make users churn — and an average cost hides the expensive outlier prompts that dominate the bill. Set and enforce p95/p99 and per-request ceilings, not just the average.
