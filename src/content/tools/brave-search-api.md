---
name: "Brave Search API"
title: "Brave Search API"
description: "Brave's web search API on its own independent index: ranked results, LLM Context grounding chunks, and cited answers from an OpenAI-compatible endpoint."
seoTitle: "Brave Search API: Independent Index, LLM Context, and Answers"
date: "2026-09-11"
url: "https://brave.com/search/api/"
pricing: "freemium"
category: "platform"
repo: "https://github.com/brave/brave-search-mcp-server"
license: "MIT"
os: ["Web"]
color: "blue"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["search", "web-data", "api", "grounding", "mcp"]
alternativeTo: ["tavily", "exa"]
sameAs:
  - "https://github.com/brave"
  - "https://x.com/bravesearchapi"
  - "https://www.npmjs.com/package/@brave/brave-search-mcp-server"
  - "https://api-dashboard.search.brave.com"
related: ["guide:best-web-search-apis-for-ai-agents-2026", "guide:web-data-for-ai-agents", "tool:tavily", "tool:exa", "tool:parallel", "skill:web-research-pipeline"]
summary: "The Brave Search API serves web results from Brave's own independent index (30B+ pages, per Brave), not from Google or Bing. The Search plan covers web, news and image search plus LLM Context grounding chunks; Answers adds cited, OpenAI-compatible answers. Freemium with monthly free credits (card required); its official MCP server is MIT and runs locally."
faq:
  - q: "Is the Brave Search API free?"
    a: "Not card-free. As of September 2026, Brave's pricing page says every plan includes $5 in free credits each month, which reset monthly and don't roll over. A credit card is required for anti-fraud checks, but you can set prepay to $0 and stay on the free credits."
  - q: "Does the Brave Search API use Google or Bing results?"
    a: "No. Brave says the API is 'not a scraper' that queries Google or Bing but its own independent index of the web with its own ranking models, the same index behind Brave Search. Brave puts it at over 30 billion pages, kept fresh by over 100 million page updates a day."
  - q: "How do I use the Brave Search API in Claude Code?"
    a: "Brave publishes a Claude Code skills plugin: run /plugin marketplace add brave/brave-search-skills, then /plugin install brave-search-skills@brave-search. It also maintains an MIT-licensed MCP server, @brave/brave-search-mcp-server, which runs locally over stdio with a BRAVE_API_KEY. There is no hosted endpoint, and the older @modelcontextprotocol/server-brave-search package is deprecated."
---

The **Brave Search API** is the pick when an agent needs search results from an index that isn't Google's or Bing's. Brave Software serves it from **its own independent web index**, which it puts at over 30 billion pages, the same one behind Brave Search. One Search plan covers ranked web results, news, images, video and LLM Context grounding chunks; a separate Answers plan returns cited answers through an OpenAI-compatible endpoint.

## Highlights

- **Independent index.** Brave describes "over 30 billion pages, kept fresh by over 100 million page updates every day", ranked by its own models, and says the API is "not a scraper" of Google or Bing.
- **LLM Context for grounding.** Launched February 12, 2026, `/res/v1/llm/context` returns pre-extracted text, table and code chunks under `grounding` and `sources`. `maximum_number_of_tokens` sizes the payload (default 8,192; range 1,024–32,768), so an agent gets grounding text without a separate scraping step.
- **OpenAI-compatible Answers.** `POST /res/v1/chat/completions` with model `"brave"` returns cited, web-grounded answers, with streaming and a research mode. You call it through the OpenAI SDK pointed at Brave.
- **Web Search with real controls.** `count`, `country`, `search_lang` and `freshness` shape results, and `extra_snippets` adds up to five extra excerpts per result. News, video, image, place, suggest and spellcheck endpoints sit alongside.
- **Goggles.** Custom re-ranking and domain filtering, which Brave calls "unique to Brave Search".
- **Agent tooling.** An MIT-licensed MCP server with eight tools (`brave_web_search`, `brave_llm_context`, `brave_news_search` and more), an MIT skills plugin for Claude Code, and an MPL-2.0 CLI, `@brave/brave-search-cli`.

## In an AI-assisted workflow

Search requests authenticate with an `X-Subscription-Token` header. The quickstart in Brave's docs calls LLM Context directly:

```bash
curl "https://api.search.brave.com/res/v1/llm/context?q=artificial+intelligence" \
  -H "X-Subscription-Token: YOUR_API_KEY"
```

In Claude Code, the shortest path is Brave's own skills plugin (see [Claude Code plugins](/guides/configuration/claude-code-plugins) if you haven't installed one before):

```text
/plugin marketplace add brave/brave-search-skills
/plugin install brave-search-skills@brave-search
```

For other MCP clients, Brave's README gives this stdio launch config for the official server, which runs locally (there is no hosted endpoint):

```json
"command": "npx",
"args": ["-y", "@brave/brave-search-mcp-server", "--transport", "stdio"],
"env": {
  "BRAVE_API_KEY": "YOUR_API_KEY_HERE"
}
```

Brave doesn't publish a `claude mcp add` one-liner. Skip tutorials built on `@modelcontextprotocol/server-brave-search`: that package is deprecated on npm. Once connected, prompts like these work:

```text
> Use Brave LLM Context to ground an answer on the latest Node.js LTS changes, one citation per claim
> Search news from the past week about our three main competitors and list each source with its date
```

Brave fits the search step of the [web-research-pipeline](/skills/data/web-research-pipeline) skill, which splits a question into search angles, reads the best sources in full and cross-checks load-bearing claims before writing a cited answer. LLM Context can stand in for part of the fetch step, because extracted page text arrives with the results.

> [!TIP]
> Match the endpoint to who writes the answer. Use Web Search when your agent picks the pages, LLM Context when your own model writes from supplied text, and Answers when you want Brave's cited answer. Fan out on Search, which allows 50 requests per second; Answers allows 2.

## How it compares to Tavily, Exa and Parallel

[Exa](/tools/exa) and [Parallel](/tools/parallel) also say they run their own indexes. [Tavily](/tools/tavily) doesn't say whether it does, and [Jina Reader](/tools/jina-reader)'s s.jina.ai search sits on third-party engines. Brave's strength is classic ranked results plus LLM Context from one index; Tavily and Exa lean further into extracted content and research endpoints. On agent plumbing, Tavily, Exa and Parallel host remote MCP servers, while Brave's runs locally. Tavily's free tier needs no card; Brave's requires one. The [web search APIs roundup](/guides/comparisons/best-web-search-apis-for-ai-agents-2026) compares all of them across search results, content extraction and synthesized answers.

## Good to know

Plans, as of September 2026 from Brave's pricing page: Search is $5 per 1,000 requests at up to 50 requests per second, covering web, LLM Context, news, video and image search; Answers is $4 per 1,000 queries plus $5 per million input tokens and $5 per million output tokens, at 2 requests per second; Spellcheck and Autosuggest add-ons are $5 per 10,000 requests; Enterprise is sold through sales and adds Zero Data Retention. Every plan includes $5 in free credits each month, with no rollover. New activations are prepaid, and only successful requests are billed.

Brave restructured its plans in February 2026, so plan names in older third-party posts may not match what the dashboard shows. Rate limits use a one-second sliding window and return HTTP 429 when exceeded; each plan allows up to 10 API keys.

The MIT license covers the MCP server (npm `@brave/brave-search-mcp-server`, version 2.1.3, released August 2026), not the API, which is a commercial service. There is no official SDK: the docs use raw HTTP, Answers goes through the OpenAI SDK, and the PyPI `brave-search` package is third-party. Brave lists SOC 2 Type II and an AWS Marketplace listing. For where search APIs sit next to scrapers and page fetchers, see [Getting Web Data into AI Agents](/guides/concepts/web-data-for-ai-agents).
