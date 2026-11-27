---
title: "OpenAI Codex: A Practical Guide for Developers"
description: "Learn how OpenAI Codex works across the terminal, IDE, desktop app, and cloud — then set up a safe, repeatable workflow for real repositories."
author: "Imtiaz Rayhan"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
color: "cyan"
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["codex", "openai", "coding-agent", "cli", "workflow"]
featured: true
summary: "OpenAI Codex is a coding agent for the terminal, IDE, ChatGPT desktop app and cloud. Install the CLI with one command, run codex in a Git repository, and it starts in a workspace-write sandbox that asks before touching the network or files outside the project. Put durable rules in AGENTS.md, defaults in config.toml, and review every diff."
keyTakeaways:
  - "Install with `curl -fsSL https://chatgpt.com/codex/install.sh | sh` (or npm or Homebrew), run `codex` in a repository, and sign in with ChatGPT or an API key."
  - "Two separate controls bound the agent: the sandbox mode (read-only, workspace-write, danger-full-access) and the approval policy (on-request, never, or granular)."
  - "In a version-controlled folder the default is workspace-write with on-request approvals, and network access is off."
  - "Put durable repository rules in AGENTS.md (generate a starter with /init); keep one-off requirements in the prompt and reusable procedures in skills."
  - "`codex exec` runs the same agent non-interactively for scripts and CI, and defaults to a read-only sandbox."
faq:
  - q: "What is OpenAI Codex?"
    a: "Codex is OpenAI's coding agent for understanding, changing, reviewing, and debugging software. It can work in a local repository through the terminal, IDE extension, or desktop app, and can also run hosted tasks in the cloud."
  - q: "Is Codex the same as ChatGPT?"
    a: "They share an account, plans and usage limits, and the desktop experience now lives in the ChatGPT desktop app. Chat is optimized for conversation; Codex adds repository context and developer tools so it can inspect files, edit code, run commands, test changes, and review diffs."
  - q: "Which Codex surface should I use?"
    a: "Use the CLI when the terminal is your center of gravity, the IDE extension when you want editor context, the desktop app for interactive planning and multiple workstreams, and cloud tasks when work should continue in a hosted environment. The same repository can use more than one surface."
  - q: "Do I need a paid ChatGPT plan to use the Codex CLI?"
    a: "As of November 2026, OpenAI's pricing page lists Codex in the CLI, IDE extension, web and iOS starting with the Plus plan, while Free and Go get a lightweight model in the desktop app, subject to rollout. You can also sign in with an OpenAI API key, which bills at standard API rates and excludes cloud features such as GitHub code review."
  - q: "How do I get better results from Codex?"
    a: "State the goal, point to relevant files or errors, name constraints, and define done with observable checks. Add stable build commands and conventions to AGENTS.md, and ask Codex to run tests and review the final diff before it stops."
sources:
  - title: "Codex CLI"
    url: "https://learn.chatgpt.com/docs/codex/cli"
    publisher: "OpenAI"
  - title: "Agent approvals & security"
    url: "https://learn.chatgpt.com/docs/agent-approvals-security"
    publisher: "OpenAI"
  - title: "Custom instructions with AGENTS.md"
    url: "https://learn.chatgpt.com/docs/agent-configuration/agents-md"
    publisher: "OpenAI"
  - title: "Config basics"
    url: "https://learn.chatgpt.com/docs/config-file/config-basic"
    publisher: "OpenAI"
  - title: "Codex models"
    url: "https://developers.openai.com/codex/models"
    publisher: "OpenAI"
  - title: "Codex pricing and plan availability"
    url: "https://developers.openai.com/codex/pricing"
    publisher: "OpenAI"
  - title: "Non-interactive mode (codex exec)"
    url: "https://learn.chatgpt.com/codex/non-interactive-mode"
    publisher: "OpenAI"
  - title: "openai/codex repository"
    url: "https://github.com/openai/codex"
    publisher: "OpenAI"
related: ["tool:codex-cli", "guide:claude-code-vs-codex-cli", "guide:codex-agents-md", "guide:codex-config-toml", "guide:codex-skills-guide", "guide:codex-mcp-setup", "guide:codex-subagents", "guide:codex-automations", "guide:codex-troubleshooting", "glossary:agents-md", "glossary:agent-skills"]
audience: ["developers"]
---

**OpenAI Codex is a software-development agent: it can inspect a repository, plan a change, edit files, run commands, test the result, and review its own diff.** The useful mental model is not "a chatbot that writes code snippets" but a teammate operating inside a bounded development environment.

Codex is available through several surfaces. The [CLI](/tools/codex-cli) is terminal-first and open source under Apache-2.0; the IDE extension stays close to the editor; the ChatGPT desktop app (macOS, Windows and Linux) is suited to planning, review, and concurrent work; Codex Cloud moves execution to a hosted environment. The interface changes, but the core loop does not: give Codex a goal and enough context, let it work, then inspect evidence that the outcome is correct.

## Your first 10 minutes with the CLI

**1. Install.** On macOS or Linux, OpenAI's standalone installer is the documented default:

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

The repository README lists the alternatives:

```bash
npm install -g @openai/codex        # npm
brew install --cask codex           # Homebrew
powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"   # Windows
```

**2. Sign in.** Open a project directory and run `codex`. On first launch choose **Sign in with ChatGPT** and finish the browser flow (`codex login` starts the same flow later). For API billing instead, pipe a key in:

```bash
printenv OPENAI_API_KEY | codex login --with-api-key
```

**3. Check where you are.** These slash commands are the ones worth learning first:

| Command | What it does |
| --- | --- |
| `/init` | Generate an `AGENTS.md` scaffold in the current directory |
| `/status` | Show session configuration, the workspace directories and token usage |
| `/permissions` | Set what Codex can do without asking first |
| `/model` | Choose the active model and reasoning effort |
| `/plan` | Switch to plan mode and get a proposed approach before any edits |
| `/diff` | Show the Git diff, including untracked files |
| `/review` | Review uncommitted changes, a commit, or a branch against its base without modifying the working tree |
| `/compact` | Summarize the conversation to free context |

**4. Give it a small, checkable task.** OpenAI's own first prompt is `Tell me about this project`. Follow it with something you can verify in one command, such as adding a missing test. Commit before and after so the change is one `git diff` away.

## Choose the surface around the work

| Surface | Best fit | What stays close |
| --- | --- | --- |
| **CLI** | Local repository work driven from the terminal | Shell commands, Git, logs, and the current working directory |
| **IDE extension** | Focused implementation while you are already editing | Open files, selections, diagnostics, and the editor diff |
| **Desktop app** | Planning, review, longer tasks, and parallel workstreams | Projects, chats, worktrees, files, and visual review |
| **Cloud** | Work you want to offload to a hosted environment | A configured repository and reproducible environment |

This is not a permanent choice. A task can begin as a plan in the app, move into a local implementation, and finish with review in the IDE. What matters is that the environment has the code, dependencies, permissions, and verification commands the task needs.

## Models and plans

Codex picks a default model for your plan; change it per session with `/model` or at launch with `-m`. As of November 2026 the models page lists `gpt-6.1-sol` (the model OpenAI's own CLI and config examples use), `gpt-6.1-terra` (fast and efficient, pitched at writing, visual understanding and computer use) and `gpt-6-luna` (focused, repeatable tasks). GPT-6.2 Sol and GPT-6.2 Astra are available on supported plans, with Astra recommended for the hardest end-to-end work:

```bash
codex -m gpt-6.1-sol
```

Model ids churn. GPT-5.5 was retired from Codex for ChatGPT sign-ins on October 14, 2026, and a retired id in `config.toml` or a script is a common cause of a session that will not start, so check the models page when something that worked last month fails.

Usage comes out of your ChatGPT plan's allowance, shared with other ChatGPT agent features, and eligible plans can extend it with credits. API-key sessions are billed separately at API rates. Current plan prices are on the [Codex CLI tool page](/tools/codex-cli).

## Keep the execution boundary deliberate

Codex separates what it is technically able to do from when it must ask. Those are two settings, and most confusion comes from treating them as one.

**Sandbox mode** is enforced by the operating system (Seatbelt on macOS, `bwrap` plus `seccomp` on Linux):

| `--sandbox` | Files | Network |
| --- | --- | --- |
| `read-only` | Read anywhere the sandbox allows; no writes | Off |
| `workspace-write` | Read, and write inside the workspace (current directory plus temp directories) | Off unless you enable it |
| `danger-full-access` | No sandbox | On |

Even in `workspace-write`, the `.git`, `.agents` and `.codex` directories inside the workspace stay read-only, so the agent cannot rewrite history or its own rules.

**Approval policy** decides when Codex stops to ask:

| `--ask-for-approval` | Behaviour |
| --- | --- |
| `on-request` | Works inside the sandbox; asks when it needs to go outside it (edit elsewhere, use the network) |
| `never` | Never asks; does its best within the sandbox you set |
| granular (config only) | Keeps chosen prompt categories interactive and auto-rejects the rest |

The older `untrusted` policy value has been retired; OpenAI's docs warn that leaving `approval_policy = "untrusted"` in a config can stop the client from starting.

When you run `codex` in a version-controlled folder, the recommended default is the **Auto** preset: `workspace-write` with `on-request` approvals. In a folder without version control it recommends `read-only`. The combinations you will actually use:

```bash
codex                                                     # Auto: workspace-write + on-request
codex --sandbox read-only --ask-for-approval on-request   # explore or plan, no edits
codex --sandbox read-only --ask-for-approval never        # non-interactive analysis
codex exec --sandbox workspace-write "fix the failing lint errors"   # scripted run that may edit
```

`--dangerously-bypass-approvals-and-sandbox` (alias `--yolo`) removes both controls. Reserve it for a disposable container.

To make a choice persistent, put it in `~/.codex/config.toml`, or in a project's `.codex/config.toml`, which loads only for projects you have trusted:

```toml
# ~/.codex/config.toml
model = "gpt-6.1-sol"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
network_access = false   # set true only if the task needs package installs or APIs
```

CLI flags override project config, which overrides user config. The [config.toml guide](/guides/configuration/codex-config-toml) covers profiles and the rest of the keys.

Broader access is sometimes necessary (installing packages, reaching a remote API, working across directories) but it should follow from the task. Treat external content as untrusted: web search results and fetched pages can carry instructions aimed at the agent. Keep secrets out of prompts and logs.

## Put each kind of instruction in the right place

Codex has several customization layers, and reliability improves when each carries one kind of information:

- **Prompt** — requirements that belong only to this task.
- **[`AGENTS.md`](/guides/configuration/codex-agents-md)** — durable repository conventions, commands, boundaries, and definitions of done.
- **[Skill](/guides/skills/codex-skills-guide)** — a reusable workflow Codex should recognize and follow for a recurring job.
- **`.codex/config.toml`** — operational settings such as sandboxing, approvals, model defaults, and [MCP servers](/guides/mcp/codex-mcp-setup).
- **MCP** — live context or controlled actions in systems outside the repository.

Codex reads `AGENTS.md` before doing any work. It checks `~/.codex/AGENTS.md` for your global defaults, then walks from the project root down to your current directory, taking at most one file per directory and concatenating them so the closest file has the last word. An `AGENTS.override.md` in a directory replaces the `AGENTS.md` beside it. The combined text is capped at 32 KiB by default (`project_doc_max_bytes`), which is a good reason to keep it short. A minimal file for a TypeScript service:

```markdown
# AGENTS.md

## Commands
- Install: `pnpm install`
- Test one file: `pnpm vitest run path/to/file.test.ts`
- Before finishing: `pnpm lint && pnpm typecheck && pnpm test`

## Conventions
- TypeScript strict mode. No `any` without a comment explaining why.
- Database access goes through `src/db/`; never query from route handlers.

## Boundaries
- Do not edit `migrations/` or `.github/workflows/` without asking.
- Do not add a production dependency without asking.

## Done means
- A test covers the changed behavior, the three commands above pass,
  and the diff contains no unrelated edits.
```

Do not paste your entire engineering handbook into every request. Put the stable minimum in `AGENTS.md`, link to deeper reference files when necessary, and keep the task prompt about the task.

## Write a task Codex can finish

The most reliable prompt has four parts:

1. **Goal** — the observable outcome, not a vague activity.
2. **Context** — the files, errors, examples, issue, or existing behavior that matters.
3. **Constraints** — compatibility, architecture, safety, scope, and things that must not change.
4. **Done when** — tests, behavior, or checks that prove the work is complete.

```text
Add retry handling to the billing API client.

Context: src/billing/client.ts and its Vitest suite. Requests currently fail
immediately on a transient 429.

Constraints: preserve the public method signatures, retry only 429 and 5xx,
cap the delay, and do not add a dependency.

Done when: the focused tests cover success, retry, and non-retryable failure;
then run typecheck and review the final diff for unrelated changes.
```

That prompt gives the agent room to investigate while making the finish line hard to misunderstand. For a difficult or ambiguous change, type `/plan` first. Planning is most valuable when the cost of choosing the wrong direction is much larger than the cost of reading a short design.

## Use a closed-loop workflow

1. **Orient.** Ask it to inspect the relevant code and existing conventions before editing.
2. **Plan when needed.** Use `/plan` and review the approach for cross-cutting or high-risk work.
3. **Implement.** Let it make the smallest cohesive change that reaches the goal.
4. **Verify.** Run focused tests first, then the broader lint, type, build, or integration checks appropriate to the risk.
5. **Review.** Run `/review` and read `/diff` for unintended scope, weak error handling, missing tests, and behavior the checks did not exercise.

"Code written" is not a useful stopping condition. "The behavior changed, the regression test passes, the repository checks are green, and the diff contains no unrelated edits" is.

## Run it from scripts and CI

`codex exec` runs the agent without the interactive UI. It streams progress to `stderr` and prints only the final message to `stdout`, so it pipes cleanly:

```bash
codex exec "generate release notes for the last 10 commits" | tee release-notes.md
```

By default `codex exec` runs in a read-only sandbox; add `--sandbox workspace-write` when the job has to edit files. OpenAI recommends API-key authentication for CI and warns against exposing Codex execution in untrusted or public environments. Fork pull requests on a public repository are the obvious case to keep it away from.

## Where it goes wrong

- **Network-dependent tasks stall.** Installs and API calls fail inside the default sandbox. Approve the request, or enable `network_access` for that project, instead of jumping to full access.
- **Stale config.** A retired model id or the removed `untrusted` approval value breaks startup after an upgrade.
- **Instructions silently truncated.** Codex stops adding `AGENTS.md` files once the combined size reaches the 32 KiB cap. Ask Codex to list the instruction sources it loaded if a rule is being ignored.
- **Project config ignored.** `.codex/config.toml` and project MCP servers load only for trusted projects.
- **Green tests, wrong change.** The agent optimizes for the check you named. Name the behavior, not just "make tests pass".

> [!TIP]
> The fastest improvement is usually not a longer prompt. Add the correct test command and the repository's sharpest constraint to `AGENTS.md`, then require Codex to verify both before it stops.

## A useful first week

Start with tasks whose results are easy to inspect: add a focused test, explain an unfamiliar module, fix a reproducible bug, or refactor a small boundary without changing behavior. Once that loop is predictable, encode repeated corrections in `AGENTS.md`, turn recurring procedures into [skills](/guides/skills/codex-skills-guide), and connect outside systems through [MCP](/guides/mcp/codex-mcp-setup) only when they remove a real copy-and-paste workflow.

The goal is not maximum autonomy. It is a system where you can state an outcome, let the agent work inside a clear boundary, and decide whether to accept the result from evidence. If you are choosing between agents, [Claude Code vs Codex CLI](/guides/comparisons/claude-code-vs-codex-cli) compares the two directly.

Official references: [Codex best practices](https://learn.chatgpt.com/codex/learn/best-practices), [Codex CLI](https://learn.chatgpt.com/docs/codex/cli), and [agent approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security).

## Continue exploring

- [backend-developer](/agents/core-development/backend-developer) — Use this agent to build server-side features — endpoints, business logic, data access, background jobs.
- [frontend-developer](/agents/core-development/frontend-developer) — Use this agent to build UI — responsive layouts, components, accessibility, and design-system work.
- [mobile-developer](/agents/core-development/mobile-developer) — Use this agent to build cross-platform mobile apps with React Native + Expo — screens, navigation, native modules, and shipping via EAS.
