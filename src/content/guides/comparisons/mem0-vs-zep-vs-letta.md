---
title: "Mem0 vs Zep vs Letta: Agent Memory Compared (2026)"
description: "Three philosophies of agent memory — Mem0's drop-in layer, Zep's temporal knowledge graphs, Letta's self-managing agents — and which fits your architecture."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["ai-agents-systems"]
tags: ["memory", "agents", "comparison", "mem0", "zep", "letta"]
featured: false
summary: "Pick by where memory should live. Mem0 is the drop-in layer: add/search APIs that extract and persist facts for any agent — easiest adoption. Zep is the structured platform: temporal knowledge graphs (open-source Graphiti underneath) tracking how facts change, built for enterprise context. Letta puts memory inside the agent itself — MemGPT-lineage self-editing memory."
keyTakeaways:
  - "Three architectures, not three vendors: a memory API you call (Mem0), a memory platform with graph structure (Zep/Graphiti), an agent runtime with memory built in (Letta)."
  - "Mem0 wins adoption cost: two calls (add, search) bolt persistent memory onto any existing agent without rearchitecting."
  - "Zep wins structured truth: bi-temporal graphs record when facts held, not just what's true — and its OSS story is Graphiti now (Zep CE was deprecated in April 2025)."
  - "Letta wins agent-managed memory: the agent edits its own memory blocks and decides what persists — but you adopt the runtime, not just an API."
  - "All three converge on the same insight: long-term memory is retrieval over curated storage; they differ on who curates and what shape the storage takes."
faq:
  - q: "Which agent memory tool should I start with?"
    a: "If you have a working agent and want it to remember users across sessions: Mem0 — minimal integration, immediate payoff. If memory quality over changing facts is the product (support, CRM-adjacent, compliance): Zep's temporal graphs justify their structure. If you're choosing an agent runtime anyway and memory-first design appeals: Letta. Adoption cost ascends in that order; architectural opinion ascends with it."
  - q: "What happened to open-source Zep?"
    a: "Zep Community Edition was deprecated in April 2025; the company's open-source effort moved to Graphiti, the temporal knowledge-graph engine (Apache-2.0, ~27k stars) that powers Zep Cloud. Self-hosters today run Graphiti plus a graph database — don't start anything new on Zep CE."
  - q: "Can I use these with Claude Code or other existing agents?"
    a: "Mem0 and Zep, yes — they're services any agent calls (both ship MCP-friendly integrations), complementing built-in mechanisms like Claude Code's CLAUDE.md and auto-memory. Letta is different: its memory is a property of Letta agents, so you use it BY using Letta (the API for your own apps, or Letta Code as the coding harness)."
related: ["tool:mem0", "tool:zep", "tool:letta", "glossary:agent-memory", "guide:agent-memory-architecture", "guide:claude-code-memory-context", "guide:graph-rag"]
---

Agent memory has three credible architectures in 2026, and the vendors map onto them almost too neatly: **a layer you call** (Mem0), **a platform that structures** (Zep), **a runtime that remembers** (Letta). The comparison is really about where you want memory to live.

## The short answer

- **Bolt memory onto an existing agent, minimal ceremony** → **[Mem0](/tools/mem0)**.
- **Structured, queryable truth over facts that change** — enterprise context, compliance-adjacent → **[Zep](/tools/zep)** (or self-hosted Graphiti).
- **Memory-first agents as the runtime itself** — including the Letta Code harness → **[Letta](/tools/letta)**.

## What each one is

**[Mem0](/tools/mem0)** is the drop-in: `add()` conversations, `search()` relevant memories at the next turn — extraction, dedup, and persistence handled behind the API. Its virtue is honest minimalism: any agent, any framework, two integration points, with managed and OSS paths. The trade: memory as a flat(ish) store of extracted facts — when *structure* over those facts matters, you hit the ceiling.

**[Zep](/tools/zep)** is the structured answer: conversations and business data become **temporal knowledge graphs** — entities, relationships, and facts carrying validity intervals, so "what's true now" and "what changed when" are both queryable. The engine, **Graphiti** (Apache-2.0, ~27k stars), is the open-source story since Zep CE's April 2025 deprecation; Zep Cloud scales it (vendor-claimed sub-200ms retrieval at 100M nodes) into an enterprise context layer. The trade: graph extraction costs (an LLM + graph DB self-hosted) and more architecture to mean it.

**[Letta](/tools/letta)** descends from MemGPT, the paper that framed memory as the *agent's own job*: self-editing memory blocks, archival search, persistence as a property of the agent rather than a service beside it. You adopt Letta as the runtime — the agents API for your products, or Letta Code (the 2026 flagship) as a coding harness whose memory of your repo compounds across sessions. The trade is exactly that adoption: it's not a layer for the agent you already have.

## Dimension by dimension

| | Mem0 | Zep | Letta |
| --- | --- | --- | --- |
| Shape | Memory API layer | Memory platform (graphs) | Agent runtime with memory |
| Integration | Two calls, any agent | SDK + episodes in | Build agents on it |
| Storage model | Extracted facts/vectors | Bi-temporal knowledge graph | Self-edited blocks + archival |
| Handles changing facts | Update-on-write | Natively (validity intervals) | Agent rewrites memory |
| OSS posture | OSS + managed | Graphiti (engine) OSS; CE deprecated | Apache-2.0 core |
| Best at | Adoption speed | Structured truth at scale | Agent-managed continuity |

## How to actually choose

Two questions settle most cases. **Do facts change in ways you must track?** "User upgraded plans twice, ask about the middle period" is graph-with-time territory — Zep's lane; ordinary preference/profile memory doesn't need it — Mem0's lane. **Are you choosing a runtime or augmenting one?** Existing agents argue for the layers; greenfield memory-first systems (or wanting Letta Code itself) argue for Letta. And keep the conceptual frame from [Agent Memory Architecture](/guides/concepts/agent-memory-architecture): every option here is retrieval over curated storage — the differences are who curates, and what shape the truth takes.
