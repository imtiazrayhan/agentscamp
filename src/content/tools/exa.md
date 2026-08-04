---
name: "Exa"
title: "Exa"
description: "The search engine built for AIs — semantic web search, page contents, Websets, and research APIs, plus the ecosystem's most-used search MCP server."
date: 2026-06-11
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
summary: "Exa is a search engine designed for AI consumers, not human browsers: a semantic Search API with deep-search profiles, a Contents API returning clean page text and summaries, Websets for building enriched entity sets, and research endpoints. Its hosted MCP server (mcp.exa.ai/mcp) is the most-used search server in the ecosystem and even works keyless on a rate-limited free tier."
faq:
  - q: "What makes Exa different from a normal search API?"
    a: "It's built for machines doing retrieval, not people browsing: neural/semantic search over the web with relevance tuned for LLM consumption, a Contents API that returns clean text, highlights, and summaries instead of links to render, structured outputs via output schemas, and deep-search profiles that trade latency for quality when an agent is researching rather than skimming."
  - q: "How do I add Exa to Claude Code?"
    a: "One verified command: claude mcp add --transport http exa https://mcp.exa.ai/mcp. It even works keyless with rate limits; add an API key from dashboard.exa.ai (x-api-key header) to lift them. The server exposes web_search_exa, web_fetch_exa, and an opt-in advanced search tool."
  - q: "Is Exa free?"
    a: "Freemium: a monthly free request allowance, then pay-as-you-go metered per thousand requests by product (search, deep search, contents), with enterprise plans adding volume pricing and zero-data-retention. The MCP server itself is MIT-licensed."
---

Exa is what search looks like when the customer is an agent: **semantic search in, clean text out.** Where Google optimizes for a human scanning ten blue links, Exa's Search API returns machine-ranked results and its Contents API hands back the page as clean text, highlights, or AI summaries — the retrieval layer for agents and RAG pipelines, sold as an API.

## Highlights

- **Search built for LLM consumption** — neural/semantic search with speed/quality profiles up to Deep Search and deep-reasoning modes for research-grade queries.
- **Contents, not links** — clean page text, highlights, and summaries per result; structured outputs via an `output_schema` parameter.
- **Websets** — build and enrich entity sets ("every Series-B devtools company and their CTOs") as a product, not a scraping project.
- **Research & Monitors** — multi-step research runs and standing watches on a query, exposed as API products.
- **The most-used search MCP server** — hosted at `mcp.exa.ai/mcp`, MIT-licensed, with keyless rate-limited access for instant trial.

## In an AI-assisted workflow

```bash
claude mcp add --transport http exa https://mcp.exa.ai/mcp
# keyless works (rate-limited); add x-api-key from dashboard.exa.ai for real use
# then:
# > Research how teams are handling MCP server auth in production —
# > search broadly, fetch the three best sources, and synthesize
```

The MCP toolset is deliberately small after a 2025–26 consolidation: `web_search_exa` and `web_fetch_exa` by default, plus an opt-in advanced-search tool with filters. (Older tutorials referencing `linkedin_search_exa` or `deep_researcher_*` tools are out of date — those folded into the core tools and the Research API.)

> [!TIP]
> Exa pairs with [Firecrawl](/tools/firecrawl) as the two halves of agent web-data: Exa finds the right pages; Firecrawl extracts at depth and scale from sites you already know. Plenty of agent stacks run both.

## Good to know

Exa Labs raised an $85M Series B (Benchmark, announced September 2025) — the "search engine for AIs" thesis is well-funded and the API surface is moving fast. Pricing is freemium: a monthly free allowance, then metered pay-as-you-go per product tier; enterprise adds zero-data-retention. Like any web-content tool, what it fetches enters your agent's context — treat retrieved pages as untrusted input in [injection-sensitive setups](/guides/ai-safety/defending-prompt-injection).
