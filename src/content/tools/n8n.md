---
name: "n8n"
description: "Fair-code workflow automation with native AI: a visual canvas plus code, 400+ integrations, and LangChain agent nodes; self-host free or cloud per-run."
date: 2026-06-11
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
related: ["n8n-vs-dify", "dify", "langchain", "human-in-the-loop", "agent-frameworks-2026"]
summary: "n8n (~192k stars) is the automation platform that grew an AI brain: a visual workflow canvas (with code when you want it), 400+ app integrations, and AI agent nodes — built on LangChain — with memory backends, vector-store nodes for RAG, and broad model support. Fair-code licensed: free self-hosting for internal use, EUR-priced cloud billed per execution."
faq:
  - q: "What makes n8n good for AI workflows specifically?"
    a: "It puts agents inside real automations. The AI Agent node (Tools, ReAct, Plan-and-Execute, SQL variants) is built on LangChain, with conversation memory (Redis/Postgres/Zep), vector-store nodes (Pinecone, Qdrant, Weaviate…) for RAG, and every major model provider — and crucially, 400+ app integrations as the agent's hands: the AI step slots between the Gmail trigger and the Slack action."
  - q: "Is n8n open source?"
    a: "Fair-code, not OSI open source. The Sustainable Use License allows free use and modification for internal business purposes (commercial included) and personal use — but you can't sell n8n hosting or embed it in a paid product without an enterprise/embed license, and .ee.-flagged files in the public repo require enterprise licensing."
  - q: "What changed in n8n 2.0?"
    a: "A security-hardening major (December 2025): Code nodes run in isolated task runners and lose env-var access by default, arbitrary-command nodes ship disabled, plus a Publish-vs-Save deployment model and large performance work. It's breaking for older self-hosted setups — run the migration report before upgrading."
---

n8n attacks AI from the opposite direction of the AI-native platforms: it was already the automation layer — ~192k stars, 400+ integrations, a decade of workflow muscle — and then gave its workflows a brain. The result is distinctive: **agents with hands**, where the AI node sits between real triggers and real actions.

## Highlights

- **AI Agent nodes on LangChain** — Tools, Conversational, ReAct, Plan-and-Execute, and SQL agent types as canvas nodes, with chains for Q&A and summarization.
- **The integration moat as a toolset** — 400+ apps and 900+ templates double as agent tools: the agent that reads the ticket, queries the DB, and posts to Slack is three nodes.
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

The October 2025 Series C ($180M, Accel-led, $2.5B valuation, NVIDIA's venture arm participating) made n8n the automation category's AI flagship; 2.0 followed with security-by-default. Cloud "AI credits" are starter allowances — you bring model keys. The head-to-head with the AI-native canvas: [n8n vs Dify](/guides/comparisons/n8n-vs-dify).
