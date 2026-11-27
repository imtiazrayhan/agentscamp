---
name: "Agno"
title: "Agno"
description: "An open-source Python framework for agents, teams and workflows, with AgentOS to run them as a service in your own cloud. Formerly Phidata."
url: "https://agno.com"
date: 2026-06-24
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/agno-agi/agno"
license: "Apache-2.0"
sameAs: ["https://github.com/agno-agi/agno", "https://docs.agno.com", "https://github.com/agno-agi"]
color: "green"
topics: ["ai-agents-systems", "llm-app-dev"]
audience: ["ai-engineers"]
tags: ["python", "agents", "multi-agent", "memory", "framework"]
featured: false
alternativeTo: ["crewai", "langgraph", "autogen", "pydantic-ai", "langchain"]
summary: "Agno (formerly Phidata) is an Apache-2.0 Python framework for building agents, teams and workflows with memory, knowledge and tools. AgentOS, also open source, runs them as a service with an API, an MCP server, tracing and scheduling in your own infrastructure. The paid part is the hosted control plane used to operate live deployments."
related: ["guide:agent-frameworks-2026", "guide:langgraph-vs-crewai", "guide:multi-agent-orchestration", "guide:agent-memory-architecture", "guide:agentic-rag"]
faq:
  - q: "Is Agno free?"
    a: "The SDK and the AgentOS runtime are open source under Apache-2.0 and free at any scale; you bring your own model keys, database and hosting. As of November 2026, the hosted control plane is free against a local instance, and Pro costs $150 a month for three team seats and one live connection, with extra seats at $30 and extra connections at $95 a month."
  - q: "What is the difference between Agno and AgentOS?"
    a: "Agno is the SDK you import to define agents, teams and workflows. AgentOS is the runtime, installed with the agno[os] extra, that serves them over HTTP and MCP with session storage, memory, tracing, scheduling, human approvals and role-based access. It runs as a container in your infrastructure and listens on port 7777 by default."
  - q: "Is Agno the same as Phidata?"
    a: "Yes, it is the same project under a new name. The old phidatahq/phidata GitHub repository now redirects to agno-agi/agno. Code written for Phidata or for Agno 1.x and 2.x will need changes: the current major version is 3, first released on August 24, 2026."
  - q: "Does Agno send telemetry?"
    a: "Yes, by default. Its README says Agno sends a telemetry event per agent so the team knows which model providers to prioritize, and that prompts, messages and outputs are never sent. Set AGNO_TELEMETRY=false to turn it off."
---

Agno is an open-source **Python framework for building agents**, plus a runtime for running them. It was formerly called **Phidata**; the old repository now redirects to `agno-agi/agno`. You define Agents, group them into Teams, or wire them into step-based Workflows, then serve them with **AgentOS**. The project now describes itself as a "self-managing agent platform", and the repository has about 43,000 GitHub stars as of November 2026.

It suits Python teams that want the framework and the production runtime from one project, running in their own cloud with their own database.

## Highlights

- **Agents, Teams, Workflows.** An Agent is a model with tools and instructions. A Team has a leader that delegates to members (coordinate, route, broadcast or tasks mode) and can nest other teams. Workflows control execution with routing, conditions, loops and parallel steps.
- **Memory and knowledge.** Agents remember users across sessions and retrieve from your data, backed by a database you choose (SQLite and PostgreSQL appear throughout the docs).
- **Model-agnostic.** The docs cover dozens of providers across native APIs, gateways, local runtimes and cloud platforms. A model is either a string such as `"openai:gpt-5.5"` or a provider class when you need custom parameters.
- **AgentOS runtime.** Serves agents over a REST API and an MCP server, with authentication, role-based access, tracing, scheduling, human approval of sensitive actions and durable background execution.
- **Coding-agent harnesses.** AgentOS can run Claude and Codex in sandboxes as services, and the docs are exposed as an MCP server for your own coding agent.
- **Your infrastructure.** AgentOS runs as a container in your VPC, with templates for Docker, Railway, AWS, GCP, Azure, Fly.io and Render. The hosted UI at os.agno.com reads from your runtime in the browser.

## In an AI-assisted workflow

Install the SDK and a provider (Python 3.9 or newer), then run an agent. This is the first example from Agno's setup docs:

```bash
pip install -U agno openai
export OPENAI_API_KEY="your-api-key"
```

```python
from pathlib import Path

from agno.agent import Agent
from agno.tools.workspace import Workspace

folder = Path(__file__).parent

sorting_hat = Agent(
    name="Sorting Hat",
    model="openai:gpt-5.5",
    tools=[Workspace(root=str(folder), allowed=["read", "list", "search"])],
    instructions="Walk the folder, figure out what's there, and propose a clean organization.",
    markdown=True,
)

sorting_hat.print_response(f"Inventory and organize {folder}", stream=True)
```

To serve an agent over HTTP with sessions, memory and tracing, install the runtime with `pip install -U 'agno[os]'`, wrap your agents in `AgentOS(agents=[...], tracing=True)`, and call `agent_os.serve()`. The service starts at `http://localhost:7777`, with an OpenAPI spec at `/docs`.

Give your coding assistant the docs before you ask it to write Agno code:

```bash
claude mcp add --transport http agno-docs https://docs.agno.com/mcp
```

> [!TIP]
> Start with one Agent and move to a Team only when responsibilities clearly split. Agno's own docs note that a team's leader and members make separate model calls, which adds latency, token usage and coordination state.

## Pricing

The SDK and AgentOS are free and open source, and serving agents costs nothing on any plan; your costs are model tokens and your own hosting.

Agno charges for its hosted control plane. As of November 2026, from agno.com/pricing, the Free plan connects the control plane to AgentOS instances on your own machine. Pro, as of November 2026, is $150 a month for three team seats and one live connection (a deployed AgentOS registered with the control plane), with extra seats at $30 a month and extra live connections at $95 a month, and a 14-day free trial. There are no per-event, token or egress fees. Enterprise is custom-priced and includes SAML SSO, custom RBAC and end-user identity; SAML SSO is an add-on for Pro.

## Good to know

The API moves quickly. Version 3.0.0 shipped on August 24, 2026 and the latest release is v3.2.1 (November 17, 2026), so tutorials written for Phidata, Agno 1.x or 2.x often use imports and parameters that have changed. Check examples against the current docs, or connect the docs MCP server and let your coding agent do it.

The project's scope has also widened, from an agent SDK to a platform with a "Company OS" for assigning agents ongoing responsibilities. If you only want a library for one agent loop, that is more surface than you need. Telemetry is on by default and is disabled with `AGNO_TELEMETRY=false`.

Compared with the alternatives: [LangGraph](/tools/langgraph) gives you an explicit state graph and finer control over each transition; [CrewAI](/tools/crewai) centres on role-and-goal crews; [Pydantic AI](/tools/pydantic-ai) is a smaller, type-first library with no bundled runtime. Agno's distinguishing piece is AgentOS: the serving, tracing and scheduling layer comes with the framework. [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026) places it among the rest, and [Multi-Agent Orchestration](/guides/advanced/multi-agent-orchestration) covers the coordination patterns.
