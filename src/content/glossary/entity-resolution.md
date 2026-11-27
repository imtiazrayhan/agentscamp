---
term: Entity Resolution
description: Entity resolution is the process of deciding which records refer to the same real-world entity and grouping them, within one dataset or across several.
date: '2026-09-12'
updated: '2026-11-27'
reviewed: '2026-11-27'
topics:
- ai-at-work
- workflow-prompting
audience:
- analysts
- ai-engineers
tags:
- entity-matching
- entity-resolution
featured: false
related:
- guide:ai-duplicate-record-review
- tool:tamr
- glossary:record-linkage
- glossary:blocking-record-matching
summary: Entity resolution decides which records describe the same real-world person, company, place or product, then groups them into one entity. The pipeline is blocking, pairwise matching and clustering. Embeddings and LLMs help find and judge hard pairs, but a similarity score is not an identity decision.
faq:
  - q: "Is entity resolution the same as deduplication?"
    a: "Deduplication is entity resolution applied inside a single dataset. Entity resolution also covers linking across datasets, clustering matched records into entities and keeping a canonical record up to date as new data arrives."
  - q: "What is a false merge and why is it worse than a missed match?"
    a: "A false merge combines records of two different entities; a missed match leaves one entity split in two. Missed matches can be fixed later by merging. False merges mix histories, are hard to detect and hard to undo, so most teams set thresholds to avoid them first."
  - q: "How do you evaluate entity resolution?"
    a: "Label a sample of pairs by hand, then measure precision (share of predicted matches that are correct) and recall (share of true matches found). Sample from the uncertain score band as well as the confident ends, because that is where the errors are."
---

**Entity resolution (ER) is the process of deciding which records refer to the same real-world entity and grouping them together, whether the records sit in one dataset or several.** "Entity" means the thing in the world (a customer, a supplier, a venue); a record is only one system's description of it. ER also goes by entity matching, identity resolution and, inside one table, deduplication.

## How it works

Most systems run the same pipeline:

1. **Define the entity.** Is a hall and its annex one venue or two? Is a parent company the same entity as its subsidiary? Matching cannot be right until this is written down.
2. **Standardise** comparable fields in a copy, keeping original values.
3. **Block.** Use [blocking](/glossary/blocking-record-matching) to cut the all-pairs comparison down to plausible candidates.
4. **Score pairs.** Compare fields with string metrics, rules, a probabilistic model or a trained classifier to get match, non-match or uncertain.
5. **Cluster.** Turn pairwise decisions into groups. If A matches B and B matches C, all three form one entity, which is also how one bad link chains unrelated records together.
6. **Canonicalise.** Optionally build a "golden record" per cluster, choosing which source wins for each field, while keeping every source key.

## Where AI comes in

- **Embeddings** place records in a vector space so that candidates with different wording ("N Hall", "North Hall") land near each other. This improves blocking recall on messy text.
- **LLM matchers** read two records and a definition of sameness and return a judgment with a reason. They handle abbreviations, transliteration and free-text fields well, cost far more per pair than a string metric, and can be confidently wrong, so they suit the uncertain band.
- **Active learning** tools such as [Dedupe](/tools/dedupe) ask a person to label the pairs the model is least sure about, then learn from those labels. Mastering platforms such as [Tamr](/tools/tamr) pair matching with human curation, golden records and persistent IDs.

A model score orders the work. It does not settle identity: two units at the same address can score 0.95 and still be different entities under your definition.

## Example

A venue roster contains three rows:

| Key | Name | Phone |
|---|---|---|
| R1 | North Hall | 555-0100 |
| R2 | N Hall | 555-0100 |
| R3 | North Hall Annex | 555-0100 |

The shared phone number puts all three in one block. R1 and R2 score high on name and phone, and the owner confirms they are one hall entered twice: match. R1 and R3 share a phone because the annex uses the main desk, but the annex is booked separately: different. R2 and R3 must then also be different, or clustering would pull the annex into the hall's entity. The result is two entities, `{R1, R2}` and `{R3}`, with every decision and its reviewer recorded.

## Entity resolution vs record linkage

[Record linkage](/glossary/record-linkage) is the cross-source part of the problem: connecting records in dataset A to records in dataset B, with a crosswalk of key pairs as its output. Entity resolution is the wider term. It adds within-source duplicates, the clustering step that turns pairs into entities, and the upkeep of those entities over time. The matching methods (deterministic rules, Fellegi-Sunter scoring, learned models) are shared and are explained on the record linkage page.

The [duplicate-record review guide](/guides/analytics/ai-duplicate-record-review) shows a review workflow that keeps source keys, compared fields, conflicts and human decisions visible, with `match`, `different` and `unresolved` as explicit states.
