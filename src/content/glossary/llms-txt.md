---
term: "llms.txt"
description: "llms.txt is a proposed Markdown file at a site's root that gives AI models a curated summary and link list, so they can find the right pages at inference time."
date: 2026-09-10
topics: ["ai-at-work", "rag-retrieval"]
audience: ["marketers", "developers"]
tags: ["llms-txt", "ai-search", "geo", "seo", "markdown"]
related: ["glossary:generative-engine-optimization", "glossary:answer-engine-optimization", "glossary:ai-overviews", "glossary:agents-md", "guide:ai-content-and-search-2026", "guide:claude-code-for-marketers", "glossary:rag"]
faq:
  - q: "What goes in an llms.txt file?"
    a: "Markdown in a fixed shape: an H1 with the site or project name, a blockquote with a short summary, optional paragraphs of detail, then H2 sections that list Markdown links to the pages that matter, each with an optional note. A section titled Optional holds secondary links a model can skip. The spec at llmstxt.org shows the template."
  - q: "Does llms.txt help me rank in Google AI Overviews?"
    a: "Not according to Google. Its documentation says you do not need to create new machine-readable files, AI text files, or markup to appear in AI Overviews or AI Mode. llms.txt is aimed at AI agents and assistants that fetch a site directly, and at documentation sites where a model needs a map. Treat it as cheap and harmless, not as a ranking lever."
  - q: "Who uses llms.txt?"
    a: "The proposal page says thousands of sites publish one and lists OpenAI, Anthropic, and Google among the companies that do. Anthropic's Claude documentation, for instance, points at a docs index under /docs/llms.txt. This site publishes one at agentscamp.com/llms.txt."
summary: "llms.txt is a proposed convention for a Markdown file served at a site's root (`/llms.txt`) that gives large language models a curated summary of the site and a list of its most useful pages, so an AI agent can find the right content at inference time without parsing HTML built for humans."
---

**llms.txt is a proposed convention for a Markdown file served at a site's root (`/llms.txt`) that gives large language models a curated summary of the site and a list of its most useful pages, so an AI agent can find the right content at inference time without parsing HTML built for humans.**

The proposal was published by Jeremy Howard of Answer.AI on September 3, 2024, with a v2 revision dated August 10, 2026. The format is deliberately plain: an H1 with the site name, a blockquote summary, optional detail paragraphs, then H2 sections of Markdown links with short notes, plus an "Optional" section for secondary material a model can skip when context is tight. It sits alongside robots.txt and sitemap.xml in spirit but serves a different reader: not a crawler deciding what to index, but a model deciding what to read right now. The related [AGENTS.md](/glossary/agents-md) convention does a similar job for coding agents inside a repository.

Two things are worth knowing before you add one. First, Google says you do not need "new machine readable files, AI text files, or markup" to appear in [AI Overviews](/glossary/ai-overviews) or AI Mode, so llms.txt is not a [generative engine optimization](/glossary/generative-engine-optimization) lever for Google Search. Second, it does help agents and assistants that fetch your site directly, which is why documentation publishers adopted it early; Anthropic's Claude docs expose an index at claude.com/docs/llms.txt, and agentscamp.com publishes one at https://agentscamp.com/llms.txt. The [AI content and search in 2026](/guides/marketing/ai-content-and-search-2026) guide places it in a content plan, and [Claude Code for marketers](/guides/marketing/claude-code-for-marketers) shows how to generate one from a sitemap with an agent.
