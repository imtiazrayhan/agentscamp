---
term: "Context Window"
description: "The context window is the maximum text — measured in tokens — an LLM can consider at once: prompt, conversation, documents, and its own output combined."
date: 2026-06-11
topics: ["llm-app-dev"]
tags: ["context", "tokens", "llm", "limits"]
related: ["glossary:llm-token", "glossary:context-engineering", "guide:claude-code-memory-context", "glossary:prompt-caching", "glossary:rag"]
faq:
  - q: "What happens when the context window fills up?"
    a: "Nothing more fits — so something must go. Applications truncate old turns, summarize them (Claude Code's /compact), or retrieve selectively instead of loading everything (RAG). Quality usually degrades before the hard limit: models weight the start and end of a long window more than the middle, so buried facts get missed."
  - q: "Bigger context windows keep shipping — does context management still matter?"
    a: "Yes. A million-token window changes what's possible (whole codebases, long documents) but not the economics or attention physics: you pay per token processed, latency grows with input size, and signal still competes with noise. A focused window reliably beats a stuffed one — capacity is budget, not license."
---

**The context window is the maximum number of [tokens](/glossary/llm-token) a language model can process in one request — everything counts against it: the system prompt, conversation history, retrieved documents, tool results, and the response being generated.**

It's the defining resource constraint of LLM applications. Frontier models grew from 4K tokens (2023) to 200K as standard with million-token windows on recent Claude models — yet the window stays a *budget*, for three durable reasons: cost scales with tokens processed, latency grows with input length, and attention dilutes — models recall the start and end of long contexts better than the middle, so the right answer buried under noise often goes unused.

That's why the craft of [context engineering](/guides/prompting/context-engineering) — load the relevant slice, not the repo — outlives every window-size increase, why [RAG](/glossary/rag) retrieves rather than stuffs, and why agents like Claude Code ship [compaction and memory machinery](/guides/configuration/claude-code-memory-context) to keep long sessions sharp.
