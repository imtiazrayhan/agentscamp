---
name: "strangler-fig-migrator"
description: "Plan the incremental replacement of a legacy module or service using the strangler-fig pattern — grow new code around the old behind an interception seam until the old is dead, instead of a big-bang rewrite. Use when a legacy system is too risky to rewrite at once, or when migrating off a deprecated framework/dependency gradually while staying shippable and rollback-able at every step."
title: "Strangler Fig Migrator"
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["architecture"]
related: ["skill:extract-module", "skill:migration-writer", "skill:contract-test-designer", "skill:dependency-upgrade-planner"]
featured: false
summary: "A big-bang rewrite ships late and breaks everything at once. This skill plans a strangler-fig migration: find a seam where calls can be routed old-or-new, carve off the smallest slice, run old and new in parallel and verify equivalence before shifting traffic, migrate slice by slice with rollback one flag away, and delete the legacy only once it's provably dead."
---

Replace a legacy module or service the way a strangler fig kills its host tree — by growing new code around the old until the old carries no load and can be cut away. The skill's first and most important move is to find the **interception seam**: the single place where calls can be diverted to either the old or the new implementation. Everything else (slicing, parallel-running, decommissioning) hangs off that seam. Without it, "incremental migration" silently becomes a big-bang rewrite with extra ceremony.

## When to use this skill

- A legacy system is load-bearing and too risky to rewrite all at once — a flag-day cutover would mean a long branch, a scary deploy, and no clean rollback.
- You're migrating off a deprecated framework, library, or service (an ORM, an auth provider, a payments SDK, a monolith you're peeling into services) and want to move capability by capability.
- The legacy code has no tests or unclear behavior, so the only trustworthy spec is "what it currently does" — you need to run new alongside old and compare.
- Stakeholders need the system shippable and reversible the entire time, not dark for months behind a feature branch.

> [!WARNING]
> If you cannot find or build a clean interception seam, stop and reconsider. A migration where callers reach deep into legacy internals — not through one front door — cannot be routed incrementally. You will end up rewriting everything before you can flip anything, which is a big-bang rewrite wearing a strangler-fig costume. Creating the seam (a facade callers go through) is the *first deliverable*, sometimes a whole milestone of its own.

## Instructions

1. **Locate or create the interception seam first.** Find the single chokepoint where calls into the legacy unit can be diverted: a facade/adapter the callers already go through, a network proxy/router (reverse proxy, API gateway, service mesh route), or a feature-flag branch in code. Use `Grep`/`Glob` to map every caller of the legacy unit — if they all funnel through one interface, that's your seam; if they reach in twenty different ways, your first job is to introduce a facade they all route through *before* writing any new implementation. The seam must be able to send a call to old OR new and be flipped at runtime (config/flag), not at deploy time.
2. **Inventory and slice the surface.** List the capabilities behind the seam (endpoints, methods, message types) with, for each, its call volume, blast radius if it breaks, and how self-contained it is (shared state, shared DB tables, downstream side effects). This is your migration backlog. Do not migrate by file or by "module size" — migrate by capability slice, because a slice is what the seam can route independently.
3. **Carve off the smallest valuable slice first.** Pick the slice that is most self-contained and lowest-blast-radius — a read-only endpoint, an idempotent operation, an internal report — not the gnarliest core path. Implement it new behind the seam. The goal of slice one is to prove the *seam and the verification mechanism work end to end*, not to deliver the hardest functionality. Save the high-risk, high-coupling slices for after the machinery is trusted.
4. **Run old and new in parallel and verify equivalence before shifting load.** Before routing real traffic to the new path, run it in **shadow mode**: send the live request to both, return the old result to the caller, and compare the new result off to the side (log/metric the diffs). Define equivalence concretely per slice — exact response match, match modulo known-acceptable differences (ordering, timestamps, formatting), or statistical match on key business metrics when outputs are non-deterministic. Only after the diff rate is at/under an agreed threshold over a representative window do you start serving the new path for real.
5. **Shift traffic gradually and keep rollback one flip away.** Route a small fraction to the new implementation (a percentage, an allowlist of internal users, one tenant), watch error rate / latency / business metrics against the old baseline, and ramp only while they hold. The seam from step 1 makes the rollback trivial: if the new path misbehaves, flip the route back to legacy — no deploy, no revert. Treat every ramp as reversible; never remove the old path while it's still the fallback.
6. **Migrate slice by slice, keeping the system shippable throughout.** Repeat steps 3–5 for the next slice. After each slice fully cuts over, the system is in a valid, releasable state with some capabilities on new and some on old — that is the point. Sequence so that you never half-migrate a slice that shares mutable state with an unmigrated one; if two slices write the same table, plan a shared-data strategy (dual-write with new as follower, or migrate the data owner first) before splitting their routing.
7. **Decommission the legacy only once it is provably dead.** A slice's old code is a candidate for deletion only when: the seam routes 100% to new, the route has been pinned there long enough to cover the full usage cycle (including weekly/monthly/seasonal jobs and rare error paths), and instrumentation shows **zero** hits on the legacy path. Confirm deadness with evidence — access logs, a counter/log line on the old code path showing no calls, `Grep` proving no remaining static references — then remove the old implementation and the now-redundant routing in a final isolated step. Keep the seam until the very last slice is gone.

> [!WARNING]
> Deleting legacy code before confirming it's truly dead causes outages, not cleanup. "We migrated that months ago" is not evidence — a quarterly batch job, an admin tool, or a rare error branch can be the only remaining caller. Require positive proof of zero traffic (a metric/log over a full usage period) plus a static-reference search before any deletion. When in doubt, leave the dead branch behind the seam one more cycle; cold code is cheap, an outage is not.

## Output

1. **Interception seam design** — what the seam is (facade/adapter, proxy/router, or feature flag), where it sits relative to the callers, how it decides old-vs-new (config key / flag / percentage), and how it's flipped and rolled back at runtime. Includes the list of legacy callers found and whether they already route through one door or need a facade introduced first.

2. **Slice-by-slice migration order** — the capability backlog as an ordered table, smallest/safest first, with the rationale for the sequence and any shared-data dependencies that force ordering:

   | Order | Slice (capability) | Volume | Blast radius | Coupling / shared state | Why this position |
   | --- | --- | --- | --- | --- | --- |
   | 1 | `GET /report/summary` (read-only) | low | low | none | proves seam + verification end-to-end |
   | 2 | `POST /events` (idempotent write) | high | medium | none | high volume, safe to shadow |
   | 3 | `POST /orders` (core path) | high | high | shares `orders` table w/ #4 | after machinery trusted; pair with #4 |

3. **Parallel-run verification method** — per slice: shadow-mode comparison plan, the concrete equivalence definition (exact / modulo-known-diffs / statistical), the diff threshold and observation window required before serving new, and the metrics watched during ramp (error rate, latency, business KPI vs. legacy baseline) with the ramp schedule (e.g. shadow → 1% → 10% → 50% → 100%).

4. **Decommission criteria** — the exact gate for deleting each slice's legacy code: 100% routed to new, pinned for one full usage cycle, instrumented zero-traffic proof, and a clean static-reference search — plus the final-step plan to remove the old implementation and retire the seam once the last slice is migrated.