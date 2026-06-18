---
name: "type-coverage-improver"
description: "Raise TypeScript type strictness incrementally — measure the any/implicit-any baseline, enable one strict sub-flag at a time, and fix the fallout per flag instead of all at once, keeping the typecheck green at every step. Use when a codebase is loosely typed, when you want strict mode on without a big-bang break, or when `any` keeps hiding bugs that surface in production."
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Type Coverage Improver"
topics: ["coding-languages"]
related: ["dead-code-finder", "extract-module", "trace-data-flow"]
featured: false
summary: "Flipping `strict: true` on a loose codebase floods you with hundreds of errors at once and tempts blanket `any`-casts that defeat the point. This skill makes the climb incremental: count the explicit/implicit `any` baseline, enable strict sub-flags one at a time (highest-traffic files first), and fix the fallout flag-by-flag while the typecheck stays green throughout."
---

Turn on TypeScript strictness without a big-bang break. The skill measures where you stand (explicit `any`, implicit `any`, which strict flags are already on), then enables the strict family **one sub-flag at a time** — `noImplicitAny`, `strictNullChecks`, and the rest — fixing the fallout from each flag before touching the next. Every step ends with `tsc --noEmit` passing, so you ratchet coverage up monotonically instead of staring at 600 errors and rage-casting them away.

## When to use this skill

- The codebase runs with `strict: false` (or a partial strict config) and is littered with `any`, implicit `any` parameters, and unchecked nullables.
- You want to reach `strict: true` but a single flip produces an unfixable wall of errors and a stalled PR.
- `any` is masking real defects — `undefined is not a function`, missing-property crashes — that strict typing would have caught at compile time.

> [!WARNING]
> Do not "fix" strict errors with `any`-casts, `as` assertions, `@ts-ignore`, or `@ts-expect-error`. Those silence the exact diagnostic strict mode exists to surface — you ship the bug *and* the suppression. The only acceptable fixes are: a precise type, a real null/undefined narrow, or (rarely) a documented `// @ts-expect-error` with a linked issue when the fix is genuinely a separate change. A PR whose net effect is "more suppressions" is negative progress.

## Instructions

1. **Measure the baseline before changing anything.** Read `tsconfig.json` and record which strict sub-flags are already set (`strict` implies `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `useUnknownInCatchVariables`, `alwaysStrict`). Then quantify the `any` surface:

   ```bash
   # explicit `any` annotations
   grep -rIn -E ':\s*any\b|\bas any\b|<any>|Array<any>|any\[\]' --include='*.ts' --include='*.tsx' src | wc -l
   # existing suppressions (these are debt you must not add to)
   grep -rIn -E '@ts-ignore|@ts-expect-error' --include='*.ts' --include='*.tsx' src | wc -l
   # implicit any + the full error count under the strictest config (dry run, no edits)
   npx tsc --noEmit --strict --noErrorTruncation 2>&1 | grep -c 'error TS'
   ```

   If `type-coverage` is available, `npx type-coverage --detail` gives a single percentage and a per-identifier list — capture the starting number; it is your headline metric.

2. **Order the work by risk and traffic, not alphabetically.** Use `git log --format= --name-only --since='6 months ago' | sort | uniq -c | sort -rn` to find churned files, and grep for the modules with the most `any` and the most importers (entry points, shared utils, API/DB boundaries). Fix these first: a precise type on a widely-imported util propagates correctness everywhere; an `any` at a data boundary (HTTP response, DB row, JSON parse) is where wrong-shape bugs originate.

3. **Enable exactly one sub-flag at a time.** Add a single flag to `tsconfig.json` (`"noImplicitAny": true`), run `npx tsc --noEmit`, and fix only the errors that flag produces. Recommended order, easiest-to-hardest:
   - `noImplicitAny` — annotate parameters/returns the compiler couldn't infer.
   - `strictNullChecks` — the big one; surfaces every place `null`/`undefined` was silently allowed.
   - `strictFunctionTypes`, `strictBindCallApply`, `noImplicitThis` — usually small fallout.
   - `strictPropertyInitialization` — class fields; often the last and noisiest.
   Once each flag is green individually, the final flip to `"strict": true` is a no-op verification.

4. **Replace `any` with the real type, narrow at the boundary.** For explicit `any`: infer the actual shape from how the value is used and from the producer, and write the `interface`/`type`. For external/untyped data (`JSON.parse`, `fetch().json()`, env vars, dynamic imports), type the boundary as `unknown` and narrow with a type guard or a schema parse (e.g. `zod`'s `.parse()`) — `unknown` forces a check; `any` skips it. Add explicit return types to exported functions so inference errors surface at the definition, not three call sites away.

5. **Keep the typecheck green at every commit.** After each flag's fallout is fixed, run the project's real check (`npm run typecheck` / `tsc --noEmit`) and the test suite, then commit that flag as its own commit. Never enable the next flag on a red tree — you lose the ability to attribute a new error to a specific flag, and the diff becomes unreviewable.

6. **Re-measure and report the delta.** Re-run the baseline commands from step 1. Report the before/after `any` count, the `type-coverage` percentage delta, which flags are now on, and any honest residue: spots that genuinely need `unknown` + a follow-up, third-party `@types` gaps, or generated code excluded via `tsconfig` `exclude` rather than suppressed inline.

> [!NOTE]
> Don't refactor logic while fixing types. A type-only PR should change annotations, guards, and config — not behavior. If a strict error reveals a real bug (a nullable that was actually being dereferenced), fix it in a **separate** commit with a test, so reviewers can tell "added a type" apart from "changed runtime behavior."

## Output

1. **Baseline metrics** — current `tsconfig` strict flags, explicit-`any` count, suppression count, total error count under `--strict`, and `type-coverage` percentage if available.
2. **An ordered flag-by-flag plan** — the sub-flags to enable in sequence, each with its estimated fallout count and the highest-priority files to fix first, e.g.:

   | Step | Flag | Errors introduced | Fix-first files |
   |------|------|-------------------|-----------------|
   | 1 | `noImplicitAny` | 38 | `src/lib/api/client.ts`, `src/utils/parse.ts` |
   | 2 | `strictNullChecks` | 142 | `src/db/repository.ts`, `src/lib/session.ts` |
   | 3 | `strictPropertyInitialization` | 21 | `src/services/*.ts` |

3. **Concrete type changes for the first file** — the actual diff: `any` → named types, added return annotations, and `unknown`-at-the-boundary guards, with `tsc --noEmit` shown passing afterward. For example:

   ```diff
   - export function parseUser(raw: any) {
   -   return { id: raw.id, name: raw.name };
   - }
   + interface User { id: string; name: string }
   + export function parseUser(raw: unknown): User {
   +   if (typeof raw !== "object" || raw === null) throw new Error("invalid user");
   +   const r = raw as Record<string, unknown>;
   +   if (typeof r.id !== "string" || typeof r.name !== "string") throw new Error("invalid user");
   +   return { id: r.id, name: r.name };
   + }
   ```

   ```bash
   $ npx tsc --noEmit
   $   # exit 0 — clean
   ```
