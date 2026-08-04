---
title: "Building Agents with the Claude Agent SDK"
description: "A working tutorial for the Claude Agent SDK in TypeScript and Python — query(), tool permissions, custom in-process MCP tools, subagents, hooks, and auth."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["workflow-prompting"]
tags: ["claude-agent-sdk", "claude-code", "agents", "sdk", "typescript", "python"]
featured: true
summary: "The Claude Agent SDK is Claude Code as a library: npm install @anthropic-ai/claude-agent-sdk or pip install claude-agent-sdk, call query() with a prompt and options, and you get the full agent loop — file tools, command execution, permissions, MCP, subagents, hooks — streaming back as messages. It's the production path from 'Claude Code works for this' to 'this is a product.'"
keyTakeaways:
  - "The SDK is the same engine as Claude Code — tools, agent loop, context management, permissions — exposed as a TypeScript/Python library instead of a terminal UI."
  - "The core API is one function: query(prompt, options) returning an async iterator of messages; options carry allowedTools, permissionMode, mcpServers, agents, hooks, maxTurns."
  - "Custom tools are in-process MCP servers: define them with tool() + createSdkMcpServer() (zod-typed in TS) — no separate server process to run."
  - "Subagents and hooks work in the SDK exactly as in Claude Code, so patterns you proved interactively port straight into your application."
  - "Auth is ANTHROPIC_API_KEY (or Bedrock/Vertex env switches); on subscription plans, SDK/headless usage currently still draws from your normal plan limits — Anthropic announced a separate Agent SDK credit for June 15, 2026 but paused it, so check the current policy before you rely on either model."
howtoSteps:
  - name: "Install the SDK"
    text: "TypeScript: npm install @anthropic-ai/claude-agent-sdk (bundles the agent binary). Python: pip install claude-agent-sdk, which requires Python 3.10+."
  - name: "Authenticate"
    text: "Export ANTHROPIC_API_KEY for the Claude API, or flip a provider switch instead: CLAUDE_CODE_USE_BEDROCK=1 with AWS credentials, or CLAUDE_CODE_USE_VERTEX=1 with GCP credentials."
  - name: "Run your first query"
    text: "Call query() with a prompt and iterate the returned messages; the message carrying a result field is the final answer. This is the whole loop — the SDK handles tool calls, retries, and context."
  - name: "Scope what the agent may do"
    text: "Pass options: allowedTools (e.g. [\"Read\", \"Edit\", \"Bash\"]), permissionMode, and maxTurns. The same permission model as Claude Code applies — default-deny what you didn't grant."
  - name: "Add a custom tool"
    text: "Define tools in-process with tool(name, description, schema, handler) and bundle them with createSdkMcpServer(); pass the server in options.mcpServers. Your function becomes a tool the agent can call, with typed, validated inputs."
  - name: "Compose subagents and hooks"
    text: "Define specialists in options.agents (description, prompt, tools) and let the lead agent delegate; attach hooks (PreToolUse, PostToolUse, Stop) for deterministic guardrails around the loop."
faq:
  - q: "What is the Claude Agent SDK?"
    a: "It's Claude Code packaged as a library for TypeScript and Python. You get the same agent loop, built-in tools (Read, Edit, Bash, web), permission system, MCP support, subagents, and hooks — driven programmatically via a query() function instead of a terminal. It was renamed from the 'Claude Code SDK' as it generalized beyond coding into building any agent."
  - q: "Claude Agent SDK vs the Claude API — which do I use?"
    a: "The raw Claude API gives you a model; you build the agent loop, tools, and context management yourself. The Agent SDK gives you the loop Anthropic already hardened in Claude Code — tool execution, permissions, compaction, subagents — so you write the task and the integration, not the harness. Use the raw API for bespoke architectures; use the SDK when you want a working agent fast."
  - q: "Does the Agent SDK work with Python?"
    a: "Yes — pip install claude-agent-sdk (Python 3.10+). The Python package mirrors the TypeScript API: an async query() iterator with ClaudeAgentOptions for tools, permissions, MCP servers, and subagents."
  - q: "How do I add custom tools to an SDK agent?"
    a: "Through in-process MCP: define each tool with the tool() helper (name, description, a zod schema in TypeScript, and an async handler), group them with createSdkMcpServer(), and pass it via options.mcpServers. No separate server process — your application functions become agent tools."
  - q: "How is SDK usage billed?"
    a: "Via the API (per token) when authenticated with an API key, or through Bedrock/Vertex on those platforms. On Claude subscription plans, Agent SDK and claude -p usage currently still draws from your normal plan limits — Anthropic announced a separate monthly Agent SDK credit for June 15, 2026 but paused it before it took effect, so verify the current policy."
related: ["tool:claude-agent-sdk", "guide:claude-code-ci-github-actions", "guide:agent-frameworks-2026", "guide:writing-a-custom-agent", "agent:agent-reliability-reviewer", "tool:openai-agents-sdk", "guide:production-tool-calling", "tool:claude-code"]
---

At some point "Claude Code handles this perfectly in my terminal" wants to become "this runs in my product / pipeline / Slack bot." The **Claude Agent SDK** is that path: the same engine — agent loop, built-in tools, permissions, MCP, subagents, hooks — as a TypeScript/Python library. You stop driving the agent and start shipping it.

## First agent in ten lines

**TypeScript:**

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Find and fix the bug in auth.ts",
  options: { allowedTools: ["Read", "Edit", "Bash"] },
})) {
  if ("result" in message) console.log(message.result);
}
```

**Python:**

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    async for message in query(
        prompt="Find and fix the bug in auth.py",
        options=ClaudeAgentOptions(allowed_tools=["Read", "Edit", "Bash"]),
    ):
        if hasattr(message, "result"):
            print(message.result)

asyncio.run(main())
```

Install with `npm install @anthropic-ai/claude-agent-sdk` (the package bundles the agent binary) or `pip install claude-agent-sdk` (Python 3.10+), export `ANTHROPIC_API_KEY`, and that code **runs the full loop**: the model plans, calls tools, reads their results, edits files, runs commands, and iterates — streaming every step back as messages you can render, log, or gate.

## The options that matter

`query()` takes one options object; these carry most real applications:

| Option | What it does |
| --- | --- |
| `allowedTools` / `disallowedTools` | The permission boundary — grant exactly what the task needs |
| `permissionMode` | `default`, `acceptEdits`, `plan`, `bypassPermissions` — same dial as Claude Code |
| `maxTurns` | Circuit breaker for runaway loops |
| `model` | Pin the model per agent |
| `systemPrompt` | Replace or extend the agent's instructions |
| `mcpServers` | External *and* in-process tool servers (below) |
| `agents` | Subagent definitions the lead agent can delegate to |
| `hooks` | Deterministic callbacks around the loop (below) |

Treat `allowedTools` + `maxTurns` as non-optional in production — they're the difference between an agent and an unbounded process with your credentials. The [permission semantics](/guides/configuration/claude-code-settings-permissions) are identical to Claude Code's.

## Custom tools without a server process

The SDK's best trick: your application functions become agent tools via **in-process MCP** — no separate server to deploy.

```typescript
import { query, tool, createSdkMcpServer } from "@anthropic-ai/claude-agent-sdk";
import { z } from "zod";

const lookupOrder = tool(
  "lookup_order",
  "Look up an order by ID in our database",
  { orderId: z.string() },
  async ({ orderId }) => ({
    content: [{ type: "text", text: JSON.stringify(await db.orders.find(orderId)) }],
  })
);

const server = createSdkMcpServer({ name: "shop-tools", version: "1.0.0", tools: [lookupOrder] });

for await (const message of query({
  prompt: "Why did order #4127 fail to ship?",
  options: {
    mcpServers: { "shop-tools": { type: "sdk", name: "shop-tools", instance: server.instance } },
    allowedTools: ["mcp__shop-tools__lookup_order"],
  },
})) { /* ... */ }
```

Inputs are schema-validated before your handler runs, and the tool participates in permissions under its `mcp__server__tool` name. External MCP servers (the [same ecosystem Claude Code uses](/guides/mcp/claude-code-mcp-setup)) plug into the same `mcpServers` option.

## Subagents and hooks: the patterns port over

Everything you've learned composing Claude Code carries into the SDK. **Subagents** keep big tasks coherent — define specialists and let the lead delegate:

```typescript
options: {
  allowedTools: ["Read", "Glob", "Grep", "Agent"],
  agents: {
    "code-reviewer": {
      description: "Expert code reviewer",
      prompt: "Analyze code quality and suggest improvements.",
      tools: ["Read", "Glob", "Grep"],
    },
  },
}
```

**Hooks** add the deterministic layer — a `PreToolUse` hook that blocks writes outside a sandbox directory, a `PostToolUse` hook that logs every command for audit. In the SDK they're plain callbacks in `options.hooks`, same events and semantics as [Claude Code hooks](/guides/configuration/claude-code-hooks).

## Production notes

- **Auth:** `ANTHROPIC_API_KEY` for the Claude API; `CLAUDE_CODE_USE_BEDROCK=1` or `CLAUDE_CODE_USE_VERTEX=1` to run on AWS/GCP with their credential chains. Consumer claude.ai logins aren't a thing here — this is the API surface.
- **Billing:** API usage is per-token. If your team is on Claude subscription plans, note that Anthropic announced a separate monthly Agent SDK credit for SDK and `claude -p` usage (planned for June 15, 2026) but **paused** it before it took effect — for now that usage still meters against your normal plan limits, so check the current policy before you budget.
- **Where it sits in the landscape:** against [LangGraph, CrewAI, and the OpenAI Agents SDK](/guides/concepts/agent-frameworks-2026), the Claude Agent SDK's pitch is the *harness*: you inherit a battle-tested tool-execution loop, permission system, and context management instead of assembling them. The trade is the same as [Claude Code's](/tools/claude-code) — it runs Anthropic's models, tuned for them.

Start with the smallest version of your agent that does real work — one `query()`, three tools, `maxTurns: 10` — and grow it the way you'd grow a Claude Code workflow: add a custom tool when the model needs your data, a subagent when one context stops being enough, a hook when a rule must hold every time. For making the result *reliable*, the [production tool-calling guide](/guides/concepts/production-tool-calling) and the [agent-reliability-reviewer](/agents/meta-orchestration/agent-reliability-reviewer) pick up where this tutorial ends.
