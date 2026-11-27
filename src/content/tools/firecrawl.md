---
name: "Firecrawl"
title: "Firecrawl"
description: "An API that searches, scrapes, crawls and interacts with the web for AI agents, returning clean Markdown or JSON, with an open-source core and an MCP server."
date: 2026-06-11
updated: "2026-11-27"
reviewed: "2026-11-27"
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
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "tool:exa", "agent:data-engineer", "guide:how-rag-works", "skill:chunking-strategy-optimizer"]
alternativeTo: ["exa", "jina-reader", "tavily", "browser-use"]
summary: "Firecrawl is a web data API for AI agents. Scrape turns a page into clean Markdown or JSON, Crawl and Map cover whole sites, Search queries the web, and Interact drives a live page. The core is AGPL-3.0 and self-hostable, the hosted API has a free tier of 1,000 credits a month, and the MCP server works without a key for search, scrape and parse."
faq:
  - q: "Is the Firecrawl /extract endpoint going away?"
    a: "Yes. Firecrawl's docs mark /extract as deprecated and give a removal time of December 10, 2026 at 15:00 UTC. Single-page extraction moves to /v2/scrape with a JSON format, and wildcard, multi-page or web-search extraction moves to /v2/agent. The former Extract tool is already gone from the MCP server's tool list."
  - q: "How do I add Firecrawl to Claude Code?"
    a: "Run claude mcp add --transport http firecrawl https://mcp.firecrawl.dev/v2/mcp. With no credential that endpoint exposes only firecrawl_search, firecrawl_scrape and firecrawl_parse, capped per IP address per day. For the full tool surface, send your API key as an Authorization: Bearer header on the same URL, or sign in through the OAuth endpoint at https://mcp.firecrawl.dev/v2/mcp-oauth. To run it locally, use npx -y firecrawl-mcp with FIRECRAWL_API_KEY set."
  - q: "Is Firecrawl open source?"
    a: "The core repository is AGPL-3.0 and you can self-host it with Docker Compose; the MCP server is MIT. The self-hosted stack does not include Fire-engine, the proprietary service behind the cloud's advanced anti-bot handling, and screenshots and page actions are not available in the default stack. AGPL matters if you modify Firecrawl and run it as a network service."
  - q: "How are Firecrawl credits counted?"
    a: "As of November 2026, Firecrawl's pricing page counts 1 credit per page for Scrape and Crawl, 1 per Map call, 2 per 10 Search results and 2 per browser minute for Interact, with the JSON, Question and Highlight formats adding 4 credits per page. A scrape that returns nothing is free, but a page that answers with an error status such as 403 or 404 still costs 1 credit."
audience: ["ai-engineers", "sales", "marketers"]
---

[Firecrawl](https://firecrawl.dev) gets web content into an LLM pipeline without a scraper per site. Give it a URL and it returns clean Markdown or structured JSON; give it a domain and it crawls the site; give it a query and it searches and reads the results. Firecrawl, the company, sells this as a hosted API and publishes the core as open source. The [main repository](https://github.com/firecrawl/firecrawl) has about 211,000 GitHub stars as of November 2026 and is licensed AGPL-3.0.

## Highlights

- **Scrape.** `POST /v2/scrape` renders a page, JavaScript included, and returns Markdown, HTML, screenshots or structured JSON. The cloud handles proxies and anti-bot measures.
- **Crawl and Map.** Crawl walks a site or a section and returns every page; Map only discovers the URLs, which is the cheap way to decide what to fetch.
- **Search.** `POST /v2/search` runs a web query and can scrape the results in the same call.
- **Interact.** Keeps working with a page after a scrape: clicks, form fills, navigation and extraction from dynamic content, billed by the browser minute.
- **Parse.** Reads PDFs, documents, spreadsheets and HTML files.
- **Agent.** Describe the data you want and Firecrawl finds the sources itself. Agent is in preview as of November 2026, with five free runs a day, and is the stated successor to `/extract`.
- **MCP server.** A hosted server with tools for scrape, map, search, crawl, parse, interact, agent and monitors, plus search over a research-paper index and third-party data providers. The MIT-licensed `firecrawl-mcp` package runs the same server locally.

## In an AI-assisted workflow

```bash
claude mcp add --transport http firecrawl https://mcp.firecrawl.dev/v2/mcp
# keyless: firecrawl_search, firecrawl_scrape and firecrawl_parse only
# full tool surface: add an Authorization: Bearer header with your API key,
# or use the OAuth endpoint https://mcp.firecrawl.dev/v2/mcp-oauth
# then:
# > Crawl docs.example.com, list every API endpoint and its auth requirement
# > in a table, and flag the ones our client does not implement yet
```

The REST API works the same way, and a first scrape needs no account:

```bash
curl -s -X POST "https://api.firecrawl.dev/v2/scrape" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://firecrawl.dev",
    "formats": ["markdown", "html"]
  }'
# add -H "Authorization: Bearer $FIRECRAWL_API_KEY" for higher rate limits
```

For [RAG ingestion](/guides/concepts/how-rag-works), Firecrawl is the step before [chunking](/skills/data/chunking-strategy-optimizer): site to Markdown, Markdown to chunks, chunks to embeddings. Firecrawl also ships a CLI that installs skills into coding agents: `npx -y firecrawl-cli@latest init --all --browser`.

> [!WARNING]
> Keep your API key in an environment variable or your client's secret store, and send it as a bearer header, never inside the MCP URL. Scraped pages are untrusted input to your model and the classic [indirect prompt-injection](/guides/ai-safety/defending-prompt-injection) vector. Check a target site's terms and robots rules before you crawl it.

## Pricing

As of November 2026, firecrawl.dev/pricing (rates effective September 4, 2026) lists a Free tier of 1,000 credits a month with no card, then Hobby at $19 a month for 5,000 credits, Standard at $99 for 100,000, Growth at $399 for 500,000 and Scale at $749 for 1,000,000, or $16, $83, $333 and $599 a month when billed annually. Enterprise is custom.

Credits are shared across endpoints and the per-request rates are the same on every plan. Plans differ in concurrency (2 concurrent browsers on Free, 5 on Hobby, 25 on Standard, 50 on Growth, 100 on Scale) and in rate limits. As of November 2026, paid plans can also top up in $5 increments when credits run out, up to a monthly limit you set, and one increment buys 1,000 credits on Hobby but 5,000 on Scale. Unused credits roll over for one month on Scale and by agreement on Enterprise; on Hobby, Standard and Growth they expire.

## Good to know

`/extract` is on its way out: the docs give December 10, 2026 as the removal date, so new work should use the JSON format on `/v2/scrape` or the Agent endpoint. If you still call `/extract`, plan the migration now.

Self-hosting is real but narrower than the cloud. The self-host guide pins a release, starts the API on `http://localhost:3002` with Docker Compose, and states that Fire-engine is not included, so heavily protected sites and anything needing screenshots or page actions will behave differently from the hosted API. Keyless access is capped per IP per day by both a request limit and a credit limit, which makes it fine for trying things out and wrong for production.

Against the alternatives: [Jina Reader](/tools/jina-reader) is lighter when all you need is one URL as Markdown. [Exa](/tools/exa) and [Tavily](/tools/tavily) are search-first, built to find pages you do not know yet, where Firecrawl is strongest on sites you can already name. [Browser Use](/tools/browser-use) fits when an agent has to operate a web app step by step. Many stacks pair a search API with Firecrawl: one finds the pages, the other extracts them. [Getting web data into AI agents](/guides/concepts/web-data-for-ai-agents) maps the options.
