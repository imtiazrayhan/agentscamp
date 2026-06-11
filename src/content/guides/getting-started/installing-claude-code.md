---
title: "Installing Claude Code"
description: "Install Claude Code, authenticate, start a session in a real project, and add a minimal CLAUDE.md."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["workflow-prompting"]
featured: false
related: ["what-is-claude-code", "getting-started-with-agents"]
summary: "Install Claude Code with the zero-dependency native installer (one curl command on macOS/Linux/WSL, a PowerShell one-liner on Windows) or via npm with Node 18+. Authenticate once with your Claude.ai or Console account, start it inside a real repository, and run /init to scaffold the CLAUDE.md that makes every later session better."
howtoSteps:
  - name: "Install the CLI"
    text: "Use the native installer — curl -fsSL https://claude.ai/install.sh | bash on macOS/Linux/WSL, or irm https://claude.ai/install.ps1 | iex in PowerShell on Windows. It has no dependencies and auto-updates. Prefer npm tooling instead? npm install -g @anthropic-ai/claude-code requires Node 18+."
  - name: "Verify and authenticate"
    text: "Run claude --version to confirm the install, then run claude and complete the one-time browser sign-in. You need a Claude Pro/Max, Team/Enterprise, or Anthropic Console account — the free Claude.ai plan doesn't include Claude Code."
  - name: "Start inside a real project"
    text: "cd into an actual repository before launching — Claude Code's context is the directory you start it from. Ask something concrete first ('what does the auth middleware do?') and let it read the code before it changes anything."
  - name: "Create the CLAUDE.md"
    text: "Run /init to scaffold a CLAUDE.md from what's in the repo, then trim it to the essentials: build/test commands and the conventions that must hold. Everything you document there is something Claude stops guessing at."
  - name: "Learn the day-one controls"
    text: "/help lists commands, Esc interrupts mid-action, /clear resets a noisy session, and claude doctor is the health check when anything misbehaves."
faq:
  - q: "How do I install Claude Code?"
    a: "The recommended path is the native installer: curl -fsSL https://claude.ai/install.sh | bash on macOS, Linux, or WSL (PowerShell: irm https://claude.ai/install.ps1 | iex). It has zero dependencies and auto-updates in the background. The npm alternative — npm install -g @anthropic-ai/claude-code — works too but requires Node.js 18+."
  - q: "Do I need Node.js for Claude Code?"
    a: "Only if you install via npm. The native installer and Homebrew paths have no Node dependency at all — which also sidesteps the classic npm EACCES permission errors."
  - q: "Is Claude Code free?"
    a: "The tool itself has no separate price, but it requires a paid account: a Claude Pro or Max subscription, a Team/Enterprise plan, or Anthropic API (Console) billing. The free Claude.ai plan does not include Claude Code access."
  - q: "How do I update Claude Code?"
    a: "The native install updates itself in the background; force one immediately with claude update. On the npm path, run npm install -g @anthropic-ai/claude-code@latest — avoid npm update -g, which can silently leave you on a stale version."
  - q: "Why can't Claude Code see my files?"
    a: "You launched it from the wrong directory. Claude Code treats the directory it starts in as the project — quit, cd into the actual repo root, and start again. It only sees the tree below its working directory."
---

Claude Code is a command-line agent: you run it from a terminal inside a project, and it reads files, runs commands, and edits code in place while you watch. Getting it installed and authenticated takes a couple of minutes, but the difference between a frustrating first session and a productive one is mostly about *where* you start it and *what context* you give it on the way in. This guide covers the install, the first run, and the one file — `CLAUDE.md` — that makes every later session better.

## Prerequisites

Claude Code runs on macOS, Linux, and Windows. The recommended native installer has **zero dependencies** — there's nothing to set up before you run it. (Node.js is only required if you choose the npm install path below.)

> [!NOTE]
> On Windows, Claude Code works inside WSL as well as natively in PowerShell — if you already live in WSL for development, install and run it there so it sees the same filesystem as your tools.

## Install with the native installer

The native installer is Anthropic's recommended method. It has no dependencies and **auto-updates in the background**, so you never run an upgrade command by hand.

On macOS, Linux, or WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

On Windows (PowerShell):

```powershell
irm https://claude.ai/install.ps1 | iex
```

Confirm it landed:

```bash
claude --version
```

That's it for the native path — updates arrive automatically, and you can force one immediately with `claude update` if you'd rather not wait.

## Install via npm (advanced)

If you prefer npm — for example, to pin Claude Code alongside your other global tooling — you can install it that way instead. This path requires **Node.js 18 or later**; the native installer and Homebrew have no Node dependency.

```bash
node --version
npm --version
```

If those commands aren't found, install Node first — the official installer from nodejs.org or a version manager like `nvm` both work. On macOS, `brew install node` is the quickest path; on Windows, the Node.js MSI installer or `winget install OpenJS.NodeJS` will do it.

Install the CLI globally so the `claude` command is available from any directory:

```bash
npm install -g @anthropic-ai/claude-code
```

When a new release ships, upgrade with:

```bash
npm install -g @anthropic-ai/claude-code@latest
```

Don't use `npm update -g` — it respects the semver range from your original install and can silently leave you on a stale version. To apply an update immediately without reinstalling, run `claude update`.

> [!WARNING]
> If the global install fails with an `EACCES` permission error, do **not** reach for `sudo npm install -g`. That leaves root-owned files in your npm prefix that break future installs. Instead, point npm at a user-writable prefix (`npm config set prefix ~/.npm-global` and add `~/.npm-global/bin` to your `PATH`) or install Node through `nvm`, which sidesteps the problem entirely. The simplest fix of all is to switch to the native installer above, which avoids npm permissions completely.

## Authenticate

The first time you run `claude`, it walks you through signing in. Launch it from any directory:

```bash
claude
```

You'll be prompted to authenticate in the browser. Which credentials you use depends on your account:

| Account type | What you sign in with |
|--------------|------------------------|
| Claude subscription (Pro / Max) | Your Claude.ai login — usage draws from your plan |
| Claude for Work (Team / Enterprise) | Your Claude.ai login — usage draws from your organization's plan |
| Anthropic API (Console) | Your Console account / API billing |

Claude Code requires a Pro, Max, Team, Enterprise, or Console account; the free Claude.ai plan does **not** include Claude Code access.

Complete the browser flow, return to the terminal, and the session continues. Credentials are cached locally, so this is a one-time step per machine — later runs start straight into a session.

> [!NOTE]
> Run `claude` once on its own before wiring it into any script or CI. The interactive auth flow needs a browser the first time; once the credentials are cached, headless and scripted invocations work without prompting.

## Start a session in a project

This is the step people get wrong. Claude Code's context is the directory you launch it from — it reads files relative to your current working directory and treats that tree as the project. So `cd` into a real repository first, then start it:

```bash
cd ~/code/my-app
claude
```

Now you're in an interactive session. Ask it something concrete and let it read the code before it acts:

```text
What does the auth middleware in src/ do, and where is it wired up?
```

It will search, open the relevant files, and answer from what's actually there. From the same prompt you can ask it to make changes, run the test suite, or explain an error — it edits files in place and shows you each change.

A few session controls worth knowing on day one:

- Type `/help` to list the available slash commands.
- Type `/init` to have Claude scaffold a `CLAUDE.md` for the current repo (covered below).
- Press `Esc` to interrupt Claude mid-action when it's heading the wrong way.
- Type `/clear` to wipe the conversation and start fresh when the context gets noisy.

> [!TIP]
> Start in a real repository, not an empty scratch folder. Claude Code is at its best when it has actual code to read — existing conventions, tests, and structure give it the grounding to make changes that fit. A throwaway directory gives it nothing to reason about, and the first impression is misleadingly weak.

## What CLAUDE.md is

`CLAUDE.md` is a Markdown file at your repo root that Claude Code loads automatically at the start of every session. Whatever you put in it becomes durable context — project conventions, the commands to build and test, architectural notes — so you stop re-explaining the same facts in every conversation.

The fastest way to create one is to let Claude do it. From a session inside the repo:

```text
/init
```

That scans the project and drafts a `CLAUDE.md` based on what it finds. Then trim it — a focused file beats an exhaustive one. A minimal but genuinely useful version looks like this:

```markdown
# CLAUDE.md

## Project
A Next.js app for internal analytics dashboards. TypeScript throughout.

## Commands
- `npm run dev` — start the dev server (port 3000)
- `npm test` — run the Vitest suite
- `npm run lint` — eslint + prettier check

## Conventions
- Components live in `src/components`; one component per file.
- Use the existing `db` helper in `src/lib/db.ts` — never write raw SQL inline.
- Prefer server components; only add `"use client"` when a component needs state.
```

The payoff compounds: every command you document is one Claude won't guess at, and every convention you state is one it won't violate. Keep it tight and update it when the project's facts change.

> [!TIP]
> You can also keep a personal `~/.claude/CLAUDE.md` in your home directory for instructions that follow you across every project — things like "always run the linter after edits" or "explain your plan before large refactors." Project files override personal ones when they conflict.

## IDE integrations at a glance

Claude Code runs fine in a plain terminal, but editor integrations let it open diffs in your IDE and pick up your current selection and open files as context.

| Editor | How it connects |
|--------|-----------------|
| VS Code (and forks like Cursor) | Install the Claude Code extension from the marketplace; it attaches to the integrated terminal |
| JetBrains IDEs (IntelliJ, PyCharm, WebStorm, …) | Install the Claude Code plugin from the JetBrains marketplace |
| Any terminal | Run `claude` directly — no integration required |

With an editor extension installed, running `claude` from that editor's integrated terminal links the two: edits show up as reviewable diffs in the IDE, and your active file and selection feed in as context automatically.

## Troubleshooting first-run snags

A handful of issues account for most rough first runs:

- **`command not found: claude`** — the npm global bin directory isn't on your `PATH`. Run `npm prefix -g` to find it, then add its `bin` subfolder to `PATH` in your shell profile (`~/.zshrc`, `~/.bashrc`) and open a new terminal.
- **`EACCES` on install** — a permissions problem in the npm prefix, not a Claude bug. See the EACCES warning above; the simplest fix is to switch to the native installer, which sidesteps npm permissions entirely.
- **Auth won't complete** — the browser callback was blocked or you're on a headless box. Run it once on a machine with a browser to cache credentials, or follow the on-screen instructions for completing auth manually.
- **Claude can't see your files** — you launched it from the wrong directory. Quit, `cd` into the actual project root, and start again; it only sees the tree below where it was started.
- **Responses feel context-blind** — you haven't given it a `CLAUDE.md`, or the conversation has drifted. Add the file with `/init`, and use `/clear` to reset a session that's gone off the rails.

> [!NOTE]
> When something behaves unexpectedly, run `claude doctor` first — it's the canonical health check, reporting on your installation, update status, settings, and MCP configuration in one pass. To discover the commands and flags your installed version supports, run `claude --help`; the CLI evolves, and `--help` always reflects exactly what your version offers.

## Where to go next

You now have Claude Code installed, authenticated, and running inside a real project with a `CLAUDE.md` giving it durable context. The natural next steps are to learn how to delegate well-scoped work to subagents and to shape your prompts so the agent does its best work. Add one custom agent for a task you do often, document your build and test commands in `CLAUDE.md`, and let each session teach you what context to capture for the next one.
