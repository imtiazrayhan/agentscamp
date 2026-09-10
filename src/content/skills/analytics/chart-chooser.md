---
name: "chart-chooser"
description: "Pick the chart for a stated question and data shape and defend the choice: the recommendation, the reasoning, the alternatives rejected and why each fails this question, encoding rules for axis baseline, sorting, color, and labels, and generated code in the plotting library you name. Use when you know what you want the chart to say and need the one form that says it, not a gallery."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["claude", "analysts", "data-visualization", "charts", "cowork"]
featured: false
related: ["skill:analysis-memo-writer", "skill:dataset-first-look", "skill:dashboard-designer", "guide:claude-for-data-analysis", "guide:claude-skills-for-data-analysts"]
seoDescription: "A Claude skill that picks one chart type for your question and data shape, argues the rejected alternatives, sets the encodings, and writes the plotting code."
summary: "Give this skill your question and the shape of your data and it returns one chart recommendation with the reasoning, the alternatives it rejected and why, encoding decisions on axis baseline, sorting, color, and labels, and runnable code in the library you name. The rejected list is the point: it is the argument you make when someone asks for a pie chart."
---

Choosing a chart is a reasoning problem that most tools skip straight past into rendering. This skill does the reasoning out loud. Give it the question the chart has to answer and the shape of the data behind it; it returns one recommendation, the argument for it, the alternatives it rejected with the reason each fails *this* question, the encoding decisions that make or break the read, and the code in whichever library you work in. The rejected list is what you paste into the thread when a stakeholder asks for a pie chart of twelve categories. Nothing here needs a running environment, so it works on claude.ai, in Claude Code, and in Claude Cowork alike.

## When to use this skill

- You have a finding and no idea which of six plausible charts shows it.
- Somebody requested a chart type you suspect will mislead, and you need the reason written down.
- A chart is technically correct and nobody can read it, and the encoding needs rethinking.
- You are drafting a figure and want a caption that says what it does and does not show.

> [!NOTE]
> This is a decision skill, not a rendering skill. It produces the choice, the reasons, and the code; it does not execute the code or read your data. It is also not dashboard design: laying out many panels so an on-call engineer can read a service at a glance belongs to the [dashboard-designer](/skills/observability/dashboard-designer) skill. This skill designs one chart that answers one question.

## Instructions

1. **Get the question in one sentence.** Not the topic, the question: "did checkout conversion fall after the July release?" not "conversion data". If given a topic, ask for the question first; every later decision follows from it. Restate it before continuing.
2. **Classify the task behind the question.** Name it explicitly, because the task drives the form: comparison across categories, change over time, part-to-whole, distribution, relationship between two measures, deviation from a target, ranking, or flow between states.
3. **Get the data shape.** Rows to be plotted, categories, series, whether time is regular or irregular, whether the measure is a count, a rate, an amount, or a ratio, and whether values can be negative. Ask for anything missing rather than assuming it.
4. **Ask which library**, if unstated. Offer matplotlib, Plotly, Vega-Lite, and Recharts with the difference that matters: matplotlib for a static figure in a report, Plotly for a notebook chart with hover, Vega-Lite for a portable spec, Recharts for a React app. Never pick silently.
5. **Recommend one chart** and give three to five sentences of reasoning tying the form back to the task and the shape: why this encoding makes the comparison the question asks for the easiest thing on the page to see.
6. **Reject the alternatives explicitly.** Three to five, each with a reason specific to this question, not a general rule. "A pie chart here would ask the reader to compare 12 angles when the question is about rank order" beats "pie charts are bad". Include the chart the user or their stakeholder is likely to ask for, and say what it would cost.
7. **Set the encodings and justify each.** Work the same list every time: axis baseline (a bar's value axis starts at zero because length is the encoding; a line chart of a narrow range need not, and the caption should say so); sort order (by value for ranking, by category for a fixed sequence, never alphabetically by accident); color (by series only when there is more than one, sequential for magnitude, diverging only around a real midpoint, never as the sole carrier of meaning); direct labels over a legend when series are few; number formatting and units; missing periods drawn as a gap, not a zero and not an interpolated line; and the annotation naming the event the question is about.
8. **Write the title as the finding.** "Checkout conversion fell 2.1 points after the July 14 release" is a title; "Conversion by week" is a label. If the finding is not established, write a neutral title and say why you did not assert one.
9. **Generate the code** in the named library, with the data as a small inline placeholder to swap, every encoding decision from step 7 present in it, and comments only where a line implements a judgment call.
10. **Close with the honest caption**: one line saying what this chart shows and one saying what it does not, ready to sit under the figure.

## Output

A chart brief: restated question, task type, the recommendation with its reasoning, the rejected-alternatives table, the encoding decisions with justifications, a title, a fenced code block in your library, and the two-line caption. Paste the brief into the review thread and the code into your notebook. When the chart goes into a written finding, the [analysis-memo-writer](/skills/analytics/analysis-memo-writer) skill builds the writeup around it and your caption becomes its "what the number is not" line. If the data is not profiled yet, [dataset-first-look](/skills/analytics/dataset-first-look) comes first.

## Example

Excerpt for "which five regions grew fastest last quarter?", 12 regions, quarterly, Vega-Lite:

```markdown
Task: ranking, with a comparison of magnitudes.
Recommendation: horizontal bar chart, sorted descending by growth rate, top 5 highlighted and the other 7 shown in gray.

| Rejected | Why it fails this question |
| --- | --- |
| Pie chart | Growth rates are not parts of a whole; they do not sum to anything. |
| Line chart over 4 quarters | Answers "how did each region trend", not "which grew fastest". 12 lines overlap. |
| Map | Rank order is unreadable when region size and value are unrelated. |

Encodings: value axis from zero; sorted by value, not alphabetically; one accent color for the top five,
gray for the rest, plus a direct label on each bar so color is not the only signal; rates to one decimal.
Title: "Five regions drove Q3 growth; the rest were flat or negative."
Caption: shows quarter-over-quarter growth rate by region. Does not show absolute revenue, so a fast-growing
small region outranks a large flat one here.
```

Where the chart fits in a full analysis is covered in [Claude for data analysis](/guides/analytics/claude-for-data-analysis), and the rest of the analyst set in [Claude skills for data analysts](/guides/analytics/claude-skills-for-data-analysts).
