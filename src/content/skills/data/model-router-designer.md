---
name: "model-router-designer"
description: "Design a model router that sends each LLM request to the cheapest model that can handle it and escalates only the hard cases to the strongest — cutting cost and latency without tanking quality, gated by an eval set so the savings don't come from silently worse answers. Use when one expensive model serves all traffic (most of it easy), when LLM cost or latency is too high, or when balancing quality against spend across a range of request difficulty."
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Model Router Designer"
date: 2026-06-17
topics: ["llm-app-dev"]
related: ["skill:hallucination-evaluator", "skill:integration-test-designer"]
featured: false
summary: "Serving every request with your strongest model overpays on the easy majority. This skill designs a router: segment traffic by difficulty, pick the cheapest routing signal that separates it, escalate hard cases via a validation check, and prove with an eval set that cost and latency dropped without quality."
faq:
  - q: "Should the router itself be an LLM call?"
    a: "Only as a last resort. An LLM router adds tokens and latency to EVERY request, easy ones included. Exhaust cheap heuristics (task type, input length, a JSON-mode flag) and a small classifier first; reach for an LLM router only when those genuinely can't separate the cases — and confirm it still nets a saving."
  - q: "How do I know routing didn't quietly degrade quality?"
    a: "You don't, without an eval set scored per route. Track cost, latency, AND a quality metric for the cheap route, the strong route, and the blended whole. If cheap-route quality dips below your bar, the threshold is too loose or that segment needs the strong tier."
---

Serving 100% of traffic with your most capable model means paying frontier prices for the 70% of requests a smaller model would have nailed. A model router fixes that by routing each request to the cheapest model that can handle it and escalating only the genuinely hard cases — but routed blind, it trades cost for silent quality regressions on exactly the requests that needed the strong tier. This skill designs the router as a measured system: segment the traffic, pick the cheapest signal that separates it, build an escalation path for the misses, and gate the whole thing on an eval set so you can prove the savings are real.

## When to use this skill
- One expensive model answers all requests and most of them are obviously easy (lookups, formatting, short classifications) — you're overpaying on the majority.
- LLM cost or p95 latency is too high and you want to shed both without a blanket model downgrade that would hurt the hard cases.
- Traffic spans a real difficulty range — trivial extraction up through multi-step reasoning — and you want to spend strong-model budget only where it changes the answer.
- You already tried "just use the cheaper model everywhere" and quality dropped on the hard tail.

> [!NOTE]
> Routing only pays off when a meaningful share of traffic is genuinely easy. If nearly every request needs the strong model, a router adds decision cost and complexity for almost no saving — segment first (step 1) and confirm the easy slice exists before building anything.

## Instructions
1. **Segment the traffic by difficulty before touching code.** Pull a representative sample of real requests (or read the logs/handlers with `Grep`/`Glob`) and bucket them into three tiers: (a) **mechanical** — classification, extraction, fixed-format transforms, short factual lookups; (b) **moderate** — straightforward Q&A, summarization, single-step reasoning; (c) **hard** — multi-step reasoning, code generation, ambiguous or long-context tasks. Estimate the volume share of each. If tier (a)+(b) isn't a sizable fraction, stop — the router won't earn its keep. This split is the spec for everything downstream.
2. **Pick the cheapest routing signal that separates the tiers — in this order.** Reach for the lowest-cost signal that works and stop there: (1) **free heuristics** — the task type/endpoint the request came through, input token length, a required-capability flag (needs JSON mode, needs tools, needs vision, needs long context), presence of code; (2) **a lightweight classifier** — a small fast model or a trained text classifier that labels difficulty, when heuristics can't cleanly separate; (3) **an LLM-based router** — only when neither of the above can tell easy from hard. The router runs on every request, so its cost and latency are pure overhead — never let the router cost more than it saves.
3. **Set explicit thresholds, not vibes.** Turn the signal into concrete rules: e.g. *length < 500 tokens AND task ∈ {classify, extract} → cheap tier*; *needs-tools OR length > 8k tokens → strong tier*. Write the thresholds down with the segmentation they came from so they're auditable and tunable, not buried in an `if`-ladder no one can reason about.
4. **Design the escalation/fallback cascade so easy wins stay cheap and hard cases still get quality.** Default-route to the cheap tier, then run a **validation check** on its output — a confidence signal, a schema/format validation, a "did it actually answer / did it say it's unsure" check, or a cheap self-grade. On failure, **retry the same request on the strong tier** (a cascade). This way the easy majority is served at cheap-tier price in one hop, and only the cases the cheap model fumbles pay for the strong model — capturing most of the saving without eating the quality hit. Decide the validation check per task: structured outputs get schema validation for free; open-ended generation needs a confidence or self-grade signal.
5. **Choose the tiers concretely.** Default the **strong tier** to the latest, most capable Claude model (`claude-opus-4-8`) and the **cheap tier** to a smaller, faster model (`claude-haiku-4-5`); a mid model (`claude-sonnet-4-6`) is a reasonable middle rung if a two-step cascade leaves a gap. Use exact model ID strings — never construct or date-suffix them. Add **always-route-strong guardrails** for high-stakes paths (anything irreversible, safety-relevant, or where a wrong answer is expensive) regardless of what the signal says.
6. **Measure the trade with an eval set — per route, not just in aggregate.** Build (or reuse) a labeled eval set spanning all three difficulty tiers and score three things on every route: **cost**, **latency**, and a **quality metric** (task accuracy, schema-valid rate, judge score — whatever fits the task). Track cheap-route quality, strong-route quality, escalation rate, and the blended numbers separately. The router is only a win if blended cost and latency drop *and* cheap-route quality stays above your bar. If cheap-route quality sags, tighten the threshold or move that segment to the strong tier.

> [!WARNING]
> Routing too much to the cheap model silently degrades quality on the cases that needed the strong one — and aggregate metrics hide it because the easy majority looks fine. Never route blind: gate every threshold change against the per-route eval set and keep the escalation check honest. A router with no quality measurement is just a quality regression you haven't noticed yet.

> [!WARNING]
> An LLM-as-router adds its own latency and token cost on EVERY request, including the easy ones a heuristic would have caught for free. If a task-type check, an input-length cutoff, or a small classifier separates the traffic, use that — reserve the LLM router for the cases where simpler signals genuinely can't, and confirm it still nets a saving end to end.

## Output
A model-routing design, written down so it's tunable:
- **Difficulty segmentation** — the three tiers with their defining traits and estimated volume share, plus the go/no-go call on whether a router is worth building.
- **Routing signal + thresholds** — which signal (heuristic / small classifier / LLM router) and why it's the cheapest that works, with the concrete cutoff rules and the segmentation they derive from.
- **Escalation/fallback cascade** — the default cheap route, the validation check per task type, and the retry-on-strong path, including any always-route-strong guardrails for high-stakes requests.
- **Tier choice** — the strong and cheap model IDs (default `claude-opus-4-8` / `claude-haiku-4-5`, optional `claude-sonnet-4-6` middle rung) and the rationale.
- **Validation metrics** — the eval set composition and the per-route cost / latency / quality numbers (with escalation rate) that prove the router cut spend and latency without dropping quality below the bar.