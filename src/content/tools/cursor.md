---
name: "Cursor"
description: "An AI-first code editor built on VS Code with deep in-editor agent features."
date: 2026-06-03
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
- **Codebase context** — reference files, symbols, or docs with `@` mentions so the model grounds its answers in your code.
- **Model choice** — switch between frontier models (Anthropic, OpenAI, and others) per request.

## In an AI-assisted workflow

Cursor fits where you already write code. A common loop is to describe a change in the chat panel, let agent mode draft edits across files, then review the diff before accepting. You can scope context explicitly:

```text
@components/Button.tsx Refactor this to accept a `variant` prop
and update all call sites in @app/.
```

> [!NOTE]
> Cursor reviews and applies edits as inline diffs you accept or reject, so the AI never silently overwrites your files.

## Good to know

Cursor is available on macOS, Windows, and Linux. The free Hobby tier includes limited AI usage; paid Pro and Teams plans raise request limits and unlock premium models. You can also supply your own API keys. Because it is a separate application rather than an extension, it runs alongside (not inside) a standard VS Code install.
