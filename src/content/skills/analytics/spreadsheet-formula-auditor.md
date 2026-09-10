---
name: "spreadsheet-formula-auditor"
description: "Audit pasted spreadsheet formulas or a described model for the errors that survive review: hardcoded values buried inside formulas, ranges that drift or truncate, one cell in a row that does not match its neighbors, circular references, sign errors, IFERROR masking a real failure, and volatile functions, returned as a fix list ordered by how much money the error moves. Use before a model that carries a real decision leaves your hands."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["claude", "analysts", "spreadsheets", "excel", "cowork"]
featured: false
related: ["skill:dataset-first-look", "agent:analysis-reviewer", "tool:claude-for-excel", "guide:claude-for-excel-guide", "guide:claude-skills-for-data-analysts"]
seoDescription: "A Claude skill that audits pasted spreadsheet formulas for hardcoded values, drifting ranges, inconsistent rows, circular references, and hidden errors."
summary: "Paste the formulas from a model, or describe how it is built, and this skill audits them for the errors that survive review: hardcoded values inside formulas, drifting or truncated ranges, a cell that does not match its neighbors, circular references, sign errors, IFERROR hiding a real failure, and volatile functions. Output is a fix list ordered by risk."
---

Spreadsheet errors are rarely exotic. A range stops one row short of the new data, a growth rate got typed into a formula instead of a cell, one cell in a row was fixed by hand two quarters ago and never matched again, and an `IFERROR` around the whole thing turned a broken lookup into a confident zero. This skill reads formulas you paste, or a model you describe in words, and works the same checklist every time, returning a fix list ordered by how much each error moves the answer. It needs no file access, no macros, and no add-in, so it runs on claude.ai, in Claude Code, and in Claude Cowork alike.

## When to use this skill

- A model is about to be sent to a board, a lender, a client, or a pricing decision.
- You inherited a workbook and want the fragile parts listed before you change anything.
- Two tabs that should reconcile do not, and you want the formula differences found first.
- A number moved and nobody can say which cell moved it.

> [!NOTE]
> This skill reasons over the formulas you show it. It cannot open your workbook, recalculate it, or see what a formula currently returns, so it names risks and gives you the check that confirms each one. Paste the formula text rather than a screenshot of results where you can, and say which cells hold inputs and which hold calculations. Anthropic ships [Claude for Excel](/tools/claude-for-excel) for working inside a live workbook; this is the portable audit you can run on anything you can paste.

## Instructions

1. **Establish the model's structure first.** Ask for, or infer and confirm: which block holds inputs, which holds calculations, which holds outputs, what one row and one column mean, and whether the sheet grows down or across. Say what you were given and what you are assuming; an audit that misreads the layout produces confident nonsense.
2. **Find hardcoded values inside formulas.** Any literal in a calculation that is not 0, 1, or a genuine constant is a finding: a tax rate, a growth assumption, a headcount, a conversion factor, a date. Report each with the cell, the value, and the input cell it should point at instead. Numbers typed into formulas are the commonest reason two people get different answers from one model.
3. **Check the ranges.** Four failures: a range that stops short of the data (`SUM(B2:B13)` on a sheet that now has 14 months); a range reaching into a total row and double counting it; an absolute or relative reference that is wrong for how the formula is copied, so it drifts as it fills; and a whole-column reference that will swallow anything pasted below. Where a range's end depends on the current data extent, recommend a table reference or a named range.
4. **Check row and column consistency.** Within any row or column that should hold one formula filled across, name any cell whose formula does not match its neighbors, and describe how to spot the rest. A single hand-edited cell in a filled row is the classic silent error: it survives every visual review because the value looks reasonable.
5. **Look for circular references and unintended iteration.** A cell that depends on itself through any chain, and any sign that iterative calculation was switched on to make one work. Circularity is sometimes intended (interest on a balance that includes the interest); say which reading you are taking and ask.
6. **Check the signs.** Whether costs are stored negative or positive and whether that convention holds everywhere; whether a subtraction should have been an addition under it; whether a netting formula sums two values already opposite in sign; and whether any total mixes conventions. State the convention you inferred, because half of sign errors are a convention that changed mid-sheet.
7. **Find errors being hidden.** `IFERROR`, `IFNA`, and `ISERROR` wrapping a whole formula and returning `0` turn a broken lookup into a plausible number. For each, say what error it catches and whether a zero is a legitimate answer for that cell or a disguised failure, distinguishing a narrow, deliberate catch from a blanket wrapper. Flag lookups without an exact-match argument in the same pass: an approximate match on unsorted data returns a wrong row rather than an error.
8. **Flag volatile and fragile functions.** `OFFSET`, `INDIRECT`, `NOW`, `TODAY`, and `RAND` recalculate constantly and, worse for an audit, make results non-reproducible or dependent on the day the file was opened. `INDIRECT` also breaks silently when a tab is renamed. Note each with what it would take to replace it.
9. **Note the unauditable parts.** External links to other workbooks, hidden rows or sheets, manual overrides, array formulas whose spill range you cannot see, and anything driven by a macro. List these as "not assessed" rather than passing them.
10. **Order the fix list by risk**, by a stated rule: how much the output moves if the error is real, times how likely it is. Each entry gets the cell or block, the problem, the fix, and the check that confirms it before and after.

## Output

An audit with a structure summary, findings grouped by the categories above, a "not assessed" list, and the risk-ordered fix list with a confirming check for each entry. Work down it and rerun the checks. When the workbook is really a data extract rather than a model, profile it with [dataset-first-look](/skills/analytics/dataset-first-look) first; when its output becomes an analysis, the [analysis-reviewer](/agents/analytics/analysis-reviewer) agent reviews the reasoning around it.

## Example

Excerpt from an audit of a pasted revenue build:

```markdown
Structure: inputs in B4:B9, monthly build in D12:O30, outputs in row 32. Sheet grows across.

| Risk | Cell | Problem | Fix | Check |
| --- | --- | --- | --- | --- |
| High | F18 | =E18*1.07 hardcodes the growth rate; B7 holds 7% and is unused | Point at $B$7 | Change B7 to 0% and confirm F18 goes flat |
| High | O32 | =SUM(D32:N32) stops one column short of the December column | Extend to O32 or use a table | Compare the total to a manual sum |
| Medium | D25:O25 | IFERROR(VLOOKUP(...),0) across the row; a missing SKU reads as zero revenue | Return NA() and handle it visibly | Delete one SKU from the lookup table and see whether anything changes |
| Medium | H21 | Formula differs from its neighbors: adds a manual +2,400 | Remove, or move to an input cell | Compare H21's formula text to G21 and I21 |
```

The rest of the analyst set is in [Claude skills for data analysts](/guides/analytics/claude-skills-for-data-analysts); working inside a live workbook is covered in the [Claude for Excel guide](/guides/analytics/claude-for-excel-guide).
