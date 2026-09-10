---
name: "seo-content-brief-writer"
description: "Write an SEO content brief from a target keyword plus the SERP notes and competitor outlines you paste in: search intent with evidence, an angle the ranking pages under-serve, an H2/H3 outline, the entities and questions to cover, internal-link placeholders, a length-checked meta title and description, and a word-count target explained by the SERP rather than a rule of thumb. Use when a writer or a coding agent needs a brief before drafting an article and you do not want search volumes, difficulty scores, or rankings invented."
version: "1.0.0"
color: "cyan"
date: 2026-09-10
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
tags: ["claude", "marketers", "seo", "content-brief", "cowork"]
featured: false
related: ["agent:content-editor", "skill:landing-page-copywriter", "skill:web-research-pipeline", "guide:seo-content-workflow-with-claude-code", "guide:claude-skills-for-marketers", "glossary:ai-overviews"]
seoDescription: "A Claude skill that turns a keyword plus pasted SERP notes into a content brief: intent, angle, H2/H3 outline, entities, questions, internal links, meta tags."
summary: "Give this skill a target keyword and your pasted SERP notes or competitor outlines and it returns a content brief: search intent, an angle the ranking pages under-serve, an H2/H3 outline, entities and questions to cover, internal-link placeholders, length-checked meta tags, and a word-count target with reasoning. It never invents search volumes or rankings."
---

Most content briefs are a keyword, a word count, and "make it better than the top three". This skill takes what you have gathered about a search results page (titles, formats, snippets, People Also Ask questions, competitor outlines, lengths) and turns it into a brief a writer or a coding agent can draft from without guessing at intent. It works from pasted notes only: it does not query a search engine or an SEO tool, and it never states a search volume, keyword difficulty, or ranking position. It runs the same on claude.ai, in Claude Code, and in Claude Cowork.

## When to use this skill

- You have a keyword list from Search Console or a tool such as [Surfer](/tools/surfer) or [Clearscope](/tools/clearscope) and need one brief per keyword.
- A writer keeps producing articles that read well and rank nowhere, and you suspect the problem is intent, not prose.
- You run the [SEO content workflow with Claude Code](/guides/marketing/seo-content-workflow-with-claude-code) and want the brief step to produce the same shape every time.
- A page already exists and needs a refresh: paste its current outline as a competitor.

> [!NOTE]
> The brief is only as good as the SERP notes. A keyword with nothing else still gets a brief, labeled PROVISIONAL, with intent inferred from the keyword alone and every entity and question marked INFERRED. In Claude Code with web access, the [web-research-pipeline](/skills/data/web-research-pipeline) skill can collect the notes for you. Volumes and difficulty still come from your SEO tool, never from this skill.

## Instructions

1. **Inventory the inputs.** Record the target keyword, any secondary keywords, the SERP notes with their capture date, each competitor outline by URL or label, and any list of your own pages. A missing category is written as "not provided" and becomes a flag, not a guess.
2. **Classify the intent.** Informational, commercial investigation, transactional, or navigational, with evidence from the notes: what formats rank, what the titles promise, whether a featured snippet or an [AI overview](/glossary/ai-overviews) was noted. For a mixed SERP, name the dominant and secondary intent. If the dominant intent is transactional, say so and point to the [landing-page-copywriter](/skills/marketing/landing-page-copywriter) skill; an article will not serve it.
3. **Choose the angle.** One sentence each: what every ranking page does, what none of them does, and the promise your page makes that the SERP under-serves. The angle must fit the intent; a contrarian take on an informational query is a different article, not a better one.
4. **Write the outline.** A working H1, then H2 and H3 headings ordered by what the searcher needs first. Under each H2, one line stating what the section must contain and which competitors cover it ("C1, C3") or "GAP" if none do. The direct answer goes first.
5. **List entities and questions.** Entities are the products, people, concepts, and terms found in two or more competitor outlines; questions come from the People Also Ask notes. Map each to an outline section. Anything added from reasoning rather than the notes is tagged INFERRED.
6. **Suggest internal links.** For each section that needs one, write `[INTERNAL: topic, suggested anchor text]`. If the user supplied a page list, replace the placeholder with the matching URL; otherwise leave it for the site owner.
7. **Write the meta title and description.** Two variants of each: title 50 to 60 characters with the keyword near the front, description 120 to 155 characters with the keyword once and a reason to click. Print the character count after each line. A variant outside the range is rewritten, not shipped with a warning.
8. **Set the word-count target.** If the notes include competitor lengths, state the range and the median. Recommend a range that covers the outline, with the reason ("seven H2s; 1,600 to 2,000 words covers them without padding"). Never default to matching the longest competitor. Without length data, say so and size from the outline alone.
9. **Assemble**: Sources, Intent, Angle, Outline, Entities and questions, Internal links, Meta, Length, Notes for the writer. The last section lists claims the writer must verify and anything the SERP suggests the page should not contain.

## Output

A one-to-two-page Markdown brief with the nine sections above. Every judgment cites the notes or carries an INFERRED tag, and every placeholder is a bracketed token someone can search for. Hand it to the writer or to a Claude Code drafting session; once the draft exists, the [content-editor](/agents/marketing/content-editor) agent edits it against the brief and marks the claims that need sources.

## Example

Excerpt of a brief for the keyword "email warmup", from notes captured on 2 September 2026:

```markdown
### Intent
Informational, secondary commercial. Evidence: 7 of 10 results are guides; 2 are tool pages; 1 comparison.

### Angle
Every page explains what warmup is and lists tools. None shows a week-by-week volume schedule. Promise: the schedule, with reasoning, before any tool is named.

### Meta
Title A: Email Warmup: A 4-Week Schedule That Works (42)
Description A: What email warmup is, why new domains need it, and a week-by-week sending schedule you can copy. No tool required to start. (123)

### Length
Competitor lengths: 900 to 2,400, median 1,500. Target 1,500 to 1,900: six H2s plus the GAP schedule table.
```

The wider workflow is in [Claude skills for marketers](/guides/marketing/claude-skills-for-marketers), and [AI content and search in 2026](/guides/marketing/ai-content-and-search-2026) covers how AI-generated results change what a brief aims for.
