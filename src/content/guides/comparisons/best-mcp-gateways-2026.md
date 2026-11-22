---
title: "Best MCP Gateways in 2026"
description: "Docker, Composio, Microsoft, IBM ContextForge, Kong, Cloudflare, Portkey, Obot, AWS AgentCore and Lasso MCP gateways compared on auth, policy, audit and hosting."
seoTitle: "Best MCP Gateways 2026: Docker, Composio, Kong, Cloudflare and More"
seoDescription: "The best MCP gateways in 2026 compared: Docker, Composio, Microsoft, IBM ContextForge, Kong, Cloudflare, Portkey, Obot and AWS on auth, policy and audit."
author: "Imtiaz Rayhan"
date: 2026-11-19
reviewed: 2026-11-22
color: "blue"
depth: standard
topics: ["mcp"]
audience: ["developers", "devops", "security"]
tags: ["comparison", "mcp", "mcp-gateway", "security", "governance", "best-of"]
featured: false
keywords: ["best mcp gateways", "mcp gateway", "mcp gateway comparison", "docker mcp gateway", "open source mcp gateway", "enterprise mcp gateway"]
summary: "The best MCP gateway depends on where your agents and servers run. Docker suits local, containerized servers; Composio suits hosted SaaS connections with managed OAuth; Microsoft's gateway and IBM ContextForge suit self-hosted Kubernetes; Cloudflare, Kong, Portkey and AWS AgentCore suit teams already on those platforms; Obot is the open-source all-in-one."
keyTakeaways:
  - "An MCP gateway is one governed endpoint between agents and many MCP servers. It centralizes authentication, credentials, tool allowlists, policy and audit logs, so you set them once instead of in every client."
  - "Open-source, self-hosted options: Docker's MCP Gateway (MIT), Microsoft MCP Gateway (MIT, Kubernetes), IBM ContextForge (Apache-2.0) and Obot (MIT). Lasso's MIT gateway has had no commits since January 2026."
  - "Managed options: Composio, Cloudflare MCP server portals (generally available since September 24, 2026), Amazon Bedrock AgentCore Gateway and Portkey, which Palo Alto Networks acquired in May 2026. Kong's MCP plugins need its AI Gateway Enterprise offering."
  - "Smithery is no longer a gateway or host. It shut down its hosting, CLI and API on October 31, 2026, and survives as a directory powered by Arcade.dev."
  - "A registry is not a gateway. The official MCP Registry is a metadata catalog, and it is in preview as of November 2026."
faq:
  - q: "What is an MCP gateway?"
    a: "An MCP gateway is a proxy that sits between AI agents and the MCP servers they call and presents many servers through one governed endpoint. Composio defines it as 'a centralized security and control layer between AI agents and the MCP servers they call', and Docker describes its gateway as managing 'configuration, credentials, and access control'. In practice a gateway handles sign-in, holds the upstream credentials, decides which tools each user or team can see, and logs every call."
  - q: "What is the difference between an MCP gateway and an MCP registry?"
    a: "A registry tells you which servers exist; a gateway sits in the request path and controls how agents use them. The official MCP Registry is a metadata catalog, described as intended to be consumed primarily by downstream aggregators, and it is in preview as of November 2026 with a warning that breaking changes or data resets may occur. Some gateways can read from it: Docker's gateway can build a catalog from registry.modelcontextprotocol.io."
  - q: "What is the best open-source MCP gateway?"
    a: "For a single developer or a small team on Docker, Docker's MIT-licensed MCP Gateway is the easiest start because Docker Desktop runs it for you. For a self-hosted platform, IBM ContextForge (Apache-2.0) federates MCP, A2A and REST or gRPC APIs, Obot (MIT) adds virtual MCP servers and registries, and Microsoft's MCP Gateway (MIT) targets Kubernetes with Entra ID. Lasso's gateway is MIT too, but it has seen no commits since January 2026."
  - q: "Is Smithery still an MCP gateway?"
    a: "No. Arcade.dev acquired Smithery on August 5, 2026, and on October 31, 2026 Smithery shut down its proxy and hosting, its API, Connect and Toolbox, accounts and API keys, and its CLI and SDKs. Smithery.ai remains as a public, non-proxied directory of MCP servers, now powered by Arcade.dev. If you relied on Smithery-hosted URLs, you need a new host or gateway."
  - q: "Do I need an MCP gateway?"
    a: "Not for one developer with a few servers; your client's own config is enough. A gateway starts paying when several people or agents share servers, when credentials should not live in every client config, or when security needs one audit trail and one place to block a tool. It is also a good way to cut tool sprawl, because it can expose a short, task-specific tool list."
sources:
  - title: "MCP Gateway"
    url: "https://docs.docker.com/ai/mcp-catalog-and-toolkit/mcp-gateway/"
    publisher: "Docker"
  - title: "MCP Gateway"
    url: "https://composio.dev/mcp-gateway"
    publisher: "Composio"
  - title: "microsoft/mcp-gateway"
    url: "https://github.com/microsoft/mcp-gateway"
    publisher: "Microsoft"
  - title: "IBM/mcp-context-forge"
    url: "https://github.com/IBM/mcp-context-forge"
    publisher: "IBM"
  - title: "AI MCP Proxy plugin"
    url: "https://developer.konghq.com/plugins/ai-mcp-proxy/"
    publisher: "Kong"
  - title: "MCP server portals are now generally available"
    url: "https://developers.cloudflare.com/changelog/post/2026-09-24-mcp-portals-ga/"
    publisher: "Cloudflare"
  - title: "MCP Gateway"
    url: "https://portkey.ai/docs/product/mcp-gateway"
    publisher: "Portkey"
  - title: "obot-platform/obot"
    url: "https://github.com/obot-platform/obot"
    publisher: "Obot"
  - title: "Amazon Bedrock AgentCore Gateway"
    url: "https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/gateway.html"
    publisher: "Amazon Web Services"
  - title: "lasso-security/mcp-gateway"
    url: "https://github.com/lasso-security/mcp-gateway"
    publisher: "Lasso Security"
  - title: "The future of Smithery"
    url: "https://smithery.ai/future"
    publisher: "Smithery"
  - title: "About the MCP Registry"
    url: "https://modelcontextprotocol.io/registry/about"
    publisher: "Model Context Protocol"
related: ["tool:docker-mcp-toolkit", "tool:composio", "tool:portkey", "guide:govern-mcp-servers", "guide:best-mcp-servers-2026", "glossary:mcp-gateway", "guide:deploy-remote-mcp-server", "agent:mcp-security-reviewer", "skill:mcp-config-auditor"]
---

**The best MCP gateway in 2026 is the one that fits where your agents and servers already run.** If you work in Docker, start with [Docker's open-source MCP Gateway](/tools/docker-mcp-toolkit), which Docker Desktop runs for you when the MCP Toolkit is on. If you want hosted connections to SaaS apps with managed OAuth and per-team endpoints, use [Composio](/tools/composio). If you self-host on Kubernetes, look at Microsoft's MCP Gateway and IBM ContextForge. If you already live on Cloudflare, Kong, AWS or Portkey, their gateways put MCP behind the identity and logging you already run. Obot is the open-source all-in-one, and Lasso is a small local proxy whose development has stalled. One former option is gone: Smithery shut down its hosting on October 31, 2026.

*Last reviewed: November 2026.*

## What an MCP gateway does

An [MCP gateway](/glossary/mcp-gateway) is a proxy between your agents and the MCP servers they call. Composio's definition is "a centralized security and control layer between AI agents and the MCP servers they call", where "all agentic traffic flows through one governed control point that enforces access policy, manages credentials, and records an audit trail." Microsoft calls its version "a reverse proxy and management layer for MCP servers". Every product below does some mix of five jobs:

- **Authentication.** Users and agents sign in to the gateway, often through your identity provider, instead of to each server.
- **Secrets.** The gateway holds or injects the upstream credentials, so API keys and OAuth tokens stay out of client config files.
- **Tool filtering.** Each user, team or profile sees only the tools it is allowed to use. That is a security control and a context saver, because every exposed tool costs tokens. Some servers help here: the [Atlassian MCP Server](/tools/atlassian-mcp) documents a `?tools=all` option that gives gateways a flat list to filter.
- **Policy.** Allowlists, role-based access, rate limits, and on some products data-loss prevention or prompt-injection filtering.
- **Audit.** One log of who called which tool, which is often the reason a security team approves MCP at all.

A gateway is not a registry. The official MCP Registry is a metadata catalog "intended to be consumed primarily by downstream aggregators", and it is in preview as of November 2026: "Breaking changes or data resets may occur before general availability." [Connecting and Governing MCP Servers](/guides/mcp/govern-mcp-servers) covers how registries, gateways and curation fit together.

## The summary table

| Gateway | Deployment | License | Standout | Status, November 2026 |
| --- | --- | --- | --- | --- |
| [Docker MCP Gateway](/tools/docker-mcp-toolkit) | Local Docker Desktop or Docker CE | MIT | Each server in an isolated container; profiles with tool allowlists | Toolkit in beta as of November 2026; gateway tag v0.44.3 |
| [Composio](/tools/composio) | Composio Cloud; VPC or self-hosted on Enterprise | MIT SDKs; hosted gateway | Managed OAuth for SaaS apps; per-team endpoints | Current |
| Microsoft MCP Gateway | Self-hosted on Kubernetes; deploy to Azure | MIT | Entra ID auth with role-based access | v1.0.1 |
| IBM ContextForge | PyPI, Docker, Kubernetes | Apache-2.0 | Federates MCP, A2A and REST/gRPC; 40+ plugins | v1.1.1 |
| Kong AI Gateway | Self-managed or Konnect | Apache-2.0 core; MCP plugins Enterprise | REST-to-MCP conversion; per-tool ACLs | Current |
| Cloudflare MCP server portals | Managed (Cloudflare One) | Proprietary | One endpoint behind Cloudflare Access; DLP routing | Generally available since September 24, 2026 |
| [Portkey](/tools/portkey) MCP Gateway | Hosted; hybrid self-hosting | Platform feature | Per-user tool provisioning; token-based rate limits | Current; Palo Alto Networks owned |
| Obot | Self-hosted (Docker, Kubernetes) | MIT | Virtual MCP servers; MCP and Skills registries | v0.28.2 |
| Amazon Bedrock AgentCore Gateway | Managed (AWS) | Proprietary | Turns APIs and Lambda functions into MCP tools | Current |
| Lasso MCP Gateway | Local proxy | MIT | Sanitizes sensitive data; scans server reputation | Last commit January 2026 |

## Docker MCP Gateway and Toolkit

Docker calls the gateway its "open source solution for orchestrating Model Context Protocol (MCP) servers", a "centralized proxy between clients and servers, managing configuration, credentials, and access control". It runs each server in its own container, handles OAuth through the browser, keeps secrets in Docker Desktop rather than client configs, and has "built-in logging and call-tracing capabilities". Profiles group servers per project, and `docker mcp profile tools` enables or disables individual tools. `--verify-signatures` checks server images. The MCP Toolkit, the Desktop interface on top, is enabled from Docker Desktop's Beta features as of November 2026. The gateway itself also runs on Docker CE without Desktop. Docker's separate managed gateway, part of Docker AI Governance, is invite-only.

**Verdict:** the best start for individual developers and small teams. Strong on isolation and local control, light on organization-wide identity unless you join Docker's invite-only governance tier.

## Composio MCP Gateway

Composio's gateway is built around SaaS connections. "Each team gets its own MCP endpoint carrying only the tools it is permitted to use." Composio centralizes "OAuth connections, service accounts, and credential lifecycles", supports SAML or OIDC sign-in with SCIM provisioning, and puts managed toolkits and your own internal MCP servers behind the same identity controls, access policies and audit layer. "Tool-call payloads are never stored. Audit records hold metadata only." In the default Composio Cloud deployment Composio holds custody of the credentials. VPC and self-hosted deployments are an Enterprise arrangement.

**Verdict:** the pick when agents mostly call third-party apps and you would rather not run OAuth for each one. Check the custody model with your security team first.

## Microsoft MCP Gateway

Microsoft's open-source project is "a reverse proxy and management layer for MCP servers, enabling scalable, stateless request routing, authorization and lifecycle management of MCP servers in Kubernetes environments." It has a control-plane REST API (`/adapters`, `/tools`), a tool gateway router at `/mcp`, and Entra ID authentication with an `mcp.admin` role for role-based access. Agents and Sessions features are in "Preview, opt-in" as of November 2026, and there is a one-click deployment to Azure. The latest release is v1.0.1, and the project flags a breaking change: the gateway "requires MCP `2026-07-28` clients", the current revision of the protocol.

**Verdict:** the natural choice for Azure and Entra ID shops running Kubernetes. Confirm your clients support the 2026-07-28 spec before you upgrade.

## IBM ContextForge

ContextForge is an "open source registry and proxy that federates MCP, A2A, and REST/gRPC APIs with centralized governance, discovery, and observability." It has tools, agent and API gateways, "40+ plugins", OpenTelemetry tracing, "built-in auth, retries, and rate-limiting" and an admin UI. You can try it with `uvx --from mcp-contextforge-gateway mcpgateway`, then move to Docker or Kubernetes with Redis federation. The license is Apache-2.0, and the latest release is v1.1.1.

**Verdict:** the broadest self-hosted option, and the one to pick if you also route agent-to-agent traffic. [MCP vs A2A](/guides/mcp/mcp-vs-a2a) explains why that matters.

## Kong AI Gateway

Kong adds MCP through plugins. The AI MCP Proxy plugin, which needs Kong Gateway 3.12 or later, bridges MCP and HTTP in four modes (`passthrough-listener`, `conversion-listener`, `conversion-only` and `listener`). It converts REST APIs into MCP tools, aggregates servers, applies per-tool ACLs (from 3.13) and emits MCP logs and metrics. A companion AI MCP OAuth2 plugin handles authorization. Both are "only available as part of our AI Gateway Enterprise offering", although Kong Gateway's core is Apache-2.0. Konnect's MCP Registry is a tech preview as of November 2026.

**Verdict:** right if Kong already fronts your APIs and you hold an Enterprise license. Turning existing REST endpoints into MCP tools is its strongest feature.

## Cloudflare MCP server portals

"A portal gives users one endpoint for approved Model Context Protocol (MCP) servers. Cloudflare Access logs tool, prompt, and resource activity." Portals became generally available on September 24, 2026, and the announcement lists what Cloudflare added on the way: Gateway routing for HTTP logging and data-loss prevention, Code Mode policies, static OAuth credentials, service-token authentication and Logpush to a SIEM. Portals are part of Cloudflare One, Cloudflare's zero-trust platform. They are not the same product as [Cloudflare's own MCP servers](/tools/cloudflare-mcp), which expose Cloudflare's APIs to agents.

**Verdict:** the easiest managed option if your company already uses Cloudflare Access for identity.

## Portkey MCP Gateway

Portkey's gateway "acts as a proxy between MCP Clients and MCP servers, handling authentication, access control, and logging". It provisions tools per user, rate-limits "by request count or token consumption per API key, server, or tool", applies guardrails, and works with identity providers such as Okta and Auth0. Endpoints take the form `https://mcp.portkey.ai/{server-slug}/mcp`. Palo Alto Networks closed its acquisition of Portkey on May 29, 2026, and Portkey's docs are now titled "Portkey (Prisma AIRS AI Gateway) Docs". The routing gateway on GitHub is MIT, but the docs present the MCP gateway as a platform feature, so do not assume it is open source.

**Verdict:** a good fit if you already send LLM traffic through Portkey and want MCP under the same policies. The [LLM gateways comparison](/guides/advanced/llm-gateways-compared) covers the model-routing side.

## Obot

Obot is an open-source MCP platform rather than a single proxy. Its MCP Gateway serves virtual MCP servers (vMCPs) and "MCP tunnels" with per-user and per-group tool access, tool search and credential filters. Around it sit an LLM gateway, hosted MCP servers, MCP and Skills registries, and "correlated audit logs". It is MIT-licensed. The project suggests Docker for evaluation and Kubernetes for production, and the latest release is v0.28.2.

**Verdict:** the choice for a platform team that wants gateway, registry and hosting in one self-hosted, open-source stack.

## Amazon Bedrock AgentCore Gateway

AWS describes AgentCore Gateway as "a fully managed AI gateway that provides a single, secure entry point for agentic traffic". It "converts APIs, Lambda functions, and existing services into Model Context Protocol (MCP)-compatible tools" from OpenAPI, Smithy and Lambda inputs. It handles inbound and outbound authentication and offers "Semantic Tool Selection", which helps an agent pick from a large tool list, along with "built-in observability and auditing".

**Verdict:** the shortest path for AWS teams that want to expose existing APIs and Lambda functions to agents without writing MCP servers.

## Lasso MCP Gateway

Lasso's open-source gateway is a local proxy with a security focus. It "intercepts requests and responses to sanitize sensitive information", and a scanner "analyzes server reputation and security risks before loading MCP servers". It installs with `pip install mcp-gateway` and wraps an existing client config, for example `mcp-gateway --mcp-json-path ~/.cursor/mcp.json -p basic`. It is MIT-licensed, but the last release was v1.2.0 in January 2026 and the repository has had no commits since January 22, 2026.

**Verdict:** an interesting idea for one developer's machine, but treat it as unmaintained until activity resumes.

## Former options: Smithery and MetaMCP

Smithery used to host MCP servers and proxy connections to them. Arcade.dev acquired it on August 5, 2026, and on October 31, 2026 Smithery shut down its connection services: server URLs on run.tools and server.smithery.ai, the API, Connect and Toolbox, accounts and API keys, and the CLI and SDKs. [Smithery](/tools/smithery) remains a public, non-proxied directory of MCP servers, now powered by Arcade.dev. That makes it useful for discovery but not a gateway. MetaMCP, an open-source aggregator, is out for a simpler reason: its GitHub repository is archived.

## How to choose

- **You are one developer, or a small team, on Docker.** Docker's MCP Gateway through the MCP Toolkit.
- **Your agents mostly call SaaS apps, and you want OAuth handled for you.** Composio.
- **You run Kubernetes with Entra ID.** Microsoft MCP Gateway.
- **You need open source, self-hosted, and MCP plus A2A or REST.** IBM ContextForge.
- **You want gateway, registries and hosted servers in one open-source platform.** Obot.
- **Cloudflare Access already handles your identity.** Cloudflare MCP server portals.
- **Kong already fronts your APIs.** Kong AI Gateway, if you have the Enterprise offering.
- **Your LLM traffic already runs through Portkey.** Portkey's MCP Gateway.
- **You are on AWS and want APIs and Lambda functions as tools.** AgentCore Gateway.

Whichever you pick, a gateway enforces policy but does not make a server trustworthy. Review servers before they go behind it. The [mcp-security-reviewer](/agents/quality-security/mcp-security-reviewer) agent reads a server's code and tool descriptions, and the [mcp-config-auditor](/skills/security/mcp-config-auditor) skill checks the client configs that remain.

## Continue exploring

The gateway is one piece of MCP governance. [Connecting and Governing MCP Servers](/guides/mcp/govern-mcp-servers) covers registries, curation and supply-chain risk, and the [best MCP servers of 2026](/guides/mcp/best-mcp-servers-2026) is the shortlist of servers worth putting behind a gateway. If you build servers yourself, [Deploying a Remote MCP Server](/guides/mcp/deploy-remote-mcp-server) covers the hosting side, and the [best Claude skills for MCP development](/guides/skills/best-claude-skills-for-mcp-development) lists installables that help. For definitions, see [MCP gateway](/glossary/mcp-gateway) and [AI gateway](/glossary/ai-gateway). The tool pages for [Docker MCP Toolkit](/tools/docker-mcp-toolkit), [Composio](/tools/composio) and [Portkey](/tools/portkey) carry setup details and, where they exist, current prices.
