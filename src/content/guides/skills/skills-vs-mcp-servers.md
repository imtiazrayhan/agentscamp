---
title: "Skills vs MCP Servers: When to Use Which"
description: "Skills inject procedure into context; MCP servers expose tools and live data over a protocol. A decision framework, the combine pattern, and examples."
author: "AgentsCamp"
date: 2026-06-20
color: "orange"
topics: ["workflow-prompting", "mcp"]
tags: ["skills", "mcp", "claude-code", "agents", "decision-guide"]
featured: false
summary: "Different problems, often combined. A skill injects YOUR procedure or knowledge — instructions that load into context when the task matches. An MCP server exposes new capabilities and live external data over a protocol. Need a new ability or a fresh source? MCP. Need Claude to follow your conventions? Skill. The strongest setups use both."
keyTakeaways:
  - "A skill is knowledge that loads into context on demand; an MCP server is a capability — tools, resources, and prompts exposed over a protocol the model calls."
  - "The decision: need a NEW capability or LIVE external data, build/install an MCP server. Need Claude to follow YOUR procedure or conventions, write a skill."
  - "They compose: a skill can encode the recipe for orchestrating an MCP server's tools — when to call them, in what order, and how to interpret the results."
  - "Distribution differs sharply. A skill is a folder of files you drop in; an MCP server is a running process you connect over stdio or HTTP, shipped via npm/PyPI/Docker or the MCP Registry."
  - "Skills cost almost nothing idle (only metadata loads); MCP tool definitions consume context whenever the server is connected, so connect only the servers a task needs."
faq:
  - q: "What is the difference between a Claude skill and an MCP server?"
    a: "A skill is filesystem-based knowledge: a SKILL.md file (plus optional scripts and references) that loads into the model's context when your task matches its description, shaping HOW Claude does the work. An MCP server is a running process that exposes capabilities — tools to call, resources to read, prompts to reuse — over the Model Context Protocol, giving Claude WHAT it can newly do, including reaching live external systems."
  - q: "When should I use a skill instead of an MCP server?"
    a: "Use a skill when the task needs Claude to follow your procedure, conventions, or domain knowledge using capabilities it already has — your changelog format, a migration playbook, a house code-review checklist. Use an MCP server when Claude needs a capability it lacks or data it cannot see: querying your production database, hitting an internal API, reading live tickets. If you find yourself pasting the same instructions repeatedly, that's a skill; if Claude literally cannot reach the thing, that's an MCP server."
  - q: "Can a skill use an MCP server?"
    a: "Yes, and that is the strongest pattern. The MCP server provides the raw tools and data; the skill provides the playbook for using them well — which tool to call first, how to sequence calls, what a good result looks like, and the edge cases to handle. The server is the toolbox, the skill is the instructions for the job."
  - q: "Do skills and MCP servers cost the same in context tokens?"
    a: "No. A skill's metadata (name and description) is always loaded but tiny; its full instructions enter context only when triggered, and bundled files load only when read. An MCP server's tool definitions are injected into context whenever the server is connected, whether or not you use them — so a dozen connected servers can quietly eat your window. Connect servers per task, not permanently."
  - q: "Are skills or MCP servers Claude-only?"
    a: "Neither. MCP is an open standard supported across many clients and assistants, so a server you build works beyond Claude. The Agent Skills format (a SKILL.md with name, description, and instructions) has been adopted as an open standard across multiple coding agents too. Both are portable, not locked to one vendor."
related: ["what-are-claude-skills", "skills-vs-agents-vs-commands", "writing-your-first-skill", "best-mcp-servers-2026", "building-an-mcp-server", "mcp-vs-a2a", "claude-code-skills-best-practices"]
---

Skills and MCP servers get lumped together as "ways to extend Claude," but they solve fundamentally different problems and the best setups run both. A **skill injects procedure and knowledge** — instructions that load into the model's context when the task matches. An **MCP server exposes capabilities and live data over a protocol** — tools to call, resources to read, prompts to reuse. One changes *how* Claude works; the other changes *what* Claude can do.

Get this distinction wrong and you build the wrong thing: a skill that tries to fake a database connection it can't make, or an MCP server wrapping a workflow that was really just a saved set of instructions. This guide draws the line, gives you a one-question decision framework, shows how the two combine, and covers the distribution differences that bite people in practice. (For the *Claude Code-internal* split between skills, subagents, and slash commands, see [Skills vs Agents vs Commands](/guides/skills/skills-vs-agents-vs-commands) — this guide is about skills versus the protocol layer.)

## What a skill actually is

A skill is a folder on the filesystem with a `SKILL.md` at its root: YAML frontmatter (a `name` and a `description`) plus Markdown instructions, and optionally bundled scripts and reference files. It loads through **progressive disclosure**, in three stages:

- **Metadata, always loaded.** The `name` and `description` sit in the system prompt at startup — roughly a hundred tokens per skill. This is how Claude knows the skill *exists* and when it applies, without paying for its full contents.
- **Instructions, loaded when triggered.** When your request matches the description, Claude reads the `SKILL.md` body into context. Only then do the actual steps cost tokens.
- **Resources, loaded as needed.** Bundled files (a `REFERENCE.md`, a schema, a `validate.py`) are read or executed only when the task calls for them. A script's *output* enters context; its source code never does.

The upshot: a skill is **knowledge on demand**. It doesn't give Claude new powers — it teaches Claude to use the powers it already has *your way*, only when relevant. That's why a vague description is the number-one failure mode: if Claude can't tell when the skill applies, it never loads.

## What an MCP server actually is

The [Model Context Protocol](/guides/mcp/mcp-vs-a2a) is an open JSON-RPC standard — think of it as a USB-C port for AI applications. An MCP server is a separate **running process** that, on connect, negotiates capabilities with the client and declares what it offers across three primitives:

- **Tools** — functions the model can call to *act*: run a query, create a ticket, send a message, search an index.
- **Resources** — data the client can *read*: files, database rows, documents, API responses.
- **Prompts** — reusable, parameterized prompt templates the server surfaces to the user or model.

The client (Claude Code, claude.ai, or any MCP-capable app) discovers these via `tools/list`, `resources/list`, and `prompts/list`, then issues `tools/call` when the model decides to use one. Two transports carry the same payloads: **stdio** for local processes and **Streamable HTTP** for remote servers (the older HTTP+SSE transport was deprecated in 2025).

The upshot: an MCP server gives Claude **genuinely new capabilities and live data** it could not otherwise reach. It is the bridge to your systems.

## The decision framework

Ask one question: **does the task need a new capability or live data, or does it need Claude to follow my procedure?**

| If you need... | Reach for... | Because... |
|---|---|---|
| A capability Claude lacks (call an API, query a DB, control a service) | **MCP server** | Only a tool over the protocol can *act* on an external system |
| Live external data (current tickets, prices, rows, docs) | **MCP server** | Skills are static files; they can't fetch fresh state on their own |
| Claude to follow your conventions, format, or playbook | **Skill** | It's knowledge that shapes the work, not a new power |
| A repeatable procedure using tools Claude already has | **Skill** | The capability exists; you're teaching the *method* |
| Both — a method *and* a system to act on | **Both, combined** | See below |

A blunt heuristic: if you keep **pasting the same instructions** into chats, that's a skill. If Claude **literally cannot reach the thing** you're asking about, that's an MCP server. "Format our release notes this way" is a skill. "Read our open Linear issues" is an MCP server. "Triage our open issues into release notes our way" is *both*.

## How they combine

The pattern that makes setups feel powerful: **a skill that orchestrates an MCP server's tools.** The server supplies the raw capability; the skill supplies the judgment for using it.

Say you've connected a database MCP server that exposes `run_query` and `list_tables`. On its own, Claude has the *ability* to query but no opinion about *how you do reporting*. A skill closes that gap:

```markdown
---
name: weekly-revenue-report
description: Generate the weekly revenue report. Use when asked for the
  revenue report or weekly numbers. Requires the database MCP server.
---

When asked for the weekly revenue report:
1. Call `list_tables` to confirm `orders` and `refunds` exist.
2. Query gross revenue and refunds for the last 7 full days, grouped by day.
3. Net = gross - refunds. Flag any day down >20% week-over-week.
4. Render the house table: Date | Gross | Refunds | Net | WoW%.
```

The MCP server is the **toolbox**; the skill is the **instructions for the job**. The server has no idea what your reporting conventions are, and the skill can't reach the database — together they do exactly what you want. The same shape applies to a code-review skill that drives a GitHub MCP server, or a deploy skill that orchestrates a CI server's tools. Build the capability once as a server; encode the recipe as a skill (or several).

## Distribution and cost differences

These two live in different worlds operationally, and that drives a lot of the practical choice.

**A skill is files.** You drop a folder into `.claude/skills/` (project) or `~/.claude/skills/` (personal), or upload a zip in claude.ai, or ship it through a plugin. There's nothing to run, no port, no auth — it's text and maybe a script. Sharing is git, a zip, or a registry of skills like this one. See [Writing Your First Skill](/guides/skills/writing-your-first-skill) and [Claude Code Skills Best Practices](/guides/skills/claude-code-skills-best-practices) for authoring.

**An MCP server is a process.** Someone has to run it — locally over stdio or hosted over HTTP — and it often needs credentials, network access, and a security review (an MCP server with a token to your systems is a real attack surface). Distribution rides existing package channels: npm/`npx`, PyPI/`uvx`, Docker, the DXT bundle format, and the official MCP Registry for discovery. To pick one or build your own, see [Best MCP Servers (2026)](/guides/mcp/best-mcp-servers-2026) and [Building an MCP Server](/guides/advanced/building-an-mcp-server).

The **context cost** also differs and matters at scale. A skill is nearly free until used — only its small description loads upfront. An MCP server's **tool definitions are injected whenever it's connected**, used or not, so a dozen always-on servers quietly shrink your usable context window. The discipline: keep skills plentiful (they're cheap), but connect MCP servers per task rather than wiring up everything permanently.

## The short version

A skill is **procedure and knowledge that loads when relevant**; an MCP server is **capability and live data exposed over a protocol**. Need a new ability or a fresh source — MCP. Need Claude to do something *your way* with abilities it already has — skill. When you need both, encode the system as an MCP server and the method as a skill that drives it. Cheap, on-demand know-how steering real, connected capability — that's where the leverage is.
