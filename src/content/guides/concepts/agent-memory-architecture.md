---
title: "Agent Memory Architecture: Short-Term, Long-Term, and When to Use Each"
description: "How AI agents remember — working memory vs. persistent long-term memory, what to store, how to retrieve it, and how to keep context small."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["ai-agents-systems"]
tags: ["agents", "memory", "context", "concepts"]
featured: false
summary: "Agent memory comes in two layers: short-term working memory (the context window for the current task) and long-term memory (facts persisted across sessions and retrieved when relevant). The skill is deciding what's worth remembering, storing it as distilled facts rather than raw transcripts, and retrieving only what the current turn needs — so the agent feels continuous without bloating context."
keyTakeaways:
  - "Short-term memory is the context window (working memory for the current task); long-term memory persists across sessions."
  - "Don't stuff full history into context — extract and store salient facts, then retrieve only what's relevant now."
  - "Long-term memory has flavors: semantic (facts), episodic (past events), procedural (how-to/instructions)."
  - "Scope memories (per user / agent / session) so retrieval stays relevant and private."
  - "More memory isn't better — irrelevant retrieved memories are noise that degrades answers."
howtoSteps:
  - name: "Decide what's worth remembering"
    text: "Define which facts matter long-term (preferences, decisions, stable user attributes) versus what's ephemeral to the current task. Don't persist everything."
  - name: "Manage working memory"
    text: "Keep the current task's context tight: include the recent turns and the retrieved long-term memories, and summarize/compact older turns rather than appending forever."
  - name: "Extract memories, not transcripts"
    text: "After a turn, distill salient facts ('prefers TypeScript', 'on the Enterprise plan') and store them with scope (user/agent/session), instead of saving the raw conversation."
  - name: "Store with retrievability"
    text: "Embed and index memories (often in a vector store) with metadata so they can be searched semantically and filtered by scope."
  - name: "Retrieve only what's relevant"
    text: "At the start of a turn, fetch the few memories relevant to the current query and inject them into context — not the whole memory store."
  - name: "Update and forget"
    text: "Reconcile contradictions (new fact supersedes old), expire stale memories, and respect deletion requests — memory that never updates becomes wrong."
faq:
  - q: "How do you give an AI agent memory?"
    a: "Separate short-term from long-term. Short-term memory is the context window — the recent conversation plus relevant retrieved facts for the current task. Long-term memory persists across sessions: after each interaction, extract the salient facts (not the raw transcript), store and index them (commonly in a vector database), and at the start of each turn retrieve only the memories relevant to the current query. A memory library like Mem0 handles the extract/store/retrieve loop for you."
  - q: "What's the difference between short-term and long-term agent memory?"
    a: "Short-term (working) memory is what's in the model's context window right now — the current task's recent turns and retrieved facts; it's wiped when the session ends. Long-term memory is persisted outside the model (a database/vector store) and survives across sessions, so the agent can recall a user's preferences and history later. Production agents use both: long-term to remember, short-term to work."
  - q: "Should I just put the whole conversation history in the context window?"
    a: "Only up to a point. Appending full history grows cost and latency, hits context limits, and suffers the 'lost in the middle' effect where the model overlooks buried details. Better to keep recent turns verbatim, summarize older ones, and retrieve specific long-term facts on demand — remembering more by storing less in context."
related: ["guide:agent-frameworks-2026", "tool:mem0", "tool:langgraph", "guide:context-engineering", "agent:agent-tool-integration-engineer"]
---

An agent without memory is a stranger every conversation — it forgets your name, your preferences, and what it did five minutes ago. Memory is what makes an agent feel continuous and competent. But "give it memory" doesn't mean "stuff everything into the prompt." Good agent memory is an architecture: two layers, each with a job.

## Two layers

### Short-term (working) memory

This is the **context window** — what the model can see for the current task: the recent turns of the conversation, the current goal, and any long-term facts you've retrieved for this turn. It's fast and immediate, but bounded and ephemeral: when the session ends (or the window fills), it's gone. Managing it well — keeping it tight — is most of the [context engineering](/guides/prompting/context-engineering) battle.

### Long-term memory

This is knowledge **persisted outside the model** — in a database or vector store — that survives across sessions. It's how an agent recalls, next week, that you prefer TypeScript and you're on the Enterprise plan. Long-term memory comes in flavors worth distinguishing:

- **Semantic** — facts ("the user's company is Acme").
- **Episodic** — past events and interactions ("last time, we tried approach X and it failed").
- **Procedural** — how to do things (learned instructions, successful tool sequences).

## The core move: store less, remember more

The naive approach — append the entire conversation history to the prompt every turn — fails on cost, latency, context limits, and the "lost in the middle" effect where the model overlooks details buried in a huge context. The better pattern is to **extract and distill**: after a turn, save the salient *facts*, not the raw transcript; then at the next turn, **retrieve only the memories relevant to the current query** and inject those. The agent remembers more by keeping context small.

A library like [Mem0](/tools/mem0) implements exactly this extract-store-retrieve loop; frameworks like [LangGraph](/tools/langgraph) provide persistence/checkpointing for the working-memory side.

> [!TIP]
> Scope memories — per user, per agent, per session — and filter retrieval by scope. It keeps recall relevant and prevents one user's memories leaking into another's context (a real privacy bug).

## Pitfalls

- **Hoarding.** Persisting everything fills retrieval with noise; irrelevant retrieved memories actively degrade answers. Decide what's worth keeping.
- **Never forgetting.** Memory that never updates goes stale — new facts must supersede old, and contradictions reconciled, or the agent confidently recalls outdated truths.
- **No deletion path.** If you store user data, you need to be able to expire and delete it. Build that in from the start.
- **Memory as a dumping ground for bad retrieval.** If the *task's* knowledge belongs in a knowledge base, that's [RAG](/guides/concepts/how-rag-works), not agent memory. Memory is for the agent's own continuity, not your document corpus.

Once memory is in place, the other half of a capable agent is robust [tool calling](/guides/concepts/production-tool-calling) — and then [hardening it for production](/agents/meta-orchestration/agent-reliability-reviewer).

## Continue exploring

- [Agno](/tools/agno) — A Python framework for building multi-agent systems with memory, knowledge, and tools — formerly Phidata, now with the AgentOS runtime.
