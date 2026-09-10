---
title: "An SEO Content Workflow in Claude Code: Brief, Draft, On-Page Check"
description: "A repeatable SEO content workflow in Claude Code: a content repo with CLAUDE.md, SERP research over Exa and Firecrawl MCP, a brief, a draft, and on-page checks."
seoTitle: "SEO Content Workflow in Claude Code: Brief, Draft, On-Page Check"
seoDescription: "Run SEO content in Claude Code: a content repo with CLAUDE.md, SERP research via Exa and Firecrawl MCP, a brief, a draft, an editor pass, and on-page checks."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting", "rag-retrieval"]
audience: ["marketers"]
tags: ["claude-code", "seo", "content", "mcp", "firecrawl", "exa", "marketing", "claude-md"]
featured: false
keywords: ["SEO content workflow Claude Code", "Claude Code SEO", "AI content brief", "Firecrawl MCP SEO", "on-page SEO checklist AI"]
summary: "Treat SEO content like code: a git repo of Markdown with a CLAUDE.md that states your house rules, Exa and Firecrawl MCP servers for reading the live SERP, the seo-content-brief-writer skill for the brief, Claude for the draft, the content-editor agent for claims and voice, and a scripted on-page check before export. Every step leaves a file you can diff."
keyTakeaways:
  - "Put content in a repo. CLAUDE.md carries the rules (audience, voice skill, title and meta limits, link policy) so every session starts with them."
  - "Research the live SERP, not Claude's memory: Exa for search (one claude mcp add command, keyless) and Firecrawl for fetching pages as clean Markdown."
  - "The brief is the contract. seo-content-brief-writer turns SERP notes into intent, outline, entities, questions, and internal links; approve it before drafting."
  - "Draft from the brief with sources pinned, then run the content-editor agent for unsupported claims and voice drift before you look at SEO at all."
  - "On-page checks are deterministic: title and meta length, one H1, heading order, internal links, alt text. Script them; do not ask the model to eyeball them."
  - "Surfer or Clearscope still fit at the end for term coverage; the workflow replaces the blank page, not the scoring tools."
howtoSteps:
  - name: "Set up a content repo with CLAUDE.md"
    text: "Create a git repository with content/, briefs/, and research/ folders and a CLAUDE.md that states the audience, the brand-voice skill to apply, title and meta length limits, heading rules, internal-link policy, and the rule that every statistic needs a source URL. Start Claude Code from the repo root."
  - name: "Connect Exa and Firecrawl"
    text: "Run claude mcp add --transport http exa https://mcp.exa.ai/mcp for search, and claude mcp add --transport http firecrawl https://mcp.firecrawl.dev/v2/mcp --header 'Authorization: Bearer <your key>' for page fetching. Add --scope project to write them to .mcp.json for the team."
  - name: "Research the SERP"
    text: "Ask Claude to search the target query with Exa, fetch the top results with Firecrawl, and write research/<slug>.md: each page's title, H2s, word count, questions answered, entities named, and what none of them cover. Read it before moving on."
  - name: "Generate the brief"
    text: "Run the seo-content-brief-writer skill on the research file. It produces briefs/<slug>.md with search intent, working title, outline with H2s and H3s, entities and questions to cover, internal links to include, and a target length. Edit it; the brief is the contract."
  - name: "Draft from the brief"
    text: "Prompt Claude to write content/<slug>.md following the brief and CLAUDE.md exactly, with frontmatter for title, description, and slug, and a source URL beside every number. Ask for the draft only, no summary of what it did."
  - name: "Run the content-editor agent"
    text: "Delegate to the content-editor agent: it reads the draft and the brief, flags unsupported claims, voice drift, filler, and sections that miss the brief, and returns a numbered list. Fix or accept each item; do not let it rewrite the piece wholesale."
  - name: "Run on-page checks"
    text: "Run a script (Claude can write it) that checks title length, meta description length, exactly one H1, no skipped heading levels, at least three internal links to existing routes, alt text on every image, and the target query in title, H1, and first paragraph. Fix until it exits clean."
  - name: "Export and publish"
    text: "Commit the draft, brief, and research together. Export to your CMS format (HTML, MDX, or a paste into the editor), publish, and record the URL in the brief for the refresh cycle. Re-run steps 3 and 7 when you update the piece."
faq:
  - q: "Why run SEO content through Claude Code instead of the chat app?"
    a: "Files. Claude Code works in a folder, so the research, the brief, the draft, and the check script are files you can diff, review, and re-run, and CLAUDE.md gives every session the same rules. The chat app is fine for a single draft; it is poor at a repeatable pipeline with a paper trail."
  - q: "Which MCP servers do I need for SERP research?"
    a: "Two cover it: Exa for search (claude mcp add --transport http exa https://mcp.exa.ai/mcp; it works without a key at reduced rate limits) and Firecrawl for fetching pages as clean Markdown over its hosted server at mcp.firecrawl.dev/v2/mcp with your API key as a bearer header. Tavily is a valid alternative to Exa; the comparison guide covers the trade-offs."
  - q: "Does Claude replace Surfer or Clearscope?"
    a: "No. This workflow replaces the blank page and the manual brief. Surfer and Clearscope score a finished draft against the terms and structure of ranking pages, which is a different job. Run the draft through one of them at the end if you already pay for it; skip it if you do not and let the on-page script and the editor agent carry the check."
  - q: "How do I keep AI drafts from all sounding the same?"
    a: "Three levers in this workflow: a brand-voice skill referenced from CLAUDE.md so the voice rules load on every draft, a research file so the draft contains facts the ranking pages lack, and the content-editor agent flagging filler and generic claims. A draft that only restates the SERP has no reason to rank."
  - q: "Will Google penalize content produced this way?"
    a: "Google's guidance rewards content by quality, not production method, and its scaled content abuse policy targets many pages generated without adding value. One brief, one researched draft, one edit pass, and a human decision to publish is the opposite of that pattern. The companion guide on AI content and search quotes the policies directly."
related: ["guide:claude-code-for-marketers", "guide:ai-content-and-search-2026", "guide:brand-voice-with-claude-skills", "guide:claude-marketing-plugin-guide", "skill:seo-content-brief-writer", "agent:content-editor", "tool:firecrawl", "tool:exa"]
sources:
  - title: "Exa MCP (installation and tools)"
    url: "https://docs.exa.ai/reference/exa-mcp"
    publisher: "Exa"
  - title: "Firecrawl MCP server"
    url: "https://docs.firecrawl.dev/mcp-server"
    publisher: "Firecrawl"
  - title: "Connect Claude Code to tools via MCP"
    url: "https://code.claude.com/docs/en/mcp"
    publisher: "Anthropic"
  - title: "Google Search's guidance on using generative AI content on your website"
    url: "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content"
    publisher: "Google"
---

The SEO content workflow that holds up in Claude Code treats an article the way a developer treats a feature: a repository, a rules file, research you can read back, a brief that is approved before drafting, a draft, a review pass, and a deterministic check before shipping. Every step writes a file. This guide sets that up in eight steps with one `CLAUDE.md`, two MCP servers, one skill, one agent, and one script.

It is a mechanics guide, not a strategy guide. Which keywords to chase is your call; what Google says about AI-assisted content is in [Does AI-written content rank in 2026?](/guides/marketing/ai-content-and-search-2026), and the wider set of marketing workflows is in the pillar, [Claude Code for marketers](/guides/marketing/claude-code-for-marketers).

## Step 1: A content repo with a CLAUDE.md

Create a folder, run `git init`, and give it three directories: `research/`, `briefs/`, and `content/`. Then write `CLAUDE.md` at the root. Claude Code reads it at the start of every session, so it is where the rules live instead of in your head. Keep it short and specific:

```markdown
# Content repo rules

## Audience and voice
- Readers: marketing leads at B2B SaaS companies, 50-500 employees.
- Apply the `acme-voice` skill to every draft.
- American spelling. No exclamation marks. No "in today's fast-paced world".

## Files
- research/<slug>.md  -> SERP notes (step 3)
- briefs/<slug>.md    -> approved brief (step 4); never draft without one
- content/<slug>.md   -> the article, with frontmatter: title, description, slug, date

## On-page rules (checked by scripts/onpage-check.mjs)
- Title 50-60 characters, includes the target query.
- Meta description 120-155 characters, one sentence, includes the query.
- Exactly one H1 (the title). H2/H3 only below it; no skipped levels.
- At least 3 internal links to existing routes; list candidates in the brief.
- Every image has alt text. Every statistic has a source URL on the same line.

## Never
- Invent statistics, quotes, or customer names.
- Cite a page you have not fetched in this session.
- Summarize what you did; return the file.
```

The character limits are house rules, not Google's; pick yours and keep them in one place. The reasoning behind a lean `CLAUDE.md` is in [CLAUDE.md best practices](/guides/configuration/claude-md-best-practices). The voice skill it references is the one built in [Build a brand-voice skill for Claude](/guides/marketing/brand-voice-with-claude-skills).

## Step 2: Connect Exa and Firecrawl

Claude's training data is not the SERP. Two MCP servers give it the live web: [Exa](/tools/exa) for search and [Firecrawl](/tools/firecrawl) for turning any URL into clean Markdown.

```bash
# search: works keyless at reduced rate limits; add a key later
claude mcp add --transport http exa https://mcp.exa.ai/mcp

# fetch: hosted server, key as a bearer header (never in the URL)
claude mcp add --transport http firecrawl https://mcp.firecrawl.dev/v2/mcp \
  --header "Authorization: Bearer <your-firecrawl-key>"
```

Add `--scope project` to either command to write it to `.mcp.json` so teammates get the same servers when they clone the repo; keep the key in an environment variable rather than committing it. Exa's server exposes `web_search_exa` and `web_fetch_exa` by default, so for light research Exa alone is enough; Firecrawl earns its place on JavaScript-heavy pages and whole-site crawls. If you prefer Tavily for search, [Exa vs Tavily](/guides/comparisons/exa-vs-tavily) has the comparison, and [Claude Code MCP setup](/guides/mcp/claude-code-mcp-setup) covers scopes and troubleshooting.

## Step 3: Research the SERP

Start Claude Code from the repo root and give it one prompt. This is the one full prompt in the guide, and the shape matters more than the wording:

```text
Target query: "ai content brief template"
Slug: ai-content-brief-template

1. Use Exa to search the target query and two close variants. Collect the
   top 8 distinct URLs (skip ads, tools pages, and YouTube).
2. Fetch each URL with Firecrawl. For each page record: title, meta
   description, H2s in order, approximate word count, the questions it
   answers, named entities and tools it mentions, and its publish/update
   date if shown.
3. Write research/ai-content-brief-template.md with one section per page,
   then a final section "Gaps" listing questions none of the pages answer
   and claims they make without sources.
Do not draft anything. Return only the file.
```

Read the research file before you go on. If the gaps section is empty, either the query is saturated or the research was shallow; both are worth knowing before you spend a draft on it. This retrieval-first pattern is the same discipline as [grounding](/glossary/grounding) in a RAG system: the model writes from what it fetched, not from what it remembers.

## Step 4: Generate the brief

Run the [seo-content-brief-writer](/skills/marketing/seo-content-brief-writer) skill on the research file: "Use seo-content-brief-writer on research/ai-content-brief-template.md and write briefs/ai-content-brief-template.md." The output is a brief with search intent, a working title, an outline of H2s and H3s, the entities and questions to cover, internal links to include (from your own route list), a target length, and the gap the piece will own.

Edit it. Cut sections that only exist because a competitor has them, add the angle only you can write, and fix the internal links to real routes. The brief is the contract for every later step, and an approved brief is what separates this workflow from "write me a blog post."

## Step 5: Draft from the brief

"Write content/ai-content-brief-template.md following briefs/ai-content-brief-template.md and CLAUDE.md exactly. Frontmatter: title, description, slug, date. Put a source URL on the same line as every statistic. Return only the file." Two habits keep drafts honest: ask for the file, not a chat message, and refuse a draft that cites a page not in the research file. If it needs a fact it does not have, it should say so in a `TODO:` line rather than guess.

## Step 6: Run the content-editor agent

Before any SEO check, delegate a review: "Use the content-editor agent on content/ai-content-brief-template.md against its brief." The [content-editor](/agents/marketing/content-editor) agent reads both files and returns a numbered list: unsupported claims, sentences that break the voice rules, filler, and brief sections the draft skipped. Work the list yourself. An agent that rewrites the whole piece hides what changed; one that lists problems keeps you the author. The [brand-check](/commands/marketing/brand-check) command is the lighter option when you only want the voice pass.

## Step 7: On-page checks

Everything here is deterministic, so it belongs in a script, not a prompt. Ask Claude to write `scripts/onpage-check.mjs` once; it should parse the frontmatter and Markdown and fail on any of these:

| Check | Rule from CLAUDE.md |
|---|---|
| Title length | 50-60 characters, contains the target query |
| Meta description | 120-155 characters, one sentence, contains the query |
| H1 | Exactly one, matching the title |
| Heading order | No level skipped (H2 before H3) |
| Internal links | At least 3, each matching a route in `routes.txt` |
| Images | Every image has alt text |
| Query placement | Query appears in title, H1, and first paragraph |
| Sources | Every line with a number contains a URL |

Run `node scripts/onpage-check.mjs content/ai-content-brief-template.md` until it exits clean. If you pay for [Surfer](/tools/surfer) or [Clearscope](/tools/clearscope), this is where they fit: paste the draft in for term coverage against ranking pages. They score; they do not replace the brief or the editor pass.

## Step 8: Export and publish

Commit the research, brief, draft, and any script change in one commit so the trail stays together. Export to whatever your CMS takes: Claude can convert the Markdown to HTML or MDX, or you paste into the editor. After publishing, add the live URL to the brief. When the piece needs a refresh, re-run step 3 to see what the SERP now covers and step 7 to make sure the update did not break anything.

## What this workflow does not do

It does not pick keywords, and it does not make thin content rank. Google's own guidance on generative AI content says the tools are "particularly useful when researching a topic, and to add structure to original content," which is the role they play here, and warns that generating many pages without adding value may violate its scaled content abuse policy. The research file and the gaps section are your defense: if the draft has nothing the ranking pages lack, do not publish it. The same logic applies to AI search features; [generative engine optimization](/glossary/generative-engine-optimization) and [answer engine optimization](/glossary/answer-engine-optimization) are, at bottom, the same brief with more emphasis on direct answers to the questions in it. If you use Anthropic's marketing plugin, its `seo-audit` skill is the site-level view that feeds this per-article loop; [the plugin guide](/guides/marketing/claude-marketing-plugin-guide) explains how they chain.
