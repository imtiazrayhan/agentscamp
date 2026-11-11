---
description: "Run a single-page SEO and AEO check on a file or URL (title and meta lengths, one H1, heading order, answer-first lead, FAQ, structured data, canonical, internal links, alt text) and return a pass-or-fix table."
seoDescription: "/seo-check runs a single-page SEO and AEO check on a file or URL: title, meta, headings, answer-first lead, FAQ, JSON-LD, links, alt text, as a pass/fix table."
date: 2026-10-20
argument-hint: "<file path or URL>"
allowed-tools: "Read, Grep, Glob, Bash"
title: "SEO Check"
color: "purple"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers", "developers"]
featured: false
related: ["skill:seo-technical-auditor", "skill:geo-content-auditor", "skill:schema-markup-generator", "skill:llms-txt-generator", "agent:seo-specialist", "command:brand-check", "guide:best-claude-skills-for-seo", "guide:seo-content-workflow-with-claude-code"]
summary: "A read-only slash command that checks one page, from a Markdown or HTML file or a fetched URL, against ten rules: title and meta length, one H1, heading order, canonical, internal links, alt text, an answer-first lead, a visible FAQ, and structured data backed by visible content. It returns a pass-or-fix table with evidence and the skill for each fix."
---

Check one page before it ships, or after it stops performing. This command reads a Markdown or HTML file, or fetches a URL, and runs ten checks that cover classic on-page SEO and answer-engine readiness together, returning a pass-or-fix table with the evidence behind each verdict. It reads only and changes nothing. For a whole site, use the [seo-technical-auditor](/skills/marketing/seo-technical-auditor) skill; for a ranked plan across pages, the [seo-specialist](/agents/marketing/seo-specialist) agent.

## Scope

Interpret `$ARGUMENTS` in this order:

1. A URL (`http://` or `https://`): fetch it with `curl -sL`, record the final URL and status code, and keep the response headers for `X-Robots-Tag` and `Link: rel=canonical`.
2. A path ending in `.html`: `Read` it as the rendered page.
3. A path ending in `.md` or `.mdx`: `Read` the frontmatter and body. Take the title from `seoTitle` or `title`, the meta description from `seoDescription` or `description`, the FAQ from `faq`, and treat the body's first paragraph (or a `summary` field the site renders) as the lead. Say in the report that rendered output was inferred from source.
4. A path to a page component (`.tsx`, `.astro`, `.vue`): read the `metadata` export or the `<head>`, mark the check partial, and recommend running it again on the built HTML.
5. Several arguments: one report per page, in the order given.
6. Empty: ask "Which file or URL should I check?" and stop. Do not pick a page yourself.

> [!NOTE]
> This command needs a target query to judge intent. Use one if the frontmatter or the user supplies it; otherwise use the H1 as the stand-in and say so. It does not check facts, sources, or voice; the [content-editor](/agents/marketing/content-editor) agent and [/brand-check](/commands/marketing/brand-check) do those.

## Step 1 — Extract the fields

List what you pulled before judging it: title, meta description, canonical, robots directive, H1 text and count, the heading sequence (level and text), the first paragraph, the visible FAQ section, every `application/ld+json` block and its `@type`, internal links (count and targets), and images without `alt`. If a field is absent, write "absent"; absence is a finding, not a gap in the report.

## Step 2 — Apply the ten checks

| Check | Rule |
| --- | --- |
| Title | 50 to 60 characters; contains the target query |
| Meta description | 120 to 155 characters; one or two sentences; not a copy of the title |
| H1 | exactly one; makes the same promise as the title |
| Heading order | no level skipped; H2s read as questions or searchable noun phrases |
| Answer-first lead | the first paragraph answers the title's question in 60 words or fewer and names the entity |
| FAQ | a visible section of at least three questions phrased the way people ask them; `faq` frontmatter that does not render is a FIX |
| Structured data | at least one JSON-LD block that parses, whose `@type` matches the page kind, and whose dates, author, and FAQ values appear on the page |
| Canonical | present, absolute, on the production host, self-referencing |
| Internal links | at least three to pages on the same site, each resolving |
| Images | every `img` has an `alt` attribute |

A verdict is PASS or FIX; there is no "warn". Attach one line of evidence to every row: the measured length, the quoted lead, the `@type` found, the count.

## Step 3 — Verify the links

For a URL, check up to ten internal links with `curl -s -o /dev/null -w '%{http_code}' <link>` and list any that are not 200. For a file, `Glob` for the matching route or content file (for example `/guides/x/y` to `src/content/guides/x/y.md` or `app/guides/x/y/page.*`) and list any that do not exist. Stay read-only throughout.

## Step 4 — Report

```markdown
## /seo-check: <title or path>

Source: <URL (final status 200) | file path (inferred from source)>
Target query: <query | H1 used as stand-in>

| Check             | Verdict | Evidence                                          |
| ----------------- | ------- | ------------------------------------------------- |
| Title             | PASS    | 54 chars; contains "session replay"               |
| Meta description  | FIX     | 171 chars; will truncate                          |
| H1                | PASS    | 1 found; matches title                            |
| Heading order     | FIX     | H2 "Setup" followed by H4                         |
| Answer-first lead | FIX     | opens with "In today's…"; no answer in 60 words   |
| FAQ               | FIX     | 3 entries in frontmatter, none rendered            |
| Structured data   | PASS    | Article + BreadcrumbList; dates match byline       |
| Canonical         | PASS    | self-referencing, https                           |
| Internal links    | PASS    | 7 links; all resolve                               |
| Images            | FIX     | 2 of 5 images lack alt                            |

Score: 5 of 10 pass.

Next: fix the lead and the FAQ first (geo-content-auditor), then the meta description.
```

## Step 5 — Route each FIX

End with one line per FIX naming what executes it: lead, headings, and FAQ wording go to the [geo-content-auditor](/skills/marketing/geo-content-auditor) skill; JSON-LD that is missing, mistyped, or not backed by visible content goes to the [schema-markup-generator](/skills/marketing/schema-markup-generator) skill; canonical, robots, and link problems that recur across pages go to the [seo-technical-auditor](/skills/marketing/seo-technical-auditor) skill; a site with no `/llms.txt` goes to the [llms-txt-generator](/skills/docs/llms-txt-generator) skill. The per-article loop this command sits in is described in the [SEO content workflow with Claude Code](/guides/marketing/seo-content-workflow-with-claude-code).
