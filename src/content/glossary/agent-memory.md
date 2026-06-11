---
term: "Agent Memory"
description: "Agent memory is how an AI agent retains information beyond its context window — working state during a task and persistent knowledge across sessions."
date: 2026-06-11
topics: ["ai-agents-systems"]
tags: ["memory", "agents", "state", "persistence"]
related: ["agent-memory-architecture", "claude-code-memory-context", "context-window", "mem0", "rag"]
faq:
  - q: "What's the difference between short-term and long-term agent memory?"
    a: "Short-term memory is the context window — everything the agent currently sees, gone when the session ends. Long-term memory is anything persisted outside it — files, databases, vector stores — that survives across sessions and gets selectively loaded back. The engineering is in the 'selectively': what to write down, and what to recall when."
  - q: "How do real systems implement agent memory?"
    a: "Mostly as retrieval over stored notes: the agent writes durable facts to storage (markdown files, a vector database via layers like Mem0 or Zep, plain records), then retrieves what's relevant at session start or mid-task. Claude Code's CLAUDE.md and auto-memory are the file-based version of the same pattern."
---

**Agent memory is the machinery that lets an agent know things its [context window](/glossary/context-window) no longer holds — working state within a long task, and persistent knowledge across sessions.**

The split mirrors the constraint. **Short-term memory** *is* the context window: ephemeral, complete, and finite — managed by compaction and careful loading. **Long-term memory** is storage outside the model: notes the agent writes, facts it accumulates, preferences it learns — persisted to files or databases and *retrieved* when relevant, which makes long-term memory largely a [retrieval](/glossary/rag) problem wearing a different hat.

Production patterns range from file-based (Claude Code's CLAUDE.md and [auto-memory](/guides/configuration/claude-code-memory-context) — transparent, versionable, user-editable) to dedicated memory layers ([Mem0](/tools/mem0), Zep) that extract, store, and retrieve facts automatically. The design questions that matter — what's worth remembering, when to recall it, how to forget what's stale — are the substance of [Agent Memory Architecture](/guides/concepts/agent-memory-architecture). The failure modes are instructive too: remember too little and the agent re-learns your codebase every session; remember too much and stale facts poison fresh work.
