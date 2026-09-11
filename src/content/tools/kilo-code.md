---
name: "Kilo Code"
description: "Open-source AI coding agent for VS Code and JetBrains, begun as a Roo Code fork and rebuilt on OpenCode, with bring-your-own-key and zero model markup."
url: "https://kilo.ai/"
pricing: "freemium"
category: "extension"
repo: "https://github.com/Kilo-Org/kilocode"
related: ["tool:roo-code", "tool:cline", "tool:continue", "guide:ai-coding-agents-cli-2026"]
license: "MIT"
os:
  - macOS
  - Windows
  - Linux
alternativeTo:
  - "cline"
  - "roo-code"
  - "cursor"
sameAs:
  - "https://github.com/Kilo-Org/kilocode"
  - "https://marketplace.visualstudio.com/items?itemName=kilocode.Kilo-Code"
topics:
  - ai-agents-systems
audience: ["developers"]
tags:
  - ai-agent
  - vscode-extension
  - open-source
  - coding-assistant
  - mcp
color: blue
date: 2026-06-17
updated: "2026-09-11"
featured: false
summary: "Kilo Code is an open-source (MIT) AI coding agent for VS Code and JetBrains that began as a Roo Code fork and was rebuilt on OpenCode for its v7 release in April 2026. It supports 500+ models with bring-your-own-key and zero inference markup, plus agents (Code, Plan, Ask, Debug), MCP servers, and inline autocomplete."
faq:
  - q: "Is Kilo Code free and open source?"
    a: "Yes. The extension is MIT-licensed and free to install. It uses a freemium model: you can bring your own API key (or local models) and pay the provider's rate with no markup, or use the hosted service which offers a free tier and paid options."
  - q: "How does Kilo Code relate to Roo Code and Cline?"
    a: "Kilo Code began in 2025 as a fork of Roo Code, which itself forked Cline. Its current VS Code extension (v7, generally available since April 2026) was rebuilt on the OpenCode server, and the legacy Roo-derived extension and JetBrains plugin reached end of life on July 31, 2026."
  - q: "Which editors does Kilo Code support?"
    a: "It ships as a VS Code extension (also on Open VSX) and a JetBrains plugin, with a CLI and cloud agents available through the broader Kilo platform."
---

**Kilo Code is an open-source, MIT-licensed AI coding agent that runs as a VS Code and JetBrains extension; it began as a Roo Code fork and was rebuilt on OpenCode for its v7 release in April 2026.**

The extension takes natural-language instructions to generate, refactor, and debug code, run terminal commands, and automate multi-step tasks inside the editor. It organizes work into agents — Code (the default), Plan, Ask, and Debug — and supports custom agents, inline autocomplete, and a Model Context Protocol (MCP) server marketplace for connecting external tools and data. The older Orchestrator mode is deprecated; agents with full tool access now support subagents natively.

Kilo Code is model-agnostic: users can choose from 500+ models, switch between them mid-task, and connect their own API keys or local models. The project advertises "zero markup" on inference when using the hosted routing, meaning you pay the model provider's rate. Pricing is freemium — the extension itself is free, there is a free tier with optional paid credits, and bring-your-own-key keeps costs under the user's control.

For developers comparing options: Kilo Code descends from Roo Code, which forked Cline, but the current extension is rebuilt on OpenCode, and the legacy Roo-derived extension reached end of life on July 31, 2026. Relative to Cursor, the main differentiators are that Kilo Code is open source, runs as an extension inside an existing editor rather than as a separate fork, and avoids markup on model usage.

Recent status worth noting: the project's primary domain now resolves to kilo.ai (the older kilocode.ai redirects there), reflecting a broader "Kilo" platform that spans the editor extension, a CLI, and cloud agents. The source repository lives at github.com/Kilo-Org/kilocode under the MIT license and has 27,260 GitHub stars (as of September 2026). The company was co-founded by GitLab co-founder Sid Sijbrandij.