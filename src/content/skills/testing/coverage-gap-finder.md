---
name: "coverage-gap-finder"
description: "Run the project's coverage tool and identify the highest-value untested paths — error branches, edge cases, and critical modules — then propose specific test cases for each gap. Use when you have a coverage report but don't know where new tests will pay off most."
date: 2026-06-03
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["review-qa"]
related: ["test-scaffolder", "test-engineer"]
featured: false
summary: "A skill that runs the project's existing coverage tool and turns the report into a ranked plan: it parses per-line and per-branch data, weights gaps by risk — uncovered error handlers, unguarded edge cases, critical modules — names the exact untested branch, and proposes concrete test cases for each, prioritizing risk reduction over a 100% badge."
---

Turn a raw coverage report into a ranked, actionable plan. This skill runs the project's existing coverage tool, reads the per-line and per-branch data, and surfaces the gaps that actually matter — uncovered error handlers, unguarded edge cases, and critical modules with thin coverage — rather than nudging an arbitrary percentage upward. For each gap it proposes concrete, named test cases you can hand straight to a scaffolder. The goal is risk reduction per test written, not a green 100% badge.

## When to use this skill

- You have (or can generate) a coverage report but don't know which untested lines are worth testing first.
- A module is business-critical and you want to confirm its error paths and edge cases are exercised.
- You're triaging tech debt and need a prioritized list of test gaps instead of a wall of red lines.

> [!NOTE]
> Line coverage measures *executed* lines, not *correct* behavior. A function can be 100% covered by a test that asserts nothing. Treat coverage as a map of blind spots, not a quality score — prioritize gaps by blast radius, then verify the new tests actually assert something.

## Instructions

1. **Detect the test stack and coverage tool.** Do not guess — inspect the project:
   - JS/TS: `package.json` for `vitest --coverage` / `jest --coverage` (look for `coverage` scripts or a `c8`/`nyc`/`@vitest/coverage-v8` dep).
   - Python: `pytest --cov` (`pytest-cov`), `coverage run`, config in `pyproject.toml`/`.coveragerc`.
   - Go: `go test -coverprofile`. Java: JaCoCo. Match whatever already runs in CI.
2. **Generate machine-readable coverage.** Run the tool to emit a structured report — `--coverage --coverage.reporter=json` (Vitest), `--cov --cov-report=json` (pytest), or `-coverprofile=cover.out` (Go). Parse the JSON/profile, not the pretty terminal table; you need per-file branch and line data. (For Vitest, `--coverage.reporter=json` writes `coverage/coverage-final.json` with per-file branch and line data; the unrelated `--reporter=json` is a *test-result* reporter — pass/fail/timing — and won't produce coverage.)
3. **Rank gaps by value, not size.** For every uncovered region, weight it by signals — uncovered `catch`/`except`/error returns, `if`/`switch` branches with no covered alternative, input validation, and modules central to the app (auth, payments, parsing, persistence). Down-rank generated code, trivial getters, and config glue. A 60%-covered payment module outranks a 40%-covered logging helper.
4. **Locate the exact untested paths.** For each top gap, read the source and name the specific uncovered branch (file, function, line range) and *why* it's untested — e.g. "the `429` retry branch is never hit because no test injects a rate-limit response."
5. **Propose concrete test cases.** For each gap, write one bullet per missing case stating the input/condition and the expected behavior — not "add tests for error handling," but "call `withRetry` with a stubbed client that throws `RateLimitError` twice then succeeds; assert it retries and returns the value." Hand these to `test-scaffolder` to generate.
6. **Verify the baseline and report.** Re-run coverage to confirm the numbers you're quoting are current, then output a prioritized gap list (highest value first) with file, current coverage, the risk, and the proposed cases. Flag any module you couldn't analyze (e.g. excluded from the report, untestable without a fixture).

> [!WARNING]
> Never chase 100%. Forcing coverage on glue code, framework boilerplate, or unreachable defensive branches produces brittle tests that assert nothing and slow the suite. Stop when the remaining gaps are low-risk — and say so explicitly in the report.

## Examples

Running coverage on a Vitest project and triaging the JSON report:

```bash
npx vitest run --coverage --coverage.reporter=json
# reads coverage/coverage-final.json
```

Output — a prioritized gap list, not a flat percentage:

```
Coverage: 78% lines / 64% branches (412/640 branches)

HIGH VALUE
1. src/payments/charge.ts — 71% lines, 50% branches
   Risk: the declined-card and idempotency-key-reuse branches are never exercised.
   Propose:
   - charge() with a gateway stub returning `card_declined` → asserts no DB write, throws PaymentError
   - charge() called twice with the same idempotency key → asserts the second call returns the first result, no double charge

2. src/auth/verifyToken.ts — 83% lines, 60% branches
   Risk: expired-token and malformed-signature paths uncovered.
   Propose:
   - verifyToken() with a token whose `exp` is in the past → asserts throws TokenExpiredError
   - verifyToken() with a tampered signature → asserts throws InvalidSignatureError

MEDIUM VALUE
3. src/parse/csv.ts — 88% lines
   Risk: quoted-field-with-embedded-comma branch untested.
   Propose:
   - parseCsv('"a,b",c') → asserts two fields ["a,b", "c"]

SKIP (low value)
- src/logger.ts (45%) — thin wrapper over console; defensive branches only.
- src/generated/*.ts — codegen output, exclude from coverage instead.
```

Hand the HIGH and MEDIUM cases to `test-scaffolder`, then re-run coverage to confirm the branches now flip green.
