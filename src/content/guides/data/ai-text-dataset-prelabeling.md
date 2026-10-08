---
description: "Prepare a small supervised text-labeling batch with separate model suggestions and human responses, using stable record IDs and an approved task specification."
date: "2026-08-12"
reviewed: "2026-10-07"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["ai-engineers", "analysts"]
tags: ["text-annotation", "ai-text-dataset-prelabeling"]
featured: false
related: ["guide:adjudicate-ai-assisted-text-labels", "tool:label-studio", "skill:annotation-task-spec-builder", "command:check-annotation-batch"]
summary: "Prepare a small supervised text-labeling batch with separate model suggestions and human responses, using stable record IDs and an approved task specification."
title: "Prelabel a Text Dataset with AI Without Replacing Review"
depth: "standard"
sources: [{"title": "Integrate Label Studio into your ML pipeline", "url": "https://labelstud.io/guide/ml.html", "publisher": "HumanSignal"}, {"title": "Annotate datasets", "url": "https://docs.argilla.io/latest/how_to_guides/annotate/", "publisher": "Argilla"}]
seoDescription: "Prepare a small supervised text-labeling batch with separate model suggestions and human responses, using stable record IDs and an approved task specification."
keyTakeaways: ["Fix owner-approved single-label rules and preserve raw text before asking for suggestions.", "Store model provenance and human responses separately, including incorrect original predictions.", "Export only records accepted under the supplied review policy, with unresolved rows accounted for."]
faq: [{"q": "Should I replace wrong predictions with the reviewed labels?", "a": "Keep the original predictions unchanged and store reviewed labels separately. Otherwise you lose evidence of model errors and cannot distinguish what the model proposed from what people accepted."}]
---

Prelabeling gives reviewers a proposal to inspect. It should not erase the source text, replace a human response or turn a model’s confidence into acceptance authority. Keep the raw records, model suggestions, independent responses and accepted export in distinct parts of the review packet.

This workflow assumes an owner has already defined a supervised, single-label text task. The allowed labels and abstention policy are inputs. It does not discover a thematic customer-feedback codebook or decide what your organization should learn from comments. Complete that task definition first, then use prelabeling to prepare reviewable examples before any training step.

## Fix the task before generating suggestions

Write a versioned task specification containing the purpose, allowed labels, definitions, inclusion and exclusion rules, examples, ambiguous-case policy and decision owner. State whether a record can be skipped, marked unresolved or given a supplied abstention label. Do not invent a new class simply because the model encounters difficult wording.

For a single-label task, each accepted record must have one permitted label. If the owner wants multiple labels, spans or hierarchical categories, stop and obtain a different specification and export contract. A simple request-versus-statement packet should not quietly become an intent taxonomy with extra categories.

The [annotation task spec builder](/skills/data/annotation-task-spec-builder) can organize supplied rules and identify gaps. Review those gaps with the owner. A model can make a missing rule conspicuous, but it cannot make the rule authoritative by proposing a reasonable answer.

## Freeze text and provenance

Create a raw inventory with stable record IDs, exact text and a source version or hash. Preserve whitespace or punctuation that matters to the task. Store transformations separately with their own IDs. Do not overwrite an original question with a normalized statement, then ask reviewers to label it as though it were unchanged.

For each model suggestion, keep the record ID, proposed label, model identifier, available version, prompt version, task-rule version and run reference. Retain a reason or quoted evidence only when the model actually supplies it, and label it as a model explanation. Do not fabricate confidence scores or treat a confident explanation as proof.

Import the suggestion as a prediction or proposal, using the chosen platform’s actual format. Keep the mapping to the raw inventory explicit. [Label Studio's ML guide](https://labelstud.io/guide/ml.html) describes preannotations for review and importing static predictions without an ML backend. The [Label Studio profile](/tools/label-studio) provides a small evaluation; verify the actual export rather than assuming the platform preserves every provenance field you need.

## Review a calibration set

The following records and rules are fictional. The owner’s task is to assign request or statement. Rule v1 treats an utterance that asks the addressee to perform an action, including “Please” followed by that action, as request. It supplies statement examples and an unresolved policy for wording outside its covered examples.

| Record | Raw text | AI suggestion | Human response evidence |
| --- | --- | --- | --- |
| U1 | Please export this. | statement | R1=request, citing “Please” and “export”; R2=request, citing the requested action |
| U2 | The export is ready. | statement | R3=statement, citing the assertion of readiness |

For U1, preserve the wrong model suggestion. Two reviewers’ request responses are the human evidence; the accepted label is a separate export value under the owner’s policy. Do not rewrite the prediction to request after review, because that would conceal the calibration error and make later analysis of model suggestions misleading.

Ask reviewers to work independently on the calibration set. Define what they can see and document that setup. If you want a comparison without suggestion anchoring, provide a separate review packet that omits the suggestions or verify the platform’s supported configuration. Do not claim independence merely because two response IDs exist.

Record response ID, reviewer reference, task version, label, exact evidence and status. Agreeing responses may meet the owner’s acceptance rule without a separate adjudication row. Disagreement needs a distinct resolution process, not automatic adoption of the model’s choice.

## Inspect failures at the evidence level

Compare the model proposal with reviewed responses and list error types supported by the examples. U1 suggests the model failed to apply the polite-action rule in that record. It does not establish a dataset-wide error rate or prove the same model will miss every polite request. Keep conclusions bounded to the checked records.

A mismatch can come from a model error, an unclear rule, altered text or a wrong record mapping. Check the raw text and versions before changing the prompt. If U1’s response was accidentally attached to U2, a better prompt will not repair the ledger. Correct the mapping while preserving the original erroneous association in the audit note.

[Argilla's annotation guide](https://docs.argilla.io/latest/how_to_guides/annotate/) describes suggestions that annotators can change and submit. Regardless of surface, compare the stored records with the intended separation between model proposal and human response. If the selected export collapses them, preserve a companion ledger rather than mislabeling the result as independently reviewed.

## Resolve gaps and export accepted records

Use the [annotation adjudication workflow](/guides/data/adjudicate-ai-assisted-text-labels) for disputed or rule-ambiguous rows. Keep unresolved records out of the accepted training export unless the owner’s supplied task explicitly defines a permitted unresolved label and use. Do not treat agreement with a model as a substitute for the acceptance policy.

Use [check-annotation-batch](/commands/review/check-annotation-batch) only with its exact local input schema. Its structural and ledger checks cannot establish that reviewers read the text independently or that a label is substantively correct. Keep its result separate from the evidence review and owner decision.

Deliver the raw inventory version, task specification, suggestion provenance, human responses, resolution ledger, accepted export version and omitted-record list. The owner should approve the accepted subset and its intended use before training or publication. For U1, the handoff should still show statement as the original AI proposal and request as the reviewed value. That preserved difference is the evidence that review corrected the example.
