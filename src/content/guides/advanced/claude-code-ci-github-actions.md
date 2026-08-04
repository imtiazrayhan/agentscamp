---
title: "Running Claude Code in CI: Headless Mode & GitHub Actions"
description: "Claude Code without the terminal — claude -p flags, JSON and structured output, safe permission scoping, and the official GitHub Action responding to @claude."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["workflow-prompting"]
tags: ["claude-code", "ci", "github-actions", "headless", "automation"]
featured: false
summary: "Claude Code runs headless with claude -p — script it like any CLI, get machine-readable results with --output-format json or --json-schema, and scope it with --allowedTools and --permission-mode. In GitHub Actions, claude /install-github-app wires up anthropics/claude-code-action@v1, which answers @claude mentions or runs prompts on any workflow trigger."
keyTakeaways:
  - "claude -p \"prompt\" is the whole headless API: same agent, no UI. Pipe data in (cat log.txt | claude -p \"…\"), get text, JSON (with cost and session id), or streaming JSON out."
  - "--json-schema turns Claude Code into a structured-output tool — the result includes a validated structured_output field, no parsing prompts needed."
  - "Scope CI runs explicitly: --allowedTools \"Read,Edit,Bash(npm test:*)\", --permission-mode, --max-turns. CI is also where --bare shines: skip hooks, plugins, CLAUDE.md, and MCP discovery for fast, deterministic startup."
  - "The GitHub Action (anthropics/claude-code-action@v1) auto-detects its mode: with a prompt input it runs immediately; without one it responds to @claude mentions on issues and PRs."
  - "It can write code and open PRs but deliberately can't approve them — keep a human on the merge button."
howtoSteps:
  - name: "Prove the task headless, locally"
    text: "Run claude -p \"your task\" in the repo before touching CI. If it needs interactive clarification locally, it will fail in CI — tighten the prompt until one shot works."
  - name: "Pick the output format"
    text: "Default is plain text. Use --output-format json for scripting (result, session_id, total_cost_usd, usage), stream-json for live token streams, or --json-schema '<schema>' when downstream code consumes the answer."
  - name: "Scope permissions for unattended runs"
    text: "Pass --allowedTools with the narrowest set that works, e.g. \"Read,Edit,Bash(npm run test:*)\", plus --max-turns as a circuit breaker. Add --bare for speed and determinism when project hooks/plugins/CLAUDE.md aren't needed."
  - name: "Install the GitHub app"
    text: "Run claude /install-github-app from the repo — it installs the GitHub App, sets the ANTHROPIC_API_KEY secret, and scaffolds the workflow file for you."
  - name: "Or write the workflow by hand"
    text: "Add a job using anthropics/claude-code-action@v1 with anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}. Give it a prompt input for automatic runs, or omit it to respond to @claude mentions."
  - name: "Tune with claude_args"
    text: "The action forwards CLI flags via claude_args (e.g. \"--max-turns 10 --model claude-sonnet-4-6\"), and can load plugins and MCP servers — same knobs as local headless runs."
faq:
  - q: "How do I run Claude Code in GitHub Actions?"
    a: "Use the official action: anthropics/claude-code-action@v1. The fastest setup is running claude /install-github-app locally — it installs the GitHub App, stores your ANTHROPIC_API_KEY secret, and creates the workflow. After that, commenting @claude on an issue or PR triggers it, or you can give the action a prompt to run on any workflow event."
  - q: "What is headless mode in Claude Code?"
    a: "The -p (print) flag: claude -p \"task\" runs the full agent — tools, file edits, command execution — without the interactive UI, then prints the result and exits. It's the same engine the GitHub Action and the Claude Agent SDK drive, and it composes like any CLI: pipe input in, choose text or JSON out, script it in CI."
  - q: "How do I get structured/JSON output from Claude Code?"
    a: "--output-format json wraps the run in JSON with result, session_id, usage, and total_cost_usd. To enforce a shape, pass --json-schema with a JSON Schema — the response then carries a validated structured_output field. For token-by-token processing, use --output-format stream-json."
  - q: "Is it safe to run Claude Code unattended in CI?"
    a: "Treat it like any code with repo write access: pin --allowedTools to the minimum, set --max-turns, run on trusted triggers (not arbitrary fork PRs), and scope the runner's credentials. The action can't approve PRs by design, so a human review gate stays intact. Permission rules and hooks apply in CI exactly as they do locally."
  - q: "Can I use Bedrock or Vertex instead of the Anthropic API in CI?"
    a: "Yes — the action accepts use_bedrock: \"true\" or use_vertex: \"true\", authenticating via GitHub OIDC with an AWS IAM role or GCP Workload Identity Federation instead of a static API key."
related: ["command:setup-claude-ci", "guide:claude-agent-sdk-tutorial", "guide:claude-code-settings-permissions", "guide:claude-code-hooks", "guide:claude-code-mcp-setup", "command:create-pr", "command:review-pr", "tool:claude-code"]
---

Everything Claude Code does interactively, it can do unattended: triage an issue, fix a failing test, review a PR, draft release notes on a schedule. The interactive session is one frontend; this guide covers the other two — the **headless CLI** and the **GitHub Action** — and the permission discipline that makes unattended runs safe.

## Headless mode: `claude -p`

```bash
claude -p "Find and fix the failing test in auth.test.ts"
```

That's the whole interface. The full agent runs — searching files, editing, executing commands under your permission rules — and prints the result. It composes like a Unix tool:

```bash
cat error.log | claude -p "Explain the root cause in two sentences"
```

**Output formats** are where headless gets practical:

- `--output-format json` — the result plus metadata your script wants: `result`, `session_id`, `usage`, and `total_cost_usd` (track spend per CI run).
- `--output-format stream-json` — newline-delimited events for live streaming.
- `--json-schema '<schema>'` — enforce a shape; the response includes a validated `structured_output` field. Extraction tasks stop being prompt-and-pray.

**Session flags** carry over from interactive use: `--continue` resumes the most recent session in the directory, `--resume <id>` picks a specific one — so a multi-step pipeline can keep one conversation across steps.

**Scoping flags** are the safety story:

```bash
claude -p "Fix the lint errors" \
  --allowedTools "Read,Edit,Bash(npm run lint:*)" \
  --permission-mode acceptEdits \
  --max-turns 10
```

`--allowedTools`/`--disallowedTools` pre-approve exactly what the run may do (same [rule syntax as settings](/guides/configuration/claude-code-settings-permissions)), and `--max-turns` is the circuit breaker. One more flag earns its keep in CI: **`--bare`** skips hooks, skills, plugins, CLAUDE.md, and MCP auto-discovery for a fast, deterministic start — then you add back only what the job needs via `--settings`, `--mcp-config`, or `--append-system-prompt`. Auth in CI is `ANTHROPIC_API_KEY` (or Bedrock/Vertex credentials); piped stdin is capped at 10MB; transient API errors retry automatically.

## The GitHub Action

The official integration is [`anthropics/claude-code-action@v1`](https://github.com/anthropics/claude-code-action), and the fastest setup is one command from the repo:

```bash
claude /install-github-app
```

It installs the GitHub App, stores the `ANTHROPIC_API_KEY` secret, and scaffolds the workflow. The minimal file it produces looks like:

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

The action **auto-detects its mode**: with no `prompt` input, it listens for `@claude` mentions on issues, PRs, and review comments — "@claude fix the type error in this file" gets a commit on a branch and a PR. With a `prompt` input, it runs immediately on whatever trigger you chose, which is how you build scheduled jobs (nightly dependency audit), PR-opened reviewers, or release-notes generators.

Tuning happens through `claude_args`, which forwards the same CLI flags you proved out locally:

```yaml
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          prompt: "Review this PR for security issues and comment your findings"
          claude_args: "--max-turns 12 --model claude-sonnet-4-6"
```

It can also load plugins and MCP servers (`plugins:`, `plugin_marketplaces:` inputs), run [skills](/guides/skills/writing-your-first-skill) with `prompt: "/skill-name"`, and authenticate via **Bedrock or Vertex** (`use_bedrock` / `use_vertex` with OIDC) instead of a static key.

> [!NOTE]
> Upgrading from the beta? `@beta` became `@v1`, `direct_prompt` is now `prompt`, and `mode` is gone (auto-detected). `max_turns`/`model` moved into `claude_args`.

## The safety model for unattended runs

A CI agent is code with write access to your repo. The discipline:

- **Minimum tools.** The narrowest `--allowedTools` that completes the task. A reviewer needs `Read` and a comment path — not `Bash`.
- **Bounded runs.** `--max-turns` always; treat a hit limit as a failed job, not a retry loop.
- **Trusted triggers only.** `@claude` mentions are gated by the App's permissions, but be deliberate about workflows that run on fork PRs with secrets in scope.
- **Human merge gate.** The action deliberately **cannot approve PRs** — it writes code, you keep review. Don't engineer around that.
- **Same guardrails as local.** [Permission rules](/guides/configuration/claude-code-settings-permissions) and [hooks](/guides/configuration/claude-code-hooks) checked into the repo apply to CI runs too — a deny-rule on secrets protects the bot exactly as it protects you.

> [!TIP]
> The [Setup Claude CI](/commands/workflow/setup-claude-ci) command scaffolds all of this — workflow file, secret checklist, scoped permissions — from a one-line description of what you want the bot to do.

When a workflow outgrows YAML — multi-step pipelines, custom tools, your own orchestration — the same engine is available as a library: that's the [Claude Agent SDK](/guides/advanced/claude-agent-sdk-tutorial).

## Continue exploring

- [CI/CD Engineer](/agents/infrastructure-devops/ci-cd-engineer) — Use this agent to design, speed up, and harden CI/CD pipelines on any provider (GitHub Actions, GitLab CI, CircleCI, Buildkite).
- [Git Bisect](/commands/git/git-bisect) — Drive git bisect to find the exact commit that introduced a regression.
- [Resolve Merge Conflicts](/commands/git/resolve-conflict) — Walk through resolving the in-progress merge, rebase, or cherry-pick conflict in the current repo by understanding both sides, then verify before continuing.
- [Setup Pre-commit Hooks](/commands/workflow/setup-precommit-hooks) — Set up fast pre-commit hooks that catch problems before they land — detect the repo's existing stack and hook mechanism, run lint/format/typecheck plus a secret scan on staged…
