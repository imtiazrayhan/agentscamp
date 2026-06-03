---
name: "Aider"
description: "AI pair programming in your terminal, with strong Git integration."
url: "https://aider.chat"
pricing: "open-source"
category: "cli"
repo: "https://github.com/Aider-AI/aider"
color: "purple"
topics: ["coding-languages"]
tags: ["cli", "open-source"]
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
