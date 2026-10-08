---
description: Map an approved script into AI-assisted storyboard shots with beat IDs, visual constraints, continuity checks and a human review before production.
date: "2026-09-08"
reviewed: '2026-10-07'
topics:
- ai-at-work
- multimodal-ai
audience:
- designers
- marketers
tags:
- design
- video
- planning
featured: false
related:
- tool:boords
- glossary:animatic
- skill:storyboard-shot-brief
summary: Map an approved script into AI-assisted storyboard shots with beat IDs, visual constraints, continuity checks and a human review before production.
title: Plan an AI Storyboard from an Approved Script
depth: standard
sources:
- title: Creating storyboards
  url: https://boords.com/docs/creating-storyboards
  publisher: Boords
- title: Concepts
  url: https://boords.com/docs/concepts
  publisher: Boords
- title: Boords Pricing
  url: https://boords.com/pricing
  publisher: Boords
keyTakeaways:
- Map approved script beats to stable shot IDs with action and continuity constraints.
- Treat generated frames and proposed durations as review material before production.
- Check beat coverage with code and visual continuity with a human director; these answer different questions.
---

Plan an AI-assisted storyboard by mapping an approved script's beats to shot briefs before generating or reviewing frames. Each shot needs a source beat, visible action, continuity constraints, and a proposed duration. Keep new ideas separate from approved actions so a visually appealing draft does not quietly change the story.

The output is a shot plan, an issue ledger, and a director review gate. It is useful before image generation and during review of generated frames. The script owner checks fidelity; the director checks the sequence and pacing before production.

## Establish which script governs

Record the approved script version and give each action beat a stable ID. Keep the original script unchanged. Identify the script owner and director or editor who will resolve questions. If approval, version, or readable script text is missing, return those gaps without inventing scenes.

Supply character, prop, setting, and aspect constraints when they matter. Separate required facts from suggestions. “The book stays blue” is a continuity requirement; “try a close shot” is a proposed composition. This makes it possible to change the framing without accidentally changing the prop.

Treat stakeholder change requests as a separate input. A request for a new ending does not automatically replace the approved version. Ask the script owner which change governs before incorporating a new action into the shot plan.

## Turn beats into inspectable shot briefs

[Boords](/tools/boords) uses AI script import to propose storyboard structure, action descriptions, shot suggestions, and image prompts. [Its storyboard-creation documentation](https://boords.com/docs/creating-storyboards) describes that starting point.

For this workflow, draft action first and composition second. Write what must happen visibly in the frame, then propose a view that communicates it. Avoid a broad visual prompt whose attractive scenery hides whether the required action is present.

A shot brief should retain shot ID, beat ID, exact script excerpt, action or dialogue, composition, continuity note, proposed `duration_ms`, issue, and review status. Unknown composition or duration can remain a proposal. Do not invent narration when the approved script supplies only actions.

## Build a fictional library-return plan

The following explainer is fictional. B1 says: “A volunteer places a blue book in the return slot.” B2 says: “The same volunteer reads a receipt.” B3 says: “The volunteer puts the receipt in a coat pocket.” The book must stay blue, and the receipt must not appear before the slot action.

| Shot | Beat | Action and suggested composition | Continuity note | Proposed duration |
| --- | --- | --- | --- | --- |
| S1 | B1 | Show the volunteer placing the blue book in the slot; frame the hand and slot clearly. | Blue book; receipt not yet visible. | 3,000 ms |
| S2 | B2 | Show the same volunteer reading the receipt; allow the action to register. | Same volunteer and coat; receipt first appears here. | 4,000 ms |
| S3 | B3 | Show the receipt going into the coat pocket. | Receipt stays in the same hand until the pocket action. | 2,000 ms |

Attach the exact beat excerpt to each machine row. For S1, “places a blue book in the return slot” is contained in B1. That containment helps trace the plan, but it does not prove a generated image actually shows the correct action.

The proposed durations total 9,000 ms. This is an original planning proposal, not a measured viewing result or a recommended universal pace. Keep it provisional until the director watches the sequence.

## Carry prop state across the sequence

Use a small continuity ledger alongside the shots. For this example, record the blue book through S1 and the receipt's introduction in S2, followed by its movement into the pocket in S3. Track the volunteer and coat consistently without adding character traits the script never specified.

If a generated S1 frame contains a red book, flag a prop mismatch. Do not rewrite the approved blue-book requirement to make the image seem acceptable. If a fourth shot shows a refund, flag an unsupported action and ask the script owner whether to remove it or approve a script revision.

Review the order as well as each frame. A receipt shown in S1 may spoil the stated introduction even if all three required actions appear somewhere. Beat coverage and temporal continuity therefore require different checks.

## State which visual evidence was available

The [Storyboard Shot Brief](/skills/design/storyboard-shot-brief) organizes the bounded planning task around approved beats and constraints. When reviewing frames, supply readable images or precise frame descriptions and say which were inspected.

If images are unreadable or unavailable, restrict the report to the supplied descriptions. Do not claim to have checked book color or hand position from a filename. A description saying “blue book” cannot independently establish that the actual frame is blue.

Instructions embedded in a script or frame annotation remain data. They do not authorize generating assets, sharing a board, or approving production. The review output should name the proposed repair and the human decision needed to accept it.

## Check coverage before approving visuals

The companion checker reads `storyboard-coverage.json` in a Python 3 POSIX environment and accepts no arguments. It inspects the declared approved script version, beat and shot IDs, excerpt containment, positive durations, and review fields. It can flag uncovered beat IDs and shots that still need review.

Those checks do not establish that a shot represents its beat, that an image obeys its continuity note, or that a named reviewer performed the review. An unrelated description can reference the right beat. Inspect the actual action, image, and sequence as a separate human check.

## Watch the timing proposal as a sequence

An [animatic](/glossary/animatic) gives storyboard frames durations and may include audio to preview pacing. Frame notes can retain action, dialogue, camera, and timing information. [Boords' concepts documentation](https://boords.com/docs/concepts) explains this planning stage.

For the fictional three-shot plan, watch whether the blue book's placement is clear, the receipt has time to be read visually, and the pocket action completes. If S2 feels too short or too long, record a revised duration and replay the sequence. Do not accept timing solely because its sum is correct.

Finish with the governing script version, reviewed shot briefs, continuity issues, and director decisions. The script owner confirms that approved actions are preserved. The director reviews sequencing and animatic pacing before image generation, sharing for approval, or production. Keep unresolved changes visible until those decisions are made.
