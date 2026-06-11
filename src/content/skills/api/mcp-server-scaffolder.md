---
name: "mcp-server-scaffolder"
description: "Scaffold a new Model Context Protocol (MCP) server from a description — pick the SDK and transport, generate a typed first tool with a strict schema, and wire up MCP Inspector testing and the client-registration command. Use when starting a new MCP server and you want a correct, runnable skeleton instead of copying a README."
allowed-tools: "Read, Grep, Glob, Bash, Write, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-04
topics: ["mcp", "architecture"]
related: ["building-an-mcp-server", "mcp-server-engineer", "fastmcp", "mcp-inspector", "add-mcp-server"]
featured: false
summary: "Turn 'I want an MCP server for X' into a runnable skeleton: this skill picks the SDK and transport, generates a typed first tool with a strict schema and a routing-quality description, and wires up Inspector testing plus the client-registration command — a correct starting point, not boilerplate to debug."
---

Starting an MCP server from a blog post means inheriting its mistakes — a vague tool description, a loose schema, the wrong transport for where it'll run. This skill scaffolds a **correct, runnable** server skeleton from a one-line description: it picks the SDK and transport for your case, generates a first tool that already follows the naming/schema/description discipline that makes a server usable, and leaves you with the exact commands to test and register it.

## When to use this skill

- Starting a brand-new MCP server and you want a runnable skeleton with one good tool, not a pile of boilerplate.
- You know *what* the server should expose but want the transport choice, schema shape, and project layout decided correctly up front.
- Standing up a server to test an integration idea quickly, with Inspector testing already wired in.

## Instructions

1. **Clarify the capability and where it runs.** From the description, identify the first tool (one job, clearly named) and whether the server runs **local** (stdio) or **remote/shared** (Streamable HTTP). If it's ambiguous, default to stdio for a local prototype and note how to promote it to HTTP later.
2. **Pick the SDK and detect the ecosystem.** Match the project's language: the official Python or TypeScript MCP SDK, or a higher-level framework like [FastMCP](/tools/fastmcp) for Python. Check for an existing project to slot into (package manager, lockfile, conventions) rather than scaffolding in isolation.
3. **Generate the server skeleton.** Create the entrypoint, the transport setup (stdio or Streamable HTTP), and one **tool** with: a verb-object name, a description written as a routing signal (what it does, what it returns, when to use it), and a strict input schema (required vs. optional, enums, per-field descriptions). Stub the handler with a clear TODO and a concise, model-ready return shape.
4. **Wire in testing.** Add the command to launch the [MCP Inspector](/tools/mcp-inspector) against the server (`npx @modelcontextprotocol/inspector ...`) so the first thing the developer can do is connect, list the tool, and call it.
5. **Emit the registration command.** Provide the exact `claude mcp add` invocation (correct transport, scope, and any `--env` for secrets) — or point to the [Add MCP Server](/commands/workflow/add-mcp-server) command — so the server can be connected to a client immediately.
6. **Leave a clear extension path.** Document where to add the next tool, resource, or prompt, and flag that a remote server still needs auth and stateless scaling before production (link the deploy guide).

> [!TIP]
> Scaffold **one** good tool, not five mediocre ones. The first tool sets the pattern the rest of the server copies — get its name, schema, and description right and the server stays usable as it grows.

> [!WARNING]
> A scaffold is a starting point, not a production server. The generated handler must still validate its inputs, and a remote (HTTP) server is not safe to expose until it has authentication and input validation — see [Deploying a Remote MCP Server](/guides/mcp/deploy-remote-mcp-server).

## Output

A runnable MCP server skeleton: entrypoint and transport wired up, one well-shaped tool with a strict schema and routing-quality description, the Inspector test command, and the client-registration snippet — plus a short note on where to add the next capability and what hardening is still required before production.
