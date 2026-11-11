---
term: "SWE-bench"
description: "SWE-bench is a benchmark that scores language models on resolving real GitHub issues; SWE-bench Verified is its human-validated 500-task subset."
summary: "SWE-bench, from Princeton NLP, gives a model a codebase and a GitHub issue and checks whether its patch passes the fail-to-pass tests. The original has 2,294 Python tasks; SWE-bench Verified (500 tasks, validated with OpenAI) is the variant vendors quote; Scale AI's SWE-bench Pro adds harder copyleft and private repositories."
date: 2026-10-17
topics: ["llm-evals"]
audience: ["ai-engineers", "developers"]
tags: ["swe-bench", "benchmarks", "coding-agents", "evaluation"]
related: ["guide:llm-benchmarks-explained-2026", "glossary:terminal-bench", "glossary:pass-at-k", "guide:ai-coding-statistics-2026"]
faq:
  - q: "What is SWE-bench Verified?"
    a: "A 500-task subset of SWE-bench released on August 13, 2024 by OpenAI's Preparedness team with the benchmark's authors. Ninety-three developers annotated 1,699 samples, and 68.3% were filtered out for underspecified issues or unit tests that could unfairly fail valid solutions. OpenAI says it supersedes the original and Lite test sets."
  - q: "What is a good SWE-bench score?"
    a: "On the same-harness Bash Only board (Verified run inside mini-SWE-agent), the top entry as of October 2026 is Claude 4.5 Opus (high) at 76.80%, dated February 2026. Vendor model cards report roughly 70 to 80% on Verified with their own harnesses, which are not comparable with each other. SWE-bench Pro is much harder: Scale reported top models around 23% on its public set in 2025."
  - q: "Is SWE-bench contaminated?"
    a: "Its maintainers and critics both say the risk is real. OpenAI filtered 68.3% of tasks for quality when building Verified; the paper The SWE-Bench Illusion found models can name the buggy file from the issue text alone up to 76% of the time on SWE-bench repositories versus 53% elsewhere; and Scale built SWE-bench Pro on copyleft and held-out code specifically to limit memorization."
---

**SWE-bench is a benchmark that evaluates language models on real software issues collected from GitHub: given a codebase and an issue, the model must generate a patch, and the task counts as resolved only if the patch passes the repository's tests.**

Princeton NLP released it in October 2023 with 2,294 task instances from 12 Python repositories. Scoring is the percentage of tasks resolved: the patch must pass the fail-to-pass tests that reproduce the issue and the pass-to-pass tests that guard existing behaviour. The first baseline solved 1.96% of tasks. Three subsets followed: Lite (300 tasks), Multilingual (300 tasks across nine languages) and Multimodal, whose V2 release of September 1, 2026 has 480 tasks.

SWE-bench Verified is the number on model cards. OpenAI's Preparedness team and the SWE-bench authors released it on August 13, 2024 after 93 developers annotated 1,699 samples; 68.3% were filtered out for underspecified problem statements or unfair tests, leaving 500. The swebench.com default view, "Bash Only," runs every model in the same mini-SWE-agent environment so scores are comparable; its top entry as of October 2026 is Claude 4.5 Opus (high) at 76.80%, dated February 2026. Scale AI's SWE-bench Pro (September 2025) is the harder successor: 1,865 tasks from 41 repositories, with a 642-task validated public split and private and held-out sets built on copyleft and proprietary code to limit contamination.

The criticisms come from the maintainers themselves. OpenAI's filtering rate shows how noisy the original was, Scale cites "Data Contamination" and "Oversimplified Problems" as its reasons for building Pro, and the paper "The SWE-Bench Illusion" found models can identify the buggy file path from the issue text alone up to 76% of the time. Vendor cards also run different harnesses (Claude Code, mini-SWE-agent, their own scaffolds), so a Verified number only means something next to the harness that produced it. [LLM Benchmarks Explained](/guides/evaluation/llm-benchmarks-explained-2026) covers how to read those numbers next to [Terminal-Bench](/glossary/terminal-bench) and [pass@k](/glossary/pass-at-k).
