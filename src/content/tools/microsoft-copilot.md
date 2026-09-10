---
name: "Microsoft 365 Copilot"
description: "Microsoft's work assistant inside Word, Excel, PowerPoint, Outlook, and Teams, grounded in your company's Microsoft 365 data, with Researcher and Analyst."
seoDescription: "Microsoft 365 Copilot for founders and analysts: Copilot Chat vs the paid add-on as of September 2026, Researcher and Analyst agents, Cowork, Copilot Studio."
date: 2026-09-10
url: "https://www.microsoft.com/en-us/microsoft-365-copilot"
pricing: "paid"
category: "assistant"
color: "purple"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "marketers"]
tags: ["microsoft-365-copilot", "microsoft", "office", "assistant", "enterprise"]
featured: false
os: ["Web", "Windows", "macOS", "iOS", "Android"]
alternativeTo: ["claude-cowork", "gemini", "chatgpt"]
related: ["tool:claude-cowork", "tool:claude", "tool:gemini", "tool:chatgpt", "tool:github-copilot", "tool:claude-for-excel", "guide:claude-cowork-guide"]
keywords: ["Microsoft 365 Copilot", "Copilot Chat", "Researcher agent", "Analyst agent", "Copilot Studio", "Copilot Cowork"]
summary: "Microsoft 365 Copilot is the AI assistant built into Word, Excel, PowerPoint, Outlook, and Teams. Copilot Chat is included with eligible Microsoft 365 plans but only sees the web and what you paste in; the paid add-on grounds answers in your company's email, files, meetings, and chats, and unlocks Researcher, Analyst, Cowork, and unlimited agents."
faq:
  - q: "Is Microsoft 365 Copilot the same as GitHub Copilot?"
    a: "No. Microsoft 365 Copilot is the work assistant inside Office apps and Teams, licensed per user on top of a Microsoft 365 plan. GitHub Copilot is a separate, independently licensed AI coding assistant for developers. Microsoft's own docs list GitHub Copilot as a different product that does not require a Microsoft 365 Copilot license."
  - q: "How much does Microsoft 365 Copilot cost in 2026?"
    a: "As of September 2026, Microsoft lists Copilot Chat as included with eligible Microsoft 365 subscriptions, the enterprise Microsoft 365 Copilot add-on at $30 per user per month paid yearly, and the small-business Microsoft 365 Copilot Business add-on at $18 per user per month paid yearly (promotional, down from $21, through December 2026; $25.20 monthly). Both add-ons require a qualifying Microsoft 365 plan. The consumer Copilot Pro plan is no longer sold; Microsoft 365 Premium replaced it."
  - q: "What do the Researcher and Analyst agents do?"
    a: "Researcher handles multi-step research questions, pulling from the web and your work content (files, email, meetings, chats you can access) to write a structured, cited report, and it asks clarifying questions before it runs. Analyst is the data-focused counterpart, better suited to Excel and spreadsheet tasks. Both are preinstalled for licensed users and run inside the Microsoft 365 commercial data boundary."
  - q: "What is Copilot Cowork?"
    a: "Copilot Cowork is Microsoft's agent that carries out tasks across your Microsoft 365 environment: sending email, scheduling meetings, creating Word, Excel, PowerPoint, and PDF files, posting in Teams, running deep research, and scheduling recurring prompts. It asks for approval before consequential actions. It is generally available for work accounts under usage-based billing with Copilot credits, and in preview for personal accounts."
---

Microsoft 365 Copilot is the AI assistant that lives inside Word, Excel, PowerPoint, Outlook, OneNote, and Teams, plus a standalone Microsoft 365 Copilot app on the web, desktop, and mobile. Its distinguishing feature is not the model but the grounding: with the paid license, answers draw automatically on your organization's email, files, meetings, calendars, and chats through Microsoft Graph and Work IQ, scoped to what you already have permission to see.

It is aimed at companies that run on Microsoft 365 and want AI where the work already happens: the founder in Outlook and Teams, the marketer building decks in PowerPoint, the analyst in Excel. It is not [GitHub Copilot](/tools/github-copilot), Microsoft's coding assistant, which is a separate product with its own licensing.

## Highlights

- **Copilot in the apps** — draft, rewrite, and summarize in Word; analyze data, write formulas, and build visuals in Excel; generate and restyle decks in PowerPoint; draft and summarize threads in Outlook; summarize and transcribe meetings and capture action items in Teams.
- **Grounded in work data** — the Premium license grounds responses in Microsoft Graph and Work IQ, with Copilot Search and semantic indexing across your tenant. Work IQ can be switched off if you want web-only answers.
- **Researcher and Analyst agents** — Researcher writes cited, multi-source reports from web plus work content and asks clarifying questions first; Analyst is the counterpart better suited to Excel and data tasks. Facilitator is the third pre-built agent.
- **Copilot Cowork** — describe a task and Cowork sends the email, schedules the meeting, builds the document, or posts in Teams, showing each step and pausing for approval before anything consequential. Custom skills and Microsoft 365 App Store plugins extend it.
- **Copilot Studio** — a low-code builder for custom agents connected to your data and business processes; licensed users get unlimited agent use, Copilot Chat users pay per use.
- **Model selection** — Auto routing by default, with Quick response and Think deeper modes; Anthropic models are available in applicable licensed experiences.

## In a founder or analyst workflow

The pattern that works is to let Copilot do the gathering and keep the judgment. A Monday status pass, for example, is one Researcher request followed by an Excel session:

```text
Researcher: What changed on the Northwind renewal since last Monday?
Use my email, Teams chats, and the "Northwind" SharePoint folder. Give me
a one-page brief with a risks section and cite each source.
```

Then open the pipeline workbook and ask Copilot in Excel to flag rows where the close date slipped more than two weeks and explain the formula it used. When the same brief is needed every week, schedule it as a recurring prompt in Cowork so it lands in your inbox before the meeting.

> [!WARNING]
> Copilot Chat (the free tier) only sees the web and whatever you paste, upload, or have open in Teams or Outlook. If a colleague's answer "used our files" and yours did not, the difference is almost always the license, not the prompt.

## Good to know

Microsoft describes three tiers. Copilot Chat is included with eligible Microsoft 365 subscriptions for Microsoft Entra accounts and is web-grounded, with pay-as-you-go access to agents that use work data. Microsoft 365 Copilot (Basic) is standard, capacity-limited access to Copilot inside Word, Excel, PowerPoint, and OneNote without the add-on. Microsoft 365 Copilot (Premium) is the full add-on, with priority access, Graph and Work IQ grounding, the pre-built agents, and Cowork via usage-based billing.

Plans as of September 2026, per microsoft.com: Copilot Chat is listed as included; the enterprise Microsoft 365 Copilot add-on is $30 per user per month paid yearly, on top of a qualifying Microsoft 365 plan; the Microsoft 365 Copilot Business add-on for smaller companies is $18 per user per month paid yearly through December 2026 (list $21; $25.20 monthly), and Microsoft also sells Business Standard and Business Premium bundles with Copilot included. For individuals, Copilot Pro is no longer available for purchase; its support ended August 1, 2026, and Microsoft points personal users to Microsoft 365 Premium, where AI features apply only to the subscription owner.

Copilot is available on the web at m365copilot.com, in the desktop app for Windows and Mac, in the iPhone and Android apps, and inside the Office apps. Enterprise Data Protection applies across all three tiers with a work account, EU traffic stays inside the EU Data Boundary, and admins manage it from Copilot controls in the admin center.

The closest Anthropic comparison is [Claude Cowork](/tools/claude-cowork), which delegates file-based tasks in a similar approve-each-step style but without the Office integration; [Claude for Excel](/tools/claude-for-excel) is the head-to-head for spreadsheet work. On the Google side, [Gemini](/tools/gemini) plays the same role for Workspace, and [ChatGPT](/tools/chatgpt) is the general assistant with the broadest consumer feature set.
