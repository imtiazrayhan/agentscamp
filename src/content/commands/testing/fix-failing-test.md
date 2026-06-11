---
description: "Diagnose and fix a failing test by finding the real root cause."
date: 2026-06-03
argument-hint: "[test name or path]"
allowed-tools: "Read, Grep, Glob, Edit, Bash"
title: "Fix Failing Test"
color: "purple"
topics: ["review-qa"]
related: ["write-tests", "find-bug", "debugger"]
summary: "A slash command that makes a failing test green by fixing the actual root cause: it reproduces the scoped failure, traces from the assertion to the code under test, explicitly decides whether the test or the code is wrong before editing, applies the smallest fix to the correct side, then re-runs the full suite — never weakening assertions."
---

Make a failing test green by fixing the **actual root cause**, not by papering over it. Follow the steps below in order. The hard part is the judgment call in Step 3 — whether the test or the code is wrong — so do not skip it.

## Scope

`$ARGUMENTS` names the failing test to fix. It may be a test file path (`src/lib/parse.test.ts`), a single test name or pattern (`parses nested config`), or a `file::test` selector your runner understands. Use it to scope the run so you iterate on one failure at a time.

If `$ARGUMENTS` is empty, run the full suite first, find the failing test(s), and pick the first failure to work on. If several tests fail, fix them one at a time and re-run between fixes — a single root cause often explains a cluster of failures, and fixing it may turn the rest green for free.

## Step 1 — Reproduce and read the real failure

Detect the test runner (`jest`, `vitest`, `pytest`, `go test`, `cargo test`, …) from the manifest, then run only the target so the output stays readable.

```bash
# vitest / jest — by name pattern or file
npx vitest run -t "parses nested config"
npx jest path/to/file.test.ts -t "parses nested config"

# pytest — node id or keyword
pytest "tests/test_parse.py::test_nested_config" -x -vv

# go — single test by regexp
go test ./pkg/parse -run TestNestedConfig -v
```

Read the *entire* failure block, not just the red summary line:

- The assertion that failed, with **expected vs. actual** values.
- The stack trace — find the first frame inside the project's own source, not framework internals.
- The exact input the test fed in, so you can replay the path by hand.

> [!NOTE]
> Confirm the test fails for the reason you think it does. A `ReferenceError`, an import that throws at load, a timeout, or a snapshot mismatch are different problems than a logic assertion — don't start fixing math when the real issue is the suite can't even import the module.

## Step 2 — Locate the code under test

Trace from the failing assertion back to the production code that produced the wrong value.

```bash
# Find the symbol the test imports / calls
rg -n "parseConfig" src

# Open the test and the implementation side by side
```

Read both the test and the implementation. Reconstruct what value the code returns for the test's input and *why*, walking the same branch the failing case takes. Check whether the behavior recently changed.

```bash
# What touched this code lately, and was the test updated alongside it?
git log --oneline -10 -- src/lib/parse.ts
git log -p -1 -- src/lib/parse.ts
```

## Step 3 — Decide: is the TEST wrong or the CODE wrong?

This is the decision that determines everything else. **State your verdict explicitly before you edit anything**, and back it with the evidence from Steps 1–2. One side is wrong:

- **The code is wrong** when the test encodes the genuinely intended behavior (a clear spec, a documented contract, the obvious correct answer) and the implementation produces something else. Fix the implementation.
- **The test is wrong** when the implementation is correct and the test asserts the wrong thing — a stale expectation after an intentional behavior change, a bad fixture, a flawed mock, a brittle snapshot, or an order/timing assumption that was never guaranteed. Fix the test.

When it is genuinely ambiguous (no spec says which behavior is right), do not guess silently. State both interpretations and the user-facing consequence of each, and ask which is intended before changing code.

> [!WARNING]
> Never make a test pass by weakening or deleting the assertion — loosening an exact match to `toBeTruthy()`, widening a tolerance, adding `.skip`/`xit`, or editing the expected value to match buggy output. That hides a real bug behind a green check. If the assertion is correct, fix the code; only relax an assertion when the assertion itself is provably wrong.

## Step 4 — Fix the correct side

Apply the smallest change that addresses the root cause you identified.

- **Fixing the code:** correct the actual defect — the off-by-one, the wrong operator, the unhandled `null`, the bad early return. Don't special-case the one input the test uses; fix the general behavior so related inputs are right too.
- **Fixing the test:** update the expectation, fixture, or mock to match the genuinely correct behavior, and leave a one-line comment on *why* if it isn't obvious. If the test was brittle (timing, ordering, snapshot churn), make it deterministic rather than just nudging the expected value.

Touch only what the diagnosis requires. Leave unrelated cleanup for another change.

## Step 5 — Re-run and confirm green

Run the scoped target first to confirm the specific failure is gone.

```bash
npx vitest run -t "parses nested config"
```

Then run the surrounding file and the full suite to make sure the fix didn't break a sibling test.

```bash
npx vitest run path/to/file.test.ts   # the whole file
npx vitest run                        # the full suite
```

> [!NOTE]
> If the target now passes but a previously-green test fails, your change had a side effect that the broader suite encodes as intended behavior. That regression is a new signal — return to Step 3 and reconcile the two expectations rather than suppressing either one.

## Report

Summarize for the user, concisely:

- **Verdict:** which side was wrong (test or code) and the one-line root cause.
- **Fix:** the file and what you changed, and why it addresses the cause rather than the symptom.
- **Result:** the target test and full suite are green (paste the final pass count), or the open question you need answered if the intended behavior was ambiguous.

Do not commit or push — leave the change staged for the user to review unless they explicitly ask you to commit.
