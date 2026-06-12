---
term: "Eval Dataset"
description: "An eval dataset is the curated set of test cases — inputs with expected outcomes — that an LLM application's quality is measured against."
date: 2026-06-12
topics: ["llm-evals"]
tags: ["evals", "datasets", "testing", "quality"]
related: ["write-llm-evals", "llm-as-judge", "synthetic-data", "llm-eval-suite-scaffolder", "best-llm-eval-tools-2026"]
faq:
  - q: "How big does an eval dataset need to be?"
    a: "Smaller than people fear, better-curated than people bother: 50–200 well-chosen cases beat 5,000 random ones. What matters is coverage — typical cases, known edge cases, past failures (every production bug becomes a case), and adversarial inputs — plus stable expected outcomes so scores mean the same thing run to run."
  - q: "Where do eval cases come from?"
    a: "Three sources, in priority order: real usage (mined from logs — the distribution you actually face), failures (every bug report is a regression case), and synthesis (LLM-generated variations and edge cases to fill coverage gaps you haven't hit yet — generated cheaply, curated ruthlessly)."
---

**An eval dataset is the fixed, curated collection of test cases an LLM feature is scored against — each case an input plus its expected outcome (a reference answer, a rubric, a constraint) — the foundation every other evaluation machinery stands on.**

It's the LLM era's test suite, with one difference from unit tests: outcomes are often judged (by [LLM-as-judge](/glossary/llm-as-judge) or humans against rubrics) rather than exact-matched, which makes *case quality* even more load-bearing — a vague expected outcome produces a meaningless score. The curation discipline: mine **real traffic** for the head of the distribution, promote **every production failure** into a permanent regression case, and [synthesize](/glossary/synthetic-data) the edge cases your logs haven't produced yet — keeping the dataset versioned, since changing it silently breaks score comparability.

Its strategic role is bigger than testing: the eval dataset is where a team's *definition of good* becomes executable — the artifact that turns "the new prompt feels better" into a number that gates releases. Building one from zero is the first half of [Write Evals for an LLM App](/guides/evaluation/write-llm-evals), scaffoldable via the [llm-eval-suite-scaffolder](/skills/data/llm-eval-suite-scaffolder) skill.
