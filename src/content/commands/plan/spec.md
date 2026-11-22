---
description: "Draft spec files for a feature: requirements with EARS acceptance criteria, a design, and a traceable task list, in the repo's Kiro or Spec Kit layout. Stops for review before any implementation."
seoDescription: "/spec drafts requirements with EARS criteria, a design, and a traceable tasks.md in Kiro or Spec Kit layout, then stops for review before any code is written."
date: 2026-11-18
argument-hint: "<feature description>"
allowed-tools: "Read, Grep, Glob, Write"
title: "Spec"
color: "purple"
topics: ["workflow-prompting", "ai-agents-systems"]
audience: ["developers"]
featured: false
related: ["skill:spec-writer", "agent:spec-implementer", "tool:kiro", "tool:spec-kit", "command:plan-feature", "command:write-design-doc", "guide:spec-driven-development", "glossary:spec-driven-development"]
summary: "A slash command that turns a feature description into spec files and stops. It detects Kiro's requirements.md/design.md/tasks.md or Spec Kit's spec.md/plan.md/tasks.md, reads the code the feature touches, and writes EARS acceptance criteria, a code-grounded design, and a dependency-ordered task list traced to the criteria, then waits for review."
---

Draft a spec for the feature in `$ARGUMENTS` and stop for review. This command runs the [spec-writer](/skills/workflow/spec-writer) procedure: it writes requirements with EARS acceptance criteria, a design grounded in the current code, and a `tasks.md` in which every task names the criteria it satisfies. It writes nothing but the spec files.

## Scope

Treat `$ARGUMENTS` as the feature request (`add CSV export to the reports page`, `let admins revoke API keys`). Restate it in one sentence before you start.

If `$ARGUMENTS` is empty, ask one question: *"What feature should I spec?"* Do not invent one.

> [!WARNING]
> Spec only. Write the spec files and nothing else: no source files, no test files, no migrations, no dependency changes. Implementation starts only after a person approves the spec, and then it belongs to the [spec-implementer](/agents/core-development/spec-implementer) agent or a separate session.

## Step 1 — Detect the layout

- `.claude/skills/speckit-*/SKILL.md` exists, or the repo has `spec.md` + `plan.md` + `tasks.md` sets: use Spec Kit's file names. Read the Spec Kit constitution if the repo has one.
- The repo has `requirements.md` + `design.md` + `tasks.md` sets: use Kiro's file names.
- Put the new spec beside the existing ones, following their folder naming.
- Neither: ask which layout to use; with no preference, use Kiro's three names in a folder the user confirms (for example `docs/specs/<feature-slug>/`).

Say which layout you chose and which files told you.

## Step 2 — Clarify

List what the request leaves open: scope edges, error behavior, permissions, limits, effects on existing data. Ask up to five questions in one message. If the user wants a draft now, continue and record each unanswered point as a labelled assumption.

## Step 3 — Read the code

With `Read`, `Grep`, and `Glob` only: the entry points the feature touches, the closest existing feature, the data models, the test layout, and the test command from `CLAUDE.md`, the README, or the manifest.

## Step 4 — Requirements (`requirements.md` or `spec.md`)

Numbered requirements, each with a user story and numbered acceptance criteria in EARS form, `WHEN [condition/event] THE SYSTEM SHALL [expected behavior]`. One observable behavior per criterion; include failure and edge cases; no implementation terms; no unmeasurable adjectives. Close with **Out of scope**, **Assumptions**, and **Open questions**. In Spec Kit layout, keep the tech stack out of `spec.md` and order user stories by priority.

## Step 5 — Design (`design.md` or `plan.md`)

Architecture and components, interfaces and data models, a Mermaid sequence diagram of the main flow, error handling, and testing strategy. Cite real paths from Step 3. Tag each element with the requirement numbers it serves.

## Step 6 — Tasks (`tasks.md`)

Dependency-ordered checkboxes. Each task lists the files it touches, `Requirements: <criterion numbers>`, and `Done when:` the test that proves those criteria. In Spec Kit layout, group into Setup, Foundational, one phase per user story in priority order, and Polish.

## Step 7 — Traceability check

Before reporting, confirm: every criterion is covered by a task, every non-setup task traces to a criterion, every design element serves a requirement, and no criterion uses an untestable word. Fix gaps or list them.

## Report

```markdown
## /spec: CSV export for reports

Layout: Kiro (found docs/specs/billing-alerts/requirements.md, design.md, tasks.md)
Written: docs/specs/report-csv-export/requirements.md, design.md, tasks.md

Traceability: 4 requirements, 11 criteria, 7 tasks; every criterion covered
Assumptions to confirm:
- Row limit of 50,000 per export (from the request thread)
Open questions:
- Should exports include soft-deleted rows?

Stopped for review. No code was written. When approved, hand tasks.md to the spec-implementer agent.
```

> [!TIP]
> For a design document that argues alternatives for human reviewers rather than an agent-executable spec, use [/write-design-doc](/commands/plan/write-design-doc). The [spec-driven development glossary entry](/glossary/spec-driven-development) defines the practice in one page.
