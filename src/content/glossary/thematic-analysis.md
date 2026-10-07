---
term: "Thematic Analysis"
description: "Thematic analysis interprets patterns of meaning in qualitative data, such as interview transcripts, open survey answers, and customer feedback."
date: "2026-10-06"
reviewed: "2026-10-06"
topics: ["ai-at-work"]
audience: ["founders", "analysts", "designers"]
tags: ["thematic-analysis", "knowledge-work"]
featured: false
related: ["guide:analyze-customer-feedback-with-ai", "tool:dovetail", "skill:feedback-codebook-designer", "skill:user-interview-synthesizer"]
---

Thematic analysis interprets patterns of meaning in qualitative material. A codebook can document code definitions, exclusions, and examples. [Qualtrics](https://www.qualtrics.com/articles/strategy-research/thematic-analysis-in-qualitative-research/)

A code labels a relevant passage; an interpreted pattern explains how passages relate to the question. The step from labels to meaning needs judgment about context, competing explanations, and material that does not fit.

## An illustrative feedback example

These two sentences are **invented example text**, not customer testimony:

- “The export button is hidden.”
- “I ask support where downloads live.”

Both could receive a discoverability code. A reviewer might explore whether customers rely on support to navigate the product. A failed export describes another possible problem and should not join that interpretation merely because it contains the word “export.”

An AI-generated topic, sentiment score, or frequent keyword does not establish the pattern's meaning. Inspect the original passages, the question that elicited them, and contradictory examples. Record uncertainty instead of forcing every passage into the most prominent label.

## Using it in an AI workflow

The [customer-feedback guide](/guides/workflow/analyze-customer-feedback-with-ai) proposes an operational coding workflow with checked counts; it is not a complete account of every qualitative research tradition. Choose a formal methodology explicitly when the project requires one.

[Dovetail](/tools/dovetail) is a workspace option for organizing customer research. The [Feedback Codebook Designer](/skills/product/feedback-codebook-designer) prepares label boundaries from supplied files, while the [User Interview Synthesizer](/skills/product/user-interview-synthesizer) serves interview-specific analysis. Keep the distinction between organizing evidence and interpreting it visible in either workflow.
