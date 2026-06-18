---
name: "canary-release-planner"
description: "Design a canary / progressive rollout so a bad release reaches 1% of users instead of 100% — staged traffic with bake times, gating metrics compared against the concurrently-running stable baseline, and automated promote-or-rollback. Use when shipping a risky change, when you want automatic rollback on regression, or when moving off all-at-once deploys."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Canary Release Planner"
date: 2026-06-17
topics: ["devops-infra"]
related: ["slo-definer", "migration-writer", "strangler-fig-migrator"]
featured: false
summary: "An all-at-once deploy bets the whole user base on a green CI run. This skill designs a canary: staged traffic (1% → 10% → 50% → 100%) with bake times, gating metrics measured against the concurrently-running stable version (not yesterday), an auto-rollback trigger, and the schema/session-affinity prerequisites that make a canary safe."
faq:
  - q: "Why compare the canary to the live stable version instead of historical data?"
    a: "Because traffic shifts with time of day, marketing pushes, and the day of the week. If you compare a 2pm canary to yesterday's 2am numbers, normal variation looks like a regression (or hides one). Routing a slice of the same live traffic to both versions cancels out those confounders — the only difference left is the code."
  - q: "When is a canary unsafe?"
    a: "When the release includes a non-backward-compatible schema change. During the rollout both versions run against the same database; if the new code requires a column the old code can't tolerate (or vice versa), one of them breaks regardless of traffic split. Ship the schema change first as a backward-compatible expand step, deploy the canary, then contract — never canary a breaking migration."
---

An all-at-once deploy is a single bet: CI is green, so you flip 100% of users onto new code and hope. A canary changes the bet — it routes a small, growing slice of real traffic to the new version, watches it against the version still serving everyone else, and either promotes it or rolls it back automatically. This skill produces that plan: the stages and bake times, the metrics that gate each promotion, the rollback trigger, and the data/session prerequisites that decide whether a canary is even safe for this change.

## When to use this skill

- You're shipping a change risky enough that a bad version reaching every user at once is unacceptable (auth, payments, a hot path, a dependency bump).
- You want regressions to trigger an automatic rollback instead of waiting for an on-call human to notice and react.
- You're moving a service off all-at-once / blue-green flips onto progressive delivery and need a concrete stage-and-gate plan.
- A previous "it passed CI" deploy caused a production incident, and you want the blast radius capped before the next one.

## Instructions

1. **Define the rollout stages and a bake time at each.** Lay out an increasing traffic schedule — e.g. `1% → 10% → 50% → 100%` — and assign each stage a **bake time** long enough for the relevant signals to surface (cover at least one full traffic cycle for the failure mode you fear: cache fills, cron jobs, retries, a login spike). The first stage should be small enough that its failure is a non-event; the bake time, not the percentage, is what lets a slow leak (memory, connection exhaustion, a rare code path) show itself before the next promotion. Don't jump straight to 50%.
2. **Pick the metrics that gate promotion.** Choose a small set that reflects user pain: **error rate** (5xx / failed requests), **latency percentiles** (p95/p99, never the mean — the mean hides the tail that churns users), and one or two **business/health signals** that catch silent failures the error rate won't (checkout completions, sign-ups, queue depth, a 200-with-empty-body). A deploy can be 200-OK and still be broken; the business metric is what catches that.
3. **Set thresholds as canary-vs-baseline, not absolute.** For each gating metric, define a pass/fail rule comparing the **canary** to the **concurrently-running stable version** — e.g. "canary error rate ≤ stable + 0.5pp" and "canary p99 ≤ 1.2× stable p99." Both versions take a slice of the *same live traffic at the same time*, so time-of-day, weekday, and load differences cancel out and the only variable left is the new code.
4. **Automate the promote-or-rollback decision.** At the end of each bake time: if every gating metric is within threshold, promote to the next stage; if any breaches, **auto-rollback** — shift 100% of traffic back to stable immediately. Make rollback fast and safe: it must be a traffic-weight change (drain the canary, don't kill in-flight requests), require no new build, and not depend on the canary being healthy enough to cooperate. A rollback that needs a redeploy is too slow to matter during an incident.
5. **Guarantee schema compatibility across both versions.** During the rollout the old and new code hit the **same database simultaneously**. Every schema change must be backward-compatible in both directions for the duration of the canary — use **expand-contract / parallel-change** migrations: add the new column/table (expand) and deploy code that writes both, run the canary, then remove the old shape (contract) only after the new version owns 100%. Pair with `strangler-fig-migrator` for larger cutovers.
6. **Pin session affinity so a user doesn't flip versions mid-flow.** Route by a stable key (user ID, session cookie) so a given user stays on canary *or* stable for the whole session. Without it, a user can bounce between versions between requests — half-applied multi-step flows, cache/state mismatches, and metrics that can't be attributed to either version. Affinity also makes the canary-vs-stable comparison clean.
7. **Choose the routing dimension deliberately.** Decide whether the canary is a **percentage of traffic** (simplest, representative) or a **user segment** (internal staff → beta cohort → region → everyone) when you want known, tolerant users to absorb the first hit. Segment routing trades statistical representativeness for a friendlier blast radius — state which you chose and why.

> [!WARNING]
> Comparing the canary to a *historical* baseline (yesterday, last week, a stored average) instead of the stable version running right now produces false verdicts. Traffic and latency swing with time of day and day of week, so a healthy canary at peak can look "regressed" against an off-peak baseline — and a genuinely bad canary can hide inside normal variance. Always gate against the concurrently-running stable version.

> [!WARNING]
> A canary is unsafe when the release contains a non-backward-compatible schema change. Both versions query the same database during the rollout, so a breaking migration breaks one version no matter the traffic split. Decouple it: ship the migration as a backward-compatible expand step first, canary the code, then contract afterward.

## Output

A canary rollout plan containing: (1) the **stage schedule** — traffic percentages and the bake time at each, with the reason each bake time is long enough; (2) the **gating metrics** — error rate, latency percentiles, and the business/health signal(s), each with an explicit **canary-vs-baseline** pass/fail threshold; (3) the **auto-rollback trigger** — which breach forces a rollback and the (fast, build-free) mechanism that executes it; and (4) the **prerequisites** — the expand-contract schema plan confirming both versions are DB-compatible, and the session-affinity key. Reproducible: the same plan re-runs for the next release by swapping in its metrics and thresholds.