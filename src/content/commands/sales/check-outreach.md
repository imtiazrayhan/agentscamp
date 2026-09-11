---
description: "Fact-check a drafted outreach email, or a folder of them, against the research files it was written from and write an annotated report with a claims table, without editing the draft."
seoDescription: "/check-outreach fact-checks a drafted outreach email against its research files and writes a claims table with a send, fix, or hold verdict per draft."
date: 2026-09-10
argument-hint: "[draft path or pasted email] [research path]"
allowed-tools: "Read, Glob, Write"
title: "Check Outreach"
color: "cyan"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["sales"]
featured: false
related: ["skill:outreach-claim-checker", "guide:claude-skills-for-sales", "guide:claude-for-sales-teams", "guide:research-prospects-with-claude", "command:audit-crm", "agent:sales-engineer"]
summary: "A slash command that runs the outreach-claim-checker procedure on a draft file, a folder of drafts, or a pasted email. It marks every factual and personalization claim sourced, unsourced, contradicted, or stale against the research files you point it at, writes an annotated report next to the drafts, and never edits the draft itself."
---

Run the [outreach-claim-checker](/skills/sales/outreach-claim-checker) procedure over drafts on disk and get a report you can hand back to whoever wrote them. Every claim about the prospect is traced to a line in the research, or it is not claimed. The command reads and writes a report; it never edits a draft, so it is safe to point at a folder someone else owns.

## Scope

Interpret `$ARGUMENTS` in this order:

1. **One path to a file** — that is the draft. Look for research beside it (see Step 1).
2. **One path to a directory** — `Glob` `*.md`, `*.txt`, and `*.eml` inside it; every match is a draft, checked as one batch.
3. **Two paths** — the first is the draft or draft folder, the second is the research file or folder.
4. **Pasted text with no path** — treat the pasted block as a single draft and ask, once, for the research it came from. If the answer is "none", proceed: the result will be an all-unsourced HOLD, which is the correct finding.
5. **Empty** — ask "Which draft should I check, and where is the research?" and stop. Do not pick a file from the project.

If `Read` fails on a path, report it and continue with the rest. Never substitute a similarly named file.

> [!NOTE]
> This command checks claims against files you supply. It does not browse and it must not fill a gap from the model's own memory — an unsupported claim is unsourced even when it happens to be true. It also does not judge the writing: tone, structure, and subject lines are out of scope.

## Step 1 — Assemble the inputs

Number the drafts D1, D2, ... in the order globbed. For research, use the second path if given; otherwise `Glob` beside the drafts for `research*`, `notes*`, `*-research.md`, `sources*`, and `account-*.md`. `Read` each match, number them S1, S2, ..., and record what each is and its date — from frontmatter, a dated heading, or the filename. Print the input list before checking anything, so the reader can see what the verdicts are based on.

## Step 2 — Extract the claims

For each draft, list every checkable assertion, quoted verbatim, and type it: company fact, person fact, technographic, event, relationship, own-product, or inference. Pleasantries, questions, opinions, and calls to action are not claims. An inference is recorded but only inherits the status of the fact under it.

## Step 3 — Confirm the entity

Before checking any fact, confirm each source is about the company and person the draft names — matching domain, not just a matching name. An entity mismatch invalidates every claim drawn from that source; record it once, then re-check the draft against what remains.

## Step 4 — Mark every claim

First rule that matches wins:

- **Contradicted** — a source says otherwise, or two sources disagree with no clear newer authority.
- **Sourced** — a specific line in a specific source states it; record `S<n>` and quote the line.
- **Stale** — sourced, but the source is older than 12 months for funding, headcount, revenue or ownership; 6 months for a title or a tech stack; 90 days for anything the draft calls recent.
- **Unsourced** — everything else.

## Step 5 — Produce the corrected draft

Cut unsourced specifics rather than softening them. Narrow a claim only where a source supports the weaker version. Add the hedge the source supports to a stale claim, or cut it. Repair the seams so the email still reads as one message, and say when a draft has nothing personalized left.

## Step 6 — Verdict and report

Per draft: **HOLD** for any contradicted claim, any unsourced relationship claim, or any unsourced person fact; **FIX** if unsourced or stale claims remain; **SEND** if every remaining claim is sourced and fresh.

`Write` the report to `outreach-check-<YYYY-MM-DD>.md` in the drafts' directory (or the working directory for pasted text), containing: the input list, the claims table, the corrected drafts with cuts marked, the verdicts, the lookups that would close the remaining gaps, and the batch summary — claim count, share sourced, dominant failure type, and any source that produced more than one contradiction. Print the verdict line and the batch summary in the reply; leave the detail in the file.

## Output

A written report plus a short reply: one verdict line per draft and the batch summary. If a single source is behind most of the failures, say which and how old it is — that is usually one broken research step, not a batch of careless writing.

Deliverability is the other half of the send: [cold-email-deliverability-auditor](/skills/sales/cold-email-deliverability-auditor) audits the domain, list, and message that carry these drafts. The workflow that produces the drafts and the research together is [Research prospects with Claude](/guides/sales/research-prospects-with-claude); [/audit-crm](/commands/sales/audit-crm) is the companion command for the data underneath. The whole set is in [Claude skills for sales](/guides/sales/claude-skills-for-sales), and [Claude for sales teams](/guides/sales/claude-for-sales-teams) covers where it fits.
