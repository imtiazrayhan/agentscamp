---
name: "n8n"
description: "Fair-code workflow automation with native AI: a visual canvas plus code, 1,500+ integrations, and LangChain agent nodes; self-host free or cloud per-run."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://n8n.io"
pricing: "freemium"
category: "platform"
repo: "https://github.com/n8n-io/n8n"
license: "Sustainable Use License (fair-code)"
os: ["Web", "macOS", "Windows", "Linux"]
color: "orange"
topics: ["ai-agents-systems"]
tags: ["automation", "workflows", "agents", "integrations", "low-code"]
featured: false
alternativeTo: ["dify"]
sameAs:
  - "https://github.com/n8n-io/n8n"
  - "https://docs.n8n.io"
  - "https://blog.n8n.io"
related: ["guide:n8n-vs-dify", "tool:dify", "tool:langchain", "glossary:human-in-the-loop", "guide:agent-frameworks-2026"]
summary: "n8n (~212k GitHub stars as of November 2026) is the automation platform that grew an AI brain: a visual workflow canvas plus code, 1,500+ app integrations, and AI agent nodes — built on LangChain — with memory backends and vector-store nodes for RAG. Fair-code licensed: free self-hosting for internal use, EUR-priced cloud billed per execution."
faq:
  - q: "What makes n8n good for AI workflows specifically?"
    a: "It puts agents inside real automations. The AI Agent node is built on LangChain and now always runs as a Tools Agent (the older agent-type setting was deprecated in n8n 1.82.0), with conversation memory (Redis/Postgres/Zep), vector-store nodes (Pinecone, Qdrant, Weaviate…) for RAG, and every major model provider — and crucially, 1,500+ app integrations as the agent's hands: the AI step slots between the Gmail trigger and the Slack action."
  - q: "Is n8n open source?"
    a: "Fair-code, not OSI open source. The Sustainable Use License allows free use and modification for internal business purposes (commercial included) and personal use — but you can't sell n8n hosting or embed it in a paid product without an enterprise/embed license, and .ee.-flagged files in the public repo require enterprise licensing."
  - q: "What changed in n8n 2.0?"
    a: "A security-hardening major (December 2025): Code nodes run in isolated task runners and lose env-var access by default, arbitrary-command nodes ship disabled, plus a Publish-vs-Save deployment model and large performance work. It's breaking for older self-hosted setups — run the migration report before upgrading."
audience: ["ai-engineers", "sales", "founders"]
---

n8n attacks AI from the opposite direction of the AI-native platforms: it was already the automation layer — ~212k GitHub stars as of November 2026, 1,500+ integrations, a decade of workflow muscle — and then gave its workflows a brain. The result is distinctive: **agents with hands**, where the AI node sits between real triggers and real actions.

## Highlights

- **AI Agent node on LangChain** — one agent node that works as a Tools Agent: connect a chat model and tool sub-nodes and it decides which to call. The agent-type setting (ReAct, Plan-and-Execute, SQL and others) was deprecated in n8n 1.82.0 and its v1 node is due for removal in n8n 3.0; for SQL work the docs point to a Postgres or MySQL tool sub-node.
- **The integration moat as a toolset** — 1,500+ integrations and 9,000+ workflow templates double as agent tools: the agent that reads the ticket, queries the DB, and posts to Slack is three nodes.
- **RAG without leaving the canvas** — vector-store nodes (Pinecone, [Qdrant](/tools/qdrant), Chroma, Weaviate), document loaders, embeddings, retrievers.
- **Memory backends** — Simple to Redis/Postgres/MongoDB/Zep for stateful conversations.
- **Visual + code** — the canvas for structure, Code nodes for the parts that are genuinely code (now sandboxed in 2.0's task runners).
- **Self-host or cloud** — `npx n8n` / Docker for free internal self-hosting; cloud priced per **execution** (unlimited steps and users), EUR-denominated.

## In an AI-assisted workflow

```bash
docker run -it --rm -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
# editor at localhost:5678 — drop an AI Agent node into any workflow
```

The signature pattern: **automation-first, intelligence where it pays** — a deterministic pipeline with one judgment step (classify, draft, decide) handled by an agent node, with [human approval](/glossary/human-in-the-loop) nodes guarding the consequential branches.

> [!NOTE]
> License clarity: free for internal business use (including commercial), self-hosted; *reselling* n8n — hosting it for customers, embedding in paid products — needs a license. The `.ee.` files in the repo are enterprise-licensed despite being public.

## Good to know

The October 2025 Series C ($180M, Accel-led, $2.5B valuation, NVIDIA's venture arm participating) made n8n the automation category's AI flagship; 2.0 followed with security-by-default. Plans, as of November 2026 from n8n.io/pricing: Starter €20/mo and Pro €50/mo are hosted by n8n, and Business €667/mo is self-hosted only, all billed annually and metered by workflow execution with unlimited steps and users; Enterprise is sales-led, hosted or self-hosted. The head-to-head with the AI-native canvas: [n8n vs Dify](/guides/comparisons/n8n-vs-dify).
