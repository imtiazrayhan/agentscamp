---
name: "Claude Agent SDK"
description: "A toolkit for building custom agents on the same harness that powers Claude Code."
date: 2026-06-03
url: "https://code.claude.com/docs/en/agent-sdk"
pricing: "free"
category: "sdk"
color: "purple"
topics: ["workflow-prompting"]
tags: ["sdk", "anthropic"]
summary: "The Claude Agent SDK is a toolkit for building custom AI agents on the same harness that powers Claude Code. Official Python and TypeScript SDKs expose the core agent loop — reading files, running commands, calling tools, iterating on feedback — as a programmable library, with MCP support, configurable permissions, streaming, and multi-turn sessions."
faq:
  - q: "What is the Claude Agent SDK?"
    a: "It's a toolkit for building custom AI agents on the same agent harness that powers Claude Code. The SDK exposes the core agent loop — reading files, running shell commands, calling tools, and iterating against feedback — as a programmable Python or TypeScript library you can embed in your own applications instead of driving it through the terminal."
  - q: "Is the Claude Agent SDK free?"
    a: "The SDK is free to use, but it calls the Anthropic API and requires an API key, so usage is billed per token. Because agents can run commands and edit files, scope permissions carefully and run in sandboxed or version-controlled environments."
  - q: "How do I use the Claude Agent SDK?"
    a: "Install the official Python or TypeScript SDK and run queries — for example, iterating over query({ prompt: 'Summarize the open TODOs in this repository' }) from @anthropic-ai/claude-agent-sdk streams back messages. You define the tools and permissions, and the SDK handles the loop, so you can wire it into CI, a web backend, or a custom CLI."
---

The Claude Agent SDK is a toolkit for building custom AI agents on the same agent harness that powers Claude Code. It exposes the core agent loop — reading files, running shell commands, calling tools, and iterating against feedback — as a programmable library, so you can embed that behavior in your own applications instead of driving it through the terminal.

It is aimed at developers building agentic products: coding assistants, automation pipelines, internal developer tools, or any workflow where an agent needs to operate over a filesystem and a set of tools with minimal scaffolding.

## Highlights

- Official Python and TypeScript SDKs that wrap the Claude Code agent loop
- Built-in file operations, command execution, and tool calling
- Extensible with custom tools and Model Context Protocol (MCP) servers
- Configurable permissions and system prompts to scope what an agent can do
- Supports streaming responses and multi-turn sessions

## How it fits an AI-assisted workflow

Install the SDK and run a single-shot query:

```typescript
import { query } from "@anthropic-ai/claude-agent-sdk";

for await (const message of query({
  prompt: "Summarize the open TODOs in this repository",
})) {
  console.log(message);
}
```

Use it when you want the agent's autonomy under your own control flow — wiring it into CI, a web backend, or a custom CLI — rather than interacting through Claude Code directly. You define the tools and permissions, and the SDK handles the loop.

## Good to know

> [!NOTE]
> The SDK is free to use, but it calls the Anthropic API and requires an API key, so usage is billed per token. Because agents can run commands and edit files, scope permissions carefully and run in sandboxed or version-controlled environments.
