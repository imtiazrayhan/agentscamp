---
name: "CrewAI"
title: "CrewAI"
description: "An MIT-licensed Python framework that runs role-based AI agents as crews and wires them into event-driven Flows, with a hosted enterprise platform, CrewAI AMP."
url: "https://www.crewai.com"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/crewAIInc/crewAI"
license: "MIT"
sameAs: ["https://github.com/crewAIInc/crewAI", "https://docs.crewai.com"]
color: "red"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["agents", "framework", "multi-agent", "open-source", "python"]
featured: false
alternativeTo: ["langgraph", "autogen", "openai-agents-sdk"]
summary: "CrewAI is an MIT-licensed Python framework for multi-agent work. You define agents by role, goal and backstory, give them tasks, and run them as a crew in a sequential or hierarchical process; Flows add event-driven control around crews. It is standalone, not built on LangChain, and the company sells a hosted platform, CrewAI AMP."
related: ["tool:langgraph", "tool:autogen", "tool:openai-agents-sdk", "guide:agent-frameworks-2026"]
faq:
  - q: "How much does CrewAI cost?"
    a: "The framework is free under the MIT license; you pay your model provider. For the hosted platform, CrewAI's pricing page lists two plans as of November 2026: Basic, which is free and includes 50 workflow executions a month and 2 automations on CrewAI's cloud, and Enterprise, which is custom-priced and adds SSO, role-based access control, enterprise connectors and deployment in your own VPC or infrastructure."
  - q: "Which models does CrewAI support?"
    a: "CrewAI's docs list native SDK integrations for OpenAI, Anthropic, Google's Gemini API, Azure, AWS Bedrock and Snowflake Cortex. Other providers run through LiteLLM, which you add with uv add 'crewai[litellm]'. You pick the model with a MODEL=provider/model-id environment variable or an llm argument on the agent."
  - q: "Does CrewAI depend on LangChain?"
    a: "No. The project's README describes CrewAI as a standalone Python framework with its own primitives for agents, tasks, crews, flows, tools and orchestration."
  - q: "Does CrewAI collect telemetry?"
    a: "Yes, anonymous usage telemetry is on by default. The docs say it excludes message contents and responses, and you can turn it off by setting the CREWAI_DISABLE_TELEMETRY environment variable to true."
---

CrewAI is a Python framework for building [multi-agent systems](/glossary/multi-agent-system) around one metaphor: a **crew** of agents, each with a role, a goal and a backstory, working through tasks toward a shared result. You describe who does what and CrewAI handles the coordination. It is released under the MIT license by the company of the same name and has about 61,300 GitHub stars as of November 2026. The latest release is 1.15.45, published on November 24, 2026.

It suits developers who want role-based orchestration without wiring a state graph by hand. For tighter control, **Flows** are an event-driven execution model you can wrap around crews or use alone.

## Highlights

- **Agents, tasks, crews.** An `Agent` has `role`, `goal` and `backstory`; a `Task` has a `description`, an `expected_output` and an assigned agent; a `Crew` runs them.
- **Two processes.** `Process.sequential` runs tasks in order. `Process.hierarchical` adds a manager that delegates and reviews, and requires a `manager_llm` or `manager_agent`.
- **Flows.** Decorate methods with `@start()`, `@listen()` and `@router()` to build event-driven pipelines with explicit state and branching, calling a crew only where you want agent autonomy.
- **Unified memory.** `memory=True` on a crew turns on a single `Memory` system that replaced the older short-term, long-term and entity memory types. It stores to LanceDB under `./.crewai/memory` by default.
- **Checkpointing.** A `CheckpointConfig` saves crew state after each task, and `Crew.from_checkpoint()` resumes a run from a saved file.
- **Model support.** Native integrations for OpenAI, Anthropic, Gemini, Azure, AWS Bedrock and Snowflake Cortex; other providers go through LiteLLM.
- **CLI scaffolding.** `crewai create crew <name>` generates a project. Current versions scaffold a JSON-first layout (`agents/*.jsonc` and `crew.jsonc`); pass `--classic` for the older Python and YAML layout.

## In an AI-assisted workflow

CrewAI requires Python 3.10 to 3.13. Install the CLI with uv, or add the library to an existing project:

```bash
uv tool install crewai     # the crewai CLI
uv add crewai              # or: pip install crewai, inside a project
```

A complete two-agent crew in code. Set `MODEL` (in the form `provider/model-id`) and your provider's API key in the environment first:

```python
from crewai import Agent, Crew, Process, Task

researcher = Agent(
    role="Researcher",
    goal="Find accurate, current sources on {topic}",
    backstory="A careful analyst who cites where each fact came from.",
)
writer = Agent(
    role="Writer",
    goal="Turn research notes into a one-page brief on {topic}",
    backstory="An editor who writes plainly and cuts filler.",
)

research_task = Task(
    description="Research {topic} and list the ten most relevant findings.",
    expected_output="Ten bullet points, each with a source.",
    agent=researcher,
)
write_task = Task(
    description="Write a brief on {topic} from the research notes.",
    expected_output="A markdown brief under 400 words.",
    agent=writer,
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
)
result = crew.kickoff(inputs={"topic": "AI agent frameworks"})
print(result)
```

In a sequential process, each task's output is passed to the next as context, so the writer sees the researcher's notes.

> [!TIP]
> Start with a crew to prove the idea, then move the parts that must be predictable into a Flow. A common production shape is a Flow that handles routing, validation and retries in ordinary Python and calls a small crew for the one step that needs open-ended reasoning.

## Pricing

The open-source framework is free; your cost is model tokens. Every agent turn is at least one LLM call, and hierarchical crews add manager calls on top, so a multi-agent run costs more than a single prompt doing the same job.

CrewAI AMP is the commercial platform: a visual Studio editor, hosted deployment, tracing and governance. As of November 2026, the pricing page lists two plans:

| Plan | Price | Limits |
| - | - | - |
| Basic | Free | 50 workflow executions a month, 2 automations, CrewAI cloud only |
| Enterprise | Custom | Executions sized to the workload, SSO, role-based access control, enterprise connectors, deployment on CrewAI cloud, your VPC or your own infrastructure |

No self-serve paid tier is listed between the two as of November 2026, so anything beyond 50 executions a month on the hosted platform is a sales conversation. Self-hosting the open-source framework has no such cap.

## Good to know

**Autonomy costs predictability.** Role-playing agents decide how to approach a task, which makes runs harder to reproduce and test than an explicit graph. Use `expected_output` and structured outputs (`output_pydantic`) to pin down results, and Flows where order matters.

**The scaffold changed.** Tutorials written for older versions assume `config/agents.yaml` and `config/tasks.yaml`. New projects get JSON definitions unless you pass `--classic`, and the Python API shown above works in both.

**Telemetry is on by default.** Set `CREWAI_DISABLE_TELEMETRY=true` to disable the anonymous usage telemetry.

**Python only.** The framework is a Python package, so it fits Python stacks.

Compared with alternatives: [LangGraph](/tools/langgraph) makes you draw the control flow as a graph and gives finer-grained persistence and human-in-the-loop interrupts, at the price of more wiring ([LangGraph vs CrewAI](/guides/comparisons/langgraph-vs-crewai) covers the trade). The [OpenAI Agents SDK](/tools/openai-agents-sdk) is a smaller handoff-based loop, and [AutoGen](/tools/autogen) centers on agents conversing with each other. [Which Agent Framework in 2026?](/guides/concepts/agent-frameworks-2026) places all of them.
