---
title: "Mem0 vs Zep vs Letta: Agent Memory Compared (2026)"
description: "Mem0 vs Zep vs Letta: a memory API, a temporal context graph, and an agent that owns its memory. Integration code, hosting, and licences for each."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["ai-agents-systems"]
audience: ["developers"]
tags: ["memory", "agents", "comparison", "mem0", "zep", "letta"]
featured: false
summary: "Mem0 is a memory API: call add() and search() from the agent you already have. Zep builds a temporal graph per user and returns a context block of facts with validity dates; its open-source engine is Graphiti. Letta is not a layer at all: you adopt its agent harness, and the agent edits its own git-versioned memory files."
keyTakeaways:
  - "Mem0 is the smallest integration: add() extracts facts from messages and search() returns them ranked; it ships as a Python or JS library, a self-hosted server, and a managed platform."
  - "Zep stores each user's history as a temporal graph and returns a context block whose facts carry valid-from and valid-to dates, so it can answer what was true at a given time."
  - "Zep the product is cloud or bring-your-own-cloud only. The self-hostable part is Graphiti (Apache-2.0), which needs your own graph database and an LLM for extraction."
  - "Letta changed shape in 2026: the old Python API server is retired, and Letta is now the Letta Code harness plus a TypeScript Agent SDK. Memory lives in MemFS, a git repository the agent edits."
  - "The choice follows from one question: are you adding memory to an agent you have (Mem0, Zep), or choosing the agent runtime itself (Letta)?"
faq:
  - q: "Which agent memory tool should I start with?"
    a: "If you have a working agent and want it to remember users across sessions, start with Mem0: two calls and no schema. Move to Zep when answers depend on how facts changed over time or on business data beyond chat. Consider Letta only if you are also choosing the agent runtime, because its memory cannot be attached to an agent built elsewhere."
  - q: "What happened to open-source Zep?"
    a: "Zep announced on April 2, 2025 that it would stop maintaining Zep Community Edition and focus its open-source work on Graphiti, the temporal graph framework underneath Zep. The getzep/zep repository now holds examples and integrations for Zep Cloud, not a server. To self-host, run Graphiti with Neo4j, FalkorDB, or Amazon Neptune and build the user, thread, and retrieval layers yourself."
  - q: "Is the Letta Python SDK still the way to build on Letta?"
    a: "No. As of November 2026 the letta-ai/letta repository describes its server as the retired Letta V1 API server, kept on an archive branch, and points to letta-ai/letta-code as the current source. New applications use the Letta Agent SDK, a TypeScript package (@letta-ai/letta-agent-sdk) that wraps the Letta Code harness."
  - q: "Can I use these with Claude Code or another existing agent?"
    a: "Mem0 and Zep, yes: both are services any agent can call, and both offer MCP servers so a coding agent can save and look up memories as tools. They sit alongside built-in mechanisms such as Claude Code's CLAUDE.md files. Letta is different. Its memory belongs to Letta agents, so you use it by running Letta Code or building on its Agent SDK."
related: ["tool:mem0", "tool:zep", "tool:letta", "glossary:agent-memory", "guide:agent-memory-architecture", "guide:claude-code-memory-context", "guide:graph-rag"]
sources:
  - title: "Mem0 Platform quickstart"
    url: "https://docs.mem0.ai/platform/quickstart"
    publisher: "Mem0"
  - title: "mem0 repository and README"
    url: "https://github.com/mem0ai/mem0"
    publisher: "Mem0"
  - title: "Zep agent memory quickstart"
    url: "https://help.getzep.com/quick-start-guide"
    publisher: "Zep"
  - title: "Graphiti repository and README"
    url: "https://github.com/getzep/graphiti"
    publisher: "Zep"
  - title: "Announcing a new direction for Zep's open source strategy"
    url: "https://blog.getzep.com/announcing-a-new-direction-for-zeps-open-source-strategy/"
    publisher: "Zep"
  - title: "Letta Agent SDK overview"
    url: "https://docs.letta.com/agent-sdk"
    publisher: "Letta"
  - title: "letta-code repository and README"
    url: "https://github.com/letta-ai/letta-code"
    publisher: "Letta"
---

Mem0, Zep, and Letta are three different answers to where an agent's long-term memory should live: in **a store you call** (Mem0), in **a graph that tracks time** (Zep), or in **the agent itself** (Letta). They are less interchangeable than a three-way comparison suggests, and two of them have changed shape since early 2025.

## The short answer

- **Add memory to an agent you already have, with the least code** → **[Mem0](/tools/mem0)**.
- **You need to know when a fact was true, or to mix chat with business data** → **[Zep](/tools/zep)**, or self-hosted Graphiti if it must run on your infrastructure.
- **You want an agent that manages its own memory and you are willing to adopt its runtime** → **[Letta](/tools/letta)**.

## The facts side by side

Versions, stars, and plan structures were checked on November 27, 2026.

| | Mem0 | Zep | Letta |
| --- | --- | --- | --- |
| What you integrate | A memory API | A context service with a graph behind it | An agent harness and SDK |
| Open-source part | `mem0ai/mem0`, Apache-2.0 | Graphiti (`getzep/graphiti`), Apache-2.0; the Zep service itself is not open source | `letta-ai/letta-code`, Apache-2.0 |
| GitHub stars (November 2026) | about 69,500 | Graphiti about 33,100 | `letta` about 25,600, `letta-code` about 3,900 |
| SDKs | Python (`mem0ai` 2.2.1), JS/TS (`mem0ai` 3.3.1), CLI | Python (`zep-cloud` 4.2.0), TypeScript, Go | TypeScript (`@letta-ai/letta-agent-sdk`), plus the `letta` CLI |
| Storage model | Extracted facts in a vector store (Qdrant by default in the library) | Temporal graph per user: entities, edges, facts with validity ranges | MemFS: Markdown files in a git repository owned by the agent |
| Who writes memory | Mem0's extraction step, on `add()` | Zep's ingestion, from messages and business data | The agent, with file tools; background "dreaming" consolidates |
| How facts change | New facts are added or update old ones | Old facts are invalidated with an end date, not deleted | The agent rewrites its files; git keeps history |
| Self-hosting | Library, or a Docker Compose server | Graphiti only; Zep offers cloud, BYOK, and BYOC | Local backend or self-hosted App Server, no account needed |
| Managed pricing model | Free tier with monthly add and retrieval limits; custom plans above | Credit-based: you pay per episode ingested, retrieval is unmetered | Free plan (bring your own keys) and a monthly plan with usage credits |

## Mem0: two calls

```bash
pip install mem0ai
```

```python
from mem0 import MemoryClient

client = MemoryClient(api_key="your-api-key")

client.add(
    [
        {"role": "user", "content": "I'm a vegetarian and allergic to nuts."},
        {"role": "assistant", "content": "Got it, I'll remember that."},
    ],
    user_id="user123",
)

results = client.search(
    "What are my dietary restrictions?",
    filters={"user_id": "user123"},
)
```

`add()` does not store the transcript. It runs an extraction step and stores individual facts ("Is a vegetarian", "Allergic to nuts"). `search()` returns those facts with a relevance score, and you paste them into your prompt. Memories are scoped by `user_id`, and optionally `agent_id`, `app_id`, and `run_id`.

The same package runs without the platform: `from mem0 import Memory; m = Memory()` gives you a local instance that, by default, uses an OpenAI model for extraction, OpenAI embeddings, an on-disk Qdrant store, and SQLite for history. Every one of those is swappable in config.

**What you get beyond that.** A self-hosted server (`docker compose up`), a CLI, and an MCP server so an agent can decide for itself when to save and look up. On the managed platform, graph memory (entity linking), user profiles, and memory consolidation are listed as custom-plan features, not part of the free tier.

**Vendor benchmark, clearly labeled.** Mem0's README reports 92.5 on LoCoMo and 94.4 on LongMemEval for its current algorithm, at roughly one second median latency and about 7,000 tokens per query. The same README notes these scores come from the managed platform, which includes optimizations not in the open-source SDK. The evaluation harness is public, so you can run it on your own data.

**Where it loses.** Memory is a set of facts, not a model of how they relate or when they held. "What plan was this customer on in March?" is not a question a fact list answers well.

## Zep: a context block with dates

```bash
pip install zep-cloud
```

```python
import os
from datetime import datetime, timezone

from zep_cloud import AddMessage
from zep_cloud.client import Zep

client = Zep(api_key=os.environ["ZEP_API_KEY"])

user = client.user.create(
    email="jane.smith@example.com", first_name="Jane", last_name="Smith"
)
thread = client.thread.create(user_uuid=user.uuid_)

client.thread.add_messages(
    thread.uuid_,
    messages=[
        AddMessage(
            reference_time=datetime.now(timezone.utc).isoformat(),
            name="Jane Smith",
            role="user",
            content="I moved from the Starter plan to Pro last week.",
        )
    ],
)

context = client.thread.get_context(thread.uuid_).context
```

Zep's model has more nouns than Mem0's: users, threads, and a graph per user. Messages go into a thread; non-chat data (a purchase event, a CRM update) goes in through `client.graph.episode.add(...)`. What comes back from `get_context` is a ready-to-inject text block: a user summary followed by facts, each with a date range such as `(2024-07-30 - 2024-08-30)` or `(2024-11-14 - present)`. That date range is the point. When a fact is superseded, Zep closes its validity interval instead of overwriting it.

**Open source means Graphiti.** Zep ended support for its Community Edition in April 2025. What you can self-host today is Graphiti, the temporal graph framework Zep is built on. It needs a graph database (Neo4j, FalkorDB, Amazon Neptune, or the embedded Relate backend) and an LLM for extraction, defaulting to OpenAI and working best with providers that support structured output. Users, threads, the context block, and governance are Zep features you would rebuild.

**Vendor performance claim.** Graphiti's README describes Zep's retrieval as "sub-200ms performance at scale". That is the vendor's figure for its managed service, not an independent benchmark.

**Positioning shift.** Zep now describes itself as an enterprise context layer, with a Context Lake for business data and an Agent Skills product alongside agent memory. If you only want chat memory, you are buying a larger platform than you need.

**Where it loses.** More setup and more concepts than Mem0, no self-hosted version of the product, and ingestion is the metered part, so high-volume message streams cost in proportion to bytes sent.

## Letta: the agent owns its memory

```bash
npm install @letta-ai/letta-agent-sdk
```

```typescript
import { LettaAgentClient } from "@letta-ai/letta-agent-sdk";

const client = new LettaAgentClient({ backend: "cloud" });

// Create the agent once and store its ID.
const agentId = await client.createAgent({
  persona: "You are Nora, a research analyst who tracks our competitors.",
  human: "The user prefers short summaries with links.",
});

// Resume the same agent later, from any process or machine.
await using session = client.resumeSession(agentId);

await session.send("What changed since last week?");
for await (const message of session.stream()) {
  if (message.type === "assistant") process.stdout.write(message.content);
}
```

There is no `add()` or `search()` here, and that is the design. Letta descends from the MemGPT paper, which treated memory management as the agent's own job. In the current product the agent's memory is **MemFS**: a git repository of Markdown files that belongs to the agent. Files at the root (such as `persona.md` and `human.md`) are loaded into the system prompt every turn; directories with their own `MEMORY.md` index stay out of context until the agent reads them. The agent edits these files with ordinary file tools, and a background process Letta calls dreaming reviews recent conversations and consolidates what it learned.

**The 2026 change you need to know about.** Letta used to be a Python server with a REST API for stateful agents. The `letta-ai/letta` README now calls that the retired Letta V1 API server, kept on an archive branch, and names `letta-ai/letta-code` as the current source. Letta today is the Letta Code harness (a CLI, a web app at chat.letta.com, and messaging channels) and the Agent SDK, which wraps that harness for your own TypeScript application. Tutorials that use `letta-client` in Python describe the previous product.

**Running it.** Install the harness with `npm install -g @letta-ai/letta-code` and run `letta`. Letta Cloud is the default backend; `letta backend local` or the self-hosted App Server (`letta server`) keeps everything on your machines without an account.

**Where it loses.** You cannot bolt it onto a LangGraph or OpenAI Agents SDK agent you already run. The SDK is TypeScript-only. And memory quality depends on the agent's own judgment about what to write down, which is harder to test than a deterministic extraction pipeline.

## How to choose

Skip the feature lists and answer these in order.

1. **Do you already have an agent in production?** If yes, Letta is out unless you are prepared to replace the runtime. Choose between Mem0 and Zep.
2. **Do your questions involve time or change?** "What does this user prefer?" is a Mem0 question. "What did they prefer before the March migration, and what changed?" is a Zep question.
3. **Must everything run on your infrastructure?** Mem0's library and server self-host with a vector store. Graphiti self-hosts but needs a graph database and leaves you to build the service layer. Letta's local backend and App Server self-host fully.
4. **What gets metered?** Mem0 limits add and retrieval requests. Zep charges for ingestion by episode size and does not meter retrieval. Letta charges for model usage through credits unless you bring your own keys. A chatty app with rare lookups and a quiet app with constant lookups land in different places.
5. **Who should decide what is worth remembering?** A pipeline you can evaluate (Mem0, Zep), or the agent (Letta).

Exact plan prices are on each tool page. For the concepts underneath all three, such as working versus long-term memory and where retrieval fits, see [Agent Memory Architecture](/guides/concepts/agent-memory-architecture); for graph-based retrieval more generally, see [Graph RAG](/guides/concepts/graph-rag).
