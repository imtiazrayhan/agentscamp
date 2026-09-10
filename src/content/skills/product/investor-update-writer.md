---
name: "investor-update-writer"
description: "Draft a monthly investor update from the metrics and notes you paste: a three-line TL;DR, a metrics table with month-over-month deltas computed only from the numbers you supplied, wins, misses stated with their numbers, explicit asks, and a runway note. Never fills in a figure you did not give. Use when the update is due, the raw numbers are in a spreadsheet export or a scratch doc, and you want a draft that is honest about the misses."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
tags: ["claude", "founders", "investor-update", "metrics", "fundraising"]
featured: false
related: ["skill:mvp-scope-cutter", "skill:prd-writer", "guide:claude-skills-for-founders", "guide:claude-for-founders", "guide:automate-startup-ops-with-ai-agents"]
seoDescription: "A Claude skill that drafts a monthly investor update from pasted metrics: TL;DR, metrics table with deltas, wins, misses, asks, runway. No invented numbers."
summary: "Paste this month's metrics, last month's, and your notes, and this skill drafts an investor update: a three-bullet TL;DR, a metrics table whose deltas come only from numbers you supplied, wins with evidence, misses stated with target and actual, explicit asks with a deadline, and a runway line. Missing figures become labeled placeholders, never estimates."
---

The monthly investor update is the one document founders write for people who will notice if it is wrong, and the one most often written at 11pm from a half-filled spreadsheet. This skill takes the numbers and notes you have, computes deltas from those numbers alone, and drafts an update in a fixed shape: TL;DR, metrics table, wins, misses, asks, runway. A missing number becomes a labeled placeholder, never an estimate, and every miss is stated with the target and the actual, because investors who read "learnings" without numbers stop reading. It uses no tools or spreadsheet access, only pasted text, so it runs on claude.ai, in Claude Code, and in Claude Cowork.

## When to use this skill

- The monthly update is due and you have the metrics in an export, a screenshot description, or a scratch doc.
- You changed scope this month and need to explain the decision; the [mvp-scope-cutter](/skills/product/mvp-scope-cutter) skill's keep / cut / later table is a good input for the Misses and Wins sections.
- You want the same format every month so investors can compare updates without re-reading them.
- You have a specific ask (an intro, a hire, a customer, feedback) and keep burying it in the last paragraph.

> [!NOTE]
> The skill drafts; it does not check your accounting. Deltas are arithmetic on the numbers you pasted, so wrong inputs make a wrong update. It does not decide what to share either: an update goes to many people, so it flags customer names and unreleased partnerships for you to confirm before sending, and never adds a figure to make a section look complete.

## Instructions

1. **Parse the inputs into a metrics table.** For every metric supplied, record the current and prior period values with units. If a prior value is missing, the delta cell reads "n/a (no prior)". If the founder pasted a previous update, use it as the source of prior values and note any metric that appeared last month but not this month. Never estimate a missing value.
2. **Compute the deltas.** Absolute change and percentage change, rounded to one decimal place, with a sign. Check that the periods match; if the founder's "month" is five weeks or a partial month, add a one-line note under the table rather than adjusting the numbers silently.
3. **Draft the wins.** Three to five, each a factual sentence with its evidence: a number, a named milestone, a shipped feature. No adjectives. If the founder listed more, keep the five with the strongest evidence and move the rest to an "Also this month" line.
4. **Draft the misses.** Two to four. Each states what was targeted, what happened, the founder's stated reason, and what changes next month. If the founder gave no targets, write the miss as "no target set; actual was X" and add "set a target" to the asks the founder makes of themselves. Do not convert a miss into a learning without the numbers.
5. **Draft the asks.** Each ask is one line with a concrete object, a deadline, and the kind of person who could help: "an intro to a Head of Finance at a 20 to 200 person agency by 30 September", "a referral for a contract designer for two weeks in October". If the founder gave no asks, insert "[ASK: add one specific request or delete this section]" and flag it in the report. Never invent an ask.
6. **Write the runway note.** From cash, monthly net burn, and the resulting months of runway, using supplied figures only. If any of the three is missing, write "[RUNWAY: add cash on hand and monthly net burn]". Do not compute runway from revenue alone.
7. **Write the TL;DR last and place it first.** Three bullets: the one number that matters most this month with its delta, the biggest win, the biggest miss or risk. If the update contains asks, the third bullet points to them.
8. **Check for things to confirm before sending.** List any customer name, partner, unreleased feature, or team change in the draft, so the founder can decide whether it is safe to share with the full list.
9. **Assemble.** Order: TL;DR, Metrics, Wins, Misses, Asks, Runway, then a short sign-off. Target 300 to 500 words, plain Markdown that pastes cleanly into an email.

## Output

The update draft in the fixed order, a "Confirm before sending" list, and a one-line note of every placeholder left in the text. Nothing in the draft is a number the founder did not supply.

## Example

Excerpt from a run with this month's and last month's figures pasted:

```markdown
**TL;DR**
- MRR $4,200, up $600 (+16.7%) on last month.
- Shipped invoice upload and paid/unpaid tracking; 11 of 14 pilot agencies used it in week three.
- Missed the hiring target (0 of 1 engineer); asks below.

| Metric | This month | Last month | Delta | Note |
| --- | --- | --- | --- | --- |
| MRR | $4,200 | $3,600 | +$600 (+16.7%) | |
| Pilot agencies active | 11 | n/a (no prior) | n/a | first month tracked |

**Asks**
- An intro to a founding engineer with Rails experience, by 30 September.
```

How the update fits a monthly rhythm with the PRD and scope documents is covered in [Claude skills for founders](/guides/founders/claude-skills-for-founders).
