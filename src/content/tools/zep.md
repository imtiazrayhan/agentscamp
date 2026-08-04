---
name: "Zep"
description: "Agent memory on temporal knowledge graphs — Zep Cloud for sub-200ms context retrieval at enterprise scale, with Graphiti as its open-source graph engine."
date: 2026-06-11
url: "https://www.getzep.com"
pricing: "freemium"
category: "platform"
repo: "https://github.com/getzep/graphiti"
license: "Apache-2.0"
os: ["Web"]
color: "blue"
topics: ["ai-agents-systems"]
tags: ["memory", "agents", "knowledge-graph", "graphiti"]
featured: false
alternativeTo: ["mem0", "letta"]
sameAs:
  - "https://github.com/getzep"
  - "https://x.com/zep_ai"
  - "https://arxiv.org/abs/2501.13956"
related: ["guide:mem0-vs-zep-vs-letta", "glossary:agent-memory", "tool:mem0", "tool:letta", "guide:graph-rag", "guide:agent-memory-architecture"]
summary: "Zep builds agent memory as temporal knowledge graphs: facts carry validity intervals, so the system tracks when things changed, not just what's true. Zep Cloud claims sub-200ms retrieval at 100M-node scale; Graphiti (~27k stars, Apache-2.0) is the open-source graph engine underneath — hybrid semantic+BM25+traversal retrieval with real-time incremental updates."
faq:
  - q: "What happened to open-source Zep?"
    a: "Deprecated, openly: in April 2025 Zep stopped maintaining Community Edition to concentrate open-source effort on Graphiti, the temporal knowledge-graph framework that powers the cloud product. The famous getzep/zep repo now hosts examples and integrations (legacy code in a folder). Don't start new projects on Zep CE — use Graphiti (self-host) or Zep Cloud."
  - q: "What makes Zep's memory 'temporal'?"
    a: "Facts get validity intervals. When a user's preference changes or a business fact is superseded, the graph records when each version held — so the agent can answer 'what's true now' and 'what was true then' instead of overwriting history. That bi-temporal design (detailed in their arXiv paper) is the architectural difference from extract-and-store memory layers."
  - q: "Can I self-host Zep?"
    a: "You self-host Graphiti: pip install graphiti-core, bring a graph database (Neo4j or FalkorDB) and an LLM for entity extraction, and you have the engine — hybrid retrieval, incremental updates, MCP integrations. Zep Cloud adds the managed platform: scale claims, the multi-graph 'Context Lake' over chat plus business data, observations, and enterprise posture (SOC 2, HIPAA, BYOC)."
---

Zep's thesis is that agent memory is a **graph problem with a time axis**: not "store facts" but "store facts that change," with validity intervals making both the current state and its history queryable. The architecture (published in a 2025 paper) became **Graphiti** — now a ~27k-star open-source project — with Zep Cloud as its managed, enterprise-scaled expression.

## Highlights

- **Temporal knowledge graphs** — entities, relationships, and facts with time bounds; memory that handles change instead of overwriting it.
- **Graphiti (the OSS core)** — Apache-2.0: hybrid retrieval (semantic + BM25 + graph traversal), real-time incremental updates, MCP integration; bring Neo4j/FalkorDB and an extraction LLM.
- **Cloud-scale claims** — sub-200ms retrieval regardless of graph size, 100M-node graphs, strong long-memory benchmark results with small context footprints (vendor-stated).
- **Context Lake** — governed, multi-graph context over chat history *and* business data: memory as an enterprise data layer, not a chat add-on.
- **Framework-agnostic SDKs** — Python, TypeScript, Go.

## In an AI-assisted workflow

```bash
pip install graphiti-core        # self-host: + Neo4j/FalkorDB + an LLM key
# or: Zep Cloud SDKs — episodes in, sub-second relevant context out
```

The pattern: conversations and events stream in as episodes; extraction builds the graph; at each turn the agent retrieves a compact, current context block instead of replaying history — [agent memory](/glossary/agent-memory) as retrieval over structured truth, cousin to [GraphRAG](/guides/concepts/graph-rag).

> [!WARNING]
> The deprecation trap is real: tutorials and stars pointing at `getzep/zep` describe a product that ended in April 2025. Evaluate Graphiti and Zep Cloud on their own terms — and budget for the extraction LLM and graph database Graphiti needs.

## Good to know

Cloud is freemium (monthly credits metering *ingestion bytes* — large payloads burn fast; retrieval is unmetered), with annual plans and enterprise BYOC above. Where the temporal-graph approach sits against [Mem0](/tools/mem0)'s extract-and-store layer and [Letta](/tools/letta)'s in-agent memory: [Mem0 vs Zep vs Letta](/guides/comparisons/mem0-vs-zep-vs-letta).
