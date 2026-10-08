---
description: Understand the reviewable crosswalk needed before joining sources with unrelated keys, ambiguous
  candidates and explicit cardinality policies.
date: '2026-09-17'
reviewed: '2026-10-07'
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
- tool:dedupe
summary: Keep both source namespaces visible while deciding whether a venue roster record corresponds to an
  event-system record.
term: Record Linkage
seoDescription: Understand record linkage through a cross-source venue example with preserved keys, unresolved
  partners and downstream join checks.
---

Record linkage establishes identity correspondence between records from separate datasets. Its useful output is a crosswalk that keeps both source identifiers and the evidence for each accepted relationship.

In a fictional venue example, roster key A17 and event-system key B04 may describe the same hall. Retain `roster:A17` and `events:B04` instead of replacing both with an unexplained name. If B09 shares the booking email but refers to an annex, that extra candidate remains visible until the owner resolves it.

An ordinary exact join uses an already trusted relationship between keys. Linkage is the earlier decision about whether those keys correspond at all. Applying a join to unreviewed candidates can multiply rows or attach activity to the wrong entity even when the SQL runs successfully.

The [cross-source linkage workflow](/guides/analytics/link-records-across-datasets) starts by defining record grain and permitted cardinality. A one-to-many relationship can be legitimate when one source contains historical identifiers. It can also reveal an ambiguous match. The policy and evidence determine which interpretation is allowed.

[Entity resolution](/glossary/entity-resolution) is the broader identity problem. [Dedupe](/tools/dedupe) is one library to evaluate for candidate generation. Whatever tool you choose, separate accepted links, unresolved candidates, and unmatched records. Record the human approval, source versions, and subsequent join checks so corrections can be traced to the crosswalk version that produced them.
