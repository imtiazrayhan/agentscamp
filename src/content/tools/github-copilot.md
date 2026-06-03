---
name: "GitHub Copilot"
description: "GitHub’s AI pair programmer with inline completions and an agent mode."
date: 2026-06-03
url: "https://github.com/features/copilot"
pricing: "paid"
category: "extension"
color: "blue"
topics: ["coding-languages"]
tags: ["vscode", "github"]
---

GitHub Copilot is an AI coding assistant that integrates directly into the editor to suggest code as you type. Built on large language models trained on public code, it offers inline completions, a chat interface, and an autonomous agent mode that can plan and apply multi-file changes. It is aimed at individual developers, teams, and enterprises who want AI assistance without leaving their existing tooling.

Copilot works across many languages and frameworks, with the strongest results in widely-used ecosystems such as JavaScript, TypeScript, Python, Go, and Java.

## Highlights

- **Inline completions** — context-aware single-line and multi-line suggestions as you type.
- **Copilot Chat** — ask questions, explain code, generate tests, and refactor in a side panel.
- **Agent mode** — delegate tasks where Copilot edits multiple files, runs commands, and iterates.
- **Editor support** — VS Code, Visual Studio, JetBrains IDEs, Neovim, and the GitHub web UI.
- **Model choice** — switch between several underlying models depending on plan and task.

## Where it fits

Copilot suits a tight inner-loop workflow: accept completions for boilerplate, use chat for targeted edits, and hand off larger refactors to agent mode while you review the diff.

```bash
# Install the GitHub Copilot CLI, then start an interactive session
npm install -g @github/copilot   # or: brew install copilot-cli
copilot
```

> [!NOTE]
> Treat suggestions as drafts. Always review generated code for correctness, security, and licensing before committing.

## Good to know

Copilot is a paid subscription (with a limited free tier and free access for verified students and maintainers of popular open-source projects). It requires a GitHub account and a supported editor. Suggestion quality and available models vary by plan, and an internet connection is required.
