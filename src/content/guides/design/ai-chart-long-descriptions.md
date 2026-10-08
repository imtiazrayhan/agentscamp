---
description: Review a chart-description draft against the frozen source table, actual visual observations and
  its implemented page placement.
date: '2026-08-30'
reviewed: '2026-10-07'
topics:
- ai-at-work
- workflow-prompting
audience:
- designers
- analysts
- developers
tags:
- image-descriptions
- ai-chart-long-descriptions
featured: false
related:
- guide:ai-alt-text-context-review
- glossary:alternative-text
- skill:chart-chooser
- agent:image-description-reviewer
- tool:be-my-eyes
summary: Use a fictional planned-versus-held chart to review values, labels, source disagreements and the final
  page implementation.
title: Draft AI Chart Long Descriptions from Verified Data
depth: standard
sources:
- title: Complex Images
  url: https://www.w3.org/WAI/tutorials/images/complex/
  publisher: W3C WAI
- title: An alt Decision Tree
  url: https://www.w3.org/WAI/tutorials/images/decision-tree/
  publisher: W3C WAI
- title: How do I use Be My AI?
  url: https://support.bemyeyes.com/hc/en-us/articles/18133134809105-How-do-I-use-Be-My-AI
  publisher: Be My Eyes
seoDescription: Review AI chart-description drafts against source values, inspected labels, unresolved disagreements
  and the actual page implementation.
keyTakeaways:
- Freeze the chart and its original table together, and inspect displayed axes, units, labels, and annotations.
- Draft values and relationships from verified evidence; preserve chart/table conflicts and unavailable values.
- Inspect the approved description’s page placement and reading order after editing.
faq:
- q: What if the chart image is available but the original data is missing?
  a: State that exact values are unavailable. Use only observations that actual inspection supports, preserve
    uncertainty, and ask the chart owner for source data before presenting numerical claims as verified.
---

AI can organize verified values and observations into prose, but it must not estimate exact numbers from inaccessible pixels or turn a visual trend into an unsupported causal claim. Begin with the chart’s source table and the actual displayed version.

This workflow describes an existing chart. If you are still choosing its visual form, use [Chart Chooser](/skills/analytics/chart-chooser) first. For still-image wording, use [alt-text review in page context](/guides/design/ai-alt-text-context-review).

## Register the chart and source table together

Record the chart’s title, asset version, page placement, date range, and source table reference. Freeze the table used to generate that version. Do not combine an old screenshot with a current spreadsheet merely because their headings match.

Ask the chart owner to state its intended message without adding a conclusion to the data. “Compare planned and held workshop sessions this quarter” gives a bounded purpose. “Prove the program exceeded expectations” supplies an interpretation that the values may not support.

Have a person inspect the chart, or use actually supported vision and document what it could establish. Capture axes, units, categories, series names, legends, annotations, and any visible exceptions. If inspection is unavailable, draft from the verified table only and mark the chart’s visual correspondence as untested. A file-reading tool cannot see a chart embedded in an inaccessible image.

## Plan short identification and fuller information

[W3C’s complex-image guidance](https://www.w3.org/WAI/tutorials/images/complex/) pairs short identification with an associated long description. Decide where readers will find that fuller account and how the page associates it with the chart.

Use the short alternative to identify the chart and direct readers to the fuller description. The owner must review the implemented relationship, not just the proposed sentence.

[Alternative text](/glossary/alternative-text) serves a specific use. [W3C’s decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/) makes image purpose central to choosing the alternative. Record what a reader should learn here, then select which values and relationships are needed for that purpose.

## Draft from verified values and observations

Prepare a packet with the source table, definitions, inspected labels, units, date range, and purpose. Require AI to distinguish direct values, simple calculations that were checked, and interpretations proposed for owner review. Keep missing values as unknown. “Not supplied” is preferable to a smooth sentence with an invented number.

Give each factual claim a source reference. A reference can identify the table row and column or the inspector’s observation number. This makes reviewing the prose a comparison task instead of a guessing exercise. If a calculation is necessary, compute and check it separately before it enters the description.

Avoid decorative language that obscures the relationships. “A striking upward trajectory” is less useful than the actual categories and values. Do not add reasons for differences unless the source packet supplies evidence for them and the owner approves the interpretation.

## Worked example: fictional workshop sessions

The following table and chart notes are invented for teaching, not observed product output.

| Measure | Value | Unit | Definition |
| --- | --- | --- | --- |
| Planned | 8 | Sessions | Sessions scheduled for the quarter |
| Held | 6 | Sessions | Sessions completed during the quarter |

The fictional inspector records two bars labeled “Planned” and “Held,” a vertical axis labeled “Sessions,” and the quarter in the title. A proposed short alternative is “Workshop sessions planned and held this quarter; values are described below.”

A fuller description might read: “The chart compares sessions scheduled with sessions completed this quarter. Eight sessions were planned and six were held, according to the workshop tracking table. Held sessions are two fewer than planned.” The values and the subtraction can be checked against the supplied table. No reason for the difference is implied.

A draft saying “The workshop delivered eight sessions” confuses the planned series with completed work. Correct it to six held sessions and record the error type. A draft saying “Low interest caused two cancellations” invents both a cause and a cancellation event. Remove it unless the owner supplies separate evidence.

If the chart itself labels the second bar “Delivered” while the table says “Held,” ask the owner whether those terms are equivalent. If a bar displays seven while the table contains six, preserve the conflict and pause approval. Do not choose whichever source makes the prose easier to finish.

## Handle incomplete and conflicting evidence

When the original table is unavailable, state that limitation. An inspector may establish labels and broad visible relationships while being unable to recover exact values. Keep those two evidence levels separate; do not present estimated bar heights as measured data.

[Be My Eyes](/tools/be-my-eyes) may support personal exploration of a pictured chart. Its [Be My AI help page](https://support.bemyeyes.com/hc/en-us/articles/18133134809105-How-do-I-use-Be-My-AI) describes picture descriptions and follow-up questions. Verify numerical statements against source data before including them in a publisher’s text equivalent. Personal assistance is not an audit of your page.

The [image description reviewer](/agents/design/image-description-reviewer) can compare the supplied packet with a draft, flag mismatches, and identify missing references. The chart owner resolves source disagreements and approves which version is authoritative.

## Check the description in the actual page

Review the chart, short alternative, long description, source attribution, and reading order together. Confirm that readers can find the associated description and that its labels match the displayed version. A visually nearby paragraph is not automatically an understandable association in the page’s implementation.

Hand off the chart and table versions, inspected observations, claim references, unresolved conflicts, final prose, reviewer, and owner decision. Recheck after a data update or redesigned legend. Completion means a supported text equivalent for this chart and placement, with the remaining limits visible; it is not a whole-site conformance certificate.
