---
name: "Linear MCP"
title: "Linear MCP"
description: "Linear's hosted MCP server — find, create, and update issues, projects, and comments from your AI agent, with OAuth and one-command setup."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://linear.app/docs/mcp"
pricing: "free"
category: "mcp"
os: ["Web"]
color: "purple"
topics: ["mcp"]
audience: ["developers"]
tags: ["mcp", "linear", "issues", "project-management", "workflow"]
featured: false
sameAs:
  - "https://linear.app/changelog/2025-05-01-mcp"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "command:plan-feature", "command:breakdown-task", "command:create-pr", "tool:github-mcp-server"]
alternativeTo: ["github-mcp-server", "notion-mcp", "slack-mcp", "sentry-mcp"]
summary: "Linear's MCP server is hosted by Linear at mcp.linear.app/mcp and lets an agent find, create and update issues, projects and comments. Setup in Claude Code is one command plus an OAuth sign-in. You can grant read-only access, limit the connection to chosen teams, or skip the browser flow with an API key in a bearer header."
faq:
  - q: "How do I add the Linear MCP server to Claude Code?"
    a: "Run claude mcp add --transport http linear-server https://mcp.linear.app/mcp, then open a Claude Code session and run /mcp to go through the authentication flow. For headless or CI use, Linear's docs say you can pass an OAuth token or API key in an Authorization: Bearer header instead of the interactive flow."
  - q: "Can I give an agent read-only access to Linear?"
    a: "Yes, three ways. Select read-only access on the consent screen, connect to https://mcp.linear.app/mcp/readonly (which only ever exposes read tools), or have the client request only the read OAuth scope on the standard endpoint. With your own credentials, a Linear API key that has only the Read permission does the same job."
  - q: "How often do I have to reconnect?"
    a: "Rarely, if your client refreshes credentials. Linear's docs say standard MCP OAuth connections start with a 25-day refresh window that can renew when the client refreshes. If the server returns HTTP 401 with error=\"invalid_token\" and the client cannot refresh, reconnect it."
  - q: "Can one client connect to two Linear workspaces?"
    a: "Each workspace needs its own authentication context, because reconnecting does not switch workspace inside an existing session. With mcp-remote, point each workspace at a different directory using MCP_REMOTE_CONFIG_DIR and authenticate each one separately."
---

Linear MCP connects an agent to your issue tracker. Instead of pasting ticket text into a prompt, the agent reads the issue itself (description, comments, status), does the work against it, and writes the follow-up comment when it is done. Linear describes the tool set as "finding, creating, and updating objects in Linear like issues, projects, and comments — with more functionality on the way."

Linear builds and runs the server; it launched on May 1, 2025, and Linear's launch note thanks Cloudflare and Anthropic for help getting it running. It is for teams that already track work in Linear and code with an agent. Jira teams get the same loop from the [Atlassian MCP Server](/tools/atlassian-mcp).

## Highlights

- **Hosted remote server.** One endpoint, `https://mcp.linear.app/mcp`, over Streamable HTTP. Nothing runs on your machine.
- **OAuth 2.1 with dynamic client registration.** The interactive flow handles sign-in. An OAuth token or Linear API key in an `Authorization: Bearer` header works where a browser flow does not.
- **Read-only modes.** Choose read-only on the consent screen, use `https://mcp.linear.app/mcp/readonly`, or request only the `read` scope. Linear says a read-scoped token "can't reach write APIs."
- **Team scoping.** At sign-in you can limit the connection to a subset of your teams. This covers team data only; workspace-level data stays visible.
- **Enterprise-managed authorization.** Okta-managed sign-in for supported clients, plus Claude auto-connect for Linear Business and Enterprise plans, which is in beta as of November 2026.
- **Wide client support.** The docs give setup steps for Claude, Claude Code, Codex, Cursor, VS Code, v0, Windsurf and Zed, and a generic `mcp-remote` recipe for clients without remote MCP support.

## In an AI-assisted workflow

```bash
claude mcp add --transport http linear-server https://mcp.linear.app/mcp
# then, in a Claude Code session: /mcp and complete the sign-in
```

Clients that only speak stdio use the `mcp-remote` bridge:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
    }
  }
}
```

Then let the ticket be the spec. A short working prompt:

```text
Read LIN-482, implement the fix, and comment on the issue with a
summary of the change and the PR link.
```

Linear's docs include longer example prompts for roadmap planning, standup notes, bug investigation, cycle summaries and implementation plans. They share a pattern worth copying: tell the agent to show the issues and comments it plans to create before it applies anything, and to flag ambiguity instead of guessing.

> [!TIP]
> Pair it with the [GitHub MCP server](/tools/github-mcp-server) to close the loop: Linear holds the reason for the work, GitHub holds the change, and the agent moves issue, branch, PR and comment without you carrying context between tabs.

## Good to know

Linear's docs list no separate charge for the MCP server; you need a Linear workspace and your normal permissions apply. Managed auto-connect is the exception, limited to Business and Enterprise plans. The server is centrally hosted and managed by Linear, and the docs offer no self-hosted version.

Things that trip people up:

- **Write access is the default.** `https://mcp.linear.app/mcp` is read-write unless you pick a read-only option. Until you trust the loop, use the `/mcp/readonly` endpoint or put an `ask` rule on issue-mutating tools in [your permissions](/guides/configuration/claude-code-settings-permissions).
- **SSE is deprecated.** `https://mcp.linear.app/sse` remains only as a fallback for clients without Streamable HTTP, and as the documented workaround for WSL on Windows (through `mcp-remote` with `--transport sse-only`).
- **Stale auth.** For an internal server error on connect, the docs suggest clearing saved auth with `rm -rf ~/.mcp-auth` and trying again, and updating Node if needed.
- **Dropped connections.** Remote connections sometimes need a disconnect and reconnect from the client's MCP settings. This does not affect your Linear data.

Among related servers, the [Atlassian MCP Server](/tools/atlassian-mcp) is the equivalent for Jira and Confluence. The [GitHub MCP server](/tools/github-mcp-server) covers GitHub Issues if your tracker lives next to your code. [Notion MCP](/tools/notion-mcp) suits teams that keep specs and tasks in Notion databases rather than an issue tracker.
