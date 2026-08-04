---
name: "Cline"
description: "Open-source autonomous coding agent for VS Code that plans, edits files, and runs commands with diff approval, using any model you bring or a local runtime."
date: 2026-06-03
url: "https://cline.bot"
pricing: "open-source"
category: "extension"
repo: "https://github.com/cline/cline"
color: "green"
topics: ["coding-languages"]
tags: ["vscode", "open-source"]
alternativeTo: ["roo-code", "kilo-code", "continue", "cursor", "claude-code"]
related: ["tool:roo-code", "tool:kilo-code", "tool:continue", "guide:ai-coding-agents-cli-2026"]
summary: "Cline is an open-source autonomous coding agent that runs as a VS Code extension, with a JetBrains plugin and terminal CLI as well. Describe a goal and it plans, edits files, and runs commands, showing every change as a diff you approve before it executes. Bring your own model: Anthropic, OpenAI, OpenRouter, Google, Bedrock, or local runtimes like Ollama."
faq:
  - q: "What is Cline?"
    a: "Cline is an open-source autonomous coding agent that runs as a Visual Studio Code extension. It adds a chat-driven agent to your editor that reads your codebase, writes and edits files, and executes terminal commands to complete multi-step tasks — with every file change and command shown for review and approval before it runs."
  - q: "Is Cline free?"
    a: "Yes, Cline is free and open source under Apache-2.0. It does not include model inference, though — you supply your own API key (Anthropic, OpenAI, OpenRouter, Google, AWS Bedrock, and others) or point it at a local model via Ollama or LM Studio, so costs depend on the provider you connect."
  - q: "How do I install Cline?"
    a: "Install it from the VS Code Marketplace and add a provider key, then open the Cline panel and state a task. Cline proposes edits and commands, and you approve each before it executes. It's also available as a JetBrains plugin and a terminal CLI for headless or scripted runs."
---

Cline is an open-source autonomous coding agent that runs as a Visual Studio Code extension. Rather than living in a separate application, it adds a chat-driven agent to the editor you already use, where it can read your codebase, write and edit files, and execute terminal commands to complete multi-step tasks.

It is aimed at developers who want agentic coding inside VS Code while keeping control over which model they use. Cline is provider-agnostic: you supply your own API key (Anthropic, OpenAI, OpenRouter, Google, AWS Bedrock, and others) or point it at a local model, so cost and data handling stay in your hands.

## Highlights

- **Agentic task loop** — describe a goal and Cline plans, edits files, and runs commands to reach it, step by step.
- **Human-in-the-loop approvals** — every file change and command can be reviewed and approved before it executes.
- **Bring your own model** — works with many API providers and local runtimes (Ollama, LM Studio) via your own keys.
- **MCP support** — connect Model Context Protocol servers to extend the agent with custom tools and data sources.
- **Diff-based edits** — changes are shown as diffs in the editor so you can inspect them before accepting.
- **Beyond VS Code** — also available as a JetBrains plugin and a terminal CLI for headless/scripted runs.

## In an AI-assisted workflow

Install it from the VS Code Marketplace and add a provider key, then open the Cline panel and state a task:

```text
Add a /health endpoint to the Express server in src/ that returns
{ status: "ok" } and write a test for it.
```

Cline proposes edits and commands; you approve each before it runs.

> [!NOTE]
> Cline does not include model inference — you pay your chosen provider directly for token usage.

## Good to know

Cline is free and open source (Apache-2.0). It requires VS Code and an external model provider, so usage costs depend on the API or local hardware you connect.
