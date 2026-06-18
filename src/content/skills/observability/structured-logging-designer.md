---
name: "structured-logging-designer"
description: "Design a structured (JSON) logging strategy with a stable field schema, correlation-ID propagation, and a disciplined level policy — then migrate ad-hoc string logs toward it. Use when logs are unsearchable plain text, when debugging a request across services means grepping multiple log streams by hand, or when standing up logging for a new service."
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Structured Logging Designer"
date: 2026-06-17
topics: ["devops-infra"]
related: []
featured: false
summary: "String logs like \"user 42 failed\" are unsearchable and useless across services. This skill designs a structured logging strategy — a stable JSON field schema, a correlation ID threaded through every line of a request, a disciplined level policy, and redaction at the boundary — then rewrites representative log statements to match."
faq:
  - q: "Won't switching to JSON logs make local development harder to read?"
    a: "Use a pretty console renderer in development (most structured loggers ship one) and JSON in production. The schema is identical; only the output formatter differs by environment. You keep readability locally and queryability in your log store."
  - q: "Do I need to migrate every log line at once?"
    a: "No. Add the structured logger and correlation-ID middleware first so new and edited logs are structured, then migrate hot paths (request handlers, error paths) before cold ones. The schema and redaction rules apply from day one; the backfill is incremental."
---

A log line like `"user 42 failed to checkout"` answers nothing you can query: you can't filter by user, can't join it to the request that produced it, can't alert on it. Structured logging makes every line a queryable record — fields, not prose — so "show me every ERROR for tenant X in the last hour, with the request ID" is a query instead of a grep across five files. This skill designs that schema, threads a correlation ID through a request so a single flow is reconstructable across services, sets a level policy you can actually act on, and redacts secrets at the boundary — then rewrites representative statements so the team has a concrete pattern to copy.

## When to use this skill

- Logs are plain text and unsearchable — you grep for substrings instead of filtering on fields, and you can't build a dashboard or alert from them.
- Debugging one request means manually correlating timestamps across multiple services or log streams because nothing ties the lines together.
- Standing up logging for a new service and you want a defensible schema and level policy instead of scattered `print`/`console.log` calls.
- Log levels are meaningless (everything is INFO, or ERROR is used for expected conditions) so on-call alerts are noise and real failures hide.

## Instructions

1. **Emit one structured record per line with a stable schema.** Every log line is a JSON object with the same required fields: `timestamp` (ISO-8601 / RFC-3339, UTC), `level`, `message` (a short, *constant* string — the variable parts go in fields, not interpolated into the message), `service`, and `correlation_id`. A constant message is what lets you group and count: `{"message": "checkout failed", "user_id": 42, "reason": "card_declined"}` is countable; `"user 42 failed: card declined"` is not.
2. **Thread a correlation ID through every line of a request.** At the request entry point (HTTP middleware, queue consumer, RPC handler), read an incoming `X-Request-Id` / trace header or generate one, store it in a context-local (Go `context`, Node `AsyncLocalStorage`, Python `contextvars`, MDC in JVM), and have the logger attach it automatically to *every* line in that request — never pass it by hand. Propagate the same ID on outbound calls (set the header) so downstream services log it too. Reconstructing a flow then becomes `correlation_id = "abc123"` across all services.
3. **Define a level policy and enforce what each level means.** ERROR = something failed and a human needs to act or be alerted (unhandled exception, failed write, breached invariant) — never use it for expected conditions like a 404 or a validation rejection. WARN = suspicious but handled (retry succeeded, fell back, approaching a limit). INFO = key business events worth keeping in production (request completed, order placed, job finished). DEBUG = developer detail (intermediate values, branch taken), off in production. Write the policy down with one concrete example per level so reviewers can reject a misused level.
4. **Make the level runtime-configurable.** Read the threshold from an env var or config (`LOG_LEVEL=debug`) so you can raise verbosity for an incident without a redeploy, and run production at INFO. Where the logger supports it, allow per-module overrides (e.g. DEBUG for one noisy package) so you can zoom in without drowning in unrelated DEBUG output.
5. **Attach context as fields, never by string concatenation.** User, tenant, resource, and operation IDs are structured fields (`user_id`, `tenant_id`, `order_id`, `operation`), not substrings of `message`. Bind request-scoped context once (a child/bound logger carrying `tenant_id` and `correlation_id`) so every line in that scope inherits it without repeating it. This is what makes `tenant_id = "acme" AND level = "ERROR"` a one-line query.
6. **Redact secrets and PII at the logging boundary.** Maintain a deny-list of field names (`password`, `token`, `authorization`, `secret`, `api_key`, `ssn`, `card`, `cookie`, `set-cookie`) and a redaction hook in the logger that masks them *before serialization*, regardless of which call site logs them — do not rely on every developer remembering. Never log full request/response bodies or raw headers; log a content length, a hash, or an explicit allow-list of safe fields instead.
7. **Rewrite representative statements as before/after.** Pick the highest-traffic and highest-value sites — a request handler, an error path, an external-call wrapper — and rewrite each from string log to structured log so the team copies a real pattern, not a doc.

> [!WARNING]
> Logging a secret, token, or PII field is a breach the moment it lands in your log store — logs are widely replicated, retained, and read by people who'd never get database access. Redact at the boundary (step 6); do not trust call sites to remember.

> [!WARNING]
> Unbounded high-cardinality fields (raw URLs with query strings, full user-agent strings, per-request UUIDs as *indexed* fields) explode log-store cost and index size. Keep correlation IDs as plain fields, bucket or template high-cardinality values (`route_template = "/users/:id"`, not the literal path), and never put unbounded free text in a field your backend indexes.

> [!WARNING]
> A log call in a hot loop or per-row path can dominate latency — serialization, redaction, and I/O are not free. Guard DEBUG with the level check so it's skipped (not just discarded) in production, log aggregates instead of per-iteration lines, and sample very-high-frequency events rather than logging every one.

## Output

- **Log schema** — the required fields (`timestamp`, `level`, `message`, `service`, `correlation_id`) and the standard contextual fields (`user_id`, `tenant_id`, request/resource IDs) with types and an example record.
- **Correlation-ID propagation** — where the ID is created/read, how it's stored (context-local), how it's auto-attached to every line, and how it's propagated on outbound calls.
- **Level policy** — the meaning of ERROR/WARN/INFO/DEBUG with one concrete example each, plus the runtime config knob (`LOG_LEVEL`) and any per-module override.
- **Redaction rules** — the field deny-list, the boundary hook that applies it, and the body/header policy.
- **Before/after diffs** — representative log statements rewritten from string to structured, ready to copy across the codebase.
