---
title: "LLM Benchmarks Explained (2026): SWE-bench, Terminal-Bench, Arena, ARC-AGI and the Rest"
description: "What each major LLM benchmark measures, how many tasks it has, how it is scored, who maintains it, what the maintainers flag, and how to read pass@k and saturation."
seoTitle: "LLM Benchmarks Explained (2026): SWE-bench, Terminal-Bench, Arena"
seoDescription: "SWE-bench, Terminal-Bench 4.0, Arena, ARC-AGI-3, GPQA, HLE and MMLU-Pro: what each measures, task counts, scoring, maintainer caveats, and how to read a score."
author: "Imtiaz Rayhan"
date: 2026-10-17
color: "green"
depth: standard
topics: ["llm-evals"]
audience: ["ai-engineers", "developers"]
tags: ["benchmarks", "evaluation", "llm-evals", "explainer"]
keywords: ["llm benchmarks explained", "swe-bench verified", "terminal-bench 4.0", "lmarena arena leaderboard", "arc-agi-3", "pass@1 meaning", "humanity's last exam"]
summary: "An LLM benchmark score is one dataset, one harness, one scoring rule and one date. SWE-bench Verified scores patches on 500 GitHub issues, Terminal-Bench 4.0 scores 66 containerized tasks, Arena ranks models by pairwise votes, and ARC-AGI measures fluid intelligence with a cost axis. Check task count, harness, date and interval before the headline number."
keyTakeaways:
  - "Each benchmark measures one narrow thing with its own task count and scoring rule: SWE-bench Verified has 500 tasks scored by fail-to-pass tests, Terminal-Bench 4.0 has 66, GPQA Diamond 198, HLE 2,500."
  - "Versions are not interchangeable: Terminal-Bench moved from 2.0 (89 tasks) to 4.0 (66 tasks, 8-hour timeout) in ten months, and vendor cards still quote 2.1, 3.0 and 4.0 numbers side by side."
  - "Harness splits change scores more than model choice does: ARC-AGI-3 shows 62.7% on the Standard harness and 99.9% on the Provider Adapter harness for the same model."
  - "Maintainers flag their own flaws: OpenAI filtered out 68.3% of SWE-bench for Verified, Terminal-Bench documented cheating and reward hacking, and Arena marks scores provisional until 2,000 fresh votes."
  - "Several boards are stale or unreadable: Aider polyglot last ran in October 2025, lastexam.ai lists no 2026 models, and the SWE-bench Pro, OSWorld and LiveCodeBench tables are JS-only."
  - "pass@k rises with k, pass^k falls with k, and both equal pass@1 at k=1; agent benchmarks increasingly report pass^k because reliability matters more than a lucky sample."
faq:
  - q: "What is SWE-bench Verified?"
    a: "A 500-task subset of SWE-bench released on August 13, 2024 by OpenAI's Preparedness team with the SWE-bench authors. Ninety-three developers annotated 1,699 samples, and 68.3% of the original were filtered out for underspecified issues or unfair tests. It is scored as the percentage of tasks resolved, meaning the model's patch passes the fail-to-pass tests without breaking pass-to-pass tests, and it supersedes the original and Lite sets."
  - q: "What does pass@1 mean?"
    a: "The fraction of problems a model solves with a single sample. pass@k generalizes it to the probability that at least one of k samples passes the tests; the Codex paper estimates it without bias by generating n samples, counting c correct, and computing 1 minus C(n-c,k)/C(n,k). pass^k, from tau-bench, is the probability that all k independent trials succeed, which is the number to watch for agents that must be reliable."
  - q: "Is Terminal-Bench 2.0 the current version?"
    a: "No. Terminal-Bench is a continuous benchmark with semantic versioning: 1.0 in May 2025, 2.0 in November 2025, 2.1 in May 2026, 3.0 in July 2026, and 4.0 on August 28, 2026. Version 4.0 has 66 tasks, removed eight saturated or compromised tasks, fixed nineteen, and set a flat eight-hour agent timeout. Scores across versions are not comparable."
  - q: "Why did LMArena change its name to Arena?"
    a: "The organization describes itself as Arena, formerly LMArena, previously known as Chatbot Arena, created by UC Berkeley researchers; it formed Arena Intelligence Inc. in 2025 and lmarena.ai now redirects to arena.ai. The mechanism is unchanged: anonymous pairwise battles, votes, and Bradley-Terry scores, with an optional style control that discounts answer length and markdown formatting."
  - q: "Has ARC-AGI been beaten?"
    a: "ARC-AGI-1 is saturated at 98.5%, and ARC-AGI-2 tops out at 95.0% as of October 2026. ARC-AGI-3, launched March 25, 2026 as an interactive benchmark where frontier AI scored 0.51% at launch, now shows 62.7% on the Standard harness and 99.9% with a Provider Adapter harness that preserves reasoning state between requests. ARC Prize still calls it unbeaten, so which harness you read matters."
sources:
  - title: "SWE-bench leaderboards"
    url: "https://www.swebench.com/"
    publisher: "Princeton NLP"
  - title: "Introducing SWE-bench Verified"
    url: "https://openai.com/index/introducing-swe-bench-verified/"
    publisher: "OpenAI"
  - title: "SWE-Bench Pro leaderboard"
    url: "https://scale.com/leaderboard/swe_bench_pro"
    publisher: "Scale AI"
  - title: "Terminal-Bench 4.0"
    url: "https://www.tbench.ai/news/terminal-bench-4-0"
    publisher: "Terminal-Bench"
  - title: "Terminal-Bench leaderboard"
    url: "https://www.tbench.ai/leaderboard"
    publisher: "Terminal-Bench"
  - title: "Leaderboard Integrity Update"
    url: "https://www.tbench.ai/news/leaderboard-integrity-update"
    publisher: "Terminal-Bench"
  - title: "About Arena"
    url: "https://lmarena.ai/about"
    publisher: "Arena Intelligence"
  - title: "Chatbot Arena: New models and Elo system update"
    url: "https://lmsys.org/blog/2023-12-07-leaderboard/"
    publisher: "LMSYS"
  - title: "Does style matter? Disentangling style and substance in Chatbot Arena"
    url: "https://lmsys.org/blog/2024-08-28-style-control/"
    publisher: "LMSYS"
  - title: "The Leaderboard Illusion"
    url: "https://arxiv.org/abs/2504.20879"
    publisher: "arXiv"
  - title: "ARC-AGI-3 launch"
    url: "https://arcprize.org/blog/arc-agi-3-launch"
    publisher: "ARC Prize Foundation"
  - title: "ARC Prize leaderboard"
    url: "https://arcprize.org/leaderboard"
    publisher: "ARC Prize Foundation"
  - title: "Evaluating Large Language Models Trained on Code"
    url: "https://arxiv.org/abs/2107.03374"
    publisher: "arXiv"
  - title: "tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains"
    url: "https://arxiv.org/abs/2406.12045"
    publisher: "arXiv"
related: ["glossary:swe-bench", "glossary:terminal-bench", "glossary:lmarena", "glossary:arc-agi", "glossary:pass-at-k", "guide:llm-evaluation-metrics-explained", "guide:write-llm-evals", "guide:ai-coding-statistics-2026", "guide:choosing-the-right-model", "guide:claude-vs-gpt-vs-gemini-coding"]
---
**A benchmark score is the output of one dataset, one harness, one scoring rule and one date; quoted without those four things, it is noise.** This guide covers each benchmark on 2026 model cards: who maintains it, what it measures in the maintainers' own words, task count, scoring, current version, and what the maintainers themselves flag. Top scores appear only where read on the official leaderboard as of October 2026. For your own system's metrics, see [LLM Evaluation Metrics Explained](/guides/evaluation/llm-evaluation-metrics-explained).

## The benchmarks at a glance

| Benchmark | Measures | Tasks | Score type | Maintainer | Status (October 2026) |
| --- | --- | --- | --- | --- | --- |
| SWE-bench | patches for real GitHub issues from 12 Python repos | 2,294 | % resolved (fail-to-pass tests) | Princeton NLP | superseded by Verified |
| SWE-bench Verified | human-validated subset of SWE-bench | 500 | % resolved | OpenAI Preparedness with SWE-bench authors | "Bash Only" board; newest rows Feb 2026 |
| SWE-bench Lite, Multilingual, Multimodal | subsets: Python, 9 languages, visual issues | 300, 300, 480 (V2) | % resolved | Princeton NLP | Multimodal V2 September 2026 |
| SWE-bench Pro | agent tasks from copyleft and private repos | 1,865 total; 642 in the V2 public split | resolve rate (fail-to-pass, no regressions) | Scale AI | table JS-only |
| Terminal-Bench 4.0 | agent work in containerized terminal environments | 66 | resolution rate with 95% CI | Stanford, Harbor, Laude Institute | continuous; 4.0 since Aug 28, 2026 |
| Arena (formerly LMArena) | crowdsourced pairwise preference | 8,900,458 votes, 417 models (text) | Bradley-Terry score | Arena Intelligence Inc. | live; style control |
| ARC-AGI-1, 2, 3 | fluid intelligence; ARC-AGI-3 is interactive | 800; 1,000 train + 360 eval; hundreds of environments | % solved plus cost per task | ARC Prize Foundation | ARC-AGI-1 saturated; ARC-AGI-3 since Mar 25, 2026 |
| GPQA Diamond | expert-written "Google-proof" science questions | 198 | accuracy | Rein et al. (NYU, Cohere, Anthropic) | no official board |
| Humanity's Last Exam | frontier academic questions | 2,500 | accuracy plus calibration error | CAIS and Scale AI | board stale; HLE-Rolling since Sep 17, 2026 |
| MMLU-Pro | reasoning-heavy MMLU with ten options | 12,032 | accuracy (CoT) | TIGER-Lab | format fix Jan 18, 2026 |
| LiveCodeBench | date-windowed contest problems | 1,055 (release_v6) | pass@1 | UC Berkeley, MIT, Cornell | no release after v6 |
| Aider polyglot | Exercism exercises in six languages | 225 | % correct after a second attempt | Aider project | last run Oct 3, 2025 |
| tau-bench, tau2-bench | tool-using agent against a simulated user | 115 retail, 50 airline | pass^k on database state | Sierra | tau2 2.0 in 2026 |
| OSWorld-Verified | real computer tasks for multimodal agents | 369 | execution-based success rate | XLANG Lab (HKU) | Verified since Jul 28, 2025; table JS-only |
| BrowseComp | hard-to-find web answers | 1,266 | accuracy | OpenAI | no board; frozen Jul 2025 |
| MMMU, MMMU-Pro | college-level multimodal questions | 11.5K; 3,460 | accuracy | MMMU team (CMU et al.) | live |

## SWE-bench and its variants

[SWE-bench](/glossary/swe-bench), from Princeton NLP (2023), is "a benchmark for evaluating large language models on real world software issues collected from GitHub. Given a codebase and an issue, a language model is tasked with generating a patch that resolves the described problem." The original has 2,294 tasks from 12 Python repositories, scored as "% Resolved": the patch must pass fail-to-pass and pass-to-pass tests. Variants: Lite (300), Multilingual (300 tasks, nine languages), Multimodal (480 tasks in the September 1, 2026 V2 release) and Verified.

Verified is the one vendors quote. OpenAI's Preparedness team and the SWE-bench authors released it on August 13, 2024 as a human-validated subset: 93 developers annotated 1,699 samples and 68.3% were filtered out for underspecified issues or unfair tests, leaving 500. The default swebench.com view is "Bash Only," "every model in the same mini-SWE-agent environment." As of October 2026 its top entry is Claude 4.5 Opus (high) at 76.80%, dated February 17, 2026, the board's newest entry. The open criticism is contamination: "The SWE-Bench Illusion" (arXiv 2506.12286) found models identify buggy file paths from issue text alone at up to 76% on SWE-bench repositories and 53% outside them.

## SWE-bench Pro (Scale AI)

Scale AI built SWE-bench Pro (September 2025) "to provide a rigorous and realistic evaluation of AI agents for software engineering," citing contamination and oversimplified problems in the original. It has 1,865 problems from 41 repositories: 731 public tasks from copyleft repositories, 276 private tasks from startup codebases, and 858 held-out tasks never published; the V2 public split is 642 tasks across 11 repositories plus a HARD-51 subset. Resolve Rate requires fail-to-pass success and "No Regressions." The leaderboard table is JS-only; the page prose quotes "around 23% on the SWE-Bench Pro public set, compared to 70%+ on SWE-Bench Verified," a 2025 figure.

## Terminal-Bench

[Terminal-Bench](/glossary/terminal-bench), hosted by Stanford, Harbor and the Laude Institute, measures "the capabilities of agents and language models to perform valuable work in containerized environments." It is a continuous benchmark with semantic versioning: 1.0 (May 19, 2025), 2.0 (November 7, 2025, 89 tasks), 2.1 (May 6, 2026, fixes to 28 tasks), 3.0 (July 30, 2026, 74 tasks) and 4.0 (August 28, 2026), which removed eight tasks, fixed nineteen, and set "a flat agent timeout of 8 hours." The task directory at tag v4.0.0 holds 66 tasks; no maintainer sentence states the count.

Scoring is the resolution rate with one attempt per task, and "the whiskers span the 95% confidence interval." As of October 2026 the top entry is Opus 5.5 (max) in Claude Code at 64.8% plus or minus 3.1% (September 22, 2026). The saturation rule is strict: a task is saturated "when all classes within all families of the latest generation of models solve it 5/5 times." The April 19, 2026 Leaderboard Integrity Update reported "multiple instances of cheating and reward hacking" and added an agent judge over passing trials. Vendor cards still quote 2.1 scores near 90 beside 4.0 scores near 40 for the same model; the version is the difference.

## Arena (formerly LMArena, formerly Chatbot Arena)

[Arena](/glossary/lmarena) was "created by researchers from UC Berkeley" and was "previously known as Chatbot Arena"; it formed Arena Intelligence Inc. in 2025, and lmarena.ai now redirects to arena.ai. The mechanism is a pairwise battle: "you'll be served 2 anonymous models ... Choose your preferred response." Scores moved from online Elo to the Bradley-Terry model in December 2023 for "significantly more stable ratings and precise confidence intervals," and style control (August 2024) discounts answer length and markdown formatting.

As of October 2026 the text board reports 8,900,458 votes across 417 models, with Gemini 4 Argon (High) first at 1524 plus or minus 9 but flagged "Preliminary" on 4,900 votes. The standing criticism is "The Leaderboard Illusion" (arXiv 2504.20879): "undisclosed private testing practices benefit a handful of providers who are able to test multiple variants before public release and retract scores if desired," including 27 private Llama 4 variants. Arena's response committed to marking scores "provisional" until 2,000 fresh votes arrive when more than ten variants were tested pre-release.

## ARC-AGI

[ARC-AGI](/glossary/arc-agi) is run by the ARC Prize Foundation, a nonprofit co-founded by Mike Knoop and Francois Chollet, whose 2019 paper introduced it "to measure fluid intelligence." ARC-AGI-1 has 800 grid-puzzle tasks and "remained unsolved by AI systems" until late 2024. ARC-AGI-2 (2025) has 1,000 training tasks and three evaluation sets of 120, and introduced the cost axis: "all ARC-AGI reporting comes with an efficiency metric."

ARC-AGI-3 launched March 25, 2026 as "hundreds of interactive environments and thousands of game-style levels that measure the frontier of agentic intelligence," where at launch "Humans score 100%. Frontier AI scores 0.51%." As of October 2026: ARC-AGI-1 is saturated at 98.5%; ARC-AGI-2's best is GPT-6 Astra (Max) at 95.0%; ARC-AGI-3's best is the same model at 62.7% on the Standard harness versus 99.9% on the Provider Adapter harness, which "preserves opaque reasoning state between requests." ARC Prize still calls ARC-AGI-3 unbeaten; quote the Standard number as the like-for-like figure.

## GPQA Diamond and Humanity's Last Exam

GPQA (Rein et al., November 2023) is "a challenging dataset of 448 multiple-choice questions written by domain experts in biology, physics, and chemistry." Experts "reach 65% accuracy," non-experts with web access 34%, hence "Google-proof." Diamond is the 198 questions "where both experts answer correctly and the majority of non-experts answer incorrectly." There is no official leaderboard; expert accuracy sets the label-noise ceiling.

Humanity's Last Exam (CAIS and Scale AI, January 2025) is "a multi-modal benchmark at the frontier of human knowledge": 2,500 questions finalized April 3, 2025, a private held-out set, and accuracy plus calibration error. The lastexam.ai board lists Gemini 3 Pro at 38.3% and no 2026 models, so it is stale; on September 17, 2026 CAIS released HLE-Rolling as "a seamless migration path for researchers in the future once frontier models begin to hit the noise ceiling on the original HLE dataset."

## MMLU-Pro

TIGER-Lab's MMLU-Pro (June 2024) extends MMLU with reasoning-focused questions and ten answer options: 12,032 questions across 14 disciplines, scored by accuracy with chain-of-thought. The maintainers' flag, dated January 18, 2026: "Fixed leading space issue in answer options ... This formatting inconsistency could have been exploited as a shortcut," so pre-fix and post-fix scores differ.

## Coding: LiveCodeBench and Aider polyglot

LiveCodeBench (March 2024) is "a holistic and contamination-free evaluation benchmark of LLMs for code that continuously collects new problems over time," scored as pass@1. Every problem carries a release date, so a model can be scored only on problems published after its training cutoff. The newest dataset is release_v6 with 1,055 problems through April 2025, and the leaderboard is JS-only. Aider's polyglot benchmark "tests LLMs on 225 challenging Exercism coding exercises across C++, Go, Java, JavaScript, Python, and Rust," reporting "Percent correct" after a second attempt; its top row is gpt-5 (high) at 88.0%, last run October 3, 2025.

## Agents: tau-bench, OSWorld and BrowseComp

Sierra's tau-bench (June 2024) emulates "dynamic conversations between a user (simulated by language models) and a language agent provided with domain-specific API tools and policy guidelines," scored on the final database state across 115 retail and 50 airline tasks. It popularized [pass^k](/glossary/pass-at-k) because "even state-of-the-art function calling agents (like gpt-4o) succeed on <50% of the tasks, and are quite inconsistent (pass^8 <25% in retail)."

OSWorld (XLANG Lab, HKU; April 2024) is a real computer environment for multimodal agents with 369 tasks; at launch "humans can accomplish over 72.36% of the tasks, the best model achieves only 12.24% success." OSWorld-Verified (July 28, 2025) fixed "300+ issues," and its table is JS-only. BrowseComp (OpenAI, April 2025) has 1,266 questions "that require persistently navigating the internet in search of hard-to-find, entangled information"; there is no leaderboard, and simple-evals stopped accepting results in July 2025.

## Multimodal: MMMU and MMMU-Pro

MMMU (November 2023) has 11.5K multimodal questions from college exams, quizzes and textbooks across 30 subjects. MMMU-Pro (September 2024) filters out questions "answerable by text-only models," augments the options and adds a vision-only setting: 1,730 questions in two formats, 3,460 in total. As of October 2026 the top MMMU-Pro entry is Chance Vision 1.5 at 86.9, author-reported and asterisked, above "Human Expert (High)" at 85.4.

## How to read a score

### pass@1, pass@k and pass^k

The Codex paper (Chen et al., 2021) defines the estimator every coding board inherits: generate n samples per task, count c that pass, and compute pass@k as the expectation over problems of 1 minus C(n-c, k) / C(n, k). The naive "1-(1-p)^k where p is the empirical estimate of pass@1" is biased. The reference implementation:

```python
def pass_at_k(n, c, k):
    if n - c < k:
        return 1.0
    return 1.0 - np.prod(1.0 - k / np.arange(n - c + 1, n + 1))
```

pass@1 is the single-sample success rate; pass@k rises with k because any success counts. pass^k, from tau-bench, is "the chance that all k i.i.d. task trials are successful, averaged across tasks," estimated as the expectation of C(c, k) / C(n, k); it falls with k, and both coincide at k=1. Read the footnote: Qwen's "Evaluated with Claude Code (avg@10)" names both the harness and the averaging.

### Intervals, Bradley-Terry and style control

Arena scores are Bradley-Terry strengths with an interval, and a "Preliminary" entry on a few thousand votes can move; style control is a separate board, so say which one you quote. Terminal-Bench's whiskers mean the same: overlapping intervals are not a ranking.

### Saturation, versions and harnesses

A benchmark saturates when its top stops discriminating: ARC-AGI-1 at 98.5%, Terminal-Bench 3.0's "narrow range," HLE's "noise ceiling." Maintainers answer with a new version (Terminal-Bench 4.0, HLE-Rolling, ARC-AGI-3), and old and new numbers stop being comparable. Harnesses matter as much: Bash Only exists so every model runs in the same agent, ARC-AGI-3's two harnesses differ by 37 points for one model. The Kimi K3 case in [Best Open-Source LLMs in 2026](/guides/comparisons/best-open-source-llms-2026), ProgramBench 77.8 on its own card and 17.5 on two competitors' cards, is the extreme.

## How to use benchmarks when choosing a model

1. **Pick the benchmark shaped like your job.** Coding agents: SWE-bench Verified and Pro, Terminal-Bench. Tool-calling: tau2-bench. Browsing: BrowseComp. Computer use: OSWorld-Verified. Vision: MMMU-Pro. General preference: Arena with style control on.
2. **Compare within one harness and one version.** Bash Only to Bash Only, Terminal-Bench 4.0 to 4.0, ARC-AGI-3 Standard to Standard. A vendor table is comparable only within itself.
3. **Check the date of the board and the entry.** Aider, lastexam.ai and the SWE-bench Bash Only board all carry 2025 or early-2026 rows as of October 2026.
4. **Prefer a contamination defence**: date windows (LiveCodeBench), held-out and copyleft sets (SWE-bench Pro), private splits (ARC-AGI, HLE), reward-hacking review (Terminal-Bench).
5. **Read the interval and the estimator, not the rank.** A pass@1 over ten runs, a pass^4 and a single-attempt resolution rate are three different numbers.
6. **Then run your own evals.** Public benchmarks shortlist; [a labeled eval set on your tasks](/guides/evaluation/write-llm-evals) decides. For coding work, start from the [tier guide](/guides/getting-started/choosing-the-right-model) and the [Claude, GPT and Gemini comparison](/guides/prompting/claude-vs-gpt-vs-gemini-coding). Adoption numbers are in [AI Coding Statistics 2026](/guides/concepts/ai-coding-statistics-2026).
