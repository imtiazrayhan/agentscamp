---
name: "Gemini CLI"
description: "Google's open-source terminal AI agent powered by Gemini models, with a 1M-token context window and built-in tools."
date: 2026-06-03
updated: "2026-09-11"
url: "https://geminicli.com"
pricing: "open-source"
category: "cli"
repo: "https://github.com/google-gemini/gemini-cli"
color: "blue"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["cli", "agent", "terminal"]
related: ["tool:claude-code", "tool:codex-cli", "tool:aider", "tool:antigravity", "tool:opencode"]
featured: false
alternativeTo: ["claude-code", "codex-cli", "aider", "opencode", "goose"]
summary: "Gemini CLI is Google's open-source (Apache-2.0) terminal AI agent for Gemini models, with a 1M-token context window, file and shell tools, Google Search grounding, MCP, and GEMINI.md files. Since June 18, 2026 it no longer serves free or Google AI Pro/Ultra users, who are pointed to Antigravity CLI; paid API keys and enterprise Code Assist still work."
faq:
  - q: "What is Gemini CLI?"
    a: "Gemini CLI is Google's open-source AI agent that runs in your terminal, driven by Gemini models (the current line leads with Gemini 3) with a 1M-token context window. It reads and writes files, runs shell commands, fetches URLs, and grounds answers with Google Search — and it powers Gemini Code Assist's agent mode in VS Code."
  - q: "Is Gemini CLI free?"
    a: "The tool is open source under Apache-2.0, and a personal Google account long offered a free tier of 60 requests/minute and 1,000 requests/day. But as of June 18, 2026, Google stopped serving requests for free, Google AI Pro/Ultra, and individual Gemini Code Assist users, transitioning them to Antigravity CLI — paid Gemini API keys and Gemini Code Assist Standard/Enterprise licenses keep working."
  - q: "How do I install Gemini CLI?"
    a: "Install it with npm install -g @google/gemini-cli (Homebrew, MacPorts, npx, and Anaconda also work; Node.js 20+ required), cd into your project, and run gemini. It edits files on disk and runs your test or lint commands, so you review the diff rather than copy-paste from a chat window."
---

Gemini CLI is Google's open-source (Apache-2.0) AI agent that runs in your terminal. You install it with `npm`, `npx`, or Homebrew, point it at a project, and describe what you want in plain language. It reads and writes files, runs shell commands, fetches URLs, and grounds answers with Google Search — driven by Gemini models (the current line leads with Gemini 3) with a 1M-token context window. It also powers Gemini Code Assist's agent mode in VS Code.

It is aimed at developers who live in the terminal and want a capable agent without leaving the shell or paying for API usage up front. Signing in with a personal Google account once unlocked a generous free allowance — but as of June 18, 2026 that free, Pro, and Ultra access has ended, with Antigravity CLI as Google's replacement (see the warning below); paid API keys and enterprise licenses remain the way to keep using Gemini CLI directly.

## Highlights

- **1M-token context** — Gemini's large context window lets the agent reason over big codebases and long docs in a single session.
- **Built-in tools** — file system operations, shell execution, web fetch, and Google Search grounding ship in the box; no plugins required for the basics.
- **MCP support** — connect Model Context Protocol servers to extend the agent with databases, APIs, and custom tooling.
- **`GEMINI.md` context files** — drop project-level instructions in `GEMINI.md` so the agent follows your conventions automatically.
- **Multimodal input** — feed it PDFs, images, and sketches, not just text.
- **Checkpointing** — enable it in `settings.json` and the agent snapshots your project before file modifications; use `/restore` to roll back any step via a shadow Git repo, without touching your real Git history.

## In an AI-assisted workflow

Gemini CLI fits the terminal-native loop: open a repo, start the agent, and let it plan and apply changes while you review. A typical first run looks like this:

```bash
npm install -g @google/gemini-cli
cd your-project
gemini
# then, at the prompt:
# > Add input validation to the signup handler and update the tests
```

It edits files on disk and runs your test or lint commands, so you review the diff rather than copy-paste from a chat window.

> [!TIP]
> Commit (or stage) your work before a large agentic task. Checkpointing is off by default — enable it in `settings.json` if you want `/restore` to undo the agent's edits — but either way a clean Git baseline makes review and rollback far easier.

## Good to know

Gemini CLI is open source under Apache-2.0 and runs on macOS, Windows, and Linux (Node.js 20+). Install via `npm`/`npx`, Homebrew, MacPorts, or Anaconda. A personal Google account once offered a free tier of 60 requests/minute and 1,000 requests/day on Gemini models; that free/Pro/Ultra access ended June 18, 2026 (see below). You can still use a paid Gemini API key, Gemini Enterprise Agent Platform (formerly Vertex AI), or a Gemini Code Assist Standard/Enterprise license, and the project still ships regular releases (v0.59.0 in September 2026).

> [!WARNING]
> Google announced at I/O 2026 (**May 19, 2026**) that it was transitioning Gemini CLI to **Antigravity CLI**, and as of **June 18, 2026** Gemini CLI and the Gemini Code Assist IDE extensions **stopped serving requests** for free, Google AI Pro/Ultra, and individual Gemini Code Assist users. Gemini CLI keeps working through **paid Gemini API keys** and **Gemini Code Assist Standard/Enterprise** licenses, and the repo stays open source — but the free personal-account tier is gone. Antigravity CLI, the replacement, is **not** published as open source, which has drawn criticism from contributors. Check the [repo](https://github.com/google-gemini/gemini-cli) and [Google's developer blog](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) for the current state.
