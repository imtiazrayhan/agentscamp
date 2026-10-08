---
description: Separate duplicate-record candidate generation from human match decisions, retaining source keys
  and field evidence before any merge.
date: '2026-08-17'
reviewed: '2026-10-07'
topics:
- ai-at-work
- workflow-prompting
audience:
- analysts
- founders
tags:
- entity-matching
- ai-duplicate-record-review
featured: false
related:
- guide:link-records-across-datasets
- tool:tamr
- glossary:entity-resolution
- glossary:blocking-record-matching
- skill:entity-match-candidate-ledger
- command:check-entity-match-ledger
summary: Separate duplicate-record candidate generation from human match decisions, retaining source keys and
  field evidence before any merge.
title: Review AI Duplicate-Record Candidates Before Merging
depth: standard
sources:
- title: About Tamr Cloud
  url: https://cloud.docs.tamr.com/docs/welcome-to-tamr
  publisher: Tamr
- title: Dedupe Documentation
  url: https://docs.dedupe.io/en/latest/
  publisher: Dedupe
- title: Making Smart Comparisons
  url: https://docs.dedupe.io/en/latest/how-it-works/Making-smart-comparisons.html
  publisher: Dedupe
seoDescription: Separate duplicate-record candidate generation from human match decisions, retaining source
  keys and field evidence before any merge.
keyTakeaways:
- Freeze source versions and preserve original keys before normalizing comparison fields.
- Treat similarity scores as review priority; record match, different, or unresolved with human evidence.
- Check connected groups for contradictory pair decisions before proposing reversible merges.
faq:
- q: Can a high candidate score justify merging two rows?
  a: No. Review the original field evidence and conflicts, then record an authorized human identity decision.
    Keep the merge proposal separate from the candidate ledger.
---

Two records can look alike without describing the same thing. Before asking AI to tidy a roster, decide what a row represents and who can confirm that two rows refer to one entity. The useful output is a candidate ledger with evidence and decisions, followed by a separate merge proposal. A cleaned spreadsheet alone loses the reasoning you need when a merge is challenged.

This workflow covers duplicates within a bounded collection. For correspondence between separate systems, use [cross-source record linkage](/guides/analytics/link-records-across-datasets). Both require identity decisions, but the latter also needs an explicit relationship between two key namespaces.

## Define the entity before comparing names

Write a sentence such as: “One entity is one bookable physical venue, including its current name and address.” Clarify whether a room, building, business operator, or location counts as its own entity. If the source owner cannot answer, stop at inventorying possible duplicates. Similarity cannot settle the business definition.

Create an immutable working snapshot. Register the source name, export date or version, original record key, and location of the untouched file. Give every candidate a stable reference to that snapshot. A spreadsheet row number is insufficient if sorting or a fresh export changes it.

List the available identity evidence. For venues, that might include an owner-confirmed venue identifier, street address, public phone number, and the dates those fields were last checked. State which fields are weak: a booking email may serve a whole organization; a name may change. Missing evidence means unknown, not disagreement.

[Entity resolution](/glossary/entity-resolution) is the broader identity problem. In this review, the source owner supplies the entity definition and accepts responsibility for match decisions. AI can organize observations without becoming that authority.

## Preserve original fields beside comparison fields

Normalize copies of fields for comparison. Record each rule: trim surrounding whitespace, use a consistent case for comparison, or separate an address into approved components. Keep the raw value beside the derived value. Do not quietly remove “Annex,” apartment numbers, or other tokens that might distinguish separate places.

Build a small comparison set before processing the whole roster. Include obvious duplicates, obvious different entities, and ambiguous cases selected by the owner. It is more useful to discover that a rule erases meaningful distinctions here than after hundreds of proposals have inherited it.

[Blocking](/glossary/blocking-record-matching) narrows which records become candidate pairs. [Dedupe’s comparison documentation](https://docs.dedupe.io/en/latest/how-it-works/Making-smart-comparisons.html) describes selecting comparisons through shared features. Keep your blocking rules explicit and test known pairs that lack a feature, such as a missing postcode. Being excluded from comparison is not evidence that a record is unique.

## Generate candidates without changing the roster

Ask for a bounded set of pairs with both original keys, the fields that prompted comparison, the normalization version, and any candidate score. A score orders the review queue; it does not prove identity. Keep pairs with conflicts visible even when other fields are strongly similar.

The [entity match candidate ledger](/skills/analytics/entity-match-candidate-ledger) provides a structured way to prepare this packet. Review its proposed evidence against the actual source rows. Do not accept a field value merely because it appears in the generated explanation.

A managed platform such as [Tamr](/tools/tamr) can be considered for ongoing curation. Its [documentation](https://cloud.docs.tamr.com/docs/welcome-to-tamr) describes persistent entity IDs and human curation. Regardless of the candidate-generation tool, preserve your own review boundary: no source write or merge is part of this pass.

## Worked example: three fictional venue records

The following records are invented to demonstrate review; they are not a product test.

| Record key | Raw name | Address | Phone | Other evidence |
| --- | --- | --- | --- | --- |
| V17 | North Hall | 14 Pine Street | 555-0140 | Main hall booking page |
| V42 | N Hall | 14 Pine Street | 555-0140 | Legacy roster entry |
| V63 | North Hall Annex | 16 Pine Street | 555-0140 | Annex entrance noted |

V17/V42 is a plausible match candidate. The name abbreviation, address, and phone are supporting observations. The reviewer still asks the venue owner whether the legacy entry refers to the same bookable space. Until that answer exists, its state remains unresolved.

V17/V63 shares a phone but differs in address and name. The draft must preserve those differences. A poor normalization rule that drops “Annex” would conceal the most useful question. Correct the rule, regenerate affected comparisons, and keep the earlier ledger version for explanation.

Suppose the owner confirms V17/V42 as the same venue and says the annex is separately bookable. Record the decision with the owner’s reference, reviewer identity, time, and approved rule version. Mark the first pair match and the second different. Do not substitute a generic “high confidence” note for that provenance.

## Review groups as well as pairs

Pair decisions can contradict one another. If A matches B and B matches C, but A is marked different from C, the proposed group cannot be handed off unchanged. Review the connected group, identify the conflicting evidence, and return it for a documented resolution. Never erase the inconvenient pair to make the group look consistent.

Run [Check Entity Match Ledger](/commands/review/check-entity-match-ledger) on the supported local packet. A structural pass can help detect ledger inconsistencies; it cannot establish whether the hall records represent one venue. Keep that limit attached to the result.

## Hand off a reversible proposal

Produce a review packet with source versions, original keys, normalization and candidate-generation settings, field evidence, decision states, reviewer provenance, unresolved cases, and group conflicts. For accepted matches, propose a retained entity key and a field-by-field survivor rule. Explain what happens to each source key and how the proposal can be reversed.

Have the owner approve the proposal before another workflow applies it. Then compare counts and spot-check affected records after implementation. If a field conflict remains unresolved, keep both values with their sources or postpone the merge. Finishing the review means the decisions are inspectable; it does not require forcing every candidate into a match or nonmatch.
