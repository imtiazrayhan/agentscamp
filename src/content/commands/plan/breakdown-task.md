---
description: "Decompose a task into an ordered checklist of small, verifiable steps."
seoDescription: "/breakdown-task decomposes a task into an ordered checklist of small, verifiable steps — a Claude Code slash command for planning before coding."
date: 2026-06-03
argument-hint: "<task>"
allowed-tools: "Read, Grep, Glob"
title: "Breakdown Task"
color: "purple"
topics: ["workflow-prompting"]
related: ["plan-feature", "workflow-orchestrator"]
featured: false
summary: "A slash command that decomposes a task into a dependency-ordered Markdown checklist of small, verifiable steps: it reads the code to ground the plan, splits work into atomic, reversible steps, marks which can run in parallel, and gives each a one-line definition of done — a planning pass only, with no files edited."
---

Break the task in `$ARGUMENTS` into the smallest sensible, dependency-ordered steps and return them as a Markdown checklist. This is a planning pass only — read the code to ground the plan, but do not edit, run, or create any files.

## Scope

Treat `$ARGUMENTS` as the task to decompose — a feature request, a bug, a refactor, or a migration ("add rate limiting to the login route", "split the `Invoice` model into separate billing tables"). If it names files, paths, or symbols, those are your starting points for investigation.

If `$ARGUMENTS` is empty, do not guess. Ask the user what task they want broken down, and stop until they answer.

## Step 1 — Ground the task in the code

Read enough of the repo to plan against reality, not assumptions. Find the files the task touches and the seams it crosses before you split anything.

```bash
# Locate the symbols, routes, or modules named in the task
grep -rn "loginHandler" src/

# Map the surrounding structure
find src -path '*auth*' -name '*.ts'
```

Open the entry points and trace one level of callers and callees. Note existing tests, types, and config that the change will ripple into.

> [!NOTE]
> If the task as written is ambiguous or hides a decision (which library? sync or async? backward-compatible?), surface that as an open question in the output instead of silently picking one. A plan built on a wrong assumption wastes the whole execution pass.

## Step 2 — Split into the smallest sensible steps

Cut the work into steps that are each independently verifiable and small enough to land as one focused commit. A good step changes one thing and can be checked on its own.

Aim for steps that are:

- **Atomic** — one concern each (add the schema; *then* wire the endpoint; *then* the test).
- **Verifiable** — you can state a concrete check that proves it is done.
- **Reversible** — a step that turns out wrong can be redone without unwinding the others.

Avoid two failure modes: steps so coarse they hide three decisions, and steps so fine they fragment a single edit across five lines.

> [!TIP]
> Lead with the steps that de-risk the work — the unknown, the spike, the schema or interface everything else depends on. Settled, mechanical steps come last.

## Step 3 — Order by dependency and mark parallelism

Sort the steps so each one only depends on steps above it. For every step, record what it needs and whether anything blocks it.

Then mark which steps are independent and can run in parallel — steps that share no inputs and touch no common files. Group them so the executor (or multiple agents) can fan them out.

```text
1. Define rate-limit config + types        (no deps)
2. Add Redis-backed counter store          (depends on 1)
3. Wire middleware into login route         (depends on 2)
4. Update API docs                          (depends on 1)   [parallel with 2–3]
5. Add tests for limit + reset window       (depends on 3)
```

> [!WARNING]
> Two steps are only safe to parallelize if they do not edit the same files and neither reads the other's output. When in doubt, serialize — a false "parallel" tag causes merge conflicts and rework that costs more than the time saved.

## Step 4 — Define done for each step and overall

Give every step a one-line **definition of done** — a concrete, checkable condition, not a restatement of the step ("tests pass for the reset window", not "tests are done"). Then write one overall definition of done for the whole task: the observable end state that means the work is complete.

## Output format

Return a single Markdown checklist. Number the steps in execution order, tag parallel-eligible ones, and end each with its definition of done.

```markdown
## Plan — <task>

- [ ] **1. Define rate-limit config + types** — _done when_ `RateLimitConfig` exists and is imported by the middleware.
- [ ] **2. Add Redis-backed counter store** — _done when_ `increment`/`reset` are covered by unit tests.
- [ ] **3. Wire middleware into login route** — _done when_ a 6th request in the window returns `429`.
- [ ] **4. Update API docs** _(parallel with 2–3)_ — _done when_ the docs describe the limit, window, and reset header.
- [ ] **5. Add tests for limit + reset window** — _done when_ `npm test` passes for the new cases.

**Definition of done (overall):** Login enforces N requests/window per IP, returns `429` with a reset header past the limit, and is documented and tested.

**Open questions:** <anything that needs a decision before step 1 — or "none">
```

Keep the plan tight: enough steps to be unambiguous, never so many that the checklist becomes noise. Do not begin executing — hand the checklist back to the user.
