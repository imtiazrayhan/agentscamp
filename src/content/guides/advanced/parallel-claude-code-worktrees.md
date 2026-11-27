---
title: "Parallel Claude Code Sessions with Git Worktrees"
description: "Run several Claude Code sessions at once without edits colliding: the built-in claude --worktree flag, .worktreeinclude, subagent isolation, and cleanup."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["workflow-prompting"]
audience: ["developers", "ai-engineers", "devops"]
tags: ["claude-code", "git", "worktrees", "parallel", "workflow"]
featured: false
summary: "Run claude --worktree <name> in each terminal. Every session gets its own checkout under .claude/worktrees/<name> on a branch named worktree-<name>, so parallel agents share git history but never files. Copy gitignored files such as .env in with a .worktreeinclude file."
keyTakeaways:
  - "One session per working tree is the rule that makes parallel agents safe. Git worktrees give each session its own checkout and branch over shared history."
  - "claude --worktree feature-x (or -w) creates .claude/worktrees/feature-x on a new branch worktree-feature-x. With no name Claude Code generates one, and claude --worktree \"#1234\" branches from a pull request's head."
  - "New worktrees branch from the remote default branch. Set worktree.baseRef to \"head\" to branch from your local HEAD and carry unpushed commits. Uncommitted changes never come along."
  - "Gitignored files (.env, local configs) don't follow a checkout. List them in .worktreeinclude and Claude Code copies them into each worktree it creates."
  - "Subagents get the same isolation with isolation: worktree in their frontmatter. Background sessions started with claude --bg move into a worktree on their own before editing."
  - "On exit, a clean worktree from an unnamed session is removed with its branch. A worktree holding work prompts you to keep or remove it, and headless -p runs are never cleaned up."
howtoSteps:
  - name: "Start the first parallel session"
    text: "From the repo root, run claude --worktree feature-auth. Claude Code creates .claude/worktrees/feature-auth as a fresh checkout on a new branch worktree-feature-auth, branched from the remote default branch, and starts the session inside it."
  - name: "Start the second in another terminal"
    text: "Run claude --worktree bugfix-123 in a second terminal. Each session now edits its own checkout: no file collisions, shared git history."
  - name: "Carry your env files across"
    text: "Create a .worktreeinclude file at the project root listing gitignored files new worktrees need (.env, .env.local, config/secrets.json). Claude Code copies matching gitignored files into each worktree it creates."
  - name: "Work, monitor, and merge"
    text: "Treat each worktree branch like any feature branch: review the diff, run tests, merge or open a PR. For sessions you send to the background, run claude agents to see all of them on one screen."
  - name: "Clean up on exit"
    text: "Exit an unnamed session with nothing changed and Claude Code removes the worktree and branch automatically. If the worktree holds work, it asks whether to keep or remove it. Anything left over: git worktree list, then git worktree remove <path>."
faq:
  - q: "How do I run multiple Claude Code sessions at the same time?"
    a: "One session per working tree. Run claude --worktree <name> in each terminal: every session gets its own checkout under .claude/worktrees/ on its own branch, so edits never collide while git history stays shared. Two or three parallel sessions (a feature, a bugfix, a refactor) is the practical ceiling for one reviewer."
  - q: "What does claude --worktree actually do?"
    a: "It creates a git worktree at .claude/worktrees/<name> on a new branch named worktree-<name>, branched from the repository's default branch on the remote, and starts the session inside it. If a worktree with that name already exists, Claude Code opens it instead. Pass no name for a generated one, or \"#1234\", a GitHub pull request URL or a GitLab merge request URL to branch from that change's head commit."
  - q: "How do I get .env files into a Claude Code worktree?"
    a: "A fresh worktree only contains tracked files. Add a .worktreeinclude file at the project root listing the gitignored files to carry over, in .gitignore syntax (for example .env and .env.local). Only files that match a pattern and are also gitignored are copied. It applies to --worktree sessions, subagent worktrees and parallel sessions in the desktop app."
  - q: "Do worktrees share Claude Code sessions and memory?"
    a: "Transcripts are recorded under the session's working directory, so --continue inside a worktree picks that worktree's most recent session. Auto memory is the opposite: its directory is derived from the git repository, so every worktree of a repo shares one. CLAUDE.md is a tracked file and travels with each checkout, while a gitignored CLAUDE.local.md exists only in the worktree where you created it."
  - q: "How do worktrees get cleaned up?"
    a: "When you exit an interactive session, Claude Code checks the worktree for changed or untracked files and new commits. A clean worktree from an unnamed session is removed with its branch; a session you named prompts first. If there is work in it, you choose to keep or remove it. Runs with -p never clean up and leave the worktree locked, so run git worktree unlock and then git worktree remove."
  - q: "Can I base a worktree on a specific branch?"
    a: "Not through worktree.baseRef, which accepts only \"fresh\" (the remote default branch, the default) and \"head\" (your current local HEAD). To start from another existing branch, create the worktree yourself with git worktree add ../project-bugfix fix-issue-456, cd into it and run claude."
related: ["guide:claude-code-tips", "guide:claude-code-memory-context", "guide:multi-agent-orchestration", "guide:building-multi-step-workflows", "agent:workflow-orchestrator", "tool:claude-code", "skill:branch-rebaser"]
---

The first time you run two Claude Code sessions in one checkout, you learn why you shouldn't: both agents edit the same working tree, and one agent's refactor lands in the other's diff. The fix is the rule all parallel-agent workflows share, **one session per working tree**, and git worktrees are how you get cheap extra working trees over one repository. Claude Code has the pattern built in. The commands and settings below were checked against the Claude Code documentation and release 2.1.332 in November 2026.

## The built-in way: `claude --worktree`

```bash
# terminal 1: feature work
claude --worktree feature-auth

# terminal 2: meanwhile, a bugfix
claude --worktree bugfix-123
```

Each command creates a fresh checkout at `.claude/worktrees/<name>/` on a new branch named `worktree-<name>`, and starts the session inside it. The two sessions share git history but not files, and each branch merges like any other. The forms worth knowing:

| Command | What you get |
| --- | --- |
| `claude --worktree feature-auth` | Worktree `.claude/worktrees/feature-auth`, branch `worktree-feature-auth` |
| `claude -w feature-auth` | Same thing, short flag |
| `claude --worktree` | A generated name such as `bright-running-fox` |
| `claude --worktree "#1234"` | Fetches PR 1234's head from `origin` into `.claude/worktrees/pr-1234`. Quote it so the shell doesn't read `#` as a comment. A GitHub pull request URL or GitLab merge request URL also works |
| `claude -w feature-auth --tmux` | Also creates a tmux session for the worktree |
| `claude --worktree feature-auth --resume <session-id>` | Returns to a worktree you kept, using the session ID printed on exit |

Three things catch people on the first run:

- **Workspace trust.** An interactive `--worktree` run exits with an error if you have never run `claude` in that directory. Run `claude` there once and accept the trust dialog.
- **Untracked noise.** Add `.claude/worktrees/` to your `.gitignore`, or every worktree shows up as untracked files in the main checkout.
- **Reusing a name reopens the worktree.** `claude --worktree feature-auth` a second time opens the existing checkout instead of creating a new one.

You can also ask mid-session: tell Claude to "work in a worktree" and it creates one with its `EnterWorktree` tool.

### What the worktree branches from

New worktrees branch from the repository's default branch on the remote (`origin/HEAD`), so they start from a clean tree that matches what is pushed. Claude Code fetches that branch first if the repository hasn't been fetched in the last 24 hours. The `worktree.baseRef` [setting](/guides/configuration/claude-code-settings-permissions) takes two values:

```json
{
  "worktree": {
    "baseRef": "head"
  }
}
```

- `"fresh"` (default): branch from the remote default branch.
- `"head"`: branch from your current local `HEAD`, so the worktree carries your unpushed commits and feature-branch state.

Neither value copies uncommitted changes, because a worktree is a checkout of a commit. Commit first if the parallel session needs your in-progress work. You also can't set `baseRef` to a branch name; for a specific existing branch, use plain git:

```bash
git worktree add ../project-bugfix fix-issue-456
cd ../project-bugfix
claude
```

## The `.worktreeinclude` file

A fresh checkout contains tracked files only. That is correct for git and wrong for running your app: no `.env`, no local config. List what should follow you in a `.worktreeinclude` file at the project root:

```text
.env
.env.local
config/secrets.json
```

It uses `.gitignore` syntax, and only files that are both **matched and gitignored** get copied, so tracked files are never duplicated. It applies to every worktree Claude Code creates with git: `--worktree` sessions, subagent worktrees, and parallel sessions in the desktop app.

Dependencies are the other gap. A new worktree has no `node_modules`, so either have Claude install them or symlink the directory from the main checkout:

```json
{
  "worktree": {
    "symlinkDirectories": ["node_modules", ".cache"]
  }
}
```

Symlinking saves disk and install time, but every worktree then shares one dependency tree. Skip it when a branch changes the lockfile.

## Isolating subagents, not just sessions

Parallelism inside one session hits the same collision problem: two subagents editing files simultaneously will trample each other. Same fix, one level down:

- Ad hoc: tell Claude to **"use worktrees for your agents"** on a parallel task.
- Durable: add `isolation: worktree` to a [custom agent's](/guides/getting-started/writing-a-custom-agent) frontmatter.

```markdown
---
name: refactorer
description: Applies mechanical refactors across many files
isolation: worktree
---

Apply the requested refactor across every affected file, then run the tests
and report the results.
```

When the subagent finishes, Claude Code keeps its worktree if git shows changed files, untracked files or new commits there, and can remove it right away otherwise. Subagent worktrees use the same base as `--worktree`. One surprise: a subagent in its own worktree takes its instruction files from your main conversation, so a `CLAUDE.md` that differs on the worktree's branch is not what it reads. This is the isolation model the [multi-agent orchestration patterns](/guides/advanced/multi-agent-orchestration) assume.

Two packaged versions of the pattern exist. `/batch` is a built-in skill that splits one large change into 5 to 30 worktree-isolated subagents. Background sessions, started with `claude --bg "<prompt>"` or dispatched from agent view, start in your working directory and move into a worktree under `.claude/worktrees/` before they edit files.

## What isolation does and does not block

While a session is isolated in a worktree, Claude Code refuses `Edit`, `Write` and `NotebookEdit` calls that target the main checkout, shell commands whose working directory resolves to the main checkout, and git commands redirected there with `git -C`, `--git-dir` or `GIT_DIR`. The same checks cover subagents the session spawns.

The checks read paths and command text. They do not track what a shell command writes, so a `cp` or a shell redirect into the main checkout is not refused by them. That falls to your permission rules and the sandbox. Treat worktree isolation as collision avoidance between cooperating agents and not as a security boundary; for that, see [sandboxing AI-generated code](/guides/advanced/sandboxing-ai-generated-code).

## Sessions, memory, and what's shared

| Thing | Scope |
| --- | --- |
| Working files and branch | Isolated per worktree |
| Session transcripts (`--continue`) | Recorded under the session's working directory, so each worktree has its own |
| Auto memory | Per repository: all worktrees share one memory directory |
| `CLAUDE.md` | A tracked file that travels with each checkout |
| `CLAUDE.local.md` (gitignored) | Exists only in the worktree where you created it |
| `.git` directory, history, remotes | Shared across all worktrees |
| "Yes, and don't ask again" Bash approvals | Saved to the main checkout's `.claude/settings.local.json`, so they apply in every worktree |
| Project-scope plugins | Load in every worktree of the repository |

Per-directory sessions are a feature: `--continue` in `feature-auth` picks up the feature conversation, not the bugfix one. In the `/resume` picker, `Ctrl+W` widens the list to sessions from all worktrees of the repository.

To watch several sessions from one screen, use agent view: run `claude agents`. It lists background sessions grouped by state (needs input, working, completed). Agent view is in research preview as of November 2026, so its interface and shortcuts may change. `/background` (or `/bg`) sends the conversation you are in to the background.

## Cleanup

When you exit an interactive worktree session, Claude Code checks the worktree for work that removal would delete: changed or untracked files and new commits.

| Worktree state on exit | What happens |
| --- | --- |
| Clean, session unnamed | Worktree and branch are removed automatically |
| Clean, session named with `-n` or `/rename` | You are prompted, so you can keep it for later |
| Has changes, untracked files or new commits | You are prompted to keep or remove. Removing deletes the directory, the branch and the work in them |
| Another session is using the worktree | It stays, even if you choose removal |
| Headless run with `-p` | No prompt and no cleanup. The worktree stays locked |

Subagent and background-session worktrees are swept periodically once they are older than `cleanupPeriodDays` (default `30`), and the sweep leaves any worktree that still holds changed files, untracked files or unpushed commits. The manual tools are standard git:

```bash
git worktree list
git worktree unlock .claude/worktrees/feature-auth   # only if git says it is locked
git worktree remove .claude/worktrees/feature-auth   # add --force if it has changes
```

> [!TIP]
> Don't over-parallelize. Two or three concurrent sessions (a feature, a fix, a refactor) is where the workflow pays off. Every parallel branch still funnels through the same merge queue and the same reviewer: you.

Worktrees solve *where* parallel agents work. For *how* to split the work itself (decomposition, handoffs, when parallel beats sequential) see [Building Multi-Step Agent Workflows](/guides/advanced/building-multi-step-workflows) and [Multi-Agent Orchestration](/guides/advanced/multi-agent-orchestration).
