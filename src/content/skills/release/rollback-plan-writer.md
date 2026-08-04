---
name: "rollback-plan-writer"
title: "Rollback Plan Writer"
description: "Write a tested rollback and forward-recovery plan for a release, including triggers, commands, compatibility constraints, data handling, verification, ownership, and stop conditions. Use before high-risk deploys, schema or configuration changes, dependency upgrades, model or provider migrations, feature launches, and any release where 'just redeploy the old version' is incomplete or unsafe."
allowed-tools: "Read, Grep, Glob, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-08-04
topics: ["devops-infra", "workflow-prompting"]
related: ["best-claude-skills-for-devops-sre", "canary-release-planner", "migration-writer", "version-bumper", "runbook-writer", "semver-advisor"]
featured: true
summary: "Writes an executable release recovery plan: defines objective rollback triggers, inventories application, schema, data, config, cache, queue, and external compatibility, selects rollback versus forward fix, provides verified commands and owners, protects irreversible writes, and specifies health checks and observation windows. Guessed commands and 'redeploy previous' are rejected."
faq:
  - q: "Why is redeploying the previous version not always a rollback plan?"
    a: "The new release may have changed database shape, written data the old code cannot read, emitted incompatible events, warmed a new cache format, rotated secrets, or changed a third-party contract. The plan must prove backward compatibility across every changed state."
  - q: "When is forward recovery safer than rollback?"
    a: "When the release made irreversible or expensive-to-reverse state changes, external consumers already depend on the new contract, or returning old code would corrupt new data. In those cases, disable exposure, preserve state, and deploy a bounded corrective change."
---

Write a plan responders can execute under pressure. Verify commands against repository and deployment configuration; label anything that cannot be confirmed.

## Workflow

1. **Define release scope.** List application artifacts, database migrations, configuration, feature flags, secrets, caches, queues, scheduled jobs, infrastructure, APIs, models/providers, and external dependencies changing together.
2. **Set objective triggers.** Use error rate, latency, correctness, data integrity, SLO burn, queue depth, or business metrics with thresholds and observation windows. Name who declares rollback.
3. **Check compatibility in both directions.** Confirm old code can run against new schema and data, new code can run during partial rollout, events remain readable, and configuration and secrets can be restored. Identify the point after which rollback becomes unsafe.
4. **Choose recovery paths.** Define fast disable or feature-flag containment, application rollback, configuration rollback, traffic shift, and forward fix. State when each applies and when to stop trying it.
5. **Protect data.** Describe dual-write or expand-contract phases, write freezes, backups or exports, reconciliation, queued-message handling, and irreversible effects. Never invent a down migration for data that cannot be reconstructed.
6. **Write exact commands.** Mine workflow files, deployment manifests, runbooks, and scripts for artifact IDs, environments, namespaces, revisions, and flags. Include expected output and the next decision.
7. **Assign roles and communication.** Name release lead, executor, verifier, database or platform owner, and communication owner. Include escalation thresholds and stakeholder channels.
8. **Verify recovery.** Use the same health and business checks as the release gate. Define how long metrics must remain healthy, how data is reconciled, and which temporary containment steps must be removed.
9. **Rehearse.** Dry-run commands in a safe environment or tabletop the sequence. Record untested assumptions and block the release when the only recovery path is speculative.

> [!WARNING]
> A rollback command that has not been checked against the current deployment configuration is a hypothesis. Label it unverified and test it before approving the release.

## Output

Create a Markdown rollback plan containing:

- release inventory and compatibility matrix
- trigger table with threshold, observation window, and decision owner
- containment, rollback, and forward-recovery decision tree
- exact commands with expected results and stop conditions
- database, event, cache, and external-side-effect handling
- roles, escalation, and communication
- verification and observation checklist
- rehearsal results, untested assumptions, and rollback cutoff point
