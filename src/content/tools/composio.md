---
name: "Composio"
title: "Composio"
description: "Composio gives AI agents authenticated access to third-party apps through SDKs, a CLI, the Composio Connect MCP server and a managed MCP gateway."
seoDescription: "Composio in November 2026: the CLI for Claude Code, Composio Connect, the managed MCP gateway, MIT SDKs, Hobby and Pro prices, token custody, and alternatives."
date: 2026-11-13
reviewed: 2026-11-22
url: "https://composio.dev"
pricing: "freemium"
category: "mcp"
repo: "https://github.com/ComposioHQ/composio"
license: "MIT"
os: ["Web", "macOS", "Linux"]
color: "orange"
topics: ["mcp", "ai-agents-systems"]
audience: ["developers", "ai-engineers"]
tags: ["composio", "mcp", "mcp-gateway", "oauth", "integrations", "agents"]
featured: false
alternativeTo: ["docker-mcp-toolkit", "zapier-agents", "portkey"]
sameAs:
  - "https://github.com/ComposioHQ"
  - "https://x.com/composio"
  - "https://www.linkedin.com/company/composiohq/"
related: ["tool:docker-mcp-toolkit", "tool:zapier-agents", "tool:portkey", "guide:best-mcp-gateways-2026", "guide:govern-mcp-servers", "guide:claude-code-mcp-setup", "glossary:mcp-gateway", "tool:claude-agent-sdk"]
keywords: ["Composio", "Composio MCP", "Composio Connect", "Composio MCP gateway", "Composio pricing", "Composio alternatives"]
summary: "Composio gives AI agents authenticated access to third-party apps. Developers build with its MIT-licensed SDKs and CLI, MCP clients such as Claude Desktop and ChatGPT connect through the Composio Connect server, which handles OAuth on demand, and teams can put tools behind its managed MCP gateway. Hobby is $0 and Pro is $29 a month as of November 2026."
faq:
  - q: "What is Composio Connect?"
    a: "Composio Connect is Composio's MCP server for end users, at https://connect.composio.dev/mcp. Its docs describe it as giving your agent access to 1,500+ apps through a single connection. Instead of loading every tool, it exposes seven meta-tools that let the agent search for tools, fetch their schemas, authorize apps on demand and execute up to 50 tool calls in parallel. The first time the agent needs an app, Composio generates an OAuth link that you approve in your browser, and the connection then persists across sessions."
  - q: "Is Composio free?"
    a: "There is a free tier. As of November 2026 Composio's platform pricing lists Hobby at $0 with 100,000 tool calls, 50,000 triggers and 3 team members a month, Pro at $29 a month with $29 in monthly credits, and custom Enterprise plans. Its separate pricing for individuals, as of November 2026, lists a Free plan at $0 and a Standard plan at $18 per seat a month that is marked Coming soon."
  - q: "How many apps does Composio connect to?"
    a: "It depends on which Composio page you read. As of November 2026 the GitHub README says 1000+ pre-authenticated toolkits, the docs index and the Composio Connect page say 1,500+ apps, and the pricing page for individuals says 1,700+ apps. Check the toolkit catalog for the specific apps you need rather than relying on any one headline number."
  - q: "Can I self-host Composio?"
    a: "The SDK monorepo on GitHub is MIT-licensed, but the hosted service is not something you can run on a free plan. Composio's token-custody docs describe running in your own VPC or fully self-hosted, with Helm deployment support, as an Enterprise arrangement. In the default Composio Cloud deployment, Composio holds custody of your app credentials."
---

Composio is an integration layer for AI agents. Its GitHub README puts the pitch plainly: "Composio gives your AI agents 1000+ pre-authenticated toolkits, per-user sessions, authentication, triggers, and a sandbox, so you can ship agents that turn intent into action." In practice that means you stop writing an OAuth flow and a tool wrapper for every app your agent touches. Composio handles the connection, stores the credentials and exposes the app's actions as tools. Its site's product lines include Composio for You (tools for Claude, Codex or any harness), a CLI for coding agents, a developer platform with SDKs, and a managed MCP gateway.

The app count depends on the page you read. As of November 2026 the README says 1000+ toolkits, the docs say 1,500+ apps, and the pricing page for individuals says 1,700+ apps. Composio fits two kinds of buyer. One is the developer building an agent product who needs per-user app connections. The other is the platform team that wants one governed [MCP gateway](/glossary/mcp-gateway) in front of every tool its agents call. The [MCP gateways roundup](/guides/comparisons/best-mcp-gateways-2026) compares it with the rest of that field.

## Highlights

- **Composio Connect.** An MCP server at `https://connect.composio.dev/mcp` that, per its docs, "gives your AI agent access to 1,500+ apps … through a single connection".
- **Meta-tools instead of every tool.** Connect exposes seven meta-tools: `COMPOSIO_SEARCH_TOOLS`, `COMPOSIO_GET_TOOL_SCHEMAS`, `COMPOSIO_MULTI_EXECUTE_TOOL` (up to 50 calls at once), `COMPOSIO_MANAGE_CONNECTIONS`, `COMPOSIO_WAIT_FOR_CONNECTIONS`, `COMPOSIO_REMOTE_WORKBENCH` and `COMPOSIO_REMOTE_BASH_TOOL`. The agent discovers what it needs instead of carrying every schema in its context.
- **OAuth on demand.** "The first time your agent needs an app, Composio generates an OAuth link you approve in your browser; after that the connection persists across sessions."
- **SDKs and adapters.** `@composio/core` for TypeScript, `composio` for Python, a `composio` CLI that searches and executes tools from your shell, and provider adapters for the OpenAI Agents SDK, the [Claude Agent SDK](/tools/claude-agent-sdk), the [Vercel AI SDK](/tools/vercel-ai-sdk) and LangChain.
- **A hosted MCP endpoint per session.** Pass `mcp: true` to `composio.create()` and point Claude, Cursor or any MCP client at `session.mcp.url`.
- **MCP gateway for teams.** "Each team gets its own MCP endpoint carrying only the tools it is permitted to use." It manages OAuth connections and service accounts, supports SAML or OIDC sign-in with SCIM provisioning, and can put your custom and internal MCP servers behind the same policies.
- **Firewall.** A newer feature that Composio says "blocks instructions hidden in tool results before your agent reads them", which targets [prompt injection](/glossary/prompt-injection) through tool output.

## In an AI-assisted workflow

The documented Claude Code setup starts with the Composio CLI:

```bash
curl -fsSL https://composio.dev/install | sh
composio login
```

From there the agent works through the CLI: `composio search` finds a tool, `composio link` connects an account and `composio execute` runs the tool, and `composio setup --target claude` installs Composio's Claude Code plugin. If you would rather use MCP, add Composio Connect at `https://connect.composio.dev/mcp` instead. There the agent sees only the meta-tools at first, so your context stays small until a task needs a particular app. A made-up example:

```text
Find the open GitHub issues labeled "bug" in acme/web, then post a
three-line summary of them to the #eng-triage channel in Slack.
```

The agent searches for the GitHub and Slack tools. If either app is not connected yet, it hands you a link to approve the connection, then runs both calls. If you are building your own agent rather than using Claude Code, create a session with `mcp: true` and give the client `session.mcp.url`, so each end user gets their own connections. For the general mechanics of adding remote servers, see [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup).

> [!TIP]
> Every app you authorize gives the agent a working credential. Connect the apps a project needs, not everything you use, and review the connected list now and then. The [governance guide](/guides/mcp/govern-mcp-servers) covers the least-privilege habits that apply here.

## Pricing

Composio bills monthly and has two pricing pages. As of November 2026 the platform page for developers lists Hobby at $0, with "100,000 tool calls, 50,000 triggers, and 3 team members included free each month" plus $2 in credits, and Hobby stops at its included limit. As of November 2026 Pro costs $29 a month with $29 in monthly credits, unlimited team members, and 10,000 requests per minute against Hobby's 2,000. Pro overage runs $0.0003 in credits per call and $0.003 per trigger event as of November 2026. Enterprise is custom and covers SSO and SCIM, customer-managed keys, MSA, DPA and BAA terms, and SLAs.

As of November 2026 the page for individuals lists Free at $0, with $2 in one-time credits, up to 3 members and 10,000 tool calls a month. It also lists Standard at $18 per seat a month, labelled Coming soon as of November 2026, and Enterprise at custom pricing.

## Good to know

**Credential custody.** In the default Composio Cloud deployment, Composio holds custody of the app credentials your users authorize. Composio documents AES-256-GCM encryption at rest and TLS in transit. Customer-managed keys can use AWS KMS, Google Cloud KMS or HashiCorp Vault Transit. Running in your own VPC, or fully self-hosted with Helm, is an Enterprise arrangement rather than a plan feature. The gateway page says tool-call payloads are never stored, and audit records keep metadata only, for a retention window you configure.

**Open source, partly.** The SDK monorepo is MIT. The gateway and Connect are hosted products.

**Platforms.** You manage Composio from a web dashboard. The CLI installs through a POSIX `sh` script, which moved there on July 31, 2026, so it covers macOS and Linux. As of November 2026, Windows x64 support is experimental through a separate PowerShell installer, and Composio points to WSL for a fully supported setup.

**Rube.** Older tutorials sometimes route Claude through Rube. Composio's current docs do not mention it and document Composio Connect as the MCP entry point instead.

**Alternatives.** [Docker MCP Toolkit](/tools/docker-mcp-toolkit) runs MCP servers locally in containers instead of brokering hosted app connections. [Zapier Agents](/tools/zapier-agents) is the no-code route to agents that act across Zapier's catalog. [Portkey](/tools/portkey), now owned by Palo Alto Networks, offers an MCP gateway alongside its LLM gateway. Compare them all on the [Composio alternatives page](/tools/composio/alternatives) or in the [best MCP gateways of 2026](/guides/comparisons/best-mcp-gateways-2026).
