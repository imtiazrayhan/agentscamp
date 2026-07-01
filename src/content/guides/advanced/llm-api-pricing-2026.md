---
title: "LLM API Pricing in 2026: Every Major Model Compared"
description: "Per-million-token prices for Claude, GPT, Gemini, DeepSeek, Mistral, and Grok — plus caching and batch discounts — verified against vendor pricing pages."
author: "AgentsCamp"
date: 2026-07-01
color: "green"
topics: ["llm-app-dev", "devops-infra"]
tags: ["pricing", "llm-api", "costs", "comparison", "data"]
featured: true
summary: "Verified July 1, 2026, from vendor pricing pages only. Flagships: Claude Fable 5 $10/$50 per million tokens (in/out), Claude Opus 4.8 $5/$25, GPT-5.5 $5/$30, Gemini 3.1 Pro Preview $2/$12. Workhorses: Claude Sonnet 5 $3/$15, GPT-5.4 $2.50/$15, Gemini 3.5 Flash $1.50/$9. Caching cuts input ~90%, batch APIs cut everything 50% — the discounts stack."
keyTakeaways:
  - "Three durable price tiers exist across every vendor: frontier ($5–10 in / $25–50 out), workhorse ($1.50–3 in / $9–15 out), and budget ($0.10–1 in / $0.30–5 out) — match the tier to the task before comparing vendors."
  - "Output costs 3–6x input everywhere, and reasoning/thinking tokens bill as output — long-output and heavy-reasoning workloads dominate most bills."
  - "The discount stack is the real price list: prompt-cache reads run ~0.1x input across vendors, batch APIs take 50% off, and they compose — cached batch input can cost ~5% of list."
  - "Open-weights models via hosts (DeepSeek V4, Kimi, Qwen, GLM on Together/Fireworks) undercut proprietary mid-tiers — at the cost of operating the integration yourself."
  - "Prices churn — this page is refreshed on a cadence (date stamped above), and every number here was read from a vendor pricing page, never aggregators."
faq:
  - q: "What's the cheapest good LLM API in 2026?"
    a: "Depends on the floor you need. For mechanical work, GPT-5.4-nano ($0.20/$1.25), Mistral Small 4 ($0.15/$0.60), and Gemini 3.1 Flash-Lite ($0.25/$1.50) define the budget tier; Claude Haiku 4.5 ($1/$5) is the premium-budget pick. For workhorse coding/agent use, Sonnet 5, GPT-5.4, and Gemini 3.5 Flash cluster at $1.50–3 in / $9–15 out — capability per dollar there is task-dependent: benchmark on your work."
  - q: "How do prompt caching and batch discounts actually combine?"
    a: "Multiplicatively, on most platforms. Example on Claude: batch halves list price, and cache reads are 0.1x input — Anthropic's batch+cache pricing means a cached input token in a batch job costs ~5% of the standard input rate. Structuring for cacheable prefixes and routing offline work to batch APIs are the two highest-ROI cost moves before touching model choice."
  - q: "Do 1M-token context windows cost extra?"
    a: "On Anthropic, no — Fable 5, Opus 4.8, and Sonnet 5 include the full 1M window at standard per-token pricing (a 900k-token request bills at the same rate as a 9k one). Google tiers instead: Gemini 3.1 Pro charges roughly double per token beyond 200K context. Either way you pay for the tokens you send — big windows make big bills possible, not free."
  - q: "Why do you only cite vendor pricing pages?"
    a: "Because third-party price aggregators drift stale within weeks and propagate each other's errors. Every figure on this page was fetched from the provider's own pricing or docs page on the date stamped above; anything we couldn't verify that way is omitted rather than guessed."
related: ["llm-cost-latency-engineering", "llm-context-windows-compared", "prompt-caching", "batch-inference", "claude-vs-gpt-vs-gemini-coding", "calling-any-model-gateways", "litellm-vs-openrouter"]
---

All prices are **USD per million [tokens](/glossary/llm-token), standard tier**, read directly from vendor pricing pages on **July 1, 2026**. Prices change; this page is maintained on a refresh cadence (the `Updated` date above is the source of truth), and numbers we couldn't verify on a vendor page are omitted, not estimated.

## Anthropic (Claude)

| Model | Input | Output | Cache read | Batch (in/out) | Context |
| --- | --- | --- | --- | --- | --- |
| Claude Fable 5 | $10.00 | $50.00 | $1.00 | $5.00 / $25.00 | 1M |
| Claude Opus 4.8 | $5.00 | $25.00 | $0.50 | $2.50 / $12.50 | 1M |
| Claude Sonnet 5 | $3.00 | $15.00 | $0.30 | $1.50 / $7.50 | 1M |
| Claude Haiku 4.5 | $1.00 | $5.00 | $0.10 | $0.50 / $2.50 | 200K |

Cache writes cost 1.25x input (5-minute TTL) or 2x (1-hour); cache reads are 0.1x input. Batch is 50% off and **stacks with caching**. Notably, the 1M-context models include the full window at standard per-token pricing — no long-context surcharge. **Claude Sonnet 5** is now the workhorse tier (GA, superseding the legacy Sonnet 4.6); it carries an introductory $2/$10 rate through Aug 31, 2026, then reverts to the $3/$15 standard shown above.

## OpenAI (GPT)

| Model | Input | Cached input | Output | Batch | Context |
| --- | --- | --- | --- | --- | --- |
| GPT-5.5 | $5.00 | $0.50 | $30.00 | 50% off | 1M |
| GPT-5.5-pro | $30.00 | — | $180.00 | — | ~1M |
| GPT-5.4 | $2.50 | $0.25 | $15.00 | 50% off | 1M |
| GPT-5.4-mini | $0.75 | $0.075 | $4.50 | 50% off | 400K |
| GPT-5.4-nano | $0.20 | $0.02 | $1.25 | 50% off | 400K |

Cached input is 0.1x across the lineup; Flex tier matches batch pricing, Priority tier runs 2.5x. The pro tiers ($30/$180) are the premium-reasoning outliers of the whole market.

## Google (Gemini API)

| Model | Input | Output | Cache read | Batch | Context |
| --- | --- | --- | --- | --- | --- |
| Gemini 3.1 Pro Preview | $2.00 (≤200K) / $4.00 (>200K) | $12.00 / $18.00 | $0.20 / $0.40 | 50% off | ~1M |
| Gemini 3.5 Flash | $1.50 | $9.00 (incl. thinking) | $0.15 | 50% off | ~1M |
| Gemini 3.1 Flash-Lite | $0.25 | $1.50 | $0.025 | 50% off | ~1M |

Google is the one major vendor with long-context tiering: the Pro model's per-token price roughly doubles beyond 200K of context. Cache storage bills separately per MTok-hour.

## DeepSeek, Mistral, xAI

| Model | Input | Output | Notes |
| --- | --- | --- | --- |
| DeepSeek V4 Flash | $0.14 | $0.28 | Cache hits ~$0.003; 1M context |
| DeepSeek V4 Pro | $0.435 | $0.87 | Cache hits ~$0.004; 1M context |
| Mistral Medium 3.5 | $1.50 | $7.50 | Premium tier; batch 50% |
| Mistral Large 3 | $0.50 | $1.50 | Open-weights flagship (not a typo: priced below Medium 3.5) |
| Mistral Small 4 | $0.15 | $0.60 | Budget tier |
| Grok 4.3 (xAI) | $1.25 | $2.50 | 1M context |

DeepSeek remains the proprietary-price disruptor — its V4 Flash undercuts every Western budget tier while claiming a 1M window. (Its legacy `deepseek-chat`/`deepseek-reasoner` aliases retire July 24, 2026.)

## Open-weights via hosts

Reference serverless prices (host pricing, not vendor MSRP), July 1, 2026 — Together AI / Fireworks:

| Model | Together (in/out) | Fireworks (in/out) |
| --- | --- | --- |
| DeepSeek V4 Pro | $1.74 / $3.48 | $1.74 / $3.48 |
| Kimi K2.6 | $1.20 / $4.50 | $0.95 / $4.00 |
| Qwen 3.7 Plus | — | $0.40 / $1.60 |
| GLM-5.1 | $1.40 / $4.40 | $1.40 / $4.40 |
| GPT-OSS-120B | — | $0.15 / $0.60 |

Hosted open-weights now sit squarely inside the proprietary mid-tier price band — the lever that keeps the whole market's pricing honest, and the input to any [self-host decision](/guides/mlops/self-host-vs-api-llm).

## Reading the table like an engineer

Three structural facts matter more than any single cell. **Output dominates**: at 3–6x input everywhere — and with [reasoning](/glossary/reasoning-model) thinking-tokens billed as output — verbose responses and deep deliberation drive bills more than prompt size. **The discount stack is enormous**: [prompt-cache](/glossary/prompt-caching) reads at ~0.1x input plus [batch](/glossary/batch-inference) at 50% compose to ~95% off for cacheable offline work — engineering for the stack beats switching vendors. **Tiers beat brands**: every vendor offers frontier/workhorse/budget rungs; [matching the tier to the task](/guides/getting-started/choosing-the-right-model) and measuring **cost per completed task** (not per token) is where the money actually is — the full playbook is [LLM Cost and Latency Engineering](/guides/advanced/llm-cost-latency-engineering).
