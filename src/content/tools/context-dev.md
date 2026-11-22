---
name: "Context.dev"
title: "Context.dev"
description: "A web data API for AI agents: scrape any URL into Markdown or structured JSON, with web search, crawl and map on the same API, plus a hosted MCP server."
date: 2026-11-22
reviewed: "2026-11-22"
url: "https://www.context.dev"
pricing: "freemium"
category: "platform"
os: ["Web"]
color: "orange"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["scraping", "search", "web-data", "api", "mcp", "agents"]
sameAs:
  - "https://docs.context.dev"
  - "https://github.com/context-dot-dev"
related: ["guide:best-web-search-apis-for-ai-agents-2026", "guide:web-data-for-ai-agents", "tool:firecrawl", "tool:exa", "tool:tavily", "guide:claude-code-mcp-setup"]
alternativeTo: ["firecrawl", "tavily", "exa", "jina-reader", "parallel"]
summary: "Context.dev scrapes any URL into Markdown or structured JSON and puts web search, site mapping, crawling and a cited Answers endpoint on the same API key and credit pool. It was called Brand.dev until March 2026 and still serves brand, company and people data. It is hosted only, with SDKs in five languages and a hosted MCP server that signs in with OAuth."
faq:
  - q: "What does Context.dev do?"
    a: "It turns web pages into data an AI agent can use. The scrape endpoint returns Markdown, HTML, screenshots or JSON shaped by a JSON Schema you supply. Web search, URL mapping, crawling and a cited Answers endpoint run on the same API key and credit pool, alongside the brand, company and people data endpoints it kept from its Brand.dev days."
  - q: "How do I add Context.dev to Claude Code?"
    a: "Run claude mcp add --transport http context https://mcp.context.dev/mcp, then sign in by running /mcp in Claude Code and picking context, or claude mcp login context from the terminal. Add --scope user to make it available in every project. Clients that can't do OAuth can send an API key in an Authorization: Bearer header instead."
  - q: "Can I self-host Context.dev?"
    a: "No. Context.dev is hosted only, with no self-hosted edition. Its SDKs and CLI are Apache-2.0 and most of its integrations are MIT, but the API and the MCP server are not open source. If you need to run the scraper yourself, Firecrawl's AGPL-3.0 core is the closest alternative."
---

Context.dev is a web data API built for AI agents. Give it a URL and it returns **clean Markdown or structured JSON**; give it a query and it searches the web on the same key, optionally returning each result's full Markdown in the same call. The company launched as Brand.dev, a brand data API, and renamed itself Context.dev on March 21, 2026 as it moved into scraping and search.

## Highlights

- **`/web/scrape`**: any URL to Markdown, HTML, screenshots, images or JSON in one call. For JSON you pass a JSON Schema, plus optional instructions, and a model fills it from the page's Markdown, JSON-LD and meta tags.
- **`/web/search`**: ranked results with relevance labels, with optional highlights or full-page Markdown for each result. Web search launched on May 16, 2026, with domain, freshness and country filters.
- **`/web/urls` and `/web/crawl`**: map a site's URLs, or convert up to 500 pages per crawl call. Batch jobs take up to 100,000 URLs, and monitors watch pages for changes with webhooks.
- **`/web/answers` and `/parse`**: a researched answer with sources returned as JSON, and uploaded files turned into Markdown. PDFs and Office documents also scrape straight from a URL.
- **Rendering included**: JavaScript rendering and managed proxies are always on, with country selection, custom headers and browser actions for pages behind a login.
- **Hosted MCP server**: one remote server, launched August 3, 2026, that signs in with OAuth and exposes search, scrape, map, crawl and answers alongside the brand, company and people tools.

## In an AI-assisted workflow

```bash
claude mcp add --transport http context https://mcp.context.dev/mcp
# add --scope user for every project, then sign in:
# run /mcp in Claude Code and pick "context", or `claude mcp login context`
# then:
# > Search for this week's posts about the MCP spec, scrape the top five
# > into Markdown, and list every change they mention with its source URL
```

The MCP server caps each tool response at 80,000 characters, so ask for highlights or a JSON Schema rather than full pages when an agent reads many results. For [RAG ingestion](/guides/concepts/how-rag-works), Context.dev covers the find-then-fetch step that [getting web data into AI agents](/guides/concepts/web-data-for-ai-agents) describes: search for sources, then scrape each into Markdown for chunking.

> [!WARNING]
> Scraped pages are untrusted input to your model and the classic [indirect prompt-injection](/guides/ai-safety/defending-prompt-injection) vector, so quote them as data before an agent acts on them. Keep your API key in an environment variable or secret store, not in a prompt or a committed config file.

## Good to know

Plans, as of November 2026 from context.dev/pricing: Free is 1,000 credits a month with no credit card, then Developer at $20/month for 10,000 credits, Pro at $90/month for 100,000, Growth at $300/month for 500,000 and Scale at $500/month for 1,000,000, with yearly billing priced at ten months. A plain scrape costs 1 credit and JSON extraction 5; search costs 1 credit per 10 results, plus 1 credit per result when you ask for Markdown. Plans are limited by concurrent requests, from 2 on Free to 500 on Scale.

SDKs cover TypeScript, Python, Ruby, Go and PHP. Context.dev reports SOC 2 Type II compliance as of September 2026, and zero data retention is available on request and switched on per call, though not for batch jobs or monitors. Its docs don't say whether web search runs on its own index. The company is backed by Y Combinator and raised a seed round led by General Catalyst in October 2026. For self-hosting or a larger open-source community, compare it with [Firecrawl](/tools/firecrawl); for search ranked by meaning on its own index, see [Exa](/tools/exa).
