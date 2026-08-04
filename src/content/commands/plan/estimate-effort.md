---
description: "Produce a grounded effort and complexity estimate for a task by exploring the codebase read-only."
seoDescription: "/estimate-effort explores the codebase read-only and produces a grounded effort and complexity estimate — a Claude Code slash command, no code changes made."
date: 2026-06-17
argument-hint: "<task or feature to estimate>"
allowed-tools: "Read, Grep, Glob"
title: "Estimate Effort"
color: "purple"
topics: ["workflow-prompting", "architecture"]
related: ["command:plan-feature", "command:breakdown-task", "command:trace-data-flow"]
featured: false
summary: "A read-only slash command that estimates effort for a task by grounding it in the actual codebase: it pins down scope and explicit non-scope, decomposes the work into independently-shippable subtasks, sizes each as a T-shirt with a rough range, sums to a total, then surfaces the risks, unknowns, dependencies, and assumptions that move the number — plus the first slice to ship to de-risk it."
faq:
  - q: "Why a range instead of a single number?"
    a: "Because the unknowns dominate. A point estimate hides the variance that actually decides whether the task slips. The range is the honest signal; the midpoint is just the middle of it."
  - q: "Does this command write any code or plan files?"
    a: "No. It is read-only — Read, Grep, and Glob only. The estimate is delivered as your message. Pair it with /breakdown-task or /plan-feature when you're ready to execute."
---

Estimate the effort to do the task in `$ARGUMENTS` by grounding it in the real codebase, not in vibes. This is an analysis pass only — read to understand, then deliver an estimate. Do not edit, run, or create anything.

## Scope

Treat `$ARGUMENTS` as the task to size — a feature, a refactor, a migration, a bug ("add SSO via SAML", "split the monolith's billing module into a service", "fix the flaky checkout test"). If it names files, symbols, or routes, those are where your investigation starts.

If `$ARGUMENTS` is empty, do not invent a task. Ask one question — *"What task should I estimate?"* — and stop until they answer.

> [!WARNING]
> Read-only mode. Your only output is the written estimate. An estimate is a range under stated assumptions, never a commitment or a deadline — say so explicitly in the report so nobody quotes the midpoint as a promise.

## Step 1 — Pin down scope and non-scope

Restate the task in one sentence. Then list what is explicitly **out of scope** — the adjacent work a reader might assume is included but isn't (migrations of old data, the admin UI, rollback tooling, docs). Unbounded scope is the single biggest source of estimate error; naming the boundary is half the job.

If the task hides a fork that changes the size by an order of magnitude (rewrite vs. patch? backward-compatible vs. breaking? one provider vs. a pluggable abstraction?), surface it as an open question — do not silently pick the cheap reading.

## Step 2 — Explore the code to ground the estimate

Read enough of the repo to size against reality. Do not guess the structure — find it.

```bash
# Find the symbols, routes, or modules the task touches
grep -rn "checkoutHandler" src/

# Map the surrounding structure and blast radius
find src -path '*billing*' -name '*.ts'

# Gauge how much code already exists vs. needs writing
grep -rln "PaymentProvider" src/
```

Open the entry points, trace one level of callers and callees, and note the seams the change crosses: shared types, config, public APIs, tests, and anything with many inbound references. A change behind a clean interface is small; one that ripples through dozens of call sites is not.

> [!NOTE]
> Existing tests are an effort multiplier in both directions. Good coverage on the touched area shrinks the estimate (you can refactor safely); zero coverage on a critical path inflates it (you must write characterization tests before you dare touch it). Check before you size.

## Step 3 — Decompose into independently-shippable subtasks

Cut the work into subtasks that each land on their own and deliver a checkable result — schema, then store, then the wiring, then tests, then docs. Estimating the whole as one lump is where guesses hide; estimating parts forces you to confront each one. Anything you can't decompose is a sign you don't understand it yet — flag it as a spike.

## Step 4 — Size each subtask and sum

Give each subtask a T-shirt size with a rough hands-on range (these are illustrative — calibrate to the team and stack):

| Size | Rough range | Looks like |
| ---- | ----------- | ---------- |
| S | < ~0.5 day | localized edit, pattern already exists in the repo |
| M | ~0.5–2 days | new code across a couple of files, clear approach |
| L | ~2–5 days | new seam or interface, touches several modules |
| XL | > ~1 week | unknown approach, cross-cutting, or needs a spike first — decompose further |

An XL is a smell: split it until the pieces are L or smaller, or call it a spike whose only deliverable is a smaller estimate. Sum the subtask ranges into a **total range** (low to high), not a single number.

> [!WARNING]
> Do not just add the optimistic ends. Integration, review, and the inevitable "while I was in there" overhead are real — fold them in as their own line or a percentage, and let the high end of the range carry the unknowns rather than burying them.

## Step 5 — Surface risks, dependencies, and assumptions

The estimate is only as good as what could blow it up. List, specifically:

- **Risks / unknowns** that would inflate the number — undocumented behavior, a flaky area, a third-party API you haven't read the docs for, a refactor that might cascade. For each, note roughly how much it could add.
- **Dependencies / sequencing** — what must land first, what's blocked on another team, what can run in parallel.
- **Assumptions** — every "I'm assuming X" you relied on to size it (env exists, no data migration, the happy path only). If an assumption is wrong, the estimate changes — that's the whole point of writing them down.

## Report

Deliver the estimate as your message — it is the whole deliverable.

```markdown
## Effort estimate — <task>

**Scope:** <one sentence>
**Out of scope:** <the boundary>

| # | Subtask | Size | Range |
| - | ------- | ---- | ----- |
| 1 | Define provider config + types | S | < 0.5d |
| 2 | Add SAML assertion parser | L | 2–4d |
| 3 | Wire into the auth middleware | M | 1–2d |
| 4 | Characterization tests for the login path | M | 1–2d |

**Total range:** ~4.5–8.5 days (incl. review + integration)

**Top risks:** <each with how much it could add — e.g. "no tests on auth path: +1–2d if parsing breaks something">
**Dependencies / sequencing:** <what blocks what>
**Assumptions:** <the list — if any is wrong, the estimate moves>
```

End with the **recommended first slice**: the smallest subtask that retires the biggest unknown (usually a spike or the riskiest interface). Shipping it first tightens the whole range — call out which assumptions it will confirm or kill. Remind the reader the total is a range under these assumptions, not a date.