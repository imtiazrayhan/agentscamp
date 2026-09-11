---
title: "10 Best Claude Skills for Refactoring"
description: "Compare Claude skills and commands for clean-code passes, renames, module splits, dead code, upgrades, import cycles, flags, strict types, and migrations."
author: "Imtiaz Rayhan"
date: "2026-09-11"
color: "green"
topics: ["coding-languages", "architecture"]
audience: ["developers"]
tags: ["claude-skills", "refactoring", "clean-code", "technical-debt", "code-quality", "best-of"]
seoTitle: "10 Best Claude Skills for Refactoring"
seoDescription: "The best Claude refactoring and clean-code skills: behavior-preserving cleanup, safe renames, module splits, dead code, import cycles, and strict types."
summary: "Start with the refactor command for a behavior-preserving clean-code pass and rename-symbol for safe renames. Add extract-module for overgrown files and dead-code-finder for cleanup, then reach for the specialist skills (upgrades, import cycles, stale flags, strict types, strangler-fig migrations, monorepo boundaries) as that debt appears."
keyTakeaways:
  - "The refactor command records a green test baseline first, and it and rename-symbol treat a changed assertion as proof that behavior moved, not as something to update."
  - "Split files by cohesion and a narrow interface, not by line count, and move shared types into a leaf module first so the split does not create import cycles."
  - "Static analysis misses dynamic imports, reflection, framework entry points, and public APIs, so dead code and stale flags are removed one item at a time with the build and tests after each."
  - "Map an import cycle with a tool such as madge, then break the edge that carries the fewest extractable symbols; deferring the import stops the crash but leaves the cycle."
  - "Large restructurings stay shippable only in small steps: one major version per commit for upgrades, and a runtime seam you can flip back for legacy replacement."
faq:
  - q: "Is there a clean code skill for Claude?"
    a: "The closest match in the AgentsCamp library is the refactor slash command. It targets the classic clean-code smells (vague names, duplication, long functions, deep nesting, dead code) while keeping behavior identical and re-running tests after each step. For file-level structure add extract-module, and to delegate a larger cleanup use the refactoring-specialist agent."
  - q: "What is the best Claude refactoring skill?"
    a: "It depends on the smell. Use extract-module for an overgrown file, circular-dependency-breaker for import cycles, dead-code-finder for unused exports and dependencies, and type-coverage-improver to reach TypeScript strict mode one flag at a time."
  - q: "Can a Claude agent refactor code without breaking it?"
    a: "The refactoring-specialist subagent works from a green test baseline, applies one named refactoring at a time, and re-runs the tests after every step, reverting any step that turns them red. If there are no tests and no fast way to add a characterization test, it flags the risk and stops before refactoring."
  - q: "Why not use find-and-replace to rename a symbol?"
    a: "A blind replace also changes substrings and unrelated symbols with the same name, such as user inside username or currentUser. The rename-symbol command matches whole words, checks each hit against the definition's scope, prefers language-server rename, and finishes with typecheck, build, and tests."
related: ["guide:best-claude-skills-for-code-review", "guide:best-claude-skills-2026", "command:refactor", "skill:extract-module", "skill:dead-code-finder", "skill:circular-dependency-breaker"]
---

The best Claude refactoring skill depends on the smell, not on how bad the code looks. A muddled function, a misleading name, a 1,200-line file, an import cycle, a stale flag, and a loosely typed codebase each need a different procedure, and a vague "clean this up" prompt tends to change behavior along with structure.

The picks below start with the refactors developers run every week and end with system-level restructuring. Two are slash commands; the other eight are skills.

| Skill | Best for | Typical artifact | Writes files? |
| --- | --- | --- | --- |
| [refactor](/commands/refactor/refactor) (command) | A clean-code pass on one target | Small refactorings, tests green | Yes |
| [rename-symbol](/commands/refactor/rename-symbol) (command) | Renaming across the project | Scoped edits, file renames | Yes |
| [extract-module](/skills/refactor/extract-module) | Splitting an overgrown file | Boundary map and move plan | Yes |
| [dead-code-finder](/skills/refactor/dead-code-finder) | Unused exports, files, deps | Verified removals | Yes, one at a time |
| [dependency-upgrade-planner](/skills/refactor/dependency-upgrade-planner) | Majors-behind dependencies | Version path and plan | No |
| [circular-dependency-breaker](/skills/refactor/circular-dependency-breaker) | Import cycles | Cycle diagram and fix | Yes |
| [feature-flag-retirer](/skills/refactor/feature-flag-retirer) | Stale feature flags | Per-flag removal record | Yes |
| [type-coverage-improver](/skills/refactor/type-coverage-improver) | Reaching TypeScript strict | Flag-by-flag plan and fixes | Yes |
| [strangler-fig-migrator](/skills/refactor/strangler-fig-migrator) | Replacing a legacy module | Seam and slice plan | Mostly plans |
| [monorepo-boundary-auditor](/skills/workflow/monorepo-boundary-auditor) | Package boundaries | Findings and repair plan | No |

## 1. refactor: run a behavior-preserving clean-code pass

[refactor](/commands/refactor/refactor) is the command to reach for when a file or function works but reads badly. It first runs the relevant tests to record a passing baseline; if nothing covers the target, it says so and adds a minimal characterization test or asks how to proceed. It then targets named smells: vague identifiers, duplication, long functions, deep nesting, dead code, and mixed levels of abstraction.

Each change is one focused transformation, such as replacing nested conditionals with guard clauses, followed by a test run. It stops and reports a genuine bug instead of silently fixing it, and treats any test that had to change as evidence that behavior changed.

## 2. rename-symbol: rename without collateral damage

[rename-symbol](/commands/refactor/rename-symbol) takes an old and a new name. It reads the definition to learn the symbol's kind, scope, and export surface, then separates real references from same-name symbols in other scopes and from substrings such as `user` inside `username`. It prefers language-server rename (for example `gopls rename`) and sweeps again for the old name afterward.

It usually leaves wire-compatible strings, such as DI tokens or serialized keys, unchanged, renames a file only when the filename encodes the symbol, and finishes with typecheck, build, and tests. If the new name collides with an existing symbol in that scope, it stops and reports.

## 3. extract-module: split a file by cohesion

When one file mixes HTTP handling, business rules, and persistence, [extract-module](/skills/refactor/extract-module) maps each top-level symbol to its purpose and the state it touches, then looks for seams where the call graph is narrow. It designs each new module's exports before moving a line, pulls shared types and pure helpers into a dependency-free leaf module first, and moves one cluster at a time with the build and tests run after each.

The original file stays as a temporary re-export barrel so callers keep working, and is later kept as a thin barrel or deleted in a final, isolated commit. Its central rule: do not split by line count.

## 4. dead-code-finder: delete only what is provably unused

[dead-code-finder](/skills/refactor/dead-code-finder) walks from the real entry points and runs ecosystem tools (`knip`, `ts-prune`, `depcheck`, `vulture`, `deptry`, `staticcheck`) to list unreferenced exports, unreachable files, and unused dependencies. It then greps the whole repository, including configs, CI scripts, and dynamic-import strings, before trusting any candidate.

Removals happen one at a time, each followed by the build and tests; a red result reverts that single change and marks the candidate as a false positive. Public-API surface and generated code go to a manual-review list. The [code review list](/guides/skills/best-claude-skills-for-code-review) uses it to question a diff; here it performs the cleanup.

## 5. dependency-upgrade-planner: plan a major upgrade before bumping

[dependency-upgrade-planner](/skills/refactor/dependency-upgrade-planner) turns "several majors behind" into a sequenced plan. It reads the installed version from the lockfile, not the manifest range, lists every hop to the target, and reads the migration guide for each intermediate major. It then greps your imports so only breaking changes that hit real call sites remain, and checks peer-dependency and minimum-runtime requirements that would block the install.

The plan puts codemods first and one major per commit, each behind a build-and-test checkpoint, and records the rollback (manifest and lockfile revert plus a frozen reinstall) before anything changes.

## 6. circular-dependency-breaker: cut the right edge

An `undefined` export or a "cannot access before initialization" error that depends on load order usually means an import cycle. [circular-dependency-breaker](/skills/refactor/circular-dependency-breaker) maps the exact chain with a tool (`madge --circular`, `dpdm`, `import-linter`, `pydeps`, or `go list`) instead of reading the stack trace, finds the edge that imports the fewest extractable symbols, and breaks it: extract the shared piece into a leaf module, invert a layering dependency, or merge two falsely split modules.

Deferring the import is a labeled last resort, because the cycle remains. The proof is re-running the same tool and seeing no cycle, then checking that import-time side effects still fire in the right order.

## 7. feature-flag-retirer: collapse flags that already won

[feature-flag-retirer](/skills/refactor/feature-flag-retirer) first confirms a flag's decided final state (permanently on or abandoned) from the flag system and a human owner, and rejects flags that are still rolling out, running an experiment, or kept as kill switches. It greps both the flag key and its identifier across helpers, definitions, tests, analytics, routes, and docs.

It then collapses each conditional to the winning branch, deletes code that only the losing branch reached, removes the flag definition and flag-only tests, and retires one flag per commit with the suite green.

## 8. type-coverage-improver: reach strict mode one flag at a time

[type-coverage-improver](/skills/refactor/type-coverage-improver) measures the baseline (explicit `any` count, suppressions, errors under `--strict`, and a `type-coverage` percentage when available), then enables strict sub-flags one at a time, starting with `noImplicitAny` and `strictNullChecks`. It fixes the highest-traffic files and data boundaries first, typing external data as `unknown` and narrowing it.

It refuses to clear errors with `any` casts or `@ts-ignore`, keeps `tsc --noEmit` passing at every commit, and puts any real bug it uncovers in a separate commit with a test.

## 9. strangler-fig-migrator: replace legacy code without a big bang

For a load-bearing legacy module, [strangler-fig-migrator](/skills/refactor/strangler-fig-migrator) plans an incremental replacement. Its first deliverable is an interception seam, such as a facade, proxy route, or flag, that sends each call to old or new code and can be flipped at runtime. It then orders capability slices from smallest and safest, shadow-runs new against old with a concrete equivalence definition, and ramps traffic gradually. Legacy code is deleted only after instrumentation shows zero traffic over a full usage cycle.

## 10. monorepo-boundary-auditor: find the coupling before you move code

[monorepo-boundary-auditor](/skills/workflow/monorepo-boundary-auditor) is read-only. It builds the package graph from manifests and real imports, checks allowed layer direction, and reports deep imports into private paths, cycles, coupling hotspots, and tasks that invalidate too much of the build. Its output is a staged repair plan with enforcement rules such as import lint or dependency-cruiser checks. It warns against moving code into a `shared` package just to break a cycle.

## Smaller commands and a refactoring agent

Two narrow commands cover the most mechanical edits. [extract-function](/commands/refactor/extract-function) pulls a region into a named function after working out its inputs, outputs, mutations, early returns, and closure captures. [optimize-imports](/commands/refactor/optimize-imports) removes unused imports and orders the rest, preferring the project's configured tool, while keeping side-effect, type-only, and dynamically referenced imports.

For a larger job such as breaking up a god object, the [refactoring-specialist](/agents/developer-tools/refactoring-specialist) subagent applies one named refactoring at a time from a green baseline and stops if it cannot establish a safety net.

## Recommended refactoring stacks

For everyday clean-code work, install the two commands plus the file-level skills:

```bash
npx agentscamp add commands/refactor
npx agentscamp add commands/rename-symbol
npx agentscamp add skills/extract-module
npx agentscamp add skills/dead-code-finder
```

For a debt-reduction project on an older codebase, add:

```bash
npx agentscamp add skills/dependency-upgrade-planner
npx agentscamp add skills/circular-dependency-breaker
npx agentscamp add skills/type-coverage-improver
```

Keep each refactor on its own branch with one change per commit, and ask Claude to report the baseline test command, each named change, and the final green run. If a test assertion had to change, treat the result as a behavior change and review it that way.

## Continue exploring

- [The Best Claude Skills to Install in 2026](/guides/skills/best-claude-skills-2026) — A skills-only tour of the AgentsCamp library, organized by the job each skill does.
- [How to Install Claude Skills](/guides/skills/how-to-install-claude-skills) — Every install path: manual copy, the agentscamp CLI, GitHub repos, plugins, and team distribution.
- [Skills vs Agents vs Commands](/guides/skills/skills-vs-agents-vs-commands) — How subagents and skills differ across invocation patterns, with a decision table.
