---
description: "Explore the codebase and produce an implementation plan for a feature."
seoDescription: "/plan-feature explores the codebase and produces a step-by-step implementation plan for a feature — a Claude Code slash command for planning before building."
date: 2026-06-03
argument-hint: "<feature description>"
allowed-tools: "Read, Grep, Glob"
title: "Plan Feature"
color: "purple"
topics: ["workflow-prompting", "architecture"]
related: ["command:breakdown-task", "agent:system-architect"]
featured: false
summary: "A slash command that explores the codebase read-only and writes an implementation plan for a feature: it restates the request, maps the affected files and patterns with Read/Grep/Glob, then delivers a structured plan covering assumptions, approach, trade-offs, risks, ordered implementation steps, and a test plan."
---

## Scope

Treat `$ARGUMENTS` as the feature request — what the user wants to build (`add CSV export to the reports page`, `support OAuth login`, `rate-limit the public API`). Restate it in one sentence to confirm you understood it before planning.

If `$ARGUMENTS` is empty, ask one focused question: *"What feature should I plan?"* Do not guess a feature out of thin air.

> [!WARNING]
> Read-only mode. Do not modify the repository, run migrations, install packages, or scaffold code. Your only output is the written plan. If the user wants you to start building, that is a separate follow-up.

> [!NOTE]
> Where the request is ambiguous (auth provider, storage backend, UI placement, scope boundaries), state your assumptions explicitly and plan against them rather than stalling. Flag each assumption so the user can correct it.

## Step 1 — Understand the request

Break the feature into concrete capabilities and acceptance criteria before touching the code.

- What is the user-facing behavior when this is done? What is the smallest version that ships value?
- What is explicitly **out of scope**? Name it so the plan stays bounded.
- What existing behavior must not break?

## Step 2 — Explore the code to ground the plan

A plan written without reading the code is a guess. Map the feature onto the real structure before proposing anything. You only have `Read`, `Grep`, and `Glob` here — explore with those, not the shell:

- **Orient first:** `Read` `README.md`, `package.json`, and `CLAUDE.md` for project type, scripts, conventions, and the test/lint/typecheck commands. Use `Glob` (e.g. `src/**/*.ts`, `**/routes/**`) to see how the tree is laid out.
- **Find the area the feature touches:** `Grep` for terms drawn from `$ARGUMENTS` (e.g. `export|report|download`) to locate the relevant files. Map the entry points, data flow, and layers the feature crosses (routes, services, models, UI).
- **Find a pattern to mirror:** `Grep` for the shape of similar existing features (e.g. `router\.|app\.(get|post)|export function`), then `Read` the **closest existing feature** end to end. The cleanest plan usually copies an established pattern rather than inventing one.

## Step 3 — Write the plan

Output the plan in this structure. Be specific — cite real file paths and symbols you found in Step 2, not placeholders.

```markdown
## Plan — <one-line feature summary>

### Assumptions
- <each ambiguity you resolved, and how>

### Affected files & modules
- `path/to/file.ts` — <what changes and why>
- `path/to/other.ts` — <new function / modified signature>

### Proposed approach
<2-4 paragraphs describing the design: data flow, where new code lives,
how it hooks into existing patterns, and the public interface.>

### Trade-offs & alternatives
- **Chosen:** <approach> — <why it wins here>
- **Alternative:** <other option> — <why rejected / when it would be better>

### Risks & unknowns
- <thing that could break, perf concern, migration risk, or open question>

### Implementation steps
1. <smallest first, each independently reviewable>
2. ...

### Test plan
- <unit / integration tests to add, key cases & edge cases>
- <how to verify manually; commands to run>
```

## Report

Deliver the plan as your message — it is the whole deliverable. Keep it tight enough to read in one pass, specific enough to start coding from immediately, and end with the single recommended first step. Remember: no files were changed; this is a plan to act on, not the action.
