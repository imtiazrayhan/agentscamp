---
description: Understand the identity question behind similar records, including false merges, missed matches
  and the source owner’s unresolved decisions.
date: '2026-09-12'
reviewed: '2026-10-07'
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
summary: Use a fictional hall roster to separate candidate similarity from accepted identity while preserving
  source keys and human decision evidence.
term: Entity Resolution
seoDescription: Understand entity resolution through a fictional venue roster, explicit identity decisions
  and inspectable unresolved candidates.
---

Entity resolution decides which records describe the same entity. A source row and its real-world referent remain distinct. For review, keep the source row, identity question and owner decision in separate ledger fields.

Consider an invented roster containing “North Hall,” “N Hall,” and “North Hall Annex.” A shared phone number makes them worth comparing. It does not establish that all three are the same bookable space. The entity definition and the source owner’s evidence determine whether the annex belongs in the group.

The [duplicate-record review workflow](/guides/analytics/ai-duplicate-record-review) keeps source keys, comparison fields, conflicts, and human decisions visible. A false merge collapses different entities; a missed match leaves one entity represented more than once. These errors have different consequences, so the owner should choose the review policy explicitly.

AI candidate scores can order work without becoming proof of identity. Preserve match, different, and unresolved states, with the reviewer and decision reference. An unresolved pair is a useful result when the available evidence cannot support a decision.

[Record linkage](/glossary/record-linkage) applies correspondence across sources whose keys differ. Entity resolution can also involve duplicates within one collection and the maintenance of an entity record over time. [Tamr](/tools/tamr) is one platform to evaluate for continuing curation; the process still needs a clear entity definition and accountable owner.
