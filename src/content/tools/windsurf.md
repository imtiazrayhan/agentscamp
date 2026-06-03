---
name: "Devin Desktop (formerly Windsurf)"
title: "Devin Desktop (formerly Windsurf)"
description: "An agentic IDE — formerly Windsurf, now Devin Desktop from Cognition AI — with flows that take multi-step actions across your codebase."
date: 2026-06-03
url: "https://devin.ai/desktop"
pricing: "freemium"
category: "ide"
color: "cyan"
topics: ["coding-languages"]
tags: ["ide", "editor"]
---

Devin Desktop (formerly Windsurf) is an agentic code editor built on a fork of VS Code. Cognition AI — maker of the Devin coding agent — acquired Windsurf in 2025 and rebranded the standalone editor as Devin Desktop in June 2026 (the JetBrains plugin keeps the Windsurf name). Its defining feature is Cascade, an AI agent that can read, reason about, and edit multiple files in a single flow rather than completing one isolated suggestion at a time. The editor combines familiar VS Code ergonomics with deeper codebase awareness, so the assistant can act on context it gathers automatically instead of relying only on the file you have open.

It is aimed at developers who want an IDE-native agent for tasks like multi-file refactors, scaffolding features, and debugging across a project, without leaving the editor or copying context between tools.

## Highlights

- **Cascade agent** that plans and executes multi-step edits across files, running terminal commands and applying changes you can review.
- **Tab autocomplete** that predicts edits and next actions based on recent activity.
- **Codebase-wide context** retrieval so prompts can reference the whole project, not just open buffers.
- **MCP support** for connecting external tools and data sources.
- **VS Code compatibility**, including settings, keybindings, and most extensions.

## How it fits an AI-assisted workflow

A typical loop is to describe a change in natural language, let Cascade propose edits across the relevant files, then review and accept or reject each diff. You can keep iterating in the same conversation as the agent runs commands and reacts to output.

```bash
# Open the current project in Windsurf from the terminal
windsurf .
```

> [!NOTE]
> Cascade can run terminal commands and modify files. Review proposed diffs before accepting, especially in repositories with production or shared code.

## Good to know

Windsurf is freemium: a free tier exists, with paid plans adding higher usage limits and access to more capable models. It runs on macOS, Windows, and Linux. Because it is a separate editor rather than an extension, adopting it means switching IDEs rather than adding to an existing one.
