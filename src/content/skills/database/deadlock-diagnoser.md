---
name: "deadlock-diagnoser"
description: "Diagnose a database deadlock from the engine's own deadlock report, reconstruct the lock cycle (A holds 1 wants 2, B holds 2 wants 1), name the root cause — almost always two code paths locking the same rows in different orders — and fix it with consistent lock ordering, shorter transactions, and a retry-the-victim safeguard. Use when the DB logs deadlock errors, when transactions intermittently fail under load, or when queries mysteriously block each other."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["devops-infra"]
related: ["skill:query-plan-analyzer", "skill:connection-pool-tuner", "skill:migration-writer"]
featured: false
summary: "A deadlock is never random — it's a cycle the engine already mapped for you. This skill reads the real deadlock report (Postgres log / SQL Server graph), reconstructs who held and wanted which lock, names the inconsistent lock-acquisition order behind it, fixes the order (or shortens the transaction), and adds retry-the-victim so transient contention can't take the app down."
faq:
  - q: "If I just retry the deadlock victim, isn't the problem solved?"
    a: "No — retries are a safety net, not the fix. Deadlocks can never be 100% eliminated, so every app SHOULD retry the victim with backoff because it's a transient, safe-to-retry error. But retries layered on top of inconsistent lock ordering only convert deadlocks into a storm of rollbacks and re-runs under load: throughput collapses, latency spikes, and you've hidden the real bug instead of fixing it. Fix the lock-acquisition order first; keep the retry as the last-resort guard for the deadlocks you genuinely can't design away."
  - q: "Why do two transactions deadlock when each touches the same rows?"
    a: "Touching the same rows is fine; touching them in different ORDERS is what deadlocks. If transaction A updates row 1 then row 2, and transaction B updates row 2 then row 1, they can each grab their first lock and then block forever waiting on the other's — a cycle. The same two transactions that always acquire rows in the same order (e.g. ascending by primary key) simply queue: one waits, the other commits, then the first proceeds. Consistent ordering turns a deadlock into a harmless short wait."
---

A deadlock looks random from the application — a transaction that worked a thousand times suddenly errors out under load — but the database already did the forensics for you. When the engine detects a cycle it picks a victim, rolls it back, and logs *exactly* who held what and waited on what. This skill reads that report instead of guessing: it pulls the Postgres deadlock log lines (or the SQL Server deadlock graph / `innodb status` in MySQL), reconstructs the cycle (A holds lock 1 and wants lock 2 while B holds 2 and wants 1), and names the real root cause — which is almost always two code paths acquiring the **same** rows or tables in **different** orders. Then it fixes the cause: enforce one consistent lock-acquisition order everywhere, shrink the lock window so the race rarely opens, and add a retry-the-victim safeguard for the deadlocks you can't design away — in that priority, because retries without ordering just trade a deadlock for a rollback storm.

## When to use this skill

- The database log shows `deadlock detected` (Postgres), a deadlock graph / error 1205 (SQL Server), or `Deadlock found when trying to get lock` (MySQL/InnoDB).
- A transaction intermittently fails or auto-retries only under concurrency — fine in dev, flaky in production at peak.
- Two queries or endpoints mysteriously block each other, or you see processes stuck in a lock wait that times out.
- You're adding a write path that touches multiple rows/tables and want to confirm it locks in the same order as existing code before it ships.
- Lock contention (not a true cycle) is serializing throughput, and you need to tell genuine deadlocks apart from long lock waits.

## Instructions

1. **Get the engine's deadlock report — don't reconstruct from app logs.** In Postgres, read the server log around the error: it prints both processes, their full SQL statements, and the `Process N waits for <lockmode> on <relation/tuple>; blocked by process M` lines for each side of the cycle (raise `log_lock_waits = on` and `deadlock_timeout` context if it's terse). In SQL Server, pull the deadlock graph from the `system_health` Extended Events session or a trace — it lists each `process` with its `inputbuf` (the statement) and the `resource-list` of locks owned vs. requested. In MySQL/InnoDB, run `SHOW ENGINE INNODB STATUS` and read the `LATEST DETECTED DEADLOCK` section. This report is ground truth; the app's stack trace only tells you which transaction lost.
2. **Reconstruct the cycle explicitly: who HELD what, who WANTED what.** Write it out as a two-column picture — `Txn A: holds <lock on resource 1>, waits for <lock on resource 2>` / `Txn B: holds <lock on resource 2>, waits for <lock on resource 1>`. Identify the exact resources (which rows/index ranges/tables) and the lock modes (row `FOR UPDATE`/exclusive vs. shared, gap locks in InnoDB, intent locks in SQL Server). A real deadlock is a closed cycle of waits; if it's not a cycle, it's lock contention or a lock-wait timeout (step 8), which has a different fix.
3. **Find the inconsistent acquisition ORDER — the usual root cause.** Grep the codebase for every transaction that touches the resources in the cycle and trace the order each one locks them. The classic bug: one path does `UPDATE accounts WHERE id=1` then `id=2`, another does `id=2` then `id=1` (or two services lock tables `orders` then `inventory` vs. `inventory` then `orders`). Watch for ordering that's *hidden* — a `SELECT ... FOR UPDATE` with an unordered `IN (...)` or a join whose row-locking order depends on the plan, an ORM that emits writes in object-graph order, or a foreign-key check that takes a lock on the parent row you didn't write explicitly.
4. **Fix the cause first: enforce ONE consistent lock-acquisition order across all transactions.** Make every code path acquire the shared resources in the same deterministic order — sort the ids before locking (`SELECT ... FOR UPDATE ... ORDER BY id`), always lock parent before child, always lock tables in a fixed documented sequence. Consistent ordering makes a cycle impossible: contenders queue instead of deadlocking. This is the only fix that actually removes the deadlock rather than reducing its odds.
5. **Shrink the lock window so the race rarely opens.** Keep transactions short and narrow: acquire locks as late as possible, commit as early as possible, and lock only the rows you'll write. Never hold a transaction open across a network/RPC/third-party-API call or across user think-time — an external call inside the transaction stretches the lock-hold from milliseconds to seconds and turns rare contention into constant deadlocks. Do the slow work *before* `BEGIN` or *after* `COMMIT`.
6. **Pick a deliberate lock strategy for the access pattern, and right-size isolation.** Where the same rows are contended, use pessimistic locking with `SELECT ... FOR UPDATE` in the consistent order from step 4. Where conflicts are *rare*, prefer optimistic concurrency — a `version`/`updated_at` column checked in the `WHERE` of the `UPDATE` and a conflict-retry, which takes no long-held locks. If the engine is over-locking (e.g. Serializable or InnoDB gap locks causing deadlocks on inserts/range scans), drop to the lowest isolation level that's still correct (often Read Committed) to acquire fewer locks.
7. **Add the retry-the-victim safeguard — last, not first.** A deadlock victim's transaction is rolled back cleanly and is a *transient, safe-to-retry* error; the app should catch it specifically (Postgres `SQLSTATE 40P01`, MySQL `1213`, SQL Server `1205`) and retry the whole transaction with capped exponential backoff and jitter (e.g. 3–5 attempts). Retry the *entire* transaction from `BEGIN` — replaying half a rolled-back transaction corrupts state. This handles the deadlocks you can't design away; it does NOT substitute for steps 4–5.
8. **Distinguish a true deadlock from plain lock contention before "fixing" the wrong thing.** If the report shows a lock-*wait timeout* rather than a detected cycle, there's no ordering bug — one transaction is simply holding a lock too long (a long-running write, an idle-in-transaction connection, a missing index forcing a wide row/range lock). The fix there is shortening the holder (step 5), adding the index so the lock is narrow (`query-plan-analyzer`), or killing idle-in-transaction sessions — not reordering locks.

> [!WARNING]
> Adding retries WITHOUT fixing the inconsistent lock order just papers over the bug. Under load, every retry re-enters the same cycle, so you trade one deadlock for a storm of rollbacks and re-runs: throughput craters, latency spikes, and the database burns work undoing transactions. Fix the ordering first; the retry is a net for the residual, not the cure.

> [!WARNING]
> A transaction that holds a lock across an external/API call (or user think-time) is the single most common way rare contention becomes constant deadlocks — the lock-hold goes from milliseconds to seconds, widening the race window enormously. Move every network call and slow computation outside the `BEGIN ... COMMIT`.

> [!NOTE]
> Lowering isolation reduces locking but changes correctness guarantees (Read Committed allows non-repeatable reads; dropping below Serializable can reintroduce write skew). Only lower it where the access pattern is provably safe — don't trade a deadlock for a silent data anomaly.

## Output

A short report with four parts:

1. **The reconstructed cycle** — quoted from the engine's deadlock report: `Txn A holds <lock on R1>, wants <lock on R2>` / `Txn B holds <lock on R2>, wants <lock on R1>`, with the exact resources, lock modes, and the two offending statements.
2. **The root cause** — the specific inconsistent lock-acquisition order (or over-long lock scope / over-strict isolation) behind the cycle, naming the two code paths and the resources they lock in conflicting order.
3. **The fix** — one concrete change: the consistent ordering to enforce (with the exact `ORDER BY` / lock sequence), or the shortened-transaction change (what to move outside `BEGIN`), or the isolation-level / locking-strategy change — not a menu.
4. **The retry safeguard** — the specific deadlock SQLSTATE/error code to catch and the backoff retry of the whole transaction, framed explicitly as the net for residual deadlocks, not the primary fix.