---
name: "Keenable"
title: "Keenable"
description: "A web search API for AI agents on its own index: Search in pro or realtime mode, Fetch to clean markdown, and a hosted MCP server that works without a key."
date: 2026-11-27
reviewed: "2026-11-27"
url: "https://keenable.ai"
pricing: "freemium"
category: "platform"
os: ["Web"]
color: "cyan"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["search", "web-data", "api", "mcp", "agents"]
sameAs:
  - "https://docs.keenable.ai"
  - "https://github.com/keenableai"
related: ["guide:best-web-search-apis-for-ai-agents-2026", "guide:web-data-for-ai-agents", "tool:parallel", "tool:exa", "tool:brave-search-api", "tool:tavily", "guide:claude-code-mcp-setup"]
alternativeTo: ["tavily", "exa", "parallel", "brave-search-api", "jina-reader", "firecrawl"]
summary: "Keenable is a web search API for AI agents built on its own crawler, index and ranking. Search returns ranked pages with citable excerpts in a pro or realtime mode, and Fetch turns any URL into clean markdown. Both run over REST, MCP, SDKs and a CLI. Search works without a key everywhere, fetch works keyless outside the SDKs, and a key adds 100,000 free requests a month."
faq:
  - q: "Does Keenable run its own search index?"
    a: "Yes. Keenable's docs say search and fetch run on its own index, built by its crawler, KeenableBot, and the company told TechCrunch in August 2026 that the index holds more than 100 billion documents. Each search result carries an acquired_at time, when Keenable indexed the page, so an agent can judge how fresh a snippet is."
  - q: "How much does Keenable cost?"
    a: "As of November 2026, an organization with an API key gets 100,000 free requests a month with no credit card (1,000 a month for sign-ups from privacy or disposable mail domains until a card is saved), then pays $4 per 1,000 requests from a prepaid balance that never expires. Search in either mode and Fetch cost the same, MCP calls are billed like HTTP calls, and failed calls cost nothing. Dedicated capacity is $1 per 1,000 requests at 100 or more requests per second. Search and fetch also work without a key at 1,000 requests an hour per IP."
  - q: "How do I add Keenable to Claude Code?"
    a: "Run claude mcp add keenable --transport http https://api.keenable.ai/mcp --scope user --header \"X-API-Key: keen_<your_key>\", or leave out the --header flag to use the keyless public tier. The server exposes two web tools, search_web_pages and fetch_page_content. Clients that sign in with OAuth, such as Claude connectors, use https://api.keenable.ai/mcp-oauth instead."
---

[Keenable](https://keenable.ai) is a web search API for AI agents, built on **its own crawler, index and ranking**. Search gives an agent ranked web pages, each with an excerpt ready to cite, and Fetch turns any URL into clean markdown. Both are available through a REST API, a hosted MCP server, official SDKs and a CLI. Keenable released its public API in April 2026 and announced a $26 million seed round led by Accel in August 2026.

## Highlights

- **Its own index.** Keenable's docs say search and fetch run on its own index, built by its crawler, KeenableBot; the company told TechCrunch the index holds more than 100 billion documents. Every result carries `acquired_at`, the time Keenable indexed the page.
- **Search in two modes.** `pro`, the default, is for deeper retrieval, and `realtime` is for the fastest response, such as a voice agent that searches while the user waits. A call returns 10 results by default and up to 50, with filters for site, excluded domains and publish date. Keenable advertises under 250 ms at p95 from US East.
- **Fetch to markdown.** Any URL comes back as markdown with navigation and boilerplate stripped. With an API key, `POST /v1/fetch` reads up to 20 pages per call; a prompt returns the model's answer in place of each page, and a JSON Schema adds a matching `structured` object alongside the page text.
- **Try it without a key.** Search, single-page fetch and the MCP server work with no account at 1,000 requests an hour and 10 a second per IP address. With a key, the default limit is 10 requests a second per organization, with no hourly cap.
- **Hosted MCP server.** `https://api.keenable.ai/mcp` exposes `search_web_pages` and `fetch_page_content` with or without an API key. An OAuth URL serves clients that sign in, and an npm bridge, `@keenable/mcp`, covers clients that only run local stdio servers. The [keenable-mcp](https://github.com/keenableai/keenable-mcp) repository (the stdio bridge and listings) is MIT-licensed.
- **SDKs and CLI.** Official SDKs cover Python, TypeScript, Go and Rust; search works in them without a key, while fetch needs one. `keenable-cli` is a single binary that searches, fetches and adds Keenable to Claude Code, Cursor, Codex and other clients.

## In an AI-assisted workflow

```bash
claude mcp add keenable \
  --transport http https://api.keenable.ai/mcp \
  --scope user \
  --header "X-API-Key: keen_<your_key>"
# omit --header to run on the keyless public tier
# then:
# > Search for this week's changes to the MCP spec, fetch the top five
# > results as markdown, and list each change with its source URL
```

If you set it up with the CLI instead, `keenable configure-mcp` also turns off Claude Code's built-in `WebSearch` and `WebFetch` tools so the agent uses Keenable, and `keenable reset` turns them back on.

Pick `realtime` mode when the agent is on a latency budget and `pro` when retrieval depth matters more. For [RAG ingestion](/guides/concepts/how-rag-works), Keenable covers the find-then-fetch step that [getting web data into AI agents](/guides/concepts/web-data-for-ai-agents) describes: search for sources, then fetch each one as markdown, or pass a prompt to Fetch so only the relevant part reaches your context window.

> [!WARNING]
> Fetched pages are untrusted input to your model and the classic [indirect prompt-injection](/guides/ai-safety/defending-prompt-injection) vector, so quote them as data before an agent acts on them. Keep your API key in the `KEENABLE_API_KEY` environment variable or a secret store, not in a prompt or a committed config file.

## Good to know

Pricing, as of November 2026 from Keenable's pricing docs: with an API key, each organization gets 100,000 free requests a month with no credit card, and the allowance resets monthly. Sign-ups from disposable or privacy mail domains, such as Proton, start at 1,000 a month until a card is saved. After that, each request costs $4 per 1,000 from a prepaid balance that never expires. Both search modes and Fetch are billed at the same rate, each page in a batch fetch is billed as one fetch though the whole call counts once toward the rate limit, MCP calls cost the same as HTTP calls, and failed calls cost nothing. Dedicated capacity is $1 per 1,000 requests at 100 or more requests per second, in the cloud or on-premises, and prices between the two rates are quoted per organization. Zero data retention is part of the Enterprise offer, not a console setting.

On Artificial Analysis's Search Index, which averages one answer model's scores on three question benchmarks (DeepSearchQA, BrowseComp and AA-Omniscience) when it searches with each API, Keenable Search in `pro` mode scored 83 in data dated November 19, 2026, level with Parallel Search's advanced mode, which Artificial Analysis lists first. The leaderboard updates, so check the live page.

Keenable's co-founders are CEO Andrey Styskin, who previously led search, AI and cloud at Yandex, and chief scientist Matthias Petri, who worked with him at Amazon on web search infrastructure for Alexa. Accel led the seed round, with Conviction Partners participating. The docs include migration guides from Tavily, Exa, Brave, Perplexity, SerpApi, Serper, Firecrawl, Parallel, Jina and Linkup, and integrations with Baseten, OpenRouter, Cerebras, LangChain, CrewAI, the Vercel AI SDK, n8n and Dify, among others. For objective-based search with long-running research tasks, compare it with [Parallel](/tools/parallel); for search ranked by meaning, see [Exa](/tools/exa).
