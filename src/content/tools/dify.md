---
name: "Dify"
description: "A visual platform for LLM apps and agentic workflows: canvas-built workflows, a RAG pipeline, sandboxed agents and LLMOps, self-hosted via Docker Compose."
date: 2026-06-11
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://dify.ai"
pricing: "freemium"
category: "platform"
repo: "https://github.com/langgenius/dify"
license: "Dify Open Source License (Apache-2.0 + conditions)"
os: ["Web"]
color: "blue"
topics: ["ai-agents-systems", "llm-app-dev"]
audience: ["ai-engineers"]
tags: ["workflows", "low-code", "agents", "rag", "platform"]
featured: false
alternativeTo: ["n8n", "langchain"]
sameAs:
  - "https://github.com/langgenius/dify"
  - "https://docs.dify.ai"
related: ["guide:n8n-vs-dify", "tool:n8n", "tool:langchain", "guide:how-rag-works", "guide:agent-frameworks-2026"]
summary: "Dify is a visual platform for building LLM apps: a workflow canvas, a built-in RAG pipeline, agents that run in their own sandbox, a prompt IDE and LLMOps, with APIs for every app. Self-host it with Docker Compose or use Dify Cloud, which has a free Sandbox plan. The license is a modified Apache-2.0 that restricts multi-tenant use and logo removal."
faq:
  - q: "What do people build with Dify?"
    a: "LLM apps without hand-written orchestration: support chatbots over company knowledge using the built-in RAG pipeline, agentic workflows that chain models and tools on a visual canvas, and internal AI apps exposed through Dify's backend-as-a-service APIs, with logging and annotation closing the improvement loop."
  - q: "Is Dify really open source?"
    a: "Source-available with conditions, not OSI open source. The Dify Open Source License is Apache-2.0 plus two restrictions: you may not use the source to operate a multi-tenant environment (one tenant is one workspace) without written authorization, and you may not remove or modify the logo or copyright information in the frontend. For single-workspace internal self-hosting it behaves like free software."
  - q: "How much does Dify Cloud cost?"
    a: "As of November 2026, Dify's pricing page lists Sandbox as free with 200 message credits, 1 member, 5 apps and 50 knowledge documents; Professional at $590 per workspace per year with 5,000 message credits a month, 3 members and 50 apps; and Team at $1,590 per workspace per year with 10,000 credits a month, 50 members and 200 apps. Those are the annual-billing prices, which Dify says save 17%. Self-hosting the Community edition is free."
  - q: "How does Dify compare to n8n?"
    a: "Center of gravity. Dify is AI-native: the canvas exists to build LLM apps, with RAG and prompt tooling first-class. n8n is automation-native: a general workflow engine with a large library of app integrations and AI nodes added. Building an AI product: Dify. Automating business processes that include AI steps: n8n. Full comparison in our n8n vs Dify guide."
---

[Dify](https://dify.ai) is a visual platform for building LLM apps, made by LangGenius. Its proposition is everything between a model API and a shipped AI product (workflows, RAG, agents, prompts, monitoring) on one canvas, running on Dify Cloud or on your own machine with Docker Compose. The repository has about 162,000 GitHub stars as of November 2026.

## Highlights

- **Visual workflow canvas.** Build and test workflows and chatflows from nodes, including human-in-the-loop approval steps.
- **RAG pipeline included.** Ingestion through retrieval, with text extraction from PDFs, PPTs and other common formats, so you do not assemble a vector stack by hand.
- **Agents with their own sandbox.** Per the README, agents run commands, install software and handle files, and connect to tools from the Dify Marketplace, MCP servers or your own APIs. An agent can be a chat app or a step in a workflow.
- **Broad model support.** Hundreds of proprietary and open models from dozens of providers, including any OpenAI-API-compatible endpoint (so [local models](/tools/ollama) plug in).
- **Prompt IDE and LLMOps.** Compare models on a prompt, then monitor logs and improve from production data and annotations.
- **Backend-as-a-Service.** Everything you build is exposed through APIs, so the visual build embeds into a real product.

## In an AI-assisted workflow

Self-hosting needs at least 2 CPU cores and 4 GiB of RAM, plus Docker with Compose v2.35.0 or later. The README's quick start:

```bash
git clone https://github.com/langgenius/dify.git && cd dify/docker
cp .env.example .env
openssl rand -hex 32   # paste the value into DIFY_AGENT_LOCAL_SANDBOX_AUTH_TOKEN in .env
docker compose up -d
docker compose ps --all   # then open http://localhost/install
```

The fit: teams that want the AI app *built* more than they want to own its plumbing. That covers prototypes that become products, internal tools, and letting domain experts iterate on prompts, which code-first frameworks do not offer.

> [!WARNING]
> Read the license before building a business on it: Dify's modified Apache-2.0 forbids operating a **multi-tenant** environment without written authorization and requires keeping the frontend logo and copyright notice. Internal single-workspace self-hosting is the cleanly free case; SaaS-on-Dify needs a commercial license from LangGenius.

## Pricing

As of November 2026, Dify's pricing page lists these Dify Cloud plans, with paid plans shown at annual billing (which Dify says saves 17%):

| Plan | Price | Message credits | Members | Apps | Knowledge documents |
| --- | --- | --- | --- | --- | --- |
| Sandbox | Free | 200 | 1 | 5 | 50 (50MB storage) |
| Professional | $590 per workspace per year | 5,000 a month | 3 | 50 | 500 (5GB) |
| Team | $1,590 per workspace per year | 10,000 a month | 50 | 200 | 1,000 (20GB) |

Message credits pay for Dify-provided model access; once they run out you switch to your own provider API key. Sandbox also limits log history to 30 days and the Dify API to 5,000 calls a month, limits the paid plans remove.

For self-hosting, the **Community** edition is free with a single workspace under the Dify Open Source License. **Enterprise** is custom-priced and adds a commercial license, multiple workspaces, SSO and vendor support.

## Good to know

**Release pace.** Dify 1.20.0 shipped on November 18, 2026, adding trace export to any OpenTelemetry collector, malware scanning of uploaded knowledge files and personal access tokens for the Dify API. Minor versions land roughly every two to three weeks, some with database migrations, so read the upgrade guide before you pull.

**Self-hosting is a real stack.** `docker compose up` starts a set of services, not one container. Budget operations time for upgrades, backups and the `.env` settings that change between releases.

**The single-workspace limit is the catch for agencies.** The free Community edition gives you one workspace, and the license bars multi-tenant use. Serving several clients from one install means an Enterprise conversation.

**Alternatives.** [n8n](/tools/n8n) is the automation-first choice when AI is one step among many business integrations; see [n8n vs Dify](/guides/comparisons/n8n-vs-dify). [Flowise](/tools/flowise) is another open-source visual builder for LLM flows. If your team would rather write the orchestration, [LangChain](/tools/langchain) and the options in [Agent Frameworks in 2026](/guides/concepts/agent-frameworks-2026) trade the canvas for code-level control.
