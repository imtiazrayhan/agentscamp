---
name: "Sequential Thinking MCP"
title: "Sequential Thinking MCP"
description: "The official MCP reference server for structured reasoning — a sequentialthinking tool that lets agents decompose, revise, and branch their thinking."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/modelcontextprotocol/servers"
os: ["macOS", "Windows", "Linux"]
color: "blue"
topics: ["mcp"]
audience: ["developers"]
tags: ["mcp", "reasoning", "planning", "reference-server", "thinking"]
featured: false
sameAs:
  - "https://www.npmjs.com/package/@modelcontextprotocol/server-sequential-thinking"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "command:breakdown-task", "command:plan-feature", "agent:workflow-orchestrator", "guide:building-multi-step-workflows"]
alternativeTo: ["context7", "serena"]
summary: "Sequential Thinking is one of the seven reference servers the MCP project still maintains. It exposes a single tool, sequentialthinking, that records numbered thoughts and lets the model revise earlier ones, branch into alternatives and change how many steps it expects to need. It runs locally through npx or Docker with no account and no API key."
faq:
  - q: "What does the Sequential Thinking server actually do?"
    a: "It gives the model a thinking scaffold as a tool. Each call to sequentialthinking records one thought with thoughtNumber, totalThoughts and nextThoughtNeeded, plus optional fields for revising an earlier thought (isRevision, revisesThought), branching (branchFromThought, branchId) and extending the plan (needsMoreThoughts). The server stores the history for the life of the connection; it does no reasoning of its own."
  - q: "Do I still need it now that models have extended thinking?"
    a: "Often not. Reasoning built into current frontier models covers much of the same ground without a tool call per step. The server still earns a place when you want the reasoning externalized as explicit, inspectable tool calls, when you drive models without strong native reasoning, or when one agent's reasoning trail is another agent's input."
  - q: "How do I add it to Claude Code?"
    a: "Run claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking. There is no API key and no configuration. The README requires Node.js 24 or later when the server runs through npx. Set DISABLE_THOUGHT_LOGGING=true if you do not want each thought logged to stderr."
  - q: "Is the tool called sequential_thinking or sequentialthinking?"
    a: "The README documents it as sequentialthinking, one word with no underscore. In Claude Code, with the server added under the name sequential-thinking, the full tool name is mcp__sequential-thinking__sequentialthinking, which is the string to use in permission rules."
---

Sequential Thinking is a small MCP server that does one thing: it gives the model a structured place to think. Each call to its single tool, `sequentialthinking`, records one numbered thought. The model can mark a thought as a revision of an earlier one, branch into an alternative line, or decide partway through that the problem needs more steps than it estimated.

It comes from the MCP project itself, in the `modelcontextprotocol/servers` repository, where it is one of seven reference servers still maintained (the others are Everything, Fetch, Filesystem, Git, Memory and Time). It suits people who want reasoning as visible, loggable tool calls, and anyone learning how an MCP server is put together.

## Highlights

- **One tool.** `sequentialthinking` takes `thought`, `nextThoughtNeeded`, `thoughtNumber` and `totalThoughts` on every call.
- **Revision.** `isRevision` and `revisesThought` let the model formally correct an earlier step instead of quietly contradicting it.
- **Branching.** `branchFromThought` and `branchId` explore an alternative without losing the main line.
- **Adjustable length.** `totalThoughts` is an estimate the model can change, and `needsMoreThoughts` signals that the plan has grown.
- **Bounded history.** The server keeps at most `MAX_THOUGHT_HISTORY` thoughts per connection (default `1000`) and drops the oldest past the cap.
- **No setup.** Local stdio through `npx` or the `mcp/sequentialthinking` Docker image. No account, no auth.

## In an AI-assisted workflow

```bash
claude mcp add sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking
```

For other clients:

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

You do not call the tool; the model does, repeatedly. Ask for step-by-step work on a problem that has room to change course. One of the README's own example prompts:

```text
Plan a database migration from PostgreSQL 14 to 16, list risks, and
revise the plan if downtime exceeds 5 minutes.
```

A revision call then looks like this (the thought text is illustrative):

```json
{
  "thought": "Step 3 assumed a dump and restore. At this data size that exceeds the 5-minute window, so switch to logical replication.",
  "thoughtNumber": 5,
  "totalThoughts": 8,
  "nextThoughtNeeded": true,
  "isRevision": true,
  "revisesThought": 3
}
```

To check it is working, look for repeated `sequentialthinking` calls in your client's tool activity instead of a one-shot answer. The trail reads like the working notes behind a [task breakdown](/commands/plan/breakdown-task), revisions included.

> [!NOTE]
> Models with built-in extended reasoning cover much of what this server pioneered. Its remaining value is reasoning as data: tool calls you can inspect, log and branch, or scaffolding for weaker models in a mixed fleet. It is also a clean first server to read before [building your own](/guides/advanced/building-an-mcp-server).

## Good to know

- **Reference code, not a product.** The repository README warns that its servers are "reference implementations" meant as "educational examples", "not as production-ready solutions."
- **Node.js 24 or later.** That is the stated requirement when running through `npx` or from source. Use the Docker image if your Node is older.
- **Nothing persists.** The thought history lasts as long as the client's connection. Restart the client and it is gone.
- **Thoughts are logged.** Each thought is printed to stderr as a box unless you set `DISABLE_THOUGHT_LOGGING` to `true`.
- **It adds tokens and turns.** Every thought is a tool call the model must write and the client must round-trip, so use it on planning-shaped problems, not routine edits.
- **License.** The repository is Apache-2.0 for new contributions, with existing code under MIT. The npm package is at version 2.2.0 and the repository has about 92,300 stars as of November 2026.

There is no direct competitor, since the main alternative is the model's own reasoning. For neighbouring jobs: [Taskmaster](/tools/taskmaster) turns a requirements document into dependency-ordered tasks an agent works through, which is planning you keep rather than reasoning you watch. [Serena](/tools/serena) and [Context7](/tools/context7) improve an agent's answers by giving it better information about code and libraries. For how MCP relates to agent-to-agent protocols, see [MCP vs A2A](/guides/mcp/mcp-vs-a2a).
