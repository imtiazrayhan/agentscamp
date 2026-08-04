---
term: "AI Agent"
description: "An AI agent is an LLM-driven system that pursues a goal in a loop — calling tools, observing results, iterating — instead of returning one answer."
date: 2026-06-11
topics: ["ai-agents-systems"]
tags: ["agents", "llm", "tool-use", "autonomy"]
related: ["glossary:agentic-ai", "guide:agent-frameworks-2026", "glossary:function-calling", "glossary:agent-memory", "guide:what-is-claude-code", "guide:production-tool-calling"]
faq:
  - q: "What makes something an agent rather than a chatbot?"
    a: "The loop. A chatbot maps one input to one output. An agent decides on an action, executes it through a tool, reads the result, and decides again — repeating until the goal is met. Tool use, statefulness across steps, and self-correction against observed results are the defining traits."
  - q: "What are the core components of an AI agent?"
    a: "A model (the reasoning engine), tools (the actions it can take — search, code execution, APIs), an execution loop that feeds tool results back as observations, and usually memory (context within a task, sometimes persistent across tasks) plus guardrails bounding what it may do."
---

**An AI agent is a system that uses a language model to pursue a goal autonomously: it decides on an action, executes it through a tool, observes the result, and repeats — a loop, not a single answer.**

The loop is the whole distinction. A plain LLM call maps input to output and stops; an agent closes the feedback cycle — run the test, read the failure, edit the code, run it again. That makes agents capable of multi-step work (and of recovering from their own mistakes), and it makes their quality depend on more than the model: [tool design](/guides/concepts/production-tool-calling), [memory](/glossary/agent-memory), and termination conditions matter as much as raw intelligence.

In practice "agent" spans a spectrum of autonomy — from a function-calling loop with three tools, through coding agents like [Claude Code](/guides/getting-started/what-is-claude-code), to multi-agent systems with planners and workers. Frameworks like LangGraph and CrewAI ([compared here](/guides/concepts/agent-frameworks-2026)) supply the orchestration scaffolding; the [Model Context Protocol](/glossary/model-context-protocol) standardizes how agents reach tools.
