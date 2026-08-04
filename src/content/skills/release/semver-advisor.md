---
name: "semver-advisor"
title: "SemVer Advisor"
description: "Decide the correct semantic-version bump — major, minor, or patch — by diffing a release range, mapping the changes onto the public API surface, and classifying each as breaking, additive, or a fix. Use before cutting a release when you are unsure whether changes are breaking, when a teammate proposes a bump you want to sanity-check, or when a behavior change has no signature change and you need to know if it is still breaking."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["devops-infra"]
related: ["skill:version-bumper", "skill:changelog-from-prs", "skill:migration-writer"]
featured: false
summary: "A bump is wrong when you call a breaking change a minor — and consumers find out at runtime. This skill diffs the release range against the actual public API surface (exports, CLI flags, config, routes, file formats), classifies every change as breaking / additive / fix, and recommends major/minor/patch with the specific changes that forced it."
---

The wrong call here is silent until a consumer's build breaks. "It compiled, ship a minor" is how breaking changes escape — a tightened validation rule, a changed default, or a removed export looks small in the diff but breaks every downstream caller. This skill makes the bump a defensible decision: it pins down what your *public API surface* actually is, diffs the release range against it, classifies each change, and applies the SemVer rules — including the pre-1.0 exception people forget.

## When to use this skill

- You are about to tag a release and are unsure whether the changes are breaking.
- Someone proposed `minor` or `patch` and you want to verify it against the real diff.
- You changed behavior without changing a signature and need to know if that is still breaking (it often is).
- You maintain a `0.x` library and keep forgetting that SemVer treats pre-1.0 differently.
- A CI/release gate failed on version mismatch and you need the correct bump with a rationale.

## Instructions

1. **Define the public API surface first — it is narrower or wider than you think.** Enumerate every contract a consumer can depend on, not just the language exports:
   - **Code exports**: the package entry points (`exports`/`main` in `package.json`, `__all__`, `pub`/`public` symbols). Anything reachable from the documented entry point is public; deep imports into internal paths usually are not (unless your docs/`exports` map expose them).
   - **CLI**: command names, flags, positional args, env vars they read, and exit codes.
   - **Config**: accepted keys, their types, defaults, and required-ness in config files / schema.
   - **Wire contracts**: HTTP routes, request/response shapes, status codes, GraphQL schema, event/message payloads.
   - **File formats**: on-disk formats you read or write, serialization versions, migration outputs.

   ```bash
   # entry points and public surface clues
   git show HEAD:package.json | grep -E '"(main|module|types|exports|bin)"' -A3
   grep -rEn '__all__|^export (default |const |function |class |\{)' src | head -50
   ```

2. **Diff the release range, scoped to the surface.** Use the last released tag as the lower bound; review only files that touch the surface from step 1.

   ```bash
   LAST_TAG=$(git describe --tags --abbrev=0)
   git diff "$LAST_TAG"..HEAD --stat
   git diff "$LAST_TAG"..HEAD -- <surface paths: src/index.*, cli/, openapi.*, *.schema.json>
   ```

3. **Classify each surface change into exactly one bucket.**
   - **Breaking** (forces major): removed or renamed export/flag/route/config key; changed function signature, required arg added, or narrowed/changed return type; changed *default behavior* a consumer relied on; stricter validation that rejects previously-valid input; changed error type/exit code/status code; removed config default; changed file-format output that old readers can't parse.
   - **Additive** (minor): new export, flag, optional config key with a safe default, new route, new optional response field — all 100% backward compatible.
   - **Fix** (patch): bug fix that restores documented behavior with no API change, internal refactor, perf, docs, deps that don't change the public contract.

4. **Apply the rule, then handle the pre-1.0 caveat.** Take the highest-severity bucket present: any breaking → **major**; else any additive → **minor**; else **patch**. Then check the current version:
   - **`>= 1.0.0`**: apply the rule directly.
   - **`0.y.z` (pre-1.0)**: SemVer special-cases this. A breaking change bumps the **minor** (`0.y` → `0.(y+1)`), and additive/fix changes bump the **patch**. State explicitly that you are using pre-1.0 semantics.

5. **Re-check every "no signature change" item before finalizing.** A change with an identical signature can still be breaking — search the diff for default-value changes, validation tightening, altered side effects, and changed return *values* (not just types). These are the ones that get mislabeled as patches.

6. **Output the recommendation with receipts.** Give the bump, the resulting version number, the one-line rule that decided it, and the itemized changes per bucket — with each breaking change named explicitly so a reviewer can challenge it.

> [!WARNING]
> A behavior change with an unchanged signature is still breaking. Tightening input validation, flipping a default (e.g. `cache: false` → `true`), changing rounding/sort order, or returning a different value for the same input all break consumers even though the API "didn't change." Grep the diff for changed literals and default arguments, not just modified declarations.

> [!CAUTION]
> Pre-1.0 SemVer is not "anything goes" but it is not the 1.0 rule either: breaking changes go in the **minor** slot (`0.4.x` → `0.5.0`), not the major. If you mechanically bump major for a `0.x` package you will jump to `1.0.0` and signal stability you didn't intend. Confirm the current version before recommending.

## Output

A bump recommendation, reproducible from the diff:

```markdown
## SemVer recommendation: MAJOR  (1.4.2 → 2.0.0)

Rule applied: contains ≥1 breaking change → major (current version ≥ 1.0.0).

### Breaking (forces major)
- Removed export `parseLegacy()` from package entry — consumers importing it will fail to resolve.
- `loadConfig()` now throws on unknown keys (was: ignored) — stricter validation rejects previously-valid config.
- Default of `--timeout` changed 0 (infinite) → 30000ms — changes runtime behavior for callers relying on the old default.

### Additive (would be minor on its own)
- New optional flag `--format json`.

### Fix (would be patch on its own)
- Fixed off-by-one in `splitRange()` matching documented behavior.

Note: if this were a 0.x package, the same set would be a MINOR bump (0.y → 0.(y+1)).
```