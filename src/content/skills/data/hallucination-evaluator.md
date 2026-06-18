---
name: "hallucination-evaluator"
title: "Hallucination Evaluator"
description: "Detect and measure ungroundedness in LLM and RAG outputs — claims the source doesn't support — by decomposing answers into atomic claims and checking each for entailment, so you can quantify faithfulness and gate on it instead of eyeballing it. Use when a RAG/LLM feature makes confident wrong claims, before shipping anything that must be factual, or to add a groundedness gate to evals/CI."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["llm-evals"]
related: ["llm-eval-suite-scaffolder", "llm-as-judge-scorer", "agent-trajectory-evaluator"]
featured: false
summary: "Confident and fluent is not the same as grounded. This skill measures faithfulness — whether each claim in an answer is entailed by the retrieved source — by decomposing answers into atomic claims and checking entailment, then splits retrieval vs generation failures and gates releases on a groundedness score."
---

"It sounds confident" is not "it's correct." A RAG or grounded-generation feature can produce fluent, authoritative prose that the retrieved source never supports — and fluency is uncorrelated with faithfulness, so you cannot eyeball it. This skill makes hallucination measurable: it defines the standard precisely, decomposes each answer into atomic claims, checks each claim for entailment against the source, builds a labeled eval set that includes the should-abstain cases, splits retrieval failures from generation failures, and produces a groundedness score you can gate releases on.

## When to use this skill
- A RAG/LLM feature is making confident claims that turn out to be wrong, and you can't tell how often.
- Before shipping anything that must be factual — support answers, summaries of provided docs, extraction over a source.
- You want a groundedness gate in evals/CI so a regression in faithfulness blocks the release instead of surfacing in production.
- A summary, citation, or "based on the document…" answer is adding facts the document doesn't contain.
- You need to know *why* it's wrong — bad retrieval vs. the model ignoring good retrieval — because the fix differs.

## Instructions

1. **Define the standard precisely — faithfulness, not world-truth.** In RAG/grounded generation, a hallucination is a claim **not entailed by the retrieved context (the source you gave the model)**. This is *faithfulness*, and it is distinct from *factual accuracy against the world*. A claim can be true in reality but unfaithful (the source never said it), and faithful but false (the source itself was wrong). You grade **faithfulness to the source, because that is checkable**; open-world truth is not checkable here and conflating the two makes the eval incoherent. State which one you're measuring in writing before you score anything.

2. **Decompose each answer into atomic claims.** A claim is a single, independently checkable assertion ("The policy refund window is 30 days"). Split compound sentences, drop hedges and meta-commentary, and keep pronoun referents resolved so each claim stands alone. Score faithfulness *per claim*, not per answer — a 4-sentence answer with one unsupported sentence is 75% grounded, and that granularity is what lets you find the specific failure.

3. **Check each claim for entailment against the source.** For each atomic claim, label it `supported` / `not_supported` / `contradicted` using one of two checkers: (a) an NLI/entailment model (premise = the retrieved chunks, hypothesis = the claim), or (b) an **LLM-judge with the source in its context** — for the judge, default to the latest, most capable Claude model (`claude-opus-4-8`, or `claude-fable-5` for the hardest cases). Pin the judge to faithfulness: *"Using ONLY the provided source, is this claim supported? Quote the supporting span or answer not_supported. Do not use outside knowledge."* The judge grades entailment, which is checkable — never open-world truth.

4. **Build a labeled eval set that includes the should-abstain cases.** Collect (question, retrieved context, answer) triples and hand-label the grounded/ungrounded claims. Crucially, include questions whose answer **is not in the context** — there the correct behavior is to abstain ("I don't know" / "the source doesn't say"), and answering anyway is the exact hallucination you most want to catch. An eval set without should-abstain cases will pass a model that confidently invents answers whenever retrieval comes up empty.

5. **Split retrieval failure from generation failure.** For every ungrounded answer, ask: *was the correct answer present in what was retrieved?* If **no** → retrieval failure (the answer wasn't in the context → fix retrieval: chunking, embeddings, top-k, reranking). If **yes, but the model ignored or contradicted it** → generation failure (fix the prompt/model: cite-or-abstain instructions, a stronger model, lower the room to improvise). Report the two rates separately — they have different owners and different fixes, and a single "hallucination rate" hides which lever to pull.

6. **Report a groundedness score and gate on it.** Compute groundedness = supported claims / total claims across the eval set, plus an abstention-accuracy number on the should-abstain subset. Attach concrete failing examples (claim + the source span it contradicts or the absence of any span). Set a threshold and wire it into CI so a drop blocks the release. Re-run the same fixed eval set on every prompt/retrieval/model change.

7. **Reduce it, then re-measure.** Apply the levers the split points to: grounding prompts (**cite-or-abstain** — "answer only from the source; if it's not there, say so"), require an inline citation/verbatim quote per claim (a claim that can't be quoted is the one to suspect), and retrieval improvements for the retrieval-failure share. After each change, re-run the eval — don't trust that a prompt tweak helped; show the score moved.

> [!WARNING]
> Confidence and fluency are uncorrelated with faithfulness. The most dangerous hallucinations are the ones that read most authoritatively, so you must check claims against the source span by span — never grade on how convincing the answer sounds.

> [!WARNING]
> Do not let the faithfulness judge use outside knowledge. If it "knows" a claim is true and marks it supported even though the source never says it, you're now measuring world-truth (not measurable here) instead of groundedness (measurable) — and the eval becomes incoherent. The instruction "use ONLY the provided source" is load-bearing; verify the judge actually abstains when the source is silent.

## Output
A faithfulness eval report containing: (1) the eval method — atomic-claim decomposition + the entailment/LLM-judge checker, with the exact judge prompt; (2) the labeled eval set, explicitly including should-abstain cases (answer-not-in-context); (3) per-answer results split into retrieval-failure vs. generation-failure, with separate rates; and (4) the groundedness score (supported claims / total) plus abstention accuracy, concrete failing examples with the offending source spans, and a CI gate threshold. Reproducible: same eval set, same judge model, re-runnable on every change.