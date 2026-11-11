---
name: "seo-technical-auditor"
title: "SEO Technical Auditor"
description: "Audit a website's source or built output (Next.js, Astro, or static HTML) for technical on-page and crawl hygiene: title and meta description length and uniqueness, self-referencing canonicals, one H1 and an unbroken heading hierarchy, presence of JSON-LD, sitemap and robots.txt, redirect chains, internal-link click depth, and image alt text, then return one findings table ordered by severity with the file or route to fix. Use when you want the crawl and markup plumbing checked across a whole site, not the quality of the writing or the correctness of the structured data."
version: "1.0.0"
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
color: "cyan"
date: 2026-10-18
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers", "developers"]
tags: ["claude", "seo", "technical-seo", "marketers", "developers"]
featured: false
related: ["skill:schema-markup-generator", "skill:geo-content-auditor", "skill:llms-txt-generator", "skill:web-vitals-optimizer", "agent:seo-specialist", "command:seo-check", "guide:best-claude-skills-for-seo", "guide:seo-content-workflow-with-claude-code"]
seoDescription: "A Claude skill that audits a site's build output for titles, metas, canonicals, headings, JSON-LD, sitemap, robots, redirects, link depth, and alt text."
summary: "Point this skill at a Next.js, Astro, or static-HTML project or its build folder and it extracts every page's title, meta description, canonical, robots directive, headings, JSON-LD, images, and internal links, checks them against fixed rules, diffs the sitemap against real routes, traces redirects, and returns a findings table by severity. Read-only."
---

Technical SEO problems are boring and expensive: a canonical that still points at the staging host, a `noindex` left over from a preview deploy, a sitemap full of redirected URLs, three hundred pages sharing one meta description. This skill audits the plumbing. Point it at a repository (Next.js, Astro, or plain HTML) or at a built output folder and it extracts every page's title, meta description, canonical, robots directives, headings, JSON-LD blocks, images, and internal links, checks each against the rules below, and returns one findings table ordered by severity with the file or route to fix. It reads files and runs read-only commands; it does not edit pages.

## When to use this skill

- Before a launch or a domain, framework, or URL-structure migration, and again right after.
- Search Console reports "Duplicate without user-selected canonical", "Crawled, currently not indexed", or "Excluded by noindex" on pages that should rank.
- A monthly hygiene pass on a content site that adds pages faster than anyone reviews them.
- You inherited a site and need a baseline before touching any content.

## When NOT to use this skill

- You want to know whether a page is written so an AI answer engine can quote it: the [geo-content-auditor](/skills/marketing/geo-content-auditor) skill. This skill checks that JSON-LD exists; it does not judge the prose.
- You need JSON-LD written or validated property by property: the [schema-markup-generator](/skills/marketing/schema-markup-generator) skill.
- The complaint is speed or layout shift: the [web-vitals-optimizer](/skills/performance/web-vitals-optimizer) skill works from field data.
- One page, two minutes: the [/seo-check](/commands/marketing/seo-check) command runs a subset of these checks on a single file or URL.
- You want an llms.txt file: the [llms-txt-generator](/skills/docs/llms-txt-generator) skill.

## Instructions

1. **Choose the surface and say which one you audited.** Built HTML is the truth; source is an approximation, because frameworks compute metadata at build time. If `npm run build` (or `astro build`) is cheap, run it and audit `out/`, `dist/`, or `.next/server/app/**/*.html`. Otherwise read the source: `metadata` and `generateMetadata` exports plus `app/sitemap.ts` in Next.js, the `<head>` of Astro layouts, the raw `<head>` of static HTML. Record the surface at the top of the report.
2. **Inventory routes from two directions.** Parse `sitemap.xml` (or the sitemap index) for the declared set, and discover the actual set with `find out -name '*.html'` or the route tree. Diff them: pages missing from the sitemap, sitemap entries that 404 or redirect, and sitemap entries that carry `noindex`.
3. **Extract per-page fields.** For each page pull `<title>`, `meta[name=description]`, `link[rel=canonical]`, `meta[name=robots]`, every `h1` to `h6` in order, each `script[type="application/ld+json"]`, every `img` with its `alt`, and every internal `<a href>`. A short Node script with an HTML parser is more reliable than regex, but `rg` is enough for a first pass:

   ```bash
   rg -o --no-filename '<title>[^<]*</title>' out | sort | uniq -c | sort -rn | head   # duplicate titles
   rg -L -l 'rel="canonical"' out --glob '*.html'                                     # pages with no canonical
   rg -o '<img[^>]*>' out | rg -v 'alt='                                              # images with no alt attribute
   ```

4. **Apply the page rules.** Title 50 to 60 characters and unique across the site; meta description 120 to 155 characters and unique; canonical present, absolute, on the production host, and self-referencing unless the page is a deliberate duplicate; exactly one `h1`; no heading level skipped; no `noindex` on a page that is in the sitemap; every JSON-LD block parses as JSON. Count each rule's failures and keep three example routes per rule.
5. **Check robots.txt and headers.** Confirm `robots.txt` exists, lists a `Sitemap:` line, and does not `Disallow: /` or block assets the pages need to render. If you were given a live URL, `curl -sI https://example.com/some-page | rg -i 'x-robots-tag|location|content-type'` catches header-level `noindex` and redirects that the HTML cannot show.
6. **Trace redirects.** Read the redirect config (`next.config.*`, `vercel.json`, `_redirects`, `.htaccess`), then sample a dozen old URLs with `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}\n' <url>`. Flag chains longer than one hop, temporary (302/307) redirects for permanent moves, and inconsistent trailing-slash or `www` handling.
7. **Measure internal-link depth.** Breadth-first search from `/` over internal links. Report pages more than three clicks from the home page, and orphans: pages present in the sitemap with zero inbound internal links.
8. **Write the findings table.** Severity is a rule, not a feeling. **High**: anything that stops indexing or sends it to the wrong URL (noindex on sitemap pages, canonical to another host, robots blocking, redirect loops, 404s in the sitemap). **Medium**: duplicate or missing titles and descriptions, missing `h1`, redirect chains, orphan pages. **Low**: lengths outside range, missing alt text, skipped heading levels.

> [!NOTE]
> Presence is all this skill checks for structured data: that a JSON-LD block exists and parses. Whether its properties are right, and whether the marked-up content is visible on the page, is the job of [schema-markup-generator](/skills/marketing/schema-markup-generator).

> [!WARNING]
> Do not mass-edit titles and descriptions from this report. Each one is a content decision that changes what a page promises in search; the report names the pages, and a person or the [seo-specialist](/agents/marketing/seo-specialist) agent decides the wording.

## Output

A Markdown report with: the surface audited and the page count; a table with columns Severity, Rule, Failures, Example routes, and Where to fix (a file path or component); the sitemap diff; the redirect sample; and the orphan list. It ends with the three fixes that remove the most High findings.
