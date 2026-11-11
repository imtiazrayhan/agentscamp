---
name: "geo-content-auditor"
title: "GEO Content Auditor"
description: "Audit one published page or draft for answer-engine and LLM-citation readiness: an answer-first lead, question-shaped headings each answered in their first sentence, one fact per sentence, figures with a date and a source beside them, definitions that can be quoted whole, consistent entity names, and a visible FAQ block, then return a pass-or-fix scorecard and an ordered rewrite plan with replacement text. Use when you want to know why a page is not being quoted by AI Overviews or chat assistants and what to change in the prose, not in the markup or the crawl setup."
version: "1.0.0"
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
color: "cyan"
date: 2026-10-19
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers", "developers"]
tags: ["claude", "seo", "geo", "aeo", "ai-search", "marketers"]
featured: false
related: ["glossary:generative-engine-optimization", "glossary:answer-engine-optimization", "skill:schema-markup-generator", "skill:seo-technical-auditor", "skill:seo-content-brief-writer", "agent:content-editor", "agent:seo-specialist", "command:seo-check", "guide:best-claude-skills-for-seo", "guide:ai-content-and-search-2026"]
seoDescription: "A Claude skill that audits one page for AI-citation readiness: answer-first lead, question headings, dated figures, liftable definitions, and a visible FAQ."
summary: "Give this skill one page and it checks the eight prose properties that let an answer engine quote it correctly: answer-first lead, question-shaped headings, one fact per sentence, dated and sourced figures, standalone definitions, consistent entity names, a visible FAQ, and a visible date. It returns a scorecard with quoted evidence and a rewrite plan."
---

[Generative engine optimization](/glossary/generative-engine-optimization) and [answer engine optimization](/glossary/answer-engine-optimization) come down to a plain question: if a model had thirty seconds with this page, could it lift a correct, attributable answer? This skill audits one page for that. It reads the rendered text, checks eight properties of the prose that make a passage quotable (not the markup, not the crawl plumbing), scores each pass or fix with the sentence that earned the verdict, and returns a rewrite plan ordered by effect. It never promises a citation; nobody can. It makes the page easy to quote correctly.

## When to use this skill

- A page ranks but does not appear in AI Overviews or assistant answers for the question it targets.
- You are refreshing an article and want the structural edits before the content edits.
- A draft written from a [seo-content-brief-writer](/skills/marketing/seo-content-brief-writer) brief is finished and you want the lead, headings, and FAQ checked before the [content-editor](/agents/marketing/content-editor) agent does the claims pass.
- A definition page or glossary entry should become the sentence a model repeats.

## When NOT to use this skill

- Titles, canonicals, sitemaps, redirects: the [seo-technical-auditor](/skills/marketing/seo-technical-auditor) skill.
- Writing or validating JSON-LD for a visible FAQ: the [schema-markup-generator](/skills/marketing/schema-markup-generator) skill. This skill tells you whether the FAQ exists and reads well; that one marks it up.
- Fact-checking claims or fixing voice: the [content-editor](/agents/marketing/content-editor) agent and the [/brand-check](/commands/marketing/brand-check) command.
- A whole site: run this per page, or ask the [seo-specialist](/agents/marketing/seo-specialist) agent, which samples pages and applies this skill to each.

## Instructions

1. **Get the text as a reader sees it.** For a URL, `curl -sL` and reduce to the main content; for a Markdown file, read the body plus any frontmatter `summary`, `description`, and `faq` fields that the site renders visibly. Write down the primary question the page answers and its main entity (a product, a concept, a person) in one line each. If you cannot, that is the first finding.
2. **Answer-first lead.** Take the first paragraph after the H1, or the visible summary. Can it stand alone as the answer to the primary question in roughly 40 to 60 words, naming the entity? Quote it. A lead that opens with scene-setting or with a promise ("In this guide you will learn") is a fix.
3. **Question-shaped headings.** List every H2 and H3. Is each one a question people type, or a noun phrase a model would match to one ("How X differs from Y", "X pricing", "X vs Y")? Does the first sentence under it answer it? Mark headings that are clever rather than literal, and sections whose answer arrives in the third paragraph.
4. **One fact per sentence.** Sample the key paragraphs: the lead, the first paragraph under each H2, the conclusion. Flag sentences carrying two claims joined by "and" or "while", and sentences that borrow their subject from the previous one ("It also supports…"). A quoted sentence loses its neighbours; each must survive alone.
5. **Dated and sourced figures.** Find the numbers, for example `rg -n '[0-9][0-9,.]*\s?(%|percent|million|billion|ms|x\b)' page.md`, and read each hit. A figure needs a date (a year, an "as of", or a dated source) and a source (a link or a named publication) in the same sentence or the next. Flag the undated and the unsourced; a model that quotes them attaches your name to a stale or unverifiable number.
6. **Liftable definitions.** For the main entity and each term the page introduces, look for a sentence shaped "X is a <category> that <distinguishing property>", with the term, not a pronoun, as the subject. A definition that is absent, split across sentences, or buried in a parenthesis is a fix; write the replacement.
7. **Entity naming.** The first mention in each major section uses the full name (product with vendor, person with role, acronym expanded once). Flag long stretches of "the tool", "the platform", and "it", and any inconsistent spelling or casing of the entity.
8. **FAQ block and freshness.** Is there a visible section of questions phrased the way people ask them ("How much does X cost?", not "Pricing?"), each answered in 40 to 60 words with the entity named in the answer? If frontmatter `faq` entries exist but do not render, say so: hidden FAQ is a markup problem, not an answer. Note whether the page shows a publication or updated date.
9. **Write the plan.** Order the fixes: lead first, then definitions, then headings, then figures, then FAQ, then sentence-level edits. For the top three, write the replacement text. Keep every fact exactly as it was; this skill restructures, it does not invent.

> [!WARNING]
> Never manufacture an FAQ, a statistic, or a date to satisfy a check. An invented "as of" date is worse than none, because a model that cites it spreads the error under your name. When a figure has no source, the fix is to find one or cut the figure.

> [!NOTE]
> Passing all eight checks does not guarantee a citation; engines choose sources for reasons nobody outside them can see. The checks remove the reasons a page gets skipped or misquoted.

## Output

A scorecard table with one row per check (Check, Verdict, Evidence quoted from the page), the ordered rewrite plan, replacement text for the top three items, and a list of figures that need a date or a source. For a page that passes, say so briefly; a short plan is a legitimate result.
