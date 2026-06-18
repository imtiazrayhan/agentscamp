---
name: "connection-pool-tuner"
description: "Size and tune a database connection pool from the real constraint — the database's shared max_connections and its core count — so total connections (per-instance pool × instance count) stay safely under the cap and a too-large pool stops adding latency. Use when the app throws 'too many connections' or pool-acquire timeouts, when the DB is saturated by connection count, or when deploying to serverless."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["devops-infra"]
related: ["postgres-index-strategist", "migration-writer", "structured-logging-designer"]
featured: false
summary: "Connection pools fail two ways: too large (every instance's pool sums past the DB's max_connections and exhausts it) or naively large (a pool bigger than the DB has cores just queues, adding latency). This skill sizes the per-instance pool from concurrency and core count, does the instances-times-pool math with headroom, sets the timeouts, and routes serverless through a pooler."
faq:
  - q: "Why is a bigger connection pool often slower?"
    a: "A connection only does work when the database has a free core to run its query. Once the pool exceeds roughly the DB's core count, extra connections don't run in parallel — they queue inside the database and add context-switching overhead, so p99 latency rises while throughput stays flat or drops. A smaller pool that matches core capacity is frequently faster."
  - q: "How do I size pools for serverless where instances scale to hundreds?"
    a: "Don't give each function a large pool — N instances × pool size exhausts max_connections instantly. Put a pooler (PgBouncer in transaction mode, RDS Proxy, or a provider's serverless/HTTP driver) between the functions and the DB, keep the per-function pool at 1–2, and let the pooler multiplex many client connections onto a small set of real DB connections."
---

Connection pools fail in two opposite ways, and a "nice round number" like 100 walks into both. Too large and every app instance's pool sums past the database's shared `max_connections`, so the next deploy or traffic spike exhausts the server and *every* instance starts throwing. Naively large and the pool is bigger than the DB has cores to serve it, so the extra connections don't add parallelism — they queue inside the database and add latency. This skill sizes the **per-instance** pool from concurrency need and core count, does the `instances × pool ≤ max_connections` arithmetic with real headroom, sets the timeouts that recycle dead connections, and sends serverless through a pooler instead of multiplying pools.

## When to use this skill

- The app logs `FATAL: too many connections` / `remaining connection slots are reserved`, or pool-acquire timeouts ("timed out fetching a connection from the pool").
- The database is saturated by connection *count* (high `pg_stat_activity` rows, memory pressure from per-connection backends) rather than by slow queries.
- You scaled out app instances or autoscaling kicked in, and the DB started erroring even though per-instance load looks fine.
- You're deploying to serverless / many short-lived instances (Lambda, Vercel functions, Cloud Run) and need a connection strategy.
- Standing up a new service and picking a pool size before it hits production.

## Instructions

1. **Find the real ceiling first.** Read the database's `max_connections` (Postgres `SHOW max_connections`, MySQL `max_connections`) — this is shared across *everything*: every app instance, background workers, migrations, replicas, admin/`psql` sessions, and the monitoring agent. Postgres also reserves `superuser_reserved_connections`. Treat the usable budget as roughly `max_connections − reserved − headroom`, not the raw number.
2. **Count every connection source, not just the web app.** Total connections = (per-instance pool × app instance count) + worker/cron pools + replicas + migration tooling + a margin for admin sessions and a deploy overlap (old and new instances live simultaneously during rolling deploys — pools effectively double for that window). Enumerate each source by grepping for pool config (`max`, `pool_size`, `maximumPoolSize`, `DATABASE_URL`, `?connection_limit=`).
3. **Size the per-instance pool from concurrency, capped by cores — not by a big round number.** A connection only does work when the DB has a free core to run its query. The starting heuristic for a CPU-bound OLTP workload is near the DB's core count *for the whole fleet*, so per-instance pool ≈ `(useful_DB_concurrency) / instance_count`, often a small single-digit number. Going higher doesn't buy parallelism — it buys a queue. For I/O-bound queries (lots of waiting) you can go somewhat above core count, but measure rather than assume.
4. **Do the exhaustion arithmetic explicitly and leave headroom.** Compute `instances × pool + other_sources` and confirm it stays under the usable budget *at max autoscale*, not at average instance count. Size against the ceiling the autoscaler can reach, then keep ~20–30% of `max_connections` free for migrations, admin, replication, and deploy overlap. If the math doesn't fit, shrink the pool before raising `max_connections` (each Postgres backend costs real memory).
5. **Set the four timeouts deliberately — defaults leak or stall.**
   - **Acquire / pool timeout** — how long a request waits for a free connection before failing fast (e.g. a few seconds). Without it, a saturated pool turns into unbounded queueing and looks like a hang.
   - **Idle timeout** — return idle connections so the pool shrinks under low load and you're not holding slots the DB could give elsewhere.
   - **Max lifetime** — recycle each connection after a bounded age (e.g. 30 min) so a load balancer / DNS failover / DB restart doesn't leave stale half-dead connections in the pool.
   - **Min / idle floor** — keep a small warm minimum to avoid connect latency on the first request, but not so high that idle instances hoard the budget.
6. **Handle serverless and many-instances specially — route through a pooler.** When instance count is large or unbounded (one pool per function invocation), per-instance pools multiply faster than any safe per-instance number can absorb. Don't fix it by shrinking the per-function pool to 1 alone — put a pooler between the app and the DB: PgBouncer in **transaction** mode, RDS Proxy, Supabase's pooler, or a provider serverless/HTTP driver. The pooler multiplexes hundreds of client connections onto a small set of real DB connections; keep the per-function pool at 1–2 behind it.

> [!WARNING]
> Scaling out app instances silently multiplies total connections. A pool of 20 that's fine on 3 instances (60) exhausts a 100-connection DB the moment the autoscaler reaches 5 instances — and it fails *everywhere at once*, not gracefully. Always size against **max autoscale × pool**, plus the deploy-overlap doubling, never average instance count.

> [!WARNING]
> A bigger pool is frequently *slower*, not faster. Past the DB's effective core count, added connections don't run in parallel — they queue inside the database and add context-switching overhead, raising p99 latency while throughput stays flat. If the pool is large and the DB is CPU-bound, the fix for latency is usually to *shrink* the pool.

> [!NOTE]
> Transaction-mode poolers (PgBouncer) break features that hold state across statements on one connection: session-level `SET`, advisory locks, `LISTEN/NOTIFY`, and some prepared-statement modes. Use session mode (or a dedicated direct connection) for those paths, and run migrations against the DB directly, not through the transaction pooler.

## Output

A pool-sizing recommendation, concretely:
- **The math** — usable budget (`max_connections − reserved − headroom`), and `instances_at_max_autoscale × per_instance_pool + other_sources` shown to land under it with the headroom stated.
- **Recommended per-instance pool size** with the rationale (concurrency need vs. DB core count, and which workload type it is), plus separate sizes for worker/cron pools.
- **Timeout/lifetime settings** — acquire timeout, idle timeout, max lifetime, and min/idle floor, with the value and why each is set.
- **Serverless recommendation if applicable** — the specific pooler (PgBouncer transaction mode / RDS Proxy / serverless driver), the per-function pool size behind it, and any session-mode caveats for stateful paths.