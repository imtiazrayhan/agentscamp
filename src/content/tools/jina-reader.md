---
name: "Jina Reader"
description: "Prefix any URL with r.jina.ai/ to get LLM-ready Markdown: JavaScript rendering, PDFs, image captions, and s.jina.ai to search and read the top results."
date: 2026-06-11
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://jina.ai/reader"
pricing: "freemium"
category: "platform"
repo: "https://github.com/jina-ai/reader"
license: "Apache-2.0"
os: ["Web"]
color: "yellow"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["web-data", "scraping", "markdown", "api"]
featured: false
alternativeTo: ["firecrawl", "tavily", "exa"]
sameAs:
  - "https://github.com/jina-ai/reader"
  - "https://r.jina.ai"
related: ["guide:web-data-for-ai-agents", "tool:firecrawl", "tool:tavily", "tool:exa", "glossary:rag"]
summary: "Jina Reader turns a web page into clean Markdown when you put https://r.jina.ai/ in front of its URL. It renders JavaScript, reads PDFs and can caption images. s.jina.ai runs a web search and returns the content of the top five results. Reader works without a key at 20 requests a minute; a free key raises that to 500 and adds 10 million tokens."
faq:
  - q: "How do I use Jina Reader?"
    a: "Prepend the prefix: curl https://r.jina.ai/https://example.com/article returns the page as Markdown. No SDK or account is needed for light use. Request headers tune the result: X-Engine picks the fetcher, X-Respond-With changes the output shape, X-Target-Selector and X-Remove-Selector keep or drop CSS selectors, and X-Token-Budget fails a request that would exceed a token cap."
  - q: "What are Jina Reader's rate limits?"
    a: "From the table on jina.ai/reader: r.jina.ai allows 20 requests per minute without a key, 500 with a free or paid key and 5,000 with a premium key. s.jina.ai is blocked without a key and allows 100 requests per minute with one, or 1,000 on premium. Limits are tracked per IP address, or per key once you send one."
  - q: "Is Jina Reader open source?"
    a: "Partly. The service code in jina-ai/reader is Apache-2.0 and can be self-hosted from the ghcr.io/jina-ai/reader:oss Docker image, though the SaaS storage layer is not included. The models Reader can use, including ReaderLM-v2 and jina-vlm, are CC-BY-NC 4.0, which is not an open-source licence: commercial production use needs a commercial licence, which Elastic has sold separately since August 10, 2026."
  - q: "How is Jina Reader billed?"
    a: "By tokens. Reader counts the tokens in the response, so long pages cost more, and each s.jina.ai search costs a fixed amount starting from 10,000 tokens. Keyless r.jina.ai calls are free within the rate limit. One API key covers Reader along with Jina's embedding and reranker APIs."
---

[Jina Reader](https://jina.ai/reader) has the lowest integration cost of any web-content tool: it is a URL prefix. Put `https://r.jina.ai/` in front of a link and the response is the page as clean Markdown, with navigation, headers, footers and ads stripped. A second endpoint, `s.jina.ai`, searches the web and returns the content of the results, not only titles and snippets. Reader comes from Jina AI, which is now part of Elastic.

## Highlights

- **URL prefix.** `https://r.jina.ai/<url>` works from curl, a browser or any HTTP client, with GET or POST. Repeating a URL within five minutes is served from cache.
- **Choice of fetch engine.** The `X-Engine` header selects a plain HTTP fetch (`direct`, the fastest) or the default headless-browser engine that executes client-side JavaScript before extraction. A Cloudflare-backed `cf-browser-rendering` engine is experimental as of November 2026.
- **PDFs and documents.** Reader parses PDF URLs natively. The open-source README also covers Word, Excel and PowerPoint files, converted through LibreOffice, and direct upload of PDFs and Office files in a `file` body field.
- **Image captions.** `X-With-Generated-Alt` adds a caption to every image that lacks alt text, so a text-only model does not lose the figures.
- **Output control.** `X-Respond-With` returns other shapes of the same page, `X-Target-Selector` and `X-Remove-Selector` scope extraction by CSS selector, `X-Timeout` caps the page-load wait, and `X-Proxy-Url` routes the fetch through your own proxy.
- **`s.jina.ai` search.** Prepend `https://s.jina.ai/?q=` to a query and Reader returns the top five results with their URLs and contents.
- **MCP server.** Jina hosts `mcp.jina.ai` so MCP clients can call its APIs as tools.

## In an AI-assisted workflow

```bash
# page -> Markdown (keyless works, at 20 requests a minute)
curl "https://r.jina.ai/https://example.com/docs/page"

# faster plain-HTTP fetch for static pages
curl -H "X-Engine: direct" "https://r.jina.ai/https://example.com/docs/page"

# search -> content of the top results (needs a key)
curl -H "Authorization: Bearer $JINA_API_KEY" "https://s.jina.ai/?q=model+context+protocol"
```

Reader's role in an agent is the lightweight fetcher: the "read this URL" tool in a research loop, or the one-off ingester feeding a [RAG](/glossary/rag) index. It is also a practical way to check a fact against a vendor page from a script. When you need whole-site crawling, scheduling or structured extraction, that is a job for a heavier tool.

> [!TIP]
> Get a free key even for hobby use. Keyless access is 20 requests a minute on `r.jina.ai` and none at all on `s.jina.ai`; a free key is 500 a minute on Reader, 100 on search, and comes with 10 million tokens.

## Pricing

Every new API key includes 10 million free tokens. As of November 2026, jina.ai/reader sells top-ups of 1 billion tokens for $50 ($0.050 per 1M tokens) and 11 billion tokens for $500 ($0.045 per 1M), and the larger pack turns the key into a premium key with higher rate limits.

Two usage details change the bill. Reader charges for output tokens, so a giant page costs more than a short one, and `X-Token-Budget` exists to stop a runaway request. And the optional `jina-ocr-v1` image-to-Markdown mode is listed as costing 40 times more tokens.

## Good to know

Reader behaves as a standard web client and respects site access controls: if a site blocks the request, you get the block, and complying with the target site's terms is on you. The rate-limit table lists average latency of 7.9 seconds for `r.jina.ai` and 2.5 seconds for `s.jina.ai`; a `direct` fetch of a simple page is far quicker than a browser render of a heavy single-page app.

Self-hosting is possible with `docker run --rm -p 3000:8081 ghcr.io/jina-ai/reader:oss`. The repository is the open-source branch of the code behind both endpoints, last re-synchronised with the SaaS code in April 2026, and it runs stateless or with a bucket cache because the hosted storage layer is stripped out. The [repo](https://github.com/jina-ai/reader) has about 12,000 GitHub stars as of November 2026. Mind the model licences: the Apache-2.0 code is free to use commercially, but ReaderLM-v2 and jina-vlm are CC-BY-NC 4.0.

Against the alternatives: [Firecrawl](/tools/firecrawl) adds crawling, mapping, page interaction and plan-based concurrency for work at scale. [Tavily](/tools/tavily) and [Exa](/tools/exa) are search-first APIs with their own ranking. [Keenable](/tools/keenable) pairs search with fetch-to-Markdown on its own index. Every documented request header, with curl recipes, is in the [Jina Reader API guide](/guides/advanced/jina-reader-api), and [getting web data into AI agents](/guides/concepts/web-data-for-ai-agents) and the [web search API roundup](/guides/comparisons/best-web-search-apis-for-ai-agents-2026) compare the field.
