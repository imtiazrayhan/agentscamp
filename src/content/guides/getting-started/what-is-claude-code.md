---
title: "What Is Claude Code?"
description: "A grounded explanation of Claude Code: an agentic command-line coding tool that reads files, runs commands, and works in a loop toward a goal."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["workflow-prompting"]
featured: true
related: ["guide:getting-started-with-agents", "guide:installing-claude-code"]
summary: "Claude Code is Anthropic's agentic command-line coding tool: give it a goal in plain language and it reads your files, runs commands, edits code, observes the results, and iterates until done. Unlike autocomplete assistants, it closes the loop itself — you set the objective and review the diff. It extends via subagents, skills, slash commands, and MCP servers."
keyTakeaways:
  - "Claude Code is an agent, not autocomplete: the unit of work is a goal, not a suggestion — it runs commands, reads the output, and self-corrects."
  - "The loop is decide → act → observe → repeat; verifying its own edits by re-running the failing test is what separates it from a code generator."
  - "It lives in the terminal first, but the same engine runs in IDE extensions, GitHub, and the SDK/headless mode."
  - "Four extension points, four jobs: subagents (delegate a focused role), skills (reuse a procedure), slash commands (replay a prompt), MCP servers (reach outside the repo)."
  - "It excels where success is verifiable — failing tests, mechanical multi-file changes, investigation; it struggles on ambiguous goals with no signal to check against."
faq:
  - q: "What is Claude Code?"
    a: "Claude Code is Anthropic's agentic coding tool. You give it a goal in plain language from the terminal, and it works in a loop — reading files, running commands like your test suite, editing code, observing the output, and iterating until the goal is met or it needs your input. You direct and review; it executes."
  - q: "How is Claude Code different from autocomplete tools like Copilot?"
    a: "Autocomplete operates one suggestion at a time: it sees context, produces text, and stops — you run the tests and paste back the errors. Claude Code closes that loop itself: it runs your commands, reads stderr, and adjusts. The unit of work shifts from 'the next few lines' to 'achieve this outcome.'"
  - q: "Where does Claude Code run?"
    a: "The terminal is home — an interactive session started with claude in a project directory, plus a one-shot claude -p mode for scripting. The same engine also runs in VS Code and JetBrains extensions, on GitHub via the Action, and embedded in your own software through the Agent SDK."
  - q: "What is Claude Code actually good at?"
    a: "Tasks with a verifiable signal: making a failing test pass, mechanical multi-file changes like renames and migrations, investigating why something breaks, and scaffolding against an existing pattern. It struggles when success has no check — ambiguous product decisions, or goals only a human eyeballing a UI can judge."
  - q: "Do I need subagents, skills, and MCP servers to start?"
    a: "No. Start with a CLAUDE.md capturing your project's commands and conventions, give Claude Code a real task with a test attached, and add one skill for your most-repeated request. The extension system is there when the basics start paying off — not a prerequisite."
---

Most AI coding tools you have used are autocomplete: you type, they predict the next few lines, you accept or reject. Claude Code is a different category. It is an **agentic** command-line tool — you give it a goal in plain language, and it reads your files, runs commands, edits code, checks the result, and keeps going until the goal is met or it needs you. The difference between "suggest the next token" and "achieve this outcome" is the whole point.

This guide explains what that actually means: how the loop works, where Claude Code runs, the four ways you extend it, and — just as important — the tasks it is genuinely good at versus the ones where it will frustrate you.

## Autocomplete versus an agent

An autocomplete assistant (Copilot-style inline completion, a chat box that returns a snippet) operates on one turn: it sees your context, produces text, and stops. You are the runtime. You copy the suggestion in, run the tests, read the error, and decide what to ask next.

Claude Code closes that loop itself. It has tools — it can open files, search the repo, run your test command, apply a patch — and it uses them in sequence, reading the output of each action to decide the next one. You are no longer the runtime; you are the reviewer and the director.

| | Autocomplete assistant | Claude Code (agentic) |
|---|---|---|
| Unit of work | One suggestion | One goal, many steps |
| Runs your commands | No | Yes (tests, builds, git, linters) |
| Reads project files | The open buffer | Any file it decides to read |
| Reacts to errors | You paste them back | It reads stderr and adjusts |
| You provide | The next keystroke | The objective and the review |

## How the agentic loop works

The core of Claude Code is a loop. Once you give it a task, it repeats this cycle until done:

1. **Decide.** Look at the goal and the current state, choose the next action.
2. **Act.** Call a tool — read a file, grep for a symbol, run `npm test`, edit a file.
3. **Observe.** Read the tool's output (file contents, command stdout/stderr, an exit code).
4. **Repeat.** Feed that observation back in and decide again.

A concrete example. You ask: *"the checkout test is failing, fix it."* Claude Code might:

```text
1. Run `npm test` → reads the failing assertion and stack trace
2. Read src/checkout.ts and the failing test file
3. Grep for the function named in the trace to find callers
4. Edit src/checkout.ts to correct the off-by-one in the total
5. Re-run `npm test` → sees it pass, sees no new failures
6. Report the fix and stop
```

Step 5 is what separates an agent from a code generator. It does not assume its edit worked; it runs the test again and verifies against reality. When it sees a new failure, it loops back to step 1 instead of declaring success.

> [!NOTE]
> The loop is why Claude Code can recover from its own mistakes. A one-shot tool that guesses wrong just hands you broken code. An agent that guesses wrong runs the command, sees the error, and tries again — often before you ever look at the screen.

## Where Claude Code runs

Claude Code lives in your **terminal** first. You run `claude` in a project directory and get an interactive session that has your repo as its working directory. That terminal home is deliberate: it means Claude Code can use the same tools you do — git, your package manager, your build and test commands, any CLI on your `PATH`.

It is not terminal-only, though. The same engine runs in several places:

- **Terminal / CLI** — the interactive REPL, plus a one-shot `claude -p "..."` mode for scripting and piping.
- **IDE extensions** — VS Code and JetBrains integrations that run Claude Code alongside your editor, with diffs surfaced inline.
- **GitHub** — a CI/Action mode that responds to issues and reviews pull requests in the repo.
- **SDK / headless** — embed the same agent loop in your own scripts and applications.

> [!TIP]
> Even if you live in an IDE, learn the terminal version. It is where every feature lands first, and understanding the raw loop makes the IDE integration far less mysterious when something behaves unexpectedly.

## The four extension points

Out of the box Claude Code is capable, but its real power is that you shape it to your project and habits. There are four extension mechanisms, and they solve different problems. Knowing which is which saves you from forcing the wrong tool onto a job. (Two of them — skills and slash commands — are really the same underlying system, as the Slash commands section below explains.)

### Subagents

A **subagent** is a specialist Claude can delegate to — a code reviewer, a debugger, a migration assistant — defined by a Markdown file in `.claude/agents/`. It runs in its own context window with its own focused system prompt and an optional restricted toolset, then returns a clean summary. Use them to keep your main thread uncluttered and to make Claude better at one narrow job. See [Getting Started with Claude Code Agents](/guides/getting-started/getting-started-with-agents) and [Writing Your First Custom Agent](/guides/getting-started/writing-a-custom-agent).

### Skills

A **skill** is a `SKILL.md` file inside its own directory (`.claude/skills/<name>/SKILL.md`) that packages a reusable procedure — the steps, conventions, and sometimes scripts for a task you do repeatedly ("generate a release changelog," "scaffold a new component"). The directory name becomes the command name, so a skill is also invocable directly as `/<name>`, not only auto-loaded. Claude loads a skill on demand, so its instructions stay out of context until the task actually calls for them. See [Writing Your First Skill](/guides/skills/writing-your-first-skill).

### Slash commands

A **slash command** is a Markdown prompt in `.claude/commands/` that you trigger by name. `.claude/commands/create-pr.md` becomes `/create-pr`. Unlike a subagent (which Claude calls on its own), a slash command is something *you* invoke to replay a prompt you would otherwise retype. They are perfect for encoding a fixed workflow.

Skills and slash commands are the same mechanism under the hood. A `.claude/commands/*.md` file still works and is the simpler path for a fixed prompt; a `.claude/skills/<name>/SKILL.md` directory is the recommended forward path and additionally supports supporting files, frontmatter invocation control, and auto-loading. Both produce a `/<name>` you can run.

### MCP servers

**MCP** (Model Context Protocol) servers connect Claude Code to the world outside your repo — a database, an issue tracker, a browser, an internal API. Where the other three extensions live as files in `.claude/`, an MCP server is a running process that exposes tools and data Claude can call. See [Building an MCP Server](/guides/advanced/building-an-mcp-server).

A quick way to keep them straight:

| Extension | Lives as | Triggered by | Solves |
|---|---|---|---|
| Subagent | `.claude/agents/*.md` | Claude (delegation) | Isolating a focused job |
| Skill | `.claude/skills/<name>/SKILL.md` | Claude (auto) or you (`/name`) | Reusing a procedure |
| Slash command | `.claude/commands/*.md` | You (by name) | Replaying a prompt |
| MCP server | A running process | Claude (tool call) | Reaching outside the repo |

> [!NOTE]
> You rarely need all four on day one. Start by writing a `CLAUDE.md` with your project conventions, add a skill (or a simple `.claude/commands/*.md` prompt) for your most-repeated request, and grow from there.

## What Claude Code is good at

The loop shines on tasks that have a **verifiable signal** — something Claude can run to know whether it succeeded. The clearer that signal, the more autonomously it works.

- **Make-the-test-pass work.** Fixing a failing test, implementing a function against an existing test, or doing TDD where you write the test first.
- **Mechanical, multi-file changes.** Renaming a symbol across a codebase, migrating an API surface, updating call sites after a signature change.
- **Investigation.** "Why does this request 500?" — it can grep, read, run, and trace far faster than you can.
- **Scaffolding against a pattern.** New route handler, new component, new migration that matches the existing house style.
- **Tooling glue.** Writing the script, the CI step, or the codemod, then running it to confirm it does what you meant.

## What it is not good at

It is not magic, and pretending otherwise wastes your time. The loop struggles when there is **no signal to check against** or when the goal is underspecified.

- **Ambiguous product decisions.** "Make the dashboard better" has no test to run. Decide what "better" means first, then hand over the concrete change.
- **Tasks with no feedback loop.** If success can only be judged by a human looking at a rendered UI, the agent is flying blind between your reviews.
- **Sprawling, do-everything prompts.** "Add auth, write docs, and refactor the API" in one shot produces a mess. Break it into steps — see [Prompt Patterns for Coding Agents](/guides/prompting/prompt-patterns).
- **Anything destructive without guardrails.** It will run what you ask. If a command can force-push or drop a table, you set the confirmation, not it.

> [!WARNING]
> Claude Code is confident even when it is wrong. The loop catches errors that a command can surface, but it cannot catch a wrong *intention*. You own the review: read the diff, understand the change, and never merge code you would not have written yourself.

## The mental model to keep

Claude Code is a teammate that works in a loop: it acts through real tools, observes real output, and iterates toward a goal you define. Give it a clear objective with a way to verify success, point it at the right files, and review what it produces. From there, the four extension points let you mold it to your project — but the loop is the thing. Once you see Claude run a command, read the error, and fix its own work, the difference from autocomplete stops being abstract.

When you are ready, [install Claude Code](/guides/getting-started/installing-claude-code) and give it a real task with a test attached. Watching the loop close is the fastest way to understand it.
