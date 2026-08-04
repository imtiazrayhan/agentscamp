---
title: "8 Best Claude Skills for Database Work"
description: "Compare Claude skills for safe migrations, data backfills, indexes, query plans, pooling, deadlocks, vector search, and SQL tuning."
author: "AgentsCamp"
date: 2026-08-04
color: "blue"
topics: ["data-ml", "devops-infra"]
tags: ["claude-skills", "databases", "sql", "postgres", "migrations", "performance"]
featured: true
seoTitle: "8 Best Claude Skills for Database Work"
seoDescription: "Find practical Claude skills for database migrations, safe backfills, Postgres indexes, query plans, connection pools, deadlocks, vectors, and SQL."
summary: "For database work, install migration-writer and safe-data-backfill-planner first: schema rollout and historical data movement have different risks. Add query-plan-analyzer and postgres-index-strategist for performance, connection-pool-tuner and deadlock-diagnoser for production behavior, and specialist skills for vector or general SQL workloads."
keyTakeaways:
  - "Treat schema migration and data backfill as separate procedures with separate rollback and verification plans."
  - "Inspect an actual query plan before proposing an index; plausible SQL advice is not execution evidence."
  - "Backfills need bounded batches, resumability, observability, throttling, and coexistence with live traffic."
  - "Connection pools must be budgeted across the entire fleet, including deploy overlap and operational headroom."
  - "Require explicit approval before applying migrations, running backfills, or changing a production database."
faq:
  - q: "What is the best Claude skill for a production database migration?"
    a: "Use migration-writer for an expand-contract schema plan with compatibility and rollback checks. If existing rows must be transformed, use safe-data-backfill-planner separately for batching, checkpoints, throttling, and reconciliation."
  - q: "Can Claude run a database migration automatically?"
    a: "The skills can draft and validate migration artifacts, but production execution should require explicit approval, a resolved target environment, backups or recovery strategy, observability, and a rehearsed rollback path."
  - q: "Should I use query-plan-analyzer or sql-optimizer?"
    a: "Use query-plan-analyzer when you have EXPLAIN or EXPLAIN ANALYZE output and need evidence tied to one execution plan. Use sql-optimizer for broader query rewrites and SQL-level improvements, then validate the result with a plan and representative workload."
  - q: "Why is a backfill not just a migration?"
    a: "A backfill may scan and update millions of live rows over hours or days. It needs batching, restart checkpoints, rate limits, progress metrics, reconciliation, and application compatibility beyond the schema transition itself."
related: ["best-claude-skills-2026", "safe-data-backfill-planner", "migration-writer", "query-plan-analyzer", "postgres-index-strategist", "deadlock-diagnoser"]
---

The best Claude database skills make risky work reviewable before anything touches production. They inspect repository conventions, ask for the actual engine and workload, produce explicit verification queries, and distinguish a reversible file change from a live data operation.

Start with the failure mode you face rather than asking Claude to “optimize the database.”

| Skill | Best for | Evidence needed | Writes or executes? |
| --- | --- | --- | --- |
| [migration-writer](/skills/database/migration-writer) | Schema evolution | Schema, deploy order, compatibility | Writes migration files |
| [safe-data-backfill-planner](/skills/database/safe-data-backfill-planner) | Existing-row transformation | Cardinality, load, target invariant | Plan only |
| [query-plan-analyzer](/skills/database/query-plan-analyzer) | One slow query | Actual execution plan | Analysis only |
| [postgres-index-strategist](/skills/database/postgres-index-strategist) | Postgres index design | Query shapes and workload | Recommendation |
| [connection-pool-tuner](/skills/database/connection-pool-tuner) | Pool waits and saturation | Fleet and database metrics | Recommendation |
| [deadlock-diagnoser](/skills/database/deadlock-diagnoser) | Transaction deadlocks | Engine deadlock report | Analysis only |
| [embedding-index-tuner](/skills/database/embedding-index-tuner) | Vector search | Recall, latency, corpus data | Experiment plan |
| [sql-optimizer](/skills/data/sql-optimizer) | General SQL performance | Query, schema, representative data | May edit queries |

## 1. migration-writer: evolve schemas compatibly

[migration-writer](/skills/database/migration-writer) produces migrations that fit the repository's tool and naming conventions. For production systems, it favors expand-contract sequencing: add a compatible shape, deploy code that can handle both states, migrate usage or data, then remove the old shape only after verification.

It is the right skill for tables, columns, constraints, and schema objects—not for pushing a long-running rewrite through every historical row.

## 2. safe-data-backfill-planner: move historical data safely

[safe-data-backfill-planner](/skills/database/safe-data-backfill-planner) turns a data invariant into a bounded operational plan. It defines selection order, batch size, transaction scope, checkpointing, retries, throttling, progress signals, pause conditions, reconciliation, and coexistence with concurrent writes.

The skill plans the backfill but does not silently run it. That boundary matters when the target database or workload is not fully known.

## 3. query-plan-analyzer: explain the slow path

[query-plan-analyzer](/skills/database/query-plan-analyzer) reads actual plan nodes, estimates versus observed rows, scan types, joins, loops, sorts, memory or disk use, and time concentration. It ties each recommendation to plan evidence and defines what a better plan should look like.

## 4. postgres-index-strategist: choose the right index

[postgres-index-strategist](/skills/database/postgres-index-strategist) maps predicates, joins, sort order, selectivity, and write cost to a Postgres index design. It can reason about composite order, partial indexes, covering columns, GIN, GiST, BRIN, and redundancy—but should always finish with a plan to validate against representative data.

## 5. connection-pool-tuner: budget concurrency

[connection-pool-tuner](/skills/database/connection-pool-tuner) calculates the total connection demand across replicas, workers, serverless instances, deploy overlap, and administrative reserve. It separates pool wait from query time and helps choose acquire, idle, and lifetime behavior.

## 6. deadlock-diagnoser: reconstruct the lock cycle

[deadlock-diagnoser](/skills/database/deadlock-diagnoser) starts from the database engine's deadlock report. It identifies the participating transactions, resources, acquisition order, and cycle, then recommends a stable ordering or smaller transaction boundary. A generic “retry on deadlock” can reduce symptoms, but it does not remove the underlying cycle.

## 7. embedding-index-tuner: balance recall and latency

[embedding-index-tuner](/skills/database/embedding-index-tuner) designs a parameter sweep for approximate-nearest-neighbor indexes. It measures recall against a ground-truth set and balances latency, memory, build time, and filtering behavior instead of selecting HNSW or IVF parameters by folklore.

## 8. sql-optimizer: improve the query shape

[sql-optimizer](/skills/data/sql-optimizer) addresses broad SQL problems such as repeated subqueries, accidental row multiplication, non-sargable predicates, unnecessary scans, and poor aggregation shape. Pair its rewrite with `query-plan-analyzer` to prove the improvement on the real engine.

## Recommended database stack

Most teams should install four complementary skills: schema change, data movement, execution-plan analysis, and index design.

```bash
npx agentscamp add skills/migration-writer
npx agentscamp add skills/safe-data-backfill-planner
npx agentscamp add skills/query-plan-analyzer
npx agentscamp add skills/postgres-index-strategist
```

Before execution, require Claude to state the database target, lock or load risks, compatibility window, abort threshold, verification query, and recovery path. If any of those are unknown, the next output should be a question or rehearsal plan—not a production command.
