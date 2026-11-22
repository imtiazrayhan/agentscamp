---
title: "9 Best Claude Skills for Observability"
description: "Claude skills for SLOs, structured logs, OpenTelemetry tracing, symptom-based alerts, RED/USE dashboards, async jobs, postmortems, load tests, and CPU profiles."
author: "Imtiaz Rayhan"
date: "2026-11-10"
reviewed: 2026-11-22
color: "cyan"
depth: standard
topics: ["devops-infra"]
audience: ["developers", "devops"]
tags: ["claude-skills", "observability", "opentelemetry", "slo", "alerting", "logging", "best-of"]
seoTitle: "9 Best Claude Skills for Observability (Logs, Traces, SLOs)"
seoDescription: "The best Claude skills for observability: SLOs, structured JSON logs, OpenTelemetry traces, symptom-based alerts, RED/USE dashboards, and postmortems."
keywords: ["claude skills for observability", "claude code observability", "opentelemetry claude skill", "slo claude skill", "alerting rules claude code", "structured logging claude"]
summary: "Start with slo-definer for the target, then structured-logging-designer and distributed-tracing-instrumenter so requests are traceable, alerting-rules-tuner and dashboard-designer for pages and views, and incident-postmortem-writer to close the loop. Add load-test-designer and flamegraph-analyzer when telemetry points at capacity or CPU."
keyTakeaways:
  - "Start with the SLO: alert thresholds, the dashboard's top row, and postmortem impact all refer back to the target slo-definer defines."
  - "Logs and traces join on IDs: a correlation_id on every log line, with the trace_id stamped beside it, turns two signals into one surface you can navigate."
  - "Page on user-felt symptoms with a duration window; CPU, memory, and disk belong on dashboards or in tickets, not on the pager."
  - "Async boundaries are where traces break and jobs fail silently, so propagate traceparent through message headers and alert on oldest-message age rather than raw queue depth."
  - "slo-definer, alerting-rules-tuner, and dashboard-designer only read and return specs; the logging and tracing skills edit code, so review those diffs for secrets and PII."
faq:
  - q: "What is the best Claude skill for observability?"
    a: "There is no single one, because observability is several decisions. Start with slo-definer to define what healthy means at the user boundary, then structured-logging-designer and distributed-tracing-instrumenter for the telemetry, then alerting-rules-tuner and dashboard-designer to decide what pages a human and what they look at. incident-postmortem-writer covers the learning step after an outage."
  - q: "Can Claude add OpenTelemetry tracing to my service?"
    a: "Yes. distributed-tracing-instrumenter can edit code: it enables OpenTelemetry auto-instrumentation first, maps every hop of a real request, fixes context propagation at each hop including queues and background jobs, adds spans only at meaningful boundaries, picks one trace-wide sampling strategy, and stamps trace_id on log lines. The backend is chosen at the exporter or Collector, so you can change vendors without re-instrumenting."
  - q: "How do I reduce alert fatigue with Claude Code?"
    a: "Use alerting-rules-tuner. It labels every paging rule as a symptom or a cause, demotes causes such as CPU and disk to dashboards or tickets, rewrites the rest to fire on error rate, latency, or SLO burn with a duration window, groups correlated alerts so one incident sends one page, and flags any alert without a runbook as a deletion candidate."
  - q: "How is this list different from the DevOps and SRE skills list?"
    a: "The DevOps and SRE list covers the whole operational loop, including Dockerfiles, CI, canary releases, and rollback plans, with a short note on each skill. This list goes deeper on the telemetry itself: which skills edit code, how logs, traces, alerts, and dashboards connect, and the load-test, profiling, and LLM observability tools that use that telemetry."
  - q: "Is there a Claude agent for LLM observability?"
    a: "Yes. The llm-observability-engineer agent traces the full tree of model calls, tool calls, and retrieval steps with cost and latency per span, adds online evals on sampled live traffic, builds quality, cost, and latency dashboards, and routes production failures into offline eval datasets."
sources:
  - title: "Implementing SLOs"
    url: "https://sre.google/workbook/implementing-slos/"
    publisher: "Google SRE"
  - title: "Alerting on SLOs"
    url: "https://sre.google/workbook/alerting-on-slos/"
    publisher: "Google SRE"
  - title: "Monitoring Distributed Systems"
    url: "https://sre.google/sre-book/monitoring-distributed-systems/"
    publisher: "Google SRE"
  - title: "Postmortem Culture: Learning from Failure"
    url: "https://sre.google/sre-book/postmortem-culture/"
    publisher: "Google SRE"
  - title: "Context propagation"
    url: "https://opentelemetry.io/docs/concepts/context-propagation/"
    publisher: "OpenTelemetry"
  - title: "Sampling"
    url: "https://opentelemetry.io/docs/concepts/sampling/"
    publisher: "OpenTelemetry"
  - title: "Trace Context"
    url: "https://www.w3.org/TR/trace-context/"
    publisher: "W3C"
  - title: "Alertmanager"
    url: "https://prometheus.io/docs/alerting/latest/alertmanager/"
    publisher: "Prometheus"
related: ["skill:slo-definer", "skill:structured-logging-designer", "skill:distributed-tracing-instrumenter", "skill:alerting-rules-tuner", "skill:dashboard-designer", "skill:background-job-reliability-auditor", "skill:incident-postmortem-writer", "skill:load-test-designer", "skill:flamegraph-analyzer", "skill:memory-leak-hunter", "skill:runbook-writer", "agent:sre-engineer", "agent:incident-responder", "agent:llm-observability-engineer", "guide:best-claude-skills-for-devops-sre", "guide:slo-error-budget-guide", "guide:llm-observability-production", "guide:best-llm-observability-tools-2026", "guide:how-to-install-claude-skills", "glossary:tracing"]
---

The best Claude skills for observability each own one signal, or one decision about a signal: what healthy means, how a request is reconstructed across services, what reaches a human, what that human looks at, and how an outage becomes tracked fixes. Install them in that order. Alerts and dashboards built before an SLO exists tend to measure whatever metric was easiest to export.

This list goes deeper than the [DevOps and SRE roundup](/guides/skills/best-claude-skills-for-devops-sre), which also covers containers, CI, canaries, and rollbacks. The subject here is the telemetry itself: which skills write code, which only return a spec, and how their outputs connect. Picks 6, 8, and 9 handle async jobs, capacity, and CPU-bound code.

## The summary table

| Skill | Best for | Main output | Edits code? |
| --- | --- | --- | --- |
| [slo-definer](/skills/observability/slo-definer) | Defining "healthy" | SLIs, SLOs, error budget, burn-rate alerts | No |
| [structured-logging-designer](/skills/observability/structured-logging-designer) | Searchable logs | Field schema, level policy, before/after rewrites | Yes |
| [distributed-tracing-instrumenter](/skills/observability/distributed-tracing-instrumenter) | Requests across services | OpenTelemetry instrumentation and sampling plan | Yes |
| [alerting-rules-tuner](/skills/observability/alerting-rules-tuner) | Noisy or missed pages | Revised paging rules, routing, and dedup map | No |
| [dashboard-designer](/skills/observability/dashboard-designer) | Health at a glance | Layout spec and per-panel table | No |
| [background-job-reliability-auditor](/skills/observability/background-job-reliability-auditor) | Queues, workers, schedulers | Findings, missing telemetry, failure tests | No |
| [incident-postmortem-writer](/skills/observability/incident-postmortem-writer) | After an incident | Blameless postmortem document | Writes the doc |
| [load-test-designer](/skills/performance/load-test-designer) | Capacity and SLO checks | Workload model and threshold-bearing script | Writes the script |
| [flamegraph-analyzer](/skills/performance/flamegraph-analyzer) | CPU-bound hot paths | Hotspot report and one targeted fix | No; runs profilers |

## 1. slo-definer: decide what healthy means

[slo-definer](/skills/observability/slo-definer) starts at the boundary closest to the user, such as the load balancer, the API gateway, or the client SDK, because a 200 from the app server means little if the CDN in front of it returns 502s. It picks two or three SLIs from availability, latency, and, for data systems, freshness or correctness, each written as an explicit good-event ratio: client 4xx errors and load-test traffic leave the denominator, in writing.

The SLO is a target over a rolling window, commonly 28 days. From it the skill derives the error budget, a written rule for what freezes when the budget runs out, and two burn-rate alerts: a fast burn, such as 14.4 times over one hour, that pages, and a slow burn, around 3 times over six hours, that opens a ticket. It checks the target against recent data so the SLO is neither breached every week nor trivially met. The skill only reads; the output is a spec. The [SLO and error budget guide](/guides/observability/slo-error-budget-guide) covers the concepts in depth.

## 2. structured-logging-designer: logs you can query

[structured-logging-designer](/skills/observability/structured-logging-designer) makes every log line a JSON record with the same required fields: `timestamp` in UTC, `level`, a constant `message`, `service`, and `correlation_id`. The constant message matters most. `{"message": "checkout failed", "user_id": 42}` can be grouped and counted; `"user 42 failed"` cannot. Context such as `tenant_id` or `order_id` goes in fields, bound once per request on a child logger so every line in scope inherits it.

The correlation ID is read from an incoming `X-Request-Id` or trace header, or generated at the entry point, kept in a context-local (Go `context`, Node `AsyncLocalStorage`, Python `contextvars`, MDC on the JVM), attached to every line automatically, and forwarded on outbound calls. The skill also writes a level policy with one example per level, a runtime `LOG_LEVEL` switch, a redaction hook that masks sensitive field names before serialization, and before/after rewrites of your busiest log statements.

## 3. distributed-tracing-instrumenter: follow one request across services

[distributed-tracing-instrumenter](/skills/observability/distributed-tracing-instrumenter) instruments against the vendor-neutral OpenTelemetry API with W3C `traceparent` propagation and leaves the backend (Jaeger, Tempo, Datadog, Honeycomb) to the exporter or Collector, so changing backends never touches instrumentation. It enables auto-instrumentation first, maps every hop of one real request on paper, then fixes propagation hop by hop: extract on the way in, inject on the way out, and confirm the child span carries the parent's trace ID.

Its warnings cover the three common ways [tracing](/glossary/tracing) breaks. Queues drop context unless `traceparent` rides in the message headers and the consumer starts a child span or a link. Per-service sampling rates leave holes, so the decision is made once: head sampling at the edge, or tail sampling in the Collector to keep every error and slow request. A span per function buries the slow hop, so spans go at boundaries and around expensive compute. The last step stamps `trace_id` and `span_id` on every log line, the join with the previous skill.

## 4. alerting-rules-tuner: page on symptoms

[alerting-rules-tuner](/skills/observability/alerting-rules-tuner) inventories every rule that pages a human (Prometheus rule files, Datadog monitor exports, Grafana alert JSON, Alertmanager routes) and labels each one a symptom, something the user feels, or a cause, such as CPU, memory, disk, or restart count. Every paging rule then faces one question: does it fire only when a human must act now, with a clear action? Rules that fail become tickets or dashboard panels.

Survivors fire on error rate, a latency percentile, failed business transactions, or SLO burn, measured at the edge, with a `for:` window on every threshold and multi-window burn-rate alerts where both sudden outages and slow leaks matter. Each rule gets one severity (page, ticket, or info), correlated alerts are grouped with `group_by` and inhibition rules so one incident sends one page, and every survivor needs an owner and a `runbook_url`; an alert nobody can write a runbook for is a deletion candidate. It reads config only and returns a plan you apply.

## 5. dashboard-designer: healthy or not, in one glance

[dashboard-designer](/skills/observability/dashboard-designer) uses RED (rate, errors, duration) for request-serving services and USE (utilization, saturation, errors) for resources and queues. The top row holds only user-facing signals: request rate, error percentage, p95 and p99 latency, and error-budget burn if an SLO exists. Latency is plotted as p50, p95, and p99, never as an average.

Cause metrics (CPU, GC pauses, pool saturation, dependency latency) sit below as drill-down, with deploy and incident markers on every time series and one board per service or user journey. The output ends with a cut list of panels left off and where they live instead. Feed it the spec from pick 1 so thresholds follow the error budget rather than gut feel.

## 6. background-job-reliability-auditor: make async work visible

[background-job-reliability-auditor](/skills/observability/background-job-reliability-auditor) traces a job from the producer's commit through enqueue, delivery, processing, side effects, acknowledgement, retry, and dead-letter handling. It checks what the broker actually guarantees under crashes and redelivery instead of trusting product terminology, then audits idempotency, retries, poison messages, concurrency, and shutdown.

For telemetry, it requires correlation from the triggering request or schedule to the job and its effect, and it recommends alerting on oldest-message age, overdue schedules, terminal failures, or dead-letter growth, because queue depth alone can rise normally with traffic. It reads and reports, separating containment from durable fixes.

## 7. incident-postmortem-writer: turn evidence into fixes

[incident-postmortem-writer](/skills/observability/incident-postmortem-writer) merges alerts, deploys, logs, traces, tickets, and responder notes into one timeline in a single timezone, keeping observed facts apart from inference. It quantifies impact in users, requests, duration, and SLO or error-budget consumption, describes the trigger and the contributing conditions rather than a single root cause, and evaluates detection: what caught the incident, and what should have.

Every corrective action needs an owner, priority, due date, and verification method, so "add monitoring" fails unless the signal is defined, and an unknown cause stays labeled unknown with an investigation action attached. Use it once service is stable; during the incident, use the incident-responder agent below.

## 8. load-test-designer: find the saturation point first

[load-test-designer](/skills/performance/load-test-designer) builds a workload model from production access logs or APM data, picks one test type per question (load, stress, soak, or spike), and writes pass/fail thresholds from the SLO before the run, such as a p95 under 300 ms and errors under 0.1 percent, so the tool exits non-zero on a breach. k6 is the default; Locust and Gatling are alternatives.

Its run plan captures server-side metrics in parallel (CPU, memory, database connections, queue depth, GC) to name the bottleneck at the knee, where latency percentiles start climbing super-linearly, and has you watch the load generators' own CPU and sockets, since a saturated generator measures the client rather than your system.

## 9. flamegraph-analyzer: when the slow span is CPU

When a trace shows one service's span is slow and that service is CPU-bound, [flamegraph-analyzer](/skills/performance/flamegraph-analyzer) takes over. It samples a realistic workload with the right profiler (`perf`, async-profiler, `py-spy`, `go tool pprof`), reads width as time and the y-axis as stack depth, and classifies each of the widest self-time leaves as unnecessary, redundant, or algorithmically wrong. It proposes a concrete fix for the biggest one and a re-profile plan, because the bottleneck moves.

Before optimizing, it confirms the latency is on-CPU; a CPU flamegraph cannot see time spent waiting on I/O or locks, so a slow request with a thin graph calls for an off-CPU or wall-clock profile. For memory that climbs until a restart, [memory-leak-hunter](/skills/performance/memory-leak-hunter) diffs two heap snapshots taken under steady load. The [performance roundup](/guides/skills/best-claude-skills-for-performance) covers the rest of that set.

## Agents for on-call and LLM telemetry

The [sre-engineer](/agents/infrastructure-devops/sre-engineer) agent runs the reliability loop from critical user journeys: SLOs grounded in recent data, a deliberate choice of metric, log, or trace for each signal, multi-window burn-rate alerts with runbooks, and incident roles defined in advance. Its own guidance says the most valuable change to a noisy setup is usually deleting alerts.

The [incident-responder](/agents/infrastructure-devops/incident-responder) agent is for a live page. It sets a severity, lines up the onset with the latest change, recommends the fastest mitigation (roll back, flag off, fail over, or shed load), and confirms it on the symptom metric rather than the deploy status. It recommends but does not push fixes to production, and afterwards drafts the blameless postmortem. For runbooks written ahead of time, [runbook-writer](/skills/docs/runbook-writer) produces one per alert in confirm, mitigate, diagnose, escalate, verify order, which is what an alert's `runbook_url` should open.

For LLM applications, the [llm-observability-engineer](/agents/data-ai/llm-observability-engineer) agent traces model calls, tool calls, and retrieval steps with cost and latency per span, preferring OpenTelemetry or OpenInference, adds online evals on sampled live traffic, and routes production failures into offline eval datasets. It names [Langfuse](/tools/langfuse) and [Arize Phoenix](/tools/arize-phoenix) for self-hosting and [LangSmith](/tools/langsmith) as a hosted option; the [LLM observability tools roundup](/guides/comparisons/best-llm-observability-tools-2026) compares more platforms, and [W&B Weave](/tools/weave) has its own page.

## Recommended observability stacks

For a service with no telemetry discipline yet, install the five core skills in build order:

```bash
npx agentscamp add skills/slo-definer
npx agentscamp add skills/structured-logging-designer
npx agentscamp add skills/distributed-tracing-instrumenter
npx agentscamp add skills/alerting-rules-tuner
npx agentscamp add skills/dashboard-designer
```

For an on-call rotation, add the incident pair, the runbook writer, and the SRE agent:

```bash
npx agentscamp add agents/incident-responder
npx agentscamp add skills/incident-postmortem-writer
npx agentscamp add skills/runbook-writer
npx agentscamp add agents/sre-engineer
```

Each command installs into the current project's `.claude/` directory; add `-g` to install into `~/.claude/` for every project. Manual copying, plugins, and team distribution are covered in [how to install Claude skills](/guides/skills/how-to-install-claude-skills).

Review the two code-editing skills like any other diff: check that the redaction list covers your own secret field names and that no span attribute carries a token, a request body, or personal data before spans reach a third-party backend.

## Continue exploring

- [10 Best Claude Skills for DevOps and SRE](/guides/skills/best-claude-skills-for-devops-sre) — The wider operational loop: incidents, rollbacks, canaries, Dockerfiles, and CI.
- [SLOs and Error Budgets](/guides/observability/slo-error-budget-guide) — The reliability concepts behind slo-definer and burn-rate alerting.
- [LLM observability in production](/guides/mlops/llm-observability-production) — Tracing, online evals, and cost monitoring for LLM applications.
- [9 Best Claude Skills for Performance Engineering](/guides/skills/best-claude-skills-for-performance) — Caching, Web Vitals, bundles, load tests, profiles, and memory.
- [How to install Claude skills](/guides/skills/how-to-install-claude-skills) — Every install path: manual copy, the agentscamp CLI, GitHub repos, plugins, and team distribution.
