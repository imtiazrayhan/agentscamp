---
name: "ChatGPT"
description: "OpenAI's general-purpose AI assistant for chat, research, and finished documents, with Projects, memory, plugins, and a Work mode for multi-step tasks."
seoDescription: "ChatGPT for founders and marketers: plans as of September 2026, Projects, memory, plugins, GPTs vs Workspace Agents, and where it fits next to Claude."
date: 2026-09-10
url: "https://chatgpt.com"
pricing: "freemium"
category: "assistant"
color: "green"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders", "marketers"]
tags: ["chatgpt", "openai", "assistant", "knowledge-work"]
featured: false
os: ["Web", "macOS", "Windows", "Linux", "iOS", "Android"]
alternativeTo: ["claude", "gemini", "perplexity"]
related: ["tool:claude", "tool:gemini", "tool:perplexity", "tool:microsoft-copilot", "guide:claude-skills-vs-custom-gpts", "guide:claude-plans-compared-2026", "guide:claude-vs-gpt-vs-gemini-coding"]
keywords: ["ChatGPT", "ChatGPT plans", "ChatGPT Projects", "ChatGPT Work", "custom GPTs", "Workspace Agents"]
summary: "ChatGPT is OpenAI's general-purpose assistant. In 2026 it has three modes: Chat for questions and drafts, Work for multi-step tasks that end in a document, deck, or spreadsheet, and Codex for developers. Projects, memory, plugins, and GPTs carry context between chats. Plans run from Free and Go through Plus, Pro, Business, and Enterprise."
faq:
  - q: "How much does ChatGPT cost in 2026?"
    a: "As of September 2026, OpenAI lists Free at $0, Go at $8 per month, Plus at $20 per month, Pro from $100 per month (a $200 tier exists), and Business at $20 per user per month billed annually for two or more users ($25 monthly). Enterprise and Edu are quoted by sales. Higher tiers raise usage limits and add models, and every paid tier can top up with ChatGPT credits."
  - q: "What is the difference between custom GPTs and Workspace Agents?"
    a: "A custom GPT is a saved persona with instructions, files, and optionally connected apps or custom actions, and it lives inside ChatGPT. Workspace Agents are reusable agents that a Business or Enterprise workspace can build, publish, share, and schedule with shared connections, and they can be triggered from outside ChatGPT through the Workspace Agents API. GPTs suit personal or team helpers; Workspace Agents suit governed, repeatable processes."
  - q: "What is ChatGPT Work?"
    a: "Work is a toggle in ChatGPT for tasks with a defined outcome. Instead of a chat reply, ChatGPT plans the task, gathers context from your files, projects, plugins, and the web, and produces a reviewable result such as a document, presentation, spreadsheet, or PDF. On the web it runs in a managed cloud environment; in the desktop app it can also work locally with your files and browser."
  - q: "Is ChatGPT a good alternative to Claude for non-developers?"
    a: "They cover similar ground for founders, marketers, and analysts: long-form drafting, research, file analysis, and finished documents. ChatGPT has the broadest consumer feature set (image generation, voice, plugins, GPTs, Sites). Claude is the stronger pick when you want careful long-document work, Cowork-style delegated tasks on your own files, or Skills that also run in Claude Code. Many teams run both and let the task decide."
---

ChatGPT is OpenAI's general-purpose AI assistant and the product most people compare everything else against, including [Claude](/tools/claude). It answers questions, drafts and edits text, analyzes files, generates images, and, in its 2026 form, carries larger tasks through to a finished document or spreadsheet you can download.

It is aimed at anyone who works in language and files: founders writing plans and investor updates, marketers producing campaign briefs and landing copy, analysts cleaning data exports, designers turning rough notes into structured specs. OpenAI's own docs now describe ChatGPT as an agent you talk to in plain language, with a switcher between Chat, Work, and Codex.

## Highlights

- **Chat, Work, or Codex** — Chat is the familiar back-and-forth. Work is for tasks with a defined outcome: ChatGPT plans, gathers context, uses tools, and returns a reviewable document, presentation, spreadsheet, or PDF. Codex is the developer view.
- **Projects** — keep related chats, uploaded files, instructions, and sources together so every chat in a project starts with the same context. Chat and Work chats can share one project.
- **Memory and personalization** — ChatGPT carries useful context across chats; you manage it under Settings > Personalization, and the desktop app has a separate local memory store.
- **Plugins and skills** — a plugin bundles skills with MCP servers, connecting services such as Google Drive, GitHub, or Slack. Skills are reusable workflow instructions you can build with `@skill-creator` and share with teammates.
- **GPTs and Workspace Agents** — custom GPTs remain the lightweight way to package instructions and files. Workspace Agents are governed, shareable, schedulable agents for Business and Enterprise workspaces, triggerable from other systems through an API. See [Claude Skills vs custom GPTs](/guides/comparisons/claude-skills-vs-custom-gpts) for how Claude's equivalent compares.
- **Web, browser, and files** — web search, a built-in browser for research, image generation, interactive visualizations, hosted Sites, and scheduled tasks that rerun a prompt on a schedule.

## In a founder or marketer workflow

The pattern that works is a project per initiative. Upload the source material once (brand guide, last quarter's numbers, the customer interview notes), write project instructions that state the format you always want, then switch to Work when you need a deliverable rather than an answer:

```text
Using the sources in this project, draft a one-page launch brief for the
new pricing tier: audience, positioning, three key messages, and a
week-by-week channel plan. Output a Google-Docs-ready document, plus a
spreadsheet of the channel plan I can edit.
```

Review the file in the viewer, ask for targeted revisions, and download it. If the same brief recurs monthly, turn the instructions into a skill so the format stays consistent, or, on a Business or Enterprise plan, publish it as a Workspace Agent so the team runs it without rewriting the prompt.

> [!NOTE]
> Work runs in a managed cloud environment on the web. In the desktop app you can choose local execution, which lets ChatGPT use files and apps on your machine and pauses for approval before consequential actions.

## Good to know

ChatGPT runs on the web, in desktop apps for macOS, Windows, and Linux, and in iOS and Android apps. Plans as of September 2026, per OpenAI's pricing docs: Free ($0), Go ($8/month), Plus ($20/month), Pro (from $100/month, with a $200/month tier that adds unlimited voice), Business ($20 per user per month billed annually for two or more users, $25 monthly), and Enterprise and Edu (contact sales). Paid tiers can extend usage with ChatGPT credits, and Work shares its usage budget with Codex. The current models are the GPT-5.6 family (Sol, Terra, and Luna), with GPT-6 Astra rolling out to eligible Pro, Business, and Enterprise accounts.

Business is the smallest plan with a dedicated workspace, SAML SSO, and no training on your data by default; Enterprise adds SCIM, RBAC, audit logs via the Compliance API, and data residency. Feature availability depends on plan, platform, region, and workspace settings, so check what your admin has enabled before building a process around Work, plugins, or browser use.

If your comparison set is wider than ChatGPT, the other general assistants worth a look are [Gemini](/tools/gemini) for Google Workspace users, [Microsoft 365 Copilot](/tools/microsoft-copilot) for Office-centric teams, and [Perplexity](/tools/perplexity) when cited research matters more than drafting. For a plan-by-plan view of the Anthropic side, see [Claude plans compared](/guides/getting-started/claude-plans-compared-2026).
