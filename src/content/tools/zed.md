---
name: "Zed"
description: "A high-performance, multiplayer code editor with built-in AI assistance."
seoDescription: "Zed is a high-performance, multiplayer code editor with built-in AI assistance — agentic editing, collaboration, and speed. Pricing and alternatives."
date: 2026-06-03
url: "https://zed.dev"
pricing: "open-source"
category: "ide"
repo: "https://github.com/zed-industries/zed"
related: ["tool:cursor", "tool:void", "tool:windsurf"]
alternativeTo: ["cursor", "void", "windsurf", "antigravity"]
color: "pink"
topics: ["coding-languages"]
tags: ["ide", "editor", "rust"]
summary: "Zed is a high-performance code editor written in Rust with GPU-accelerated rendering, real-time multiplayer collaboration (shared cursors, voice, screen sharing), and integrated AI — inline completions plus an agent panel that connects to Anthropic, OpenAI, or local models through Ollama. Open source and free on macOS, Linux, and Windows."
faq:
  - q: "What is Zed?"
    a: "Zed is a code editor written in Rust and built for speed, using GPU-accelerated rendering (via its own GPUI framework) to keep typing, scrolling, and search responsive even on large files. It targets developers who want a lightweight native editor without Electron overhead, while still getting real-time collaboration and integrated AI."
  - q: "Is Zed free?"
    a: "Yes — Zed is open source (GPL-3.0 and Apache-2.0, depending on component) and free to download, running natively on macOS, Linux, and Windows. Collaboration and some hosted AI features rely on Zed's cloud services, and bring-your-own API keys are supported for AI providers."
  - q: "How does AI work in Zed?"
    a: "Zed offers inline completions and an agent panel that can read your codebase, propose multi-file edits you review before applying, and run shell commands as tools. It connects to providers such as Anthropic and OpenAI or local models through Ollama, with the default model configured in a JSON settings file."
---

Zed is a code editor written in Rust and built for speed. It uses GPU-accelerated rendering (via its own GPUI framework) to keep typing, scrolling, and search responsive even on large files. Zed is aimed at developers who want a lightweight native editor without the overhead of an Electron-based IDE, while still getting modern features like real-time collaboration and integrated AI.

## Highlights

- **Native performance**: Rust core with GPU rendering for low-latency editing.
- **Multiplayer editing**: Share a project and pair-program with shared cursors, voice channels, and screen sharing.
- **AI assistant**: Inline completions and an agent panel that can read your codebase, run edits, and use tools.
- **Language support**: Tree-sitter syntax parsing and built-in Language Server Protocol (LSP) integration.
- **Vim mode** and an extensible, themeable configuration via JSON.

## AI-assisted workflow

Zed's agent panel connects to providers such as Anthropic, OpenAI, and local models through Ollama. You can configure which model handles inline edits and chat. Settings live in a JSON file you can edit directly:

```json
{
  "assistant": {
    "default_model": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-5"
    },
    "version": "2"
  }
}
```

The assistant can reference open buffers and project files, propose multi-file edits you review before applying, and run shell commands as tools, fitting alongside terminal-driven agents rather than replacing them.

## Good to know

Zed is open source (GPL-3.0 and Apache-2.0, depending on component) and free to download. It runs natively on macOS, Linux, and Windows. Collaboration and some hosted AI features rely on Zed's cloud services, and bring-your-own API keys are supported for AI providers.
