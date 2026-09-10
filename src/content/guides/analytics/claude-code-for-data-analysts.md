---
title: "Claude Code for Data Analysts: Notebooks, SQL, and CSV Work Without a Data Engineer"
description: "Run analysis work in Claude Code: an analysis repo with CLAUDE.md, a CSV profiling pass, a pandas loop, a read-only warehouse query, and permission rules."
seoTitle: "Claude Code for Data Analysts: Notebooks, SQL, and CSV Work"
seoDescription: "Set up Claude Code for analysis: an analysis repo with CLAUDE.md, CSV profiling, a pandas loop, read-only warehouse queries, and deny rules that hold."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "data-ml", "coding-languages"]
audience: ["analysts"]
tags: ["claude-code", "analytics", "pandas", "sql", "csv", "claude-md", "permissions"]
featured: false
keywords: ["Claude Code for data analysts", "Claude Code pandas", "Claude Code CSV analysis", "CLAUDE.md analytics repo", "read-only Claude Code permissions"]
summary: "Claude Code puts Claude in a folder on your machine, so the CSV stays on disk, the analysis ends up as a script you can rerun, and git shows what changed since last month. This guide sets up an analysis repo with a CLAUDE.md, three workflows (profile a CSV, a pandas loop, a warehouse query over MCP), and the deny rules that keep the agent read-only."
keyTakeaways:
  - "The difference from a chat window is not intelligence, it is artifacts: files on disk, a script you can rerun, and a diff that shows what changed."
  - "CLAUDE.md loads at the start of every session. Put data locations, the metric definitions that must hold, and the never-do rules there, under 200 lines."
  - "CLAUDE.md is context, not enforcement. Permission rules in settings.json are what actually stop an action; write both."
  - "Claude Code checks file path rules against Read() and Edit() only. A Write(path) rule is accepted, never consulted, and warns at startup."
  - "Point the warehouse connection at a read-only role and run Postgres MCP Pro with --access-mode=restricted; never at a write-capable credential."
  - "Deny rules do not cover a Python script that opens files itself. For OS-level enforcement, turn on the sandbox."
faq:
  - q: "Do I need to know Python to use Claude Code as an analyst?"
    a: "You need to read Python, not write it. Claude writes the pandas or SQL; your job is to check that the join keys, filters, and date boundaries match what you asked for, and to run the script again next month. If the terminal itself is new to you, the non-developer guide covers install, permission prompts, and what each prompt means before you touch data."
  - q: "Is my data sent anywhere when Claude Code reads a CSV?"
    a: "Claude Code runs locally but it is a model client, so any file content it reads to answer you goes to the model as context, the same as pasting it into the chat window. The practical control is what you let it read: keep raw exports out of the working directory or add a Read deny rule for them, and have Claude work on aggregates rather than row-level personal data."
  - q: "Notebook or script?"
    a: "Script for the loop, notebook for the presentation. Scripts diff cleanly in git, rerun without hidden state, and are what you want when the same analysis comes back next quarter. Export to a notebook when a stakeholder wants to see the steps and the charts inline."
  - q: "How do I stop Claude from writing to the database?"
    a: "Two layers, both required. Connect it with a read-only database role so a write cannot succeed even if it is attempted, and run the MCP server in its read-only mode: Postgres MCP Pro's --access-mode=restricted limits it to read-only transactions, and the Supabase server's read_only=true parameter switches it to a read-only Postgres user. Instructions in CLAUDE.md are not a substitute for either."
related: ["guide:claude-for-data-analysis", "guide:text-to-sql-with-claude", "guide:check-an-ai-data-analysis", "guide:claude-data-plugin-guide", "skill:dataset-first-look", "skill:analysis-memo-writer", "agent:analysis-reviewer", "tool:postgres-mcp"]
sources:
  - title: "How Claude remembers your project (CLAUDE.md)"
    url: "https://code.claude.com/docs/en/memory"
    publisher: "Anthropic"
  - title: "Configure permissions (Claude Code)"
    url: "https://code.claude.com/docs/en/permissions"
    publisher: "Anthropic"
  - title: "Connect Claude Code to tools via MCP"
    url: "https://code.claude.com/docs/en/mcp"
    publisher: "Anthropic"
  - title: "Postgres MCP Pro: access modes"
    url: "https://github.com/crystaldba/postgres-mcp"
    publisher: "Crystal DBA"
  - title: "pandas.DataFrame.merge (validate and indicator)"
    url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html"
    publisher: "pandas"
---

Claude Code is Claude working inside a folder on your machine instead of a browser tab. For analysis work that changes three things: the file stays on disk, the answer arrives as a script you can run again next month, and git records what changed between this version and the last one. This guide sets up an analysis repo, three workflows, and the permission rules that keep the agent read-only.

It is the terminal half of the toolkit. The wider picture, including when the chat app or [Claude for Excel](/guides/analytics/claude-for-excel-guide) is the better tool, is in the pillar, [Claude for data analysis](/guides/analytics/claude-for-data-analysis).

## Why a terminal agent beats a chat window for repeatable work

A chat window is excellent for one question about one table. It is poor at the second half of an analyst's job, which is doing the same thing again, correctly, in four weeks. Three mechanical differences:

- **Files stay where they are.** You point Claude at `data/exports/orders_2026_08.csv` and it reads the file. Nothing is uploaded, nothing is retyped, and a large export is not a problem the way a paste is. Claude still sends what it reads to the model, so *what* it may read is a permissions question, covered below.
- **The output is a script, not a message.** Ask a chat app for monthly revenue by product line and you get a number. Ask Claude Code and you get `scripts/monthly_revenue.py`, the number, and the ability to rerun it on September's export without re-explaining anything.
- **Version control makes the analysis auditable.** When last month's churn number and this month's disagree, `git diff` on the script tells you whether the data moved or the definition did.

And `CLAUDE.md` loads at the start of every session, so the rules you would otherwise retype (which table is canonical, how active user is defined, what never to touch) are in context before your first prompt.

## Setup, and permissions in plain language

Install first: [Installing Claude Code](/guides/getting-started/installing-claude-code) is the ten-minute setup, and [Claude Code for non-developers](/guides/founders/claude-code-for-non-developers) explains the permission prompts in plain language before you point it at anything real.

The short version for analysts: reading files inside your working directory does not prompt; running a shell command does, except for a built-in set of read-only commands. The agent can look at your CSVs freely, and every `python`, `psql`, or `rm` is a decision you make. Pre-approve the boring ones and permanently block the dangerous ones with the rules below.

## A CLAUDE.md for an analysis repo

Create the repo with `data/`, `scripts/`, `notebooks/`, and `output/`, then write a `CLAUDE.md` at the root. Keep it under 200 lines; long files get followed less reliably.

```markdown
# Analysis repo

## Where the data is
- `data/exports/` — CSV drops from the warehouse, `<table>_<YYYY_MM>.csv`. Never edit or delete these.
- `data/derived/` — outputs of `scripts/`. Safe to regenerate, never hand-edited.
- Warehouse access is the `analytics_ro` role via the `postgres` MCP server. There is no write path from this repo.

## Metric definitions that must hold
- **Active user**: distinct `user_id` with >= 1 session in the trailing 28 days, excluding internal domains (`is_internal = false`).
- **Revenue**: `orders.amount_cents / 100`, `status = 'paid'`, refunds subtracted in the period they were issued, not the original order period.
- **Month**: calendar month in `America/New_York`, the timezone finance closes on. Warehouse timestamps are UTC; convert explicitly, every time.

## House rules
- Every script prints row count, date range, and null counts for the columns it uses, then the row count again after each join and filter.
- Every `merge` passes `validate=` and `indicator=`. An unexpected row count is a bug, not a surprise.
- No number goes in a memo without the script that produced it committed alongside it.
- Never write to prod. Never `DROP`, `DELETE`, `UPDATE`, `INSERT`, or `CREATE` anywhere.
```

That last line is worth being honest about: it is guidance, not a guard rail. Claude Code treats `CLAUDE.md` as context, not as enforced configuration. The enforcement lives in settings, which is why both exist.

## Workflow 1: profile a file before you trust it

The first question you ask about a dataset should never be the business question. Ask what the file is.

```text
> Profile data/exports/orders_2026_08.csv: row count, column types, null rate per
> column, cardinality, min and max for every date and numeric column, and the top 10
> values for each low-cardinality column. Flag anything that looks wrong: duplicate
> IDs, dates outside the export window, negative amounts, placeholder values like
> 'UNKNOWN' or 1970-01-01. Write it to output/profiles/orders_2026_08.md.
```

The [dataset-first-look](/skills/analytics/dataset-first-look) skill packages that as a repeatable pass with a fixed report shape, so August's profile and September's are diffable; [/first-look](/commands/analytics/first-look) is the one-line version. The fixed shape is the point: a null rate jumping from 0.2 percent to 11 percent between exports is visible in a diff and invisible in a conversation.

## Workflow 2: the notebook loop

Work in scripts, present in notebooks: scripts rerun without hidden cell-order state and diff cleanly.

```text
> Write scripts/monthly_revenue.py: read the August orders and refunds exports, apply
> the revenue definition in CLAUDE.md, write data/derived/monthly_revenue.csv and print
> a summary table. Print the row count after loading, after the refund join, and after
> the paid filter. Use merge(validate="one_to_many", indicator=True) and assert there
> are no right_only rows. Do not silently drop anything.
```

`validate=` makes pandas check that the merge keys are unique on the side you claim they are unique on, and `indicator=` adds a `_merge` column marking each row `left_only`, `right_only`, or `both`. Both are documented pandas arguments most analysts never type, and together they turn a silent join bug into a raised exception. One more pandas trap worth putting in `CLAUDE.md`: rows whose merge key is null are matched against each other, which is not how a SQL join behaves.

Then iterate in the terminal, not in the file. "The refund join is dropping 3,412 rows, find out why" beats editing the script yourself: the investigation lands in the transcript and the fix lands in the diff.

## Workflow 3: query the warehouse

For live data, connect a Postgres MCP server instead of exporting CSVs by hand:

```bash
claude mcp add --scope project --env DATABASE_URI="postgresql://analytics_ro:...@host:5432/analytics" \
  --transport stdio postgres -- uvx postgres-mcp --access-mode=restricted
```

`--scope project` writes the server into `.mcp.json` at the repo root so your team gets the same setup from version control; Claude Code asks each person to approve a project-scoped server the first time. `--access-mode=restricted` limits [Postgres MCP Pro](/tools/postgres-mcp) to read-only transactions with an execution-time cap, and it parses SQL before running it so a `ROLLBACK; DROP TABLE ...` cannot escape the transaction. Do that *and* connect as a read-only role: the full role setup, plus how to read generated SQL before it runs, is in [Text-to-SQL with Claude](/guides/analytics/text-to-sql-with-claude). General MCP mechanics are in the [Claude Code MCP setup guide](/guides/mcp/claude-code-mcp-setup).

## Keeping it read-only

Permission rules live in `.claude/settings.json` and are evaluated deny, then ask, then allow: the first match wins, and a deny rule cannot carry an exception.

```json
{
  "permissions": {
    "allow": ["Bash(python scripts/*)", "Bash(git diff *)"],
    "ask": ["mcp__postgres__execute_sql"],
    "deny": ["Edit(data/exports/**)", "Read(./.env)", "Bash(rm *)", "Bash(psql *)"]
  }
}
```

Four details that decide whether this works:

- **Path rules only apply to `Read()` and `Edit()`.** A `Write(data/**)` rule is accepted, never consulted, and warns at startup. Use `Edit(...)`, which covers every built-in file-editing tool.
- **MCP rules take no parentheses in a settings file.** Name the tool exactly, `mcp__postgres__execute_sql`; a rule with parentheses is skipped and reported as invalid. Putting the query tool in `ask` means you see every statement before it runs.
- **A bare tool name in `deny` removes the tool entirely**, so Claude never sees it. `Bash(rm *)` leaves Bash available and blocks the matching calls.
- **Rules do not follow subprocesses.** They cover Claude's own file tools and file commands it runs directly, not a Python script that opens files itself. For enforcement below that line, turn on the sandbox. Full rule syntax: [Claude Code settings and permissions](/guides/configuration/claude-code-settings-permissions).

## Handing results to a stakeholder

The last mile is where analysis work loses credibility, because the memo and the numbers drift apart. Two passes close that gap:

1. **Review before you write.** Delegate to the [analysis-reviewer](/agents/analytics/analysis-reviewer) agent, which re-reads the script and the output for dropped rows, grain errors, and conclusions the data does not support. The manual, tool-agnostic version is [How to check an AI data analysis](/guides/analytics/check-an-ai-data-analysis).
2. **Write from the numbers, not from memory.** The [analysis-memo-writer](/skills/analytics/analysis-memo-writer) skill turns the result table into a memo with the finding first, the method stated plainly, and the caveats where a reader will see them.

> [!TIP]
> Commit the script, the profile, and the memo in one commit. When someone questions the number in six weeks, the answer is a `git log` away instead of a search through chat history.

Anthropic ships a plugin covering some of the same ground, with warehouse and notebook connectors: [Anthropic's data plugin for Claude](/guides/analytics/claude-data-plugin-guide).
