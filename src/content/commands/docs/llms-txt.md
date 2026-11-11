---
description: "Generate or refresh llms.txt from the project's routes, sitemap, or docs navigation, write it to the static directory, and verify that every link resolves."
seoDescription: "/llms-txt generates or refreshes a project's llms.txt from its routes, sitemap, or docs nav, writes it to the static folder, and checks every link resolves."
date: 2026-10-20
argument-hint: "[site root or docs dir] [--full]"
allowed-tools: "Read, Grep, Glob, Write, Bash"
title: "llms.txt"
color: "purple"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["developers", "marketers"]
featured: false
related: ["skill:llms-txt-generator", "glossary:llms-txt", "skill:seo-technical-auditor", "agent:seo-specialist", "command:update-readme", "guide:best-claude-skills-for-seo"]
summary: "A slash command that runs the llms-txt-generator procedure inside a project: it finds the page inventory (docs navigation, sitemap, route tree, or content folder), resolves the production origin, writes llms.txt to the static directory in the llmstxt.org shape, verifies every link, and on later runs refreshes the lists while keeping the hand-written header."
---

Create or refresh the project's [llms.txt](/glossary/llms-txt) from what the project already knows about its pages. This command runs the same procedure as the [llms-txt-generator](/skills/docs/llms-txt-generator) skill, with the file-handling decided for you: it detects the framework, finds the page inventory, resolves the production origin, writes the file where the project serves static assets, and verifies the links. When a file already exists, it refreshes the link sections and leaves the header prose alone.

## Scope

Interpret `$ARGUMENTS` as follows:

1. Empty: the current directory is the site root. Use its framework config, sitemap, and content tree.
2. A directory path: treat it as the site root if it holds a framework config or `public/`; otherwise treat it as a docs subtree and list only the pages under it, still writing the file at the site root.
3. `--full` anywhere in the arguments: also write `llms-full.txt`, which inlines each page's Markdown body under its H1 with a `Source:` line.
4. If `public/llms.txt` (or the equivalent static path) already exists, run in refresh mode: rebuild the link lists, keep the H1, blockquote, and prose, and report the diff.

If no inventory source can be found (no navigation config, no sitemap, no routes, no content folder), stop and say which paths were checked. Do not write a file from guesses.

## Step 1 — Find the inventory

Check in this order and use the first that exists: a docs navigation config (`mkdocs.yml`, Docusaurus `sidebars.*`, Starlight `sidebar` in `astro.config.*`, VitePress `themeConfig.sidebar`); `sitemap.xml` in the static folder or a sitemap route (`app/sitemap.ts`); the route tree (`app/**/page.*`, `src/pages/**`); a content directory with frontmatter. Say which one you used; the navigation config wins because a person already grouped the pages.

## Step 2 — Resolve the production origin

Every link must be absolute. Look for `metadataBase` in the Next.js root layout, `site` in `astro.config.*`, `url` or `homepage` in `package.json`, `site_url` in `mkdocs.yml`, or an existing sitemap's host. If none is found, ask for the origin once and stop until answered.

## Step 3 — Build the file

Follow the llmstxt.org shape: `# <site name>`, one blockquote summary from the README or home page, optional short prose, then `## ` sections of `- [Title](absolute-url): one-line description`, and a final `## Optional` section for secondary pages (changelog, legal, archived versions). Descriptions come from each page's own `description`, meta description, or first sentence. Pages with none are listed in the report, not described from imagination. Prefer a Markdown rendition of each page when the site serves one.

## Step 4 — Write it

`public/llms.txt` for Next.js, Astro, Vite, and most static builders; `static/llms.txt` for Hugo and Gatsby; `docs/llms.txt` for MkDocs. If the project already generates the file from a route handler, edit the data it reads from instead of writing a static file, and say so. Before overwriting an existing file whose header prose would change, show the change and ask.

> [!WARNING]
> List only pages you want quoted, and describe them truthfully. The file is a reading guide for models; a description that oversells a page becomes an answer somebody receives with your site's name on it.

## Step 5 — Verify

If the site is live, check each link:

```bash
rg -o 'https?://[^) ]+' public/llms.txt | sort -u | while read -r u; do
  printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "$u")" "$u"
done | rg -v '^200'
```

If it is not live yet, map each URL back to a route or content file with `Glob` and report any that have no source. A link that fails verification is dropped from the file and listed in the report.

## Step 6 — Report

```markdown
## /llms-txt: <site name>

Mode: created | refreshed
Inventory: docs navigation (astro.config.mjs sidebar), 48 pages
Origin: https://orbit.example
Written: public/llms.txt (52 links, 4 sections + Optional)
Also written: public/llms-full.txt (184 KB)   # only with --full

Verification: 52 links checked, 52 returned 200
Needs a description (listed without one, in Optional): 3
  - /docs/internals/scheduler
  - /docs/internals/cache
  - /legal/dpa

Refresh diff: +4 added, -2 removed (moved to /docs/v2/…), 0 renamed
```

> [!NOTE]
> llmstxt.org is a proposal; whether a given assistant reads the file is up to that vendor. Treat this as a low-cost courtesy that keeps a curated map of the site current, and let the [seo-specialist](/agents/marketing/seo-specialist) agent or the [seo-technical-auditor](/skills/marketing/seo-technical-auditor) skill handle the parts of search that do move rankings.

> [!TIP]
> Run this after [/update-readme](/commands/docs/update-readme) when the README's summary changed; the blockquote comes from it. The full set of search and AI-search installables is in [the best Claude skills for SEO](/guides/skills/best-claude-skills-for-seo).
