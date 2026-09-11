---
name: "Parallel Web Systems"
title: "Parallel Web Systems"
description: "Parallel Web Systems' web APIs for AI agents on its own index: objective-based Search, Extract to markdown, async Task research, and a free keyless MCP."
seoTitle: "Parallel Web Systems API: Search, Extract, and Task for Agents"
date: "2026-09-11"
url: "https://parallel.ai"
pricing: "freemium"
category: "platform"
repo: "https://github.com/parallel-web/search-mcp"
license: "MIT"
os: ["Web"]
color: "blue"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["search", "web-data", "api", "research", "mcp"]
alternativeTo: ["exa", "tavily", "firecrawl"]
sameAs:
  - "https://github.com/parallel-web"
  - "https://x.com/p0"
  - "https://www.linkedin.com/company/parallel-web/"
  - "https://www.npmjs.com/package/parallel-web"
  - "https://pypi.org/project/parallel-web/"
related: ["guide:best-web-search-apis-for-ai-agents-2026", "guide:web-data-for-ai-agents", "tool:exa", "tool:tavily", "tool:brave-search-api", "guide:claude-code-mcp-setup"]
summary: "Parallel Web Systems sells web search and research APIs for AI agents, served from its own index: objective-based Search with LLM-ready excerpts, Extract to markdown, async Task research with citations, plus FindAll and Monitor. Freemium, with monthly free credits for orgs with a card, and its hosted Search MCP server is free and keyless."
faq:
  - q: "Is Parallel free?"
    a: "Partly. As of September 2026, Parallel's pricing page gives eligible organizations with a credit card $5 in free credits each month, which Parallel says covers up to 5,000 Search requests, and unused credit expires monthly. The hosted Search MCP server is free and needs no key."
  - q: "How do I add Parallel to Claude Code?"
    a: "Point claude mcp add at the hosted Search MCP server, https://search.parallel.ai/mcp, with --transport http; it needs no API key and exposes web_search and web_fetch. For deep research, add the Task MCP at https://task-mcp.parallel.ai/mcp, which requires auth, or install Parallel's Claude Code plugin from parallel-web/parallel-agent-skills."
  - q: "How is Parallel different from Tavily?"
    a: "Both sell search and extraction for agents, but Parallel says it serves every query from its own web index and adds async Task, FindAll and Monitor APIs on top. Tavily bundles search, extract, crawl, map and research behind one credit pool and doesn't say whether it runs its own index. Tavily's free tier needs no card, while Parallel's monthly free credits do, though its Search MCP is free and keyless."
---

**Parallel**, from Parallel Web Systems, is the pick when an agent needs fast search and long-running research from one vendor. Parallel says every query is served from **its own web index, purpose-built for agents**. Search turns a natural-language objective into ranked URLs with LLM-ready excerpts, Extract turns pages into markdown, and asynchronous Task, FindAll and Monitor APIs handle deep research, entity lists and change tracking.

## Highlights

- **Objective-first Search.** `POST /v1/search` takes an `objective` in plain language, plus optional `search_queries`, and returns ranked results with `url`, `title`, `publish_date` and LLM-optimized `excerpts`. Four modes trade speed for depth: `turbo` (~200ms), `fast` (~700ms), `basic` (~1s) and `advanced` (~3s, the default).
- **Extract to markdown.** `POST /v1/extract` takes `urls` and an `objective` and returns focused excerpts or `full_content`, including JavaScript-heavy pages and PDFs.
- **Task API for deep research.** Asynchronous runs of 10 seconds to 2 hours do research and enrichment against your output schema, returning a "research basis" of citations, reasoning and confidence. Nine processor tiers run from `lite` to `ultra8x`.
- **FindAll and Monitor.** FindAll builds a list of every entity matching a description; Monitor tracks web changes on a schedule and posts them to webhooks.
- **Cited answers, OpenAI-style.** The Responses API (`/v1/responses`, model `parallel`) is compatible with OpenAI's Responses API, and a Chat endpoint mirrors OpenAI's ChatCompletions.
- **Free, keyless Search MCP.** `https://search.parallel.ai/mcp` exposes `web_search` and `web_fetch` without a key; a Bearer key raises the limits.

## In an AI-assisted workflow

Adding the hosted Search MCP server to Claude Code takes one command from Parallel's docs, with no key:

```bash
claude mcp add --transport http "Parallel-Search-MCP" https://search.parallel.ai/mcp
```

For deep research, the Task MCP needs auth: `claude mcp add --transport http "Parallel-Task-MCP" https://task-mcp.parallel.ai/mcp`. Parallel also ships a Claude Code plugin: `/plugin marketplace add parallel-web/parallel-agent-skills`, then `/plugin install parallel`.

Calling the API directly uses an `x-api-key` header. This is Parallel's search quickstart:

```bash
curl https://api.parallel.ai/v1/search \
  -H "Content-Type: application/json" \
  -H "x-api-key: $PARALLEL_API_KEY" \
  -d '{
    "objective": "Find latest information about Parallel Web Systems. Focus on new product releases, benchmarks, or company announcements.",
    "search_queries": [
      "Parallel Web Systems products",
      "Parallel Web Systems announcements"
    ]
  }'
```

With the MCP server connected, prompts like these work:

```text
> Use web_search to find this month's release notes for our three main dependencies and cite each one
> Use web_fetch on our competitor's changelog page and list anything that shipped in the last 30 days
```

If this is your first remote server, [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup) covers local, remote and project-scoped setups. Keep the keyless Search MCP in user scope for everyday lookups, and add the Task MCP only in projects that need long research runs.

> [!TIP]
> Pick the Search mode by where the call sits. `turbo` and `fast` suit searches inside an interactive agent loop; `advanced`, the default at about 3s, suits a research step where quality beats latency. Anything that takes minutes belongs in the Task API.

## How it compares to Exa, Tavily and Brave

[Exa](/tools/exa) is the closest match: it also runs its own index and sells research, entity and monitoring products (Exa Agent, Websets, Monitors) on top of search. [Tavily](/tools/tavily) bundles search, extract, crawl, map and research behind one credit pool and doesn't say whether it runs its own index. Parallel publishes a migration guide for teams moving from Exa, Tavily or SERP APIs. [Brave Search API](/tools/brave-search-api) suits classic ranked results from an independent index, and [Firecrawl](/tools/firecrawl) goes further than Extract when you need whole-site crawls. The [web search APIs roundup](/guides/comparisons/best-web-search-apis-for-ai-agents-2026) lays them side by side.

## Good to know

Plans, as of September 2026 from Parallel's pricing page: Search is $1 per 1,000 requests in `turbo` or `fast` mode and $5 per 1,000 in `basic` or `advanced`, with 10 results included; Extract is $1 per 1,000 URLs; Task runs cost $5 to $2,400 per 1,000 depending on processor, billed only when they succeed; Responses is $10, $50 or $250 per 1,000 at low, medium or high effort. Eligible organizations with a credit card get $5 in free credits a month, and startups can apply for up to $250.

Search, Extract and Monitor are generally available on `/v1`; FindAll, Entity Search and Chat are in beta as of September 2026. The API is a commercial service. The MIT license covers the Search MCP repo and the official SDKs, `parallel-web` on PyPI and npm (version 1.3.3, September 2026); the Task MCP repo carries no license. Default rate limits are 600 requests a minute for Search and Extract and 2,000 a minute for Tasks.

Parallel Web Systems raised a $100M Series B at a $2B valuation led by Sequoia Capital in April 2026, bringing its total to $230M. Parallel lists SOC 2 Type II, a HIPAA-ready offering and optional zero data retention, and its index includes licensed content through Index by Parallel, launched in May 2026 to pay content owners. Its crawler identifies as ShapBot. For where search APIs sit next to scrapers and page fetchers, see [Getting Web Data into AI Agents](/guides/concepts/web-data-for-ai-agents).
