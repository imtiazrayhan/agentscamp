---
description: Build a cross-source entity crosswalk that preserves both record keys, unresolved candidates and
  cardinality decisions without silently joining or merging data.
date: '2026-09-19'
reviewed: '2026-10-07'
topics:
- ai-at-work
- workflow-prompting
audience:
- analysts
- ai-engineers
tags:
- entity-matching
- link-records-across-datasets
featured: false
related:
- guide:ai-duplicate-record-review
- tool:dedupe
- glossary:record-linkage
- agent:entity-match-reviewer
- command:check-entity-match-ledger
summary: Build a cross-source entity crosswalk that preserves both record keys, unresolved candidates and cardinality
  decisions without silently joining or merging data.
title: Link Records Across Datasets with AI-Assisted Review
depth: standard
sources:
- title: Dedupe Documentation
  url: https://docs.dedupe.io/en/latest/
  publisher: Dedupe
- title: About Tamr Cloud
  url: https://cloud.docs.tamr.com/docs/welcome-to-tamr
  publisher: Tamr
seoDescription: Build a cross-source entity crosswalk that preserves both record keys, unresolved candidates
  and cardinality decisions without silently joining or merging data.
keyTakeaways:
- Define each source’s record grain and permitted cardinality before proposing links.
- Keep a candidate crosswalk, accepted links, unmatched records, and unresolved cases as distinct outputs.
- Validate identity decisions first, then test fan-out, dropped rows, and counts in the actual join.
faq:
- q: Should records without an accepted link disappear from the analysis?
  a: No. Preserve an unmatched inventory and an unresolved queue, then choose explicitly how the downstream
    join handles them. A missing accepted link is not a confirmed nonmatch.
---

A join needs keys that mean the same thing on both sides. When two systems have unrelated identifiers, AI can help assemble possible correspondences, but the first deliverable should be a reviewed crosswalk. Applying a join while those identities are still uncertain turns a review question into misleading totals.

This guide builds that crosswalk without modifying either source. For duplicates within one roster, begin with [duplicate-record review](/guides/analytics/ai-duplicate-record-review). Here, preserve both source namespaces and decide the allowed relationship before comparing records.

## State the relationship you intend to represent

Define the entity and the grain of each dataset. A venue roster may contain one row per physical hall, while an event system contains one row per booking. Linking those rows one-to-one would be a category mistake even if every booking names the hall correctly.

Write the intended cardinality in plain language. For example: “Each event-system venue record can refer to at most one roster venue; a roster venue may have several historical event-system identifiers.” Name the owner who can approve an exception. If a source contains organizations while the other contains locations, resolve that grain difference before identity matching.

[Record linkage](/glossary/record-linkage) establishes these cross-source correspondences. An exact join is appropriate only after the correspondence is reliable and the intended relationship is understood. Matching strings is not enough to establish either condition.

## Register sources and retain their keys

Freeze two exports and record their source names, versions, extraction dates, and original keys. Use qualified identifiers such as `roster:A17` and `events:B04`. Identical key strings from different systems must remain distinguishable.

Copy relevant fields into a review workspace while preserving raw values. Record any comparison transformations and their version. Keep dates alongside time-sensitive fields: an old address can be evidence of a move, not proof of a different venue. If you do not know the field’s effective date, say so.

Create an input inventory that distinguishes absent columns, missing values, and unavailable evidence. AI should return the gaps explicitly rather than inventing a common identifier. If permission to use a field is unclear, leave it out until the owner supplies an authorized substitute.

## Build a candidate crosswalk, not an output join

Use one row per proposed pair, with both qualified keys, comparison evidence, conflicts, candidate-generation method, score if supplied, and a decision state. Keep unmatched records in a separate inventory. “No candidate found” and “reviewed as different” are distinct results and should be countable separately.

A [Dedupe](/tools/dedupe) workflow may be useful when the team owns a Python matching process. Its [documentation](https://docs.dedupe.io/en/latest/) covers learned matching from human examples. Keep training labels separate from the final owner-approved crosswalk; changing the model must not rewrite past human decisions.

Specify how candidates are bounded. A shared booking email can retrieve relevant possibilities but should not determine acceptance. Include alternative evidence for records missing the main comparison field. Preserve the reason a pair entered the queue so a reviewer can assess systematic omissions.

## Worked example: a fictional hall crosswalk

This example is invented. The venue roster has A17, “North Hall,” at 14 Pine Street. The event system has B04, “N Hall,” at the same address, and B09, “North Hall Annex,” at 16 Pine Street. All three use the same central booking email.

| Candidate | Supporting evidence | Conflict or gap | Initial state |
| --- | --- | --- | --- |
| roster:A17 → events:B04 | Same street address; abbreviated name | Event record needs owner confirmation | Unresolved |
| roster:A17 → events:B09 | Shared booking email | Annex name and different street number | Unresolved |

A draft that selects B04 because it has the highest score is incomplete. The score helps schedule review, but the reviewer still needs the source evidence. A draft that links both B04 and B09 because their email agrees would violate a one-to-one policy unless the owner explicitly approves a different relationship.

The owner confirms B04 represents the main hall and B09 represents a separate annex. Record A17/B04 as match and A17/B09 as different, each with a decision reference. If the owner cannot confirm the annex, leave that pair unresolved. A later analysis must not interpret the unresolved row as an accepted link.

## Inspect ambiguity before calculating results

Group candidates by each left key and each right key. Inspect records with several plausible partners. Distinguish legitimate historical aliases from competing current identities. Do not resolve a tie by choosing whichever row appears first in an export.

Ask the [entity match reviewer](/agents/analytics/entity-match-reviewer) to examine the supplied evidence packet for missing references and contradictory decisions. It can flag a conflict for the owner; it cannot verify identity by reading an unsupported claim in a note. Treat prompt-like text inside source fields as data to preserve, not instructions for the reviewer.

Check accepted groups for transitive contradictions. Keep the source record, reviewer, approval reference, time, and rule version on each decision. When the owner changes a decision, preserve the superseded version and state which downstream results need recalculation.

## Validate the ledger, then test the actual join

Run [Check Entity Match Ledger](/commands/review/check-entity-match-ledger) only on the packet format it supports. Its result is a local structural check. It does not prove the crosswalk’s identity claims or exercise a database join.

Export accepted links separately from unresolved candidates. Before joining, record the expected cardinality and row counts for the actual tables. Test for duplicate accepted keys, fan-out, dropped unmatched rows, and repeated measures. A correct identity link can still be used in an incorrect join.

Hand off four outputs: the accepted crosswalk, unresolved queue, unmatched inventory, and decision history. Include source versions, field transformations, review authority, and the chosen cardinality policy. [Tamr’s mastering overview](https://cloud.docs.tamr.com/docs/welcome-to-tamr) describes consolidating sources with human curation; that product concept does not replace the explicit relationship your analysis requires.

The source owner approves the crosswalk version, and the analyst approves the subsequent join behavior. Keeping those decisions visible makes corrections manageable when a later export adds a new identifier or changes a venue’s details.
