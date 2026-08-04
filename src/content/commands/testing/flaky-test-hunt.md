---
description: "Reproduce a flaky test, find the real source of nondeterminism, and fix the cause."
seoDescription: "/flaky-test-hunt reproduces a flaky test, isolates the real source of nondeterminism, and fixes the cause instead of adding retries — a Claude Code command."
date: 2026-06-17
argument-hint: "<suspected test or area (optional)>"
allowed-tools: "Bash, Read, Edit"
title: "Hunt Flaky Tests"
color: "purple"
topics: ["review-qa"]
related: ["command:fix-failing-test", "command:write-tests", "command:trace-data-flow"]
summary: "Hunts a flaky test to its root cause: reproduces the intermittency by looping the suspect with randomized order/seed, classifies the nondeterminism (shared state, real time, unseeded RNG, async races, network, leaks, locale/TZ), fixes the source — inject a clock, seed RNG, await properly, isolate state, mock the network — then re-runs to prove stability. Never hides it with retries or sleeps."
faq:
  - q: "Why not just add a retry or a longer sleep to fix a flaky test?"
    a: "Retries and sleeps hide nondeterminism instead of removing it — the test still fails for real users and CI, just less often, and the underlying race or shared-state bug ships to production. This command finds and fixes the source so the test is deterministic, not merely greener."
  - q: "How many times should I loop a test to confirm it's flaky?"
    a: "Loop until you've seen at least one failure, then enough green runs to trust a fix. 20–50 iterations catches most order/timing flakes; 100+ with randomized order and seed surfaces rare races. A test that passes 100/100 after the fix, with order randomized, is the bar for stable."
---

Find why a test passes sometimes and fails other times, then remove the **nondeterminism** — don't make it fail less often. The whole job is turning an intermittent failure into either a reliable pass or a reliable fail you can debug. Follow the steps in order; the judgment call is Step 3, classifying *which* source of flakiness you're looking at.

## Scope

`$ARGUMENTS` optionally names the suspect: a test file, a single test name/pattern, or just an area ("the checkout integration tests"). Use it to scope the reproduction loop so each run stays fast and one failure is readable.

If `$ARGUMENTS` is empty, find the suspect first. Look for the usual tells: tests skipped/quarantined in config, `retry`/`flaky`/`@flaky` annotations, CI history if available, and tests that touch time, randomness, ordering, the network, or the filesystem. Pick the most-cited or most-recently-failed one and confirm with the user if several are equally likely.

> [!WARNING]
> Reproduce flakiness *before* you change anything. A single green run proves nothing — flaky tests pass most of the time by definition. If you can't make it fail, you can't prove you fixed it.

## Step 1 — Reproduce the intermittency

Detect the runner from the manifest, then **loop the suspect** until you observe both a pass and a failure. One run is worthless here; volume is the tool.

```bash
# Loop a single test N times, stop on first failure (shell, runner-agnostic)
for i in $(seq 1 50); do
  npx vitest run -t "applies the discount" || { echo "FAILED on run $i"; break; }
done

# Native repeat flags where they exist
npx jest path/to/file.test.ts --runInBand            # jest: run serially to expose order coupling
pytest tests/test_cart.py -k discount --count=50      # pytest-repeat
go test ./cart -run TestDiscount -count=50            # go: -count disables the test cache
cargo test discount -- --test-threads=1               # rust: serialize to surface shared state
```

Then attack the two biggest flake sources directly — **order and seed** — because a test that's stable in isolation but flaky in the suite is order-dependent:

```bash
npx vitest run --sequence.shuffle                      # randomize test order
npx jest --shuffle
pytest -p randomly                                      # pytest-randomly randomizes order + seed
go test ./... -shuffle=on
```

Record the failure rate (e.g. "3/50 with shuffle on, 0/50 in isolation"). That ratio is your signal that the fix worked later.

> [!NOTE]
> If it fails only with randomized order but never alone, the bug is almost certainly **shared mutable state** leaking between tests — jump straight to that category in Step 3. If it fails in isolation too, the test owns its own nondeterminism (time, RNG, async).

## Step 2 — Capture the failing run's details

When you catch a red run, read the *whole* failure, not the summary line — and note what differs from the green runs.

- The assertion and its **expected vs. actual**, plus how actual varies between failures (off by milliseconds? different element order? a `null` that's sometimes set?).
- The first project frame in the stack — not framework internals.
- Whether the failure correlates with order (which test ran before it), wall-clock time (midnight, month boundary, DST), or machine load (only fails under `--test-threads`/parallel CI).

If the failure is rare, increase the loop count and add diagnostics inside the test temporarily (log the value, the timestamp, the seed) rather than guessing.

## Step 3 — Classify the source of nondeterminism

This is the decision that determines the fix. **State the category explicitly** with the evidence from Steps 1–2. Flakiness almost always falls into one of these:

- **Test-order / shared mutable state** — a module-level variable, singleton, cache, DB row, env var, or temp file mutated by one test and read by another. *Tell:* fails only with shuffle on, or only after a specific sibling.
- **Real time / `Date`** — assertions on `Date.now()`, `new Date()`, durations, `setTimeout`, or "expires in 1h" math that crosses a tick/second/day boundary. *Tell:* fails near boundaries, or expected/actual differ by a small time delta.
- **Unseeded randomness** — `Math.random()`, `uuid()`, `faker` without a fixed seed, `Set`/`Map` insertion order, hash ordering. *Tell:* actual value changes every run with no other input change.
- **Async races / missing awaits** — an un-awaited promise, a fire-and-forget effect, polling without synchronization, assertions running before state settles. *Tell:* fails under load/parallelism, passes when serialized or with an added (bad) sleep.
- **Network / external deps** — real HTTP, a live DB, a clock-skewed API, DNS. *Tell:* fails on timeout, on CI but not locally, or when offline.
- **Resource leaks** — unclosed servers/sockets/file handles, leaked timers, growing in-memory state across tests, port collisions. *Tell:* fails late in the run, or only after the Nth iteration.
- **Locale / timezone** — date formatting, number/currency parsing, string collation that assumes the dev's `LANG`/`TZ`. *Tell:* fails in CI with a different `TZ`/`LC_ALL`. Reproduce with `TZ=UTC LC_ALL=C npx vitest run ...`.

If two categories are plausible, fix the one your repro evidence most directly supports, then re-loop before assuming you're done.

## Step 4 — Fix the cause, not the symptom

Apply the smallest change that removes the nondeterminism. Match the fix to the category:

- **Shared state:** isolate it — reset the singleton/cache in `beforeEach`/`afterEach`, use a fresh fixture/transaction per test, stop relying on cross-test ordering. Make each test set up everything it needs.
- **Real time:** inject the clock. Use fake timers (`vi.useFakeTimers()` / `jest.useFakeTimers()`, `freezegun` in Python) or pass a `now()` function the test controls. Never assert against the live clock.
- **Unseeded RNG:** seed it or inject the random source (`faker.seed(1)`, a stubbed `Math.random`, a fixed UUID factory). For collection ordering, sort before asserting or assert set-membership, not index.
- **Async races:** `await` the actual promise; wait on the real condition (`waitFor`/`findBy`, a returned promise, an event) instead of a timer. Remove un-awaited side effects.
- **Network / external:** mock at the boundary (`msw`, `nock`, `responses`, a fake) so the test is hermetic. If it's a genuine integration test, gate it behind a tag and keep it out of the unit loop.
- **Leaks:** close what you open in teardown — servers, handles, timers; bind to an ephemeral port (`:0`) instead of a fixed one.
- **Locale/TZ:** pin `TZ` and locale in the test setup, or pass an explicit locale to the formatter under test.

> [!WARNING]
> Do **not** "fix" flakiness by wrapping the test in a retry loop, adding `sleep`/`setTimeout` to "give it time", widening a time tolerance, or quarantining/`.skip`-ing it. Those hide nondeterminism — the test still fails for real and the underlying race ships to production. A `sleep` that makes it pass is proof you found an async race; replace the sleep with a real await on the condition.

## Step 5 — Prove it's stable

Re-run the **same loop and randomization** that exposed the flake. The bar is no failures across a high iteration count with order and seed randomized:

```bash
for i in $(seq 1 100); do
  npx vitest run -t "applies the discount" --sequence.shuffle || { echo "STILL FLAKY on run $i"; break; }
done
```

Then run the full suite (also shuffled) to confirm your isolation/teardown change didn't break a test that was silently relying on the old shared state. Reproduce the original failing condition specifically (e.g. `TZ=UTC`, parallel threads) if that's what triggered it.

> [!NOTE]
> If it now passes 100/100 in the loop but CI still flakes, the source is environmental (parallelism level, CI `TZ`, slower disk) — reproduce under those exact conditions locally before declaring victory.

## Report

Summarize for the user, concisely:

- **Category:** which source of nondeterminism it was, and the one-line evidence (e.g. "shared module cache — failed 4/50 only with shuffle on").
- **Offending code:** the file and the exact line/pattern that was nondeterministic.
- **Fix:** what you changed and why it removes the cause (not masks it).
- **Proof:** the before/after loop result (e.g. "was 4/50 failing → now 100/100 green with shuffle + `TZ=UTC`").

Do not commit or push — leave the change staged for the user to review unless they explicitly ask you to commit.