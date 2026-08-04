---
name: "slo-definer"
description: "Turn a vague reliability goal into concrete SLIs, SLOs, an error budget, and burn-rate alerts — service-level indicators measured at the user-facing boundary, targets over a rolling window, and a written policy for what happens when the budget runs out. Use when a service has no defined reliability target, when on-call is noisy and alert-fatigued, or before you commit to an SLA you can't measure."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "SLO Definer"
date: 2026-06-17
topics: ["devops-infra"]
related: ["guide:slo-error-budget-guide", "skill:structured-logging-designer", "skill:load-test-designer", "skill:rate-limiter-designer"]
featured: false
summary: "\"Make it reliable\" is not a target you can measure or alert on. This skill turns it into SLIs (good-event ratios at the user boundary), SLOs (a target over a rolling window), an error budget with a written spend policy, and burn-rate alerts that page when the budget is at risk — not when a host metric blips."
faq:
  - q: "What's the difference between an SLI, an SLO, and an SLA?"
    a: "An SLI is the measurement (e.g. fraction of requests served < 300ms). An SLO is the internal target for that SLI over a window (e.g. 99.9% over 28 days). An SLA is an external, contractual promise — usually looser than the SLO, with penalties — that you should only sign after the SLO has held in production."
  - q: "Why not just aim for 100% reliability?"
    a: "A 100% SLO leaves zero error budget, so every deploy, migration, or experiment is a potential breach and the rational move is to stop changing the system. Pick the lowest target users won't notice (often 99.9%); the gap below 100% is the budget that buys you the freedom to ship."
---

"Make it reliable" can't be measured, can't be alerted on, and can't tell you when to stop shipping. This skill converts a reliability intention into four artifacts that can: **SLIs** that measure what users actually experience, **SLOs** that set a target over a window, an **error budget** with a written policy for spending and exhausting it, and **burn-rate alerts** that page when the budget is genuinely at risk. The output is a spec, not a dashboard — a contract the team and on-call can both point at.

## When to use this skill

- A service is "important" but has no defined reliability target, so nobody can say whether last week was good or bad.
- On-call is drowning in pages that don't correspond to user pain — alert fatigue from threshold blips on CPU, memory, or a single 5xx.
- You're about to sign an SLA and need an internal SLO (tighter, measurable) to back it before you promise anything externally.
- You have dashboards full of metrics but can't answer "are users having a good time right now, and how much room do we have left to break things?"

## Instructions

1. **Identify the user and the boundary first.** An SLI measures the experience of a consumer (end user, calling service) at a specific boundary — the load balancer, the API gateway, the client SDK. Measure as close to the user as you can: a 200 at the app server while the CDN returns 502s is a lie. Name the boundary explicitly before picking metrics.
2. **Pick the few SLIs that reflect that experience.** Choose from the request/response SLI families: **availability** (good-event ratio: non-5xx, non-timeout responses ÷ total valid requests), **latency** (fraction of requests served under a threshold at a percentile), and for data systems **freshness** (fraction of reads no older than N seconds) or **correctness/coverage**. Two or three SLIs per service is plenty — more dilutes the signal.
3. **Write each SLI as an explicit good-event criterion.** Spell out what counts as a good event, what's in the denominator, and what's excluded. Example: `latency SLI = (requests with TTFB < 300ms) / (all non-400 requests at the gateway)`. Exclude client errors (4xx) and load-test traffic from the denominator — they aren't the service failing — but say so in writing.
4. **Set the SLO as a target over a rolling window grounded in user need.** Format: "X% of [good events] over [rolling window]" — e.g. `99.9% of requests succeed over 28 days`. Use a **rolling** window (28 days is common) rather than calendar months so the number can't be gamed by a quiet week. Pick the lowest target users genuinely won't notice; if you can't justify the extra nine from user impact, don't pay for it.
5. **Derive the error budget and write its spend policy.** The budget is `1 − SLO` over the window: a 99.9% SLO allows 0.1% bad events — for 28 days that's ~40 minutes of total unavailability, or 0.1% of requests. State who may spend it (experiments, risky migrations, planned maintenance all draw down the same budget) and the **exhaustion rule in writing**: when the budget is gone, risky changes freeze and reliability work takes priority until the window recovers. A budget with no consequence is just a number.
6. **Tie alerts to burn rate, not to thresholds.** Alert on how fast the budget is being consumed relative to the window. Run two: a **fast-burn** alert (e.g. 14.4× burn over 1 hour = ~2% of a 28-day budget gone in an hour → page now) and a **slow-burn** alert (e.g. ~3× burn over 6 hours → ticket, not a page). This makes a page mean "the budget is at risk," with high precision and low noise, instead of "5xx crossed 5 for 30 seconds."
7. **Sanity-check against history before committing.** Read recent latency/error data (logs, metrics exports) and confirm the proposed SLO is currently *achievable* and *meaningful* — not already breached every week (unattainable, so it'll be ignored) and not trivially met with 100× headroom (no signal). Adjust the target to the real distribution.

> [!WARNING]
> A 100% SLO is a trap: it leaves zero error budget, so every deploy is a potential breach and the only "safe" move is to never change the system. The gap below 100% is precisely the room you have to ship, experiment, and do maintenance — design it in deliberately.

> [!WARNING]
> Averages hide the tail. A 200ms *average* latency is consistent with 5% of users waiting 4 seconds — and the tail is where users churn. Always state latency SLIs as a percentile (p95/p99 served under a threshold), never as a mean.

> [!NOTE]
> System metrics are not SLIs. CPU, memory, disk, and queue depth are *causes*, useful for debugging, but a user never files a ticket about your CPU. SLIs live at the user-facing boundary; keep host metrics on the diagnosis dashboard, out of the SLO spec.

## Output

A reliability spec containing: (1) **SLI definitions** — for each, what's measured, the boundary it's measured at, and the exact good-event criterion (numerator/denominator + exclusions); (2) **SLO targets** — the percentage and rolling window per SLI, with the user-impact rationale; (3) the **error budget** — `1 − SLO` translated into concrete allowance (minutes and/or request count over the window) plus the written spend-and-exhaustion policy; and (4) the **burn-rate alert thresholds** — fast-burn (page) and slow-burn (ticket) multipliers and look-back windows. Reproducible: the same spec can be re-derived and re-checked against fresh data each quarter.
