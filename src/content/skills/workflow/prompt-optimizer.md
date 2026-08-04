---
name: "prompt-optimizer"
description: "Diagnose why a prompt underperforms and rewrite it with the technique that fixes it — clearer structure, few-shot examples, an explicit output contract, or reasoning scaffolding — returning an optimized prompt, the rationale for every change, and what to measure to confirm the lift. Use when a prompt is flaky, verbose, drifting in format, or just not good enough."
allowed-tools: "Read, Grep, Glob, Edit, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-04
topics: ["workflow-prompting"]
related: ["guide:prompting-techniques-2026", "guide:dspy-prompt-optimization", "agent:prompt-engineer", "tool:dspy", "guide:prompt-patterns"]
featured: false
summary: "Hand this skill a prompt and it returns a better one. It identifies the failure mode (vague instructions, format drift, missing examples, no output contract, weak reasoning on hard cases), applies the technique that fixes that specific mode, and explains every change so the edit is a decision rather than a guess — then tells you exactly what to measure to confirm the improvement held."
---

Give this skill an underperforming prompt and it returns an optimized one — with the reasoning. It works the way a good prompt engineer does on a single prompt: figure out *which* failure mode you're hitting, apply the *one* technique that addresses it, and say what to measure so the change is verified rather than assumed. It optimizes the prompt in front of it; it does not invent requirements you didn't state.

## When to use this skill

- A prompt is flaky — inconsistent output, format drift, occasional hallucination or refusal.
- Output isn't reliably parseable, or doesn't follow the structure your code expects.
- A prompt works but is bloated — too many tokens, redundant instructions, over-long examples.
- You want a stronger first draft of a prompt for a well-defined task before wiring evals around it.

## When NOT to use this skill

- You need the full lifecycle — build an eval set, baseline, iterate, and gate in CI. That's the **prompt-engineer** agent; this skill optimizes one prompt, it doesn't own the regression suite.
- You want prompts *compiled* automatically against a metric and dataset across a multi-step pipeline. That's programmatic optimization with [DSPy](/tools/dspy) — see [Programmatic Prompt Optimization with DSPy](/guides/prompting/dspy-prompt-optimization).

## Instructions

1. **Diagnose the failure mode first.** Read the prompt and any failing outputs and name the specific problem before changing anything: vague/ambiguous instructions, format drift, missing examples, no output contract, weak reasoning on multi-step cases, or simply token bloat. The fix follows from the diagnosis — don't apply techniques shotgun.
2. **Fix structure before wording.** Lead with the role and the single job. Separate instructions from data with sections or delimiters (`# Task`, `# Rules`, `<input>…</input>`) so the model can't confuse them. State the output format explicitly and put the most important constraint where it won't get buried. Prefer positive instructions ("respond with only the JSON object") over a wall of "do not."
3. **Add few-shot examples where they pay.** If the failure is format or convention, add two to five short, varied examples that demonstrate the exact shape — including the edge cases the model gets wrong (empty input, ambiguity, the desired "unknown"/refusal). Don't add examples the failure mode doesn't call for; they cost tokens and can overfit.
4. **Add an output contract when output is consumed by code.** Specify the exact shape (fields, enums, types) and recommend backing it with the provider's native structured-output/JSON mode plus validate-and-retry, not just a prose "return JSON." See [Few-Shot vs Chain-of-Thought vs Structured Prompting](/guides/prompting/prompting-techniques-2026).
5. **Add reasoning only where the task needs it.** For genuinely multi-step problems on a non-reasoning model, add chain-of-thought. On reasoning models, don't — they reason internally, and an explicit "think step by step" is often redundant. Match the technique to the model class.
6. **Cut bloat last.** Once quality is addressed, trim redundant instructions, prune low-value examples, and shorten verbose schemas — without dropping anything that was load-bearing for a failure mode.
7. **Say what to measure.** Every optimization is a hypothesis. State the single change you made, why, and the concrete check that would confirm it helped (a handful of held-out cases, an exact-match or schema-valid rate). Recommend changing one thing at a time so the lift is attributable.

> [!WARNING]
> "It looks better" is how regressions ship. This skill produces an *optimized candidate* and the check to validate it — it is not a substitute for an eval set. If output quality matters, run the proposed prompt against held-out cases before trusting it, and graduate to the prompt-engineer agent for a real regression suite.

> [!TIP]
> When output is malformed, fix structure before prose: a strict output spec, structured-output mode, or a one-line format reminder at the end of the prompt usually beats another paragraph of instructions.

## Output

The optimized prompt, copy-pasteable and ready to drop in, plus: the diagnosed failure mode, a short rationale for each change (which technique and why), any examples or schema added, an estimate of the token-cost delta, and the specific check to run to confirm the change actually helped.
