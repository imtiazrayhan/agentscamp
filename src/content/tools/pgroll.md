---
name: "pgroll"
title: "pgroll"
description: "An open-source CLI for zero-downtime, reversible Postgres schema migrations using the expand-contract pattern behind versioned schema views."
url: "https://github.com/xataio/pgroll"
date: 2026-06-04
pricing: "open-source"
category: "cli"
repo: "https://github.com/xataio/pgroll"
license: "Apache-2.0"
sameAs: ["https://github.com/xataio/pgroll"]
os: ["Linux", "macOS", "Windows"]
color: "blue"
topics: ["data-ml"]
tags: ["postgres", "migrations", "cli", "zero-downtime", "open-source"]
featured: false
related: ["zero-downtime-postgres-migrations", "postgres-migration-engineer", "db-migrate", "postgres-index-strategist"]
summary: "pgroll is an open-source CLI from Xata for zero-downtime, reversible Postgres schema migrations. It automates the expand-contract pattern: old and new schema versions stay live simultaneously behind versioned views, with backfills and lock-friendly DDL handled for you — start a migration, roll your app, then complete it or roll back instantly."
faq:
  - q: "What is pgroll?"
    a: "pgroll is an open-source command-line tool for zero-downtime, reversible schema migrations on Postgres, built by the team at Xata. It automates the expand-contract pattern: each migration keeps the old and new schema versions live at the same time behind versioned views, so currently-deployed and new application code can coexist during a rolling deploy."
  - q: "How do I use pgroll?"
    a: "Define migrations declaratively as JSON or YAML, then run them in two phases: pgroll start migrations/01_add_column.json brings up the new schema version alongside the old (backfilling as needed); after rolling out and verifying the new app version, pgroll complete finalizes and removes the old version."
  - q: "How does pgroll roll back a migration?"
    a: "Before you run pgroll complete, rolling back simply drops the new schema version's views — no data is lost and there's no reverse migration to write. The destructive contract step only happens when you explicitly complete the migration."
  - q: "Is pgroll free?"
    a: "Yes — free and open source under Apache-2.0, and it works against standard Postgres."
---

pgroll is an open-source command-line tool for **zero-downtime, reversible** schema migrations on Postgres. It automates the [expand-contract pattern](/guides/database/zero-downtime-postgres-migrations): for each migration, pgroll keeps the **old and new schema versions live at the same time**, each exposed through its own set of views, so the currently-deployed application and the new one can each connect to the schema shape they expect during a rolling deploy. When the rollout is done, you complete the migration and the old version is removed.

It is aimed at teams who want the safety of expand-contract without hand-orchestrating every step. pgroll, from the team at Xata, takes a declarative migration definition and handles the version views, the backfill, and the safe DDL underneath — turning "change a live schema" into a start → (verify) → complete (or roll back) workflow.

## Highlights

- **Multi-version schema** — old and new schema versions exist simultaneously behind versioned views, so old and new app code coexist during a deploy.
- **Expand-contract automated** — declare the change; pgroll performs the additive expand, backfills data, and defers the destructive contract until you complete it.
- **Instant rollback** — before you complete a migration, rolling back is dropping the new version's views — no data lost, no reverse migration to write.
- **Safe DDL underneath** — uses lock-friendly operations (e.g. concurrent index builds, validated constraints) so migrations don't long-lock hot tables.
- **Declarative migrations** — define migrations as data (JSON or YAML), versioned alongside your code.

## In an AI-assisted workflow

Apply a migration as two phases — start it (old + new versions live), roll your app, then complete it:

```bash
# expand: bring up the new schema version alongside the old (backfills as needed)
pgroll start migrations/01_add_column.json

# ...roll out the new application version, verify in production...
# (before completing, `pgroll rollback` drops the new version with no data loss)

# contract: finalize and remove the old schema version
pgroll complete
```

> [!TIP]
> Point old app instances at the previous schema version's views and new instances at the new one — that's what makes the deploy zero-downtime. Until you run `pgroll complete`, a rollback is just dropping the new version. See [Zero-Downtime Postgres Migrations](/guides/database/zero-downtime-postgres-migrations) for the pattern pgroll automates.

## Good to know

pgroll is free and open source under Apache-2.0 and works against standard Postgres. It's a strong fit when you do frequent online schema changes and want expand-contract handled for you; if your stack already has a migration tool you're committed to, you can still apply the same discipline manually (see the [postgres-migration-engineer](/agents/data-ai/postgres-migration-engineer) and the [DB Migrate](/commands/db/db-migrate) command).
