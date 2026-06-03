---
name: "Continue"
description: "An open-source IDE extension for building custom AI coding assistants."
date: 2026-06-03
url: "https://continue.dev"
pricing: "open-source"
category: "extension"
repo: "https://github.com/continuedev/continue"
color: "blue"
topics: ["coding-languages"]
tags: ["vscode", "jetbrains", "open-source"]
---

Continue is an open-source extension for VS Code and JetBrains IDEs that lets developers assemble their own AI coding assistant. Instead of locking you into one vendor's model, it provides the editor integration (chat, autocomplete, inline edits, and agent actions) while leaving the choice of model and provider up to you.

It is aimed at developers and teams who want control over which LLMs they use, where requests are sent, and how the assistant is configured. Because the configuration lives in your project as code, setups can be version-controlled and shared across a team.

## Highlights

- Works in VS Code, JetBrains IDEs, and a terminal CLI
- Bring-your-own model: connect hosted providers (OpenAI, Anthropic, etc.) or local models via Ollama and similar runtimes
- Chat, tab autocomplete, inline edit, and agent modes
- Context providers that pull in files, docs, terminal output, and codebase search
- Declarative configuration so assistants are reproducible and shareable

A typical workflow connects a model in a config file, then uses chat for questions, autocomplete while typing, and inline edits for targeted refactors. A minimal model entry looks like this:

```yaml
models:
  - name: my-assistant
    provider: anthropic
    model: claude-sonnet-4-6
    apiKey: ${ANTHROPIC_API_KEY}
```

## Good to know

> [!NOTE]
> Continue is open-source (Apache 2.0) and free to install, but you supply your own model access. Running hosted models incurs provider API costs; local models avoid that but require capable hardware.
