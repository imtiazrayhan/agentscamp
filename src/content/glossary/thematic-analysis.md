---
term: "Thematic Analysis"
description: "Thematic analysis is a qualitative method for finding, reviewing and reporting patterns of meaning (themes) in interviews, survey answers and feedback."
date: "2026-10-06"
updated: "2026-11-27"
reviewed: "2026-11-27"
topics: ["ai-at-work"]
audience: ["founders", "analysts", "designers"]
tags: ["thematic-analysis", "knowledge-work"]
featured: false
related: ["guide:analyze-customer-feedback-with-ai", "tool:dovetail", "skill:feedback-codebook-designer", "skill:user-interview-synthesizer"]
summary: "Thematic analysis is a qualitative research method: you read the material closely, label relevant passages with codes, group the codes into themes, test those themes against the data, then define and report them. An LLM can speed up the coding pass, but a theme is an interpretation that a person has to check against the original passages."
faq:
  - q: "What are the six phases of thematic analysis?"
    a: "In Braun and Clarke's 2006 formulation: familiarising yourself with the data, generating initial codes, searching for themes, reviewing themes, defining and naming themes, and producing the report. The phases are recursive, so reviewing a theme often sends you back to recode."
  - q: "What is the difference between a code and a theme?"
    a: "A code is a short label on one passage, such as 'cannot find export'. A theme is a pattern across many coded passages that says something about the research question, such as 'customers rely on support to navigate the product'. Codes describe; themes interpret."
  - q: "Can an LLM do thematic analysis on its own?"
    a: "It can draft codes and candidate groupings quickly, but it tends to produce tidy topic summaries, miss minority views and invent supporting quotes. Treat its output as a first pass: verify every quote against the source and decide the themes yourself."
---

**Thematic analysis is a qualitative research method for identifying, analysing and reporting patterns of meaning, called themes, across a set of texts such as interview transcripts, open survey answers or support tickets.** It is the default method for most customer and user research because it needs no special software and no fixed theory, only a clear question and a disciplined reading of the data.

## How it works

The most cited version comes from Virginia Braun and Victoria Clarke's 2006 paper "Using thematic analysis in psychology", which lays out six phases:

1. **Familiarise yourself with the data.** Read everything, more than once, and note first impressions.
2. **Generate initial codes.** Label each relevant passage with a short description of what it says.
3. **Search for themes.** Group related codes into candidate patterns.
4. **Review themes.** Check each candidate against its coded passages and against the whole data set; merge, split or drop.
5. **Define and name themes.** Write down what each theme covers, what it excludes, and how it answers the question.
6. **Produce the report.** Present the themes with enough quoted evidence that a reader can judge them.

The phases loop. A theme that falls apart in phase 4 sends you back to recode. Teams that need several people to code consistently usually add a codebook: each code with its definition, inclusion and exclusion rules, and an example ([Qualtrics has an overview](https://www.qualtrics.com/articles/strategy-research/thematic-analysis-in-qualitative-research/)).

## A worked example

Take four invented comments from a product survey:

- "The export button is hidden."
- "I had to ask support where downloads live."
- "Export failed twice on a large file."
- "Couldn't find where to change my invoice address."

Comments 1, 2 and 4 get a code like *cannot find a feature*. Comment 3 gets *export fails*. A candidate theme is "customers rely on support to navigate the product", supported by three comments. Comment 3 mentions export but is a reliability problem, so it stays out of that theme even though a keyword search would have grouped it with comment 1.

## How it differs from nearby methods

- **Coding** is one step inside thematic analysis, not a synonym for it. A list of codes with counts is a content summary.
- **Sentiment analysis** assigns positive, negative or neutral polarity. It says how people feel, not what the pattern is or why.
- **Topic modelling** clusters texts statistically by word co-occurrence or embedding similarity. Topics are groups of similar wording; themes are claims about meaning, and one theme can span very different wording.

## Where AI helps and where it fails

| Phase | An LLM is useful for | Watch for |
|---|---|---|
| Familiarisation | Summaries that help you plan the reading | Summaries replacing the reading |
| Coding | Applying a written codebook to hundreds of passages | Drift between batches; codes applied by keyword |
| Searching for themes | Proposing groupings you had not considered | Themes that are just topic labels |
| Reviewing | Pulling every passage for a code so you can check it | Fabricated or paraphrased "quotes" |
| Defining and reporting | Tightening wording | Smoothing over contradictory cases |

The practical rule: let the model draft, keep quotes traceable to source rows, and count only what you have checked. The [customer-feedback guide](/guides/workflow/analyze-customer-feedback-with-ai) walks through a coding workflow with checked counts. [Dovetail](/tools/dovetail) is a research workspace for storing and tagging the material, the [Feedback Codebook Designer](/skills/product/feedback-codebook-designer) drafts code definitions from your files, and the [User Interview Synthesizer](/skills/product/user-interview-synthesizer) handles interview-specific synthesis.
