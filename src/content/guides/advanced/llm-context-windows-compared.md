---
title: "LLM Context Windows Compared (2026)"
description: "Context windows and max output tokens across Claude, GPT, Gemini, DeepSeek, and Grok — the million-token era, what it costs, and what fits in practice."
author: "Imtiaz Rayhan"
date: 2026-07-01
freshness: "tier1"
updated: 2026-11-25
reviewed: 2026-11-25
color: "green"
topics: ["llm-app-dev"]
tags: ["context-window", "models", "comparison", "data"]
featured: false
summary: "Verified November 25, 2026: a million tokens is now standard from budget to frontier — Claude Fable 5.2, Opus 5.5, Sonnet 5.5, and Haiku 5.5 (1M), GPT-6.2/6.1/6 (1.05M), Gemini 4 and 3.8/3.7 Flash (1M), DeepSeek V4.1/V4 (1M), Grok 4.3 (1M; Grok 4.6 is 500K). Max output sits at 65K–384K. Capacity is rarely the constraint — cost, latency, and attention are."
keyTakeaways:
  - "A million tokens is now the cross-tier baseline — even budget models like Claude Haiku 5.5 and GPT-6 Luna reached 1M+ windows in fall 2026 alongside Anthropic, OpenAI, Google, and DeepSeek flagships (Grok 4.6 remains 500K)."
  - "Pricing models still diverge sharply: Anthropic prices Fable 5.2/Opus 5.5/Sonnet 5.5 flat across 1M (Haiku 5.5 tiers above 100K); Gemini 4 Hydrogen and Flash price flat across 1M while Gemini 3.1 Pro and xAI double rates beyond 200K; legacy OpenAI GPT-5.x tiers above 272K."
  - "Max output is the forgotten limit: 65K–128K typical (DeepSeek claims up to 384K) — long generation, not long reading, is where jobs still hit walls."
  - "Rules of thumb: ~4 characters or ~0.75 English words per token; a 500-page book ≈ 150–200K tokens; a mid-size codebase ≈ 1–5M tokens — still bigger than any window."
  - "Fitting ≠ using well: cost scales with tokens sent, latency with prefill, and mid-window attention measurably lags — retrieval and context discipline outlive every window increase."
faq:
  - q: "Which LLM has the biggest context window in 2026?"
    a: "As of November 2026, the entire active frontier — Claude Fable 5.2 / Opus 5.5 / Sonnet 5.5 / Haiku 5.5, OpenAI's GPT-6 lineup (1.05M), Google's Gemini 4 and 3.8/3.7 Flash, DeepSeek V4.1/V4, and Grok 4.3 — clusters at 1M tokens (Grok 4.6 steps back to 500K). Differentiation moved from headline size to quality-at-depth (how well the model uses token 800,000) and long-context pricing cliffs."
  - q: "How much fits in a million tokens?"
    a: "About 750,000 English words: several long novels, a year of meeting notes, or a substantial codebase (rule of thumb: ~1M tokens covers roughly 100k–200k lines of code with comments). What typically doesn't fit: enterprise document corpora and monorepos — which is why retrieval still exists."
  - q: "Does a bigger window replace RAG?"
    a: "It moved the threshold, not the conclusion. Under a few hundred pages of stable content, stuffing (plus prompt caching) beats building a pipeline. At corpus scale, four walls remain — per-query cost, prefill latency, mid-window attention degradation, and access control — covered honestly in our RAG vs Long Context guide."
related: ["glossary:context-window", "guide:llm-api-pricing-2026", "guide:rag-vs-long-context", "guide:context-engineering", "glossary:prompt-caching", "guide:claude-code-memory-context"]
audience: ["ai-engineers", "analysts"]
---

Specs verified against vendor docs on **November 25, 2026** (same methodology as the [pricing table](/guides/advanced/llm-api-pricing-2026): vendor pages only, unverifiable cells omitted). The headline: **the million-token window moved from frontier perk to default baseline across even budget models** — and stopped being the interesting number.

## The table

| Model | Context window | Max output | Long-context pricing |
| --- | --- | --- | --- |
| Claude Fable 5.2 | 1M | 128K | Flat standard rates across full window |
| Claude Opus 5.5 | 1M | 128K | Flat standard rates across full window |
| Claude Sonnet 5.5 | 1M | 128K | Flat standard rates across full window |
| Claude Haiku 5.5 | 1M | 128K | Standard ≤100K; higher tier above 100K |
| GPT-6.2 Astra / Sol | 1.05M | 128K | Standard across window (check legacy 5.x for >272K 2x cliff) |
| GPT-6.1 Terra / GPT-6 Luna | 1.05M | 128K | Standard across window |
| GPT-5.6 / 5.4 (legacy) | ~1.05M | 128K | 2x input / 1.5x output above 272K input |
| Gemini 4 Argon / Carbon / Neon | 1M | 65K+ | Standard per-tier rate |
| Gemini 4 Hydrogen | 1M | 65K+ | Flat across full window |
| Gemini 3.1 Pro | 1M | 65K | ~2x input beyond 200K |
| Gemini 3.8 / 3.7 Flash & Flash-Lite | 1M | 65K | Flat across full window |
| DeepSeek V4.1 Flash / V4 Pro | 1M | 384K | Flat across window (peak/off-peak schedule; cache pricing separate) |
| Grok 4.6 | 500K | — (no stated limit) | 2x per-token at ≥200K prompts |
| Grok 4.3 | 1M | — | 2x per-token at ≥200K prompts |

Token rules of thumb for reading it: ~4 characters ≈ 1 [token](/glossary/llm-token); ~0.75 English words per token; a dense 500-page book ≈ 150–200K tokens; codebases run ~5–10 tokens per line.

## What the table doesn't say

**Capacity stopped being the constraint; three other things took its place.** *Cost*: you pay per token sent — a full 1M-token prompt is real money on every call, softened by [prompt caching](/glossary/prompt-caching) only for stable prefixes (and note the pricing-shape difference: Anthropic's flat-rate window vs OpenAI's >272K and Google's and xAI's >200K tiering). *Latency*: prefill scales with input; whole-corpus prompts mean multi-second time-to-first-token. *Attention*: needle-in-haystack benchmarks are near-perfect, but synthesis across a packed window still measurably favors the start and end — a curated 10K context beats a noisy 1M one containing the same answer, which is the entire thesis of [context engineering](/guides/prompting/context-engineering).

**Max output is the sleeper limit.** Reading got huge; writing didn't keep pace — 64–128K output caps mean "translate this book" or "generate the full report" still needs chunked generation, and [reasoning](/glossary/reasoning-model) thinking-tokens spend from the same output budget.

**The practical playbook** follows directly: use big windows to retrieve *generously* rather than to skip retrieval ([RAG vs Long Context](/guides/concepts/rag-vs-long-context) draws the line), cache the stable prefix, and treat window size as budget ceiling — not target. Agents operationalize the same idea with [compaction and memory](/guides/configuration/claude-code-memory-context): the window is working memory, files are the disk.
