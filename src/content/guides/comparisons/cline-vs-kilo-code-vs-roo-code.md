---
title: "Cline vs Kilo Code vs Roo Code (2026): Which to Use After Roo's Shutdown"
description: "Roo Code shut down in May 2026. Cline vs Kilo Code compared on license, agents, checkpoints, BYOK and pricing model, plus how Roo users migrate."
seoTitle: "Cline vs Kilo Code vs Roo Code (2026): Which to Use Now Roo Is Gone"
author: "Imtiaz Rayhan"
date: "2026-09-11"
reviewed: "2026-09-11"
color: "green"
topics: ["coding-languages", "ai-agents-systems"]
audience: ["developers"]
tags: ["comparison", "versus", "vscode", "open-source", "coding-agents", "migration"]
keywords: ["cline vs kilo code vs roo code", "cline vs roo code", "roo code alternative", "kilo code alternatives", "cline alternatives", "is cline free", "roo code vs continue", "continue alternatives"]
summary: "Roo Code is no longer maintained: it shut down on May 15, 2026, so the real choice is Cline or Kilo Code. Cline is the original Apache-2.0 agent, with Plan and Act, checkpoints and the most surfaces. Kilo Code, a former Roo fork rebuilt on OpenCode, is the closer fit for Roo users: specialized agents, parallel runs and a published migration guide."
keyTakeaways:
  - "Roo Code is no longer maintained: the extension shut down on May 15, 2026, the repo is archived at v3.54.0, and its README points users to ZooCode, a community fork, and to Cline."
  - "Cline is the original project and the most adopted of the three, with about 5.3 million VS Code Marketplace installs as of September 2026, Plan and Act modes, checkpoints, and a CLI, desktop app and SDK."
  - "Kilo Code started as a Roo fork in 2025, but its current extension, v7, was rebuilt on the OpenCode server and is MIT-licensed. Its agents are Code, Plan, Ask and Debug, and Orchestrator mode is deprecated."
  - "Neither maintained option is bring-your-own-key only any more: Cline sells inference at cost plus an optional ClinePass subscription, and Kilo routes 500+ models through its Gateway at provider rates with no markup."
  - "Kilo publishes a file-by-file Roo migration guide; Cline offers no equivalent we could locate, so rules and modes move to Cline by hand."
  - "Continue is not a fallback: Cursor acquired it in June 2026, user data was deleted, and the repo is read-only after a final v2.0.0 release."
faq:
  - q: "Is Roo Code still maintained?"
    a: "No. The Roo Code extension shut down on May 15, 2026, and its GitHub repository is archived with v3.54.0 as the final release. The README points users to ZooCode, a community fork, and to Cline, and asks paying users with billing questions to write to billing@roocode.com."
  - q: "What is the best Roo Code alternative?"
    a: "For most Roo users it is Kilo Code, which started as a Roo fork, keeps several specialized agents (Code, Plan, Ask and Debug), and publishes a migration guide that maps Roo modes, rules and MCP config. Choose Cline if you want the project Roo was originally forked from, or ZooCode if you want to stay on Roo's own codebase under community maintenance."
  - q: "Is Cline free?"
    a: "The Cline extension and CLI are free and open source under Apache-2.0 for individual developers. You pay for model usage, either with your own provider key, through Cline's own provider at cost, or with the optional ClinePass subscription. Local models through Ollama or LM Studio avoid API costs entirely."
  - q: "Cline vs Roo Code: what is the difference?"
    a: "Roo Code was a fork of Cline that added a mode system (Code, Architect, Ask, Debug and custom modes), and it shut down in May 2026. Cline is still actively developed, with Plan and Act modes, checkpoints, an MCP marketplace, and surfaces that now include a CLI, a desktop app and an SDK."
  - q: "What are the best Cline alternatives in VS Code?"
    a: "Kilo Code is the closest open-source alternative, with multiple agents, parallel agents in git worktrees and a gateway that charges provider rates. GitHub Copilot's agent mode and Anthropic's Claude Code are the main commercial options in VS Code. Roo Code shut down in May 2026 and Continue was acquired by Cursor in June 2026, so neither is a live option."
  - q: "What should Continue users switch to?"
    a: "Continue was acquired by Cursor in June 2026, its user data has been deleted, its repository is read-only, and its farewell page names no replacement. If you want what Continue offered, an open-source VS Code extension that runs your own or local models, Cline and Kilo Code are the closest maintained options, and Kilo also lists inline autocomplete."
sources:
  - title: "Roo Code repository and shutdown notice"
    url: "https://github.com/RooCodeInc/Roo-Code"
    publisher: "Roo Code"
  - title: "Roo Code to Kilo Code migration guide"
    url: "https://kilo.ai/articles/roo-to-kilo-migration-guide"
    publisher: "Kilo Code"
  - title: "The new Kilo for VS Code is live"
    url: "https://blog.kilo.ai/p/new-kilo-for-vs-code-is-live"
    publisher: "Kilo Code"
  - title: "Kilo Code repository"
    url: "https://github.com/Kilo-Org/kilocode"
    publisher: "Kilo Code"
  - title: "Kilo Code legacy repository end-of-life notice"
    url: "https://github.com/Kilo-Org/kilocode-legacy"
    publisher: "Kilo Code"
  - title: "Orchestrator mode (deprecated)"
    url: "https://kilo.ai/docs/code-with-ai/agents/orchestrator-mode"
    publisher: "Kilo Code"
  - title: "Kilo Code checkpoints"
    url: "https://kilo.ai/docs/code-with-ai/features/checkpoints"
    publisher: "Kilo Code"
  - title: "Kilo pricing"
    url: "https://kilo.ai/pricing"
    publisher: "Kilo Code"
  - title: "Cline repository"
    url: "https://github.com/cline/cline"
    publisher: "Cline"
  - title: "Cline pricing"
    url: "https://cline.bot/pricing"
    publisher: "Cline"
  - title: "ClinePass"
    url: "https://docs.cline.bot/getting-started/clinepass"
    publisher: "Cline"
  - title: "Continue has joined Cursor"
    url: "https://continue.dev/"
    publisher: "Continue"
  - title: "Continue repository"
    url: "https://github.com/continuedev/continue"
    publisher: "Continue"
  - title: "Bring your own key in VS Code"
    url: "https://code.visualstudio.com/blogs/2026/06/18/byok-vscode"
    publisher: "Visual Studio Code"
related: ["tool:cline", "tool:kilo-code", "tool:roo-code", "tool:continue", "tool:github-copilot", "tool:claude-code", "tool:opencode", "guide:ai-coding-agents-cli-2026"]
---

Roo Code is no longer maintained: its VS Code extension shut down on May 15, 2026, the GitHub repository is archived, and its README sends users to ZooCode, a community fork, and to [Cline](/tools/cline), the project Roo was forked from. That leaves two maintained agents from the same family tree. Pick Cline for the original Apache-2.0 agent with the widest reach; pick [Kilo Code](/tools/kilo-code) if you liked Roo's multi-mode workflow, because its agents map closest and Kilo publishes a Roo migration guide.

*Last reviewed: September 2026.*

## Where each project stands in September 2026

| | Cline | Kilo Code | Roo Code |
| --- | --- | --- | --- |
| Status | Active | Active | Shut down May 15, 2026 |
| Latest release | Extension v4.1.17 (Sep 2, 2026) | v7.6.2 (Sep 10, 2026) | v3.54.0 (May 15, 2026), final |
| License | Apache-2.0 | MIT | Apache-2.0 |
| GitHub stars | ~67.8k | ~27.3k | ~24.3k |
| VS Code Marketplace installs | ~5.29M | ~1.52M | ~2.00M, frozen |
| Open VSX downloads | ~6.47M | ~3.92M | ~1.95M |

Counts are as of September 11, 2026, from the GitHub, VS Code Marketplace and Open VSX APIs. They measure reach, not current use. [Roo Code](/tools/roo-code)'s numbers stopped moving when it shut down. Kilo's Marketplace listing now ships its rebuilt extension, so its count also includes installs of the legacy one.

## How Cline, Roo Code and Kilo Code are related

The three share a family tree, but in 2026 they no longer share an engine.

- **Cline is the original.** Its repository was created in July 2024, and it is still under active development, now at v4 of the extension.
- **Roo Code forked Cline.** The Roo README calls Cline the project "from where Roo Code originated", and the extension ID is still `roo-cline`. Roo's addition was a mode system: Code, Architect, Ask, Debug and custom modes. It shut down in May 2026.
- **Kilo Code started as a Roo fork in 2025.** Kilo says the two codebases "share real git history". Then Kilo rebuilt. The current VS Code extension, v7, is built on the [OpenCode](/tools/opencode) server and reached general availability on April 2, 2026, and the Kilo CLI is a fork of OpenCode. The legacy Roo-derived VS Code extension and JetBrains plugin reached end of life on July 31, 2026.

Older descriptions of Kilo as a superset of Roo and Cline no longer fit. Kilo today is an OpenCode-based product with Roo heritage. Its license moved with the rebuild: the archived legacy repo is Apache-2.0, the current one is MIT.

## Feature comparison

| | Cline | Kilo Code | Roo Code (final, May 2026) |
| --- | --- | --- | --- |
| License | Apache-2.0; JetBrains plugin closed source | MIT; legacy code Apache-2.0 | Apache-2.0 |
| Modes or agents | Plan and Act | Code, Plan, Ask, Debug, custom | Code, Architect, Ask, Debug, custom |
| Orchestration | CLI: multi-agent teams, scheduled agents | Automatic subagents; Agent Manager for parallel runs | Orchestrator mode (subtasks) |
| MCP | Yes, plus MCP Marketplace | Yes, plus MCP marketplace | Yes |
| Checkpoints | Yes | Yes, on by default | Yes, on by default |
| Model access / BYOK | Major providers, OpenAI-compatible APIs, Ollama, LM Studio | Free models, BYOK, local | BYOK |
| Hosted credits (model only) | Cline provider at cost; optional ClinePass | Kilo Gateway at provider rates; optional Kilo Pass | n/a |
| Editors and surfaces | VS Code, JetBrains, CLI, desktop app, SDK, ACP mode | VS Code, JetBrains, CLI, Neovim, cloud agents | VS Code only |

MCP is the [Model Context Protocol](/glossary/model-context-protocol), so the tool servers you already run work with either maintained agent.

## Cline: the original, now a platform

Cline's v4.0.0 release on June 26, 2026 moved the VS Code extension onto the Cline SDK. It also added ClinePass, an optional subscription, and a Customize marketplace for [skills](/guides/skills/agent-skills-open-standard), MCP servers and plugins. Two defaults changed at the same time. Command auto-approval is now off by default, and v4.0.0 temporarily disabled subagents in the VS Code extension while the SDK-backed experience stabilized.

The core loop is unchanged. **Plan and Act** separates thinking from doing: you plan the change with the model, then switch to Act, where every file edit and command waits for your approval unless you turn on auto-approve. All changes are tracked with checkpoints, so a bad step can be undone, and project rules live in `.clinerules`.

Cline also runs in more places than anything else here:

- the VS Code extension;
- a JetBrains plugin, which Cline does not open-source;
- a CLI, which adds multi-agent teams and scheduled agents;
- a native desktop app for macOS and Windows;
- the `@cline/sdk` package, for building on its runtime;
- an ACP mode for editors that host external agents, including Neovim.

The CLI installs from npm:

```bash
npm i -g cline
```

Providers include Anthropic, OpenAI, Gemini, OpenRouter, Vercel AI Gateway, AWS Bedrock, Azure and GCP Vertex, Cerebras, Groq, Ollama, LM Studio and any OpenAI-compatible API.

**Verdict:** the default for a new setup. It is the most adopted of the three, it is Apache-2.0, and it runs on the most surfaces. The trade-off is a simpler two-mode model, and v4.0.0 paused subagents in VS Code, so check the release notes if you rely on them.

## Kilo Code: a Roo descendant rebuilt on OpenCode

Kilo's April 2026 rebuild turned modes into **agents**. Code is the default, joined by Plan, Ask and Debug, and you can write your own. Orchestrator mode is deprecated and will be removed in a future release. Instead, Kilo's docs say the agents with full tool access (Code, Plan and Debug) now delegate to [subagents](/glossary/subagent) automatically.

Parallel work happens in the **Agent Manager**. It runs agents side by side in git worktrees, with inline review and multi-model comparison for putting two models on the same task. Checkpoints are on by default. Kilo stores them as snapshots in a dedicated Git repository outside your project, and "Revert to here" rolls back to any of them.

The rest of the list:

- an MCP marketplace;
- inline autocomplete;
- `kilo run --auto` for CI runs;
- surfaces: VS Code, a JetBrains plugin, the CLI, cloud agents, and a Neovim plugin (kilo.nvim) created in September 2026.

The CLI installs from npm:

```bash
npm install -g @kilocode/cli
```

**Verdict:** the best fit if you are leaving Roo Code after its May 2026 shutdown, or if you want several specialized agents and parallel runs in the editor. The trade-off is churn. The extension was rebuilt in April 2026 and the legacy one reached end of life in July 2026, so guides written for the legacy extension may not match v7.

## Roo Code: what shut down, and what's left

The Roo Code extension shut down on May 15, 2026. The repository is archived, v3.54.0 from that day is the final release, and the docs site shows the same notice. The team's domain, roocode.com, now redirects to roomote.dev, which describes itself as "By the creators of Roo Code". Paying users with billing questions are asked to write to billing@roocode.com.

An archived repository takes no fixes. Any copy still installed is frozen at v3.54.0, so plan the move rather than wait for a revival.

## Is Cline free? What each one costs to run

All three are, or were, free to install. You pay for model usage, and in 2026 neither maintained option is bring-your-own-key only.

- **Cline** is free for individual developers. For inference you have three options:
  - bring your own key;
  - buy usage through Cline's own provider, at cost;
  - add ClinePass, an optional monthly subscription that Cline says gives two to five times the usage on popular open coding models compared with standard API rates.

  Enterprise adds SSO, role-based access control and limits on which inference providers people can use.
- **Kilo Code** is free too. Inference can cost nothing: free models, your own key, or a local model. Or it can run through the Kilo Gateway, which is pay as you go across 500+ models from 60+ providers, at exact provider rates with no markup. Kilo Pass subscriptions add bonus credits. Teams is a per-user plan with analytics and centralized billing. Cloud agents and code review bill by the hour.

Both accept local models, which removes API costs if your hardware can carry them; the [local LLM tools roundup](/guides/comparisons/best-local-llm-tools-2026) covers the runtimes. Prices change often; the Cline and Kilo Code tool pages list current plans.

## Which one should you use?

| If you… | Use | Why |
| --- | --- | --- |
| Are leaving Roo Code (shut down May 2026) and relied on modes | Kilo Code | Closest agent set; published migration guide |
| Want the upstream project, Apache-2.0 | Cline | The original; the Roo README names it |
| Want parallel agents in the editor | Kilo Code | Agent Manager with worktrees |
| Want scheduled or team agents from a terminal | Cline | CLI multi-agent teams and scheduled agents |
| Want to stay on Roo's codebase | ZooCode | The fork the Roo README names |
| Work in JetBrains or Neovim | Either | Both have JetBrains plugins; Kilo has kilo.nvim, Cline an ACP mode |

One caveat on ZooCode. It is Apache-2.0 and was active as of September 2026, but it had about 1.8k GitHub stars against Cline's 67.8k. Check its release activity before you standardize a team on it.

## Migrating from Roo Code

The Roo README names two destinations, ZooCode and Cline, and Kilo publishes its own guide. Before you move, collect:
- your custom modes;
- rules files;
- MCP config;
- the ignore file;
- provider keys.

### Moving to Kilo Code

Kilo's own migration guide, published in April 2026, maps Roo's files one to one and estimates the move at 15 to 30 minutes:

| Roo Code | Kilo Code |
| --- | --- |
| Custom modes | `.kilo/agents/*.md` |
| `.roorules` | `AGENTS.md` |
| `.roo/rules/` | `.kilo/rules/` |
| `.roo/mcp.json` | `.kilocode/mcp.json` |
| `.rooignore` | `.kilocodeignore` |
| `roo-cline.` keybindings | `kilo-code.` |

API keys don't port, so re-authenticate each provider after installing. Moving `.roorules` into [AGENTS.md](/glossary/agents-md) has a side benefit: it is an open convention that other coding agents read too.

### Moving to Cline

As of September 2026 we could not find a Roo migration guide or file mapping on Cline's site or docs, so the move is manual:
1. Copy your rules text into `.clinerules`.
2. Re-add your MCP servers.
3. Re-enter your provider keys.

Cline organizes work around Plan and Act rather than named modes, so recurring mode instructions usually belong in rules or skills.

## Also consider

### Continue: acquired by Cursor in June 2026

Continue often comes up next to Roo Code, but it is no longer a fallback. Cursor acquired Continue in June 2026. Per continue.dev, user data has been deleted, recurring billing is disabled, and unused paid credits will be refunded, with exclusions.

The README says the repository is read-only. The final release, v2.0.0 on June 19, 2026, removed anonymous telemetry and authentication. The Apache-2.0 source stays on GitHub, and the farewell page names no replacement.

If you're leaving [Continue](/tools/continue) for an open-source extension that runs your own or local models, Cline and Kilo Code are the closest maintained match. Kilo also lists inline autocomplete.

### GitHub Copilot agent mode

[GitHub Copilot](/tools/github-copilot) has an agent mode in the IDE alongside completions, chat and a cloud agent. It is not open source.
- **Copilot Free** includes 2,000 completions a month and an allowance of GitHub AI Credits. Its agent access is limited and excludes third-party agents.
- **Paid plans** have billed chat, agent and CLI use in AI Credits since June 1, 2026. Completions stay unlimited.
- **BYOK:** a June 2026 VS Code post lets you bring your own Anthropic, OpenAI, Gemini or OpenRouter key, or a local Ollama model. No Copilot plan is needed, but BYOK covers only chat and utility tasks, not completions.

### Claude Code in VS Code

[Claude Code](/tools/claude-code), Anthropic's own agent, runs in the terminal and integrates with VS Code and JetBrains. It needs a paid plan: a Claude Pro or Max subscription, or Anthropic API usage. Choose it when you want Anthropic's first-party agent and already pay for a Claude plan. The [open-source and CLI agents guide](/guides/prompting/ai-coding-agents-cli-2026) compares it with the terminal alternatives.

## How to choose

1. **Still on Roo Code:** it shut down in May 2026, so move this month. Choose Kilo Code if you rely on modes, Cline if you want the upstream project the Roo README recommends, or ZooCode if you want to stay on Roo's codebase.
2. **Starting fresh:** choose Cline for reach, licensing and a simple Plan and Act loop. Choose Kilo Code for specialized agents, parallel runs and a gateway with no markup.
3. **Trial both:** they are free to install. Give each the same real task on a branch with the same model, then compare the diffs and the approval friction.
4. **Wire in your tools once:** both speak MCP, so pick servers from [the best MCP servers](/guides/mcp/best-mcp-servers-2026) and reuse them.

For the wider field:
- [the best GitHub Copilot alternatives](/guides/comparisons/best-github-copilot-alternatives-2026) for editors and extensions;
- [Claude Code vs OpenCode](/guides/comparisons/claude-code-vs-opencode) if Kilo's OpenCode base makes you curious about running OpenCode directly.
