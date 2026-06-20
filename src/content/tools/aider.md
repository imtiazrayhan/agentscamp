---
name: "Aider"
description: "Open-source terminal AI pair programmer that edits files in your Git repo and auto-commits each change, working with Claude, GPT, and other models you bring."
date: 2026-06-03
url: "https://aider.chat"
pricing: "open-source"
category: "cli"
repo: "https://github.com/Aider-AI/aider"
color: "purple"
topics: ["coding-languages"]
tags: ["cli", "open-source"]
alternativeTo: ["codex-cli", "claude-code", "gemini-cli", "cline", "continue"]
summary: "Aider is an open-source (Apache-2.0) command-line tool for AI pair programming. Run it inside a Git repository, describe a change in plain language, and it edits files on disk and commits each step with a descriptive message. Model-agnostic: bring your own API key for Claude, GPT, and others; a repo map gives the model context in large codebases."
faq:
  - q: "What is Aider?"
    a: "Aider is an open-source command-line tool for AI pair programming. You run it inside an existing Git repository, describe the change you want in plain language, and it edits files directly on disk and commits each change with a descriptive message. It connects to models from Anthropic, OpenAI, and other providers."
  - q: "Is Aider free?"
    a: "Yes. Aider is free and open source under the Apache-2.0 license. You supply your own model API key, so usage costs depend on the provider and model you choose."
  - q: "How do I install Aider?"
    a: "Install it with pip install aider-install && aider-install, then cd into your project and start it with a model, for example aider --model sonnet src/app.py. Because every edit lands as a Git commit, you can git revert anything you do not like."
---

Aider is an open-source command-line tool for AI pair programming. You run it inside an existing Git repository, describe the change you want in plain language, and Aider edits files directly on disk and commits each change with a descriptive message. It is aimed at developers who prefer working in the terminal and want an AI collaborator that operates on real source files rather than a chat window you copy and paste from.

Aider connects to large language models from providers such as Anthropic, OpenAI, and others, and works across many languages including Python, JavaScript, TypeScript, Go, Rust, and more. It builds a map of your repository so the model has relevant context even in large codebases.

## Highlights

- Edits files in place and creates a Git commit per change, so every step is reviewable and reversible.
- Repository mapping gives the model awareness of code beyond the files you explicitly add.
- Model-agnostic: works with Claude, GPT, and many other models via API keys.
- Supports voice input, image and URL context, and linting/test commands after edits.

## How it fits a workflow

```bash
pip install aider-install && aider-install
cd your-project
aider --model sonnet src/app.py
```

Add files to the chat, request a change, then review the diff and the auto-commit. Because edits land as commits, you can `git revert` anything you do not like.

## Good to know

Aider is free and open source (Apache-2.0), but you supply your own model API key, so usage costs depend on the provider and model you choose.
