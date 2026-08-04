---
title: "LLM Cost and Latency Engineering: Caching, Right-Sizing, and p95 Budgets"
description: "A practical playbook for cutting LLM cost and tail latency — caching, model right-sizing, prompt trimming, and enforced p95 budgets — without losing quality."
author: "AgentsCamp"
date: 2026-06-04
color: "green"
topics: ["devops-infra"]
tags: ["cost-optimization", "latency", "caching", "p95", "llmops"]
featured: false
summary: "LLM cost and latency are usually concentrated in a few prompts, routes, and model choices — so measure first, then cut where it pays. The levers: prompt caching for stable prefixes, response/semantic caching for repeated queries, per-task model right-sizing, token trimming, streaming for perceived speed, and enforced p95 and cost budgets — always against an eval bar so cheaper never means worse."
keyTakeaways:
  - "Cost and latency are concentrated — a few prompts, routes, and model choices dominate. Measure and attribute first; optimize the biggest line items, not the easiest."
  - "Caching is the highest-leverage lever: provider prompt caching for stable prefixes, plus response/semantic caching for repeated or near-duplicate queries."
  - "Right-size the model per task — route the easy, structured majority to a smaller, cheaper, faster model and reserve the frontier model for the hard slice."
  - "Budget the tail, not the mean: enforce p95/p99 latency and cost-per-request ceilings, because averages hide the requests that actually hurt."
  - "Input tokens are billed on every call, so trimming bloated system prompts, few-shot, and unused context compounds across all your traffic."
  - "Re-check quality against an eval set after every cut — a cheaper, faster system that's less accurate is a regression, not a win."
howtoSteps:
  - name: "Measure and attribute the spend"
    text: "Before changing anything, attribute cost and latency to specific calls, prompts, and routes: input vs. output tokens, calls per feature, p50/p95/p99, and dollars per request. Use observability (Helicone, Portkey, or your traces). Optimization without measurement is guessing."
  - name: "Cache the repeats"
    text: "Turn on provider prompt caching for stable prefixes (system prompt, instructions, few-shot, long context), and add response or semantic caching for repeated and near-duplicate queries. Caching is usually the single biggest cost-and-latency win when calls share context."
  - name: "Right-size the model per task"
    text: "Most requests don't need the biggest model. Route easy or structured tasks to a smaller, cheaper, faster model and reserve the frontier model for the hard slice — a cascade or router — checking each task against its eval bar before switching it down."
  - name: "Trim the tokens"
    text: "Shorten verbose system prompts, prune low-value few-shot examples, cap max_tokens to what the task needs, and stop sending context the model doesn't use. Input tokens are billed every call, so a trimmed prompt pays back on every request."
  - name: "Cut the latency users feel"
    text: "Stream tokens so output renders progressively instead of after a long blocking wait, parallelize independent calls, and set timeouts. Separate wall-clock cost from perceived latency — streaming fixes the feel, caching and routing fix the clock."
  - name: "Set and enforce budgets"
    text: "Define p95/p99 latency and cost-per-request ceilings and wire a check that fails when they're breached — a CI regression test, a runtime alert, or gateway budgets and rate limits that hard-stop runaway spend. A budget nobody enforces is a wish."
  - name: "Verify quality held"
    text: "Re-run your eval set after each change and report the cost and latency delta together with the quality delta. A 60%-cheaper system that's less accurate isn't an optimization — only ship the cut if the answers are still right."
faq:
  - q: "How do I reduce LLM API costs?"
    a: "Measure where the money goes first — attribute cost to specific prompts, routes, and models — then attack the biggest line items in this order: cache repeated calls (provider prompt caching for stable prefixes, response/semantic caching for repeated queries), right-size the model per task (send the easy majority to a cheaper, smaller model), and trim input tokens (shorter system prompts, fewer few-shot examples, capped max_tokens). Each change should be re-checked against an eval set so you don't trade cost for quality. Cost is almost always concentrated, so a few targeted fixes usually recover most of the spend."
  - q: "What is prompt caching and how much does it save?"
    a: "Prompt caching lets a provider reuse the computation for a repeated prefix of your prompt — the stable system prompt, instructions, few-shot examples, or long context that's identical across calls. When the prefix hits the cache, those input tokens are billed at a steep discount and the response starts faster. Savings depend on how much of your prompt is stable and reused within the cache window, but for workloads with a large fixed preamble (a long system prompt or a shared document) it can cut input-token cost substantially and lower time-to-first-token. The key is ordering the prompt static-first so the cacheable prefix is as long as possible."
  - q: "How do I lower LLM latency, especially p95?"
    a: "Attack it on two fronts. For perceived latency, stream tokens so output appears immediately and parallelize independent calls. For actual latency, cache (a cache hit is far faster than a model call), right-size to a faster model where quality allows, cut output length, and reduce the input you send. Then budget and monitor the tail (p95/p99), not the average — the slow requests are what users feel and what averages hide. Set a p95 ceiling and enforce it so latency can't regress silently."
  - q: "Should I always use the cheapest or smallest model?"
    a: "No — match the model to the task. The cheapest model that clears your eval bar for a given task is the right one for that task, but a model too weak for the hard cases will cost you in retries, bad outputs, and downstream errors that dwarf the token savings. The robust pattern is right-sizing per task: route the easy, structured, or high-volume requests to a small fast model and reserve the frontier model for the genuinely hard slice, verifying each routing decision against evals rather than assuming."
  - q: "Why measure p95 latency instead of the average?"
    a: "Because users experience the tail, not the mean. An average latency comfortably under target can hide a p99 of several seconds on a meaningful fraction of requests — and those slow requests are the ones that make users abandon. The same logic applies to cost: an average cost-per-request hides the expensive outlier prompts that dominate the bill. Budgeting and enforcing p95/p99 and per-request ceilings targets the requests that actually matter, instead of an average that can look fine while the experience is bad."
related: ["guide:llm-gateways-compared", "skill:prompt-cache-optimizer", "agent:llm-cost-optimizer", "command:set-perf-budget", "tool:portkey", "tool:helicone", "guide:calling-any-model-gateways", "guide:choosing-the-right-model"]
---

LLM cost and tail latency feel like vague, ever-growing problems, but they almost never are: they're **concentrated**. A handful of prompts, a couple of routes, and one or two model choices usually account for most of the bill and most of the slow requests. So the discipline is the same as any performance work — measure and attribute first, then cut where it pays, and prove you didn't break quality doing it. This is the playbook.

## Measure before you cut

You can't optimize what you can't see. Attribute cost and latency to specific calls: input vs. output tokens, calls per feature, p50/p95/p99, and dollars per request. Observability tooling ([Helicone](/tools/helicone), [Portkey](/tools/portkey), or your own traces) turns "the bill is too high" into "these three prompts are 70% of spend." Without that, every change is a guess.

## The levers, in order of leverage

### Caching — usually the biggest win

When calls share context, caching beats everything else. Two kinds:

- **Provider prompt caching** discounts a repeated *prefix* — the stable system prompt, instructions, few-shot, or long context that's identical across calls. Order the prompt **static-first** so the cacheable prefix is as long as possible (the [prompt-cache-optimizer](/skills/performance/prompt-cache-optimizer) skill does exactly this).
- **Response / semantic caching** serves a stored answer for an exact-repeat (or, semantically, a near-duplicate) query, skipping the model entirely. Scope the key and TTL carefully — a cache that serves a stale or wrong answer is a correctness bug.

### Right-sizing — stop overpaying per request

Most requests don't need the frontier model. Route the easy, structured, or high-volume majority to a smaller, cheaper, faster model and reserve the strongest model for the hard slice — a **cascade** or **[router](/glossary/model-routing)**. Validate each downshift against an eval set; "cheaper" that drops accuracy isn't cheaper once you count the retries and bad outputs. See [Choosing the Right Model](/guides/getting-started/choosing-the-right-model).

### Token trimming — pay less on every call

Input tokens are billed every single call, so a bloated prompt is a recurring tax. Shorten verbose system prompts, prune low-value few-shot examples, cap `max_tokens`, and stop shipping context the task never uses. Small per-call savings compound hard across real traffic.

### Perceived latency — fix what the user feels

Not all latency is equal. **Stream** tokens so output renders progressively instead of after a long blocking wait, **parallelize** independent calls, and set **timeouts**. Streaming doesn't make the request finish sooner — it makes it *feel* fast, which is often what actually matters.

## Budget the tail, then enforce it

> [!WARNING]
> Budget p95/p99 and cost-per-request, **not the average**. An average latency under target hides the slow requests that make users churn, and an average cost hides the outlier prompts that dominate the bill. Set explicit ceilings and make them fail loudly — a CI regression test, a runtime alert, or gateway budgets and rate limits that hard-stop runaway spend. The [set-perf-budget](/commands/perf/set-perf-budget) command scaffolds this.

## Never trade cost for quality blind

Every cut — a smaller model, a shorter prompt, an aggressive cache TTL — is a hypothesis about quality. Re-run your eval set after each change and report the **cost and latency delta together with the quality delta**. A system that's 60% cheaper and quietly less accurate is a regression you shipped on a spreadsheet.

## Putting it together

Measure and attribute → cache the repeats → right-size per task → trim tokens → fix perceived latency → set and enforce budgets → re-verify quality. The [llm-cost-optimizer](/agents/data-ai/llm-cost-optimizer) agent runs this loop end-to-end. The single biggest structural decision is *where* these levers live: doing them per-app is fine at small scale, but a **gateway** centralizes caching, routing, and budgets across all your traffic — compare the options in [LLM Gateways Compared](/guides/advanced/llm-gateways-compared), and see [Calling Any Model](/guides/concepts/calling-any-model-gateways) for the unified-access layer underneath.

## Continue exploring

- [Production Model Routing: Cut Cost Without Hiding Regressions](/guides/concepts/production-model-routing) — Design an LLM model router with capability gates, difficulty signals, cascades, fallbacks, per-route evals, shadow traffic, budgets, and safe rollout.
- [Add Caching](/commands/perf/add-caching) — Add a caching layer to one expensive function or endpoint correctly — confirm it's cacheable, design the cache key/TTL/layer/invalidation, handle stampedes, wrap the call in…
