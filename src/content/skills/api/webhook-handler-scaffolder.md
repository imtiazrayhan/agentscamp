---
name: "webhook-handler-scaffolder"
description: "Scaffold a robust inbound webhook handler that verifies the signature on the raw body first, dedupes on the provider's event id, acknowledges fast, and processes asynchronously — the four things naive handlers get wrong. Use when wiring up events from a third party (Stripe, GitHub, Shopify, Slack, Twilio), when a provider keeps retrying because your endpoint times out or 500s, or when duplicate events are double-charging or double-creating records."
allowed-tools: "Read, Grep, Glob, Edit, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["architecture"]
related: ["skill:rate-limiter-designer", "skill:auth-flow-reviewer", "command:trace-data-flow"]
featured: false
summary: "Most webhook handlers are written as if delivery were trusted, exactly-once, and ordered — it is none of those. This skill scaffolds a handler in the only safe shape: verify the HMAC signature on the raw body, dedupe on the provider's event id, persist the raw event, return 2xx fast, and do the real work asynchronously."
faq:
  - q: "Why can't I parse the JSON body before verifying the signature?"
    a: "Providers compute the HMAC over the exact raw bytes they sent. JSON parse-then-reserialize changes whitespace, key order, and number formatting, so your recomputed signature won't match. Read the raw body, verify against it, then parse — and make sure no middleware (body-parser, framework auto-JSON) consumes the stream first."
  - q: "Do I really need idempotency if my provider says delivery is reliable?"
    a: "Yes. Every major provider documents at-least-once delivery and retries on timeout or non-2xx — which means the same event id will eventually arrive twice. Dedupe on that id with a unique constraint so a replay is a no-op, never a second charge or duplicate row."
---

A webhook endpoint is untrusted input that arrives over the public internet, claims to be from your payment provider, and may be a duplicate, a replay, or out of order. Handlers written for the happy path — parse the JSON, do the work, return 200 — fail in exactly the ways that cost money: a forged request gets processed, a retried event double-charges a customer, or a slow database write makes the provider time out and retry, compounding the duplicate. This skill scaffolds the handler in the one shape that survives real delivery semantics: **verify → dedupe → persist → ack → process async**.

## When to use this skill

- Wiring up an inbound webhook from a third party (Stripe, GitHub, Shopify, Slack, Twilio, Square, GitLab) and you want it correct on the first commit.
- A provider's dashboard shows repeated retries or your endpoint is flagged as failing because it times out or returns 5xx.
- Duplicate events are causing double-charges, duplicate emails, or duplicate records, and you need idempotency retrofitted.
- A security review flagged that the endpoint trusts the payload without verifying its origin.

## Instructions

1. **Identify the provider's contract before writing code.** Find, for the specific provider: the signature scheme (HMAC-SHA256 is typical), which header carries the signature (`Stripe-Signature`, `X-Hub-Signature-256`, `X-Shopify-Hmac-Sha256`), what string is actually signed (often `timestamp + "." + raw_body`, not the body alone), the stable event id field (`id`, `delivery` GUID), and the event-type field. Grep the codebase for an existing handler to match its framework and error conventions rather than introducing a new pattern.
2. **Capture the raw body, then verify before anything else.** Read the request body as raw bytes/string and compute the HMAC over those exact bytes with the signing secret from config (never hardcoded). Compare using a **constant-time** comparison (`crypto.timingSafeEqual`, `hmac.compare_digest`) — never `==`, which leaks the secret via timing. If verification fails, return `401` and stop. Only after a valid signature do you `JSON.parse` the body.
3. **Reject stale requests to block replay.** If the provider signs a timestamp, parse it and reject (`400`) when it is outside a tolerance window (Stripe uses 5 minutes). This stops a captured-and-replayed valid request from being reprocessed indefinitely.
4. **Dedupe on the provider's event id.** Before doing any work, insert the event id into a store with a **unique constraint** (a `webhook_events` table, or Redis `SET key NX EX`). If the insert conflicts, the event was already received — return `200` immediately and do nothing else. Treat the provider's id as the idempotency key; never derive your own from payload contents (two distinct events can have identical bodies).
5. **Persist the raw event, then acknowledge fast.** Store the raw body, headers, event id, and type with a `received_at` timestamp and `processed = false`. Return `2xx` as soon as the event is durably recorded — do not run business logic inline. Providers enforce short timeouts (Stripe ~10s, GitHub ~10s); slow synchronous work guarantees a timeout and a redundant retry.
6. **Process asynchronously and idempotently.** Enqueue the stored event to a worker/queue (or a background task) that performs the real side effects, then marks `processed = true`. The worker must itself be safe to re-run, because the queue is also at-least-once: scope writes by the event id, use upserts, and never assume the event arrives in causal order (a `subscription.updated` can land before `subscription.created`) — reconcile from the payload's own state rather than from event sequence.
7. **Define the failure path explicitly.** Decide what a `5xx` means (provider will retry) versus a `2xx` on a malformed-but-authentic event (you accept and dead-letter it instead of looping forever). Add structured logging keyed by event id and a dead-letter destination for events the worker can't process after N attempts.

> [!WARNING]
> Parsing the body before verifying the signature is the single most common webhook vulnerability — and the most common cause of "signature mismatch" bugs. Framework middleware that auto-parses JSON (Express `express.json()`, Next.js default body parsing) consumes the raw stream, so the bytes you sign over no longer match the bytes the provider sent. Reserve the raw body for the webhook route (e.g. `express.raw({ type: 'application/json' })`, `bodyParser: false`) before doing anything else.

> [!NOTE]
> Never treat delivery as exactly-once or ordered. Every major provider documents at-least-once delivery with retries, which means duplicates and reordering are normal operation, not edge cases. The unique-constraint dedupe in step 4 and the order-independent reconciliation in step 6 are what make that safe — without them the handler is correct only by luck.

## Output

- A complete webhook handler scaffold in the project's framework, structured as **verify (constant-time HMAC on raw body) → replay check → dedupe on event id → persist raw event → return 2xx → enqueue for async processing**, with the signature check, secret loading, and raw-body wiring filled in for the detected provider and the business logic left as a clearly marked TODO in the worker.
- The idempotency and storage design: the `webhook_events` schema (event id with a unique constraint, raw payload, type, `received_at`, `processed`, attempt count), the dedupe-on-insert flow, and the dead-letter/retry policy.
- A short note listing the provider-specific details that must be confirmed against its docs: signing secret location, signature header name, the exact signed string, event-id field, and the timeout/retry behavior the handler is built to satisfy.