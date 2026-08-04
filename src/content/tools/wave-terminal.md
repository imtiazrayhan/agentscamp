---
name: "Wave Terminal"
title: "Wave Terminal"
description: "Open-source terminal that blends the CLI with inline file previews, a built-in editor, a web browser, and a context-aware AI assistant in one window."
url: "https://www.waveterm.dev"
date: 2026-06-19
pricing: "open-source"
category: "terminal"
repo: "https://github.com/wavetermdev/waveterm"
license: "Apache-2.0"
sameAs: ["https://github.com/wavetermdev/waveterm", "https://docs.waveterm.dev"]
color: "cyan"
topics: ["devops-infra", "coding-languages"]
tags: ["terminal", "open-source", "ai-assistant", "developer-tools"]
featured: false
alternativeTo: ["warp"]
summary: "Wave Terminal is an open-source, cross-platform terminal that puts the CLI, inline file previews, a built-in editor, a web browser, and a context-aware AI assistant in one block-based workspace. Wave AI reads terminal output and files and works with cloud or local models via your own keys. Apache-2.0 licensed for macOS, Linux, and Windows."
related: ["guide:claude-code-tips", "guide:installing-claude-code", "guide:best-local-llm-tools-2026"]
faq:
  - q: "What is Wave Terminal?"
    a: "Wave Terminal is an open-source, cross-platform terminal that goes beyond a plain shell. Each command, file preview, editor, browser tab, or AI chat lives in a draggable block on a tiled workspace, so you can run commands, preview images and markdown, edit remote files, and browse the web without leaving the window. A built-in AI assistant (Wave AI) has access to your terminal output, widgets, and filesystem to help with debugging and command lookup."
  - q: "Is Wave Terminal free?"
    a: "Yes. Wave Terminal is fully free and open source under the Apache-2.0 license, with no paid tiers. For AI features you bring your own API keys for cloud providers like OpenAI, Anthropic (Claude), Gemini, Azure, and Perplexity, or run local models through Ollama or LM Studio at no cost."
  - q: "Which AI models does Wave AI support?"
    a: "Wave AI is provider-agnostic and uses a bring-your-own-key model. It works with cloud providers including OpenAI, Anthropic (Claude), Gemini, Azure, and Perplexity, and with local models via Ollama and LM Studio. You can invoke it from the UI or the wsh ai command, and it can read terminal output and files to ground its answers."
---

Wave Terminal is an **open-source, cross-platform terminal** that blends the traditional command line with the kinds of tools developers normally bounce between apps for. Instead of an endless scrollback buffer, Wave organizes work into a **block-based, tiled workspace**: every command, file preview, editor, browser tab, and AI chat is a discrete block you can drag, resize, group, and save as a named layout. It runs on macOS, Linux, and Windows.

Beyond running commands, Wave can preview images, markdown, audio, video, HTML, and CSV files inline, edit local and remote files in a built-in VS Code-style editor, manage SSH and WSL connections, and embed a web browser right next to your shell. The goal is to cut the constant context switching between a terminal, an editor, a file manager, and a browser.

**Wave AI** is a context-aware assistant with access to your terminal output, widgets, and filesystem, so it can explain errors, suggest commands, and read or edit files in context. It is provider-agnostic and uses a bring-your-own-key approach: connect cloud models from OpenAI, Anthropic (Claude), Gemini, Azure, or Perplexity, or run local models through Ollama and LM Studio. You can call it from the UI or via the `wsh ai` command, and it integrates with Claude Code workflows.

Wave is licensed under **Apache-2.0** and keeps your data on-device, with no required cloud account to use the terminal. It is a strong fit for developers who want a modern, graphical terminal with built-in AI without giving up an open-source, self-hostable stack.
