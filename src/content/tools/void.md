---
name: "Void"
title: "Void — Open-Source AI Code Editor (VS Code Fork)"
description: "A deprecated open-source AI code editor forked from VS Code that sent requests straight to your model provider. The repo was archived on June 2, 2026."
url: "https://voideditor.com"
pricing: "open-source"
category: "ide"
repo: "https://github.com/voideditor/void"
related: ["tool:cursor", "tool:zed", "tool:windsurf"]
license: "Apache-2.0"
os:
  - macOS
  - Windows
  - Linux
alternativeTo:
  - "cursor"
  - "windsurf"
  - "zed"
sameAs:
  - "https://github.com/voideditor"
topics:
  - coding-languages
audience: ["developers"]
tags:
  - ai-editor
  - vscode-fork
  - open-source
  - local-models
  - agent
color: purple
date: 2026-06-17
updated: "2026-11-27"
reviewed: "2026-11-27"
featured: false
summary: "Void is a deprecated open-source AI code editor forked from VS Code. It offered Tab autocomplete, inline Quick Edit and a chat with Agent and Gather modes, and sent requests directly to your model provider with no vendor backend. The Apache-2.0 repository was archived on June 2, 2026, and the last downloadable build dates from June 2025."
faq:
  - q: "Is Void still maintained?"
    a: "No. The README opens with \"Void is now deprecated\" and says the project is no longer accepting contributions. GitHub archived the voideditor/void repository on June 2, 2026, which makes it read-only. The last build published in the voideditor/binaries releases is 1.99.30044 from June 23, 2025."
  - q: "Can I still download Void?"
    a: "Yes. As of November 2026 voideditor.com still has a Download Beta button, and the README links to old releases. Those builds are more than a year old, and a VS Code fork that stops merging upstream also stops receiving VS Code's security fixes, so it is a poor choice for daily work."
  - q: "How did Void differ from Cursor?"
    a: "Both are VS Code forks with autocomplete, inline edits and an agent. Void's site says it does not send your messages through a private backend like Cursor or Windsurf: the editor connects straight to the provider you configure, or to a model you host. It was also free and Apache-2.0, where Cursor is a closed-source subscription product."
  - q: "Is the Void codebase still useful?"
    a: "As a reference, yes. The README pitches it as one of the best references for forking VS Code: it mounts React and Tailwind inside the workbench, includes GitHub Actions to package, sign and auto-update a fork, and has provider code written from scratch with support for fill-in-the-middle autocomplete. The README also links to a list of newer Void forks."
---

> [!WARNING]
> Void is deprecated. Its README says the project is no longer accepting contributions, and the GitHub repository was archived on June 2, 2026. The newest downloadable build is from June 2025. Use this page to understand what Void was or to study its code, and pick a maintained editor for real work.

**Void is an open-source AI code editor forked from Visual Studio Code**, built by Glass Devtools, Inc. and released under Apache-2.0. It set out to be the open alternative to Cursor and Windsurf: the same kinds of AI features on a familiar VS Code base, without a vendor's servers sitting between you and the model. The repository had about 28,700 GitHub stars as of November 2026.

## Highlights

These describe the last released build.

- **Tab, Quick Edit and Chat.** Tab applies autocomplete, Quick Edit changes the current selection inline, and Chat has three modes: Agent Mode, Gather Mode and normal chat.
- **No private backend.** Void's site says it does not route your messages through a backend of its own; the editor connects directly to the provider. The README adds that it does this without retaining your data.
- **Any model.** Hosted providers such as Claude, Gemini, Grok and OpenAI models, or open models you host yourself, including DeepSeek, Llama and Qwen.
- **Checkpoints.** LLM changes are checkpointed so you can visualize and roll them back.
- **Fast Apply.** The site says applying edits works on 1,000-line files, alongside lint error detection and custom support for fill-in-the-middle models.
- **VS Code migration.** Themes, keybindings and settings transfer from VS Code in one click.

## In an AI-assisted workflow

Void has no place in a current workflow as an editor. Where it still earns attention is as source code. If you are building on VS Code, the README points to specific parts worth reading:

- the build pipeline changes that compile React and scope Tailwind inside the VS Code workbench;
- the GitHub Actions that package, sign and auto-update the app, which VS Code's own private pipeline does not expose;
- `EditCodeService`, which shows diffs as code streams in, and `VoidModelService`, which edits files in the background and keeps OS files in sync with text buffers.

Start with `VOID_CODEBASE_GUIDE.md` in the repository.

## Good to know

Void was free: you paid only your model provider, or nothing with a local model.

The model names on the site (Gemini 2.5, Claude 3.7, Grok 3, o4-mini) show how long ago it stopped moving. An archived VS Code fork misses every upstream editor and extension-host security fix from that point on, and extensions will gradually stop supporting its old base version.

The README links to a list of newer community forks, but none is endorsed as an official successor.

For a maintained editor, [Cursor](/tools/cursor) is the closed-source VS Code fork Void was modeled on, [Zed](/tools/zed) is an open-source editor that is not a VS Code fork, and [Devin Desktop (formerly Windsurf)](/tools/windsurf) is the other commercial fork Void compared itself with. If the appeal was open source plus your own keys, [Cline](/tools/cline) gives you that as an extension inside stock VS Code. Or explore [Void alternatives](/tools/void/alternatives).
