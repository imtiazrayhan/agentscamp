---
name: "Postgres MCP Pro"
title: "Postgres MCP Pro"
description: "The maintained Postgres MCP server — safe SQL execution, EXPLAIN with hypothetical indexes, workload-driven index tuning, and database health checks."
date: 2026-06-11
url: "https://github.com/crystaldba/postgres-mcp"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/crystaldba/postgres-mcp"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "blue"
topics: ["mcp"]
tags: ["mcp", "postgres", "sql", "database", "performance"]
featured: false
sameAs:
  - "https://pypi.org/project/postgres-mcp/"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "skill:postgres-index-strategist", "skill:sql-optimizer", "command:profile-postgres-queries", "tool:supabase-mcp", "guide:postgres-indexing-at-scale"]
alternativeTo: ["supabase-mcp", "pgroll", "github-mcp-server"]
summary: "Postgres MCP Pro (MIT) is the maintained successor to the archived reference Postgres server — and goes further: alongside schema browsing and execute_sql with a restricted read-only mode, it pairs the LLM with classical optimization algorithms: explain_query with hypothetical-index simulation, workload index analysis via pg_stat_statements, and a multi-dimension analyze_db_health check."
faq:
  - q: "What happened to the official Postgres MCP server?"
    a: "The reference @modelcontextprotocol/server-postgres was archived in 2025 along with most reference servers (it lives read-only in modelcontextprotocol/servers-archived). Postgres MCP Pro is the most-adopted Postgres-specific successor, adding index tuning and health checks the reference server never had."
  - q: "How do I add Postgres MCP Pro to Claude Code?"
    a: "claude mcp add postgres -e DATABASE_URI=\"postgresql://user:pass@localhost:5432/db\" -- uvx postgres-mcp --access-mode=restricted. It's a Python server (uv/pipx/Docker); restricted mode gives read-only, safety-parsed SQL — the right default for anything shared."
  - q: "What makes it 'Pro' versus a basic SQL bridge?"
    a: "Deterministic database smarts alongside the LLM: explain_query can simulate hypothetical indexes (via hypopg) before you create them, analyze_workload_indexes mines pg_stat_statements for what your real workload needs, and analyze_db_health checks buffer cache, connections, vacuum, indexes, sequences, and replication in one call."
---

Postgres MCP Pro answers "let the agent talk to the database" without making the DBA wince. It pairs the model with **deterministic, classical optimization tooling** — real EXPLAIN plans, hypothetical-index simulation, workload-driven index analysis — so recommendations come from algorithms, with the LLM doing the orchestration and explanation.

## Highlights

- **Two access modes** — `--access-mode=restricted` (read-only, SQL safety-parsed, for shared/prod-adjacent databases) and `unrestricted` for dev.
- **`explain_query` with what-ifs** — EXPLAIN any statement, optionally simulating hypothetical indexes via `hypopg` before committing to a build.
- **Workload-aware tuning** — `analyze_workload_indexes` reads `pg_stat_statements` and recommends indexes for the queries you actually run; `analyze_query_indexes` does the same for up to 10 specific queries.
- **`analyze_db_health`** — buffer cache hit rates, connection pressure, index and vacuum health, sequences, replication — the morning-checklist sweep in one tool.
- **Schema navigation** — list schemas/objects, get object details, and `get_top_queries` for slow-query triage.

## In an AI-assisted workflow

```bash
claude mcp add postgres \
  -e DATABASE_URI="postgresql://user:pass@localhost:5432/db" \
  -- uvx postgres-mcp --access-mode=restricted
# then:
# > Why is the orders dashboard slow? Check top queries and propose indexes —
# > simulate them before recommending.
```

This is the natural data layer under the site's Postgres workflow trio — [profile queries](/commands/perf/profile-postgres-queries), [pick the index](/skills/database/postgres-index-strategist), [optimize the SQL](/skills/data/sql-optimizer) — with the agent now able to measure instead of guess.

> [!TIP]
> The advanced tools lean on extensions: enable `pg_stat_statements` (workload analysis) and `hypopg` (hypothetical indexes) to unlock the headline features. Without them you still get schema browsing, EXPLAIN, and health checks.

## Good to know

MIT-licensed, Python 3.12+ via `uvx`/`pipx` or Docker (`crystaldba/postgres-mcp`); SSE transport available for shared deployments. Credentials ride in `DATABASE_URI` — keep them in env vars, not committed config, per the [MCP setup guide](/guides/mcp/claude-code-mcp-setup). Development pace has slowed in 2026 (the multi-database `bytebase/dbhub` is the very active alternative if you need MySQL/SQL Server too); for Supabase-managed Postgres specifically, the [official Supabase server](/tools/supabase-mcp) is the better fit.
