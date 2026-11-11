---
term: "LMArena (now Arena)"
description: "LMArena, now Arena and originally Chatbot Arena, is a crowdsourced leaderboard that ranks models from anonymous pairwise votes using Bradley-Terry scores."
summary: "Arena (formerly LMArena, previously Chatbot Arena) serves two anonymous models, collects a preference vote, and ranks models with Bradley-Terry scores and confidence intervals. The text board held 8.9 million votes across 417 models in October 2026. Style control discounts length and markdown; critics call private pre-release testing a leaderboard illusion."
date: 2026-10-18
topics: ["llm-evals"]
audience: ["ai-engineers", "developers"]
tags: ["lmarena", "arena", "chatbot-arena", "benchmarks", "leaderboard"]
related: ["guide:llm-benchmarks-explained-2026", "glossary:arc-agi", "guide:claude-vs-gpt-vs-gemini-coding", "guide:llm-evaluation-metrics-explained"]
faq:
  - q: "Is LMArena the same as Chatbot Arena and Arena?"
    a: "Yes. The about page reads 'Arena (formerly LMArena)' and 'previously known as Chatbot Arena.' It was created by UC Berkeley researchers, formed Arena Intelligence Inc. in 2025, and lmarena.ai now redirects to arena.ai. The original paper, Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference, appeared at ICML 2024."
  - q: "How are Arena scores calculated?"
    a: "Each vote is a pairwise battle between two anonymous models. Since December 2023 the leaderboard fits a Bradley-Terry model to those votes instead of an online Elo system, which the maintainers say gives more stable ratings and precise confidence intervals. An optional style control adjusts for answer length, markdown headers, bold text and list counts. New entries are marked preliminary or provisional until enough fresh votes arrive."
  - q: "Why is the Arena leaderboard criticized?"
    a: "The 2025 paper The Leaderboard Illusion found that undisclosed private testing lets some providers test many variants and publish only the best, citing 27 private Llama 4 variants, and that Google and OpenAI received about a fifth of all arena data each. Arena responded by committing to state its multi-variant policy, mark retired models, and label scores provisional until 2,000 fresh votes are collected."
---

**Arena, formerly LMArena and originally Chatbot Arena, is a crowdsourced leaderboard that ranks language models by showing people two anonymous responses, recording which they prefer, and fitting a Bradley-Terry model to the votes.**

The platform was created by researchers at UC Berkeley and became, in its own words, "the gold standard of evaluation" by testing proprietary, open and pre-release models against each other. In 2025 the team formed Arena Intelligence Inc., and the brand moved from LMArena to Arena; lmarena.ai now redirects to arena.ai. The mechanism has not changed: in battle mode "you'll be served 2 anonymous models," you pick the better answer, and the vote feeds the public boards, which now span text, agents, WebDev, vision, image, video, document and search tasks. As of October 2026 the text board reported 8,900,458 votes across 417 models, with the top entry flagged "Preliminary" on 4,900 votes.

Two scoring details matter when you quote a number. First, the score is a Bradley-Terry strength with a confidence interval, adopted in December 2023 in place of online Elo for "significantly more stable ratings and precise confidence intervals"; models whose intervals overlap share a rank. Second, style control, introduced in August 2024, re-estimates the board after controlling for answer length and markdown header, bold and list counts, because voters reward long, formatted answers; it is a separate view, so say which one you cite.

The main criticism is "The Leaderboard Illusion" (arXiv 2504.20879), which found that private pre-release testing lets a few providers test many variants and retract scores, and that the resulting dynamics reward "overfitting to Arena-specific dynamics rather than general model quality." Arena's response accepted several recommendations, including provisional scores until 2,000 fresh votes. [LLM Benchmarks Explained](/guides/evaluation/llm-benchmarks-explained-2026) puts the board next to task-based benchmarks such as [ARC-AGI](/glossary/arc-agi).
