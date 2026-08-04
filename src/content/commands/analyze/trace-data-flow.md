---
description: "Trace how a value, field, or variable flows through the codebase from source to sink."
seoDescription: "/trace-data-flow follows a value, field, or variable through the codebase from source to sink — a Claude Code slash command for understanding data movement."
date: 2026-06-17
argument-hint: "<variable, field, or value to trace>"
allowed-tools: "Read, Grep, Glob"
title: "Trace Data Flow"
color: "purple"
topics: ["coding-languages", "architecture"]
related: ["command:find-n-plus-one", "command:rename-symbol", "skill:auth-flow-reviewer"]
featured: false
summary: "Read-only command that traces a value, field, or variable across the codebase: where it originates, every place it is transformed, validated, or renamed, where it is read, and where it is persisted or sent out — following renames across boundaries — then reports a directed source-to-sink flow map with file:line citations, flagging missing validation, plaintext logging, or unit/type mismatches."
---

Trace how `$ARGUMENTS` moves through this codebase — from where it enters, through every transform, to where it lands. Build a directed flow map (source → transforms → sinks) with `file:line` citations, and flag anything notable on the path. Do not change any files; the map and the observations are the whole deliverable.

## Scope

`$ARGUMENTS` is the value to trace — a request/response field (`order.shippingAddress`), a config key (`STRIPE_WEBHOOK_SECRET`), a DB column (`users.email_verified_at`), a query param, an event property, or a plain variable. Trace the **data**, not just the name: the same value is often spelled differently at each layer (`snake_case` column → `camelCase` model attr → `kebab-case` JSON key), so you are following an identity across renames, not grepping one literal.

If `$ARGUMENTS` is empty, do not guess. Ask one focused question: *"Which value should I trace — name a field, config key, column, or variable?"*

> [!WARNING]
> Read-only mode. Use only Read, Grep, and Glob. Do not edit files, run code, or hit a database to "follow" the value. The flow map is reconstructed from source, not from a live trace.

## Step 1 — Pin down the value and its aliases

Find every name this value can wear before you start tracing, or you will lose it at the first layer boundary.

```bash
# Seed search on the literal name and its common case variants
rg -n "shippingAddress|shipping_address|shipping-address" src
```

- Note the **declared type/shape** at each spelling (string, cents-int, ISO-8601 string, enum, nullable).
- Watch for **destructuring and renames** — `const { email: userEmail } = body`, `address AS shipping` in SQL, `@SerializedName`, `@JsonProperty`, ORM column maps, GraphQL field resolvers, protobuf/`zod`/`pydantic` schemas. Each is a rename you must carry forward.

> [!NOTE]
> Aliases hide at every boundary: HTTP body → DTO, DTO → domain model, model → ORM entity, entity → table column, and back out through serializers. Build the alias set first; trace second.

## Step 2 — Find the source(s)

Locate where the value first enters this system. Typical origins:

- **Inbound request** — route/controller param, request body field, header, query string.
- **Config / environment** — `process.env.X`, a config file, a secrets loader.
- **Storage read** — a column selected from a query, a cache `get`, a file read.
- **External call / event** — a webhook payload, a queue message, a third-party API response.

Record each source as `file:line` with the type it has *at the moment of entry*. If there are multiple independent sources, the value has multiple origins — trace each.

## Step 3 — Walk every transform and validation

From each source, follow the value forward. At each hop, classify what happens to it:

| Hop kind | What to capture |
| --- | --- |
| **Validation / parse** | the rule (schema, regex, range, enum) and what passes through unchecked |
| **Transform** | the function and the type/unit change (cents↔dollars, ms↔s, trim/normalize, encrypt/hash) |
| **Rename / remap** | old name → new name across the boundary |
| **Branch / default** | conditionals that drop, substitute, or fork the value |
| **Aggregation** | merged into another object, array, or computed field |

Follow it through function calls and across files — when it is passed as an argument, jump into the callee and keep going. Stop a branch only when the value is consumed (read into a decision and not propagated) or reaches a sink.

> [!NOTE]
> A transform that changes **units or type without a matching change at the consumer** is the highest-value bug this command finds — e.g. cents stored but dollars displayed, or a UTC timestamp compared against a local one. Record the unit/type at *every* hop so mismatches between layers are visible.

## Step 4 — Identify the sinks

A sink is where the value leaves your control. Find all of them:

- **Persistence** — DB write/upsert, cache `set`, file write.
- **Outbound** — API response body, third-party request, queue publish, email/SMS.
- **Logs / telemetry** — `console.log`, logger calls, metrics tags, error reporters.

For each sink, record the name and type the value has *as it leaves*, so the entry shape and exit shape can be compared end to end.

## Step 5 — Assemble the flow map and the observations

Compose the hops into a single directed map, then list what you noticed along the way.

```markdown
## Flow: `$ARGUMENTS`

**Source** → `routes/orders.ts:31` — `body.shipping_address` (string, unvalidated)
  → **validate** `schemas/order.ts:18` — zod `.string().min(1)` (rejects empty only)
  → **rename** `services/order.ts:74` — `shipping_address` → `shippingAddress`
  → **transform** `services/geo.ts:22` — normalized + uppercased country code
  → **persist** `repo/orders.ts:55` — `INSERT orders.shipping_addr`
  → **outbound** `clients/shipping.ts:40` — POSTed to carrier API as `destination`
  → **log** `services/order.ts:80` — full address written to info log

## Observations
- [validation gap] `routes/orders.ts:31` — accepts any non-empty string; no postal-code/country check before it reaches the carrier API.
- [type mismatch] `repo/orders.ts:55` vs `clients/shipping.ts:40` — column is `varchar(120)`; carrier rejects > 100 chars, no truncation between.
- [sensitive log] `services/order.ts:80` — PII (full address) logged at info level in plaintext.
```

Use `→` to show direction; indent or fork the arrows when the value branches. Every node carries a `file:line` and the value's name+type at that point.

## Report

Deliver the flow map and the observations as your message — that is the whole deliverable. Make sure:

1. Each node has a real `file:line` citation; never invent a path you did not open.
2. Every rename across a layer boundary is shown explicitly.
3. Observations are tagged (`[validation gap]`, `[type mismatch]`, `[sensitive log]`, `[unit mismatch]`, `[dead path]`) and each cites the exact line.

End with the single most important finding — the one hop a reviewer should look at first — or, if the path is clean, say so plainly and name the source and primary sink.