---
title: "Claude for Excel: What It Does, Where It Fails, How to Use It"
description: "Install it from AppSource, learn which Excel builds are supported, use cell-level citations, and apply the review discipline before a workbook leaves your desk."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["claude", "excel", "spreadsheets", "microsoft-365", "add-in", "financial-models"]
featured: true
seoTitle: "Claude for Excel: What It Does, Where It Fails, How to Use It"
seoDescription: "How Claude for Excel works in 2026: install, supported builds, plan gating, cell-level citations, model debugging, what it cannot do, and a review checklist."
keywords: ["claude for excel", "claude excel add-in", "excel ai assistant", "claude for microsoft 365", "excel formula debugging ai"]
summary: "Claude for Excel is an add-in on Pro, Max, Team, and Enterprise that reads the open workbook, answers with clickable cell-level citations, edits values while keeping formulas intact, and traces errors to a root cause. It does not do macros, VBA, or data tables, and Anthropic does not recommend it for audit-critical work without verification."
keyTakeaways:
  - "Install it yourself from the Claude for Microsoft 365 listing on Microsoft AppSource, or have an admin deploy it through the Microsoft 365 Admin Center."
  - "Generally available on Pro, Max, Team, and Enterprise. The Free plan does not include it."
  - "Supported on Excel for the web, Windows with Microsoft 365 build 16.0.13127.20296 or later, and Mac 16.46 or later. Not on 2016/2019 perpetual, iPad, or Android."
  - "Cell-level citations are the feature that makes review possible: click a cited cell and check the derivation yourself."
  - "Unsupported: data tables and macros or VBA. Claude warns before overwriting existing data, but the warning is the only guardrail."
  - "Anthropic warns that spreadsheets from external sources can carry hidden instructions, so open untrusted files with the same caution you would give an unknown macro."
sources:
  - title: "Use Claude for Excel"
    url: "https://claude.com/docs/office-agents/excel"
    publisher: "Anthropic"
  - title: "Work across M365 apps"
    url: "https://claude.com/docs/office-agents/work-across-apps"
    publisher: "Anthropic"
  - title: "Use skills in Claude"
    url: "https://support.claude.com/en/articles/12512180-use-skills-in-claude"
    publisher: "Anthropic"
howtoSteps:
  - name: "Install the add-in"
    text: "Open the Claude for Microsoft 365 listing on Microsoft AppSource, select Get it now, then open Excel, activate the add-in from Home > Add-ins on Windows or Tools > Add-ins on Mac, and sign in with your Claude account."
  - name: "Open a trusted copy of the workbook"
    text: "Duplicate the file before you let Claude edit it. Start from a copy you trust, especially for anything that came from outside your company."
  - name: "Ask a question before asking for a change"
    text: "Start with understanding, not editing. Ask Claude to walk through how a specific output cell is calculated, or which assumptions drive a forecast line."
  - name: "Click the citations"
    text: "Answers include cell-level citations. Click each one, confirm the cell it points at is the cell you expected, and reject any answer whose citations do not resolve."
  - name: "Let it make one scoped edit"
    text: "Ask for a single, specific change such as flexing one assumption. Read the overwrite warning before confirming, and check that downstream cells recomputed rather than being replaced with static values."
  - name: "Verify before it leaves your desk"
    text: "Re-derive at least one changed number by hand, check the workbook for new hardcoded values where formulas used to be, and review every edit before the file goes to a client or a committee."
faq:
  - q: "Which Excel versions does Claude for Excel support?"
    a: "Excel on the web, Excel on Windows with a Microsoft 365 subscription on build 16.0.13127.20296 or later, and Excel on Mac version 16.46 or later. It does not run on Excel 2016 or 2019 perpetual and volume licenses, on Excel for iPad, on Excel for Android, or on older Microsoft 365 builds, because the add-in requires SharedRuntime support."
  - q: "Can Claude for Excel write macros or VBA?"
    a: "No. Anthropic's documentation lists data tables and macro or VBA operations as unsupported capabilities. If your model depends on either, Claude can still explain the rest of the workbook, but the macro layer is outside what the add-in touches."
  - q: "Will it overwrite my formulas?"
    a: "It is designed not to. Claude updates cell values while keeping formula relationships intact so downstream cells recompute, and it warns you before overwriting existing data. The warning is a prompt to read, not a guarantee, so check the cells it touched for hardcoded values that used to be formulas."
  - q: "Does it work with my other Office apps?"
    a: "Yes, if you turn cross-app mode on. Claude for Excel shares context with the PowerPoint, Word, and Outlook add-ins so one conversation can span them, but only for files that are currently open. The toggle is Let Claude work across files, on by default for Pro and Max and off by default for Team and Enterprise, and it is not supported when connecting through Amazon Bedrock, Google Cloud Vertex AI, Azure AI Foundry, or an LLM gateway."
  - q: "Is Claude for Excel better than Microsoft Copilot in Excel?"
    a: "They solve different halves of the problem. Copilot is embedded across Microsoft 365 and sold with your existing seats; Claude for Excel is a focused add-in whose distinguishing feature is cell-level citations you can click to audit a claim. If you already pay for Copilot, the honest test is to run the same question about a model you know well through both and see which answer you can verify faster."
related: ["guide:claude-for-data-analysis", "guide:check-an-ai-data-analysis", "guide:claude-skills-for-data-analysts", "guide:claude-plans-compared-2026", "tool:claude-for-excel", "tool:microsoft-copilot", "tool:claude"]
---

[Claude for Excel](/tools/claude-for-excel) is an add-in that runs in a sidebar inside your workbook. It reads what is open, answers questions with citations you can click through to specific cells, changes assumptions without flattening the formulas underneath, and traces errors back to their source. This guide covers installation, the builds it runs on, what it will not do, and the review discipline that has to sit around it before a workbook goes anywhere important. It is the spreadsheet chapter of [Claude for Data Analysis](/guides/analytics/claude-for-data-analysis).

## Install it, or get it deployed

Individual install is three steps. Open the Claude for Microsoft 365 listing on Microsoft AppSource, select "Get it now," then open Excel, activate the add-in, and sign in with your Claude account. The add-in ships as part of Claude for Microsoft 365, so the same install puts the PowerPoint, Word, and Outlook add-ins in place too.

For an organization, an admin deploys it from the Microsoft 365 Admin Center: turn on "Let users access the Office Store" under Settings, Org Settings, User owned apps and services, then go to Settings, Integrated apps, Add-ins, search for Claude for Microsoft 365, and assign it to the org or to specific groups. Two wrinkles are worth knowing before you file a ticket. Tenants that block the Office Store can deploy with a custom manifest XML file instead. And if your organization uses Microsoft Entra Privileged Identity Management for admin roles, the Integrated apps page does not recognize PIM-activated roles and deployment fails; Anthropic documents this as a known Microsoft issue and the workaround is to deploy from an account whose role is permanently active.

Organizations that route AI traffic through Amazon Bedrock, Google Cloud Vertex AI, Azure AI Foundry, or an LLM gateway can deploy the add-in without individual Claude accounts, with models coming from that platform.

## Supported builds, and the exclusions that catch people

As of September 2026, Anthropic lists three supported environments: Excel on the web, Excel on Windows with a Microsoft 365 subscription on build 16.0.13127.20296 or later, and Excel on Mac version 16.46 or later (build 21011600 or later).

The exclusions are the part people hit. Excel 2016 and 2019 perpetual or volume licenses are not supported. Excel on iPad is not, because the add-in requires SharedRuntime and iPad does not provide it. Excel on Android is not. Older Microsoft 365 builds below the SharedRuntime threshold are not. If you work somewhere that standardized on a perpetual license, this is a blocker rather than a bug.

Plan gating is simple: generally available on Pro, Max, Team, and Enterprise, not on Free. Which tier you want for spreadsheet-heavy weeks is in [Which Claude Plan (and Model) Should a Data Analyst Pay For?](/guides/analytics/which-claude-plan-for-data-analysts), and the prices are on [Claude plans compared (2026)](/guides/getting-started/claude-plans-compared-2026).

## Cell-level citations are the whole point

Most AI spreadsheet features answer in prose. This one answers with references. Ask "walk me through how the revenue number in cell C42 is calculated" and the reply cites the cells it read, each one clickable to navigate straight there. That turns a claim into something you can check in about ten seconds, which is the only reason it is usable on a model you are responsible for.

Use it that way deliberately. On a workbook you inherited, the first three prompts should all be questions, never edits:

```text
Walk me through how the terminal value on the DCF tab is calculated,
citing cells. Then list every hardcoded number in the calculation chain
and tell me which tab it came from.
```

If a citation points somewhere you did not expect, you have found either a modeling error or a misreading, and both are worth knowing before you change anything.

## Building and debugging models

Beyond questions, the add-in does four kinds of work. It updates values while keeping formula relationships intact, so "change the discount rate to 8% and update dependent calculations" edits the input and lets the model recompute. It debugs, tracing a `#REF!` in a summary tab or a `#DIV/0` in a single cell back to a root cause across a multi-tab workbook. It builds, either populating an existing template ("populate this LBO template with a $500M purchase price and 6x leverage") or generating a model from a description such as a three-statement model from a trial balance. And it performs native Excel operations on request: sorting, filtering, editing pivot tables, conditional formatting, and data-validation dropdowns.

For auditing formulas rather than building them, the [spreadsheet-formula-auditor](/skills/analytics/spreadsheet-formula-auditor) skill gives you a repeatable pass over a sheet you did not write, and it works the same way in the add-in as it does in chat.

## What it will not do

Two capabilities are explicitly unsupported: data tables, and macros or VBA operations. If your sensitivity analysis is built on data tables, Claude cannot drive it. If your workbook's logic lives in VBA, that logic is invisible to the add-in.

There are also three situations Anthropic says the tool is not recommended for: final client deliverables without human review, audit-critical calculations without verification, and models containing highly sensitive or regulated data without proper controls. Read that as a scope statement rather than boilerplate. It is a fast, cited assistant for a model in progress, and it is not a signer of anything.

> [!WARNING]
> Anthropic's docs are direct about the risk: only use Claude for Excel with trusted spreadsheets, because files from external sources "can contain hidden instructions that manipulate the add-in into extracting data, modifying records, or performing destructive actions." Testing has found scenarios where the add-in could be manipulated if allowed to act without verification. Confirmation prompts exist for exactly this; read them, especially on vendor files and downloaded templates.

## Overwrites and the review pass before a deliverable

The add-in warns before overwriting existing data. That protection is real, but the thing to check after an editing session is subtler than a lost tab: it is a cell that used to hold a formula and now holds a number. Scan the range Claude touched, confirm the formulas are still formulas, and re-derive one changed output by hand.

Build the rest of the review into a habit before anything ships:

- Re-derive one number end to end, without the add-in.
- Check that every citation in the explanation resolves to the cell you expected.
- Ask Claude to list every assumption it made and every cell it changed, then verify that list against the workbook rather than against its summary.
- Sanity-check the direction of the result. If a higher discount rate raised the valuation, something is wrong regardless of how confident the explanation reads.

The general version of this checklist, including the failures that survive a casual read, is [How to Check an AI Data Analysis](/guides/analytics/check-an-ai-data-analysis).

## Connectors, skills, and the other Office apps

Connectors pull external context into the workbook; Anthropic names S&P Global, LSEG, and Daloopa as examples. Skills you have enabled in your Claude settings apply automatically while you work, which means a skill that encodes your team's modeling conventions travels into Excel without being installed separately there. Persistent instructions are per app: open Settings in the sidebar and set formatting conventions like "format numbers with thousand separators," and they apply to every Excel conversation but not to Word or PowerPoint.

Cross-app mode extends one conversation across Excel, PowerPoint, Word, and Outlook, which is how a model becomes a summary deck or a memo without copy and paste. It only reads and writes files that are already open, it cannot create, open, close, or switch files, and it is unavailable when you connect through a third-party platform.

Two operational details round it out. Long conversations are auto-compacted into new conversations so you do not run out of context, and usage counts against your normal Claude limits. Chat history lives locally in your browser via IndexedDB rather than on Anthropic's servers, so it does not sync across devices, and add-in activity is not included in Enterprise audit logs or the Compliance API.

If your organization already pays for [Microsoft Copilot](/tools/microsoft-copilot) seats, run both against a model you know well before choosing. Copilot is broader and already licensed; the citation trail is what Claude for Excel is selling.
