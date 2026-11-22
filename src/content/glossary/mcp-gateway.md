---
term: "MCP Gateway"
description: "An MCP gateway is a proxy between AI agents and the MCP servers they call, giving one endpoint with central auth, tool allowlists and audit logging."
date: 2026-11-19
topics: ["mcp", "ai-safety-security"]
audience: ["developers", "devops", "security"]
tags: ["mcp-gateway", "mcp", "governance", "security", "tool-sprawl"]
related: ["guide:govern-mcp-servers", "glossary:model-context-protocol", "guide:best-mcp-gateways-2026", "glossary:ai-gateway", "glossary:tool-poisoning", "agent:mcp-security-reviewer"]
faq:
  - q: "What does an MCP gateway do?"
    a: "It puts many MCP servers behind one endpoint and applies policy there: central authentication and credential injection, per-user or per-team tool allowlists, audit logging, and in some products tool search so the model sees fewer tools at once. Composio describes it as one governed control point that enforces access policy, manages credentials and records an audit trail."
  - q: "Is an MCP gateway the same as the MCP Registry?"
    a: "No. The official MCP Registry is a metadata catalog of servers, intended to be consumed primarily by downstream aggregators, and it does not proxy traffic; it is in preview as of November 2026. A gateway sits in the request path between clients and servers. The two can work together: Docker's gateway can build a catalog from the official registry."
  - q: "Which MCP gateways are available?"
    a: "Options in November 2026 include Docker's open-source MCP Gateway (MIT), Microsoft's MCP Gateway for Kubernetes (MIT), IBM ContextForge (Apache-2.0), Obot (MIT), Composio's MCP Gateway, Kong's AI MCP Proxy plugin in its AI Gateway Enterprise offering, Cloudflare's MCP server portals, Portkey's MCP gateway and Amazon Bedrock AgentCore Gateway. Our MCP gateway roundup compares them."
summary: "An MCP gateway sits between AI agents and the Model Context Protocol servers they call, presenting many servers through one governed endpoint. It centralizes authentication and credentials, limits which tools each user or team can reach, records an audit trail, and sometimes adds tool search. It is the agent-to-tool counterpart of an AI gateway."
---

**An MCP gateway is a proxy between AI agents and the [Model Context Protocol](/glossary/model-context-protocol) servers they call, presenting many servers through one endpoint where authentication, tool access and audit logging are enforced once instead of in every client.**

Vendor definitions converge. Composio calls it "a centralized security and control layer between AI agents and the MCP servers they call," where "all agentic traffic flows through one governed control point that enforces access policy, manages credentials, and records an audit trail." Docker's open-source MCP Gateway, which runs in the background when the [Docker MCP Toolkit](/tools/docker-mcp-toolkit) is enabled, "acts as a centralized proxy between clients and servers, managing configuration, credentials, and access control." Microsoft's version is "a reverse proxy and management layer for MCP servers," and Cloudflare's MCP server portals give "users one endpoint for approved Model Context Protocol (MCP) servers."

Across products the common jobs are the same: aggregate servers behind one endpoint, hold credentials and inject them upstream, enforce per-user or per-team tool allowlists, and log who called which tool. Some, including Composio, Obot and AgentCore Gateway, add tool search so the model reads a short list instead of every tool. That is how a gateway fights the tool sprawl described in [Connecting and Governing MCP Servers](/guides/mcp/govern-mcp-servers).

A gateway is not a registry. The official MCP Registry is a metadata catalog "intended to be consumed primarily by downstream aggregators," and it is in preview as of November 2026. An MCP gateway is also distinct from an [AI gateway](/glossary/ai-gateway), which governs app-to-model calls rather than agent-to-tool calls, though some vendors sell both.

The options, from self-hosted open source to managed cloud services, are compared in [Best MCP Gateways in 2026](/guides/comparisons/best-mcp-gateways-2026).
