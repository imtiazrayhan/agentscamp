---
description: "Read a UI screenshot from a path or URL, run the fixed design critique checklist over it, and write the report to design/critiques/ without touching the design or the code."
seoDescription: "/critique-screen reads a UI screenshot, runs a seven-area design critique with severities and fixes, and saves the report under design/critiques/."
date: 2026-09-10
argument-hint: "[image path]"
allowed-tools: "Read, Write, Glob"
title: "Critique Screen"
color: "purple"
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
featured: false
related: ["skill:design-critique-checklist", "command:audit-accessibility", "agent:accessibility-auditor", "guide:claude-code-for-designers", "guide:claude-skills-for-designers"]
summary: "A Claude Code slash command that reads the screenshot you point it at, applies the design-critique-checklist skill's seven areas, and writes a dated Markdown report to design/critiques/. If a critique of the same screen already exists it diffs against it, so you can see which findings were fixed and which came back."
---

Point this at a screenshot and get a written critique on disk. It runs the [design-critique-checklist](/skills/design/design-critique-checklist) skill's seven areas over the image, gives every finding a severity and a fix, and saves the report so the next round can be compared against it. Claude Code's `Read` tool renders image files, so a PNG or JPG in your repo is readable the same way a source file is. The command writes one file and nothing else: it never edits your components, your styles, or the image.

## Scope

Interpret `$ARGUMENTS` in this order:

1. **One image path** (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`): `Read` it. That is the screen. The report name is the file's basename.
2. **Several image paths** separated by spaces: critique each, write one report per image, and add a short "Across screens" section at the end of the last report noting inconsistencies between them.
3. **A URL**: you cannot fetch it with the tools this command has. Reply with one line asking for the file to be saved into the project, and stop.
4. **A path plus a phrase** (`login.png mobile onboarding, exploration stage`): the phrase is context. Use it for the Context line and to judge whether the visual hierarchy matches the screen's purpose.
5. **Empty**: `Glob` for `design/**/*.png`, `**/screenshots/*.png`, and `**/*.png` at the repo root, list at most ten of the most recently modified matches, ask which one, and stop. Never pick for the user.

If `Read` fails on a path, say so and continue with the others. Do not substitute a similar filename.

> [!NOTE]
> This is a design critique, not an accessibility audit. Contrast observations are tagged CHECK and never stated as a pass or a failure. For WCAG measurement run [/audit-accessibility](/commands/analyze/audit-accessibility) or the [accessibility-auditor](/agents/quality-security/accessibility-auditor) agent against the implemented component, where ratios and focus order can actually be computed.

## Step 1 — Read the image and set the context

Read the image, then write the Context line: platform as it appears, apparent purpose of the screen, and the state shown (populated, empty, mid-flow). If a brief exists, `Glob` for `design/briefs/*.md` and read one whose name matches the image; judge hierarchy against the goal it states rather than against a general idea of a good screen. Say in the report whether a brief was found.

## Step 2 — Run the checklist

Work the seven areas in order: hierarchy, spacing and alignment, typography, color and contrast (observed only), states, consistency, and copy. Assign severity deterministically. **High**: a user could fail the task or be misled, such as two competing primary actions, no error treatment on a form, or meaning carried by color alone. **Medium**: the task gets slower or more confusing. **Low**: polish. Every finding gets a location in the screen's own terms and one fix that addresses only that finding.

## Step 3 — Diff against the previous critique

`Glob` for `design/critiques/<basename>*.md`. If an earlier report exists, read it and compare finding by finding. Classify each previous finding as **Fixed** (no longer visible), **Open** (still present), or **Regressed** (was absent in a later round and is back), and mark findings that appear for the first time as **New**. If no earlier report exists, say so in one line; do not invent a history.

## Step 4 — Write the report

Write to `design/critiques/<basename>-<YYYY-MM-DD>.md` using the checklist's fixed format: title, Context, Summary counts, the findings table, Missing states, Works well, Not assessed, and the Since last critique section from step 3. Create `design/critiques/` if it does not exist. Never overwrite an existing report; the dated filename is what makes the diff possible.

## Output

The path written, the summary line (counts by severity), the High findings inline in the reply so they are visible without opening the file, and the since-last-critique counts. Then one next-step line: hand the implemented component to the [accessibility-auditor](/agents/quality-security/accessibility-auditor) agent for the checks this command deliberately leaves out. Setting the command up alongside the rest of a designer's Claude Code project is covered in [Claude Code for designers](/guides/design/claude-code-for-designers), and the skill it wraps in [Claude skills for designers](/guides/design/claude-skills-for-designers).
