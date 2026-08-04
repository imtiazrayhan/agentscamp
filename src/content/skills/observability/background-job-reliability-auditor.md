---
name: "background-job-reliability-auditor"
title: "Background Job Reliability Auditor"
description: "Audit scheduled jobs, queue consumers, workers, and asynchronous workflows for delivery assumptions, idempotency, retries, poison messages, concurrency, timeouts, checkpoints, shutdown, and observability. Use when a job duplicates work, silently stops, falls behind, fails only at scale, or needs review before production."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "red"
date: 2026-08-04
topics: ["devops-infra", "review-qa"]
related: ["guide:best-claude-skills-for-devops-sre", "skill:structured-logging-designer", "skill:dashboard-designer", "skill:alerting-rules-tuner", "skill:idempotency-designer", "skill:safe-data-backfill-planner"]
featured: true
summary: "Audits asynchronous work end to end: enqueue, delivery, deduplication, processing, external side effects, acknowledgement, retry, dead-letter handling, shutdown, and recovery. It ties each failure mode to observable evidence and distinguishes queue guarantees from the application's required outcome."
faq:
  - q: "Does an exactly-once queue guarantee exactly-once business effects?"
    a: "Not automatically. Redelivery, producer retries, transaction boundaries, and external side effects can still duplicate outcomes. Design idempotency at the business operation boundary."
  - q: "What should alert for a background job?"
    a: "Alert on user-impacting delay or loss: oldest-message age, overdue schedule, terminal failures, dead-letter growth, or completion SLO. Queue depth alone may rise normally with traffic."
---

Trace asynchronous work from intent to verified outcome.

## Workflow

1. **Define the required outcome.** Identify the user or business effect, acceptable delay, duplication tolerance, loss tolerance, ordering need, and recovery objective.
2. **Map the lifecycle.** Trace producer commit, enqueue, broker delivery, lease or visibility timeout, worker processing, database writes, external effects, acknowledgement, retry, dead-letter handling, and reconciliation.
3. **State delivery assumptions.** Verify what the scheduler or broker actually guarantees under crashes, timeouts, partitions, and redelivery. Do not infer exactly-once effects from product terminology.
4. **Audit idempotency and transactions.** Find the stable operation key, deduplication store, uniqueness boundary, transaction scope, outbox or inbox pattern, and behavior when an external side effect succeeds before local state commits.
5. **Review failure policy.** Check exception classification, backoff, jitter, maximum attempts, retry budget, timeout hierarchy, poison-message isolation, dead-letter ownership, and replay procedure.
6. **Inspect concurrency and lifecycle.** Verify prefetch, worker count, per-key ordering, rate limits, locks, heartbeat or lease extension, graceful shutdown, deploy draining, checkpointing, and resource cleanup.
7. **Assess observability.** Require correlation from request or schedule to job and effect. Measure enqueue rate, completion rate, latency, oldest age, attempts, terminal failures, dead letters, throughput, and saturation.
8. **Exercise recovery.** Define tests for crash before and after side effects, duplicate delivery, broker outage, dependency timeout, malformed payload, deploy interruption, backlog drain, and dead-letter replay.

> [!WARNING]
> A retry policy without idempotency can amplify an outage into duplicate charges, emails, allocations, or data corruption.

## Output

Return a lifecycle diagram in text, verified delivery assumptions, prioritized findings with code or configuration evidence, missing telemetry, failure-injection cases, and a remediation plan. Separate containment from durable fixes.
