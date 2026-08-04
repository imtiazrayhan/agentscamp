---
name: "query-plan-analyzer"
description: "Read a slow query's execution plan and turn it into a concrete fix — the exact index to add, the rewrite, or the ANALYZE to run — by getting the REAL plan with EXPLAIN ANALYZE (actual rows + timing, not estimates), finding the offending node, and confirming the fix removes it. Use when one specific query is slow and you need to know WHY, not just that it is."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["devops-infra"]
related: ["skill:postgres-index-strategist", "skill:connection-pool-tuner", "skill:migration-writer"]
featured: false
summary: "A slow query is rarely slow for the reason you assume. This skill reads the REAL plan (EXPLAIN ANALYZE + BUFFERS, not bare EXPLAIN guesses), works from the most expensive node outward, names the real culprit — Seq Scan, stale-stats row gap, Nested Loop blowup, disk Sort, an index defeated by a cast — gives the specific fix, and re-runs to prove the bad node is gone."
faq:
  - q: "Why isn't bare EXPLAIN enough to diagnose a slow query?"
    a: "Bare EXPLAIN prints the planner's cost model GUESS — estimated rows and cost — but never runs the query, so it can't show where time actually went or whether the estimates were wildly wrong. EXPLAIN ANALYZE executes the query and reports actual rows and per-node timing, which is the only way to see a Nested Loop that estimated 5 rows but processed 500,000, or a node that the planner thought was cheap but dominated runtime. Always diagnose with ANALYZE; never tune from estimates alone."
  - q: "I added the index but the planner still does a Seq Scan — why?"
    a: "Either the index can't serve the predicate (a function/cast on the column like lower(email) or date(created_at), or a leading-wildcard LIKE '%x', is not sargable so a plain b-tree on the raw column is useless), the statistics are stale so the planner mis-estimates and thinks the scan is cheaper, or the query genuinely returns a large fraction of the table where a Seq Scan IS correct. Check sargability first, run ANALYZE, then re-EXPLAIN ANALYZE before assuming the index is wrong."
---

A slow query is almost never slow for the reason you'd guess from reading the SQL. The plan is the ground truth: it shows the database actually chose a Seq Scan over the 40-million-row table, actually fed 500,000 rows into a Nested Loop that estimated 5, actually sorted on disk because no index could supply the order. This skill pulls the **real** plan — `EXPLAIN ANALYZE` with `BUFFERS`, not bare `EXPLAIN` — reads it from the most expensive node outward, names the one node that's costing the time and *why*, and turns that into a specific fix: the index to add (with the right column order), the rewrite that makes the predicate sargable, or the `ANALYZE` that fixes the estimate. Then it re-runs the plan to prove the bad node is gone instead of declaring victory from theory.

## When to use this skill

- One specific query (an endpoint, a report, a dashboard panel) is slow and you need the cause, not a vague "add some indexes."
- A query that was fast got slow after a data-volume change, a deploy, or a schema/index change.
- The planner is doing something surprising — a Seq Scan despite an index existing, or ignoring the index you just added.
- p99 latency on one query is high while the table and load look unremarkable, and you suspect the plan rather than the hardware.
- Before shipping a new query or a `migration-writer` index change, to verify the plan is what you intended.

## Instructions

1. **Get the table shape and existing indexes before touching the plan.** Read the schema for the queried tables: column types, the existing indexes and their column order, row counts (`SELECT reltuples FROM pg_class`, or `\d+`), and whether stats are fresh (`pg_stat_user_tables.last_analyze` / `n_mod_since_analyze`). Grep the codebase for where the query is built so you tune the real SQL (including how parameters bind), not a hand-typed approximation.
2. **Run the REAL plan with actual rows, timing, and I/O — never bare EXPLAIN.** Use `EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)` in Postgres (`ANALYZE FORMAT=TREE` / `EXPLAIN ANALYZE` in MySQL 8+). `ANALYZE` *executes* the query and reports actual rows + per-node `actual time`; `BUFFERS` shows shared/local hits vs. reads (heavy `read=` means I/O, not CPU, is the cost). Run it 2–3 times so a cold-cache first run doesn't masquerade as a planning problem. For a write query, wrap it in a transaction and `ROLLBACK` so `ANALYZE` doesn't mutate data.
3. **Read from the most expensive node outward — find where the time actually is.** In the text plan, `actual time=start..end` is cumulative and inclusive of children; the time a node *adds* is its end-time minus its children's. Find the deepest/innermost node whose `actual time` and `loops × rows` dominate the total. That node — not the top of the plan — is what you fix. Note its `actual rows`, `loops`, and the `Rows Removed by Filter` line.
4. **Check the estimate-vs-actual gap FIRST — a wide gap means stale stats, and that's the real bug.** Compare each node's estimated rows (`rows=`) to `actual rows`. A gap of more than ~10x (e.g. plans for 5 rows, processes 50,000) means the planner is choosing strategy on bad information — usually stale statistics. **Fix this before adding any index:** run `ANALYZE <table>;` (or `ANALYZE` the whole DB) and re-pull the plan. Often the plan corrects itself once estimates are right, and an index you'd have added would have been the wrong one.
5. **Match the symptom to the culprit, then to the fix:**
   - **Seq Scan on a large table with a selective predicate** → the predicate filters to few rows but there's no usable index. Add a b-tree on the filtered column(s). (A Seq Scan returning most of the table is *correct* — don't index it.)
   - **Nested Loop with high `loops` over many outer rows** → the join is iterating per-row when it should batch. The cause is usually a bad row estimate (see step 4) or a missing join-key index; a corrected estimate or an index on the inner join column lets the planner pick a Hash/Merge Join.
   - **Sort (especially `Sort Method: external merge  Disk:`)** → the query sorts at runtime and spills to disk. A b-tree index in the `ORDER BY` order can supply rows pre-sorted, removing the Sort node entirely (and powering `LIMIT` early-exit).
   - **High `Rows Removed by Filter`** → the database fetched far more rows than it kept; the filter ran *after* the scan instead of being pushed into an index. Move the discriminating column into the index so it's a condition, not a post-filter.
   - **Heavy `Buffers: ... read=`** → the working set isn't cached; a smaller/covering index reduces pages touched, or the data genuinely doesn't fit memory.
6. **Check index sargability — an index the predicate can't use is no fix at all.** A b-tree is defeated by a function or cast on the column (`lower(email) = ?`, `date(created_at) = ?`, `col::text = ?`), by a leading-wildcard `LIKE '%x'`, and by an `OR` across different columns. The fix is a matching **expression index** (`CREATE INDEX ... ON t (lower(email))`), a rewrite to a range (`created_at >= d AND created_at < d+1`), or `UNION`-ing the `OR` branches — not a plain index on the raw column.
7. **Order multi-column index columns for the predicate, then the sort.** Put equality-predicate columns first (leftmost), then the range/inequality column, then `ORDER BY` columns — so one index serves both the filter and the ordering. A column used only for a range can't have an equality column usefully placed after it. State the exact `CREATE INDEX` DDL, including `INCLUDE`d columns if a covering index would turn an Index Scan into an Index-Only Scan.
8. **Re-run `EXPLAIN ANALYZE` after the fix and confirm the bad node is gone.** Apply the fix (in Postgres, build the index `CONCURRENTLY` to avoid a write lock; `migration-writer` can wrap the DDL). Re-pull the plan and verify the offending node changed type (Seq Scan → Index Scan, Nested Loop → Hash Join, Sort → no Sort) and that total `actual time` dropped. If the planner *ignores* the new index, run `ANALYZE` and re-check sargability before concluding the index is wrong.

> [!WARNING]
> Bare `EXPLAIN` shows the planner's *guess*, not reality — it never runs the query, so it can't reveal a Nested Loop that estimated 5 rows and processed half a million, or which node actually burned the time. Diagnose with `EXPLAIN ANALYZE` every time; tuning from estimates is how you add the wrong index.

> [!WARNING]
> A wide estimated-vs-actual row gap (>10x) means stale statistics, and that is the root cause — fix it with `ANALYZE` *before* adding indexes. An index chosen to compensate for a bad estimate is often useless or harmful once the estimate is corrected, and you'll have shipped a write-amplifying index that the planner ignores.

> [!NOTE]
> `EXPLAIN ANALYZE` executes the statement. For `INSERT`/`UPDATE`/`DELETE`, run it inside `BEGIN; ... ROLLBACK;` so diagnosis doesn't change data — and be aware it still fires triggers and acquires locks during the run.

## Output

A short report with three parts:

1. **Annotated plan** — the offending node quoted from the `EXPLAIN ANALYZE` output, with its `actual rows` vs. estimate, `loops`, `Rows Removed by Filter`, and `Buffers`, plus a one-line statement of *why* it's the bottleneck (Seq Scan / stale-stats row gap / Nested Loop blowup / disk Sort / non-sargable predicate).
2. **The specific fix** — exact `CREATE INDEX ... CONCURRENTLY` DDL with the column order justified, or the SQL rewrite, or the `ANALYZE <table>` command. One concrete action, not a menu.
3. **Before/after proof** — total `actual time` and the changed node type from the re-run plan (e.g. `Seq Scan 1240 ms → Index Scan 3 ms`), confirming the bad node is gone rather than asserting it should be.
