---
name: "mutation-test-runner"
title: "Mutation Test Runner"
description: "Measure whether a test suite actually catches bugs by running mutation testing — introduce small faults into the code and check which ones a test kills versus which slip through silently. Use when line coverage is high but bugs still ship, when you suspect tests assert weakly, or to find the exact assertions a suite is missing."
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["review-qa"]
related: ["coverage-gap-finder", "property-test-designer", "contract-test-designer"]
featured: false
summary: "Coverage proves a line ran, not that a test would notice if it broke. This skill runs mutation testing — Stryker, mutmut, PIT — to plant small faults and see which the suite kills, reads each surviving mutant as a missing assertion, and outputs the precise tests to add, scoped to the diff so it actually finishes."
faq:
  - q: "How is this different from line coverage?"
    a: "Coverage records that a line executed during a test. Mutation testing changes that line and checks whether any test fails — proving the test asserts on the behavior, not just touches it. 100% coverage with surviving mutants is exactly the false confidence this catches."
  - q: "Why not just run it across the whole repo?"
    a: "Mutation testing re-runs the suite once per mutant, so a full repo can take hours and quietly never get run. Scope every run to the changed files or one package; that keeps it fast enough to live in the loop."
---

Line coverage tells you a line ran during a test. It does not tell you the test would fail if that line were wrong — a function can be 100% covered by an assertion-free test. Mutation testing closes that gap: it plants small faults in the code (flip `>` to `>=`, swap `+` for `-`, drop a statement, negate a condition) and re-runs the suite against each one. A mutant that makes a test fail is **killed** — the suite pins that behavior. A mutant that passes everything **survives** — no test noticed the code changed, so that behavior is unprotected. This skill runs a mutation tool, reads the survivors as a precise to-do list of missing assertions, and tells you exactly which tests to add to kill them.

## When to use this skill

- Coverage is high (80–100%) but bugs still slip into production — the classic symptom of covered-but-unasserted code.
- You inherited or reviewed a suite and suspect the tests assert weakly (snapshot-only, no return-value checks, `toBeDefined` instead of `toEqual`).
- A module is critical (auth, money, parsing, pricing) and you want proof the suite would catch a regression, not just that it touches the lines.
- You're hardening a specific change and want the missing assertions for *that diff*, not a repo-wide audit.

> [!WARNING]
> 100% line coverage with surviving mutants is the false confidence this skill exists to expose: the code runs in a test, but no assertion would fail if the code were wrong. A green coverage badge is not a green mutation score.

## Instructions

1. **Pick the tool for the language — don't guess, check what's installed.** Inspect deps and config first:
   - JS/TS: **Stryker** (`@stryker-mutator/core`, config `stryker.conf.json`/`.mjs`); it auto-detects Jest/Vitest/Mocha runners.
   - Python: **mutmut** (`mutmut run`, config in `setup.cfg`/`pyproject.toml`) or **cosmic-ray** for larger suites.
   - Java/Kotlin: **PIT** (`pitest`, Maven/Gradle plugin). Go: **go-mutesting** or **gremlins**. Ruby: **mutant**. C#: **Stryker.NET**.
   - If no tool is installed, recommend the standard one for the stack and stop there — do not silently add a dev dependency.
2. **Scope the run to changed code — this is mandatory, not an optimization.** Mutation testing re-runs the full suite once per mutant, so a repo can take hours. Target the diff or a single package: Stryker `--mutate "src/pricing/**/*.ts"` (or `--since main` on recent versions), mutmut `--paths-to-mutate src/billing/`, PIT `targetClasses` set to the changed package. State the chosen paths up front so the run is reproducible.
3. **Run and collect the surviving mutants, not the summary number.** Execute the tool and read its detailed report (Stryker's `mutation.html`/`--reporter json`, mutmut `mutmut results` + `mutmut show <id>`, PIT's `mutations.xml`). For each survivor capture: file, line, the original code, and the exact mutation that lived (e.g. `boundary: changed >= to >` or `removed call to logAudit()`).
4. **Triage each survivor: real gap or equivalent mutant.** An **equivalent mutant** changes the code without changing observable behavior — e.g. `i <= n-1` vs `i < n`, reordering commutative operations, mutating a value that's overwritten before use. These *cannot* be killed by any test; mark them `equivalent — ignore` with a one-line reason and move on. Everything else is a genuine gap: a behavior your tests don't constrain.
5. **For each real survivor, name the assertion that would kill it.** This is the payoff. A survived `changed > to >=` on a discount threshold means no test exercises the exact boundary — propose "`applyDiscount(qty=10)` where the rule is `qty > 10`: assert no discount at exactly 10." A survived `removed call to audit()` means nothing asserts the side effect — propose "assert `auditLog` received one entry after `transfer()`." Write the input and the expected behavior, not "add a test for line 42."
6. **Group survivors by file and track the score where it's worth defending.** Report the mutation score (killed / total non-equivalent) per scoped path as a *baseline to hold or raise on critical modules*, never as a vanity 100% target — chasing the last few percent usually means fighting equivalent mutants. Record the baseline so the next run can detect regressions.

> [!NOTE]
> Two survivors that share a root cause often need one assertion. A function where every arithmetic and boundary mutant survives usually has a single test that calls it and asserts only that it didn't throw — adding one real return-value assertion can kill the whole cluster at once.

> [!WARNING]
> If a mutation run "passes" with zero survivors but also shows mutants marked **no coverage** or **timeout**, the suite isn't strong — those mutants were never actually tested. No-coverage mutants are a coverage gap (hand them to `coverage-gap-finder`); timeouts often mean a mutant created an infinite loop the suite can't detect. Don't read them as kills.

## Output

A survivor report grouped by file, plus the run scoping so it's reproducible:

```
Scope: src/billing/**  (mutated 47 mutants, 90s)
Mutation score: 81%  (34 killed / 42 non-equivalent) — baseline, hold >=80 on billing

src/billing/discount.ts
  SURVIVED  L23  changed `qty > 10` -> `qty >= 10`   [BOUNDARY]
    Gap: no test hits the exact threshold.
    Add: applyDiscount({ qty: 10 }) -> assert price unchanged (no discount at boundary)
  SURVIVED  L31  removed call to `roundCents(total)`  [STATEMENT]
    Gap: nothing asserts the rounded result.
    Add: applyDiscount({ qty: 12, price: 3.337 }) -> assert total === 33.37 (not 33.3696)

src/billing/invoice.ts
  SURVIVED  L58  changed `&&` -> `||` in isOverdue guard  [LOGICAL]
    Gap: only the both-true case is tested.
    Add: isOverdue({ pastDue: true, paid: true }) -> assert false
  EQUIVALENT L72  `i <= len-1` -> `i < len`  — ignore (same iteration count)

No-coverage: 5 mutants in src/billing/legacy.ts -> route to coverage-gap-finder (not killed).
```

Each surviving line is a missing assertion; the `Add:` lines are concrete enough to hand straight to a test scaffolder. Re-run the same scope after adding them to confirm the survivors flip to killed and the score holds.
