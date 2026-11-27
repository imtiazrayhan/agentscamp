---
name: "OpenCode"
description: "The open-source AI coding agent from Anomaly — a terminal TUI plus desktop and mobile apps, with 200+ model providers, parallel sessions, plugins, and MCP."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
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
related: ["tool:claude-code", "tool:codex-cli", "tool:aider", "tool:cursor", "tool:gemini-cli", "guide:ai-coding-agents-cli-2026"]
summary: "OpenCode is an MIT-licensed open-source coding agent from Anomaly (formerly SST) with about 229,600 GitHub stars as of November 2026. OpenCode 2 runs as a terminal TUI, desktop app and mobile app, works with 200+ model providers including local ones, and runs parallel sessions. Bring your own keys or use the optional OpenCode Console or Go plans."
faq:
  - q: "Is OpenCode free?"
    a: "The agent itself is free and MIT-licensed. You supply the model: start on the bundled free models with no account, bring an API key from any of 200+ supported providers, sign in with an existing GitHub Copilot or ChatGPT Plus/Pro subscription, run a local model, or pay OpenCode directly: OpenCode Console is its optional pay-as-you-go gateway of tested models (formerly Zen), and OpenCode Go is a subscription to open coding models from $10 a month as of November 2026."
  - q: "OpenCode vs Claude Code — what's the difference?"
    a: "Both are terminal-native coding agents. Claude Code is Anthropic's first-party agent, tuned tightly around Claude models with deep MCP/subagent/hooks extensibility. OpenCode is community-driven and provider-agnostic: any model (including local), desktop and mobile apps beside the terminal, and an open MIT codebase. Control and model freedom vs. first-party polish and tuning."
  - q: "Which repo is the real OpenCode?"
    a: "github.com/anomalyco/opencode. It moved from sst/opencode in January 2026 when SST rebranded to Anomaly. Note that github.com/opencode-ai/opencode is a different, archived project — The npm package also changed: OpenCode 2 installs as @opencode/cli, while the older opencode-ai package is the 1.x line."
audience: ["developers"]
---

OpenCode is the open-source AI coding agent, with about 229,600 GitHub stars as of November 2026. The current version is OpenCode 2. It runs as a polished terminal TUI: point it at a repository, describe the task, and it plans, edits files, and runs commands, with the model of your choice behind it. It's built by Anomaly (the company formerly known as SST) and licensed MIT.

The pitch is **control without compromise on UX**. Where most open-source agents trade polish for freedom, OpenCode ships a genuinely refined terminal experience — plus a desktop app (the README still labels it beta as of November 2026) and a mobile app — while staying fully bring-your-own-model.

## Highlights

- **200+ model providers** — Anthropic, OpenAI, Google, OpenRouter, and local OpenAI-compatible runtimes, driven by the Models.dev catalog. Switch providers without switching tools.
- **Sign in with subscriptions you already pay for** — authenticate with a GitHub Copilot or ChatGPT Plus/Pro account and use those models, no separate API key required.
- **No LSP in OpenCode 2** — OpenCode 1 loaded your language servers. Per the migration guide, V2 keeps `lsp` configuration but "does not run language servers, expose LSP tools, or produce LSP diagnostics"; it says to use the project's lint, typecheck, or compiler commands instead.
- **Parallel agents and plan mode** — run multiple sessions side by side, switch with `Tab` to the read-only `plan` agent before it edits, and extend behavior with plugins, MCP servers, and `SKILL.md` skills.
- **Session export** — `opencode session export <id>` writes a session as JSON, with `--sanitize` to redact transcript and file data, so a teammate can see exactly what the agent did.
- **Desktop app, mobile app, and SDK** — the same agent outside the terminal: a desktop app for macOS, Windows, and Linux, a mobile app that steers sessions running on your computer, and an SDK for scripts and CI.

## In an AI-assisted workflow

OpenCode slots into the same terminal-native loop as Claude Code or Codex CLI — open a repo, start the agent, review diffs as it works:

```bash
npm install -g @opencode/cli   # or: curl -fsSL https://opencode.ai/v2/install | bash
cd your-project
opencode
# then, at the prompt:
# > Add rate limiting to the public API routes and update the tests
```

> [!TIP]
> If you already pay for GitHub Copilot or ChatGPT, sign in with that account first — it's the fastest way to try OpenCode with frontier models before deciding whether to wire up per-token API keys or OpenCode Console. The bundled free models need no account at all.

## Good to know

OpenCode is MIT-licensed and runs on macOS, Linux, and Windows. Install OpenCode 2 via the shell script, npm/pnpm/bun (`@opencode/cli`), Homebrew (`brew install anomalyco/tap/opencode-v2`), pacman, mise, or nix; the docs say Windows package managers are not supported, so on Windows use the standalone binary or the desktop installer. OpenCode 1 and 2 share the `opencode` command, so remove a package-managed V1 install first, and read the migration guide if you rely on plugins, which use a new API.

**OpenCode Console** (the gateway formerly called Zen) is the team's optional hosted provider — a list of tested models billed pay-as-you-go from prepaid credits, with budgets that cap monthly spend per workspace and per member. **OpenCode Go** is the subscription alternative for open coding models: as of November 2026, Go costs $10 a month, Go Plus $40 a month, and Go Teams $20 per member a month with a two-member minimum. The agent never requires either.

> [!NOTE]
> Naming traps: the canonical repo is `anomalyco/opencode` (moved from `sst/opencode` in January 2026), while `opencode-ai/opencode` on GitHub is a **different, archived** project. On npm, OpenCode 2 is `@opencode/cli`; the older `opencode-ai` package is the 1.x line, which is what most pre-V2 tutorials install. That archived project lives on as [Crush](/tools/crush), Charm's source-available agent. Check you're installing from opencode.ai's own docs.
