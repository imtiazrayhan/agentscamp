---
name: "Atlassian MCP Server"
title: "Atlassian MCP Server"
description: "Atlassian's hosted MCP server, formerly the Atlassian Rovo MCP Server, gives AI agents permission-aware access to Jira, Confluence, Bitbucket and more."
seoDescription: "Atlassian MCP Server (formerly Rovo MCP) in November 2026: the v2 endpoint, Claude Code setup, OAuth and API tokens, Rovo credits, admin controls."
date: 2026-11-14
reviewed: 2026-11-22
url: "https://www.atlassian.com/platform/mcp"
pricing: "freemium"
category: "mcp"
os: ["Web"]
color: "blue"
topics: ["mcp", "ai-at-work"]
audience: ["developers", "founders"]
tags: ["atlassian", "mcp", "jira", "confluence", "bitbucket", "project-management"]
featured: false
alternativeTo: ["linear-mcp", "notion-mcp", "github-mcp-server"]
sameAs:
  - "https://github.com/atlassian/atlassian-mcp-server"
related: ["tool:linear-mcp", "tool:notion-mcp", "tool:github-mcp-server", "guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "guide:govern-mcp-servers", "guide:best-mcp-gateways-2026", "glossary:model-context-protocol"]
keywords: ["Atlassian MCP Server", "Atlassian Rovo MCP Server", "Jira MCP server", "Confluence MCP", "Atlassian MCP Claude Code", "Atlassian remote MCP"]
summary: "Atlassian MCP Server, formerly the Atlassian Rovo MCP Server, is Atlassian's hosted remote MCP server, generally available since February 4, 2026. Claude, ChatGPT, Cursor and other clients use it to work with Jira, Confluence, Jira Service Management, Bitbucket, Compass and Loom through one endpoint, with OAuth 2.1 and only the data each user can see."
faq:
  - q: "What happened to the Atlassian Rovo MCP Server?"
    a: "It was renamed and rebuilt. Atlassian first launched it on May 1, 2025 as its Remote MCP Server, made it generally available on February 4, 2026 as the Atlassian Rovo MCP Server, and rebuilt it as Atlassian MCP on October 7, 2026. The GitHub README now calls it the Atlassian MCP Server, and the old product URL redirects to atlassian.com/platform/mcp. New setups should use the v2 endpoint, https://mcp.atlassian.com/v2/mcp."
  - q: "How do I add the Atlassian MCP Server to Claude Code?"
    a: "Run claude mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp, then run /mcp inside a Claude Code session to sign in through the browser. The connection uses OAuth 2.1 with PKCE by default. API-token authentication is also available once an admin enables it, and Jira Service Management tools require it."
  - q: "Is the Atlassian MCP Server free?"
    a: "Atlassian's product page says 'Start for free. No credit card required.' You need an Atlassian Cloud site, and Atlassian says calls that retrieve data or generate insights through the server consume Rovo credits, as do enriched Teamwork Graph calls such as searchAtlassian. Atlassian does not publish a separate price for the server itself."
  - q: "Can the Atlassian MCP Server see everything in Jira and Confluence?"
    a: "No. Per Atlassian's README, access is granted only to data that the user already has permission to view in Atlassian Cloud. Tool access is also split into permission groups such as read_jira, write_jira and search_jira, and the delete_jira and manage_jira groups are disabled by default. Admins can restrict which client domains may connect, and every tool call is recorded in the organization's audit log."
---

Atlassian MCP Server is Atlassian's hosted [Model Context Protocol](/glossary/model-context-protocol) server. It lets AI agents read and update work in Jira, Confluence and the rest of Atlassian Cloud without copying ticket text into a chat. The name has changed twice. Atlassian launched it on May 1, 2025 as its Remote MCP Server, "starting with Anthropic as our first official partner and hosted on Cloudflare infrastructure". It became generally available on February 4, 2026 as the Atlassian Rovo MCP Server, and on October 7, 2026 Atlassian announced a rebuilt version under the name Atlassian MCP. The old product URL now redirects to `atlassian.com/platform/mcp`, and the GitHub README calls it the Atlassian MCP Server.

It is for teams whose work already lives in Atlassian Cloud. A developer can have [Claude Code](/tools/claude-code) read a Jira issue and its linked Confluence page before writing code. A product lead can ask Claude or ChatGPT to summarize a project's status across tickets. Atlassian runs the server, so you configure a URL, not a process. Access is permission-aware: "Access is granted only to data that the user already has permission to view in Atlassian Cloud."

## Highlights

- **One endpoint for the suite.** The README lists "Jira, Confluence, Jira Service Management, Bitbucket, Compass, Loom, and Atlassian platform data (Projects, Goals, Teams, Focus, Talent, and the Teamwork Graph)". Jira Service Management tools require API-token authentication.
- **Tools discovered on demand.** The server "exposes a small set of the most-used tools and lets the client discover the rest on demand". For [MCP gateways](/glossary/mcp-gateway) that want a flat list, `https://mcp.atlassian.com/v2/mcp?tools=all` returns every tool.
- **Vendor figures from the October relaunch.** Atlassian's October 7, 2026 blog says it is "seeing more than 15M calls a day" and is "delivering 220+ tools without bloating your context". It also says the rebuild "can save up to 25% tokens compared to the previous version", based on Atlassian's internal benchmarking on Claude models.
- **OAuth first.** "Our MCP is Atlassian-hosted and secured with OAuth 2.1 and PKCE by default." API tokens, Basic or service-account Bearer, need admin enablement. Compass works only with OAuth.
- **Admin controls.** These include domain allowlists ("By default, Atlassian-supported domains are allowed"), IP allowlisting, and an audit-log event "every time a tool is used". With Atlassian Guard, admins can "enforce Data Security Policies (DSP) and Data Loss Prevention (DLP) across MCP connections".
- **Extensible.** "Developers can build custom MCP tools with Forge … You can also expose custom Rovo agents via MCP."
- **Broad client list.** The README lists ChatGPT, OpenAI Codex (CLI and Desktop), Claude (Claude.ai, Desktop and Code), Cursor, VS Code with GitHub Copilot, GitHub Copilot CLI, Google Gemini CLI, Windsurf, Docker, Kiro and other Agent Plugins clients, and Amazon Quick Suite. Local-only clients can connect through `mcp-remote` on Node.js v18 or later.

## In an AI-assisted workflow

Setup in Claude Code is one command and a browser sign-in:

```bash
claude mcp add --transport http atlassian https://mcp.atlassian.com/v2/mcp
# then run /mcp inside a Claude Code session and authenticate in the browser
```

Then let the ticket be the spec. A made-up example:

```text
Read ACME-142 in Jira and the Confluence page linked from it. Implement the
fix the acceptance criteria describe, run the tests, then add a comment to
ACME-142 summarizing the change and linking the pull request.
```

Use `https://mcp.atlassian.com/v2/mcp` for new setups. The v1 endpoints (`https://mcp.atlassian.com/v1/mcp/authv2` and `https://mcp.atlassian.com/v1/mcp`) remain supported. The legacy Server-Sent Events endpoint, `https://mcp.atlassian.com/v1/sse`, stopped being supported after June 30, 2026, so update any older config that still points at it. [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup) explains scopes and the approval prompt.

> [!TIP]
> Keep the destructive groups off. `delete_jira` and `manage_jira` are disabled by default, and an `ask` rule on issue-changing tools in [your Claude Code permissions](/guides/configuration/claude-code-settings-permissions) adds a second check until you trust the loop.

## Good to know

**Cost.** Atlassian's product page says "Start for free. No credit card required." You need an Atlassian Cloud site, and "when an AI client calls via Atlassian MCP to retrieve data or generate insights, it consumes Rovo credits". Enriched Teamwork Graph calls such as `getTeamworkGraphContext`, `searchAtlassian` and `search` also consume Rovo credits. Atlassian publishes no dollar price for the server itself.

**Rate limits.** The Atlassian docs we read publish no rate limits for the server. Before you point a bulk agent job at it, test the call volume you expect on a small project.

**Open source?** No. The `atlassian/atlassian-mcp-server` repository is Apache-2.0, but it holds plugin manifests and skills, not the hosted server's source.

**Service management.** Atlassian's October blog marked Jira Service Management as coming soon, but the README already lists JSM tools that require an API token. Check the current tool list before you plan a JSM workflow around it.

**Governance.** It is a write-capable server with your organization's data behind it, so the habits in [Connecting and Governing MCP Servers](/guides/mcp/govern-mcp-servers) apply: least privilege, audit, and a review before anyone adds it to a shared project.

If your team tracks work elsewhere, [Linear MCP](/tools/linear-mcp) is the hosted equivalent for Linear, [Notion MCP](/tools/notion-mcp) covers wiki-first teams, and the [GitHub MCP Server](/tools/github-mcp-server) handles repositories, issues and pull requests. See the [Atlassian MCP Server alternatives](/tools/atlassian-mcp/alternatives) or the [best MCP servers of 2026](/guides/mcp/best-mcp-servers-2026).
