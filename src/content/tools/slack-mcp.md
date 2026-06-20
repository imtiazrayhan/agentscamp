---
name: "Slack MCP Server"
title: "Slack MCP Server"
description: "The community-canonical Slack MCP server — smart history fetch, message search, channels, reactions, and opt-in posting, after the official server was archived."
date: 2026-06-11
url: "https://github.com/korotovsky/slack-mcp-server"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/korotovsky/slack-mcp-server"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "pink"
topics: ["mcp"]
tags: ["mcp", "slack", "chat", "workflow", "communication"]
featured: false
sameAs:
  - "https://www.npmjs.com/package/slack-mcp-server"
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "govern-mcp-servers", "notion-mcp", "linear-mcp", "claude-settings-auditor"]
alternativeTo: ["notion-mcp", "linear-mcp", "github-mcp-server"]
summary: "Anthropic's reference Slack server was archived in 2025; korotovsky/slack-mcp-server (MIT, v1.3+) is the maintained community standard. Seventeen tools: smart history fetch with 1d/7d/30d windows, message and thread search, channel listings, reactions, user-group management, and unread tracking — with message posting disabled by default and enabled per-channel via env vars."
faq:
  - q: "What happened to the official Slack MCP server?"
    a: "It was archived with most reference servers in 2025 — src/slack now lives read-only in modelcontextprotocol/servers-archived. The ecosystem consolidated on korotovsky/slack-mcp-server, an MIT community project that goes well beyond the reference server's feature set."
  - q: "How do I add the Slack MCP server to Claude Code?"
    a: "With a Slack user OAuth token: claude mcp add slack --env SLACK_MCP_XOXP_TOKEN=xoxp-... -- npx -y slack-mcp-server@latest --transport stdio. Bot tokens (xoxb) work with reduced capability (no message search), and a browser-session mode (xoxc/xoxd) exists for workspaces where you can't create an app."
  - q: "Can the agent post messages to Slack?"
    a: "Only if you switch it on. The conversations_add_message tool ships disabled by default and is enabled via an env var, optionally restricted to specific channels — a sensible default for a tool that speaks as you."
---

Slack is where the context lives — decisions, incident threads, the answer someone posted three weeks ago. The Slack MCP Server makes it retrievable mid-task: the agent searches messages, reads thread history with sensible pagination, and (only if you opt in) posts updates back.

## Highlights

- **Smart history fetch** — `conversations_history`/`conversations_replies` with `1d`/`7d`/`30d` windows or message counts, built to keep context small instead of dumping channels raw.
- **Search that understands Slack** — message search with thread and DM filters (`conversations_search_messages`), plus `#channel` and `@user` name resolution with caching.
- **Posting is opt-in** — `conversations_add_message` is **disabled by default**, enabled via env var, optionally restricted per channel.
- **Workspace plumbing** — channel listings, reactions add/remove, user search, user-group management, unread tracking.
- **Three auth modes** — user OAuth token (`xoxp`, full capability), bot token (`xoxb`, no search), or browser-session tokens (`xoxc`/`xoxd`) for locked-down workspaces.

## In an AI-assisted workflow

```bash
claude mcp add slack --env SLACK_MCP_XOXP_TOKEN=xoxp-your-token \
  -- npx -y slack-mcp-server@latest --transport stdio
# then:
# > Find the #incidents thread about the payments outage last week and
# > summarize the root cause and action items into the postmortem doc
```

The high-value pattern is **Slack as retrieval, docs as destination**: pull the decision out of the thread, land it somewhere durable (pairs well with [Notion MCP](/tools/notion-mcp)).

> [!WARNING]
> A user-token server reads what *you* can read — DMs included — and feeds it to the model. Scope the Slack app's token to the minimum scopes in its docs, leave posting disabled until you need it, and treat browser-session tokens (scraped from a logged-in session) as the credentials they are. Worth a pass from [claude-settings-auditor](/skills/workflow/claude-settings-auditor) if it's going in a shared config.

## Good to know

MIT, actively maintained (v1.3.0 landed May 2026 with a tool-permission matrix), distributed via npm and Docker, with stdio, SSE, and HTTP transports plus a Claude Desktop extension. Tool availability tracks your token type — search needs a non-bot token, unread/saved-items work best with browser tokens — so pick the auth mode by the capabilities you actually need.
