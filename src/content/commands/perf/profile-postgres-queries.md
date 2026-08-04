---
description: "Profile a Postgres workload to find the queries actually costing you — rank by total time with pg_stat_statements, EXPLAIN the worst offenders, and recommend the highest-leverage fix."
argument-hint: "<database/connection details, a slow endpoint, or a description of the workload>"
allowed-tools: "Read, Grep, Glob, Bash"
model: "sonnet"
title: "Profile Postgres Queries"
color: "blue"
date: 2026-06-04
topics: ["data-ml"]
related: ["guide:postgres-indexing-at-scale", "skill:postgres-index-strategist", "skill:sql-optimizer", "agent:performance-engineer", "command:db-migrate"]
featured: false
summary: "A slash command that triages a Postgres workload to find the queries actually costing you: it ranks queries by total execution time via pg_stat_statements, runs EXPLAIN (ANALYZE, BUFFERS) on the worst offenders, classifies each fix — index, stale statistics, rewrite, or app-side N+1 — and reports a plan ordered by total cost."
---

## Scope

Treat `$ARGUMENTS` as the workload to profile — a database/connection, a slow endpoint or report, or a description of where the database feels slow. The job here is **triage**: find *which* queries cost the most before optimizing any one of them, so effort goes where it pays.

> [!NOTE]
> This command profiles a workload to rank its worst queries. To then fix a single slow query from its plan, hand off to the [sql-optimizer](/skills/data/sql-optimizer) skill; to choose the right index for it, the [postgres-index-strategist](/skills/database/postgres-index-strategist).

## Step 1 — Establish the data source

Prefer **`pg_stat_statements`** (the aggregated view of normalized query stats) — confirm the extension is enabled. If it isn't available, fall back to the slow-query log or a representative trace, and say so. Profiling against an empty dev database tells you nothing; use representative data and traffic.

## Step 2 — Rank by total cost, not just slowness

Pull the top queries by **`total_exec_time`** (total time spent across all calls) — the real cost driver — alongside `calls`, `mean_exec_time`, and `rows`. A fast query run a million times can outweigh a slow one run twice. Report the top offenders by total time and by call count.

## Step 3 — EXPLAIN the worst offenders

For each top query, run `EXPLAIN (ANALYZE, BUFFERS)` on a representative instance and read for the dominant cost: sequential scans on large filtered tables, estimate-vs-actual row blowups (stale statistics), nested loops over huge intermediates, or sorts spilling to disk.

## Step 4 — Classify the fix

For each, name the highest-leverage fix and route it:

- **Missing/wrong index** → an index recommendation (type matters — B-Tree vs. GIN vs. BRIN; see [postgres-index-strategist](/skills/database/postgres-index-strategist) and [Indexing Postgres at Scale](/guides/database/postgres-indexing-at-scale)).
- **Stale statistics** → `ANALYZE` the table before anything else.
- **A single slow query needing a rewrite** → [sql-optimizer](/skills/data/sql-optimizer).
- **App-side N+1** (same query, huge `calls`) → fix in the application (eager-load / batch), not the database.

## Step 5 — Report a prioritized plan

Produce a ranked table — query | total time | calls | mean | the diagnosis | the proposed fix — ordered by total cost so the team fixes the biggest win first. Quantify where you can ("this one query is 40% of total DB time").

> [!WARNING]
> Optimize by **total** time, not by the single slowest query. The query that dominates your database's load is often a moderately-fast one executed constantly — chasing the one query with the worst single-run time can spend effort where it barely moves the needle.
