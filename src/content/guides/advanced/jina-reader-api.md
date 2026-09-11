---
title: "Jina Reader API: r.jina.ai and s.jina.ai Headers, Examples, and Limits"
seoTitle: "Jina Reader API Guide: r.jina.ai Headers, Examples, Limits"
description: "How to use the Jina Reader API: r.jina.ai and s.jina.ai quickstart, every documented request header, curl recipes, rate limits, MCP setup, and self-hosting."
author: "Imtiaz Rayhan"
date: "2026-09-11"
color: "green"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["jina-reader", "web-data", "web-scraping", "markdown", "api", "mcp"]
keywords: ["jina reader api", "r.jina.ai", "s.jina.ai/search", "x-respond-with r.jina.ai", "x-target-selector r.jina.ai", "jina reader local", "s.jina.ai/search example", "jina ai reader url reader"]
summary: "Prepend https://r.jina.ai/ to any URL to get LLM-ready markdown, then shape the output with request headers such as X-Respond-With, X-Target-Selector and X-Wait-For-Selector. Reader works without a key at 20 requests per minute; s.jina.ai search needs a key. Elastic, which acquired Jina AI in October 2025, says the API continues as before."
keyTakeaways:
  - "r.jina.ai is a URL prefix: https://r.jina.ai/ plus the target URL returns markdown, and a POST with url in the body handles hash-routed single-page apps."
  - "Headers do the real work: X-Respond-With picks the format, X-Target-Selector and X-Remove-Selector scope the page, and X-Wait-For-Selector and X-Timeout handle JavaScript."
  - "Reader runs without a key at 20 requests per minute; a free key raises that to 500 and is required for s.jina.ai search (limits as of September 2026)."
  - "s.jina.ai searches third-party engines, then reads each result through Reader, so you get page content rather than snippets unless you send X-Respond-With: no-content."
  - "Jina publishes an official remote MCP server at mcp.jina.ai and an Apache-2.0 open-source Reader you can run locally with Docker."
howtoSteps:
  - name: "Read a page with the URL prefix"
    text: "Request https://r.jina.ai/ followed by the full target URL, for example curl https://r.jina.ai/https://example.com. The response is markdown headed by Title, URL Source and Markdown Content lines."
  - name: "Add an API key"
    text: "Get a key from Jina and send it as Authorization: Bearer followed by the key. As of September 2026, Reader allows 20 requests per minute without a key and 500 with a free key, and every new key comes with 10 million free tokens."
  - name: "Shape the output with headers"
    text: "Use X-Respond-With to choose markdown, html, text, screenshot or frontmatter, X-Target-Selector to keep one element, and X-Remove-Selector to strip navigation, footers and comments."
  - name: "Handle JavaScript-heavy pages"
    text: "Add X-Wait-For-Selector with a CSS selector that appears once content loads, or X-Timeout with a number of seconds up to 180. For hash-routed single-page apps, POST to https://r.jina.ai/ with url in the body, because the fragment never reaches a server."
  - name: "Search with s.jina.ai"
    text: "Call https://s.jina.ai/ with an encoded query and your Authorization header. Each result comes back with its page content; send X-Respond-With: no-content to get titles, URLs and snippets only."
  - name: "Connect it to Claude Code"
    text: "Add Jina's official remote MCP server with claude mcp add -s user --transport http jina https://mcp.jina.ai/v1 plus an Authorization header. It exposes tools such as read_url, search_web and capture_screenshot_url."
  - name: "Self-host when you need to"
    text: "Run docker pull ghcr.io/jina-ai/reader:oss, then docker run --rm -p 3000:8081 ghcr.io/jina-ai/reader:oss, and request http://localhost:3000/ followed by the target URL."
faq:
  - q: "How do I use r.jina.ai?"
    a: "Put https://r.jina.ai/ in front of the page URL, for example https://r.jina.ai/https://example.com, and request it with curl or any HTTP client. The response is the page as markdown under a short Title and URL Source header block. Send Accept: application/json to get a JSON object instead."
  - q: "What does the X-Respond-With header do in r.jina.ai?"
    a: "It selects the output format. The documented values are content (the default), markdown, html, text, screenshot, pageshot, frontmatter, combinations such as markdown+frontmatter, readerlm-v2 and vlm. On s.jina.ai, no-content returns search results without fetching the pages."
  - q: "How does X-Target-Selector work in r.jina.ai?"
    a: "It takes a CSS selector and returns only the matching element, which keeps navigation and sidebars out of your model's context. It also makes Reader wait for that selector to render, as X-Wait-For-Selector does. Pair it with X-Remove-Selector to drop elements inside the target, such as comments."
  - q: "Does s.jina.ai need an API key?"
    a: "Yes. A keyless call to s.jina.ai returns HTTP 401 with an AuthenticationRequiredError, so send an Authorization: Bearer header with your key. As of September 2026, a free key allows 100 search requests per minute."
  - q: "Can I run Jina Reader locally?"
    a: "Yes. The Apache-2.0 open-source branch ships as the Docker image ghcr.io/jina-ai/reader:oss, which runs stateless with no cache and no rate limiting by default. It leaves out the hosted service's MongoDB storage layer, and the ReaderLM-v2 and jina-vlm models are licensed CC-BY-NC 4.0."
  - q: "Is the Jina Reader API still available after the Elastic acquisition?"
    a: "Yes. Elastic completed its acquisition of Jina AI on October 9, 2025, and says the Reader API continues to be developed and maintained, with endpoints, headers and keys unchanged. The one stated exception is that it cannot serve entities or countries subject to U.S. export controls."
sources:
  - title: "jina-ai/reader README"
    url: "https://github.com/jina-ai/reader/blob/main/README.md"
    publisher: "Jina AI"
  - title: "Reader cookbooks"
    url: "https://github.com/jina-ai/reader/blob/main/cookbooks.md"
    publisher: "Jina AI"
  - title: "Jina Reader API reference (OpenAPI)"
    url: "https://r.jina.ai/docs"
    publisher: "Jina AI"
  - title: "Jina Reader"
    url: "https://jina.ai/reader"
    publisher: "Jina AI"
  - title: "Jina AI API guide"
    url: "https://docs.jina.ai/"
    publisher: "Jina AI"
  - title: "Jina AI Remote MCP Server"
    url: "https://github.com/jina-ai/MCP"
    publisher: "Jina AI"
  - title: "Elastic Completes Acquisition of Jina AI"
    url: "https://ir.elastic.co/News--Events/news/news-details/2025/Elastic-Completes-Acquisition-of-Jina-AI-a-Leader-in-Frontier-Models-for-Multimodal-and-Multilingual-Search/default.aspx"
    publisher: "Elastic"
  - title: "Jina AI contact sales and acquisition FAQ"
    url: "https://jina.ai/contact-sales"
    publisher: "Jina AI"
related: ["tool:jina-reader", "guide:web-data-for-ai-agents", "guide:best-web-search-apis-for-ai-agents-2026", "tool:firecrawl", "tool:exa", "tool:tavily", "guide:claude-code-mcp-setup", "skill:web-research-pipeline"]
---

The [Jina Reader](/tools/jina-reader) API turns any URL into LLM-ready text: request `https://r.jina.ai/` followed by the page URL and markdown comes back, while request headers control format, scope, timing and caching. Its sibling `s.jina.ai` searches the web and returns the content of each result, and it needs an API key. What follows is a 60-second quickstart, every documented header in one reference, copy-paste curl recipes, and the limits as of September 2026.

## What Jina Reader does

Reader is Jina AI's hosted fetch-and-convert service; Jina AI has been part of Elastic since October 2025. It loads a page, using a headless browser when needed, and returns it as markdown, HTML, text, a screenshot or JSON. It reads PDFs by URL, and since December 2025 it also accepts uploaded PDF and Office files. `s.jina.ai` runs the same pipeline over search results. There is no SDK: the API is plain HTTP, with an official CLI and MCP server alongside it.

## Quickstart: read a page in 60 seconds

No account is needed for a first call:

```bash
curl 'https://r.jina.ai/https://example.com'
```

The default response is plain text: a header block with `Title:`, `URL Source:` and `Published Time:` lines, an optional `Warning:` line, then `Markdown Content:` followed by the page. Response headers include `x-usage-tokens`, `x-ratelimit-limit` and `x-ratelimit-remaining`, which is enough to meter usage from a script.

If you searched for `r.jina.ai/?url=`, the documented way to pass the target as a parameter instead of a path is a POST with a `url` body field. You need it whenever the route lives after a `#`, because browsers never send the fragment to a server:

```bash
curl -X POST 'https://r.jina.ai/' -d 'url=https://example.com/#/route'
```

## Auth, API keys and rate limits

Send your key as a bearer token: `Authorization: Bearer <JINA_API_KEY>`. One key covers Jina's Reader, Embeddings, Reranker, Classifier and Segmenter APIs, and they share its token balance. Keys don't expire, and you can revoke them in the API dashboard.

Limits as of September 2026, from Jina's Reader page:

| Endpoint | No key | Free or paid key | Premium key | Billed on |
| --- | --- | --- | --- | --- |
| `r.jina.ai` | 20 RPM | 500 RPM | 5,000 RPM | Tokens in the output |
| `s.jina.ai` | Blocked (HTTP 401) | 100 RPM | 1,000 RPM | A fixed token count per request, starting from 10,000 |

Limits are counted per IP without a key and per key with one, in requests and tokens per minute, whichever you hit first.

Billing is prepaid in tokens. Every new key comes with 10 million free tokens, a tier Jina's price table labels "Non-commercial use only (CC-BY-NC)." Failed requests aren't charged, and ReaderLM-v2 requests cost three times the tokens. Paid token packs are listed on Jina's Reader page.

## r.jina.ai header reference

Every option below is a request header. Header names are case-insensitive (Jina's own examples mix `X-Respond-With` and `x-respond-with`), most have a camelCase twin for POST bodies, and `s.jina.ai` accepts the same set. A dash in the Values column means Jina's reference lists no values.

### Output format headers

| Header | Values | What it does |
| --- | --- | --- |
| `Accept` | `application/json` (or `text/json`), `text/event-stream`, `text/plain` | JSON response, stream mode, or plain text |
| `X-Respond-With` | `content` (default), `markdown`, `html`, `text`, `screenshot`, `pageshot`, `frontmatter`, combos like `markdown+frontmatter`, `readerlm-v2`, `vlm` | Output format (details below) |
| `X-Return-Format` | `markdown`, `html`, `text`, `screenshot`, `pageshot` | Legacy alias of `X-Respond-With`; not in the OpenAPI spec |
| `X-With-Generated-Alt` | `true` | Captions images that lack alt text; doesn't work when `X-Respond-With` is set |
| `X-Markdown-Chunking` | `true`, `h1`–`h5`, `structured`, `s1`–`s5` | Splits output by heading or by block; JSON returns an array of chunks |
| `X-Preset` | `reader`, `index`, `research`, `agent`, `spider` | Bundled defaults; fills only options you didn't set |
| `X-Max-Tokens` | integer (README: at least 500) | Truncates the response to N tokens |
| `X-Token-Budget` | integer | Rejects the request if the result would exceed N tokens; ignored on search |

`X-Respond-With` values, per Jina's docs: `content` applies readability filtering, `markdown` skips it, `html` returns `documentElement.outerHTML`, `text` returns `document.body.innerText`, `screenshot` returns the URL of a viewport screenshot, `pageshot` captures the full page, and `frontmatter` returns markdown with YAML front matter.

### Content selection headers

| Header | Values | What it does |
| --- | --- | --- |
| `X-Target-Selector` | CSS selector | Returns only the matched element; implies `X-Wait-For-Selector` with the same selector |
| `X-Wait-For-Selector` | CSS selector | Waits for the element to render before returning |
| `X-Remove-Selector` | CSS selectors, e.g. `nav, footer` | Strips matching elements |
| `X-Remove-Overlay` | `true` | Strips cookie banners and modals |
| `X-With-Iframe` | `true`, `quoted` | Inlines iframe content, or wraps it in a blockquote; forces network-idle timing |
| `X-With-Shadow-Dom` | `true` | Includes Shadow DOM content |
| `X-Detach-Invisibles` | — | Detaches `display:none` elements before the snapshot; needs the browser engine; disables caching |
| `X-Page` | page number (1-indexed) | Selects one page of an uploaded PDF, DOC, XLS or PPT |

### Engine, timing and cache headers

| Header | Values | What it does |
| --- | --- | --- |
| `X-Engine` | `browser`, `direct`, `cf-browser-rendering` | Headless Chrome (best quality), plain HTTP fetch (fastest), or experimental Cloudflare-backed rendering; omit it for the default |
| `X-Timeout` | seconds, max 180 | Waits for network idle or the timeout instead of returning early |
| `X-Respond-Timing` | `html`, `visible-content`, `mutation-idle`, `resource-idle`, `media-idle`, `network-idle` | When to take the snapshot; `network-idle` is implied when `X-Timeout` is 20 or more |
| `X-No-Cache` | `true` | Bypasses the cache; same as `X-Cache-Tolerance: 0` |
| `X-Cache-Tolerance` | seconds | How stale a cached copy may be |
| `DNT` | `1` | Don't cache or track this request |
| `X-Preload-Url` | URL | Preloads a URL before scraping |
| `X-No-Service-Worker` | — | Disables service workers in the browser |

### Links, images and media headers

| Header | Values | What it does |
| --- | --- | --- |
| `X-With-Links-Summary` | `true`, `all` | Adds a deduplicated link footer, or every link |
| `X-With-Images-Summary` | `true` | Adds a unique-images footer |
| `X-Retain-Images` | `all` (default), `none`, `alt`, `all_p`, `alt_p` | Keeps images, drops them, or keeps alt text only; `_p` variants add generated alt text |
| `X-Retain-Links` | `all` (default), `none`, `text`, `gpt-oss` | Keeps links, drops them, keeps anchor text, or emits `【{id}†…】` citations plus a URL footer |
| `X-Retain-Media` | `link` (default), `none`, `text`, `image`, `html` | How `<video>`, `<audio>` and video iframes render |
| `X-Keep-Img-Data-Url` | `true` | Keeps inline base64 images |
| `X-Base` | `initial`, `final` | Resolves relative URLs against the original or the post-redirect URL |

The OpenAPI spec spells the links header `X-With-links-Summary`; since header names are case-insensitive, either works.

### Network, identity and session headers

| Header | Values | What it does |
| --- | --- | --- |
| `Authorization` | `Bearer <JINA_API_KEY>` | Your key; raises limits and is required for search |
| `X-Proxy` | country code, `auto`, `none` | Routes through Jina's proxy; needs a key |
| `X-Proxy-Url` | `http`, `https`, `socks4` or `socks5` URL | Uses your own proxy, e.g. `https://user:pass@host:port` |
| `X-Set-Cookie` | Set-Cookie syntax, optional `; domain=` | Replays cookies you hold; such requests are never cached |
| `X-Locale` | locale, e.g. `de-DE` | Sets `navigator.language` and `Accept-Language` |
| `X-User-Agent` | `browser`, `auto`, `inherit` / `pass-through`, `bot`, `diversify`, or a custom string | The user agent to present |
| `X-Referer` | referer | The Referer to send |
| `X-Robots-Txt` | bot user agent | Checks robots.txt for that agent before fetching |
| `X-Export-Storage-State` | — | Adds a reusable `storageState` (cookies and localStorage) to JSON output; needs the browser engine; disables caching |
| `X-Assert-Status-Code` | HTTP status | Rejects with 422 if the target returns a different status |
| `X-Skip-Cert-Verification` | — | Skips TLS verification, which Jina notes violates security best practices |

### Markdown style headers

| Header | Values | What it does |
| --- | --- | --- |
| `X-No-Gfm` | `true`, `table` | Turns off GitHub-flavored Markdown, or only its tables |
| `X-Md-Heading-Style` | `setext`, `atx` | Heading syntax |
| `X-Md-Hr` | text | Horizontal-rule text |
| `X-Md-Bullet-List-Marker` | `-`, `+`, `*` | Bullet marker |
| `X-Md-Em-Delimiter` | `_`, `*` | Emphasis delimiter |
| `X-Md-Strong-Delimiter` | `**`, `__` | Bold delimiter |
| `X-Md-Link-Style` | `inlined`, `referenced`, `discarded` | Link syntax |
| `X-Md-Link-Reference-Style` | `full`, `collapsed`, `shortcut`, `discarded` | Reference-link style |

Some options have no header and go in the POST body: `viewport` (`{width, height}`), `injectPageScript` and `injectFrameScript` (JavaScript that runs before extraction, with a `window.waitForSelector()` helper), plus `html`, `file`, `pdf` and `url`. For structured extraction with ReaderLM-v2, the OpenAPI spec documents `jsonSchema` and `instruction` as query or body parameters, not headers.

## Recipes

Each example below is copied from Jina's README or cookbook, or uses one documented header. Add your `Authorization` header to any of them to get keyed rate limits.

### Clean markdown for an LLM

The default `content` mode keeps the main content; `markdown` converts the whole page. For [RAG](/glossary/rag) ingestion, `frontmatter` moves the title and metadata into YAML front matter:

```bash
curl -H 'X-Respond-With: frontmatter' 'https://r.jina.ai/https://example.com'
```

Or start from a preset, which fills in only the options you haven't set:

```bash
curl https://r.jina.ai/https://example.com/article \
  -H 'x-preset: index'
```

To control cost, `X-Max-Tokens` truncates long pages and `X-Token-Budget` rejects them outright.

### Target and remove selectors

When you know the site's template, scope the read to the article and strip the noise inside it:

```bash
curl https://r.jina.ai/https://example.com/blog/post-slug \
  -H 'x-target-selector: article.post-body' \
  -H 'x-remove-selector: nav, .related-posts, .comments, footer'
```

`X-Target-Selector` also waits for its selector to appear, so you rarely need it and `X-Wait-For-Selector` together.

### Wait for JavaScript-rendered content

```bash
# wait for network idle or until timeout
curl 'https://r.jina.ai/https://example.com/' -H 'x-timeout: 10'

# wait for a specific element
curl 'https://r.jina.ai/https://example.com/' -H 'x-wait-for-selector: #content'
```

`X-Timeout` accepts up to 180 seconds. For finer control, `X-Respond-Timing` picks the snapshot moment, from `html` through `mutation-idle` (at least 0.2 seconds of DOM quiet) to `network-idle`. Send `X-Engine: browser` to force headless Chrome on a page that renders on the client.

### Screenshots

```bash
curl 'https://r.jina.ai/https://example.com' -H 'X-Respond-With: screenshot'
```

`screenshot` returns the URL of a viewport screenshot, and `pageshot` captures the full page. The MCP server offers the same thing as `capture_screenshot_url`.

### JSON output

```bash
curl -H "Accept: application/json" https://r.jina.ai/https://en.m.wikipedia.org/wiki/Main_Page
```

The page text is at `data.content`, next to `title`, `url`, `publishedTime` and `usage.tokens`. Add `X-With-Links-Summary` or `X-With-Images-Summary` and the lists appear at `data.links` and `data.images`.

### Streaming and ReaderLM-v2

`Accept: text/event-stream` turns on stream mode. Jina's January 2025 ReaderLM-v2 announcement pairs it with that HTML-to-markdown model:

```bash
curl https://r.jina.ai/https://news.ycombinator.com/ -H 'x-engine: readerlm-v2' -H 'Accept: text/event-stream'
```

That `x-engine` form is legacy. Current docs select the model with `X-Respond-With: readerlm-v2`. Jina marks it experimental, and it costs three times the tokens.

### Cache control

```bash
curl 'https://r.jina.ai/https://example.com' -H 'X-No-Cache: true'
```

Reader caches recent fetches and flags cached responses with a warning. `X-No-Cache: true` bypasses the cache, `X-Cache-Tolerance` sets acceptable staleness in seconds, and `DNT: 1` skips caching and tracking.

### Proxies and cookies

`X-Proxy` routes the fetch through Jina's proxy and needs a key; per the cookbook, pinning a country needs a premium key. `X-Proxy-Url` uses your own proxy. `X-Set-Cookie` replays cookies you already hold but doesn't log in for you. Jina's FAQ says Reader doesn't circumvent website defenses, and a paid key doesn't unlock sites that block Jina.

### PDFs and Office files

Any URL ending in `.pdf` is parsed with PDF.js and returned as markdown; for arXiv, read either the PDF URL or the HTML version. To convert a local file, upload it. Office files go through LibreOffice:

```bash
curl -X POST 'https://r.jina.ai/' \
  -F 'file=@./report.pdf' \
  -H 'Accept: application/json' \
  -H 'x-markdown-chunking: s3'
```

`x-markdown-chunking: s3` returns block-level chunks as a JSON array. Pick a single page with `X-Page` or the `page` body field, both 1-indexed. Uploads are cached by the SHA-256 hash of the file's bytes.

### Image captions for text-only models

```bash
curl -H "X-With-Generated-Alt: true" https://r.jina.ai/https://en.m.wikipedia.org/wiki/Main_Page
```

Captioning is opt-in. Images without alt text come back as `![Image [idx]: [caption]](url)`, and per the OpenAPI spec the header doesn't work when `X-Respond-With` is set.

## Searching with s.jina.ai

`s.jina.ai` runs your query on the web, then reads each top result through Reader, so your agent gets full page content instead of titles and snippets. It needs a key. Here is Elastic's tutorial example, which also asks for results only:

```bash
curl "https://s.jina.ai/Elastic+Jina" \
  -H "Authorization: Bearer <YOUR_API_KEY>" \
  -H "X-Respond-With: no-content"
```

The OpenAPI spec documents two paths: `/{q}`, as above, and `/search` with a `q` query parameter. Jina's Reader page also shows the `https://s.jina.ai/?q=` form. Encode the query in each case:

```bash
curl 'https://s.jina.ai/search?q=jina+reader' -H 'Authorization: Bearer <YOUR_API_KEY>'
```

| Parameter | Values | What it does |
| --- | --- | --- |
| `q` | encoded query | The search query |
| `num` / `count` | integer | Results to return, up to 20; Jina's docs say five by default, while Elastic's tutorial and the open-source code use 10 |
| `site` | domain, repeatable | Restricts results to those sites |
| `gl` | two-letter country code | Search country |
| `hl` | two-letter language code | Search language |
| `location` | place name | Location; city level is recommended |
| `page` | integer | Pagination |
| `type` | `web` (default), `images`, `news` | Result type |
| `ext`, `filetype`, `intitle`, `loc` | operator values, repeatable | Google-style operators; repeated values are joined with OR |

In-site search, from the README. That example omits the `Authorization` header it now needs:

```bash
curl 'https://s.jina.ai/When%20was%20Jina%20AI%20founded%3F?site=jina.ai&site=github.com'
```

Prefer the `site` parameter to the `X-Site` header, which only Jina's plain-text guide lists. Each search costs a fixed token amount, starting from 10,000. s.jina.ai gets its web results from third-party engines: Elastic's tutorial says the hosted service searches Google, and the open-source code queries Google and Bing, plus an optional `provider=reader` mode over Reader's own cache of pages it has read.

## Calling Jina Reader from an agent

Jina runs an official remote MCP server, `https://mcp.jina.ai/v1`, over Streamable HTTP (with `/sse` kept as a legacy alias). The repo is `jina-ai/MCP`, Apache-2.0. Add it to [Claude Code](/tools/claude-code) with the command from its README:

```bash
claude mcp add -s user --transport http jina https://mcp.jina.ai/v1 \
  --header "Authorization: Bearer ${JINA_API_KEY}"
```

Its tools include `read_url`, `parallel_read_url`, `capture_screenshot_url`, `search_web`, `search_web_deep`, `search_arxiv` and `extract_pdf`. The read and screenshot tools work without a key at the keyless limit; search tools need one. Two controls matter:

- **Trim the toolset** with URL parameters such as `include_tools`, `exclude_tags` or `include_tags`, for example `https://mcp.jina.ai/v1?include_tags=search,read`.
- **Watch truncation.** Jina says Claude Code caps MCP tool responses at 25k tokens, so the server truncates `read_url` output unless you set `max_tokens` (`0` disables it). `read_url` also takes `question`, `chunk_size` and `topk` to return reranked passages.

Remote-server scopes and debugging are covered in [adding MCP servers to Claude Code](/guides/mcp/claude-code-mcp-setup). Outside MCP, any plain HTTP tool can call Reader, and Jina's official CLI (`pip install jina-cli`) adds `jina read` and `jina search`. For a multi-source research loop, see the [web-research-pipeline](/skills/data/web-research-pipeline) skill.

> [!WARNING]
> Fetched pages are untrusted input. A page can carry instructions aimed at your model, so quote Reader output as data and gate any tool that writes, sends or spends. See [defending against prompt injection](/guides/ai-safety/defending-prompt-injection).

## Running Jina Reader locally (self-hosting)

The `jina-ai/reader` repo is the Apache-2.0 open-source branch of the code behind `r.jina.ai` and `s.jina.ai`, re-synced with the hosted service in April 2026. From the README:

```bash
docker pull ghcr.io/jina-ai/reader:oss
docker run --rm -p 3000:8081 ghcr.io/jina-ai/reader:oss
# then: curl http://localhost:3000/https://example.com
```

The image bundles headless Chrome, LibreOffice and CJK fonts; port 8080 serves h2c and 8081 serves HTTP/1.1. It runs stateless by default ("no cache, no rate limiting"), with an optional S3-compatible bucket cache. Non-redistributable assets such as the MaxMind GeoLite databases come from `npm run assets:download`, and the hosted service's MongoDB storage layer isn't included.

The license covers the pipeline, not the models. ReaderLM-v2 and jina-vlm are CC-BY-NC 4.0, so running them in commercial production needs Jina On-Prem. Elastic announced that product on July 27, 2026 and has sold it as its own SKU since August 10, 2026. Calling the hosted APIs commercially needs no separate license.

## Who owns Jina now: Elastic since October 2025

Elastic completed its acquisition of Jina AI on October 9, 2025, and former CEO Han Xiao became Elastic's VP of AI. Elastic's FAQ says the Reader, Embeddings and Reranker APIs "continue to be developed and maintained" and work as before, except for entities or countries subject to U.S. export controls. Endpoints, headers and keys are unchanged; contracts, data-processing terms and support now run through Elastic.

## Failure modes and fixes

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Empty or partial content | The page renders on the client | `X-Wait-For-Selector`, `X-Timeout`, or `X-Engine: browser` |
| Wrong view of a single-page app | The `#` route never reaches the server | POST the URL as a `url` body field |
| HTTP 429 | Rate limit, 20 RPM without a key | Add a key; back off using `x-ratelimit-remaining` |
| HTTP 401 on search | s.jina.ai requires a key | Send `Authorization: Bearer <key>` |
| Old content plus a cache warning | Served from cache | `X-No-Cache: true` |
| Slow reads or timeouts | Heavy pages; Jina cites a 7.9-second average for Reader | Cap `X-Timeout`, pick an earlier `X-Respond-Timing`, or `X-Engine: direct` for static pages |
| A login wall or paywall comes back | Reader doesn't log in or bypass site defenses | `X-Set-Cookie` with cookies you hold, or the site's own API |
| Cookie banners in the markdown | The overlay was captured | `X-Remove-Overlay: true` |
| Truncated output in Claude Code | The MCP server trims to fit the client's cap | Set `max_tokens` on the MCP URL |

## When to use something else

Reader fits "read this URL" and "search and read the top results" with no integration work. Use [Firecrawl](/tools/firecrawl) to crawl or map whole sites at volume, [Exa](/tools/exa) for semantic search on its own index, and [Tavily](/tools/tavily), acquired by Nebius in February 2026, for search, extract and crawl behind one key. If the task needs logins or clicks, you need [browser agents](/guides/comparisons/browser-agents-compared-2026).

For the full field, read [the best web search APIs for AI agents](/guides/comparisons/best-web-search-apis-for-ai-agents-2026). For how search and fetch fit together, read [getting web data into AI agents](/guides/concepts/web-data-for-ai-agents).
