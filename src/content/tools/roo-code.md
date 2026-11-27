---
name: "Roo Code"
description: "A discontinued open-source VS Code coding agent forked from Cline, known for its modes. Shut down on May 15, 2026; the repository is archived."
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://github.com/RooCodeInc/Roo-Code"
pricing: "open-source"
category: "extension"
repo: "https://github.com/RooCodeInc/Roo-Code"
license: "Apache-2.0"
color: "orange"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["vscode", "open-source"]
alternativeTo: ["cline", "kilo-code", "continue", "cursor"]
related: ["tool:cline", "tool:kilo-code", "tool:continue", "guide:ai-coding-agents-cli-2026"]
summary: "Roo Code was an Apache-2.0 AI coding agent for VS Code, forked from Cline and known for its modes: Code, Architect, Ask, Debug and custom ones. Roo Code, Inc. shut the extension down on May 15, 2026 and archived the repository; the last release is v3.54.0. The README points users to ZooCode, a community fork, and to Cline."
faq:
  - q: "Is Roo Code still maintained?"
    a: "No. The README states that the Roo Code extension was shut down on May 15, 2026, and GitHub marks the RooCodeInc/Roo-Code repository as archived, which makes it read-only: no issues, pull requests or releases. The final release, v3.54.0, was published the same day."
  - q: "What should I use instead of Roo Code?"
    a: "The Roo Code README names two options: ZooCode, a fork started by the Roo Code community, and Cline, the project Roo Code was forked from. Kilo Code also began as a Roo Code fork, though its current extension is rebuilt on OpenCode and its own Roo-derived extension reached end of life on July 31, 2026."
  - q: "Can I still fork or reuse the Roo Code source?"
    a: "Yes. The code is Apache-2.0 and the archived repository stays public, so you can fork it, build it and redistribute it under the licence terms. What you do not get is upstream fixes: nobody at Roo Code, Inc. is patching it against VS Code API changes or new model APIs."
  - q: "What if I paid for Roo Code?"
    a: "The README directs paying users with billing questions to billing@roocode.com."
---

> [!WARNING]
> Roo Code has been discontinued. Its README says the Roo Code extension was shut down on May 15, 2026, and the GitHub repository is archived and read-only. For a maintained open-source agent in the editor, the README points to ZooCode, a fork started by the Roo Code community, and to [Cline](/tools/cline), the project Roo Code was forked from.

Roo Code was an open-source AI coding agent for Visual Studio Code, published by Roo Code, Inc. under Apache-2.0. It began as a fork of Cline and did the same core job: read and write files in your workspace, run terminal commands, and work through a multi-step task with your approval, using a model you supplied.

What set it apart was **modes**. Instead of one general agent, Roo Code shipped several personas you switched between, and let teams define their own.

## Highlights

These describe the extension as it stood at shutdown.

- **Built-in modes.** The README lists four: Code for everyday coding, edits and file operations; Architect for planning systems, specs and migrations; Ask for fast answers, explanations and docs; Debug for tracing issues, adding logs and isolating root causes.
- **Custom modes.** You could build specialized modes for a team or workflow, each a named persona with its own instructions.
- **MCP servers.** Roo Code could call tools exposed over the [Model Context Protocol](/glossary/model-context-protocol).
- **Localized.** The README was maintained in 18 languages.
- **Final state.** v3.54.0, released May 15, 2026, is the last version. The repository had about 24,200 GitHub stars as of November 2026.

## In an AI-assisted workflow

There is no workflow to recommend on a dead extension. If you are still running an installed copy, plan the move:

1. Export what is yours: custom mode definitions, project rules and any MCP server configuration.
2. Pick a successor. Cline keeps the approve-each-step loop and has Plan and Act modes in place of Roo's Architect and Code. ZooCode is the community continuation of the Roo codebase.
3. Recreate each custom mode as rules or a custom agent in the new tool and run it against a task you already know the answer to.

> [!NOTE]
> An unmaintained extension that runs shell commands and holds API keys is a security liability, not just a missing-features problem. Nobody is shipping fixes for it.

## Good to know

Roo Code was free and Apache-2.0, and the source stays public in the archived repository, so forks remain legal and possible. Roo Code, Inc. asks former paying users to send billing questions to billing@roocode.com.

The lineage matters when you choose a replacement. [Cline](/tools/cline) is the upstream project and is actively released. [Kilo Code](/tools/kilo-code) started as a Roo Code fork, but its current extension was rebuilt on OpenCode and the Roo-derived Kilo extension reached end of life on July 31, 2026, so it is not a drop-in continuation. If you want a terminal agent instead of an editor panel, see [OpenCode](/tools/opencode). The three-way history is covered in [Cline vs Kilo Code vs Roo Code](/guides/comparisons/cline-vs-kilo-code-vs-roo-code).
