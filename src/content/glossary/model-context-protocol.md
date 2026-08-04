---
term: "MCP (Model Context Protocol)"
description: "MCP is the open standard for connecting AI models to external tools and data: write one server, and any MCP client — Claude Code, IDEs, agents — can use it."
date: 2026-06-11
topics: ["mcp"]
tags: ["mcp", "protocol", "tools", "integrations"]
related: ["guide:claude-code-mcp-setup", "guide:best-mcp-servers-2026", "guide:building-an-mcp-server", "guide:mcp-vs-a2a", "glossary:function-calling", "glossary:ai-agent"]
faq:
  - q: "What does MCP actually standardize?"
    a: "The interface between a model-driven application (the client) and a capability provider (the server): servers expose tools the model can call, resources the app can read, and reusable prompts, over JSON-RPC via stdio or HTTP. Write the integration once and it works in every compliant client — that's the N×M problem it kills."
  - q: "Who controls MCP?"
    a: "It's vendor-neutral now. Anthropic created it in November 2024, and in December 2025 donated it to the Agentic AI Foundation under the Linux Foundation, co-founded with Block and OpenAI. By then the ecosystem counted thousands of public servers and tens of millions of monthly SDK downloads."
---

**MCP (Model Context Protocol) is the open standard for connecting AI applications to external tools and data sources — write one MCP server for a capability, and any MCP-compatible client can use it.**

Before MCP, every "let the model query our database" integration was bespoke glue between one app and one service. MCP replaces that with a client–server protocol: a **server** exposes tools (functions the model calls), resources (data the app attaches), and prompts (reusable templates); a **client** — Claude Code, Claude Desktop, IDEs, custom agents — discovers and uses them over JSON-RPC, locally via stdio or remotely via Streamable HTTP.

Created by Anthropic in late 2024, adopted by OpenAI and Google in 2025, and donated to the Linux Foundation's Agentic AI Foundation that December, MCP became the de facto standard for the agent-to-tool layer, with thousands of public servers. Its sibling protocol [A2A](/guides/mcp/mcp-vs-a2a) covers the agent-to-agent layer.

Start consuming servers with [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup) and the [2026 shortlist](/guides/mcp/best-mcp-servers-2026); build your own with [Building an MCP Server](/guides/advanced/building-an-mcp-server).
