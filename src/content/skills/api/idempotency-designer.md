---
name: "idempotency-designer"
description: "Make unsafe, retryable API operations idempotent so a client retry or a network hiccup can't double-charge, double-create, or double-send — design a client-supplied idempotency key, an atomic store-and-check (unique constraint or conditional write), in-flight conflict handling, and a retention policy. Use when a POST/mutation can be retried (payments, order creation, sends, webhooks), or when duplicate side effects have already shown up in production."
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["architecture"]
related: ["idempotency-keys-api-design", "rate-limiter-designer", "webhook-handler-scaffolder", "contract-test-designer"]
featured: false
summary: "A retried POST that isn't idempotent double-charges. This skill makes unsafe operations safe to retry: a client-generated idempotency key, an atomic store-and-check (unique constraint or conditional write — never read-then-act), in-flight conflict handling so a concurrent retry doesn't run the work twice, and a TTL so the dedup store doesn't grow forever."
---

A network timeout doesn't mean the request failed — it means the client doesn't *know*. So the client retries, and now the charge runs twice. Idempotency fixes this by making "do this operation" return the *same result* no matter how many times it's submitted under the same key. The trap: almost everyone implements it as "check if we've seen this key, if not do the work" — two non-atomic steps — which is precisely a race that two concurrent retries win together. This skill designs the key, the *atomic* dedup, the in-flight case, and the cleanup.

## When to use this skill

- An endpoint has a side effect that must not happen twice — a payment/charge, order or account creation, an email/SMS/push send, a transfer, a webhook *delivery* you consume.
- Clients (mobile, SDKs, queue consumers, other services) retry on timeout/5xx, so the same logical operation can arrive more than once.
- Duplicate rows, double charges, or double-sent notifications have already appeared in production logs and you're retrofitting protection.
- You're putting a queue or a webhook receiver in front of a mutation — at-least-once delivery guarantees duplicates by design.

## Instructions

1. **Have the client generate the key, one per logical operation.** The idempotency key is a client-minted unique id (a UUID v4, or a deterministic hash of the operation's natural identity) created *once* and reused on every retry of that same operation. It travels in a header — `Idempotency-Key: <uuid>` (the Stripe/IETF convention) — not in the body where a serializer might reorder it. A new key per *user click* / per *queued message*, the *same* key across that click's retries. Document who mints it and exactly where it rides.

2. **Scope the key — never make it globally unique.** Store and match it as a composite: `(account_id, endpoint, idempotency_key)`. Without scoping, one tenant's key can collide with another's (information leak or wrong cached response returned), and the same UUID legitimately reused on two different endpoints would wrongly dedup. Reserve keys for POST-style *creates and actions*; `GET`/`PUT`/`DELETE` should be designed naturally idempotent (a `PUT` to a known id, a `DELETE` that no-ops on an absent row) and need no key.

3. **Record the key BEFORE doing the work, in a single atomic operation.** This is the whole mechanism. Either:
   - **Unique constraint** — `INSERT` a row keyed on `(account_id, endpoint, key)` with status `in_progress`; let the database's unique index reject the second insert. The *insert* is the lock; you do not read first.
   - **Conditional write** — `SET key value NX` (Redis), or a conditional/compare-and-swap put (DynamoDB `attribute_not_exists`). The store decides the winner atomically.
   The winner proceeds; everyone else hit the constraint/condition and branches to step 5. There is no "check then act" — the check and the claim are the same call.

4. **Persist the response alongside the key, then replay it on repeat.** When the work finishes, store the *full* response (status code + body, or enough to reconstruct it) against the key and mark it `completed` — ideally in the **same transaction** that performs the side effect, so the key and the effect commit or roll back together. On a repeat of a *completed* key, return the stored response verbatim instead of re-executing. Optionally store a hash of the request payload and 422 if the same key arrives with a *different* body — that's a client bug, not a retry.

5. **Handle the in-flight case explicitly — it's not "completed" yet.** A retry can arrive while the first request is still running (status `in_progress`). Do **not** run the work again and do **not** block indefinitely. Return **`409 Conflict`** (or `425 Too Early`) with a short `Retry-After`, telling the client "this is being processed, ask again." Give the `in_progress` record a lease/expiry so a crashed first attempt that never reached `completed` can be retried after the lease lapses rather than wedging the key forever.

6. **Make the downstream effect idempotent too.** Your atomic key protects *your* handler; it does nothing for the third-party call inside it. If the handler calls a payment processor or another service, pass an idempotency key *to that call as well* (most payment APIs accept one) — derive it deterministically from your own key so a retry of your handler produces the same downstream key. Otherwise a crash *after* the external charge but *before* your commit leaves the charge live while your record says nothing happened.

7. **Set a TTL and a cleanup job.** Keys are only needed for the retry window — minutes to ~24h, matched to how long clients realistically retry. Store an `expires_at` and either use the store's native TTL (Redis `EXPIRE`, DynamoDB TTL) or a periodic delete. Choose retention deliberately: long enough to cover every retry path (including a client that retries the next day), short enough that the table doesn't grow without bound.

> [!WARNING]
> Check-then-act is not idempotency. "Read whether the key exists, and if not, do the work" is two operations: two concurrent retries both read "not seen," both proceed, and both run the side effect. The dedup MUST be a single atomic operation — a unique-constraint `INSERT` or a conditional/`NX` write where the store picks the one winner. If your design has a `SELECT` (or `GET`) before the `INSERT`, it is racy under exactly the concurrent-retry load it exists to stop.

> [!WARNING]
> An idempotency store with no TTL grows forever. Every unique operation ever submitted leaves a permanent row, and the unique-index lookup that guards your hottest write path slowly degrades. Always attach an `expires_at` plus native-TTL or a sweep job; "we'll clean it up later" means an unbounded table on your write path.

> [!NOTE]
> Committing the side effect and the `completed` key in the *same transaction* is what makes replay trustworthy. If they're separate writes, a crash between them either replays a response for work that didn't happen, or re-runs work whose key looks unfinished. When the side effect is in another system (a payment API), you can't share a transaction — that's exactly why step 6's downstream key matters.

## Output

A design block specifying: (1) the **key scheme** — who generates it, its format, and the header it travels in; (2) the **scope** — the composite `(account, endpoint, key)` and which methods get keys vs. are naturally idempotent; (3) the **atomic store-and-check** — the exact unique constraint or conditional write, with the claim happening before the work; (4) the **in-flight handling** — the `in_progress` state, the `409`/`Retry-After` response, and the lease expiry; (5) the **downstream-keying** strategy for any third-party call; and (6) the **retention policy** — TTL value, mechanism, and the retry window it covers. Followed by a concrete handler/middleware sketch and the table/index DDL (or store schema) implementing it.
