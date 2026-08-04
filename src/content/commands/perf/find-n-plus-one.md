---
description: "Scan code read-only for N+1 query patterns — loops that query per iteration and handlers that fan out per-row — and report each with a location, why it is N+1, and the concrete eager-load/batch/set-based fix."
argument-hint: "<path or area to scan (optional)>"
allowed-tools: "Read, Grep, Glob"
title: "Find N+1 Queries"
color: "purple"
date: 2026-06-17
topics: ["review-qa"]
related: ["command:profile-postgres-queries", "command:set-perf-budget", "command:find-bug"]
featured: false
summary: "A read-only slash command that detects N+1 query patterns: it finds loops/maps that query (or trigger a lazy-load) per iteration and handlers that fan out per-row queries, then reports each finding worst-first with its location, why it is N+1, a before/after sketch, the concrete fix (eager load, join, batch, DataLoader, or one set-based query), and how to confirm it via query logging or EXPLAIN."
faq:
  - q: "What is an N+1 query?"
    a: "An N+1 query is the antipattern where code runs one query to fetch N rows, then runs one additional query per row (N more) instead of fetching the related data in a single set-based query. The cost scales linearly with N, so a 1-row page is fast and a 1000-row page is 1000x slower."
  - q: "Does this command change my code?"
    a: "No. It is read-only — it scans with Read, Grep, and Glob and reports findings with before/after sketches. You (or a follow-up command) apply the fix, then confirm the query count dropped via query logging or EXPLAIN."
---

## Scope

Treat `$ARGUMENTS` as the path or area to scan — a directory, a file, a feature ("the orders list endpoint"), or a layer ("the serializers"). Restate the scope in one sentence before scanning.

If `$ARGUMENTS` is empty, scan the data-access surface of the repo: ORM models/repositories, serializers/resolvers, and request handlers. Say which paths you chose so the user can narrow it.

> [!WARNING]
> Read-only mode. Do not edit, run migrations, or execute queries. Your only output is the prioritized findings report. The `Bash`/`Edit` tools are deliberately not granted — if a fix needs verifying, tell the user the exact command to run, don't run it.

## Step 1 — Identify the data-access vocabulary

Before grepping for loops, learn how *this* codebase talks to the database, because the lazy-load that triggers the extra query is often invisible. Grep for the ORM/query primitives in use:

- **ActiveRecord (Rails):** `.where`, `.find`, `.find_by`, association accessors inside `.each`/`.map`; missing `includes`/`preload`/`eager_load`.
- **Django:** `.objects.`, `.filter`, related-field access in a loop without `select_related`/`prefetch_related`.
- **SQLAlchemy:** `session.query`/`select`, relationship access with default `lazy="select"`; missing `selectinload`/`joinedload`.
- **Prisma/TypeORM/Sequelize:** `findMany`/`findOne`/`findByPk` inside `map`/`for`; missing `include`/`relations`/`eager`.
- **Raw SQL / micro-ORMs:** a `SELECT … WHERE id = ?` helper called inside a loop.

Note which one is in play; the recommended fix differs per ORM.

## Step 2 — Find queries issued per iteration

Grep for loop constructs (`for`, `forEach`, `.map`, `.each`, list/dict comprehensions, `Promise.all([...].map(...))`) and inspect the body of each for a data-access call from Step 1. Flag any case where the query depends on the loop variable (`fetch(item.id)`, `item.author.name`) — that's the per-row query.

> [!NOTE]
> The most dangerous N+1s are the invisible ones: a property access like `order.customer.email` that *looks* free but silently fires a lazy SELECT each time. Don't only grep for `.query()` — flag relationship/foreign-key attribute access inside any loop.

## Step 3 — Find handlers that fan out per row

Trace request handlers / GraphQL resolvers / serializers that return a collection. A field resolver or a serializer method that loads a related record runs once **per item in the response** even when no explicit loop is visible in the handler. Flag list endpoints whose per-item shape includes a related lookup, and GraphQL resolvers without a batching layer.

## Step 4 — Rank by blast radius

Order findings worst-first. Severity is roughly *(how large N gets) x (how hot the path is)*:

- **Critical:** unbounded/paginated collections on a hot path (list endpoints, dashboards, exports) — N grows with data.
- **High:** loops over user-controlled or large fixed sets.
- **Low:** loops over a small bounded set (a 3-item enum) — note it, but don't alarm.

## Step 5 — For each finding, prescribe the concrete fix

Per finding, give: the **file:line**, a one-line **why it's N+1**, and the **fix matched to the ORM** — not a generic "optimize this":

- **Eager load / preload** when you need the related rows: `includes`/`preload` (Rails), `select_related` (1:1/FK) or `prefetch_related` (1:many) (Django), `selectinload`/`joinedload` (SQLAlchemy), `include`/`relations` (Prisma/TypeORM).
- **Single set-based query** when you only need an aggregate or a filtered subset: replace the loop with one `WHERE id IN (...)` / `GROUP BY` / `JOIN` instead of looping.
- **Batch / DataLoader** for GraphQL resolvers or service boundaries where you can't restructure the caller — collect the keys, resolve them in one batched call per tick.
- **Map in memory** when the related set is small and reused: load once, index by key, look up in the loop.

Include a compact **before/after sketch** (4-8 lines) so the fix is unambiguous.

## Step 6 — Tell them how to confirm

Close each finding with the verification step the user runs themselves (read-only command guidance only):

- Enable query logging for the path (Rails: watch the dev log / `ActiveRecord::Base.logger`; Django: `django.db` logger or `django-debug-toolbar`; SQLAlchemy: `echo=True`; Prisma: `log: ['query']`) and confirm the count drops from ~N to 1-2.
- Or `EXPLAIN`/`EXPLAIN ANALYZE` the new set-based query to confirm it's a single plan, not a loop.

## Report

Deliver a prioritized findings list (worst offenders first) as your message — it is the whole deliverable. For each: **severity · file:line · why it's N+1 · the fix · before/after sketch · how to confirm**. If you found nothing, say so plainly and name the paths you scanned. End with the single highest-leverage finding to fix first.