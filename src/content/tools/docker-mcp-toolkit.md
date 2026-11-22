---
name: "Docker MCP Toolkit"
title: "Docker MCP Toolkit"
description: "Docker Desktop's MCP Toolkit runs MCP servers from Docker's catalog as isolated containers and connects them to Claude Code, Cursor and other clients."
seoDescription: "Docker MCP Toolkit, in beta as of November 2026: containerized MCP servers, the MIT MCP Gateway, docker mcp CLI commands, profiles and Desktop pricing."
date: 2026-11-13
reviewed: 2026-11-22
url: "https://docs.docker.com/ai/mcp-catalog-and-toolkit/toolkit/"
pricing: "freemium"
category: "mcp"
repo: "https://github.com/docker/mcp-gateway"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "blue"
topics: ["mcp"]
audience: ["developers", "devops"]
tags: ["docker", "mcp", "mcp-gateway", "containers", "mcp-catalog", "security"]
featured: false
alternativeTo: ["composio", "portkey"]
sameAs:
  - "https://github.com/docker/mcp-gateway"
  - "https://hub.docker.com/mcp"
related: ["tool:composio", "tool:mcp-inspector", "tool:github-mcp-server", "guide:best-mcp-gateways-2026", "guide:claude-code-mcp-setup", "guide:govern-mcp-servers", "glossary:mcp-gateway", "skill:mcp-config-auditor"]
keywords: ["Docker MCP Toolkit", "Docker MCP Gateway", "docker mcp CLI", "Docker MCP Catalog", "Docker MCP Toolkit Claude Code", "Docker MCP profiles"]
summary: "Docker MCP Toolkit is a Docker Desktop feature, in beta as of November 2026, that runs MCP servers from Docker's 300+ server catalog as isolated containers and connects them to Claude Code, Cursor, VS Code and other clients. Underneath is Docker's MIT-licensed MCP Gateway, which you can also run with the docker mcp CLI. The Toolkit has no separate price."
faq:
  - q: "Is Docker MCP Toolkit free?"
    a: "The Toolkit has no price of its own; it ships with Docker Desktop. As of November 2026 Docker Desktop is free for personal use, education, non-commercial open source and small businesses with fewer than 250 employees and less than $10 million in annual revenue, and larger professional use needs a paid subscription. Docker's pricing page lists Pro at $9 per user a month billed annually, Team at $15 and Business at $24 as of November 2026. The open-source MCP Gateway is MIT-licensed."
  - q: "How do I connect Docker MCP Toolkit to Claude Code?"
    a: "As of November 2026 you first enable the Toolkit under Beta features in Docker Desktop's settings. Then add servers to a profile and connect the client. From the CLI that looks like docker mcp profile create --name dev-tools --server catalog://mcp/docker-mcp-catalog/github followed by docker mcp client connect claude-code --profile dev-tools --global. Claude Code then reaches the profile's servers through the Docker MCP Gateway, which runs each one as a container."
  - q: "Is Docker MCP Toolkit generally available?"
    a: "No. As of November 2026 Docker's setup guide still enables it from the Beta features section of Docker Desktop's settings, and Dynamic MCP, which lets an agent find and add servers mid-session, is described as experimental in early development as of November 2026. Expect the interface and commands to change between Desktop releases."
  - q: "What is the difference between the MCP Toolkit and the MCP Gateway?"
    a: "The Toolkit is the management interface inside Docker Desktop. The MCP Gateway is the open-source proxy that does the work underneath: it sits between clients and servers and manages configuration, credentials and access control, and it runs automatically when the Toolkit is enabled. You can also run the gateway without Desktop. Docker's separate managed gateway, part of Docker AI Governance, is an invite-only organizational product."
---

Docker MCP Toolkit lets you run MCP servers as containers instead of as `npx` or `uvx` processes on your machine. Docker's docs describe it as "a management interface integrated into Docker Desktop that lets you set up, manage, and run containerized MCP servers in profiles and connect them to AI agents". It is in beta as of November 2026: you switch it on from the Beta features section of Docker Desktop's settings, and the current interface docs cover Docker Desktop 4.62 and later. The servers come from the Docker MCP Catalog, which Docker says has "300+ verified servers packaged as container images with versioning, provenance, and security updates".

Under the Toolkit sits the Docker MCP Gateway, an MIT-licensed open-source proxy that starts servers, injects credentials and presents everything to your client as one connection. It suits developers who want to try many servers without giving each one the run of their machine. Docker's managed gateway for organizations is a different product, explained below. For how gateways compare more broadly, see the [MCP gateways roundup](/guides/comparisons/best-mcp-gateways-2026).

## Highlights

- **A curated catalog.** It includes partner servers "from New Relic, Stripe, Grafana, and other trusted partners" and remote services that "connect to external services like GitHub, Notion, and Linear". Images under `mcp/` are built and signed by Docker, and each ships a software bill of materials.
- **Isolation by default.** Each server container is restricted to 1 CPU and limited to 2 GB. "By default, MCP Servers have no access to the host filesystem," and requests that contain sensitive information such as secrets are blocked.
- **Credentials stay out of client configs.** "The MCP Toolkit handles OAuth authentication automatically. You authorize access through your browser". Docker Desktop stores the secrets, not the JSON files your clients read.
- **Profiles.** "Profiles organize servers into named collections for different projects." You can push a profile to an OCI registry to share it, and "credentials aren't included in shared profiles".
- **Per-tool allowlists.** Within a profile you can enable or disable individual tools, so the agent sees a short list rather than every tool a server ships.
- **Wide client support.** Docker's docs list Claude Code, Claude Desktop, OpenAI Codex, Continue, Cursor, Gemini, Goose, LM Studio, OpenCode, Sema4.ai, Visual Studio Code, Zed and Mistral Vibe.
- **Dynamic MCP.** As of November 2026 this is "an experimental feature in early development" (Docker Desktop 4.50+). It gives the agent tools such as `mcp-find`, `mcp-add` and `mcp-exec` to pull servers in during a session.

## In an AI-assisted workflow

The `docker mcp` CLI covers the whole loop. Its subcommands are `catalog`, `client`, `feature`, `gateway`, `profile`, `secret`, `server`, `tools` and `version`. This sequence, taken from Docker's README and docs, builds a profile and connects it to [Claude Code](/tools/claude-code):

```bash
docker mcp catalog pull mcp/docker-mcp-catalog
docker mcp profile create --name dev-tools --server catalog://mcp/docker-mcp-catalog/github --connect cursor
docker mcp profile server add dev-tools --server catalog://mcp/docker-mcp-catalog/notion
docker mcp profile tools <profile-id> --enable github.create_issue --disable github.search_code
docker mcp client connect claude-code --profile dev-tools --global
docker mcp gateway run --profile dev-tools
```

To test a tool, run `docker mcp tools ls` and `docker mcp tools call <tool-name> [arguments...]`. Other clients can launch the gateway over stdio with this config from Docker's docs:

```json
{
  "servers": {
    "MCP_DOCKER": {
      "command": "docker",
      "args": ["mcp", "gateway", "run", "--profile", "my_profile"],
      "type": "stdio"
    }
  }
}
```

For HTTP clients, `docker mcp gateway run --port 8080 --transport streaming` serves the gateway on port 8080 instead of over stdio. Docker's FAQ adds a signature check for server images with `docker mcp gateway run --verify-signatures`. Before you share a profile, audit what it exposes. The [mcp-config-auditor](/skills/security/mcp-config-auditor) skill flags unpinned images and inline secrets, and [MCP Inspector](/tools/mcp-inspector) shows a server's tools directly.

## The open-source gateway and the managed one

The [MCP gateway](/glossary/mcp-gateway) underneath the Toolkit is "Docker's open source solution for orchestrating Model Context Protocol (MCP) servers. It acts as a centralized proxy between clients and servers, managing configuration, credentials, and access control." It "includes built-in logging and call-tracing capabilities", and "if you use Docker Desktop with MCP Toolkit enabled, the Gateway runs automatically in the background". The code lives at `docker/mcp-gateway` under the MIT license. The latest tag, v0.44.3 from October 26, 2026, is flagged as a prerelease on GitHub. You can run the gateway on Docker Engine without Desktop by installing it separately. For WSL2, containerized setups or Docker CE, the README says to set `DOCKER_MCP_IN_CONTAINER=1`.

"MCP Gateway as part of Docker AI Governance is an invite-only feature." It belongs to Docker's organization-wide controls, which Docker prices per organization, and it is not the same thing as the open-source gateway above.

## Pricing

The Toolkit has no separate price because it ships with Docker Desktop. As of November 2026 Docker's pricing page lists Personal at $0, Pro at $9 per user a month billed annually or $11 monthly, Team at $15 per user a month annually or $16 monthly, and Business at $24 per user a month, annual only. Docker's Desktop license terms, as of November 2026, keep Desktop free for "small businesses (fewer than 250 employees AND less than $10 million in annual revenue)", personal use, education and non-commercial open source, and larger professional use requires a paid subscription.

## Good to know

Treat it as beta software as of November 2026: commands and screens change between Desktop releases, and Docker's FAQ admits that its "security measures currently represent a best-effort approach … not yet exhaustive". Container isolation reduces what a bad server can reach. It does not make a server trustworthy, so the vetting habits in [Connecting and Governing MCP Servers](/guides/mcp/govern-mcp-servers) still apply. You can propose a new catalog server with a pull request to `docker/mcp-registry`.

Against [Composio](/tools/composio), the trade is where the work runs. Docker runs servers locally, or on your own Docker host, under policies you control. Composio hosts app connections and holds the OAuth credentials for you. See the [Docker MCP Toolkit alternatives](/tools/docker-mcp-toolkit/alternatives) and the [best MCP gateways of 2026](/guides/comparisons/best-mcp-gateways-2026) for the wider field.
