---
name: "Gemini CLI"
description: "Google's open-source terminal AI agent powered by Gemini models, with a 1M-token context window and built-in tools."
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
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
summary: "Gemini CLI is Google's open-source (Apache-2.0) terminal agent for Gemini models, with file and shell tools, Google Search grounding, MCP, and GEMINI.md files. There is no free tier: since June 18, 2026 it serves only Gemini Code Assist Standard and Enterprise licenses and paid API keys. Google points everyone else, and Gemini 4 users, to Antigravity CLI."
faq:
  - q: "What is Gemini CLI?"
    a: "Gemini CLI is Google's open-source AI agent that runs in your terminal, driven by Gemini 3 and Gemini 2.5 models with a 1M-token context window. It reads and writes files, runs shell commands, fetches URLs, and grounds answers with Google Search. As of November 2026 Google maintains it for enterprise Gemini Code Assist workflows on Google Cloud and says it is not tuned for the Gemini 4 series."
  - q: "Is Gemini CLI free?"
    a: "The code is free and open source under Apache-2.0, but using it is not. The free personal-account tier ended on June 18, 2026, when Google stopped serving requests for free, Google AI Pro/Ultra, and individual Gemini Code Assist users and moved them to Antigravity CLI. As of November 2026 the README says there is no free tier: you need a Gemini Code Assist Standard or Enterprise license, a paid Gemini API key, or a Vertex AI key."
  - q: "How do I install Gemini CLI?"
    a: "Install it with npm install -g @google/gemini-cli (Homebrew, MacPorts, npx, and Anaconda also work; Node.js 20+ required), then authenticate: set GOOGLE_CLOUD_PROJECT and sign in for a Code Assist license, or export GEMINI_API_KEY for a paid API key. Then cd into your project and run gemini."
  - q: "Should I use Gemini CLI or Antigravity CLI?"
    a: "Google's own README answers this. Use Antigravity CLI (the agy command) for Gemini 4 Argon and later, for free accounts, and for Google AI Pro and Ultra plans. Use Gemini CLI if your organization has Gemini Code Assist Standard or Enterprise, or Code Assist for GitHub on Google Cloud. Antigravity CLI is not open source; Gemini CLI still is."
---

Gemini CLI is Google's open-source (Apache-2.0) AI agent that runs in your terminal. You install it with `npm`, `npx`, or Homebrew, point it at a project, and describe what you want in plain language. It reads and writes files, runs shell commands, fetches URLs, and grounds answers with Google Search, driven by Gemini 3 and Gemini 2.5 models with a 1M-token context window.

As of November 2026 it is aimed at a narrower group than it launched for: developers whose organization already pays for Gemini Code Assist Standard or Enterprise on Google Cloud, plus teams with paid Gemini API or Vertex AI keys who want an open-source terminal agent they can read and fork. It is no longer the free way to try a coding agent. The personal-account free tier and Google AI Pro and Ultra access ended on June 18, 2026, and Google's README now sends those users, and anyone who wants the Gemini 4 models, to [Antigravity CLI](/tools/antigravity) (see the warning below).

## Highlights

- **1M-token context** — Gemini's large context window lets the agent reason over big codebases and long docs in a single session. The model picker offers Auto (Gemini 3) and Auto (Gemini 2.5); the docs say the CLI "has not been optimized for Gemini 4 Argon."
- **Built-in tools** — file system operations, shell execution, web fetch, and Google Search grounding ship in the box; no plugins required for the basics.
- **MCP support** — connect Model Context Protocol servers to extend the agent with databases, APIs, and custom tooling.
- **`GEMINI.md` context files** — drop project-level instructions in `GEMINI.md` so the agent follows your conventions automatically.
- **Multimodal input** — feed it PDFs, images, and sketches, not just text.
- **Checkpointing** — enable it in `settings.json` and the agent snapshots your project before file modifications; use `/restore` to roll back any step via a shadow Git repo, without touching your real Git history.

## In an AI-assisted workflow

Gemini CLI fits the terminal-native loop: open a repo, start the agent, and let it plan and apply changes while you review. A typical first run looks like this:

```bash
npm install -g @google/gemini-cli

# Code Assist license: set your Google Cloud project, then sign in
export GOOGLE_CLOUD_PROJECT="YOUR_PROJECT_ID"
# or a paid Gemini API key instead
export GEMINI_API_KEY="YOUR_API_KEY"

cd your-project
gemini
# then, at the prompt:
# > Add input validation to the signup handler and update the tests
```

It edits files on disk and runs your test or lint commands, so you review the diff rather than copy-paste from a chat window.

> [!TIP]
> Commit (or stage) your work before a large agentic task. Checkpointing is off by default — enable it in `settings.json` if you want `/restore` to undo the agent's edits — but either way a clean Git baseline makes review and rollback far easier.

## Good to know

Gemini CLI is open source under Apache-2.0 and runs on macOS, Windows, and Linux (Node.js 20+). Install via `npm`/`npx`, Homebrew, MacPorts, or Anaconda. There is no free tier: the personal-account allowance and Google AI Pro/Ultra access ended June 18, 2026 (see below). What still works is a Gemini Code Assist Standard or Enterprise license, a paid Gemini API key, or a Vertex AI key. The project is still maintained, with v0.71.1 released on November 24, 2026 and about 109,000 GitHub stars as of November 2026, but the README describes it as "maintained for enterprise Gemini Code Assist workflows on Google Cloud."

> [!WARNING]
> Google announced at I/O 2026 (**May 19, 2026**) that it was transitioning Gemini CLI to **Antigravity CLI**, and as of **June 18, 2026** Gemini CLI and the Gemini Code Assist IDE extensions **stopped serving requests** for free, Google AI Pro/Ultra, and individual Gemini Code Assist users. Gemini CLI keeps working through **paid Gemini API keys** and **Gemini Code Assist Standard/Enterprise** licenses, and the repo stays open source, but the free personal-account tier is gone. As of November 2026 the README also warns that Gemini CLI is **not optimized for Gemini 4** and should not be used to benchmark Gemini models. Antigravity CLI, the replacement, is **not** published as open source. Check the [repo](https://github.com/google-gemini/gemini-cli) and [Google's developer blog](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/) for the current state.

Read [Claude Code vs Gemini CLI](/guides/comparisons/claude-code-vs-gemini-cli) for a head-to-head breakdown, check [Best Claude Code Alternatives](/guides/comparisons/best-claude-code-alternatives-2026) for the full CLI landscape, or browse [Gemini CLI alternatives](/tools/gemini-cli/alternatives).
