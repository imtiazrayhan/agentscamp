---
description: "Refactor the target for readability and structure without changing behavior."
seoDescription: "/refactor restructures the target for readability and structure without changing behavior — a Claude Code slash command for safe, incremental cleanup."
date: 2026-06-03
argument-hint: "[file or function]"
title: "Refactor"
color: "purple"
topics: ["review-qa"]
related: ["agent:refactoring-specialist"]
summary: "A slash command that refactors a file or function for readability and structure without changing behavior: it establishes a passing test baseline, targets concrete issues like vague names, duplication, deep nesting, and dead code, applies small verifiable steps re-running tests after each, and reports what changed and why."
---

Refactor `$ARGUMENTS` to improve readability, structure, and maintainability while keeping observable behavior exactly the same. If `$ARGUMENTS` is empty, ask which file or function to target before making any changes.

> [!WARNING]
> This is a behavior-preserving refactor, not a rewrite. Do not add features, change public APIs, alter return values, or modify side effects. If you discover a genuine bug, stop and report it instead of silently "fixing" it.

## 1. Establish a baseline

Before touching anything, understand the current behavior and how it is verified.

- Read `$ARGUMENTS` and the code that calls it. Note the public interface: function signatures, exported symbols, and any side effects (I/O, network, mutation, logging).
- Find the relevant tests. Run them to confirm they pass before you start, so you have a known-good baseline.

```bash
# Adjust to the project's test runner
npm test            # or: pytest, go test ./..., cargo test
```

If there are no tests covering the target, say so. Add a minimal characterization test that captures current behavior before refactoring, or ask the user how to proceed.

## 2. Identify what to improve

Look for concrete, well-known issues rather than stylistic preference:

- **Naming** — vague or misleading identifiers (`data`, `tmp`, `doStuff`).
- **Duplication** — repeated logic that can be extracted into one place.
- **Long functions** — units doing several jobs that should be split.
- **Deep nesting** — guard clauses and early returns can flatten control flow.
- **Dead code** — unused variables, unreachable branches, stale comments.
- **Leaky structure** — mixed levels of abstraction in one function.

## 3. Apply changes in small steps

Make one focused transformation at a time. Prefer many small, verifiable edits over one large rewrite.

A typical move is replacing nested conditionals with guard clauses:

```js
// Before
function getDiscount(user) {
  if (user) {
    if (user.isActive) {
      return user.isPremium ? 0.2 : 0.1;
    }
  }
  return 0;
}

// After
function getDiscount(user) {
  if (!user || !user.isActive) return 0;
  return user.isPremium ? 0.2 : 0.1;
}
```

After each meaningful step, re-run the tests so a regression is caught immediately and isolated to the change that caused it.

## 4. Verify behavior is unchanged

- Run the full test suite again; it must pass with no modifications to the assertions.
- Run the linter and type checker to confirm nothing was broken.

```bash
npm run lint
npm run build   # or the project's typecheck command
```

> [!NOTE]
> If a test had to change to keep passing, that means behavior changed. Revert and rethink, or surface the discrepancy to the user.

## 5. Summarize

Report back concisely:

- **What changed** — the specific refactorings applied (e.g. "extracted `validateInput`, flattened nesting in `parse`").
- **Why** — the readability or structure problem each change addressed.
- **Verification** — that tests, lint, and types still pass.
- **Follow-ups** — anything out of scope you noticed (suspected bugs, missing test coverage) listed separately, not acted on.
