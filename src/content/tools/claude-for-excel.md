---
name: "Claude for Excel"
description: "Anthropic's Excel add-in that explains, edits, debugs, and builds spreadsheet models in place, with cell-level citations, on paid Claude plans."
seoDescription: "Claude for Excel is Anthropic's add-in for Excel on web, Windows, and Mac: cell-level citations, model building, error debugging, connectors, skills, limits."
date: 2026-09-10
url: "https://claude.com/claude-for-microsoft-365"
pricing: "paid"
category: "extension"
color: "pink"
topics: ["ai-at-work", "data-ml"]
audience: ["developers", "founders", "marketers"]
tags: ["claude", "excel", "microsoft-365", "spreadsheets", "add-in", "financial-models"]
featured: false
related: ["tool:claude", "tool:claude-cowork", "tool:microsoft-copilot", "tool:claude-for-chrome", "guide:claude-plans-compared-2026", "guide:claude-document-skills", "guide:claude-skills-on-claude-ai-and-api"]
alternativeTo: ["microsoft-copilot"]
os: ["Web", "Windows", "macOS"]
sameAs: ["https://marketplace.microsoft.com/en-us/product/office/WA200010725"]
summary: "Claude for Excel is an add-in that puts Claude inside your workbook: ask how a number is derived and get cell-level citations, change assumptions without breaking formulas, trace #REF! and #DIV/0 errors, populate templates, or build a model from a description. Generally available on Pro, Max, Team, and Enterprise for Excel on web, Windows, and Mac."
faq:
  - q: "What is Claude for Excel?"
    a: "Claude for Excel is an Anthropic add-in, installed as part of Claude for Microsoft 365, that runs in a sidebar inside Excel. It can explain formulas with clickable cell-level citations, update values while preserving formula relationships, find the root cause of errors, populate templates, generate new models, and perform native operations like sorting, filtering, pivot tables, conditional formatting, and data validation."
  - q: "Which plans include Claude for Excel?"
    a: "It is generally available on Pro, Max, Team, and Enterprise. The Free plan does not include it. Organizations that route AI traffic through Amazon Bedrock, Google Cloud Vertex AI, Azure AI Foundry, or an LLM gateway can deploy it without individual Claude accounts."
  - q: "Which versions of Excel does it support?"
    a: "Excel on the web, Excel on Windows with a Microsoft 365 subscription (build 16.0.13127.20296 or later), and Excel on Mac (version 16.46 or later). It does not run on Excel 2016 or 2019 perpetual licenses, Excel on iPad, or Excel on Android."
  - q: "Does Claude for Excel work with my other Office apps?"
    a: "Yes. It shares context with Claude for PowerPoint, Word, and Outlook, so one conversation can span your open workbook, presentation, document, and inbox. Skills you enable in your Claude settings and connectors such as S&P Global, LSEG, and Daloopa are available inside the add-in too."
  - q: "What can it not do?"
    a: "Data tables and macros or VBA are unsupported. Anthropic does not recommend it for final client deliverables or audit-critical calculations without human review, and warns that spreadsheets from external sources can contain prompt injections. Chat history is stored locally in your browser and is not synced across devices."
---

Claude for Excel is Anthropic's add-in that puts [Claude](/tools/claude) in a sidebar inside Excel. It reads the open workbook, answers questions with cell-level citations you can click to jump to the referenced cell, changes assumptions while keeping formula relationships intact, traces errors to their root cause, and builds or populates models from a natural-language description. It installs as part of Claude for Microsoft 365, alongside the PowerPoint, Word, and Outlook add-ins.

It is aimed at finance and operations people who live in models, and at founders and analysts who inherit spreadsheets they did not build. Developers reach for it when the data already lives in a workbook and a script would be overkill.

## Highlights

- **Cell-level citations.** Ask how a number in C42 is derived or which assumptions drive gross margin, and the answer cites specific cells you can navigate to.
- **Safe value updates.** "Change the discount rate to 8% and update dependent calculations" edits inputs and lets downstream cells recompute rather than overwriting formulas with values. Claude warns before overwriting existing data.
- **Debugging.** Find the source of a `#REF!` in the summary tab or trace why H15 returns `#DIV/0`, across multi-tab workbooks.
- **Model building.** Populate an existing template (an LBO with a given purchase price and leverage, for example) or generate a three-statement model from a trial balance.
- **Native Excel operations.** Sort, filter, edit pivot tables, apply conditional formatting, and create data-validation dropdowns by asking.
- **Connectors, skills, and cross-app context.** Pull external data through connectors such as S&P Global, LSEG, and Daloopa; skills enabled in your Claude settings apply automatically; and one conversation can span Excel, PowerPoint, Word, and Outlook.

## In an AI-assisted workflow

The add-in is strongest as a reviewer and editor of a workbook you already have open, rather than a from-scratch generator. A typical loop: open a trusted copy, ask Claude to explain the model, then make targeted changes and verify each.

```text
Walk me through how the terminal value on the DCF tab is calculated,
citing cells. Then flex the growth rate from 5% to 10% and show me the
impact on terminal value and equity value without changing any formulas.
```

Persistent instructions in the add-in's settings ("format numbers with thousand separators", "always bold column headers") apply to every Excel conversation and are separate from the instructions you set in PowerPoint or Word. Long sessions are auto-compacted into new conversations so you do not run out of context.

> [!WARNING]
> Anthropic's docs say to use Claude for Excel only with trusted spreadsheets. Downloaded templates, vendor files, and data imports can carry hidden instructions, and testing has found cases where the add-in could be manipulated into extracting data or modifying records if allowed to act without verification. Review every confirmation prompt, especially for external files.

## Good to know

Availability, per Anthropic's docs as of September 2026: generally available on Pro, Max, Team, and Enterprise; not on Free. Install it yourself from the Claude for Microsoft 365 listing on Microsoft AppSource, or have an admin deploy it through the Microsoft 365 Admin Center (a custom manifest XML is available for tenants that block the Office Store). Organizations on Amazon Bedrock, Google Cloud Vertex AI, Azure AI Foundry, or an LLM gateway can deploy it without individual Claude accounts, with models coming from that platform.

Supported builds: Excel on the web, Excel on Windows with a Microsoft 365 subscription (build 16.0.13127.20296 or later), and Excel on Mac (16.46 or later). Excel 2016 and 2019 perpetual licenses, Excel on iPad, and Excel on Android are unsupported because the add-in needs SharedRuntime.

Limits: data tables and macros/VBA are unsupported. The model list in the add-in is a curated subset of what claude.ai offers. Usage counts against your Claude account's normal limits. Chat history is stored locally in the browser via IndexedDB, not on Anthropic's servers, and does not sync across devices; inputs and outputs are deleted on the backend within 30 days. Activity is not included in Enterprise audit logs, and the add-in does not inherit custom retention settings.

If you want the same work done on files rather than inside the open workbook, [Cowork](/tools/claude-cowork) can operate on a folder of spreadsheets; for web-based data sources, [Claude for Chrome](/tools/claude-for-chrome) can fetch it. Compare against [Microsoft Copilot](/tools/microsoft-copilot) if you are already paying for Copilot seats.
