---
name: "Supabase MCP"
title: "Supabase MCP"
description: "Supabase's official MCP server: run SQL and migrations, query logs and advisors, generate types, and deploy Edge Functions, with read-only and project scoping."
date: 2026-06-11
updated: "2026-11-27"
reviewed: "2026-11-27"
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
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "tool:postgres-mcp", "command:db-migrate", "agent:postgres-migration-engineer", "command:scaffold-pgvector-schema"]
alternativeTo: ["postgres-mcp", "pgroll", "github-mcp-server"]
summary: "Supabase MCP is Supabase's official, Apache-2.0 MCP server, hosted at mcp.supabase.com. An agent can run SQL, apply migrations, query logs, read advisors, generate types and deploy Edge Functions. URL parameters scope it down: project_ref pins one project, read_only=true runs every query as a read-only Postgres user, and features limits the tool groups."
faq:
  - q: "How do I connect Supabase to Claude Code?"
    a: "Add the hosted server, then authenticate: claude mcp add --scope project --transport http supabase \"https://mcp.supabase.com/mcp?project_ref=<your-project>&read_only=true\", then run /mcp, pick supabase and choose Authenticate to sign in with OAuth. In CI, where a browser flow is impossible, pass a personal access token in an Authorization: Bearer header instead."
  - q: "What can agents do through the Supabase MCP server?"
    a: "Tools come in feature groups: database (execute_sql, apply_migration, list_tables, list_extensions, list_migrations), debugging (query_logs, get_advisors), development (generate_typescript_types, project URL and publishable keys), functions (list, get and deploy Edge Functions), docs (search_docs), account (projects and organizations), branching, notebooks and feedback. A storage group exists but is disabled by default."
  - q: "Is it safe to point it at production?"
    a: "Only with limits. Supabase's docs say to connect a production project only when the task needs production evidence, and then to scope the server to that project, turn on read-only mode and restrict the feature groups. They also warn about prompt injection: text stored in your tables, such as a support ticket, can instruct the agent to run queries, so keep manual approval of tool calls on."
  - q: "Does the Supabase MCP server work with local or self-hosted Supabase?"
    a: "Yes, with less. The Supabase CLI serves an MCP endpoint at http://localhost:54321/mcp, and self-hosted Supabase can enable one, but the README says both currently offer a limited subset of tools and no OAuth 2.1. For any other Postgres database, use a generic Postgres MCP server instead."
audience: ["analysts"]
---

[Supabase MCP](https://supabase.com/mcp) is Supabase's official MCP server. It gives a coding agent the working surface of a Supabase project (schema, SQL, migrations, logs, advisors, types, Edge Functions) through one hosted endpoint, `https://mcp.supabase.com/mcp`, with sign-in over OAuth. The code is Apache-2.0 at [supabase/mcp](https://github.com/supabase/mcp).

The design choice worth copying is **scoping by URL**. `?project_ref=` pins the server to one project and removes the account-level tools, `&read_only=true` executes every query as a read-only Postgres user, and `&features=` limits which tool groups load. The safety posture is visible in the config file, where a reviewer can see it.

## Highlights

- **Database work end to end.** `execute_sql` for queries, `apply_migration` for tracked DDL, and `list_tables`, `list_extensions` and `list_migrations` for orientation.
- **Debugging against real evidence.** `query_logs` runs a read-only SQL query over project logs, so the agent can filter and aggregate instead of paging through raw lines. `get_advisors` returns Supabase's security and performance findings.
- **Codegen and deploy.** `generate_typescript_types` from the live schema, plus `list_edge_functions`, `get_edge_function` and `deploy_edge_function`.
- **Confirmations for risky calls.** With a client that supports MCP elicitation, the server pauses for confirmation before destructive SQL, before running notebooks, and before `create_project` or `create_branch`, where it shows the rate and billing interval first. Supabase calls this a guardrail, not a guarantee of human review.
- **Secrets stay out of chat.** `create_edge_function_secret` asks for the secret's name only and sends you to the Supabase Dashboard to enter the value.
- **Notebooks.** `create_notebook` and `run_notebook` work with project notebooks; one run executes at most 50 query cells.
- **Branching.** `create_branch`, `merge_branch`, `reset_branch` and `rebase_branch` let an agent experiment off production. Supabase's docs label this tool group experimental as of November 2026.

## In an AI-assisted workflow

```bash
claude mcp add --scope project --transport http supabase \
  "https://mcp.supabase.com/mcp?project_ref=<your-project>&read_only=true&features=database,debugging,docs"
# /mcp → supabase → Authenticate, then:
# > Check the advisors and slow queries on this project and propose the top 3 fixes
```

Start read-only: advisors, logs and `EXPLAIN`-style analysis cover most day-to-day value. Granting writes is a deliberate second step, ideally against a branch, with `apply_migration` so changes land as tracked migrations and not ad-hoc DDL.

The hosted server registers your client automatically (dynamic client registration), so there is no token to create for interactive use. For CI, generate a personal access token scoped to the one project and pass it as an `Authorization: Bearer` header; clients that demand an OAuth client ID and secret can use a manually created OAuth app.

> [!WARNING]
> An agent with `execute_sql` against production can read or change anything your account can. Default to `read_only=true`, pin `project_ref`, trim `features`, do write work on branches, and put `ask` rules on the mutating tools in [your permissions](/guides/configuration/claude-code-settings-permissions). Supabase's docs add one more rule: the server runs with your developer permissions, so never hand it to your customers or end users.

## Good to know

**Status.** The server is pre-1.0 and moving fast: `mcp-server-supabase` v0.21.0 was released on November 26, 2026, six days after v0.19.0. The repository has about 3,000 GitHub stars as of November 2026. Expect tool names to shift between versions; the logs tool, for one, is now `query_logs`.

**Cost.** The server itself is open source. What it creates is billed like anything else on Supabase: new projects and branches incur charges, which is what the cost confirmation step is for.

**Limits.** The local endpoint in the Supabase CLI (`http://localhost:54321/mcp`) and the self-hosted one offer a limited subset of tools and no OAuth 2.1. The hosted server does not send `structuredContent` in tool results, so typed clients parse JSON out of the text content. Enabling the notebooks group lets an agent run notebook SQL even when the database and debugging groups are off, so review notebook cells before allowing it. The older `@supabase/mcp-server-postgrest` package is deprecated.

**Alternatives.** For Postgres that isn't Supabase, [Postgres MCP Pro](/tools/postgres-mcp) connects to any database by connection string and adds index tuning and health checks. For schema changes without an agent holding a database connection at all, [pgroll](/tools/pgroll) runs zero-downtime, reversible migrations from files you review. Supabase MCP is the right pick when the project already lives on Supabase and you want logs, advisors and Edge Functions in the same session as the SQL.
