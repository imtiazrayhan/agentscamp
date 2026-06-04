---
name: "postgres-index-strategist"
description: "Recommend the right Postgres index for a query or workload — choosing B-Tree vs. GIN vs. BRIN vs. partial/covering/expression, checking for redundant or unused indexes, and verifying the choice against the query plan. Use when a query needs an index, when deciding an index type for jsonb/array/full-text/time-series data, or when auditing an over-indexed table."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-04
topics: ["data-ml"]
related: ["postgres-indexing-at-scale", "profile-postgres-queries", "sql-optimizer", "sql-pro", "pgvector"]
featured: false
summary: "Picks the right Postgres index instead of defaulting to B-Tree on everything: it matches the index type to the query and data shape (B-Tree/GIN/BRIN/partial/covering/expression), flags redundant and unused indexes that only tax writes, and verifies the recommendation against EXPLAIN — because the wrong index type is as wasteful as no index."
---

Most Postgres index problems are one of two mistakes: reaching for B-Tree when the column is multi-value (jsonb, array, full-text) and a GIN would be transformative, or piling on speculative indexes that tax every write for reads that never happen. This skill matches the **index type to the query and the data shape**, prunes the indexes that aren't earning their keep, and verifies the choice against the actual plan — so you add the index that helps and skip the one that just costs.

## When to use this skill

- A query is slow and you suspect a missing or wrong-type index.
- You're indexing `jsonb`, arrays, full-text (`tsvector`), trigram/`ILIKE`, or a huge time-series table and need to choose between B-Tree, GIN, and BRIN.
- A table feels over-indexed — slow writes, lots of indexes — and you want to find redundant or unused ones to drop.
- Designing indexes for a new table's expected query patterns.

## Instructions

1. **Start from the query, not the column.** Collect the actual `WHERE`, `JOIN`, `ORDER BY`, and the operators used (`=`, range, `@>`, `@@`, `ILIKE`, array membership). The operator and selectivity decide the index type — index the workload, not the schema in the abstract.
2. **Match type to shape.**
   - **B-Tree** — scalar equality, ranges, sorting, uniqueness (the default; most indexes).
   - **GIN** — `jsonb` containment, array membership, full-text `tsvector`, trigram (`pg_trgm`) for fuzzy/`ILIKE '%x%'`.
   - **BRIN** — very large tables physically ordered by the column (time-series, append-only by `created_at`/monotonic id).
   - **Partial** (`WHERE`) when queries always filter a subset; **covering** (`INCLUDE`) for index-only scans; **expression** index for `lower(col)` / `date(col)` predicates.
3. **Get multi-column order right.** For composite B-Tree indexes, put equality columns before range/sort columns, and lead with the column queries filter on. A leading-column mismatch makes the index unusable for the query.
4. **Check for redundancy and waste before adding.** Inspect existing indexes (`\d table`, `pg_indexes`) and usage (`pg_stat_user_indexes` — `idx_scan = 0` is unused). Don't add an index whose job a prefix of an existing one already does; flag redundant/unused indexes to drop (with `DROP INDEX CONCURRENTLY`).
5. **Verify against the plan.** Apply the index (on a copy or with `CONCURRENTLY`) and re-run `EXPLAIN (ANALYZE, BUFFERS)` to confirm the planner uses it and the cost drops. An index the planner ignores — wrong type, non-sargable predicate, poor selectivity — is not a fix; reconsider rather than keep it.
6. **State the write cost.** Every index slows writes and uses storage. Recommend the smallest set that serves the queries, and name the trade for each index kept.

> [!WARNING]
> An index only helps a **sargable** predicate whose leading column matches. `WHERE date(created_at) = …` or `WHERE email ILIKE '%@acme.com'` can't use a plain B-Tree — fix the predicate or use the right index (expression index, or GIN+trigram) instead of adding one the planner will ignore.

> [!NOTE]
> This skill covers scalar/text indexing. For nearest-neighbour search over embeddings stored in Postgres, the index is HNSW/IVFFlat via [pgvector](/tools/pgvector) — tune those parameters with the [Embedding Index Tuner](/skills/database/embedding-index-tuner) instead.

## Output

A concrete index recommendation: the index type and definition (with column order), the rationale tied to the query and data shape, any redundant/unused indexes to drop, and an EXPLAIN before/after confirming the planner uses it and the cost fell — plus the write-cost trade-off for each index kept.
