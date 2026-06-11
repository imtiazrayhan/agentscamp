---
title: "Building an MCP Server"
description: "An accurate introduction to the Model Context Protocol: server anatomy, transports, and connecting a tool to Claude Code."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["mcp", "architecture"]
related: ["building-multi-step-workflows", "claude-agent-sdk"]
featured: false
---

A model is only as capable as the things it can reach. Out of the box it can reason about your prompt, but it can't query your database, hit your internal API, or read the ticket you're describing. The **Model Context Protocol (MCP)** is the open standard that closes that gap: instead of hard-wiring every integration into every client, you write one server that exposes capabilities, and any MCP-compatible client — Claude Code, the Claude desktop app, IDE plugins — can use it. Write the integration once, plug it in everywhere.

This guide covers what MCP actually is, the three things a server exposes, the two transports you'll choose between, a conceptual walkthrough of exposing a single tool, and how to wire it into Claude Code. It stays framework-neutral — the official SDKs (TypeScript, Python, and others) differ in syntax, but the shape is identical.

## What MCP is

MCP is a client–server protocol. An **MCP client** lives inside the model's host application (Claude Code is a client). An **MCP server** is a separate process you write that advertises a set of capabilities. The two speak JSON-RPC 2.0 over a transport, performing a capability handshake on connect so the client learns exactly what the server offers.

The design goal is decoupling. Before MCP, every tool integration was bespoke glue between one model app and one service. MCP replaces that N×M problem with a single interface: your server doesn't know or care which client connects, and the client doesn't know how your server is implemented. That's what makes a server you build for yourself trivially shareable with anyone else running an MCP client.

> [!NOTE]
> MCP is an open specification, not an Anthropic-only feature. Servers you write work with any compliant client. The spec is versioned by date — each release is a date stamp — and the SDK handles version negotiation for you.

## Server anatomy: tools, resources, prompts

A server exposes capabilities in three distinct flavors. Knowing which one fits a given capability is the main design decision you'll make.

| Primitive | What it is | Who triggers it | Example |
|-----------|------------|-----------------|---------|
| **Tool** | A function the model can call, with typed inputs and a result | The model, autonomously | `search_issues(query)`, `run_query(sql)` |
| **Resource** | Read-only data identified by a URI | The client/app (loaded into context) | `file:///logs/today.txt`, `db://schema` |
| **Prompt** | A reusable, parameterized prompt template | The user, explicitly | A `/summarize-pr` template surfaced as a command |

The distinction is about **who is in control**:

- **Tools are model-controlled.** The model decides when to call them based on the task. This is the workhorse primitive and where you'll spend most of your effort. Tools can have side effects — creating a record, sending a request.
- **Resources are application-controlled.** They expose data for the host to pull into context, like attaching a file. A resource is addressed by a URI and should be read-only — no side effects.
- **Prompts are user-controlled.** They're templates the user invokes deliberately, often surfaced as slash commands in the client.

> [!TIP]
> When in doubt, reach for a **tool** — it's the primitive every client supports best and the one the model can use without help. Use resources when the host needs to *attach* data to context, and prompts when *you* want to hand users a canned, parameterized workflow.

## Transports: stdio vs. HTTP

A server has to talk to the client over some channel. MCP defines two standard transports, and the choice is mostly about where the server runs.

**stdio** — The client launches your server as a child process and exchanges JSON-RPC messages over stdin/stdout. This is the default for local servers: there are no ports, no auth, and no network. The server's lifecycle is tied to the client. Reach for stdio for anything that runs on the same machine as the user — a wrapper around local files, git, or a CLI.

**Streamable HTTP** — The server runs as an independent HTTP service the client connects to over the network, with streaming for server-initiated messages. Use it for remote servers, anything shared by multiple users, or a capability you deploy centrally. Because it's network-exposed, **you own authentication and authorization** — MCP supports OAuth-based auth for this case.

| Pick | When |
|------|------|
| **stdio** | Local-only, single user, accesses the user's machine, simplest setup |
| **Streamable HTTP** | Remote/hosted, shared across users, needs auth, deployed once and reused |

> [!WARNING]
> An HTTP MCP server is a network service exposing tools that may have side effects. Treat it like any public API: require authentication, validate every input, scope what each token can do, and never trust the model to stay inside the lines on its own. The transport gives you no security for free.

## Exposing a tool: the conceptual shape

Every tool you register has the same three parts, regardless of SDK: a **name**, a **schema** describing its inputs, and a **handler** that runs when the model calls it. The SDK serializes your schema into the JSON Schema the client advertises to the model, and routes incoming calls to your handler.

Here's the shape in pseudo-code — read it for structure, not exact API:

```text
server.tool(
  name:        "get_weather",
  description: "Get the current weather for a city. Returns
                temperature in Celsius and a short conditions summary.",
  input_schema: {
    city:  string  (required) — "City name, e.g. 'Lisbon'",
    units: enum["c", "f"] (optional, default "c"),
  },
  handler: async ({ city, units }) => {
    const data = await fetchWeather(city, units);
    return text(`${data.temp}° — ${data.conditions}`);
  },
)
```

The pieces that matter:

- **`name`** is the identifier the model uses to call the tool. Make it a clear verb-object: `create_issue`, `search_docs`, `run_query`.
- **`description`** is read by the model to decide *whether and when* to call the tool. This is your routing signal — vague descriptions mean the tool sits unused or gets misused.
- **`input_schema`** is a typed contract. Describe each field; the model fills it from the schema, so good field descriptions reduce malformed calls.
- **`handler`** does the work and returns a result. Keep results concise and in a form the model can act on — usually a short text block, sometimes structured content.

A real server registers several such tools, plus any resources and prompts, then starts listening on its transport. That's the whole job.

## Connecting it to Claude Code

Once your server runs, register it with the `claude mcp add` command. The exact form depends on transport.

For a **local stdio** server, give the command Claude Code should launch:

```bash
claude mcp add weather -- node /path/to/weather-server/index.js
```

Everything after `--` is the command and its arguments. Claude Code spawns that process and speaks MCP over its stdio. Pass environment variables the server needs with `--env`. All options (`--transport`, `--env`, `--scope`, `--header`) must come *before* the server name, or the CLI consumes the name as part of the option's value:

```bash
claude mcp add --env GITHUB_TOKEN=ghp_xxx github -- node ./github-server.js
```

For a **remote HTTP** server, give the URL and transport:

```bash
claude mcp add --transport http linear https://mcp.linear.app/mcp
```

By default a server is added at the local (per-project) scope. Use `--scope user` to make it available across all your projects, or `--scope project` to commit it to a shared `.mcp.json` your team checks in. The first time a teammate uses a project-scoped server from `.mcp.json`, Claude Code prompts them to approve it before its tools become available; running `claude mcp reset-project-choices` clears those approval choices. Useful management commands:

```bash
claude mcp list              # show configured servers and connection status
claude mcp get weather       # inspect one server's config
claude mcp remove weather    # unregister it
```

> [!NOTE]
> Inside a Claude Code session, type `/mcp` to see live connection status, the tools each server exposes, and authentication prompts for servers that need OAuth. It's the fastest way to confirm a new server actually connected and to see what the model can now call.

Once connected, the server's tools appear to the model namespaced as `mcp__<server>__<tool>` — for example `mcp__weather__get_weather`. You generally don't type those; the model calls them, and you can reference a server's capabilities in plain language.

## Design tips that make a server worth using

A working server and a *good* server are different things. The difference is almost entirely in how you name and shape what you expose.

- **Name tools for what they do, not how they're built.** `search_issues` beats `query_jira_api_v2`. The model matches intent against the name; leak no implementation detail.
- **Write descriptions as routing signals.** State what the tool does, what it returns, and when to use it. If two tools overlap, say how they differ — that's what stops the model from picking the wrong one.
- **Return concise, model-ready results.** Don't dump a 5,000-line JSON blob; the model has to read every token and it eats context. Filter to the fields that matter, summarize, and paginate large result sets behind a `limit` parameter.
- **Make inputs strict and well-described.** Required vs. optional, enums over free strings where you can, a one-line description per field. A tight schema means fewer malformed calls to handle.
- **Keep tools focused.** One tool, one job — same discipline as a good subagent. A do-everything `manage_resource(action, ...)` tool is harder for the model to call correctly than three clear ones.
- **Fail with useful errors.** When a call can't succeed, return a short message the model can act on ("issue not found — check the ID") rather than a raw stack trace.

> [!TIP]
> Test your descriptions by reading only your tool list — names and one-liners, nothing else — and asking whether *you* could pick the right tool for a task. If you can't, the model can't either. That single read-through catches most routing problems before they reach a user.

## Putting it together

MCP turns "give the model a new capability" into a repeatable act: write a server, expose tools (and resources and prompts where they fit), pick stdio for local or Streamable HTTP for remote, and register it with `claude mcp add`. The protocol handles discovery and transport; your job is to expose a small set of sharply named, well-described, concise-returning capabilities. Start with one tool that solves one real annoyance, confirm it with `/mcp`, and grow from there — the same server now works in every MCP client you touch.
