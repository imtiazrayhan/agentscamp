---
name: "llm-eval-suite-scaffolder"
description: "Stand up an evaluation suite for an LLM feature from scratch — a representative dataset, the right metrics, a baseline score, and a CI gate — using DeepEval, promptfoo, or RAGAS. Use when a feature has no evals, before tuning a prompt, or when adding an LLM feature to CI."
allowed-tools: "Read, Grep, Glob, Edit, Write, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["llm-evals"]
audience: ["ai-engineers"]
related: ["guide:write-llm-evals", "tool:deepeval", "tool:promptfoo", "skill:llm-as-judge-scorer", "command:run-evals", "agent:llm-evaluation-engineer", "agent:eval-driven-developer"]
featured: false
summary: "Turns 'we should add evals' into a first running suite in one pass: a frozen dataset of 20 to 50 real cases, two or three metrics, a committed baseline, and a CI step, in promptfoo, DeepEval, or RAGAS. It stops once the baseline is recorded; judge calibration and prompt iteration belong to its two sibling agents."
---

The hardest part of LLM evaluation is starting. This skill scaffolds a first, runnable eval suite for one feature: dataset file, metric configuration, baseline record, and CI step, using the framework that fits the stack (DeepEval for Python/pytest, promptfoo for config-driven CLI, RAGAS for RAG-specific metrics).

Its job ends when the suite runs and a baseline is committed. Two siblings pick up from there:

- [eval-driven-developer](/agents/meta-orchestration/eval-driven-developer) (agent) uses a suite to improve the feature, one scored change at a time.
- [llm-evaluation-engineer](/agents/data-ai/llm-evaluation-engineer) (agent) makes a suite trustworthy at depth: judge calibration against human labels, run-to-run noise, dataset governance, gating policy.

## When to use this skill

- An LLM feature ships with no evals and you need a gate before changing it further.
- You're about to tune a prompt or swap a model and want to measure the change, not guess.
- You're adding an LLM feature to CI and need a suite that fails on regressions.

If a suite already exists, do not scaffold a second one. Run it with the [Run Evals](/commands/testing/run-evals) command, or extend its dataset.

## Instructions

1. **Find the call and pin the scoring unit.** Locate the function that makes the LLM call and note its inputs, output type, and prompt location. State how one output is judged: exact match, valid against a JSON schema, numeric tolerance, a set of required facts, or a rubric. An ambiguous success criterion is the real bug; resolve it with the user before writing any file.

2. **Build a representative dataset.** Collect 20 to 50 real inputs with expected behavior from logs, support tickets, fixtures, or the user. Aim for roughly half typical cases and half hard ones: empty or very long input, ambiguity, the format that broke last time, a prompt-injection attempt, an input where the right answer is "I can't tell". Give every case an ID and a tag so failures can be grouped. Freeze the file under version control. For RAG, capture the gold passages too.

3. **Pick the few metrics that matter.** Choose two or three, deterministic first:

   | Feature type | Start with |
   |---|---|
   | Extraction, classification | exact or field-level match, schema validity |
   | RAG answers | faithfulness to retrieved context, answer relevancy, plus a retrieval hit check against gold passages |
   | Open-ended generation | required and forbidden content checks, then a rubric judge ([llm-as-judge-scorer](/skills/data/llm-as-judge-scorer)) |

4. **Choose the framework and scaffold it.** Match the repo: [promptfoo](/tools/promptfoo) when the prompt is a template and the team is not Python-first; [DeepEval](/tools/deepeval) when the feature is Python and already tested with pytest; [RAGAS](/tools/ragas) metrics when retrieval quality is the question. Put everything under one directory such as `evals/<feature>/`.

   promptfoo (`evals/summarizer/promptfooconfig.yaml`):

   ```yaml
   description: ticket summarizer
   prompts:
     - file://../../prompts/summarize_ticket.txt
   providers:
     - <provider>:<model-id>   # the model the feature uses in production
   defaultTest:
     assert:
       - type: is-json
   tests:
     - description: refund-request-typical
       vars:
         ticket: "I was charged twice for order 1042. Please refund one charge."
       assert:
         - type: javascript
           value: JSON.parse(output).sentiment === 'negative'
         - type: llm-rubric
           value: Mentions the duplicate charge and order 1042, and invents no other facts
     - description: empty-ticket
       vars:
         ticket: ""
       assert:
         - type: javascript
           value: JSON.parse(output).summary.length < 80
   ```

   ```bash
   npx promptfoo@latest eval -c evals/summarizer/promptfooconfig.yaml -o evals/summarizer/results.json
   ```

   DeepEval (`evals/summarizer/test_summarizer.py`):

   ```python
   import json
   import pytest
   from deepeval import assert_test
   from deepeval.metrics import GEval
   from deepeval.test_case import LLMTestCase, SingleTurnParams

   from app.summarizer import summarize_ticket  # the function under test

   CASES = [json.loads(line) for line in open("evals/summarizer/dataset.jsonl")]

   correctness = GEval(
       name="Correctness",
       criteria="The actual output states the same facts as the expected output and adds none.",
       evaluation_params=[SingleTurnParams.ACTUAL_OUTPUT, SingleTurnParams.EXPECTED_OUTPUT],
       threshold=0.7,
   )

   @pytest.mark.parametrize("case", CASES, ids=[c["id"] for c in CASES])
   def test_summarizer(case):
       test_case = LLMTestCase(
           input=case["input"],
           actual_output=summarize_ticket(case["input"]),
           expected_output=case["expected"],
       )
       assert_test(test_case, [correctness])
   ```

   ```bash
   deepeval test run evals/summarizer/test_summarizer.py
   ```

   Check the installed framework version's docs for class and flag names before writing files; these libraries rename things between releases.

5. **Record a baseline.** Run the current prompt and model over the full set and commit the result next to the suite as `evals/<feature>/BASELINE.md`: date, commit, model, prompt version, score per metric, and the IDs of failing cases. Every later number is compared to this. Do not fix the feature in the same change; a baseline with red in it is the point.

6. **Set thresholds from the baseline, then wire the CI gate.** Start each threshold at or slightly below the baseline so the gate catches regressions without failing on day one. Add a CI step that runs the suite when prompts, model configuration, or the feature's code change. promptfoo's `eval` exits with code `100` when any test fails, and `deepeval test run` fails like a pytest run, so either can gate a merge directly. Provider API keys go in CI secrets.

> [!WARNING]
> Don't generate hundreds of synthetic cases and call it an eval set. Twenty real, well-chosen cases, including the adversarial ones, beat a thousand bland synthetic ones. Quality and coverage of failure modes, not volume.

## Output

A runnable eval suite committed to the repo, reported as:

```markdown
## Eval suite: ticket summarizer
Files: evals/summarizer/promptfooconfig.yaml, evals/summarizer/BASELINE.md, .github/workflows/evals.yml
Dataset: 32 cases (16 typical, 9 edge, 4 adversarial, 3 "cannot tell"), frozen at commit abc1234
Metrics: valid JSON (deterministic), sentiment match (deterministic), fact coverage (rubric judge)
Baseline: 27/32 passing (84%); failing IDs: empty-ticket, two-orders, injection-2, long-thread-1, long-thread-3
Gate: CI fails on any test failure for deterministic checks; rubric threshold 0.7
Run locally: npx promptfoo@latest eval -c evals/summarizer/promptfooconfig.yaml
Not covered: judge has not been calibrated against human labels; scores from a single run
```

Always include the "Not covered" line. It tells the next person which of the two sibling agents to bring in.
