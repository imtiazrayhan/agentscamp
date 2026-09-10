---
name: "Continue"
description: "An open-source IDE extension for building custom AI coding assistants."
seoDescription: "Continue is an open-source IDE extension for building custom AI coding assistants — bring your own models, rules, and context providers."
date: 2026-06-03
updated: 2026-09-10
reviewed: 2026-09-10
url: "https://continue.dev"
pricing: "open-source"
category: "extension"
repo: "https://github.com/continuedev/continue"
color: "blue"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["vscode", "jetbrains", "open-source"]
alternativeTo: ["cody", "tabnine", "github-copilot", "cline"]
summary: "Continue was acquired by Cursor, and as of September 2026 continue.dev is a farewell page rather than a product site. The Apache-2.0 codebase remains public: an extension for VS Code and JetBrains that supplied chat, tab autocomplete, inline edits, and agent modes while you brought your own model, hosted or local via Ollama."
faq:
  - q: "Is Continue still maintained?"
    a: "No. Continue was acquired by Cursor, and as of September 2026 continue.dev serves only a farewell notice. The company says the open-source codebase remains freely available as a foundation for others, and the repository is still public, but treat it as an archive rather than a product with a roadmap."
  - q: "What is Continue?"
    a: "Continue is an open-source extension for VS Code and JetBrains IDEs (plus a terminal CLI) that lets developers assemble their own AI coding assistant. It provides chat, tab autocomplete, inline edit, and agent modes, while leaving the choice of model and provider up to you — and because configuration lives as code, setups can be version-controlled and shared across a team."
  - q: "Is Continue free?"
    a: "The code is Apache 2.0 and free to install, but the hosted side is gone following the Cursor acquisition. You supply your own model access: hosted models incur provider API costs, while local models via Ollama and similar runtimes avoid that but require capable hardware."
  - q: "How do I use Continue with my own model?"
    a: "Connect a model in a config file, then use chat for questions, autocomplete while typing, and inline edits for targeted refactors. A minimal model entry declares a name, a provider (e.g. anthropic), a model (e.g. claude-sonnet-4-6), and an apiKey reference like ${ANTHROPIC_API_KEY}."
---

> [!WARNING]
> **Continue was acquired by Cursor.** As of September 2026 continue.dev serves a farewell notice rather than a product site: "Continue has joined Cursor." The company says the open-source codebase "remains freely available as a foundation for others," and the repository is still public, but there is no product roadmap behind it. Read this page as a record of what Continue did, and pick something maintained if you are choosing today.

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
