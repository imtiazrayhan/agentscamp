---
name: "Flowise"
title: "Flowise"
description: "Open-source, low-code visual builder for LLM apps and AI agents — drag-and-drop to assemble chains, agents, and RAG; self-host or use Flowise Cloud."
url: "https://flowiseai.com"
date: 2026-06-24
pricing: "open-source"
category: "platform"
repo: "https://github.com/FlowiseAI/Flowise"
license: "Apache-2.0 (Community Edition; /enterprise dir is commercial)"
os: ["Web"]
color: "green"
topics: ["ai-agents-systems", "llm-app-dev"]
tags: ["low-code", "visual", "agents", "rag", "workflow"]
featured: false
alternativeTo: ["dify", "n8n", "langchain", "langgraph"]
sameAs:
  - "https://github.com/FlowiseAI/Flowise"
  - "https://docs.flowiseai.com"
  - "https://flowiseai.com"
related: ["guide:n8n-vs-dify", "guide:agent-frameworks-2026", "guide:best-ai-app-builders-2026", "guide:building-multi-step-workflows"]
summary: "Flowise is an open-source, low-code platform for building LLM apps and AI agents on a drag-and-drop canvas. You wire nodes into chains, agents, and RAG flows, then self-host the Apache-2.0 core or run Flowise Cloud. Built flows expose an API and embed widget, so prototypes ship as real product surfaces."
faq:
  - q: "What is Flowise?"
    a: "Flowise is an open-source, low-code visual builder for LLM apps and AI agents. You assemble chains, agentic systems, and RAG pipelines by dragging and connecting nodes on a canvas instead of writing orchestration code, then run the result locally, self-hosted, or on Flowise Cloud. Every flow exposes an API and an embeddable chat widget."
  - q: "Is Flowise free, and what's the license?"
    a: "The Community Edition is free and open source under Apache-2.0 — you can self-host, modify, and use it commercially. A separate Enterprise Edition lives in the repo's /enterprise directory and is governed by a commercial license, staying inactive without a license key. Flowise Cloud is a paid managed option (a free tier plus paid plans starting around $35/month — confirm current pricing on the official site)."
  - q: "How does Flowise compare to Dify?"
    a: "Both are visual LLM-app platforms. Flowise's core is cleanly Apache-2.0 (only the enterprise add-ons are commercial), which makes single-tenant and SaaS self-hosting straightforward. Dify ships a broader product surface (built-in RAG pipeline, prompt IDE, LLMOps) under a modified Apache-2.0 that restricts multi-tenant operation. Pick Flowise for a permissively licensed agent/flow builder; pick Dify for a heavier all-in-one app platform."
---

Flowise is a **low-code, visual builder for LLM apps and AI agents**. Instead of hand-writing orchestration, you drag nodes onto a canvas and connect them into chains, agentic systems, and retrieval-augmented (RAG) flows — its homepage positions it plainly as "Build AI Agents, Visually," an open-source agentic-systems development platform.

It targets developers and technically-minded builders who want to prototype and ship LLM features fast without wiring every model call, memory store, and tool by hand. Run it locally with one npm command, self-host the Apache-2.0 core on your own infrastructure, or use the managed Flowise Cloud. Because every flow is exposed as an API and an embeddable widget, Flowise fits an AI-assisted workflow as the visual layer between a model provider and a real product surface.

## Highlights

- **Drag-and-drop flow builder** — assemble logic visually on a canvas, inspect each node's input/output, and iterate without redeploying code.
- **Agents, RAG, and chains as nodes** — build multi-agent systems, retrieval pipelines over your documents, and tool-using chains from composable building blocks.
- **Self-hostable with an API** — own the deployment, then call any flow over its REST API or drop in the embed widget to put it in an app.
- **Large integration ecosystem** — connect many model providers, vector stores, document loaders, and tools, so flows reach real data and services.

## In an AI-assisted workflow

Flowise sits between your model provider and your product: build a flow visually, test it on the canvas, then call its endpoint from your app. Spin it up locally in seconds:

```bash
npx flowise start
# open http://localhost:3000
```

For where this slots against automation-first and app-first tools, see [n8n vs. Dify](/guides/comparisons/n8n-vs-dify).

> [!TIP]
> Prototype the flow in the visual editor, then promote it by calling its generated API from your codebase — the canvas stays the source of truth while your app just consumes the endpoint.

## Good to know

License matters here. The Community Edition is **Apache-2.0** — permissive enough to self-host, modify, and use commercially, including running it as a service. A separate Enterprise Edition ships inside the repo's `/enterprise` directory under a commercial license and stays inactive without a license key, so confirm which edition you're deploying before building a SaaS on it. Flowise Cloud is the paid managed path (a free tier plus paid plans starting around $35/month — verify current pricing on the official site). For how it stacks up against other visual builders, see [Best AI App Builders (2026)](/guides/comparisons/best-ai-app-builders-2026).
</content>
</invoke>
