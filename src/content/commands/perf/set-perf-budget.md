---
description: "Define and enforce a cost and latency budget for an LLM feature or endpoint — set p95/p99 latency and cost-per-request ceilings, instrument to measure them against real traffic, and wire a check that fails when the budget is breached."
argument-hint: "<the LLM endpoint/feature to budget, plus any target numbers (e.g. 'chat API, p95 < 2s, < $0.02/req')>"
allowed-tools: "Read, Grep, Glob, Bash"
model: "sonnet"
title: "Set Perf Budget"
color: "blue"
date: 2026-06-04
topics: ["devops-infra"]
related: ["llm-cost-latency-engineering", "llm-cost-optimizer", "prompt-cache-optimizer", "llm-gateways-compared"]
featured: false
summary: "A slash command that turns 'fast and cheap' into enforced ceilings for an LLM feature: it pins p95/p99 latency and cost-per-request targets, measures the baseline on representative traffic, instruments per-request metrics, wires CI checks or runtime caps that fail loudly when the budget is breached, and documents it all."
---

## Scope

Treat `$ARGUMENTS` as the LLM feature or endpoint to put a budget around — and any target numbers the user gave. The job is to turn "it should be fast and cheap" into **explicit, measured ceilings** that a build or monitor can enforce, so cost and latency can't regress silently. A budget nobody checks is a wish; this command produces one that fails loudly.

> [!NOTE]
> This sets and enforces the budget. To then *find and cut* what's over budget, hand off to the [llm-cost-optimizer](/agents/data-ai/llm-cost-optimizer) agent; for the techniques behind the targets, see [LLM Cost and Latency Engineering](/guides/advanced/llm-cost-latency-engineering).

## Step 1 — Pin the budget numbers

Settle the ceilings before measuring anything:

- **Latency** — p50/p95/p99 targets (budget the **tail**, p95/p99, not the average — users feel the tail). Distinguish total time from time-to-first-token for streamed responses.
- **Cost** — a cost-per-request ceiling, and/or a daily/monthly spend cap for the feature.
- **Scope** — which endpoint/feature/model this budget covers, since different routes warrant different budgets.

If the user didn't give numbers, propose defaults from the feature's UX (interactive vs. batch) and current measured baseline, and state them explicitly.

## Step 2 — Establish the baseline

Measure current cost and latency against **representative** traffic — real prompt/response sizes and concurrency, not a single warm request. Pull from existing observability/traces ([Helicone](/tools/helicone), [Portkey](/tools/portkey), or your logs) where available. Report p50/p95/p99 and cost-per-request as they stand, so the budget is grounded in reality and you know the gap.

## Step 3 — Instrument the metrics

Ensure the numbers are actually captured per request: latency (and time-to-first-token), input/output tokens, and computed cost. If instrumentation is missing, add the minimal measurement needed — you can't enforce a budget you don't record.

## Step 4 — Wire the enforcement

Make the budget fail loudly when breached, at the right gate:

- **CI / pre-merge** — a latency/cost regression test over a representative sample that fails the build when p95 or cost-per-request exceeds the ceiling.
- **Runtime** — alerts or guardrails on p95/p99 and on the daily/monthly spend cap (gateway budgets and rate limits can hard-stop runaway cost).

Pick the gate that matches the risk: regression-prone code → CI; runaway-spend risk → runtime caps.

## Step 5 — Document the budget

Record the ceilings, where they're enforced, the current baseline vs. target, and what to do on a breach (route to the [llm-cost-optimizer](/agents/data-ai/llm-cost-optimizer)). A budget that lives only in someone's head isn't enforced.

> [!WARNING]
> Budget the tail, not the mean. An average latency under target hides the p99 requests that make users churn — and an average cost hides the expensive outlier prompts that dominate the bill. Set and enforce p95/p99 and per-request ceilings, not just the average.
