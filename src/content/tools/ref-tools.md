---
name: "Ref Context"
title: "Ref Context"
seoTitle: "Ref Context MCP (ref.tools): Docs Search for Coding Agents"
description: "Ref's documentation-search MCP server: search-then-read tools over public docs, your private GitHub repos, and PDFs. Hosted, and an API key is required."
date: "2026-09-11"
url: "https://docs.ref.tools/context/getting-started/intro"
pricing: "paid"
category: "mcp"
repo: "https://github.com/ref-tools/ref-tools-mcp"
license: "MIT"
os: ["Web"]
color: "cyan"
topics: ["mcp"]
audience: ["developers"]
tags: ["mcp", "documentation", "docs-search", "private-docs", "context"]
featured: false
sameAs:
  - "https://ref.tools"
  - "https://github.com/ref-tools/ref-tools-mcp"
  - "https://www.npmjs.com/package/ref-tools-mcp"
related: ["tool:context7", "tool:gitmcp", "tool:jina-reader", "guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "command:add-mcp-server"]
alternativeTo: ["context7", "gitmcp", "jina-reader"]
summary: "Ref Context is Ref's documentation-search MCP server: two tools, ref_search_documentation and ref_read_url, let an agent search public docs, your private GitHub repos, and uploaded PDFs, then read pages trimmed, per Ref, to the relevant section. It runs as a hosted Streamable HTTP endpoint and always needs an API key; the legacy stdio server is MIT."
faq:
  - q: "What does Ref Context add to Claude Code?"
    a: "A documentation index your agent can query through two MCP tools: one searches public docs, your private GitHub repos, and uploaded PDFs, and the other reads a URL. Per Ref's README, the read tool returns the most relevant section of a page, around 5k tokens, rather than the whole page."
  - q: "How do I add Ref Context to Claude Code?"
    a: "Create an API key at ref.tools/keys, then run: claude mcp add --transport http Ref https://api.ref.tools/mcp --header 'x-ref-api-key: <YOUR_API_KEY>'. Running claude mcp list should then show Ref: https://api.ref.tools/mcp (HTTP)."
  - q: "Is Ref Context free?"
    a: "Only to try. New accounts get 200 one-time credits that never expire, and each search or read costs 1 credit. As of September 2026, ongoing use means a paid plan starting at Pro, $50 per month for 6,000 credits; the MCP server code itself is MIT."
---

**Ref Context** is the documentation-search MCP server from Ref: it gives a coding agent a **search-then-read tool pair** over public docs, your private GitHub repos, and PDFs you upload, and it's designed to return only the relevant slice of each page. Choose it over the free options when your agent needs your internal docs as well as public ones and you're fine paying per call. One naming caution: as of September 2026, the ref.tools homepage leads with a separate product, Ref Plans, a multiplayer plan editor for coordinating coding agents. This page covers only the docs MCP, which Ref's documentation still maintains as its own "Ref Context" section.

## Highlights

- **Two tools, built for iteration** — `ref_search_documentation` takes a `query` and `ref_read_url` takes a `url`, so the agent can search, read, and refine in a loop.
- **Session-aware results** — Ref's README says repeated similar searches in one session never return the same result twice, and that page reads use the session's search history to return the most relevant 5k tokens.
- **Private sources on every tier** — connect GitHub repos or upload PDFs and Markdown; even the free allotment covers 3 small repos, 1 large repo, and 100 PDF pages.
- **Hosted over Streamable HTTP** — the recommended endpoint is `https://api.ref.tools/mcp`; the MIT-licensed `ref-tools-mcp` npm package is the legacy stdio route.
- **Per-call metering** — each search and each read costs 1 credit, and the credit pool is shared with Ref Plans on the same account.
- **Deep-research compatible** — OpenAI deep-research clients see the same tools as `search` and `fetch`.

## In an AI-assisted workflow

Create a key at ref.tools/keys, then add the hosted server to [Claude Code](/tools/claude-code) with the command from Ref's install docs:

```bash
claude mcp add --transport http Ref https://api.ref.tools/mcp --header "x-ref-api-key: <YOUR_API_KEY>"
```

Running `claude mcp list` should then print `Ref: https://api.ref.tools/mcp (HTTP)`. From there, prompts like these put it to work:

```text
Search Ref for the current docs on this SDK's streaming API, read the most relevant page, and update our client to match.
Before you touch the webhook handler, check how our billing-service repo documents retries.
Read the migration guide at <URL> with Ref and list the breaking changes that affect this codebase.
```

The second prompt assumes you've connected that repo as a private source. Ref suits the loop the [documentation-engineer](/agents/developer-tools/documentation-engineer) agent runs: check the source of truth before writing about an API. For scopes and header-based auth in general, see [adding MCP servers to Claude Code](/guides/mcp/claude-code-mcp-setup).

> [!TIP]
> Every search and every read costs a credit, so tell the agent when to reach for Ref. A CLAUDE.md line such as "search Ref before writing code against an unfamiliar or fast-moving library, and read at most two pages per question" keeps usage predictable.

## How it compares

[Context7](/tools/context7) is the closest match: Ref can read any URL and includes private repos and PDFs on every tier, while Context7 answers from its own library index, reserves private repos for paid plans, works anonymously at low rate limits, and resets its free allowance monthly (1,000 API calls as of September 2026) where Ref's 200 free credits are one-time. [GitMCP](/tools/gitmcp) is the free, no-signup choice when the docs you need live in a public GitHub repo, and [Jina Reader](/tools/jina-reader) covers plain URL-to-markdown fetching without the search half. [Serena](/tools/serena) doesn't compete: it navigates and edits your local code through language servers, so it pairs with Ref rather than replacing it.

## Good to know

Plans, as of September 2026 from Ref's pricing page: Free is $0 with 200 one-time credits that never expire (3 small repos, 1 large repo, 100 PDF pages). Pro is $50 per month for 6,000 credits a month, 50 small repos, 5 large repos, and 5,000 PDF pages. Max is $200 per month for 30,000 credits a month, unlimited small repos, 25 large repos, and 25,000 PDF pages. Enterprise is custom, and Pro and above can buy extra credits at $10 per 1,000.

The hosted endpoint needs nothing installed. The MIT repo (about 1.2k GitHub stars as of September 2026) contains only the legacy stdio server, which runs through `npx ref-tools-mcp@latest` with a `REF_API_KEY` env var; its npm package was last published in November 2025 (v3.0.3), and the repo's last commit landed in May 2026. The hosted service is the maintained path: Ref's docs changelog carries monthly update posts through July 2026, and the docs include install guides for 19 clients. Two caveats: there's no anonymous mode, so every client needs a key, and Ref's own Context7 comparison page quotes older plans on both sides, so compare the current pricing pages instead. For where Ref fits among other servers, see [the best MCP servers in 2026](/guides/mcp/best-mcp-servers-2026).
