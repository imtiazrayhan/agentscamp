---
name: "property-test-designer"
description: "Design property-based tests — generate hundreds of random inputs and assert invariants that must hold for ALL of them — to surface the edge cases hand-picked examples never reach. Use when code has a large input space (parsers, serializers, encoders, math, data transforms), when a bug keeps slipping through despite green example tests, or when you can't enumerate every case worth checking."
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Property Test Designer"
topics: ["review-qa"]
related: ["coverage-gap-finder", "test-scaffolder", "mock-data-factory"]
featured: false
summary: "Example-based tests only check the cases you thought of. This skill finds the invariants that must hold for every valid input — round-trip, idempotence, oracle, metamorphic — defines generators that hit the nasty regions, writes the test in the language's framework, and pins each shrunk counterexample as a permanent regression case."
---

Example-based tests only check the inputs you thought to write down. This skill designs property-based tests instead: it identifies the invariants that must hold for *every* valid input, defines generators that produce hundreds of them — including the corners you'd never type by hand — and lets the framework shrink any failure to its minimal reproducing input. The deliverable is the chosen properties, the generators, a runnable test in your language's framework, and a plan to pin every counterexample as a fixed regression case.

## When to use this skill

- The input space is large or recursive — parsers, serializers, encoders/decoders, numeric code, date/time logic, data transforms, state machines — and enumerating cases by hand is hopeless.
- A bug keeps escaping a green example suite because it lives in a corner nobody wrote a test for (empty input, unicode, overflow, a specific interleaving).
- You have a clear correctness relation — a round-trip, an inverse, a slower reference implementation — but no single "expected output" to assert against.
- You're hardening a critical pure function and want adversarial coverage, not three happy-path examples.

## Instructions

1. **Pick properties that hold for ALL valid inputs — not examples.** Stop choosing inputs; choose relations. The classics, in rough order of power:
   - **Round-trip / inverse:** `decode(encode(x)) == x`, `parse(render(x)) == x`, `decompress(compress(x)) == x`. The highest-value property for any serializer or codec.
   - **Invariant:** a property of the output regardless of input — `sort(xs)` is ordered *and* a permutation of `xs`; a balanced-tree insert keeps the balance condition; a parser never returns a node spanning past EOF.
   - **Idempotence:** `f(f(x)) == f(x)` — for normalizers, dedupers, sanitizers, `canonicalize`.
   - **Oracle / model:** the function must agree with a simpler, slower, or trusted reference (a brute-force version, the previous release, the stdlib) on every input.
   - **Metamorphic:** when there's no oracle, relate two runs — `sort(xs) == sort(shuffle(xs))`; `search(q)` ⊆ `search(broaden(q))`; `len(filter(p, xs)) <= len(xs)`.
2. **Define generators that cover the real domain.** A property is only as good as its inputs. For each property, build a generator that reaches the nasty regions on purpose: empty/single-element collections, `0`/`-0`/negatives/`MAX_INT`/`MIN_INT`, NaN and infinities, empty strings, unicode and surrogate pairs, embedded delimiters and escape chars, huge inputs, deeply nested structures, and duplicates. Compose existing generators (`lists(integers())`, `dictionaries(...)`) rather than rolling raw randomness.
3. **Constrain generators to valid inputs.** If the property only holds for, say, sorted lists or well-formed dates, *generate them in that shape* — `map`/`build` from raw primitives — instead of generating garbage and filtering it. Filtering (`assume`/`.filter`) discards rejected inputs and silently shrinks your effective sample size.
4. **Pick the framework for the language.** Python → **Hypothesis** (`@given`, `st.*` strategies). JS/TS → **fast-check** (`fc.assert(fc.property(...))`). Haskell → **QuickCheck**; Scala → **ScalaCheck**; JVM/Java → **jqwik**; Rust → **proptest**/`quickcheck`; Go → built-in `testing/quick` or `rapid`. Match what's already in the project before adding a dep.
5. **Lean on shrinking and pin the counterexample.** When a property fails, the framework shrinks the random input to a *minimal* failing case (e.g. `[0, 0]`, not a 400-element list). Read that minimal input — it usually names the bug. Then add it as an explicit example so it's checked every run regardless of the random seed: Hypothesis `@example(...)`, fast-check `fc.assert(prop, { examples: [[...]] })`, or just a plain unit test asserting the fixed input.
6. **Budget run counts for CI.** Defaults (Hypothesis 100, fast-check 100) are fine locally; for cheap pure functions raise to 1000+ in a nightly job, but keep PR runs bounded so the suite stays fast. Set an explicit seed in CI config notes so a flake is reproducible, and disable Hypothesis's `deadline` for inputs whose runtime legitimately scales with size.

> [!WARNING]
> A property that reimplements the function under test proves nothing. If your "oracle" shares the buggy logic (or you assert `encode(x) == encode(x)`), the test is green and worthless. The relation must be *independent* of the implementation — an inverse, a brute-force model, or a structural invariant the code never computes directly.

> [!NOTE]
> An unconstrained generator wastes the run budget rejecting invalid inputs and can starve the interesting region. If a heavy `assume()`/`.filter()` throws away most candidates, the framework will warn (Hypothesis raises `FailedHealthCheck`) — rebuild the generator to *construct* valid inputs instead of filtering for them.

## Output

For each property, the skill produces:

- **The property and the relation it encodes** (round-trip / invariant / idempotence / oracle / metamorphic), stated as a one-line claim about all valid inputs.
- **The generator(s)**, written in the project's framework, with the edge regions they deliberately reach.
- **A runnable test** in that framework.
- **The regression plan** — where each shrunk counterexample gets pinned as a fixed example so it's checked deterministically forever.

Example — a round-trip property for a CSV codec, in Hypothesis:

```python
from hypothesis import given, strategies as st, example

# Generate well-formed rows directly (no filtering): each cell is arbitrary
# text incl. commas, quotes, newlines, unicode — exactly the chars that break parsers.
rows = st.lists(st.lists(st.text(), min_size=1), min_size=1)

@given(rows)
@example([["a,b", '"q"', "line\nbreak"]])  # pinned: a past failure, checked every run
def test_csv_roundtrip(data):
    # Property: parsing what we wrote back yields the original (inverse).
    # parse_csv is INDEPENDENT of write_csv — not a reimplementation of it.
    assert parse_csv(write_csv(data)) == data
```

A failure here shrinks to the minimal breaking cell — typically `[["\n"]]` or `[['"']]` — which you read, fix, and then pin via a second `@example(...)`. Hand the proposed properties to `test-scaffolder` to flesh out, and use `coverage-gap-finder` to confirm the generated inputs now reach the previously-cold branches.