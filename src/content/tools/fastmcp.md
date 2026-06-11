---
name: "FastMCP"
title: "FastMCP"
description: "A Pythonic framework for building Model Context Protocol servers and clients — decorator-based tools, resources, and prompts, with auth and deployment built in."
url: "https://gofastmcp.com"
date: 2026-06-04
pricing: "open-source"
category: "sdk"
repo: "https://github.com/PrefectHQ/fastmcp"
license: "Apache-2.0"
sameAs: ["https://github.com/PrefectHQ/fastmcp", "https://gofastmcp.com"]
os: ["Linux", "macOS", "Windows"]
color: "green"
topics: ["mcp", "architecture"]
tags: ["mcp", "python", "sdk", "open-source"]
featured: false
related: ["building-an-mcp-server", "mcp-server-engineer", "mcp-inspector", "deploy-remote-mcp-server", "mcp-server-scaffolder"]
summary: "FastMCP is a Pythonic framework for building Model Context Protocol servers and clients: decorate plain functions with @mcp.tool, @mcp.resource, or @mcp.prompt and it generates a compliant server, deriving schemas from type hints and docstrings. Version 1.0 was folded into the official MCP Python SDK; standalone 3.x adds auth, deployment, and composition."
faq:
  - q: "What is FastMCP?"
    a: "FastMCP is a high-level, Pythonic framework for building Model Context Protocol servers and clients. Instead of hand-wiring JSON-RPC and transports, you decorate plain Python functions with @mcp.tool, @mcp.resource, or @mcp.prompt, and FastMCP turns them into a compliant server — generating the schemas the client advertises to the model from your type hints and docstrings."
  - q: "Is FastMCP free?"
    a: "Yes — FastMCP is free and open source under Apache-2.0. Its original version (1.0) was incorporated into the official MCP Python SDK; the actively developed standalone framework is FastMCP 3.x, which adds authentication, deployment helpers, server composition, proxying, and generation from OpenAPI/FastAPI apps."
  - q: "How do I build an MCP server with FastMCP?"
    a: "Create a FastMCP instance, decorate a typed function with @mcp.tool, and call mcp.run() — stdio by default, or Streamable HTTP for remote use. The function's name, type hints, and docstring become the tool's name, schema, and description, so write the docstring for the model: what the tool does, what it returns, and when to use it."
---

FastMCP is a high-level, **Pythonic** framework for building Model Context Protocol servers (and clients). Instead of hand-wiring JSON-RPC and transports, you decorate plain Python functions — `@mcp.tool`, `@mcp.resource`, `@mcp.prompt` — and FastMCP turns them into a compliant server, generating the schemas the client advertises to the model from your type hints and docstrings.

It is aimed at Python developers who want to expose a capability as an MCP server with minimal ceremony, then grow it toward production. FastMCP's original version (1.0) was incorporated into the official MCP Python SDK; the actively developed standalone framework — now **FastMCP 3.x** — adds the surrounding machinery: authentication, deployment, server composition, proxying, and generating servers from existing OpenAPI/FastAPI apps.

## Highlights

- **Decorator-based** — `@mcp.tool`, `@mcp.resource`, and `@mcp.prompt` on ordinary functions; schemas are derived from type hints and docstrings.
- **Transports built in** — run over stdio for local use or Streamable HTTP for remote, without rewriting your handlers.
- **Auth & deployment** — built-in authentication patterns and deployment helpers for taking a server remote and production-ready.
- **Composition & proxying** — mount sub-servers and proxy other MCP servers to assemble larger surfaces from smaller ones.
- **Generate from existing APIs** — produce an MCP server from an OpenAPI spec or a FastAPI app, so an existing service becomes model-accessible.

## In an AI-assisted workflow

Define a tool as a typed function and run the server:

```python
from fastmcp import FastMCP

mcp = FastMCP("weather")

@mcp.tool
def get_weather(city: str, units: str = "c") -> str:
    """Get the current weather for a city. Returns temperature and conditions."""
    data = fetch_weather(city, units)
    return f"{data.temp}° — {data.conditions}"

if __name__ == "__main__":
    mcp.run()  # stdio by default; switch to Streamable HTTP for remote
```

> [!TIP]
> The function's name, type hints, and docstring become the tool's name, schema, and description — the model's routing signal. Write the docstring for the model: what the tool does, what it returns, and when to use it. Test it with the [MCP Inspector](/tools/mcp-inspector) before connecting a client.

## Good to know

FastMCP is free and open source under Apache-2.0. It's the fast path to an MCP server in Python; for the conceptual model see [Building an MCP Server](/guides/advanced/building-an-mcp-server), and for taking the result remote and scalable, [Deploying a Remote MCP Server](/guides/mcp/deploy-remote-mcp-server).
