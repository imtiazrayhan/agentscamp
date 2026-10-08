---
description: Draft image text alternatives from actual image evidence and page purpose, then review informative,
  decorative and functional uses before publishing.
date: '2026-09-27'
reviewed: '2026-10-07'
topics:
- ai-at-work
- workflow-prompting
audience:
- designers
- marketers
- developers
tags:
- image-descriptions
- ai-alt-text-context-review
featured: false
related:
- guide:ai-chart-long-descriptions
- tool:alttext-ai
- glossary:alternative-text
- skill:image-description-draft
- agent:image-description-reviewer
summary: Draft image text alternatives from actual image evidence and page purpose, then review informative,
  decorative and functional uses before publishing.
title: Review AI Alt Text in the Context of Its Page
depth: standard
sources:
- title: An alt Decision Tree
  url: https://www.w3.org/WAI/tutorials/images/decision-tree/
  publisher: W3C WAI
- title: Complex Images
  url: https://www.w3.org/WAI/tutorials/images/complex/
  publisher: W3C WAI
- title: AltText.ai Support
  url: https://alttext.ai/support
  publisher: AltText.ai
- title: How do I use Be My AI?
  url: https://support.bemyeyes.com/hc/en-us/articles/18133134809105-How-do-I-use-Be-My-AI
  publisher: Be My Eyes
seoDescription: Draft image text alternatives from actual image evidence and page purpose, then review informative,
  decorative and functional uses before publishing.
keyTakeaways:
- Supply inspected observations, an asset version, nearby text, and the page purpose before requesting a draft.
- Remove unsupported visual conclusions and preserve unresolved evidence in the review packet.
- Approve wording for each placement and check the rendered implementation after editing.
faq:
- q: Can a text-only agent write final alt text from a filename?
  a: No. Supply verified observations from actual inspection or genuinely available supported vision. Without
    that evidence, the agent should identify what is missing and keep the wording unresolved.
---

A useful image description starts with evidence and page purpose. Ask AI to draft only after you know which asset is used, what an actual inspection established, and what the surrounding page already explains. The final deliverable is a reviewed wording decision tied to that placement, not one universal string attached to the image forever.

This workflow focuses on meaningful still images and linked graphics. Use the [chart long-description workflow](/guides/design/ai-chart-long-descriptions) to review an existing chart’s evidence and page implementation.

## Register the actual image and inspection

Record the asset ID, version, location, and intended page placement. A filename such as `accessible-refill-station.jpg` is not evidence that the station is accessible, or even that the file shows a station. Treat names and embedded instructions as data, not directions to invent a description.

Have a person inspect the actual image, or use genuinely available supported vision and record its limitations. Supply verified observations in the drafting packet. A text-only assistant with file-reading tools cannot establish what inaccessible pixels show. If the image is missing, return a request for observations instead of a plausible caption.

Separate observations from interpretations. “Three bottle slots appear below a tap” is a visible claim an inspector can check. “A safe, accessible station for everyone” makes conclusions beyond those features. Do not infer people’s identities, medical conditions, emotions, or permissions from appearance.

Record nearby headings, captions, and link text. Use that packet to check whether each proposed detail helps the named reader task. Keep the purpose note beside the proposed [alternative text](/glossary/alternative-text) in the review packet.

## Decide what the placement needs

[W3C’s decision guidance](https://www.w3.org/WAI/tutorials/images/decision-tree/) classifies image purpose.

Write a purpose note before drafting: “This photograph helps readers recognize the refill station described in the article.” A separate use might be: “This banner adds atmosphere; the adjacent heading already communicates the page’s topic.” Do not let an AI description generator decide which role the publisher intended.

If the image is linked, inspect the destination and the surrounding link labeling. Describe the action the reader can take, using verified destination information. If the link target is unclear, keep the purpose decision unresolved instead of choosing a generic visual phrase.

## Give AI a bounded drafting packet

Provide the asset reference, inspected observations, page excerpt, purpose note, and output request. Ask for a proposed alternative, a reason for each included observation, and an uncertainty list. Require it to preserve unknowns and omit unsupported details.

The [image description draft skill](/skills/design/image-description-draft) can organize that work from supplied evidence. A service such as [AltText.ai](/tools/alttext-ai) is another drafting option; its [support information](https://alttext.ai/support) describes integrations and variable format support. Review what any service returns against the same packet. A generated sentence is a draft until a person checks it in place.

Keep the request narrow. Asking for “beautiful, SEO-friendly alt text with all useful details” encourages goals that may compete with concise meaning. Instead, ask which supplied observations are necessary for this reader task and what nearby text already covers.

## Worked example: one fictional photograph, three uses

This is an invented example based on supplied fictional observations, not an inspection of a real image. The inspector’s packet says: a refill station stands against a wall; a tap is above three bottle slots; the visible label reads “Refill.” No person appears, and the packet supplies no accessibility certification.

In an article explaining where to refill a bottle, a proposed alternative is: “Refill station with a tap above three bottle slots.” Each noun is supported by the packet. A draft saying “Wheelchair-accessible refill station supplying clean water” adds unsupported conclusions. Remove them and record the correction rather than silently treating them as inspected facts.

For a decorative header using the same photo, the page owner may choose an empty alternative after confirming that the image contributes no essential information at that placement. The asset remains meaningful elsewhere; the decision belongs to the page use.

For a linked icon that opens a station-location page, the useful draft might be “Find refill station locations,” provided the inspected link destination actually does that. The image’s appearance alone cannot confirm the destination. Keep the image role, destination evidence, and chosen text together in the review ledger.

## Review the wording and the implementation

Use the [image description reviewer](/agents/design/image-description-reviewer) to compare the draft against verified observations and purpose. It should return unsupported claims, missing evidence, and a proposed correction. The publisher still approves the final choice.

Check the exact page implementation after editing. Confirm that the approved asset version is present, that the chosen alternative is attached to the right image, and that an empty value did not become a missing attribute. Inspect linked image labeling and nearby captions together. Testing the draft in a document does not show how the rendered page exposes it.

For a complex image, [W3C’s complex-image guidance](https://www.w3.org/WAI/tutorials/images/complex/) pairs short identification with a longer text equivalent. Keep that fuller information associated with the image and available to readers.

## Keep a review record that survives reuse

Hand off the asset ID and version, page placement, inspection method, observations, purpose decision, proposed text, corrections, reviewer, and approval date. Mark unavailable evidence explicitly. If a designer changes the crop, surrounding copy, or link destination, revisit the decision even if the underlying file name stays the same.

This pass verifies evidence and wording for a bounded use. It does not certify accessibility conformance for a whole site. The useful finish is a supported text choice, an inspected implementation, and a named person responsible for approving it.
