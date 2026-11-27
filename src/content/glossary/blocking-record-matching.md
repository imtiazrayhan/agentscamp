---
description: Blocking is the record-matching step that picks candidate pairs by shared features, so only those pairs
  are compared. It narrows work without deciding identity.
date: '2026-09-01'
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
- blocking-record-matching
featured: false
related:
- guide:ai-duplicate-record-review
- guide:link-records-across-datasets
- tool:dedupe
summary: A fictional postcode rule illustrates why absence from a comparison queue cannot establish that two
  hall records are different.
term: Blocking in Record Matching
seoDescription: Blocking selects candidate record pairs by shared features before comparison. A missing-postcode
  example shows how a rule can miss known matches.
---

Blocking selects candidate pairs through shared features, narrowing comparisons without deciding identity. A postcode rule is one possible example.

Suppose a fictional hall roster compares names only within the same postcode. “North Hall” and “N Hall” enter the queue when both have that postcode. If one record lacks it, the pair may never be compared. That omission means the rule did not retrieve the pair, not that the halls are different.

[Dedupe](/tools/dedupe) describes shared-feature comparison in its [blocking explanation](https://docs.dedupe.io/en/latest/how-it-works/Making-smart-comparisons.html). For your workflow, record the actual rules and their versions. Test them against owner-confirmed matching pairs, including cases with missing or changed fields. Consider an alternative block when a useful field is absent, then inspect the additional candidates rather than accepting them automatically.

The [duplicate-record review workflow](/guides/analytics/ai-duplicate-record-review) preserves why each pair entered the review queue. That evidence helps distinguish candidate-coverage problems from mistaken match decisions.

For [cross-source linkage](/guides/analytics/link-records-across-datasets), also keep each source’s namespace and grain. Shared attributes may be common across several locations or accounts. Passing a blocking rule earns a comparison, not an identity decision or permission to join the records.

Report missed known pairs separately from disputed identity decisions. The first suggests a retrieval rule needs review; the second needs source evidence and a named owner to resolve the relationship.
