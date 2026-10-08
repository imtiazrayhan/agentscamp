---
description: Spaced repetition schedules reviews over time using recall feedback; AI can draft the cards, while the learner still checks their answers.
date: "2026-09-03"
reviewed: '2026-10-07'
topics:
- ai-at-work
- workflow-prompting
audience: []
tags:
- source-grounded
- documents
- review
featured: false
related:
- guide:ai-study-cards-from-notes
- tool:remnote
- agent:study-card-reviewer
summary: Spaced repetition schedules reviews over time using recall feedback; AI can draft the cards, while the learner still checks their answers.
term: Spaced repetition
---

**Spaced repetition is a practice method that schedules reviews across time rather than presenting the same material in one continuous session.** A learner attempts recall and provides feedback about difficulty; a scheduler can use that feedback to choose later reviews. [RemNote's introduction](https://help.remnote.com/en/articles/6022755-getting-started-with-spaced-repetition) describes this recall-and-rating loop.

Scheduling and checking an answer are different decisions. A scheduler can repeatedly present a badly worded or unsupported card. In an AI-assisted workflow, decide whether the card deserves practice before deciding when to revisit it.

Consider fictional ceramics club notes stating that bisque firing precedes glazing in that club's workshop sequence. A reviewed card asks, “In this club's sequence, what happens before glazing?” The learner attempts the answer and then compares it with the reviewed answer. Another note says the next workshop date is not approved. A guessed date should remain outside the practice set, however convenient it would be to schedule it.

The [study-card workflow](/guides/workflow/ai-study-cards-from-notes) keeps learning targets, source passages, and unresolved questions together. When using a tool such as [RemNote](/tools/remnote), preserve that distinction between a draft and a card you have accepted. The scheduling step does not settle a contradiction between two versions of the notes.

Grounding asks whether an answer is supported by evidence. Spaced repetition asks when accepted material will be practiced. The [Study Card Reviewer](/agents/analytics/study-card-reviewer) helps organize the first check for supplied notes, while the learner decides whether the question is clear enough to answer. Neither a source quote nor a difficulty rating replaces that judgment. Keep an unresolved question as a request for clarification until the note owner supplies an answer.
