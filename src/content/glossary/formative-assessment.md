---
description: Formative assessment gathers feedback during learning so teachers and learners can adjust next steps; an AI draft still needs educator review.
date: "2026-09-11"
reviewed: '2026-10-07'
topics:
- ai-at-work
- workflow-prompting
audience: []
tags:
- content
- source-grounded
- review
featured: false
related:
- guide:ai-exit-tickets-from-lesson-objectives
- tool:magicschool
- agent:exit-ticket-reviewer
summary: Formative assessment gathers feedback during learning so teachers and learners can adjust next steps; an AI draft still needs educator review.
term: Formative assessment
---

**Formative assessment gathers feedback during learning so teachers and learners can adjust what happens next.** It often has low or no point value. Summative assessment evaluates learning at the end of a unit against a standard, although that feedback may later inform learning too. [Carnegie Mellon's overview](https://www.cmu.edu/teaching/assessment/basics/formative-summative.html) explains the distinction by purpose and use.

For an AI-assisted workflow, keep two questions separate: is the draft activity sound, and how will the educator use responses? Reviewing the first question does not authorize a model to answer the second for an individual learner.

Consider a fictional map lesson teaching two facts: the handout's dotted line marks a walking path, and its north arrow indicates north. A short exit ticket asks about each fact. If the generated key says the path uses a solid line, fix the key before giving the ticket to learners. That error belongs to the draft and is not evidence of a learner misconception.

The [exit-ticket workflow](/guides/workflow/ai-exit-tickets-from-lesson-objectives) maps each prompt and expected answer to an approved objective and taught passage. A drafting surface such as [MagicSchool](/tools/magicschool) can be part of that preparation, while the educator decides whether wording and answers fit the lesson.

An LLM eval dataset measures an application's behavior against test cases. A formative activity serves teaching and learning. The [Exit Ticket Reviewer](/agents/analytics/exit-ticket-reviewer) checks supplied draft materials for the latter workflow; it does not score learners. After classroom use, the educator may choose a clarification or follow-up activity. Keep that judgment with the educator, and keep questions about untaught material out of the reviewed ticket until the source gap is resolved.
