---
title: "How to Check an AI Data Analysis Before You Trust It"
description: "Eight ways an AI-generated analysis goes wrong, the specific check that catches each one, and a copyable checklist to run before a number ships."
seoTitle: "How to Check an AI Data Analysis Before You Trust It"
seoDescription: "Eight failure modes in AI-generated analysis, from silent row drops to timezone errors, each with the check that catches it, plus a copyable checklist."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "data-ml", "llm-evals"]
audience: ["analysts"]
tags: ["analytics", "qa", "validation", "hallucination", "checklist", "data-quality"]
featured: false
keywords: ["check AI data analysis", "validate AI generated analysis", "AI analysis errors", "data analysis QA checklist", "AI hallucinated numbers"]
summary: "An AI analysis fails in eight recognizable ways: dropped rows, wrong grain, truncated inputs, numbers in the prose that contradict the table, missing null handling, timezone errors, distorted charts, and correlation sold as cause. Each has one specific check that catches it. Run them in order and the review takes ten minutes."
keyTakeaways:
  - "Row counts before and after every join and filter catch more errors than any amount of reading the code."
  - "Reconcile one total against a number you already trust. If it cannot be reconciled, nothing downstream matters."
  - "Recompute the headline figure by a different method. Agreement is evidence; a gap is the finding."
  - "Check every number in the prose against the table it came from. Restated figures drift from their source."
  - "Ask what happened to the nulls. Silent exclusion is the most common invisible filter in an analysis."
  - "Spot-check five rows by hand end to end. It is the only check that tests the whole chain at once."
  - "Charts lie through axes and scales, not data. Look at the y-axis baseline and the aggregation before the shape."
faq:
  - q: "How long should checking an AI analysis take?"
    a: "About ten minutes for a routine analysis if you run the checks in order: row counts, reconciliation, recomputation, prose against table, nulls, dates, chart, causal language. Anything going to a board, a customer, or a regulator deserves the full pass plus a second reader. The checks are fast because each one is a single number compared against another single number, not a re-read of the code."
  - q: "Can I ask the model to check its own analysis?"
    a: "Usefully, yes, as a first pass, and never as the last one. Anthropic's own guidance for reducing hallucinations is to have the model find a supporting quote for each claim and retract the ones it cannot support, and to run the same prompt more than once and compare. Both work on analyses too. What a self-check cannot do is notice a shared assumption, such as the wrong canonical table, because that assumption is in the context of both passes."
  - q: "What is the single most valuable check?"
    a: "Row count after every join and filter. Most wrong numbers are wrong because rows disappeared or multiplied at a step nobody looked at, and the printed count makes that visible immediately. Reconciling a total against a number you already trust is a close second."
  - q: "The analysis reconciles and the SQL looks right. Am I done?"
    a: "Not until you have checked the prose against the table, the null handling, and the date boundaries. Those three survive both a code read and a reconciliation, because a plausible number can be produced by an analysis that excludes a segment, drops nulls silently, or buckets a UTC timestamp into the wrong local month."
related: ["guide:claude-for-data-analysis", "guide:claude-code-for-data-analysts", "guide:text-to-sql-with-claude", "guide:claude-data-plugin-guide", "agent:analysis-reviewer", "skill:dataset-first-look", "skill:chart-chooser", "glossary:hallucination"]
sources:
  - title: "Reduce hallucinations (Claude docs)"
    url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations"
    publisher: "Anthropic"
  - title: "pandas.DataFrame.merge: null keys, validate, and indicator"
    url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html"
    publisher: "pandas"
  - title: "PostgreSQL: aggregate functions and null input"
    url: "https://www.postgresql.org/docs/current/functions-aggregate.html"
    publisher: "PostgreSQL Global Development Group"
  - title: "anthropics/knowledge-work-plugins: validate-data skill"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/data/skills/validate-data"
    publisher: "Anthropic"
---

An AI-generated analysis is usually right, occasionally wrong, and almost never obviously wrong. It arrives formatted, confident, and internally consistent, which is exactly why it needs a review that does not depend on reading the whole thing. The eight failure modes below cover nearly everything that goes wrong, and each one has a single check that catches it in under a minute.

This is tool-agnostic: it applies to a chat answer, a notebook, a warehouse query, or a dashboard someone generated in an afternoon. It is the review half of [Claude for data analysis](/guides/analytics/claude-for-data-analysis); the automated version of the same pass is the [analysis-reviewer](/agents/analytics/analysis-reviewer) agent.

## 1. Silent row drops from joins and filters

The most common wrong number is a right calculation over the wrong rows. An inner join where a left join was meant removes every customer with no order. A `WHERE region IS NOT NULL` quietly deletes the 4 percent of records where the region was never captured. Nothing errors, and the total still looks like a total.

**The check:** row count before and after every join and every filter, printed. In pandas, pass `validate="one_to_many"` so a duplicated key raises instead of multiplying rows, and `indicator=True` to get a `_merge` column labeling each row `left_only`, `right_only`, or `both`. One pandas trap worth knowing: rows whose join key is null are matched *against each other*, which is not how a SQL join behaves and can invent rows that do not exist.

## 2. Wrong grain and double counting

Ask for revenue by customer from a table that has one row per order *line* and the total inflates. Join orders to a table with multiple addresses per customer and every order is counted once per address. The output looks fine because the shape is right and only the magnitude is wrong.

**The check:** state the grain of every input table out loud before looking at the result. One row per what? Then compare `count(*)` to `count(distinct <the id you think is unique>)`. If they differ, the table is not at the grain you assumed, and every sum built on it is suspect.

## 3. Sampled or truncated inputs

Analyses run on the first 1,000 rows of a file, on a preview from a BI tool, on an export that hit a row cap, or on a query with a `LIMIT` left in from exploration. The result is a real analysis of a fragment.

**The check:** compare the row count the analysis reports against the row count of the source. Check the min and max of the date column against the period you asked about; a truncated export usually stops mid-month. If a tool is summarizing a file rather than executing code over it, assume truncation until proven otherwise.

## 4. Numbers in the prose that disagree with the table

The table says 12.4 percent, the summary paragraph says "roughly 15 percent," and the recommendation is built on the paragraph. This is the classic [hallucination](/glossary/hallucination) failure in analytical work: not an invented dataset, but a restated figure that drifted from its source.

**The check:** take every number in the narrative and find it in the output table. Anthropic's guidance for reducing hallucinations is exactly this discipline pointed at the model: require a supporting quote for each claim, and retract any claim that has none. Applied to an analysis, if a number in the memo is not in a table, it does not go in the memo.

## 5. Missing null handling

Nulls are the most common invisible filter. In SQL, `avg` and `sum` skip null inputs rather than treating them as zero, and `count(column)` skips them while `count(*)` does not; a "60 percent satisfaction average" over a column that is 40 percent null is an average of the people who answered, described as an average of everyone.

**The check:** ask what happened to the nulls, for every column used. Get the null count per column, decide explicitly whether null means zero, unknown, or not applicable, and state the decision in the output. The [dataset-first-look](/skills/analytics/dataset-first-look) skill produces those counts before the analysis starts, which is when the decision is cheapest.

## 6. Timezone and date-boundary errors

Warehouse timestamps are usually UTC; the business closes its month in a local timezone. Bucket one into the other without converting and revenue moves across the month end, weekly cohorts shift by a day, and "yesterday" means different things to the query and to the reader. Half-open ranges are the sibling error: `BETWEEN '2026-08-01' AND '2026-08-31'` silently drops everything timestamped after midnight on the 31st.

**The check:** find the timezone conversion in the code, or confirm there is nothing to convert. Then check the boundaries: run the analysis for a single known day and compare it against a source you trust for that day.

## 7. Chart axis and scale distortion

Charts distort through their axes, not their data. A truncated y-axis turns a 2 percent change into a cliff. A dual axis manufactures a correlation between two unrelated series. A linear scale hides an order-of-magnitude difference; a log scale hides a collapse. Pie charts of eight categories communicate nothing.

**The check:** read the axes before the shape. Does the y-axis start at zero, and if not, is there a stated reason? Are both series on the same scale? Does the chart type match the comparison being made? The [chart-chooser](/skills/analytics/chart-chooser) skill picks the form from the question rather than from habit.

## 8. Correlation stated as cause

Language slides. "Users who used the feature retained better" becomes "the feature improves retention," and the analysis never tested that. The tell is a verb: drove, caused, improved, led to, resulted in.

**The check:** for every causal verb, ask what the comparison group was and what else changed in the period. If there was no control, no randomization, and no attempt to handle confounders, rewrite the sentence as an association. Selection effects hide here too: the users who adopted the feature were already your most engaged users.

## The checklist

Copy this into your repo or your review template and run it top to bottom.

```text
[ ] Row count printed before and after every join and every filter
[ ] Grain of each input table stated; count(*) vs count(distinct id) compared
[ ] Source row count and date range match the requested period (no truncation)
[ ] One total reconciled against a number I already trust
[ ] Headline figure recomputed by a second method, and the two agree
[ ] Every number in the prose located in an output table
[ ] Null counts known for every column used; null handling decided and stated
[ ] Timezone conversion present and correct; date range boundaries inclusive as intended
[ ] Five rows spot-checked by hand from source to final number
[ ] Chart axes, scales, and chart type checked against the comparison
[ ] Causal verbs justified by a comparison group, or rewritten as associations
[ ] Caveats and known exclusions stated in the output, not just known to me
```

Two of these deserve their reputation. Reconciling against a number you already trust is the fastest way to find a problem that touches everything. Spot-checking five rows by hand, source to final number, is the only check that exercises the entire chain at once, and it is how most subtle errors are actually caught.

> [!NOTE]
> Automate the mechanical checks and keep the judgment ones manual. Row counts, null counts, reconciliation totals, and boundary checks belong in the script that produces the analysis, so they run every time. Grain, causal language, and chart choice need a person. If you work in the terminal, [Claude Code for data analysts](/guides/analytics/claude-code-for-data-analysts) shows where those assertions live in a repo; generated SQL gets its own read-before-you-run pass in [Text-to-SQL with Claude](/guides/analytics/text-to-sql-with-claude); and Anthropic's data plugin ships a pre-share QA skill, covered in [the data plugin guide](/guides/analytics/claude-data-plugin-guide).
