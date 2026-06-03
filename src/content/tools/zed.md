---
name: "Zed"
description: "A high-performance, multiplayer code editor with built-in AI assistance."
url: "https://zed.dev"
pricing: "open-source"
category: "ide"
repo: "https://github.com/zed-industries/zed"
color: "pink"
topics: ["coding-languages"]
tags: ["ide", "editor", "rust"]
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
