---
name: "content-repurposer"
description: "Turn one long-form piece you paste in (an article, transcript, webinar summary, or case study) into four channel-ready derivatives, an X thread, a LinkedIn post, a newsletter section, and a short-video script, each inside its channel's length and format limits, with every claim and number carried over exactly as written and any statistic the original does not source flagged instead of repeated as fact. Use when a finished piece has to go out on several channels and the derivatives must say only what the original says."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
tags: ["claude", "marketers", "repurposing", "social", "newsletter", "cowork"]
featured: false
related: ["command:repurpose", "skill:brand-voice-profiler", "agent:content-editor", "glossary:ai-slop", "guide:claude-skills-for-marketers", "tool:descript"]
seoDescription: "A Claude skill that turns a long-form piece into an X thread, LinkedIn post, newsletter section, and video script, claims kept exact, unsourced stats flagged."
summary: "Paste an article, transcript, or case study and this skill returns four derivatives sized for their channels: an X thread, a LinkedIn post, a newsletter section, and a 45-to-60-second video script. It first builds a ledger of every claim and number in the source, draws only from that ledger, and flags any statistic the original never sourced."
---

Repurposing is where accurate long-form content turns into inaccurate short-form content: a number gets rounded, a hedge gets dropped, a "some customers" becomes "customers", and a stat that was already unsourced in the original travels to four more places. This skill treats the source as the only permitted material. It inventories every claim first, writes each derivative from that inventory, and then checks the derivatives back against it. It needs only pasted text, so it runs the same on claude.ai, in Claude Code, and in Claude Cowork; in a Claude Code project, [/repurpose](/commands/marketing/repurpose) runs it on a file and writes the outputs to disk.

## When to use this skill

- A blog post, report, or case study is published and the same idea needs to reach social, email, and video this week.
- A webinar or podcast transcript exists and you want the derivatives to quote what was actually said.
- Someone else wrote the piece and you need channel versions that do not drift from it.
- A piece is being reused months later and you need to know which of its numbers still have a source.

> [!NOTE]
> The skill adds nothing to the source: no new examples, no rounded numbers, no stronger adjectives, no context it happens to know. If the original says "most of the teams we surveyed", the thread says that too, not "most teams". Hooks, calls to action, and closing lines the source lacks are written so they make no factual claim. Voice comes from a pasted [brand-voice-profiler](/skills/marketing/brand-voice-profiler) rules block if you supply one, otherwise from the source's own register.

## Instructions

1. **Read the whole source and build the claims ledger.** One row per factual claim, number, quotation, and named entity: the text as written, where it appears, and SOURCED (with the citation) or UNSOURCED. The ledger is the only material the derivatives may use.
2. **Pick the spine.** One sentence the reader should remember, and three to five supporting points, each pointing at ledger rows. Every derivative is built from the same spine so the channels agree with each other.
3. **Write the X thread.** Five to nine posts, each under 280 characters (or the limit the user states), with the character count printed after each post. The first post stands alone and makes a claim from the ledger, not a tease. Numbers appear exactly as in the source. The last post carries `[LINK]` and at most two hashtags.
4. **Write the LinkedIn post.** 150 to 300 words. The first two lines carry the point, because feeds truncate the rest; short paragraphs; no more than one question; one call to action at the end. No engagement-bait openers.
5. **Write the newsletter section.** A subhead, one paragraph of context in the second person, two or three bullets from the supporting points, and one `[LINK]`. 120 to 200 words, ready to drop into an existing issue.
6. **Write the short-video script.** 45 to 60 seconds of speech, about 110 to 150 words, as a three-column table: time, spoken line, on-screen text. The hook lands inside the first three seconds and is a ledger claim, not a question. Mark any place a visual would need a number as `[SHOW: figure from ledger row N]`.
7. **Flag unsourced statistics.** Any UNSOURCED number that appears in a derivative gets an inline `[UNSOURCED]` marker and a row in a closing list, so the owner can source or cut it. Superlatives from the source ("the fastest", "the only") are flagged the same way.
8. **Check the derivatives against the ledger.** Compare every number, name, and quotation in the four outputs to the ledger. Nothing may be rounded, strengthened, or new. Fix drift before returning and note what was fixed.
9. **Assemble** in this order: Claims ledger, Spine, X thread, LinkedIn post, Newsletter section, Video script, Flags, Checks applied.

## Output

One Markdown document with the eight sections above. The four derivatives are ready to paste into their channels once the Flags list is cleared; the ledger stays with the document as the record of what the piece claims and what backs it. The video script can go to an editing tool such as [Descript](/tools/descript); the written derivatives can go to the [content-editor](/agents/marketing/content-editor) agent for a voice and claims pass.

## Example

Excerpt from repurposing a 1,800-word post about onboarding email timing:

```markdown
### Claims ledger
| # | Claim | Location | Status |
| --- | --- | --- | --- |
| 3 | "teams that sent the second email within 24 hours saw higher activation" | para 4 | UNSOURCED (no study or internal data cited) |
| 4 | "we moved our own second email from day 3 to day 1" | para 6 | SOURCED (first-hand) |

### X thread
1/ We moved our second onboarding email from day 3 to day 1. Here is what changed and what did not. (96)
2/ The claim you will read everywhere: send it within 24 hours and activation goes up. [UNSOURCED] We could not find the study behind it. (134)

### Flags
- Ledger row 3 appears in thread post 2 and the newsletter bullet 1. Source it or cut it.
```

The ledger discipline exists to prevent what the [AI slop](/glossary/ai-slop) glossary entry describes; [Claude skills for marketers](/guides/marketing/claude-skills-for-marketers) shows where repurposing sits in the full set.
