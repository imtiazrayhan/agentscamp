---
name: "Notion MCP"
title: "Notion MCP"
description: "Notion's hosted MCP server — search the workspace, fetch and create pages and databases, and manage comments through Markdown-optimized agent tools."
date: 2026-06-11
url: "https://developers.notion.com/docs/mcp"
pricing: "freemium"
category: "mcp"
os: ["Web"]
color: "yellow"
topics: ["mcp"]
tags: ["mcp", "notion", "docs", "knowledge-base", "workspace"]
featured: false
sameAs:
  - "https://developers.notion.com/docs/get-started-with-mcp"
  - "https://www.notion.com/blog/notions-hosted-mcp-server-an-inside-look"
  - "https://github.com/makenotion/notion-mcp-server"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "skill:adr-writer", "skill:readme-generator", "tool:linear-mcp", "guide:govern-mcp-servers"]
alternativeTo: ["linear-mcp", "slack-mcp", "context7", "github-mcp-server"]
summary: "Notion's hosted MCP server (mcp.notion.com) exposes 18 tools built around Notion-flavored Markdown for token efficiency: notion-search across the workspace (and connected Slack/Drive/Jira with Notion AI), notion-fetch by URL, page and database create/update/move, comments, and user/team lookups. OAuth-only — one claude mcp add plus a browser flow, and your workspace becomes agent-readable."
faq:
  - q: "How do I connect Notion to Claude Code?"
    a: "claude mcp add --transport http notion https://mcp.notion.com/mcp, then /mcp in a session to complete the browser OAuth. The hosted server is OAuth-only — no API-key/bearer auth — and access mirrors the permissions of the user who authorized it."
  - q: "What tools does the Notion MCP server expose?"
    a: "Eighteen, spanning the real workflows: notion-search and notion-fetch for retrieval; create/update/move/duplicate for pages; database creation, views, and queries; comments; and user/team lookups. Outputs use Notion-flavored Markdown, which keeps token usage down versus raw block JSON."
  - q: "Is Notion MCP free?"
    a: "Connecting is free with any Notion account, but some tools are plan-gated: cross-connector search (Slack, Google Drive, Jira) requires Notion AI, database-view queries need Business+, and data-source queries need Enterprise with Notion AI."
---

Notion MCP turns the team wiki from something you quote at the agent into something it reads itself. Specs, runbooks, decision docs, meeting notes — `notion-search` and `notion-fetch` make them retrievable mid-task, and the write tools let the agent file its own output where the team will actually find it.

## Highlights

- **18 tools across the real workflows** — search, fetch-by-URL, page create/update/move/duplicate, database creation and queries, views, comments, user/team lookups.
- **Markdown-optimized** — tools speak Notion-flavored Markdown rather than raw block JSON, a deliberate token-efficiency design Notion has written up publicly.
- **Connector-aware search** — with Notion AI, `notion-search` reaches connected Slack, Google Drive, and Jira too: one retrieval tool over the team's whole knowledge surface.
- **Hosted, OAuth-only** — `mcp.notion.com/mcp`; access inherits the authorizing user's permissions, so the agent sees exactly what you see.

## In an AI-assisted workflow

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
# in a session: /mcp → notion → Authenticate
# then:
# > Find our API versioning policy in Notion and apply it to this new endpoint;
# > when done, append a decision note to the "API decisions" page
```

The pattern: docs in, decisions out. The agent grounds work in the team's written context, then writes durable artifacts back instead of leaving them in a chat transcript.

> [!TIP]
> The agent's access equals your access — scope writes with [permission rules](/guides/configuration/claude-code-settings-permissions) (`ask` on `mcp__notion__notion-update-page` and friends) while you build trust, and keep retrieval tools friction-free.

## Good to know

The hosted server is the only actively supported path — Notion's open-source local server (`makenotion/notion-mcp-server`, MIT) is in maintenance mode with a possible sunset, useful mainly when you need token-based auth instead of OAuth. Plan gating applies to a few tools (connector search needs Notion AI; some database queries need Business+/Enterprise). Treat workspace content as sensitive context: it flows into the model like anything else the agent reads.
