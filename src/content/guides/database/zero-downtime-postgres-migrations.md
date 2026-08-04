---
title: "Zero-Downtime Postgres Migrations: The Expand-Contract Playbook for 2026"
description: "How to change a live Postgres schema without downtime or broken deploys — the expand-contract pattern, safe column changes, batched backfills, and CONCURRENTLY."
author: "AgentsCamp"
date: 2026-06-04
color: "green"
topics: ["data-ml"]
tags: ["postgres", "migrations", "database", "zero-downtime", "devops"]
featured: true
summary: "You can't take a breaking schema change to a live database in one step without risking downtime or a broken deploy. The expand-contract pattern decomposes every change into backward-compatible steps — expand the schema, backfill and dual-write, migrate reads, then contract — deployed across releases so old and new application code run side by side the whole time."
keyTakeaways:
  - "Never make a breaking schema change in one step against a live database — decompose it so old and new application code can both run during the rollout."
  - "Expand-contract: (1) expand the schema additively, (2) backfill data in batches, (3) dual-write old+new, (4) migrate reads to the new shape, (5) contract by removing the old — each its own deploy."
  - "Adding a column is safe; adding NOT NULL or a default that rewrites a big table is not. Add nullable, backfill in batches, then add the constraint as NOT VALID and VALIDATE separately."
  - "Build indexes with CREATE INDEX CONCURRENTLY so you don't hold a lock that blocks writes for the duration of the build."
  - "Renames and type changes are the trap — do them as add-new-column + dual-write + backfill + switch + drop-old, never an in-place rename, so no deploy ever sees a column that vanished."
howtoSteps:
  - name: "Expand: add, never change"
    text: "Make the schema change additive and backward-compatible — add a new nullable column, a new table, or a new index (CONCURRENTLY). Avoid anything that rewrites or locks a large table. After this step, old code still works unchanged because nothing it depends on was altered."
  - name: "Backfill in batches"
    text: "Populate the new column or table from the old data in small, resumable batches (e.g. by id range), with a pause between batches to avoid long locks, table bloat, and replication lag. A single UPDATE over millions of rows is exactly what causes the outage you're avoiding."
  - name: "Dual-write from the application"
    text: "Deploy application code that writes both the old and new shape on every change, while still reading the old. Now both schemas are kept current by live traffic, and you can roll this deploy back safely because the old path still works."
  - name: "Validate and add constraints separately"
    text: "Once backfill is complete and dual-write is keeping the new column current, add any constraints in two phases — ADD CONSTRAINT ... NOT VALID (fast, no full-table scan) then VALIDATE CONSTRAINT (online) — so you never take a long exclusive lock."
  - name: "Migrate reads"
    text: "Deploy application code that reads from the new column/shape. Verify in production with the new path serving reads while the old data still exists as a safety net. This is the point of no return only once you're confident."
  - name: "Contract: remove the old"
    text: "In a later, separate release — after the new path is proven and no deployed code references the old column or constraint — drop the old column, stop dual-writing, and clean up. Splitting contract from expand by a release is what makes the whole change reversible."
faq:
  - q: "What is a zero-downtime database migration?"
    a: "A zero-downtime (or online) migration changes a live database schema without taking the application offline and without a window where deployed code is incompatible with the schema. You achieve it by making only backward-compatible changes at any one time, so the old and new versions of your application can both run against the database throughout the rollout — which is exactly what a rolling deploy or blue-green deploy requires."
  - q: "What is the expand-contract migration pattern?"
    a: "Expand-contract (also called expand/migrate/contract or parallel change) splits a breaking schema change into backward-compatible steps spread across releases. First you EXPAND — add the new schema additively without touching the old. Then you migrate — backfill data, dual-write old and new, and switch reads to the new shape. Finally, in a later release, you CONTRACT — remove the old schema once nothing uses it. At no single step is there a schema the currently-deployed code can't handle."
  - q: "How do I add a NOT NULL column to a large table without downtime?"
    a: "Don't add it as NOT NULL in one step on a big table. Add the column as nullable (and, on modern Postgres, with a non-volatile default, which is cheap). Backfill existing rows in batches. Have the application start writing the column. Then add the NOT NULL constraint safely — add a CHECK (col IS NOT NULL) as NOT VALID, run VALIDATE CONSTRAINT online, then SET NOT NULL, which now skips the table scan because the validated CHECK already proves no NULLs exist (and drop the now-redundant CHECK). This avoids the long exclusive lock and full-table rewrite that a naive ALTER would cause."
  - q: "How do I rename a column without breaking the application?"
    a: "Never do an in-place rename on a live system — the moment you rename, the currently-deployed code referencing the old name breaks. Instead: add a new column with the new name, dual-write to both from the application, backfill the new column from the old, switch reads to the new column, and only in a later release drop the old column. It's more steps, but no deploy ever sees a column that suddenly disappeared."
  - q: "Why should I use CREATE INDEX CONCURRENTLY?"
    a: "A plain CREATE INDEX takes a lock that blocks writes (INSERT/UPDATE/DELETE) to the table for the entire build, which on a large table can mean minutes of effective downtime. CREATE INDEX CONCURRENTLY builds the index without that write lock, at the cost of being slower and not runnable inside a transaction block. On a live table it's almost always the right choice — just check afterward that the index is valid, since a concurrent build can fail and leave an invalid index to drop and retry."
related: ["guide:postgres-indexing-at-scale", "agent:postgres-migration-engineer", "tool:pgroll", "command:db-migrate", "skill:sql-optimizer", "tool:pgvector"]
---

Changing the schema of a database that's serving live traffic is one of the most reliably dangerous things a team does. The failure isn't usually a dropped table — it's subtler: a migration that takes an exclusive lock and stalls every write for two minutes, or a deploy where the new code expects a column the old code just renamed, so for thirty seconds half your servers throw errors. The fix is not a better migration tool. It's a **pattern**: never put the database in a state that the currently-deployed application code can't handle.

That pattern is **expand-contract**, and this guide is the playbook.

## The one rule: every step is backward-compatible

Modern deploys are rolling — old and new versions of your app run **at the same time** for at least a few seconds, often minutes. So the schema must be valid for *both* at every moment. That single constraint rules out the entire class of "change it in place" migrations and replaces them with a sequence of additive steps:

> **Expand** the schema → **migrate** the data and writes → **contract** away the old — with each phase deployed separately, so you can stop or roll back at any point.

If you internalize one thing: **add before you remove, and never remove in the same release you add.**

## The phases

### Expand — add, never change

Make the change additively. Add a new nullable column, a new table, a new index — anything the old code can simply ignore. Crucially, avoid operations that rewrite or long-lock a large table:

- Add columns **nullable** (a *non-volatile* `DEFAULT` is cheap on modern Postgres — stored in the catalog and applied lazily; a *volatile* one like `random()` or `clock_timestamp()` rewrites the table — don't).
- Create indexes with **`CREATE INDEX CONCURRENTLY`** so the build doesn't block writes.
- Add constraints in two steps: **`ADD CONSTRAINT … NOT VALID`** (fast, skips the full scan) then **`VALIDATE CONSTRAINT`** (online).

After the expand phase, the old application still runs unchanged — you've only added things it doesn't know about.

### Migrate — backfill, dual-write, switch reads

Now move the data and the traffic, still without breaking the old path:

1. **Backfill in batches.** Populate the new column/table from the old in small, resumable chunks (by id or time range), pausing between batches. A single `UPDATE` across millions of rows holds locks, bloats the table, and floods replication — the very outage you're avoiding.
2. **Dual-write.** Deploy app code that writes **both** the old and new shape on every change but still reads the old. Live traffic now keeps both current, and this deploy is safely reversible.
3. **Migrate reads.** Deploy app code that reads the new shape. The old data is still there as a safety net; verify the new path in production before trusting it.

### Contract — remove the old, later

In a **separate, later release** — after the new path is proven and no deployed code references the old column or constraint — drop the old column, stop dual-writing, and clean up. Putting a release boundary between *add* and *remove* is exactly what keeps the whole change reversible: if the new path misbehaves, the old column is still there to fall back to.

## The moves that bite people

- **Renames.** A rename is a remove-and-add disguised as one step. Do it the long way: add new column → dual-write → backfill → switch reads → drop old. Never `RENAME` in place on a live table.
- **`NOT NULL` on a big table.** Add the column nullable, backfill, add a `CHECK (col IS NOT NULL) NOT VALID` and `VALIDATE` it, then run `SET NOT NULL` — which now *skips* the table scan because the validated `CHECK` already proves there are no NULLs — and drop the redundant `CHECK`. The naive `ALTER … SET NOT NULL` without that validated check scans the whole table under an exclusive lock.
- **Type changes.** Treat like a rename: add a new column of the new type, dual-write/backfill, switch, drop. An in-place `ALTER TYPE` can rewrite and lock the table.
- **Dropping things eagerly.** Dropping a column or constraint while old code still references it breaks that code. Contract only after the old code is fully gone.

> [!WARNING]
> The dangerous migrations are the ones that take a long lock or rewrite a large table: adding a column with a volatile default, `SET NOT NULL` directly, a plain `CREATE INDEX`, or a single massive `UPDATE`. Each blocks writes for the duration. Every safe alternative above exists to avoid exactly that lock.

> [!TIP]
> Tools like [pgroll](/tools/pgroll) automate expand-contract by keeping multiple schema versions live behind views, so old and new app versions each see the shape they expect during the rollout — turning the discipline above into a managed, reversible workflow.

## Putting it together

Zero-downtime migration is a sequencing discipline, not a feature. Decompose every breaking change into **expand → backfill → dual-write → migrate reads → contract**, deploy each phase on its own, build indexes `CONCURRENTLY`, validate constraints in two steps, and never remove in the same release you add. Do that and a schema change becomes a series of boring, reversible deploys instead of a maintenance window.

For running this end to end, the [postgres-migration-engineer](/agents/data-ai/postgres-migration-engineer) plans and executes the phased rollout with your migration tooling; the [DB Migrate](/commands/db/db-migrate) command generates and applies an individual migration with these safeguards built in.
