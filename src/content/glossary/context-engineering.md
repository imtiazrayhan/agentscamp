---
term: "Context Engineering"
description: "Context engineering is the discipline of curating exactly what enters an LLM's context window so it has the right information and nothing else."
date: 2026-06-17
topics: ["workflow-prompting"]
tags: ["context", "prompting", "agents", "retrieval"]
related: ["context-window", "rag", "llm-token", "extended-thinking"]
faq:
  - q: "How is context engineering different from prompt engineering?"
    a: "Prompt engineering focuses on wording a single instruction well. Context engineering is broader: it's about deciding everything that goes into the window — instructions, retrieved data, tool outputs, and conversation history — and what to leave out. As applications became multi-step agents, what's in context started to matter more than how the prompt is phrased, so context engineering supersedes prompt engineering for agentic work."
  - q: "Why not just put everything in the context window?"
    a: "Because more context isn't better context. Every token costs money and latency, and models attend less reliably to information buried in long inputs, so relevant facts get lost amid noise. Loading only the right slice — through retrieval, summarization, and selective tool results — reliably beats stuffing the window full."
---

**Context engineering is the practice of deliberately curating what goes into an LLM's [context window](/glossary/context-window) — instructions, retrieved data, tool results, and history — so the model has exactly the information it needs and nothing extraneous.**

It has become the central discipline for building agents, largely superseding "prompt engineering" as the unit of work. A long-running agent's context is assembled dynamically across many turns: system instructions, results from [RAG](/glossary/rag) retrieval, outputs from tools, and prior conversation. Deciding what to include, what to summarize, and what to drop is what separates a reliable agent from one that drifts or stalls.

It matters because context is a budget, not a free pile: every [token](/glossary/llm-token) costs latency and money, and model attention dilutes over long inputs so buried facts go unused. The practical craft is loading the relevant slice rather than everything — retrieving instead of dumping, compacting old turns, and trimming tool output to the essentials. The tradeoff is engineering effort: good context assembly takes work, but a focused window consistently outperforms a stuffed one. For the full discipline, see the [context engineering guide](/guides/prompting/context-engineering).
