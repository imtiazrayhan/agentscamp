---
name: "Zep"
description: "Agent memory built on temporal knowledge graphs: Zep Cloud is the managed context service, and Graphiti is the open-source graph engine underneath it."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://www.getzep.com"
pricing: "freemium"
category: "platform"
repo: "https://github.com/getzep/graphiti"
license: "Apache-2.0"
os: ["Web"]
color: "blue"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["memory", "agents", "knowledge-graph", "graphiti"]
featured: false
alternativeTo: ["mem0", "letta"]
sameAs:
  - "https://github.com/getzep"
  - "https://x.com/zep_ai"
  - "https://arxiv.org/abs/2501.13956"
related: ["guide:mem0-vs-zep-vs-letta", "glossary:agent-memory", "tool:mem0", "tool:letta", "guide:graph-rag", "guide:agent-memory-architecture"]
summary: "Zep gives agents memory as a temporal knowledge graph: facts carry validity intervals, so it tracks when something changed as well as what is true now. Zep Cloud is the managed service, billed in credits per ingested Episode with a free tier. Graphiti, its Apache-2.0 graph engine, is what you self-host."
faq:
  - q: "What happened to open-source Zep?"
    a: "Zep ended it. On April 2, 2025 the company announced it would stop maintaining and releasing Zep Community Edition to put its open-source effort into Graphiti. The getzep/zep repository now holds examples and integrations for Zep Cloud, and its README says it is not Zep's product. For new work, use Graphiti to self-host or Zep Cloud."
  - q: "How much does Zep Cloud cost?"
    a: "As of November 2026, the Free plan gives 10,000 credits a month with no rollover; Flex is $125 a month with 50,000 credits, then $25 per 10,000; and Flex Plus is $375 a month with 200,000 credits, then $75 per 40,000. Enterprise is custom. One Episode of up to 350 bytes costs 1 credit, and each further 350 bytes costs another."
  - q: "What makes Zep's memory temporal?"
    a: "Facts get validity intervals. When a preference changes or a business fact is superseded, the graph records when each version held and invalidates the old one instead of overwriting it, so an agent can answer both what is true now and what was true then. Graphiti's README calls this explicit bi-temporal tracking with automatic fact invalidation."
  - q: "Can I self-host Zep?"
    a: "You self-host Graphiti, not Zep. Install graphiti-core, bring a graph database (Neo4j, FalkorDB, Amazon Neptune or the embedded Relate backend) and an LLM for extraction, and build users, threads and ingestion yourself. Zep itself runs in your own VPC only on the Enterprise plan's Bring Your Own Cloud option."
---

Zep treats agent memory as a **graph problem with a time axis**. Instead of storing facts, it stores facts that change, each with a validity interval, so both the current state and its history can be queried. The company ships that idea two ways: **Zep Cloud**, a managed service that ingests chat messages and business data and returns an assembled context block, and **Graphiti**, the open-source framework that builds the graphs. The architecture is described in a [2025 paper](https://arxiv.org/abs/2501.13956).

## Highlights

- **Temporal knowledge graphs.** Entities, relationships and facts carry time bounds. Superseded facts are invalidated and kept, so memory handles change instead of overwriting it.
- **Episodes in, Context Block out.** You send messages or any text or JSON as Episodes. `thread.get_context()` returns a Context Block that Zep assembles with semantic search, full-text search and graph search, using the four most recent messages as the query.
- **Graphiti, the open-source core.** Apache-2.0, about 33,000 GitHub stars as of November 2026. It combines semantic embeddings, BM25 and graph traversal, updates graphs incrementally, and ships a reference MCP server.
- **Context Lake.** Zep's name for governed context graphs over business data as well as chat, shared across an organization's agents.
- **Agent Skills.** A newer product that turns your agents' completed tasks into skills they follow. Zep's pricing page lists it as free on every plan until January 4, 2027.
- **SDKs.** Python (`zep-cloud`), TypeScript (`@getzep/zep-cloud`) and Go (`zep-go`), plus a Context MCP Server with a seat count per plan.

## In an AI-assisted workflow

Zep Cloud, condensed from the quickstart in Zep's docs:

```bash
pip install --upgrade zep-cloud
export ZEP_API_KEY="<your key>"
```

```python
import os
from datetime import datetime, timezone
from zep_cloud import AddMessage
from zep_cloud.client import Zep

client = Zep(api_key=os.environ.get("ZEP_API_KEY"))

user = client.user.create(
    email="jane.smith@example.com", first_name="Jane", last_name="Smith"
)
thread = client.thread.create(user_uuid=user.uuid_)

client.thread.add_messages(thread.uuid_, messages=[
    AddMessage(
        reference_time=datetime.now(timezone.utc).isoformat(),
        name="Jane Smith",
        role="user",
        content="Who was Octavia Butler?",
    )
])

context_block = client.thread.get_context(thread.uuid_).context
```

Store the user and thread UUIDs beside your own IDs, add each incoming message, fetch the Context Block before the model call, then add the assistant's reply. The agent gets a compact, current view of the user instead of a replayed transcript. See [agent memory](/glossary/agent-memory) for the concept and [GraphRAG](/guides/concepts/graph-rag) for the related retrieval pattern.

To self-host the engine instead, `pip install graphiti-core` and point it at Neo4j, FalkorDB, Amazon Neptune or the embedded Relate backend. Graphiti defaults to OpenAI for extraction and embeddings and also supports Anthropic, Gemini and Groq.

> [!WARNING]
> A Context Block can contain text that came from end users or documents. Zep's own docs say to keep it out of system and developer messages and pass it as ordinary user input or a tool result, so that injected text does not gain instruction priority.

## Pricing

Zep Cloud meters ingestion, not retrieval. As of November 2026, from Zep's pricing page, an Episode of up to 350 bytes uses 1 credit and each additional 350 bytes (or part) uses another, so a 1,200-byte Episode uses 4 credits. Retrieval, storage, threads and users use none.

As of November 2026, the Free plan includes 10,000 credits a month with no rollover, 2 projects and variable rate limits. Flex, as of November 2026, is $125 a month with 50,000 credits, 600 requests a minute and 5 projects, and extra credits cost $25 per 10,000. Flex Plus, as of November 2026, is $375 a month with 200,000 credits and 1,000 requests a minute, at $75 per 40,000 extra, and adds webhooks, custom extraction instructions and analytics. Enterprise is custom-priced and is the only plan whose feature list includes SOC 2 Type II, a HIPAA BAA, SSO and SCIM, audit logs, your own encryption keys, and deployment in your VPC.

Graphiti is free, but you pay for the graph database and for the LLM calls that extract entities from every Episode.

## Good to know

Byte-based credits make payload size the cost driver. Chat turns are cheap; large JSON documents or transcripts sent as single Episodes are not, so trim them before ingestion. Paid plans top up automatically when the balance falls below 20%, which keeps the service running and also means a runaway ingestion job bills you.

The "sub-200ms retrieval at scale" figure is Zep's own claim, from the Graphiti README's comparison table, and applies to Zep Cloud. Graphiti's performance depends on your database and setup. Graphiti also sets its ingestion concurrency low by default (`SEMAPHORE_LIMIT` of 10) to avoid LLM rate-limit errors, so bulk backfills are slow until you raise it.

The old-repo trap is still live: tutorials and star counts that point at `getzep/zep` describe the Community Edition that ended in April 2025.

Among the alternatives, [Mem0](/tools/mem0) is an extract-and-store memory layer that is simpler to add, [Letta](/tools/letta) keeps memory inside the agent runtime and lets the agent edit it, and Zep is the pick when facts change over time and you need the history. [Mem0 vs Zep vs Letta](/guides/comparisons/mem0-vs-zep-vs-letta) compares the three, and [Agent Memory Architecture](/guides/concepts/agent-memory-architecture) covers the design choices.
