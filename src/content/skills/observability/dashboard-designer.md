---
name: "dashboard-designer"
title: "Dashboard Designer"
description: "Design a service dashboard that answers one question at a glance — is the service healthy, and if not, where's the problem? — by structuring panels around RED/USE instead of dumping every metric. Use when a service has no dashboard, when the existing one is an unreadable metric wall, or during incident-readiness prep."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["devops-infra"]
related: ["skill:slo-definer", "skill:alerting-rules-tuner", "skill:distributed-tracing-instrumenter", "skill:runbook-writer"]
featured: false
summary: "Most dashboards are metric dumps that hide the signal an on-call engineer needs at 3am. This skill designs one ranked by user impact — RED/USE method, user-facing SLO signals on top, cause metrics as drill-down below, latency as percentiles, deploys annotated — so a glance answers: healthy, or where's the fire?"
faq:
  - q: "RED or USE — which method do I use?"
    a: "RED (Rate, Errors, Duration) for anything that serves requests: APIs, web services, gRPC backends. USE (Utilization, Saturation, Errors) for resources and queues: a worker pool, a message broker, a database, a thread pool. Most services need RED on top and a USE section below for their key resources."
  - q: "Why can't I just put all the metrics on one board?"
    a: "Because in an incident you have seconds, not minutes. A wall where every panel has equal weight forces the operator to scan and reason about which panel matters — exactly when they can't. Ranking by user impact (RED/USE top, causes below) means the top row already answers 'are users hurting?' before they read anything else."
---

A dashboard is read in two modes: a calm weekly glance, and a 3am incident with an angry pager. Most dashboards are built for neither — they're a wall of every metric the system can emit, ranked by nothing, where the panel that matters is the same size as the one that never moves. This skill designs the opposite: a dashboard structured by a proven method (RED for request services, USE for resources) so the top row answers "is the service healthy?" in one glance, and the rows below answer "then where's the problem?" only when you need them.

## When to use this skill
- A service is running in production with no dashboard, or only a default auto-generated one nobody trusts.
- An existing dashboard is a 40-panel metric dump — technically complete, useless in an incident, because nothing is ranked.
- Incident-readiness or on-call onboarding: you need a board a new engineer can read cold at 3am.
- You're defining or visualizing SLOs and need error-budget burn to live next to the signals that drive it.
- A postmortem found that the dashboard existed but the operator couldn't find the symptom on it fast enough.

## Instructions
1. **Classify the thing you're instrumenting, then pick the method.** Request-driven service (HTTP/gRPC/API) → **RED**: Rate (requests/sec), Errors (failed requests/sec and error %), Duration (latency distribution). Resource or queue (worker pool, broker, DB, cache, thread pool) → **USE**: Utilization (% busy), Saturation (queue depth / backlog / wait time), Errors. A typical service is RED on top with a USE block below for its hottest dependency.
2. **Put user-facing, SLO-aligned signals in the top row — nothing else competes for that space.** Request rate, error rate (%), latency p95/p99, and **error-budget burn rate** if an SLO exists. These four answer "are users being served?" A reader who sees the top row green should be able to stop reading. Everything below is for when it's red.
3. **Show latency as percentiles — p50, p95, p99 — never an average.** Average latency is a lie that hides the tail: a p99 of 4s with a 120ms mean reads as "fine" on an average and "users are rage-quitting" on a percentile. Plot p50/p95/p99 as separate series on one panel so the spread between them (the tail blowing out) is visible.
4. **Place cause metrics BELOW the signals, as drill-down — not mixed in.** CPU, memory, GC pause, queue depth, DB connection pool usage/saturation, downstream dependency latency, restart/OOM counts. These don't tell you if users hurt; they tell you *why* once the top row says they do. Group them so the path is top-down: symptom (top) → suspected cause (below).
5. **Put correlated panels adjacent so the eye does the joining.** Error rate next to the deploy marker. Latency next to the saturated dependency it's waiting on. Queue depth next to consumer error rate. An operator should be able to see "errors started exactly at the deploy" or "latency tracks the DB pool maxing out" without flipping between boards.
6. **Annotate the timeline with deploys and incidents.** Wire deploy/release events and incident start/end onto every time-series panel as vertical markers. Half of all "where's the problem?" questions are answered by a deploy line landing on the exact second the graph turns — make that free to see.
7. **Set thresholds and colors that mean something, plus units and a sane default range.** Color by SLO/alert boundary, not by gut feel: green within budget, amber approaching, red breached — and keep it consistent across panels. Label every axis with units (ms, req/s, %, MiB). Default the time range to something an incident needs (last 1–6h, not 30 days) with the ability to zoom out.
8. **One dashboard per service or user journey — linked, not merged.** Resist the urge to build one giant board for the whole platform. Per-service boards stay readable; link them (this service → its dependencies' boards, the journey board → each service board) so drill-down is a click, not a scroll through 200 panels.
9. **Cut every panel that doesn't earn its place.** For each candidate ask: "In an incident, would this change what I do next?" If no, it's decoration — leave it off or push it to a separate deep-dive board. Noise hides signal; a 12-panel board you trust beats a 40-panel board you scan past.

> [!WARNING]
> A dashboard that shows every metric with equal weight is unreadable in an incident — the operator has to reason about *which* panel matters at exactly the moment they have no spare attention. Rank by user impact (RED/USE on top, causes below) or the board is decoration, not a tool.

> [!WARNING]
> Average latency on a dashboard hides the tail where users actually hurt. A healthy-looking mean can sit on top of a p99 that's timing out for 1% of traffic. Always plot percentiles (p50/p95/p99); never let an average latency panel be the thing on-call looks at first.

## Output
- **A top-down layout spec** for one service/journey: the chosen method (RED and/or USE) and the ordered rows — top row of user-facing/SLO signals, then cause/drill-down rows below.
- **A per-panel table**: panel title → metric/query intent → visualization (time series, single-stat, percentile lines, heatmap) → threshold/color rule → units. Latency panels specify p50/p95/p99.
- **The annotations and links to wire in**: deploy/incident markers on time-series panels, default time range, and the cross-links to dependency or journey dashboards.
- **A "cut list"**: panels deliberately left off (and where they live instead), so the omission is a decision, not an oversight.
