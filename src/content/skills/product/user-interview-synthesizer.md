---
name: "user-interview-synthesizer"
description: "Synthesize one or many customer interview transcripts or call notes into themes with participant counts, verbatim representative quotes, jobs-to-be-done statements, contradictions between what people said and did, and the questions to ask next. Never invents, merges, or rewords a quote. Use after a batch of discovery calls when the notes are piling up and you need to know what people actually said before deciding what to build."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
tags: ["claude", "founders", "customer-discovery", "interviews", "product"]
featured: false
related: ["skill:prd-writer", "skill:competitor-teardown", "skill:mvp-scope-cutter", "guide:claude-skills-for-founders", "guide:claude-for-founders"]
seoDescription: "A Claude skill that turns interview transcripts into themes, verbatim quotes, JTBD statements, contradictions, and next questions, without inventing quotes."
summary: "Paste one or many interview transcripts or call notes and this skill returns the themes with how many participants raised each, representative quotes copied verbatim with a participant label, jobs-to-be-done statements traced to sources, a table of contradictions, and the questions to ask in the next round. Quotes are never invented, merged, or reworded."
---

After five or ten discovery calls, the notes stop being useful as notes. You remember the last call best, the loudest participant most, and the quote that confirmed what you already believed. This skill reads every transcript you paste with the same attention and reports what was actually said: which themes came up and how often, the exact words used, where people contradicted each other or themselves, and what you still do not know. It works on pasted text alone, with no tools or web access, so it runs on claude.ai, in Claude Code, and in Claude Cowork.

## When to use this skill

- You have finished a round of customer or user interviews and need a summary you can trust.
- You are about to write a PRD and want the problem section grounded in what people said; the [prd-writer](/skills/product/prd-writer) skill takes this skill's output as input.
- A cofounder was not on the calls and needs the evidence, not your recollection.
- You suspect the calls confirmed a belief you walked in with and want a reader that only counts what is on the page.
- You are planning the next round and want questions that target gaps rather than repeat the last script.

> [!NOTE]
> This skill reports evidence. It does not decide what to build, rank features, or estimate market size. Two things it will not do: turn a note-taker's paraphrase into a quotation, and write a quote that "sounds like" what a participant meant. Where no verbatim quote exists for a theme, it says so.

## Instructions

1. **Inventory the sources.** For each pasted document, assign a participant label (P1, P2, and so on, or the founder's own labels if given), note the participant's role or context, and classify the document as VERBATIM (a transcript or recording export) or NOTES (a summary written by a note-taker). Print the inventory first. Quotes may only be lifted from VERBATIM sources; from NOTES you may cite an observation, labeled as "(note, P3)", never in quotation marks.
2. **Code every relevant statement.** Extract from each source every statement about a pain, a workaround, a goal, a current tool, a cost, or an emotional reaction, with its participant label. Keep the participant's wording; do not summarize yet.
3. **Separate behavior from opinion.** Mark each statement BEHAVIOR (something the participant described doing, usually past tense: "last month I exported the sheet and emailed it") or OPINION (something they would want, would pay for, or think is a good idea). Behavior is stronger evidence; the report weights it accordingly and says so.
4. **Cluster into themes.** Group the coded statements into three to seven themes. Each theme gets a one-line name written in the participants' language, a count in the form "raised by X of N participants", the evidence mix (for example "4 behavior, 2 opinion"), and one to three representative quotes. Count each participant once per theme, however often they said it.
5. **Copy quotes exactly.** A representative quote is copied character for character from a VERBATIM source, wrapped in quotation marks, and attributed to its participant label. You may shorten with an ellipsis; you may not fix grammar, swap words, or combine two sentences from different places. If a theme has only NOTES sources, write "no verbatim quote available" under it.
6. **Derive jobs-to-be-done statements.** Two to five, in the form "When [situation], I want to [motivation], so I can [outcome]." Under each, list the participant labels whose statements support it. Mark any job with a single supporting participant.
7. **Build the contradictions table.** Columns: Topic, Position A (with labels), Position B (with labels), What would resolve it. Include both disagreements between participants and cases where one participant's stated preference conflicts with their described behavior; the second kind is usually the more important finding.
8. **Write the next questions.** Five to eight questions for the next round, each tied to a gap, a contradiction, or a theme supported only by opinion, phrased as open, past-tense questions ("tell me about the last time you...") rather than "would you use...".
9. **State the confidence.** End with N, the mix of VERBATIM and NOTES sources, and an honest reading of what the sample can support ("N=4, all from one referral, treat as directional").

## Output

A source inventory, the themes with counts and verbatim quotes, the jobs-to-be-done list with supporting labels, the contradictions table, the next-round questions, and the confidence line. Everything traces to a participant label, so a reader can open the transcript and check any claim.

## Example

Excerpt from a run over four transcripts and one set of notes:

```markdown
### Theme 2: Chasing invoices by email (raised by 4 of 5; 4 behavior, 0 opinion)
- "I have a folder called 'paid?' and honestly half of it is wrong" (P1)
- "…ended up paying the same guy twice in March" (P3)

### Contradictions
| Topic | Position A | Position B | What would resolve it |
| --- | --- | --- | --- |
| Willingness to upload every invoice | P2 says they would (opinion) | P2 described never opening their accounting tool (behavior) | Ask P2 to walk through last week's invoices live |
```

[Claude skills for founders](/guides/founders/claude-skills-for-founders) shows where this sits in a founder's week and pairs it with the [competitor-teardown](/skills/product/competitor-teardown) skill for the outside-in view.
