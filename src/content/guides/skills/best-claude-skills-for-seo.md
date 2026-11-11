---
title: "9 Best Claude Skills for SEO (and AI Search)"
description: "Compare Claude skills, commands, and agents for technical SEO audits, structured data, answer-engine readiness, llms.txt, content briefs, landing pages, Core Web Vitals, and brand voice."
author: "Imtiaz Rayhan"
date: "2026-10-19"
color: "green"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers", "developers"]
tags: ["claude-skills", "seo", "aeo", "geo", "ai-search", "best-of"]
seoTitle: "9 Best Claude Skills for SEO (and AI Search)"
seoDescription: "The best Claude skills for SEO and AI search: technical audits, JSON-LD, answer-engine readiness, llms.txt, content briefs, Core Web Vitals, and brand voice."
summary: "Match the skill to the layer: seo-technical-auditor for crawl hygiene, schema-markup-generator for JSON-LD, geo-content-auditor for quotable prose, and llms-txt-generator for the model-facing site map. For the content itself add seo-content-brief-writer, landing-page-copywriter, content-repurposer, web-vitals-optimizer, and brand-voice-profiler."
keyTakeaways:
  - "SEO work splits into four layers, crawl hygiene, structured data, prose structure, and the model-facing site map, and each of the first four picks owns exactly one of them."
  - "None of these skills invents a search volume, a ranking, or a citation; they work from your files, your build output, and the notes you paste in."
  - "Answer-engine readiness is mostly prose structure: an answer-first lead, question-shaped headings, one fact per sentence, dated figures, and a visible FAQ."
  - "Structured data must describe content a visitor can see; the schema skill refuses to mark up hidden or absent content because a manual action costs more than a missing rich result."
  - "Use /seo-check for one page, the skills for one job each, and the seo-specialist agent when you want a ranked plan across many pages."
faq:
  - q: "Is there a Claude skill for SEO?"
    a: "Yes, several. seo-technical-auditor audits a site's build output for titles, canonicals, headings, sitemap, robots, redirects, link depth, and alt text. schema-markup-generator writes and validates JSON-LD. geo-content-auditor checks one page for answer-engine readiness, and seo-content-brief-writer turns a keyword and SERP notes into a brief. The /seo-check command runs a quick single-page pass."
  - q: "What is the difference between SEO, AEO, and GEO skills?"
    a: "SEO skills here cover crawlability and on-page signals for search engines. Answer engine optimization (AEO) and generative engine optimization (GEO) cover whether an AI answer feature or chat assistant can lift a correct, attributable passage from the page. geo-content-auditor handles that prose layer; seo-technical-auditor and schema-markup-generator handle the classic layers."
  - q: "Can Claude skills get my page cited in AI Overviews or ChatGPT?"
    a: "No skill can promise a citation, and these do not claim to. geo-content-auditor removes the structural reasons a page gets skipped or misquoted: a lead that does not answer, headings that are clever rather than literal, undated figures, and definitions that cannot stand alone. llms-txt-generator adds a curated reading guide for models that look for one."
  - q: "Do these skills need an SEO tool subscription?"
    a: "No. They work from your repository, your build output, and the notes you paste in. Search volumes, keyword difficulty, and rank tracking still come from your SEO tool; seo-content-brief-writer explicitly refuses to invent them, and the seo-specialist agent reports no traffic data when you have not supplied an export."
  - q: "Should I use a command, a skill, or the seo-specialist agent?"
    a: "Use /seo-check for one page and a pass-or-fix table in one pass. Use a skill when you already know the job: the technical audit, the JSON-LD, the prose structure, or the llms.txt file. Use the seo-specialist agent when you want all of them run across a site and returned as one plan ranked by effect and effort."
sources:
  - title: "The /llms.txt file"
    url: "https://llmstxt.org/"
    publisher: "llmstxt.org"
  - title: "General structured data guidelines"
    url: "https://developers.google.com/search/docs/appearance/structured-data/sd-policies"
    publisher: "Google Search Central"
  - title: "Schema Markup Validator"
    url: "https://validator.schema.org/"
    publisher: "Schema.org"
related: ["skill:seo-technical-auditor", "skill:schema-markup-generator", "skill:geo-content-auditor", "skill:llms-txt-generator", "skill:seo-content-brief-writer", "skill:landing-page-copywriter", "skill:content-repurposer", "skill:web-vitals-optimizer", "skill:brand-voice-profiler", "agent:seo-specialist", "agent:content-editor", "command:seo-check", "command:llms-txt", "command:brand-check", "guide:seo-content-workflow-with-claude-code", "guide:ai-content-and-search-2026", "guide:claude-skills-for-marketers", "glossary:answer-engine-optimization", "glossary:generative-engine-optimization", "glossary:llms-txt"]
---

The best Claude skill for SEO depends on which layer of the job is broken. Crawl hygiene (canonicals, sitemaps, redirects) is a different problem from structured data, which is different again from whether the prose on a page can be lifted by an AI answer feature and attributed to you. Asking Claude to "improve SEO" without naming the layer gets you generic advice; naming it gets you a findings table.

The nine picks below cover those layers in order: the technical plumbing, the markup, the prose, the model-facing site map, and then the content skills that feed all four. Four of them were added this month for the technical and [AI search](/guides/marketing/ai-content-and-search-2026) side; five come from the existing marketing and performance sets. Commands and agents that tie them together follow the list.

| Skill | Best for | Typical artifact | Writes files? |
| --- | --- | --- | --- |
| [seo-technical-auditor](/skills/marketing/seo-technical-auditor) | Site-wide crawl and on-page hygiene | Findings table by severity | No |
| [schema-markup-generator](/skills/marketing/schema-markup-generator) | JSON-LD from visible content | Validated `@graph` block | Only when asked to insert |
| [geo-content-auditor](/skills/marketing/geo-content-auditor) | One page's answer-engine readiness | Scorecard and rewrite plan | No |
| [llms-txt-generator](/skills/docs/llms-txt-generator) | A current llms.txt | `public/llms.txt` | Yes |
| [seo-content-brief-writer](/skills/marketing/seo-content-brief-writer) | A brief before drafting | Nine-section brief | No |
| [landing-page-copywriter](/skills/marketing/landing-page-copywriter) | Pages with commercial intent | Full section set with proof markers | No |
| [content-repurposer](/skills/marketing/content-repurposer) | Distribution of a finished piece | Four channel derivatives | No |
| [web-vitals-optimizer](/skills/performance/web-vitals-optimizer) | LCP, CLS, and INP failures | One targeted fix per metric | Yes |
| [brand-voice-profiler](/skills/marketing/brand-voice-profiler) | A voice guide from real samples | Rules block for a SKILL.md | No |

## 1. seo-technical-auditor: check the plumbing across the whole site

[seo-technical-auditor](/skills/marketing/seo-technical-auditor) audits built output when a build is cheap and source when it is not, and says which one it used. It extracts every page's title, meta description, canonical, robots directive, heading sequence, JSON-LD blocks, images, and internal links, then applies fixed rules: title 50 to 60 characters and unique, description 120 to 155 and unique, one H1, no skipped heading level, a self-referencing canonical on the production host, no `noindex` on a page the sitemap lists. It diffs the sitemap against the real routes, traces redirect chains with `curl`, and runs a breadth-first search from the home page to find orphans and pages more than three clicks deep.

Severity is a rule rather than a judgment: anything that blocks indexing or sends it to the wrong URL is High, duplicates and orphans are Medium, lengths and alt text are Low. It reports presence of JSON-LD only; correctness belongs to the next pick.

## 2. schema-markup-generator: JSON-LD from what the page shows

[schema-markup-generator](/skills/marketing/schema-markup-generator) starts from one rule: every value in the markup must correspond to something a visitor can see. It reads the rendered page, names the primary type (Article or TechArticle, FAQPage, HowTo, SoftwareApplication, Product, BreadcrumbList, Organization), fills required and then recommended properties from the H1, the byline, the visible FAQ, or the printed price, and leaves out anything the page does not show. The nodes go in one `@graph` with stable `@id` values so Organization, WebPage, and BreadcrumbList reference each other instead of repeating.

It validates three ways, JSON syntax, the Schema.org validator, and Google's Rich Results Test, and it checks what the template already emits before adding anything, since two Article nodes with different dates are worse than one. It also audits an existing block, listing every value that has no visible counterpart.

## 3. geo-content-auditor: make the page quotable

[geo-content-auditor](/skills/marketing/geo-content-auditor) is the [answer engine optimization](/glossary/answer-engine-optimization) and [generative engine optimization](/glossary/generative-engine-optimization) pick, and it is deliberately narrow: one page, the prose only. It checks eight properties that let a model lift a passage correctly: a lead that answers the primary question in roughly 40 to 60 words, headings shaped as questions or searchable noun phrases with the answer in their first sentence, one fact per sentence, figures with a date and a source in the same breath, definitions in the form "X is a category that property", consistent entity naming, a visible FAQ, and a visible date.

Each row of its scorecard quotes the sentence that earned the verdict, and the rewrite plan includes replacement text for the top three fixes. It will not manufacture a FAQ, a statistic, or an "as of" date to pass a check; when a figure has no source, the fix is to find one or cut it.

## 4. llms-txt-generator: a reading guide for models

[llms-txt-generator](/skills/docs/llms-txt-generator) builds the [llms.txt](/glossary/llms-txt) file from what the site already declares, preferring a docs navigation config over the sitemap over the route tree, because the navigation already encodes a human's grouping. It writes the llmstxt.org shape: an H1, a blockquote summary from the README, H2 sections of links with one-line descriptions copied from each page's own metadata, and an Optional section for changelogs and legal pages. Pages with no description are reported, not described from imagination.

It verifies every link with `curl`, emits `llms-full.txt` only on request, and on later runs refreshes the link lists while leaving the hand-written header alone. The skill is explicit that the file is a proposal, not a ranking lever; whether a given assistant reads it is up to that vendor.

## 5. seo-content-brief-writer: intent before prose

[seo-content-brief-writer](/skills/marketing/seo-content-brief-writer) takes a target keyword and the SERP notes you paste in (titles, formats, People Also Ask questions, competitor outlines, lengths) and returns a nine-section brief: intent with evidence, an angle the ranking pages under-serve, an H2/H3 outline with the direct answer first, entities and questions mapped to sections, internal-link placeholders, two length-checked meta variants, and a word-count target explained by the SERP. Anything inferred rather than read from the notes carries an INFERRED tag.

It never states a search volume, a difficulty score, or a ranking position. When the dominant intent is transactional, it says so and points to the next pick rather than writing an article brief for a query that wants a product page.

## 6. landing-page-copywriter: commercial intent pages

[landing-page-copywriter](/skills/marketing/landing-page-copywriter) drafts the page a transactional query deserves: hero with headline variants, problem, solution, how it works, proof, pricing framing, FAQ, and three CTA variants, in PAS or AIDA. Its search value is the FAQ and the proof discipline. The FAQ gives a commercial page the question-shaped content answer engines look for, and every slot that would normally hold a testimonial, a number, or a logo you did not supply gets a `[PROOF NEEDED]` marker instead of invented social proof, which keeps the page honest when the schema skill marks it up later.

## 7. content-repurposer: distribution without new claims

[content-repurposer](/skills/marketing/content-repurposer) turns one finished article, transcript, or case study into four channel-sized derivatives: an X thread, a LinkedIn post, a newsletter section, and a short-video script. It first builds a ledger of every claim and number in the source and draws only from that ledger, flagging any statistic the original never sourced. For a search program that matters twice: the derivatives carry the page's exact claims into the places that send links back to it, and they never introduce a figure the page cannot back up.

## 8. web-vitals-optimizer: page experience from field data

[web-vitals-optimizer](/skills/performance/web-vitals-optimizer) is the one engineering pick. It treats real-user field data at the 75th percentile (CrUX or your RUM) as the source of truth and uses Lighthouse or WebPageTest only to find the at-fault element, script, or layout shift. Then it applies one targeted fix per metric, for LCP, CLS, and INP, and re-measures against the field target. The trap it exists to avoid is a green lab score on a page whose field data still fails; if your Core Web Vitals report is the blocker, start here before touching content.

## 9. brand-voice-profiler: consistent voice across pages

[brand-voice-profiler](/skills/marketing/brand-voice-profiler) derives a voice guide from five to ten pieces you already published: tone axes scored with quoted evidence, use and avoid vocabulary, sentence rhythm, formatting habits, dos and don'ts, three before-and-after rewrites, and a rules block ready to paste into a SKILL.md. Where samples disagree, it says so instead of averaging. Its place in an SEO stack is consistency at scale: once the guide exists, every brief, draft, and derivative above can be checked against it, which is what the [/brand-check](/commands/marketing/brand-check) command does.

## Commands and agents for the per-page loop

Three commands cover the quick passes. [/seo-check](/commands/marketing/seo-check) takes a file path or URL and returns a ten-row pass-or-fix table: title and meta length, one H1, heading order, answer-first lead, visible FAQ, structured data backed by visible content, canonical, internal links, and alt text, with the skill that executes each fix named at the end. [/llms-txt](/commands/docs/llms-txt) runs the llms.txt procedure inside a project and writes the file to the static folder. [/brand-check](/commands/marketing/brand-check) scores a draft against the voice guide and lists violations with rewrites.

Two agents do the longer work. The [seo-specialist](/agents/marketing/seo-specialist) agent reviews a site or a folder of pages: the technical pass, intent match between each page's title, H1, and lead and its target query, a sample of pages through the answer-structure checks, the structured data and llms.txt audits, and an internal-link map, returned as one plan ranked by effect and effort with the executing skill named per item. It is read-only and reports "no traffic data" rather than estimating when you have not supplied an export. The [content-editor](/agents/marketing/content-editor) agent edits a finished draft for clarity and voice and marks every claim it cannot trace with `[CITATION NEEDED]` or `[VERIFY]`; run it after geo-content-auditor has restructured the page, so the claims pass covers the sentences that will ship.

## Recommended SEO stacks

For a content site that wants both search and AI answers covered, install the four layer skills, the single-page command, and the agent:

```bash
npx agentscamp add skills/seo-technical-auditor
npx agentscamp add skills/schema-markup-generator
npx agentscamp add skills/geo-content-auditor
npx agentscamp add skills/llms-txt-generator
npx agentscamp add commands/seo-check
npx agentscamp add agents/seo-specialist
```

For the content pipeline that feeds it, add the brief, the editor, the voice guide, and the distribution step:

```bash
npx agentscamp add skills/seo-content-brief-writer
npx agentscamp add skills/brand-voice-profiler
npx agentscamp add skills/content-repurposer
npx agentscamp add agents/content-editor
npx agentscamp add commands/brand-check
```

Whichever set you run, ask for the evidence behind each verdict: the measured length, the quoted lead, the validator result, the `curl` status. A finding without evidence is an opinion, and these skills are built to avoid producing those.

## Continue exploring

- [SEO content workflow with Claude Code](/guides/marketing/seo-content-workflow-with-claude-code) — The research, brief, draft, edit, and on-page loop these skills slot into, one article at a time.
- [AI content and search in 2026](/guides/marketing/ai-content-and-search-2026) — What is and is not known about how AI answer features choose sources, and what that means for a brief.
- [Claude skills for marketers](/guides/marketing/claude-skills-for-marketers) — The five marketer skills on claude.ai, Claude Code, and Cowork, with the commands and agent that join them in a repository.
- [The best Claude skills to install in 2026](/guides/skills/best-claude-skills-2026) — The skills-only tour of the library, organized by the job each skill does.
- [How to install Claude skills](/guides/skills/how-to-install-claude-skills) — Every install path: manual copy, the agentscamp CLI, GitHub repos, plugins, and team distribution.
