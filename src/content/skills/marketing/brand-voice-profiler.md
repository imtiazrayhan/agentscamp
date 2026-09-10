---
name: "brand-voice-profiler"
description: "Derive a reusable brand voice guide from five to ten writing samples you paste in: tone axes scored with quoted evidence, use and avoid vocabulary, sentence rhythm, formatting habits, dos and don'ts, three before/after rewrites, and a rules block ready to paste into a SKILL.md, with every rule traced to a sample and disagreements between samples flagged instead of averaged. Use when your team writes in a recognizable voice that nobody has written down, or the guide you have was never derived from what you actually publish."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
tags: ["claude", "marketers", "brand-voice", "style-guide", "cowork"]
featured: false
related: ["command:brand-check", "guide:brand-voice-with-claude-skills", "glossary:brand-voice", "skill:content-repurposer", "guide:claude-skills-for-marketers", "guide:writing-your-first-skill"]
seoDescription: "A Claude skill that derives a brand voice guide from 5-10 pasted samples: tone axes, vocabulary, rhythm, dos and don'ts, and a paste-ready SKILL.md rules block."
summary: "Paste five to ten pieces of your published writing and this skill derives a voice guide from them alone: tone axes scored with quotes, use and avoid vocabulary, sentence rhythm, formatting habits, dos and don'ts, three before/after rewrites, and a rules block to paste into a SKILL.md or brand-voice.md. Where samples disagree, it says so instead of averaging."
---

Anthropic's [marketing plugin](https://github.com/anthropics/knowledge-work-plugins) ships a `brand-review` skill that checks content against a brand guide you already have; with no guide configured, it asks for one or falls back to a general quality pass. This skill works from the other direction: you paste five to ten pieces your team actually published, and it derives the guide. Every rule points to a sample, disagreements are reported rather than averaged away, and the result ends in a rules block you can paste into a `SKILL.md`, a `CLAUDE.md`, or a `brand-voice.md` that the [/brand-check](/commands/marketing/brand-check) command reads. It needs only pasted text, so it runs the same on claude.ai, in Claude Code, and in Claude Cowork (the plugin is covered in the [Claude marketing plugin guide](/guides/marketing/claude-marketing-plugin-guide)).

## When to use this skill

- Your team writes in a recognizable voice nobody has written down, and new hires, agencies, and AI assistants keep producing copy that sounds wrong.
- Your brand guide is a slide of adjectives ("bold, human, clear") that nobody can apply to a sentence.
- You are about to install the marketing plugin or build your own brand skill (see [Brand voice with Claude skills](/guides/marketing/brand-voice-with-claude-skills)) and need the guide it will enforce.
- Two channels have drifted and you want the difference shown, not felt.

> [!NOTE]
> The guide is derived only from the samples you paste. The skill adds no rules from general copywriting advice, from your industry, or from a competitor's voice, and it does not describe a voice you would like to have. To change the guide, change the samples. Fewer than five samples produces a guide labeled PROVISIONAL with the thin sections named.

## Instructions

1. **Inventory the samples.** Number each one and record its channel, rough length, date if given, and whether they share an author. Fewer than five samples, or more than one clear author, is stated at the top and the guide is labeled PROVISIONAL.
2. **Score the tone axes.** Rate the set 1 to 5 on five axes: formal to casual, serious to playful, reserved to bold, technical to plain, detached to warm. Quote one or two phrases per score as evidence, with sample numbers. If samples sit more than two points apart on an axis, record the spread and carry it to step 7.
3. **Build the vocabulary lists.** *Use*: words and phrases found in two or more samples, with counts and one example each, including how the product, the customer, and the company are named. *Avoid*: only words the samples visibly steer around, or words in a single sample that clash with the rest. No imported banned-words list.
4. **Describe the sentence rhythm.** Typical sentence length as a range, the longest and shortest sentences quoted, paragraph length, how sentences open, and whether fragments and one-line paragraphs appear. One short paragraph, numbers from the samples.
5. **Record the formatting habits.** Heading case, bold and italics, bullets versus prose, emoji, numerals versus words, contractions, the Oxford comma, sign-offs. One line per habit, with a sample reference.
6. **Write the dos and don'ts.** Five to eight of each, as instructions a writer can obey ("Open with the reader's situation, not the product name"), each followed by the sample number that shows it. A don't must come from something the samples avoid or a clash from step 3.
7. **Report inconsistencies.** Every place the samples disagree: an axis spread, one sample with emoji when four have none, two names for the product. For each, state the majority behavior (the rule), the minority by sample, and the question for the owner.
8. **Write three before/after examples.** Take three sentences in a neutral corporate register (write them if none were supplied) and rewrite each in the derived voice, naming the rules applied under each pair.
9. **Produce the rules block.** A fenced Markdown block of at most 25 lines: a header comment with the sample count and date, then imperative rules for tone, vocabulary, rhythm, and formatting, in that order, pasteable as-is into a `SKILL.md`, `CLAUDE.md`, or `brand-voice.md`.
10. **Assemble**: Samples, Tone axes, Vocabulary, Rhythm, Formatting, Dos and don'ts, Inconsistencies, Examples, Rules block.

## Output

A Markdown voice guide with the nine sections above, two to three pages. Save it as `brand-voice.md` in a project and [/brand-check](/commands/marketing/brand-check) will score drafts against it; the [content-repurposer](/skills/marketing/content-repurposer) and [email-sequence-drafter](/skills/marketing/email-sequence-drafter) skills accept the rules block as input.

## Example

Excerpt of a guide derived from six samples (four blog posts, two onboarding emails):

```markdown
### Tone axes
Formal 1 ---- 5 Casual: **4**. Evidence: "Here's the thing nobody tells you" (S2), "you'll be fine" (S5)
Technical 1 ---- 5 Plain: **2**. Evidence: samples name the API method and the config key (S1, S3)

### Inconsistencies
- Emoji: S5 and S6 (emails) open with one emoji; S1 to S4 use none. Rule: none on the blog, one in an email opener. Owner to confirm.

### Rules block
<!-- derived from 6 samples, 2026-09-10 -->
- Write to one reader as "you"; refer to the company as "we", never by name mid-sentence.
- Keep most sentences under 18 words; allow one long sentence per paragraph.
```

The [Brand voice with Claude skills](/guides/marketing/brand-voice-with-claude-skills) guide shows how to turn this file into a skill your whole team shares (mechanics in [Writing your first skill](/guides/skills/writing-your-first-skill)); [Claude skills for marketers](/guides/marketing/claude-skills-for-marketers) covers the rest of the set, and the [brand voice](/glossary/brand-voice) glossary entry defines the term.
