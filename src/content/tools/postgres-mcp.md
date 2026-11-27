---
name: "Postgres MCP Pro"
title: "Postgres MCP Pro"
description: "An open-source Postgres MCP server from Crystal DBA: safe SQL execution, EXPLAIN with hypothetical indexes, workload index tuning and database health checks."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
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
alternativeTo: ["supabase-mcp"]
summary: "Postgres MCP Pro is an MIT-licensed MCP server from Crystal DBA that gives agents nine tools for Postgres: schema browsing, execute_sql with a read-only restricted mode, explain_query with hypothetical indexes, index recommendations from pg_stat_statements, and a database health check. Its last tagged release, 0.3.0, dates from May 2025."
faq:
  - q: "What happened to the official Postgres MCP server?"
    a: "The reference Postgres server from the MCP project now lives in the modelcontextprotocol/servers-archived repository and is no longer developed. Postgres MCP Pro is a separate project by Crystal DBA. It uses the same read-only transaction approach for protected execution and adds index tuning, query-plan analysis and health checks that the reference server never had."
  - q: "How do I add Postgres MCP Pro to Claude Code?"
    a: "Run claude mcp add postgres -e DATABASE_URI=\"postgresql://user:pass@localhost:5432/db\" -- uvx postgres-mcp --access-mode=restricted. The server needs Python 3.12 or higher, or Docker with the crystaldba/postgres-mcp image, which the README recommends because Python installs hit more environment-specific issues. Restricted mode is the one to use for anything shared."
  - q: "How safe is restricted mode?"
    a: "It runs SQL in read-only transactions, parses each statement with the pglast library, rejects anything containing COMMIT or ROLLBACK so the transaction cannot be escaped, and limits query execution time. The README adds a caveat: if unsafe stored procedure languages are enabled on the database, the read-only protections could be circumvented. A database role with read-only privileges is still the stronger control."
  - q: "Which Postgres versions and extensions does it need?"
    a: "The README says testing focuses on Postgres 15, 16 and 17, with plans to support 13 through 17. Index tuning and workload analysis need the pg_stat_statements and hypopg extensions. Managed services usually have both available, and you load them with CREATE EXTENSION IF NOT EXISTS. On self-managed Postgres, pg_stat_statements must be in shared_preload_libraries and hypopg may need a package install."
audience: ["analysts"]
---

Postgres MCP Pro lets an agent work with a Postgres database without reducing the job to "run whatever SQL the model writes." It is an open-source server from Crystal DBA that pairs the model with deterministic tooling: real EXPLAIN plans, simulated indexes, a search-based index advisor and health checks adapted from PgHero. The model orchestrates and explains; the recommendations come from algorithms.

It fits developers and analysts who want an agent to diagnose slow queries or explore a schema, and DBAs who want that to happen read-only.

## Highlights

The server exposes nine tools, all as MCP tools rather than resources:

- **`list_schemas`, `list_objects`, `get_object_details`.** Schema navigation, down to a table's columns, constraints and indexes.
- **`execute_sql`.** Runs SQL, limited to read-only statements in restricted mode.
- **`explain_query`.** Returns the execution plan, and can be invoked with hypothetical indexes to show what the planner would do after you add them.
- **`get_top_queries`.** Reports the slowest queries by total execution time from `pg_stat_statements`.
- **`analyze_workload_indexes`.** Finds resource-intensive queries in the workload and recommends indexes for them.
- **`analyze_query_indexes`.** Does the same for a list of up to 10 specific queries.
- **`analyze_db_health`.** Checks buffer cache hit rates, connection health, constraint validation, index health (duplicate, unused, invalid), sequence limits and vacuum health.

Two access modes sit at opposite ends. `--access-mode=unrestricted` allows writes and is meant for development databases. `--access-mode=restricted` is read-only with a time limit on queries. Both stdio and SSE transports are supported; `--transport=sse` lets several clients share one server.

## In an AI-assisted workflow

```bash
claude mcp add postgres \
  -e DATABASE_URI="postgresql://user:pass@localhost:5432/db" \
  -- uvx postgres-mcp --access-mode=restricted
```

The Docker form for any MCP client, from the README, with the mode switched to restricted:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "DATABASE_URI",
               "crystaldba/postgres-mcp", "--access-mode=restricted"],
      "env": {
        "DATABASE_URI": "postgresql://username:password@localhost:5432/dbname"
      }
    }
  }
}
```

The image remaps `localhost` so the container can reach a database on the host. Then enable the extensions the tuning tools depend on:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS hypopg;
```

A prompt that uses the server as intended:

```text
The orders dashboard is slow. Check the top queries, propose indexes,
and simulate each one with explain_query before recommending it.
```

This is the data layer under the site's Postgres workflow: [profile queries](/commands/perf/profile-postgres-queries), [pick the index](/skills/database/postgres-index-strategist), [optimize the SQL](/skills/data/sql-optimizer). With the server connected, the agent measures instead of guessing.

> [!TIP]
> Without `pg_stat_statements` and `hypopg` you still get schema browsing, `execute_sql`, plain EXPLAIN and the health check. The workload and hypothetical-index features are the ones that need them.

## Good to know

- **Release pace.** The latest tagged release on GitHub and PyPI is 0.3.0, published May 16, 2025. The repository still receives commits and has about 3,500 stars as of November 2026, but there has been no new packaged version in over a year, so check open issues before depending on it.
- **Credentials.** The connection string travels in `DATABASE_URI`. Keep it in an environment variable rather than committed config, as the [MCP setup guide](/guides/mcp/claude-code-mcp-setup) describes.
- **Restricted is not a sandbox.** It protects integrity, not confidentiality: the agent can still read every row the database user can. Connect with a role scoped to what the agent should see.
- **SSE only for sharing.** The shared-server option uses the older SSE transport (`http://localhost:8000/sse`), not Streamable HTTP.
- **Health checks are borrowed.** The README says they are adapted from PgHero and that the team is "working to fully validate these checks."
- **Experimental LLM index tuning.** The README labels its LLM-driven index tuning method "Experimental" as of November 2026; the default advisor is the search-based one.

Alternatives depend on where your database lives. For Supabase projects, the [official Supabase server](/tools/supabase-mcp) understands the platform around the database as well as the SQL. If you need MySQL, SQL Server, SQLite or other engines from one server, `bytebase/dbhub` (MIT) covers several databases and shipped a release in November 2026. For schema changes rather than diagnosis, [pgroll](/tools/pgroll) handles zero-downtime migrations, and the [Postgres indexing guide](/guides/database/postgres-indexing-at-scale) covers the reasoning the index advisor automates.
