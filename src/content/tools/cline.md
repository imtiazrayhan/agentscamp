---
name: "Cline"
description: "An open-source autonomous coding agent for VS Code."
url: "https://cline.bot"
pricing: "open-source"
category: "extension"
repo: "https://github.com/cline/cline"
color: "green"
topics: ["coding-languages"]
tags: ["vscode", "open-source"]
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
