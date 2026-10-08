---
description: "Turn approved survey questions and routing rules into an explicit branch table, with stable IDs and unresolved paths before an AI form builder runs."
date: "2026-09-10"
reviewed: "2026-10-07"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "analysts", "designers"]
tags: ["survey-routing", "ai-survey-branching-plan"]
featured: false
related: ["guide:test-ai-survey-logic", "tool:typeform", "glossary:skip-logic", "skill:survey-path-test-builder"]
summary: "Turn approved survey questions and routing rules into an explicit branch table, with stable IDs and unresolved paths before an AI form builder runs."
title: "Plan AI Survey Branching Before Building the Form"
depth: "standard"
sources: [{"title": "Use Typeform AI", "url": "https://help.typeform.com/hc/en-us/articles/42053773420948-Use-Typeform-AI", "publisher": "Typeform"}, {"title": "Logic Jumps", "url": "https://www.typeform.com/developers/create/logic-jumps/", "publisher": "Typeform"}, {"title": "Skip Logic", "url": "https://help.surveymonkey.com/en/surveymonkey/create/skip-logic/", "publisher": "SurveyMonkey"}]
seoDescription: "Turn approved survey questions and routing rules into an explicit branch table, with stable IDs and unresolved paths before an AI form builder runs."
keyTakeaways: ["Freeze question, choice and ending IDs before mapping approved single-choice transitions.", "Record unanswered and Other behavior explicitly; leave missing owner decisions unresolved.", "Compare every implemented destination with the route table before approving a form version."]
faq: [{"q": "Can I use this branch table for a multiple-select question?", "a": "Not without a separate specification for combinations and rule precedence. This workflow assumes one selected choice per routing question; list and approve combination behavior before extending it."}]
---

A form draft becomes easier to review when navigation exists outside the builder. Keep an approved branch table alongside the questions so a reviewer can answer a concrete question: given this response, what should appear next? That table is the handoff between the person who owns the questionnaire and the person who configures it.

This workflow covers a finite, acyclic form whose routing questions each accept one choice. It does not decide whether questions are clear or appropriate for the research goal. Review that wording separately, then freeze the text before specifying navigation. Multi-select routing, calculated scores and changing eligibility rules need their own specification rather than an improvised extension of this example.

## Define the routing packet

Start with the form purpose, intended respondents and named approval owner. Include the exact approved questions, choice labels, required or optional status, ending text and any supplied routing rules. If the owner has not decided what should happen to an unanswered optional question, record a gap. Asking an AI to choose a convenient destination would turn a missing requirement into a hidden decision.

Assign identifiers independent of display wording. Use question IDs such as `Q1`, choice IDs such as `yes`, and ending IDs such as `E-thanks`. Keep the labels next to those IDs. Changing “Morning workshop” to “Morning session” should not accidentally change which destination that choice selects. Conversely, changing a rule should produce a new route version even when the displayed question stays identical.

Make the start question explicit. List every valid ending, including an ending used by respondents who leave the main path early. A route table should not contain an unexplained “finish” destination that different people interpret differently. The meaning of [skip logic](/glossary/skip-logic) is the transition between these states; a persuasive question alone cannot specify it.

## Work through a small example

The following workshop form is fictional. The owner wants to ask previous attendees which session interests them and let other respondents finish without seeing the session question. This is navigation for an interest form, not a claim about who is eligible to attend a future event.

| ID | Approved question or ending | Choices |
| --- | --- | --- |
| Q1 | Have you attended our workshop before? | yes, no |
| Q2 | Which session interests you? | morning, evening |
| E-not-attended | Thank you for your interest. | Ending |
| E-thanks | Thank you for sharing your session preference. | Ending |

Both questions are required in this fictional version. The owner approves these branches:

| Question | Selected choice | Next state | Reason |
| --- | --- | --- | --- |
| Q1 | yes | Q2 | Ask previous attendees about a session |
| Q1 | no | E-not-attended | Do not show the session question |
| Q2 | morning | E-thanks | Finish after recording the preference |
| Q2 | evening | E-thanks | Finish after recording the preference |

Write an unanswered-state note as well: because both questions are required, the respondent must supply one choice before advancing. That is an intended UI behavior to check in preview. It is not an additional JSON route choice. If Q2 becomes optional, pause the configuration and ask its owner to approve the empty-answer behavior before revising the model.

## Expose gaps before generating the form

Read each question row against its complete choice list. Every permitted choice needs a destination. Destinations must reference a listed question or ending. Walk forward from the start to find questions that are listed but cannot be reached, and paths that return to an earlier question. For this workflow, a loop is outside the allowed model and must be resolved before drafting.

Give “Other” the same treatment as any other choice if the owner supplied it. A text field attached to Other can collect wording, but the routing packet must say whether the route depends on choosing Other or on interpreting that text. The latter is outside this single-choice specification. Do not quietly introduce model interpretation into navigation.

For the workshop example, a draft might accidentally point `Q1/no` at `Q2`. The correction is to restore the approved `E-not-attended` destination. It is not to invent a new reason why nonattendees should answer Q2. Put the discrepancy in a change row containing the question ID, observed destination, approved destination and decision owner.

[Typeform's AI documentation](https://help.typeform.com/hc/en-us/articles/42053773420948-Use-Typeform-AI) describes assisted questions, endings and branching. Treat that assistance as a way to draft the approved packet. The [Typeform profile](/tools/typeform) provides a small evaluation plan. [SurveyMonkey's skip-logic help](https://help.surveymonkey.com/en/surveymonkey/create/skip-logic/) notes plan-dependent availability, so confirm the intended routing is available before choosing a builder.

## Hand over an explicit prompt

Use a bounded instruction that keeps the owner’s rules visible:

> Create a draft from route packet workshop-v1. Preserve all question, choice and ending IDs in the review record. Implement only the four listed transitions. Do not add eligibility conditions, choices or endings. Report any unsupported behavior or ambiguous mapping before changing the packet. Keep the form undistributed for review.

A builder may represent identifiers differently from the packet. In that case, keep a mapping table from packet IDs to the builder’s labels or internal references. Never assume that a renamed block or copied question retained its original route. If a platform cannot represent a rule, the owner must choose an approved simplification or a different workflow.

The [Typeform logic reference](https://www.typeform.com/developers/create/logic-jumps/) also discusses multiple-selection combinations. That is a reason to keep this first packet single-choice: combinations create requirements that a simple list of individual choices does not settle.

## Approve the implemented version

After drafting, compare each implemented transition with the table rather than rereading the form from top to bottom once. Capture the builder version, configuration date, ID mapping and unresolved items. Use the [survey path test builder](/skills/product/survey-path-test-builder) to prepare response cases from the approved packet, then follow the [survey logic test workflow](/guides/workflow/test-ai-survey-logic) in the actual preview.

The owner’s release record should name the route version, the corresponding form draft, the cases reviewed and the remaining limitations. Approval means those specific paths behaved as intended in the checked draft. Any later choice addition, question copy or route edit reopens the affected checks before collection begins.
