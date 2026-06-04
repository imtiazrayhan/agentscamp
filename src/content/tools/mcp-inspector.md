---
name: "MCP Inspector"
title: "MCP Inspector"
description: "The official open-source visual tool for testing and debugging Model Context Protocol servers — connect, list, and call tools, resources, and prompts."
url: "https://github.com/modelcontextprotocol/inspector"
date: 2026-06-04
pricing: "open-source"
category: "mcp"
repo: "https://github.com/modelcontextprotocol/inspector"
license: "MIT"
sameAs: ["https://github.com/modelcontextprotocol/inspector", "https://modelcontextprotocol.io"]
os: ["macOS", "Linux", "Windows"]
color: "blue"
topics: ["architecture"]
tags: ["mcp", "debugging", "developer-tools", "open-source"]
featured: false
related: ["building-an-mcp-server", "mcp-server-engineer", "deploy-remote-mcp-server", "fastmcp", "mcp-server-scaffolder", "add-mcp-server"]
---

MCP Inspector is the official, open-source developer tool for **testing and debugging** Model Context Protocol servers. It's the fastest way to see what a server actually exposes: connect to it, browse its tools, resources, and prompts, call them with arbitrary inputs, and watch the raw request/response traffic — all from a local web UI, with no client and no model in the loop.

It is aimed at anyone building an MCP server who wants to confirm a capability behaves *before* wiring it into Claude Code or another client. Because it talks to your server directly, it separates "is my server correct?" from "is the model using it well?" — so you debug one problem at a time.

## Highlights

- **Connect to any MCP server** — launch a local **stdio** server as a child process, or point it at a remote **Streamable HTTP** server by URL.
- **Exercise every primitive** — list and call tools with custom arguments, read resources, and render prompts, seeing typed inputs and results.
- **See the wire** — inspect the JSON-RPC messages, notifications, and errors flowing in both directions, which is where most server bugs reveal themselves.
- **Zero install** — run it on demand with `npx`; it opens a browser UI against your server.

## In an AI-assisted workflow

Point the Inspector at the server you're developing and click through its tools before any client touches it:

```bash
# launch the Inspector against a local stdio server
npx @modelcontextprotocol/inspector node ./my-server/index.js
```

It opens a UI where you connect, list the server's tools, call one with sample inputs, and read back the result and any errors — the tight loop that catches a bad schema or a vague description early.

> [!TIP]
> Debug in the Inspector first, then connect to a client. If a tool misbehaves in the Inspector, it's a server bug; if it works there but the model misuses it, it's a naming/description (routing) problem — see [Building an MCP Server](/guides/advanced/building-an-mcp-server).

## Good to know

MCP Inspector is free and open source under MIT and maintained as part of the Model Context Protocol project. You run it locally via Node.js (`npx @modelcontextprotocol/inspector`), and it's the standard first stop when building a server with a framework like [FastMCP](/tools/fastmcp) or the official SDKs.
