---
title: "Distributed Tracing with OpenTelemetry: End-to-End Request Visibility"
description: "Instrument services, queues, and LLM workflows with OpenTelemetry — W3C trace context propagation, useful spans, tail sampling, and trace_id log correlation."
author: "Imtiaz Rayhan"
date: 2026-11-25
color: "orange"
topics: ["devops-infra", "llm-evals"]
audience: ["developers", "devops"]
tags: ["opentelemetry", "distributed-tracing", "observability", "otel", "logging"]
featured: false
summary: "Distributed tracing stitches a single user request across services, queues, databases, and LLM calls into one timeline. A clean OpenTelemetry setup propagates W3C traceparent headers across every sync and async hop, instruments boundaries rather than every helper function, stamps trace_id onto structured JSON logs, and applies deliberate head or tail sampling to control collector bills."
keyTakeaways:
  - "Context propagation is the foundation: without W3C traceparent passing through HTTP clients, message queues, and background jobs, traces shatter into disconnected islands."
  - "Create spans at real architectural boundaries (HTTP handlers, DB queries, cache calls, queue consumers, external APIs, LLM steps) — never around trivial in-memory helpers."
  - "Stamp trace_id and span_id onto every structured log line so you can jump from a failing error log directly into the exact distributed waterfall."
  - "Use head sampling for predictable low cost at high volume, or Collector tail sampling when you must keep 100% of error and slow-tail traces while dropping routine 200 OK traffic."
  - "For AI agents and RAG pipelines, wrap retrieval, tool calls, and model calls as child spans using OpenTelemetry GenAI semantic conventions so latency and token spend show up in the same waterfall."
faq:
  - q: "What is the difference between logs, metrics, and distributed traces?"
    a: "Metrics tell you that something is wrong in aggregate (error rate spiked to 2% or p99 latency crossed 800 ms). Distributed traces show you where a single slow or failed request spent its time across services. Logs give you the detailed event context inside a specific span."
  - q: "Why do traces break across message queues and background jobs?"
    a: "Auto-instrumentation handles inbound and outbound HTTP headers automatically, but async boundaries serialize a payload and drop in-memory execution context. You must explicitly inject the current W3C traceparent into message metadata when publishing and extract it when the worker consumes the message."
  - q: "Should I use head sampling or tail sampling in OpenTelemetry?"
    a: "Start with head sampling (for example, 5–10% of normal traffic) when traffic is modest and you want zero extra collector infrastructure. Add tail sampling in an OpenTelemetry Collector gateway once you need to retain 100% of 5xx errors and slow p99 traces while keeping only 1% of healthy requests."
  - q: "How does OpenTelemetry work with LLM and AI agent observability?"
    a: "OpenTelemetry's GenAI semantic conventions attach model name, token counts, finish reason, and tool-call metadata as span attributes on the same trace that carries your HTTP, database, and vector-search spans — letting you see whether an agent was slow because of the model, a tool API, or a database lock."
related: ["skill:distributed-tracing-instrumenter", "skill:structured-logging-designer", "guide:slo-error-budget-guide", "guide:best-llm-observability-tools-2026", "guide:llm-observability-production", "agent:sre-engineer", "agent:incident-responder"]
howtoSteps:
  - name: "Initialize the OTel SDK at process startup"
    text: "Load OpenTelemetry auto-instrumentation before application imports so HTTP, database, and fetch modules are patched cleanly."
  - name: "Verify W3C trace context across every hop"
    text: "Confirm traceparent propagates across outbound HTTP clients, message queues, and cron or worker jobs."
  - name: "Add intentional spans at business boundaries"
    text: "Wrap key domain operations, external integrations, and LLM/tool calls with low-cardinality attributes and error status recording."
  - name: "Correlate structured logs with trace_id"
    text: "Inject active trace_id and span_id into your JSON logger so error logs link straight to the full request waterfall."
  - name: "Configure sampling and export via OTel Collector"
    text: "Route spans through an OTel Collector with batching, PII redaction, and head or tail sampling before shipping to your backend."
---

**Distributed tracing turns a cross-service mystery into a single timeline.** Metrics from your [SLOs and error budgets](/guides/observability/slo-error-budget-guide) tell you *that* checkout p99 latency crossed 1.5 seconds; distributed tracing tells you *why* — whether the time went to a Postgres lock, a retried payment webhook, a vector query, or an LLM tool call three hops downstream.

OpenTelemetry (OTel) has won as the vendor-neutral instrumentation layer. Instrument once with OTel SDKs and export via OTLP to Grafana Tempo, Honeycomb, Datadog, Jaeger, or an LLM-focused backend without rewriting application code when you switch vendors.

## Propagate context across every hop

A distributed trace only works if every process involved in a request agrees on the same `trace_id` and records its parent `span_id`. OpenTelemetry standardizes this on the W3C Trace Context header:

```http
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
```

Synchronous HTTP auto-instrumentation usually propagates `traceparent` automatically, provided you initialize the OTel SDK **before** importing your web framework or HTTP client. The #1 cause of broken traces in production is **asynchronous boundaries** — queues (SQS, Kafka, BullMQ, RabbitMQ), webhooks, and scheduled jobs — where the in-memory context disappears when a payload is serialized.

Inject context when publishing and extract it when consuming:

```ts
import { context, propagation, trace } from "@opentelemetry/api";

// Producer: serialize traceparent into message headers
const headers: Record<string, string> = {};
propagation.inject(context.active(), headers);
await queue.publish({ payload, headers });

// Consumer: restore parent context before starting worker span
const parentCtx = propagation.extract(context.active(), message.headers);
const tracer = trace.getTracer("billing-worker");
await context.with(parentCtx, () =>
  tracer.startActiveSpan("process_invoice", async (span) => {
    try {
      await processInvoice(message.payload);
    } catch (err) {
      span.recordException(err as Error);
      span.setStatus({ code: 2, message: (err as Error).message });
      throw err;
    } finally {
      span.end();
    }
  }),
);
```

For fan-out batch jobs that process 500 queued messages at once, use **span links** rather than forcing 500 parents onto one span so you keep provenance without creating unreadable waterfalls.

## Put spans at boundaries, not every helper

Over-instrumentation creates noisy waterfalls and massive ingestion bills; under-instrumentation leaves giant black boxes. Follow a simple boundary rule:

- **Always span:** inbound HTTP/RPC handlers, outbound HTTP calls, SQL/NoSQL queries, cache lookups, queue publish/consume, vector retrieval, LLM completions, and tool executions.
- **Add custom spans for:** major business stages (`validate_cart`, `rerank_chunks`, `apply_guardrails`) that take meaningful time or can fail independently.
- **Never span:** tight loops over array elements, pure mapping helpers, or getters that run in microseconds.

Keep span names low-cardinality (`GET /orders/:id`, never `GET /orders/98421`), and put specific identifiers (`order.id`, `tenant.tier`, `gen_ai.request.model`) in span attributes instead. Always call `span.recordException(err)` and set error status when catching failures — otherwise failed requests look green in your trace UI.

## Stamp `trace_id` onto structured logs

Traces show structure and timing; logs carry rich diagnostic context. Connecting the two is the highest-leverage observability upgrade most teams skip. Configure your JSON logger to pull `trace_id` and `span_id` from the active OpenTelemetry span on every log entry:

```json
{
  "timestamp": "2026-11-25T09:14:22.418Z",
  "level": "error",
  "msg": "upstream payment timeout",
  "service": "checkout-api",
  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span_id": "00f067aa0ba902b7",
  "attempt": 2
}
```

When an alert fires, one click on `trace_id` opens the full multi-service waterfall without grepping timestamps across four log streams. Use the [Structured Logging Designer](/skills/observability/structured-logging-designer) to standardize those fields across services.

## Sample deliberately before the bill surprises you

Tracing 100% of every health check and 200 OK request at high throughput gets expensive fast. Choose your sampling strategy explicitly:

| Strategy | Where it runs | Pros | Trade-off |
| --- | --- | --- | --- |
| **Always-on (100%)** | SDK | Zero blind spots | Only economical at low volume or in staging |
| **Parent-based head sampling** | Ingress SDK | Cheap, zero collector memory, keeps complete traces | Drops most rare errors if sampled at 1–5% |
| **Tail sampling** | OTel Collector gateway | Keeps 100% of errors and slow p99 traces, 1% of normal traffic | Requires stateful trace-ID routing across collector replicas |

Start with parent-based head sampling while rolling out instrumentation, and drop noisy routes (`/healthz`, `/ready`, static assets) at the SDK sampler. Once volume justifies an OTel Collector tier, switch to tail sampling so every error and latency outlier survives.

## Tracing LLM and agent workflows on the same waterfall

AI applications are distributed systems in disguise: a single user turn might embed a query, hit a vector database, call an LLM, invoke three MCP tools, and synthesize a final answer. Recording those steps with OpenTelemetry GenAI attributes inside the same request trace means you immediately see whether a 9-second agent turn was caused by slow model TTFT, a hanging tool call, or a redundant retry loop.

Pair OTel instrumentation with the production patterns in [LLM Observability in Production](/guides/mlops/llm-observability-production) and compare OTLP-compatible backends in [Best LLM Observability Tools in 2026](/guides/comparisons/best-llm-observability-tools-2026).

> [!WARNING]
> Scrub PII, authorization headers, and raw user prompts in an OTel Collector processor before exporting traces to a third-party vendor. Tracing backends are rarely scoped for secret storage.

Use the [Distributed Tracing Instrumenter](/skills/observability/distributed-tracing-instrumenter) skill to wire SDK setup, queue propagation, and log correlation into your service.

## Continue exploring

- [SLOs and Error Budgets: A Practical Reliability Guide](/guides/observability/slo-error-budget-guide) — Define the user-facing latency and error budgets that tell you when to inspect traces.
- [sre-engineer](/agents/infrastructure-devops/sre-engineer) — Make reliability measurable with SLIs/SLOs, symptom-based alerting, and end-to-end observability.
