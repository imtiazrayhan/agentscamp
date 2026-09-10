---
name: "dataset-first-look"
description: "Turn a pasted CSV header with sample rows, a pasted table, or an attached data file into a fixed plain-language profile: shape, column inventory with inferred types, null and blank patterns, cardinality, suspicious columns, duplicate-key risk, outliers worth a look, and the questions to settle before analyzing. Use when a dataset just landed and you need to know what you are holding before you write a query."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["claude", "analysts", "data-profiling", "csv", "cowork"]
featured: false
related: ["command:first-look", "skill:spreadsheet-formula-auditor", "skill:chart-chooser", "agent:analysis-reviewer", "agent:data-scientist", "guide:claude-skills-for-data-analysts"]
seoDescription: "A Claude skill that profiles a pasted or attached dataset: shape, types, nulls, cardinality, suspicious columns, duplicate-key risk, and what to ask first."
summary: "Paste a header with a few rows, paste a table, or attach a data file, and this skill returns the same profile every time: shape, column inventory with inferred types, null and blank patterns, cardinality, suspicious columns, duplicate-key risk, outliers, and the questions to settle before analyzing. It never guesses a number it could not see."
---

The first ten minutes with a new dataset decide whether the analysis is worth anything, and they are the minutes most often skipped. This skill runs a fixed first pass over whatever you can give it: a header and a few rows pasted into chat, a table copied from a spreadsheet, or a file attached to the conversation. One profile in one shape, so two datasets compare and a second look diffs against the first. It needs only what you paste or attach, so it runs the same on claude.ai, in Claude Code, and in Claude Cowork, where [/first-look](/commands/analytics/first-look) runs it over a file on disk and saves the result.

## When to use this skill

- An extract arrived from another team and nobody can tell you what is in it.
- You are about to query an unfamiliar table and want the traps listed first.
- A number came out wrong and you suspect the source data rather than the logic.
- You need a written record of the dataset's condition to attach to an analysis.

> [!NOTE]
> This skill reasons over what you show it. It does not run code, connect to a warehouse, or compute statistics across rows it cannot see. Anthropic's data plugin ships an `explore-data` skill that profiles by executing against a connected source; use that when you have the connection. Use this one when you have a sample, no execution environment, and want the same report shape every time.

## Instructions

1. **Say what you inspected, first and plainly.** One line naming the input and its limits: "23 pasted rows out of a stated 1.4M", "the full attached CSV, 8,412 rows", "a header and 5 rows; no row count supplied". Every later statement inherits that scope. If no row count was given and you cannot see one, write "row count not supplied" and never estimate it.
2. **Report the shape.** Column count, row count if known, file or sheet name, and whether the header row looks like a header (names, not values) or like data that lost its header.
3. **Build the column inventory** as a table, one row per column: name, inferred type, evidence, example values, confidence. Infer from values, never from the name; a column called `date` holding `20240113` is an integer encoding a date, and both facts belong in the row.
4. **Report null and blank patterns.** Distinguish four things people conflate: a true null, an empty string, whitespace only, and a literal `NULL`, `N/A`, `-`, or `none` typed as text. Say whether nulls cluster (one date range, one segment) rather than scattering. Clustering is a finding; scatter usually is not.
5. **Report cardinality.** Per column, distinct values in what you can see: one value, a handful (a category), many with repeats (a dimension), or unique per row (a key or free text). Where the sample is partial, say "in the rows shown".
6. **List suspicious columns.** Go through this list every time, and say when a check found nothing: mixed types in one column; sentinel values standing in for missing data (`-999`, `0` in a price column, `1900-01-01`); leading or trailing spaces; inconsistent categories (`US`, `us`, `USA`, `United States`); numbers stored as text; dates in more than one format; encoding damage; and IDs long enough to have lost precision in a spreadsheet.
7. **Assess duplicate-key risk.** Name the column or combination that looks like the intended grain, say whether it is unique in the rows you can see, and say plainly that uniqueness in a sample is not uniqueness in the table. Give the check that settles it.
8. **Flag outliers worth a look**, not every extreme value: impossible values (negative quantities, future timestamps), values orders of magnitude from their neighbors, and dates outside the range the dataset claims to cover. Say what each would do to a mean or a sum.
9. **Write the questions to answer before analyzing.** Five to ten, each answerable by a person or a query, ordered by how badly a wrong answer would break the analysis: what is one row, what period does this cover, are rows updated in place or only appended, what does a null here mean, what was filtered out before it reached you.
10. **Close with a one-line verdict:** ready to analyze, ready with named caveats, or blocked until a question is answered.

## Output

One profile in the order above: scope line, shape, column inventory table, nulls, cardinality, suspicious columns, duplicate-key risk, outliers, questions, verdict. Save it beside the data, which is what [/first-look](/commands/analytics/first-look) does for you, and hand the questions to whoever owns the source. When the data is a spreadsheet model rather than a flat extract, the [spreadsheet-formula-auditor](/skills/analytics/spreadsheet-formula-auditor) skill audits the formulas behind the numbers; once it is clean, [chart-chooser](/skills/analytics/chart-chooser) picks how to show it.

## Example

Excerpt from a profile of a pasted order extract:

```markdown
Inspected: 30 pasted rows of a stated 240,000; 11 columns. Statements below cover the 30 rows shown.

| Column | Inferred type | Evidence | Example | Confidence |
| --- | --- | --- | --- | --- |
| order_id | integer key | unique across 30 rows, monotonic | 100482 | high |
| country | category, dirty | 4 spellings of 2 countries | "us", "USA" | high |
| discount | number as text | separators, one "N/A" | "1,250" | high |
| shipped_at | date, sentinel | 6 rows read 1900-01-01 | 2026-08-14 | medium |

Suspicious: `shipped_at` uses 1900-01-01 where a spreadsheet wrote an empty date. Treat as unshipped.
Duplicate-key risk: `order_id` is unique in 30 rows. Confirm on the full table before joining on it.

## Questions before analyzing
1. Is one row an order or an order line? `discount` looks per-line.
2. Are orders updated in place after shipping, or appended as new rows?
```

Where this sits in the analyst set is covered in [Claude skills for data analysts](/guides/analytics/claude-skills-for-data-analysts); the [analysis-reviewer](/agents/analytics/analysis-reviewer) agent checks the finished analysis that this profile starts.
