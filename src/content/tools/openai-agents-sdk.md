---
name: "OpenAI Agents SDK"
title: "OpenAI Agents SDK"
description: "OpenAI's lightweight, open-source framework for agents — handoffs, guardrails, sessions, and built-in tracing."
url: "https://openai.github.io/openai-agents-python/"
date: 2026-06-03
pricing: "open-source"
category: "sdk"
repo: "https://github.com/openai/openai-agents-python"
license: "MIT"
sameAs: ["https://github.com/openai/openai-agents-python"]
color: "green"
topics: ["ai-agents-systems"]
tags: ["agents", "framework", "openai", "open-source", "python"]
featured: false
alternativeTo: ["langgraph", "crewai", "autogen"]
summary: "OpenAI's open-source Agents SDK is a small, unopinionated framework for building agents: a core agent loop plus handoffs (delegation between agents), guardrails (input/output validation), sessions (memory), and built-in tracing. The production-grade successor to Swarm; works with non-OpenAI models too."
related: ["langgraph", "crewai", "autogen", "agent-frameworks-2026"]
faq:
  - q: "What is the OpenAI Agents SDK?"
    a: "The OpenAI Agents SDK is OpenAI's lightweight, open-source framework for building agentic applications — the production-ready successor to the experimental Swarm project. Its philosophy is 'few primitives, learned fast': a core agent loop plus handoffs for multi-agent delegation, guardrails for input/output validation, sessions for memory, and built-in tracing."
  - q: "Is the OpenAI Agents SDK free?"
    a: "Yes — it's open source under MIT and free; you pay your model provider for tokens."
  - q: "Does the OpenAI Agents SDK work with non-OpenAI models?"
    a: "Yes. Although it comes from OpenAI, it's provider-agnostic — it works with OpenAI models out of the box and with other providers through compatible interfaces, which makes it a reasonable default even outside the OpenAI ecosystem."
  - q: "OpenAI Agents SDK vs LangGraph?"
    a: "Reach for the Agents SDK when you want a small, standard agent loop with handoffs and guardrails and minimal ceremony. LangGraph fits when you need explicit state graphs and checkpointing; CrewAI when you want role-based crews."
---

The OpenAI Agents SDK is OpenAI's lightweight, open-source framework for building agentic applications. It's the production-ready successor to the experimental Swarm project, and its design philosophy is "few primitives, learned fast": a core agent loop, plus a handful of well-chosen building blocks rather than a large abstraction layer.

It is aimed at developers who want a minimal, Pythonic framework with the essentials built in. Although it comes from OpenAI, it is **provider-agnostic** — you can run agents on non-OpenAI models — which makes it a reasonable default even outside the OpenAI ecosystem.

## Highlights

- **Agents & the loop** — define an agent with instructions and tools; the SDK runs the model-tool-observation loop for you.
- **Handoffs** — delegate from one agent to another, the SDK's mechanism for multi-agent systems.
- **Guardrails** — validate inputs and outputs (and run checks in parallel) to keep agents safe and on-task.
- **Sessions** — built-in conversation memory across runs.
- **Tracing** — first-class tracing for debugging and evaluating agent runs.

## In an AI-assisted workflow

```python
from agents import Agent, Runner

agent = Agent(name="Support", instructions="Help with billing", tools=[lookup_invoice])
result = Runner.run_sync(agent, "Why was I charged twice?")
```

> [!TIP]
> Reach for the Agents SDK when you want a small, standard agent loop with handoffs and guardrails and minimal ceremony. For explicit state graphs and checkpointing, compare [LangGraph](/tools/langgraph); for role-based crews, [CrewAI](/tools/crewai).

## Good to know

The Agents SDK is open source (MIT) and free; you pay your model provider for tokens. It works with OpenAI models out of the box and with other providers through compatible interfaces. See [the agent framework comparison](/guides/concepts/agent-frameworks-2026) for how it stacks up against LangGraph, CrewAI, AutoGen, and the Claude Agent SDK.
