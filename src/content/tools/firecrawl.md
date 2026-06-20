---
name: "Firecrawl"
title: "Firecrawl"
description: "The API to search, scrape, and crawl the web for AI — clean Markdown out of any site, LLM-powered extraction, and a first-class MCP server."
date: 2026-06-11
url: "https://firecrawl.dev"
pricing: "freemium"
category: "platform"
repo: "https://github.com/firecrawl/firecrawl"
license: "AGPL-3.0"
os: ["Web"]
color: "orange"
topics: ["mcp"]
tags: ["scraping", "crawling", "web-data", "mcp", "api", "agents"]
featured: false
sameAs:
  - "https://github.com/firecrawl/firecrawl"
  - "https://docs.firecrawl.dev"
  - "https://www.npmjs.com/package/firecrawl-mcp"
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "exa", "data-engineer", "how-rag-works", "chunking-strategy-optimizer"]
alternativeTo: ["exa", "jina-reader", "tavily", "browser-use"]
summary: "Firecrawl (~131k GitHub stars) turns the messy web into agent-ready data: /scrape renders any page to clean Markdown, /crawl walks whole sites, /map discovers URLs, /search queries the web, and /extract pulls structured data with an LLM. Open-source core (AGPL-3.0) with a hosted API, and an MIT MCP server installable into Claude Code as a hosted remote or local npx server."
faq:
  - q: "What does Firecrawl do that plain fetching doesn't?"
    a: "It handles the web's hostile parts — JavaScript rendering, anti-bot friction, pagination, layout noise — and returns clean Markdown or structured JSON ready for an LLM. One endpoint scrapes a page; /crawl does entire sites with depth and limit controls; /extract turns 'get every product's name and price' into a schema-validated result."
  - q: "How do I add Firecrawl to Claude Code?"
    a: "Two documented options. Local: claude mcp add firecrawl -e FIRECRAWL_API_KEY=your-key -- npx -y firecrawl-mcp. Hosted remote: claude mcp add --transport http firecrawl https://mcp.firecrawl.dev/your-api-key/v2/mcp — note the key is embedded in that URL, so treat the whole URL as a secret."
  - q: "Is Firecrawl open source?"
    a: "The core is AGPL-3.0 and self-hostable (SDKs and some components are MIT, as is the MCP server). The hosted cloud adds proprietary niceties like Fire-Engine. AGPL matters if you modify and operate it as a service — most teams just use the hosted API with its free monthly credits."
---

Firecrawl is the ingestion workhorse of the agent stack: give it a URL and get back **clean Markdown**; give it a domain and get back the whole site, crawled and converted. At ~131k GitHub stars it has become the default answer to "how do I get web content into my LLM pipeline without writing a scraper per site."

## Highlights

- **`/scrape`** — any page to clean Markdown or JSON, JavaScript rendering included.
- **`/crawl` + `/map`** — walk entire sites with depth/limit controls, or just discover the URL tree fast.
- **`/search`** — web search with optional content scraping of the results in one call.
- **`/extract`** — LLM-powered structured extraction: define a schema, get validated objects from messy pages.
- **Agent-grade MCP server** — 14 tools including scrape/map/search/crawl, extraction, and newer agent/browser-session tools; hosted or local.
- **Open core** — AGPL-3.0, self-hostable; the hosted cloud adds managed scale and the proprietary Fire-Engine.

## In an AI-assisted workflow

```bash
claude mcp add firecrawl -e FIRECRAWL_API_KEY=your-api-key -- npx -y firecrawl-mcp
# then:
# > Crawl docs.example.com, extract every API endpoint and its auth requirements
# > into a table, and flag the ones our client doesn't implement yet
```

For [RAG ingestion](/guides/concepts/how-rag-works), Firecrawl is the step before [chunking](/skills/data/chunking-strategy-optimizer): site → clean Markdown → chunks → embeddings, without the per-site parser zoo.

> [!WARNING]
> Two operational cautions: the hosted MCP URL embeds your API key in the path — treat the URL itself as a secret — and scraped content is untrusted input to your model (the classic [indirect prompt-injection](/guides/ai-safety/defending-prompt-injection) vector). Respect target sites' policies; Firecrawl's own terms put that responsibility on you.

## Good to know

Freemium: a monthly free credit allowance (no card), then plans metered in page credits; credits don't roll over. The company raised a $14.5M Series A (Nexus, with Y Combinator) alongside the v2 API in August 2025, and the GitHub org renamed from `mendableai` to `firecrawl`. Pair with [Exa](/tools/exa) — search to *find* pages, Firecrawl to *extract* them — for the full web-data layer under an agent.
