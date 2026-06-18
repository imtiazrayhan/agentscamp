---
name: "cold-start-optimizer"
description: "Cut cold-start latency for serverless functions and slow-booting apps by measuring the init breakdown, then attacking the dominant phase — artifact size, eager imports, eager connections, or under-provisioned memory — instead of reflexively buying provisioned concurrency. Use when serverless p99 spikes on the first request, when a function times out during init, or when scale-to-zero is hurting user-facing latency."
title: "Cold Start Optimizer"
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["devops-infra"]
related: ["bundle-analyzer", "connection-pool-tuner", "load-test-designer", "memory-leak-hunter"]
featured: false
summary: "A cold start is several costs stacked together — runtime boot, dependency load, framework init, first-connection setup — and the usual fix (provisioned concurrency) just pays to hide a slow init. This skill measures the breakdown by phase, attacks the dominant one with artifact shrinking, lazy-loading, memory right-sizing, and connection reuse, and reports before/after."
---

A cold start is not one number — it is runtime boot, dependency/module load, framework init, and first-connection setup stacked on top of each other, and you are usually optimizing a guess about which one dominates. This skill makes it measured: split the init into phases, find the phase that actually costs you, and attack *that* — shrink the artifact and lazy-load the heavy deps off the first-request path, hoist one-time work to module scope so warm invocations reuse it, right-size memory (more CPU often means a *faster and cheaper* cold start), and reuse connections across invocations instead of opening a fresh one every cold start. Provisioned concurrency / keep-warm is the last resort for genuinely latency-critical paths, not the first reflex — because it bills you to mask a slow init rather than fixing it.

## When to use this skill

- Serverless p99 (or p999) spikes on the first request after a quiet period, while warm requests are fast.
- A function intermittently times out *during init* — before your handler code even runs.
- Scale-to-zero or aggressive autoscaling is hurting user-facing latency on a path that can't tolerate a 2–5s tail.
- You've been told to "just turn on provisioned concurrency" and want to know whether the init is fixable first (and cheaper).
- A deploy bloated the artifact (new dependency, bundling change) and cold starts regressed.

## Instructions

1. **Measure the cold start and split it into phases — don't optimize a guess.** Force a cold start (deploy a new version, or wait out the platform's idle timeout) and capture the init timeline, not just the total. Most platforms expose it: AWS Lambda `INIT_START`/`REPORT` log lines (`Init Duration` is the pre-handler cost) plus X-Ray init subsegments; GCP/Cloud Run startup probe + request logs; Vercel function logs. Instrument the four phases yourself with timestamps at module load:
   - **runtime boot** — the platform spinning up the sandbox/container and language runtime (you can't change this much, but you must know its share).
   - **dependency/module load** — `require`/`import` of your code and its tree, top-to-bottom.
   - **framework init** — ORM bootstrap, DI container, route table build, config parse, schema/codegen load.
   - **first-connection setup** — DB handshakes, TLS, secret-manager fetches, warm-up calls.
   Attribute a millisecond cost to each. You optimize the dominant phase; everything else is noise until that one shrinks.

2. **Shrink the deployment artifact and lazy-load heavy deps off the first-request path.** A giant bundle inflates both runtime boot (more to unpack) and module load (more to parse). Tree-shake and bundle (esbuild/`@vercel/nft`/webpack) so you ship the function's actual closure, not the whole `node_modules`; exclude the AWS SDK / platform SDK that the runtime already provides; strip source maps and dev deps from the package. Then find the imports that aren't needed for the *first* request — a PDF renderer, an image library, an analytics client, a markdown engine — and move them behind a lazy `await import()` / deferred `require` inside the code path that needs them, so they never touch init. Grep the entry module for top-level imports of known-heavy packages and ask of each: does request #1 use this?

3. **Hoist one-time work to module scope so warm invocations reuse it — but don't connect eagerly.** Config parsing, client *construction*, schema compilation, and validator building should run once at module load and be captured in module-scope variables, so the platform's instance reuse amortizes them across every warm invocation on that instance. The sharp distinction: **construct** clients at module scope, but **connect** lazily. Build the DB pool / HTTP client object at module load (cheap, no I/O); open the actual connection on first use inside the handler, and reuse it across subsequent invocations on the same warm instance. Eager top-level `await pool.connect()` adds connection latency to *every* cold start and turns a traffic burst into a connection storm.

4. **Reuse connections across invocations via instance reuse — never open a fresh connection per cold start.** Store the connection/pool in a module-scope (or `globalThis`) variable so a warm instance hands it back instead of reconnecting. Size the per-instance pool to **1–2 connections**, not 20: each concurrent serverless instance gets its own pool, so a large per-instance pool times the instance count will blow past the database's `max_connections` under burst. For Postgres at high concurrency, point functions at a transaction-mode pooler (PgBouncer/RDS Proxy/Supabase pooler) rather than the database directly. Set a connection idle timeout shorter than the platform's instance-freeze window so dead connections don't accumulate.

5. **Right-size memory — on many platforms it buys CPU, so more memory = faster AND cheaper cold start.** On Lambda (and similar) CPU and network scale linearly with the memory setting, and a cold start is CPU-bound (parsing, JIT, framework init). Bumping 128MB → 512MB–1GB can cut the cold start by enough that the *higher per-ms price × shorter duration* is lower total cost — the classic counter-intuitive win. Sweep a few memory settings against the same forced-cold-start workload and pick the point on the cost-vs-latency curve, don't assume the smallest tier is cheapest.

6. **Use provisioned concurrency / keep-warm only for genuinely latency-critical paths — after init is already fast.** If a path truly can't tolerate any cold tail (checkout, auth, a synchronous user-facing API), provision N warm instances to cover baseline concurrency. But apply it last, sized to real concurrency (not a round number), and only once steps 1–5 have made the init itself fast — because provisioning a 4-second init just means you pay 24/7 to keep a slow thing warm, and any burst beyond your provisioned count still pays the full cold start.

> [!WARNING]
> Opening a fresh DB connection on every cold start — instead of reusing one across warm invocations — is the classic serverless outage. Under a traffic spike, every new instance opens its own connections simultaneously, the database hits `max_connections`, and *every* request (warm ones included) starts failing. Construct the client at module scope, connect lazily, reuse across invocations, and cap the per-instance pool low. Use a transaction-mode pooler when instance count can exceed the DB's connection limit.

> [!CAUTION]
> Keep-warm and provisioned concurrency **mask** a slow init; they don't fix it — and they bill you continuously for the masking. If you reach for them before measuring, you'll pay 24/7 to hide a 3s init that two hours of lazy-loading would have cut to 400ms, and you'll *still* eat the full cold start on every burst beyond your provisioned count. Fix the init first; provision only the residual.

## Output

1. **Cold-start breakdown by phase** — the measured init timeline showing where the milliseconds actually go, so the dominant cost is obvious before any change:

```text
Cold start breakdown — POST /api/checkout (Lambda, 256MB, node20)
Total cold init: 2,840 ms   (warm: 38 ms)

  runtime boot ................   210 ms   7%   (platform; fixed)
  dependency/module load ......  1,520 ms  54%  <- DOMINANT
      stripe sdk (eager) .........  340 ms
      @prisma/client (eager) .....  610 ms
      pdfkit (eager, unused @ req#1) 470 ms
  framework init ..............    180 ms   6%   prisma engine bootstrap
  first-connection setup ......    930 ms  33%  top-level await pool.connect()
```

2. **Targeted fixes** — ordered by the phase that dominates, each with the specific change and why it lands:

```text
1. Lazy-load pdfkit behind await import() in the receipt path .. -470 ms  [HIGH]
   Not used by request #1; only the async receipt job needs it.
2. Move pool.connect() out of top-level await; connect on first
   handler use, reuse across invocations; pool max 2 ................ -930 ms cold,
   + eliminates connection-storm risk under burst .................. [HIGH]
3. Bump memory 256MB -> 1024MB (CPU scales) ................... -640 ms  [HIGH]
   Faster parse + prisma init; est. total cost -18% (shorter ms).
4. Bundle with esbuild, exclude aws-sdk (runtime-provided),
   strip source maps ................................................ -210 ms  [MED]
5. Provisioned concurrency = 3 on /checkout ONLY, after the above ... covers
   baseline concurrency; residual bursts now cost ~600ms not 2,840.  [LAST]
```

3. **Measured before/after** — the re-measured cold start after applying the fixes, proving the dominant phase actually shrank (and noting cost impact, since memory and provisioning change the bill):

```text
Cold init: 2,840 ms -> 620 ms  (-78%)   p99 first-request: 3.1s -> 0.7s
Monthly cost: roughly flat (higher memory offset by shorter duration;
provisioned-concurrency on /checkout adds ~$X for 3 warm instances).
Re-measure after a real burst, not a single forced cold start.
```
