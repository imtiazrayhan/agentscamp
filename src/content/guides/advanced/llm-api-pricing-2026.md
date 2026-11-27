---
title: "LLM API Pricing in 2026: Every Major Model Compared"
description: "Per-million-token prices for Claude, GPT, Gemini, DeepSeek, Mistral, and Grok — plus caching and batch discounts — verified against vendor pricing pages."
seoTitle: "LLM API Pricing 2026: Claude, GPT, Gemini, DeepSeek Per-Token Costs"
seoDescription: "Per-million-token input and output prices for Claude, GPT, Gemini, DeepSeek, Mistral, and Grok, plus caching and batch discounts, verified against vendor pages."
author: "Imtiaz Rayhan"
date: 2026-07-01
freshness: "tier1"
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["llm-app-dev", "devops-infra"]
tags: ["pricing", "llm-api", "costs", "comparison", "data"]
featured: true
summary: "Verified November 2026 from vendor pages. Flagships (in/out per MTok): Claude Fable 5.2 $8/$40, Opus 5.5 $4/$20, GPT-6.2 Astra $8–$10/$40–$50, Gemini 4 Argon $4/$20 from Dec 1. Workhorses: Sonnet 5.5 $2/$10, GPT-6.2 Sol $2/$10, Gemini 4 Hydrogen $1.50/$7.50, Flash $0.75/$3.75. Budget: Haiku 5.5 & GPT-6 Luna $0.10/$0.50. Caching ~90–95% off; batch 50%."
keyTakeaways:
  - "Three durable price tiers exist across every vendor: frontier ($4–10 in / $15–50 out), workhorse ($0.75–3 in / $3.75–15 out), and budget ($0.10–0.30 in / $0.40–2.50 out) — both frontier and budget rungs dropped sharply across the fall 2026 model refreshes."
  - "Output costs 3–6x input everywhere, and reasoning/thinking tokens bill as output — long-output and heavy-reasoning workloads dominate most bills."
  - "The discount stack is the real price list: prompt-cache reads run ~0.05–0.1x input across vendors, batch APIs take 50% off, and they compose — cached batch input can cost ~5% of list."
  - "Open-weights models (Mistral Large 4 at $0.70/$2.10, DeepSeek V4.1 Flash at $0.15/$0.60 off-peak, plus hosted Qwen/Kimi/GLM) undercut proprietary mid-tiers — at the cost of operating the integration yourself."
  - "Prices churn — this page is refreshed on a cadence (date stamped above), and every number here was verified against vendor pricing pages, never aggregators."
faq:
  - q: "What's the cheapest good LLM API in 2026?"
    a: "Depends on the floor you need. For high-volume mechanical work, Claude Haiku 5.5 ($0.10/$0.50 up to 100K tokens), GPT-6 Luna ($0.10/$0.50), Mistral Small 4 ($0.15/$0.60), and DeepSeek V4.1 Flash ($0.15/$0.60 off-peak) define the budget tier as of November 2026. For workhorse coding and agent loops, Claude Sonnet 5.5 ($2/$10), GPT-6.2 Sol ($2/$10), GPT-6.1 Terra ($1/$5), Gemini 4 Hydrogen ($1.50/$7.50), and Gemini 3.8/3.6 Flash ($0.75/$3.75 through December 31, 2026) deliver flagship-grade coding well below the old $3/$15 line."
  - q: "How do prompt caching and batch discounts actually combine?"
    a: "Multiplicatively, on most platforms. Example on Claude: batch halves list price, and cache reads are 0.025–0.1x input — Anthropic's batch+cache pricing means a cached input token in a batch job costs ~5% of the standard input rate. Structuring for cacheable prefixes and routing offline work to batch APIs are the two highest-ROI cost moves before touching model choice."
  - q: "Do 1M-token context windows cost extra?"
    a: "On Anthropic, no for the top models — Fable 5.2, Opus 5.5, and Sonnet 5.5 include the full 1M window at flat per-token pricing, while Haiku 5.5 steps from $0.10/$0.50 up to $0.50/$2.50 above 100K tokens. Others tier: OpenAI bills any GPT-6 request above 272K input tokens at 2x input and 1.5x output for the full request, Gemini 3.1 Pro doubles input beyond 200K (while Gemini 4 and Flash models price flat across 1M), and xAI charges 2x on Grok prompts of 200K+."
  - q: "Why do you only cite vendor pricing pages?"
    a: "Because third-party price aggregators drift stale within weeks and propagate each other's errors. Every figure on this page was checked against vendor pricing or docs pages on the date stamped above; anything we couldn't verify that way is omitted rather than guessed."
related: ["guide:llm-cost-latency-engineering", "guide:llm-context-windows-compared", "glossary:prompt-caching", "glossary:batch-inference", "guide:claude-vs-gpt-vs-gemini-coding", "guide:calling-any-model-gateways", "guide:litellm-vs-openrouter"]
audience: ["ai-engineers", "analysts"]
---

All prices are **USD per million [tokens](/glossary/llm-token), standard tier**, verified against vendor pricing pages on **November 25, 2026**. Prices change quickly; this page is maintained on a refresh cadence (the `Updated` date above is the source of truth), and numbers we couldn't verify against vendor docs are omitted rather than estimated.

## Anthropic (Claude)

| Model | Input | Output | Batch (in/out) | Context |
| --- | --- | --- | --- | --- |
| Claude Fable 5.2 (`claude-fable-5-2`) | $8.00 | $40.00 | $4.00 / $20.00 | 1M |
| Claude Opus 5.5 (`claude-opus-5-5`) | $4.00 | $20.00 | $2.00 / $10.00 | 1M |
| Claude Sonnet 5.5 (`claude-sonnet-5-5`) | $2.00 | $10.00 | $1.00 / $5.00 | 1M |
| Claude Haiku 5.5 (`claude-haiku-5-5`) | $0.10 (≤100K) / $0.50 (>100K) | $0.50 / $2.50 | $0.05 / $0.25 (≤100K) | 1M |

Anthropic's fall 2026 refresh cut both ends of the lineup: **Claude Fable 5.2** dropped from $10/$50 to **$8/$40**, **Opus 5.5** dropped from $5/$25 to **$4/$20**, **Sonnet 5.5** held the **$2/$10** workhorse line, and **Haiku 5.5** plunged from Haiku 4.5's $1/$5 down to **$0.10/$0.50** for prompts ≤100K tokens while expanding to a full 1M context window (prompts over 100K bill at $0.50/$2.50). Fable 5.2, Opus 5.5, and Sonnet 5.5 include the full 1M window at flat per-token pricing with no long-context surcharge. Prompt-cache reads run 2.5%–10% of base input depending on model, Message Batches take 50% off and **stack with caching**, and US-only inference carries a 1.1x multiplier.

## OpenAI (GPT)

| Model | Input | Cached input | Output | Batch | Context |
| --- | --- | --- | --- | --- | --- |
| GPT-6.2 Astra (`gpt-6.2-astra`) | $8.00–$10.00 | $0.40–$1.00 | $40.00–$50.00 | 50% off | 1.05M |
| GPT-6.2 Sol (`gpt-6.2-sol`) | $2.00 | $0.10 | $10.00 | 50% off | 1.05M |
| GPT-6.1 Terra (`gpt-6.1-terra`) | $1.00 | $0.05 | $5.00 | 50% off | 1.05M |
| GPT-6 Luna (`gpt-6-luna`) | $0.10 | $0.01 | $0.50 | 50% off | 1.05M |
| GPT-5.6 Terra (legacy) | $2.00 | $0.20 | $12.00 | 50% off | ~1M |
| GPT-5.4 / GPT-4.1 (legacy) | $2.00–$2.50 | $0.20–$0.25 | $8.00–$15.00 | 50% off | ~1M |

OpenAI's **GPT-6 generation** (Astra / Sol / Terra / Luna) replaced GPT-5.6 as the primary API lineup in October–November 2026 (GPT-5.6 Sol's $4/$20 promotional window expired November 21, 2026). All four GPT-6 tiers standardize on a **1.05M-token context window** and 128K max output, with **GPT-6.2 Sol** matching Claude Sonnet 5.5 at **$2/$10** and **GPT-6 Luna** matching Haiku 5.5 at **$0.10/$0.50**. Cached inputs discount to 5%–10% of standard input, Batch API takes 50% off (24-hour window), **Fast mode** trades higher multipliers for expedited throughput, and regional/FedRAMP data-residency endpoints add ~10%. The headline rates are not flat across the window: on every GPT-6 model, a request with more than 272K input tokens bills at 2x input and cache rates and 1.5x output for the full request.

## Google (Gemini API)

| Model | Input | Output | Batch | Context |
| --- | --- | --- | --- | --- |
| Gemini 4 Argon / Carbon | $2.00 through Nov 30, 2026; $4.00 from Dec 1 | $10.00 through Nov 30, 2026; $20.00 from Dec 1 | 50% off | 1M |
| Gemini 4 Neon | $3.00 | $15.00 | 50% off | 1M |
| Gemini 4 Hydrogen | $1.50 | $7.50 | 50% off | 1M |
| Gemini 3.1 Pro | $2.00 (≤200K) / $4.00 (>200K) | $12.00 / $18.00 | 50% off | 1M |
| Gemini 3.8 / 3.6 Flash | $0.75 through Dec 31, 2026; $1.50 from Jan 1, 2027 | $3.75 through Dec 31, 2026; $7.50 from Jan 1, 2027 | 50% off | 1M |
| Gemini Flash-Lite (3.5 / 3.1) | $0.10–$0.30 | $0.40–$2.50 | 50% off | 1M |

Google rolled out the **Gemini 4 family** (Argon/Carbon for flagship reasoning at $4/$20 from December 1, 2026, after a $2/$10 launch rate that ends November 30; Neon at $3/$15, and Hydrogen for agentic execution at a flat **$1.50/$7.50**) alongside **Gemini 3.8/3.6 Flash** ($0.75/$3.75 through December 31, 2026, doubling to $1.50/$7.50 on January 1, 2027) across a standardized **1M-token context window**. Remember three Gemini-specific billing rules: thinking/reasoning tokens bill at the **output** rate, **Gemini 3.1 Pro** still doubles input beyond 200K tokens (whereas Flash and Gemini 4 Hydrogen price flat across 1M), and Context Caching adds an hourly storage fee per million cached tokens. Google Search Grounding includes a monthly free allowance (5,000 requests) then bills ~$14 per 1,000 requests.

## DeepSeek, Mistral, xAI

| Model | Input | Output | Notes |
| --- | --- | --- | --- |
| DeepSeek V4.1 Flash | $0.30 peak / $0.15 off-peak | $1.20 / $0.60 | Cache hits $0.006 / $0.003; 1M context, 384K max output |
| DeepSeek V4 Pro | $1.32 peak / $0.66 off-peak | $3.96 / $1.98 | Cache hits $0.044 / $0.022; 1M context, 384K max output |
| Mistral Large 4 | $0.70 | $2.10 | Open weights released Oct 2026 (1.05T MoE / 52B active); batch 50% |
| Mistral Small 4 | $0.15 | $0.60 | Budget tier; 256K context |
| Codestral | $0.30 | $0.90 | Code completion specialist |
| Grok 4.7 / 4.6 (xAI) | $2.00 (<200K) / $4.00 (≥200K) | $6.00 / $12.00 | Cached input $0.50; 500K context; US-only +10% |
| Grok 4.3 (xAI) | $1.25 (<200K) / $2.50 (≥200K) | $2.50 / $5.00 | 1M context |

[DeepSeek](/tools/deepseek) continues running **peak/off-peak pricing** (off-peak is half of peak, covering 01:00–04:00 and 06:00–10:00 UTC on weekdays excluding Chinese public holidays), with **DeepSeek V4.1 Flash** cutting Flash rates down to $0.15/$0.60 off-peak ($0.30/$1.20 peak). **Mistral Large 4** ("Le Chonk") shipped open weights in late October 2026 under the Mistral Ecosystem Open-Weight License and lists on La Plateforme at **$0.70/$2.10**. xAI's current flagship **Grok 4.7** lists at **$2.00/$6.00**, the same as Grok 4.6, (cached input $0.50) with a 2x surcharge once a prompt crosses 200K tokens.

## Open-weights via hosts

Reference serverless prices on third-party inference hosts (Together AI / Fireworks, verified from our September 1 host snapshot; check host pricing pages for newly added Mistral Large 4 and DeepSeek V4.1 endpoints):

| Model | Together (in/out) | Fireworks (in/out) |
| --- | --- | --- |
| DeepSeek V4 Pro (0813) | $1.32 / $3.96 | $1.32 / $3.96 |
| Kimi K3 | $3.00 / $15.00 | $3.00 / $15.00 |
| Kimi K2.6 | — | $0.95 / $4.00 |
| Qwen 3.7 Plus | $0.32 / $1.28 | $0.40 / $1.60 |
| GLM-5.3 | $1.40 / $4.40 | $1.40 / $4.40 |
| GPT-OSS-120B | $0.15 / $0.60 | $0.15 / $0.60 |

Hosted open-weights now sit right alongside — and sometimes above — proprietary workhorses: Kimi K3 at $3/$15 costs more than Claude Sonnet 5.5 or GPT-6.2 Sol ($2/$10), while Mistral Large 4 ($0.70/$2.10) and DeepSeek V4.1 Flash ($0.15/$0.60 off-peak) keep intense downward pressure on the mid-tier. Those rates are the real benchmark for any [self-host decision](/guides/mlops/self-host-vs-api-llm).

## Reading the table like an engineer

Three structural facts matter more than any single cell. **Output dominates**: at 3–6x input everywhere — and with [reasoning](/glossary/reasoning-model) thinking-tokens billed as output — verbose responses and deep deliberation drive bills more than prompt size. **The discount stack is enormous**: [prompt-cache](/glossary/prompt-caching) reads at ~0.1x input plus [batch](/glossary/batch-inference) at 50% compose to ~95% off for cacheable offline work — engineering for the stack beats switching vendors. **Tiers beat brands**: every vendor offers frontier/workhorse/budget rungs; [matching the tier to the task](/guides/getting-started/choosing-the-right-model) and measuring **cost per completed task** (not per token) is where the money actually is — the full playbook is [LLM Cost and Latency Engineering](/guides/advanced/llm-cost-latency-engineering).

## Continue exploring

- [LLM Context Windows Compared (2026)](/guides/advanced/llm-context-windows-compared) — Context windows and max output tokens across Claude, GPT, Gemini, DeepSeek, and Grok — the million-token era, what it costs, and what fits in practice.
