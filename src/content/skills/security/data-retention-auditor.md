---
name: "data-retention-auditor"
title: "Data Retention Auditor"
description: "Audit where personal or sensitive data is collected, copied, retained, backed up, logged, exported, and deleted, then compare actual lifecycle behavior with stated policy. Use when adding a data field, preparing a privacy review, implementing account deletion, reducing stored data, or checking whether retention controls work across primary and secondary systems."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "pink"
date: 2026-08-04
topics: ["ai-safety-security", "architecture"]
related: ["guide:best-claude-skills-for-security", "skill:prompt-pii-redactor", "skill:least-privilege-auditor", "skill:threat-model-builder", "skill:secret-scanner", "skill:structured-logging-designer"]
featured: true
summary: "Audits data lifecycle from collection through deletion across databases, object stores, caches, logs, analytics, queues, search indexes, model inputs, exports, backups, and vendors. It maps policy to technical controls, identifies undeletable copies and ambiguous ownership, and produces verification evidence without claiming legal compliance."
faq:
  - q: "Does deleting a database row complete a deletion request?"
    a: "Usually not. Copies may remain in logs, object storage, analytics, search indexes, caches, queues, exports, backups, derived features, and vendors. The audit follows the complete data lineage."
  - q: "Can this skill certify privacy-law compliance?"
    a: "No. It maps technical behavior and evidence against the policy or requirements supplied. Legal interpretation, jurisdiction, exemptions, and formal compliance determinations require qualified counsel or privacy professionals."
---

Trace real data copies and controls; do not infer compliance from a policy document.

## Workflow

1. **Define scope and authority.** Identify data subjects, systems, environments, policy sources, contractual requirements, owners, and review boundary. Mark legal conclusions as out of scope unless supplied by qualified authority.
2. **Inventory data elements.** Classify direct identifiers, quasi-identifiers, credentials, financial or health data, content, telemetry, model inputs and outputs, and derived attributes. Record purpose and collection source.
3. **Trace every copy.** Follow writes and replication into databases, blobs, caches, queues, logs, traces, analytics, warehouses, search indexes, feature stores, exports, backups, local files, and third parties.
4. **Map retention rules.** For each copy, identify owner, purpose, legal or business basis supplied, creation time, retention clock, deletion trigger, hold or exception, and maximum duration. Flag indefinite or undocumented storage.
5. **Inspect enforcement.** Locate TTLs, partitions, lifecycle policies, deletion jobs, anonymization, key destruction, vendor APIs, and access controls. Verify whether controls apply to historical records and failure retries.
6. **Test subject workflows.** Trace access, correction, export, and deletion identifiers across aliases, tenant moves, merged accounts, and derived data. Check authorization, auditability, partial failure, retry, and completion evidence.
7. **Handle backups honestly.** Document backup retention, restore implications, deletion propagation after restore, and access restrictions. Do not claim immediate erasure when recovery copies persist under a defined lifecycle.
8. **Verify with samples and metrics.** Use safe synthetic or authorized records to test expiry and deletion. Require counts of eligible, processed, failed, overdue, and restored records without exposing sensitive values.

> [!WARNING]
> Do not copy real sensitive values into the audit report. Reference systems, fields, record identifiers approved for audit, and aggregate evidence.

## Output

Provide a data inventory and lineage matrix, policy-to-control mapping, retention and deletion gaps, backup and vendor caveats, workflow test evidence, prioritized remediation, owners, and unresolved questions requiring privacy or legal judgment.
