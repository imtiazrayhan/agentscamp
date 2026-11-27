---
name: "Tavily"
description: "The web-access layer for agents — Search, Extract, Crawl, Map, and Research APIs purpose-built for LLMs, behind one key, with a hosted MCP server."
date: 2026-06-11
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://tavily.com"
pricing: "freemium"
category: "platform"
repo: "https://github.com/tavily-ai/tavily-python"
license: "MIT"
os: ["Web"]
color: "blue"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["search", "web-data", "api", "agents", "mcp"]
featured: false
alternativeTo: ["exa", "firecrawl"]
sameAs:
  - "https://github.com/tavily-ai"
  - "https://docs.tavily.com"
  - "https://app.tavily.com"
related: ["guide:web-data-for-ai-agents", "tool:exa", "tool:firecrawl", "tool:jina-reader", "guide:claude-code-mcp-setup", "glossary:rag"]
summary: "Tavily is a web-access API for AI agents: Search returns LLM-ready results at four depth settings, Extract pulls clean page content, Crawl and Map traverse sites, and Research runs a multi-step investigation in one call. All five share one key and one credit pool, with SDKs and a hosted MCP server. The free plan includes 1,000 credits a month."
faq:
  - q: "How is Tavily different from Exa and Firecrawl?"
    a: "Breadth behind one key versus specialist depth. Exa's centre is semantic search quality and entity research; Firecrawl's is scraping and crawling at scale. Tavily bundles search, extract, crawl, map and research in a single credit pool, which makes it the convenient pick for an agent that needs all of them."
  - q: "Is Tavily free to start?"
    a: "Yes. As of November 2026 the free Researcher plan includes 1,000 API credits every month with no credit card and a limit of 100 requests a minute. Beyond that, pay-as-you-go is $0.008 per credit, and monthly plans run from Project at $30 for 4,000 credits to Growth at $500 for 100,000 credits. On the free plan, requests stop when credits run out until the monthly reset on the first of the month."
  - q: "How many credits does a Tavily call cost?"
    a: "A search costs 1 credit at basic, fast or ultra-fast depth and 2 at advanced. Extract costs 1 credit per 5 successful URLs (2 at advanced depth). Map costs 1 credit per 10 pages, or 2 with instructions, and Crawl is the map cost plus the extract cost. Research is dynamic: 4 to 110 credits per request on the mini model and 15 to 250 on pro."
  - q: "How do I use Tavily from Claude Code?"
    a: "Run claude mcp add tavily --transport http https://mcp.tavily.com/mcp/ and complete the OAuth sign-in in the browser; no API key goes in the URL. The server exposes tavily_search, tavily_extract, tavily_crawl, tavily_map and tavily_research."
---

[Tavily](https://tavily.com) sells **web access for AI agents** as one API: search, extraction, crawling, site mapping and multi-step research behind a single key and a single credit pool. Results come back shaped for a model to read, not as a page of links. Tavily has been part of Nebius Group since February 19, 2026, when Nebius took full ownership, and it still operates under its own name.

## Highlights

- **Search at four depths.** `search_depth` takes `ultra-fast`, `fast`, `basic` or `advanced`. Ultra-fast returns one summary per URL for latency-critical loops; the others return several relevant snippets per URL. Tavily's site claims a 180 ms p50 on `/search`.
- **Extract, Crawl, Map.** Clean content from URLs you already have, instruction-guided crawling across a site, and URL discovery without fetching content.
- **Research endpoint.** A multi-source investigation that returns a detailed answer in one call, on a `mini` or `pro` model.
- **Hosted MCP server.** `https://mcp.tavily.com/mcp/` with OAuth, exposing `tavily_search`, `tavily_extract`, `tavily_crawl`, `tavily_map` and `tavily_research`.
- **SDKs.** `tavily-python` (sync and async clients) and a JavaScript SDK, both MIT-licensed.
- **Rate limits by plan.** 100 requests a minute on the free plan and 1,000 once pay-as-you-go or a paid plan is active, with separate caps of 100 a minute on `/crawl` and `/map` and 20 a minute on `/research`.

## In an AI-assisted workflow

Get a key at [app.tavily.com](https://app.tavily.com), then install the SDK and search:

```bash
pip install tavily-python
```

```python
from tavily import TavilyClient

client = TavilyClient(api_key="tvly-YOUR_API_KEY")

# 1 credit: a quick answer source for an agent loop
results = client.search("What changed in the latest MCP spec?", search_depth="basic")

# 1 credit per 5 URLs: full content for the pages worth reading
page = client.extract("https://en.wikipedia.org/wiki/Model_Context_Protocol")
```

To give Claude Code the same tools, add the hosted MCP server and sign in when the browser opens:

```bash
claude mcp add tavily --transport http https://mcp.tavily.com/mcp/
```

In an agent stack Tavily is usually the search step in [agentic RAG](/guides/concepts/agentic-rag): the freshness layer that a static corpus lacks. Search first at `basic` depth, then extract only the two or three URLs the model wants to read in full.

> [!WARNING]
> Fetched pages are untrusted input to your model, and [indirect prompt injection](/glossary/prompt-injection) rides in on search results. Treat content as data, and gate any tool that acts on it.

## Pricing

As of November 2026, Tavily's credit docs list these plans:

| Plan | Credits per month | Monthly price |
| --- | --- | --- |
| Researcher | 1,000 | Free, no credit card |
| Project | 4,000 | $30 |
| Bootstrap | 15,000 | $100 |
| Startup | 38,000 | $220 |
| Growth | 100,000 | $500 |
| Pay as you go | Per usage | $0.008 per credit |
| Enterprise | Custom | Custom |

Credits are not one per call. A search is 1 credit (2 at `advanced` depth), Extract is 1 credit per 5 successful URLs, Map is 1 credit per 10 pages, Crawl is map plus extract, and Research ranges from 4 to 250 credits per request depending on model. Failed extractions and failed map requests are not charged. As of November 2026 the pricing page also advertises free access for students and a startup programme with 100,000 free credits.

## Good to know

- **Budget for the multipliers.** An agent that defaults to `advanced` search and calls Research freely can spend credits 2 to 250 times faster than a call count suggests. Set `search_depth` explicitly.
- **The free plan stops, it does not bill.** When the 1,000 credits are gone, requests fail until the reset on the first of the month.
- **Speed figures are the vendor's.** The 180 ms p50 is Tavily's own claim for `/search`; measure from your region.
- **Open-source clients, closed service.** The SDKs and MCP server are MIT; the index and ranking are the product. Tavily's site reports 3M+ developers and a 99.99% uptime SLA as of November 2026.

Against the field: [Exa](/tools/exa) is the pick when ranking by meaning matters most, [Firecrawl](/tools/firecrawl) when the job is heavy scraping and crawling, and [Keenable](/tools/keenable) and the [Brave Search API](/tools/brave-search-api) when you want a search API on the provider's own index. [Best Web Search APIs for AI Agents](/guides/comparisons/best-web-search-apis-for-ai-agents-2026) compares them, and [Getting Web Data into AI Agents](/guides/concepts/web-data-for-ai-agents) covers the pattern.
