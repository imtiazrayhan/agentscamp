---
title: "Indexing Postgres at Scale: B-Tree vs GIN vs BRIN and the Hidden Cost of Over-Indexing"
description: "A practical guide to choosing Postgres index types — B-Tree, GIN, BRIN, partial, and covering — and why every index you add taxes every write."
author: "AgentsCamp"
date: 2026-06-04
color: "green"
topics: ["data-ml"]
tags: ["postgres", "indexing", "database", "performance"]
featured: false
summary: "The right Postgres index depends on the query and the data shape: B-Tree for equality and ranges, GIN for multi-value columns (jsonb, arrays, full-text), BRIN for huge naturally-ordered tables. But indexes aren't free — each one is updated on every write, consumes storage, and can bloat. Index for the queries you actually run, then find and drop the ones nothing uses."
keyTakeaways:
  - "B-Tree is the default and the right answer for equality, range, sorting, and uniqueness — most indexes should be B-Tree."
  - "GIN indexes multi-value columns: jsonb containment, array membership, and full-text/trigram search — when one row holds many searchable values."
  - "BRIN is tiny and fast to maintain for very large tables whose physical order tracks a column (time-series, append-only logs) — huge space savings, lower precision."
  - "Every index taxes every write (it must be updated on INSERT/UPDATE/DELETE), takes storage, and can bloat — there is no free index."
  - "Index for the queries you actually run, then hunt down unused and redundant indexes (pg_stat_user_indexes) and drop them; over-indexing slows writes for reads that never happen."
faq:
  - q: "When should I use a GIN index in Postgres?"
    a: "Use a GIN (Generalized Inverted Index) when a single column holds many values you want to search inside: jsonb columns (containment with @>), arrays (membership), and full-text search (tsvector), as well as trigram search (pg_trgm) for fuzzy/ILIKE matching. GIN indexes each contained element, so a query can find every row containing a given key, element, or word. They're larger and slower to update than B-Tree, so use them where the column really is multi-value, not for plain scalar equality."
  - q: "When should I use a BRIN index?"
    a: "Use a BRIN (Block Range Index) on very large tables whose physical row order correlates with the column — classically time-series or append-only data indexed by timestamp or a monotonic id. BRIN stores only the min/max value per block range, so it's tiny (kilobytes where a B-Tree would be gigabytes) and cheap to maintain, at the cost of precision. It shines for range scans over huge naturally-ordered tables; it's a poor fit when the column's values are scattered randomly across the table's physical layout."
  - q: "What's the difference between B-Tree, GIN, and BRIN indexes?"
    a: "B-Tree is the general-purpose default: equality, range, ordering, and uniqueness on scalar columns. GIN is for columns containing multiple searchable values (jsonb, arrays, full-text, trigrams) — it indexes the elements inside each value. BRIN is a compact, lossy index for very large tables physically ordered by the indexed column, trading precision for a tiny footprint and cheap maintenance. Rule of thumb: B-Tree unless the column is multi-value (GIN) or the table is huge and naturally ordered (BRIN)."
  - q: "Can you have too many indexes in Postgres?"
    a: "Yes, and it's a common, invisible performance drain. Every index must be updated on every INSERT, UPDATE, and DELETE that touches its columns, so each extra index slows writes and consumes storage and maintenance (VACUUM, bloat). Redundant indexes (one whose leading columns another already covers) and unused indexes (idx_scan = 0 in pg_stat_user_indexes) add cost for no benefit. Audit periodically and drop indexes that aren't earning their keep — fewer, well-chosen indexes beat a pile of speculative ones."
related: ["guide:zero-downtime-postgres-migrations", "skill:postgres-index-strategist", "command:profile-postgres-queries", "skill:sql-optimizer", "tool:pgvector"]
---

Indexing is where Postgres performance is won or lost, and it's usually misunderstood in two directions at once: teams reach for B-Tree on everything (missing the cases where GIN or BRIN is dramatically better), and they add indexes far more eagerly than they remove them (paying a write tax for reads that never happen). Getting it right means matching the index type to the *query and the data shape*, and treating every index as a cost you have to justify.

## The index types that matter

### B-Tree — the default, and usually right

B-Tree is what `CREATE INDEX` gives you, and it's the correct answer for the large majority of cases: **equality** (`=`), **range** (`<`, `>`, `BETWEEN`), **sorting** (`ORDER BY`), and **uniqueness**. It handles scalar columns — ids, timestamps, prices, statuses — and supports multi-column indexes where the column order matters (the index serves queries that filter on a leading prefix). If you're not sure, it's B-Tree.

### GIN — for columns that hold many values

A GIN (Generalized Inverted Index) indexes the **elements inside** a value, which is what you need when one row's column contains many searchable things:

- **`jsonb`** — containment queries (`@>`), key/element lookups.
- **arrays** — membership (does this array contain X?).
- **full-text search** — `tsvector` columns matched with `@@`.
- **trigram** (`pg_trgm`) — fuzzy and `ILIKE '%term%'` matching.

GIN indexes are larger and slower to update than B-Tree, so use them precisely where the column genuinely holds multiple values to search — not for plain scalar equality.

### BRIN — tiny indexes for huge, ordered tables

A BRIN (Block Range Index) stores only the **min and max per block range** rather than an entry per row. On a very large table whose physical order tracks the indexed column — time-series, append-only logs indexed by `created_at` or a monotonic id — that makes the index *kilobytes* where a B-Tree would be gigabytes, and nearly free to maintain. The trade is precision: BRIN narrows a range scan to candidate blocks rather than pinpointing rows. It's superb for big naturally-ordered data and a poor choice when the column's values are scattered randomly across the table.

### The rest, briefly

- **Partial index** (`WHERE …`) — index only the rows you query (e.g. `WHERE status = 'active'`), shrinking the index and the write cost.
- **Covering index** (`INCLUDE (…)`) — add non-key columns so a query is satisfied from the index alone (index-only scan), no heap fetch.
- **Expression index** — index `lower(email)` or `date(created_at)` so a query using that expression is sargable.
- **GiST / Hash** — GiST for geometric/range/nearest-neighbour types; Hash for equality-only (rarely worth it over B-Tree).

## The hidden cost: every index taxes every write

Here's the part teams underweight. An index is not free storage that only helps — it's a **second structure that must be kept consistent on every write.** Each `INSERT`, `UPDATE`, and `DELETE` touching an indexed column updates the index too. So every index you add:

- **slows writes** — more work per row changed,
- **consumes storage** — sometimes as much as the table,
- **adds maintenance** — more for `VACUUM` to do, more bloat to accumulate,
- **can confuse the planner** — more options to consider, occasionally the wrong one.

Speculative "might need it" indexes are pure cost until proven otherwise. The discipline is to **index for the queries you actually run**, confirm each index is used, and remove the ones that aren't.

> [!TIP]
> Find unused indexes with `pg_stat_user_indexes` (look for `idx_scan = 0` over a representative period) and redundant ones (an index whose leading columns are already a prefix of another). Drop them with `DROP INDEX CONCURRENTLY`. A handful of well-chosen indexes outperforms a sprawl of speculative ones — on writes *and* reads.

> [!WARNING]
> Build and drop indexes on live tables with `CONCURRENTLY` to avoid locking writes — but note `CREATE INDEX CONCURRENTLY` can't run in a transaction block and can leave an `INVALID` index if it fails, which you must drop and rebuild. Always verify a concurrently-built index is valid before relying on it.

## Putting it together

Match the index to the shape of the query and the data: **B-Tree** for scalar equality/range/sort, **GIN** for multi-value columns (jsonb, arrays, full-text, trigram), **BRIN** for huge naturally-ordered tables, plus **partial/covering/expression** indexes to trim cost and enable index-only scans. Then treat indexes as a budget — every one taxes writes — and periodically prune the unused and redundant. 

To pick the right index for a specific query, the [postgres-index-strategist](/skills/database/postgres-index-strategist) skill recommends and verifies it against the plan; to find *which* queries (and missing indexes) to target first, profile the workload with [Profile Postgres Queries](/commands/perf/profile-postgres-queries). And note this is all about *scalar/text* indexing — for similarity search over embeddings stored in Postgres, the index is HNSW/IVFFlat via [pgvector](/tools/pgvector), a different tool for a different job.

## Continue exploring

- [Postgres Connection Pooling: Sizing, Timeouts, and Serverless](/guides/database/postgres-connection-pooling-guide) — Size Postgres connection pools across application instances, configure lifecycle timeouts, diagnose saturation, and choose PgBouncer or a managed pooler.
