---
description: "Explore the codebase and write a decision-oriented design doc / RFC for a feature or system change."
seoDescription: "/write-design-doc explores the codebase and writes a decision-oriented design doc or RFC — context, options, trade-offs — as a Claude Code slash command."
date: 2026-06-17
argument-hint: "<feature or system to design>"
allowed-tools: "Read, Grep, Glob"
title: "Write Design Doc"
color: "purple"
topics: ["architecture", "workflow-prompting"]
related: ["command:plan-feature", "command:breakdown-task", "command:trace-data-flow"]
featured: false
summary: "A read-only slash command that writes a design doc / RFC for a feature or system change. It grounds the design in the real codebase, then delivers context, goals/non-goals, proposed design, alternatives with why-rejected, trade-offs and risks, a rollout/observability plan, and the open questions that need a decision."
---

## Scope

Treat `$ARGUMENTS` as the thing being designed — a feature, a subsystem, or a structural change (`move sessions from cookies to Redis`, `add multi-tenant billing`, `replace the polling sync with webhooks`). Restate it in one sentence to confirm scope before designing.

If `$ARGUMENTS` is empty, ask one focused question: *"What feature or system change should I design?"* Do not invent a problem to solve.

> [!WARNING]
> Read-only mode. Do not modify the repository, run migrations, install packages, or scaffold code. The written design doc is your only output. Designing without reading the current code produces a doc that won't survive contact with the repo — it proposes structure that already exists differently, or ignores constraints the code already enforces.

> [!NOTE]
> A design doc without honest alternatives and trade-offs is just a plan in disguise. If you cannot name an approach you rejected and *why*, you haven't done the design work yet — go back to Step 2.

## Step 1 — Frame the problem

Before any solution, pin down what you're solving and why now.

- What is broken, missing, or about to break? Why is this worth doing *now* rather than later?
- Who is affected — end users, a specific team, on-call, future maintainers? What do they feel today?
- What does "done" look like as observable behavior, and what is explicitly **not** in scope for this change?

## Step 2 — Ground the design in the real code

A design that ignores the existing structure invents a system that doesn't match the one you're changing. Use `Read`, `Grep`, and `Glob` (no shell) to map reality first:

- **Orient:** `Read` `README.md`, `package.json`, and `CLAUDE.md` for stack, conventions, and the patterns the team already commits to. `Glob` (e.g. `src/**/*.ts`, `**/migrations/**`, `**/*.config.*`) to see how the tree and its boundaries are laid out.
- **Find the blast radius:** `Grep` for terms from `$ARGUMENTS` to locate every module, route, model, and config the change touches. Trace the data flow and the layers it crosses — a design that only names the happy-path file underestimates the work.
- **Find the pattern to extend or break from:** `Read` the closest existing subsystem end to end. Decide deliberately whether your design *follows* that pattern (cite it) or *departs* from it (justify the departure in Trade-offs). Note real constraints you discover: a schema you must migrate, an interface other code depends on, a queue/cache/auth boundary you can't move freely.

## Step 3 — Write the design doc

Output the doc in this structure. Keep it skimmable and decision-oriented — cite real file paths and symbols from Step 2, not placeholders. Cut anything that isn't a decision or a constraint.

```markdown
## Design — <one-line summary of the change>

### Context & problem
<Why this, why now, who's affected. The state today, with real references
(`path/to/module.ts`, the current flow). 2-4 tight paragraphs, no preamble.>

### Goals
- <observable outcome this change must achieve>

### Non-goals
- <explicitly out of scope — the boundaries that keep this shippable>

### Proposed design
<The approach. Data model / flow changes, key interfaces and signatures,
and exactly how it fits (or deliberately departs from) existing patterns
in `path/to/...`. Diagrams-in-prose are fine; be concrete about what code
lives where.>

### Alternatives considered
- **<Alternative A>** — <how it would work> — **Rejected because** <reason>.
- **<Alternative B>** — <how it would work> — **Rejected because** <reason>.

### Trade-offs & risks
- <what this design costs: complexity, perf, coupling, ops burden>
- <what could break, and the failure mode if it does>

### Rollout & migration
- <how it ships: flag, phased rollout, backfill/migration order, rollback path>

### Observability
- <metrics, logs, alerts that prove it works in prod and catch regressions>

### Open questions
- <each unresolved decision that needs an owner / a call>
```

## Report

Deliver the design doc as your message — it is the whole deliverable. Verify it has real alternatives with reasons, honest trade-offs, and a rollout plan that names a rollback path; if any of those is hand-waved, it isn't done. End with the **Open questions** — the specific decisions that need a human call before implementation can start. No files were changed; this is a doc to align on, not the change itself.
