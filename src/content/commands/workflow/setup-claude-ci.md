---
description: "Wire Claude Code into this repo's CI the safe way — install the GitHub App or scaffold the workflow YAML, scope permissions to the minimum, set secrets correctly, and verify with a real trigger."
argument-hint: "<what CI should do — e.g. 'review PRs', 'fix failing tests', 'respond to @claude mentions'>"
allowed-tools: "Read, Grep, Glob, Bash, Write, Edit"
model: "sonnet"
title: "Setup Claude CI"
color: "blue"
date: 2026-06-11
topics: ["workflow-prompting"]
related: ["guide:claude-code-ci-github-actions", "guide:claude-code-settings-permissions", "guide:claude-code-hooks", "command:create-pr", "command:review-pr"]
featured: false
summary: "A slash command that wires Claude Code into a repo's CI via anthropics/claude-code-action: it picks mention or prompt mode for the job, uses the installer or scaffolds the workflow YAML, scopes tools and turns to the minimum, sets the ANTHROPIC_API_KEY secret correctly, and verifies with a real trigger like an @claude comment."
---

## Scope

Treat `$ARGUMENTS` as the job Claude should do in CI — review PRs, respond to `@claude` mentions, fix failing tests on a schedule, draft release notes. Restate it in one sentence, including the trigger (mention, PR opened, cron) and the smallest set of abilities the job needs, before touching anything.

Goal: a working `anthropics/claude-code-action@v1` workflow with **minimum permissions**, secrets handled correctly, and a verified first run — not just a YAML file that looks right.

## Step 1 — Detect the starting point

Check for an existing setup: `.github/workflows/*.yml` referencing `claude-code-action`, an installed GitHub App, an `ANTHROPIC_API_KEY` secret (`gh secret list`), and any checked-in `.claude/settings.json` whose permission rules will also apply in CI. Extend what exists rather than duplicating it.

## Step 2 — Choose the integration mode

Map `$ARGUMENTS` to one of the action's two modes:

- **Mention mode** (no `prompt` input) — the action answers `@claude` comments on issues and PRs. Right for on-demand help and "fix this" requests.
- **Prompt mode** (`prompt` input set) — runs automatically on the workflow's trigger. Right for PR-opened reviews, scheduled audits, release notes.

State the trigger events the workflow will subscribe to and why.

## Step 3 — Prefer the installer, fall back to manual

If the user can run interactive commands, recommend `claude /install-github-app` — it installs the GitHub App, stores the secret, and scaffolds the workflow in one flow. Otherwise scaffold manually:

```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
jobs:
  claude:
    runs-on: ubuntu-latest
    steps:
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

Adapt `on:` to the chosen trigger; add `prompt:` for prompt mode. For Bedrock/Vertex shops, use `use_bedrock`/`use_vertex` with OIDC instead of a static key.

## Step 4 — Scope it down

Add `claude_args` with the narrowest flags that let the job succeed — e.g. a reviewer gets `--max-turns 12` and read-heavy tools; a test-fixer gets `Edit` plus `Bash(npm test:*)` only. Never pass `--dangerously-skip-permissions` in CI; the runner is not a sandbox you control. Confirm the workflow doesn't run with secrets on arbitrary fork PRs.

> [!WARNING]
> Treat the bot like any contributor with write access: minimum tools, bounded turns, and the merge button stays human — the action cannot approve PRs by design, so don't engineer around that gate.

## Step 5 — Secrets, correctly

Verify `ANTHROPIC_API_KEY` exists as a repo (or org) secret — `gh secret set ANTHROPIC_API_KEY` if not — and that the key is a dedicated CI key, not someone's personal one, so it can be rotated without breaking laptops. Never echo the key in workflow logs.

## Step 6 — Verify with a real trigger

Don't declare success on a green YAML lint. Fire the actual trigger: open a scratch PR and comment `@claude what does this PR change?` (mention mode) or push a trivial PR (prompt mode). Confirm the action ran, the response landed, and the cost is visible in the run output. Hand back: the workflow file path, the trigger, the permission envelope, and how to tune it later via `claude_args` — pointing at [Running Claude Code in CI](/guides/advanced/claude-code-ci-github-actions) for the deeper reference.
