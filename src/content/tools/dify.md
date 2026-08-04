---
name: "Dify"
description: "The visual platform for LLM apps and agentic workflows — canvas-built chatflows, RAG pipeline, agent nodes with 50+ tools, and LLMOps, self-hosted via Docker."
date: 2026-06-11
url: "https://dify.ai"
pricing: "freemium"
category: "platform"
repo: "https://github.com/langgenius/dify"
license: "Dify Open Source License (Apache-2.0 + conditions)"
os: ["Web"]
color: "blue"
topics: ["ai-agents-systems", "llm-app-dev"]
tags: ["workflows", "low-code", "agents", "rag", "platform"]
featured: false
alternativeTo: ["n8n", "langchain"]
sameAs:
  - "https://github.com/langgenius/dify"
  - "https://docs.dify.ai"
related: ["guide:n8n-vs-dify", "tool:n8n", "tool:langchain", "guide:how-rag-works", "guide:agent-frameworks-2026"]
summary: "Dify (~145k stars) is the visual answer to LLM app building: a workflow canvas for chatflows and agents, a built-in RAG pipeline from ingestion to retrieval, agent nodes with 50+ tools, hundreds of models via any provider, a prompt IDE, and LLMOps — self-hosted with one docker compose or cloud freemium. License caveat: it's a modified Apache-2.0 with conditions."
faq:
  - q: "What do people build with Dify?"
    a: "Production LLM apps without writing the orchestration: support chatbots over company knowledge (the built-in RAG pipeline), agentic workflows that chain models and 50+ tools on a visual canvas, and internal AI apps exposed via Dify's backend-as-a-service APIs — with logging and annotation (LLMOps) closing the improvement loop."
  - q: "Is Dify really open source?"
    a: "Source-available with conditions, not OSI open source: the Dify Open Source License is Apache-2.0 plus two restrictions — you can't operate it as a multi-tenant service without a commercial license, and the frontend logo/copyright must remain. For single-tenant internal self-hosting (the common case), it behaves like free software."
  - q: "How does Dify compare to n8n?"
    a: "Center of gravity. Dify is AI-native — the canvas exists to build LLM apps, with RAG and prompt tooling first-class. n8n is automation-native — 400+ app integrations with AI nodes added to a general workflow engine. Building an AI product: Dify. Automating business processes that include AI steps: n8n. Full comparison in our n8n vs Dify guide."
---

Dify is the heavyweight of visual LLM-app platforms — ~145k GitHub stars and a self-description that tracks the era: "production-ready platform for agentic workflow development." Its proposition: everything between a model API and a shipped AI product — RAG, agents, prompts, ops — on one canvas, deployable with one `docker compose up`.

## Highlights

- **Visual workflow canvas** — chatflows and agentic workflows assembled from nodes, debugged visually, versioned.
- **RAG pipeline included** — ingestion through retrieval (PDF/PPT and common formats out of the box) without assembling a vector stack by hand.
- **Agent nodes** — Function-calling or ReAct agents with 50+ built-in tools (search, image generation, WolframAlpha…) plus a plugin marketplace of strategies.
- **Every model, one panel** — hundreds of proprietary and open models across dozens of providers, including any OpenAI-compatible endpoint (so [local models](/tools/ollama) plug in).
- **Prompt IDE + LLMOps** — compare models on prompts, then log, annotate, and improve from production traffic.
- **Backend-as-a-Service** — your Dify apps expose APIs, so the visual build embeds into real products.

## In an AI-assisted workflow

```bash
git clone https://github.com/langgenius/dify.git && cd dify/docker
cp .env.example .env && docker compose up -d    # → http://localhost/install
```

The fit: teams that want the AI app *built* more than they want to own its plumbing — prototypes that become products, internal tools, and the "let domain experts iterate on prompts" workflow code-first frameworks can't offer.

> [!WARNING]
> Read the license before building a business on it: Dify's modified Apache-2.0 forbids **multi-tenant** operation without a commercial license and requires keeping frontend branding. Internal single-tenant self-hosting is the cleanly-free case; SaaS-on-Dify is a conversation with LangGenius.

## Good to know

Cloud is freemium (a sandbox tier with message credits, then per-workspace plans); self-hosting is a real multi-service stack (API, worker, Postgres, Redis, vector DB) — budget ops accordingly. v1.0 landed February 2025 with the plugin architecture; the 1.x line iterates steadily. Versus the automation-first alternative: [n8n vs Dify](/guides/comparisons/n8n-vs-dify); versus code-first frameworks: [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026).
