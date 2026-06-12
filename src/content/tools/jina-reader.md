---
name: "Jina Reader"
description: "Prepend r.jina.ai/ to any URL and get LLM-ready markdown — JS rendering, PDFs and Office docs, image captioning, and s.jina.ai for read-the-results search."
date: 2026-06-11
url: "https://jina.ai/reader"
pricing: "freemium"
category: "platform"
repo: "https://github.com/jina-ai/reader"
license: "Apache-2.0"
os: ["Web"]
color: "yellow"
topics: ["ai-agents-systems"]
tags: ["web-data", "scraping", "markdown", "api"]
featured: false
alternativeTo: ["firecrawl", "tavily", "exa"]
sameAs:
  - "https://github.com/jina-ai/reader"
  - "https://r.jina.ai"
related: ["web-data-for-ai-agents", "firecrawl", "tavily", "exa", "rag"]
summary: "Jina Reader is the zero-integration web-content tool: prefix any URL with https://r.jina.ai/ and get clean, LLM-ready markdown — headless-Chrome rendering, PDFs and Office files, images auto-captioned for text-only models. s.jina.ai searches and returns the full content of the top results. Apache-2.0 open-source branch, generous keyed free tier."
faq:
  - q: "How do I use Jina Reader?"
    a: "Prepend the prefix — curl https://r.jina.ai/https://example.com/article returns the page as markdown. No SDK, no account for light use (keyless is throttled to ~20 requests/minute); a free API key raises Reader to 500 RPM, unlocks s.jina.ai search, and comes with a large token grant. Output and engine are tunable via headers (x-respond-with, x-engine, x-target-selector)."
  - q: "What's s.jina.ai?"
    a: "Search that reads: it runs your query, then fetches and fully extracts the top five results through the same Reader stack — so instead of titles and snippets, your agent gets the actual content of the best pages in one call. It requires an API key."
  - q: "Is Jina Reader still maintained after the Elastic acquisition?"
    a: "Yes — Elastic completed its acquisition of Jina AI in October 2025 and committed to continuing its products; the Reader repo saw a re-platform in 2025 and its open-source branch was re-synced with the SaaS code in April 2026. Note the repo is the stateless core — the SaaS storage layer isn't included, so self-hosting isn't full feature parity."
---

Jina Reader won its niche with the lowest possible integration cost: **it's a URL prefix.** No SDK, no schema, no session — `r.jina.ai/` in front of any link returns the page as clean markdown, which makes it the tool agents and scripts reach for when "just read this page" is the whole requirement.

## Highlights

- **URL-prefix simplicity** — `https://r.jina.ai/<url>` from curl, a browser, or any HTTP client; the API is the URL bar.
- **Real-web handling** — headless Chrome for JS-heavy pages with an auto-selected curl fast path; PDFs via PDF.js and Word/Excel/PowerPoint via LibreOffice, including direct binary upload.
- **Vision built in** — images are auto-captioned into alt text, so text-only models don't lose the figures.
- **Output control via headers** — markdown/html/text/screenshot, CSS-scoped extraction (`x-target-selector`), engine and cache controls.
- **`s.jina.ai`** — query in, *full content* of the top five results out: search and read collapsed into one call.
- **Open core** — the Apache-2.0 repo is the working stateless engine behind the endpoints (SaaS storage layer excluded), self-hostable via Docker.

## In an AI-assisted workflow

```bash
curl "https://r.jina.ai/https://example.com/docs/page"        # page → markdown
curl -H "Authorization: Bearer $JINA_KEY" "https://s.jina.ai/your+query"   # search → full contents
```

Its agent role is the lightweight fetcher: the "read this URL" tool in a research loop, the one-off ingester feeding [RAG](/glossary/rag) — anywhere [Firecrawl](/tools/firecrawl)'s crawl-scale machinery would be overkill.

> [!TIP]
> The free tier's shape rewards a key even for hobby use: keyless is ~20 RPM with slower service, while a free key is 500 RPM plus a ten-million-token grant — and unlocks search.

## Good to know

Jina AI was **acquired by Elastic** (completed October 2025; founder Han Xiao became Elastic's VP of AI) with products continuing — Reader's repo stayed active through 2026. Token-based billing scales with output length, so giant pages cost more. Versus the field: Firecrawl for crawl/extract at scale, [Tavily](/tools/tavily) for the all-in-one agent layer, [Exa](/tools/exa) for semantic search — mapped in [Getting Web Data into AI Agents](/guides/concepts/web-data-for-ai-agents).
