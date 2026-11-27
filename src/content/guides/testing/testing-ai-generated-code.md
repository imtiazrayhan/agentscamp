---
title: "How to Test AI-Generated Code"
description: "AI writes the code; tests decide whether to trust it. The verification stack for agent-written changes — contracts, generated tests, and the review that's left."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["review-qa"]
tags: ["testing", "ai-code", "verification", "quality", "mutation-testing"]
featured: true
summary: "Write the test that defines done before the agent starts, forbid the agent from editing it, and read every assertion it adds. Then run a mutation tool such as Stryker on the changed files: each surviving mutant is a behavior no test pins. Keep human review for what tests cannot see, such as security, design and scope."
keyTakeaways:
  - "Role reversal: with human code, tests catch mistakes; with AI code, tests are the acceptance criteria. Write 'done means this passes' before the agent starts."
  - "The self-grading trap: an agent writing both code and tests can put the same misreading in both. Review the tests, which are short, even when you skim the code."
  - "Weak assertions have a recognizable shape: toBeDefined, toBeTruthy, toBeGreaterThanOrEqual(0), a bare toThrow(), a snapshot. They execute the line without pinning the result."
  - "Coverage says a line ran. Mutation testing says a test would fail if the line were wrong. Run it scoped to the files the agent changed."
  - "A surviving mutant is sometimes the correct code. Check it against the requirement before writing the assertion that kills it."
  - "Tests cannot see everything: vulnerabilities that behave correctly, load behavior, structure, scope creep. That is what human review and security scans still own."
faq:
  - q: "Should the same agent write the code and its tests?"
    a: "It's fine for breadth and dangerous for truth. An agent that misread the requirement writes code and tests that agree with each other: green suite, wrong behavior. Write or review the defining test yourself before implementation, have a separate session write tests from the requirement without seeing the implementer's reasoning, and read the assertions."
  - q: "Is line coverage a good bar for AI code?"
    a: "It's a floor, not a bar. Agents hit coverage targets easily by executing lines with weak assertions. In the worked example on this page, the suite has full line coverage of a six-line function and still passes with an off-by-one bug at the pricing threshold. Use a mutation score on the changed files instead."
  - q: "Which mutation testing tool should I use?"
    a: "For JavaScript and TypeScript, StrykerJS: npm init stryker@latest sets it up and npx stryker run executes it, with runner plugins for Vitest, Jest, Mocha and others. Stryker also has .NET and Scala versions. Python projects commonly use mutmut, and JVM projects use PIT."
  - q: "Isn't mutation testing too slow?"
    a: "On a whole repository, often yes, because the tool re-runs tests for every mutant. Scope it. StrykerJS takes --mutate with a file, a glob, or a line range, runs only the tests that cover each mutant (perTest coverage analysis is the default), and has an --incremental mode that reuses the previous run's results."
  - q: "What can't tests catch in AI-generated code?"
    a: "Vulnerabilities that function correctly (injection, missing authorization checks), performance and resource behavior under load, whether the structure can be extended, and silent scope drift, meaning code that does more than asked. Tests verify the contract. Review verifies intent and blast radius."
  - q: "How do I retrofit confidence onto an already-merged pile of AI code?"
    a: "Characterization first: generate tests that pin current behavior (the coverage-gap-finder skill targets the valuable untested paths), then review those assertions against intent. Every mismatch is a latent bug surfaced. Run a mutation pass on the critical modules, then refactor with the safety net in place."
related: ["guide:tdd-with-ai-agents", "command:write-tests", "skill:test-scaffolder", "skill:coverage-gap-finder", "skill:mutation-test-runner", "agent:test-engineer", "guide:vibe-coding-guide", "guide:ai-code-review-workflow"]
audience: ["developers", "founders"]
---

When an agent writes the code, nobody reads every line of the diff. What you can still do is decide in advance what "correct" means, make that executable, and check that the tests would fail if the code were wrong. Four steps, shown below on one small function: write the defining test first, constrain the agent, read the assertions it adds, and mutate the code to find the ones that assert nothing.

## Step 1: write the test that defines done

With human code, tests trail the implementation. With agent code, invert it. Take the requirement:

> Orders with a subtotal of 5,000 cents or more ship free. Everything else pays a flat 599 cents. Subtotals are integer cents; a negative or non-integer subtotal is an error.

and write the acceptance test yourself, before the agent sees the task:

```ts
// src/shipping.test.ts  (written by you, not the agent)
import { describe, it, expect } from "vitest";
import { shippingCents } from "./shipping";

describe("shippingCents", () => {
  it("charges the flat rate on a small order", () => {
    expect(shippingCents(1000)).toBe(599);
  });

  it("ships a large order free", () => {
    expect(shippingCents(7500)).toBe(0);
  });

  it("rejects a negative subtotal", () => {
    expect(() => shippingCents(-1)).toThrow(RangeError);
  });
});
```

This is the pattern from [TDD with AI agents](/guides/testing/tdd-with-ai-agents), and it is what makes [vibe-speed development](/guides/prompting/vibe-coding-guide) safe: you review a dozen lines of intent instead of pretending to review the whole diff. Note what this test misses. It never checks an order of exactly 5,000 cents. That omission is deliberate here, because people make it all the time.

## Step 2: constrain the agent

The prompt matters as much as the test:

```text
Implement src/shipping.ts so that src/shipping.test.ts passes.
Do not edit src/shipping.test.ts.
Then add edge-case tests in a new file, src/shipping.edge.test.ts.
Requirement: orders with a subtotal of 5,000 cents or more ship free; everything
else pays a flat 599 cents; subtotals are integer cents; a negative or
non-integer subtotal throws RangeError.
```

"Do not edit the test file" closes the cheapest way to turn a suite green. Check it afterwards with `git diff --stat`; the defining test should not appear.

The agent returns this:

```ts
// src/shipping.ts  (agent)
export const FREE_SHIPPING_MIN_CENTS = 5000;
export const FLAT_RATE_CENTS = 599;

export function shippingCents(subtotalCents: number): number {
  if (!Number.isInteger(subtotalCents) || subtotalCents < 0) {
    throw new RangeError("subtotalCents must be a non-negative integer");
  }
  return subtotalCents > FREE_SHIPPING_MIN_CENTS ? 0 : FLAT_RATE_CENTS;
}
```

```ts
// src/shipping.edge.test.ts  (agent)
import { it, expect } from "vitest";
import { shippingCents } from "./shipping";

it("handles the threshold amount", () => {
  expect(shippingCents(5000)).toBeGreaterThanOrEqual(0);
});

it("charges shipping on an empty cart", () => {
  expect(shippingCents(0)).toBe(599);
});

it("rejects fractional cents", () => {
  expect(() => shippingCents(10.5)).toThrow();
});
```

All six tests pass. Every line of `shipping.ts` is covered. And the function is wrong: "or more" means `>=`, and a customer with a cart of exactly 5,000 cents is charged shipping.

## Step 3: read the assertions

This is the self-grading trap. One context wrote the implementation and the edge tests, so its misreading of "5,000 cents or more" is in the code, and the test that should have caught it asserts something that is true for any answer.

Reading the assertions is the cheap defense, and weak ones have a recognizable shape:

| Assertion | What it proves |
| --- | --- |
| `toBeDefined()`, `toBeTruthy()`, `not.toBeNull()` | The function returned something |
| `toBeGreaterThanOrEqual(0)` on a value that can never be negative | Nothing |
| `toThrow()` with no error type or message | Something threw, possibly for an unrelated reason |
| `toMatchSnapshot()` on output nobody inspected | The output equals whatever the agent produced |
| A test named for a behavior whose expectation doesn't mention it | Usually that the agent wasn't sure what the answer was |

"Handles the threshold amount" is the fifth kind. A reviewer who reads only test names sees threshold coverage. The [review-tests](/commands/review/review-tests) command automates this pass.

A stronger defense is a blind second suite. Open a separate session, or hand the job to the [test-engineer](/agents/quality-security/test-engineer) agent, and give it the requirement and the function signature but not the implementer's conversation:

```text
Write Vitest tests for shippingCents(subtotalCents: number): number from this
requirement only. Do not read src/shipping.ts before writing them.
Cover every boundary the requirement implies and assert exact values.
<requirement text>
```

A tester working from the words "or more" will usually write `expect(shippingCents(5000)).toBe(0)`, and the two suites disagree. Disagreement between independently written suites is the signal, the same idea as a [fresh-eyes critic](/guides/advanced/multi-agent-orchestration).

## Step 4: mutate the code

Reading catches what you notice. Mutation testing catches what you don't. A mutation tool makes small changes to the code (swap `>` for `>=`, replace a condition with `true`, empty a string) and re-runs the tests against each change. If a test fails, the mutant is killed. If everything still passes, the mutant survived, and no test pins that behavior.

For a TypeScript project on Vitest, set up [StrykerJS](https://stryker-mutator.io/docs/stryker-js/getting-started/):

```bash
npm init stryker@latest                              # installs Stryker and writes a config
npm i --save-dev @stryker-mutator/vitest-runner      # if the wizard didn't add it
```

```json
{
  "testRunner": "vitest",
  "mutator": { "excludedMutations": ["StringLiteral"] },
  "thresholds": { "high": 80, "low": 60, "break": 75 }
}
```

`excludedMutations` skips mutating the error-message string, which nobody needs a test for. `thresholds.break` makes Stryker exit with code 1 when the mutation score falls below that number, so the check can gate CI. Then run it against only the file the agent changed:

```bash
npx stryker run --mutate "src/shipping.ts"
```

The default `clear-text` reporter lists each survivor with the changed line. The one that matters here looks like this (abridged and reformatted):

```text
[Survived] EqualityOperator
src/shipping.ts:9:10
-   return subtotalCents > FREE_SHIPPING_MIN_CENTS ? 0 : FLAT_RATE_CENTS;
+   return subtotalCents >= FREE_SHIPPING_MIN_CENTS ? 0 : FLAT_RATE_CENTS;
```

Changing `>` to `>=` broke no test. The only test that touches 5000 accepts any non-negative number, so both versions pass.

Now do the step that separates this from chasing a score: **check the survivor against the requirement.** "5,000 cents or more" means the mutant is the correct program and the original is the bug. So the fix is two changes, in this order:

```ts
// src/shipping.test.ts: add the missing boundary to the defining test
it("ships free at exactly the threshold", () => {
  expect(shippingCents(5000)).toBe(0);
});

it("charges one cent below the threshold", () => {
  expect(shippingCents(4999)).toBe(599);
});
```

Run the suite and watch the first one fail. Then have the agent fix `shipping.ts`, delete the vacuous threshold test, and re-run Stryker on the same scope to confirm the survivor is gone.

Not every survivor deserves a test. Some mutants are equivalent: they change the code without changing behavior, and no test can kill them. Others touch behavior you don't care to specify, like the error message above. Triage them; don't chase 100%. Mutants reported as **no coverage** are a different problem: no test ran that code at all.

Other stacks have the same loop under different names: Stryker also ships for .NET and Scala, Python projects commonly use mutmut, and JVM projects use PIT. The [mutation-test-runner](/skills/testing/mutation-test-runner) skill runs whichever tool your repo has, triages survivors, and names the assertion that would kill each one.

## What agents test well, and what you must add

Agents are good at breadth: empty inputs, unicode, boundary tables, regression scaffolds around legacy code. [test-scaffolder](/skills/testing/test-scaffolder) and [write-tests](/commands/testing/write-tests) package that, and [property-test-designer](/skills/testing/property-test-designer) pushes it further with generated inputs. What an agent does not know is which behaviors carry the business. That part is yours:

- The handful of assertions that encode intent, written or approved by a person who knows the requirement.
- Where effort goes: [coverage-gap-finder](/skills/testing/coverage-gap-finder) ranks untested paths by value so you aren't testing getters.
- A mutation pass on anything involving money, permissions, or parsing.

## What tests still can't see

A suite verifies the contract. It is blind to categories an agent can get wrong while staying green:

- **Security that functions.** An injectable query returns the right rows. Run a [security scan](/commands/review/security-scan) as its own pass.
- **Performance under load.** Unit tests don't notice an N+1 query.
- **Structure.** Coupling and duplication pass every test until someone has to change the code.
- **Scope creep.** Code that does more than asked. Tests only check what you thought to ask for.

That list is the rubric for the human pass in your [review workflow](/guides/workflow/ai-code-review-workflow): skip re-deriving what the tests already prove and spend the time on what they can't.

## The checklist

1. **Before:** a test you wrote or approved defines done, including the boundaries.
2. **During:** the agent may not edit that test; verify with `git diff --stat`.
3. **After:** read every assertion the agent added and replace the vacuous ones.
4. **For critical paths:** run a mutation tool scoped to the changed files; check each survivor against the requirement.
5. **Always:** security scan and a human look at design and scope.

## Continue exploring

- [TDD with AI Agents: Red-Green as an Agent Loop](/guides/testing/tdd-with-ai-agents) — How write-the-test-first turns AI coding into a verifiable loop, and the workflow that makes it stick.
- [Mutation Test Runner](/skills/testing/mutation-test-runner) — Run mutation testing on changed code and get the exact assertions that would kill each surviving mutant.
- [Review Tests](/commands/review/review-tests) — Review the quality of a test suite, not just whether it passes — find weak assertions, missing edge cases, and tests coupled to implementation.
- [Coverage Gap Finder](/skills/testing/coverage-gap-finder) — Run the project's coverage tool and identify the highest-value untested paths, then propose specific test cases for each gap.
- [Test Engineer](/agents/quality-security/test-engineer) — Use this agent to write and improve automated tests — unit, integration, and edge cases.
- [QA Automation Engineer](/agents/quality-security/qa-automation-engineer) — Use this agent for end-to-end and UI test automation — building flake-resistant Playwright/Cypress suites and stabilizing flaky browser tests.
