---
description: "Write or refine a metric definition — name, plain-language meaning, grain, filters, source tables and columns, edge cases, and owner — into analysis/metrics/<slug>.md, after searching the repo for a definition that already exists."
seoDescription: "/define-metric writes a metric definition — grain, filters, source columns, edge cases, owner — into analysis/metrics, checking for an existing one first."
date: 2026-09-10
argument-hint: "[metric name]"
allowed-tools: "Read, Write, Glob, Grep"
title: "Define Metric"
color: "purple"
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
featured: false
related: ["skill:sql-explainer", "command:first-look", "agent:analysis-reviewer", "glossary:semantic-layer", "guide:claude-code-for-data-analysts", "guide:claude-skills-for-data-analysts"]
summary: "A Claude Code slash command that writes a metric definition to analysis/metrics/<slug>.md: name, plain-language meaning, grain, filters, source tables and columns, edge cases, and owner. It searches the repo for an existing definition first and refines that one rather than creating a rival, so two teams stop shipping two versions of the same number."
---

Most metric arguments are not disagreements about the data. They are two people using one word for two calculations, with neither definition written down. This command writes the definition into the repository next to the queries that implement it, and searches first, because a second definition of an existing metric is worse than none: if `analysis/metrics/` or the SQL already defines this number, it refines that file rather than opening a rival.

## Scope

`$ARGUMENTS` is a metric name or a description of one. Interpret it in this order:

1. **A short name** ("active users", "MRR", "trial conversion"): treat it as the metric to define, and slug it in kebab-case.
2. **A sentence describing a metric** ("the share of signups that pay within 30 days"): derive a name, propose it, and use the sentence as the first draft of the plain-language definition.
3. **A path to a `.sql` file or a notebook**: read it, work out which metric it computes, and define that. This is the most useful direction, because a definition written from working code starts out true.
4. **Empty**: `Glob` for `analysis/metrics/*.md`, list the metrics already defined, and ask which to refine.

## Step 1 — Search before writing

`Glob` for `analysis/metrics/**` and read anything with a matching or near-matching name. Then `Grep` the repo for the metric's name and its likely synonyms in `.sql`, `.py`, `.ipynb`, dbt models, and dashboard configs. Look for the same number computed under a different name, and the same name computing a different number; both are findings that belong in the definition.

Report what you found before writing: a definition exists and you will refine it, several conflicting implementations exist and the differences must be resolved first, or nothing exists and you are writing the first one. When implementations conflict, list the conflicts with file paths and ask which is authoritative. Do not pick one and write it up as settled.

## Step 2 — Pin the definition down

Work through the fields in order. A field you cannot answer becomes an open question in the file, marked `TBD`, never a plausible guess.

- **Name.** The one the team will use, plus any aliases the search turned up so both resolve to this file.
- **Plain-language definition.** One or two sentences a non-analyst can read, saying what is counted and over what period.
- **Grain.** What one row of the result represents: per user per day, per account per month, per order. Almost every metric dispute is a grain dispute.
- **Filters.** Every condition applied, and for each one the reason: excluded internal accounts, excluded test orders, excluded refunds, a specific status. An unexplained filter is where the next disagreement starts.
- **Source tables and columns.** The exact tables and columns, with a note on any that are nullable or updated in place, since those decide how the metric behaves over time.
- **Edge cases.** How the metric handles nulls, zero denominators, refunds and reversals, backdated rows, deleted accounts, users active in two segments, partial first periods, and time zone. Cover late-arriving data explicitly: whether the number is expected to move after it is first published.
- **Owner.** A named person or team who decides changes, and the date the definition was last agreed.

Where the definition comes from existing SQL, run the [sql-explainer](/skills/analytics/sql-explainer) reading over that query first: its grain statement and its silent-drop list fill in the grain, filters, and edge-case fields directly.

## Step 3 — Write the file

`Write` to `analysis/metrics/<slug>.md` with those fields as headings in that order, plus a `Reference implementation` line pointing at the query that computes it and an `Open questions` list holding every `TBD`. When refining, preserve wording a human wrote, add a dated changelog line saying what changed and why, and never silently alter a grain or filter someone agreed to.

## Output

The file path, whether it was created or refined, the conflicting implementations found with their paths, and the open questions still needing an owner's answer. Then the next step: take those questions to the owner named in the file, profile the underlying data with [/first-look](/commands/analytics/first-look) if you have not, and have the [analysis-reviewer](/agents/analytics/analysis-reviewer) agent check that analyses citing this metric actually implement it. Where these files are maintained as a modeling layer instead, see [semantic layer](/glossary/semantic-layer), [Claude Code for data analysts](/guides/analytics/claude-code-for-data-analysts), and [Claude skills for data analysts](/guides/analytics/claude-skills-for-data-analysts).
