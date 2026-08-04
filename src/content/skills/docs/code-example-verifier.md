---
name: "code-example-verifier"
title: "Code Example Verifier"
description: "Verify documentation code examples against the current repository and toolchain, then fix snippets, imports, commands, and expected output without changing the documented intent. Use when docs examples may be stale, an SDK or API changed, users report copy-paste failures, or before publishing tutorials, READMEs, migration guides, and release documentation."
allowed-tools: "Read, Grep, Glob, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-08-04
topics: ["review-qa", "workflow-prompting"]
related: ["guide:best-claude-skills-for-documentation", "skill:readme-generator", "skill:openapi-doc-writer", "skill:runbook-writer", "skill:onboarding-guide-writer", "agent:documentation-engineer"]
featured: true
summary: "Turns documentation snippets into tested examples. It inventories fenced code and shell commands, maps each example to the current API and supported versions, extracts or reproduces snippets in a minimal harness, runs them with sanitized inputs, verifies expected output, fixes the documentation rather than hiding errors, and reports examples that cannot be executed automatically."
faq:
  - q: "Should every documentation snippet run in CI?"
    a: "Run every example that can be made deterministic and safe. Mark conceptual pseudocode clearly, and review examples requiring credentials, external services, destructive commands, or large environments with a documented manual verification procedure."
  - q: "Is checking that code compiles enough?"
    a: "No. Compilation catches syntax and type drift but not wrong output, missing setup, incorrect commands, unsafe defaults, or runtime API changes. Verify the user-visible result and cleanup path as well."
---

Make documentation examples copy-pasteable and truthful against the current codebase. Do not silently convert real examples into vague pseudocode to make the audit pass.

## Workflow

1. **Inventory examples.** Find fenced code, inline shell commands, configuration blocks, request examples, imports, package names, paths, environment variables, and claimed output. Group duplicated snippets by canonical source.
2. **Classify execution.** Mark each example `runnable`, `compile-only`, `requires controlled integration`, `destructive/manual`, or `pseudocode`. Flag unlabeled pseudocode presented as executable code.
3. **Check prerequisites.** Verify supported runtime and package versions, setup steps, imports, public APIs, file paths, environment variables, and permissions against the repository—not memory.
4. **Build minimal harnesses.** Extract examples into temporary or existing documentation-test fixtures without altering their semantics. Use sanitized local data and mock only external boundaries that the example is not teaching.
5. **Run safely.** Execute format, compile/typecheck, and runtime commands as appropriate. Never run destructive, production, billing, or credentialed examples; validate their syntax and document the manual test boundary.
6. **Verify outputs.** Assert exit status, response shape, created artifacts, and documented output. Normalize volatile timestamps, ports, IDs, and paths without weakening meaningful assertions.
7. **Fix the source.** Update imports, commands, setup, code, output, and cleanup in the documentation. Prefer linking or generating from tested canonical examples when duplication causes drift.
8. **Add repeatable checks.** Integrate deterministic examples into the repository's docs test, typecheck, or CI workflow when within scope.
9. **Report exceptions.** List examples not executed, why, the risk, and the exact manual verification needed.

> [!WARNING]
> Never execute a documentation command merely because it is fenced as `bash`. Inspect for deletion, deployment, migration, credential use, external side effects, and production targets first.

## Output

Return:

- an example inventory with classification and verification status
- documentation edits for every stale or incomplete example
- harness or CI changes for deterministic examples
- exact commands run and observed results
- unverified examples with reason and manual verification procedure
- duplicated snippets that should be generated from one tested source
