---
title: "AI Coding Agents in 2026: The Open-Source & CLI Edition"
description: "Cursor and Windsurf vs the open-source agents — OpenCode, Cline, Aider, Codex CLI, and more. Who should bring their own model, and when to stay in the terminal."
author: "AgentsCamp"
date: 2026-06-03
updated: 2026-09-01
color: "green"
topics: ["coding-languages", "workflow-prompting"]
tags: ["comparison", "cli", "open-source", "agents", "byo-model"]
featured: false
summary: "The open-source and CLI coding agents trade polish for control: bring your own model (or run one locally), keep your code on your terms, and script the agent into CI. OpenCode is the category's most-starred breakout. Cline and Roo Code live in VS Code; OpenCode, Aider, and Codex CLI live in the terminal. Choose by where you work and how much you value model and data control."
keyTakeaways:
  - "Open-source agents are bring-your-own-model: you supply API keys or run a local model, so cost and data handling stay yours."
  - "Cline is the VS Code extension pick (Continue joined Cursor and its repo is read-only); OpenCode, Aider, and Codex CLI are terminal-native; Goose runs locally as a CLI/desktop agent."
  - "Aider auto-commits each change (git-native); Codex CLI sandboxes execution and leaves committing to you — a real workflow difference."
  - "The trade vs Cursor/Windsurf is polish and tab-completion UX for model freedom, scriptability, and no vendor lock-in."
  - "Almost all of them speak MCP, so your custom tools and data sources are portable across agents."
  - "Gemini CLI stopped serving free, AI Pro, and Ultra requests on June 18, 2026 — Google's migration path is the closed-source Antigravity CLI; paid API keys and enterprise Gemini Code Assist licenses keep access."
faq:
  - q: "What is the best open-source AI coding agent in 2026?"
    a: "By adoption, OpenCode — it's the most-starred coding agent in the category, with a polished terminal TUI, 75+ model providers (including local), and LSP-powered context. For an agent inside VS Code, Cline leads (Roo Code, a popular Cline fork, shut down in May 2026). In the terminal, Aider (git-native, auto-commits) and OpenAI's Codex CLI (sandboxed, model-switching) remain strong picks, and Goose is the local, extensible option."
  - q: "Why choose an open-source agent over Cursor or Copilot?"
    a: "Three reasons: model freedom (bring any provider's key or run a local model), data control (your code goes only where you send it), and scriptability (run the agent headlessly in CI). The trade-off is less out-of-the-box polish than a proprietary AI-first editor."
  - q: "What's the difference between Aider and Codex CLI?"
    a: "Both are terminal agents that edit files on disk. Aider commits each change to git automatically, so every step is reviewable and revertible. Codex CLI runs edits inside an OS-level sandbox with two-layer approval controls and leaves staging and committing to you. Aider is model-agnostic; Codex CLI is built around OpenAI's models."
  - q: "Can I use these without paying a subscription?"
    a: "The tools themselves are free and open source, but most need a model. You either pay a provider per token via your own API key, sign in with a subscription you already have (OpenCode accepts GitHub Copilot and ChatGPT accounts), or run a local model with Ollama or LM Studio for no per-token cost. Note that Gemini CLI's famously generous free tier ended June 18, 2026 — that free agent loop now lives in Antigravity CLI."
related: ["tool:opencode", "tool:cline", "tool:aider", "tool:codex-cli", "tool:roo-code", "tool:continue", "tool:gemini-cli", "tool:antigravity", "tool:goose", "tool:cursor", "tool:windsurf", "tool:claude-code"]
---

The proprietary AI editors — [Cursor](/tools/cursor), [Windsurf](/tools/windsurf), [GitHub Copilot](/tools/github-copilot) — are the most polished way to get AI into your day. But a large and fast-growing tier of **open-source and CLI agents** wins on a different axis: **control.** You bring your own model (or run one locally), your code goes only where you choose, and you can script the agent into CI. This guide compares that tier and helps you decide when it's the right call. For the proprietary editors head-to-head, see [Cursor vs Claude Code vs Copilot vs Windsurf](/guides/prompting/cursor-vs-claude-code-vs-copilot-vs-windsurf-2026).

## Why pick an open-source / CLI agent

- **Bring your own model (BYO).** Point the agent at Anthropic, OpenAI, Google, OpenRouter, AWS Bedrock, or a local runtime. You're not locked to one provider's models or roadmap.
- **Data control.** Your source is sent only to the provider you configure — or never leaves your machine if you run a local model.
- **Cost on your terms.** Pay a provider per token, lean on a free tier, or run locally for no per-token cost.
- **Scriptable.** Terminal agents run headlessly, so the same agent that helps you interactively can run in CI or a batch job.
- **No lock-in.** Open licenses (most are Apache-2.0 or MIT) and MCP support mean your tools and workflows are portable.

The cost is polish: you won't get the same seamless tab-completion and onboarding as Cursor, and you'll do more configuration.

## The field, by form factor

### In your editor (VS Code extensions)

- **[Cline](/tools/cline)** — an open-source autonomous agent that runs as a VS Code extension. It plans, edits files, and runs commands with **human-in-the-loop approvals** on every change, is fully **BYO-model** (including local via Ollama/LM Studio), supports **MCP**, and shows edits as diffs. Also available for JetBrains and as a CLI.
- **[Roo Code](/tools/roo-code)** — a Cline fork built around **customizable modes** (code, architect, ask, debug), each with its own behavior and tools. **Sunset (May 2026):** the maintainers archived the project on May 15, 2026 and now point users to Cline — reach for Cline instead.
- **[Continue](/tools/continue)** — an open-source assistant for VS Code and JetBrains focused on **composable** autocomplete and chat with deep customization. It leans more "building block you configure" than "hands-off agent." **Status (mid-2026): joined Cursor.** The continuedev/continue repository is read-only and no longer actively maintained (final release v2.0.0, June 19, 2026), and the team recommends the Continue CLI over the JetBrains plugin — fine to keep running, not a new bet.

### In your terminal (CLI agents)

- **[OpenCode](/tools/opencode)** — the **most-starred open-source coding agent** (~203k GitHub stars as of September 2026) and the category's breakout. A genuinely polished terminal TUI that's fully **provider-agnostic** — 75+ providers including local models — loads your **language servers** for symbol-level context, runs **parallel sessions**, and can sign in with an existing **GitHub Copilot or ChatGPT subscription** instead of an API key.
- **[Aider](/tools/aider)** — a terminal pair-programmer that's **git-native**: it edits files on disk and **commits each change** with a descriptive message, so every step is reviewable and `git revert`-able. It builds a repo map for context and is **model-agnostic** — see [Aider vs Claude Code](/guides/comparisons/aider-vs-claude-code) for the head-to-head. Development has slowed: the last release (0.86.2) shipped February 12, 2026.
- **[Codex CLI](/tools/codex-cli)** — OpenAI's open-source, Rust-based terminal agent with a **two-layer security model** (sandbox modes plus approval policies). It defaults to workspace-scoped writes and no network, supports **model switching** and **MCP**, and has a headless `codex exec` for CI. Unlike Aider, it **doesn't auto-commit** — it leaves staging to you.
- **[Gemini CLI](/tools/gemini-cli)** — Google's open-source terminal agent, long notable for a **generous free tier**, large context windows, and MCP support. **Sunset (June 2026):** as of June 18, 2026 it stopped serving requests for free, AI Pro, and Ultra users, with Google folding the effort into [Antigravity](/tools/antigravity) and its closed-source Antigravity CLI (paid API keys and enterprise Gemini Code Assist licenses keep access, and the repo stays open source).
- **[Goose](/tools/goose)** — an open-source, extensible agent that runs **locally** (CLI and desktop), BYO-model and MCP-first, aimed at developers who want an on-machine autonomous agent. Block donated it to the Agentic AI Foundation in April 2026; the repo now lives at `aaif-goose/goose`.

## How to choose

- **You want maximum model freedom with the most momentum behind it** → **OpenCode**. Any provider or local model, LSP-grade context, and the largest community in the category.
- **You live in VS Code and want approvals on every step** → **Cline**.
- **You live in the terminal and want git as the safety net** → **Aider**. Auto-commits make every step reversible.
- **You live in the terminal and want sandboxed execution + model switching** → **Codex CLI**. Strong guardrails, headless mode for CI.
- **You want the lowest cost to start** → a BYO agent pointed at a **local model** via Ollama/LM Studio, or **OpenCode** signed in with a Copilot/ChatGPT plan you already pay for. (Gemini CLI's free tier ended June 18, 2026; its free agent loop moved to Antigravity CLI.)
- **You want a configurable assistant, not a hands-off agent** → **Continue** — with the caveat that it joined Cursor and its repo is read-only, so it's a keep-running choice rather than a new adoption.
- **You want a local-first, extensible agent** → **Goose**.

### When the proprietary editors still win

If you value a frictionless inner loop — best-in-class tab completion, zero configuration, polished multi-file review — **Cursor** and **Windsurf (Devin Desktop)** are still the smoother experience, at the cost of model/data control and a paid plan; Google's [Antigravity](/tools/antigravity) ($0 for individuals) is the newest proprietary entrant, an agent-first IDE with multi-agent orchestration. And if you want a deeply agentic, programmable workflow but don't want to manage model keys and configuration yourself, [Claude Code](/tools/claude-code) sits between the two worlds: a first-party terminal agent with MCP, subagents, and hooks.

> [!TIP]
> The choice isn't permanent. Because nearly all of these speak **MCP**, the custom tools and data sources you build for one agent move to the next. Invest in your MCP servers and `AGENTS.md`/`CLAUDE.md` context, and switching agents becomes cheap.

> [!NOTE]
> "Open source" refers to the agent, not the model. You still need a model behind it — a hosted API key, a free tier, or a local model you run yourself.

New to running a model locally or wiring up your own keys? The MCP and configuration guides in the [Guides](/guides) section cover the setup these agents share.

## Continue exploring

- [Scaffold CLI Command](/commands/scaffold/scaffold-cli) — Scaffold a new subcommand for an existing CLI with argument parsing, help text, input validation, and correct exit codes.
- [graphql-architect](/agents/core-development/graphql-architect) — Use this agent to design GraphQL schemas and resolvers — types, nullability, connections, dataloaders, federation, depth/complexity limits.
- [Java Pro](/agents/language-specialists/java-pro) — Use this agent for idiomatic, modern Java (17/21+) — records, sealed types, pattern matching, virtual threads and structured concurrency, the Streams API, and JVM/GC performance.
- [php-pro](/agents/language-specialists/php-pro) — Use this agent for idiomatic, modern PHP 8.3+ — strict types, enums, readonly and promoted properties, Composer/PSR-4 autoloading, and safe PDO data access.
- [Amp](/tools/amp) — Sourcegraph's agentic coding tool — a CLI and editor extensions tuned for frontier-model coding.
- [Kilo Code](/tools/kilo-code) — Open-source AI coding agent extension for VS Code and JetBrains, built as a superset of Roo Code and Cline, with bring-your-own-key and zero model markup.
- [SWE-agent](/tools/swe-agent) — Open-source autonomous coding agent from Princeton/Stanford that turns an LLM into a software engineer to fix real GitHub issues.
