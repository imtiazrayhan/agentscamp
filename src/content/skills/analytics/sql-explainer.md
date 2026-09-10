---
name: "sql-explainer"
description: "Walk through a pasted SQL query in execution order in plain language: what each step does, the grain of the result, where a join can fan rows out, which filters silently drop rows, and a ranked list of what could be wrong. Comprehension only, not performance tuning. Use when you inherited a query, are reviewing one before trusting its numbers, or have to explain it to someone who does not read SQL."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["claude", "analysts", "sql", "code-reading", "cowork"]
featured: false
related: ["skill:sql-optimizer", "command:define-metric", "agent:analysis-reviewer", "agent:sql-pro", "glossary:text-to-sql", "guide:claude-skills-for-data-analysts"]
seoDescription: "A Claude skill that explains a pasted SQL query in execution order: grain of the result, join fan-out, silently dropped rows, and what could be wrong."
summary: "Paste a query and this skill explains it in execution order in plain language, states the grain of the result, names every join that can fan rows out, lists the filters that silently drop rows (inner joins, WHERE on a nullable column, date boundaries), and ends with a ranked what-could-be-wrong list. It reads for meaning, not for speed."
---

Most of the SQL an analyst is asked to trust was written by somebody else, often somebody who has left. This skill reads a pasted query the way you would read it out loud to a colleague: in the order the database actually resolves it, saying what each step does to the rows, and ending on the two questions that decide whether the output is usable. What is one row of the result, and which rows never made it here? It is comprehension, not tuning, and it needs no connection, no plan, and no shell, so it runs identically on claude.ai, in Claude Code, and in Claude Cowork.

## When to use this skill

- You inherited a dashboard query and have to defend its numbers in a meeting.
- A metric looks wrong and you want the query read carefully before the data is blamed.
- You are reviewing someone's query and want a structured read rather than a skim.
- You have to explain what a query does to a stakeholder who does not read SQL.

> [!NOTE]
> This skill does not tune performance. It never proposes an index, reasons about a plan, or claims a rewrite is faster. When the question is "why is this slow", use the [sql-optimizer](/skills/data/sql-optimizer) skill, which reads a real `EXPLAIN ANALYZE` and measures the fix. It also does not run the query, so every statement about row counts is conditional on the data, and it says so.

## Instructions

1. **Note the dialect and what you can see.** Identify the dialect from the syntax where it is visible (Postgres, BigQuery, Snowflake, MySQL) and say when you cannot tell. List what the query references but you were not given: table definitions, column nullability, whether a "table" is really a view. Every later claim is conditional on those unknowns and should be phrased that way.
2. **Restate the query's apparent purpose in one sentence** before explaining any of it, so the reader can immediately see whether the query does what its name implies.
3. **Walk it in execution order, not written order.** `FROM` and `JOIN`, then `WHERE`, `GROUP BY`, aggregates, `HAVING`, window functions, `SELECT`, `DISTINCT`, `ORDER BY`, `LIMIT`. For a CTE chain, take each CTE in dependency order and state its grain before moving on. One short paragraph per step: what comes in, what it does, what comes out.
4. **State the grain of the result explicitly.** One sentence: "one row per customer per calendar month, for customers with at least one order in the window". Then state the grain of every intermediate step where it changes, because a grain change in the middle of a query is where most double counting is born.
5. **Find the join fan-out.** For each join, say which side can match more than once and what that does downstream. Name the classic pattern: a one-to-many join before an aggregate inflates every `SUM` and `COUNT` from the "one" side, so revenue gets multiplied by the number of line items. Say which aggregates here are exposed, and give the check: count rows before and after the join, or count distinct on the key.
6. **List the filters that silently drop rows**, working through them all: an inner join where a left join was meant, so unmatched rows vanish without a trace; a `WHERE` condition on a nullable column, since `NULL` fails every comparison including `!=`, so rows with nulls disappear from both sides of what looks like an exhaustive split; a `WHERE` clause on the right-hand table of a `LEFT JOIN`, which quietly turns it into an inner join; date boundaries, where `BETWEEN` includes both ends and a timestamp compared against a date drops everything after midnight; `NOT IN` against a subquery containing one null, which returns nothing at all; and `HAVING` removing whole groups after aggregation.
7. **Check the aggregates against the grain.** Whether `COUNT(*)`, `COUNT(column)`, and `COUNT(DISTINCT column)` are each the right one where used; whether an average of an average is being taken; whether a window's `PARTITION BY` matches the grain the reader assumes; and whether `DISTINCT` is hiding a fan-out instead of fixing it.
8. **Write the "what could be wrong" list, ranked.** Each item names the risk, the line or CTE it lives on, and the specific check that would settle it, phrased so someone can run it: "run the query with the join removed and compare `COUNT(*)`", "check whether `refunded_at` is nullable", "re-run with the end date pushed one day out and see whether the total moves". Rank by how much the number would move if the risk is real.
9. **Close with a plain-language summary** a non-SQL reader can use: three or four sentences ending with the grain and the caveat that matters most.

## Output

An explanation in the order above: dialect and unknowns, purpose, the execution-order walkthrough, the grain statement, the fan-out analysis, the silent-drop list, the aggregate check, the ranked what-could-be-wrong list with its checks, and the plain-language summary. Paste the summary into the thread and keep the checks for the rerun. When the query defines a metric other people will use, [/define-metric](/commands/analytics/define-metric) turns your reading of it into a written definition with a grain and an owner. When it sits inside a finished analysis, the [analysis-reviewer](/agents/analytics/analysis-reviewer) agent runs these checks across the notebook, the SQL, and the prose together.

## Example

Excerpt from a reading of a monthly revenue query:

```markdown
Grain: one row per customer per month. The `orders` to `order_items` join is one-to-many.

Fan-out: `SUM(orders.total)` is computed after joining `order_items`, so every order's total is counted
once per line item. An order with 3 items contributes 3x. Check: compare `SUM(o.total)` before the join
with the current figure; they should be equal and probably are not.

Silently dropped rows:
- `JOIN customers` is an inner join, so orders from deleted customers are absent. Nothing in the output
  says so.
- `WHERE o.canceled_at IS NULL` is correct, but the parallel query that reports cancellations uses
  `WHERE o.canceled_at != ''`, which drops nulls; the two will not reconcile.
- `BETWEEN '2026-08-01' AND '2026-08-31'` on a timestamp column drops everything after midnight on the
  31st. Check: push the bound to `< '2026-09-01'` and see whether the total moves.
```

Turning natural language into SQL, and back, is covered in [text-to-SQL](/glossary/text-to-sql) and in [Claude skills for data analysts](/guides/analytics/claude-skills-for-data-analysts).
