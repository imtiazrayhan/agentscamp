---
name: "crm-export-auditor"
description: "Audit a CRM CSV export for the data faults that make every report built on it wrong: exact and near-duplicate accounts and contacts, close dates already in the past on open deals, deals with no activity in the last N days, blank required fields by stage, single-threaded deals carrying one contact, records with no owner or a departed one, stage and amount combinations that contradict each other, and currency, date and country formats that drift between rows. Returns a fix list ordered by how much each fault distorts a reported number, with the record IDs to correct and which fixes are safe to apply in bulk. Use when a pipeline number is disputed, when a migration or a dedupe is being planned, or when nobody has checked the export the forecast is built on."
version: "1.0.0"
color: "green"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["sales"]
tags: ["claude", "sales", "crm", "data-quality", "revops"]
featured: false
related: ["command:audit-crm", "guide:claude-skills-for-sales", "guide:claude-for-sales-teams", "guide:claude-code-for-revenue-ops", "guide:claude-sales-plugin-guide", "skill:dataset-first-look", "tool:attio", "glossary:revenue-intelligence"]
seoDescription: "A Claude skill that audits a CRM CSV export for duplicates, past close dates, stale deals, missing fields, single-threaded deals, and format drift."
summary: "Paste or attach a CRM export and this skill audits the file itself: duplicate accounts and contacts, close dates in the past on open deals, deals with no recent activity, blank required fields, single-threaded deals, owner gaps, stage and amount contradictions, and date or currency formats that drift. You get a fix list ranked by reporting impact, with record IDs."
---

Anthropic's [sales plugin](https://github.com/anthropics/knowledge-work-plugins) ships `pipeline-review` and `forecast`, and both grade what is in the export. Neither tells you the export is unreliable. This skill does only that: it treats the CSV as the thing under test, not the pipeline, and reports the duplicates, gaps, contradictions and format drift that quietly move a forecast number. It needs no database access and no tooling — paste the header with rows, or attach the file — so it runs the same in claude.ai, Claude Code, and Claude Cowork. [/audit-crm](/commands/sales/audit-crm) is the runner for larger files.

## When to use this skill

- The forecast number and the CRM number disagree and nobody knows which is wrong.
- Before a CRM migration, a merge of two instances, or a dedupe run.
- After an import, an enrichment job, or a sequencer syncing contacts back in.
- A rep left and their records need reassignment.
- Before handing pipeline data to a model, a dashboard, or a board deck.
- Quarterly, as the hygiene pass that runs before pipeline review rather than during it.

> [!NOTE]
> This is read-only by design. It produces a change list; it never edits the CRM and never rewrites your file. Export only the columns the audit needs — a full export of every contact's email and phone is more personal data than this job requires, and [Data privacy for LLM apps](/guides/ai-safety/data-privacy-for-llm-apps) covers why that matters. Every threshold below is a default you can override in one line.

## Inputs to ask for

1. The export itself, or its header plus a representative sample of rows if the file is very large.
2. The export date, and today's date if they differ.
3. Which object the file holds: deals/opportunities, accounts, contacts, or a joined view.
4. The list of open stages and closed stages, in order.
5. Which fields are required, and at which stage they become required.
6. The stale-activity window, N days. Default 30.
7. The list of active owners, if you want departed-rep records flagged.

If the field map is not supplied, infer it from the header, then print the inferred map and ask for confirmation before reporting numbers. Never infer a column's role from its values alone.

## Instructions

1. **Profile the file.** Row count, column count, and per column: fill rate, distinct value count, and the three most common values. Print the inferred field map: record ID, account name, domain, contact email, owner, stage, amount, currency, created date, close date, last activity date, contact count. Name every column you could not map; an unmapped column is a finding, not a rounding error.
2. **Normalize before comparing.** Build the comparison keys once and say what you did: lowercase and trim everything; strip `www.` and the protocol from domains; drop legal suffixes (Inc, Inc., LLC, Ltd, Limited, GmbH, S.A., Pty, PLC, Co, Corp, Corporation) and punctuation from company names; collapse internal whitespace; normalize emails to lowercase and strip plus-addressing.
3. **Find duplicates.** Report clusters, not pairs, in this order:
   - **Exact** — identical normalized email, or identical normalized domain plus identical normalized name.
   - **Strong** — identical normalized domain with different names, or identical normalized name with different domains.
   - **Fuzzy** — normalized names differing only by a token ("Acme" / "Acme Digital"), one being a prefix of the other, or emails sharing a local part on the same domain.
   For each cluster: the record IDs, what matches, what differs, and a proposed survivor chosen by rule — oldest created date, then most fields filled, then most recent activity. Mark clusters where the deals differ in amount or stage as merge-with-care; those are the ones that double-count revenue.
4. **Check the dates.** Every check is a row list, not a count:
   - Close date earlier than the export date on a deal in an open stage.
   - Close date more than 12 months out on a deal in an early stage.
   - Created date after the close date, or after the last activity date.
   - Last activity blank, or older than N days, on an open deal.
   - Close date landing on the last day of a month or quarter across an implausible share of rows — a sign of a default, not a forecast.
   - Format drift: mixed `MM/DD/YYYY` and `DD/MM/YYYY` in one column, detectable where some rows have a first component above 12 and others do not; mixed ISO and locale formats; dates stored as text; two-digit years; timezone suffixes on some rows only.
5. **Check completeness by stage.** For each required field, the count and the record IDs of rows that are blank, and the stage they are in. A field blank at the first stage is noise; the same field blank at a late stage is a broken report. Also flag placeholder values that are not blank but mean blank: `N/A`, `TBD`, `unknown`, `test`, `asdf`, `0`, `1900-01-01`, a single dot.
6. **Check threading.** Deals in an open stage with zero or one associated contact, and deals where every contact shares one email domain that does not match the account domain. If the export has no contact-count column, say so rather than inferring threading from anything else.
7. **Check ownership.** Blank owner; an owner not in the supplied active list; a single owner holding an implausible share of open pipeline; deals whose owner differs from the account owner. Report the pipeline amount attached to each, because that is the number that moves when the records get reassigned.
8. **Check stage and amount coherence.** Amount blank or zero at a late stage; the same amount repeated across many deals (a placeholder, usually a round number); amounts stored as text with thousands separators or a symbol; negative amounts; closed-won deals with a future close date; closed-lost deals with a next step or an open task; probability that contradicts the stage; a deal amount larger than any historical closed-won deal in the file.
9. **Check currency and locale.** More than one currency symbol inside a single amount column; a currency column whose values are not ISO 4217 codes; rows with a currency but no amount; a total that sums across currencies without conversion — say the total is invalid rather than printing it. Same for country and state fields mixing codes and full names.
10. **Rank the fix list.** Score each finding by records affected times reporting impact, where reporting impact is: **High** if it changes a pipeline or forecast total (duplicates, amount errors, currency mixing, past close dates), **Medium** if it changes a segmentation or a routing decision (owner gaps, missing fields, country drift), **Low** if it only affects a single record's readability. Sort High first, and inside a tier, most records first.
11. **Split the fixes by who can do them.** Mark each fix **bulk-safe** (a deterministic transform: date reformat, currency code normalization, whitespace, placeholder to blank), **rep-owned** (needs the person who knows the deal: close date, next step, contact), or **admin-owned** (needs a validation rule, a required-field change, a dedupe rule, or a merge). A merge is never bulk-safe.
12. **Name what would stop it recurring.** For each High finding, the one control that prevents it: a validation rule, a required field at a stage gate, a picklist instead of free text, a dedupe rule on domain, an integration mapping fixed at the source.

## Output

1. **File profile** — shape, field map, unmapped columns, fill rates.
2. **Findings** — one section per check, each with the count, the record IDs (truncated to the first 20 with the total stated), and an example row.
3. **Ranked fix list** — impact tier, records affected, the fix, and the owner class.
4. **Duplicate clusters** — with proposed survivors and the merge-with-care set separated out.
5. **Numbers you should not trust yet** — the specific reported totals this audit invalidates, and why.
6. **Prevention** — the controls that stop the High findings coming back.

## Example

An excerpt from an audit of a 1,840-row opportunity export:

```markdown
| Impact | Records | Finding | Fix | Owner |
|---|---|---|---|---|
| High | 61 | Open deals with a close date before the export date | Reset or close | rep |
| High | 34 | Duplicate account clusters (14 exact, 20 strong on domain) | Merge, survivor = oldest | admin |
| High | 9 | Amount column mixes "$1,200" text and 1200 numeric | Cast to numeric | bulk-safe |
| Medium | 212 | Open deals with no activity in 30 days | Triage or close | rep |
| Medium | 7 | Owner not in the active-rep list | Reassign | admin |

Do not trust yet: open pipeline total (duplicates + text amounts),
weighted forecast (past close dates), per-rep coverage (owner gaps).
```

The health analysis this makes trustworthy is Anthropic's `pipeline-review`, covered in the [Claude sales plugin guide](/guides/sales/claude-sales-plugin-guide); the wider engineering side of the same job is in [Claude Code for revenue ops](/guides/sales/claude-code-for-revenue-ops). For a first pass on any unfamiliar dataset, [dataset-first-look](/skills/analytics/dataset-first-look) is the general-purpose version; CRMs built for this kind of extensibility, like [Attio](/tools/attio), are covered alongside the rest of the stack in [Claude for sales teams](/guides/sales/claude-for-sales-teams) and [revenue intelligence](/glossary/revenue-intelligence). The full installable set is in [Claude skills for sales](/guides/sales/claude-skills-for-sales).
