---
name: "feature-flag-retirer"
title: "Feature Flag Retirer"
description: "Retire stale feature flags by confirming each flag's decided final state, then collapsing every conditional to the winning branch and deleting the loser plus the now-dead code it reached. Use when temporary flags have outlived their rollout, when flag conditionals clutter the code, or during a flag-debt cleanup."
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["coding-languages"]
related: ["dead-code-finder", "extract-module", "strangler-fig-migrator"]
featured: false
summary: "Temporary flags rarely get removed; they accrete into branching debt. This skill retires them safely: confirm each flag's decided state (fully-on vs abandoned), grep exhaustively for every reference, collapse each conditional to the winning branch, delete the loser and the code only it reached — one flag at a time, tests green after each."
---

Feature flags are born temporary and die permanent. Once a flag is fully rolled out or quietly abandoned, the `if (flag)` it guards is just branching debt — two code paths where one is now unreachable. This skill retires a flag for real: it pins down which branch actually won, finds *every* reference (not just the obvious helper call), collapses each conditional to the winner, and deletes the loser along with any code only the dead branch reached — one flag at a time, with tests green after each.

## When to use this skill

- A flag meant to last a sprint has been at 100% (or 0%) for months and still litters the code with conditionals.
- Flag checks have multiplied — nested `if (flagA && !flagB)` paths nobody can reason about — and you want to pay down the debt.
- You're running a flag-debt cleanup and need each removal to be independently reviewable and revertible.

> [!WARNING]
> Verify the flag's *decided* final state before you collapse anything. "Currently 100%" is not "permanently on" — a flag mid-rollout, a kill-switch, or an experiment still gathering data must NOT be retired. Deleting the live branch ships or kills a feature: that's a production incident, not a cleanup. Confirm from the flag system/config AND a human owner that the decision is final, and which branch won.

## Instructions

1. **Pin down the decided final state — not the current value.** For the flag, answer one question: is it *permanently on* (fully rolled out, winner = enabled branch) or *abandoned* (will never ship, winner = disabled branch)? Read the flag config/dashboard, then confirm with the owner. Reject the flag from this pass if it's still rolling out, A/B testing, a kill-switch kept for emergencies, or used per-tenant/per-environment with different values — those are live, not stale.
2. **Find every reference — grep the flag KEY, not just the helper.** A flag leaks far past its `if`. Search the whole repo for the literal flag key string and its identifier:
   - the helper calls: `isEnabled("new_checkout")`, `flags.newCheckout`, `useFlag(...)`, `treatment(...)`;
   - the flag *definition/registration* (the declarations file, defaults, env vars, IaC/config);
   - tests, fixtures, and mocks that force the flag on or off;
   - analytics/telemetry events fired only when on, and feature-gated schema/migrations/routes;
   - string usages: config keys, JSON, YAML, query params, log lines, docs.
   Grep both the key (`"new_checkout"`) and the symbol (`newCheckout`) — different layers spell it differently.
3. **Collapse each conditional to the winning branch.** For every reference, rewrite the conditional to keep only the winner: fully-on → keep the `if` body, drop the `else`/fallback; abandoned → keep the `else`, delete the guarded body. Remove the now-constant condition entirely — no `if (true)`, no dead `else`. Flatten the indentation you just freed.
4. **Delete the code only the dead branch reached.** A removed branch usually calls helpers, imports, components, or fires events that nothing else uses. Trace each symbol the loser referenced; if its only caller was the branch you just deleted, remove it too (and repeat transitively). This is where flag retirement leaves dangling dead code if you stop at the `if`.
5. **Remove the flag's definition and its tests.** Delete the flag declaration/registration, its default value and env/config entries, and the tests/fixtures that existed solely to toggle it. Tests that asserted the *winning* behavior stay — but drop their flag-setup boilerplate so they test the now-unconditional path.
6. **One flag at a time, tests green after each.** Never retire two flags in one pass. After each flag: run the build and test suite, confirm green, and keep it as a single commit. A revert then removes exactly one flag's worth of change with no collateral.

> [!WARNING]
> A flag almost always guards MORE than the obvious if-block — feature-gated helper functions, config defaults, DB columns or migrations, route registrations, and analytics events reachable only when on. Grep exhaustively (step 2) before deleting: stop at the `if` and you leave dangling dead code; over-trust a single grep and you delete a path the *winning* branch still uses. When in doubt whether a symbol is shared, keep it and flag it for review.

## Output

For each retired flag, a record an owner can rubber-stamp:

- **Confirmed final state** — `permanently-on` or `abandoned`, with the source (flag dashboard value + owner sign-off) and the resulting winning branch.
- **Reference inventory** — every match for the key and symbol, grouped by layer: conditionals, definition/config, tests/fixtures, analytics, schema/routes, docs/strings.
- **Collapse plan** — per conditional: which branch wins, the resulting diff, and the list of now-dead symbols deleted because only the loser reached them.
- **Verification** — confirmation the build and test suite pass after the removal, and that the change is a single self-contained commit. Anything ambiguous (shared symbol, public-API surface, flag still live elsewhere) is listed as a manual-review item rather than deleted.