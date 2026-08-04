---
description: "Audit a component or page for accessibility against WCAG — semantics, names, keyboard, ARIA, contrast, forms, motion."
date: 2026-06-17
argument-hint: "<file, component, or page to audit>"
allowed-tools: "Read, Grep, Glob"
title: "Audit Accessibility"
color: "purple"
topics: ["review-qa"]
related: ["command:review-pr", "command:find-bug", "command:security-scan"]
featured: false
summary: "Read-only command that audits a component or page against WCAG: it reads the markup and checks semantic HTML, accessible names, keyboard operability, correct (and non-redundant) ARIA, contrast risks, form labeling, and motion concerns — then reports findings grouped by severity, each with location, user impact, and a concrete fix that prefers native elements over ARIA."
---

Audit `$ARGUMENTS` for accessibility. Read the markup, reason about how a keyboard and screen-reader user would actually experience it, and report concrete WCAG-grounded problems with fixes. Do not modify any files — the findings are the whole deliverable.

## Scope

`$ARGUMENTS` is the thing to audit — a component file (`components/Modal.tsx`), a page/route, or a directory of views. Audit the rendered markup and the props that shape it, not the styling system in the abstract.

If `$ARGUMENTS` is empty, do not guess. Ask one focused question: *"Which file, component, or page should I audit for accessibility?"*

> [!WARNING]
> Read-only mode. Use only Read, Grep, and Glob. Do not edit files or "fix" anything inline — propose fixes in the report.

> [!CAUTION]
> Automated tools (axe, Lighthouse) catch roughly a third of WCAG issues — mostly contrast and missing-attribute checks. Whether a control is keyboard-operable, whether its accessible *name* matches its visible label, and whether ARIA actually describes the behavior require the manual reasoning this command exists to do. Do not report "axe found nothing" as a pass.

## Step 1 — Read the target and map the interactive surface

Open `$ARGUMENTS` and list every interactive element and every image/icon. These are where accessibility breaks.

```bash
# Find controls faking buttons, and clickable non-buttons
rg -n "onClick|onKeyDown|role=|tabIndex|<div|<span|<a " $ARGUMENTS
```

- For each control, note: what native element is it, what does it *do*, and what name would a screen reader announce.
- For each `<img>`/SVG/icon, note whether it is meaningful (needs a name) or decorative (needs `alt=""`/`aria-hidden`).

## Step 2 — Semantic HTML before anything else

The single highest-leverage check. A real native element gives you role, focus, keyboard handling, and state for free.

- **div-soup buttons** — `<div onClick>` / `<span onClick>` acting as a button. It is not focusable, not Enter/Space-operable, and has no role. Fix: use `<button type="button">`, not `<div role="button" tabIndex={0} onKeyDown>`.
- **Heading order** — headings must descend without skipping (`h1 → h2 → h3`), and there is exactly one `h1` per page. A skipped level (`h1` then `h3`) breaks screen-reader navigation. Styling ≠ level — use CSS for size.
- **Landmarks** — real `<nav>`, `<main>`, `<header>`, `<footer>` so users can jump by region. A page that is all `<div>` has no landmarks.
- **Lists / tables** — repeated items should be `<ul>`/`<ol>`; tabular data should be a `<table>` with `<th scope>`, not a CSS grid of divs.

> [!NOTE]
> WCAG 1.3.1 (Info and Relationships) and 4.1.2 (Name, Role, Value) are violated by div-soup more than by anything else. Reach for a native element first; only add ARIA when no native element expresses the pattern.

## Step 3 — Accessible names

Every interactive element and meaningful image needs a name a screen reader can announce.

- **Icon-only buttons** — a button whose only child is an SVG announces as "button", unlabeled. Fix: `aria-label="Close"` (or visually-hidden text). Confirm the label matches the visible/intended purpose.
- **Images** — meaningful `<img>` needs descriptive `alt`; decorative ones need `alt=""` so they are skipped. `alt="image"` or a filename is a failure (1.1.1).
- **Links** — "click here" / "read more" out of context fails 2.4.4. The link text should name the destination.
- **Visible label vs accessible name** — if a control shows "Submit" but has `aria-label="Send form"`, voice-control users saying "click Submit" can't activate it (2.5.3). The accessible name must contain the visible text.

## Step 4 — Keyboard operability

Everything a mouse can do, a keyboard must do (2.1.1), and the path must be visible and escapable.

- **Focusable** — every interactive element reachable by Tab. Custom controls built on `<div>` are not (see Step 2).
- **Visible focus** — there is a focus indicator; flag `outline: none` / `:focus { outline: 0 }` without a replacement (2.4.7).
- **Logical tab order** — DOM order matches reading order; flag positive `tabIndex` values (`tabIndex={1+}`), which hijack order and almost always cause bugs. `tabIndex={0}`/`{-1}` are fine.
- **No keyboard trap** — modals/menus must be escapable (Esc) and must not trap Tab outside themselves (2.1.2). A modal should move focus in on open, trap *within* while open, and restore focus to the trigger on close.

## Step 5 — ARIA correctness (and restraint)

ARIA only changes how assistive tech perceives an element — it adds no behavior. Wrong ARIA is worse than none.

- **Redundant ARIA on native elements** — `<button role="button">`, `<nav role="navigation">`, `<a href role="link">` are noise; `<ul role="list">` can even *strip* list semantics in some browsers. Remove it.
- **State must track behavior** — a toggle needs `aria-expanded` that flips with the panel; a tab needs `aria-selected`; a checkbox-div needs `aria-checked` that updates. Static or stale state lies to the user (4.1.2).
- **Referenced IDs must exist** — `aria-labelledby` / `aria-describedby` / `aria-controls` pointing at an absent or duplicated `id` resolves to nothing.
- **`aria-hidden` on focusable content** — hiding an element that still contains a tabbable control creates a "phantom" focus stop announced as nothing.

> [!WARNING]
> The first rule of ARIA is don't use ARIA. If you find `role=`/`aria-*` bolted onto an element that has a native equivalent, the fix is almost always to delete the ARIA and switch to the native element, not to "correct" the attributes.

## Step 6 — Contrast, forms, and motion

- **Contrast (likely, not measured)** — you cannot compute exact ratios from source, so flag *risk*: light-grey text on white, text over images/gradients with no scrim, placeholder text used as a label, disabled states. Recommend ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI/focus indicators (1.4.3, 1.4.11), and confirm with a contrast checker.
- **Form labels** — every input needs a programmatic label: `<label htmlFor>` matching the input `id`, or wrapping `<label>`. A placeholder is not a label (it vanishes on input, 1.3.1/3.3.2).
- **Error association** — validation errors must be tied to the field via `aria-describedby` and signalled with `aria-invalid`, not by color alone (1.4.1/3.3.1).
- **Motion / autoplay** — auto-playing carousels, looping video, or large parallax/animation must be pausable and should respect `prefers-reduced-motion` (2.2.2, 2.3.3).

## Report

Deliver findings as your message, grouped by severity. For each finding give four things: the **WCAG-grounded problem**, the **location** (`file:line` you opened), the **user impact** (who is blocked and how), and the **concrete fix** (prefer a native element over ARIA).

```markdown
## Critical (blocks a user from completing a task)
- [keyboard] `components/Menu.tsx:42` — `<div onClick>` dropdown trigger isn't focusable or Enter/Space-operable.
  Impact: keyboard-only users cannot open the menu at all.
  Fix: `<button type="button" aria-expanded={open} aria-controls="menu-list">` — drop the div + manual onKeyDown.

## Serious (degraded but workable)
- [name] `components/Header.tsx:18` — icon-only close button has no accessible name.
  Impact: screen reader announces "button", purpose unknown.
  Fix: add `aria-label="Close"`.

## Moderate / Advisory
- [contrast risk] `components/Card.tsx:60` — `text-gray-400` on white may fall below 4.5:1; verify with a checker.
```

Tag each finding (`[semantics]`, `[name]`, `[keyboard]`, `[aria]`, `[contrast]`, `[form]`, `[motion]`) and cite the exact line. End with the single highest-impact fix to make first — or, if the target is clean, say so and name the strongest pattern you saw (e.g. native button + visible focus + labeled inputs).