---
title: "Parallel Claude Code Sessions with Git Worktrees"
description: "Run several Claude Code sessions at once without edits colliding — the built-in claude --worktree flag, .worktreeinclude, subagent isolation, and cleanup."
author: "AgentsCamp"
date: 2026-06-11
color: "green"
topics: ["workflow-prompting"]
tags: ["claude-code", "git", "worktrees", "parallel", "workflow"]
featured: false
summary: "Claude Code has worktrees built in: claude --worktree <name> starts the session in an isolated checkout under .claude/worktrees/, so two or three agents can work the same repo simultaneously without touching each other's files. Copy gitignored files like .env in via .worktreeinclude, isolate subagents the same way, and let Claude clean up unchanged worktrees automatically when you exit."
keyTakeaways:
  - "One session per working tree is the rule that makes parallel agents safe — git worktrees give each session its own checkout and branch over shared history."
  - "It's built in: claude --worktree feature-x (or -w) creates and enters .claude/worktrees/feature-x; with no name you get an auto-generated one, and claude --worktree \"#1234\" checks out a PR."
  - "Gitignored files (.env, local configs) don't follow a checkout — list them in .worktreeinclude and Claude Code copies them into each new worktree."
  - "Subagents can get the same isolation: ask Claude to 'use worktrees for your agents' or set isolation: worktree in a custom agent's frontmatter."
  - "Cleanup is handled: exit with no changes and the worktree and branch are removed; with changes, Claude asks to keep or delete. Manual escape hatch: git worktree list / remove."
howtoSteps:
  - name: "Start the first parallel session"
    text: "From the repo root, run claude --worktree feature-auth. Claude Code creates .claude/worktrees/feature-auth as a fresh checkout branched from origin/HEAD and starts the session inside it."
  - name: "Start the second in another terminal"
    text: "Run claude --worktree bugfix-123 in a second terminal. Each session now edits its own checkout — no file collisions, shared git history."
  - name: "Carry your env files across"
    text: "Create a .worktreeinclude file listing gitignored files new worktrees need (.env, .env.local, config/secrets.json). Claude Code copies matching gitignored files into each worktree it creates."
  - name: "Work, monitor, and merge"
    text: "Treat each worktree branch like any feature branch: review the diff, run tests, merge or open a PR. Use /agent-view to monitor parallel background sessions from one screen."
  - name: "Let cleanup happen"
    text: "Exit a session with nothing changed and Claude Code removes the worktree and branch automatically; with changes present, it asks. Anything left over: git worktree list, then git worktree remove <path>."
faq:
  - q: "How do I run multiple Claude Code sessions at the same time?"
    a: "One session per working tree. The built-in way: claude --worktree <name> in each terminal — every session gets its own checkout under .claude/worktrees/ on its own branch, so edits never collide while git history stays shared. Two or three parallel sessions (a feature, a bugfix, a refactor) is the practical sweet spot."
  - q: "What does claude --worktree actually do?"
    a: "It creates (or reuses) a git worktree at .claude/worktrees/<name>, branched from origin/HEAD by default, and starts the session inside it. Run it with no name for an auto-generated one, with \"#1234\" to check out that PR's head, or set worktree.baseRef to \"head\" in settings to branch from your local HEAD including uncommitted changes."
  - q: "How do I get .env files into a Claude Code worktree?"
    a: "A fresh worktree only contains tracked files. Add a .worktreeinclude file at the repo root listing the gitignored files to carry over (.gitignore syntax, e.g. .env, .env.local). Claude Code copies matching gitignored files into every worktree it creates — including subagent worktrees."
  - q: "Do worktrees share Claude Code sessions and memory?"
    a: "Sessions are per-directory, so --continue and /resume in a worktree resume that worktree's own history. Auto-memory is the opposite: it's keyed to the repo, so all worktrees of a project share one memory. CLAUDE.md is just a file — it travels with each checkout."
  - q: "How do worktrees get cleaned up?"
    a: "On exit, a worktree with no changes, no untracked files, and no new commits is removed automatically (branch included). If there's work in it, Claude Code asks whether to keep or delete it. Headless (-p) runs never auto-clean — remove those yourself with git worktree remove."
related: ["guide:claude-code-tips", "guide:claude-code-memory-context", "guide:multi-agent-orchestration", "guide:building-multi-step-workflows", "agent:workflow-orchestrator", "tool:claude-code", "skill:branch-rebaser"]
---

The first time you run two Claude Code sessions in one checkout, you learn why you shouldn't: both agents edit the same working tree, and one agent's refactor lands in the other's diff. The fix is the rule all parallel-agent workflows share — **one session per working tree** — and git worktrees are how you get cheap extra working trees over one repository. Claude Code has the whole pattern built in.

## The built-in way: `claude --worktree`

```bash
# terminal 1 — feature work
claude --worktree feature-auth

# terminal 2 — meanwhile, a bugfix
claude --worktree bugfix-123
```

Each command creates a fresh checkout under `.claude/worktrees/<name>`, on its own branch, and starts the session inside it. The two sessions now share git history but not files — work proceeds in true parallel, and each branch merges like any other. Three forms worth knowing:

- `claude --worktree` (no name) — auto-generates a name when you just need *a* sandbox.
- `claude --worktree "#1234"` — checks out PR #1234's head; ideal for "review and fix up this PR" tasks.
- `claude -w <name>` — the short flag.

By default worktrees branch from `origin/HEAD` — a clean, pushed state. If you want them to carry your local uncommitted work instead, set `"worktree": { "baseRef": "head" }` in [settings](/guides/configuration/claude-code-settings-permissions).

## The `.worktreeinclude` file

A fresh checkout contains tracked files only — which is correct for git and wrong for running your app: no `.env`, no local config. List what should follow you in a `.worktreeinclude` file at the repo root:

```text
.env
.env.local
config/secrets.json
```

It uses `.gitignore` syntax, and only files that are both **matched and gitignored** get copied (tracked files are already there). It applies to every worktree Claude Code creates — `--worktree` sessions and subagent worktrees alike.

## Isolating subagents, not just sessions

Parallelism inside one session hits the same collision problem: two subagents editing files simultaneously will trample each other. Same fix, one level down — give each subagent its own worktree:

- Ad hoc: tell Claude to **"use worktrees for your agents"** on a parallel task.
- Durable: set `isolation: worktree` in a [custom agent's](/guides/getting-started/writing-a-custom-agent) frontmatter.

Each subagent then works in a temporary worktree that's auto-removed if it made no changes — parallel edits without a shared mutable tree. This is the same isolation model the [multi-agent orchestration patterns](/guides/advanced/multi-agent-orchestration) assume.

## Sessions, memory, and what's shared

The sharing boundaries are worth getting straight once:

| Thing | Scope |
| --- | --- |
| Session history (`--continue`, `/resume`) | **Per directory** — each worktree has its own |
| Auto-memory | **Per repo** — all worktrees share it |
| `CLAUDE.md` | A file — travels with each checkout |
| Git history, remotes | Shared across all worktrees |
| Working files | Isolated per worktree |

Per-directory sessions are a feature: `--continue` in `feature-auth` picks up the feature conversation, not the bugfix one. And `/agent-view` gives you one screen to monitor parallel background sessions instead of alt-tabbing terminals.

## Cleanup

Worktrees are cheap to create and annoying to leak, so Claude Code manages the lifecycle: exit a session whose worktree has **no changes, no untracked files, no new commits**, and the worktree and its branch are deleted automatically. If there *is* work in it, you're asked to keep or delete. Two caveats: headless (`-p`) runs never auto-clean, and old subagent/background worktrees are only swept once they're past the `cleanupPeriodDays` window. The manual tools are standard git:

```bash
git worktree list
git worktree remove .claude/worktrees/feature-auth   # --force if it has changes
```

> [!TIP]
> Don't over-parallelize. Two or three concurrent sessions — a feature, a fix, a refactor — is where the workflow shines; ten is a review bottleneck wearing a productivity costume. Every parallel branch still funnels through the same merge queue and the same reviewer: you.

Worktrees solve *where* parallel agents work. For *how* to split the work itself — decomposition, handoffs, when parallel beats sequential — see [Building Multi-Step Agent Workflows](/guides/advanced/building-multi-step-workflows) and [Multi-Agent Orchestration](/guides/advanced/multi-agent-orchestration).
