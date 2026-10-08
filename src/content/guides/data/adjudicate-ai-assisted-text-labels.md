---
description: "Resolve disputed text labels by preserving each response, source excerpt and task-rule version rather than accepting the model or majority automatically."
date: "2026-10-01"
reviewed: "2026-10-07"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["ai-engineers", "analysts"]
tags: ["text-annotation", "adjudicate-ai-assisted-text-labels"]
featured: false
related: ["guide:ai-text-dataset-prelabeling", "tool:argilla", "skill:annotation-disagreement-ledger", "agent:annotation-evidence-reviewer"]
summary: "Resolve disputed text labels by preserving each response, source excerpt and task-rule version rather than accepting the model or majority automatically."
title: "Adjudicate AI-Assisted Text Labels with an Evidence Ledger"
depth: "standard"
sources: [{"title": "Annotate datasets", "url": "https://docs.argilla.io/latest/how_to_guides/annotate/", "publisher": "Argilla"}, {"title": "Integrate Label Studio into your ML pipeline", "url": "https://labelstud.io/guide/ml.html", "publisher": "HumanSignal"}, {"title": "Argilla Repository", "url": "https://github.com/argilla-io/argilla", "publisher": "Argilla"}]
seoDescription: "Resolve disputed text labels by preserving each response, source excerpt and task-rule version rather than accepting the model or majority automatically."
keyTakeaways: ["Preserve original response IDs, exact text and the rule version before deciding a dispute.", "Leave missing-rule cases unresolved; a majority or model suggestion cannot define the task.", "When guidelines change, recheck affected accepted rows and export from a documented decision version."]
faq: [{"q": "Can a majority vote resolve an ambiguous annotation rule?", "a": "A vote can be evidence about reviewer interpretations, but it cannot supply a rule the owner has not defined. Keep the case unresolved until the owner clarifies the rule, then record a new decision under the approved version."}]
---

Adjudication turns a labeling dispute into a documented owner decision, or a documented unresolved case. Its purpose is to preserve the original responses and explain which text and task rule support the accepted label. A majority, a model suggestion or an authoritative tone cannot fill a missing rule.

Use this workflow for a supervised text task with owner-approved labels. It does not synthesize customer-feedback themes or score an AI answer against a broad quality rubric. The starting point is a fixed record, a task-rule version and independently collected annotation responses. Keep any model proposal separate, as described in the [prelabeling workflow](/guides/data/ai-text-dataset-prelabeling).

## Register the disputed rows

Create a disagreement ledger with record ID, exact raw text, source version, response IDs, reviewer references, labels, cited evidence, task-rule version and model-suggestion reference if present. Preserve agreeing as well as disagreeing responses. Never collapse them into a single “annotators said” field that loses who submitted which value under which rules.

Define how the owner discovers a dispute. For a single-label task, different submitted permitted labels are a straightforward trigger. Missing responses, different task versions or skipped records need separate statuses. Two identical labels do not establish that the reviewers were independent or followed the same source version.

The [annotation disagreement ledger](/skills/data/annotation-disagreement-ledger) can organize the supplied packet and flag absent evidence. Its output is a proposal for the adjudicator, not an accepted label. Keep original response records read-only; corrections should appear as new records or explicit superseding entries.

## Work through a rule gap

This example is fictional. The task offers request and statement. Record U2 reads “Would you export this?” One reviewer submits request because it asks the addressee to perform an action. Another submits statement because the examples they received cover explicit imperatives and assertions but do not explain question phrasing.

| Ledger field | Recorded value |
| --- | --- |
| Raw record | U2: Would you export this? |
| Response R7 | request; evidence: “Would you” and “export” |
| Response R8 | statement; evidence: no question-form rule in supplied task examples |
| Task version | v1 |
| Model suggestion | request; preserved separately |
| Initial decision | unresolved pending owner clarification |

Do not label the second reviewer wrong simply because the first interpretation sounds natural. First inspect the actual v1 rule. If it explicitly includes action-request questions, the adjudicator can cite that rule and the text when selecting request. If question forms are outside or absent from the specification, keep U2 unresolved and ask the task owner to clarify scope.

In the gap case, even three request votes would not add a missing rule to v1. The model’s request suggestion is another proposal, not the tie-breaker. Record whether the issue is an interpretation gap under a clear rule, a rule ambiguity, missing evidence or a version mismatch. Those categories lead to different corrections.

## Record the adjudicator’s reasoning

For each decision, store decision ID, adjudicator reference, original response IDs, exact evidence, applicable rule ID and version, accepted label or unresolved status, reason and decision date. Include an owner acceptance field when the task requires one. A label without its rule reference is difficult to revisit after a guideline change.

Quote only the necessary text from your own supplied record, such as “Would you” and “export.” Do not replace it with a paraphrase that hides the form reviewers disputed. Avoid inferred intent beyond the task rule. The accepted value should express the annotation decision, not a claim that the speaker definitely wanted a particular real-world outcome.

Use the [annotation evidence reviewer](/agents/analytics/annotation-evidence-reviewer) to inspect the completeness and consistency of a supplied ledger. It can identify missing rule references or an accepted row with an unresolved status, but it cannot establish independent human review from response IDs alone. The named owner retains the decision about accepted labels and guideline changes.

## Manage a rule revision

Suppose the owner approves v2, explicitly defining action-request questions as request. Preserve v1, the original responses and U2’s unresolved decision. Add a new adjudication under v2 selecting request with the exact text evidence and the new rule reference. Do not retroactively rewrite R7 and R8 as though they were both submitted under v2.

Identify previously reviewed rows that the changed rule could affect. Search the supplied ledger for question-form cases and record the affected set for re-review. If your selection method is incomplete, state that limit and keep the owner’s broader review decision visible. A rule change can affect accepted records too; checking only the originally disputed queue may miss inconsistent older labels.

Export from a named rule and decision version. Keep unresolved rows in an omitted-record list, with the reason and the next owner action. The accepted export should not mix v1 and v2 decisions silently. If the owner permits mixed versions for a specific use, document that explicit policy and its implications instead of claiming uniform labeling.

## Evaluate the annotation surface

[Label Studio's ML guide](https://labelstud.io/guide/ml.html) describes model preannotations for review. [Argilla's annotation guide](https://docs.argilla.io/latest/how_to_guides/annotate/) describes editable suggestions, guidelines, statuses and filters. Evaluate whether your chosen version retains the response and decision records required here; do not infer an adjudication workflow from the presence of suggestions alone.

The [Argilla profile](/tools/argilla) includes a proposed retention test. Its [official repository](https://github.com/argilla-io/argilla) states that no new features are planned while bug fixes and patches continue. That maintenance limit matters when deciding whether a missing review capability should be solved by an existing version, a companion ledger or another workflow.

## Approve a bounded export

Deliver the task versions, raw records, unchanged human responses, preserved suggestions, adjudication decisions, affected-row rechecks, accepted export and unresolved list. The owner should be able to trace every accepted label back to its evidence and rule, including why U2 stayed unresolved under v1 and changed under v2.

A structurally complete ledger supports traceability. It does not prove every semantic label is correct or that the dataset represents the intended population. State what was reviewed, which rules were applied and which records remain unresolved. That makes the export usable without concealing the decisions still needed.
