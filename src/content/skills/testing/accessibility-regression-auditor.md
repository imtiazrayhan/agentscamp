---
name: "accessibility-regression-auditor"
title: "Accessibility Regression Auditor"
description: "Audit a UI change for accessibility regressions by combining automated checks with keyboard, focus, semantic, name-role-value, contrast, zoom, and screen-reader-oriented inspection. Use when reviewing a component or pull request, adding a dialog or form, changing navigation, or investigating an accessibility failure that a linter alone cannot explain."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "blue"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["review-qa", "coding-languages"]
related: ["guide:best-claude-skills-for-frontend-development", "skill:web-vitals-optimizer", "skill:regression-test-writer", "skill:integration-test-designer", "skill:react-render-profiler", "agent:frontend-developer", "agent:accessibility-auditor", "command:audit-accessibility"]
featured: true
summary: "Reviews what a UI change did to accessibility compared with the base branch. It runs the project's automated checks, reads the diff for lost semantics, names, and focus handling, checks changed colors and sizes against WCAG 2.2 AA thresholds, and labels each finding regression or pre-existing with a test that would catch it."
faq:
  - q: "Can an automated accessibility scanner find every issue?"
    a: "No. Automation catches many deterministic rule violations but cannot reliably judge logical focus order, meaningful labels, workflow completion, announcement timing, or whether keyboard users can recover from a state change."
  - q: "Does this skill certify WCAG compliance?"
    a: "No. It produces evidence-based findings for the reviewed scope. Formal conformance requires broader page and process coverage, documented methodology, and qualified human testing."
audience: ["designers"]
---

Review what a change did to accessibility, compared with the base branch. The unit of work is a diff: a pull request, a branch, or a set of changed components. Every finding is classified as `regression` (introduced by this change), `pre-existing` (already on the base), or `unverified`, and regressions come with a check that would have caught them.

## Scope: one job among three

| Need | Use |
|---|---|
| Did this change make accessibility worse, and what test stops it recurring? | this skill |
| A full WCAG 2.2 AA audit of a page or flow, with every finding tied to a success criterion | the [accessibility-auditor](/agents/quality-security/accessibility-auditor) agent |
| A quick read-only pass over one file or component, no tools run | the [audit-accessibility](/commands/analyze/audit-accessibility) command |

Do not audit untouched pages here. If the diff reveals broad pre-existing problems, list them briefly and recommend the agent.

## Workflow

1. **Define the affected journey from the diff.** List changed UI files against the merge base and map each to the routes, components, and states it renders.

   ```bash
   git diff --name-only origin/main...HEAD -- '*.tsx' '*.jsx' '*.vue' '*.svelte' '*.html' '*.css' '*.scss'
   ```

   The three-dot form compares against the merge base; substitute the repository's base branch. For each changed component include its loading, empty, error, validation, success, and disabled states, and note which breakpoints and input methods the change touches. A style-only diff still counts: color, `outline`, `display`, and `order` changes can remove contrast, focus visibility, or reading order.

2. **Run project-native automation on base and head.** Find what the project already has (search `package.json` and CI config for `axe`, `jest-axe`, `@axe-core/playwright`, `pa11y`, `lighthouse`, `eslint-plugin-jsx-a11y`) and run that, not a new tool. Record tool version, routes, and rule set. If nothing is configured and a dev server is running, ask before using a one-off scan such as:

   ```bash
   npx @axe-core/cli http://localhost:3000/checkout --tags wcag2a,wcag2aa,wcag21aa,wcag22aa --save head.json
   ```

   Where it is cheap (a second worktree or a deployed preview of the base), run the same scan on the base and diff the violation lists by rule ID and selector. New entries are regressions; entries present on both are pre-existing. Without a base run, classify from the diff: a violation on a line this change added or modified is a regression.

3. **Inspect semantics in the changed lines.** Read the diff for these specific regressions:

   - a native control replaced by a generic element (`<button>` to `<div onClick>`, `<a href>` to a click handler)
   - a removed or renamed `<label>`, `htmlFor`, `aria-label`, `aria-labelledby`, or `alt`
   - heading levels changed or skipped, landmarks removed, list or table structure flattened
   - ARIA added that contradicts the native role, or `aria-hidden` on a container with focusable children
   - an icon-only control added with no accessible name

4. **Trace keyboard operation of the changed flow.** Walk it in tab order: every new or changed control is reachable, shows a visible focus indicator, activates with Enter or Space as its role requires, and does not trap focus. For any dialog, menu, popover, or drawer the diff touches, check that focus moves in on open, Escape closes it, and focus returns to the trigger. Flag new positive `tabindex` values and removed `:focus` or `:focus-visible` styles.

5. **Check dynamic communication.** For changed validation, async completion, toasts, expanded or collapsed state, and route changes: errors are tied to their field (`aria-describedby`, `aria-invalid`), status updates reach a live region or `role="status"`, and nothing moves focus unexpectedly or announces repeatedly.

6. **Review visual access against the WCAG 2.2 AA thresholds.** Only for values the diff changed:

   | Check | Threshold | Criterion |
   |---|---|---|
   | Text contrast | 4.5:1; 3:1 for large text (24px, or 18.66px bold) | 1.4.3 |
   | UI component and focus indicator contrast | 3:1 | 1.4.11 |
   | Zoom | usable at 200% | 1.4.4 |
   | Reflow | no two-dimensional scrolling at 320 CSS px wide | 1.4.10 |
   | Target size | at least 24 by 24 CSS px, or adequate spacing | 2.5.8 |
   | Use of color | never the only signal | 1.4.1 |

   Resolve design tokens to real color values and compute the ratio. Also check that new animation respects `prefers-reduced-motion`.

7. **Exercise a representative assistive path.** When browser tools are available, inspect the accessibility tree for the changed elements (role, name, state) and step through the critical flow in screen-reader order. State exactly what was exercised. Do not claim screen-reader or device coverage that was not performed.

8. **Prioritize and write the regression check.** Rank by blocked task: **blocker** (a user cannot complete the changed flow), **serious** (possible with difficulty), **minor**. For each deterministic regression, propose the smallest automated check in the project's existing test stack. With Playwright and `@axe-core/playwright` that is:

   ```ts
   import { test, expect } from '@playwright/test';
   import { AxeBuilder } from '@axe-core/playwright';

   test('checkout dialog has no WCAG A/AA violations', async ({ page }) => {
     await page.goto('/checkout');
     await page.getByRole('button', { name: 'Edit address' }).click();
     const results = await new AxeBuilder({ page })
       .include('[role="dialog"]')
       .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
       .analyze();
     expect(results.violations).toEqual([]);
   });
   ```

   For behavior automation cannot judge (focus return, announcement timing, whether a name is meaningful), write the manual steps as a short script a reviewer can repeat.

> [!WARNING]
> A zero-violation automated scan is not a pass. A perfectly valid button named “button” can still make a workflow unusable.

## Output

Provide the audited scope, environments and tools, findings with element or file evidence, affected interaction, severity, recommended remediation, and exact verification step. Separate automated, manual, and untested coverage.

```markdown
## Accessibility regression review: PR "Redesign address dialog"
Base: origin/main @ 4c1e9d0 · Head: 8a77f31 · Changed UI files: 5
Journey: checkout -> edit address dialog (open, validate, save, cancel)

| # | Class | Severity | Finding | Evidence | Verify |
|---|---|---|---|---|---|
| 1 | regression | blocker | Close control changed from <button> to <div onClick>; not focusable | AddressDialog.tsx:31 (changed line) | Tab through dialog: close is never focused |
| 2 | regression | serious | Focus is not returned to "Edit address" on close | AddressDialog.tsx:58 removed triggerRef.focus() | Close with Escape; focus lands on <body> |
| 3 | regression | serious | Error text #b26a6a on #ffffff is 4.1:1 | tokens.css:14 (changed) | Contrast checker: needs 4.5:1 |
| 4 | pre-existing | minor | Postcode input uses placeholder as label | AddressForm.tsx:77 (unchanged) | n/a |

Proposed regression checks: axe scan of the open dialog (catches 1 and 3); Playwright assertion that the trigger is focused after Escape (catches 2).

Coverage
- Automated: axe via @axe-core/playwright on /checkout with dialog open, head only
- Manual: keyboard walk of the dialog on desktop Chrome
- Not tested: screen readers, mobile, 200% zoom
```
