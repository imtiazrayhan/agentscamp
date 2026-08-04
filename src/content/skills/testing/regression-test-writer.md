---
name: "regression-test-writer"
title: "Regression Test Writer"
description: "Turn a reported bug into the smallest test that fails for the real reason before the fix and passes afterward. Use when reproducing a defect, reviewing a bug fix with no guard test, converting an incident into permanent coverage, or preventing a previously fixed edge case from returning."
allowed-tools: "Read, Grep, Glob, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-08-04
topics: ["review-qa"]
related: ["guide:best-claude-skills-for-testing", "skill:test-scaffolder", "skill:coverage-gap-finder", "skill:integration-test-designer", "skill:contract-test-designer", "command:fix-failing-test"]
featured: true
summary: "Converts a bug into a durable regression test by tracing the real failure path, choosing the lowest reliable test layer, reproducing the defect against the pre-fix behavior, and asserting the user-visible invariant rather than the implementation. It proves red before green, avoids oversized fixtures and mocks, and reports the exact command and failure signal."
faq:
  - q: "Should a regression test be written before the bug fix?"
    a: "Yes whenever the defect can be reproduced safely. Seeing the new test fail for the expected reason proves it covers the bug; a test written after the fix can pass without ever exercising the broken behavior."
  - q: "At what level should a regression test live?"
    a: "Use the lowest layer that reproduces the real failure without mocking away its cause. Pure logic belongs in a unit test, database or framework behavior in an integration test, interface incompatibility in a contract test, and only genuinely cross-system failures in end-to-end tests."
---

Produce a minimal, trustworthy test that fails on the bug and protects the behavior after the fix.

## Workflow

1. **Restate the invariant.** Convert the report into one sentence: under input and state X, behavior Y must occur and Z must not occur. Separate symptoms from the actual contract.
2. **Trace the failing path.** Read the production code, existing tests, logs, issue text, and recent changes. Identify the smallest entry point that still crosses the component responsible for the failure.
3. **Choose the lowest reliable layer.** Prefer unit, then component/integration, then contract, then end-to-end. Do not choose a low layer if mocks remove the database, serializer, concurrency, timezone, or framework behavior that caused the bug.
4. **Minimize the fixture.** Keep only state required to trigger the defect. Use existing builders and factories. Replace timestamps, randomness, network, and concurrency with controlled inputs without changing the failure mechanism.
5. **Write the test against behavior.** Name the bug condition and expected outcome. Assert outputs, persisted state, side-effect count, or observable error—not private method calls or incidental implementation.
6. **Prove the test is red.** Run the focused test against the broken state when available. Confirm it fails at the intended assertion, not from setup, missing dependencies, or an unrelated error. Record the failure signal.
7. **Apply or verify the fix.** If the requested scope includes implementation, make the smallest fix and rerun. Otherwise leave the failing test and report that it correctly reproduces the bug.
8. **Check for false confidence.** Temporarily weaken or remove the production fix when safe, or otherwise demonstrate the test distinguishes broken from correct behavior. Run the relevant surrounding suite to catch fixture pollution.

> [!WARNING]
> A test that was never observed failing may document the fixed implementation without guarding the defect. Prove red for the expected reason before trusting green.

## Output

Report:

- the behavioral invariant and chosen test layer
- the new or updated test file
- the focused command used to reproduce it
- red-state evidence: expected assertion and observed failure
- green-state and surrounding-suite results when a fix is present
- any part of the original report that could not be reproduced
