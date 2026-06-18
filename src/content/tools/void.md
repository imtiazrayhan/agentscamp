---
name: "Void"
title: "Void — Open-Source AI Code Editor (VS Code Fork)"
description: "Open-source AI code editor forked from VS Code, an alternative to Cursor that connects directly to your chosen model with no proprietary backend."
url: "https://voideditor.com"
pricing: "open-source"
category: "ide"
repo: "https://github.com/voideditor/void"
related: ["cursor", "zed", "windsurf"]
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
tags:
  - ai-editor
  - vscode-fork
  - open-source
  - local-models
  - agent
color: purple
date: 2026-06-17
featured: false
summary: "Void is an open-source AI code editor forked from VS Code, positioned as an alternative to Cursor and Windsurf. It connects directly to any model (cloud or local via Ollama) with no proprietary backend. Apache-2.0 licensed and built by Glass Devtools (YC-backed); the project's GitHub repo was archived on June 2, 2026 and active development is paused."
faq:
  - q: "Is Void free and open source?"
    a: "Yes. Void is open source under the Apache-2.0 license and is free to download. You bring your own model API keys or run models locally, so there is no subscription to Void itself."
  - q: "How does Void differ from Cursor?"
    a: "Both are VS Code forks with AI features, but Void routes requests directly from your editor to your chosen model provider rather than through a proprietary backend. Because it is open source, you can inspect how keys and data are handled, and you can run models entirely on your own machine via Ollama."
  - q: "Is Void still actively maintained?"
    a: "Development is paused. The voideditor/void GitHub repository was archived by its owner on June 2, 2026 and is read-only, and the README notes the project is deprecated and no longer accepting contributions. The last released build still runs, but new features and patches are not shipping."
---

**Void is an open-source AI code editor forked from Visual Studio Code, positioned as an alternative to proprietary tools like Cursor and Windsurf.** Built by Glass Devtools, Inc. (a Y Combinator–backed team) and released under the Apache-2.0 license, it bolts Cursor-style AI capabilities onto a familiar VS Code base.

Void targets developers who want AI assistance in their editor while retaining control over their data and model choice. Its central differentiator is that it has no proprietary backend: requests go directly from the editor to whichever model provider you configure, rather than being routed through a vendor's servers. Because the source is open, the way API keys and data are handled is auditable.

The editor supports a wide range of models — frontier APIs such as Claude, OpenAI, Gemini, and Grok, as well as open or local models (DeepSeek, Llama, Qwen, Mistral) run through Ollama. Core features include tab-based autocomplete, inline quick edits, a multi-mode chat with an Agent Mode that can search, create, and edit files and access the terminal, a read-only Gather Mode, MCP tool support, and a checkpoint system to visualize and roll back AI changes. Builds are available for macOS, Windows, and Linux.

Compared with Cursor and Windsurf, Void trades polished hosted infrastructure and managed model routing for transparency, direct provider connections, and the option to keep everything local. Against Zed, it offers the broad VS Code extension ecosystem rather than a from-scratch editor.

Note on status: active development is paused. The voideditor/void GitHub repository was archived by its owner on June 2, 2026 and is now read-only, and the README states the project is deprecated and no longer accepting contributions. The most recent build remains functional, but new features and security patches are not being shipped by the core team.