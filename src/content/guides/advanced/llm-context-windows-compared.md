---
title: "LLM Context Windows Compared (2026)"
description: "Context windows and max output tokens across Claude, GPT, Gemini, DeepSeek, and Grok — the million-token era, what it costs, and what fits in practice."
author: "Imtiaz Rayhan"
date: 2026-07-01
freshness: "tier1"
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["llm-app-dev"]
tags: ["context-window", "models", "comparison", "data"]
featured: false
summary: "Verified November 27, 2026: Claude Fable 5.2, Opus 5.5, Sonnet 5.5 and Haiku 5.5, the GPT-6 line (1.05M), Gemini 4, and DeepSeek V4.1 Flash and V4 Pro all take about 1M tokens; Grok 4.7 takes 500K. Max output is 128K on Claude and GPT, 64K by default on Gemini (up to 1M with long decode on Gemini 4), and 384K on DeepSeek."
keyTakeaways:
  - "A million tokens is the baseline from budget to frontier: Claude Haiku 5.5 and GPT-6 Luna have the same window as their flagships. The exception is Grok, where 4.7, 4.6 and 4.5 are 500K and only Grok 4.3 is 1M."
  - "Long prompts are priced four different ways: flat on Claude Fable, Opus and Sonnet, on Gemini 4 and on DeepSeek; a higher rate above 100K on Claude Haiku 5.5; above 272K input on every GPT-6 model; and from 200K on Grok and Gemini 3.1 Pro."
  - "Max output per response: 128K on Claude and GPT, 384K on DeepSeek, 64K by default on Gemini with Gemini 4 long decode raising it to the full 1M window. xAI publishes no output cap for Grok."
  - "Rules of thumb: about 4 characters or 0.75 English words per token; a 500-page book is roughly 150–200K tokens; a mid-size codebase is 1–5M tokens, still bigger than any window."
  - "Fitting is not the same as using well: cost scales with tokens sent, latency with prefill, and accuracy drops as the window fills, so retrieval and context discipline outlive every window increase."
faq:
  - q: "Which LLM has the biggest context window in 2026?"
    a: "As of November 2026 the active lineups cluster at 1M tokens: Claude Fable 5.2, Opus 5.5, Sonnet 5.5 and Haiku 5.5; OpenAI's GPT-6 models at 1.05M; Gemini 4 and Gemini 3.8 Flash at 1,048,576; DeepSeek V4.1 Flash and V4 Pro; and Grok 4.3. Grok 4.7, xAI's current flagship, is 500K. The differences that matter are the long-prompt pricing thresholds and the output cap."
  - q: "How much fits in a million tokens?"
    a: "About 750,000 English words: several long novels, a year of meeting notes, or a substantial codebase (rule of thumb: ~1M tokens covers roughly 100k–200k lines of code with comments). What typically doesn't fit: enterprise document corpora and monorepos — which is why retrieval still exists."
  - q: "Does a bigger window replace RAG?"
    a: "It moved the threshold, not the conclusion. Under a few hundred pages of stable content, stuffing (plus prompt caching) beats building a pipeline. At corpus scale, four walls remain — per-query cost, prefill latency, mid-window attention degradation, and access control — covered honestly in our RAG vs Long Context guide."
  - q: "What is the maximum output of an LLM in one response?"
    a: "As of November 2026: 128K tokens on current Claude and GPT-6 models, 65,536 on Gemini by default, and 384K on DeepSeek V4.1 Flash and V4 Pro. Gemini 4 models can raise the cap to the full 1,048,576-token window with long decode, which generates in sequential hops. Thinking tokens count against the output cap on all of them."
related: ["glossary:context-window", "guide:llm-api-pricing-2026", "guide:rag-vs-long-context", "guide:context-engineering", "glossary:prompt-caching", "guide:claude-code-memory-context"]
audience: ["ai-engineers", "analysts"]
---

Specs verified against vendor docs on **November 27, 2026** (same methodology as the [pricing table](/guides/advanced/llm-api-pricing-2026): vendor pages only, and a cell says "not published" when the vendor gives no figure). The headline: **a million-token window is the default from budget models to flagships**, and the numbers that now separate vendors are the output cap and the prompt length at which the price changes.

## The table

| Model | Context window | Max output | Long-prompt pricing |
| --- | --- | --- | --- |
| Claude Fable 5.2 | 1M | 128K | Flat: standard rates across the full window |
| Claude Opus 5.5 | 1M | 128K | Flat |
| Claude Sonnet 5.5 | 1M | 128K | Flat |
| Claude Haiku 5.5 | 1M | 128K | Higher prices when the prompt is over 100K tokens |
| GPT-6.2 Astra / GPT-6.2 Sol | 1.05M | 128K | Over 272K input: 2x input and cache rates, 1.5x output, for the full request |
| GPT-6.1 Terra / GPT-6 Luna | 1.05M | 128K | Same 272K rule |
| GPT-5.6 Sol (older line) | 1.05M | 128K | Over 272K input: 2x input, 1.5x output, for the full request |
| Gemini 4 Carbon / Argon / Neon / Hydrogen | 1M (1,048,576, shared by input and output) | 64K default; up to 1M with long decode | Flat: no long-prompt tier listed |
| Gemini 3.8 Flash | 1M | 64K | Flat |
| Gemini 3.5 Flash-Lite | 1M | 64K | Flat |
| Gemini 3.1 Pro (preview as of November 2026) | 1M | 64K | Over 200K: 2x input, 1.5x output |
| DeepSeek V4.1 Flash / V4 Pro | 1M | 384K | Flat (prices vary by peak and off-peak hours instead) |
| Grok 4.7 / 4.6 / 4.5 | 500K | Not published | From 200K: long-context rates (2x) on all tokens in the request |
| Grok 4.3 | 1M | Not published | From 200K: long-context rates (2x) on all tokens |

"64K" on Gemini is exactly 65,536 tokens and "1M" is 1,048,576. Token rules of thumb for reading the table: ~4 characters ≈ 1 [token](/glossary/llm-token); ~0.75 English words per token; a dense 500-page book ≈ 150–200K tokens; codebases run ~5–10 tokens per line.

## How to read the output column

The output cap is per response, and thinking tokens spend from it. Anthropic's docs put it plainly: a single Messages API request to a 1M-window model "can generate up to 128k output tokens," and thinking tokens "are a subset of your `max_tokens` parameter." Google bills output "including thinking tokens" the same way. A [reasoning model](/glossary/reasoning-model) set to high effort can use a large share of the cap before it writes a word of the answer.

Three vendors, three different ceilings:

- **Claude and GPT-6: 128K.** Enough for a long report or a large multi-file diff in one call. Anything longer needs chunked generation.
- **DeepSeek: 384K.** The pricing page lists "MAX OUTPUT MAXIMUM: 384K" for both `deepseek-flash` and `deepseek-v4-pro`.
- **Gemini 4: 64K by default, 1M on request.** Long decode lets you raise `max_output_tokens` past 65,536 up to the unified 1,048,576-token window. Generation runs as sequential hops of up to 64K tokens each, so a very long answer is a background job you poll, not a single streamed reply. Gemini 3.x models stay at 65,536.

On every vendor the window is shared: input, thinking and output all count toward it. A 1M window does not mean 1M of input plus the output cap on top.

## Worked example: does this job fit?

Take a fictional team at Acme that wants one model call to review a 60,000-line service against a design doc.

| Item | Estimate |
| --- | --- |
| Code: 60,000 lines × ~8 tokens per line | 480,000 |
| Design doc: 12,000 words ÷ 0.75 | 16,000 |
| System prompt and tool definitions | 6,000 |
| Reserved for thinking and the answer | 32,000 |
| **Total** | **534,000** |

What the table says about that request:

- **Fits** in Claude, GPT-6, Gemini and DeepSeek 1M-class windows with room to spare.
- **Does not fit** Grok 4.7, 4.6 or 4.5 at 500K. Grok 4.3 takes it.
- **Crosses a price threshold** on GPT-6 (over 272K input, so the whole request bills at the long rate), on Grok 4.3 (from 200K), on Gemini 3.1 Pro (over 200K) and on Claude Haiku 5.5 (over 100K).
- **Stays at the standard rate** on Claude Fable 5.2, Opus 5.5 and Sonnet 5.5, on the Gemini 4 models, and on DeepSeek.

The threshold rules apply to the whole request, not only the tokens past the line. Trimming a 280K prompt to 270K on GPT-6 changes the rate on every token in it. The per-token prices themselves are in the [pricing guide](/guides/advanced/llm-api-pricing-2026).

## What the table doesn't say

**Capacity stopped being the constraint; three other things took its place.** *Cost*: you pay per token sent, so a full 1M-token prompt is real money on every call, softened by [prompt caching](/glossary/prompt-caching) only for stable prefixes. *Latency*: prefill scales with input, and whole-corpus prompts mean multi-second time-to-first-token. *Attention*: Anthropic's own context-window docs warn that "as token count grows, accuracy and recall degrade, a phenomenon known as context rot." A curated 10K context beats a noisy 1M one containing the same answer, which is the entire thesis of [context engineering](/guides/prompting/context-engineering).

**The practical playbook** follows directly: use big windows to retrieve *generously* rather than to skip retrieval ([RAG vs Long Context](/guides/concepts/rag-vs-long-context) draws the line), cache the stable prefix, keep prompts under the pricing threshold of the model you call, and treat window size as a budget ceiling, not a target. Agents operationalize the same idea with [compaction and memory](/guides/configuration/claude-code-memory-context): the window is working memory, files are the disk.
