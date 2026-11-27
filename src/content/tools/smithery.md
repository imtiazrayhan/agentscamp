---
name: "Smithery"
title: "Smithery"
description: "A public directory of Model Context Protocol servers, now powered by Arcade.dev; its hosting, CLI and API shut down on October 31, 2026."
url: "https://smithery.ai"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "free"
category: "platform"
sameAs: ["https://smithery.ai/docs", "https://github.com/smithery-ai"]
os: ["Web"]
color: "purple"
topics: ["mcp", "architecture"]
audience: ["ai-engineers"]
tags: ["mcp", "registry", "directory", "arcade"]
featured: false
related: ["guide:govern-mcp-servers", "guide:building-an-mcp-server", "agent:mcp-server-engineer", "command:add-mcp-server", "tool:mcp-inspector"]
alternativeTo: ["docker-mcp-toolkit", "composio", "cloudflare-mcp"]
summary: "Smithery is a public, non-proxied directory of Model Context Protocol servers, now powered by Arcade.dev, which acquired it on August 5, 2026. On October 31, 2026 Smithery shut down its hosting and proxy, API, Connect and Toolbox, accounts and API keys, and its CLI and SDKs. Use it to find servers; run them through your client or a gateway."
faq:
  - q: "What is Smithery?"
    a: "Smithery is a public directory of MCP servers, now powered by Arcade.dev. Until October 31, 2026 it also hosted and proxied remote servers and offered an API, Connect, Toolbox and a CLI. Those connection-management services shut down that day, and Smithery says it will \"remain as a public (non-proxied) MCP registry.\""
  - q: "How do I install an MCP server from Smithery?"
    a: "Not through Smithery any more. The Smithery CLI and SDKs stopped working on October 31, 2026, as did server URLs on run.tools and server.smithery.ai. Find the server in the directory, then add it with your client's own command (for example claude mcp add in Claude Code) or run it behind a gateway such as the Docker MCP Toolkit."
  - q: "Is Smithery free?"
    a: "The directory is public. Smithery's paid plans ended with the shutdown, and Smithery refunded every charge made since August 5, 2026. Treat any server you find there as supply-chain surface: vet provenance, pin versions, and scope credentials to least privilege."
---

Smithery is now a **public directory** of Model Context Protocol servers, run by Arcade.dev, which acquired it on August 5, 2026. Until October 31, 2026 it was also a hosting platform that ran remote servers, proxied connections and installed servers into clients through its CLI. Those services shut down on that date, and Smithery says it "will remain as a public (non-proxied) MCP registry."

Use it to discover servers and see who published them. To run them, use your client's own configuration or an [MCP gateway](/guides/comparisons/best-mcp-gateways-2026).

## Highlights

- **Server registry** — a searchable catalog of MCP servers with provenance, so discovery isn't word-of-mouth.
- **What a server page shows** — the publisher, a description, the server's tool list with each tool's description, a "last checked" date, and a direct connection URL. The Exa Search page, for example, lists two tools (`web_search_exa`, `web_fetch_exa`) and the vendor's own endpoint, `https://mcp.exa.ai/mcp`.
- **No proxying** — the directory links to servers; it no longer hosts or proxies them. Smithery says verified servers show direct vendor URLs (for example `mcp.linear.app/mcp`) in place of the old `run.tools` and `server.smithery.ai` addresses.
- **Arcade alongside** — many listings are Arcade's own tool packs (Slack, Gmail, Notion, Jira and others), and the site's sign-up button now leads to Arcade, whose pitch on the Smithery homepage is "auth, credentials, and sessions handled for you."
- **What stopped on October 31, 2026** — server URLs on run.tools and server.smithery.ai, the Smithery API, Connect and Toolbox, Smithery accounts and API keys, and the Smithery CLI and SDKs. The CLI repository now redirects to `arcadeai-labs/smithery-cli` (AGPL-3.0).

## In an AI-assisted workflow

Use the directory to find a server, then add it directly; the Smithery CLI no longer works:

```bash
# find the server on smithery.ai, then add it with your client's own command
claude mcp add --transport http <name> <server-url>

# example: the Exa Search listing shows the vendor URL https://mcp.exa.ai/mcp
claude mcp add --transport http exa https://mcp.exa.ai/mcp
```

Check the "last checked" date on the listing before you trust its tool list; the Exa page read October 15, 2026 when checked in late November 2026. If a config file still points at a `run.tools` or `server.smithery.ai` URL, it is dead: replace it with the vendor URL from the listing.

> [!TIP]
> A registry is where MCP governance starts — provenance and versioning over copy-paste. When you're running more than a handful of servers, pair it with the broader playbook in [Connecting and Governing MCP Servers](/guides/mcp/govern-mcp-servers).

## Good to know

Smithery's paid plans ended with the October 31, 2026 shutdown, and charges made since August 5, 2026 were refunded. Treat third-party servers as supply-chain surface even when installed from a registry — vet provenance, pin versions, and scope credentials to least privilege (see the [governance guide](/guides/mcp/govern-mcp-servers)). To add a discovered server to a project safely, use the [Add MCP Server](/commands/workflow/add-mcp-server) command.

If you used Smithery for what it no longer does, the replacements differ by job. To run catalog servers locally in isolated containers, see the [Docker MCP Toolkit](/tools/docker-mcp-toolkit). For managed auth to third-party apps, which is Arcade's own product, [Composio](/tools/composio) is the comparable service. To host a remote server of your own, see [Cloudflare MCP](/tools/cloudflare-mcp).
