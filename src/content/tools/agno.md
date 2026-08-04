---
name: "Agno"
title: "Agno"
description: "A Python framework for building multi-agent systems with memory, knowledge, and tools — formerly Phidata, now with the AgentOS runtime."
url: "https://agno.com"
date: 2026-06-24
pricing: "open-source"
category: "sdk"
repo: "https://github.com/agno-agi/agno"
license: "Apache-2.0"
sameAs: ["https://github.com/agno-agi/agno", "https://docs.agno.com", "https://github.com/agno-agi"]
color: "green"
topics: ["ai-agents-systems", "llm-app-dev"]
tags: ["python", "agents", "multi-agent", "memory", "framework"]
featured: false
alternativeTo: ["crewai", "langgraph", "autogen", "pydantic-ai", "langchain"]
summary: "Agno (formerly Phidata) is a Python framework for building multi-agent systems with memory, knowledge, and tools. You compose Agents, Teams, and Workflows over 20+ model providers, and can run them in production with the AgentOS runtime. The core library is open source under Apache-2.0."
related: ["guide:agent-frameworks-2026", "guide:langgraph-vs-crewai", "guide:multi-agent-orchestration", "guide:agent-memory-architecture", "guide:agentic-rag"]
faq:
  - q: "What is Agno?"
    a: "Agno is an open-source Python framework for building multi-agent systems with memory, knowledge, and tools. It was formerly known as Phidata and was renamed to Agno in early 2025 (its GitHub org moved to agno-agi). You compose Agents, Teams, and Workflows, connect 20+ model providers, and can run them in production with the AgentOS runtime."
  - q: "Is Agno free?"
    a: "The core Agno framework is open source under Apache-2.0 and free to self-host; you bring your own model provider and database. There is also a free control-plane tier plus paid Pro and Enterprise plans (AgentOS) that add hosted management, live connections, and team features. Confirm current pricing on the official site."
  - q: "How does Agno compare to CrewAI?"
    a: "Both are Python multi-agent frameworks. CrewAI centers on a role/goal 'crew' metaphor, while Agno gives you Agents, Teams, and Workflows plus a built-in AgentOS runtime for serving and managing agents, and emphasizes fast, low-memory agent instantiation. Agno leans toward the full build-run-manage lifecycle; pick based on how much production tooling you want bundled in."
---

Agno is a **Python framework for building multi-agent systems** with memory, knowledge, and tools. It was formerly known as **Phidata** and was renamed to Agno in early 2025, with its GitHub organization moving to `agno-agi`. You compose three core abstractions — Agents, Teams, and Workflows — over 20+ model providers, and the framework is model-agnostic so you can swap providers without rewriting agent logic.

It is aimed at developers who want to go beyond a single prototype agent to a managed platform: the project pairs the open-source SDK with **AgentOS**, a FastAPI-based runtime for serving agents in production with tracing, scheduling, and RBAC. That makes it a fit for an AI-assisted workflow where you scaffold agents locally and then run them as a real service.

## Highlights

- **Agents, Teams, Workflows** — build a single tool-using agent, coordinate a team of specialists, or wire deterministic step-based workflows from the same SDK.
- **Memory and knowledge** — attach session memory and knowledge stores (backed by common vector databases) so agents retain context and ground answers in your data.
- **Tools and integrations** — give agents tools through a large library of prebuilt toolkits, or register your own Python functions.
- **AgentOS runtime** — serve agents as a production service with tracing, scheduling, RBAC, and a control plane that runs in your own cloud.

## In an AI-assisted workflow

Use Agno to define a tool-equipped agent in a few lines, then iterate with your coding assistant before promoting it to AgentOS. See [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026) for where it sits among the alternatives.

```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.duckduckgo import DuckDuckGoTools

agent = Agent(
    model=OpenAIChat(id="gpt-4o"),
    tools=[DuckDuckGoTools()],
    markdown=True,
)
agent.print_response("Summarize the latest news on agent frameworks")
```

> [!TIP]
> Start with a single Agent, then graduate to a Team or Workflow only when one agent's responsibilities clearly split. Verify import paths and class names against the current docs, since Agno's API changed across the 2.0 release.

## Good to know

The core Agno library is open source under Apache-2.0 and free to self-host — you supply your own model provider and database. A free control-plane tier plus paid Pro and Enterprise plans (AgentOS) add hosted management, live connections, retention, and team seats; confirm the current tiers and limits on the official pricing page before relying on them. For patterns on coordinating multiple agents, see [Multi-Agent Orchestration](/guides/advanced/multi-agent-orchestration).
