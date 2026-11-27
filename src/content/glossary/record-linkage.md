---
term: Record Linkage
description: Record linkage is the task of finding records in different datasets that refer to the same real-world entity when they share no reliable common key.
date: '2026-09-17'
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
- record-linkage
featured: false
related:
- guide:link-records-across-datasets
- glossary:entity-resolution
- glossary:blocking-record-matching
- tool:dedupe
summary: Record linkage finds records in two or more datasets that describe the same person, place or thing when there is no shared ID. Methods run from exact rules to probabilistic scoring (Fellegi-Sunter) and embedding or LLM matchers. The output is a crosswalk of linked keys, not a merged table.
faq:
  - q: "What is the difference between deterministic and probabilistic record linkage?"
    a: "Deterministic linkage accepts a pair only when chosen fields agree under fixed rules, such as an exact match on normalised email. Probabilistic linkage scores each pair by how much evidence each field's agreement or disagreement carries, then accepts, rejects or sends the pair to review based on thresholds."
  - q: "How is record linkage different from a SQL join?"
    a: "A join assumes you already know which keys correspond. Record linkage is the earlier step that works out the correspondence. Joining on unreviewed links can multiply rows or attach activity to the wrong entity while the query runs without error."
  - q: "Do I need an LLM for record linkage?"
    a: "Usually not for the whole job. Rules and probabilistic scoring handle the bulk of pairs cheaply. LLM or embedding matchers earn their cost on the ambiguous middle band, where fields are free text, abbreviated or in different languages."
---

**Record linkage is the task of identifying records in two or more datasets that refer to the same real-world entity when the datasets do not share a reliable unique key.** A CRM and a billing system both hold "customers", but one keys them by email and the other by account number; linkage works out which rows belong together.

The term dates to Halbert Dunn's 1946 article "Record Linkage" in the *American Journal of Public Health*. Its statistical basis is Ivan Fellegi and Alan Sunter's 1969 paper "A Theory for Record Linkage", which still underlies most probabilistic tools.

## How it works

1. **Standardise.** Normalise case, whitespace, date formats, phone formats and address abbreviations in a copy of the fields, keeping the originals.
2. **Block.** Comparing every record with every other is quadratic, so [blocking](/glossary/blocking-record-matching) limits comparisons to pairs that share something cheap, such as postcode or the first letters of a surname.
3. **Compare.** For each candidate pair, compare field by field: exact, fuzzy (edit distance, Jaro-Winkler) or numeric tolerance.
4. **Classify.** Decide match, non-match or possible match.
5. **Review and record.** A person resolves the possible matches; accepted links go into a crosswalk.

Step 4 is where the two classic methods differ:

| | Deterministic | Probabilistic (Fellegi-Sunter) |
|---|---|---|
| Decision | Fixed rules: fields must agree | Summed match weights against two thresholds |
| Per-field evidence | All-or-nothing | *m* = chance the field agrees for true matches; *u* = chance it agrees for non-matches |
| Strength | Transparent, fast, easy to audit | Tolerates typos and missing values; rare values count more |
| Weakness | Misses matches with any dirty field | Needs parameter estimation and threshold tuning |

Agreement on a field with a high *m* and a low *u* (a date of birth) adds a lot of weight; agreement on a field many records share (a city) adds little. Pairs between the upper and lower thresholds are the review queue.

## Where AI comes in

- **Embeddings for candidate generation.** Embedding names or descriptions and retrieving nearest neighbours finds candidates that share no token, such as "Intl Business Machines" and "IBM Corp".
- **LLMs as pairwise matchers.** Given two records and a written definition of "same entity", an LLM can judge pairs that defeat string metrics. It is slow and costly per pair, so it belongs on the uncertain band after blocking, not on the full cross product.
- **Learned classifiers.** Libraries such as [Dedupe](/tools/dedupe) learn field weights from pairs a person labels, and open-source [Splink](https://moj-analytical-services.github.io/splink/) implements the Fellegi-Sunter model at scale.

None of these remove the need for a labelled sample to measure precision (how many accepted links are right) and recall (how many true links were found).

## Example

An events team has a venue roster keyed `A17` ("North Hall, 10 Oak Road") and a booking system keyed `B04` ("N Hall, 10 Oak Rd") and `B09` ("North Hall Annex, 10 Oak Road"). Blocking on postcode surfaces both pairs. Address agrees for both; name is a close match for B04 and a partial match for B09. The crosswalk records `roster:A17 = bookings:B04` as accepted with the evidence, and leaves `A17 / B09` unresolved for whoever knows whether the annex is booked separately. Both source keys stay in the crosswalk so a wrong link can be undone.

## Record linkage vs entity resolution

Record linkage is specifically about connecting records **across** sources, and its product is pairwise links. [Entity resolution](/glossary/entity-resolution) is the broader problem: it also covers duplicates **within** one dataset, clustering linked records into entities, and maintaining a canonical record over time. In practice the terms are often used interchangeably, and the matching techniques are the same. The [cross-source linkage guide](/guides/analytics/link-records-across-datasets) covers the review workflow, including record grain and allowed cardinality.
