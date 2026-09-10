---
name: "design-critique-checklist"
description: "Critique an attached screenshot or a described screen against a fixed seven-part checklist (visual hierarchy, spacing and alignment, typography, color and contrast as observed, empty, loading, and error states, consistency, and copy) and return findings in one set report format, each with a location, a severity, and a suggested fix, deferring every WCAG measurement to an accessibility audit. Use when you want a repeatable design review of a screen that reads the same from one round to the next."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
tags: ["claude", "designers", "design-critique", "screenshot", "cowork"]
featured: false
related: ["command:critique-screen", "skill:ux-copy-reviewer", "agent:accessibility-auditor", "skill:accessibility-regression-auditor", "guide:claude-skills-for-designers", "guide:claude-design-plugin-guide"]
seoDescription: "A Claude skill that critiques a screenshot against a fixed checklist: hierarchy, spacing, type, color, states, consistency, copy. Each finding has a fix."
summary: "Attach a screenshot or describe a screen and this skill critiques it against the same seven areas every time: hierarchy, spacing and alignment, typography, color and contrast, states, consistency, and copy. Each finding has a location, a severity, and a fix, in a fixed report format; contrast is observed here, never measured against WCAG."
---

A critique is more useful when the second one is shaped like the first. This skill runs a fixed checklist over a screenshot you attach (Claude reads image files in Claude Code, on claude.ai, and in Claude Cowork) or a screen you describe, and returns findings in one report format, so two rounds on the same screen, or the same round on two screens, can be compared line by line. Anthropic's [design plugin](/guides/design/claude-design-plugin-guide) has a `design-critique` skill that gives open-ended feedback and can pull a frame from Figma; this one trades breadth for a fixed shape, and it stays out of accessibility measurement on purpose. In a Claude Code project, the [/critique-screen](/commands/design/critique-screen) command runs it on an image file and writes the report to disk.

## When to use this skill

- You want a first-pass review before showing a screen to a person, with the obvious problems already listed.
- A design review is coming and you need every screen assessed the same way.
- A screen shipped and you want a written record of what fresh eyes noticed.

> [!NOTE]
> Color and contrast findings here are observations ("the helper text looks low-contrast on the gray card") and are always tagged CHECK, never PASS or FAIL. WCAG measurement, keyboard order, and screen-reader behavior belong to the [accessibility-auditor](/agents/quality-security/accessibility-auditor) agent or the [accessibility-regression-auditor](/skills/testing/accessibility-regression-auditor) skill, which work from code and compute ratios. The critique never claims conformance.

## Instructions

1. **State what you are looking at.** Platform, apparent purpose of the screen, the state shown (populated, empty, mid-flow), and what cannot be seen: hover and focus states, motion, other breakpoints, the rest of the flow. This becomes the "Not assessed" section, written first so the reader knows the limits.
2. **Hierarchy.** What the eye lands on first, second, third; whether that order matches the screen's purpose; how many elements compete to be the primary action. A screen with two equally weighted primary buttons is a finding.
3. **Spacing and alignment.** Whether gaps follow a consistent step, edges align across sections, groups read as groups, and anything looks cramped or stranded. Describe locations in the screen's own terms ("second card, bottom padding"); you cannot measure pixels from an image.
4. **Typography.** How many sizes and weights appear, whether they form a readable hierarchy, line length in the widest text block, line height in body text, and any truncation or wrapping problems visible.
5. **Color and contrast (observed).** How many colors are in play, whether color carries meaning consistently (one red for errors, one accent for actions), and any pair that looks hard to read, tagged CHECK with a pointer to the auditor.
6. **States.** Which of empty, loading, error, success, and disabled are shown, which are implied but missing, and for each missing state what the design needs to specify. A form with no visible error treatment is a High finding.
7. **Consistency.** With itself first (one component styled two ways on one screen), then with the design system if the user describes one or pastes a token list.
8. **Copy.** Headings, labels, and button text at a glance: does the label say what happens, does the heading say what the screen is. Deeper review of the strings goes to the [ux-copy-reviewer](/skills/design/ux-copy-reviewer) skill.
9. **Assign severity deterministically.** High: a user could fail or be misled (primary action unclear, missing error state, meaning carried by color alone). Medium: the task gets slower or more confusing. Low: polish. Each finding gets one suggested fix that addresses only that finding.
10. **Assemble the fixed report** below. Include two or three items under "Works well" so a reader knows what to keep.

```markdown
# Critique: <screen name>
Context: <platform> · <purpose> · <state shown>
Summary: <N> findings (<H> High, <M> Medium, <L> Low). <one line>

## Findings
| # | Area | Location | Finding | Severity | Suggested fix |
| --- | --- | --- | --- | --- | --- |

## Missing states
## Works well
## Not assessed
```

## Output

One report in the format above, ready to paste into a review thread or save as `design/critiques/<screen>.md`, which is what [/critique-screen](/commands/design/critique-screen) does for you in Claude Code. Findings are ordered by severity, then by area, so the same problem lands in the same place in every report.

## Example

Excerpt from a critique of a settings screen described as "desktop, billing tab, populated":

```markdown
Summary: 6 findings (2 High, 3 Medium, 1 Low). Clear layout; the save action and the error path need work.

| # | Area | Location | Finding | Severity | Suggested fix |
| --- | --- | --- | --- | --- | --- |
| 1 | Hierarchy | Footer | "Save" and "Cancel" share the same filled style | High | Make Cancel a text or outline button |
| 2 | States | Billing email field | No error treatment visible for an invalid address | High | Specify inline error text below the field |
| 3 | Color | Helper text under card number | Light gray on white looks low-contrast | Medium (CHECK) | Confirm ratio with the accessibility auditor |

## Not assessed
Hover and focus states, mobile layout, the confirmation step after Save.
```

[Claude skills for designers](/guides/design/claude-skills-for-designers) shows where the critique sits in the designer set.
