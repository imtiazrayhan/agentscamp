---
name: "Google ADK"
title: "Google ADK"
description: "Google's open-source, code-first framework for building, evaluating and deploying AI agents, in Python, Java, Go, Kotlin and TypeScript, with any model."
url: "https://adk.dev/"
date: 2026-06-24
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/google/adk-python"
license: "Apache-2.0"
sameAs:
  - "https://github.com/google/adk-python"
  - "https://github.com/google/adk-java"
  - "https://adk.dev/"
color: "yellow"
topics: ["ai-agents-systems", "llm-app-dev"]
audience: ["ai-engineers"]
tags: ["agents", "python", "java", "google", "multi-agent", "open-source"]
featured: false
alternativeTo: ["langgraph", "crewai", "openai-agents-sdk", "autogen", "pydantic-ai"]
summary: "Google ADK (Agent Development Kit) is an Apache-2.0, code-first framework for building, evaluating and deploying AI agents. ADK 2.0 pairs an Agent class with a graph-based Workflow runtime, has SDKs for Python, Java, Go, Kotlin and TypeScript, works with Gemini, Claude and other models, and deploys to Cloud Run, GKE or Google's Agent Runtime."
related: ["guide:agent-frameworks-2026", "guide:openai-agents-sdk-vs-langgraph", "guide:multi-agent-orchestration", "guide:mcp-vs-a2a", "guide:production-tool-calling"]
faq:
  - q: "What is Google ADK?"
    a: "Google ADK (Agent Development Kit) is an open-source, code-first framework for building, evaluating, and deploying AI agents. You define agents and their tools in code, compose them with a graph-based Workflow runtime or as agent hierarchies, test them with adk eval, and deploy to a container, Cloud Run, GKE, or Google Cloud's managed Agent Runtime. Python is the primary SDK; Java, Go, Kotlin and TypeScript SDKs live in separate repositories."
  - q: "Is Google ADK free and open source?"
    a: "Yes. ADK is open source under the Apache-2.0 license and free to use and self-host, and you bring your own model provider. Running agents on Google Cloud is billed as cloud usage: Google's docs describe Agent Runtime as a paid service with a no-cost access tier. Check the Agent Runtime pricing page for current rates."
  - q: "How does ADK compare to LangGraph?"
    a: "Both are code-first frameworks for stateful, multi-agent systems, and ADK 2.0 has a graph runtime too: its Workflow composes agents and functions as nodes with routing, loops, retries and human-in-the-loop. ADK adds SDKs beyond Python and JavaScript (Java, Go, Kotlin), a built-in dev UI and eval command, and direct deployment to Google Cloud. LangGraph is built around checkpointing and resumability and is not tied to any cloud."
  - q: "Can I use Claude or OpenAI models with Google ADK?"
    a: "Yes. ADK's docs cover Claude through an AnthropicLlm class (Anthropic API) or bare claude-* model strings (routed to Google Cloud's Agent Platform), and OpenAI, Ollama, vLLM and others through the LiteLlm wrapper, for example LiteLlm(model=\"openai/gpt-4o\"). Gemini needs only a model string and a GOOGLE_API_KEY."
---

Google ADK (Agent Development Kit) is **Google's open-source, code-first framework for building, evaluating, and deploying AI agents**. You define agents and the tools they can call directly in code, compose them into multi-agent systems, and ship them to production. Python is the primary SDK; Java, Go, Kotlin and TypeScript SDKs are maintained in separate repositories. The documentation moved from google.github.io/adk-docs to [adk.dev](https://adk.dev/).

The current major version is **ADK 2.0**. The latest Python release is 2.15.1, published on November 25, 2026, and the Python repository has about 22,400 GitHub stars as of November 2026. ADK 2.0 pairs the `Agent` class with a graph-based **Workflow** runtime, so deterministic flows and model-driven agents live in one framework.

ADK is **model-agnostic and deployment-agnostic**. It is optimized for Gemini but works with Claude, OpenAI and local models through connectors, and the same agent runs locally, in a container, on Cloud Run or GKE, or on the managed **Agent Runtime** in Google Cloud's Gemini Enterprise Agent Platform (the service formerly called Vertex AI Agent Engine).

## Highlights

- **Code-first agents.** An `Agent` is a name, a model, an instruction and a list of tools. Plain Python functions with docstrings work as tools.
- **Workflow runtime.** A graph engine for deterministic flows with routing, fan-out and fan-in, loops, retries, state, human-in-the-loop and nested workflows. The older sequential, parallel and loop workflow agents remain as templates.
- **Task API.** Structured agent-to-agent delegation, in multi-turn or single-turn mode, with task agents usable as workflow nodes.
- **Tools.** Pre-built tools, custom functions, OpenAPI specs and MCP tools, plus a tool confirmation flow that gates a tool call on explicit human approval.
- **Built-in dev loop.** `adk run` for a CLI chat, `adk web` for a local development UI, and `adk eval` to score agents against saved eval sets.
- **A2A support.** Agents can expose and consume the [Agent2Agent protocol](/guides/mcp/mcp-vs-a2a) to work with agents built on other frameworks.
- **Agent Config.** Define an agent in configuration without writing code.

## In an AI-assisted workflow

Install it (Python 3.11 or later) and scaffold a project:

```bash
pip install google-adk
adk create my_agent
```

`adk create` writes `my_agent/agent.py`, where the only required element is a `root_agent`. From Google's Python quickstart:

```python
from google.adk.agents.llm_agent import Agent

# Mock tool implementation
def get_current_time(city: str) -> dict:
    """Returns the current time in a specified city."""
    return {"status": "success", "city": city, "time": "10:30 AM"}

root_agent = Agent(
    model='gemini-flash-latest',
    name='root_agent',
    description="Tells the current time in a specified city.",
    instruction="You are a helpful assistant that tells the current time in cities. Use the 'get_current_time' tool for this purpose.",
    tools=[get_current_time],
)
```

Put `GOOGLE_API_KEY` in `my_agent/.env`, then run it:

```bash
adk run my_agent      # interactive CLI
adk web               # local development UI
adk deploy cloud_run --with_ui my_agent
```

Keep agent definitions in your repo so they are reviewable and testable, then deploy the same code to a managed runtime. See [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026) for where ADK fits among the alternatives.

> [!TIP]
> To benchmark another model, swap the `model` argument and leave the agent alone: `LiteLlm(model="openai/gpt-4o")` from `google.adk.models.lite_llm` for LiteLLM-supported providers, or `AnthropicLlm(model="claude-sonnet-4-6")` from `google.adk.models.anthropic_llm` for the Anthropic API.

## Good to know

The ADK framework is open source under Apache-2.0 and free to self-host; you bring your own model provider. What is billed is the cloud it runs on: Cloud Run, GKE and Agent Runtime are paid Google Cloud usage, and Google's docs describe Agent Runtime as a paid service with a no-cost access tier. Treat ADK as free software with a paid managed-deployment path.

Things to watch:

- **Older tutorials use old names.** Many call the managed service Vertex AI Agent Engine and link to google.github.io/adk-docs. The service is now Agent Runtime, and the docs live at adk.dev.
- **`adk web` is a development tool.** Google's quickstart marks the web UI as for development only, not production serving.
- **Python version.** The package requires Python 3.11 or later, per PyPI and the repository README. One quickstart page still says 3.10.
- **Claude routing in Python.** A bare `claude-*` model string routes to Google Cloud's Agent Platform and needs a Google Cloud project. To call the Anthropic API directly, pass an `AnthropicLlm` instance.
- **SDK parity varies.** Feature pages in the docs list which languages and versions support each feature, so check before assuming a Python feature exists in Java or Go.
- **Google Cloud is the paved road.** ADK runs anywhere a container does, but the deploy commands, managed runtime and enterprise integrations target Google Cloud.

Among alternatives, [LangGraph](/tools/langgraph) is the cloud-neutral graph runtime built around checkpointing, the [OpenAI Agents SDK](/tools/openai-agents-sdk) is a smaller handoff-based loop, [CrewAI](/tools/crewai) is faster for role-based crews, and [Pydantic AI](/tools/pydantic-ai) suits typed Python agents. For how a code-first, deploy-to-managed-runtime model compares, see [OpenAI Agents SDK vs. LangGraph](/guides/comparisons/openai-agents-sdk-vs-langgraph).
