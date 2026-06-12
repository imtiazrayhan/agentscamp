---
name: "Letta"
description: "Stateful agents from the MemGPT creators — an Apache-2.0 server with self-editing memory, and Letta Code, the memory-first model-agnostic coding harness."
date: 2026-06-11
url: "https://www.letta.com"
pricing: "freemium"
category: "platform"
repo: "https://github.com/letta-ai/letta"
license: "Apache-2.0"
os: ["Web", "macOS", "Windows", "Linux"]
color: "pink"
topics: ["ai-agents-systems"]
tags: ["memory", "agents", "memgpt", "stateful", "coding-agents"]
featured: false
alternativeTo: ["mem0", "zep"]
sameAs:
  - "https://github.com/letta-ai"
  - "https://x.com/letta_ai"
related: ["mem0-vs-zep-vs-letta", "agent-memory", "mem0", "zep", "claude-code-vs-opencode", "agent-memory-architecture"]
summary: "Letta (formerly MemGPT, Apache-2.0, ~23k stars) builds agents that manage their own memory — self-editing memory blocks, conversation search, persistence beyond any context window — exposed as an agents server/API with Python/TS SDKs and a visual Agent Development Environment. Its March 2026 pivot made Letta Code the flagship: a memory-first, model-agnostic coding harness."
faq:
  - q: "How does Letta's memory differ from Mem0 or Zep?"
    a: "Locus of control. Mem0 and Zep are memory layers a separate agent calls; Letta's MemGPT lineage puts memory inside the agent — the agent itself edits its core memory blocks, searches its history, and decides what to persist, like an OS managing its own paging. You adopt Letta as the agent runtime, not as a memory API bolted onto one."
  - q: "What is Letta Code?"
    a: "The flagship since late 2025: a coding-agent harness where memory is the point — /init analyzes the codebase into memory, /remember captures reflections, and skills accumulate from experience, with the same agent portable across Claude, GPT, Gemini, and open models. Letta cites it as the top model-agnostic open-source harness on Terminal-Bench."
  - q: "Is Letta open source?"
    a: "The core is — letta (the server/API) and letta-code are Apache-2.0; the old cpacker/MemGPT repo redirects there. The hosted side is freemium: a free tier with a few managed agents (BYO keys), and a Pro plan metered through 'Letta Auto' usage with pay-as-you-go overage."
---

Letta carries the most cited lineage in agent memory: it *is* MemGPT — the Berkeley project that framed an agent's context as an OS problem (paging, self-editing memory, persistence) — grown into a company. In 2026 its center of gravity shifted from platform to **harness**: Letta Code, a coding agent whose differentiator is that it genuinely remembers.

## Highlights

- **Self-editing memory** — agents maintain core memory blocks (persona, user, task state) they rewrite themselves, plus searchable archival history: the MemGPT design, productionized.
- **Stateful by default** — agents persist across sessions and beyond context limits; state lives server-side, not in the transcript.
- **Letta Code** — the memory-first coding harness: `/init` builds codebase memory, `/remember` captures lessons, skills accrue from experience; model-agnostic across Claude/GPT/Gemini and open models, with vendor-cited top OSS-harness results on Terminal-Bench.
- **Agent Development Environment** — a visual builder/debugger where you watch and edit an agent's memory and state directly.
- **Apache-2.0 core** — server and harness open; Python/TypeScript SDKs for embedding stateful agents in your own products.

## In an AI-assisted workflow

```bash
npm install -g @letta-ai/letta-code && letta    # the harness
# or embed: pip install letta-client — stateful agents via the Letta API
```

The distinctive loop: run it on a repo for a week and the agent's memory of *your* codebase — conventions, gotchas, past decisions — compounds, the dimension where [stateless harnesses](/guides/comparisons/claude-code-vs-opencode) start fresh each session.

> [!NOTE]
> The March 2026 pivot retired chunks of the older platform (server-side tools, templates, filesystem abstractions) in favor of the Letta Code direction — pre-2026 tutorials are partially stale, and pricing is now framed around the harness. Heavy daily coding can exceed the Pro quota into pay-as-you-go; BYO keys on the free tier sidesteps metering.

## Good to know

~23k stars on the core (the homepage's old MemGPT counter undersells it), $10M Felicis-led seed at the 2024 rename. Against the memory-layer alternatives — [Mem0](/tools/mem0)'s drop-in API, [Zep](/tools/zep)'s temporal graphs — the trade is adopt-the-runtime versus add-the-layer: [Mem0 vs Zep vs Letta](/guides/comparisons/mem0-vs-zep-vs-letta) draws it out.
