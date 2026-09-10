---
term: "AI Connectors"
description: "AI connectors are the integrations that let an assistant like Claude read and act in tools such as Google Drive, Slack, and Notion; in Claude, MCP servers."
date: 2026-09-10
topics: ["ai-at-work", "mcp"]
audience: ["developers", "founders", "marketers"]
tags: ["connectors", "mcp", "claude", "integrations", "google-drive", "slack", "notion"]
featured: false
related: ["tool:claude", "tool:claude-cowork", "glossary:model-context-protocol", "glossary:claude-plugins", "glossary:claude-cowork", "guide:claude-code-mcp-setup", "guide:skills-vs-mcp-servers", "guide:best-mcp-servers-2026", "tool:notion-mcp", "tool:slack-mcp"]
summary: "AI connectors are the integrations that give an assistant access to your tools and data, such as Google Drive, Slack, Notion, or a CRM. In Claude, every connector is a Model Context Protocol (MCP) server: the directory ones are hosted by the vendor, and custom remote MCP connectors can be added on every plan, Free limited to one."
faq:
  - q: "Are connectors the same thing as MCP servers?"
    a: "In Claude, yes. Connectors is the product name in the app; MCP is the protocol underneath. A connector in the Customize directory is an MCP server run by the vendor, and Add custom connector takes the URL of any remote MCP server. The desktop app can also run local MCP servers from a config file."
  - q: "Which Claude plans can add connectors?"
    a: "All of them. Custom connectors using remote MCP are available on Free, Pro, Max, Team, and Enterprise, on claude.ai, Claude Desktop, mobile, and Cowork. Free accounts are limited to one custom connector. Team and Enterprise admins can control which connectors are allowed."
  - q: "What is the difference between a connector and a skill?"
    a: "A connector gives Claude access to a system: read a file, query a database, post a message. A skill gives Claude a procedure for how to do a job. A plugin often ships both, so the sales plugin brings a CRM connector and the call-prep skill that uses it."
---

**AI connectors are the integrations that let an assistant read from and act in the tools where your work lives, such as Google Drive, Slack, Notion, GitHub, or a CRM; in Claude, every connector is a Model Context Protocol server, whether it comes from the built-in directory or you add it yourself.**

The word exists because non-developers needed one. "MCP server" describes the mechanism; "connector" describes what you get: Claude can now search your Drive, read a Notion page, or post to a Slack channel. In [Claude](/tools/claude) the directory sits under Customize, and each entry connects with an authentication flow. The [MCP glossary entry](/glossary/model-context-protocol) explains the protocol; the [MCP servers roundup](/guides/mcp/best-mcp-servers-2026) surveys what exists.

Two facts shape how you use them. First, they work on every plan: custom remote MCP connectors are available on Free, Pro, Max, Team, and Enterprise across web, desktop, mobile, and [Cowork](/tools/claude-cowork), with Free limited to one custom connector. The server must be reachable from the public internet, so a tool behind a corporate VPN needs a different route. Second, connectors and skills are complementary, not competing: a connector provides access, a skill provides the procedure, and a [Claude plugin](/glossary/claude-plugins) packages both for a role. The [skills vs MCP servers guide](/guides/skills/skills-vs-mcp-servers) draws that line in detail.

For developers, the same servers plug into Claude Code; the [MCP setup guide](/guides/mcp/claude-code-mcp-setup) covers configuration, and pages like [Notion MCP](/tools/notion-mcp) and [Slack MCP](/tools/slack-mcp) describe individual servers. Safety note from Anthropic's help center: install connectors and plugins only from official directories or sources you trust, because a connector can read what you point it at and, in [Cowork](/glossary/claude-cowork), act on it.
