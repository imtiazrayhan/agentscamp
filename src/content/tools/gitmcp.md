---
name: "GitMCP"
title: "GitMCP"
seoTitle: "GitMCP: Free Remote MCP Server for Any GitHub Repo's Docs"
description: "Free, open-source remote MCP server that turns any public GitHub repo or Pages site into docs and code-search tools for your agent. No signup or key."
date: "2026-09-11"
url: "https://gitmcp.io"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/idosal/git-mcp"
license: "Apache-2.0"
os: ["Web"]
color: "cyan"
topics: ["mcp"]
audience: ["developers"]
tags: ["mcp", "github", "documentation", "llms-txt", "remote-mcp"]
featured: false
sameAs:
  - "https://github.com/idosal/git-mcp"
related: ["tool:context7", "tool:deepwiki-mcp", "tool:github-mcp-server", "guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "glossary:llms-txt"]
alternativeTo: ["context7", "deepwiki-mcp", "github-mcp-server"]
summary: "GitMCP is a free, Apache-2.0 remote MCP server that turns any public GitHub repo into a documentation endpoint. Point your agent at gitmcp.io/{owner}/{repo} and it can fetch and search that project's docs, preferring llms.txt, and search its code through GitHub's search API. There's no install, signup, or API key, and it only reads public content."
faq:
  - q: "What does GitMCP add to Claude Code?"
    a: "Tools that fetch and search one GitHub project's documentation, starting from its llms.txt when there is one, plus exact-match code search over the repo through GitHub's search API. The agent reads the library's current docs instead of relying on training data."
  - q: "How do I add GitMCP to Claude Code?"
    a: "GitMCP's README has no Claude Code command, but the endpoint speaks Streamable HTTP, so the standard remote form applies: claude mcp add --transport http gitmcp https://gitmcp.io/{owner}/{repo}, with the placeholders replaced by the repo you want. For one endpoint that picks the repo per request, use https://gitmcp.io/docs instead."
  - q: "Is GitMCP free?"
    a: "Yes. The README calls it a free service to the community with no associated costs, it needs no authentication, and the code is Apache-2.0, so you can also self-host it."
---

**GitMCP** turns any public GitHub repository into a **remote MCP endpoint**: point your agent at `gitmcp.io/{owner}/{repo}` and it gets tools to fetch that project's docs, search them, and search its code. It's the zero-setup fix for hallucinated APIs in open-source dependencies. It's free, needs no account or key, and is Apache-2.0 licensed, but it only reads public content.

## Highlights

- **Zero setup** — the endpoint is just a URL, with no install, signup, or API key.
- **GitHub Pages too** — Pages sites get their own pattern, `{owner}.gitmcp.io/{repo}`, and GitMCP checks `robots.txt` before reading them.
- **One endpoint for any repo** — `gitmcp.io/docs` picks the repository per request and includes a tool that matches a library name to its `owner/repo`.
- **llms.txt first** — docs are read in priority order: the project's [llms.txt](/glossary/llms-txt), then an AI-optimized version of the docs, then the README.
- **Docs and code search** — per-repo tools follow the pattern `fetch_<repo-name>_documentation`, `search_<repo-name>_documentation`, and `search_<repo-name>_code`, and code search runs on the GitHub Search API (exact match).
- **Private and self-hostable** — the README says the service doesn't require authentication or store queries, and the Apache-2.0 code can be deployed in your own environment.

## In an AI-assisted workflow

GitMCP documents JSON config rather than a Claude Code command. For clients that accept a URL, the README's config is:

```json
{
  "mcpServers": {
    "gitmcp": {
      "url": "https://gitmcp.io/{owner}/{repo}"
    }
  }
}
```

The endpoint speaks Streamable HTTP, so in [Claude Code](/tools/claude-code) the standard remote form applies. Replace `{owner}/{repo}` with the project you want:

```bash
claude mcp add --transport http gitmcp https://gitmcp.io/{owner}/{repo}
```

Then ask for the docs by name:

```text
Use GitMCP to read the current docs for this library before you change our client setup.
Search the repo's code for how the retry option is implemented and match that behavior in our wrapper.
```

Scopes, a shared `.mcp.json` for your team, and checking connection status with `claude mcp list` are covered in [adding MCP servers to Claude Code](/guides/mcp/claude-code-mcp-setup).

> [!TIP]
> For a project with a few key dependencies, add one endpoint per repo under distinct names, so each server's tools stay scoped to one project. If the list keeps growing, add `https://gitmcp.io/docs` once and let the agent choose the repo per request.

## How it compares

Against [Context7](/tools/context7), GitMCP reads straight from the repo at query time instead of a pre-parsed library index, needs no signup, key, or documented quota, and is open source end to end, where Context7's backend is private; the trade-offs are that version-specific docs aren't documented and private repos aren't supported. [DeepWiki MCP](/tools/deepwiki-mcp) is the other free, no-auth option, answering from a generated wiki, while GitMCP hands the agent the project's own docs plus code search. The [GitHub MCP server](/tools/github-mcp-server) reaches private repos, issues, and PRs, but it needs a token. [Serena](/tools/serena) solves a different problem: it works on your local project through language servers and can edit it, while GitMCP is remote and read-only.

## Good to know

GitMCP is Apache-2.0 licensed and maintained by Ido Salomon, with about 8.4k GitHub stars as of September 2026. Clients that accept a URL need nothing installed; the README's Claude Desktop config instead bridges through `npx mcp-remote`, which needs Node. The hosted service was live in September 2026, with its server reporting version 1.1.0, but the repo has no tagged releases and its last commit landed in May 2026, so the codebase is quiet even though the service is up.

Two caveats. It only reaches content that's already public, and the README still labels some client configs as SSE even though the endpoint now speaks Streamable HTTP. Tool names can also drift from the README: the live URL-fetch tool is `fetch_generic_url_content`, not `fetch_url_content`, so if a prompt names a tool, check what your client actually lists. For other servers worth pairing with it, see [the best MCP servers in 2026](/guides/mcp/best-mcp-servers-2026).
