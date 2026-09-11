---
title: "What Is Claude Cowork? The Complete Guide for Non-Developers"
description: "Claude Cowork explained for non-developers: what the desktop agent does with your files and apps, how it differs from chat and Claude Code, plans, and safety."
seoTitle: "What Is Claude Cowork? The Non-Developer's Guide (2026)"
seoDescription: "Claude Cowork explained for non-developers: what it does with your files and apps, how it differs from chat and Claude Code, plans, platforms, and safety."
author: "Imtiaz Rayhan"
date: 2026-09-10
freshness: "tier1"
color: "green"
depth: standard
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["developers", "sales", "founders", "marketers"]
tags: ["claude", "cowork", "desktop-agent", "knowledge-work", "getting-started"]
featured: true
keywords: ["Claude Cowork", "Claude desktop agent", "Cowork vs Claude Code", "Cowork plugins", "Cowork permissions"]
summary: "Claude Cowork is Claude as a desktop agent: you connect a folder or an app, describe the outcome, and it works through the steps itself, creating files, filling forms, and asking before anything risky. It is included on every paid Claude plan (not Free), runs in Claude Desktop on macOS and Windows plus web and mobile, and extends with plugins and connectors."
keyTakeaways:
  - "Cowork is Claude Code's agent loop pointed at knowledge work: folders, documents, spreadsheets, the browser, and connected apps, with no terminal."
  - "Research preview on macOS for Max on January 12, 2026; generally available on macOS and Windows April 9, 2026; web and mobile cloud sessions July 7, 2026."
  - "Plans: Pro, Max, Team, and Enterprise include it; Free does not. Cowork tasks draw from the same usage pool as chat and Claude Code, and use more of it."
  - "Connectors reach apps over MCP with three approval modes (Manual, Auto, Skip); plugins bundle skills and connectors per role, installed via Customize > Plugins."
  - "Safety is structural: work runs in an isolated VM or cloud sandbox, Claude only sees folders you connect, and permanent deletion always needs an explicit Allow."
  - "Write tasks like a brief: name the output file, the columns or sections, the rules, and what not to touch. Then review the result before the next step."
faq:
  - q: "What is Claude Cowork?"
    a: "Claude Cowork is the agent mode of Claude for knowledge work. Instead of one reply per prompt, you describe an outcome, and Claude works through the steps on its own: reading files in a folder you connect, creating documents and spreadsheets, browsing sites, and using connected apps. Anthropic describes it as bringing Claude Code's agentic capabilities to work beyond coding, with no terminal required."
  - q: "Which Claude plans include Cowork?"
    a: "Pro, Max, Team, and Enterprise. It is not available on the Free plan. On Team and Enterprise it is on by default but organization owners can disable it, and cloud sessions on Enterprise are off until an admin turns them on. Cowork consumes more of your usage allocation than chatting."
  - q: "How is Cowork different from Claude Code?"
    a: "Same agentic architecture, different workspace. Claude Code runs in a terminal or IDE against a code repository and is built for developers. Cowork runs in the Claude Desktop app, on the web, and on mobile against your folders, documents, browser, and connected business apps, and is built for people who do not write code."
  - q: "What platforms does Cowork run on?"
    a: "Claude Desktop for macOS and Windows gives the full experience, including local folder access, the built-in browser, and computer use. Web at claude.ai and the iOS and Android apps run cloud sessions, in beta as of September 2026, which reach local files and the browser only through an open desktop app. The Chrome side panel also opens a Cowork session on Max and Team plans, rolling out to Pro."
  - q: "Is Cowork safe to give access to my files?"
    a: "It sees only the folders you connect, runs its work in an isolated VM on desktop or a temporary cloud sandbox, requires explicit permission before permanently deleting any file, and asks before accessing each application when computer use is on. Anthropic recommends manual approval for tasks that touch sensitive files or accounts and giving Claude access only to sites you trust."
related: ["guide:claude-knowledge-work-plugins", "guide:claude-plans-compared-2026", "guide:what-is-claude-code", "tool:claude-cowork", "tool:claude", "glossary:claude-cowork", "glossary:claude-plugins", "glossary:ai-connectors"]
sources:
  - title: "Get started with Claude Cowork"
    url: "https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork"
    publisher: "Anthropic"
  - title: "Use Claude Cowork on web, desktop, and mobile"
    url: "https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile"
    publisher: "Anthropic"
  - title: "Use Claude Cowork safely"
    url: "https://support.claude.com/en/articles/13364135-use-claude-cowork-safely"
    publisher: "Anthropic"
  - title: "Claude Cowork architecture overview"
    url: "https://support.claude.com/en/articles/14479288-claude-cowork-architecture-overview"
    publisher: "Anthropic"
  - title: "Claude release notes"
    url: "https://support.claude.com/en/articles/12138966-release-notes"
    publisher: "Anthropic"
  - title: "Use plugins in Claude"
    url: "https://support.claude.com/en/articles/13837440-use-plugins-in-claude"
    publisher: "Anthropic"
  - title: "Claude Cowork product page"
    url: "https://claude.com/product/cowork"
    publisher: "Anthropic"
howtoSteps:
  - name: "Install Claude Desktop"
    text: "Download the Claude Desktop app for macOS or Windows from claude.com. Cowork's local folder access, built-in browser, and computer use all run through the desktop app, even when you start a task from the web or your phone."
  - name: "Sign in with a paid plan"
    text: "Sign in with a Pro, Max, Team, or Enterprise account. Cowork is not on the Free plan. On Team and Enterprise, an organization owner may need to enable it under Organization settings."
  - name: "Select Cowork and connect a folder"
    text: "In the message box, select Cowork in the bottom-left corner. Create a project with Use an existing folder and pick the folder Claude should work in. Claude reads and writes only inside folders you connect."
  - name: "Add a connector or a plugin"
    text: "Open the Customize menu in the left sidebar. Under Connectors, authorize the apps the task needs (Gmail, Google Drive, Slack, Notion, and others) and set each one's approval mode. Under Plugins, browse the Knowledge Work marketplace and install a role plugin if one fits."
  - name: "Run a task with a clear brief"
    text: "Describe the outcome, the output file name, the structure you want, the rules, and anything Claude must not touch. Watch the step list as it works; in Manual mode it pauses for approval before consequential actions."
  - name: "Review the result before the next step"
    text: "Open the files Claude produced and spot-check them against the sources. Cowork requires explicit permission before permanently deleting any file, but everything else it created is yours to verify before you build on it."
---

Claude Cowork is the version of Claude that does the work instead of describing it. You point it at a folder, a connected app, or a website, describe the outcome you want, and it works through the steps on its own: opening files, reading them, creating documents and spreadsheets, filling forms, and asking you before anything risky. It is included in every paid Claude plan and runs in the Claude Desktop app, on the web, and on mobile.

This guide is for people who do not write code: what Cowork is, how it differs from Claude chat and Claude Code, which plans and platforms include it, how plugins and connectors extend it, how its permission model works, and a worked example you can copy.

**Last verified: September 2026**, against Anthropic's support articles, release notes, and product page.

## What Cowork is

Anthropic's own description is the cleanest: Cowork "brings Claude Code's agentic capabilities to knowledge work beyond coding." You "describe an outcome, step away, and come back to finished work." Under the hood it uses the same agentic architecture as Claude Code, the developer tool, but there is no terminal. You start it from the same message box as a normal chat by selecting **Cowork** in the bottom-left corner.

[Claude Cowork](/tools/claude-cowork) moved from experiment to product quickly:

- **January 12, 2026**: research preview on Claude Desktop, macOS only, for the Max plan; Pro followed four days later.
- **January 30, 2026**: plugin support, with eleven open-source role plugins (seventeen Anthropic-built plugins in the repo as of September 2026).
- **February 24-25, 2026**: a plugin marketplace, admin controls, scheduled tasks, and a Customize menu that groups skills, plugins, and connectors.
- **April 9, 2026**: generally available on macOS and Windows through Claude Desktop.
- **July 7, 2026**: web and mobile, with sessions running in the cloud (beta).
- **August 25, 2026**: memory works across chat and Cowork in the cloud.

The glossary entry for [Claude Cowork](/glossary/claude-cowork) has the one-paragraph version.

## Cowork vs. Claude chat vs. Claude Code

Three products, one model family. The difference is who performs the steps.

| | Claude chat | Claude Cowork | Claude Code |
|---|---|---|---|
| Unit of work | One reply per prompt | A multi-step task | A multi-step coding task |
| Works on | Text and files you upload | Your folders, connected apps, the browser | A code repository |
| Runs where | Web, desktop, mobile | Desktop, web, mobile, Chrome side panel | Terminal, IDE, web |
| Keeps going after you leave | No | Yes, in cloud sessions (beta) | Yes, on Claude Code on the web |
| Built for | Everyone | Knowledge workers | Developers |
| Plan | Free and up | Pro and up | Pro and up |

In [regular Claude](/tools/claude) you are the runtime: you ask, read the answer, and paste the next thing in. In Cowork, Claude is the runtime. It opens the files, decides the next step, and shows each one as it goes. [Claude Code](/tools/claude-code) runs the same loop against code, in the terminal; for the developer side, start with [What Is Claude Code?](/guides/getting-started/what-is-claude-code)

## Plans and platforms

**Plans.** Cowork is included on Pro, Max, Team, and Enterprise. It is not on the Free plan. On Team and Enterprise it is on by default, but organization owners can turn it off, and Enterprise defaults to *off* for cloud sessions until an admin enables them. Prices and everything else each plan unlocks live on [Claude plans compared](/guides/getting-started/claude-plans-compared-2026).

**Platforms**, as of September 2026:

- **Claude Desktop for macOS and Windows**: the full experience, including local folder access, the built-in browser, and computer use.
- **Web (claude.ai) and iOS/Android**: cloud sessions, in beta for Pro, Max, and Team, and on Enterprise where the admin enables them. Local files, local connectors, the browser, and computer use still route through the desktop app, which has to be open and online.
- **Chrome side panel**: opens a Cowork session directly on Max and Team, rolling out to Pro; see [Claude in Chrome](/tools/claude-for-chrome).

Cloud sessions are what let you close your laptop while Claude keeps going, and scheduled tasks run with no device online.

## What it can do

- **Files.** Read, organize, rename, create, and edit files in folders you connect. On desktop there are no uploads or downloads; Claude reads and writes the folder directly.
- **Documents and spreadsheets.** Produce Excel files with formulas, PowerPoint decks, Word documents, and reports. Since February 24, 2026, Cowork can run multi-step tasks across Excel and PowerPoint on all paid plans on Mac and Windows (a research preview at launch); [Claude for Excel](/tools/claude-for-excel) is the in-app counterpart.
- **Browser.** A built-in browser on desktop opens sites, reads pages, clicks, types, and fills forms while you watch, and can import your existing logins.
- **Computer use.** In beta for Pro and Max only (not Team or Enterprise), Claude can operate other applications, asking permission before it touches each app.
- **Scheduled tasks and Dispatch.** Save a task to run on a cadence or on demand, or assign work from your phone through a persistent thread (research preview for Pro and Max since March 2026).
- **Projects.** Group tasks in a workspace with its own files, instructions, and memory. A project created from a local folder stays on that computer.

## Plugins and connectors

Two things extend Cowork, and it helps to keep them straight.

**[Connectors](/glossary/ai-connectors)** wire Claude to a service (Slack, Gmail, Google Drive, Notion, HubSpot, Snowflake, and many more) over the [Model Context Protocol](/glossary/model-context-protocol). You manage them from the **Customize** menu, and each connector's tools run in one of three approval modes: *Manual* (Claude asks each time), *Auto* (Claude decides, with safety checks), or *Skip* (no approval, nothing checks the action). Connector tokens never enter the sandbox where Claude's work runs; calls are made server-side.

**[Plugins](/glossary/claude-plugins)** bundle [skills](/glossary/agent-skills), connectors, slash commands, and sub-agents for a role. Install one from **Customize > Plugins > Browse plugins**. The Knowledge Work marketplace is registered by default, and Anthropic's role plugins (sales, finance, legal, marketing, HR, and more) are open source; every one of them is cataloged in [Anthropic's knowledge-work plugins, explained](/guides/getting-started/claude-knowledge-work-plugins). Hooks and sub-agents inside a plugin run only in Cowork; in plain chat they appear grayed out.

## The permission and safety model

Cowork takes real actions, so know what stands between a bad instruction and a deleted folder.

- **Scope.** Claude only sees the folders you connect. Cloud sessions reach your computer only for those folders, with the permissions you already set, and the sandbox cannot reach your home or company network.
- **Isolation.** On desktop, the agent loop runs natively and code execution runs in an isolated VM (Apple Virtualization.framework on macOS, Hyper-V on Windows). In the cloud, both run in a temporary sandbox on Anthropic's infrastructure that is removed when the session ends.
- **Deletion.** "Cowork requires your explicit permission before permanently deleting any files." You see a prompt and must select Allow.
- **Injection.** Files and web pages can carry hidden instructions. Anthropic scans untrusted content entering Claude's context and flags potential injections, and reviews each action for safety before it runs.

Anthropic's own advice: switch to manual approval when a task touches sensitive files, accounts, or sites; only give Claude access to sites you trust; and be cautious with financial documents, credentials, and personal records.

> [!WARNING]
> Approval modes are a dial, not a guarantee. *Skip* means "nothing checks its actions automatically." Reserve it for low-stakes, well-understood tasks in a folder you have backed up.

## Worked example: a folder of invoices into a spreadsheet

Say you have `Documents/Invoices-Q3` with forty PDFs from different vendors and you want one spreadsheet.

1. Open Claude Desktop, select **Cowork**, and create a project with **Use an existing folder**, pointing at `Invoices-Q3`.
2. Give it the task as a brief:

```text
Read every PDF in this folder. For each invoice, extract vendor, invoice number,
invoice date, due date, currency, subtotal, tax, and total. Put the results in
invoices-q3.xlsx with one row per invoice, a totals row using SUM formulas, and
a second sheet listing any file you could not parse and why. Do not rename or
move the PDFs.
```

3. Watch the step list. Claude opens each file; if a scan is unreadable it lists it on the second sheet rather than guessing.
4. Open `invoices-q3.xlsx`. Spot-check five rows against the PDFs, and change one subtotal to confirm the totals row recalculates.
5. If it holds up, ask for the follow-up: "Flag invoices due in the next 14 days and draft a reminder email for each into a `reminders/` folder." A Gmail connector could send them; keep it in Manual mode.

The brief is the whole trick: name the output file, the columns, the formula behavior, and what *not* to touch.

## Limits to know

- Cowork "consumes more of your usage allocation than chatting with Claude." It draws from the same pool as chat and Claude Code; check Settings > Usage.
- Sessions cannot be shared with other people.
- Computer use is Pro and Max only, and in beta.
- Web and mobile cannot touch local files or the browser unless the desktop app is online.
- It is not a substitute for review. Anthropic advises against using the built-in browser for sensitive financial, medical, or personal data.

## Where to go next

If you live in Microsoft 365, compare Cowork's approach with [Microsoft Copilot](/tools/microsoft-copilot), which sits inside the Office apps rather than alongside them. To pick a plan, read [Claude plans compared](/guides/getting-started/claude-plans-compared-2026), then pick your role on the [Start here](/for) page.
