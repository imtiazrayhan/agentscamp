---
description: "Generate and apply a database migration the safe way — using the project's migration tool, with expand-contract discipline for breaking changes, lock-free DDL, and a reversible up/down."
argument-hint: "<the schema change to make, or a path to a pending migration to review>"
allowed-tools: "Read, Grep, Glob, Bash, Edit"
model: "sonnet"
title: "DB Migrate"
color: "blue"
date: 2026-06-04
topics: ["data-ml"]
related: ["guide:zero-downtime-postgres-migrations", "tool:pgroll", "agent:postgres-migration-engineer", "command:scaffold-pgvector-schema", "command:profile-postgres-queries"]
featured: false
summary: "A slash command that generates and applies a schema migration safely on a live database: it detects the project's migration tool, classifies the change as additive or breaking, decomposes breaking changes via expand-contract, uses lock-free DDL like CREATE INDEX CONCURRENTLY, writes a reversible down, then applies and verifies."
---

## Scope

Treat `$ARGUMENTS` as the schema change to make (e.g. "add a `status` column to `orders`", "rename `user.name` to `full_name`") or a path to a pending migration to review. Restate the change and whether it's **additive** (safe) or **breaking** (needs expand-contract) in one sentence before writing anything.

Goal: produce a migration that's **safe on a live database** — uses the project's migration tool, avoids long locks, and is reversible — not a hand-run `ALTER` that locks a hot table mid-deploy.

> [!NOTE]
> This command writes and applies a migration with safe-migration discipline. For a brand-new pgvector schema specifically, use [Scaffold a pgvector Schema](/commands/db/scaffold-pgvector-schema); for planning a large, multi-step breaking change end to end, hand off to the [postgres-migration-engineer](/agents/data-ai/postgres-migration-engineer).

## Step 1 — Detect the migration tool

Find the project's migration framework (Prisma, Drizzle, Alembic, Flyway, golang-migrate, Rails, Knex, …) and match its file naming, format, and up/down conventions. Never hand-run DDL outside the tool that owns the schema. If [pgroll](/tools/pgroll) is in use, generate its JSON migration instead.

## Step 2 — Classify the change

Decide if the change is **additive** (new nullable column, new table, new index — safe to apply directly) or **breaking** (rename, retype, `NOT NULL`, drop, new constraint on existing data). Breaking changes on a table with real data/traffic must be decomposed.

## Step 3 — Decompose breaking changes (expand-contract)

For a breaking change, split it into separate, reversible migrations: **expand** (additive) → **backfill** (batched) → **dual-write** (app) → **migrate reads** (app) → **contract** (drop old, a later release). Don't collapse add and remove into one migration. See [Zero-Downtime Postgres Migrations](/guides/database/zero-downtime-postgres-migrations).

## Step 4 — Use lock-free DDL

Substitute online operations for the ones that lock:

- `CREATE INDEX CONCURRENTLY` (not plain `CREATE INDEX`).
- `ADD CONSTRAINT … NOT VALID` then `VALIDATE CONSTRAINT` (not a constraint that scans under lock).
- Add columns nullable with a **constant** default (a volatile default rewrites the table).
- Batched, resumable backfills (never one giant `UPDATE`).

## Step 5 — Make it reversible

Write the `down`/rollback for the migration (or confirm the tool generates a correct one). For expand-contract, ensure the old path survives until the contract step, so any phase can be rolled back without data loss.

## Step 6 — Plan, apply, verify

Show the SQL the tool will run (a dry-run/plan where supported) and call out any statement that would take an `ACCESS EXCLUSIVE` lock. Apply it, then verify: the migration recorded, a `CONCURRENTLY`-built index is `VALID`, and the schema matches intent.

> [!WARNING]
> The migrations that cause outages take a long lock or rewrite a large table: a plain `CREATE INDEX`, `SET NOT NULL` directly, an `ALTER TYPE` rewrite, a volatile-default column add, or a single huge `UPDATE`. If the change implies any of these on a table with data, stop and decompose it before applying.
