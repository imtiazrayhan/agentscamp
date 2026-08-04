---
title: "Codex Troubleshooting: A Layer-by-Layer Recovery Guide"
description: "Troubleshoot OpenAI Codex when files, commands, configuration, worktrees, MCP, or app features misbehave — with a fast isolation and recovery sequence."
author: "AgentsCamp"
date: 2026-08-04
color: "orange"
topics: ["workflow-prompting", "review-qa"]
tags: ["codex", "troubleshooting", "debugging", "worktrees", "configuration"]
featured: false
summary: "Most Codex failures come from one of six layers: target, instructions, configuration, permissions, tools, or session state. Diagnose them in that order. Confirm the actual directory and branch, identify loaded AGENTS.md and config.toml layers, reproduce with a harmless command, inspect tool authentication, then restart or open a focused chat only after preserving useful evidence."
keyTakeaways:
  - "Start by verifying the active project, working directory, Git branch, and diff before debugging the model."
  - "Separate instruction problems from configuration, sandbox, approval, integration, and session-state problems."
  - "A worktree is a different checkout: dependencies and ignored local files may need explicit setup or .worktreeinclude."
  - "When a feature differs between CLI and desktop, compare the bundled versions and feature maturity before assuming shared behavior."
  - "Review logs before sharing them because transcripts and command output can contain source code, paths, and secrets."
faq:
  - q: "Why does Codex show files it did not edit?"
    a: "The review panel reflects the repository's Git state, which can include changes that existed before the current Codex turn. Use the Last turn view when you want only the most recent turn's edits, and inspect git status to separate prior work from new changes."
  - q: "Why does my code not run in a Codex worktree?"
    a: "A worktree is a separate checkout containing tracked files. Dependencies, build artifacts, and ignored files such as .env may be missing. Run the project's setup process in the worktree or copy specifically approved ignored files through .worktreeinclude."
  - q: "Why is a Codex feature available in the CLI but not the desktop app?"
    a: "The CLI and desktop app can bundle different Codex versions, and experimental features may reach one surface first. Compare codex --version with the app's bundled binary version and verify whether the feature is enabled for that surface."
  - q: "Where are Codex logs stored?"
    a: "On macOS, app logs are under ~/Library/Logs/com.openai.codex by date. Session transcripts are under $CODEX_HOME/sessions, defaulting to ~/.codex/sessions, and archived sessions are under $CODEX_HOME/archived_sessions. Review files for sensitive information before sharing."
related: ["openai-codex-guide", "codex-config-toml", "codex-mcp-setup", "codex-agents-md", "codex-subagents", "debugger", "explain-error"]
---

**Troubleshoot Codex from the environment inward: target, instructions, configuration, permissions, tools, then session state.** This order catches the common failures quickly and avoids treating every denied command, stale worktree, or missing integration as a model problem.

The first objective is not to fix everything. It is to identify the layer where observed behavior stops matching expected behavior.

## 1. Confirm the target

Before changing settings or restarting anything, establish where Codex is working:

```bash
pwd
git status -sb
git branch --show-current
git worktree list
```

Check the project selected in the app, the current working directory in the terminal, and the branch shown by Git. A surprising diff often belongs to the repository state rather than the latest agent turn: review panels can show changes that existed before Codex touched the project. Use the **Last turn** diff view when you need to isolate only the most recent turn's edits.

If commands behave differently from your normal terminal, compare environment variables, shell startup behavior, installed dependencies, and the exact directory rather than assuming the command itself changed.

## 2. Confirm the instruction chain

When Codex follows the wrong convention or seems to ignore a command, ask it which instruction sources are active. Check:

- global `AGENTS.override.md` or `AGENTS.md` under the Codex home directory
- repository and nested [`AGENTS.md`](/guides/configuration/codex-agents-md) files
- a closer `AGENTS.override.md`
- configured fallback filenames
- whether the current directory is actually under the intended instruction file
- whether the combined instruction chain exceeded its size limit

Instruction discovery occurs at the start of a run. Start a new session after changing the chain, and test one concrete instruction: ask Codex to name the repository's test command or most important do-not rule.

## 3. Resolve configuration precedence

If sandbox, model, MCP, or subagent behavior is wrong, inspect [`config.toml` precedence](/guides/configuration/codex-config-toml):

1. CLI flags and one-off overrides.
2. Project `.codex/config.toml` files, closest directory first in effect.
3. The selected profile.
4. User config.
5. System config and managed requirements.
6. Built-in defaults.

Also confirm whether the repository is trusted; Codex skips project `.codex/` settings for untrusted projects. Change one layer at a time and retry a harmless operation so you know which change affected behavior.

## 4. Separate sandbox from approval

A permission failure has two possible causes:

- The **sandbox** technically blocks the filesystem, network, or application access.
- The **approval policy** requires a human decision before Codex can cross a boundary.

Look at the exact failed action and requested resource. Widen only that boundary if the task requires it. For example, a package install may need network access while normal source edits need only workspace-write access.

In unattended runs, an action that needs a fresh approval cannot pause forever; it fails back to the workflow. Prepare permissions before scheduling the run, or make the task report the blocked action and stop.

On macOS, access to protected locations such as Desktop, Downloads, or Music can also trigger an operating-system prompt. That prompt is outside Codex's own approval system.

## 5. Treat worktrees as fresh checkouts

When a project works in the main checkout but not a managed worktree, inspect what is missing:

- package or language dependencies installed outside version control
- generated build artifacts
- ignored `.env` or local configuration files
- local services bound to paths or ports
- setup steps that ran only in the primary checkout

Run the project's setup script inside the worktree. For approved ignored files, use `.worktreeinclude` so managed worktrees receive only the local files they actually require. Do not solve a missing `.env` by committing secrets.

Scheduled tasks can create many worktrees over time. Archive old runs and avoid pinning them unless their checkout needs to survive.

## 6. Diagnose MCP and integrations bottom-up

For [MCP](/guides/mcp/codex-mcp-setup), check:

1. Can the local command start, or can the host reach the remote URL?
2. Is the required environment variable present, or has OAuth completed?
3. Did the active config scope define the server?
4. Does `/mcp` or `codex mcp list` show it as enabled?
5. Is the desired tool allowed by the server's tool policy?
6. Does the prompt or skill give Codex a reason to select it?

For plugins or connectors, also check that the bundle is installed and enabled, the app is authorized, the workspace allows it, and the current surface supports it. API-key authentication alone does not grant access to ChatGPT connectors or hosted features.

## 7. Compare surfaces and versions

Codex CLI, IDE, and desktop releases can differ. A feature may be present in one surface before another, especially while experimental.

Check the CLI:

```bash
codex --version
```

On macOS, compare the version bundled with the desktop app:

```bash
/Applications/Codex.app/Contents/Resources/codex --version
```

Then verify the feature flag, surface documentation, and workspace entitlement. Do not assume shared configuration means identical release timing.

## 8. Recover a stuck session safely

If a chat or terminal appears stuck:

1. Check whether another agent thread is waiting for approval.
2. Open the terminal and run a harmless command such as `git status`.
3. Close and reopen the integrated terminal if only the terminal is unresponsive.
4. Preserve the prompt, error, relevant diff, and command output.
5. Start a smaller, focused chat if the session context has become noisy.
6. Restart the app after active work finishes if the problem persists.

If you selected the wrong execution target or cancelled worktree creation, the up arrow in the composer can recover the previous prompt.

## Collect evidence before reporting

Useful evidence includes the Codex and client versions, operating system, current directory and branch, minimal reproduction prompt, exact error text, active sandbox and approval mode, relevant config layer, and whether the issue reproduces in a fresh session.

On macOS, app logs are stored under `~/Library/Logs/com.openai.codex/YYYY/MM/DD`. Session transcripts live under `$CODEX_HOME/sessions` (normally `~/.codex/sessions`), with archived sessions under `$CODEX_HOME/archived_sessions`.

> [!WARNING]
> Logs and transcripts can include source code, filenames, command output, environment details, and credentials accidentally printed by tools. Review and redact them before attaching anything to an issue.

If the minimal case still fails, search the [Codex GitHub issues](https://github.com/openai/codex/issues) and report the reproduction with sanitized evidence.

Official reference: [Codex troubleshooting](https://learn.chatgpt.com/docs/reference/troubleshooting).
