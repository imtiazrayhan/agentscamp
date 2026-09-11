---
description: "Audit a CRM CSV export for duplicates, past close dates, stale deals, missing required fields, single-threaded deals, owner gaps and format drift, and write a ranked fix list with the record IDs."
seoDescription: "/audit-crm audits a CRM CSV export for duplicates, past close dates, stale deals, missing fields and format drift, and writes a ranked fix list."
date: 2026-09-10
argument-hint: "[path to CRM export CSV] [--stale N]"
allowed-tools: "Read, Glob, Bash, Write"
title: "Audit CRM"
color: "green"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["sales"]
featured: false
related: ["skill:crm-export-auditor", "guide:claude-skills-for-sales", "guide:claude-for-sales-teams", "guide:claude-code-for-revenue-ops", "command:check-outreach", "glossary:revenue-intelligence"]
summary: "A slash command that runs the crm-export-auditor procedure against a CSV export on disk. It profiles the file, finds duplicate clusters, date and currency drift, missing required fields, single-threaded deals and owner gaps, then writes a fix list ranked by reporting impact with the record IDs. Read-only: it never modifies the export."
---

Run the [crm-export-auditor](/skills/sales/crm-export-auditor) procedure against a real export instead of a pasted sample. The skill is portable and works on text you paste anywhere; this command adds the part a terminal is good at — counting, sorting, and grouping a file with tens of thousands of rows — and writes the findings out as a report.

## Scope

Interpret `$ARGUMENTS` in this order:

1. **One path to a `.csv` or `.tsv`** — that is the export.
2. **Several paths** — audit each and produce one report per file, plus a cross-file duplicate check if two files hold the same object.
3. **A directory** — `Glob` for `*.csv` inside it and ask which to audit if more than one matches. Do not audit all of them silently.
4. **`--stale N`** — the stale-activity window in days. Default 30.
5. **Empty** — ask "Which export should I audit?" and stop.

> [!IMPORTANT]
> Read-only. Use `Bash` for inspection only — `wc -l`, `head`, `cut`, `sort`, `uniq -c`, `awk` counting and grouping. Never write to, move, sort in place, or reformat the export, and never pipe it anywhere off the machine. The one file this command creates is its own report.

## Step 1 — Profile before parsing

`wc -l` the file for its row count, `head -1` for the header, and `head -20` for sample rows. If the file is under about 2,000 rows, `Read` it whole; above that, work through `awk` and `cut` per column rather than pulling the whole file into context. Print: row count, column count, and the inferred field map — record ID, account name, domain, contact email, owner, stage, amount, currency, created date, close date, last activity date, contact count. Name every column you could not map, and confirm the map before reporting any number. Ask for the open and closed stage lists, the required fields by stage, and the export date if they are not obvious from the file.

## Step 2 — Build the comparison keys

Normalize once and say what you did: lowercase and trim; strip protocol and `www.` from domains; drop legal suffixes (Inc, LLC, Ltd, GmbH, Corp, PLC, Pty) and punctuation from names; collapse whitespace; lowercase emails and strip plus-addressing. Do this in `awk` over the relevant columns; keep the normalized keys in memory, not in a new file beside the export.

## Step 3 — Run the checks

Report each as a row list with record IDs, not just a count:

- **Duplicates** — exact (same normalized email, or same domain and name), strong (same domain, different name; or same name, different domain), fuzzy (one name a prefix or token-subset of another; same email local part on one domain). Cluster them, propose a survivor by rule (oldest created, then most fields filled, then most recent activity), and separate clusters whose deals differ in stage or amount as merge-with-care.
- **Dates** — close date before the export date on an open deal; close date over 12 months out at an early stage; created after close; last activity blank or older than N days; an implausible pile-up on month and quarter ends; mixed `MM/DD/YYYY` and `DD/MM/YYYY` in one column, detected where some rows carry a first component above 12; dates stored as text; two-digit years.
- **Completeness** — required fields blank by stage, plus placeholder values that mean blank: `N/A`, `TBD`, `unknown`, `test`, `0`, `1900-01-01`.
- **Threading** — open deals with zero or one contact. If the export carries no contact count, say so instead of inferring it.
- **Ownership** — blank owners, owners outside the supplied active list, one owner holding an implausible share of open pipeline, deal owner differing from account owner. Attach the pipeline amount to each.
- **Stage and amount** — blank or zero amount at a late stage; one amount repeated across many deals; amounts stored as text with separators or symbols; negative amounts; won deals with a future close date; lost deals with an open next step.
- **Currency and locale** — more than one symbol in an amount column, non-ISO currency codes, currency with no amount, country and state fields mixing codes and names. Refuse to print a total that sums across currencies; say it is invalid instead.

## Step 4 — Rank and split the fixes

Score each finding by records affected times reporting impact — **High** if it moves a pipeline or forecast total, **Medium** if it moves a segmentation or routing decision, **Low** if it affects one record's readability — and sort High first, most records first inside a tier. Then mark each fix **bulk-safe** (a deterministic transform), **rep-owned** (needs the person who knows the deal), or **admin-owned** (needs a validation rule, a stage gate, or a merge). A merge is never bulk-safe.

## Step 5 — Write the report

`Write` `crm-audit-<YYYY-MM-DD>.md` beside the export with: the file profile and field map, one section per check with record IDs (first 20 plus the total), the duplicate clusters with survivors, the ranked fix list, the reported totals this audit invalidates, and the controls that would stop the High findings recurring. In the reply, print only the profile line, the top five findings, and the invalidated-totals list.

## Output

A written report and a five-line reply. The most useful line is usually the last one: which numbers currently in a dashboard should not be quoted until the High findings are fixed.

Once the data holds up, the pipeline analysis on top of it is Anthropic's `pipeline-review`, covered in the [Claude sales plugin guide](/guides/sales/claude-sales-plugin-guide); the engineering side of this work is [Claude Code for revenue ops](/guides/sales/claude-code-for-revenue-ops), and the term for the category is [revenue intelligence](/glossary/revenue-intelligence). [/check-outreach](/commands/sales/check-outreach) is the companion command for messages rather than records. Everything in the set is listed in [Claude skills for sales](/guides/sales/claude-skills-for-sales).
