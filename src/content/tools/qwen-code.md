---
name: "Qwen Code"
title: "Qwen Code"
description: "Alibaba Qwen's Apache-2.0 coding agent for the terminal, editor and desktop: OpenAI, Anthropic, Gemini and Qwen APIs, any provider, or local models."
date: "2026-09-11"
url: "https://qwenlm.github.io/qwen-code-docs/en/users/overview"
pricing: "open-source"
category: "cli"
repo: "https://github.com/QwenLM/qwen-code"
license: "Apache-2.0"
os: ["macOS", "Windows", "Linux"]
color: "green"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["cli", "agent", "open-source", "byo-model", "local-models"]
featured: false
sameAs:
  - "https://github.com/QwenLM/qwen-code"
  - "https://www.npmjs.com/package/@qwen-code/qwen-code"
  - "https://x.com/Alibaba_Qwen"
related: ["tool:claude-code", "tool:gemini-cli", "tool:opencode", "tool:ollama", "guide:ai-coding-agents-cli-2026", "guide:best-claude-code-alternatives-2026"]
alternativeTo: ["claude-code", "gemini-cli", "codex-cli", "opencode", "aider"]
summary: "Qwen Code is the Qwen team's free, Apache-2.0 coding agent, originally forked from Gemini CLI. It speaks OpenAI, Anthropic, Gemini and Qwen APIs, runs local models via Ollama or vLLM, and ships subagents, hooks, MCP and plan mode. The free Qwen OAuth quota ended April 15, 2026, so bring an API key, an Alibaba Cloud plan or a local model."
faq:
  - q: "What does Qwen Code add over Claude Code?"
    a: "It is Apache-2.0 open source and model-agnostic across four API protocols (OpenAI, Anthropic, Gemini and Qwen) plus local models. It adds Agent Arena for multi-model head-to-heads, a qwen serve daemon for multiple clients and chat-app channels, and its README claims parity on subagents, hooks, skills, MCP, plan mode and sandboxing."
  - q: "How do I install Qwen Code?"
    a: "Use the standalone installer script from the README, run npm install -g @qwen-code/qwen-code@latest (Node.js 22 or newer), or run brew install qwen-code on macOS and Linux. Then start qwen in your project and type /auth to connect a model provider."
  - q: "Is Qwen Code free?"
    a: "The agent is free and Apache-2.0 licensed, but the free Qwen OAuth model tier was discontinued on April 15, 2026. You now need an Alibaba Cloud Coding Plan or Token Plan, your own API key for an OpenAI-compatible, Anthropic, Google GenAI or Vertex AI endpoint, or a local model."
---

Qwen Code is the Qwen team's **multi-protocol coding agent**: one Apache-2.0 tool that talks to OpenAI, Anthropic, Gemini and Qwen APIs, any third-party provider, or a local model, from your terminal, editor, desktop or chat app. Pick it if you want a free, open-source alternative to [Claude Code](/tools/claude-code) with no vendor lock-in and you're ready to supply the model, because the free Qwen OAuth quota ended on April 15, 2026.

It began as a fork of Google's [Gemini CLI](/tools/gemini-cli) v0.8.2 and has been developed independently since v0.1. The shared ancestry matters less now: Gemini CLI is Gemini-only and lost consumer access on June 18, 2026, while Qwen Code works with nearly any model.

## Highlights

- **Open framework, open models.** Both the agent and the Qwen models are open source, with "no vendor lock-in", per the README.
- **Multi-protocol by design.** OpenAI, Anthropic, Gemini and Qwen APIs, any third-party provider, or local models through [Ollama](/tools/ollama) or vLLM, switchable at runtime.
- **Agent Arena.** Several models take on the same task head-to-head; the README lists it as a feature Claude Code lacks.
- **Daemon mode.** `qwen serve` shares one agent with multiple clients over HTTP and SSE (ACP); it is experimental as of September 2026.
- **Beyond the terminal.** A desktop app for macOS, Windows and Linux, a Web UI via `qwen serve --open` (also experimental), VS Code, Zed and JetBrains plugins, and chat channels for Telegram, DingTalk, WeChat and Feishu.
- **Automation and the usual agent kit.** Headless runs with `qwen -p "..."` and TypeScript, Python and Java SDKs, plus subagents, Agent Teams, Auto-Memory, Auto-Skills, hooks, MCP, plan mode, LSP, a sandbox and git worktrees.

## In an AI-assisted workflow

Install with the standalone script, npm or Homebrew, per the README:

```bash
curl -fsSL https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.sh | bash   # Linux / macOS
```

```powershell
irm https://qwen-code-assets.oss-cn-hangzhou.aliyuncs.com/installation/install-qwen-standalone.ps1 | iex          # Windows
```

```bash
npm install -g @qwen-code/qwen-code@latest   # requires Node.js 22+
brew install qwen-code                       # macOS / Linux
cd /path/to/your-project
qwen                                          # then run /auth inside the session
```

Then, inside the session:

```text
> /auth
> Map the modules in this repo and plan how to split billing into its own service; wait for my approval
> Run the test suite and fix the failures in src/payments
```

For a fully local setup, point it at Ollama. Our [guide to open-source and CLI coding agents](/guides/prompting/ai-coding-agents-cli-2026) covers when bringing your own model beats a first-party agent.

> [!TIP]
> Choose the model source before your first real session. The old `qwen auth` command is gone; run `/auth` inside `qwen` and pick an Alibaba Cloud plan, an API key or a local endpoint.

## How it compares to OpenCode, Gemini CLI and Codex CLI

| Tool | License | Models | Local models |
|---|---|---|---|
| Qwen Code | Apache-2.0 | OpenAI, Anthropic, Gemini, Qwen APIs | Ollama, vLLM |
| [OpenCode](/tools/opencode) | MIT | 75+ providers | Ollama, LM Studio |
| Gemini CLI | Apache-2.0 | Gemini only | No |
| [Codex CLI](/tools/codex-cli) | Apache-2.0 | OpenAI, compatible providers | Ollama, LM Studio via `--oss` |

OpenCode is the closest open-source peer, drawing on 75+ providers and offering an optional pay-as-you-go gateway. Codex CLI suits teams on OpenAI models, and Gemini CLI now serves only paid API-key, Vertex AI and enterprise users. Qwen Code's edge is reach: IDE plugins, a desktop app, chat channels and Agent Arena in one Apache-2.0 package.

## Good to know

- **License and activity:** Apache-2.0, with 27,767 GitHub stars as of September 11, 2026. npm `@qwen-code/qwen-code` 0.23.3 shipped on September 10, 2026.
- **Requirements:** the npm install needs Node.js 22+; the standalone installers cover Linux, macOS and Windows.
- **Paying for models:** the tool costs nothing. Model access now comes from an Alibaba Cloud Coding Plan (a fixed monthly subscription), a Token Plan (usage-based, for teams), API keys for OpenAI-compatible (including self-hosted), Anthropic, Google GenAI or Vertex AI endpoints, or a local model.
- **Benchmarks:** the README self-reports SWE-bench Verified results, such as a 77.33% average for v0.22.0 with Qwen 3.7 Max. Those are vendor numbers, so test on your own repo.

See where it lands against the field in [the best Claude Code alternatives](/guides/comparisons/best-claude-code-alternatives-2026).
