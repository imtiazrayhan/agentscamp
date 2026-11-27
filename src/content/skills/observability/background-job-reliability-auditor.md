---
name: "background-job-reliability-auditor"
title: "Background Job Reliability Auditor"
description: "Audit scheduled jobs, queue consumers, workers, and asynchronous workflows for delivery assumptions, idempotency, retries, poison messages, concurrency, timeouts, checkpoints, shutdown, and observability. Use when a job duplicates work, silently stops, falls behind, fails only at scale, or needs review before production."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "red"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["devops-infra", "review-qa"]
audience: ["developers", "devops"]
related: ["guide:best-claude-skills-for-devops-sre", "skill:structured-logging-designer", "skill:dashboard-designer", "skill:alerting-rules-tuner", "skill:idempotency-designer", "skill:safe-data-backfill-planner"]
featured: true
summary: "Audits asynchronous work end to end: enqueue, delivery, deduplication, processing, external side effects, acknowledgement, retry, dead-letter handling, shutdown, and recovery. It ties each failure mode to observable evidence and distinguishes queue guarantees from the application's required outcome."
faq:
  - q: "Does an exactly-once queue guarantee exactly-once business effects?"
    a: "Not automatically. Redelivery, producer retries, transaction boundaries, and external side effects can still duplicate outcomes. Design idempotency at the business operation boundary."
  - q: "What should alert for a background job?"
    a: "Alert on user-impacting delay or loss: oldest-message age, overdue schedule, terminal failures, dead-letter growth, or completion SLO. Queue depth alone may rise normally with traffic."
---

Trace asynchronous work from intent to verified outcome. Audit one job or queue at a time and cite a file and line, or a configuration key, for every finding.

## Workflow

1. **Define the required outcome.** Identify the user or business effect, acceptable delay, duplication tolerance, loss tolerance, ordering need, and recovery objective. Write it as one sentence you can test against, for example: "every paid order produces exactly one receipt email within 5 minutes; a duplicate is a customer-facing defect; loss is not acceptable".

2. **Map the lifecycle.** Trace producer commit, enqueue, broker delivery, lease or visibility timeout, worker processing, database writes, external effects, acknowledgement, retry, dead-letter handling, and reconciliation. Find the entry points first: search for the enqueue calls (`enqueue`, `perform_later`, `delay(`, `add(`, `publish`, `send_message`), the worker or consumer registrations, and schedule definitions (cron expressions, `schedule:` blocks, beat or scheduler configuration).

3. **State delivery assumptions.** Read the broker and client configuration and write down what is guaranteed under crashes, timeouts, partitions, and redelivery: at-most-once, at-least-once, ordering scope, and when a message becomes visible again. Do not infer exactly-once effects from product terminology. If the guarantee depends on a setting, quote the setting and its current value.

4. **Audit idempotency and transactions.** Answer four questions per job:

   - What is the stable operation key, and does it come from the business event (order ID, invoice ID) and not from a per-attempt value such as a job ID or timestamp?
   - Where is the key enforced: a unique constraint, a dedup table written in the same transaction as the effect, or an idempotency key passed to the external API?
   - Is the enqueue inside the database transaction that creates the work? If the job is enqueued before commit, a worker can run before the row exists; if enqueued after commit with no outbox, a crash loses the job.
   - What happens when the external side effect succeeds and the local write then fails? If the answer is "the retry repeats the effect", that is a finding.

5. **Review failure policy.** Check each of these against the code and mark pass or fail:

   - Retries are finite, use exponential backoff with jitter, and total retry time fits the acceptable delay from step 1.
   - Errors are classified: validation and "not found" failures go straight to dead-letter instead of burning retries.
   - Every network call inside the job has its own timeout, and their sum is below the job timeout.
   - The lease or visibility timeout exceeds the job timeout, or the worker extends the lease while running. Otherwise a slow job is delivered twice while the first attempt is still working.
   - Dead letters have an owner, an alert, and a documented replay procedure.

6. **Inspect concurrency and lifecycle.** Verify prefetch, worker count, per-key ordering, rate limits, and locks. On shutdown, confirm the worker handles `SIGTERM` by finishing or releasing in-flight jobs, and that the deploy grace period is longer than the longest job, or that long jobs checkpoint and resume. For scheduled jobs, check what stops two instances from running the same tick and what happens when a run overlaps the next one.

7. **Assess observability.** Require a correlation ID from the request or schedule through the job to its effect. Check for these signals and name the ones that are absent: enqueue rate, completion rate, run duration, age of the oldest waiting message, attempts per job, terminal failures, dead-letter count, and worker saturation. For scheduled jobs, require a missed-run signal such as a heartbeat that alerts when the job has not succeeded within its expected interval. Depth alone is not an alert condition.

8. **Exercise recovery.** Define a test for each case and state the expected result: crash before the side effect, crash after the side effect but before acknowledgement, duplicate delivery of the same message, broker outage during enqueue, dependency timeout, malformed payload, deploy during a running job, backlog drain after an outage, and dead-letter replay.

> [!WARNING]
> A retry policy without idempotency can amplify an outage into duplicate charges, emails, allocations, or data corruption.

## Output

Return a lifecycle diagram in text, verified delivery assumptions, prioritized findings with code or configuration evidence, missing telemetry, failure-injection cases, and a remediation plan. Separate containment from durable fixes.

Use this shape (fictional example):

```markdown
## Job: send_receipt (queue: mailers)
Required outcome: exactly one receipt per paid order within 5 minutes; loss not acceptable.

Lifecycle
checkout commit -> enqueue (after commit, no outbox) -> broker (at-least-once) -> worker
  -> POST to email provider -> UPDATE orders SET receipt_sent_at -> ack

| Check | Result | Evidence |
|---|---|---|
| Stable operation key | fail | job args carry order_id, but nothing enforces uniqueness |
| Enqueue is transactional | fail | app/checkout.py:88 enqueues after commit; a crash between loses the job |
| Finite retries with backoff | pass | workers/mailers.py:14 max 5 attempts, exponential |
| Lease longer than job timeout | fail | visibility 30s, provider call timeout 60s |
| Dead-letter owner and alert | fail | DLQ configured, no alert, no replay script |

Findings
1. HIGH duplicate receipts: lease (30s) is shorter than the provider timeout (60s), and the send is not idempotent.
   Containment: raise visibility timeout above the job timeout. Durable fix: pass order_id as the provider idempotency key and add a unique index on receipts(order_id).
2. HIGH lost receipts: enqueue is outside the transaction. Fix: outbox row written with the order, relayed by a poller.

Failure-injection cases: kill the worker after the provider call returns; deliver the same message twice; return 500 from the provider for 10 minutes.
```
