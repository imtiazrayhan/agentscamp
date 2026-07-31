---
name: "Mem0"
title: "Mem0"
description: "A memory layer for AI agents and apps — persistent, personalized long-term memory across sessions."
seoDescription: "Mem0 is a memory layer for AI agents and apps — persistent, personalized long-term memory that carries across sessions. Features, pricing, alternatives."
url: "https://mem0.ai"
date: 2026-06-03
pricing: "open-source"
category: "sdk"
repo: "https://github.com/mem0ai/mem0"
license: "Apache-2.0"
sameAs: ["https://github.com/mem0ai/mem0", "https://docs.mem0.ai"]
color: "purple"
topics: ["ai-agents-systems", "data-ml"]
tags: ["agents", "memory", "personalization", "vector-store", "open-source"]
featured: false
alternativeTo: ["zep", "letta"]
summary: "Mem0 adds a persistent memory layer to agents and LLM apps: it extracts, stores, and retrieves salient facts across sessions so an assistant remembers a user's preferences and history instead of starting cold each conversation. Open-source library plus a managed platform."
related: ["agent-memory-architecture", "best-vector-database-2026", "langgraph", "agent-tool-integration-engineer"]
faq:
  - q: "What is Mem0?"
    a: "Mem0 is a memory layer for AI agents and LLM applications. Instead of cramming entire conversation histories into the context window, it extracts the salient facts, stores them, and retrieves the relevant ones when needed — so an agent remembers a user's preferences, decisions, and history across sessions while keeping prompts lean."
  - q: "Is Mem0 free?"
    a: "The library is open source under Apache-2.0 and free to self-host; a managed platform with a free tier is also available. Mem0 sits on top of a vector store and an LLM provider, so you bring (and pay for) those underneath it."
  - q: "How is Mem0 different from a vector database?"
    a: "Mem0 isn't a database — it's the layer above one. It decides what's worth remembering via automatic extraction from conversations, embeds and stores memories in a pluggable vector backend, and retrieves the ones relevant to the current turn, scoped per user, agent, or session."
---

Mem0 is a memory layer for AI agents and LLM applications. Instead of cramming an entire conversation history into the context window every turn, Mem0 **extracts the salient facts**, stores them, and retrieves the relevant ones when needed — so an agent remembers a user's preferences, decisions, and history across sessions while keeping prompts lean.

It is aimed at developers building assistants and agents that should feel continuous rather than amnesiac. Mem0 sits between your app and your LLM, managing what's worth remembering and surfacing it at the right moment.

## Highlights

- **Long-term memory** — persist facts across sessions, scoped per user, agent, or session.
- **Automatic extraction** — distills conversations into memories rather than storing raw transcripts.
- **Smart retrieval** — fetches the memories relevant to the current turn, keeping context small.
- **Pluggable backends** — works with common vector stores and LLM providers.
- **Open-source + managed** — self-host the library or use the hosted platform.

## In an AI-assisted workflow

```python
from mem0 import Memory
m = Memory()
m.add("Prefers TypeScript and pnpm", user_id="alex")
# later turn:
context = m.search("what stack does the user like?", user_id="alex")
```

> [!TIP]
> Memory is an architecture decision, not just a library call — decide what's worth remembering and for how long. See [Agent Memory Architecture](/guides/concepts/agent-memory-architecture) for short- vs. long-term memory patterns and where Mem0 fits.

## Good to know

Mem0 is open source (Apache-2.0) and free to self-host; a managed platform with a free tier is also available. It sits **on top of a vector store** and an LLM provider — it extracts and embeds memories, then retrieves them — so you bring (and pay for) a vector database underneath it; see [Best Vector Database in 2026](/guides/database/best-vector-database-2026) for choosing one. Pairs naturally with agent frameworks like [LangGraph](/tools/langgraph).
