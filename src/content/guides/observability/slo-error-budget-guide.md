---
title: "SLOs and Error Budgets: A Practical Reliability Guide"
description: "Define user-centered SLIs and SLOs, calculate error budgets, create burn-rate alerts, set release policy, and keep reliability targets meaningful."
author: "AgentsCamp"
date: 2026-08-04
color: "orange"
topics: ["devops-infra", "review-qa"]
tags: ["slo", "sli", "error-budget", "reliability", "observability"]
featured: true
summary: "An SLI measures a user's experience, an SLO sets the acceptable good-event ratio over a time window, and the remaining fraction becomes an error budget the team can spend. A useful reliability program defines numerator and denominator precisely, measures at the user boundary, alerts on budget burn instead of noisy infrastructure thresholds, and links budget health to an explicit release policy."
keyTakeaways:
  - "Measure at the user-facing boundary: availability, latency, freshness, or correctness should reflect whether a real request received acceptable service."
  - "Define good and valid events precisely, including exclusions, so the SLI cannot be reinterpreted during an incident."
  - "Choose the lowest SLO that meets user need; each extra nine costs engineering effort and removes room for safe change."
  - "Alert on multi-window error-budget burn so pages represent urgent user impact and slower consumption creates planned work."
  - "Write the budget policy before exhaustion: who may spend it, which changes pause, and what evidence restores normal release pace."
faq:
  - q: "What is the difference between an SLI, SLO, and SLA?"
    a: "An SLI is the measurement, such as the fraction of valid requests completed successfully under a latency threshold. An SLO is the internal target for that indicator over a window. An SLA is an external commitment that may include remedies or penalties and is usually looser than the operational SLO."
  - q: "What is an error budget?"
    a: "The error budget is the failure allowance implied by an SLO. A 99.9% good-event target permits 0.1% bad events during the window. Teams use that allowance to balance feature delivery and reliability work rather than treating every imperfection as equally urgent."
  - q: "Why not set every SLO to 100%?"
    a: "A 100% target leaves no room for deployments, maintenance, experiments, dependency failures, or ordinary risk. It usually produces an impossible promise or stops useful change. Set a target from user need and business impact, then engineer enough headroom to meet it consistently."
  - q: "What is a burn-rate alert?"
    a: "Burn rate compares current bad-event consumption with the rate that would use the budget evenly across the whole window. A high burn over a short and long window signals an urgent incident; a slower sustained burn creates a ticket before the budget is exhausted."
related: ["slo-definer", "alerting-rules-tuner", "dashboard-designer", "structured-logging-designer", "distributed-tracing-instrumenter", "sre-engineer", "incident-responder"]
howtoSteps:
  - name: "Identify the user and service boundary"
    text: "Name the consumer, critical journeys, and measurement point closest to their experience before choosing metrics."
  - name: "Define the SLI precisely"
    text: "Write good events divided by valid events, including latency or correctness criteria and explicit exclusions."
  - name: "Choose target and window"
    text: "Use user impact, historical performance, and business risk to select a realistic SLO over a rolling window."
  - name: "Calculate and govern the budget"
    text: "Translate the allowed bad-event fraction into requests or minutes and write the policy for spending and exhaustion."
  - name: "Alert on burn and review regularly"
    text: "Use fast and slow multi-window burn alerts, inspect budget health during planning, and revisit targets when user needs or architecture change."
---

**A service-level objective states how reliable a service should be from the user's point of view.** It turns “the API should be highly available” into a measurable target such as “99.9% of valid checkout requests complete successfully within the latency threshold over a rolling 28-day window.”

The gap between the target and perfection is the error budget. That allowance gives teams a rational way to balance shipping and stability: spend it on change when reliability is healthy; slow down and repair the system when consumption becomes unsafe.

## The three layers

### Service-level indicator

An SLI is a measurement. The most useful form is a good-event ratio:

```text
SLI = good events / valid events
```

Examples:

- successful eligible HTTP requests divided by all eligible requests
- requests served under 300 ms divided by valid requests
- records available within five minutes divided by expected records
- correct responses divided by evaluated responses

### Service-level objective

An SLO adds a target and time window:

```text
99.9% of valid API requests are successful over a rolling 28 days
```

### Service-level agreement

An SLA is an external commitment, often contractual, with remedies or penalties. It should be backed by internal SLOs that are at least as strict and measured with the same semantics. Do not promise externally what the organization cannot observe internally.

## Measure at the user boundary

Choose the point closest to the consumer's experience: client telemetry, edge, load balancer, gateway, or service boundary. A backend process reporting success while the gateway times out is not a good user event.

Infrastructure metrics such as CPU, memory, queue depth, and disk utilization are diagnostic signals, not SLIs. Users care that the request worked, arrived on time, returned current data, or produced the correct outcome. Host metrics help explain why the SLI is failing.

For a service with several critical journeys, define separate SLIs when their user impact and architecture differ. Read availability, write availability, search freshness, and checkout correctness should not disappear into one average.

## Define good and valid events exactly

An availability SLI needs more precision than “non-500 responses.” Specify:

- measurement point
- included routes and methods
- which status codes count as good
- whether timeouts and cancellations are bad
- which client errors are excluded
- how synthetic, health-check, and internal traffic is treated
- how partial or degraded responses count

```text
good = eligible checkout POST requests that return the accepted success status
       within 1 second and create exactly one order

valid = all authenticated checkout POST requests at the edge,
        excluding load tests and requests rejected before business validation
```

Notice that correctness and latency can be part of “good.” A fast `200` with the wrong result should not improve reliability.

Write the query or recording rule beside the definition. If two engineers cannot calculate the same SLI from the same data, the specification is incomplete.

## Choose an SLO from user need

Use three inputs:

1. **User tolerance:** At what failure rate or delay does the journey become unacceptable?
2. **Business impact:** What does a bad event cost in lost work, revenue, safety, or trust?
3. **Historical capability:** What has the service actually sustained across releases and incidents?

Choose the lowest target that meets user and business need. Moving from 99.9% to 99.99% cuts the allowed failure by ten and often requires architectural redundancy, operational coverage, and dependency commitments that cost far more than the extra digit suggests.

If current performance is far below the desired target, publish an interim objective and a dated plan. A permanently breached SLO teaches everyone to ignore it.

Use a rolling window so the objective always reflects recent behavior. Calendar windows create cliffs where a new month appears healthy despite an incident yesterday.

## Calculate the budget

For a good-event SLO:

```text
allowed bad fraction = 1 - SLO
allowed bad events   = valid events × allowed bad fraction
```

A time-based approximation for 99.9% over 28 days is roughly forty minutes of complete unavailability, but request-based budgets are usually more faithful when traffic varies. A ten-minute outage during peak checkout and overnight maintenance should not count identically if their user impact is different.

Track remaining budget and projected exhaustion, not only current SLI. “Still above 99.9%” can hide a rapid incident that will consume the monthly allowance within an hour.

## Alert on burn rate

Burn rate measures how quickly the budget is being used relative to even consumption:

```text
burn rate = observed bad-event rate / allowed bad-event rate
```

A burn rate of 1 would consume the budget exactly across the full window. A burn of 10 consumes it ten times faster.

Use paired windows:

- **Fast burn:** high multiplier across a short and supporting longer window; page immediately.
- **Slow burn:** lower multiplier sustained across longer windows; create a ticket or daytime response.

Requiring both windows reduces pages from brief spikes while still detecting sustained impact. Tune notification severity to how soon the budget will be exhausted, not to an arbitrary host threshold.

An alert should include the SLO, burn rate, budget remaining, affected route or slice, recent deployment, and links to diagnostic dashboards and runbooks.

## Write the budget policy

The number has value only if it changes decisions. Define:

- who reviews budget health and how often
- which experiments, migrations, or launches may spend budget
- what threshold slows high-risk releases
- what happens when the budget is exhausted
- which reliability work takes priority
- who can approve an exception and when it expires
- what evidence returns the service to normal release policy

A common pattern is progressive: healthy budget allows ordinary change; rapid burn triggers incident response; low remaining budget restricts risky launches; exhaustion prioritizes reliability until the rolling window and remediation recover.

Do not use the policy to punish teams for failures. Use it to resolve the recurring argument between feature urgency and operational risk with pre-agreed evidence.

## Handle dependencies and low traffic

Your service's SLO depends on databases, queues, providers, and networks, but the user-facing SLI still owns the combined outcome. Track dependency SLIs for diagnosis and negotiate contracts where necessary; do not exclude a dependency failure merely because another team operates it.

Low-traffic services can have volatile request ratios. Supplement with synthetic probes or longer windows, but keep the distinction visible. Synthetic availability proves a test path works; it does not prove every real user journey succeeds.

For batch and data systems, freshness or completion SLIs are often better than request availability. Define expected units of work and the time by which they must be correct and available.

## Review the objective as the product changes

Quarterly or after a major architecture or product shift, ask:

- Does the SLI still represent the critical user experience?
- Are exclusions hiding meaningful failures?
- Is the target too easy, permanently impossible, or still appropriate?
- Do alerts predict budget exhaustion with acceptable noise?
- Has the budget policy changed release behavior?
- Are important customer or region slices hidden by the aggregate?

Do not tighten the target merely because the service happened to outperform it. Preserve engineering headroom unless user need justifies spending it.

> [!TIP]
> An SLO is a decision tool, not a vanity percentage. If nobody changes a release, incident, or investment decision when the budget moves, the program is measuring without governing.

Use the [SLO Definer](/skills/observability/slo-definer) to produce the initial spec and the [Alerting Rules Tuner](/skills/observability/alerting-rules-tuner) to convert burn thresholds into actionable alerts.
