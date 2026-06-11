---
title: "Claude Code vs Codex CLI: Terminal Agents Compared (2026)"
description: "Claude Code vs OpenAI's Codex CLI — autonomy vs sandboxed control, extensibility vs open source, model ecosystems, and which terminal agent fits your work."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["coding-languages", "workflow-prompting"]
tags: ["comparison", "claude-code", "codex-cli", "terminal", "versus"]
featured: false
summary: "Both are first-party terminal agents; the split is philosophy. Claude Code optimizes for capable autonomy — deep agentic loop, MCP/subagents/hooks/skills, Anthropic's models, permissions as the guardrail. Codex CLI optimizes for contained execution — OS-level sandbox modes and approval policies, open-source Rust, OpenAI's models. Trust posture and model allegiance decide it."
keyTakeaways:
  - "Same form factor, different center of gravity: Claude Code leads with agentic depth and programmability; Codex CLI leads with its two-layer security model (sandbox modes × approval policies)."
  - "Codex CLI sandboxes by default — workspace-scoped writes, no network — and is open source (Apache-2.0, Rust). Claude Code enforces boundaries through its permission system, hooks, and modes rather than an OS sandbox by default."
  - "Model allegiance is the quiet decider: Anthropic models tuned for Claude Code vs OpenAI models (with switching) in Codex — teams usually follow their primary provider."
  - "Extensibility favors Claude Code: MCP plus subagents, hooks, skills, and plugins versus Codex's MCP support and config-file customization."
  - "Workflow details differ where it counts: Codex leaves committing to you and reads AGENTS.md; Claude Code is git-native (stages, commits, opens PRs on request) and reads CLAUDE.md."
faq:
  - q: "Is Codex CLI really open source?"
    a: "Yes — Apache-2.0, written in Rust, developed openly by OpenAI. The agent is free; the models aren't: you authenticate with a ChatGPT plan or an OpenAI API key. Claude Code's CLI is first-party Anthropic tooling with the same shape on the model side (Claude plan or API) but isn't an open-source codebase."
  - q: "Which is safer to let loose on a repo?"
    a: "They're safe through different mechanisms. Codex CLI's default workspace-write sandbox plus approval policies contains the blast radius at the OS level — strong for unfamiliar repos. Claude Code's permission rules, modes (plan/acceptEdits), and hooks give finer-grained, programmable control — stronger for encoding team policy. For untrusted code, Codex's sandbox-by-default is the conservative pick; for governed team use, Claude Code's policy layer goes deeper."
  - q: "Can I switch models in each?"
    a: "Codex CLI switches among OpenAI models (/model, reasoning-effort control). Claude Code switches among Anthropic tiers (/model, opusplan). Neither is multi-provider — that's OpenCode's lane. In practice the choice tracks whose models you already bet on."
related: ["claude-code", "codex-cli", "claude-code-vs-opencode", "claude-code-vs-cursor", "ai-coding-agents-cli-2026", "claude-code-settings-permissions"]
---

The two first-party terminal agents — Anthropic's **Claude Code** and OpenAI's **Codex CLI** — look interchangeable from a distance: run a command in a repo, describe a task, review the diff. Up close they encode different philosophies about what makes an agent trustworthy: Claude Code bets on *programmable governance*, Codex CLI bets on *contained execution*.

## The short answer

- **You want maximum agentic depth and a programmable harness** (MCP, subagents, hooks, skills, CI) → **Claude Code**.
- **You want OS-level containment by default and an open-source agent** → **Codex CLI**.
- **You've already standardized on one provider's models** → follow the provider; both agents are tuned for their own.

## Philosophy, made concrete

**Codex CLI's signature is the two-layer security model.** Sandbox modes (`read-only`, `workspace-write`, `danger-full-access`) define what's *technically possible* — default: writes scoped to the workspace, no network. Approval policies (`on-request`, `untrusted`, `never`) define when it must *ask*. It's Rust, Apache-2.0, with headless `codex exec` for CI, model switching with reasoning-effort control, and a deliberate workflow stance: it doesn't auto-commit — staging and committing stay yours. It reads `AGENTS.md` for project context. [Tool profile →](/tools/codex-cli)

**Claude Code's signature is the programmable harness.** The agentic loop runs deep — plan, edit, run tests, iterate, open the PR — and everything around it is extension surface: [MCP servers](/guides/mcp/claude-code-mcp-setup) for reach, [subagents](/guides/getting-started/getting-started-with-agents) for delegation, [hooks](/guides/configuration/claude-code-hooks) for deterministic rules, skills and plugins for packaged workflows, [permission rules and modes](/guides/configuration/claude-code-settings-permissions) for policy. Containment is governed rather than sandboxed-by-default (sandboxing options exist; the default trust model is the permission layer). It's git-native and reads `CLAUDE.md`. [Tool profile →](/tools/claude-code)

## Dimension by dimension

| | Claude Code | Codex CLI |
| --- | --- | --- |
| Safety model | Permissions, modes, hooks (policy layer) | OS sandbox × approval policies (containment) |
| Source | First-party, not OSS | Open source (Apache-2.0, Rust) |
| Models | Anthropic, deeply tuned | OpenAI, switchable tiers |
| Extensibility | MCP + subagents + hooks + skills + plugins | MCP + config customization |
| Git stance | Stages/commits/opens PRs on request | Leaves committing to you |
| Project context | CLAUDE.md (+ rules, memory) | AGENTS.md |
| Headless/CI | claude -p + GitHub Action + Agent SDK | codex exec |

## How to actually choose

For most teams this decision is downstream of two prior bets. **The model bet:** both agents are conspicuously better with their own provider's models; if your org runs on Claude or on OpenAI, the agent follows. **The trust bet:** if your nightmare is an agent touching what it shouldn't on *unfamiliar* code, Codex's sandbox-by-default is the comfortable posture; if your goal is encoding *team* policy — these commands always allowed, these paths never touched, this approval always required — Claude Code's permission-and-hooks layer is the deeper instrument.

And if the real requirement is model freedom — any provider, local models included — neither is the answer: that's [OpenCode's comparison](/guides/comparisons/claude-code-vs-opencode) and the broader [open-source CLI field](/guides/prompting/ai-coding-agents-cli-2026).
