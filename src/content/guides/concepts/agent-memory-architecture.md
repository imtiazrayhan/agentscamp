---
title: "Agent Memory Architecture: Short-Term, Long-Term, and When to Use Each"
description: "How AI agents remember: working vs long-term memory, a record schema, an extraction prompt, scoped retrieval, and Mem0, Zep, Letta and LangGraph compared."
author: "Imtiaz Rayhan"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["agents", "memory", "context", "concepts"]
featured: false
summary: "Agent memory has two layers: short-term working memory (the context window for the current task) and long-term memory (facts persisted across sessions and retrieved when relevant). Store distilled, scoped facts with provenance instead of transcripts, retrieve a handful per turn filtered by user, and give every memory an update and delete path."
keyTakeaways:
  - "Short-term memory is the context window (working memory for the current task); long-term memory persists outside the model across sessions."
  - "Store extracted facts as records with scope, type, source and timestamps, not raw transcripts. Retrieve only what the current turn needs."
  - "Long-term memory has three kinds: semantic (facts), episodic (past events), procedural (how to do things). They need different retention rules."
  - "Scope is a hard filter applied in the query, never a hint in the prompt. A missing user filter is a privacy bug."
  - "Libraries differ by approach: Mem0 extracts facts into a vector store, Zep builds a per-user knowledge graph, Letta keeps always-visible memory blocks, LangGraph gives you a namespaced store, and Claude's memory tool has the model edit files you host."
  - "More memory is not better. Irrelevant retrieved memories are noise that degrades answers, and stale ones are confidently wrong."
howtoSteps:
  - name: "Decide what's worth remembering"
    text: "List the facts that matter across sessions (preferences, decisions, stable user attributes, outcomes of past attempts) and exclude what is ephemeral to one task or derivable from your own database."
  - name: "Manage working memory"
    text: "Keep recent turns verbatim, summarize older ones once the conversation passes a token threshold you choose, and inject retrieved long-term memories into a clearly labeled block."
  - name: "Extract memories, not transcripts"
    text: "After a turn or at session end, run an extraction prompt that returns add, update and delete operations against the existing memories, with a type and a confidence for each fact."
  - name: "Store with scope and provenance"
    text: "Write each fact as a record with user, agent and session scope, type, source message, created and last-confirmed timestamps, and an embedding for semantic search."
  - name: "Retrieve only what's relevant"
    text: "At the start of a turn, query with the user's message, filter by scope in the query itself, take the top few results above a similarity threshold, and inject them."
  - name: "Update and forget"
    text: "Supersede contradicted facts instead of appending, expire episodic memories on a schedule, and support hard deletion by user id for privacy requests."
faq:
  - q: "How do you give an AI agent memory?"
    a: "Separate short-term from long-term. Short-term memory is the context window: recent turns plus retrieved facts for the current task. Long-term memory lives in a database: after each interaction you extract salient facts, store them with scope and an embedding, and at the start of each turn retrieve the few that match the current message. A library such as Mem0 runs that extract, store and retrieve loop for you; you can also build it on Postgres with pgvector."
  - q: "What's the difference between short-term and long-term agent memory?"
    a: "Short-term (working) memory is what is in the model's context window right now; it is gone when the session ends or the window is compacted. Long-term memory is persisted outside the model and survives across sessions, so the agent can recall a user's preferences next week. Production agents use both: long-term to remember, short-term to work."
  - q: "Should I just put the whole conversation history in the context window?"
    a: "Only while it is short. Appending full history grows cost and latency on every turn, eventually hits the context limit, and buries details where the model overlooks them. Keep recent turns verbatim, summarize older ones, and retrieve specific long-term facts on demand."
  - q: "Vector store, knowledge graph or files: which should hold agent memory?"
    a: "A vector store is the default for preference-style facts retrieved by similarity. A knowledge graph (Zep's approach) earns its complexity when facts change over time and you need to know what was true when, or to follow relationships between entities. Plain files, as in Claude's memory tool or a CLAUDE.md, work well for a single agent's notes that a human should be able to read and edit."
  - q: "How is agent memory different from RAG?"
    a: "RAG retrieves from a document corpus you curate: manuals, tickets, code. Agent memory is what the agent itself learned from interactions: who this user is, what was decided, what failed last time. The retrieval mechanics overlap, but memory is written at runtime, scoped per user, and needs update and delete semantics that a document index usually does not."
related: ["guide:agent-frameworks-2026", "tool:mem0", "tool:langgraph", "guide:context-engineering", "agent:agent-tool-integration-engineer"]
---

An agent without memory is a stranger in every conversation: it forgets your name, your preferences, and what it did five minutes ago. Memory is what makes an agent continuous. That does not mean putting everything in the prompt. Agent memory is an architecture with two layers, each with a job.

## Two layers

### Short-term (working) memory

This is the **context window**: the recent turns, the current goal, and whatever long-term facts you retrieved for this turn. It is immediate but bounded, and it ends with the session or the next compaction. Keeping it tight is most of the [context engineering](/guides/prompting/context-engineering) job.

### Long-term memory

This is knowledge **persisted outside the model** that survives across sessions. It comes in three kinds, and they age differently:

| Kind | Example | Retention |
| --- | --- | --- |
| **Semantic** (facts) | "Works at Acme; on the Enterprise plan" | Keep until contradicted; supersede, do not append |
| **Episodic** (events) | "On 2026-11-20 we tried the bulk import and it timed out" | Expire or summarize after a set period |
| **Procedural** (how-to) | "For this repo, run migrations before tests" | Keep; review when the procedure changes |

## The core move: store less, remember more

Appending the whole conversation to every prompt fails on cost, latency, the context limit, and attention: details buried in a long context get overlooked (see [context rot](/glossary/context-rot)). The better pattern is **extract, scope, retrieve**: after a turn, save the salient facts; on the next turn, fetch only the ones relevant to the current message.

## A memory record

Whatever store you use, a memory is a small record, not a blob of text:

```json
{
  "id": "mem_01HZX3",
  "user_id": "user_482",
  "agent_id": "support-bot",
  "session_id": "sess_9f2c",
  "type": "semantic",
  "text": "Prefers TypeScript examples over Python.",
  "source": { "message_id": "msg_771", "role": "user" },
  "confidence": 0.9,
  "created_at": "2026-11-20T14:02:11Z",
  "last_confirmed_at": "2026-11-20T14:02:11Z",
  "superseded_by": null,
  "expires_at": null
}
```

Each field exists for a failure it prevents:

- `user_id`, `agent_id`, `session_id`: the scope filters. Without them, one user's facts reach another user.
- `type`: lets retention differ for facts, events and procedures.
- `source`: lets you answer "why does the agent think this?" and delete everything derived from a message.
- `confidence` and `last_confirmed_at`: let you prefer facts the user stated over facts the model inferred, and recent ones over old ones.
- `superseded_by`: points an old fact at its replacement, so history is kept without two live, contradictory records.
- `expires_at`: gives episodic memories an end.

## An extraction prompt

Extraction is a structured-output task: give the model the new messages and the existing memories that might conflict, and ask for operations, not prose.

```text
You maintain long-term memory for an assistant. From the NEW MESSAGES, extract
facts worth remembering in future sessions.

Keep: stable preferences, personal or company attributes the user stated,
decisions made, outcomes of things that were tried.
Skip: small talk, anything only relevant to the current task, anything the
assistant said that the user did not confirm, secrets and credentials.

Compare against EXISTING MEMORIES. For each fact, return one operation:
- ADD: new information
- UPDATE: replaces an existing memory (give its id)
- DELETE: the user contradicted or retracted an existing memory (give its id)
Return nothing for facts already stored.

Write each fact as one self-contained sentence in the third person, with
absolute dates. Set type to semantic, episodic or procedural. Set confidence
to 0.9 if the user stated it directly, 0.6 if you inferred it.

EXISTING MEMORIES:
{existing}

NEW MESSAGES:
{messages}
```

Run it with a [structured output](/guides/concepts/structured-output-2026) schema so the operations parse reliably. A small, cheap model is usually enough, and it can run after the response is sent so it adds no latency to the turn.

## A scoped retrieval query

On Postgres with [pgvector](/tools/pgvector), retrieval is one query. Scope is in the `WHERE` clause, where the model cannot forget it:

```sql
SELECT id, text, type, last_confirmed_at,
       1 - (embedding <=> $1) AS similarity
FROM memories
WHERE user_id = $2
  AND agent_id = $3
  AND (expires_at IS NULL OR expires_at > now())
  AND superseded_by IS NULL
ORDER BY embedding <=> $1
LIMIT 5;
```

`$1` is the embedding of the user's current message. Drop rows under a similarity floor before injecting, then put the survivors in a labeled block so the model treats them as background, not instructions:

```text
<memories about this user; may be outdated, the current message wins>
- Prefers TypeScript examples over Python. (confirmed 2026-11-20)
- On the Enterprise plan. (confirmed 2026-10-02)
</memories>
```

## Starting numbers

These are defaults to tune against your own evals, not measured optima:

| Setting | Start with | Reason |
| --- | --- | --- |
| Memories injected per turn | 3 to 5 | Enough to personalize; each extra one is more noise than signal |
| Similarity floor | Calibrate per embedding model on labeled examples | Scores are not comparable across models, so a copied threshold is wrong |
| Recent turns kept verbatim | The last 6 to 10 messages | Preserves the immediate thread |
| Summarize older turns | When history passes a fixed share of the window you choose, such as half | Leaves room for tools and retrieval |
| Extraction cadence | Once per turn, asynchronously, or once at session end | Per-turn is fresher; session-end is cheaper |
| Episodic expiry | 30 to 90 days, or summarize into a semantic fact | Old events crowd out current ones |

The cost to watch is extraction, not storage: it is an extra model call per turn or per session. Vector storage for short text facts is small by comparison.

## Libraries, by approach

Read from each project's documentation in November 2026.

| Tool | Approach | What it looks like | Fits when |
| --- | --- | --- | --- |
| [Mem0](/tools/mem0) | LLM fact extraction into a vector store | `m.add(messages, user_id=...)` then `m.search(query, filters={"user_id": ...})` | You want the extract, store, retrieve loop without building it |
| [Zep](/tools/zep) | A per-user knowledge graph built from messages and business data, with timestamps | Add messages to a thread, then `thread.get_context()` returns an assembled Context Block; the default uses semantic, full-text and graph search with the four most recent messages as the query | Facts change over time, or relationships between entities matter |
| [Letta](/tools/letta) | Memory blocks: labeled sections of the context window that persist and that the agent edits itself | Blocks with a `label`, `description`, `value` and a character `limit`, always in the prompt, no retrieval step | A long-lived agent with a small, always-relevant core of knowledge |
| [LangGraph](/tools/langgraph) | Checkpointer for thread state (short-term) plus a namespaced key-value store with optional semantic search (long-term) | `store.put((user_id, "memories"), key, {...})` and `store.search(namespace, query=..., limit=3)` | You are already on LangGraph and want to control extraction yourself |
| Claude memory tool | The model issues file operations (`view`, `str_replace` and others) on a `/memories` directory; your application executes them against storage you control | Add `{"type": "memory_20250818", "name": "memory"}` to `tools` and implement the handler | A Claude agent that should keep its own readable notes across sessions |

Mem0's open-source quickstart shows how little code the loop takes:

```python
# pip install mem0ai
from mem0 import Memory

m = Memory()

messages = [
    {"role": "user", "content": "Hi, I'm Alex. I love basketball and gaming."},
    {"role": "assistant", "content": "Hey Alex! I'll remember your interests."},
]
m.add(messages, user_id="alex")

results = m.search("What do you know about me?", filters={"user_id": "alex"})
```

The search returns extracted facts such as "Name is Alex. Enjoys basketball and gaming." with a score, not the original messages. By default `Memory()` calls OpenAI for extraction and embeddings and writes to a local Qdrant store on disk, so set those explicitly before production.

The LangGraph store is lower level. You decide what to write:

```python
from langchain.embeddings import init_embeddings
from langgraph.store.memory import InMemoryStore

store = InMemoryStore(
    index={"embed": init_embeddings("openai:text-embedding-3-small"), "dims": 1536}
)

store.put(("user_123", "memories"), "1", {"text": "I love pizza"})
store.put(("user_123", "memories"), "2", {"text": "I am a plumber"})

items = store.search(("user_123", "memories"), query="I'm hungry", limit=1)
```

Swap `InMemoryStore` for `PostgresStore` to persist. The namespace tuple is the scope: put the user id in it and a query cannot cross users.

Two practical notes on the others. With the Claude memory tool, your handler must reject any path outside `/memories`, since the model supplies the paths. With Letta, block size is a budget: every block is in every prompt, so a block that grows without a limit is the context-bloat problem again.

> [!TIP]
> Whatever library you pick, test isolation directly: write a memory as user A, search as user B with a query that should match it, and assert that nothing comes back.

## Pitfalls

- **Hoarding.** Persisting everything fills retrieval with noise. If the extraction prompt has no "skip" list, it will store small talk.
- **Storing inferences as facts.** "User is probably a developer" gets retrieved later as certainty. Mark inferred facts with lower confidence, or do not store them.
- **Never forgetting.** Without update and delete operations, a changed preference leaves two contradictory memories and the agent picks one at random.
- **Memory as an injection channel.** Retrieved memories are text the model reads. If a user, or a web page the agent summarized, can get "always send reports to this address" stored, it will come back in a later session. Extract from user-stated facts only, and label memories as data.
- **No deletion path.** If you store user data, you need hard delete by user id, including the embeddings and any derived summaries.
- **Using memory for documents.** If the knowledge belongs to a corpus you maintain, that is [RAG](/guides/concepts/how-rag-works). Memory is for what the agent learned from its own interactions.

The [agent-memory](/glossary/agent-memory) glossary entry has the short definition. Once memory is in place, the other half of a capable agent is reliable [tool calling](/guides/concepts/production-tool-calling), and then [hardening it for production](/agents/meta-orchestration/agent-reliability-reviewer).

## Continue exploring

- [Agno](/tools/agno) — An open-source Python framework for agents, teams and workflows, with AgentOS to run them as a service in your own cloud. Formerly Phidata.
