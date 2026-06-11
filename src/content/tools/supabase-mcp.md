---
name: "Supabase MCP"
title: "Supabase MCP"
description: "Supabase's official MCP server — run SQL and migrations, read logs and advisors, generate types, and deploy Edge Functions, with read-only and project scoping."
date: 2026-06-11
url: "https://supabase.com/mcp"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/supabase/mcp"
license: "Apache-2.0"
os: ["Web", "macOS", "Windows", "Linux"]
color: "green"
topics: ["mcp"]
tags: ["mcp", "supabase", "postgres", "database", "backend"]
featured: false
sameAs:
  - "https://github.com/supabase/mcp"
  - "https://supabase.com/docs/guides/getting-started/mcp"
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "postgres-mcp", "db-migrate", "postgres-migration-engineer", "scaffold-pgvector-schema"]
summary: "Supabase's official MCP server (hosted, Apache-2.0) lets agents work a Supabase project end to end: execute_sql and apply_migration, list tables and extensions, fetch service logs and security/performance advisors, generate TypeScript types, deploy Edge Functions, and manage branches. URL params scope it down — project_ref pins one project, read_only=true disables every mutating tool."
faq:
  - q: "How do I connect Supabase to Claude Code?"
    a: "Add the hosted server and authenticate: claude mcp add --transport http supabase \"https://mcp.supabase.com/mcp?project_ref=<your-project>&read_only=true\", then /mcp → Authenticate (OAuth). For CI, pass a personal access token as an Authorization: Bearer header instead of the OAuth flow."
  - q: "What can agents do through the Supabase MCP server?"
    a: "Grouped feature sets: database (execute_sql, apply_migration, list_tables/extensions/migrations), debugging (get_logs per service, get_advisors for security and performance findings), development (generate_typescript_types, project URL and keys), functions (list/get/deploy_edge_function), docs search, account-level project management, and branching on paid plans."
  - q: "Is it safe to point it at production?"
    a: "Supabase's own docs lead with the warning: don't connect it to production with write access. Use read_only=true (it switches to a read-only Postgres user and disables mutating tools), scope to one project with project_ref, and review tool calls — execute_sql on a prod database is exactly as dangerous as it sounds."
---

Supabase MCP gives agents the whole Supabase loop — schema, SQL, logs, advisors, types, Edge Functions — through one official server. The standout design choice is **scoping by URL**: `?project_ref=` pins the server to one project and `&read_only=true` flips it to a read-only Postgres role with every mutating tool disabled, so the safety posture is visible in the config itself.

## Highlights

- **Database work end to end** — `execute_sql` for queries, `apply_migration` for tracked DDL, plus table/extension/migration listings.
- **Debugging with ground truth** — `get_logs` per service (API, Postgres, Edge Functions) and `get_advisors` surfacing Supabase's security and performance findings for the agent to fix.
- **Codegen and deploy** — `generate_typescript_types` from the live schema; list, read, and deploy Edge Functions.
- **Branching on paid plans** — create/merge/reset/rebase database branches, the Supabase-native way to let an agent experiment off-prod.
- **Hosted with OAuth** — `mcp.supabase.com/mcp` (Streamable HTTP, dynamic client registration); a limited local variant ships in the Supabase CLI at `localhost:54321/mcp`.

## In an AI-assisted workflow

```bash
claude mcp add --transport http supabase \
  "https://mcp.supabase.com/mcp?project_ref=<your-project>&read_only=true"
# /mcp → supabase → Authenticate, then:
# > Check the advisors and slow queries on this project and propose the top 3 fixes
```

Start read-only: advisors, logs, and `EXPLAIN`-style analysis cover most day-to-day value. Granting writes is a deliberate second step — ideally against a branch, with `apply_migration` so changes land as tracked migrations rather than ad-hoc DDL.

> [!WARNING]
> An agent with `execute_sql` against production is a footgun with OAuth. Default to `read_only=true`, pin `project_ref`, do write work on branches, and put `ask` rules on the mutating tools in [your permissions](/guides/configuration/claude-code-settings-permissions). Supabase's docs say the same thing louder.

## Good to know

Apache-2.0, developed in the open at `supabase/mcp` (the repo moved from `supabase-community/supabase-mcp` as it became fully official), and still flagged pre-1.0 — expect some breaking changes. The hosted endpoint is free with a Supabase account; the `branching` tool group requires a paid plan. For Postgres that *isn't* Supabase, see [Postgres MCP Pro](/tools/postgres-mcp).
