---
name: "mvp-scope-cutter"
description: "Cut a feature list or PRD down to a ruthless version one: a keep / cut / later table with a one-line reason per row, plus the single smallest thing you could build to test the riskiest assumption. Use when first-release scope keeps growing, when an AI app builder session has produced more features than you can validate, or before you commit money or engineering time to a build."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
tags: ["claude", "founders", "mvp", "product", "scope"]
featured: false
related: ["command:scope-mvp", "skill:prd-writer", "skill:investor-update-writer", "command:plan-feature", "guide:build-an-mvp-with-claude-code", "guide:claude-skills-for-founders"]
seoDescription: "A Claude skill that cuts a PRD or feature list to a v1: keep / cut / later table with reasons, plus the smallest build that tests the riskiest assumption."
summary: "Paste a PRD or a feature list and this skill sorts every item into keep, cut, or later with a one-line reason tied to the core job, names the riskiest assumption behind the product, and describes the smallest thing you could build to test it. It never adds features and never justifies a keep with taste; only the core job or the assumption counts."
---

Scope grows in two ways: a founder adds features because they are easy to imagine, and an AI app builder adds them because they are easy to generate. Either way you get a version one that takes months to ship and tests nothing in particular. This skill applies one rule to every item on your list: does it help a user complete the core job once, or does it help you find out whether anyone wants the product at all? Everything else goes to later or gets cut. It needs no tools or repository, only the pasted list, so it runs the same on claude.ai, Claude Code, and Claude Cowork.

## When to use this skill

- A [prd-writer](/skills/product/prd-writer) draft has a Scope section longer than seven items.
- A Lovable, Base44, or Claude Code session produced more screens than you asked for and you need to decide what to keep before adding more.
- You need to explain to investors what you decided not to build; the [investor-update-writer](/skills/product/investor-update-writer) skill takes this table as input.

> [!NOTE]
> This skill decides what to build first. It does not estimate effort, order tasks, or design the product. Hand the kept list to the [plan-feature](/commands/plan/plan-feature) command for engineering breakdown. In a Claude Code project, the [/scope-mvp](/commands/product/scope-mvp) command runs this procedure and saves the result to `docs/mvp-scope.md`.

## Instructions

1. **Flatten the input into a numbered feature list.** From a PRD, take the Scope section and anything else that reads like a capability. From loose notes, split compound items ("login with Google and Apple" is two) and merge duplicates. Number every item.
2. **State the core job in one sentence.** Who does what, to get what outcome. Use the PRD's first jobs-to-be-done statement if there is one; otherwise write your best reading and mark it `[ASSUMPTION]`.
3. **Name the riskiest assumption.** The belief that, if false, means nobody wants this. Prefer demand assumptions ("agency owners will upload invoices weekly") over technical ones ("we can parse PDFs"); technical risk is usually cheaper to test. Write it as "We believe [users] will [behavior] because [reason]."
4. **Score each item against two questions.** (a) Is it required to complete the core job once, end to end? (b) Does it produce evidence about the riskiest assumption? Keep if either is yes. Later if it is valuable but the job completes without it. Cut if it serves a different user, a different job, or exists only because a competitor has it.
5. **Apply the standard defaults.** Unless it is the core job itself, each of these goes to later: admin panels, settings, roles and permissions, integrations, notifications, dashboards, billing tiers, onboarding tours, dark mode, native mobile. The founder can override these; the skill should not.
6. **Look for a manual substitute for every expensive keep.** If a kept item is costly, propose the concierge version: a spreadsheet, an email the founder sends by hand, a form plus an automation step. The item stays kept, with "manual for v1" in the reason column.
7. **Produce the table.** Columns: #, Feature, Verdict (keep / cut / later), Reason. Each reason is one line referencing the core job, the riskiest assumption, or a default from step 5. "Nice to have" and "users will expect it" are not reasons.
8. **Write "The smallest thing that tests the riskiest assumption."** Four to six sentences: what to put in front of people (possibly less than the kept list, even a landing page or a manual service), who, what signal counts as pass and fail, and how long to run it. The signal is an observable behavior, not a survey answer.
9. **Check the kept list.** If it has more than seven items, repeat step 4 more strictly or explain in one sentence why this product needs more. Finish with a one-sentence description of version one a user could understand.

## Output

A header with the core job and the riskiest assumption, the keep / cut / later table, the "smallest thing" paragraph, and the one-sentence version one. Kept items are repeated as a plain list at the end, ready to paste into a task tracker or a build prompt.

## Example

Input: fourteen features for a contractor-payments tracker.

```markdown
Core job: an agency owner sees which contractor invoices are unpaid and marks them paid.
Riskiest assumption: agency owners will upload every invoice into a separate tool rather than keep using email and a spreadsheet.

| # | Feature | Verdict | Reason |
| --- | --- | --- | --- |
| 1 | Upload invoice PDF | keep | required to complete the core job |
| 2 | Mark invoice paid | keep | required to complete the core job |
| 3 | Auto-extract amount from PDF | keep (manual for v1) | founder types the amount; extraction tests nothing about demand |
| 4 | Contractor login portal | later | different user; core job completes without it |
| 5 | Stripe payouts | cut | different job (paying) from the one being tested (tracking) |

Smallest test: a shared folder plus a spreadsheet the founder updates by hand for five agencies over three weeks. Pass: at least three agencies upload invoices in week three without a reminder.
```

[Claude skills for founders](/guides/founders/claude-skills-for-founders) shows where this skill sits between writing the PRD and opening the builder.
