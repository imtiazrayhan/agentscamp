---
name: "monorepo-boundary-auditor"
title: "Monorepo Boundary Auditor"
description: "Audit a monorepo's package boundaries, dependency direction, public entry points, ownership, build graph, and affected-test rules, then report cycles and cross-layer imports with a staged repair plan. Use when packages are tightly coupled, builds invalidate too much, teams import internals, dependency cycles appear, or a monorepo migration needs enforceable architecture boundaries."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["architecture", "devops-infra"]
audience: ["developers", "devops"]
related: ["guide:best-claude-skills-for-code-review", "skill:circular-dependency-breaker", "skill:extract-module", "skill:github-actions-optimizer", "skill:dependency-upgrade-planner", "agent:system-architect"]
featured: true
summary: "Audits workspace packages as an architecture graph: discovers declared and source-level dependencies, checks allowed layer direction and public entry points, finds cycles and deep imports, evaluates ownership and affected-build accuracy, and proposes a staged boundary repair with automated lint or graph rules. It reports evidence without performing a risky repository-wide rewrite."
faq:
  - q: "What is a monorepo boundary?"
    a: "It is an enforceable rule about which package or layer may depend on another and through which public interface. Boundaries keep shared code reusable without allowing every workspace to reach into every other's internals."
  - q: "Are all dependency cycles equally harmful?"
    a: "No. A type-only development cycle may be less urgent than a runtime cycle that changes initialization order or forces broad rebuilds. Prioritize cycles by runtime impact, change coupling, ownership, and how many packages they pull into affected builds."
---

Audit structure and recommend repairs without editing the repository. Treat declared manifests and real source imports as separate evidence because either can be stale.

Use Bash only for read-only graph and listing commands. Do not install dependencies, write graph files into the repository (send output to stdout or a temporary directory), or run build tasks. If a graph tool is not already a dependency, `npx` will download it: ask before doing that, and fall back to `Grep` over import statements if the user declines.

For one specific import cycle inside a package, hand off to [circular-dependency-breaker](/skills/refactor/circular-dependency-breaker). This skill covers the workspace-level graph.

## Workflow

1. **Discover workspaces.** Read the root manifest and workspace configuration (`pnpm-workspace.yaml`, the `workspaces` field in `package.json`, `nx.json`, `turbo.json`, `lerna.json`, or the equivalent for Cargo, Go, or Bazel), then each package manifest, path aliases in `tsconfig*.json`, project references, `CODEOWNERS`, and each package's `exports`, `main`, and `types` entry points. Build a package inventory with purpose, owner, and public entry points.

2. **Construct the dependency graph from two sources.** Declared edges come from manifests. Real edges come from imports. Get both, preferring the tool the repo already uses:

   ```bash
   # Nx workspaces: project graph as JSON, and what a change affects
   npx nx graph --file=/tmp/nx-graph.json
   npx nx show projects --affected

   # Turborepo: the task graph a build would run, without running it
   npx turbo run build --dry=json

   # Any JS/TS repo: source-level import graph and cycles
   npx madge --circular --extensions ts,tsx packages apps
   npx dependency-cruiser packages apps --include-only "^(packages|apps)" --output-type mermaid
   ```

   Then compare the two sets. An import with no declared dependency is an **undeclared edge** (it works only by hoisting or a path alias). A declared dependency with no import is a **phantom edge** (it widens affected builds for nothing). Classify each real edge as runtime, development-only, type-only (`import type`), or build-time.

3. **Infer or read intended layers.** Look for documented rules first: Nx project tags with `@nx/enforce-module-boundaries`, a `.dependency-cruiser` config, ESLint `no-restricted-imports`, or an architecture doc. If none exist, infer layers from structure (applications, features, domain packages, platform or infrastructure, shared libraries, tooling, generated code), write the allowed direction as a short table, and mark it as inferred so the team can correct it.

4. **Check public interfaces.** Find imports that reach past a package's entry point. Adapt the scope and directory names to the repo:

   ```bash
   grep -rnE "from ['\"]@acme/[^'\"/]+/(src|lib|dist|internal)/" --include="*.ts" --include="*.tsx" packages apps
   grep -rnE "from ['\"](\.\./){2,}[^'\"]*packages/" --include="*.ts" --include="*.tsx" packages apps
   ```

   The first finds deep imports through the package name; the second finds relative imports that climb out of one package into another. Also flag packages with no `exports` map (everything is public by default), barrel files that re-export internals, duplicate path aliases, and public surfaces so large that any change invalidates most dependents.

5. **Find cycles and coupling hotspots.** Report each strongly connected component with its full edge list. For every cycle say whether it survives removing type-only edges; a cycle that exists only through `import type` does not affect initialization order but still couples builds. Compute fan-in and fan-out per package from the graph, and flag packages high in both: unstable code that many others depend on.

6. **Audit task and cache boundaries.** In `turbo.json` or Nx `targetDefaults`, check that each task's declared inputs, outputs, and environment variables match what the task reads and writes. An undeclared input gives false cache hits; an over-broad input (the whole repo, a root config every package reads) invalidates everything. Pick one leaf package and one core package and confirm the affected set for a change to each is what the graph predicts.

7. **Check ownership alignment.** Identify packages with no owner in `CODEOWNERS`, several teams changing the same internal surface, or a boundary that contradicts deployment and support responsibility.

8. **Design staged repairs.** Prefer public entry points, dependency inversion, interface packages, moved shared types, or extracted modules. Sequence the plan so every step leaves the graph buildable: first declare undeclared edges and add `exports` maps (no behavior change), then replace deep imports with entry-point imports, then break cycles, then turn on enforcement. Avoid a repository-wide flag day.

9. **Propose enforcement.** Recommend the mechanism that fits the existing toolchain: Nx tags with `@nx/enforce-module-boundaries`, ESLint `no-restricted-imports` or `import/no-cycle`, or a dependency-cruiser config (`npx dependency-cruiser --init` generates a starter that includes a `no-circular` rule) run in CI, where it exits non-zero when a rule at `error` severity is violated. Start new rules at warning level with the current violations recorded as a baseline, then ratchet.

> [!WARNING]
> Do not recommend moving code into `shared` merely to break a cycle. A shared dumping ground erases ownership and often creates a larger cycle. Place abstractions with the domain that owns the contract.

## Output

Return:

- package inventory with layer, owner, entry point, and dependency types
- dependency graph or Mermaid diagram
- findings ordered by architectural and build impact, with concrete import paths
- cycles and coupling hotspots with runtime versus type-only classification
- staged repair plan preserving buildability
- enforcement rules and affected-build verification
- unresolved ownership or intended-layer questions

Findings use this shape (fictional example):

```markdown
## Layers (inferred, please confirm)
apps -> features -> domain -> platform -> shared-utils   (imports may only point rightward)

| # | Impact | Finding | Evidence | Repair |
|---|---|---|---|---|
| 1 | high | Runtime cycle: @acme/billing -> @acme/accounts -> @acme/billing | accounts/src/plan.ts:3 imports getInvoiceTotal; billing/src/invoice.ts:9 imports Account | Move the Account type to @acme/accounts-contracts; invert getInvoiceTotal behind an interface owned by accounts |
| 2 | high | Layer violation: platform imports a feature | packages/platform/http/src/retry.ts:12 imports @acme/checkout/src/errors | Move the error type down to platform, re-export from checkout |
| 3 | medium | 14 deep imports into @acme/ui/src/internal | grep output attached; 9 in apps/web | Export the 3 components in use; add an exports map |
| 4 | medium | Undeclared edge: apps/admin imports @acme/dates without declaring it | apps/admin/package.json | Add the dependency; affected builds currently miss it |
| 5 | low | Phantom edge: @acme/search declares @acme/billing, no imports | packages/search/package.json | Remove; cuts billing changes out of search's affected set |

Commands run: nx graph --file, madge --circular (2 cycles), grep for deep imports. Not run: dependency-cruiser (not installed; user declined npx download).
```
