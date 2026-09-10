---
description: "Cut a PRD or feature list to a version one: a keep / cut / later table with reasons plus the smallest build that tests the riskiest assumption, written to docs/mvp-scope.md."
seoDescription: "/scope-mvp cuts a PRD or feature list to a v1 keep / cut / later table plus the smallest test of the riskiest assumption, saved to docs/mvp-scope.md."
date: 2026-09-10
argument-hint: "[prd path or feature list]"
allowed-tools: "Read, Write, Glob"
title: "Scope MVP"
color: "purple"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
featured: false
related: ["skill:mvp-scope-cutter", "command:prd", "command:breakdown-task", "agent:technical-cofounder", "guide:build-an-mvp-with-claude-code", "guide:claude-skills-for-founders"]
summary: "A slash command that runs the mvp-scope-cutter procedure inside Claude Code: it reads a PRD file or an inline feature list (defaulting to docs/prd.md), names the core job and the riskiest assumption, sorts every feature into keep, cut, or later with a one-line reason, describes the smallest build that tests the assumption, and writes docs/mvp-scope.md."
---

Take the PRD or feature list the founder points at and produce a version one that can ship: every feature sorted into keep, cut, or later with a reason, plus the smallest thing that would test whether anyone wants the product. This command runs the [mvp-scope-cutter](/skills/product/mvp-scope-cutter) procedure and saves the result to `docs/mvp-scope.md`. It is normally run right after [/prd](/commands/product/prd), and before opening the builder session described in [Build an MVP with Claude Code](/guides/founders/build-an-mvp-with-claude-code).

## Scope

Interpret `$ARGUMENTS` in this order:

1. If it is a path and `Read` succeeds (`docs/prd.md`, `notes/features.txt`), that file is the input.
2. Otherwise treat `$ARGUMENTS` as an inline feature list, one feature per line or comma-separated.
3. If `$ARGUMENTS` is empty, `Glob` for `docs/prd.md` and use it if present. If it is absent too, ask "Which PRD or feature list should I cut?" and stop.

> [!NOTE]
> This command decides what is in version one. It does not estimate effort, order tasks, or write code. For a task breakdown of the kept list, run [/breakdown-task](/commands/plan/breakdown-task) next.

## Step 1 — Flatten the features

Extract every capability from the input into a numbered list. From a PRD, take the Scope section plus anything in the body that reads like a feature. Split compound items into one feature each and merge duplicates. The table refers to features by these numbers.

## Step 2 — Name the core job and the riskiest assumption

Write the core job in one sentence: who does what, to get what outcome. Use the PRD's first jobs-to-be-done statement if there is one; otherwise write your best reading and tag it `[ASSUMPTION]`.

Then write the riskiest assumption as "We believe [users] will [behavior] because [reason]." Prefer a demand or behavior assumption over a technical one; technical risk is usually cheaper to test and less often fatal.

## Step 3 — Sort every feature

For each numbered feature, answer two questions: is it required for a user to complete the core job once, end to end, and does it produce evidence about the riskiest assumption? Keep if either is yes. Later if it is useful but the job completes without it. Cut if it serves a different user, a different job, or exists only because a competitor has it.

Unless the feature is the core job itself, admin panels, settings, roles and permissions, integrations, notifications, dashboards, billing tiers, onboarding tours, dark mode, and native mobile go to later. For any expensive keep, propose the manual substitute (a spreadsheet, a hand-sent email, a form plus an automation) and mark it "manual for v1".

Write the reason column in one line that references the core job, the assumption, or a default. "Nice to have" is not a reason. If more than seven features are kept, sort again more strictly or state in one sentence why this product needs more.

## Step 4 — Write docs/mvp-scope.md

`Write` a document with this structure, creating `docs/` if needed:

```markdown
# MVP scope — <product name>

Core job: <one sentence>
Riskiest assumption: We believe <users> will <behavior> because <reason>.

| # | Feature | Verdict | Reason |
| --- | --- | --- | --- |

## Smallest thing that tests the riskiest assumption
<what to put in front of people, who, the pass and fail signal as observable behavior, and how long>

## Version one in one sentence
<a sentence a user would understand>

## Kept features
<the keep rows again, as a plain list, ready for a task tracker or a build prompt>
```

If `docs/mvp-scope.md` already exists, `Read` it first and ask whether to overwrite before writing.

> [!WARNING]
> Never add a feature that was not in the input, and never move a feature to keep on taste. Only write `docs/mvp-scope.md`; do not touch the PRD, source files, or configuration.

## Output

Report the path written, the keep, cut, and later counts, the riskiest assumption, and the one-sentence version one. Suggest the next step: `/breakdown-task` on the kept list, or, if an AI builder has already produced an app, running the [technical-cofounder](/agents/product/technical-cofounder) agent over it before adding anything. The full founder sequence is described in [Claude skills for founders](/guides/founders/claude-skills-for-founders).
