---
term: "ARC-AGI"
description: "ARC-AGI is the ARC Prize Foundation's fluid-intelligence benchmark: grid puzzles (ARC-AGI-1 and 2) and, since March 2026, interactive environments (ARC-AGI-3)."
summary: "ARC-AGI measures fluid intelligence with tasks that are easy for humans and hard for AI. ARC-AGI-1 (800 grid puzzles) is saturated at 98.5%, ARC-AGI-2 adds a cost-per-task axis and tops out at 95.0%, and ARC-AGI-3 (launched March 2026) uses interactive environments where frontier AI scored 0.51% at launch and 62.7% on the Standard harness by October 2026."
date: 2026-10-18
topics: ["llm-evals"]
audience: ["ai-engineers", "developers"]
tags: ["arc-agi", "arc-prize", "benchmarks", "agi", "reasoning"]
related: ["guide:llm-benchmarks-explained-2026", "glossary:lmarena", "glossary:pass-at-k", "glossary:reasoning-model"]
faq:
  - q: "What is ARC-AGI-3?"
    a: "The first fully interactive ARC-AGI benchmark, launched March 25, 2026: hundreds of original turn-based environments handcrafted by game designers, with no instructions, rules or stated goals, so an agent must explore, infer the goal and adapt. Humans score 100%; frontier AI scored 0.51% at launch. ARC Prize 2026 runs an ARC-AGI-3 competition with submissions due November 2, 2026."
  - q: "Has ARC-AGI been solved?"
    a: "ARC-AGI-1 is effectively saturated at 98.5% as of October 2026, and ARC-AGI-2's best score is 95.0%. ARC-AGI-3 depends on the harness: the best Standard-harness score is 62.7%, while a Provider Adapter harness that preserves reasoning state between requests reaches 99.9% for the same model. ARC Prize still describes ARC-AGI-3 as unbeaten, so quote the Standard number."
  - q: "Why does ARC-AGI report cost per task?"
    a: "Because the foundation defines AGI as a system that matches the learning efficiency of humans, not just their accuracy. Starting with ARC-AGI-2, every reported score comes with an efficiency metric, and cost was chosen because it is the most directly comparable between human and AI performance. The leaderboard shows each score with its cost per task."
---

**ARC-AGI (Abstraction and Reasoning Corpus for Artificial General Intelligence) is a benchmark created by Francois Chollet in 2019 to measure fluid intelligence: the ability to learn a new task from a few examples rather than recall a trained one.**

It is maintained by the ARC Prize Foundation, a nonprofit co-founded by Mike Knoop and Chollet, whose stated definition is that "AGI is a system that can match the learning efficiency of humans" and whose design principle is "Easy for Humans, Hard for AI." ARC-AGI-1 consists of 800 grid-based puzzle tasks split into training, public, semi-private and private evaluation sets, and "remained unsolved by AI systems" from 2019 until late 2024, when OpenAI used it to showcase o3-preview. ARC-AGI-2 (2025) has 1,000 training tasks and three evaluation sets of 120, every task solved by at least two humans in under two attempts, and introduced the efficiency metric: every score is reported with its cost per task.

ARC-AGI-3 launched on March 25, 2026 as "a series of hundreds of interactive environments and thousands of game-style levels," the first fully interactive benchmark in the series. There are no instructions or stated goals; agents must explore, build a world model and learn continuously. At launch humans scored 100% and frontier AI 0.51%.

What the maintainers flag is the harness. The leaderboard now reports a Standard harness, in which a model can carry forward notes it chooses to keep, and a Provider Adapter harness that preserves opaque reasoning state between requests. As of October 2026 the same model scores 62.7% on Standard and 99.9% on Provider Adapter, while ARC-AGI-1 sits at 98.5% and ARC-AGI-2 at 95.0%. The foundation still calls ARC-AGI-3 "the world's only unbeaten benchmark," which only makes sense under the Standard harness. [LLM Benchmarks Explained](/guides/evaluation/llm-benchmarks-explained-2026) covers how such harness splits compare with the pairwise voting behind [Arena](/glossary/lmarena).
