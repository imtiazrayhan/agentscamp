---
title: "Idempotency Keys: Design APIs That Are Safe to Retry"
description: "Design idempotent API mutations with client keys, atomic claims, response replay, payload fingerprints, in-flight handling, TTLs, and downstream safety."
author: "AgentsCamp"
date: 2026-08-04
color: "purple"
topics: ["architecture", "llm-app-dev"]
tags: ["api", "idempotency", "retries", "payments", "distributed-systems"]
featured: true
summary: "An idempotency key makes one logical mutation return the same outcome across retries. The safe design uses a client-generated key scoped to the caller and operation, claims it atomically before side effects, stores the response for replay, rejects key reuse with a different payload, handles concurrent in-flight requests, and carries the same operation identity into downstream services."
keyTakeaways:
  - "The client creates one key per logical operation and reuses it for every retry; a server-generated key cannot deduplicate the first request."
  - "Claim the key atomically with a unique constraint or conditional write before executing work; check-then-insert is racy."
  - "Bind the key to caller, operation, and payload fingerprint so collisions cannot replay another request's result."
  - "Persist status and response for completed operations, and define explicit behavior for concurrent retries while work remains in flight."
  - "Propagate idempotency to queues and downstream APIs because a local record cannot undo an external side effect after a crash."
faq:
  - q: "What is an idempotency key?"
    a: "An idempotency key is a unique identifier for one logical mutation. A client sends the same key on every retry, allowing the server to execute the operation once and replay the original result rather than repeat the side effect."
  - q: "Which API operations need idempotency keys?"
    a: "Use them for retryable mutations where duplication is harmful: payments, order creation, transfers, sends, job submission, and webhook processing. GET is naturally idempotent, while PUT and DELETE should usually be designed to converge on a known resource state without a separate key."
  - q: "Why is checking for the key before inserting unsafe?"
    a: "Two concurrent requests can both read that the key is absent and both execute the side effect. The first operation must be an atomic claim—a unique-constraint insert or conditional write—so exactly one request wins before any work begins."
  - q: "How long should idempotency records be retained?"
    a: "Retain them longer than every legitimate retry path, including mobile clients, queues, and delayed webhooks. Choose a documented TTL based on that window and business risk; high-value operations may need a longer audit record than routine job submissions."
related: ["skill:idempotency-designer", "skill:webhook-handler-scaffolder", "guide:production-tool-calling", "agent:api-architect", "skill:rate-limiter-designer", "skill:contract-test-designer", "skill:provider-fallback-wrapper"]
howtoSteps:
  - name: "Define the logical operation"
    text: "Specify who creates the key, when a new key is required, which endpoint and caller scope it belongs to, and how long retries remain valid."
  - name: "Claim the key atomically"
    text: "Insert an in-progress record under a unique composite key or use a conditional write before executing any side effect."
  - name: "Bind and execute"
    text: "Store a canonical payload fingerprint, run the mutation, and commit the business state and idempotency result atomically when they share a database."
  - name: "Replay or report in-flight work"
    text: "Return the stored response for completed retries, reject changed payloads, and define bounded polling or conflict behavior for concurrent requests."
  - name: "Extend protection downstream"
    text: "Reuse or derive the operation identity for queues and external APIs, then test concurrent retries and crash points."
---

**An idempotency key gives one logical API mutation a stable identity across retries.** If the client times out after sending a request, it cannot know whether the server failed before the work or completed the work before the response was lost. Retrying without idempotency can double-charge, double-create, or double-send.

With an idempotency key, every retry of the same logical operation returns the same result. The implementation challenge is concurrency and crash recovery: the design must prevent two requests from executing at once and preserve enough state to recover when the process stops between the side effect and the response.

## Start from the ambiguity of failure

Consider a payment request:

```text
client ──POST /charges──> API ──charge──> processor
client <──── timeout ────X
```

The timeout describes the network observation, not the business outcome. The processor may have charged successfully. A blind retry creates a second charge.

The client should generate one high-entropy key when the user initiates the logical operation and reuse it until the outcome is known:

```http
POST /charges
Idempotency-Key: 6d4cbddc-9f7c-4e8c-a6f4-90c06f3b8b71
```

A new user action receives a new key. A retry receives the same key. If the server generates the key after receiving the request, it cannot recognize a duplicate first request and has solved the wrong problem.

## Scope keys to identity and operation

Do not make the raw key the only unique field. Scope it with the authenticated caller and operation:

```text
(account_id, operation, idempotency_key)
```

This prevents one tenant from colliding with another and allows the same random value to be used safely for unrelated operations. The authenticated identity comes from the server's authorization layer, never a caller-controlled body field.

Store a fingerprint of the canonical request payload. If a client reuses the same key with different parameters, reject it. Returning the first response for a changed amount or recipient would hide a serious client bug.

Canonicalization must be deterministic: normalize field ordering and exclude volatile transport metadata before hashing. Better still, hash the validated command object after parsing rather than the raw JSON string.

## Claim before doing work

The unsafe implementation is:

```text
SELECT key
if absent:
  perform side effect
  INSERT key
```

Two concurrent retries can both observe “absent” and both execute. The check and claim must be one atomic storage operation.

Relational design:

```sql
CREATE TABLE idempotency_records (
  account_id       text        NOT NULL,
  operation        text        NOT NULL,
  idempotency_key  text        NOT NULL,
  request_hash     text        NOT NULL,
  status           text        NOT NULL,
  response_status  integer,
  response_body    jsonb,
  lease_expires_at timestamptz,
  expires_at       timestamptz NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (account_id, operation, idempotency_key)
);
```

Attempt an `INSERT` with status `in_progress`. The unique constraint chooses the one winner. Conditional writes such as “put if absent” provide the same primitive in key-value stores.

## Model the state machine

An idempotency record needs explicit states:

```text
absent ──atomic claim──> in_progress ──commit──> completed
                            │
                            └──lease expires──> recoverable/failed
```

For a duplicate request:

- **Completed, same payload:** replay the stored status and response.
- **Completed, different payload:** reject key reuse.
- **In progress:** return a conflict or accepted/pending response with bounded retry guidance, or attach the caller to the existing job.
- **Expired lease:** recover according to the operation's crash semantics; do not simply assume no side effect occurred.

Do not hold an HTTP request or database lock indefinitely while waiting for the first request. A clear pending state makes retry behavior observable and prevents connection exhaustion.

## Commit the result with the business state

When the mutation and idempotency record share one database, update both in the same transaction:

```text
BEGIN
  create order
  mark idempotency record completed with response
COMMIT
```

This prevents two inconsistent crash states: a replayable success for business work that rolled back, or completed business work whose key still looks unfinished.

Store the response status and body—or a stable resource reference sufficient to reconstruct them. Replays should preserve the original semantic result, including a deterministic failure if the operation itself completed with one.

## External effects need their own protection

No local database transaction can atomically commit with a payment provider, email service, or separate queue. A crash can happen after the external service accepts the action but before the local idempotency record becomes completed.

Pass the same key, or a deterministic derivative, to downstream APIs that support idempotency. For queues, use a stable message or operation ID and make consumers deduplicate. For systems without native support, use patterns such as an outbox, inbox/dedup table, or reconciliation job.

The end-to-end operation is only as idempotent as its least protected side effect.

## Retention is a product decision

Choose a TTL longer than the longest valid retry source:

- SDK retry policies
- mobile clients returning after lost connectivity
- queue redelivery and dead-letter replay
- webhook retry schedules
- manual operator recovery

A short TTL can allow an old duplicate to execute again. An unbounded TTL grows a hot lookup table forever and may retain response data longer than privacy policy allows. Separate the deduplication window from longer business audit retention when necessary.

Index expiration and clean records in bounded batches. Monitor table size, claim conflicts, in-progress age, replay rate, payload mismatch, and recovery attempts.

## Test concurrency and crash points

Happy-path unit tests prove little. Exercise:

- two simultaneous requests with the same key
- the same key with a changed payload
- timeout after downstream success but before local completion
- process crash while status is in progress
- lease expiration and recovery
- retry after TTL expiry
- cross-tenant key collision
- duplicate queue delivery

Assert the external side effect count, not only the HTTP response. The invariant is “one logical operation causes at most one side effect.”

> [!WARNING]
> Idempotency does not mean every failure becomes success. It means repeated delivery of the same logical command converges on one recorded outcome without repeating the protected effect.

Use the [Idempotency Designer](/skills/api/idempotency-designer) for an implementation-ready schema and handler, and apply the same identity discipline to [production tool calls](/guides/concepts/production-tool-calling) where agent retries can repeat real-world actions.

## Continue exploring

- [api-architect](/agents/core-development/api-architect) — Use this agent to design APIs — resource modeling, versioning, pagination, error contracts, REST vs GraphQL.
