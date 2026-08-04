---
term: "LLM-as-Judge"
description: "LLM-as-judge uses a language model to score AI outputs against a rubric — evaluating quality at scale where exact-match metrics fail and humans don't scale."
date: 2026-06-11
topics: ["llm-evals"]
tags: ["evals", "llm-as-judge", "evaluation", "quality"]
related: ["llm-as-judge-guide", "write-llm-evals", "llm-as-judge-scorer", "best-llm-eval-tools-2026", "hallucination", "llm-evaluation-engineer"]
faq:
  - q: "Why use a model to judge a model?"
    a: "Because most LLM output quality is subjective-but-describable: helpfulness, faithfulness to sources, tone. Exact-match metrics can't score an open-ended answer, and humans don't scale to thousands of cases per release. A judge model with a precise rubric gets you scalable evaluation that correlates with human judgment — when built carefully."
  - q: "What are the known biases of LLM judges?"
    a: "Position bias (favoring the first answer in pairwise comparisons), verbosity bias (longer reads as better), self-preference (favoring outputs from its own model family), and score clustering. Mitigations are standard: randomize order, compare pairwise instead of absolute-scoring, use rubrics with anchored examples, and calibrate the judge against a slice of human labels before trusting it."
---

**LLM-as-judge is the evaluation technique of using a language model, given a rubric, to score another model's outputs — the workhorse for measuring quality that's too subjective for string matching and too voluminous for human review.**

It exists because LLM quality is mostly not exact-match. "Is this summary faithful to the source?" "Did the agent's answer actually resolve the ticket?" A judge prompt encodes the rubric, the judge model applies it across thousands of cases, and you get numbers you can track, compare, and gate releases on — the backbone of modern [eval suites](/guides/evaluation/write-llm-evals) and the feature every eval platform ([compared here](/guides/evaluation/best-llm-eval-tools-2026)) builds around.

The craft is making the judge *trustworthy*. Known biases — position, verbosity, self-preference — have known mitigations (randomized ordering, pairwise comparison, anchored rubrics), and the non-negotiable step is **calibration**: validate the judge against human labels on a sample before believing it at scale. An uncalibrated judge is a random number generator with confidence. Designing one well is exactly what the [llm-as-judge-scorer](/skills/data/llm-as-judge-scorer) skill walks through.
