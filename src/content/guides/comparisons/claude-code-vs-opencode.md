---
title: "Claude Code vs OpenCode: First-Party vs Open Source (2026)"
description: "Claude Code vs OpenCode compared: licence, models, auth and pricing paths, config files, MCP setup, local models, and where each one loses. Checked Nov 2026."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["coding-languages", "workflow-prompting"]
tags: ["comparison", "claude-code", "opencode", "open-source", "versus"]
featured: false
summary: "Pick Claude Code if you want Anthropic's models in the harness Anthropic builds for them and you already pay for a Claude plan. Pick OpenCode if you want an MIT-licensed agent that runs any of 200+ providers, a local Ollama model, or a ChatGPT or GitHub Copilot subscription you already have."
keyTakeaways:
  - "Claude Code is proprietary and needs a paid Claude plan, a Console account or a cloud provider; OpenCode is MIT-licensed, built by Anomaly, and starts on free models with no account."
  - "OpenCode's catalog comes from Models.dev and covers 200+ providers, including a local Ollama server it detects on its own."
  - "OpenCode has four ways to pay: your own API keys, sign-in with ChatGPT Plus/Pro or GitHub Copilot, pay-as-you-go OpenCode Console credits, or an OpenCode Go subscription."
  - "Both read Markdown instruction files and speak MCP: `CLAUDE.md` and `.mcp.json` on one side, `AGENTS.md` and `opencode.jsonc` on the other."
  - "Only OpenCode can keep prompts and code on your machine, by pairing it with a local model. Claude Code always calls a hosted Claude endpoint."
faq:
  - q: "Is OpenCode as good as Claude Code?"
    a: "It depends on the model you connect. OpenCode is a harness, so results follow the model: with a frontier model through an API key it handles the same multi-file tasks, and with a small local model it will not. Neither vendor publishes a like-for-like benchmark of the two harnesses on the same model, so test both on one real task from your own backlog before deciding."
  - q: "Can OpenCode use Claude models?"
    a: "Yes. Anthropic is a built-in provider, and the configuration docs use `anthropic/claude-sonnet-5-5` as their example model. You connect with `/connect` and an Anthropic API key, and pay Anthropic per token. What you do not get is Claude Code's own extension surface, such as its hooks, subagents and plugin marketplace."
  - q: "Is OpenCode free?"
    a: "The agent is free and MIT-licensed, and OpenCode's site says you can start on its free models with no account. Beyond that you pay whoever serves the model: a provider's API, a ChatGPT or Copilot subscription you sign in with, OpenCode Console credits, or an OpenCode Go plan. The current Go prices are on the OpenCode tool page."
  - q: "What happened to OpenCode Zen?"
    a: "The pay-as-you-go gateway is now documented as OpenCode Console: the old Zen docs URL loads a page titled \"Console models\", and the provider appears in `/connect` as the OpenCode pay-as-you-go provider. The idea is unchanged: a list of models the OpenCode team has tested, billed per request from prepaid credits."
related: ["tool:claude-code", "tool:opencode", "guide:claude-code-vs-codex-cli", "guide:ai-coding-agents-cli-2026", "guide:claude-code-vs-cursor", "tool:ollama"]
audience: ["developers"]
sources:
  - title: "OpenCode repository"
    url: "https://github.com/anomalyco/opencode"
    publisher: "Anomaly"
  - title: "OpenCode home page"
    url: "https://opencode.ai/"
    publisher: "Anomaly"
  - title: "OpenCode providers"
    url: "https://opencode.ai/docs/providers/"
    publisher: "Anomaly"
  - title: "OpenCode Go"
    url: "https://opencode.ai/docs/console/go"
    publisher: "Anomaly"
  - title: "OpenCode configuration"
    url: "https://opencode.ai/docs/config/"
    publisher: "Anomaly"
  - title: "Claude Code setup"
    url: "https://code.claude.com/docs/en/setup"
    publisher: "Anthropic"
  - title: "Claude Code model configuration"
    url: "https://code.claude.com/docs/en/model-config"
    publisher: "Anthropic"
---

Claude Code and OpenCode are both terminal coding agents that plan, edit files and run commands. They differ in who controls the model. [Claude Code](/tools/claude-code) is Anthropic's agent for Anthropic's models. [OpenCode](/tools/opencode) is an MIT-licensed agent from Anomaly that leaves the model choice to you.

## The short answer

- **You already pay for Claude and want the vendor's own harness, with hooks, subagents and plugins**: Claude Code.
- **You want to choose or change the model, including a local one**: OpenCode.
- **You have a ChatGPT Plus/Pro or GitHub Copilot subscription and no API budget**: OpenCode, signed in with that subscription.
- **Code and prompts must not leave your machine**: OpenCode with a local model. Claude Code cannot do this.

## Side by side

| | Claude Code | OpenCode |
| --- | --- | --- |
| Maker | Anthropic | Anomaly |
| Licence | Proprietary ("All rights reserved") | MIT |
| Source code | Not published | Public on GitHub, about 229,000 stars as of November 2026 |
| Models | Claude: Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.2 | 200+ providers through Models.dev, plus local models |
| Free to start | No. The free claude.ai plan excludes Claude Code | Yes, on OpenCode's free models, no account needed |
| Ways to pay | Pro, Max, Ultra, Team or Enterprise plan; Console API billing; Bedrock, Google Cloud, Foundry | Provider API keys; ChatGPT Plus/Pro or GitHub Copilot sign-in; OpenCode Console credits; OpenCode Go, Go Plus or Go Teams subscription |
| Runs fully local | No | Yes, with Ollama or another local OpenAI-compatible server |
| Instruction file | `CLAUDE.md` | `AGENTS.md`, plus an `instructions` list in config |
| Config file | `settings.json`, `.mcp.json` | `opencode.jsonc` (or `.json`) |
| Built-in agents | Main agent plus configurable subagents | `build` and `plan` (switch with Tab), plus a `general` subagent |
| Extension points | MCP, subagents, hooks, skills, plugins | MCP, custom agents, commands, skills, plugins |
| Surfaces | Terminal, VS Code, JetBrains, desktop app, web | Terminal, desktop app, web via `opencode pair` |

OpenCode also ships built-in LSP servers for common languages and feeds their diagnostics back to the agent. Its desktop app is labelled beta in the README as of November 2026.

## Install and first run

```bash
# Claude Code
curl -fsSL https://claude.ai/install.sh | bash
claude

# OpenCode
curl -fsSL https://opencode.ai/v2/install | bash
# or: npm i -g @opencode/cli@latest
opencode
```

In OpenCode you then run `/connect` to pick a provider and `/models` to pick a model. In Claude Code you sign in once and switch models with `/model`.

## Configuration, one example each

Pinning a model. Claude Code takes an alias or a full model ID in `settings.json`:

```json
{
  "model": "opus"
}
```

OpenCode uses a `provider/model` reference in `opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-5-5",
}
```

Adding a remote MCP server is one command in each:

```bash
claude mcp add --transport http notion https://mcp.notion.com/mcp
opencode mcp add context7 --url https://mcp.context7.com/mcp
```

Going local is where OpenCode has no counterpart. Start Ollama and OpenCode finds it:

```bash
ollama serve
ollama pull qwen3:8b
opencode   # the model now appears under /models
```

The OpenCode docs say it probes `http://127.0.0.1:11434` and adds the models it discovers without any account connection. See [Ollama](/tools/ollama) for the runtime itself.

## How the pricing models differ

Claude Code has two shapes: a flat subscription whose usage limits you share with the Claude apps, or per-token billing through a Console key or a cloud provider. The [Claude Code tool page](/tools/claude-code) lists the plans.

OpenCode has four, and you can mix them per model:

1. **Your own API key** for any catalog provider, billed by that provider.
2. **A subscription you already hold.** Connecting OpenAI with "Sign in with ChatGPT" counts usage against a ChatGPT Plus or Pro plan, and the site also advertises GitHub Copilot sign-in.
3. **OpenCode Console**, the pay-as-you-go gateway that used to be documented as Zen: prepaid credits, charged per request, across models the team has tested, including Claude and GPT models.
4. **OpenCode Go**, a monthly subscription to open coding models with a shared allowance. The Go docs define a five-hour limit at 20% of the monthly allowance and a weekly limit at 50%.

Current Go prices are on the [OpenCode tool page](/tools/opencode).

## Where each one loses

**Claude Code** is closed source, so you cannot audit or fork the agent. It has no free tier. It is designed around Claude models; there are documented routes through gateways and cloud providers ([Claude Code with other models](/guides/configuration/claude-code-with-other-models)), but switching vendors per task is not what it is for. Every request goes to a hosted endpoint.

**OpenCode** makes you the integrator. Output quality depends on the model you connect, and a small local model will not finish the tasks a frontier model does. You also own the upkeep: provider keys, a model choice per task, and permission rules written in OpenCode's own format, so policy you encoded as Claude Code [hooks](/guides/configuration/claude-code-hooks) has to be rebuilt. The project moves fast too. The documented install command and npm package both changed during 2026, so check the current docs before you script an install.

## How to choose

Ask who pays for inference today. If your company already buys Claude seats, Claude Code costs nothing extra to try and gives you the features Anthropic documents and supports: [subagents](/guides/getting-started/getting-started-with-agents), [CI runs](/guides/advanced/claude-code-ci-github-actions), and the [Agent SDK](/guides/advanced/claude-agent-sdk-tutorial) built on the same loop.

If the constraint is control, OpenCode is the pick: an air-gapped repository, a client who forbids sending code to a US provider, a budget that only covers the Copilot seats you already have, or a wish to try each new model the week it ships.

The two also coexist. Both read plain Markdown instructions, so a repository can carry a `CLAUDE.md` and an `AGENTS.md` with the same conventions, and the same MCP servers can be registered in both. Running Claude Code for daily work and OpenCode for local-model or other-provider jobs is a reasonable setup, not a compromise.

For the other open-source terminal agents, such as Aider and Cline, see [the CLI agents roundup](/guides/prompting/ai-coding-agents-cli-2026). For OpenAI's agent, see [Claude Code vs Codex CLI](/guides/comparisons/claude-code-vs-codex-cli).
