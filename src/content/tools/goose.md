---
name: "Goose"
description: "Block's open-source, on-machine AI agent that is MCP-native and model-agnostic, with a CLI and desktop app."
date: 2026-06-03
url: "https://goose-docs.ai/"
pricing: "open-source"
category: "agent"
repo: "https://github.com/aaif-goose/goose"
color: "cyan"
topics: ["workflow-prompting", "coding-languages"]
tags: ["agent", "open-source", "mcp"]
related: ["claude-code", "aider", "codex-cli"]
featured: false
alternativeTo: ["claude-code", "aider", "codex-cli", "opencode", "amp"]
summary: "Goose is an open-source (Apache-2.0), general-purpose AI agent that runs entirely on your machine — it executes shell commands, edits files, runs tests, and chains multi-step tasks. MCP-native with 70+ documented extensions and model-agnostic across 15+ providers including local models, it ships as a Rust CLI and a desktop app for macOS, Linux, and Windows."
faq:
  - q: "What is Goose?"
    a: "Goose is an open-source, general-purpose AI agent that runs entirely on your machine. Originally built by Block and written in Rust, it goes beyond code suggestions: it executes shell commands, edits files, runs tests, and orchestrates multi-step tasks autonomously. Stewardship has since moved to the Agentic AI Foundation (AAIF) under the Linux Foundation."
  - q: "Is Goose free?"
    a: "Yes — Goose is free and open source under Apache-2.0. You supply your own model API key or run a local model (it works with 15+ providers including Anthropic, OpenAI, Google, Ollama, OpenRouter, Azure, and Bedrock), so usage cost depends on the provider and model you choose."
  - q: "How do I use Goose?"
    a: "Run goose configure to pick a provider and model, then goose session for an interactive agent session — or goose run -t 'your task' for scripted, repeatable runs. Connect MCP extensions (a database, a browser, your issue tracker) and the same agent can reach across tools to complete a task end to end, then hand you the diffs."
---

Goose is an open-source, general-purpose AI agent that runs entirely on your machine. Originally built by Block and written in Rust, it goes beyond code suggestions: it executes shell commands, edits files, runs tests, and orchestrates multi-step tasks autonomously. Because it is on-machine, your code and credentials stay local — Goose only talks to whichever model provider you point it at.

It is aimed at developers and power users who want an agent they fully control rather than a hosted black box. You bring your own LLM and extend its capabilities through the Model Context Protocol, so the same agent can write code, query a database, or automate a research workflow depending on the extensions you connect.

## Highlights

- **MCP-native** — connect to 70+ documented extensions over the Model Context Protocol to add tools, data sources, and integrations to the agent.
- **Model-agnostic** — works with 15+ providers including Anthropic, OpenAI, Google, Ollama, OpenRouter, Azure, and Bedrock, including local models.
- **Two interfaces** — a native desktop app for macOS, Linux, and Windows, plus a full CLI for terminal and headless/scripted runs.
- **Beyond code** — runs commands, edits files, executes code, and chains multi-step workflows for research, automation, and data analysis, not just coding.
- **On-machine and private** — the agent runs locally; only model calls leave your machine, so credentials and source stay under your control.
- **Built in Rust** — fast startup and a single portable binary, with an API for embedding Goose into your own tools.

## In an AI-assisted workflow

Goose fits where you want autonomy without giving up control of the model or the machine. Configure a provider once, then drive it from the terminal for scripted, repeatable tasks:

```bash
goose configure        # pick a provider and model
goose session          # start an interactive agent session
goose run -t "Add a /health endpoint to the Express app in src/ and write a test"
```

Connect MCP extensions (a database, a browser, your issue tracker) and the same agent can reach across tools to complete a task end to end, then hand you the diffs.

> [!TIP]
> Because Goose is provider-agnostic, you can point it at a local model via Ollama for offline or privacy-sensitive work, then switch to a frontier API for harder tasks — without changing your workflow.

## Good to know

Goose is free and open source under the Apache-2.0 license. You supply your own model API key (or run a local model), so usage cost depends on the provider and model you choose. The desktop app and CLI are available for macOS, Linux, and Windows.

> [!NOTE]
> Stewardship of Goose has moved to the Agentic AI Foundation (AAIF) under the Linux Foundation. The canonical repository is now `aaif-goose/goose`; the old `block/goose` URL redirects there. The project is community-governed rather than Block-only.
