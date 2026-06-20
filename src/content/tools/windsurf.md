---
name: "Devin Desktop (formerly Windsurf)"
title: "Devin Desktop (formerly Windsurf)"
description: "An agentic IDE — formerly Windsurf, now Devin Desktop from Cognition AI — with flows that take multi-step actions across your codebase."
date: 2026-06-03
updated: 2026-06-11
url: "https://devin.ai/desktop"
pricing: "freemium"
category: "ide"
color: "cyan"
topics: ["coding-languages"]
tags: ["ide", "editor"]
alternativeTo: ["cursor", "antigravity", "void", "zed", "github-copilot"]
summary: "Devin Desktop (formerly Windsurf) is an agentic IDE built on a VS Code fork, rebranded by Cognition AI in June 2026. Its built-in Devin Local agent — which replaced Cascade — plans and executes multi-file edits, runs terminal commands, and pulls codebase-wide context; the rebrand made an Agent Command Center the default surface and added ACP support."
faq:
  - q: "What is Devin Desktop (formerly Windsurf)?"
    a: "Devin Desktop is an agentic code editor built on a fork of VS Code. Cognition AI — maker of the Devin coding agent — acquired Windsurf in 2025 and rebranded the standalone editor as Devin Desktop in June 2026 (the JetBrains plugin keeps the Windsurf name). Its built-in Devin Local agent reads, reasons about, and edits multiple files in a single flow, with codebase-wide context and MCP support."
  - q: "What happened to Cascade?"
    a: "The June 2026 rebrand replaced the original Cascade agent with Devin Local. Legacy Cascade remains usable through July 1, 2026; after that, Devin Local is the agent."
  - q: "Is Devin Desktop free?"
    a: "It's freemium: a free tier exists, and paid plans add higher usage limits and access to more capable models — Cognition says plans and pricing carried over unchanged from Windsurf. It runs on macOS, Windows, and Linux."
---

Devin Desktop (formerly Windsurf) is an agentic code editor built on a fork of VS Code. Cognition AI — maker of the Devin coding agent — acquired Windsurf in 2025 and rebranded the standalone editor as Devin Desktop in June 2026 (the JetBrains plugin keeps the Windsurf name). Its defining feature is its built-in agent — **Devin Local**, which replaced the original Cascade agent in the June 2026 rebrand — able to read, reason about, and edit multiple files in a single flow rather than completing one isolated suggestion at a time. The rebrand also made an **Agent Command Center** the default surface (the full IDE sits a click behind it) and added Agent Client Protocol (ACP) support, so compatible third-party agents can run inside the editor. It combines familiar VS Code ergonomics with deeper codebase awareness, so the agent can act on context it gathers automatically instead of relying only on the file you have open.

It is aimed at developers who want an IDE-native agent for tasks like multi-file refactors, scaffolding features, and debugging across a project, without leaving the editor or copying context between tools.

## Highlights

- **Devin Local agent** (formerly Cascade) that plans and executes multi-step edits across files, running terminal commands and applying changes you can review.
- **Tab autocomplete** that predicts edits and next actions based on recent activity.
- **Codebase-wide context** retrieval so prompts can reference the whole project, not just open buffers.
- **MCP support** for connecting external tools and data sources.
- **VS Code compatibility**, including settings, keybindings, and most extensions.

## How it fits an AI-assisted workflow

A typical loop is to describe a change in natural language, let Devin Local propose edits across the relevant files, then review and accept or reject each diff. You can keep iterating in the same conversation as the agent runs commands and reacts to output.

```bash
# Open the current project in Windsurf from the terminal
windsurf .
```

> [!NOTE]
> The agent can run terminal commands and modify files. Review proposed diffs before accepting, especially in repositories with production or shared code.

## Good to know

Devin Desktop is freemium: a free tier exists, with paid plans adding higher usage limits and access to more capable models — Cognition says plans and pricing carried over unchanged from Windsurf. It runs on macOS, Windows, and Linux. Legacy Cascade remains usable through July 1, 2026; after that, Devin Local is the agent. Because it is a separate editor rather than an extension, adopting it means switching IDEs rather than adding to an existing one.
