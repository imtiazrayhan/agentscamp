---
name: "Mem0"
title: "Mem0"
description: "A memory layer for AI agents and apps — persistent, personalized long-term memory across sessions."
seoDescription: "Mem0 is an Apache-2.0 memory layer for AI agents: extract facts from conversations, store them per user, retrieve them later. Library, server or cloud."
url: "https://mem0.ai"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/mem0ai/mem0"
license: "Apache-2.0"
sameAs: ["https://github.com/mem0ai/mem0", "https://docs.mem0.ai"]
color: "purple"
topics: ["ai-agents-systems", "data-ml"]
audience: ["ai-engineers"]
tags: ["agents", "memory", "personalization", "vector-store", "open-source"]
featured: false
alternativeTo: ["zep", "letta"]
summary: "Mem0 gives agents long-term memory: an LLM extracts facts from conversations, Mem0 stores them per user, agent or session, and a search call returns the relevant ones on later turns. It ships as an Apache-2.0 library, a self-hosted server with a dashboard, and a managed platform with a free plan and custom contracts."
related: ["guide:agent-memory-architecture", "guide:best-vector-database-2026", "tool:langgraph", "agent:agent-tool-integration-engineer"]
faq:
  - q: "Is Mem0 free?"
    a: "The library and self-hosted server are free under Apache-2.0; you pay for the LLM and embedding calls they make. As of November 2026, the managed platform's pricing page lists a Free plan (10,000 adds and 1,000 retrievals a month for the first 30 days with model calls included, then 50,000 adds and 10,000 retrievals a month with your own LLM key) and a Custom plan with negotiated limits."
  - q: "What does Mem0 use by default?"
    a: "Per the Python quickstart, a bare Memory() uses OpenAI gpt-5-mini for fact extraction, OpenAI text-embedding-3-small embeddings (1536 dimensions), a Qdrant vector store with on-disk data at /tmp/qdrant, and a SQLite history file at ~/.mem0/history.db, with no reranker. Each part can be swapped in the config, including for Ollama or Anthropic models."
  - q: "How is Mem0 different from a vector database?"
    a: "A vector database stores whatever you embed. Mem0 sits above one and decides what to store: an LLM call turns a conversation into short factual memories, entities are linked across them, and search fuses semantic, BM25 keyword and entity matching. You still need a vector store underneath; Qdrant is the default."
  - q: "Are Mem0's benchmark scores for the open-source version?"
    a: "No. Mem0 reports 92.5 on LoCoMo and 94.4 on LongMemEval for the algorithm it released in April 2026, but its README says those scores reflect the managed platform, which includes proprietary optimizations not in the open-source SDK, and that open-source users should expect directionally similar gains, not identical numbers."
---

Mem0 ("mem-zero") is a memory layer for AI agents and LLM apps. Instead of replaying a whole conversation history into the context window on every turn, you hand Mem0 the messages; it uses an LLM to **extract the facts worth keeping**, stores them scoped to a user, agent or session, and returns the relevant ones when you search later. The company is Y Combinator S24, and the repository is Apache-2.0 with about 69,500 GitHub stars as of November 2026.

It suits assistants that should remember a person across sessions: support bots that recall past tickets, coding agents that keep project preferences, personal assistants. It is less useful when the "memory" you need is really document retrieval, which is [RAG](/guides/concepts/how-rag-works).

## Highlights

- **Three ways to run it.** A library (`pip install mem0ai` or `npm install mem0ai`) for prototyping, a self-hosted server started with `docker compose up` that adds a dashboard, auth and API keys, and the managed platform at app.mem0.ai.
- **Scoped memories.** Memories are stored at user, session and agent level, and a search is filtered by scope (for example `user_id`), so one user's facts are not returned for another.
- **ADD-only extraction.** The algorithm released in April 2026 makes one LLM call per add and only appends: memories accumulate and nothing is overwritten. Facts an agent states about its own actions are stored too.
- **Multi-signal retrieval.** Search scores semantic similarity, BM25 keyword match and entity match in parallel and fuses them, with time-aware ranking for questions about current versus past state. Hybrid search in the library needs the extra `pip install mem0ai[nlp]`.
- **Pluggable parts.** Swap the LLM, embedder and vector store in config. Docs cover integrations with LangGraph, CrewAI, LangChain and others.
- **CLI and agent skills.** `mem0 add` and `mem0 search` from a terminal (`npm install -g @mem0/cli`), plus installable skills that teach Claude Code, Codex or Cursor the SDK.

## In an AI-assisted workflow

The open-source library, as in the quickstart:

```python
# pip install mem0ai ; export OPENAI_API_KEY=...
from mem0 import Memory

m = Memory()

messages = [
    {"role": "user", "content": "I'm Alex. I use TypeScript and pnpm, never npm."},
    {"role": "assistant", "content": "Noted, TypeScript with pnpm."},
]
m.add(messages, user_id="alex")

# a later session
results = m.search("which package manager should I use?", filters={"user_id": "alex"})
for r in results["results"]:
    print(r["memory"], r["score"])
```

Put the returned memories into your system prompt, call your model, then `add` the new exchange. The managed platform uses the same shape through `MemoryClient(api_key=...)`.

Note the search signature: scope goes in `filters={"user_id": ...}`. Older tutorials pass `user_id=` straight to `search`, which predates the current SDK; the docs have a migration guide for the v2-to-v3 open-source change.

> [!TIP]
> Decide what deserves remembering before you wire this in. Storing every turn makes retrieval noisier and adds an LLM call per write. [Agent Memory Architecture](/guides/concepts/agent-memory-architecture) covers short-term versus long-term memory and where an extraction layer fits.

## Pricing

As of November 2026, Mem0's pricing page lists two plans for the managed platform. **Free** has unlimited end users; for the first 30 days it allows 10,000 adds and 1,000 retrievals a month with model calls paid by Mem0, and after that 50,000 adds and 10,000 retrievals a month using your own LLM key, with usage-based billing past the limits up to a monthly cap you set. **Custom** sets limits to your volume and adds graph memory (entity linking), user profiles, Dream (memory consolidation), advanced analytics, SSO, audit logs, an SLA and on-prem deployment. The page shows no dollar figures for overage or for Custom.

Self-hosting has no license fee, but every `add` costs an extraction call to your LLM plus embeddings, so write volume drives the bill.

## Good to know

**The defaults are for demos.** A bare `Memory()` writes Qdrant data to `/tmp/qdrant` and history to `~/.mem0/history.db`, and calls OpenAI. Configure a real vector store before production; [Best Vector Database in 2026](/guides/database/best-vector-database-2026) helps you choose one.

**Extraction is lossy and model-dependent.** What gets remembered depends on the extraction model's judgment. Test with your own conversations, and keep raw transcripts elsewhere if you need an audit trail.

**ADD-only means stale facts stay.** When a user changes a preference, the old memory is not deleted; retrieval relies on time-aware ranking to surface the current one. Check that behavior for facts that must not be wrong, such as addresses or permissions.

**Platform and library differ.** Graph memory, user profiles and consolidation are listed as Custom-plan features, the self-hosted server shows some advanced features only as "teasers", and the published benchmark numbers come from the platform.

**Memory is user data.** Stored facts are personal information, so plan for deletion requests and per-user scoping from the start. Stored memories are also text a model will read later, which makes them a [prompt-injection](/guides/ai-safety/defending-prompt-injection) surface if untrusted content can be written into them.

Versions as of November 2026: `mem0ai` 2.2.1 on PyPI and 3.3.1 on npm.

Against the alternatives: [Zep](/tools/zep) models memory as a temporal knowledge graph that tracks when facts were valid, which fits changing facts better than append-only storage. [Letta](/tools/letta) is a full agent server whose agents edit their own memory blocks, so it replaces your agent runtime where Mem0 plugs into one such as [LangGraph](/tools/langgraph). [Mem0 vs Zep vs Letta](/guides/comparisons/mem0-vs-zep-vs-letta) compares the three.
