---
title: "LLM Context Windows Compared (2026)"
description: "Context windows and max output tokens across Claude, GPT, Gemini, DeepSeek, and Grok — the million-token era, what it costs, and what fits in practice."
author: "AgentsCamp"
date: 2026-07-01
color: "green"
topics: ["llm-app-dev"]
tags: ["context-window", "models", "comparison", "data"]
featured: false
summary: "The frontier standardized on a million tokens in 2026: Claude Fable 5, Opus 4.8, and Sonnet 5 (1M, at standard pricing), GPT-5.5 and 5.4 (1M), Gemini's lineup (~1M), DeepSeek V4 and Grok 4.3 (1M). Budget tiers trail: Haiku 4.5 at 200K, GPT-5.4 mini/nano at 400K. Max outputs range 64K–384K. Capacity is now rarely the constraint — cost, latency, and attention quality are."
keyTakeaways:
  - "A million tokens is the 2026 frontier baseline — roughly 750k words, several large codebases — across Anthropic, OpenAI, Google, DeepSeek, and xAI flagships."
  - "Pricing models differ: Anthropic includes 1M at flat per-token rates; Google roughly doubles Pro per-token pricing beyond 200K. Same capacity, different bill shapes."
  - "Max output is the forgotten limit: 64K–128K typical (DeepSeek claims up to 384K) — long generation, not long reading, is where jobs still hit walls."
  - "Rules of thumb: ~4 characters or ~0.75 English words per token; a 500-page book ≈ 150–200K tokens; a mid-size codebase ≈ 1–5M tokens — still bigger than any window."
  - "Fitting ≠ using well: cost scales with tokens sent, latency with prefill, and mid-window attention measurably lags — retrieval and context discipline outlive every window increase."
faq:
  - q: "Which LLM has the biggest context window in 2026?"
    a: "The frontier clusters at 1M tokens — Claude's Fable 5/Opus 4.8/Sonnet 5, GPT-5.5/5.4, Gemini's current lineup, DeepSeek V4, and Grok 4.3 all claim it. Differentiation moved from headline size to quality-at-depth (how well the model uses token 800,000) and to pricing shape across the window."
  - q: "How much fits in a million tokens?"
    a: "About 750,000 English words: several long novels, a year of meeting notes, or a substantial codebase (rule of thumb: ~1M tokens covers roughly 100k–200k lines of code with comments). What typically doesn't fit: enterprise document corpora and monorepos — which is why retrieval still exists."
  - q: "Does a bigger window replace RAG?"
    a: "It moved the threshold, not the conclusion. Under a few hundred pages of stable content, stuffing (plus prompt caching) beats building a pipeline. At corpus scale, four walls remain — per-query cost, prefill latency, mid-window attention degradation, and access control — covered honestly in our RAG vs Long Context guide."
related: ["context-window", "llm-api-pricing-2026", "rag-vs-long-context", "context-engineering", "prompt-caching", "claude-code-memory-context"]
---

Specs verified against vendor docs on **July 1, 2026** (same methodology as the [pricing table](/guides/advanced/llm-api-pricing-2026): vendor pages only, unverifiable cells omitted). The headline: **the million-token window became the frontier baseline** — and stopped being the interesting number.

## The table

| Model | Context window | Max output | Long-context pricing |
| --- | --- | --- | --- |
| Claude Fable 5 | 1M | 128K | Standard rates across full window |
| Claude Opus 4.8 | 1M | 128K | Standard rates across full window |
| Claude Sonnet 5 | 1M | 128K | Standard rates across full window |
| Claude Haiku 4.5 | 200K | 64K | — |
| GPT-5.5 | 1M | 128K | Standard |
| GPT-5.5-pro | ~1.05M | 128K | Standard (premium model) |
| GPT-5.4 | 1M | 128K | Standard |
| GPT-5.4-mini / nano | 400K | 128K | Standard |
| Gemini 3.1 Pro Preview | ~1.05M | 65K | ~2x per-token beyond 200K |
| Gemini 3.5 Flash / Flash-Lite | ~1.05M | 65K | Flat |
| DeepSeek V4 (Flash/Pro) | 1M | up to 384K | Flat (cache pricing separate) |
| Grok 4.3 | 1M | — | — |

Token rules of thumb for reading it: ~4 characters ≈ 1 [token](/glossary/llm-token); ~0.75 English words per token; a dense 500-page book ≈ 150–200K tokens; codebases run ~5–10 tokens per line.

## What the table doesn't say

**Capacity stopped being the constraint; three other things took its place.** *Cost*: you pay per token sent — a full 1M-token prompt is real money on every call, softened by [prompt caching](/glossary/prompt-caching) only for stable prefixes (and note the pricing-shape difference: Anthropic's flat-rate window vs Google's >200K tiering). *Latency*: prefill scales with input; whole-corpus prompts mean multi-second time-to-first-token. *Attention*: needle-in-haystack benchmarks are near-perfect, but synthesis across a packed window still measurably favors the start and end — a curated 10K context beats a noisy 1M one containing the same answer, which is the entire thesis of [context engineering](/guides/prompting/context-engineering).

**Max output is the sleeper limit.** Reading got huge; writing didn't keep pace — 64–128K output caps mean "translate this book" or "generate the full report" still needs chunked generation, and [reasoning](/glossary/reasoning-model) thinking-tokens spend from the same output budget.

**The practical playbook** follows directly: use big windows to retrieve *generously* rather than to skip retrieval ([RAG vs Long Context](/guides/concepts/rag-vs-long-context) draws the line), cache the stable prefix, and treat window size as budget ceiling — not target. Agents operationalize the same idea with [compaction and memory](/guides/configuration/claude-code-memory-context): the window is working memory, files are the disk.
