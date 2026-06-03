---
title: "Building Multi-Step Agent Workflows"
description: "Patterns for decomposing big tasks and coordinating multiple agents."
author: "AgentsCamp"
date: 2026-05-16
color: "green"
topics: ["workflow-prompting"]
related: ["workflow-orchestrator"]
---

Most non-trivial work — migrating a codebase, shipping a feature with tests, auditing a security surface — is too big to one-shot. The reliable path is to break the work into smaller pieces, run them with the right amount of parallelism, and verify the result before declaring victory. This guide covers the core patterns for multi-step agent workflows in Claude Code: decomposition, fan-out/fan-in, verification passes, when to reach for an orchestrator subagent, and the pitfalls that quietly wreck long runs.

## Decomposition: split before you build

Decomposition is the act of turning one vague request ("modernize the auth layer") into an ordered list of concrete, independently checkable steps. A good decomposition has steps that are small enough to verify, but large enough to carry real meaning on their own.

A practical heuristic: each step should produce an artifact you could review in isolation — a diff, a file, a test result, a written finding. If a step's output is "I thought about it," it isn't a step.

> [!TIP]
> Ask Claude to produce the plan *first*, as plain text, before touching any files. Reviewing a 6-line plan is far cheaper than reviewing the wrong 600-line implementation. Plan mode is built for exactly this.

A typical decomposition prompt looks like:

```text
Before writing any code, produce a numbered plan to add rate limiting
to our API. For each step, list: the files touched, what changes, and
how I can verify that step in isolation. Stop after the plan — wait
for my approval.
```

Once the plan exists, each numbered item becomes a unit of execution you can run, check, and roll back independently.

## Fan-out / fan-in: parallel work, single merge

Some steps are independent of each other — they don't share state and can run at the same time. **Fan-out** means dispatching those independent steps in parallel; **fan-in** means collecting their results and merging them into a single coherent outcome.

In Claude Code, fan-out happens when you launch multiple subagents (via the Task tool) in one turn. Each subagent runs in its **own isolated context window**, does its slice of work, and returns a summary. The main agent then performs the fan-in: reading each summary and reconciling them.

Fan-out shines for read-heavy, embarrassingly-parallel research:

```text
Spawn three parallel subagents:
  1. Map every place we read process.env and list undocumented vars.
  2. Find all SQL queries built with string concatenation.
  3. List API routes that lack input validation.
Each returns a bulleted list with file:line references.
Then merge all three into one prioritized findings table.
```

The key property: subagents share **no** memory with each other. That isolation is what makes parallelism safe, but it also means fan-in is real work — the orchestrating agent must actively combine outputs, dedupe overlaps, and resolve conflicts. Don't assume three independent reports stitch themselves together.

> [!NOTE]
> Subagents are defined as markdown files in `.claude/agents/` with frontmatter (`name`, `description`, `model`, `color`) and a system-prompt body. A focused subagent with a tight system prompt and a narrow tool set returns cleaner fan-in material than a general-purpose one.

A minimal subagent definition:

```markdown
---
name: security-scanner
description: Read-only scanner for common web vulnerabilities. Use proactively before merges.
model: sonnet
color: red
---

You are a security reviewer. Inspect only the files you are given.
Report findings as `severity | file:line | issue | fix`. Never edit code.
```

## Verification passes: trust nothing unchecked

A verification pass is a step whose only job is to confirm earlier steps actually worked. This is the single highest-leverage habit in multi-step workflows, because agents are optimistic — they will report success on code that doesn't compile.

Make verification an explicit step, not an afterthought:

- **Mechanical checks** — run the build, the linter, the test suite. These are objective and cheap.
- **Adversarial review** — a *separate* subagent re-reads the diff with a critical eye, knowing nothing about the implementer's intent.

Using a fresh subagent for review matters: the agent that wrote the code is primed to believe it is correct. A reviewer with a clean context window and no stake in the implementation catches issues the author rationalized away.

```text
Run `npm run build && npm run lint && npm test`. Paste the raw output.
If anything fails, stop and report — do not attempt fixes yet.
```

For higher-stakes changes, chain a second opinion:

```text
Launch a code-review subagent. Give it only the diff and the original
requirements. Ask: does this fully meet the requirements, and what could
break? Return a verdict plus a list of concerns.
```

## Orchestrator agent vs. sequential steps

Not every workflow needs an orchestrator. Choose based on shape:

### Stick with sequential steps when

- Steps are **dependent** — step 3 needs step 2's output.
- The task fits comfortably in one context window.
- You want to inspect and approve each step as it happens.

This is the default and usually the right call. Linear work in a single context keeps everything visible and easy to course-correct.

### Use an orchestrator subagent when

- You have **repeated** fan-out/fan-in cycles (research many modules, then synthesize).
- The total work would blow past the context window if done in one thread.
- You want a reusable, named pattern your team invokes the same way each time.

An orchestrator is itself a subagent (`.claude/agents/workflow-orchestrator.md`) whose system prompt encodes the *process*: how to plan, when to fan out, how to merge, and what verification to run. You can also wrap a fixed sequence as a slash command in `.claude/commands/` (e.g. `.claude/commands/ship-feature.md`) so the whole workflow runs from a single invocation. Reach for an orchestrator when the coordination logic itself is worth saving — not just for one big task.

## Pitfalls to watch for

### Context loss

Subagents return only a *summary*, and the main thread can compact or drop detail over a long run. Critical specifics — exact filenames, version numbers, an edge case the user mentioned once — evaporate between steps. Defend against it by writing durable state to a file (a `PLAN.md` or a scratch notes file) that every step re-reads, rather than relying on the conversation to remember.

> [!WARNING]
> Never assume a subagent inherited context from the parent. Each one starts fresh. If a subagent needs a constraint ("our DB is Postgres, not MySQL"), pass it explicitly in the task prompt — it cannot see the rest of your conversation.

### Over-decomposition

The opposite failure: splitting work so finely that coordination overhead dwarfs the actual task. Twelve subagents each editing one line will spend more tokens negotiating handoffs than a single agent would spend doing the whole thing — and the fan-in becomes a tangle of near-identical reports.

A good rule: decompose until each step is independently verifiable, then **stop**. If two steps always run together and share state, they are one step. Parallelism is a tool for genuinely independent work, not a goal in itself.

## Putting it together

The throughline is simple: plan in plain text, run independent work in parallel and dependent work in sequence, verify every step with mechanical checks plus a fresh-eyes review, and persist anything you can't afford to lose to a file. Start sequential, add an orchestrator only when the coordination pattern repeats, and resist the urge to slice the work finer than you can check.
