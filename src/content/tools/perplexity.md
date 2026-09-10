---
name: "Perplexity"
description: "An AI answer engine that cites its sources on every response, with a Research mode for long reports, Projects for shared context, and the Comet browser."
seoDescription: "Perplexity for founders, marketers, and analysts: Free, Pro, Max, and Enterprise plans as of September 2026, Research mode, Projects, citations, and Comet."
date: 2026-09-10
url: "https://www.perplexity.ai"
pricing: "freemium"
category: "assistant"
color: "cyan"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "marketers"]
tags: ["perplexity", "answer-engine", "research", "citations"]
featured: false
os: ["Web", "macOS", "iOS", "Android"]
alternativeTo: ["chatgpt", "gemini", "notebooklm"]
sameAs: ["https://x.com/perplexity_ai", "https://www.linkedin.com/company/perplexity-ai/"]
related: ["tool:chatgpt", "tool:gemini", "tool:notebooklm", "tool:claude", "glossary:ai-connectors"]
keywords: ["Perplexity", "Perplexity Pro", "Perplexity Max", "Perplexity Research", "answer engine", "Comet browser"]
summary: "Perplexity is an answer engine: ask a question, get a synthesized answer with inline citations you can check. Research mode runs dozens of searches and writes a cited report in minutes, Projects keep files, instructions, and connectors together for a team, and Comet is Perplexity's own browser with an assistant built in. Plans run from Free to Enterprise."
faq:
  - q: "How much does Perplexity cost in 2026?"
    a: "As of September 2026, Perplexity's pricing page lists Free at $0, Pro at $20 per month, and Max at $200 per month. Enterprise Pro starts at $40 per seat per month or $400 per seat per year, and Enterprise Max sits above it with the highest limits and admin features. Free gives near-unlimited basic searches but only a few Pro Searches a day and one Research query a month."
  - q: "What is Perplexity Research mode?"
    a: "Research (formerly Deep Research) performs dozens of searches, reads hundreds of sources, and reasons through them to produce a comprehensive cited report, typically in a few minutes. It refines its own research plan as it learns, and the report can be exported to PDF or a document or turned into a shareable Perplexity Page. You cannot pick a model for it; Perplexity chooses the combination."
  - q: "What happened to Perplexity Spaces?"
    a: "Spaces are now called Projects. A Project is a persistent, shareable workspace holding search sessions, Computer tasks, files, custom instructions of up to 8,000 characters, and connected tools. Non-Enterprise Projects allow up to five contributors; Enterprise-owned Projects allow thousands, with admin controls over sharing."
  - q: "Is Perplexity better than ChatGPT for research?"
    a: "Perplexity is built around citations, so every answer shows where it came from and is easier to verify, which matters for competitive research, market sizing, and anything you will quote. ChatGPT and Claude are better at long-form drafting and working over your own documents. Many teams use Perplexity to gather and check facts, then move to Claude or ChatGPT to write."
---

Perplexity is an AI answer engine. Where [ChatGPT](/tools/chatgpt) and [Claude](/tools/claude) start from a blank chat, Perplexity starts from a search: it retrieves sources, synthesizes an answer, and shows inline citations for every claim so you can click through and check. In 2026 it has grown into a broader work tool, with a Research mode for long reports, Projects for team context, Computer for delegated multi-step tasks, and its own browser, Comet.

It is aimed at people whose work depends on getting facts right and being able to show where they came from: founders sizing a market, marketers tracking competitors, analysts building a source list before they write. It is less of a drafting tool than the general assistants, and that trade-off is the point.

## Highlights

- **Citations on every answer** — each response links the sources it drew on, and Pro subscribers get many more citations per answer for deeper reference trails.
- **Research mode** — runs dozens of searches, reads hundreds of sources, reasons about what to check next, and writes a comprehensive report in a few minutes. Export to PDF or a document, or publish as a Perplexity Page.
- **Projects (formerly Spaces)** — persistent workspaces with files, instructions, prioritized domains, connectors, and skills. Roles (owner, edit, view), restricted sharing by default, and the option to bind a Slack or Teams channel so its context flows into the Project.
- **Perplexity Computer** — the agent layer: describe an outcome and it orchestrates multiple models to research, analyze, and create documents, spreadsheets, presentations, and apps, with scheduled tasks for recurring reports.
- **Comet browser** — Perplexity's browser for Mac, Windows, iOS, and Android, with Comet Assistant able to answer questions about the page you are on, respond to emails, and take care of busywork from the browser window.
- **Model choice** — Pro and above pick among frontier models from OpenAI, Anthropic, Google, and Perplexity's in-house Sonar, or let Perplexity route automatically.

## In a founder or marketer workflow

The pattern is research first, then hand the sources to your writing tool. Set up a Project for the initiative, add instructions that force the format you want, and pin the domains you trust:

```text
Compare the pricing pages of Notion, Coda, and Slite as of this month.
For each: plans, monthly and annual price, seat minimums, and what the
free tier excludes. Cite the vendor's own page for every number and
flag anything you had to infer. Output a table, then three sentences on
where we sit.
```

Run it as a Pro Search for a quick pass or as Research when you need the full report. Then paste the cited table into Claude or ChatGPT to draft the positioning doc, keeping Perplexity's links as your footnotes.

> [!NOTE]
> Citations make errors visible, not impossible. Perplexity still summarizes what a page says, so check the linked source for any number you plan to publish, and prefer vendor pages over secondary coverage when you pin domains in a Project.

## Good to know

Perplexity runs on the web, in a Mac app, and on mobile; the Comet browser adds Windows alongside Mac, iOS, and Android. Plans as of September 2026, per perplexity.ai: Free at $0 (near-unlimited basic searches, 3 Pro Searches a day, 1 Research query a month, citations, basic models), Pro at $20 per month (extended Pro Search and Research, advanced models, image and video generation, file and app creation, up to 50 file uploads per Project), and Max at $200 per month (highest model access, extended file and app creation, early access to new products, and Brain, a memory system for Computer that is free during its research preview). Max annual billing is only available on the website.

Enterprise Pro starts at $40 per seat per month or $400 per seat per year, with data never used for training, seat management, dedicated support, and internal knowledge search through shared Projects and centrally governed file connectors. Enterprise Max raises the limits substantially (Perplexity's comparison table lists 4,000 Pro Searches and 500 Research queries per week and month respectively, against 400 and 50 on Enterprise Pro) and adds SCIM, audit logs, configurable retention, and usage analytics with no seat minimum. The older Organization File Repository is being retired on October 1, 2026, in favor of Projects and connectors.

If source-grounded work over your own documents is the priority rather than the open web, [Gemini Notebook](/tools/notebooklm) is the closer comparison; if you want a general assistant with Google Workspace integration, see [Gemini](/tools/gemini).
