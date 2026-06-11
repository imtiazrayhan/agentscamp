---
name: "Cursor"
description: "An AI-first code editor built on VS Code with deep in-editor agent features, parallel agents, in-house Composer models, and a plugin marketplace."
date: 2026-06-03
updated: 2026-06-11
url: "https://cursor.com"
pricing: "freemium"
category: "ide"
color: "blue"
topics: ["coding-languages"]
tags: ["ide", "editor"]
featured: true
---

Cursor is a code editor forked from VS Code that puts AI assistance at the center of the editing experience. Because it is built on the VS Code codebase, existing extensions, themes, keybindings, and settings carry over, so the learning curve is mostly about the AI features layered on top.

It is aimed at developers who want inline completions and chat-driven edits without leaving the editor or copy-pasting between a browser and their codebase. Cursor indexes your project so the model can reference relevant files when answering or editing.

## Highlights

- **Tab completion** — multi-line, context-aware suggestions that can edit across the current file.
- **Inline edits** — select code, press the edit shortcut, and describe the change in natural language.
- **Agent mode** — a chat agent that can read, write, and run commands across multiple files to complete a task.
- **Parallel agents** — Cursor 3.0 (April 2026) rebuilt the interface agent-first: run many agents at once across repos — locally, in git worktrees, in the cloud, or over SSH — with side-by-side agent tabs.
- **Codebase context** — reference files, symbols, or docs with `@` mentions so the model grounds its answers in your code.
- **Model choice** — switch between frontier models (Anthropic, OpenAI, and others) per request, including Cursor's in-house **Composer** models tuned for fast agentic coding.
- **Plugin marketplace** — reviewed plugins (Atlassian, Datadog, GitLab, and more) extend the editor and its agents.

## In an AI-assisted workflow

Cursor fits where you already write code. A common loop is to describe a change in the chat panel, let agent mode draft edits across files, then review the diff before accepting. You can scope context explicitly:

```text
@components/Button.tsx Refactor this to accept a `variant` prop
and update all call sites in @app/.
```

> [!NOTE]
> Cursor reviews and applies edits as inline diffs you accept or reject, so the AI never silently overwrites your files.

## Good to know

Cursor is available on macOS, Windows, and Linux. The free Hobby tier includes limited AI usage; paid Individual (Pro and up) and Teams plans raise included usage and unlock premium models, with on-demand usage billed beyond the included amount. You can also supply your own API keys. Because it is a separate application rather than an extension, it runs alongside (not inside) a standard VS Code install.
