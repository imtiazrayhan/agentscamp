---
name: "data-retention-auditor"
title: "Data Retention Auditor"
description: "Audit where personal or sensitive data is collected, copied, retained, backed up, logged, exported, and deleted, then compare actual lifecycle behavior with stated policy. Use when adding a data field, preparing a privacy review, implementing account deletion, reducing stored data, or checking whether retention controls work across primary and secondary systems."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "pink"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["ai-safety-security", "architecture"]
audience: ["developers", "security"]
related: ["guide:best-claude-skills-for-security", "skill:prompt-pii-redactor", "skill:least-privilege-auditor", "skill:threat-model-builder", "skill:secret-scanner", "skill:structured-logging-designer"]
featured: true
summary: "Audits the data lifecycle from collection to deletion across databases, logs, analytics, caches, queues, search indexes, object storage, backups, and vendors. It maps each copy to a retention rule and an enforcing mechanism, finds copies that survive account deletion, and supplies count-based verification queries without claiming legal compliance."
faq:
  - q: "Does deleting a database row complete a deletion request?"
    a: "Usually not. Copies may remain in logs, object storage, analytics, search indexes, caches, queues, exports, backups, derived features, and vendors. The audit follows the complete data lineage."
  - q: "Can this skill certify privacy-law compliance?"
    a: "No. It maps technical behavior and evidence against the policy or requirements supplied. Legal interpretation, jurisdiction, exemptions, and formal compliance determinations require qualified counsel or privacy professionals."
---

Trace real data copies and controls; do not infer compliance from a policy document. This is a read-only audit: search code and configuration, and run queries only against systems the user has authorized.

## Workflow

1. **Define scope and authority.** Record which data subjects (customers, employees, end users of a tenant), systems, and environments are in scope, and which document states the retention rules: a privacy policy, a records schedule, a contract clause, or a ticket. If no rule is supplied, audit actual behavior and report "no stated rule" per data element. Legal conclusions are out of scope unless a qualified owner supplies them.

2. **Inventory data elements at the source.** Start from the schema, not from memory. Search migrations, ORM models (`schema.prisma`, `models.py`, `*.entity.ts`), API specs, and event definitions for field names such as:

   ```bash
   grep -rniE "email|phone|address|birth|dob|ssn|passport|national_id|ip_address|user_agent|device_id|lat|lng|location|card|iban|token|password" \
     --include="*.sql" --include="*.prisma" --include="models.py" --include="*.entity.ts" .
   ```

   Classify each hit: direct identifier, quasi-identifier, credential, financial, health, precise location, user content, telemetry, model input or output, or derived attribute. Record the purpose and where it is collected.

3. **Trace every copy.** For each element, follow it out of the primary store. Check each of these sinks and write down the file and line where the copy happens, or "none found":

   | Sink | What to search for |
   |---|---|
   | Logs and traces | logger calls that pass whole objects (`logger.info(user)`, `console.log(req.body)`), request-body logging middleware, span attributes |
   | Error tracking | user-context calls such as `setUser(`, breadcrumbs carrying form values |
   | Analytics and warehouse | `track(`, `identify(`, event properties, ETL or CDC sync configuration |
   | Search and vector indexes | indexing jobs, embedding pipelines, document `upsert` calls |
   | Caches and sessions | `set(` or `SETEX` with user-keyed values, session stores |
   | Queues and event buses | published payloads, dead-letter queues, retained topics |
   | Object storage | uploads, exports, generated reports, CSV dumps |
   | Third parties | email, SMS, payment, support desk, CRM, and LLM provider calls |
   | Backups and replicas | snapshot schedules, read replicas, staging refreshes from production |

4. **Map retention rules.** Build one row per copy: owner, purpose, stated rule, when the retention clock starts (creation, last activity, account closure), deletion trigger, any legal hold or exception, and maximum duration. A copy with no owner, no clock, or no maximum is a finding by itself.

5. **Inspect enforcement.** A rule without a mechanism is a policy statement. Look for the mechanism and note whether it covers rows created before the mechanism existed:

   - Cache keys: a TTL on every write (`EX`, `SETEX`, `expire`). A user-keyed value with no TTL is a finding.
   - Object storage: lifecycle expiration in infrastructure code (for example `aws_s3_bucket_lifecycle_configuration`), including noncurrent versions when versioning is on.
   - Logs: an explicit retention setting (for example `retention_in_days` on a log group). No setting usually means logs are kept indefinitely.
   - Databases: a scheduled purge job, partition drops, or a hard delete. A `deleted_at` soft delete with no purge job never deletes anything.
   - Backups: the snapshot retention period (for example `backup_retention_period`) and any long-term archive.
   - Vendors: a deletion API call or a documented manual process with an owner.

6. **Trace the deletion and access workflows.** Open the account-deletion handler and list every store it touches. Subtract that list from the copies found in step 3. What remains is the deletion gap. Then check: does the job retry and record partial failure, does it handle merged accounts and alternate identifiers (email, phone, external ID), does it reach derived data such as embeddings and aggregates, and is completion recorded with a timestamp but without the deleted values? Repeat for export and correction requests.

7. **Handle backups honestly.** State the backup retention period, who can restore, and what happens to deleted records after a restore (a replay list of deletions, or nothing). The accurate claim is "removed from live systems within X, expired from backups within Y", never "erased immediately".

8. **Verify with counts, not samples of real values.** Propose or run aggregate checks that should return zero if enforcement works:

   ```sql
   -- rows older than the stated 90-day limit
   SELECT count(*) FROM sessions WHERE created_at < now() - interval '90 days';
   -- soft-deleted accounts past the 30-day purge window
   SELECT count(*) FROM users WHERE deleted_at < now() - interval '30 days';
   ```

   For deletion, use a synthetic account: create it, exercise the feature, delete it, then search each sink for its identifier. Report eligible, processed, failed, and overdue counts.

9. **Rate each gap.**

   - **High**: credentials, financial, health, government ID, precise location, or children's data kept with no limit, or any personal data that survives deletion in a store people can query.
   - **Medium**: ordinary identifiers that survive deletion in logs, analytics, search, or vendor systems, or that exceed the stated rule.
   - **Low**: a control that exists but is untested, undocumented, or ownerless.

> [!WARNING]
> Do not copy real sensitive values into the audit report. Reference systems, fields, record identifiers approved for audit, and aggregate evidence.

## Output

Lead with the lineage and retention matrix, then findings. Example rows (fictional):

```markdown
| Element | Copy | Location | Stated rule | Mechanism | Deleted on account deletion? | Gap |
|---|---|---|---|---|---|---|
| email | primary | users.email | life of account + 30 days | purge job jobs/purge_users.py | yes | none |
| email | logs | api/middleware/log.ts:41 logs req.body | 30 days | no retention set on log group | no | HIGH: indefinite, survives deletion |
| email | analytics | identify() in web/analytics.ts:12 | none stated | none | no | MEDIUM: no rule, no deletion call |
| ip_address | sessions | sessions.ip | 90 days | none (12,480 rows overdue) | yes (cascade) | MEDIUM: exceeds rule |
| support uploads | object storage | bucket acme-support | 1 year | lifecycle rule, current versions only | no | MEDIUM: old versions never expire |
```

Then provide:

- findings ordered by rating, each with evidence location, the rule it breaks, and the smallest fix (add a TTL, add a lifecycle rule, add the sink to the deletion job)
- the deletion-gap list from step 6
- backup and vendor caveats in the wording from step 7
- verification queries with expected results, marked as run or not run
- owners, and the open questions that need privacy or legal judgment
