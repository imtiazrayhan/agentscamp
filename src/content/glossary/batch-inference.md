---
term: "Batch Inference"
description: "Batch inference processes many LLM requests asynchronously instead of one-at-a-time interactively — typically at ~50% discount via provider batch APIs."
date: 2026-06-12
topics: ["llm-app-dev"]
tags: ["batch", "inference", "cost", "throughput"]
related: ["glossary:inference", "guide:llm-cost-latency-engineering", "glossary:prompt-caching", "glossary:synthetic-data"]
faq:
  - q: "When should I use a batch API?"
    a: "Whenever no human is waiting: backfills, dataset labeling, synthetic-data generation, nightly summarization, embedding refreshes, bulk evals. Provider batch tiers typically cost about half of interactive pricing in exchange for results within a window (commonly up to 24 hours, usually much faster) — free money for offline workloads."
  - q: "Is batch inference the same as batching in serving?"
    a: "Different layers, same word. Provider batch APIs are a product tier: submit a file of requests, collect results later, pay less. Serving-level batching (continuous batching in engines like vLLM) is an engine technique packing concurrent requests onto the GPU. One is how you buy; the other is how the GPU stays busy."
---

**Batch inference is running LLM requests asynchronously in bulk — submit a job of many requests, collect results when ready — instead of the interactive request-response loop, usually at a steep discount.**

It exists because providers can schedule deferred work into idle capacity: the standard batch tier prices at roughly **half of interactive rates** for results within a stated window. The candidates are everything without a user waiting — labeling and classification backfills, [synthetic-data](/glossary/synthetic-data) generation, periodic summarization, bulk evaluation runs, embedding regeneration — which in many products is the *majority* of token volume, hiding in plain sight at full price.

The practical pattern: audit your traffic, split it into interactive (humans waiting — pay for latency) and deferrable (move to batch), and stack the discounts — batch pricing composes with [prompt caching](/glossary/prompt-caching) on repeated prefixes. It's one of the three blunt levers in [LLM cost engineering](/guides/advanced/llm-cost-latency-engineering), alongside caching and model right-sizing — and the only one that's purely logistical: same model, same outputs, half the bill.
