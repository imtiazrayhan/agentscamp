---
description: "Generate tests covering the happy path and edge cases for the given target."
seoDescription: "/write-tests generates tests covering the happy path and edge cases for a given target, matching your test framework — a Claude Code slash command."
date: 2026-06-03
argument-hint: "[file or function]"
title: "Write Tests"
color: "purple"
topics: ["review-qa"]
related: ["test-engineer"]
summary: "A slash command that writes a focused test suite for a file, function, or class: it reads the target and its entry points, matches the project's test framework and conventions, plans deliberate happy-path, edge-case, and error cases, writes independent deterministic tests that mock only true boundaries, then runs the suite and flags real bugs."
---

Write a focused, high-value test suite for the target supplied in `$ARGUMENTS`. The target may be a file path (e.g. `src/lib/parse.ts`), a specific function or method (e.g. `parseConfig`), or a class. If `$ARGUMENTS` is empty, ask which file or function to cover before continuing.

## Understand the Target

Before writing any tests, build an accurate mental model of what you are testing.

1. Read the target identified by `$ARGUMENTS` and its direct dependencies.
2. Identify every public entry point: exported functions, methods, and class constructors.
3. For each entry point, note inputs, outputs, side effects (I/O, mutations, network, time), and thrown errors.
4. Detect the existing test framework and conventions instead of inventing your own. Check for `jest`, `vitest`, `mocha`, `pytest`, `go test`, etc. in the manifest and look at a neighboring `*.test.*` / `*_test.*` file for style.

> [!NOTE]
> Match the project's existing patterns exactly: file naming, import style, assertion library, and mocking approach. A test suite that fits the codebase is worth more than one that follows your personal preference.

## Plan the Cases

Enumerate cases before coding so coverage is deliberate, not accidental. Aim for the following categories for each entry point.

### Happy path

The expected, well-formed inputs that represent normal usage. Assert on the concrete return value and any intended side effects.

### Edge cases

Boundary and unusual-but-valid inputs, for example:

- Empty inputs: `""`, `[]`, `{}`, `0`, `null`/`None`, `undefined`.
- Boundaries: min/max values, off-by-one limits, single-element vs. many-element collections.
- Unicode, whitespace, very long strings, and duplicate or out-of-order data.

### Error cases

Invalid inputs and failure modes. Assert that the right error type is raised or the documented error result is returned — do not just assert that "something" throws.

```ts
// Assert the specific failure, not a generic one.
expect(() => parseConfig("{ bad json")).toThrow(SyntaxError);
```

## Write the Tests

Produce the suite following these rules.

- Give each test a descriptive name that states the scenario and expected outcome (e.g. `returns 0 for an empty list`).
- Keep tests independent and deterministic. No shared mutable state and no reliance on execution order.
- Use the Arrange–Act–Assert shape; keep each test focused on one behavior.
- Mock only true external boundaries (network, filesystem, clock, randomness). Do not mock the unit under test.
- Pin nondeterminism: seed RNG and freeze time so runs are reproducible.

```ts
import { describe, it, expect } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and hyphenates a normal title", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("collapses repeated separators", () => {
    expect(slugify("a  --  b")).toBe("a-b");
  });

  it("returns an empty string for input with no word characters", () => {
    expect(slugify("!!!")).toBe("");
  });
});
```

## Verify and Report

1. Run the test suite using the project's test command and confirm every new test passes.
2. If a test fails, decide whether it revealed a real bug in the target or a flaw in the test, then fix the appropriate side — do not weaken an assertion just to make it pass.
3. Report a short summary: the entry points covered, the case categories included, and any behavior that looks like a genuine bug.

> [!WARNING]
> If a test exposes incorrect behavior in the target, surface it explicitly rather than writing the test to match the buggy output. Tests should encode intended behavior, not current behavior.
