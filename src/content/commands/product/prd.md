---
description: "Turn an idea, pasted notes, or a notes file into a structured PRD and write it to docs/prd.md, or print it when there is no project."
seoDescription: "/prd turns an idea, notes, or a notes file into a PRD with fixed sections and writes docs/prd.md, or prints it outside a project. A Claude Code command."
date: 2026-09-10
argument-hint: "[idea, notes, or file path]"
allowed-tools: "Read, Write, Glob"
title: "PRD"
color: "purple"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
featured: false
related: ["skill:prd-writer", "command:scope-mvp", "command:write-design-doc", "command:plan-feature", "guide:claude-code-for-non-developers", "guide:claude-skills-for-founders"]
summary: "A slash command that runs the prd-writer procedure inside Claude Code: it reads the idea or notes you pass (inline text or a file path), writes a PRD with the fixed sections problem, users, jobs-to-be-done, scope, non-goals, success metrics, open questions, and risks, saves it to docs/prd.md when it is inside a project, and prints it otherwise."
---

Write a product requirements document from whatever the founder gives you and save it where the rest of the project can find it. This command runs the same procedure as the [prd-writer](/skills/product/prd-writer) skill, with one addition: it reads a notes file if given one and writes the result to `docs/prd.md`. It is the first step of the founder sequence described in [Claude Code for non-developers](/guides/founders/claude-code-for-non-developers); the next step is [/scope-mvp](/commands/product/scope-mvp).

## Scope

Interpret `$ARGUMENTS` in this order:

1. If it looks like a path and `Read` succeeds on it (`notes/idea.md`, `~/Desktop/voice-memo.txt`), the file's contents are the input. Treat the rest of `$ARGUMENTS`, if any, as extra notes.
2. Otherwise treat the whole of `$ARGUMENTS` as the idea or notes, verbatim.
3. If `$ARGUMENTS` is empty, ask one question, "What is the idea, or where are the notes?", and stop. Do not invent a product to write a PRD for.

> [!NOTE]
> This command writes a product document: what to build, for whom, and how success will be measured. It does not choose a stack or design the system. For an engineering RFC over an existing codebase, run [/write-design-doc](/commands/plan/write-design-doc) after this, and for a task breakdown run [/plan-feature](/commands/plan/plan-feature).

## Step 1 — Gather the input

Read the input from Scope. Separate what the founder actually stated from what you would have to infer; every inference is tagged `[ASSUMPTION]` in the document and every unresolved point `[OPEN]`. Do not ask clarifying questions before drafting; a marked guess in a draft is faster to correct than a questionnaire.

## Step 2 — Decide where the output goes

Use `Glob` to look for a project marker in the working directory: `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `Gemfile`, or `README.md`. If one exists, the output path is `docs/prd.md`. If none exists, you are not in a project and will print the PRD instead of writing a file.

If `docs/prd.md` already exists, `Read` it and stop with a one-line question: overwrite it, or write to `docs/prd-2.md`? Do not overwrite an existing PRD without being told to.

## Step 3 — Write the PRD

Produce the document with exactly these `##` headings in this order, one to two pages in total:

1. **Problem** — who has it, in what situation, what they do today, and what that costs. No solution language.
2. **Users** — primary user, secondary user, and buyer if different, one or two sentences each.
3. **Jobs-to-be-done** — three to five statements: "When [situation], I want to [motivation], so I can [outcome]."
4. **Scope** — a numbered list of version-one behaviors a user can observe, each testable by clicking through.
5. **Non-goals** — what version one deliberately does not do, with a one-line reason each.
6. **Success metrics** — two to four rows of metric, baseline, target, window. A baseline is a number the founder gave or the text "unknown, measure first"; never a number you supplied.
7. **Open questions** — every `[ASSUMPTION]` and `[OPEN]` tag restated as a question, with who can answer it.
8. **Risks** — a table of risk, likelihood, impact, mitigation, with the riskiest assumption in the first row.

Put a one-line "Sources" note above the first heading naming what the PRD was written from. Re-read the draft and delete any sentence that names a technology, vendor, or screen layout.

## Step 4 — Write or print

In a project, `Write` the document to `docs/prd.md`, creating `docs/` if needed. Outside a project, print the full document in the reply. Either way, do not touch any other file.

> [!WARNING]
> Only write `docs/prd.md` (or the alternate path the founder chose). Never modify source files, configuration, or an existing PRD without confirmation. If the founder's notes contain customer names, contract values, or anything that should not sit in a repository, flag it in the report before writing.

## Output

Report the path written (or "printed, no project detected"), the count of `[ASSUMPTION]` and `[OPEN]` tags, and the Open questions list, since those are what the founder should answer next. Suggest running `/scope-mvp docs/prd.md` to cut the scope, and, once an app exists, pointing the [technical-cofounder](/agents/product/technical-cofounder) agent at it. The wider founder toolkit is described in [Claude skills for founders](/guides/founders/claude-skills-for-founders).
