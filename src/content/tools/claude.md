---
name: "Claude"
description: "Anthropic's AI assistant app for web, desktop, and mobile, with Projects, connectors, Artifacts, skills, memory, and code execution."
seoDescription: "Claude is Anthropic's AI assistant app for web, desktop, and mobile: plans, Projects, MCP connectors, Artifacts, skills, memory, and models as of Sept 2026."
date: 2026-09-10
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
summary: "Claude is Anthropic's AI assistant app on web, desktop (macOS, Windows, Linux beta), and mobile. The Free plan includes chat, web search, memory, file creation with code execution, up to five Projects, Artifacts, skill uploads, and one custom MCP connector. Pro, Max, Team, and Enterprise add more usage, Claude Code, Cowork, Design, and Claude for Microsoft 365."
faq:
  - q: "What is Claude?"
    a: "Claude is Anthropic's AI assistant app. You chat with it on the web at claude.ai, in desktop apps for macOS and Windows (Linux in beta), and in iOS and Android apps. Beyond chat it can search the web, remember context across conversations, create files and run code, connect to your tools through MCP connectors, and render interactive Artifacts."
  - q: "How much does Claude cost?"
    a: "As of September 2026 the Free plan is $0. Pro is $20 per month billed monthly or $17 per month billed annually. Max starts at $100 per month with a choice of 5x or 20x Pro usage. Team seats are $25 (Standard) or $125 (Premium) per month billed monthly, less annually. Enterprise is sales-assisted at $20 per seat per month plus usage at API rates."
  - q: "Which plans include Claude Code, Cowork, and Design?"
    a: "Pro and above. As of September 2026 the pricing page lists Claude Code, Claude Cowork, Claude Design, Claude Science, and Claude for Microsoft 365 under Pro, and Team and Enterprise seats include Code and Cowork. The Free plan is chat only, though it still gets Artifacts, memory, skills, one custom connector, and up to five Projects per the help center (the pricing page lists Projects as a paid feature)."
  - q: "Can I upload my own skills to Claude?"
    a: "Yes, on every plan including Free. Package the skill folder as a ZIP, open Customize, go to Skills, click the plus button, and choose Upload a skill. Code execution must be enabled in Settings under Capabilities first. Skills you enable are also picked up by Cowork and the Claude for Excel, PowerPoint, Word, and Outlook add-ins."
  - q: "Does Claude support MCP?"
    a: "Yes. Connectors in Claude are MCP integrations. Custom connectors using remote MCP servers are available on Free, Pro, Max, Team, and Enterprise, with Free limited to one custom connector. The desktop app can also run local MCP servers from a config file. The connector directory lives under Customize."
---

Claude is Anthropic's AI assistant app: the chat product at claude.ai, plus native apps for macOS, Windows, iOS, and Android, and a Linux desktop build in beta. It is the front door to the rest of Anthropic's consumer and team products. [Claude Cowork](/tools/claude-cowork), [Claude Design](/tools/claude-design), [Claude Code](/tools/claude-code), [Claude for Excel](/tools/claude-for-excel), and [Claude for Chrome](/tools/claude-for-chrome) all hang off the same account and share the same usage allowance.

It is aimed at anyone who wants a general assistant that can also reach into their files and tools. Developers use it for research and quick prototypes before dropping into Claude Code; founders and marketers use it as a writing, analysis, and document-production workspace. The distinguishing features are less the chat itself and more the layer around it: Projects, connectors, skills, memory, and code execution.

## Highlights

- **Projects with a knowledge base.** Anthropic's help center says Projects are available to every user, with Free capped at five projects, while the pricing page lists Projects (unlimited) under Pro and above. Upload documents, set project instructions, and every chat in the project starts with that context. Each project keeps its own memory separate from your other chats, and on paid plans Claude switches to a retrieval mode when project knowledge approaches the context limit.
- **Connectors (MCP integrations).** Google Drive, Slack, Notion, and the rest of the directory under Customize are MCP servers. Custom remote MCP connectors work on all plans, Free limited to one; Claude Desktop can also run local MCP servers. See the [AI connectors](/glossary/ai-connectors) entry for the non-developer framing.
- **Artifacts.** Standalone content, apps, and visualizations rendered in a side window on Free, Pro, Max, Team, and Enterprise. Free, Pro, and Max users can publish an artifact to a public link; Team and Enterprise share within the organization.
- **Skills, including your own.** Anthropic ships document skills for `.docx`, `.xlsx`, `.pptx`, and PDF. You can upload a custom SKILL.md folder as a ZIP on any plan, and enabled skills also apply inside Cowork and the Microsoft 365 add-ins. Details in the [skills on claude.ai guide](/guides/skills/claude-skills-on-claude-ai-and-api).
- **Memory.** On by default for Free, Pro, and Max on web, desktop, and mobile; organization owners enable it on Team and Enterprise. Claude saves topics as you chat, you can edit them in settings, and incognito chats skip memory entirely. Since August 25, 2026, memory also carries into Cowork sessions in the cloud.
- **Code execution and file creation.** Enabled by default on every plan. Claude can analyze uploaded data, chart it, and produce Excel, Word, PowerPoint, and PDF files, with a 30 MB per-file limit.

## In an AI-assisted workflow

A practical pattern is to treat a Project as a per-client or per-product workspace: load the brief, style guide, and reference data into project knowledge, connect Drive or Notion as a connector, then run recurring tasks from that context.

```text
Using the pricing sheet in project knowledge and the latest Notion
roadmap page, draft a one-page changelog for customers. Produce it as
a .docx and flag any feature whose ship date moved since last month.
```

> [!TIP]
> If a task needs to run for a while across many files, or on a schedule, hand it to [Cowork](/tools/claude-cowork) instead of chat. Cowork uses the same Projects, connectors, and skills, but works in a folder or a cloud session rather than a single reply. [Claude plugins](/glossary/claude-plugins) bundle those pieces for a role.

## Good to know

Plans, as of September 2026 from claude.com/pricing: Free is $0 and includes chat on web, iOS, Android, and desktop, web search, memory, file creation with code execution, connectors, and voice mode. Pro is $20 per month monthly or $17 per month annual, adding more usage, Claude Code, Cowork, Design, Science, Projects, research, multiple models, and Claude for Microsoft 365. Max starts at $100 per month with 5x or 20x Pro usage, higher output limits, and early access to features. Team is $25 per Standard seat or $125 per Premium seat monthly ($20 and $100 annual), with central billing and SSO. Enterprise is sales-assisted at $20 per seat per month plus usage at API rates, adding SCIM, audit logs, and retention controls. The [plans comparison](/guides/getting-started/claude-plans-compared-2026) walks through which product each tier unlocks.

Models, per the pricing page as of September 2026: Free gets Sonnet and Haiku; every paid plan adds Opus. Fable, Anthropic's top model, is reachable on Pro only through usage credits, capped at 50% of weekly limits on Max, not offered on Team, and included on Enterprise. The model picker varies by plan and organization settings, so check what your account shows.

Two caveats. Chat search across past conversations is paid-only even though memory itself is free. And everything here shares one usage pool: a heavy Cowork or Design session draws down the same allowance as your chats.
