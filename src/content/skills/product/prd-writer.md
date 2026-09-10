---
name: "prd-writer"
description: "Turn a founder's raw idea, voice-memo transcript, or scattered bullet points into a product requirements document with a fixed section order: problem, users, jobs-to-be-done, scope, non-goals, success metrics, open questions, and risks. Use when an idea needs to be written down in a form a cofounder, contractor, or AI coding agent can build from, and it is not yet a document."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
tags: ["claude", "founders", "prd", "product", "cowork"]
featured: false
related: ["command:prd", "skill:mvp-scope-cutter", "skill:user-interview-synthesizer", "skill:competitor-teardown", "command:write-design-doc", "guide:claude-skills-for-founders"]
seoDescription: "A Claude skill that turns a founder's idea or notes into a PRD with fixed sections: problem, users, JTBD, scope, non-goals, metrics, open questions, risks."
summary: "Paste an idea, notes, or a voice-memo transcript and this skill returns a PRD in a fixed order: problem, users, jobs-to-be-done, scope, non-goals, success metrics, open questions, and risks. It separates what you said from what it inferred, never invents baseline numbers, and stays out of technical design so the document can be handed to any builder."
---

Most founder ideas live in a voice memo, a page of bullets, or a chat thread. None of those can be handed to a contractor, a cofounder, or an AI coding agent without the receiver filling the gaps with guesses. This skill turns whatever you have into a product requirements document (PRD) with a fixed section order, so every PRD reads the same way and the gaps are marked instead of hidden. It works on pasted text alone, with no repository, tools, or web access, so it runs identically on claude.ai, in Claude Code, and in Claude Cowork.

## When to use this skill

- You have an idea in notes form and need a document a builder can start from.
- You are about to open an AI app builder or Claude Code and want the "what" settled before the "how".
- A cofounder or advisor asked "what exactly are we building?" and you answered in chat.
- You already ran the [user-interview-synthesizer](/skills/product/user-interview-synthesizer) or [competitor-teardown](/skills/product/competitor-teardown) skill and want to fold the findings into a spec.

> [!NOTE]
> This is a product document, not an engineering one. It says what to build, for whom, and how you will know it worked. It does not pick a stack, a database, or an architecture. For an engineering RFC grounded in an existing codebase, use the [write-design-doc](/commands/plan/write-design-doc) command after the PRD exists. In a Claude Code project, the [/prd](/commands/product/prd) command runs this same procedure and writes the result to `docs/prd.md`.

## Instructions

1. **Read everything the user provided before writing.** Split it into statements the founder actually made and things you would have to infer. Do not ask questions up front. Write the full draft, marking every inference inline as `[ASSUMPTION]` and every unresolved point as `[OPEN]`. A founder can correct a marked guess in seconds; an unmarked one ships.
2. **Write the Problem section.** One or two paragraphs: who has the problem, when it shows up, what they do about it today, and what that costs them in time, money, or risk. No solution language. If the notes jump straight to features, work backwards to the problem those features imply and mark it as an assumption.
3. **Write the Users section.** Name the primary user (the person whose hands are on the product), any secondary user, and the buyer if different. One or two sentences of context each; no marketing personas.
4. **Write the Jobs-to-be-done section.** Three to five statements in the form "When [situation], I want to [motivation], so I can [outcome]." Each must trace to the source material or carry an `[ASSUMPTION]` tag.
5. **Write the Scope section.** A numbered list of what version one does, each item a behavior a user can observe ("a user can invite a teammate by email"), not a feature label ("team management"), and each testable by clicking through the product.
6. **Write the Non-goals section.** What version one deliberately does not do, with a one-line reason each, including the adjacent features the founder will be tempted by. This section saves the [mvp-scope-cutter](/skills/product/mvp-scope-cutter) skill from having to undo the PRD later.
7. **Write the Success metrics section.** Two to four rows of metric, baseline, target, and time window. A baseline is a number the founder supplied or the literal text "unknown, measure first"; never invent one. Without founder numbers, targets are expressed as a direction.
8. **Write the Open questions section.** Convert every `[ASSUMPTION]` and `[OPEN]` tag into a question and name who can answer it (a customer, the founder, a lawyer, an engineer).
9. **Write the Risks section.** A table with columns Risk, Likelihood (low/medium/high), Impact (low/medium/high), and Mitigation. The first row is always the riskiest assumption: the single belief that, if wrong, means the product should not be built.
10. **Assemble and check.** Output the PRD as Markdown with exactly these `##` headings in this order: Problem, Users, Jobs-to-be-done, Scope, Non-goals, Success metrics, Open questions, Risks, in one to two pages. Re-read it once and remove any sentence that names a technology, vendor, or screen layout; those belong in the design doc.

## Output

A single Markdown document with the eight fixed sections in order, a "Sources" line at the top stating what it was written from ("founder notes dated 9 Sep, one interview summary"), and inline `[ASSUMPTION]` tags wherever the skill filled a gap. Every tag reappears as a question in Open questions, so the founder can answer the list and re-run the skill for a clean second draft.

## Example

Input: "I keep losing track of which contractors I've paid. Maybe an app where I upload invoices and it tells me what's outstanding. Small agencies would want this too."

Excerpt of the output:

```markdown
## Problem
Owners of small agencies pay several contractors a month and track payments in email threads and a spreadsheet. [ASSUMPTION] They discover missed or duplicate payments only when a contractor complains.

## Success metrics
| Metric | Baseline | Target | Window |
| --- | --- | --- | --- |
| Invoices marked paid inside the product | unknown, measure first | majority of uploaded invoices | first 30 days |

## Open questions
- How many contractors does a typical target agency pay per month? (ask 5 agency owners)
```

The other skills in this sequence, from interview notes to a scoped v1, are described in [Claude skills for founders](/guides/founders/claude-skills-for-founders).
