---
name: "Roo Code"
description: "A discontinued open-source VS Code agent (a Cline fork); the team has since pivoted away from the IDE extension."
date: 2026-06-03
url: "https://github.com/RooCodeInc/Roo-Code"
pricing: "open-source"
category: "extension"
color: "orange"
topics: ["coding-languages"]
tags: ["vscode", "open-source"]
---

> [!WARNING]
> Roo Code has been discontinued. The VS Code extension was archived (read-only) in May 2026 along with Roo Code Cloud and Router, and the team pivoted to a cloud/Slack-based agent. Existing installs may still run with your own API key, but the project is no longer maintained. For a similar open-source, in-editor agent today, use [Cline](/tools/cline) — the project Roo Code was originally forked from.

Roo Code was an open-source AI coding agent that ran inside Visual Studio Code. Originally forked from Cline, it could read and write files, run terminal commands, and edit code across a workspace under your supervision. It was aimed at developers who wanted an agentic assistant directly in their editor without committing to a single proprietary model provider.

Its defining feature was its mode system. Each mode is a configurable persona with its own prompt, allowed tools, and model. Built-in modes include Code, Architect, Ask, and Debug, and you can define custom modes for narrower tasks such as writing tests or reviewing pull requests.

## Highlights

- Bring-your-own-key support for many providers (Anthropic, OpenAI, OpenRouter, local models via Ollama, and others)
- Customizable modes with per-mode model and tool permissions
- File edits, terminal command execution, and browser automation, each with an approval step
- Custom instructions and project-level rules to enforce conventions

Custom modes are defined in a simple JSON config:

```json
{
  "slug": "test-writer",
  "name": "Test Writer",
  "roleDefinition": "You write focused unit tests for changed files.",
  "groups": ["read", "edit", "command"]
}
```

In a typical workflow, you describe a task in the sidebar chat, Roo Code proposes a plan and diffs, and you approve or reject each change. This keeps an agent in the loop while leaving control over commits and execution with you.

## Good to know

Roo Code was free and open source (Apache 2.0). The VS Code extension and its hosted services were shut down in May 2026 and the repository is archived; it never included hosted inference, so it relied on your own model API keys. The maintainers' recommended migration path is Cline.
