---
title: "8 Best Claude Skills for LLM Evals"
description: "Compare Claude skills and commands for eval suites, prompt regression harnesses, LLM-as-judge rubrics, groundedness checks, agent trajectories, and CI gates."
author: "Imtiaz Rayhan"
date: "2026-10-07"
color: "green"
topics: ["llm-evals", "workflow-prompting"]
audience: ["ai-engineers", "developers"]
tags: ["claude-skills", "llm-evals", "evaluation", "llm-as-judge", "regression-testing", "best-of"]
seoTitle: "8 Best Claude Skills for LLM Evals"
seoDescription: "The best Claude skills for LLM evals: scaffold a suite, build a prompt regression harness, calibrate an LLM judge, measure hallucination, and gate CI."
summary: "Start with llm-eval-suite-scaffolder when a feature has no evals, or prompt-regression-tester for one prompt change. Add llm-as-judge-scorer for open-ended output, hallucination-evaluator for grounded answers, and agent-trajectory-evaluator for tool-using agents. run-evals gates CI; red-team-llm and benchmark-rerankers are the specialists."
keyTakeaways:
  - "Every pick starts from a frozen, version-controlled eval set and a committed baseline; without both, a score is a one-off experiment rather than a measurement."
  - "Prefer deterministic checks (exact match, JSON schema, regex, step counts) wherever code can decide, and reserve an LLM judge for qualities that genuinely need judgment."
  - "An LLM judge is itself under test: llm-as-judge-scorer validates it against 20 to 30 human-labeled cases before any score is trusted."
  - "Grade per claim and per step, not per answer: hallucination-evaluator splits retrieval failures from generation failures, and agent-trajectory-evaluator flags a regression even when the final answer still passes."
  - "Never tune against the set you report on and never relax a threshold to go green; run-evals and both agents refuse to."
  - "llm-evaluation-engineer builds the scoring machine; eval-driven-developer drives the change, score, keep-or-revert loop with it."
faq:
  - q: "Is there a Claude skill for LLM evals?"
    a: "Yes. llm-eval-suite-scaffolder builds a complete suite (dataset, metrics, baseline, CI gate) on DeepEval, promptfoo, or RAGAS. prompt-regression-tester builds a lighter harness for one prompt, and llm-as-judge-scorer, hallucination-evaluator, and agent-trajectory-evaluator cover judged output, grounded answers, and multi-step agents."
  - q: "Which Claude skill should I use first when a feature has no evals?"
    a: "llm-eval-suite-scaffolder. It pins the task and the unit of scoring, collects 20 to 50 real inputs with the hard cases oversampled, picks two or three metrics, records a baseline, and wires a run-evals step into CI. If you only need to protect one prompt against an edit, prompt-regression-tester is smaller and faster."
  - q: "Can Claude Code run my eval suite in CI?"
    a: "The run-evals command locates the project's DeepEval, promptfoo, or RAGAS suite, runs the full frozen dataset, and reports each metric against its threshold and baseline with a pass or block verdict. It is read-only and will not modify prompts, the dataset, or thresholds to make a run pass."
  - q: "Should I use an eval skill or the llm-evaluation-engineer agent?"
    a: "Use a skill for one bounded job: a judge rubric, a groundedness score, a trajectory diff. Use llm-evaluation-engineer to own the whole suite from dataset to CI gate, and eval-driven-developer when you want the day-to-day loop of changing a prompt, re-scoring, and keeping or reverting driven for you."
related: ["skill:llm-eval-suite-scaffolder", "skill:prompt-regression-tester", "skill:llm-as-judge-scorer", "skill:hallucination-evaluator", "skill:agent-trajectory-evaluator", "command:run-evals", "command:red-team-llm", "command:benchmark-rerankers", "agent:llm-evaluation-engineer", "agent:eval-driven-developer", "guide:write-llm-evals", "guide:llm-as-judge-guide"]
---

The best Claude skills for LLM evals share one discipline: a frozen eval set, a committed baseline, and one change at a time. LLM features regress silently, since a prompt tweak that fixes three cases can break twenty others, and the only defense is a fixed set of inputs that every change is scored against. Each pick below enforces that rule in a different setting: a feature with no evals, a single prompt edit, open-ended output, grounded answers, or a multi-step agent.

Five are skills and three are slash commands. Each entry names the allowed tools, what it writes versus reports, and when to choose it over its neighbours. If the vocabulary is new, [Write Evals for an LLM App](/guides/evaluation/write-llm-evals) explains the dataset, baseline, and gate in order.

| Skill | Best for | Typical artifact | Writes files? |
| --- | --- | --- | --- |
| [llm-eval-suite-scaffolder](/skills/data/llm-eval-suite-scaffolder) | A feature with no evals | Dataset, metrics, baseline, CI step | Yes |
| [prompt-regression-tester](/skills/data/prompt-regression-tester) | One prompt edit or model migration | evals/ harness and regression report | Yes |
| [llm-as-judge-scorer](/skills/data/llm-as-judge-scorer) | Open-ended output | Calibrated judge metric | Yes |
| [hallucination-evaluator](/skills/data/hallucination-evaluator) | Grounded or RAG answers | Groundedness report and gate threshold | No (report) |
| [agent-trajectory-evaluator](/skills/data/agent-trajectory-evaluator) | Tool-using agents | Trajectory schema, assertions, baseline diff | No (report) |
| [run-evals](/commands/testing/run-evals) (command) | Gating a merge | Metric vs threshold table and verdict | No |
| [red-team-llm](/commands/review/red-team-llm) (command) | Adversarial probing | Findings ranked by blast radius | No |
| [benchmark-rerankers](/commands/review/benchmark-rerankers) (command) | Deciding on a reranker | Before/after retrieval metrics | No |

## 1. llm-eval-suite-scaffolder: stand up the first suite

[llm-eval-suite-scaffolder](/skills/data/llm-eval-suite-scaffolder) is for the feature that ships with no evals. It starts by pinning the task and the unit of scoring, because an ambiguous success criterion is the real bug: is one output judged by exact match, JSON-schema validity, a numeric tolerance, or a rubric? It then collects 20 to 50 real inputs, oversampling the hard cases (empty input, ambiguity, the format that broke last time, a prompt-injection attempt), freezes them under version control, and captures gold passages for RAG.

It picks two or three metrics the feature is actually graded on (faithfulness and answer relevancy for RAG, task accuracy and format validity for extraction, a calibrated rubric for open-ended output), scaffolds the suite in [DeepEval](/tools/deepeval), [promptfoo](/tools/promptfoo), or [RAGAS](/tools/ragas), records a baseline, and adds a run-evals step to CI. Tools are Read, Grep, Glob, Edit, Write, and Bash, so it writes the suite into the repo. [Best LLM & RAG Evaluation Tools in 2026](/guides/evaluation/best-llm-eval-tools-2026) compares the frameworks.

## 2. prompt-regression-tester: protect one prompt from its next edit

Where the scaffolder measures a feature, [prompt-regression-tester](/skills/data/prompt-regression-tester) answers a narrower question: did this prompt edit or model migration break anything? It greps for the prompt text, model ID, and SDK call so the harness reproduces the exact production parameters, freezes 15 to 40 inputs in `evals/cases.jsonl` including every input that previously failed, and attaches the tightest machine-checkable assertion to each: `exact`, `contains`, `regex`, `json_schema`, or a structural check. An LLM judge is reserved for qualities no code can decide and returns a discrete verdict.

Baseline and candidate run in the same invocation, every case is classified as regression, fix, or unchanged, and the per-case regression list is the gate, because an aggregate pass rate hides a candidate that fixes two cases and breaks two others. The committed `evals/baseline.json` changes only through an explicit accept step. Tools are Read, Grep, Glob, Bash, and Write; a non-zero exit on any regression makes it a CI step. The same harness anchors [9 Best Claude Skills for Prompt Engineering](/guides/skills/best-claude-skills-for-prompt-engineering).

## 3. llm-as-judge-scorer: calibrate the judge before trusting it

Open-ended output (a summary, a support answer, tone) cannot be scored by exact match, and an uncalibrated judge produces confident noise. [llm-as-judge-scorer](/skills/data/llm-as-judge-scorer) builds one you can defend: an explicit rubric with concrete deductions instead of "rate quality 1 to 10", a small discrete scale with a written anchor per level, and scored reference examples at the boundaries. It controls the known biases (judges favor longer answers, their own model family's style, and the first option in a pairwise test) by randomizing order, instructing length-neutrality, and using a different model as judge than the one under test.

The step that makes it a metric rather than an opinion is validation: hand-label 20 to 30 cases, run the judge, and measure agreement before deploying it as a custom metric with a threshold. Tools are Read, Grep, Glob, Edit, Write, and Bash. It also says when not to use it: a schema check or a regex is cheaper and perfectly consistent. [LLM-as-Judge: Build Evaluators You Can Actually Trust](/guides/evaluation/llm-as-judge-guide) covers the reasoning.

## 4. hallucination-evaluator: score faithfulness one claim at a time

[hallucination-evaluator](/skills/data/hallucination-evaluator) measures a narrower, more checkable property than a general judge: is each claim in the answer entailed by the source the model was given? It grades faithfulness, not world truth, decomposes each answer into atomic claims, and labels each `supported`, `not_supported`, or `contradicted` with an NLI model or a judge told to use only the provided source. Its eval set includes questions whose answer is not in the context, where the correct behavior is to abstain.

The report splits every ungrounded answer into retrieval failure (the answer was never retrieved) or generation failure (the model ignored what was retrieved), then computes groundedness as supported claims over total claims, adds abstention accuracy, and sets a CI threshold. Tools are Read, Grep, Glob, and Bash with no Edit or Write, so it produces a report and a judge prompt rather than editing the pipeline. Choose it over llm-as-judge-scorer whenever the question is "is this in the source" rather than "is this good". The [RAG list](/guides/skills/best-claude-skills-for-rag) shows where it sits among the retrieval skills.

## 5. agent-trajectory-evaluator: grade the path, not just the answer

A tool-using agent can reach the right answer through a broken path: the wrong tool, a retry loop, a lucky recovery. [agent-trajectory-evaluator](/skills/data/agent-trajectory-evaluator) captures each step as a structured record (decision, tool, arguments, result, error flag, latency) and builds a fixed task set in three buckets: routine tasks, tasks that require a tool call, and trap tasks engineered to trip a known failure. It scores every run on five axes: tool selection, argument correctness, step efficiency against a per-task budget, error recovery, and goal completion.

It asserts the checkable axes in code (tool names, argument values, step counts) and gives a judge one subjective step and one criterion at a time, because a judge over a whole trajectory rationalizes whatever path it sees. Its baseline diff flags a regression even when the answer still passes: two extra steps, a new retry loop, a precise tool swapped for a brute-force one. Tools are Read, Grep, Glob, and Bash, so the output is a schema, assertion code, and a diff report. Pair it with [Why Your Agent Loops: Debugging AI Agents](/guides/troubleshooting/debugging-ai-agents).

## 6. run-evals: the merge gate

[run-evals](/commands/testing/run-evals) takes the suite path or feature name as its argument and runs the LLM evaluation suite, not the unit tests. It locates the DeepEval tests, `promptfooconfig.yaml`, or RAGAS script and the frozen dataset, runs the full set rather than a cherry-picked subset, and reports metric, score, threshold, baseline, pass or fail, and delta, ending with a verdict: pass, or block with the failing metric and the likely stage (retrieval, prompt, or model). If no suite exists it stops and recommends scaffolding one. Tools are Read, Grep, Glob, and Bash; it will not modify prompts, the dataset, or a threshold to go green.

## 7. red-team-llm: evaluate what the suite does not cover

An eval suite scores the inputs you expected; [red-team-llm](/commands/review/red-team-llm) scores the ones an attacker would send. On a system you are authorized to test, it maps every channel reaching the model (user input, retrieved content, tool outputs, browsed pages, the system prompt) and runs probes for direct and indirect injection, jailbreaks, system-prompt leakage, data exfiltration, and tool misuse, with [promptfoo](/tools/promptfoo) suites and manual probes including a poisoned document on the indirect path. Each success is recorded with its blast radius, mapped to a mitigation from [Defending Against Prompt Injection](/guides/ai-safety/defending-prompt-injection), and re-run after the fix. It is read-only (Read, Grep, Glob, Bash) and reports which categories it did not run.

## 8. benchmark-rerankers: a component eval with a verdict

[benchmark-rerankers](/commands/review/benchmark-rerankers) is the cleanest example of a component-level eval. On a labeled set of 20 to 50 queries with gold passages, it captures the top-k before and after reranking over the same candidate pool, reports recall@k, nDCG@k, and MRR at k of 3, 5, and 10 with deltas, adds per-query latency and cost, and ends with a verdict: ship, skip, or change candidate depth or model. Because a reranker can only reorder what first-stage retrieval found, it over-retrieves 25 to 50 candidates and measures first-stage recall too. It is read-only and refuses to tune against the queries you eyeball.

## Agents that own the loop

[llm-evaluation-engineer](/agents/data-ai/llm-evaluation-engineer) builds the scoring machine: it pins the task, freezes a dataset of 20 to 100 cases, records a baseline, chooses the few metrics that matter, scaffolds the suite, gates CI with run-evals, and adds new production failures to the set so the same bug cannot return. It has Read, Grep, Glob, Edit, Write, and Bash, and hands production tracing to llm-observability-engineer and prompt wording to prompt-engineer.

[eval-driven-developer](/agents/meta-orchestration/eval-driven-developer) drives the loop with that machine. It turns "make the summarizer better" into checkable criteria with targets, assembles an eval set that includes every known failure, picks an assertion per criterion and a judge only when forced, establishes a baseline, then makes one change at a time and keeps it only if the score holds without regressing other criteria, latency, or cost. Its output is a change-by-change decision log. It runs with Read, Grep, Glob, Edit, and Bash, treats a 100 percent pass rate on day one as a sign the cases are too easy, and if no harness exists builds the smallest script that prints scores.

## Recommended eval stacks

For a feature with no evals, install the scaffolder, the judge, the gate, and the agent that maintains them:

```bash
npx agentscamp add skills/llm-eval-suite-scaffolder
npx agentscamp add skills/llm-as-judge-scorer
npx agentscamp add commands/run-evals
npx agentscamp add agents/llm-evaluation-engineer
```

For iterating on a prompt that already works, add the regression harness and the agent that runs the loop:

```bash
npx agentscamp add skills/prompt-regression-tester
npx agentscamp add agents/eval-driven-developer
```

For grounded answers and tool-using agents, add the specialists:

```bash
npx agentscamp add skills/hallucination-evaluator
npx agentscamp add skills/agent-trajectory-evaluator
npx agentscamp add commands/red-team-llm
```

Whichever you install, ask Claude for the path of the frozen eval set, the baseline score, and the per-case regression list; a pass rate on its own hides swaps. For choosing between accuracy, faithfulness, relevancy, and the rest, see [LLM Evaluation Metrics Explained](/guides/evaluation/llm-evaluation-metrics-explained).

## Continue exploring

- [Write Evals for an LLM App: From Zero to a CI Gate](/guides/evaluation/write-llm-evals) — The dataset, metrics, baseline, judge, and CI gate in the order you build them.
- [Testing LLM Applications: How to Test Non-Deterministic Software](/guides/testing/testing-llm-applications) — A testing strategy for software whose output changes between runs.
- [10 Best Claude Skills for RAG](/guides/skills/best-claude-skills-for-rag) — The retrieval-side measurement skills: chunking sweeps, embedding checks, and index tuning.
