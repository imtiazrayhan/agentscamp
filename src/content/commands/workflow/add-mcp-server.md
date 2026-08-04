---
description: "Add an MCP server to the current project the safe way — pick the transport and scope, wire secrets through env vars, vet provenance, and verify the connection before trusting it."
argument-hint: "<server name + launch command or URL, or a description of the server to add>"
allowed-tools: "Read, Grep, Glob, Bash, Edit"
model: "sonnet"
title: "Add MCP Server"
color: "purple"
date: 2026-06-04
topics: ["mcp", "architecture"]
related: ["guide:building-an-mcp-server", "guide:govern-mcp-servers", "tool:mcp-inspector", "tool:smithery", "agent:mcp-server-engineer"]
featured: false
summary: "A slash command that adds an MCP server to the current project safely: it detects existing MCP config, chooses stdio or Streamable HTTP transport and the right scope (local, project, or user), wires secrets through env vars instead of committed config, produces the exact claude mcp add command, and verifies the server actually connected."
---

## Scope

Treat `$ARGUMENTS` as the MCP server to add: a name plus a launch command (for local **stdio**) or a URL (for remote **Streamable HTTP**), or a description of the capability you want. Restate in one sentence which server you're adding, by which transport, and at which scope before changing anything.

Goal: connect the server **correctly and safely** — right transport, right scope, secrets via environment variables (never inline), provenance vetted for third-party servers — and verify it actually connected before declaring success.

> [!WARNING]
> An MCP server runs code and is handed tool access and credentials. For any third-party server, vet provenance and pin a version before adding it — a connected server can use whatever you give it. See [Connecting and Governing MCP Servers](/guides/mcp/govern-mcp-servers).

## Step 1 — Detect how this project configures MCP

Look for existing MCP configuration: a checked-in `.mcp.json` (project scope), per-user config, or `claude mcp` usage. Match what's already there rather than introducing a second mechanism. Confirm whether the server should be **local to this project**, shared via a committed `.mcp.json`, or available across all the user's projects.

## Step 2 — Choose the transport

Pick **stdio** for a local, single-user server the client launches as a child process; pick **Streamable HTTP** (with a URL) for a remote or shared server. State which and why — the transport determines whether auth is your concern (it is, for HTTP).

## Step 3 — Choose the scope

Map the need to a scope: local/per-project for a personal addition, **project** (committed `.mcp.json`) for something the whole team should get, or **user** for a server you want everywhere. Note that a project-scoped server prompts each teammate to approve it before its tools activate.

## Step 4 — Wire secrets through the environment

If the server needs tokens or keys, pass them via environment variables (e.g. `--env GITHUB_TOKEN=...` sourced from the environment), never hard-coded into a committed config. Confirm no secret is about to be written into `.mcp.json` or the repo.

## Step 5 — Register it

Produce the exact registration command, options before the server name. For example:

```bash
# local stdio server
claude mcp add weather -- node ./weather-server/index.js

# remote Streamable HTTP server
claude mcp add --transport http --scope project linear https://mcp.linear.app/mcp
```

## Step 6 — Verify the connection

Confirm the server actually connected and exposes what you expect: run `claude mcp list` (and `/mcp` inside a session) to check status and tools, or connect with the [MCP Inspector](/tools/mcp-inspector) to list and call a tool directly. A server that's "added" but not connected — or that exposes no usable tools — is not done.

> [!NOTE]
> If the server needs OAuth (common for hosted remote servers), the client will prompt for authorization on first use — `/mcp` is where you complete it and confirm the tools became available.
