---
name: "api-deprecation-planner"
title: "API Deprecation Planner"
description: "Plan the retirement of an API endpoint, field, event, tool, or version without surprising active consumers. Use when replacing an interface, removing legacy behavior, publishing a sunset, migrating internal or external clients, or deciding whether observed traffic is safe to turn off."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "yellow"
date: 2026-08-04
topics: ["architecture", "devops-infra"]
related: ["guide:best-claude-skills-for-release-management", "skill:openapi-doc-writer", "skill:contract-test-designer", "skill:semver-advisor", "skill:changelog-from-prs", "skill:strangler-fig-migrator"]
featured: true
summary: "Plans API retirement from a verified consumer inventory through replacement parity, announcements, telemetry, migration support, compatibility gates, sunset criteria, shutdown, and cleanup. It treats zero recent traffic as evidence to investigate—not proof that unobserved or infrequent clients do not exist."
faq:
  - q: "How long should an API deprecation window be?"
    a: "Set it from the published compatibility policy, consumer release cadence, contract obligations, and the slowest legitimate usage cycle. A monthly or quarterly client cannot be judged from one quiet week."
  - q: "Is zero traffic enough to delete an endpoint?"
    a: "Not by itself. Confirm telemetry coverage, long-tail schedules, disabled clients, alternate regions, cached clients, and contractual support. Then use explicit owner sign-off and a reversible disablement stage."
---

Retire an interface through measured migration, not a deletion date alone.

## Workflow

1. **Define the retiring surface.** Identify endpoints, methods, fields, event versions, SDK methods, agent tools, error codes, authentication modes, and undocumented behaviors consumers may rely on.
2. **Inventory consumers.** Combine gateway logs, client identifiers, tracing, repository search, SDK telemetry, support records, partner contracts, and owner interviews. State blind spots and the observation window.
3. **Verify the replacement.** Map every required behavior, performance property, permission, error, and operational dependency to the replacement. Record gaps and migration prerequisites.
4. **Set policy and timeline.** Apply versioning commitments, contractual notice, client release cadence, and rare usage cycles. Define announcement, warning, migration, freeze, disablement, and deletion milestones with owners.
5. **Make deprecation observable.** Add safe usage metrics, per-consumer attribution where allowed, structured warnings, response headers or schema directives, dashboards, and alerts for unexpected traffic changes.
6. **Support migration.** Provide side-by-side examples, SDK or codemod support, test environments, compatibility checks, and escalation paths. Avoid telling consumers only that the old interface will disappear.
7. **Define exit criteria.** Require replacement parity, acknowledged high-risk consumers, traffic below a justified threshold for a representative window, passing contract tests, rollback readiness, and accountable approval.
8. **Disable reversibly before deletion.** Prefer a controlled reject, feature flag, route switch, or scoped block with monitoring. Observe the result before removing code, data, documentation, and operational dependencies.

> [!WARNING]
> Telemetry cannot prove absence when client identification, regions, long-running jobs, or rare workflows are missing. Document the coverage boundary before interpreting zero traffic.

## Output

Produce a consumer matrix, replacement gap analysis, milestone timeline, communication plan, telemetry design, migration aids, exit checklist, reversible shutdown procedure, rollback trigger, and final cleanup list.
