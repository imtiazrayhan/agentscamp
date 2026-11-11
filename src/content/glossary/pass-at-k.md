---
term: "pass@k"
description: "pass@k is the probability that at least one of k generated samples passes a task's tests; pass@1 is the single-attempt rate and pass^k needs all k to pass."
summary: "pass@k, defined in OpenAI's 2021 Codex paper, is the probability that at least one of k samples for a problem passes its unit tests, estimated without bias from n samples with c correct as 1 minus C(n-c,k)/C(n,k). pass@1 is the single-attempt success rate. pass^k, from tau-bench, requires all k trials to succeed and is the reliability number for agents."
date: 2026-10-19
topics: ["llm-evals"]
audience: ["ai-engineers", "developers"]
tags: ["pass-at-k", "pass@1", "metrics", "benchmarks", "evaluation"]
related: ["guide:llm-benchmarks-explained-2026", "guide:llm-evaluation-metrics-explained", "glossary:swe-bench", "glossary:terminal-bench"]
faq:
  - q: "What does pass@1 mean?"
    a: "The fraction of problems a model solves with one generated sample, where solving means the sample passes the task's tests. It is the strictest common form of pass@k and the one most leaderboards report. When a card averages several runs (for example avg@10), the figure is still a pass@1 estimate, taken as the mean per-sample success rate c/n over n samples."
  - q: "What is the difference between pass@k and pass^k?"
    a: "pass@k asks whether any of k independent attempts succeeds, so it rises as k grows and flatters models that get lucky sometimes. pass^k, introduced by Sierra's tau-bench, asks whether all k attempts succeed, so it falls as k grows and measures consistency. Both equal pass@1 at k=1. For agents that must be reliable, such as customer-service bots, pass^k is the number that matters."
  - q: "How is pass@k estimated?"
    a: "The Codex paper generates n samples per problem (n at least k), counts the c that pass, and computes 1 minus C(n-c,k)/C(n,k), averaged over problems. The paper warns that the simpler formula 1-(1-p)^k, with p the empirical pass@1, is biased, and gives a numerically stable implementation that evaluates the product term by term."
---

**pass@k is a functional-correctness metric for code and agent benchmarks: the probability that at least one of k samples generated for a problem passes that problem's tests, averaged across problems.**

The definition in use today comes from OpenAI's 2021 paper "Evaluating Large Language Models Trained on Code," which introduced HumanEval and the Codex models. Earlier work scored pass@k by generating exactly k samples and checking whether any passed, which has high variance. The Codex paper instead generates n samples per task (n at least k; the paper used n=200 and k up to 100), counts the c samples that pass the unit tests, and computes the unbiased estimator pass@k = E over problems of 1 minus C(n-c, k) / C(n, k). The paper notes that the tempting shortcut 1-(1-p)^k, where p is the empirical pass@1, is biased, and ships a numerically stable implementation:

```python
def pass_at_k(n, c, k):
    if n - c < k:
        return 1.0
    return 1.0 - np.prod(1.0 - k / np.arange(n - c + 1, n + 1))
```

pass@1 is the k=1 case: the single-sample success rate, which is what [SWE-bench](/glossary/swe-bench), LiveCodeBench and most model cards report. Card labels such as "Pass@1" or "avg@10" name the estimator and the run count, so read the footnote first.

pass^k ("pass hat k") is the complement, proposed in Sierra's tau-bench paper for agents that must be consistent: "the chance that all k i.i.d. task trials are successful, averaged across tasks," estimated as E over tasks of C(c, k) / C(n, k). Where pass@k rises with k, pass^k falls; tau-bench reported that gpt-4o scored under 50% on its tasks and under 25% at pass^8 in the retail domain. The two coincide at k=1, which is why a headline pass@1 says nothing about reliability. [LLM Benchmarks Explained](/guides/evaluation/llm-benchmarks-explained-2026) shows where each estimator appears, and [Terminal-Bench](/glossary/terminal-bench) is an example of a single-attempt resolution rate with confidence intervals instead.
