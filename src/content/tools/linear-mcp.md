---
name: "Linear MCP"
title: "Linear MCP"
description: "Linear's hosted MCP server — find, create, and update issues, projects, and comments from your AI agent, with OAuth and one-command setup."
date: 2026-06-11
url: "https://linear.app/docs/mcp"
pricing: "free"
category: "mcp"
os: ["Web"]
color: "purple"
topics: ["mcp"]
tags: ["mcp", "linear", "issues", "project-management", "workflow"]
featured: false
sameAs:
  - "https://linear.app/changelog/2025-05-01-mcp"
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "plan-feature", "breakdown-task", "create-pr", "github-mcp-server"]
summary: "Linear's centrally hosted MCP server connects agents to your issue tracker: find, create, and update issues, projects, and comments. One command (claude mcp add --transport http linear-server https://mcp.linear.app/mcp), an OAuth browser flow, and your agent can turn 'fix LIN-123' into reading the actual ticket — and closing it with a comment when the PR is up."
faq:
  - q: "How do I add the Linear MCP server to Claude Code?"
    a: "claude mcp add --transport http linear-server https://mcp.linear.app/mcp — then run /mcp in a session and complete the browser OAuth flow. For headless or CI use, Linear also accepts an OAuth token or API key passed directly in an Authorization: Bearer header."
  - q: "What can agents do through Linear MCP?"
    a: "Find, create, and update Linear objects — issues, projects, and comments — with Linear expanding coverage over time (recent changelogs added product-management tools and agent-specific support). It's the difference between pasting a ticket into chat and the agent reading, updating, and closing the ticket itself."
  - q: "Is the Linear MCP server free?"
    a: "Yes — it's part of the product, hosted and managed by Linear, with no extra charge beyond your Linear workspace. There's no self-hosted version; it's a centrally operated remote server."
---

Linear MCP makes the issue tracker part of the agent's working memory. Instead of copy-pasting ticket text into prompts, the agent reads `LIN-123` itself — description, comments, status — implements against it, and writes the follow-up comment when the work is done.

## Highlights

- **The core loop covered** — finding, creating, and updating issues, projects, and comments; the surface keeps growing (product-management tools and agent-support landed through 2026).
- **Hosted and managed** — Linear runs it (built with Cloudflare and Anthropic at launch in May 2025); you configure a URL, not a process.
- **OAuth with dynamic registration** — the `/mcp` browser flow handles auth; headless contexts can pass an `Authorization: Bearer` token instead.
- **Streamable HTTP** — the modern transport at `mcp.linear.app/mcp` (the older `/sse` endpoint survives mainly for WSL compatibility).

## In an AI-assisted workflow

```bash
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
# in a session: /mcp → linear-server → Authenticate
# then:
# > Read LIN-482, implement the fix, and comment with a summary + the PR link
```

The pattern that pays: let the ticket be the spec. The agent pulls acceptance criteria from the issue rather than your paraphrase, and status updates land where the team already looks.

> [!TIP]
> Pair it with the [GitHub MCP server](/tools/github-mcp-server) and the loop closes end-to-end: Linear holds the *why*, GitHub holds the *what*, and the agent moves both — issue → branch → PR → comment — without you ferrying context between tabs.

## Good to know

Free with your Linear workspace, Web-only (it's a hosted remote), no public repo — Linear operates it centrally and ships updates via their changelog. WSL users who hit connection errors on the HTTP endpoint have a documented workaround through `mcp-remote` against the legacy SSE endpoint. As with any write-capable server, consider an `ask` rule on issue-mutating tools in [your permissions](/guides/configuration/claude-code-settings-permissions) until you trust the loop.
