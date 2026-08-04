---
name: "Mastra"
title: "Mastra"
description: "An open-source TypeScript framework for building AI agents, workflows, RAG, and tool-calling, with memory, model routing, and built-in observability."
url: "https://mastra.ai"
date: 2026-06-24
pricing: "open-source"
category: "sdk"
repo: "https://github.com/mastra-ai/mastra"
license: "Apache-2.0"
sameAs: ["https://github.com/mastra-ai/mastra", "https://mastra.ai/docs", "https://x.com/mastra_ai"]
color: "blue"
topics: ["ai-agents-systems", "llm-app-dev"]
tags: ["typescript", "agents", "workflows", "rag", "open-source"]
featured: false
alternativeTo: ["langgraph", "crewai", "vercel-ai-sdk", "openai-agents-sdk", "langchain"]
summary: "Mastra is an open-source TypeScript framework for building AI agents, workflows, RAG, and tool-calling, from the team behind Gatsby. It targets JavaScript/TypeScript engineers who want typed agents, graph-based workflows, memory, and observability in one stack instead of dropping to Python."
related: ["guide:agent-frameworks-2026", "guide:langgraph-vs-crewai", "guide:building-multi-step-workflows", "guide:multi-agent-orchestration", "guide:production-tool-calling"]
faq:
  - q: "What is Mastra?"
    a: "Mastra is an open-source TypeScript framework for building AI agents, workflows, RAG, and tool-calling, built by the team behind Gatsby. It bundles typed agents, a graph-based workflow engine, agent memory, model routing across many providers, and built-in observability so JavaScript/TypeScript engineers can build agentic apps without dropping to Python."
  - q: "Is Mastra free?"
    a: "Mastra's core framework is open source under Apache-2.0 and free to self-host (deploy to Node.js, Vercel, Cloudflare, Netlify, or your own infra). The optional Mastra Platform is a commercial hosted offering with a free Starter tier and paid usage-metered tiers — confirm current pricing on the official site."
  - q: "How does Mastra compare to LangGraph?"
    a: "Both build controllable, multi-step agents, but Mastra is TypeScript-native and ships agents, workflows, memory, and observability as one framework, while LangGraph is a Python-first (with JS port) low-level graph library focused on explicit state machines. If your stack is Node/TypeScript, Mastra keeps you in one language; LangGraph is the more common choice in Python shops."
---

Mastra is an **open-source TypeScript framework for building AI agents, workflows, RAG, and tool-calling**, from the team behind Gatsby (Sam Bhagwat and co-founders). It packages the primitives an agentic app needs — typed agents, a graph-based workflow engine, agent memory, model routing, and observability — into one modular framework so you stay in TypeScript instead of reaching for a separate Python stack.

It is aimed at JavaScript/TypeScript engineers building production agents and AI features: you define an agent with instructions, a model, and tools in one place, then compose deterministic multi-step workflows around it. That makes it a natural fit when your app, your tooling, and your AI logic all live in the same Node/TypeScript codebase.

## Highlights

- **Typed agents** — declare instructions, model, tools, and runtime behavior in a single typed object; the agent reasons over tools and iterates until it returns a final answer.
- **Graph-based workflows** — orchestrate multi-step processes with explicit control flow via `.then()`, `.branch()`, and `.parallel()`, separate from open-ended agent loops.
- **Memory and RAG** — built-in conversation history plus semantic/retrieval memory for grounding agents in your own data.
- **Model routing and observability** — connect to many model providers through one interface, with built-in scorers and tracing to measure and refine agent behavior.

## In an AI-assisted workflow

Scaffold a project, define an agent, and call it from your TypeScript app. See where it sits among peers in [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026).

```bash
npm create mastra@latest
# then, in code:
# import { Agent } from "@mastra/core/agent";
# const agent = new Agent({ name: "support", instructions: "...", model, tools });
# const res = await agent.generate("Summarize this ticket");
```

> [!TIP]
> Reach for Mastra when your stack is already TypeScript and you want agents, workflows, memory, and tracing in one framework — rather than splitting agent logic into a separate Python service.

## Good to know

Mastra's core framework is open source under Apache-2.0 and free to self-host; code under `ee/` directories is source-available under the Mastra Enterprise License, and the hosted Mastra Platform is a separate commercial offering with a free Starter tier and paid usage-based tiers. Confirm current pricing and license terms on the official site. For broader framework trade-offs, see [LangGraph vs. CrewAI](/guides/comparisons/langgraph-vs-crewai).
