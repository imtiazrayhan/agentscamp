---
name: "llms-txt-generator"
title: "llms.txt Generator"
description: "Generate or refresh a site's llms.txt (and, on request, llms-full.txt) from its sitemap, route tree, docs navigation, or content directory, following the llmstxt.org conventions: an H1 with the site name, a blockquote summary, H2 sections of links each with a one-line description taken from the page's own metadata, and an Optional section for secondary pages. Use when a site or docs repository needs the file created, or an existing one checked against the pages that actually exist today."
version: "1.0.0"
allowed-tools: "Read, Grep, Glob, Write, Bash"
user-invocable: true
color: "cyan"
date: 2026-10-18
topics: ["ai-at-work", "workflow-prompting"]
audience: ["developers", "marketers"]
tags: ["claude", "llms-txt", "docs", "ai-search", "developers"]
featured: false
related: ["command:llms-txt", "glossary:llms-txt", "skill:seo-technical-auditor", "skill:geo-content-auditor", "agent:seo-specialist", "skill:readme-generator", "guide:best-claude-skills-for-seo", "guide:ai-content-and-search-2026"]
seoDescription: "A Claude skill that builds or refreshes llms.txt from a site's sitemap, routes, or docs nav, following llmstxt.org conventions and verifying every link."
summary: "Give this skill a site or docs repository and it builds llms.txt from the sitemap, route tree, docs navigation, or content folder: an H1, a blockquote summary, H2 sections of links with one-line descriptions copied from each page's own metadata, and an Optional section. It verifies every link and refreshes the lists on later runs."
---

[llms.txt](/glossary/llms-txt) is a proposed convention, published at llmstxt.org, for a Markdown file at a site's root that tells a language model what the site is and which pages matter. Writing one by hand goes stale the week after. This skill builds the file from what the site already declares (its sitemap, its route tree, or its docs navigation and content directory), takes every description from the page itself, and writes the result to `public/llms.txt` or wherever the project serves static files. Run it again later and it refreshes the lists instead of starting over.

## When to use this skill

- A docs site or content site has no llms.txt and you want one that matches the real page set.
- The file exists but links to pages that moved, or new sections were never added.
- You are asked for llms-full.txt, the single-file variant that inlines page content rather than linking to it.
- A [seo-technical-auditor](/skills/marketing/seo-technical-auditor) pass is done and the next step is readability for models.

## When NOT to use this skill

- Controlling which AI crawlers may fetch the site: that is `robots.txt` and its user-agent rules. llms.txt is a reading guide, not access control.
- Deciding whether a page's prose is quotable: the [geo-content-auditor](/skills/marketing/geo-content-auditor) skill.
- Writing page descriptions from nothing. The skill copies each page's own description or first sentence and reports pages that have neither; write those first.

## Instructions

1. **Find the inventory.** In order of preference: a docs navigation config (`mkdocs.yml` nav, Docusaurus `sidebars.*`, Starlight `sidebar` in `astro.config.*`, VitePress `themeConfig.sidebar`), because it already encodes the grouping a human chose; then `sitemap.xml`, static or generated; then the route tree (`app/**/page.*` in Next.js, `src/pages` in Astro) or a content directory with frontmatter. Note the canonical production origin so every link can be absolute.
2. **Write the header.** `# <site name>` on the first line, then one blockquote (`> `) of one or two sentences taken from the README or home page, then, if useful, a short paragraph or two of plain prose: what the product is, a versioning note, where to start. No headings inside that prose; llmstxt.org reserves H2 for link sections.
3. **Build the sections.** Each `## ` section is a flat list of `- [Title](https://absolute-url): one-line description`. Group by what a reader needs (Getting started, Guides, Reference, Examples); for a content site, group by content type. The description comes from frontmatter `description`, the meta description, or the first sentence of the page. Pages with none go into a "needs description" list in your report, not into the file.
4. **Add `## Optional`.** Per the convention, links here can be skipped when a reader's context is short: changelogs, older versions, legal pages, long reference tables.
5. **Prefer Markdown targets.** If the site serves a Markdown rendition of each page (a `.md` twin, a `?format=md` query, or a dedicated route), link to that; a model reads it better than rendered HTML.
6. **Emit llms-full.txt only when asked.** Concatenate the Markdown body of each page in section order, each preceded by its H1 and a `Source: <url>` line. Include the main sections, never Optional. If the result runs to several megabytes, say so and trim to the first sections.
7. **Place and serve.** `public/llms.txt` works for Next.js, Astro, and most static builders. Use a route handler (`app/llms.txt/route.ts` in Next.js) when the file must be generated at build time from a content layer. Serve it as `text/plain; charset=utf-8` or `text/markdown`.
8. **Verify.** `curl -s https://example.com/llms.txt | head -20`, count the links, and check that each resolves:

   ```bash
   rg -o 'https?://[^) ]+' public/llms.txt | sort -u | while read -r u; do
     printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "$u")" "$u"
   done | rg -v '^200'
   ```

9. **Refresh mode.** When the file already exists, parse its links, diff them against the inventory, and rebuild only the lists. Keep the hand-written header prose. Report what was added, removed, and moved.

> [!NOTE]
> llmstxt.org is a proposal. Whether any particular assistant or crawler reads the file is up to that vendor, so treat it as a low-cost courtesy for readers that do, not as a ranking lever. [AI content and search in 2026](/guides/marketing/ai-content-and-search-2026) covers where it fits.

> [!WARNING]
> List only pages you want quoted, and describe each one truthfully. A description that promises more than the page delivers is a hallucination you wrote yourself, and a model that trusts the file will repeat it.

> [!TIP]
> Wire the generation into the build so the file cannot drift. The [/llms-txt](/commands/docs/llms-txt) command runs this procedure from inside Claude Code and is the easy thing to call from a `prebuild` script review.

## Output

The `llms.txt` file (and `llms-full.txt` if requested) written to the static directory, the diff when refreshing, the list of pages that still need a description, and the link-verification result. If any link returned a non-200 status, the report says which and the file keeps the previous good entry.

## Example

Generated file for a fictional command-line tool, "Orbit CLI":

```markdown
# Orbit CLI

> Orbit is a command-line tool for deploying static sites to object storage. These docs cover installation, configuration, and the deploy pipeline.

## Getting started

- [Install](https://orbit.example/docs/install.md): Install with Homebrew, npm, or a prebuilt binary.
- [First deploy](https://orbit.example/docs/first-deploy.md): Deploy a folder in three commands.

## Reference

- [orbit.toml](https://orbit.example/docs/config.md): Every configuration key with its default and type.

## Optional

- [Changelog](https://orbit.example/changelog.md): Release notes back to the first public version.
```
