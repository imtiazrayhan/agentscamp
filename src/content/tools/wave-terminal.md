---
name: "Wave Terminal"
title: "Wave Terminal"
description: "Open-source terminal that blends the CLI with inline file previews, a built-in editor, a web browser, and a context-aware AI assistant in one window."
url: "https://www.waveterm.dev"
date: 2026-06-19
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "terminal"
repo: "https://github.com/wavetermdev/waveterm"
license: "Apache-2.0"
sameAs: ["https://github.com/wavetermdev/waveterm", "https://docs.waveterm.dev"]
os: ["macOS", "Windows", "Linux"]
color: "cyan"
topics: ["devops-infra", "coding-languages"]
audience: ["developers"]
tags: ["terminal", "open-source", "ai-assistant", "developer-tools"]
featured: false
alternativeTo: ["warp"]
summary: "Wave Terminal is an Apache-2.0 terminal for macOS, Linux and Windows that arranges terminals, file previews, an editor, a web browser and an AI chat as blocks in one window. Wave AI reads terminal output and files, and runs on your own API keys or local models through Ollama or LM Studio. No account is required. The latest release is v0.14.5 (April 2026)."
related: ["guide:claude-code-tips", "guide:installing-claude-code", "guide:best-local-llm-tools-2026"]
faq:
  - q: "Is Wave Terminal free?"
    a: "Yes. Wave Terminal is open source under Apache-2.0 and the project lists no paid plan. As of November 2026 the docs describe Wave AI as being in active beta with included AI credits; to avoid depending on those, configure your own API key or a local model in waveai.json."
  - q: "Which AI models does Wave AI support?"
    a: "The Wave AI modes docs list built-in providers for OpenAI, OpenRouter, Google Gemini, Azure OpenAI, Groq and NanoGPT, plus a custom provider for any OpenAI-compatible endpoint such as Ollama, LM Studio or vLLM. There is no native Anthropic provider in that list; reach Claude models through OpenRouter or another OpenAI-compatible gateway."
  - q: "Can I use Wave AI without sending telemetry?"
    a: "Yes, with your own model. The docs say Wave AI normally requires telemetry to be enabled, but if you configure a local or bring-your-own-key mode and set waveai:defaultmode to it, the telemetry requirement no longer applies. Setting waveai:showcloudmodes to false also hides Wave's cloud modes from the picker."
  - q: "Does Claude Code work inside Wave Terminal?"
    a: "Yes. Claude Code runs in a Wave terminal block like any CLI, and the release notes record fixes aimed at it: a scroll-jump bug fixed in v0.14.1, an xterm.js v6 upgrade in v0.14.4, and Shift+Enter newlines and image paste in earlier releases. The wsh badge command can flag a block when a long-running process exits."
---

Wave Terminal is an **open-source, cross-platform terminal** that replaces the single scrollback buffer with a **tiled workspace of blocks**. A block can be a terminal, a file preview, a code editor, a web browser, or an AI chat, and you drag, resize and group them inside tabs. It runs on macOS, Linux and Windows, needs no account, and is licensed under Apache-2.0. The repository had about 22.7k GitHub stars as of November 2026.

## Highlights

- **Blocks instead of one buffer.** Terminals, previews, editors, browsers and AI chats sit side by side in a tab. Any block can be expanded to full screen and returned to the layout.
- **Inline previews and a built-in editor.** Preview markdown, images, video, PDFs, CSVs and directories, and edit local or remote files with syntax highlighting, without leaving the window.
- **Durable SSH sessions.** Added in v0.14.0 (February 2026): remote terminal sessions survive network changes, sleep, and Wave restarts, then reconnect automatically.
- **Wave AI.** A chat panel that, with its context toggle on, can read terminal scrollback, take widget screenshots, and read or write files. File operations ask for approval each time.
- **`wsh` command.** Controls the workspace from the shell: `wsh ai` sends files or piped output to the AI panel, `wsh file` copies between local and SSH hosts, and `wsh editconfig` opens config files.
- **Secret storage.** API keys and credentials are stored through the operating system's native backend and are available across SSH sessions.
- **Process Viewer and Quake Mode.** Added in v0.14.5: a widget listing processes on local and remote machines, and a global hotkey that shows or hides a Wave window.

## In an AI-assisted workflow

Install from the [download page](https://www.waveterm.dev/download), or on Linux with snap:

```bash
sudo snap install --classic waveterm
```

To run Wave AI on a local model, add a mode to `~/.config/waveterm/waveai.json` (open it with `wsh editconfig waveai.json`). This is the Ollama example from Wave's docs:

```json
{
  "ollama-llama": {
    "display:name": "Ollama - Llama 3.3",
    "display:order": 1,
    "display:icon": "microchip",
    "ai:apitype": "openai-chat",
    "ai:model": "llama3.3:70b",
    "ai:thinkinglevel": "medium",
    "ai:endpoint": "http://localhost:11434/v1/chat/completions",
    "ai:apitoken": "ollama"
  }
}
```

Make it the default, then hand it something from the shell:

```bash
wsh setconfig waveai:defaultmode="ollama-llama"
git diff | wsh ai -                      # pipe a diff into the AI panel
wsh ai main.go -m "find bugs"            # attach a file with a message
```

Note that `ai:endpoint` is the full chat-completions URL, not a base URL. For hosted providers, set `ai:provider` (for example `openai` or `openrouter`) and Wave fills in the endpoint and the name of the secret that holds your key.

If your agent is [Claude Code](/guides/getting-started/installing-claude-code) rather than Wave AI, the block layout is still useful: run the agent in one block, a dev server in a second, and a browser preview of the result in a third.

## Good to know

- **Release pace.** The latest tagged release is v0.14.5 from April 16, 2026, and as of November 2026 there has been no release since. The earlier cadence was every few weeks, so check the repository's recent activity if you are choosing a terminal for the long run.
- **Wave AI cannot run commands yet.** The README lists command execution with approval as coming soon. Today it reads output and edits files; you run the commands.
- **No native Claude backend.** The v0.14.2 release notes say an Anthropic Messages backend is in progress. Until it ships, Claude models go through OpenRouter or an OpenAI-compatible gateway.
- **Attachment limits.** Files dragged into the AI panel are capped at 10 MB for images, 5 MB for PDFs and 200 KB for text files, and not every model accepts images or PDFs.
- **Platform minimums.** macOS 11 or later, Windows 10 1809 or later (x64), and Linux with glibc 2.28 or later (Debian 10, RHEL 8, Ubuntu 20.04), on x64 or arm64.
- **It is an Electron app.** Expect a heavier footprint than a GPU-native terminal, in exchange for the embedded browser, editor and previews.

The closest alternative is [Warp](/tools/warp), whose agent can plan and run commands (Wave AI cannot yet) and whose client is open source mostly under AGPL-3.0, with paid plans for AI usage. If you want a fast editor with a built-in terminal and agent panel instead of a terminal with an editor inside it, look at [Zed](/tools/zed). To choose a local model for Wave AI, see [Best Tools for Running LLMs Locally](/guides/comparisons/best-local-llm-tools-2026).
