---
name: "schema-markup-generator"
description: "Write JSON-LD structured data (Article or TechArticle, FAQPage, HowTo, SoftwareApplication, Product, BreadcrumbList, Organization) from the content that is actually visible on a page, fill the required and recommended properties from Google's structured-data documentation, link the nodes in one @graph, and validate the result with the Schema.org validator and the Rich Results Test before it ships. Use when a page needs structured data written, or an existing block checked property by property."
version: "1.0.0"
allowed-tools: "Read, Grep, Glob, Edit, Bash"
user-invocable: true
color: "cyan"
date: 2026-10-19
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers", "developers"]
tags: ["claude", "seo", "structured-data", "json-ld", "marketers", "developers"]
featured: false
related: ["skill:seo-technical-auditor", "skill:geo-content-auditor", "agent:seo-specialist", "command:seo-check", "guide:best-claude-skills-for-seo", "guide:seo-content-workflow-with-claude-code", "glossary:answer-engine-optimization"]
seoDescription: "A Claude skill that writes and validates JSON-LD (Article, FAQPage, HowTo, SoftwareApplication, Product, Organization) from the content visible on a page."
summary: "This skill reads a page, picks the Schema.org type from what the page is, fills required and recommended properties only from content a visitor can see, links the nodes in one @graph, validates with the Schema.org validator and Google's Rich Results Test, and returns the block with its insertion point. It audits an existing block the same way."
---

Structured data has one rule that most generators break: every value in the JSON-LD must correspond to something a visitor can see on the page. A FAQPage whose questions appear nowhere in the HTML, a `datePublished` the byline does not show, an `aggregateRating` with no visible reviews: these are the patterns Google's spam policies describe as structured data abuse. This skill reads the page first, chooses the type from what the page is, fills properties from visible content, links the nodes in a single `@graph`, and validates the block before it goes into the template. It audits an existing block the same way.

## When to use this skill

- A page type (guide, docs article, FAQ, tutorial, product, tool listing) has no JSON-LD and the template owner wants it done once, correctly.
- An existing block fails in Search Console with missing-field or invalid-value errors.
- A site moved CMS or framework and the structured data must be re-expressed in the new template.
- A pass with [geo-content-auditor](/skills/marketing/geo-content-auditor) found a visible FAQ section that is not yet marked up.

## When NOT to use this skill

- Titles, canonicals, sitemaps, redirects, and crawl hygiene: the [seo-technical-auditor](/skills/marketing/seo-technical-auditor) skill. It checks that JSON-LD is present; this one writes it.
- Making the prose itself quotable by answer engines: the [geo-content-auditor](/skills/marketing/geo-content-auditor) skill.
- Rich-result bait: if the page has no FAQ, add the visible content first.

## Instructions

1. **Read the rendered page and name what it is.** One primary type per page: `Article` or `TechArticle` for editorial and docs; `FAQPage` only when a visible question-and-answer section exists; `HowTo` only for a visible step-by-step procedure; `SoftwareApplication` for a page about an app or tool; `Product` for something sold with a visible price or reviews; `BreadcrumbList` on any page that shows breadcrumbs; `Organization` once, on the home or about page. Secondary nodes hang off the primary one.
2. **Extract values from visible content only.** Headline from the H1, dates from the byline, author from the visible author line, FAQ questions and answers verbatim from the FAQ section, steps from the numbered procedure, price and currency only if printed. If a value is not on the page, omit the property and list it under "not present on page" in the report. Never pull a date from the git log or an author from a config file and call it visible.
3. **Fill required properties, then recommended ones.** Required is what Google's documentation lists for the rich result; a missing recommended property is a warning, not an error. Quick reference, to be checked against the current Search Central docs for the type before you promise anything:

   | Type | Required for Google's rich result | Commonly recommended |
   | --- | --- | --- |
   | Article / TechArticle | none; `headline`, `image`, `datePublished`, `author` are recommended | `dateModified`, `author.url`, `publisher` |
   | FAQPage | `mainEntity` of `Question` nodes with `name` and `acceptedAnswer.text` | one node per visible pair |
   | HowTo | `name`, `step` (each `HowToStep` with `text`) | `image`, `totalTime`, `tool`, `supply` |
   | SoftwareApplication | `name`, an `offers` price with `priceCurrency` (use `0` for free), a visible rating or review | `applicationCategory`, `operatingSystem` |
   | Product | `name`, plus one of `review`, `aggregateRating`, `offers` | `image`, `description`, `sku`, `brand` |
   | BreadcrumbList | `itemListElement` of `ListItem` with `position`, `name`, `item` (optional on the last) | |
   | Organization | `name`, `url` | `logo`, `sameAs` |

4. **Use one `@graph` with stable `@id`s.** Put `Organization`, `WebSite`, `WebPage`, the primary node, and `BreadcrumbList` in one script with `@id` values such as `https://example.com/#organization`, so nodes reference each other instead of repeating. Dates in ISO 8601 with an offset; URLs absolute.
5. **Check what the template already emits.** `rg -l 'application/ld\+json' src` and read it. Two `Article` nodes, or a plugin block whose `dateModified` disagrees with yours, send conflicting signals. Merge or remove; do not add a third.
6. **Validate three ways.** Syntax: `node -e 'JSON.parse(require("fs").readFileSync(0,"utf8"))' < block.json`. Vocabulary: the Schema.org validator at https://validator.schema.org/ accepts a URL or a pasted block. Eligibility: Google's Rich Results Test at https://search.google.com/test/rich-results reports only the types Google surfaces. Fix every error; explain each remaining warning in the report.
7. **Insert where the template renders.** A `<script type="application/ld+json">` in the head or body. In Next.js, render it from a Server Component via `dangerouslySetInnerHTML` and escape `<` in the JSON (`JSON.stringify(data).replace(/</g, "\\u003c")`) so a `</script>` inside an answer cannot break out; Astro's `set:html` needs the same escape. Edit a file only when the user asked for insertion; otherwise return the block and the exact insertion point.

> [!WARNING]
> Google's structured data guidelines require that marked-up content be visible to users on the page and that it describe that page, not a different one. Markup for content that is hidden, absent, or on another URL is the one thing this skill will refuse to write, because a manual action costs more than a missing rich result.

> [!NOTE]
> Google has narrowed FAQ rich results to a small set of authoritative sites and no longer shows HowTo rich results. `FAQPage` and `HowTo` remain valid Schema.org and still describe the page to other consumers, including answer engines; do not promise a visible rich result from either.

## Output

The JSON-LD block; a property table with columns Property, Where it appears on the page, and Status (present, omitted, or not on page); the three validator results; and the insertion point or the applied diff. For an audit of an existing block, the same table plus the list of values that have no visible counterpart.
