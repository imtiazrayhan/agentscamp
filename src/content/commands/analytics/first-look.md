---
description: "Read the first rows and the true row count of a CSV or spreadsheet, profile it against a fixed checklist, and write the result to analysis/profiles/<name>.md so the dataset's condition is on record before anyone queries it."
seoDescription: "/first-look profiles a CSV or XLSX in Claude Code: shape, types, nulls, cardinality, suspicious columns, and duplicate-key risk, saved as a Markdown profile."
date: 2026-09-10
argument-hint: "[data file path]"
allowed-tools: "Read, Write, Glob, Bash"
title: "First Look"
color: "purple"
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
featured: false
related: ["skill:dataset-first-look", "command:define-metric", "agent:analysis-reviewer", "guide:claude-code-for-data-analysts", "guide:claude-skills-for-data-analysts"]
summary: "A Claude Code slash command that profiles a data file before you analyze it. It counts the rows for real rather than estimating, samples the head and the tail, runs the dataset-first-look checklist over what it read, and writes analysis/profiles/<name>.md: shape, columns, nulls, cardinality, suspicious values, and the questions to settle first."
---

Profile a data file before you write a query against it, and leave the profile on disk so the next person does not repeat the work. This command runs the [dataset-first-look](/skills/analytics/dataset-first-look) procedure over a real file: it counts the rows exactly instead of guessing, samples enough of them to infer types, works through the same checklist every time, and writes the result to `analysis/profiles/`. Committed alongside the analysis, those profiles become a record of what the data looked like on the day the numbers were produced.

## Scope

`$ARGUMENTS` is a path to a data file. Interpret it in this order:

1. **A `.csv`, `.tsv`, or `.txt` path**: use it directly.
2. **A `.xlsx` or `.xls` path**: use it, and treat each sheet as a separate profile section. If a sheet is a formula model rather than an extract, say so and point at the [spreadsheet-formula-auditor](/skills/analytics/spreadsheet-formula-auditor) skill instead of profiling it as data.
3. **A `.json`, `.jsonl`, or `.parquet` path**: profile what you can read and state plainly what the format prevented you from seeing.
4. **A directory**: `Glob` for data files inside it, list what you found with sizes, and ask which one to profile. Do not profile all of them silently.
5. **Empty**: `Glob` for `data/**`, `*.csv`, and `*.xlsx` from the project root, list the candidates, and stop.

If the path does not exist, say so and stop. Never profile a file you did not read.

## Step 1 — Establish the real shape

Get the facts a sample cannot give you. Count lines with `wc -l` and subtract the header. Get the file size. Read the header row and the first 50 data rows with `head`, then the last 20 with `tail`, because export bugs, trailing totals rows, and truncation live at the end of a file. For a delimited file, check the delimiter and the quoting before trusting any column split. For a spreadsheet, read the sheet names first.

Record exactly what you read: "1,402,881 data rows counted with `wc -l`; 70 rows inspected (first 50, last 20)". Every statement in the profile is scoped to that.

## Step 2 — Run the checklist

Apply the [dataset-first-look](/skills/analytics/dataset-first-look) procedure to what you read, in its order: column inventory with inferred types and evidence, null and blank patterns, cardinality, suspicious columns (mixed types, sentinel values, trailing spaces, inconsistent categories, numbers stored as text, mixed date formats), duplicate-key risk, and outliers worth a look.

Where a check needs more than the sampled rows to settle, use `Bash` on the file rather than guessing: `cut` and `sort -u` on a column to see its real distinct values, `sort | uniq -d` on the candidate key to test uniqueness across the whole file, `grep -c` for a sentinel. Say in the profile which findings came from the full file and which from the sample. Read only; never edit the data file.

## Step 3 — Write the profile

`Write` to `analysis/profiles/<name>.md`, where `<name>` is the data file's basename without its extension, creating the directory if needed. Include a `Source` line with the path, the file's modification date, and the row count, so the profile can be matched to the extract it describes.

If a profile for that name already exists, read it first and add a dated section rather than overwriting it, then note what changed since the last run: new columns, a changed row count, a category that appeared or disappeared. A diff between two profiles is often the fastest explanation for a number that moved.

## Output

The profile path, the row count and column count, the count of findings by category, and the questions-to-answer list printed in the terminal so you can act on it without opening the file. Then the next step: take the questions to whoever owns the source, and when you write the query, use [/define-metric](/commands/analytics/define-metric) to pin the metric definition it implements. Before the finished analysis ships, the [analysis-reviewer](/agents/analytics/analysis-reviewer) agent reads the profile alongside the code. The rest of the analyst set is in [Claude skills for data analysts](/guides/analytics/claude-skills-for-data-analysts), and the Claude Code setup around it in [Claude Code for data analysts](/guides/analytics/claude-code-for-data-analysts).
