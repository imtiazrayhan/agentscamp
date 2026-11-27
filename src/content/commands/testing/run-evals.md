---
description: "Run the project's LLM evaluation suite (DeepEval, promptfoo, or RAGAS) and report scores against thresholds before a merge."
argument-hint: "<eval suite path / config, or the feature to evaluate>"
allowed-tools: "Read, Grep, Glob, Bash"
model: "sonnet"
title: "Run Evals"
color: "blue"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["llm-evals"]
audience: ["developers"]
related: ["guide:write-llm-evals", "tool:deepeval", "tool:promptfoo", "agent:llm-evaluation-engineer", "skill:llm-eval-suite-scaffolder", "agent:eval-driven-developer"]
featured: false
summary: "Runs the project's LLM eval suite (not the unit tests) over the full frozen dataset, then reports every metric against its threshold and a baseline in one table with a pass or block verdict. It detects DeepEval, promptfoo, or a RAGAS script, uses that runner's real command, and never edits prompts, data, or thresholds to go green."
---

## Scope

Treat `$ARGUMENTS` as the eval target: a path to the eval suite or config, or the feature whose suite should run. Restate what you are evaluating in one sentence first. If `$ARGUMENTS` is empty, run Step 1 and list the suites you found, then ask which one to run.

This command runs the **LLM evaluation suite** ([DeepEval](/tools/deepeval), [promptfoo](/tools/promptfoo), or [RAGAS](/tools/ragas)). It is not a unit-test runner, and it is read-only apart from the result files the runner itself writes: do not edit prompts, datasets, thresholds, or application code.

> [!NOTE]
> Evals cost tokens (judge metrics call an LLM) and judge scores vary between runs. Run the full frozen dataset, not a subset, and say how many cases ran.

## When to use

- Before merging a change to a prompt, model id, retrieval setting, or tool definition.
- After a dependency or provider upgrade, to confirm quality did not move.
- Not for a project with no eval suite. In that case stop at Step 1 and recommend scaffolding one (see [How to Write LLM Evals](/guides/evaluation/write-llm-evals)).

## Step 1: Locate the suite

Find the runner, the dataset, and the thresholds before running anything.

| Runner | How to detect it | Where thresholds live |
| --- | --- | --- |
| DeepEval | `deepeval` in `pyproject.toml` / `requirements*.txt`; files that import `deepeval` and call `assert_test` or `evaluate` | `threshold=` on each metric |
| promptfoo | `promptfooconfig.yaml` (or `.yml`, `.json`, `.js`); `promptfoo` in `package.json` | `assert:` blocks, `threshold:` per assertion |
| RAGAS | `ragas` in the Python manifest; a script that calls `evaluate(` from `ragas` | Usually in the script or CI config; RAGAS itself only returns scores |

Use Grep for `deepeval|promptfoo|ragas` across manifests and the `tests/`, `evals/`, and `.github/workflows/` directories. A CI workflow that already runs the evals is the best source for the exact command and required environment variables.

Then confirm:

1. **Dataset**: the file or loader the suite reads, and its case count. If it is under 20 cases, say so in the report: the verdict will be weak.
2. **Thresholds**: one per metric. If a metric has no threshold, report its score but mark the gate column `no threshold`; do not invent one.
3. **Credentials**: the judge model's API key variable is set (`printenv | grep -c OPENAI_API_KEY` style check, never print the value). If it is missing, stop and say which variable is needed.

If no suite exists, stop here. Do not fabricate ad-hoc checks and call them evals.

## Step 2: Find the baseline

A score only means something next to the last accepted score. Look for a baseline in this order and use the first that exists:

1. A committed baseline file (for example `evals/baseline.json`) or results folder.
2. The eval job's output on the latest default-branch CI run (`gh run list --workflow <eval workflow> --branch main --limit 1`, then `gh run view <id> --log`).
3. Neither exists: say "no baseline available" and report thresholds only. Offer to produce one by running the suite on the merge base, and state that this doubles the token cost before doing it.

## Step 3: Run it

Use the project's own script if one exists (`npm run eval`, `make evals`). Otherwise use the runner's command:

```bash
# DeepEval: -n runs test cases in parallel, -r repeats each case
deepeval test run tests/evals/test_rag.py -n 4

# promptfoo: --no-cache forces fresh model calls, -o writes machine-readable results
npx promptfoo@latest eval -c promptfooconfig.yaml --no-cache -o eval-results.json

# RAGAS has no CLI: run the project's script as CI does
python evals/run_ragas.py
```

Rules for the run:

- Run every case. Do not pass sampling or filter flags (`--filter-sample`, `--filter-pattern`, a pytest `-k`).
- Do not pass DeepEval's `-i` (ignore errors) in a gating run: an errored case must count as a failure, not disappear.
- promptfoo exits with code `100` when at least one test fails and `1` on any other error. Treat `1` as "the run broke", not as a quality result, and report the error instead of a table.
- If a judge-scored metric lands within 0.05 of its threshold, repeat the run for that suite (`-r 3` for DeepEval, `--repeat 3` for promptfoo) and report the mean and the range. One borderline sample is not a verdict.
- Capture the raw output. If the run is expected to take more than a few minutes or the dataset has more than about 200 cases, state the case count and ask before starting.

## Step 4: Report against thresholds and baseline

Read scores from the runner's output file where there is one (`eval-results.json`, DeepEval's `.deepeval/.latest_test_run.json`), not from scrolled terminal text. Then produce exactly this report:

```markdown
## Eval report: <suite> on <branch> (<n> cases, <runner>)

| Metric | Score | Threshold | Baseline | Delta | Gate |
| --- | --- | --- | --- | --- | --- |
| faithfulness | 0.91 | 0.85 | 0.93 | -0.02 | pass |
| answer_relevancy | 0.78 | 0.80 | 0.84 | -0.06 | FAIL |

**Verdict: BLOCK** (answer_relevancy 0.78 is 0.02 under its 0.80 threshold and 0.06 under baseline)

### Failing cases
- `case-017` "How do I rotate an API key?": answer_relevancy 0.41. Judge reason: <one line from the runner output>
- ...up to 5, lowest score first

### Likely stage
<retrieval | prompt | model | dataset>, with the evidence from the failing cases

### Run details
Command: `<exact command>` | Judge model: <id from config> | Baseline source: <file or CI run> | Errors: <n>
```

Gate rules, applied per metric:

- **FAIL** if the score is below its threshold (after the Step 3 repeat, use the mean).
- **REGRESSED** if it clears the threshold but dropped more than 0.05 from baseline on a 0 to 1 scale (or 5 points of pass rate). Use the project's own tolerance if it defines one.
- **pass** otherwise.

## Step 5: Verdict

- **PASS**: every metric passes and none regressed.
- **BLOCK**: any FAIL, or any errored case. Name the metric and the margin.
- **PASS WITH REGRESSION**: thresholds clear but something regressed. Leave the merge decision to the user and say what moved.

For a block, point at the likely stage from the failing cases instead of proposing a fix: low context recall or precision with good faithfulness points at retrieval; good retrieval scores with low faithfulness or relevancy points at the prompt or model; failures clustered on a few odd cases may be a dataset problem. Fixing it is a separate task.

> [!WARNING]
> Never tune the prompt against the cases you are reporting on in the same run, and never lower a threshold to go green. If a threshold is wrong, that is its own commit with a rationale.
