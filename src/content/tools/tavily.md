---
name: "Tavily"
description: "The web-access layer for agents — Search, Extract, Crawl, Map, and Research APIs purpose-built for LLMs, behind one key, with a hosted MCP server."
date: 2026-06-11
url: "https://tavily.com"
pricing: "freemium"
category: "platform"
repo: "https://github.com/tavily-ai/tavily-python"
license: "MIT"
os: ["Web"]
color: "blue"
topics: ["ai-agents-systems"]
tags: ["search", "web-data", "api", "agents", "mcp"]
featured: false
alternativeTo: ["exa", "firecrawl"]
sameAs:
  - "https://github.com/tavily-ai"
  - "https://docs.tavily.com"
  - "https://app.tavily.com"
related: ["web-data-for-ai-agents", "exa", "firecrawl", "jina-reader", "claude-code-mcp-setup", "rag"]
summary: "Tavily packages agent web access as one API: Search tuned for LLM consumption (vendor-claimed 180ms p50), Extract for clean page content, Crawl and Map for site traversal, and a Research endpoint for multi-step investigations — plus SDKs and a hosted MCP server (mcp.tavily.com). Freemium: 1,000 free credits monthly, no card, then pay-as-you-go."
faq:
  - q: "How is Tavily different from Exa and Firecrawl?"
    a: "Breadth-in-one-key versus specialist depth. Exa's center is semantic search quality and entity research (Websets); Firecrawl's is industrial-strength scraping and crawling. Tavily bundles credible versions of search + extract + crawl + research behind a single key and credit pool — the convenience pick for agents that need all of it, with speed as its search pitch."
  - q: "Is Tavily free to start?"
    a: "Yes — the Researcher plan includes 1,000 API credits every month with no credit card; beyond that it's pay-as-you-go per credit or sliding-scale plans. Mind the credit math: advanced search costs 2 credits, and the Research endpoint is dynamic — up to a couple hundred credits for deep runs."
  - q: "How do I use Tavily from Claude Code?"
    a: "Its hosted MCP server: claude mcp add tavily-remote-mcp --transport http https://mcp.tavily.com/mcp/ (OAuth, or append your tvly- API key as a parameter). It exposes the search/extract/map/crawl tools; a local npm server (tavily-mcp) exists too."
---

Tavily's framing is exactly the 2026 need: not "a search engine you can call" but **the web-access layer for agents** — search, extraction, crawling, and multi-step research as one credit pool behind one key, with latency treated as a feature.

## Highlights

- **Search built for agents** — LLM-ready results at basic/advanced depth, with a vendor-claimed 180ms p50 that matters when search sits inside an agent loop.
- **Extract, Crawl, Map** — clean content from URLs, instruction-guided site traversal, and URL discovery: the ingestion half, included.
- **Research endpoint** — multi-step investigations (pro/mini tiers) as a single API call, for when one search isn't an answer.
- **Hosted MCP server** — `mcp.tavily.com/mcp/` makes the whole surface a one-liner in Claude Code and friends.
- **Drop-in ecosystem** — Python/JS SDKs and first-class integrations across OpenAI, Anthropic, LangChain, plus marketplace placements (Databricks, JetBrains).

## In an AI-assisted workflow

```bash
pip install tavily-python     # or: npm i @tavily/core
# client = TavilyClient(api_key="tvly-..."); client.search("…", search_depth="advanced")
```

In agent stacks it's typically *the* web tool: the [agentic-RAG](/guides/concepts/agentic-rag) searcher, the research agent's eyes, the freshness layer RAG over static corpora lacks.

> [!WARNING]
> Same caution as every web tool: fetched pages are untrusted input to your model — [indirect prompt injection](/glossary/prompt-injection) rides in on search results. Treat content as data, and gate any tools that act on it.

## Good to know

The company grew out of open-source GPT Researcher and announced $25M in funding (August 2025, Insight Partners-led per coverage), now claiming 2M+ developers. SDKs and the MCP server are MIT; the API is the product. Credits aren't 1:1 with calls — budget for advanced/research multipliers. Field positioning against [Exa](/tools/exa) and [Firecrawl](/tools/firecrawl): [Getting Web Data into AI Agents](/guides/concepts/web-data-for-ai-agents).
