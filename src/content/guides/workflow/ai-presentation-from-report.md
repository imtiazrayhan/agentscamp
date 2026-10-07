---
title: "Create an AI Presentation from a Report: A Reviewable Workflow"
description: "Turn a business report into an AI-assisted presentation with a claim-to-slide map, source checks, speaker notes, and a finished-deck review."
seoTitle: "Create an AI Presentation from a Report: Step-by-Step Workflow"
seoDescription: "Turn a report into an AI presentation with a claim-to-slide map, source checks, speaker notes, and a practical review of the finished deck."
author: "Imtiaz Rayhan"
date: 2026-10-06
reviewed: 2026-10-06
depth: "standard"
color: "blue"
topics: ["ai-at-work"]
audience: ["founders", "marketers", "sales", "designers", "analysts"]
tags: ["presentations", "reports", "powerpoint", "slide-decks"]
featured: false
keywords: ["AI presentation from report", "turn report into slides with AI", "AI PowerPoint from document"]
summary: "Build an AI presentation in two passes: first approve the argument and evidence behind each slide, then create and review the finished deck. Preserve the report's conditions, keep recommendations separate from results, and check the speaker notes as carefully as the visible slides."
keyTakeaways:
  - "Map every slide's main claim to a specific report section or table."
  - "Approve the story and evidence before asking for slide layout."
  - "Review speaker notes for claims or commitments absent from the report."
  - "Inspect the finished deck in its delivery app before sharing."
howtoSteps:
  - name: "Define the presentation decision"
    text: "Name the audience, decision, source report, desired length, and deliverable format."
  - name: "Approve a claim-to-slide map"
    text: "Review each proposed slide's main claim, source location, qualifier, and supporting visual before creating the deck."
  - name: "Create the draft in an available tool"
    text: "Provide the approved map, report, and template through the supported file or presentation workflow in your workspace."
  - name: "Review slides and speaker notes"
    text: "Verify figures and conditions against the report, inspect rendered layouts, and resolve unsupported notes before sharing."
faq:
  - q: "Should I ask AI to summarize every report section as a slide?"
    a: "Start with the decision your audience needs to make. Select the evidence needed for that decision and keep background material in an appendix rather than forcing every report section into the main deck."
  - q: "What if my presentation tool cannot accept the report and detailed instructions together?"
    a: "Prepare a structured source document that preserves the evidence and the intended story. Use the supported creation route, then revise the draft against your approved map. Check that editing has not changed a figure or condition."
  - q: "What should I check in AI-generated speaker notes?"
    a: "Check the same claims, figures, dates and conditions as the slides. Remove unsupported promises, distinguish recommendations from approved decisions, and confirm that the notes match what the slide actually shows."
related: ["tool:chatgpt", "tool:microsoft-copilot", "guide:claude-document-skills", "guide:ai-document-research-with-citations", "guide:check-an-ai-data-analysis"]
sources:
  - title: "Create or revise a slide deck"
    url: "https://learn.chatgpt.com/use-cases/generate-slide-decks"
    publisher: "OpenAI"
  - title: "Create a new presentation with Copilot in PowerPoint"
    url: "https://support.microsoft.com/en-us/powerpoint/copilot/create-a-new-presentation-with-copilot-in-powerpoint"
    publisher: "Microsoft"
  - title: "Frequently asked questions about Copilot in PowerPoint"
    url: "https://support.microsoft.com/en-us/powerpoint/frequently-asked-questions-about-copilot-in-powerpoint"
    publisher: "Microsoft"
---

To create an AI presentation from a report, approve the argument and evidence before asking for a finished deck. First map each slide's claim to the report. Then generate the presentation through a supported tool, open it in the delivery app, and review both visible slides and speaker notes. A polished deck can still contain an unsupported conclusion or a percentage with the wrong denominator.

The practical goal is a presentation that helps a named audience make a decision. It is rarely a slide for every report heading. Start with what the audience needs to decide, select the evidence that bears on it, and move supporting detail to an appendix. If the source report itself needs checking, begin with the [document research workflow](/guides/workflow/ai-document-research-with-citations) before compressing it into slides.

## Write the brief around a decision

The following community workshop report and all its figures are fictional. They illustrate review choices; they are not product-test outputs. The report describes a pilot with eight sessions offered, six held, 120 registration records, 84 check-ins and feedback from 30 attendees. Staff recommend another limited pilot, while venue capacity remains unresolved.

A useful brief names these boundaries:

```text
Audience: community board.
Decision: whether to authorize planning for another limited pilot,
subject to resolving venue capacity.
Source: fictional workshop pilot report, version dated October 6.
Format: five main slides plus a source appendix; editable presentation.
Style: use the supplied board template and plain, neutral language.
Evidence: preserve record counts, respondent denominators and conditions.
Missing information: label unresolved venue details; do not invent capacity.
Reviewer: workshop coordinator, then the board presenter.
```

“Authorize planning” is deliberately different from “approve an expanded program.” The report does not establish venue capacity, broad community demand or that the workshops caused a particular outcome. Those gaps should shape the deck's recommendation. They should not vanish because the final slide needs an optimistic ending.

## Build a claim-to-slide map

Ask for a map before asking for slide layout. For the fictional report, the five slide purposes are the decision, delivery and participation, respondent feedback, constraints, and a conditional next step. The appendix holds the detailed record definitions and source locations.

Three evidence rows might look like this:

| Slide purpose | Main claim | Source pointer | Denominator or condition | Visual | Speaker-note limit |
| --- | --- | --- | --- | --- | --- |
| Delivery | Six of eight offered sessions were held: 75%. | Report, delivery table | Sessions held / sessions offered | Labeled count table | Do not imply why the other two were not held without evidence. |
| Participation | 84 check-ins were recorded against 120 registrations: 70%. | Report, registration table | Event records, not unique people | Two labeled counts and the ratio | Do not call this unique-person attendance or a measure of community demand. |
| Feedback | Feedback came from 30 attendees. | Report, feedback section | Respondents only; report no broader conclusion | Count and supported themes | Do not imply that all attendees shared their views. |

The source locations here are part of the invented report specification. In a real map, use the actual section, table, page or worksheet name and verify it opens to the relevant evidence.

Check the arithmetic separately: six divided by eight is 75%; 84 divided by 120 is 70%. Neither calculation resolves who attended multiple events. A correct ratio can still support the wrong sentence. Keep “check-ins relative to registrations” beside the figure, including in the speaker notes. For a fuller numerical review, use [checking an AI data analysis](/guides/analytics/check-an-ai-data-analysis).

The first prompt can request only the map:

```text
From the fictional workshop report, propose a five-slide decision deck.
Return a table: slide purpose, main claim, source section/table,
denominator or condition, visual, and speaker-note limits.
Distinguish measured records, respondent feedback and staff recommendations.
Do not build the deck yet. Mark missing evidence and unresolved venue details.
```

Review the strongest claim on each slide. A title such as “Pilot proves demand” fails even if the small print contains the right counts. Replace it with a statement the evidence can support. Approve the revised map before moving on; otherwise, generating layouts makes unsupported claims more expensive to untangle.

## Choose an available creation route

These vendor-documented routes are options to check in your workspace, rather than workflows tested for this example:

| Route | Documented use |
| --- | --- |
| ChatGPT desktop `@Presentations` | Attached material, reference decks and templates. |
| Native Google Slides through ChatGPT | An authorized Drive connection. |
| An open PowerPoint through ChatGPT | The separate PowerPoint add-in. |
| Copilot in PowerPoint | Supported file-based presentation creation and templates. |

ChatGPT availability varies by plan and workspace; final layout and claims need review. [Create or revise a slide deck](https://learn.chatgpt.com/use-cases/generate-slide-decks).

As of October 2026, PowerPoint file-based creation is separate from Agent Mode, whose file references are currently unsupported. File-reference creation cannot take extra context in the same prompt; Word styles help structure the source. [Microsoft's file-based creation documentation](https://support.microsoft.com/en-us/powerpoint/copilot/create-a-new-presentation-with-copilot-in-powerpoint).

Supported work experiences offer Word-to-deck creation and PDF input; app version, license, network and settings matter. Text rewriting affects whole textboxes. [Copilot in PowerPoint FAQ](https://support.microsoft.com/en-us/powerpoint/frequently-asked-questions-about-copilot-in-powerpoint). Confirm your available route rather than relying on an identical button sequence across accounts.

If the route separates source-file creation from later editing, prepare a structured source document, create the draft, and then revise it against the approved map. Keep the original report available for comparison. An edited source document is a staging artifact; it should not silently become the authority for facts.

Where the supported route accepts the necessary inputs, use this creation brief:

```text
Create the presentation from the approved map, source report and template.
Preserve all figures, denominators and conditions in the approved map.
Use one main claim per slide. Put source locations in the speaker notes.
Keep staff recommendations separate from measured results.
Flag unresolved claims and venue details for the reviewer.
Return the editable draft for review before sharing.
```

Adapt the request to the tool's input route. A prompt expresses the desired output; it does not guarantee correct calculations, source use or a particular file structure.

## Write notes that preserve the evidence

Speaker notes deserve their own review because they can introduce a claim absent from the slide. Use the same compact pattern throughout: point, evidence, qualifier, audience question and prohibited inference.

For the participation slide in the fictional deck:

```text
Point: the report records 84 check-ins against 120 registrations.
Evidence: registration table, dated pilot report.
Qualifier: 70% is an event-record ratio, not unique-person attendance.
Audience question: what record definitions should the next pilot capture?
Do not infer: community-wide demand or the number of distinct attendees.
Venue availability remains pending for the proposed next pilot.
```

The notes should help the presenter explain what the visual means without overstating it. A recommendation may go further than a descriptive result, but label it as a recommendation and name its conditions. Do not let the notes promise a new schedule, venue or budget merely because the audience might ask about them.

## Inspect the finished deck in its delivery app

A clean outline establishes neither accurate slides nor readable rendering. Open the actual draft, move through every slide, and inspect the notes. Then open the export in the app or viewer the audience will use. Keep the appendix accessible in the shared version.

Review the evidence and the layout together:

- Match every number to its unit, denominator, period and source pointer. Check titles as well as chart labels.
- Remove extrapolations that the report does not support, such as a projected growth line derived from one pilot.
- Place essential conditions beside the claim, rather than hiding them in an appendix.
- Inspect small labels, clipped text, overlapping elements, reading order and whether color carries meaning without a text label.
- Check that notes and slides agree, and that expected elements remain editable in the delivery format.

Make repairs at the layer where the problem began:

| Problem | Repair |
| --- | --- |
| Too many slides with no clear decision | Return to the map and move background to the appendix. |
| A decorative chart has no source-backed relationship | Replace it with a labeled count table or a supported visual. |
| An invented growth percentage appears | Remove it; recalculate only if the required source data exists. |
| A condition disappears from the main slide | Restore it beside the claim and in the notes. |
| The export shifts the layout | Fix and inspect it in the target app. |
| Branding is inconsistent | Apply the approved template, then inspect the affected slides again. |

Save the reviewed deck, its source report and the approved map together so the next editor can see why each slide exists. The same process works with other artifact tools described in [Claude document skills](/guides/skills/claude-document-skills): the deliverable is ready when its claims and its rendered form both survive review.
