---
description: "Generate realistic, referentially-consistent seed data and a re-runnable seed script from your actual schema — types and constraints respected, plausible values, FK-dependency insert order, idempotent, never aimed at production."
argument-hint: "<optional: tables and row volume>"
allowed-tools: "Read, Grep, Glob, Write"
title: "Seed Data"
color: "purple"
date: 2026-06-17
topics: ["data-ml"]
related: ["command:db-migrate", "skill:migration-writer", "agent:sql-pro"]
featured: false
summary: "A slash command that reads your schema (migrations, ORM models, or DDL) and writes a re-runnable seed script: it derives tables, columns, types, and foreign keys, generates plausible values that satisfy every constraint, inserts in FK-dependency order, and makes the script idempotent and clearly scoped away from production."
---

## Scope

Treat `$ARGUMENTS` as an optional list of tables/entities and row volumes (e.g. `users:50 orders:200`, or `seed the catalog`). If empty, seed every table the schema defines, defaulting to ~20 rows per top-level table and a plausible fan-out for dependents (e.g. 1–5 child rows per parent). Restate in one sentence which tables you'll seed and at what volume before writing anything.

Goal: a **re-runnable seed script** that fills a *development or test* database with data that looks real and satisfies every constraint — not a throwaway `INSERT` of `test1`/`test2` that violates a foreign key the moment someone joins.

> [!WARNING]
> Never point a seed script at a production database. The script must read its connection from a dev/test env var (e.g. `DATABASE_URL`) and should refuse to run if that URL looks like production (host contains `prod`, `rds.amazonaws.com` without a dev marker, etc.). State this guard in the script's header comment and in your report.

## Step 1 — Read the schema, don't guess it

Locate the source of truth for tables and columns and read it — do not invent fields:

- **Migrations**: `migrations/`, `db/migrate/`, `alembic/versions/`, `prisma/migrations/` — the latest applied state.
- **ORM models / schema files**: `schema.prisma`, Drizzle `schema.ts`, SQLAlchemy/Django models, ActiveRecord `schema.rb`, TypeORM entities.
- **Raw DDL**: `schema.sql`, `*.ddl`.

Use Glob/Grep to find them, then Read. Match the project's existing seed convention if one exists (`prisma/seed.ts`, `seeds/`, `db/seeds.rb`, a `factories/` dir) instead of inventing a new format.

## Step 2 — Extract types, constraints, and foreign keys

For each table you'll seed, record: column types, `NOT NULL`, `UNIQUE` (and composite uniques), `CHECK` constraints, enums, default values, and every **foreign key** (which column references which table's PK, and whether it's nullable). Build the FK dependency graph — you need it for insert order in Step 4.

## Step 3 — Generate plausible, constraint-satisfying values

Generate values that respect each column's type and constraints **and** look real:

- Names, emails, addresses, phone numbers, company names, dates — realistic and varied (`ava.chen@example.com`, not `user1@test.com`). Keep emails on a reserved domain like `example.com` so they can't reach real inboxes.
- Enums/`CHECK` columns: only emit allowed values, with a realistic distribution (most orders `completed`, a few `refunded`).
- `UNIQUE` columns: track generated values and guarantee no collisions (including composite uniques).
- Numbers, timestamps, statuses: plausible ranges and correlations (`shipped_at` after `created_at`; `total` matching summed line items if both exist).
- Prefer a deterministic generator (a fixed seed for the faker library) so re-runs are reproducible.

## Step 4 — Insert in foreign-key dependency order

Topologically sort the tables: insert parents before children so every FK resolves. Capture generated parent IDs (returning IDs or your ORM's create result) and reference them when building child rows — never hardcode an ID you hope exists.

> [!WARNING]
> Inserting in the wrong order, or referencing an ID that wasn't created, throws a foreign-key violation and aborts the whole seed. If a table has a self-referencing FK (e.g. `manager_id`), insert the rows first with nulls, then update the references in a second pass.

## Step 5 — Make it idempotent

The script must be safe to run repeatedly without duplicating rows or erroring on unique constraints. Pick the approach that fits the stack and write it explicitly:

- **Truncate-and-reseed** (simplest for dev): `TRUNCATE … RESTART IDENTITY CASCADE` (or the ORM's deleteMany in reverse FK order) at the top, then insert fresh.
- **Upsert**: `INSERT … ON CONFLICT DO UPDATE` / `upsert` keyed on a stable natural key, so re-runs converge instead of duplicating.
- **Guard**: skip seeding a table that already has rows.

Wrap the run in a single transaction where the driver allows, so a failure leaves the database untouched.

## Step 6 — Write the script

Write the seed file in the project's language/runner with: the production guard from the Scope warning, the connection read from env, generation in FK order, the idempotency mechanism, and a short usage comment. Add or note the run command (e.g. `prisma db seed`, `npm run seed`, `rails db:seed`, `python -m app.seed`) — but do not execute it; you only have Read/Grep/Glob/Write.

## Report

In your message, report: the script path written, which tables it seeds and at what row counts, the idempotency strategy chosen, the production-safety guard, and the exact command to run it. End with the single recommended first step (typically: confirm `DATABASE_URL` points at a dev database, then run the command).