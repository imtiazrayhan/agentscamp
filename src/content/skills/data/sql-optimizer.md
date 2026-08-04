---
name: "sql-optimizer"
description: "Diagnose a slow SQL query from its execution plan and propose a verified optimization — finding the real bottleneck (sequential scan, missing or unused index, bad join order, app-side N+1) and measuring the fix before and after. Use when a query is slow and you need a fix backed by EXPLAIN ANALYZE, not a guess."
date: 2026-06-03
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["data-ml"]
related: ["agent:sql-pro", "agent:performance-engineer"]
featured: false
summary: "A skill that diagnoses a slow SQL query from its real execution plan: it captures an EXPLAIN ANALYZE baseline, reads the plan for the actual bottleneck — sequential scan, stale statistics, non-sargable predicate, bad join order, or app-side N+1 — proposes one targeted fix, and re-runs the identical plan to prove the improvement."
---

Take a slow SQL query and find out *why* it is slow from the database's own execution plan, then fix the actual bottleneck instead of the first thing that looks suspicious. The skill runs `EXPLAIN` (and `EXPLAIN ANALYZE` where safe), reads the plan to locate the dominant cost — a sequential scan over a large table, an index the planner refused to use, a join order that materializes millions of rows before filtering, or an app-side N+1 firing the same query in a loop — and proposes one concrete change: a rewrite, an index, a statistics refresh, or a fetch-pattern fix. Every proposal is measured before and after on the real plan, so you ship a change you have proven, not one you hoped would help.

## When to use this skill

- A specific query (a slow endpoint, a report, a migration step) is too slow and you need to know exactly which operation in its plan is the cost.
- You suspect a missing index, an unused index, or a query the planner is mis-estimating, and want it confirmed from `EXPLAIN ANALYZE` rather than intuition.
- The same query appears many times in a request trace (an N+1), and you need to prove it and collapse it into one set-based query or a batched fetch.
- A query regressed after a data-volume increase, a schema change, or a deploy, and you want the before/after plan to localize the cause.

> [!NOTE]
> `EXPLAIN ANALYZE` (Postgres / MySQL 8+) **executes the query** to get real row counts and timings; in SQL Server the equivalent is enabling the actual execution plan (`SET STATISTICS PROFILE ON` or `SET STATISTICS XML ON`). On a write statement (`UPDATE`/`DELETE`/`INSERT`) or a heavy read this has side effects and cost — wrap writes in a `BEGIN; ... ROLLBACK;` or run plain `EXPLAIN` first. Refreshing optimizer statistics is a separate operation: `ANALYZE table` in Postgres/MySQL, `UPDATE STATISTICS` in SQL Server. Always measure against representative data; a plan on an empty dev table tells you nothing.

## Instructions

1. **Locate the query and capture its cost.** Find the exact SQL — in a `.sql` file, an ORM call, a migration, or a log line. Run `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)` (Postgres) / `EXPLAIN ANALYZE` (MySQL 8+) / the engine equivalent and save the plan as your baseline. Record total time, the dominant node, and its share of the cost.
2. **Detect the engine and conventions — do not guess.** Identify the database (Postgres, MySQL/MariaDB, SQLite, SQL Server) from the driver, connection string, or migration files, since plan syntax, index types, and hint support differ. Note that SQLite only offers a static `EXPLAIN QUERY PLAN` (no runtime row counts), so before/after timing on SQLite must come from wall-clock query runs rather than plan output. Check existing indexes (`\d table` / `SHOW INDEX FROM table` / `pg_indexes`) and the migration history before proposing a new one — match the project's naming and migration tooling rather than hand-writing `CREATE INDEX` out of band.
3. **Read the plan for the *real* bottleneck.** Work from the most expensive node, not the top:
   - **Seq Scan / Full Table Scan** on a large table with a selective filter → a usable index is missing or not chosen.
   - **Estimated vs. actual rows wildly off** (e.g. `rows=10` but `actual rows=900000`) → stale statistics; run `ANALYZE table` / `ANALYZE TABLE` before anything else.
   - **Index Scan present but slow** → low selectivity, a non-covering index forcing heap fetches, or a leading-column mismatch.
   - **Nested Loop over many rows / huge intermediate result** → bad join order or a missing join-key index; a `Hash Join` may be cheaper.
   - **Same query repeated N times in a trace** → app-side N+1; the fix is in the code (eager load / `JOIN` / `IN (...)`), not the database.
4. **Propose one targeted change.** Pick the single highest-leverage fix: add a composite or covering index matching the filter + sort columns in the right order; rewrite to make a predicate `sargable` (no function wrapping the indexed column, no leading-wildcard `LIKE`); replace `OFFSET`-based paging with keyset pagination; or collapse an N+1 into a set-based query. Prefer a query rewrite or statistics fix over a new index when it resolves the plan — every index has write and storage cost.
5. **Verify by re-running the plan.** Apply the change (indexes inside a transaction or against a copy where possible) and re-run the identical `EXPLAIN ANALYZE`. Confirm the expensive node changed (Seq Scan → Index Scan), estimates now match actuals, and total time dropped. A change that does not move the plan is not a fix — discard it.
6. **Report before/after and flag gaps.** State the baseline time, the bottleneck node, the change, and the measured new time. Note any caveat the user must own: an index that slows writes, a fix that only helps at current data volume, a rewrite that changes `NULL`/ordering semantics, or an N+1 that needs an application change you cannot make from SQL alone.

> [!WARNING]
> An index only helps if the predicate is **sargable** and its leading column matches. `WHERE date(created_at) = '2026-01-01'` or `WHERE email LIKE '%@acme.com'` cannot use a normal B-tree index — the function or leading wildcard forces a scan. Fix the predicate (range on the raw column, or an expression/trailing-wildcard index) instead of adding an index the planner will ignore.

## Examples

A query filtering and sorting orders for one customer is taking ~480 ms. The baseline plan shows the cost:

```text
EXPLAIN ANALYZE
SELECT id, total, created_at
FROM orders
WHERE customer_id = 4815 AND status = 'shipped'
ORDER BY created_at DESC
LIMIT 20;

Limit  (cost=38120.55..38120.60 rows=20) (actual time=478.9..478.9 rows=20 loops=1)
  ->  Sort  (cost=38120.55..38255.7 rows=54061) (actual time=478.9..478.9 rows=20)
        Sort Key: created_at DESC
        Sort Method: top-N heapsort  Memory: 28kB
        ->  Seq Scan on orders  (cost=0.00..36680.00 rows=54061) (actual time=0.1..441.2 rows=53992 loops=1)
              Filter: (customer_id = 4815 AND status = 'shipped')
              Rows Removed by Filter: 1946008   <-- scanned 2M rows to keep 54k
Planning Time: 0.20 ms
Execution Time: 479.3 ms
```

The bottleneck is the **Seq Scan** discarding ~1.9M rows, not the sort. A composite index on the filter columns plus the sort column lets the planner satisfy the filter, ordering, and `LIMIT` from the index alone:

```sql
CREATE INDEX CONCURRENTLY idx_orders_customer_status_created
  ON orders (customer_id, status, created_at DESC);
```

Re-running the identical `EXPLAIN ANALYZE` confirms the fix — the scan is gone and the `LIMIT` stops after 20 rows:

```text
Limit  (cost=0.56..33.9 rows=20) (actual time=0.05..0.31 rows=20 loops=1)
  ->  Index Scan using idx_orders_customer_status_created on orders
        (actual time=0.04..0.29 rows=20 loops=1)
        Index Cond: (customer_id = 4815 AND status = 'shipped')
Execution Time: 0.41 ms        -- 479 ms -> 0.4 ms (~1100x)
```

Report the result and the caveat: 479 ms → 0.4 ms, Seq Scan → Index Scan, no rows discarded; the new index adds a small write cost on `orders` inserts/updates, which is justified here since this query runs on every customer page load.
