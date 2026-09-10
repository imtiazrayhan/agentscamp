---
name: "ux-copy-reviewer"
description: "Review a set of interface strings you paste in (buttons, labels, empty states, errors, confirmations, tooltips) as one set rather than one at a time, checking clarity, term consistency across screens, error and empty-state quality, whether each action label matches what happens, and length against any limits you supply, and returning a verdict and a rewrite per string without inventing a product fact the strings do not contain. Use when microcopy has accumulated across a product and nobody has read it end to end."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
tags: ["claude", "designers", "ux-writing", "microcopy", "cowork"]
featured: false
related: ["skill:design-critique-checklist", "skill:component-spec-writer", "agent:accessibility-auditor", "guide:claude-skills-for-designers", "guide:claude-design-guide"]
seoDescription: "A Claude skill that reviews pasted UI microcopy as a set: clarity, consistency, errors, empty states, action labels, and length, with a rewrite per string."
summary: "Paste your UI strings, optionally with a tone table and character limits, and this skill reviews them as a set: clarity, term consistency across screens, error and empty-state quality, whether each action label matches its outcome, and length. It returns a verdict and a rewrite per string, and flags anything a rewrite would require inventing."
---

Microcopy fails as a set, not as a sentence. One screen says "workspace", the next says "team"; one error explains itself and the next says "Something went wrong"; a button labeled "Submit" sends an email that cannot be recalled. This skill reads all your strings at once and reports on them as a system. It never invents a product fact to make a rewrite read better; where a rewrite needs information the strings do not contain, it names that information instead. Pasted text is all it requires, so it runs the same on claude.ai, in Claude Code, and in Claude Cowork. Anthropic's [design plugin](/guides/design/claude-design-plugin-guide) ships a `ux-copy` skill that writes and reviews copy conversationally; this one only reviews, as a fixed pass over a whole set.

## When to use this skill

- A feature is copy-complete and the strings need one read before they ship.
- Error and empty states were written last, in a hurry, and nobody has read them together.
- A [design critique](/skills/design/design-critique-checklist) flagged copy and you want the strings read properly.

> [!NOTE]
> The skill reviews the strings you provide against the context you provide. It will not state what a feature does, what a plan includes, or what caused an error unless your input says so; where a rewrite needs a fact, the row says `NEEDS FACT` and names it. Paste a tone table (axes and targets, such as the one the [brand-voice-profiler](/skills/marketing/brand-voice-profiler) skill produces) and tone becomes a scored column; without one, tone is not judged.

## Instructions

1. **Build the inventory.** Number every string and record its type (button, link, heading, helper text, placeholder, empty state, error, confirmation, tooltip, toast) and its screen if you were told. Note any character limits supplied; if types are unclear, group by best guess and say so.
2. **Build the term glossary first.** Every noun the strings use for a product concept, with each variant and where it appears. This is the highest-value output: "workspace (3), team (2), organization (1)" is a decision the product owes its users. Recommend one term and say which strings change.
3. **Check clarity, one string at a time.** Would a first-time user know what this does, without the rest of the screen? Flag jargon, internal names, ambiguous pronouns, negations, and strings describing the system's behavior rather than the user's situation.
4. **Check the action labels.** Every button, link, and menu item: does the label name the outcome? Flag "Submit", "OK", and "Continue" wherever a verb phrase would fit, and any destructive action whose label does not say what is destroyed. Confirmation dialogs are checked as a pair: question and button must agree.
5. **Check the error messages.** Each should say what happened, why if that is knowable, and what the user can do next. Mark any error that only apologizes, blames the user, or exposes an internal code without a human sentence. Where the cause is not in your input, the row is `NEEDS FACT`, not a guess.
6. **Check the empty states.** Each should say what belongs here and how to add the first one. "No results" alone is a finding; one that needs the primary action to improve is `NEEDS FACT`.
7. **Check length.** Against supplied limits; otherwise flag button labels over about four words, headings over eight, and helper text over two lines, as candidates rather than errors.
8. **Score tone** only if a tone table was supplied: one row per axis, naming the strings that pull from the target.
9. **Write the rewrites.** One per flagged string: same meaning, no new facts, inside the length limit. Where two are defensible, give both and say what decides.
10. **Assemble**: Glossary decisions, the per-string table (Number, Type, Original, Issue, Severity, Rewrite), the `NEEDS FACT` list, and a short "Reads well" list.

## Output

A Markdown report: glossary decisions first (they change the most strings), then the per-string table, then the facts the rewrites need. Severity is deterministic: **High** where a user could take the wrong action or be blocked; **Medium** where the string is unclear or inconsistent; **Low** where it is only long or plain. Final strings carry into the [component-spec-writer](/skills/design/component-spec-writer) spec so they ship with the props.

## Example

```markdown
## Glossary decisions
| Concept | Variants found | Recommend | Strings to change |
| --- | --- | --- | --- |
| Shared container | workspace (3), team (2), org (1) | workspace | 12, 14, 19, 22, 31 |

| # | Type | Original | Issue | Severity | Rewrite |
| --- | --- | --- | --- | --- | --- |
| 7 | Button | "Submit" | Label does not name the outcome; dialog says "Delete project?" | High | "Delete project" |
| 18 | Error | "Something went wrong." | No cause, no next step | High | NEEDS FACT: what failed and what can be retried |
| 24 | Empty | "No results" | Does not say what belongs here | Medium | "No invoices yet. Create your first invoice to see it here." |
```

The rest of the designer set is covered in [Claude skills for designers](/guides/design/claude-skills-for-designers), and where copy review sits in a wider workflow in the [Claude Design guide](/guides/design/claude-design-guide). Strings that are hard to read rather than hard to understand are a contrast question for the [accessibility-auditor](/agents/quality-security/accessibility-auditor).
