---
name: "CrewAI"
title: "CrewAI"
description: "A Python framework for orchestrating role-playing AI agents as collaborating 'crews', plus event-driven flows."
url: "https://www.crewai.com"
date: 2026-06-03
pricing: "open-source"
category: "sdk"
repo: "https://github.com/crewAIInc/crewAI"
license: "MIT"
sameAs: ["https://github.com/crewAIInc/crewAI", "https://docs.crewai.com"]
color: "red"
topics: ["ai-agents-systems"]
tags: ["agents", "framework", "multi-agent", "open-source", "python"]
featured: false
alternativeTo: ["langgraph", "autogen", "openai-agents-sdk"]
summary: "CrewAI orchestrates multiple agents as a 'crew' with roles, goals, and tasks — a high-level, fast-to-start abstraction for collaborative multi-agent work. It also offers Flows for event-driven, more deterministic control when you need it. Standalone and independent of LangChain."
related: ["tool:langgraph", "tool:autogen", "tool:openai-agents-sdk", "guide:agent-frameworks-2026"]
faq:
  - q: "What is CrewAI?"
    a: "CrewAI is a Python framework for building multi-agent systems around the metaphor of a crew: agents with a role, a goal, and a backstory working through tasks toward a shared objective, in sequential or hierarchical processes. For tighter, event-driven control it also provides Flows, a more deterministic execution model you can combine with crews."
  - q: "Is CrewAI free?"
    a: "Yes — CrewAI is open source under MIT and free to self-host; you bring your own model provider. A commercial enterprise platform adds hosted deployment, monitoring, and management."
  - q: "CrewAI vs LangGraph?"
    a: "CrewAI is one of the fastest ways to stand up a collaborative multi-agent prototype — you describe who does what and it handles the coordination. If you later need explicit state, checkpointing, and resumability, compare LangGraph; within CrewAI, use Flows when you want determinism over agent autonomy."
---

CrewAI is a Python framework for building multi-agent systems around an intuitive metaphor: a **crew** of agents, each with a role, a goal, and a backstory, working through tasks toward a shared objective. That high-level abstraction makes it one of the fastest ways to stand up collaborative multi-agent workflows — you describe who does what, and CrewAI handles the coordination.

It is aimed at developers who want role-based multi-agent orchestration without wiring a state graph by hand. For cases that need tighter, event-driven control, CrewAI also provides **Flows**, a more deterministic execution model you can combine with crews.

## Highlights

- **Roles, tasks, crews** — define agents by role and goal, assign tasks, and let the crew collaborate (sequential or hierarchical processes).
- **Flows** — event-driven orchestration for deterministic, branching control when autonomy isn't what you want.
- **Tools & integrations** — give agents tools (search, code, custom functions) and connect external systems.
- **Standalone** — built independently of LangChain, with its own lean core.
- **Memory & delegation** — agents can retain context and delegate subtasks to one another.

## In an AI-assisted workflow

```python
from crewai import Agent, Task, Crew

researcher = Agent(role="Researcher", goal="Find sources", backstory="...")
writer = Agent(role="Writer", goal="Draft the brief", backstory="...")
crew = Crew(agents=[researcher, writer], tasks=[research_task, write_task])
crew.kickoff()
```

> [!TIP]
> CrewAI is great for getting a collaborative multi-agent prototype running fast. If you later need explicit state, checkpointing, and resumability, compare [LangGraph](/tools/langgraph) — and use Flows when you want determinism over agent autonomy.

## Good to know

CrewAI is open source (MIT) and free to self-host; a commercial enterprise platform adds hosted deployment, monitoring, and management. You bring your own model provider. See [Which Agent Framework in 2026?](/guides/concepts/agent-frameworks-2026) for where it fits versus the alternatives.
