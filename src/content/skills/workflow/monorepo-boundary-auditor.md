---
name: "monorepo-boundary-auditor"
title: "Monorepo Boundary Auditor"
description: "Audit a monorepo's package boundaries, dependency direction, public entry points, ownership, build graph, and affected-test rules, then report cycles and cross-layer imports with a staged repair plan. Use when packages are tightly coupled, builds invalidate too much, teams import internals, dependency cycles appear, or a monorepo migration needs enforceable architecture boundaries."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-08-04
topics: ["architecture", "devops-infra"]
related: ["best-claude-skills-for-code-review", "circular-dependency-breaker", "extract-module", "github-actions-optimizer", "dependency-upgrade-planner", "system-architect"]
featured: true
summary: "Audits workspace packages as an architecture graph: discovers declared and source-level dependencies, checks allowed layer direction and public entry points, finds cycles and deep imports, evaluates ownership and affected-build accuracy, and proposes a staged boundary repair with automated lint or graph rules. It reports evidence without performing a risky repository-wide rewrite."
faq:
  - q: "What is a monorepo boundary?"
    a: "It is an enforceable rule about which package or layer may depend on another and through which public interface. Boundaries keep shared code reusable without allowing every workspace to reach into every other's internals."
  - q: "Are all dependency cycles equally harmful?"
    a: "No. A type-only development cycle may be less urgent than a runtime cycle that changes initialization order or forces broad rebuilds. Prioritize cycles by runtime impact, change coupling, ownership, and how many packages they pull into affected builds."
---

Audit structure and recommend repairs without editing the repository. Treat declared manifests and real source imports as separate evidence because either can be stale.

## Workflow

1. **Discover workspaces.** Read root and package manifests, workspace configuration, task runner files, path aliases, project references, ownership files, and package entry points. Build a package inventory with purpose and owner.
2. **Construct the dependency graph.** Combine declared dependencies with actual imports, code generation, build-time inputs, and task dependencies. Distinguish runtime, development, type-only, and optional edges.
3. **Infer or read intended layers.** Identify applications, features, domain packages, platform/infrastructure, shared libraries, tooling, and generated code. Record allowed dependency direction and flag places where no intended architecture is documented.
4. **Check public interfaces.** Find deep imports into another package's source or private paths, undeclared dependencies, duplicate aliases, barrel files that expose internals, and packages with unstable or oversized public surfaces.
5. **Find cycles and coupling hotspots.** Report strongly connected components, packages with high fan-in or fan-out, and changes that invalidate unrelated builds. Explain the runtime and ownership consequence of each.
6. **Audit task and cache boundaries.** Verify build inputs, outputs, environment variables, generated files, and affected-test calculation. Flag tasks that miss dependencies or invalidate the whole graph unnecessarily.
7. **Check ownership alignment.** Identify packages with no owner, several teams changing the same internal surface, or a boundary that contradicts deployment and support responsibility.
8. **Design staged repairs.** Prefer public entry points, dependency inversion, interface packages, moved shared types, or extracted modules. Sequence changes so the graph remains buildable and avoid a repository-wide flag day.
9. **Propose enforcement.** Recommend import lint rules, workspace constraints, dependency-cruiser or graph checks, ownership rules, and affected-build tests appropriate to the existing toolchain.

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
