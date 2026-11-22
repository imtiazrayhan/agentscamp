---
name: "spec-writer"
title: "Spec Writer"
description: "Turn a feature request into spec files a coding agent can execute: requirements with EARS acceptance criteria (WHEN <condition> THE SYSTEM SHALL <behavior>), a design grounded in the current code, and a dependency-ordered task list in which every task traces to the criteria it satisfies. Writes Kiro's requirements.md, design.md, and tasks.md, or Spec Kit's spec.md, plan.md, and tasks.md, whichever the repository already uses. Use before handing a multi-file feature to an agent, or when an existing spec has acceptance criteria nobody can test."
version: "1.0.0"
allowed-tools: "Read, Grep, Glob, Write"
user-invocable: true
color: "cyan"
date: 2026-11-17
topics: ["workflow-prompting", "ai-agents-systems"]
audience: ["developers"]
tags: ["claude", "spec-driven-development", "ears", "kiro", "spec-kit", "planning", "developers"]
featured: false
related: ["command:spec", "agent:spec-implementer", "tool:kiro", "tool:spec-kit", "tool:taskmaster", "glossary:spec-driven-development", "guide:spec-driven-development", "guide:best-spec-driven-development-tools-2026", "command:write-design-doc", "command:breakdown-task"]
seoDescription: "A Claude skill that turns a feature request into Kiro or Spec Kit spec files: EARS acceptance criteria, a code-grounded design, and traceable tasks."
summary: "This skill turns a feature request into spec files an agent can build from: requirements with EARS acceptance criteria, a design that cites the real code, and a dependency-ordered tasks.md where each task names its criteria and the test that proves them. It writes Kiro's or Spec Kit's file layout, whichever the repo uses, and stops for review."
---

[Spec-driven development](/guides/workflow/spec-driven-development) moves corrections upstream: you fix a sentence in a spec instead of redirecting an agent halfway through a diff. Two file conventions are common. [Kiro](/tools/kiro) generates three files per spec: `requirements.md` (user stories and acceptance criteria in EARS notation), `design.md` (architecture, sequence diagrams, error handling, testing strategy), and `tasks.md` (discrete, trackable implementation tasks). GitHub [Spec Kit](/tools/spec-kit) splits the work into `spec.md` (the what and why, no tech stack), `plan.md` (the technical plan), and a dependency-ordered `tasks.md`. This skill writes whichever layout the repository already uses, so the files work with that tool's own commands and with the [spec-implementer](/agents/core-development/spec-implementer) agent. What it adds over a blank template is discipline: every criterion is testable, every design element serves a requirement, and every task traces to the criteria it satisfies.

## When to use this skill

- A feature touches several files or layers and you want an agent to build it from an agreed spec, not from a chat thread.
- A spec exists, but its acceptance criteria say "fast" or "user-friendly" and nobody could write a test from them.
- The team uses Kiro or Spec Kit and you want a spec in the same format without running the full tool flow.
- Work will span sessions or people, and the task list has to survive a context reset.

## When NOT to use this skill

- A one-file change or a bug with an obvious fix: write the test and fix it, or use [/plan-feature](/commands/plan/plan-feature) for a quick plan.
- A design document for human reviewers that argues alternatives: [/write-design-doc](/commands/plan/write-design-doc).
- Recording a decision already made: the [adr-writer](/skills/docs/adr-writer) skill.
- Building the spec: the [spec-implementer](/agents/core-development/spec-implementer) agent works through `tasks.md` one task at a time.
- Spec Kit is installed and you want its whole flow: run its skills directly (`/speckit-specify`, `/speckit-plan`, `/speckit-tasks`).

## Instructions

1. **Detect the convention before writing anything.**
   - **Spec Kit:** its Claude Code integration installs skills at `.claude/skills/speckit-<command>/SKILL.md`, so `Glob` for `.claude/skills/speckit-*/SKILL.md`. Existing `spec.md` + `plan.md` + `tasks.md` sets also mean Spec Kit. If the repo has a Spec Kit constitution (created by `/speckit-constitution`), read it and follow its principles.
   - **Kiro:** existing `requirements.md` + `design.md` + `tasks.md` sets (a bug spec uses `bugfix.md` in place of `requirements.md`).
   - `Glob` for `**/requirements.md`, `**/spec.md`, and `**/tasks.md`, excluding `node_modules`, and put the new spec beside the existing ones using the same folder naming.
   - **Neither:** ask which layout to use. If the user has no preference, use Kiro's three file names in a folder the user confirms, such as `docs/specs/<feature-slug>/`. Do not invent a tool-specific directory.

2. **Restate the request and surface the gaps.** Write one paragraph: who needs what, and why. List what the request leaves open (scope boundaries, error behavior, permissions, limits, what happens to existing data). Ask up to five questions in one batch. Anything still unanswered becomes a labelled assumption in the requirements, never a silent choice.

3. **Read the code the feature touches.** Use `Read`, `Grep`, and `Glob` on the entry points, the closest existing feature, the data models, the test layout, and `CLAUDE.md` or the README for the test command. Requirements stay free of technology, but you need the code to know what already exists and to write a design that fits.

4. **Write the requirements with EARS acceptance criteria.** Kiro's `requirements.md` uses EARS (Easy Approach to Requirements Syntax): each criterion follows `WHEN [condition/event] THE SYSTEM SHALL [expected behavior]`, for example "WHEN a user submits a form with invalid data THE SYSTEM SHALL display validation errors next to the relevant fields". Structure:
   - Numbered requirements, each with a user story ("As a … I want … so that …").
   - Numbered criteria under each (`1.1`, `1.2`), one observable behavior per criterion, including the failure and edge cases, not only the happy path.
   - No implementation words (no table names, libraries, or endpoints) and no unmeasurable adjectives. "Fast" becomes a threshold; if nobody knows the threshold, it becomes an open question.
   - An **Out of scope** list and an **Assumptions** list.

   For Spec Kit, `spec.md` holds the same content: the what and the why, with the tech stack left for `plan.md`. Order the user stories by priority, because Spec Kit's task phases follow that order. Use EARS criteria unless the repo's existing `spec.md` files use another criteria format; then match theirs.

5. **Write the design (`design.md` or `plan.md`).** Cover architecture and components, interfaces and data models, a sequence diagram for the main flow, error handling, and the testing strategy. Cite real file paths and symbols from step 3. Every design element names the requirement numbers it serves; an element that serves none is either scope creep or a missing requirement, so resolve it.

6. **Write `tasks.md`.** A checkbox list, dependency-ordered, each task small enough for one focused session:

   ```markdown
   - [ ] 3. Add the export endpoint
     - Files: src/routes/reports.ts, src/services/export.ts
     - Requirements: 1.1, 1.3, 2.2
     - Done when: test/export.test.ts "returns 413 when the report exceeds the row limit" passes
   ```

   Every task names the criteria it satisfies and the test that proves them; put the test first in the task when that is practical. For Spec Kit, group tasks in its phases: Setup, Foundational (blocking prerequisites), one phase per user story in priority order, then Polish, and mark tasks that can run in parallel with the marker the repo's existing `tasks.md` files use.

7. **Check traceability before handing over.** Every criterion is covered by at least one task. Every task other than setup traces to at least one criterion. Every design element serves a requirement. No criterion contains an untestable word. If Spec Kit is installed, its `/speckit-analyze` step runs a read-only consistency check across `spec.md`, `plan.md`, and `tasks.md`; recommend it.

8. **Stop for review.** The spec is the deliverable. Do not start implementing, and do not create source or test files. Report the files written, the open questions, and the assumptions the reviewer must confirm.

> [!WARNING]
> An acceptance criterion an agent cannot test is a criterion the agent will decide for you. "THE SYSTEM SHALL handle large reports gracefully" turns into whatever the implementing session finds easiest. Name the condition and the observable result, or list the question under Open questions and leave the criterion out until someone answers it.

> [!NOTE]
> The spec does not need to be long. Three requirements with sharp criteria beat fifteen vague ones, and a reviewer reads them. Spec-driven work pays off on features with real surface area; for a spike, the spec would be fiction.

## Output

The spec files in the detected layout (`requirements.md`, `design.md`, `tasks.md`, or `spec.md`, `plan.md`, `tasks.md`), and a short report: the layout chosen and why, the files written, a traceability summary (criteria count, tasks count, any gaps), the open questions, and the assumptions.

## Example

Excerpt from a Kiro-layout spec for a fictional "Acme Reports" CSV export:

```markdown
## Requirement 1: Export a report as CSV

**User story:** As an account admin, I want to download a report as CSV, so that I can analyse it in a spreadsheet.

### Acceptance criteria
1.1 WHEN an admin selects "Export CSV" on a report THE SYSTEM SHALL download a UTF-8 CSV file with one header row and one row per report line.
1.2 WHEN a report has zero rows THE SYSTEM SHALL download a CSV that contains only the header row.
1.3 WHEN a report exceeds 50,000 rows THE SYSTEM SHALL refuse the export and show "This report is too large to export; filter it first."
1.4 WHEN a user without the admin role requests an export THE SYSTEM SHALL return a 403 response and download nothing.

### Assumptions
- The 50,000-row limit comes from the request thread; confirm before implementation.

### Out of scope
- Scheduled or emailed exports.
```

The [/spec](/commands/plan/spec) command runs this procedure from a feature description and stops for review. Once the spec is approved, the [spec-implementer](/agents/core-development/spec-implementer) agent builds `tasks.md` one checked-off task at a time. The [best spec-driven development tools](/guides/comparisons/best-spec-driven-development-tools-2026) roundup compares Kiro, Spec Kit, and the alternatives.
