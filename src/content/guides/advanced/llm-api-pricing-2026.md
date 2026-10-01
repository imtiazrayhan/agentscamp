---
title: "LLM API Pricing in 2026: Every Major Model Compared"
description: "Per-million-token prices for Claude, GPT, Gemini, DeepSeek, Mistral, and Grok — plus caching and batch discounts — verified against vendor pricing pages."
seoTitle: "LLM API Pricing 2026: Claude, GPT, Gemini, DeepSeek Per-Token Costs"
seoDescription: "Per-million-token input and output prices for Claude, GPT, Gemini, DeepSeek, Mistral, and Grok, plus caching and batch discounts, verified against vendor pages."
author: "Imtiaz Rayhan"
date: 2026-07-01
freshness: "tier1"
updated: 2026-10-01
reviewed: 2026-10-01
color: "green"
topics: ["llm-app-dev", "devops-infra"]
tags: ["pricing", "llm-api", "costs", "comparison", "data"]
featured: true
summary: "Verified October 1, 2026, from vendor pricing pages only. Flagships (in/out per MTok): Claude Fable 5.1 and GPT-6 Astra $10/$50, Opus 5.5 $4/$20, Gemini 3.1 Pro Preview $2/$12. Workhorses: Sonnet 5.5 and GPT-6.1 Sol $2/$10, Gemini 3.8 Flash $0.75/$3.75 (intro). DeepSeek cut Flash prices in September. Caching 90%+ off input; batch 50%."
keyTakeaways:
  - "Three durable price tiers exist across every vendor: frontier ($4–10 in / $20–50 out), workhorse ($0.75–3 in / $3.75–15 out), and budget ($0.10–1 in / $0.30–5 out) — match the tier to the task before comparing vendors. The workhorse rung got markedly cheaper this summer."
  - "Output costs 3–6x input everywhere, and reasoning/thinking tokens bill as output — long-output and heavy-reasoning workloads dominate most bills."
  - "The discount stack is the real price list: prompt-cache reads run 0.1x input or less across vendors, batch APIs take 50% off, and they compose — cached batch input can cost ~5% of list or less."
  - "Open-weights models via hosts (DeepSeek V4, Kimi, Qwen, GLM on Together/Fireworks) undercut proprietary mid-tiers — at the cost of operating the integration yourself."
  - "Prices churn — this page is refreshed on a cadence (date stamped above), and every number here was read from a vendor pricing page, never aggregators."
faq:
  - q: "What's the cheapest good LLM API in 2026?"
    a: "Depends on the floor you need. For mechanical work, GPT-6 Luna ($0.10/$0.50), Mistral Small 4 ($0.15/$0.60), GPT-5.4-nano ($0.20/$1.25), and Gemini 3.5 Flash-Lite ($0.30/$2.50) define the budget tier; Claude Haiku 4.5 ($1/$5) is the premium-budget pick. For workhorse coding/agent use, Sonnet 5.5 ($2/$10), GPT-6.1 Sol ($2/$10), and Gemini 3.8 Flash ($0.75/$3.75 introductory) now sit well under the old $3/$15 line — capability per dollar there is task-dependent: benchmark on your work."
  - q: "How do prompt caching and batch discounts actually combine?"
    a: "Multiplicatively, on most platforms. Example on Claude: batch halves list price, and cache reads are 0.1x input on most models (lower still on Fable 5.1 and Opus 5.5) — Anthropic's batch+cache pricing means a cached input token in a batch job costs ~5% of the standard input rate or less. Structuring for cacheable prefixes and routing offline work to batch APIs are the two highest-ROI cost moves before touching model choice."
  - q: "Do 1M-token context windows cost extra?"
    a: "On Anthropic, no — Fable 5.1, Opus 5.5, and Sonnet 5.5 include the full 1M window at standard per-token pricing (a 900k-token request bills at the same rate as a 9k one). The others tier: OpenAI bills GPT-6 and GPT-5.6/5.5/5.4 prompts above 272K input tokens at 2x input and 1.5x output, Gemini 3.1 Pro doubles input beyond 200K, and xAI charges double on Grok prompts of 200K+. Either way you pay for the tokens you send — big windows make big bills possible, not free."
  - q: "Why do you only cite vendor pricing pages?"
    a: "Because third-party price aggregators drift stale within weeks and propagate each other's errors. Every figure on this page was fetched from the provider's own pricing or docs page on the date stamped above; anything we couldn't verify that way is omitted rather than guessed."
related: ["guide:llm-cost-latency-engineering", "guide:llm-context-windows-compared", "glossary:prompt-caching", "glossary:batch-inference", "guide:claude-vs-gpt-vs-gemini-coding", "guide:calling-any-model-gateways", "guide:litellm-vs-openrouter"]
audience: ["ai-engineers", "analysts"]
---

All prices are **USD per million [tokens](/glossary/llm-token), standard tier**, read directly from vendor pricing pages on **October 1, 2026**. Prices change; this page is maintained on a refresh cadence (the `Updated` date above is the source of truth), and numbers we couldn't verify on a vendor page are omitted, not estimated.

## Anthropic (Claude)

| Model | Input | Output | Cache read | Batch (in/out) | Context |
| --- | --- | --- | --- | --- | --- |
| Claude Fable 5.1 | $10.00 | $50.00 | $0.25 | $5.00 / $25.00 | 1M |
| Claude Opus 5.5 | $4.00 | $20.00 | $0.20 | $2.00 / $10.00 | 1M |
| Claude Sonnet 5.5 | $2.00 | $10.00 | $0.20 | $1.00 / $5.00 | 1M |
| Claude Haiku 4.5 | $1.00 | $5.00 | $0.10 | $0.50 / $2.50 | 200K |

Cache writes cost 1.25x input (5-minute TTL) or 2x (1-hour); cache reads are 0.1x input on most models, 0.05x on Opus 5.5 and 0.025x on Fable 5.1. Batch is 50% off and **stacks with caching**. Notably, the 1M-context models include the full window at standard per-token pricing — no long-context surcharge. September replaced the top of the lineup: **Claude Fable 5.1** (September 1, 2026) kept Fable 5's $10/$50 and cut cache reads to $0.25; **Claude Opus 5.5** (September 22) launched at $4/$20, below Opus 5's $5/$25; and **Claude Sonnet 5.5** (September 28) holds the $2/$10 that became Sonnet 5's permanent list price on August 10. Fable 5, Opus 5, Opus 4.8, and Sonnet 5 remain available as legacy models at unchanged prices. Sonnet 4.5 was deprecated on September 30, with API retirement scheduled for November 30, 2026. A first-party **fast mode** (research preview) bills Opus 5.5 at $8/$40 and Opus 5 and 4.8 at $10/$50.

## OpenAI (GPT)

| Model | Input | Cached input | Output | Batch | Context |
| --- | --- | --- | --- | --- | --- |
| GPT-6 Astra | $10.00 | $1.00 | $50.00 | 50% off | ~1M |
| GPT-6.1 Sol | $2.00 | $0.10 | $10.00 | 50% off | ~1M |
| GPT-6 Luna | $0.10 | $0.01 | $0.50 | 50% off | ~1M |
| GPT-5.6 Sol | $4.00 (promo through Nov 21, 2026) | $0.40 | $20.00 | 50% off | ~1M |
| GPT-5.6 Terra | $2.00 | $0.20 | $12.00 | 50% off | ~1M |
| GPT-5.6 Luna | $0.20 | $0.02 | $1.20 | 50% off | ~1M |
| GPT-5.5 | $5.00 | $0.50 | $30.00 | 50% off | ~1M |
| GPT-5.5-pro | $30.00 | — | $180.00 | 50% off | ~1M |
| GPT-5.4 | $2.50 | $0.25 | $15.00 | 50% off | ~1M |
| GPT-5.4-mini | $0.75 | $0.075 | $4.50 | 50% off | 400K |
| GPT-5.4-nano | $0.20 | $0.02 | $1.25 | 50% off | 400K |

The **GPT-6 line** is OpenAI's newest: GPT-6 Astra (September 3, 2026) at the top, GPT-6 Sol and Luna (September 22), and GPT-6.1 Sol (September 29), which supersedes GPT-6 Sol at the same $2/$10 with cheaper cached input. The **GPT-5.6 family** (Sol / Terra / Luna, released July 9, 2026) stays listed after two cuts (July 30 and August 21); 5.6 Sol's $4/$20 is promotional pricing guaranteed at least through November 21, 2026. Cached input is 0.1x across most of the lineup (0.05x on GPT-6.1 Sol; the pro models have no cache discount), and GPT-6 and GPT-5.6 bill Anthropic-style cache *writes* at 1.25x input. Flex tier matches batch pricing; the Priority tier was renamed **Fast mode** on July 30 — 2x standard on GPT-6, GPT-5.6, and GPT-5.4, 2.5x on GPT-5.5 by the table — and GPT-6 Astra adds an **Ultrafast** tier at $60/$300. One caveat the headline windows hide: on GPT-6, the 5.6 family, GPT-5.5, 5.4, and the pro models, prompts above 272K input tokens bill at 2x input / 1.5x output for the whole request. The pro tiers ($30/$180) remain the premium-reasoning outliers of the whole market.

## Google (Gemini API)

| Model | Input | Output | Cache read | Batch | Context |
| --- | --- | --- | --- | --- | --- |
| Gemini 3.1 Pro Preview | $2.00 (≤200K) / $4.00 (>200K) | $12.00 / $18.00 | $0.20 / $0.40 | 50% off | ~1M |
| Gemini 3.8 Flash | $0.75 (intro; $1.50 from Jan 1, 2027) | $3.75 (intro; $7.50 from Jan 1, 2027) | $0.075 (intro; $0.15 from Jan 1, 2027) | 50% off | ~1M |
| Gemini 3.7 Flash | $0.75 (intro; $1.50 from Jan 1, 2027) | $3.75 (intro; $7.50 from Jan 1, 2027) | $0.075 (intro; $0.15 from Jan 1, 2027) | 50% off | ~1M |
| Gemini 3.5 Flash | $1.50 | $9.00 (incl. thinking) | $0.15 | 50% off | ~1M |
| Gemini 3.5 Flash-Lite | $0.30 | $2.50 | $0.03 | 50% off | ~1M |
| Gemini 3.1 Flash-Lite | $0.25 | $1.50 | $0.025 | 50% off | ~1M |

Google tiers long context: the Pro model's input price doubles (output 1.5x) beyond 200K of context, and cache storage bills separately per MTok-hour. The news is at the Flash end — **Gemini 3.6 Flash** (GA July 21), **Gemini 3.7 Flash** (GA August 13), and **Gemini 3.8 Flash** (GA September 2) all launched at an introductory $0.75/$3.75 that runs through December 31, 2026 before reverting to $1.50/$7.50, undercutting the still-listed 3.5 Flash. Gemini 3.5 Flash-Lite (GA July 21) is the designated replacement for 3.1 Flash-Lite, which has a May 7, 2027 shutdown date.

## DeepSeek, Mistral, xAI

| Model | Input | Output | Notes |
| --- | --- | --- | --- |
| DeepSeek V4.1 Flash | $0.30 peak / $0.15 off-peak | $1.20 / $0.60 | Cache hits $0.006 / $0.003; 1M context, 384K max output |
| DeepSeek V4 Pro | $1.32 peak / $0.66 off-peak | $3.96 / $1.98 | Cache hits $0.044 / $0.022; 1M context, 384K max output |
| Mistral Medium 3.5 | $1.50 | $7.50 | Open weights (Modified MIT); batch 50% |
| Mistral Large 3 | $0.50 | $1.50 | Open-weights flagship (not a typo: priced below Medium 3.5) |
| Mistral Small 4 | $0.15 | $0.60 | Budget tier; 256K context |
| Grok 4.7 (xAI) | $2.00 (<200K) / $4.00 (≥200K) | $6.00 / $12.00 | Newest flagship (September 21, 2026); 500K context; Grok 4.6 is priced the same |
| Grok 4.3 (xAI) | $1.25 (<200K) / $2.50 (≥200K) | $2.50 / $5.00 | 1M context |

DeepSeek has moved twice since July. **Peak/off-peak pricing** took effect August 16, 2026 — off-peak rates are half of peak, with peak defined as 01:00–04:00 and 06:00–10:00 UTC on weekdays — and list prices rose with it. Then on September 10 DeepSeek released **V4.1 Flash**, retired V4 Flash (the old model name still works and is served by V4.1 Flash), and cut the Flash rates to the ones above. Off-peak Flash still sits *inside* the Western budget band rather than under it; the 1M window and 384K max output survive, and the legacy `deepseek-chat`/`deepseek-reasoner` aliases (slated for retirement July 24, 2026) no longer appear in DeepSeek's model list. V4 Pro is on notice: the September 10 announcement said it would be phased out on September 14 until a V4.1 Pro launches, but DeepSeek's changelog then said V4 Pro stays available with billing unchanged, and it is still on the pricing page at the rates above. xAI bills like Google: a prompt that reaches 200K tokens pays the higher rate on every token in the request. **Grok 4.7** (September 21, 2026) took over as xAI's flagship at Grok 4.6's price and 500K window.

## Open-weights via hosts

Reference serverless prices (host pricing, not vendor MSRP), October 1, 2026 — Together AI / Fireworks:

| Model | Together (in/out) | Fireworks (in/out) |
| --- | --- | --- |
| DeepSeek V4 Pro (0813) | $1.32 / $3.96 | — |
| DeepSeek V4.1 Flash | $0.30 / $1.20 | $0.30 / $1.20 |
| Kimi K3 | $3.00 / $15.00 | $3.00 / $15.00 |
| Qwen 3.8 Max | $2.00 / $6.00 | $2.00 / $6.00 |
| GLM-5.3 | $1.40 / $4.40 | $1.40 / $4.40 |
| GPT-OSS-120B | $0.15 / $0.60 | $0.15 / $0.60 |

Hosted open-weights sit squarely inside the proprietary mid-tier price band — and the newest ones reach its ceiling: Kimi K3 at $3/$15 is priced above Claude Sonnet 5.5's $2/$10 list on both hosts, so open weights no longer guarantee a discount. That band is still the lever that keeps the whole market's pricing honest, and the input to any [self-host decision](/guides/mlops/self-host-vs-api-llm).

## Reading the table like an engineer

Three structural facts matter more than any single cell. **Output dominates**: at 3–6x input everywhere — and with [reasoning](/glossary/reasoning-model) thinking-tokens billed as output — verbose responses and deep deliberation drive bills more than prompt size. **The discount stack is enormous**: [prompt-cache](/glossary/prompt-caching) reads at ~0.1x input plus [batch](/glossary/batch-inference) at 50% compose to ~95% off for cacheable offline work — engineering for the stack beats switching vendors. **Tiers beat brands**: every vendor offers frontier/workhorse/budget rungs; [matching the tier to the task](/guides/getting-started/choosing-the-right-model) and measuring **cost per completed task** (not per token) is where the money actually is — the full playbook is [LLM Cost and Latency Engineering](/guides/advanced/llm-cost-latency-engineering).

## Continue exploring

- [LLM Context Windows Compared (2026)](/guides/advanced/llm-context-windows-compared) — Context windows and max output tokens across Claude, GPT, Gemini, DeepSeek, and Grok — the million-token era, what it costs, and what fits in practice.
