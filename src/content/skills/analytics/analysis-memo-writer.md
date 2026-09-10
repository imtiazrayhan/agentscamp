---
name: "analysis-memo-writer"
description: "Turn findings and figures you supply into a stakeholder writeup with a fixed spine: headline finding, what the number is and what it is not, method in three lines, a mandatory caveats and limitations section, what would change the conclusion, and one recommended next step. Never invents a figure and never upgrades a correlation into a cause. Use when the analysis is done and has to survive being read by someone who was not in the query."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["claude", "analysts", "writing", "stakeholders", "cowork"]
featured: false
related: ["skill:chart-chooser", "agent:analysis-reviewer", "agent:data-scientist", "guide:check-an-ai-data-analysis", "guide:claude-skills-for-data-analysts"]
seoDescription: "A Claude skill that turns your findings and numbers into a stakeholder writeup with a mandatory caveats section and no invented figures."
summary: "Give this skill the findings and numbers you already have and it writes the stakeholder writeup: headline finding, what the number is and is not, method in three lines, a caveats section that is never optional, what would change the conclusion, and one next step. It uses only figures you supplied and never turns a correlation into a cause."
---

An analysis fails at the last step more often than at any earlier one. The query was right, the caveat was known, and the writeup said "engagement drove retention" because that sentence was shorter. This skill drafts that writeup from findings and figures you supply, in one fixed shape, with the sections people delete under deadline made mandatory. It uses only the numbers you give it, so it can be trusted with a result nobody has published yet, and it needs no data connection or code execution: it runs the same on claude.ai, in Claude Code, and in Claude Cowork.

## When to use this skill

- The analysis is finished and now has to be read by a product lead, a finance partner, or an exec.
- A result is genuinely uncertain and the writeup has to say so without becoming unreadable.
- You are handing an analysis to someone who will act on it and you want the conditions on it written down.
- A previous writeup got overinterpreted and the next one needs a "what this is not" section.

> [!NOTE]
> This skill writes; it does not compute. Every number in the draft comes from what you paste. If you ask for a percentage change and give only one of the two figures, it asks for the other rather than deriving something plausible. If your evidence is observational, the draft says "associated with" and explains what would be needed to say "caused". Neither behavior is negotiable and neither can be overridden by asking for a stronger conclusion.

## Instructions

1. **Collect the inputs before writing a word.** The question the analysis answered, the findings, every figure with its unit and its period, how the data was produced (query, notebook, experiment, survey), the population and the time window, the known caveats, and who the writeup is for and what decision it feeds. Ask for anything missing; do not proceed with a gap you intend to paper over.
2. **Classify the evidence.** Randomized experiment, quasi-experiment, before-and-after comparison, cross-sectional correlation, or descriptive count. This classification decides the verbs the draft is allowed to use, and it goes in the method section in plain words.
3. **Write the headline finding** as one sentence that carries the number, its unit, its period, and its direction, aimed at the decision. "Trial-to-paid conversion was 8.4% in August, down from 11.2% in July" beats "conversion has been an area of concern".
4. **Write "what the number is".** Two or three sentences of precise definition: what population it covers, over what window, counted how, and which obvious neighbors it is not. A reader should be unable to confuse it with a similar metric after reading this.
5. **Write "what the number is not".** The three most likely misreadings, stated flatly. This is where a rate gets separated from a count, a correlation from a cause, a segment from the whole, and a sample from the population.
6. **Write the method in three lines.** Source, transformation, comparison. If it cannot be said in three lines, carry a pointer to the notebook or query instead of a longer method section. Name the file or query so a reader can rerun it.
7. **Write the caveats and limitations section. This section is never omitted, never empty, and never softened into a single hedging clause.** Work through: sample size and whether the comparison was powered for the effect claimed; data-quality issues found during profiling; the population the result does not generalize to; confounders and seasonality; anything filtered out and why; whether the metric definition changed inside the window; and known collection gaps. If the user supplied no caveats, list the ones the described method implies and mark them as unconfirmed rather than writing "none".
8. **Write "what would change this conclusion."** Two to four specific, checkable things: a figure that would have to move, a follow-up cut, an experiment, or a data fix. Each stated so a reader can tell whether it happened.
9. **Write one recommended next step**, tied to the decision named in step 1, with an owner-shaped verb. One, not a list; a writeup with five recommendations recommends nothing.
10. **Assemble the document** in this order, and check every figure in the prose against the figures you were given before returning it: Headline, What this number is, What it is not, Method, Caveats and limitations, What would change this, Recommended next step. Keep it under a page unless the reader asked for more.

## Output

One document in the fixed order above, in plain Markdown, ready to paste into a doc or a message. Below it, a short "figures used" list echoing every number back with its source as you were given it, so the reader can check the prose against your working. Charts belong beside the headline; the [chart-chooser](/skills/analytics/chart-chooser) skill picks the form and writes the honest caption, which usually becomes a line in "what it is not". Before it goes out, the [analysis-reviewer](/agents/analytics/analysis-reviewer) agent can read the underlying notebook or query and tell you whether the prose agrees with the code.

## Example

Excerpt from a writeup on a support-deflection result:

```markdown
**Headline.** Self-serve deflection reached 34% of inbound tickets in August, up from 27% in June,
across all English-language web tickets.

**What this number is not.** It is not a measure of resolution: a deflected ticket is one never opened,
not one solved. It is not a cause: the help-center rewrite shipped in the same window as a pricing-page
change, and this analysis cannot separate them. It is not company-wide; email and phone are excluded.

**Caveats and limitations.**
- Two-month comparison. Support volume is seasonal and August is historically light.
- 4 days of July data are missing from the ticket export; those days are excluded, not interpolated.
- The deflection definition changed on July 3 to include search-and-abandon sessions. Pre-July 3 figures
  are not comparable and are excluded here.

**What would change this conclusion.** A September figure below 30% would suggest a seasonal effect.
A holdout of users who did not see the rewritten help center would separate it from the pricing change.
```

Checking an analysis before it is written up is covered in [Check an AI data analysis](/guides/analytics/check-an-ai-data-analysis), and the rest of the analyst set in [Claude skills for data analysts](/guides/analytics/claude-skills-for-data-analysts).
