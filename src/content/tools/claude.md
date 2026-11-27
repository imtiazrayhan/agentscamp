---
name: "Claude"
description: "Anthropic's AI assistant app for web, desktop, and mobile, with Projects, connectors, Artifacts, skills, memory, and code execution."
seoDescription: "Claude is Anthropic's AI assistant app for web, desktop, and mobile: plans, Projects, MCP connectors, Artifacts, skills, memory, and models as of Nov 2026."
date: 2026-09-10
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://claude.com"
pricing: "freemium"
category: "assistant"
color: "pink"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["developers", "sales", "founders", "marketers"]
tags: ["claude", "anthropic", "assistant", "chat", "connectors", "skills"]
featured: false
related: ["tool:claude-cowork", "tool:claude-design", "tool:claude-for-excel", "tool:claude-for-chrome", "tool:claude-code", "guide:claude-plans-compared-2026", "guide:claude-skills-on-claude-ai-and-api", "glossary:ai-connectors", "glossary:claude-plugins"]
alternativeTo: ["chatgpt", "gemini", "perplexity"]
os: ["Web", "macOS", "Windows", "Linux", "iOS", "Android"]
sameAs: ["https://www.anthropic.com", "https://github.com/anthropics"]
summary: "Claude is Anthropic's AI assistant app on web, desktop (macOS, Windows, Linux), and mobile. Free includes chat, web search, memory, file creation, up to five Projects, Artifacts, Claude Design, Slides and Docs, skill uploads, and connectors. Pro, Max, Ultra, Team, and Enterprise add more usage, Claude Code, task hand-off, and Claude for Microsoft 365."
faq:
  - q: "What is Claude?"
    a: "Claude is Anthropic's AI assistant app. You chat with it on the web at claude.ai, in desktop apps for macOS and Windows (Linux in beta as of November 2026), and in iOS and Android apps. Beyond chat it can search the web, remember context across conversations, create files and run code, connect to your tools through MCP connectors, and render interactive Artifacts."
  - q: "How much does Claude cost?"
    a: "As of November 2026 the Free plan is $0. Pro is $20 per month billed monthly, or $17 per month on an annual plan ($200 billed up front). Max is $100 per month for 5x Pro usage, and Ultra is $200 per month, with 10x Pro weekly usage and no 5-hour limit for verified accounts. Team seats are $25 (Standard) or $125 (Premium) per month billed monthly, or $20 and $100 billed annually. Enterprise is $20 per seat per month billed annually with a 20-seat minimum, plus usage at API rates."
  - q: "Which plans include Claude Code, Cowork, and Design?"
    a: "Claude Code needs Pro or above, and Team and Enterprise seats include it. As of November 2026 the pricing page lists Claude Design, Slides, and Docs on every plan including Free, and Anthropic's help center confirms Design is available on Free, Pro, Max, Ultra, Team, and Enterprise. Cowork has merged into Claude itself, so handing off and scheduling tasks is a paid-plan feature of the main app. Free also gets Artifacts, memory, skills, connectors, and up to five Projects."
  - q: "Can I upload my own skills to Claude?"
    a: "Yes, on every plan including Free. Package the skill folder as a ZIP, open Customize, go to Skills, click the plus button, choose Create skill, then Upload a skill. Code execution and file creation must be enabled in Settings under Capabilities first. Skills you enable are also picked up by Cowork, by the Claude for Excel, PowerPoint, Word, and Outlook add-ins, and by Claude Code v2.1.273 or later when you sign in with the same account."
  - q: "Does Claude support MCP?"
    a: "Yes. Connectors in Claude are MCP integrations, and the pricing page lists connectors on every plan including Free. As of September 2026, Free accounts were limited to one custom connector built on a remote MCP server. The desktop app can also run local MCP servers from a config file. The connector directory lives under Customize."
---

Claude is Anthropic's AI assistant app: the chat product at claude.ai, plus native apps for macOS, Windows, iOS, and Android, and a Linux desktop build that is in beta as of November 2026 (Ubuntu and Debian). It is the front door to the rest of Anthropic's consumer and team products. [Claude Cowork](/tools/claude-cowork), [Claude Design](/tools/claude-design), [Claude Code](/tools/claude-code), [Claude for Excel](/tools/claude-for-excel), and [Claude for Chrome](/tools/claude-for-chrome) all hang off the same account and share the same usage allowance. Since September 16, 2026, Anthropic has been rolling out one Claude experience that makes everything Cowork does available from any conversation, so delegated tasks now start from the main app.

It is aimed at anyone who wants a general assistant that can also reach into their files and tools. Developers use it for research and quick prototypes before dropping into Claude Code; founders and marketers use it as a writing, analysis, and document-production workspace. The distinguishing features are less the chat itself and more the layer around it: Projects, connectors, skills, memory, and code execution.

## Highlights

- **Projects with a knowledge base.** Projects are available to every user, with Free capped at five projects; the pricing page and the help center agree on that as of November 2026. Upload documents, set project instructions, and every chat in the project starts with that context. Each project keeps its own memory separate from your other chats, and on paid plans Claude switches to a retrieval mode when project knowledge approaches the context limit.
- **Connectors (MCP integrations).** Google Drive, Slack, Notion, and the rest of the directory under Customize are MCP servers. Connectors are on every plan (as of September 2026, Free was limited to one custom remote MCP connector); Claude Desktop can also run local MCP servers. See the [AI connectors](/glossary/ai-connectors) entry for the non-developer framing.
- **Artifacts, including Design, Slides, and Docs.** Anything Claude makes that you would put in front of someone (a document, deck, design, dashboard, or small interactive tool) opens beside the conversation on every plan. Docs, Slides, and Design templates are available on Free; Data templates need a paid plan, and Sheets and Whiteboards are in beta on paid plans as of November 2026.
- **Skills, including your own.** Anthropic ships document skills for `.docx`, `.xlsx`, `.pptx`, and PDF. You can upload a custom SKILL.md folder as a ZIP on any plan under Customize > Skills, and enabled skills also apply inside Cowork, the Microsoft 365 add-ins, and Claude Code sessions signed in with the same account. Details in the [skills on claude.ai guide](/guides/skills/claude-skills-on-claude-ai-and-api).
- **Memory.** On by default for Free, Pro, Max, and Ultra on web, desktop, and mobile; owners control it on Team and Enterprise. Claude saves topics as you chat, you can edit them in settings, and incognito chats skip memory entirely. Since August 25, 2026, memory also carries into Cowork sessions in the cloud.
- **Code execution and file creation.** Available on every plan and enabled by default (new Enterprise organizations start with network access off). Claude can analyze uploaded data, chart it, and produce Excel, Word, PowerPoint, and PDF files, with a 30 MB per-file limit.

## In an AI-assisted workflow

A practical pattern is to treat a Project as a per-client or per-product workspace: load the brief, style guide, and reference data into project knowledge, connect Drive or Notion as a connector, then run recurring tasks from that context.

```text
Using the pricing sheet in project knowledge and the latest Notion
roadmap page, draft a one-page changelog for customers. Produce it as
a .docx and flag any feature whose ship date moved since last month.
```

> [!TIP]
> If a task needs to run for a while across many files, or on a schedule, hand it off as a task rather than asking for a single reply: since the [Cowork](/tools/claude-cowork) merge, Claude brings in Cowork's capabilities when a task involves your files. It uses the same Projects, connectors, and skills, but works in a folder or a cloud session rather than a single reply. [Claude plugins](/glossary/claude-plugins) bundle those pieces for a role.

## Good to know

Plans, as of November 2026 from claude.com/pricing: Free is $0 and includes chat on web, iOS, Android, and desktop, web search, memory, file creation with code execution, connectors, Artifacts, voice mode, and Claude Design, Slides, and Docs. Pro is $20 per month monthly or $17 per month annual, adding more usage, task hand-off and scheduling, Claude Code, Claude Data, Claude Science, Research, Opus, Projects beyond the Free cap of five, and Claude in Chrome and Microsoft 365. Max is $100 per month with 5x Pro usage, $100 a month in API credits, priority access at busy times, and early access to features. Ultra is $200 per month with 10x Pro weekly usage, no 5-hour limit for verified accounts, and $200 a month in API credits. Team is $25 per Standard seat or $125 per Premium seat monthly ($20 and $100 annual), with central billing and SSO. Enterprise is $20 per seat per month billed annually with a 20-seat minimum, plus usage at API rates, adding SCIM, audit logs, and retention controls. The [plans comparison](/guides/getting-started/claude-plans-compared-2026) walks through which product each tier unlocks.

Models, per the pricing page as of November 2026: Free gets Sonnet and Haiku; every paid plan adds Opus. Fable, Anthropic's top model, is reachable on Pro only through usage credits, capped at 50% of weekly limits on Max, Ultra, and Team premium seats, and included on Enterprise. The model picker varies by plan and organization settings, so check what your account shows.

Two caveats. Searching past chats is paid-only even though memory itself is free. And everything here shares one usage pool: a heavy Cowork or Design session draws down the same allowance as your chats.
