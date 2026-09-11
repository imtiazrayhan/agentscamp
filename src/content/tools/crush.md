---
name: "Crush"
title: "Crush"
description: "Charm's terminal coding agent: nearly any model, including local ones, switched mid-session, with LSP context, MCP and Agent Skills. Source-available (FSL)."
date: "2026-09-11"
url: "https://github.com/charmbracelet/crush"
pricing: "free"
category: "cli"
repo: "https://github.com/charmbracelet/crush"
license: "FSL-1.1-MIT"
os: ["macOS", "Windows", "Linux", "Android"]
color: "green"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["cli", "agent", "terminal", "source-available", "byo-model"]
featured: false
sameAs:
  - "https://github.com/charmbracelet/crush"
  - "https://www.npmjs.com/package/@charmland/crush"
  - "https://x.com/charmcli"
  - "https://bsky.app/profile/charm.land"
related: ["tool:opencode", "tool:claude-code", "tool:aider", "guide:agent-skills-open-standard", "guide:ai-coding-agents-cli-2026", "guide:best-claude-code-alternatives-2026"]
alternativeTo: ["claude-code", "opencode", "aider", "codex-cli", "gemini-cli"]
summary: "Crush is Charm's free terminal coding agent. It continues opencode-ai/opencode (archived; last push September 2025), not today's OpenCode. It runs nearly any model, including local ones, switches models mid-session and adds LSP context, MCP and Agent Skills. It is source-available under FSL-1.1-MIT, not OSI open source; releases turn MIT after two years."
faq:
  - q: "Is Crush the same as OpenCode?"
    a: "No. Crush continues the original opencode-ai/opencode project, whose GitHub repo is archived (last push September 2025) and says the project has continued under the name Crush, developed by the original author and the Charm team. The active OpenCode at opencode.ai is a separate MIT-licensed project from Anomaly at anomalyco/opencode, and confusingly its npm package is named opencode-ai."
  - q: "How do I install Crush?"
    a: "Run brew install charmbracelet/tap/crush, npm install -g @charmland/crush, or winget install charmbracelet.crush on Windows; Arch, FreeBSD, Scoop and go install routes also exist. Then run crush and either choose a Hyper model from the model picker or press ctrl+l to pick a provider and paste an API key."
  - q: "Is Crush free and open source?"
    a: "It is free to use with your own API keys or local models, and as of September 2026 Charm's optional Hyper provider has a free tier of 100 credits a month. It is source-available under FSL-1.1-MIT, not OSI open source: any use except a competing one is permitted, and each release becomes MIT two years after it ships."
---

Crush is Charm's **bring-any-model terminal agent**: a TUI coding agent that works with nearly any model through OpenAI- or Anthropic-compatible APIs, including local ones, and can switch models mid-session while keeping context. Pick it over [Claude Code](/tools/claude-code) if you want that model freedom, local models or the widest platform reach (Android and the BSDs included), and a source-available license suits you.

> [!NOTE]
> Crush is not OpenCode. The original `opencode-ai/opencode` repo is archived (last push September 2025), and its README says the project "has continued under the name Crush, developed by the original author and the Charm team." The active [OpenCode](/tools/opencode) is a separate MIT project from Anomaly at `anomalyco/opencode`, whose npm package happens to be named `opencode-ai`.

## Highlights

- **Any model, switched mid-session.** Dozens of providers, including Anthropic, OpenAI, Gemini, OpenRouter, Groq, Bedrock, Vertex and Azure, with Catwalk as an open provider database.
- **Local models, auto-discovered.** Provider types `llamacpp`, `omlx`, `lmstudio`, `litellm` and `ollama`.
- **LSP-enhanced context.** Crush uses your language servers for extra context on the code.
- **MCP with built-in OAuth.** Servers connect over stdio, http or sse.
- **Agent Skills, Claude folders included.** It follows the Agent Skills standard and also reads `~/.claude/skills/` and project `.claude/skills` directories.
- **Widest OS reach.** macOS, Linux, Windows (PowerShell and WSL), Android, FreeBSD, OpenBSD and NetBSD, plus `crush serve` as a shared backend for multiple clients.

## In an AI-assisted workflow

Pick one install route from the README:

```bash
brew install charmbracelet/tap/crush
npm install -g @charmland/crush
winget install charmbracelet.crush    # Windows
go install github.com/charmbracelet/crush@latest
```

Start with `crush`. The quickest setup is to choose a Hyper model from the model picker; otherwise press `ctrl+l`, pick a provider and paste an API key. Configuration lives in a Bash-style `crushrc`. Then prompt it like any terminal agent:

```text
> Read the failing output in test.log and fix the tokenizer in internal/lexer
> Add a --json flag to the export command, with tests
```

Because Crush reads `.claude/skills` and `~/.claude/skills/`, skills you've installed for Claude Code are visible to it too. Our [Agent Skills standard guide](/guides/skills/agent-skills-open-standard) explains the shared `SKILL.md` format.

> [!TIP]
> Crush sends pseudonymous metrics unless you opt out with `CRUSH_DISABLE_METRICS=1` or `DO_NOT_TRACK=1`. Keep `--yolo`, which skips permission prompts, for disposable environments.

## How it compares to OpenCode and Aider

| Tool | License | Models | Platforms |
|---|---|---|---|
| Crush | FSL-1.1-MIT (source-available) | Nearly any, incl. local | macOS, Linux, Windows, Android, BSDs |
| OpenCode | MIT | 75+ providers, incl. local | macOS, Linux, Windows (WSL advised) |
| [Aider](/tools/aider) | Apache-2.0 | Almost any LLM, incl. local | Python package |

OpenCode is the closest peer: MIT-licensed, with a desktop app in beta as of September 2026 and optional Zen (pay-as-you-go) and Go (subscription) model access. Crush trades the OSI license for wider OS reach, mid-session model switching and its own optional Hyper provider. Aider is the git-first choice, turning every edit into a commit, though its release cadence has slowed (last PyPI release February 2026).

## Good to know

- **License:** GitHub's license API reports "Other"; LICENSE.md is the Functional Source License 1.1 with an MIT future license (FSL-1.1-MIT). It permits any use except a "Competing Use" and grants MIT on the second anniversary of each release.
- **Activity:** v0.93.1 shipped on September 9, 2026, with 28,014 GitHub stars as of September 11, 2026.
- **Packages:** Homebrew, npm, winget, Scoop, Arch (`yay -S crush-bin`), FreeBSD (`pkg install crush`), Debian and RPM packages, and `go install`, which also works on illumos and, with a build tag, Oracle Solaris.
- **Pricing:** Crush costs nothing with your own keys or local models. Plans, as of September 2026 from Charm's Hyper pricing page: Free ($0 a month, 100 Hypercredits monthly), Subscription ($20 a month, 250 Hypercredits refreshing daily), and prepaid bundles of $5, $10 or $20 for 100, 200 or 400 credits that never expire; one Hypercredit is currently 5 cents. Hyper serves open-source, coding-optimized models with zero data retention.

For more options, see [the best Claude Code alternatives](/guides/comparisons/best-claude-code-alternatives-2026) and our [guide to open-source and CLI coding agents](/guides/prompting/ai-coding-agents-cli-2026).
