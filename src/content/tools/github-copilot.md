---
name: "GitHub Copilot"
description: "GitHub’s AI pair programmer with inline completions and an agent mode."
seoDescription: "GitHub Copilot is GitHub's AI pair programmer with inline completions, chat, and an agent mode — features, pricing tiers, and closest alternatives."
date: 2026-06-03
updated: "2026-09-11"
url: "https://github.com/features/copilot"
pricing: "freemium"
category: "extension"
color: "blue"
topics: ["coding-languages"]
tags: ["vscode", "github"]
alternativeTo: ["cursor", "windsurf", "cody", "continue", "tabnine"]
summary: "GitHub Copilot is GitHub's AI coding assistant: inline completions as you type, Copilot Chat for questions, tests, and refactors, and an agent mode that plans and applies multi-file changes. It works in VS Code, Visual Studio, JetBrains IDEs, Neovim, and the GitHub web UI. Freemium: a Free plan, with paid tiers billed in GitHub AI Credits since June 2026."
faq:
  - q: "What is GitHub Copilot?"
    a: "GitHub Copilot is an AI coding assistant that integrates directly into the editor to suggest code as you type. Built on large language models trained on public code, it offers inline completions, a chat interface for explaining code and generating tests, and an autonomous agent mode that can plan and apply multi-file changes."
  - q: "Is GitHub Copilot free?"
    a: "Yes, within limits. As of September 2026, Copilot Free costs $0 and includes 2,000 completions a month plus an allowance of GitHub AI Credits. Paid plans run from Pro at $10/user/month through Pro+ at $39 and Max at $100; since June 1, 2026 their chat, agent, and CLI usage draws on GitHub AI Credits, while completions stay unlimited. Verified students get a free Student plan, and verified teachers and maintainers of popular open-source projects may qualify for free Pro."
  - q: "How do I install GitHub Copilot?"
    a: "For the terminal, install the Copilot CLI with curl -fsSL https://gh.io/copilot-install | bash (or brew install --cask copilot-cli, or winget install GitHub.Copilot on Windows) and start an interactive session with copilot. In the editor, Copilot supports VS Code, Visual Studio, JetBrains IDEs, Neovim, and the GitHub web UI."
audience: ["developers"]
related: ["tool:cursor", "tool:claude-code", "tool:windsurf", "guide:ai-code-review-workflow", "glossary:vibe-coding"]
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
curl -fsSL https://gh.io/copilot-install | bash   # or: brew install --cask copilot-cli
copilot
```

> [!NOTE]
> Treat suggestions as drafts. Always review generated code for correctness, security, and licensing before committing.

## Good to know

Copilot is freemium, as of September 2026: the $0 Free plan includes 2,000 completions a month and an allowance of GitHub AI Credits, paid plans have billed chat, agent, and CLI usage in GitHub AI Credits since June 1, 2026, verified students get a free Student plan, and eligible verified teachers and popular open-source maintainers can get Pro for free. It normally requires a GitHub account, a supported editor, and an internet connection; the exception is bring-your-own-key chat in VS Code, which works with local models through Ollama or Foundry Local without a Copilot plan. Available models vary by plan. Comparing options? [The best GitHub Copilot alternatives](/guides/comparisons/best-github-copilot-alternatives-2026) covers free, open-source, and self-hosted picks.
