---
term: "Multi-Agent System"
description: "A multi-agent system is several AI agents working on one task, often a lead agent delegating to parallel subagents, trading extra tokens for breadth."
date: 2026-11-12
topics: ["ai-agents-systems", "architecture"]
audience: ["developers", "ai-engineers"]
tags: ["multi-agent", "agents", "orchestration", "subagents", "orchestrator-worker"]
related: ["guide:multi-agent-orchestration", "glossary:subagent", "glossary:ai-agent", "agent:workflow-orchestrator", "guide:agent-frameworks-2026", "glossary:a2a-protocol"]
faq:
  - q: "What is the difference between a multi-agent system and a subagent?"
    a: "A subagent is one component: an agent invoked by another agent, with its own context window and tools. A multi-agent system is the whole arrangement, such as the research system Anthropic described in June 2025, where a lead agent coordinates the process and delegates to specialized subagents that run in parallel. In Claude Code, subagents are the building block you use to make one."
  - q: "Do multi-agent systems cost more than a single agent?"
    a: "Usually much more. In Anthropic's June 2025 write-up of its research system, agents used about 4x more tokens than chat interactions and multi-agent systems about 15x more, in Anthropic's own data. The same post concluded that multi-agent systems need tasks whose value is high enough to pay for the increased performance."
  - q: "When is a multi-agent system a poor fit?"
    a: "When the agents would need to share the same context or depend heavily on each other. Anthropic's June 2025 post says most coding tasks involve fewer truly parallelizable tasks than research, and that LLM agents were not yet great at coordinating and delegating to each other in real time. It also lists early failures such as spawning 50 subagents for simple queries."
summary: "A multi-agent system is a set of AI agents, each an LLM using tools in a loop, working together on one task. The common LLM-era shape is orchestrator-worker: a lead agent plans and delegates to subagents running in parallel. In Anthropic's June 2025 data, multi-agent systems used about 15x the tokens of chat interactions, so the task has to be worth it."
---

**A multi-agent system is a set of AI agents that work together on one task, each acting with its own context and tools, under some scheme that coordinates what they do.**

The idea predates language models. Stone and Veloso's 2000 survey describes multiagent systems as the part of AI that aims to provide "principles for construction of complex systems involving multiple agents and mechanisms for coordination of independent agents' behaviors." Anthropic's LLM-era definition is shorter: "multiple agents (LLMs autonomously using tools in a loop) working together."

The most cited LLM design is orchestrator-worker. In the research system Anthropic described in June 2025, "a lead agent coordinates the process while delegating to specialized subagents that operate in parallel." In that June 2025 post, a setup with Claude Opus 4 leading Claude Sonnet 4 subagents beat single-agent Opus 4 by 90.2% on Anthropic's internal research eval, and multi-agent systems used about 15x the tokens of chat interactions. Anthropic's explanation was blunt: they work mainly "because they help spend enough tokens to solve the problem." The same post warns that tasks with shared context or many dependencies fit poorly, and that most coding tasks are less parallelizable than research.

Frameworks expose the patterns directly. The OpenAI Agents SDK offers agents as tools, where a manager calls specialists, and handoffs, where a triage agent passes control to a specialist.

In Claude Code the building block is the [subagent](/glossary/subagent), and [agentic RAG](/glossary/agentic-rag) is one common multi-agent application. The four standard shapes (fan-out, pipeline, orchestrator-worker and critic) are covered in [Multi-Agent Orchestration](/guides/advanced/multi-agent-orchestration). For coding work, a written spec is one way to give parallel agents the same intent; GitHub Spec Kit's tasks step marks tasks for parallel execution where possible, as described under [spec-driven development](/glossary/spec-driven-development).
