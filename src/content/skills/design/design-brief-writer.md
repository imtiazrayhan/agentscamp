---
name: "design-brief-writer"
description: "Turn a messy design request you paste in (a Slack thread, an email chain, meeting notes, a ticket) into a one-page design brief: goal, audience, constraints, success criteria, scope and non-goals, references needed, open questions, and timeline placeholders, with every item the source did not state marked as an inference and no constraint or deadline invented. Use when a request has arrived in fragments and the brief has to exist before design work starts."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
tags: ["claude", "designers", "design-brief", "cowork"]
featured: false
related: ["skill:component-spec-writer", "skill:design-critique-checklist", "command:critique-screen", "skill:prd-writer", "guide:claude-skills-for-designers", "guide:claude-design-guide"]
seoDescription: "A Claude skill that turns a Slack thread, email, or notes into a design brief: goal, audience, constraints, success criteria, scope, and open questions."
summary: "Paste the thread, email, or notes a design request arrived in and this skill writes the brief: goal, audience, constraints, success criteria, scope and non-goals, references needed, open questions, and timeline placeholders. Anything the source did not say is marked as an inference or becomes a question; the skill never invents a constraint or a deadline."
---

Design requests rarely arrive as briefs. They arrive as a Slack thread with four opinions, an email that forwards an older email, and a ticket whose title is the only sentence anyone agreed on. This skill reads whatever you paste and writes the brief the request should have come with. Every line is tagged: STATED when the source says it (with the quote), INFERRED when the skill reads it between the lines (with the reason), OPEN when nobody has said it yet. It needs only pasted text, so it runs the same on claude.ai, in Claude Code, and in Claude Cowork. Anthropic's [design plugin](/guides/design/claude-design-plugin-guide) covers research synthesis, critique, and handoff, but ships no brief skill; this is the step before those.

## When to use this skill

- A request came in through chat or email and you want one page you can send back with "is this what you meant?".
- Several stakeholders have said different things and the differences need to be visible before you open Figma.
- A ticket has a title and a screenshot and nothing else, and you need the questions list to go get answers.
- You are kicking off with a contractor or a new teammate and the brief has to stand on its own.

> [!NOTE]
> The brief contains only what the source supports. The skill does not add constraints from general practice ("must meet WCAG", "mobile first") unless the source says so; it lists them as questions instead. It never invents a deadline: dates come from the source or stay as placeholders. If a founder-side PRD exists from the [prd-writer](/skills/product/prd-writer) skill, paste it too and the brief will cite it.

## Instructions

1. **Inventory the source.** Number each message, email, or note with its author, date if shown, and role if you can tell (requester, decision-maker, stakeholder, engineer). Separate decisions ("we're going with the modal") from opinions ("I'd prefer a modal") and record who said each.
2. **Extract the goal.** One sentence: what changes for the user or the business when this ships. Quote the source line that supports it. If the source contains more than one goal, list all of them and flag the conflict at the top rather than choosing.
3. **Identify the audience.** Who uses this, on what device, in what situation, as the source describes them. If the source never says, tag the audience INFERRED with the evidence (a mention of "the admin page", a screenshot of a mobile view) or leave it OPEN.
4. **List the constraints.** Technical (platform, framework, existing components or [design tokens](/glossary/design-tokens) to reuse), brand, legal, content, localization, and timing. Each is STATED with a quote or INFERRED with a reason. Do not add a constraint the source does not support.
5. **Write the success criteria.** Measurable where the source gives a number or a metric; observable otherwise ("a first-time user reaches the confirmation screen without help"). If the source gives none, say so and propose one to two tagged INFERRED for the requester to accept or replace.
6. **Set scope and non-goals.** What is in, what the source explicitly rules out, and what is ambiguous. Ambiguous items go to the questions list, not to scope.
7. **List the references needed.** Existing screens, the brand file, the component library, competitor examples the source mentions, data or content samples. For each, whether the source says it exists and where.
8. **Write the open questions.** One per ambiguity or conflict, addressed to the person the source shows as the decider where possible, marked BLOCKING (design cannot start) or NON-BLOCKING (can start, must resolve before handoff).
9. **Add the timeline placeholders.** `[DATE: kickoff]`, `[DATE: first review]`, `[DATE: handoff]`, `[DATE: launch]`. Replace a placeholder only with a date the source states, quoted.
10. **Assemble** in this order: Header (source count, date, tag counts), Goal, Audience, Constraints, Success criteria, Scope and non-goals, References needed, Open questions, Timeline.

## Output

A one-page Markdown brief with the nine sections above, each line tagged STATED, INFERRED, or OPEN, and a header line that tells the reader how much of the brief is inference. Save it as `design/briefs/<name>.md`; the [component-spec-writer](/skills/design/component-spec-writer) skill reads it when specifying the components the brief calls for, and the [/critique-screen](/commands/design/critique-screen) command picks it up so critiques are judged against the stated goal.

## Example

Excerpt of a brief derived from a nine-message Slack thread and one forwarded email:

```markdown
# Brief: account settings redesign
Sources: 9 Slack messages (2026-09-08), 1 email. Tags: 14 STATED, 5 INFERRED, 6 OPEN.

## Goal
STATED: "Users can't find where to change their billing email, support gets 30+ tickets a week about it." (Priya, S3)

## Constraints
STATED: Ships inside the existing settings shell; "no new navigation" (Marcus, S7)
INFERRED: Web only. Every screenshot in the thread is desktop; nobody mentions the app.
OPEN: Whether the legal team must review copy on the billing tab.

## Open questions
1. BLOCKING (Marcus): Is the support ticket count the success metric, or time-to-find in a usability test?
2. NON-BLOCKING (Priya): Do we keep the two-column layout or is that up to the designer?
```

The [Claude skills for designers](/guides/design/claude-skills-for-designers) guide covers where this brief sits in the designer set, and the [Claude Design guide](/guides/design/claude-design-guide) covers the tools it feeds.
