---
name: "Exa"
title: "Exa"
description: "A web search API built for AI agents: Lite, Auto and Deep search, page contents, Monitors, Websets and Exa Agent, plus a hosted MCP server that works keyless."
date: 2026-06-11
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://exa.ai"
pricing: "freemium"
category: "platform"
repo: "https://github.com/exa-labs/exa-mcp-server"
license: "MIT"
os: ["Web"]
color: "blue"
topics: ["mcp"]
tags: ["search", "web-data", "mcp", "api", "agents"]
featured: false
sameAs:
  - "https://github.com/exa-labs"
  - "https://dashboard.exa.ai"
  - "https://www.npmjs.com/package/exa-mcp-server"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "tool:firecrawl", "agent:data-scientist", "guide:how-rag-works", "agent:agent-tool-integration-engineer"]
alternativeTo: ["tavily", "firecrawl", "jina-reader"]
summary: "Exa is a web search API built for AI agents instead of human browsers. One /search endpoint runs in Lite, Auto or Deep mode and can return highlights, full text or summaries with each result, and Exa Agent handles long research runs. The hosted MCP server at mcp.exa.ai/mcp offers search and fetch without an API key."
faq:
  - q: "Which Exa search type should I use?"
    a: "Exa's docs recommend three. auto is the default and takes about a second. lite is the cheap, fast one at roughly 200 ms, but it serves page content from Exa's cache only and rejects parameters it does not support, such as summaries and outputSchema, with a 400. deep runs a multi-step search with synthesis and takes 4 to 15 seconds. The older fast, instant and deep-reasoning types still work but are marked legacy."
  - q: "How do I add Exa to Claude Code?"
    a: "Exa documents two routes. The plugin: claude plugin install exa@claude-plugins-official. Or the MCP server directly: claude mcp add --transport http exa https://mcp.exa.ai/mcp. Without a key the server runs search and fetch at a free rate limit. Sign in through https://mcp.exa.ai/mcp?login or send an x-api-key header to bill usage to your team and unlock the agent_run tool."
  - q: "Is Exa free?"
    a: "There is a free Starter plan. As of November 2026, Exa's billing docs give every new team $10 in credits that reset to $10 on the first of each month without accumulating, plus a one-time $10 bonus for finishing onboarding. Starter is limited to 10 queries per second. Past that you buy prepaid credits on the Developer plan with no subscription or minimum spend."
  - q: "What happens when I run out of Exa credits or hit a rate limit?"
    a: "Requests return 402 Payment Required when the team's credits, or an individual key's budget, are exhausted, and 429 Too Many Requests when you exceed your queries-per-second limit. Limits apply to the whole team across all its keys. Auto recharge can buy credits when the balance hits a threshold you set, with an optional monthly cap."
audience: ["ai-engineers", "sales", "marketers"]
---

[Exa](https://exa.ai) is a web search API whose customer is an agent, not a person scanning ten blue links. You send a natural-language query to one `/search` endpoint and get ranked results back with the page content already attached as highlights, full text or a summary. Around that sit a Contents endpoint for URLs you already have, Exa Agent for long research runs, Monitors for standing queries, and Websets for building verified lists. Exa also runs a hosted MCP server, so Claude Code, Cursor and similar clients can use it without writing any code.

## Highlights

- **Three recommended search types.** `auto` is the default, at about one second. `lite` targets cost and latency at roughly 200 ms. `deep` does multi-step search with synthesis in 4 to 15 seconds, and `deep-lite` sits between at about four seconds. Exa added `lite` on October 19, 2026 and marked `fast`, `instant` and `deep-reasoning` as legacy.
- **Content with the results.** `contents: { highlights: true }` returns the excerpts most relevant to your query, sized per result. You can ask for full text or a summary instead. A search returns 10 results by default and up to 100 with `numResults`; there is no pagination.
- **Exa Agent.** Released June 16, 2026, it runs asynchronous research, list building and enrichment, takes an `outputSchema` for structured JSON, and has effort levels from minimal to x-high plus a usage-based ultra level.
- **Monitors and Websets.** A monitor re-runs a query on a schedule and reports only new, relevant pages, with webhooks. Websets builds lists verified against your criteria and enriches each row with custom columns.
- **Specialised data in the index.** Exa's pricing page lists news, code and docs, companies and people, financial markets, research, legal records and more. Since October 29, 2026 the index also holds 3.2 million podcast episodes with transcripts.
- **Hosted MCP server.** `https://mcp.exa.ai/mcp` exposes `web_search_exa` and `web_fetch_exa` by default, `agent_run` once you authenticate, and `web_search_advanced_exa` on request through a `tools` URL parameter. The [server code](https://github.com/exa-labs/exa-mcp-server) is MIT-licensed.

## In an AI-assisted workflow

The fastest route into a coding agent is the MCP server:

```bash
claude mcp add --transport http exa https://mcp.exa.ai/mcp
# keyless: search and fetch at a free rate limit
# sign in via https://mcp.exa.ai/mcp?login, or send an x-api-key header,
# to bill your team and enable agent_run
```

From your own code, install an SDK (`pip install exa-py` or `npm install exa-js`), set `EXA_API_KEY`, and call search:

```python
from exa_py import Exa

exa = Exa()  # reads EXA_API_KEY

results = exa.search(
    "best blog posts about vector databases",
    type="auto",
    contents={"highlights": True},
)

for result in results.results:
    print(result.title, result.url)
```

A workable pattern for [RAG](/guides/concepts/how-rag-works) and research agents: run `lite` inside tight loops where latency matters, switch to `auto` or `deep` when one query has to be right, and hand anything that needs many searches to Exa Agent so your own agent's context is not spent on intermediate pages.

> [!WARNING]
> Whatever Exa fetches enters your model's context. Treat retrieved pages as untrusted input, especially in agents that can act on what they read: see [defending against prompt injection](/guides/ai-safety/defending-prompt-injection).

## Pricing

As of November 2026, Exa's pricing page charges per 1,000 requests with up to 10 results each: $4 for Lite search, $7 for Auto, $12 for Deep, $5 for Answer and $2 for Monitors, with Contents at $1 per 1,000 pages, AI page summaries at $1 per 1,000 pages, and results beyond the first 10 at $1 per 1,000. Exa Agent costs $0.012 to $1.00 per run at a fixed effort level, or is metered at $0.10 per Agent Compute Unit plus $0.005 per search when effort is left on auto, and Websets uses the same metered components with no monthly subscription.

There are four plans. Starter is free: as of November 2026 it carries $10 in credits that reset monthly, a one-time $10 onboarding bonus, and a 10 QPS limit. Developer is pay-as-you-go on prepaid credits at 25 QPS; as of November 2026, adding $1,000 in credits within 30 days raises that to 50 QPS for 90 days. Growth is billed annually as prepaid credits and adds zero data retention at 50 QPS. Enterprise is custom, with options such as SSO, EU data residency and up to 1,000 results per search.

## Good to know

The trade-offs are mostly in the search types. `lite` never fetches a page live, so results with no cached copy are dropped when you ask for text or highlights, and it accepts a smaller parameter set than `auto`. Deep search and Agent are slow enough that you should run them asynchronously. Auto search no longer returns a per-result score, so rely on result order. Zero data retention needs a Growth plan or above, and `agent_run` over MCP needs sign-in or a key because it is billed by usage.

Exa Search became available in the EU on November 13, 2026, according to the changelog, and the API surface moves quickly: check the [changelog](https://exa.ai/docs/changelog) before you build against a search type or endpoint.

Against the alternatives: [Tavily](/tools/tavily) bundles search, extract, crawl and research behind one key, and [Exa vs Tavily](/guides/comparisons/exa-vs-tavily) compares the two directly. [Parallel](/tools/parallel) and [Keenable](/tools/keenable) run their own indexes with objective-based or low-latency search. [Firecrawl](/tools/firecrawl) is the better fit when you already know the sites and need to crawl them in depth. The [web search API roundup](/guides/comparisons/best-web-search-apis-for-ai-agents-2026) covers the wider field.
