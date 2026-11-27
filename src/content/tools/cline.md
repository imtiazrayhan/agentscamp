---
name: "Cline"
description: "Open-source coding agent for VS Code, JetBrains, the terminal and a desktop app, with Plan and Act modes, per-step approval, and any model you bring."
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://cline.bot"
pricing: "open-source"
category: "extension"
repo: "https://github.com/cline/cline"
license: "Apache-2.0"
color: "green"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["vscode", "open-source"]
alternativeTo: ["roo-code", "kilo-code", "continue", "cursor", "claude-code"]
related: ["tool:roo-code", "tool:kilo-code", "tool:continue", "guide:ai-coding-agents-cli-2026"]
summary: "Cline is an Apache-2.0 coding agent that runs as a VS Code extension, a JetBrains plugin, a terminal CLI (npm i -g cline) and a desktop app. It plans in Plan mode, then edits files and runs commands in Act mode, asking approval at each step. The agent is free; you pay for inference through your own key, Cline's at-cost provider, or ClinePass."
faq:
  - q: "Is Cline free?"
    a: "The agent is. As of November 2026 Cline's pricing page lists the VS Code extension and CLI as free for individual developers, with inference paid separately: your own provider key, a local model, the Cline provider at cost, or ClinePass at $9.99 a month. The Enterprise plan is custom-priced and is the plan that lists the JetBrains extension, SSO and role-based access control."
  - q: "What is ClinePass?"
    a: "ClinePass is Cline's flat subscription for open-weight models. As of November 2026 it costs $9.99 a month (processing fees may apply) and covers models from Z.ai, Moonshot AI, DeepSeek, MiniMax, MiMo and Qwen, such as GLM 5.3, Kimi K3 and DeepSeek V4 Pro. It does not include Claude, GPT or Gemini; for those you use your own key or the pay-as-you-go Cline provider. Cline says the ClinePass API key also works in other coding agents."
  - q: "How do I install the Cline CLI?"
    a: "Run npm i -g cline, then run cline in a project directory for the interactive terminal UI. For scripts and CI, pass the task as an argument: cline \"Run tests and fix any failures\". Add --json for machine-readable output and --auto-approve true to skip approval prompts in a pipeline."
  - q: "Is Cline's JetBrains plugin open source?"
    a: "No. The repository's index says Cline is currently not open-sourcing its JetBrains plugins, while the SDK, CLI, VS Code extension and desktop app are in the Apache-2.0 repo. The plugin installs from the JetBrains Marketplace, and Cline's pricing page lists the JetBrains extension under the Enterprise plan."
---

Cline is an open-source coding agent from Cline Bot Inc. It started as a VS Code extension and now ships as five surfaces on one agent core: the VS Code extension, a JetBrains plugin, a terminal CLI, a desktop app, and an SDK (`@cline/sdk`) for embedding the same runtime in your own tools. The repository is Apache-2.0 and had about 72,000 GitHub stars as of November 2026; the latest release that month was v4.1.28.

It is aimed at developers who want an agent that edits files and runs commands in their own environment while they keep control of which model is used and who gets paid for it. Cline does not resell a single vendor's model: you plug in a provider key, a local runtime, or one of Cline's two paid inference options.

## Highlights

- **Plan and Act modes.** In Plan mode Cline explores the codebase, asks clarifying questions and lays out a strategy without changing anything. Switch to Act and it executes. Every file edit and terminal command needs your approval unless you turn on auto-approve.
- **Diffs and checkpoints.** In VS Code and JetBrains each edit appears as a diff you can review, modify or revert, and every change is tracked with a checkpoint so you can undo the agent's work. Cline also watches linter and compiler errors as it goes and fixes them.
- **Live terminal.** Cline runs commands in your terminal and reacts to output as it arrives, including long-running dev servers and test watchers.
- **`.clinerules` and skills.** Project rules live in `.clinerules` files in the repo and are picked up by the CLI, the VS Code extension and the JetBrains plugin. Skills let the model load specific rules only when a task needs them.
- **Any model.** Anthropic, OpenAI, Google, OpenRouter, Vercel AI Gateway, AWS Bedrock, Azure, GCP Vertex, Cerebras, Groq, Ollama, LM Studio, or any OpenAI-compatible endpoint.
- **MCP and plugins.** Connect [MCP](/glossary/model-context-protocol) servers (the CLI manages them with `cline mcp`) or register custom tools and lifecycle hooks through the SDK.
- **Beyond one chat.** The CLI adds agent teams (`--team-name`), cron schedules (`cline schedule create`), isolated git worktrees (`--worktree`), a kanban board that runs parallel agents (`cline --kanban`), and connectors that let you talk to the agent from Slack, Discord, Telegram, Google Chat, WhatsApp or Linear.

## In an AI-assisted workflow

In VS Code, install Cline from the Marketplace, pick a provider, and state a task in the panel. In a terminal:

```bash
npm i -g cline

# interactive session in the current project
cline

# one-shot and headless
cline "Add a /health endpoint to the Express server in src/ and a test for it"
git diff origin/main | cline "Review these changes for issues"
cline "Run tests and fix any failures" --json --auto-approve true
```

A good default is to start in Plan mode for anything that touches more than one file, read the plan, then switch to Act. Keep approvals on until you trust the rules you have written in `.clinerules`.

> [!WARNING]
> Auto-approve lets the agent run shell commands without asking. Use it in a container, a worktree or a CI runner, not in a checkout with credentials you care about.

## Pricing

As of November 2026, Cline's pricing page lists two plans. **Free** covers the VS Code extension, the CLI, the MCP Marketplace and multi-root workspaces for individual developers, with inference bought at cost through the Cline provider or supplied with your own key. **Enterprise** is custom-priced and adds the JetBrains extension, SSO, an SLA, centralized billing, role-based access control and the option to limit inference providers.

Inference is the real cost, and you have four ways to pay for it:

| Route | What you pay |
| --- | --- |
| Your own API key | The provider's rate, billed by the provider |
| Local model (Ollama, LM Studio) | Nothing per token; your hardware |
| Cline provider | Pay-as-you-go credits; Cline describes this as inference at cost |
| ClinePass | $9.99 a month as of November 2026, open-weight models only |

ClinePass covers models from Z.ai, Moonshot AI, DeepSeek, MiniMax, MiMo and Qwen. Cline describes its quotas as 2-5x standard API rate limits but does not publish a token figure, so treat it as a rate-limited flat plan and not an unlimited one.

## Good to know

The open-source claim has one gap: the JetBrains plugin is not in the public repo. The desktop app is the newest surface; the README describes it for macOS and Windows, and cline.bot also offers a Linux download.

Agent loops spend tokens quickly because each step resends context, so a frontier model on your own key can cost far more per task than a chat session would suggest. Cline shows usage as you go; set a provider-side spend limit before running long or scheduled tasks.

Two forks grew out of Cline. [Roo Code](/tools/roo-code) was shut down in May 2026 and its README sends users back to Cline. [Kilo Code](/tools/kilo-code) is MIT-licensed, has since been rebuilt on OpenCode, and sells its own gateway and Kilo Pass credits. If you would rather have one vendor's models and a fixed subscription, compare [Claude Code](/tools/claude-code) or [Cursor](/tools/cursor). See [Cline vs Kilo Code vs Roo Code](/guides/comparisons/cline-vs-kilo-code-vs-roo-code), [Best GitHub Copilot Alternatives](/guides/comparisons/best-github-copilot-alternatives-2026), or browse [Cline alternatives](/tools/cline/alternatives).
