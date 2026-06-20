---
name: "Sequential Thinking MCP"
title: "Sequential Thinking MCP"
description: "The official MCP reference server for structured reasoning — a sequential_thinking tool that lets agents decompose, revise, and branch their thinking."
date: 2026-06-11
url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/modelcontextprotocol/servers"
os: ["macOS", "Windows", "Linux"]
color: "blue"
topics: ["mcp"]
tags: ["mcp", "reasoning", "planning", "reference-server", "thinking"]
featured: false
sameAs:
  - "https://www.npmjs.com/package/@modelcontextprotocol/server-sequential-thinking"
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "breakdown-task", "plan-feature", "workflow-orchestrator", "building-multi-step-workflows"]
alternativeTo: ["context7", "serena"]
summary: "One of the seven still-maintained official MCP reference servers, Sequential Thinking exposes a single tool — sequential_thinking — that scaffolds structured problem-solving: numbered thoughts, revisions of earlier ones, branched alternative paths, and dynamic adjustment of how many steps the problem needs. Zero config, no auth, runs locally via npx."
faq:
  - q: "What does the Sequential Thinking server actually do?"
    a: "It gives the model a thinking scaffold as a tool: each call records a numbered thought with fields for revising an earlier thought (isRevision/revisesThought), branching an alternative line (branchFromThought/branchId), and adjusting the estimated total. The structure nudges models into decompose-revise-verify behavior on multi-step problems instead of one-shot answers."
  - q: "Do I still need it now that models have extended thinking?"
    a: "Less than in 2024–25, honestly. Native extended thinking covers much of the ground for frontier models. It still earns a slot when you want thinking to be externalized and inspectable as explicit tool calls, when driving models without strong native reasoning, or in multi-agent setups where one agent's reasoning trail is another's input."
  - q: "How do I add it to Claude Code?"
    a: "claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking. No API key, no config; set DISABLE_THOUGHT_LOGGING=true if you don't want thoughts echoed to the console."
---

Sequential Thinking is the reference server that survived the great archiving — one of just seven the MCP project still maintains in `modelcontextprotocol/servers` — and a fixture of "best MCP servers" lists since the protocol launched. It does one thing: gives the model a **structured thinking scaffold** as a tool.

## Highlights

- **One tool, deliberate shape** — `sequential_thinking` records numbered thoughts with `thoughtNumber`/`totalThoughts`, so reasoning is explicit and inspectable.
- **Revision built in** — `isRevision`/`revisesThought` lets the model formally correct an earlier step instead of papering over it.
- **Branching** — `branchFromThought`/`branchId` explores alternative approaches without losing the main line.
- **Dynamic depth** — `needsMoreThoughts` adjusts the plan's length mid-flight when the problem turns out bigger than estimated.
- **Zero-friction** — local stdio via npx or Docker, no account, no auth, MIT/Apache-licensed reference code.

## In an AI-assisted workflow

```bash
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
# then:
# > Use sequential thinking to work through this migration plan —
# > revise earlier steps if later constraints invalidate them
```

You don't call the tool; the model does, iteratively. The visible win is on planning-shaped problems — the externalized trail reads like the working notes behind a [task breakdown](/commands/plan/breakdown-task), revisions included.

> [!NOTE]
> Be honest about its 2026 role: frontier models' native extended thinking covers much of what this server pioneered. It remains valuable where you want reasoning **as data** — inspectable, loggable, branchable tool calls — or as scaffolding for weaker models in a mixed fleet. It's also the cleanest first MCP server to study before [building your own](/guides/advanced/building-an-mcp-server): one tool, clear schema, reference-quality code.

## Good to know

Ships from the official `modelcontextprotocol/servers` monorepo (~87k stars) as `@modelcontextprotocol/server-sequential-thinking` on npm. License nuance: the monorepo is transitioning MIT → Apache-2.0 (older contributions stay MIT). The MCP project itself now sits under the Linux Foundation's Agentic AI Foundation — governance context that matters more than it sounds; see [MCP vs A2A](/guides/mcp/mcp-vs-a2a).
