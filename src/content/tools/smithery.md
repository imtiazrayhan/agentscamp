---
name: "Smithery"
title: "Smithery"
description: "A registry and hosting platform for Model Context Protocol servers — discover, deploy, and connect MCP servers from one place."
url: "https://smithery.ai"
date: 2026-06-04
pricing: "freemium"
category: "platform"
sameAs: ["https://smithery.ai/docs", "https://github.com/smithery-ai"]
os: ["Web"]
color: "purple"
topics: ["mcp", "architecture"]
tags: ["mcp", "registry", "hosting", "platform"]
featured: false
related: ["guide:govern-mcp-servers", "guide:building-an-mcp-server", "agent:mcp-server-engineer", "command:add-mcp-server", "tool:mcp-inspector"]
alternativeTo: ["fastmcp", "mcp-inspector", "cloudflare-mcp"]
summary: "Smithery is a registry and hosting platform for Model Context Protocol servers. It solves discovery — a searchable catalog with provenance — and deployment: install a server into your client with one Smithery CLI command, or connect to hosted remote instances instead of running them yourself. Freemium, with a free tier for discovery."
faq:
  - q: "What is Smithery?"
    a: "Smithery is a registry and hosting platform for MCP servers. It tackles the two problems that show up once MCP servers multiply: discovery (a searchable catalog with provenance, so finding servers isn't word-of-mouth) and deployment (hosted remote instances you connect to instead of running servers yourself). Server authors can publish and host what they build there."
  - q: "How do I install an MCP server from Smithery?"
    a: "Use the Smithery CLI: npx smithery install <server-name> --client claude connects a registry server to your client without hand-editing config."
  - q: "Is Smithery free?"
    a: "It's a hosted platform with a free tier for discovery and getting started. Even when installing from a registry, treat third-party servers as supply-chain surface — vet provenance, pin versions, and scope credentials to least privilege."
---

Smithery is a **registry and hosting platform** for Model Context Protocol servers. It tackles the two problems that show up once MCP servers multiply: **discovery** (finding servers that exist and seeing who published them) and **deployment** (getting a server running and connectable without standing up your own infrastructure). You browse a catalog of servers, install one into your client with a command, and — for servers that support it — connect to a hosted, remote instance instead of running it yourself.

It is aimed at developers who want to *consume* MCP servers without hunting through READMEs of unknown provenance, and at server authors who want a place to publish and host what they build. As a registry, it's part of the connective tissue that keeps a growing MCP ecosystem discoverable and governable.

## Highlights

- **Server registry** — a searchable catalog of MCP servers with provenance, so discovery isn't word-of-mouth.
- **One-command install** — connect a registry server to your client via the Smithery CLI rather than hand-editing config.
- **Hosting** — deploy and run remote MCP servers on the platform, so consumers connect to a hosted endpoint.
- **Discovery for clients** — a programmatic catalog that tools and agents can use to find servers.

## In an AI-assisted workflow

Use the registry to find and install a server instead of copying setup from a README:

```bash
# discover and install an MCP server into your client via the Smithery CLI
npx smithery install <server-name> --client claude
```

> [!TIP]
> A registry is where MCP governance starts — provenance and versioning over copy-paste. When you're running more than a handful of servers, pair it with the broader playbook in [Connecting and Governing MCP Servers](/guides/mcp/govern-mcp-servers).

## Good to know

Smithery is a hosted platform with a free tier for discovery and getting started. Treat third-party servers as supply-chain surface even when installed from a registry — vet provenance, pin versions, and scope credentials to least privilege (see the [governance guide](/guides/mcp/govern-mcp-servers)). To add a discovered server to a project safely, use the [Add MCP Server](/commands/workflow/add-mcp-server) command.
