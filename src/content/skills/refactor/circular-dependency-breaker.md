---
name: "circular-dependency-breaker"
description: "Detect and break a circular import — map the exact cycle with a real tool, then break the right edge by extracting the shared piece into a leaf module, inverting a layering dependency, merging two falsely-split modules, or (last resort) deferring an import. Use when you hit an import cycle error, an undefined-on-import or 'cannot access before initialization' bug, or a bundler/linter flags a cycle."
title: "Circular Dependency Breaker"
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["coding-languages"]
related: ["extract-module", "dead-code-finder", "type-coverage-improver"]
featured: false
summary: "Cycles cause order-dependent, partially-initialized-module bugs that look random — and the import graph, not the stack trace, is where the real bug lives. This skill maps the exact cycle with a tool, then breaks the right edge: extract the shared piece into a leaf, invert the dependency, merge falsely-split modules, or defer an import — and proves the cycle is gone."
---

A circular import is two or more modules that need each other to finish loading before either can finish loading — so one of them gets a half-built version of the other, and you get an `undefined` export, a `cannot access X before initialization`, or a bundler warning that surfaces "randomly" depending on which file ran first. This skill refuses to guess: it maps the exact cycle with a real dependency tool, identifies *which edge* is the wrong one, breaks it with the technique that matches the cause, and re-runs the tool to prove the cycle is gone.

## When to use this skill

- An import throws `cannot access '<x>' before initialization`, `ReferenceError`, or an export reads as `undefined` even though it is clearly exported.
- A bundler (webpack/Vite/Rollup/esbuild), a linter (`import/no-cycle`), `madge --circular`, `import-linter`, or `go vet` flags a circular dependency.
- A value works in one entry order and breaks in another — tests pass alone but fail in a suite, or prod breaks while dev works, because module load order differs.
- You are about to "fix" a crash by moving an import inside a function and want to know whether that hides the real problem (it does).

## Instructions

1. **Map the cycle with a tool before changing one line.** Do not infer the cycle from the stack trace — the trace shows where it *crashed*, not which edge to cut. Run the right tool for the stack: JS/TS `npx madge --circular --extensions ts,tsx src` or `npx dpdm --circular src/index.ts`; Python `import-linter` (with a `[importlinter]` contract) or `pydeps --show-cycles pkg`; Go `go list -deps` / `go mod graph`; or read the bundler's own circular-dependency warning. Capture the full ordered chain, e.g. `auth → user → session → auth`, so you are fixing a real edge.
2. **Find the one edge that is wrong.** A cycle has N edges but usually one of them is the design mistake — a lower-level module reaching back up to a higher-level one, or two leaf-ish modules each grabbing one symbol from the other. With `Grep`, list *exactly which symbols* each module imports from the next in the chain. The edge to break is the one importing the fewest, most-extractable symbols — often a single shared type, constant, or helper.
3. **Prefer extracting the shared thing into a leaf module — this is the cleanest fix and the most common cause.** If A and B both need a type, constant, or pure helper that currently lives in one of them, move that symbol into a new dependency-free module (`types.ts`, `constants.ts`, `shared/`) that both A and B import *from*, and which imports from neither. The cycle dissolves because the contested symbol no longer lives on the cycle. Update every importer with `Edit`.
4. **Invert the dependency when there is a true layering violation.** If a lower-level module imports a higher-level one only to call back into it (e.g. a storage layer importing a service to notify it), apply dependency inversion: define the interface/type at the *lower* module (it owns the contract), and have the caller inject the concrete implementation as an argument or via a registration call. The lower module now depends on nothing above it; the arrow points one way.
5. **Merge the two modules if they are genuinely one unit.** If A and B call deep into each other through many symbols and neither has a coherent identity without the other, they were split artificially. Combine them into one module and re-export from the old paths as a barrel so external callers stay green. A cycle between two files that are really one concept is a packaging bug, not a dependency to invert.
6. **Defer the import only as a last resort — and say so out loud.** Moving `import` inside the function that uses it (lazy/local import, `require()` at call time, or a TYPE_CHECKING-only import in Python) makes the crash stop because the import now runs after both modules finished loading. It does not remove the cycle — `madge` will still report it. Use it only when the real fixes are blocked (e.g. a third-party constraint), and flag it explicitly as deferring a known design smell.
7. **Re-run the same tool and check import-time side effects.** Re-run the step-1 command and confirm the cycle no longer appears in its output — that is your proof, not "the crash went away." Then verify nothing relied on import-time side effects whose order you just changed: a module that registered a handler, populated a singleton, or ran top-level code now runs in a new order. Search for top-level statements (not inside a function/class) in the moved code and confirm they still fire when expected.

> [!WARNING]
> A lazy/deferred import "fixes" the crash but leaves the architectural cycle fully in place — the next person hits the same partially-initialized-module bug from a different entry point. Treat it as a tourniquet, not a cure. Always reach for extracting the shared dependency (step 3) or inverting the layer (step 4) first; only defer when those are genuinely blocked, and label it as a deferral.

> [!NOTE]
> The bug is in the import graph, not the stack trace. `cannot access X before initialization` points at the line that *read* the half-built module, which is rarely where the cycle should be cut. Map the graph first (step 1) — the right edge to break is almost never the one the error names.

## Output

1. **The dependency cycle diagram** — the exact ordered chain from the tool, annotated with the symbols crossing each edge:

   ```
   auth.ts ──(needs SessionToken)──▶ session.ts
      ▲                                   │
      └──────(needs currentUser)──────────┘
   Cycle: auth → session → auth   (madge --circular)
   ```

2. **The chosen break technique with rationale** — e.g. "Extract `SessionToken` (a type, the only symbol `session` takes from `auth`) into `auth/types.ts` leaf; both import from it. Chosen over deferral because the cycle is a misplaced shared type, not a real layering need."

3. **The concrete import/module changes** — the new/edited files and every `import` line that moved, as applied edits (new leaf module created, contested symbol relocated, importers re-pointed).

4. **Proof the cycle is gone** — the re-run of the step-1 command showing no cycle, e.g. `madge --circular src` → `✔ No circular dependency found!`, plus a one-line confirmation that any import-time side effects in the moved code still execute in the right order.
