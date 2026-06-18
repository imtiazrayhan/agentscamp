---
description: "Review the quality of a test suite, not just whether it passes — find weak assertions, missing edge cases, and tests coupled to implementation."
date: 2026-06-17
argument-hint: "<test file or area to review>"
allowed-tools: "Read, Grep, Glob"
title: "Review Tests"
color: "purple"
topics: ["review-qa"]
related: ["review-pr", "write-tests", "flaky-test-hunt", "fix-failing-test"]
featured: false
summary: "A read-only review of test quality, not pass/fail: reads the tests and the code under test, then flags change-detector tests coupled to implementation, happy-path-only coverage, weak assertions, time/network-dependent flakiness, over-mocking, and line-coverage that misses branches — citing each test, the weakness, and the fix, plus the highest-value missing tests."
faq:
  - q: "Why review test quality if the suite is already green and coverage is high?"
    a: "Green and high-coverage are necessary, not sufficient. A test that asserts only 'no error thrown', mirrors the implementation line for line, or mocks the very thing it claims to verify will stay green while the behavior it should protect silently breaks. Line coverage counts executed lines, not verified behavior or branches — so 90% coverage with weak assertions is false confidence. This review finds the gap between 'passes' and 'actually protects the contract'."
  - q: "Does this command change my tests or run them?"
    a: "No. It is strictly read-only (Read, Grep, Glob) — it reads the tests and the code under test, then reports prioritized findings and the missing tests worth adding. It never edits, executes, or commits. Use /write-tests or /flaky-test-hunt to act on the findings."
---

Review the **quality** of the tests in `$ARGUMENTS`, not whether they pass. A green suite tells you the tests ran; it does not tell you they verify the right behavior, cover the failure paths, or survive a refactor. Your job is to find the gap between "passes" and "actually protects the contract," then report it. Follow the steps in order — the judgment is in Steps 3–4.

## Scope

`$ARGUMENTS` names what to review: a test file, a directory of tests, or an area ("the auth tests", "the cart reducer specs"). Use it to bound which test files you read and which production code you trace them against.

If `$ARGUMENTS` is empty, ask one focused question: *which test file or area should I review?* Do not review the whole suite by default — a vague review produces vague findings.

> [!WARNING]
> Read-only. Use only Read, Grep, and Glob. Do not edit tests, run the suite, or change coverage config. You are diagnosing quality and reporting it, not fixing it.

## Step 1 — Read the tests and the code under test

Find the test files in scope, then read each one **alongside the production code it exercises**. You cannot judge whether an assertion is right without knowing the contract it's supposed to enforce.

```bash
# Find the tests in scope
# (Glob) **/*.{test,spec}.{ts,tsx,js,jsx}   or   **/test_*.py   or   **/*_test.go
```

For each test, identify: what unit/behavior it claims to cover, what it asserts, what it mocks or stubs, and what setup/teardown it relies on. Then open the corresponding source so you know the real branches, error paths, and edge inputs that *should* be tested.

> [!NOTE]
> Map tests to behaviors, not to files. A `cart.test.ts` with twelve tests can still leave the "apply expired coupon" branch completely unverified. Coverage of files is not coverage of behavior.

## Step 2 — Inventory what's actually asserted

Before judging, list the concrete claims. For each test, write down the assertion(s) and the branch of production code they pin down. This surfaces two failure modes immediately: tests that assert almost nothing, and large swaths of source with no test pointing at them.

Use Grep to find the tells fast across the scope:

```bash
# Weak / non-assertions: a test that only checks it didn't throw
grep -rnE 'expect\([^)]*\)\.(toBeDefined|toBeTruthy|not\.toThrow)\(\)|assert\s+\w+\s*$' <scope>

# Snapshot tests (often assert "it looks like last time", not correct behavior)
grep -rnE 'toMatchSnapshot|toMatchInlineSnapshot' <scope>

# Mock-heavy tests (count mocks per file — high counts hint the test verifies wiring, not behavior)
grep -rcE 'jest\.mock|vi\.mock|mock\.|MagicMock|patch\(|nock\(|when\(' <scope>

# Determinism hazards inside tests
grep -rnE 'Date\.now|new Date\(\)|Math\.random|setTimeout|sleep\(|fetch\(|axios|http' <scope>
```

## Step 3 — Judge each weakness category

This is the core of the review. For every test file, decide which of these it suffers from, and back the call with the specific line. State the category explicitly per finding.

- **Change-detector tests (coupled to implementation).** The test asserts on private internals, call order of mocked collaborators, exact prop trees, or full snapshots — so any refactor that preserves behavior turns it red. *Tell:* the test would break if you renamed a private method or reordered two internal calls without changing output. These punish refactoring and train the team to regenerate snapshots blindly.
- **Happy-path only.** The test covers the success case and skips the failure paths the code clearly handles — invalid input, empty/null, boundary values, the `catch` block, the early-return guard, concurrent access. *Tell:* the production function has 4 branches; the tests exercise 1.
- **Weak assertions.** The test runs the code but asserts something trivially true: `toBeDefined`, `toBeTruthy`, "didn't throw", `status === 200` without checking the body, or asserting a mock was called without checking the *arguments* or the *effect*. *Tell:* you could break the real logic and the test stays green.
- **Non-deterministic / non-isolated.** The test depends on real wall-clock time, unseeded randomness, network or a live DB, the filesystem, or on another test having run first (shared module state, ordering). *Tell:* it would flake under shuffle, in a different timezone, or offline. (Hand these to `/flaky-test-hunt`.)
- **Over-mocking.** So much is mocked that the test exercises only the mocks — e.g. mocking the function under test, or stubbing every collaborator so the only thing verified is that you wired the stubs together. *Tell:* the assertions check mock call counts, and the real code could be deleted without failing the test.
- **Coverage theatre.** Lines are executed (driving the coverage number up) but no meaningful assertion checks the result, or branch/edge coverage is missing under a high line-coverage headline. *Tell:* a test that calls a function inside a loop "for coverage" with no assertion on the outputs.

> [!WARNING]
> High line-coverage with weak assertions is **false confidence** — it reports that lines ran, not that behavior is correct. Call this out explicitly when you see it. A suite at 90% line coverage whose assertions are mostly `toBeTruthy` protects almost nothing.

> [!NOTE]
> Distinguish *coupled to implementation* from *testing behavior*. A good test pins the observable contract (inputs → outputs/side effects) and survives any internal rewrite that keeps that contract. If renaming a private helper would break the test, it's testing the implementation, not the behavior.

## Step 4 — Find the highest-value missing tests

The most valuable output is often a test that doesn't exist. From the production code you read in Step 1, list the behaviors and branches with **no** meaningful assertion, then rank them by blast radius: error/failure paths, security-relevant branches, boundary values, and concurrency before cosmetic gaps. Name the specific input and the expected result for each, so the suggestion is directly actionable.

## Report

Deliver as your message, ordered by severity. For every finding cite `file:line`, name the category, explain *why* it's weak, and give the concrete fix:

```markdown
## Test review — <scope>

**Overall:** <2-3 sentences: does this suite verify behavior or just execute code? Biggest risk?>

### High — weak or misleading tests
- `cart.test.ts:42` — [Weak assertion] only asserts `toBeDefined()`; the discount math is never checked. Assert the exact total for a known cart. Breaking the formula currently keeps this green.
- `auth.test.ts:88` — [Over-mocking] mocks `verifyToken`, the function under test; the test proves only that the mock returns its stub. Test the real verifier against a known-good and a tampered token.

### Medium — coupled / non-deterministic
- `render.test.tsx:15` — [Change-detector] full `toMatchSnapshot`; any markup refactor breaks it. Assert the visible text/role instead.
- `expiry.test.ts:30` — [Non-deterministic] asserts against `Date.now()`; flakes near boundaries. Inject a fixed clock.

### Missing tests (highest value first)
- `refund()` error path — refund exceeding the original charge is never tested. Expect it to reject with `AmountExceedsCharge`.
- `parseRange()` boundary — empty and single-element inputs untested.

### Coverage note
<If line coverage looks high but branches/assertions are thin, say so plainly and name the false-confidence risk.>
```

End with the single highest-value change: the one missing test or one weak assertion that, fixed first, removes the most risk.