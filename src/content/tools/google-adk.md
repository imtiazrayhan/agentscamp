---
name: "Google ADK"
title: "Google ADK"
description: "Google's open-source, code-first framework to build, evaluate, and deploy AI agents. Python and Java, model-agnostic, deploys to Vertex AI Agent Engine."
url: "https://google.github.io/adk-docs/"
date: 2026-06-24
pricing: "open-source"
category: "sdk"
repo: "https://github.com/google/adk-python"
license: "Apache-2.0"
sameAs:
  - "https://github.com/google/adk-python"
  - "https://github.com/google/adk-java"
  - "https://google.github.io/adk-docs/"
color: "yellow"
topics: ["ai-agents-systems", "llm-app-dev"]
tags: ["agents", "python", "java", "google", "multi-agent", "open-source"]
featured: false
alternativeTo: ["langgraph", "crewai", "openai-agents-sdk", "autogen", "pydantic-ai"]
summary: "Google ADK (Agent Development Kit) is an open-source, code-first framework for building, evaluating, and deploying AI agents in Python (Java also available). It's model-agnostic and deployment-agnostic — run agents locally, on Cloud Run, or in Vertex AI Agent Engine, which it powers."
related: ["agent-frameworks-2026", "openai-agents-sdk-vs-langgraph", "multi-agent-orchestration", "mcp-vs-a2a", "production-tool-calling"]
faq:
  - q: "What is Google ADK?"
    a: "Google ADK (Agent Development Kit) is an open-source, code-first framework for building, evaluating, and deploying AI agents. You define agents and their tools in Python (Java is also available), compose them into multi-agent systems, evaluate runs, and deploy locally, to Cloud Run, or to Vertex AI Agent Engine. It is model-agnostic — it integrates tightly with Gemini but works with other models via adapters like LiteLLM."
  - q: "Is Google ADK free and open source?"
    a: "Yes — ADK is open source under the Apache-2.0 license and free to use and self-host. You bring your own model provider. Running agents on Google Cloud (Cloud Run, GKE, or the managed Vertex AI Agent Engine) is billed as normal cloud usage, so the framework is free while managed deployment is paid. Confirm current pricing on the official site."
  - q: "How does ADK compare to LangGraph?"
    a: "Both are code-first frameworks for stateful, multi-agent systems. ADK is Google's framework, available in Python and Java, model-agnostic, and designed to deploy cleanly to Cloud Run and the managed Vertex AI Agent Engine. LangGraph centers on an explicit graph of nodes and edges with checkpointing and resumability. Choose ADK if you want first-class Google Cloud deployment and built-in evaluation; choose LangGraph for fine-grained graph control."
---

Google ADK (Agent Development Kit) is **Google's open-source, code-first framework for building, evaluating, and deploying AI agents**. You define agents and the tools they can call directly in code, compose them into multi-agent systems, and ship them to production. It is available in Python (the primary SDK) and Java, with the same concepts across both.

ADK is **model-agnostic and deployment-agnostic**. It integrates tightly with Gemini but works with other models through adapters such as LiteLLM (Anthropic Claude, local models via Ollama or vLLM, and more), and the same agent runs locally, on Cloud Run or GKE, or in the managed **Vertex AI Agent Engine** — which ADK powers. It is aimed at developers who want production agents rather than notebook prototypes, and it pairs well with an AI-assisted workflow where the agent definitions live in your repo as reviewable code.

## Highlights

- **Code-first agents** — define agents, instructions, and tools in Python or Java; the agent logic is plain, version-controlled code rather than a no-code graph.
- **Multi-agent composition** — assemble specialized sub-agents that delegate and collaborate, with workflow primitives for sequential, parallel, and loop orchestration.
- **Built-in evaluation** — systematically test agent trajectories and final responses against curated cases, so quality changes are measured, not guessed.
- **Deploy anywhere** — run locally for development, then deploy to Cloud Run, GKE, or the fully managed Vertex AI Agent Engine without rewriting the agent.

## In an AI-assisted workflow

Keep agent definitions in your repo so they are reviewable and testable, then deploy the same code to a managed runtime. See [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026) for where ADK fits among the alternatives.

```python
from google.adk.agents import Agent

root_agent = Agent(
    name="research_agent",
    model="gemini-2.5-flash",
    instruction="Answer questions using the provided tools.",
    tools=[search_tool],
)
```

> [!TIP]
> ADK is model-agnostic — you can swap Gemini for Claude or a local model via LiteLLM without changing your agent structure, which makes it easy to benchmark models before committing.

## Good to know

The ADK framework is open source under Apache-2.0 and free to self-host; you bring your own model provider. What is billed is the cloud it runs on — Cloud Run, GKE, or the managed Vertex AI Agent Engine are paid Google Cloud usage. So treat ADK as free software with a paid managed-deployment path; confirm current details and quotas on the official site. For how this code-first, deploy-to-managed-runtime model compares to other agent SDKs, see [OpenAI Agents SDK vs. LangGraph](/guides/comparisons/openai-agents-sdk-vs-langgraph).
