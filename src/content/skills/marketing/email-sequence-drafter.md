---
name: "email-sequence-drafter"
description: "Draft a four-to-six email sequence from a goal, an audience, and the product notes you paste in: a send-timing table, one job per email, three subject-line variants per email with character counts, a formatted and a plain-text version of each message, every product claim traced to your notes, and a compliance footer placeholder on every email. Use when a welcome, onboarding, launch, or nurture sequence has to be written from what the product actually does rather than from what a template assumes."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
tags: ["claude", "marketers", "email", "lifecycle", "cowork"]
featured: false
related: ["skill:landing-page-copywriter", "skill:brand-voice-profiler", "agent:content-editor", "guide:claude-skills-for-marketers", "guide:claude-marketing-plugin-guide", "tool:hubspot-breeze"]
seoDescription: "A Claude skill that drafts a 4-6 email sequence: timing table, subject-line variants, plain-text versions, claims traced to your notes, compliance placeholders."
summary: "Paste a goal, an audience, and product notes and this skill drafts a four-to-six email sequence: a send-timing table, one job per email, three subject lines each with counts, a formatted and a plain-text version of every message, and a compliance footer placeholder. Every product claim maps to a line in your notes; anything inferred is marked [VERIFY]."
---

Sequences drafted from a template tend to describe a product that does not quite exist: a feature the notes never mentioned, a customer count nobody supplied, a "trusted by" line from nowhere. This skill writes from your notes and nothing else: one job per email, every claim pointing back to a line you gave it, and a placeholder on every message for the sender and unsubscribe details your platform and jurisdiction require. Anthropic's marketing plugin has an `email-sequence` skill that also plans branching and benchmarks (see the [Claude marketing plugin guide](/guides/marketing/claude-marketing-plugin-guide)); this is the narrower drafter for teams whose first problem is getting the claims true. It works from pasted text alone, so it runs the same on claude.ai, in Claude Code, and in Claude Cowork.

## When to use this skill

- A signup, trial, or lead-magnet download needs a welcome or onboarding sequence and there is no copy yet.
- A launch needs announcement, reminder, and last-call emails written as one arc, not three drafts.
- You wrote a page with the [landing-page-copywriter](/skills/marketing/landing-page-copywriter) skill and need the emails that send people to it, from the same offer notes.
- An existing sequence is being rewritten and you want to know which of its claims the product still backs.

> [!NOTE]
> Product notes are the whole source of truth. The skill adds no features, outcomes, numbers, or testimonials it was not given, and states no open rate, benchmark, or best send time. Timing offsets are defaults you can override. Voice comes from a pasted [brand-voice-profiler](/skills/marketing/brand-voice-profiler) rules block when you supply one. The compliance placeholder is a reminder, not legal advice; what your footer must contain depends on where you send from and to.

## Instructions

1. **Inventory the inputs.** One goal (the single action the sequence exists to cause), the audience (who, what triggered the sequence, what they already know), and the product notes as numbered lines: features, outcomes, pricing, proof, links, whichever were given. Each note line is a FACT; anything the skill would have to add is INFERRED and carries `[VERIFY]` wherever it appears.
2. **Design the arc.** Choose four to six emails, each with exactly one job: deliver what was promised, show the first win, handle the main objection, present proof, make the offer, close. Print an arc table: Email, Job, Send timing, CTA, Exit condition. The exit condition is what the user specified ("stop when they upgrade") or "none provided"; never invent one.
3. **Set the timing.** Default offsets from the trigger are Day 0, 1, 3, 5, 8, and 12, trimmed to the email count and labeled DEFAULT; a user-supplied cadence replaces them. Time of day is left to the platform.
4. **Write each email.** Three subject lines (direct, benefit-led, curiosity-led; each 50 characters or fewer, count printed), preview text of 90 characters or fewer, a body of 80 to 180 words with one call to action and one `[LINK: where it goes]` token, and a sign-off. Every product claim cites its note line in a trailing comment (`<!-- note 4 -->`); every inferred phrase carries `[VERIFY]`.
5. **Write the plain-text version.** Below each formatted email: no bold, headings, or Markdown, links as `[LINK: where it goes]`, blank lines between paragraphs. Same words, same order, so the versions never disagree.
6. **Add the compliance placeholder.** Every email ends with `[FOOTER: sender name, mailing address, unsubscribe link, and any other text your email law and platform require]`. The skill does not fill it in.
7. **Check the sequence as a whole.** No two emails share a CTA; each email's job is visible in its first two lines; no claim absent from the notes appears; superlatives without a note line are removed and listed. With a rules block, check tone and vocabulary against it and note unresolved deviations.
8. **Assemble**: Inputs, Arc table, the emails in send order (formatted then plain text), Verify before sending (`[VERIFY]` items and removed claims), Notes for the platform (timing, exit condition, footer).

## Output

A single Markdown document with the arc table, four to six emails in formatted and plain-text forms, and a "Verify before sending" list, the owner's to-do list. Once it is clear, paste the emails into your email platform; for a final voice and claims pass, hand the document to the [content-editor](/agents/marketing/content-editor) agent.

## Example

Excerpt from a five-email trial onboarding sequence built from eight numbered product notes:

```markdown
### Arc
| Email | Job | Send timing | CTA | Exit condition |
| --- | --- | --- | --- | --- |
| 1 | Deliver the workspace and the first step | Day 0 (DEFAULT) | Create your first project | stop when they upgrade (user-supplied) |

### Email 2
Subject A (direct): Import your first file in 2 minutes (35)
Subject B (benefit): Your data, in a table you can actually filter (45)
Preview: A CSV, a click, and your first filtered view. (45)

Body:
Yesterday you created a project. Today, put something in it.
Drag a CSV onto the board and it becomes a filterable table. <!-- note 3 -->
Most teams import a customer list first. [VERIFY]
[LINK: import page]
[FOOTER: sender name, mailing address, unsubscribe link, and any other text your email law and platform require]
```

Where sequences sit in the full workflow is described in [Claude skills for marketers](/guides/marketing/claude-skills-for-marketers).
