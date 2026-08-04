---
name: "prompt-regression-tester"
description: "Build a regression test harness for an LLM prompt so a prompt edit or model upgrade can't silently degrade quality — a fixed eval set, checkable assertions, and a diff against a committed baseline. Use when changing a production prompt, migrating model versions, or any time 'I tweaked the prompt' needs to be backed by evidence instead of eyeballing two outputs."
allowed-tools: "Read, Grep, Glob, Bash, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Prompt Regression Tester"
date: 2026-06-17
topics: ["llm-evals", "workflow-prompting"]
related: ["command:create-skill", "command:scaffold-rag-pipeline"]
featured: false
summary: "Eyeballing two outputs isn't testing a prompt change. This skill builds a real regression harness: a fixed eval set (including the cases that previously broke), checkable assertions per input, an optional LLM-judge for genuinely subjective qualities, and a diff against a committed baseline that flags every regression before you ship the edit."
faq:
  - q: "Do I need an LLM-as-judge for every case?"
    a: "No — reserve it for genuinely subjective qualities (tone, helpfulness, faithfulness). Anything checkable (a JSON field, a required substring, a forbidden phrase, a structural shape) should be a deterministic assertion. Judges are slower, costlier, and noisier; use them only where code can't decide."
  - q: "Why diff against a baseline instead of just asserting pass/fail?"
    a: "A pure pass/fail bar misses silent drift — a case that still passes but got worse, or a case that started passing for the wrong reason. The committed baseline makes every change reviewable in a PR, so a regression is a visible red line, not a number nobody compared."
---

A prompt edit that "looks fine on a couple of examples" is the single most common way teams ship a quality regression. The fix is not heroic — it's a fixed eval set, assertions a machine can check, and a baseline you diff against. This skill builds that harness so any prompt change or model migration produces a pass/fail + regression report instead of a vibe.

## When to use this skill
- You're about to edit a production prompt and want proof the edit doesn't regress existing behavior.
- You're migrating models (e.g. `claude-opus-4-7` → `claude-opus-4-8`, or onto a new provider) and need to confirm output quality holds.
- A prompt regressed in the past and you want a committed test that would have caught it.
- You're standing up a new prompt and want defensible coverage before it goes live.
- Someone "improved" a prompt and you need to confirm it actually improved rather than traded one failure for another.

## Instructions

1. **Find the prompt and its call site first.** `Grep` for the system/user prompt text, the model ID (`claude-`, `gpt-`, `model=`, `model:`), and the SDK call (`messages.create`, `chat.completions`, etc.). Pin down exactly what's under test: the prompt string, the model ID, and every generation parameter (`effort`/`temperature`/`max_tokens`/`tools`). The harness must reproduce that call exactly — a regression test that uses different params than production tests the wrong thing.

2. **Assemble a FIXED eval set — and freeze it.** Collect 15–40 representative inputs into a version-controlled file (`evals/cases.jsonl`, one JSON object per line: `{id, input, ...}`). Include, deliberately: the happy-path cases, the boundary cases, and — most importantly — every input that has *previously failed* (past bug reports, support tickets, the example that motivated the last prompt edit). The set is an asset; it only grows by deliberate commit, never shrinks or mutates per run.

   > [!WARNING]
   > An eval set that changes between runs is not a regression test — it's a fresh experiment each time, and the diff against baseline is meaningless. Do not generate inputs on the fly, sample randomly, or pull "the latest N production logs" at runtime. Commit the inputs.

3. **Write checkable assertions per case — prefer deterministic over judged.** For each input, specify what "correct" means as machine-checkable expectations, picking the *tightest* check that fits:
   - `exact` — output equals a string (classification labels, enum values).
   - `contains` / `not_contains` — a required substring is present / a forbidden phrase (a leaked secret, a banned disclaimer, "As an AI") is absent.
   - `regex` — a format pattern (an order ID shape, a date, a currency string).
   - `json_schema` — output parses as JSON and validates against a schema (the highest-value check for structured-output prompts; catches missing fields, wrong types, extra keys).
   - `structural` — list length, required keys present, sorted order, no duplicates.

   Store assertions alongside each case. A single case may carry several. **Reserve an LLM-as-judge only for qualities no code can decide** — tone, helpfulness, faithfulness to a source, "did it refuse appropriately" — and even then express the judge as a rubric with a discrete verdict (`pass`/`fail` or a 1–5 score with a threshold), not a freeform "rate this."

4. **Default to the latest, most capable model for both the system-under-test and the judge.** Use `claude-opus-4-8` (current most-capable Opus; 1M context, adaptive thinking) unless the prompt's production config pins a different model — in which case test *that* model and add `claude-opus-4-8` as a comparison column. For the judge, also default to `claude-opus-4-8`: a weak judge is a noisy judge. Use adaptive thinking (`thinking: {type: "adaptive"}`) for the judge; do not send `temperature`/`top_p`/`budget_tokens` (removed on Opus 4.7/4.8 — they 400). Keep the judge model **separate and named** in the report so a judge swap is never confused with a quality change.

5. **Run the set across each variant under test and score every case.** A "variant" is a (prompt, model, params) tuple — typically `baseline` (current production) vs `candidate` (your edit). Iterate the frozen cases, call the real SDK with the exact production config, run each assertion, and record a per-case result: `pass`/`fail`, which assertion failed, and the raw output. Run candidate and baseline in the same invocation so they see identical inputs. Cache or store raw outputs so a re-score (e.g. after fixing an assertion) doesn't require re-generating.

6. **Diff against the committed baseline and flag regressions.** Snapshot the baseline results to `evals/baseline.json` (committed). On each run, compare candidate-vs-baseline per case and classify:
   - **Regression** — passed in baseline, fails now. (The line that blocks the PR.)
   - **Fix** — failed in baseline, passes now. (The intended win — confirm it's real, not luck.)
   - **Unchanged pass / unchanged fail** — note but don't alarm.

   > [!WARNING]
   > Don't treat "candidate pass-rate ≥ baseline pass-rate" as green. Aggregate rate hides swaps — a candidate can fix two cases and break two others for the same headline number. The per-case regression list is the signal; the aggregate is a summary, not the gate.

7. **Make the baseline a deliberate, reviewed artifact.** Update `evals/baseline.json` only via an explicit "accept" step (a `--update-baseline` flag or a separate command), and commit it in the same PR as the prompt change so a reviewer sees both the new prompt and exactly which case results moved. Never let the harness silently rewrite the baseline on every run — that's how a regression gets absorbed into "the new normal" unnoticed.

   > [!NOTE]
   > LLM outputs vary run-to-run even at fixed settings, so a single judged case flipping isn't necessarily a real regression. For judge-scored cases, run N=3 and require a majority verdict before flagging; for deterministic assertions, one failure is one failure — no repetition needed.

## Output

The skill produces a committed, runnable harness:

- **Layout** —
  ```
  evals/
    cases.jsonl        # frozen inputs + per-case assertions (version-controlled)
    baseline.json      # accepted baseline results (version-controlled)
    run.(py|ts)        # loads cases, runs each variant, scores, diffs
    schema/*.json      # json_schema assertions, if any
  ```
- **The assertion set** — each case lists its checks, e.g.
  ```json
  {"id": "refund-001", "input": "...", "assert": [
    {"type": "json_schema", "schema": "schema/refund.json"},
    {"type": "not_contains", "value": "As an AI"},
    {"type": "judge", "rubric": "Output politely declines without admitting fault.", "threshold": "pass"}
  ]}
  ```
- **A pass/fail + regression report** — printed and written to `evals/report.md`:
  ```
  Variant: candidate (prompt@HEAD, claude-opus-4-8)  vs  baseline (prompt@main, claude-opus-4-8)
  Judge: claude-opus-4-8

  42 cases | 39 pass / 3 fail   (baseline: 40 pass / 2 fail)

  REGRESSIONS (2)  ← blocks merge
    refund-001   json_schema: missing field "reason"
    tone-014     judge(2/3): newly apologetic where baseline was neutral

  FIXES (1)
    parse-007    regex: now matches order-id format

  Exit code: 1 (regressions present)
  ```

A non-zero exit on any regression makes the harness drop straight into CI. Report file paths back as absolute paths so the user can wire it up.