---
name: "Claude Cowork"
description: "Anthropic's agent for knowledge work that completes multi-step tasks in your folders, connectors, and browser, on desktop, web, and mobile."
seoDescription: "Claude Cowork is Anthropic's agent for knowledge work: multi-step tasks in your files and tools on desktop, web, and mobile. Plans, plugins, limits for 2026."
date: 2026-09-10
url: "https://claude.com/product/cowork"
pricing: "paid"
category: "assistant"
color: "pink"
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["developers", "sales", "founders", "marketers"]
tags: ["claude", "cowork", "anthropic", "agent", "knowledge-work", "plugins"]
featured: false
related: ["tool:claude", "tool:claude-code", "tool:claude-design", "tool:claude-for-excel", "tool:claude-for-chrome", "guide:claude-cowork-guide", "guide:claude-knowledge-work-plugins", "guide:claude-plans-compared-2026", "glossary:claude-cowork", "glossary:claude-plugins", "glossary:ai-connectors"]
alternativeTo: ["claude-code", "microsoft-copilot"]
os: ["macOS", "Windows", "Linux", "Web", "iOS", "Android"]
sameAs: ["https://www.anthropic.com", "https://github.com/anthropics/knowledge-work-plugins"]
summary: "Claude Cowork is Anthropic's agent for non-coding work: describe an outcome and Claude reads, edits, and creates files in folders you choose, uses connectors and plugins, and runs multi-step tasks to completion. Launched January 12, 2026 as a macOS research preview, it is now on Pro, Max, Team, and Enterprise across desktop, web, mobile, and Chrome."
faq:
  - q: "What is Claude Cowork?"
    a: "Claude Cowork is the agentic mode of the Claude app for knowledge work. Instead of answering in a single reply, Claude takes a task, plans it, and works through files in folders you grant access to, connectors you have enabled, and optionally a browser, then reports back with finished documents, organized files, or synthesized research. Anthropic describes it as bringing Claude Code's agentic capabilities to work beyond coding."
  - q: "Which plans include Claude Cowork?"
    a: "Paid plans only: Pro, Max, Team, and Enterprise. The Free plan does not include it. Cowork on Claude Desktop for macOS and Windows is available on all paid plans; the web, mobile, and Chrome side panel surfaces are on Pro, Max, and Team, with Enterprise availability depending on what an admin has enabled."
  - q: "How is Cowork different from Claude Code?"
    a: "Same agent loop, different audience and surface. Claude Code runs in a terminal or IDE and is built for code: it edits repositories, runs commands, and reads build output. Cowork runs inside the Claude app, works in ordinary folders and business tools, and adds scheduled tasks, cloud sessions, a built-in browser, and plugins aimed at roles like sales, legal, and finance."
  - q: "When did Cowork launch?"
    a: "January 12, 2026, as a research preview on Claude Desktop for macOS for Max plans. It expanded to Pro on January 16, 2026, became generally available on macOS and Windows on April 9, 2026, and reached web and mobile (in beta) on July 7, 2026."
  - q: "Does Cowork use more of my usage limit than chat?"
    a: "Yes. Anthropic's help center says Cowork consumes more of your usage allocation than chatting with Claude, because a single task involves many model calls and tool actions. Cowork, chat, Claude Code, and Claude Design all draw from the same pool."
---

[Claude Cowork](/glossary/claude-cowork) is Anthropic's agent for knowledge work. Where [Claude](/tools/claude) chat gives you one reply at a time, Cowork takes a task, plans it, and works through it: reading and editing files in folders you choose, pulling from connectors like Google Drive and Slack, driving a browser when a task needs one, and coming back with finished output. Anthropic's own framing is that it brings [Claude Code](/tools/claude-code)'s agentic capabilities to work beyond coding.

It is aimed at operators, founders, marketers, analysts, and anyone else whose day is documents and tools rather than repositories. Developers use it too, for the parts of their work that are not code: research digests, release notes, spreadsheet cleanup, weekly reports.

## Highlights

- **Works in your folders, not just your chat.** On desktop you point Cowork at a folder and it can read, edit, and create files there. Anthropic calls picking that folder the single most important setup choice for a task.
- **Cloud sessions (beta) that keep running.** On web, mobile, and the Chrome side panel, tasks run on Anthropic's servers in an isolated environment. Close your laptop and the work continues; the same session opens from any surface. Local file access, browser use, and computer use still require the desktop app.
- **Scheduled and parallel tasks.** Since February 25, 2026 you can schedule recurring or on-demand tasks; cloud scheduled tasks run with no device online. Cowork also coordinates sub-agents for parallel workstreams.
- **Plugins for roles.** Anthropic's open-source [knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) repo (Apache-2.0) launched with eleven plugins on January 30, 2026 and holds seventeen Anthropic-built plugins as of September 2026, among them sales, marketing, legal, finance, product management, customer support, data, HR, design, engineering, and operations. Each bundles skills and connectors (some add commands); see [Claude plugins](/glossary/claude-plugins).
- **Connectors, skills, projects, and memory carry over.** The [connectors](/glossary/ai-connectors), skills, and Projects you set up in chat are available in Cowork. Since August 25, 2026, memory also works across chat and Cowork in the cloud.
- **A built-in browser.** Cowork can fill forms and navigate sites in its own browser, or through [Claude for Chrome](/tools/claude-for-chrome) on desktop.

## In an AI-assisted workflow

A typical pattern is a folder-scoped task with a plugin enabled. Install the marketing plugin from Customize, connect the folder holding your assets, and describe the outcome rather than the steps:

```text
In the /launch-q4 folder: read the product brief and the three customer
interview transcripts, then write a launch announcement (docx), a
five-post social sequence (one file), and a FAQ. Use the brand-voice
skill. Save everything to /launch-q4/output and list what you created.
```

Cowork shows each step it takes, asks before permanently deleting anything, and lets you review the result before you use it. The [Cowork guide](/guides/getting-started/claude-cowork-guide) walks through a first session; the [plugins guide](/guides/getting-started/claude-knowledge-work-plugins) covers picking and installing a role plugin.

> [!WARNING]
> Cowork can read, write, and permanently delete files in connected folders, and it reads external content that may contain prompt injections. Anthropic's guidance: do not connect folders holding financial documents, credentials, or personal records; do not schedule tasks that send messages or make purchases on your behalf; and only add connectors and plugins from sources you trust.

## Good to know

Availability, per the Claude help center as of September 2026: Cowork is on paid plans only (Pro, Max, Team, Enterprise). Claude Desktop for macOS and Windows has it on all paid plans; web at claude.ai and the mobile apps have it on Pro, Max, and Team (Enterprise where an admin has enabled it); the Chrome side panel is on Max and Team and rolling out to Pro. A Linux desktop build is in beta for Ubuntu and Debian and lists Cowork for Pro, Max, Team, and Enterprise.

Timeline: research preview on macOS for Max on January 12, 2026; Pro on January 16, 2026; general availability on macOS and Windows on April 9, 2026; web and mobile in beta on July 7, 2026.

Limits worth knowing: Cowork uses more of your usage allowance than chat, and shares that allowance with chat, Claude Code, and [Claude Design](/tools/claude-design). Sessions cannot be shared with other people, though individual artifacts can. Some features remain desktop-only. If your work lives inside spreadsheets specifically, [Claude for Excel](/tools/claude-for-excel) works in the workbook itself rather than on files in a folder.
