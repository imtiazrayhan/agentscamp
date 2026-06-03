---
name: "test-scaffolder"
description: "Scaffold a test file with sensible cases for a given module or function. Use when adding tests to untested code and you want a fast, structured starting point."
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["review-qa"]
---

Generate a ready-to-run test file for a module or function that currently has no coverage. The skill reads the target source, infers its public surface and likely edge cases, picks the project's existing test framework and conventions, and writes a focused suite of meaningful cases — happy path, boundaries, and error handling — so you start from a real structure instead of a blank file.

## When to use this skill

- You are adding tests to previously untested code and want a fast, structured starting point.
- A new function or module needs a baseline suite before you refine specific cases.
- You want consistency with the repo's existing framework, file naming, and assertion style.

> [!NOTE]
> This scaffolds a strong starting point — not a guarantee of correctness. Always read the generated assertions and confirm they encode the behavior you actually want before relying on them.

## Instructions

1. **Locate the target.** Read the file the user named. Identify the exported/public functions, classes, and their signatures. Note parameter types, return types, thrown errors, and any side effects (I/O, network, state mutation).
2. **Detect the test stack.** Inspect the project to match conventions — do not guess:
   - Check `package.json` (`jest`, `vitest`, `mocha`), `pytest.ini`/`pyproject.toml`, `go.mod`, etc.
   - Mirror the existing test file location and naming (e.g. `__tests__/`, `*.test.ts`, `*_test.py`, `foo_test.go`).
   - Match the assertion and mocking style already used in neighboring tests.
3. **Enumerate cases per unit.** For each function, derive: the happy path, boundary inputs (empty, zero, max, null/undefined), invalid input that should throw, and any documented branches. Prefer a few meaningful cases over many trivial ones.
4. **Write the file.** Create the test file at the conventional path with correct imports, a `describe`/`it` (or framework-equivalent) block per unit, and clear test names stating the expected behavior. Stub external dependencies; leave a `// TODO` only where a value genuinely needs human judgment.
5. **Verify it runs.** Run the suite (e.g. `npx vitest run path`). Fix import/syntax errors so the file executes. Failing assertions that reveal real behavior are acceptable — flag them; broken scaffolding is not.
6. **Report.** Summarize the cases covered and call out any gaps (untested branches, hard-to-mock dependencies) the user should address next.

> [!WARNING]
> Do not assert on implementation details (private helpers, internal call order) unless asked. Test observable behavior through the public API so the suite survives refactors.

## Examples

Given `src/utils/slugify.ts`:

```ts
export function slugify(input: string): string {
  if (typeof input !== "string") throw new TypeError("input must be a string");
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
```

The skill detects Vitest and writes `src/utils/slugify.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("collapses runs of non-alphanumerics into one hyphen", () => {
    expect(slugify("a  --  b!!c")).toBe("a-b-c");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  !Hi!  ")).toBe("hi");
  });

  it("returns an empty string for symbol-only input", () => {
    expect(slugify("###")).toBe("");
  });

  it("throws TypeError on non-string input", () => {
    // @ts-expect-error testing runtime guard
    expect(() => slugify(42)).toThrow(TypeError);
  });
});
```

Run it with `npx vitest run src/utils/slugify.test.ts`, then refine the assertions to match your intended behavior.
