---
title: "Text-to-SQL with Claude: A Safe Read-Only Postgres Setup"
description: "Set up text-to-SQL with Claude on Postgres safely: a read-only role, an MCP server in read-only mode, schema and metric context, and a two-way check."
seoTitle: "Text-to-SQL with Claude: A Safe Read-Only Postgres Setup"
seoDescription: "Text-to-SQL on Postgres with Claude: create a read-only role, add the MCP server in read-only mode, feed it the schema, and validate every number twice."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "data-ml", "mcp"]
audience: ["analysts"]
tags: ["text-to-sql", "postgres", "mcp", "sql", "claude-code", "read-only", "analytics"]
featured: false
keywords: ["text-to-SQL Claude", "Claude Postgres MCP read-only", "safe AI SQL access", "read-only Postgres role for AI", "natural language to SQL Postgres"]
summary: "Text-to-SQL is safe when the connection cannot write, not when the prompt says not to. Create a read-only Postgres role, add the MCP server in its read-only mode, give Claude the schema and your metric definitions, read the generated SQL before it runs, and reconcile the number two ways before it reaches a slide."
keyTakeaways:
  - "Safety is a grant, not a prompt: connect Claude as a role with USAGE and SELECT only, and no write privilege to revoke later."
  - "Run the server in read-only mode too. Postgres MCP Pro takes --access-mode=restricted; the Supabase server takes read_only=true in the URL."
  - "ALTER ROLE ... SET default_transaction_read_only = on is a default a session can change. The grants are what actually hold."
  - "Schema quality dominates output quality. Column comments, a metric definitions file, and three worked examples beat any prompt engineering."
  - "Read the SQL before it runs. Put the query tool in the ask list so every statement needs a keystroke."
  - "Validate every number two ways, then save the query with its definition so the next answer matches this one."
  - "Set statement_timeout and a row cap on the role; an agent exploring a fact table can otherwise scan far more than you meant."
howtoSteps:
  - name: "Create a read-only database role"
    text: "Create a login role for Claude, grant CONNECT on the database, USAGE on each schema it may read, and SELECT on the tables in those schemas. Add ALTER DEFAULT PRIVILEGES so new tables are covered, then set default_transaction_read_only and statement_timeout on the role. Grant nothing else."
  - name: "Add the MCP server in read-only mode"
    text: "For self-hosted Postgres, add Postgres MCP Pro with the read-only connection string and --access-mode=restricted. For Supabase, add the hosted server with project_ref and read_only=true in the URL. Use project scope so the config lands in .mcp.json for the team."
  - name: "Give Claude the schema and the metric definitions"
    text: "Write a docs/metrics.md that names the canonical tables, the join keys, the grain of each table, the filters every query must apply, and the exact definition of each business metric. Add column comments in the database itself so they travel with the schema."
  - name: "Ask the question in business terms"
    text: "Ask for the metric by name and the grain you want, not for SQL. Name the time range and the timezone, and say which definition file applies. Ask Claude to state the assumptions it made before writing the query."
  - name: "Read the generated SQL before running it"
    text: "Check the FROM and JOIN list against the canonical tables, the join type, the filters, the date boundaries and timezone conversion, and the GROUP BY grain. Put the query tool in the permission ask list so nothing executes without a keystroke."
  - name: "Validate the number two ways"
    text: "Reconcile the total against a number you already trust, such as last month's close or an existing dashboard, then recompute the same figure by a different route, such as a daily breakdown that sums to the monthly total. Investigate any gap before the number leaves your screen."
  - name: "Save the query and the definition together"
    text: "Commit the final SQL to your repo next to the metric definition it implements, with a comment naming the question it answers and the date it was validated. Reuse it next month instead of regenerating it."
faq:
  - q: "Is text-to-SQL accurate enough to trust?"
    a: "On a clean, well-documented schema with a stated metric definition, generated SQL is usually structurally right and occasionally subtly wrong in ways that still return a plausible number: the wrong join type, a filter applied after an aggregate, a date boundary off by a timezone. That is why the workflow ends with reading the SQL and reconciling the number two ways rather than with a chart."
  - q: "Why does schema quality matter more than the model?"
    a: "The model can only work from what it can see. A table called t_ord_hdr with untyped codes and no comments forces guessing; the same table with column comments, a documented grain, and a metric definitions file removes the guessing. Teams that invest in a semantic layer or even a plain metrics markdown file get better results from every text-to-SQL tool, not just Claude."
  - q: "Can I point this at production?"
    a: "Point it at a read replica or a warehouse copy if you have one. If you must use production, use a role with SELECT only, run the MCP server in read-only mode, scope it to one database, set a statement timeout, and keep the query tool on the ask list. Supabase's own documentation warns against connecting a production project with write access."
  - q: "Does the read-only setting alone make it safe?"
    a: "No. default_transaction_read_only is a session default, and a session can change it; the MCP server's read-only mode is enforced by the server, which is a different process than the database. Privileges are the layer that cannot be talked out of. Set all three and treat the first two as convenience, the third as the guard."
related: ["guide:claude-for-data-analysis", "guide:claude-code-for-data-analysts", "guide:check-an-ai-data-analysis", "guide:best-text-to-sql-tools-2026", "tool:postgres-mcp", "tool:supabase-mcp", "glossary:text-to-sql", "glossary:semantic-layer"]
sources:
  - title: "Postgres MCP Pro: access modes and protected SQL execution"
    url: "https://github.com/crystaldba/postgres-mcp"
    publisher: "Crystal DBA"
  - title: "Supabase MCP server (read_only, project_ref, feature groups)"
    url: "https://supabase.com/docs/guides/getting-started/mcp"
    publisher: "Supabase"
  - title: "PostgreSQL: GRANT"
    url: "https://www.postgresql.org/docs/current/sql-grant.html"
    publisher: "PostgreSQL Global Development Group"
  - title: "PostgreSQL: predefined roles (pg_read_all_data)"
    url: "https://www.postgresql.org/docs/current/predefined-roles.html"
    publisher: "PostgreSQL Global Development Group"
  - title: "Connect Claude Code to tools via MCP"
    url: "https://code.claude.com/docs/en/mcp"
    publisher: "Anthropic"
---

Text-to-SQL is safe when the connection cannot write, not when the prompt says not to. This guide sets up Claude against Postgres in the order that matters: a read-only role first, the MCP server in its read-only mode second, schema and metric context third, and only then a question. The last two steps, reading the SQL and reconciling the number, are what turn a plausible answer into one you can put in front of someone.

It assumes you already have Claude in the terminal; if not, [Claude Code for data analysts](/guides/analytics/claude-code-for-data-analysts) covers the repo setup and [Claude for data analysis](/guides/analytics/claude-for-data-analysis) is the wider pillar. The concept itself is defined in the glossary under [text-to-SQL](/glossary/text-to-sql).

## Step 1: Create a read-only role

Do this before you install anything. Every other guard in this guide sits above the database; this one sits inside it.

```sql
CREATE ROLE claude_ro LOGIN PASSWORD 'use-a-generated-secret';

GRANT CONNECT ON DATABASE analytics TO claude_ro;
GRANT USAGE ON SCHEMA public TO claude_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO claude_ro;

-- Cover tables created after today
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO claude_ro;

-- Defaults for every session this role opens
ALTER ROLE claude_ro SET default_transaction_read_only = on;
ALTER ROLE claude_ro SET statement_timeout = '30s';
```

On Postgres 14 and later, `GRANT pg_read_all_data TO claude_ro;` is a shortcut: the predefined role reads all tables, views, and sequences as if it held SELECT on them and USAGE on every schema. It does not bypass row-level security, so if you use RLS the policies still apply, which is usually what you want here.

Two honest notes about `default_transaction_read_only`. It is a *default*, not a privilege: a session can set it back off. And its scope is the transaction, not the connection. It is worth setting because it turns an accidental write into an immediate error, but the `GRANT` list above is the layer that holds when everything else fails. If your warehouse is Snowflake, BigQuery, or Databricks rather than Postgres, the shape is identical: a role with read privileges on named objects, a statement timeout, and nothing else.

> [!WARNING]
> Point this at a read replica or a warehouse copy if you have one. Supabase's documentation is blunt about the alternative: before connecting a production project, scope the server to that project, enable read-only mode, restrict the feature groups, and review the risks.

## Step 2: Add the MCP server in read-only mode

For self-hosted Postgres, [Postgres MCP Pro](/tools/postgres-mcp) is the maintained server:

```bash
claude mcp add --scope project \
  --env DATABASE_URI="postgresql://claude_ro:...@host:5432/analytics" \
  --transport stdio postgres -- uvx postgres-mcp --access-mode=restricted
```

`--access-mode=restricted` limits the server to read-only transactions with an execution-time cap. It also parses each statement before running it and rejects SQL containing `COMMIT` or `ROLLBACK`, which closes the obvious escape (`ROLLBACK; DROP TABLE users;`) from a read-only transaction. Its own documentation is candid that Postgres has no connection-level read-only switch, which is exactly why the role in step 1 is not optional.

For Supabase-hosted Postgres, [the official Supabase server](/tools/supabase-mcp) is the better fit and its safety posture lives in the URL:

```bash
claude mcp add --scope project --transport http supabase \
  "https://mcp.supabase.com/mcp?project_ref=<your-project>&read_only=true&features=database,docs"
```

`read_only=true` runs queries as a read-only Postgres user, `project_ref` pins the server to one project and drops the account-management tools, and `features=` limits it to the tool groups you name. `--scope project` writes the server to `.mcp.json` at the repo root so the team inherits the same configuration; each person approves it once. Alternatives to both servers are compared in [the best text-to-SQL tools](/guides/comparisons/best-text-to-sql-tools-2026).

Before you ask a real question, prove the setup. Ask Claude to run `CREATE TABLE _probe (id int);` and confirm it comes back as a permission error, not a success. A read-only setup that has never been tested is a belief, not a control, and the failure mode is discovering it during an incident. General MCP mechanics, including scopes and troubleshooting, are in the [Claude Code MCP setup guide](/guides/mcp/claude-code-mcp-setup).

## Step 3: Give Claude the schema and the definitions

This is the step that decides whether the output is any good, and it is the one most people skip. A model writing SQL is doing schema archaeology: it reads table and column names, types, and whatever comments exist, and guesses the rest. Ambiguity in the schema becomes ambiguity in the answer.

Three things to supply, in order of payoff:

1. **Column comments, in the database.** `COMMENT ON COLUMN orders.status IS 'paid | refunded | pending; refunds keep the original row'` travels with the schema, so every tool sees it, not just this session.
2. **A metric definitions file.** One markdown file naming the canonical table for each subject area, the grain of each table (one row per what?), the join keys, the filters every query must apply (`is_internal = false`, `is_test = false`), and the exact definition of each metric including its timezone. Reference it from `CLAUDE.md`.
3. **Three worked examples.** A correct query for a simple lookup, one for a cohort, and one for a period comparison. Examples teach conventions faster than prose.

If your organization already maintains a [semantic layer](/glossary/semantic-layer), point Claude at it and skip most of the above: that is the same job, done centrally and versioned.

## Step 4: Ask, then read the SQL before it runs

Ask in business terms, not in SQL: "Monthly paid revenue by product line for the trailing 12 months, calendar months in America/New_York, using the definitions in docs/metrics.md. State your assumptions before you write the query."

Then read what comes back. The five things that go wrong most often, in the order they are easiest to spot:

- **Wrong table.** A staging or shadow copy that looks canonical.
- **Wrong join type.** An inner join where a left join was meant silently drops the rows you were counting.
- **Filter after aggregation.** A `HAVING` where a `WHERE` belonged, or the reverse, moves the number without moving the shape.
- **Date boundaries.** UTC timestamps bucketed into local months without conversion shift revenue across the month end.
- **Grain.** A `GROUP BY` one level off produces double counting that looks like growth.

Make this a keystroke rather than a habit: put the query tool in the `ask` list in `.claude/settings.json`, exactly as `mcp__postgres__execute_sql` with no parentheses, and Claude Code prompts you before every statement.

## Step 5: Validate the number two ways, then save it

One number from one query is a hypothesis. Reconcile it against something you already trust (last month's close, the existing dashboard, a total you know by heart), then recompute it by a different route: a daily breakdown that sums to the monthly figure, or a count of distinct IDs against a count of rows. Gaps are informative in both directions. The full pass, including the failure modes that survive both checks, is [How to check an AI data analysis](/guides/analytics/check-an-ai-data-analysis).

When it reconciles, save the SQL in your repo next to the definition it implements, with a comment naming the question and the date you validated it. That file, not the chat transcript, is what makes next month's answer match this month's.

> [!TIP]
> Add row and cost guards once and forget them: `statement_timeout` on the role, a `LIMIT` convention in your definitions file for exploratory queries, and, on a warehouse that bills by scanned bytes, a partition-filter rule stated as a house rule Claude must follow. An agent exploring a fact table can scan far more than you intended in a single curious query.
