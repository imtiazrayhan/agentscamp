---
name: "OpenCode"
description: "The open-source AI coding agent — a terminal TUI from Anomaly with 75+ model providers, LSP-powered context, parallel agents, and shareable sessions."
date: 2026-06-11
url: "https://opencode.ai"
pricing: "open-source"
category: "cli"
repo: "https://github.com/anomalyco/opencode"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "green"
topics: ["coding-languages"]
tags: ["cli", "agent", "terminal", "open-source", "byo-model"]
featured: true
alternativeTo: ["claude-code", "codex-cli", "gemini-cli", "aider"]
sameAs:
  - "https://github.com/anomalyco/opencode"
  - "https://opencode.ai/docs/"
  - "https://x.com/opencode"
related: ["claude-code", "codex-cli", "aider", "cursor", "gemini-cli", "ai-coding-agents-cli-2026"]
summary: "OpenCode is the most-starred open-source coding agent (~173k GitHub stars by mid-2026) — a terminal TUI from Anomaly (formerly SST) that works with 75+ model providers including local ones, loads language servers for real code intelligence, runs parallel sessions, and shares sessions via links. MIT-licensed; bring your own keys or use the optional Zen gateway."
faq:
  - q: "Is OpenCode free?"
    a: "The agent itself is free and MIT-licensed. You supply the model: bring an API key from any of 75+ supported providers, sign in with an existing GitHub Copilot or ChatGPT Plus/Pro subscription, run a local model, or use OpenCode Zen — the team's optional pay-as-you-go gateway of tested models."
  - q: "OpenCode vs Claude Code — what's the difference?"
    a: "Both are terminal-native coding agents. Claude Code is Anthropic's first-party agent, tuned tightly around Claude models with deep MCP/subagent/hooks extensibility. OpenCode is community-driven and provider-agnostic: any model (including local), LSP-powered code intelligence, and an open MIT codebase. Control and model freedom vs. first-party polish and tuning."
  - q: "Which repo is the real OpenCode?"
    a: "github.com/anomalyco/opencode. It moved from sst/opencode in January 2026 when SST rebranded to Anomaly. Note that github.com/opencode-ai/opencode is a different, archived project — confusingly, though, the npm package for the real OpenCode is named opencode-ai."
---

OpenCode is the open-source AI coding agent — by mid-2026 the most-starred in the category (~173k GitHub stars) and the first project to seriously disrupt the Cursor/Claude Code duopoly. It runs as a polished terminal TUI: point it at a repository, describe the task, and it plans, edits files, and runs commands, with the model of your choice behind it. It's built by Anomaly (the company formerly known as SST) and licensed MIT.

The pitch is **control without compromise on UX**. Where most open-source agents trade polish for freedom, OpenCode ships a genuinely refined terminal experience — plus a desktop app in beta and IDE extensions — while staying fully bring-your-own-model.

## Highlights

- **75+ model providers** — Anthropic, OpenAI, Google, OpenRouter, and local OpenAI-compatible runtimes, driven by the Models.dev catalog. Switch providers without switching tools.
- **Sign in with subscriptions you already pay for** — authenticate with a GitHub Copilot or ChatGPT Plus/Pro account and use those models, no separate API key required.
- **LSP integration** — OpenCode loads your language servers, so the agent works from real symbol-level code intelligence rather than text search alone.
- **Parallel agents and plan mode** — run multiple sessions side by side, have the agent plan before it edits, and extend behavior with plugins.
- **Shareable sessions** — generate a link to a session so a teammate can see exactly what the agent did and why.
- **Desktop app (beta) and IDE extensions** — the same agent core outside the terminal when you want it.

## In an AI-assisted workflow

OpenCode slots into the same terminal-native loop as Claude Code or Codex CLI — open a repo, start the agent, review diffs as it works:

```bash
npm install -g opencode-ai   # or: curl -fsSL https://opencode.ai/install | bash
cd your-project
opencode
# then, at the prompt:
# > Add rate limiting to the public API routes and update the tests
```

> [!TIP]
> If you already pay for GitHub Copilot or ChatGPT, sign in with that account first — it's the fastest way to try OpenCode with frontier models before deciding whether to wire up per-token API keys or the Zen gateway.

## Good to know

OpenCode is MIT-licensed and runs on macOS, Linux, and Windows (native installers exist, but the docs recommend WSL for the best Windows experience). Install via the shell script, npm/pnpm/bun, Homebrew (`brew install anomalyco/tap/opencode`), pacman, choco, or scoop. **OpenCode Zen** is the team's optional hosted gateway — a curated list of tested models billed pay-as-you-go with per-workspace spend limits; the agent never requires it.

> [!NOTE]
> Naming traps: the canonical repo is `anomalyco/opencode` (moved from `sst/opencode` in January 2026), while `opencode-ai/opencode` on GitHub is a **different, archived** project — yet the real npm package is `opencode-ai`. Check you're installing from opencode.ai's own docs.
