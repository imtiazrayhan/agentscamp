---
name: "flaky-test-diagnoser"
title: "Flaky Test Diagnoser"
description: "Diagnose a test that passes and fails without relevant code changes by reproducing the instability, classifying its trigger, and isolating the shared state, timing, ordering, concurrency, randomness, or environment dependency behind it. Use when CI retries hide failures, a test fails only in the suite, or a failure cannot be reproduced reliably on one machine."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "purple"
date: 2026-08-04
topics: ["review-qa", "devops-infra"]
related: ["best-claude-skills-for-testing", "test-scaffolder", "integration-test-designer", "mutation-test-runner", "coverage-gap-finder", "github-actions-optimizer"]
featured: true
summary: "Diagnoses nondeterministic tests through repeated, reordered, isolated, parallel, and seeded runs. It classifies the flake, identifies the smallest condition that changes the outcome, distinguishes test defects from product races, and reports evidence plus a targeted fix and verification plan instead of treating retries as a solution."
faq:
  - q: "Are test retries a valid fix for flaky tests?"
    a: "No. Retries can keep CI moving temporarily, but they hide the failure rate, consume time, and allow real races to survive. Track retries as debt while isolating and fixing the cause."
  - q: "How can I tell whether the test or production code is flaky?"
    a: "Change one condition at a time. If controlled time, isolation, cleanup, or deterministic data removes the failure, the harness is suspect. If valid concurrent schedules still violate a product invariant, the test may be exposing a real race."
---

Find the condition that changes a test outcome without guessing or accepting retries as the end state.

## Workflow

1. **Capture the failure signature.** Record the test name, assertion or exception, runner, seed, worker count, duration, environment, retry number, and nearby logs. Separate multiple signatures before investigating.
2. **Measure the baseline.** Run the narrowest failing test repeatedly with the same seed and environment. Report run count and failure rate; do not call a test stable after one passing run.
3. **Vary one dimension at a time.** Compare isolated versus full-suite, serial versus parallel, fixed versus random order, cold versus warm process, local versus CI-like settings, and controlled versus real time. Preserve every command and result.
4. **Classify the trigger.** Check for leaked global state, incomplete cleanup, fixed ports, shared files or records, mutable fixtures, clock and timezone assumptions, unseeded randomness, eventual consistency, unordered collections, resource exhaustion, and true concurrency races.
5. **Find the minimal interference.** Bisect the preceding test set or worker configuration when order matters. Identify the smallest predecessor, shared resource, timing window, or environment variable that changes the outcome.
6. **Distinguish harness defect from product defect.** Do not add waits or mocks until deciding whether the system violates a real invariant under a valid schedule. A race revealed by a test is not automatically a flaky test bug.
7. **Propose the narrowest repair.** Prefer deterministic inputs, explicit synchronization, unique resources, complete teardown, event-based waiting, or isolated state. Avoid arbitrary sleeps, wider timeouts, broad serialization, and permanent retries unless they are temporary containment.
8. **Verify statistically.** Repeat the original stress conditions and the broader suite enough times to cover the observed failure rate. Report residual risk when the initial flake was too rare to establish confidence.

> [!WARNING]
> A longer timeout can make a timing symptom rarer without correcting causality. Fix the state or synchronization contract that made elapsed wall time relevant.

## Output

Report the failure signature, reproduction commands, run counts and failure rates, isolated trigger, evidence for test-versus-product classification, recommended fix, and post-fix stress results. If the cause remains unknown, rank the remaining hypotheses and name the next discriminating experiment.
