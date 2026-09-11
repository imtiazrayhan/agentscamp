---
name: "Roo Code"
description: "A discontinued open-source VS Code agent (a Cline fork); the team has since pivoted away from the IDE extension."
date: 2026-06-03
updated: "2026-09-11"
url: "https://github.com/RooCodeInc/Roo-Code"
pricing: "open-source"
category: "extension"
color: "orange"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["vscode", "open-source"]
alternativeTo: ["cline", "kilo-code", "continue", "cursor"]
related: ["tool:cline", "tool:kilo-code", "tool:continue", "guide:ai-coding-agents-cli-2026"]
summary: "Roo Code was an open-source AI coding agent for VS Code, forked from Cline, known for its configurable mode system (Code, Architect, Ask, Debug) with per-mode models and tool permissions. It was discontinued in May 2026 — the extension was shut down and its repository archived — and the maintainers point users to ZooCode (a community fork) and Cline."
faq:
  - q: "What is Roo Code?"
    a: "Roo Code was an open-source AI coding agent that ran inside Visual Studio Code, originally forked from Cline. It could read and write files, run terminal commands, and edit code across a workspace under your supervision, with a mode system of configurable personas — Code, Architect, Ask, Debug, and custom modes — each with its own prompt, tools, and model. The project is now discontinued."
  - q: "Is Roo Code still maintained?"
    a: "No. The VS Code extension was shut down on May 15, 2026 and its repository archived (read-only), and the team pivoted to a cloud/Slack-based agent. Existing installs may still run with your own API key, but the project is no longer maintained."
  - q: "What should I use instead of Roo Code?"
    a: "The Roo Code README points to two options: ZooCode, a fork started by the Roo Code community, and Cline, the open-source in-editor agent Roo Code was originally forked from. Kilo Code, which began as a Roo fork, also publishes a Roo-to-Kilo migration guide."
---

> [!WARNING]
> Roo Code has been discontinued. The VS Code extension was shut down on May 15, 2026 and its repository archived (read-only), and the team pivoted to a cloud/Slack-based agent. Existing installs may still run with your own API key, but the project is no longer maintained. For a similar open-source, in-editor agent today, the README points to ZooCode (a community fork) and [Cline](/tools/cline), the project Roo Code was originally forked from; [Kilo Code](/tools/kilo-code) also publishes a migration guide for Roo users.

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

Roo Code was free and open source (Apache 2.0). The VS Code extension was shut down on May 15, 2026 and the repository is archived. The README points users to ZooCode (a community fork) and Cline.
