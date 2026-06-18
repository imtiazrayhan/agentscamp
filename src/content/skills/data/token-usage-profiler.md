---
name: "token-usage-profiler"
description: "Measure and attribute LLM token usage and cost across an app — input vs output tokens by feature, route, model, and tenant — then rank the waste and the specific lever to cut it. Use when LLM spend is high or climbing with no clear cause, before scaling a feature that calls a model, or when you need per-feature or per-tenant cost attribution for billing or budgets."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Token Usage Profiler"
date: 2026-06-17
topics: ["llm-app-dev"]
related: ["prompt-cache-optimizer", "prompt-regression-tester", "llm-eval-suite-scaffolder"]
featured: false
summary: "An LLM bill is a total until you tag it. This skill instruments every model call with input/output tokens, model, and a feature/tenant tag, breaks spend down by that tag, ranks the dominant waste, and assigns each driver a concrete lever — trim context, cap output, downshift the model, or cache — plus the budgets to catch regressions."
faq:
  - q: "Why split input and output tokens instead of tracking one total?"
    a: "Output tokens typically cost several times more per token than input on the same model, so a verbose response can dominate cost even when the prompt is small. A single total hides which axis to attack; the split tells you whether to trim the prompt or cap the generation."
  - q: "Do I need real provider usage numbers or can I estimate from a tokenizer?"
    a: "Use the provider's reported usage (the usage object on each response) as ground truth — it reflects system prompts, tool schemas, and cached-prefix discounts that a local tokenizer count misses. Reserve local tokenizing for pre-send budget checks, not billing attribution."
---

An LLM bill arrives as one number, and that number tells you nothing about what to fix. The waste is almost never spread evenly — a couple of bloated prompts, one feature that streams paragraphs where a sentence would do, or a single noisy tenant usually drive most of the spend. This skill turns the total into an attributed, ranked profile: it instruments every model call to record input vs output tokens, the model, and a feature/route/tenant **tag**, breaks cost down by that tag, and hands you the dominant drivers each paired with the specific lever that cuts it.

## When to use this skill
- The LLM bill is high or rising and nobody can say which feature or tenant is responsible.
- You're about to scale a model-backed feature and want to know its true per-call and aggregate cost first.
- You need per-feature or per-tenant cost attribution for internal budgets, chargeback, or usage-based pricing.
- A verbose feature or a stuffed context window is suspected, but you have no measurement to confirm it.
- A cost regression slipped in — spend jumped after a deploy — and you need to localize it to a call site.

## Instructions
1. **Add the tag before measuring anything — attribution is impossible without it.** At every model call site, capture: model id, input (prompt) tokens, output (completion) tokens, and a stable `tag` identifying the *feature/route* (e.g. `summarize-thread`, `support-reply`) plus `tenant`/`user` where billing matters. Pull token counts from the provider's `usage` object on the response, not a local tokenizer — the provider reflects system prompts, tool schemas, and cache discounts. `grep` the codebase for call sites first (`Grep` for the SDK call, e.g. `messages.create`, `chat.completions`, `generateText`) so no path is missed; a single untagged call site becomes an "unattributed" bucket that hides waste.
2. **Compute cost, don't count tokens.** Map each `(model, input|output)` pair to its price and compute `cost = tokens × price_per_token`, keeping input and output as separate columns. Sum over a representative window (e.g. 7 days, or one full traffic cycle). Tokens alone mislead because input and output, and cheap vs frontier models, have wildly different unit prices.
3. **Break spend down by tag and sort by total cost.** Produce a table: tag × model × {input cost, output cost, calls, avg tokens/call}. Sort descending by total cost. Expect a Pareto shape — the top 2–4 tags usually own the majority of spend. Optimize those; ignore the long tail.
4. **Separate per-call cost from volume — they need different fixes.** For each top tag, look at *both* cost-per-call and call count. An expensive call made rarely and a cheap call made a million times can carry the same total; the first is fixed by trimming the prompt/output, the second by caching, dedup, or not calling at all. Flag which axis dominates each driver.
5. **For each driver, attack the levers in this order (cheapest win first):**
   - **Trim bloated input.** Remove dead boilerplate from system prompts, stop stuffing whole documents/full chat history when a retrieved snippet or rolling summary suffices, and drop unused tool schemas. This is usually the largest, lowest-risk reduction.
   - **Cap or shorten output.** Set `max_tokens` to the real need, ask for terse/structured output, and avoid "explain your reasoning" in production paths where it isn't consumed. Because output is the pricier axis, shaving it often beats prompt trimming on cost.
   - **Downshift the model.** Route easy calls (classification, extraction, short rewrites) to a smaller/cheaper model and reserve the frontier model for genuinely hard ones. Gate the route on a measurable signal, not a guess, and confirm quality holds with an eval set before shipping.
   - **Cache repeated stable prefixes.** Where a long system prompt or document prefix is reused across calls, enable prompt/KV caching so the stable part is billed at the discounted cached rate. Order the prompt so the stable prefix comes first; volatile content last.
6. **Set per-feature budgets and alerts.** Record each top tag's current cost/call and cost/day as a baseline, then add an alert that fires when either exceeds a threshold (e.g. +30%). Treat a token-usage spike like any other regression — caught at deploy, not at the invoice.

> [!WARNING]
> You cannot optimize what you can't attribute. Without per-feature/per-tenant tags, the "profile" is just a grand total — you'll guess which prompt to cut and likely guess wrong. Add the tag and re-collect before doing any optimization work.

> [!NOTE]
> Output tokens usually cost several times more per token than input tokens, so a verbose model response — not a long prompt — is frequently the real cost driver. Always inspect avg *output* tokens/call on your top tags before assuming the prompt is to blame.

## Output
- **Instrumentation/tagging plan** — the list of call sites found, and for each the tag (feature/route + tenant) and the input/output/model fields to record, sourced from the provider `usage` object.
- **Spend breakdown** — a table of tag × model with separate input-cost and output-cost columns (`cost = tokens × price`), calls, and avg tokens/call, sorted by total cost, with an "unattributed" row if any call site is still untagged.
- **Ranked waste** — the dominant drivers in order, each labeled by axis (per-call cost vs volume) and assigned its specific lever (trim context / cap output / downshift model / cache prefix) with the expected reduction.
- **Budgets & alerts** — baseline cost/call and cost/day per top tag plus the threshold alert to add, so future regressions are caught automatically.