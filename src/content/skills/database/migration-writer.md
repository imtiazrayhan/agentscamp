---
name: "migration-writer"
description: "Write a safe, reversible, zero-downtime database migration using expand-contract — add the new shape, backfill in batches, switch reads/writes, then drop the old — so every deploy stays compatible with the running app version. Use when adding or changing schema on a live system, renaming/dropping a column, adding NOT NULL or a foreign key on a large table, or when a migration risks locks, table rewrites, or an unrevertable step."
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Migration Writer"
date: 2026-06-17
topics: ["devops-infra"]
related: ["postgres-index-strategist", "semver-advisor", "version-bumper"]
featured: false
summary: "Most schema migrations break prod because they assume a single atomic deploy where old and new code never coexist. This skill writes migrations the expand-contract way: each step is independently deployable, reversible with a real down migration, and free of write-blocking locks — so a live system stays up while the schema changes underneath it."
faq:
  - q: "Why split a column rename into multiple migrations instead of ALTER ... RENAME?"
    a: "A rename is atomic in the database but not in your fleet: during a rolling deploy, old pods still query the old name while new pods query the new one, so one side throws. Expand-contract (add new, backfill, dual-write, switch reads, drop old) keeps both names valid across the deploy window."
  - q: "Do I really need a down migration if we only roll forward?"
    a: "Yes. The down is your tested rollback path when a deploy goes bad at 2am, and writing it forces you to confront irreversible steps (a dropped column's data is gone) before they ship — which is exactly when you'd add a backup/export step instead."
---

Most schema migrations break production not because the SQL is wrong but because they assume the database and the app flip over in one atomic instant. During a rolling deploy, old and new code run **at the same time** against **one schema** — so a migration that the new code needs will crash the old code, and a rollback that the old code needs is gone the moment you `DROP`. This skill writes migrations the **expand-contract** way: each step is independently deployable against the version before and after it, every change has a real `down`, and no step takes a lock that blocks writes on a hot table.

## When to use this skill

- Adding, renaming, dropping, or retyping a column on a table that a live app reads/writes.
- Adding `NOT NULL`, a `CHECK`, a foreign key, or a unique constraint to a table with existing rows.
- Creating an index on a large/busy table, or backfilling a new column across millions of rows.
- Splitting/merging tables, moving a column, or any change where old and new app code must coexist during the deploy.

## Instructions

1. **Decide the expand-contract phases first, before writing SQL.** A column rename `a → b` is not one migration; it is: (1) add `b` nullable, (2) dual-write `a` and `b` in app code, (3) backfill `b` from `a`, (4) switch reads to `b`, (5) stop writing `a`, (6) drop `a`. Each phase ships and is safe to roll back to the phase before it. Name the phases explicitly in the output, mapped to app deploys.
2. **Make additive changes nullable / without a default rewrite.** `ADD COLUMN ... NULL` is instant. Adding a column with a non-constant default (or, on old engines, any default) rewrites the table under a lock — split it into add-nullable, then backfill, then set default for future rows.
3. **Add `NOT NULL` and `CHECK` without a blocking scan.** On Postgres: `ADD CONSTRAINT ... CHECK (...) NOT VALID`, then `VALIDATE CONSTRAINT` (takes only a `SHARE UPDATE EXCLUSIVE` lock, doesn't block writes). For `NOT NULL`, add the validated `CHECK (col IS NOT NULL)` first, then promote — never `SET NOT NULL` cold on a big table, which full-scans under an `ACCESS EXCLUSIVE` lock.
4. **Build indexes and FKs concurrently / unvalidated.** `CREATE INDEX CONCURRENTLY` (and `DROP INDEX CONCURRENTLY`) so writes keep flowing; add foreign keys as `NOT VALID` then `VALIDATE CONSTRAINT` in a second step. Concurrent index builds run outside a transaction — keep them in their own migration with no other statements.
5. **Backfill in bounded batches, never one transaction.** Update in chunks (e.g. `WHERE id BETWEEN ...` or `LIMIT n` loops) committing each batch, with a short sleep between batches to spare replication and locks. Keep the backfill in a **separate migration/job** from the schema DDL so a slow backfill can't hold a DDL lock and a failed batch doesn't roll back the whole table.
6. **Write a real `down` for every `up`.** The down must actually reverse the change (drop the added column/index/constraint), or, where reversal loses data (a dropped column, a narrowed type), say so loudly and add an export/backup step to the up rather than pretending it's reversible.
7. **State the deploy ordering contract.** For each migration, note which app version it requires and which it must remain compatible with: backward-compatible (expand) migrations run **before** the code that needs them; destructive (contract) migrations run **after** all code that used the old shape is fully rolled out and confirmed.

> [!WARNING]
> A single-transaction backfill (`UPDATE big_table SET ...` with no batching) holds row locks on every touched row until commit, bloats WAL, can deadlock with live traffic, and on failure rolls back hours of work. Always batch and commit; treat any unbounded `UPDATE`/`DELETE` on a large table as a production incident waiting to happen.

> [!WARNING]
> Type changes that rewrite the table (`ALTER COLUMN ... TYPE` between incompatible types, e.g. `int → bigint` on older Postgres) take an `ACCESS EXCLUSIVE` lock and block all reads and writes for the duration. Prefer expand-contract: add a new column of the target type, backfill, switch over, drop the old — never an in-place rewrite on a hot table.

> [!NOTE]
> Don't take `ACCESS EXCLUSIVE` DDL with `lock_timeout = 0`. Set a short `lock_timeout` (e.g. `5s`) so a migration that can't grab its lock fails fast and retries, instead of queueing behind a long query and stalling every write that piles up behind it.

## Output

For the requested change, produce:
- **The `up` and `down` migration** — split into separate files per expand-contract phase, with `CONCURRENTLY` / `NOT VALID` / `VALIDATE` used where they avoid blocking locks.
- **The backfill + rollout sequence** — the ordered phases (add → dual-write → backfill → switch reads → stop old writes → drop), each tagged with the app deploy it pairs with, and the batched backfill loop as a separate step.
- **Locking & risk notes** — for each statement: the lock it takes, whether it blocks reads/writes, whether it rewrites the table, and whether the `down` is lossless — with destructive/irreversible steps called out explicitly.