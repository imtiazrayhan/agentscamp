---
name: "Slack MCP Server"
title: "Slack MCP Server"
description: "The MIT community Slack MCP server by korotovsky: smart history fetch, message search, unreads and opt-in posting over user, bot or browser-session tokens."
date: 2026-06-11
updated: "2026-11-27"
reviewed: "2026-11-27"
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
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "guide:govern-mcp-servers", "tool:notion-mcp", "tool:linear-mcp", "skill:claude-settings-auditor"]
alternativeTo: ["notion-mcp", "linear-mcp", "github-mcp-server"]
summary: "korotovsky/slack-mcp-server is an MIT-licensed community MCP server for Slack that you run yourself. It reads history, threads, DMs and unreads, searches messages, and posts only if you switch that on. Slack now also runs its own hosted MCP server at mcp.slack.com, so pick the community one when you need a local process, a bot token or no admin approval."
faq:
  - q: "Is there an official Slack MCP server?"
    a: "Yes. Slack hosts its own MCP server at https://mcp.slack.com/mcp over Streamable HTTP, with tools for search, messages, canvases, lists and file uploads. It needs a registered Slack app (Marketplace-published or internal) and workspace-admin approval. The older reference server from the Model Context Protocol project, src/slack, sits read-only in the archived modelcontextprotocol/servers-archived repository. korotovsky/slack-mcp-server is a separate community project and says so in its README."
  - q: "How do I add the Slack MCP server to Claude Code?"
    a: "With a Slack user OAuth token: claude mcp add slack --env SLACK_MCP_XOXP_TOKEN=xoxp-... -- npx -y slack-mcp-server@latest --transport stdio. A bot token (SLACK_MCP_XOXB_TOKEN) also works but only sees channels the bot was invited to and cannot search. For Slack's own hosted server, Slack's docs say to run claude plugin install slack instead."
  - q: "Can the agent post messages to Slack?"
    a: "Only if you switch it on. conversations_add_message is off until you set SLACK_MCP_ADD_MESSAGE_TOOL to true, to a comma-separated list of channel IDs, or to a list with ! in front of the channels to exclude. Reactions (SLACK_MCP_REACTION_TOOL) and mark-as-read (SLACK_MCP_MARK_TOOL) are gated the same way."
  - q: "Which token type should I use?"
    a: "A user OAuth token (xoxp) is the sensible default: it needs a Slack app with user scopes but supports search and history. Browser-session tokens (xoxc plus the xoxd cookie) need no app or scopes and are the only way to use the saved-items tools, but they are your logged-in session. Bot tokens (xoxb) are the most limited. If several are set, the server uses xoxp first, then xoxb, then xoxc/xoxd."
audience: ["sales", "marketers"]
---

[korotovsky/slack-mcp-server](https://github.com/korotovsky/slack-mcp-server) is a community MCP server, written in Go and MIT-licensed, that lets an agent read and search a Slack workspace: channel history, threads, DMs, unread messages and, if you opt in, posting. You run it yourself with a Slack token. Its README states plainly that it is not an official Slack product.

That distinction matters more than it used to. The reference Slack server from the Model Context Protocol project is archived, and Slack now hosts its own MCP server at `mcp.slack.com`. The community server is still the one to reach for when you want a local process, a bot token, or access to a workspace where nobody will approve a new app.

## Highlights

- **Smart history fetch.** `conversations_history` and `conversations_replies` take a `limit` that is either a time window (`1d` by default, `1w`, `30d`, `90d`) or a message count, with cursor pagination, so an agent pulls a day of a channel instead of the whole thing.
- **Search with Slack filters.** `conversations_search_messages` filters by channel, DM, sender, date and threads-only, returns 20 results by default (up to 100), and resolves a pasted Slack message URL to that one message. Channels and users can be addressed as `#general` or `@username`, backed by a local cache.
- **Unreads in one call.** `conversations_unreads` returns unread messages across channels, sorted DMs first, then Slack Connect channels, then internal ones.
- **Writes are opt-in.** Posting, reactions, mark-as-read and attachment download each stay off until you set their environment variable. Posting and reactions can be limited to listed channel IDs.
- **Three auth modes.** User OAuth token (`xoxp`), bot token (`xoxb`, invited channels only, no search), or browser-session tokens (`xoxc` plus the `xoxd` cookie) that need no app install at all.
- **Runs where you need it.** stdio, SSE and HTTP transports, an npm package, a Docker image at `ghcr.io/korotovsky/slack-mcp-server`, a DXT extension for Claude Desktop, proxy settings, and a `SLACK_MCP_GOVSLACK` switch for GovSlack workspaces.

The README documents 18 tools, including user-group management (`usergroups_list`, `usergroups_create`, `usergroups_update`) and three saved-items tools, plus two resources that list a workspace's channels and users as CSV.

## In an AI-assisted workflow

```bash
claude mcp add slack --env SLACK_MCP_XOXP_TOKEN=xoxp-your-token \
  -- npx -y slack-mcp-server@latest --transport stdio
# then:
# > Find the #incidents thread about the payments outage last week and
# > summarize the root cause and action items into the postmortem doc
```

To get an `xoxp` token, create an app at api.slack.com/apps, add the user token scopes listed in the project's authentication guide (history and read scopes for channels, groups, DMs and group DMs, plus `users:read`, `search:read` and, for posting, `chat:write`), install it to the workspace and copy the User OAuth Token. The repo ships an app manifest with those scopes filled in.

To let the agent post in one channel only, add the channel ID:

```bash
claude mcp add slack \
  --env SLACK_MCP_XOXP_TOKEN=xoxp-your-token \
  --env SLACK_MCP_ADD_MESSAGE_TOOL=C0123456789 \
  -- npx -y slack-mcp-server@latest --transport stdio
```

The high-value pattern is **Slack as retrieval, docs as destination**: pull the decision out of the thread and land it somewhere durable (pairs well with [Notion MCP](/tools/notion-mcp)).

> [!WARNING]
> A user-token server reads what *you* can read, DMs included, and feeds it to the model. Give the Slack app only the scopes you need, leave posting disabled until you need it, and treat browser-session tokens (copied from a logged-in session) as the credentials they are. Slack messages are also untrusted input: anyone who can post in a channel can try a prompt injection. Worth a pass from [claude-settings-auditor](/skills/workflow/claude-settings-auditor) if it's going in a shared config.

## Good to know

**Project status.** As of November 2026 the repository has about 1,900 GitHub stars, and the latest release is v1.3.0 from May 14, 2026, which added the saved-items tools, `conversations_join` and `conversations_leave`, and a cache for large workspaces. The default branch has had no commits since that release, so check the repository before you depend on a fix landing quickly.

**Token type decides the tool list.** Search is unavailable with bot tokens. `conversations_unreads` works with `xoxp` but falls back to one API call per channel, and its mentions-only filter needs browser tokens. The three `saved_*` tools require browser tokens. With the users and channels caches off, `channels_list` and `#name` lookups stop working.

**Remote transports need a key.** SSE and HTTP modes listen on `127.0.0.1:13080` by default; set `SLACK_MCP_API_KEY` so clients must send a bearer token before you expose the port to anything else.

**Compared with Slack's official server.** Slack's hosted server at `https://mcp.slack.com/mcp` adds tools the community server lacks: scheduled and draft messages, canvases, lists and file uploads. It uses OAuth, logs MCP activity to Slack's audit logs, and lets workspace admins approve each client. The costs: per Slack's docs it supports Streamable HTTP only (no SSE, no Dynamic Client Registration), and only Marketplace-published or internal Slack apps may use it. In Claude Code, Slack's documented route is `claude plugin install slack`. If your admin has approved that, prefer it for a company workspace; use the community server for self-hosted setups, bot-token automations, or the browser-token mode the official server has no equivalent for.

For the other places team context lives, see [Notion MCP](/tools/notion-mcp) for docs, [Linear MCP](/tools/linear-mcp) for issues and [GitHub MCP Server](/tools/github-mcp-server) for code review threads. [Governing MCP servers](/guides/mcp/govern-mcp-servers) covers allowlisting a server like this across a team.
