---
name: "distributed-tracing-instrumenter"
description: "Instrument a service (or a chain of services) with OpenTelemetry so a single request can be followed end-to-end — context propagated across every hop including async/queue boundaries, spans at the boundaries that matter, deliberate trace-wide sampling, and trace_id stamped on log lines. Use when latency or failures span multiple services, when you have logs but can't reconstruct a request's full path, or when adopting OpenTelemetry."
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Distributed Tracing Instrumenter"
date: 2026-06-17
topics: ["devops-infra"]
related: ["skill:structured-logging-designer", "skill:slo-definer", "skill:alerting-rules-tuner", "skill:runbook-writer"]
featured: false
summary: "Logs tell you what happened in one service; they can't show you a slow request's path across five. This skill instruments services with OpenTelemetry — propagating trace context across every hop (including the async/queue boundaries that silently break traces), spanning the boundaries that matter, sampling whole traces at the edge, and stamping trace_id on logs."
faq:
  - q: "Why OpenTelemetry instead of my tracing vendor's SDK?"
    a: "OpenTelemetry is the vendor-neutral API/SDK and W3C-standard wire format (traceparent). Instrument against the OTel API once and you can swap backends (Jaeger, Tempo, Datadog, Honeycomb) by changing the exporter — no re-instrumentation. Vendor SDKs lock your code to one backend and often won't interoperate when a request crosses a service that uses a different vendor."
  - q: "Should I use auto-instrumentation or manual spans?"
    a: "Both. Auto-instrumentation (agents/middleware for HTTP servers, clients, DB drivers) gives you propagation and boundary spans for free — turn it on first. Add manual spans only for expensive in-process compute and custom boundaries auto-instrumentation can't see (e.g. your own queue consumer). Manual spans are also where you attach domain attributes like order_id."
---

You have logs in five services and a request that's slow, but no way to know it's slow *because* service C waited 800ms on a query that service A triggered three hops back — the lines aren't connected. Distributed tracing connects them: one trace ID threads through every service a request touches, each hop adds a timed span, and you read the whole waterfall in one view. The two things that make or break it are propagation (the context has to survive every hop, and it silently dies across async/queue boundaries) and span discipline (boundaries, not every function). This skill instruments against OpenTelemetry so you're not locked to a backend, fixes propagation at each hop, picks the spans worth having, samples whole traces consistently, and ties traces back to your logs.

## When to use this skill

- A request is slow or failing and the cause spans multiple services — you can see each service's logs but can't reconstruct which call, in which order, cost the time.
- You have decent logs but reconstructing one request's full path means correlating timestamps by hand across services, and async work (queue jobs, background workers) is a black hole.
- You're adopting OpenTelemetry and want spans at the right boundaries with a defensible attribute set, not a noisy span-per-function trace.
- Traces already exist but show up broken — a request appears as two disconnected partial traces, or the downstream half is missing entirely (almost always a propagation or sampling bug).

## Instructions

1. **Adopt OpenTelemetry as the API/SDK; pick the exporter separately.** Instrument against the vendor-neutral OTel API and the W3C `traceparent`/`tracestate` propagation format so the wire protocol is standard across every service. Choose the backend (Jaeger, Tempo, Datadog, Honeycomb) only at the exporter/Collector layer — that way swapping or adding a backend never touches instrumentation. Prefer running the OTel Collector as a sidecar/agent so the app exports once and the Collector handles batching, sampling, and fan-out.
2. **Turn on auto-instrumentation first, then map the request's hops.** Enable the language's auto-instrumentation for the HTTP/gRPC server, outbound HTTP/gRPC clients, and DB drivers — it gives you propagation and the obvious boundary spans for free. Then trace one real request end-to-end on paper: list every hop (inbound edge, each outbound call, each DB query, each queue publish/consume) so you know exactly where context must survive and which boundaries still need manual spans.
3. **Fix context propagation at every hop — extract inbound, inject outbound.** At each service's entry point, *extract* trace context from the incoming `traceparent` header into the current context; on every outbound call, *inject* the current context into the outgoing headers. For HTTP and gRPC, auto-instrumentation usually does both — verify it actually fires (a manually-built client or a raw socket bypasses it). The hop that breaks is the one nobody instruments: confirm the child span's trace ID equals the parent's, not a fresh one.
4. **Carry context across async and queue boundaries explicitly.** A message queue, background job, event bus, or thread/goroutine handoff drops the in-process context — the consumer starts a brand-new trace unless you bridge it. On publish, inject `traceparent` into the message *headers/attributes* (not the body); on consume, extract it and start the span as a *child* (or a span link, for batch/fan-in) of the producer's span. Without this the trace splits into two disconnected fragments and the async work looks like an orphan.
5. **Create spans at meaningful boundaries, not per function.** A span is worth creating where work crosses a boundary or has independent cost: the inbound request, each outbound call (HTTP/RPC/DB/cache), and expensive in-process compute (a heavy serialization, a model inference, a batch loop *as one span*, not per iteration). Do not wrap every helper function — a span-per-function trace has hundreds of millisecond-thin spans that bury the one slow hop and multiply export cost. If a span never changes how you'd read the trace, don't create it.
6. **Attach high-value attributes; never secrets or PII.** Put queryable context on spans as semantic attributes: `http.route` (the *template* `/users/:id`, not the literal path), `http.status_code`, `db.system`/`db.statement` (parameterized, no literal values), `messaging.destination`, and the key domain IDs you'd filter by (`order_id`, `tenant_id`). Set span status to error and record the exception on failure. Never put passwords, tokens, full auth headers, request/response bodies, raw SQL with inlined values, or PII on a span — spans are exported to third-party backends and widely readable.
7. **Sample the whole trace consistently — decide head vs tail once, at the edge.** The cardinal rule: a trace must be sampled atomically, all-or-nothing, or you get broken partial traces. With head sampling, the *first* service makes the keep/drop decision and propagates it in `tracestate` (the sampled flag); every downstream service honors that bit instead of deciding independently — per-service sampling rates produce traces missing half their spans. For "keep all errors and slow requests" you need *tail* sampling, which must run in the Collector (it sees the full assembled trace before deciding), never per-service. Pick one strategy and apply it trace-wide.
8. **Correlate traces with logs by stamping trace_id on every log line.** Pull the active `trace_id` (and `span_id`) from context and add them as fields on every log line in that request — so a log search jumps straight to the trace, and a trace span links straight to its logs. This is the payoff that makes traces and the structured logs you already have one navigable surface instead of two.

> [!WARNING]
> Context dropped across an async/queue boundary is the #1 tracing bug. The consumer starts a fresh root span, and one request becomes two disconnected traces — the producer side and the worker side — with no way to tell they're the same request. Always inject `traceparent` into message headers on publish and extract it (as a child span or link) on consume. Verify by checking the consumer span shares the producer's trace ID.

> [!WARNING]
> Inconsistent per-service sampling yields incomplete traces. If service A keeps 100% and service B keeps 10%, ~90% of A's traces are missing all of B's spans — a waterfall with holes that looks like B never ran. The sampling decision must be made once (head: at the edge, propagated; or tail: in the Collector) and honored by every service, never re-rolled per hop.

> [!WARNING]
> A span-per-function explosion makes traces unreadable and expensive. Hundreds of sub-millisecond spans hide the one 800ms hop that matters and multiply your backend's ingest cost and bill. Span boundaries and independently-costed work only; collapse tight loops into a single span with a count attribute rather than one span per iteration.

## Output

- **Instrumentation plan** — the request's hops mapped end-to-end, which boundaries get spans (inbound edge, outbound calls, DB queries, named expensive compute) and which are deliberately left out, and the per-span-type attribute set (with the secrets/PII deny-list).
- **Propagation fix per hop** — for each hop, the extract-inbound / inject-outbound change, called out explicitly for HTTP, gRPC, and each async/queue boundary, with how to verify parent and child share one trace ID.
- **Sampling strategy** — head vs tail decision, where it runs (edge vs Collector), the rule (e.g. base rate + keep-all-errors + keep-slow), and how the decision is propagated trace-wide.
- **Trace↔log correlation** — how `trace_id`/`span_id` are pulled from context and stamped on log lines, so logs and traces cross-link in both directions.
