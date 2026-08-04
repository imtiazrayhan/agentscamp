---
name: "accessibility-regression-auditor"
title: "Accessibility Regression Auditor"
description: "Audit a UI change for accessibility regressions by combining automated checks with keyboard, focus, semantic, name-role-value, contrast, zoom, and screen-reader-oriented inspection. Use when reviewing a component or pull request, adding a dialog or form, changing navigation, or investigating an accessibility failure that a linter alone cannot explain."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "blue"
date: 2026-08-04
topics: ["review-qa", "coding-languages"]
related: ["best-claude-skills-for-frontend-development", "web-vitals-optimizer", "regression-test-writer", "integration-test-designer", "react-render-profiler", "frontend-developer"]
featured: true
summary: "Audits changed interfaces through layered evidence: automated rules, native semantics, accessible names, keyboard order, focus transitions, status announcements, contrast, reflow, reduced motion, and representative assistive-technology behavior. It prioritizes user-blocking regressions and supplies a reproducible check for each finding."
faq:
  - q: "Can an automated accessibility scanner find every issue?"
    a: "No. Automation catches many deterministic rule violations but cannot reliably judge logical focus order, meaningful labels, workflow completion, announcement timing, or whether keyboard users can recover from a state change."
  - q: "Does this skill certify WCAG compliance?"
    a: "No. It produces evidence-based findings for the reviewed scope. Formal conformance requires broader page and process coverage, documented methodology, and qualified human testing."
---

Review the changed user journey, not just the component markup or automated score.

## Workflow

1. **Define the affected journey.** Identify changed pages, components, states, breakpoints, input methods, and user actions. Include loading, empty, error, validation, success, and disabled states.
2. **Run project-native automation.** Use configured linters, component tests, browser tests, or accessibility scanners. Preserve tool versions, routes, rules, and raw violations. Treat automation as one evidence layer.
3. **Inspect semantics first.** Prefer native controls and landmarks. Verify heading order, labels, descriptions, table relationships, lists, link purpose, and name-role-value. Flag ARIA that replaces or contradicts native behavior.
4. **Trace keyboard operation.** Check reachability, visible focus, logical order, activation, escape behavior, focus trapping, roving tabindex where appropriate, and return of focus after dialogs or transient UI closes.
5. **Check dynamic communication.** Verify validation errors, async completion, toasts, expanded state, live regions, and route changes are announced without stealing focus or repeating excessively.
6. **Review visual access.** Check text and non-text contrast, focus indicators, 200% zoom, narrow reflow, text spacing, target size, motion preferences, and information conveyed only by color, position, hover, or animation.
7. **Exercise a representative assistive path.** When browser or platform tools are available, inspect the accessibility tree and test the critical flow with a screen-reader-oriented sequence. Do not claim device coverage that was not performed.
8. **Prioritize and regress.** Rank findings by blocked task and affected population. For deterministic defects, recommend the smallest automated regression check; retain manual steps for behavior automation cannot prove.

> [!WARNING]
> A zero-violation automated scan is not a pass. A perfectly valid button named “button” can still make a workflow unusable.

## Output

Provide the audited scope, environments and tools, findings with element or file evidence, affected interaction, severity, recommended remediation, and exact verification step. Separate automated, manual, and untested coverage.
