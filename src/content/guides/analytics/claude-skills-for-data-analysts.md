---
title: "Claude Skills for Data Analysts: 5 to Upload Today"
description: "Five portable skills that make Claude behave like a careful analyst: first look, chart choice, memo writing, SQL explanation, and formula auditing."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "data-ml"]
audience: ["analysts"]
tags: ["claude", "skills", "data-analysis", "sql", "charts", "excel"]
featured: false
seoTitle: "Claude Skills for Data Analysts: 5 to Upload Today"
seoDescription: "Five Claude skills for analysts: dataset first look, chart chooser, analysis memo, SQL explainer, formula auditor. How to upload them and what each returns."
keywords: ["claude skills for data analysts", "claude skills upload", "ai data analysis skills", "claude skill sql", "claude analytics skills"]
summary: "A skill is a SKILL.md file that tells Claude how you want a recurring job done. These five cover the analyst's repeating work: profiling a new dataset, choosing a chart, writing the memo, explaining someone else's SQL, and auditing spreadsheet formulas. Upload them as a ZIP once and they follow you into chat, Cowork, and the Office add-ins."
keyTakeaways:
  - "A skill is a folder with a SKILL.md file; Claude loads it when your request matches its description, so the same procedure runs everywhere."
  - "Upload a skill as a ZIP under Customize, Skills; code execution must be enabled in Settings, Capabilities first."
  - "Skills are available on Free, Pro, Max, Team, and Enterprise, and skills you enable also apply inside Cowork and the Claude for Excel add-in."
  - "Start with dataset-first-look: establishing the shape of the data before any conclusion is what prevents most silent analysis failures."
  - "Anthropic's own built-in document skills already produce xlsx, docx, pptx, and PDF files, so do not write a skill for file production."
sources:
  - title: "Use skills in Claude"
    url: "https://support.claude.com/en/articles/12512180-use-skills-in-claude"
    publisher: "Anthropic"
  - title: "Create and edit files with Claude"
    url: "https://support.claude.com/en/articles/12111783-create-and-edit-files-with-claude"
    publisher: "Anthropic"
  - title: "Work across M365 apps"
    url: "https://claude.com/docs/office-agents/work-across-apps"
    publisher: "Anthropic"
howtoSteps:
  - name: "Turn on code execution"
    text: "On Free, Pro, or Max, open Settings, go to Capabilities, and enable Code execution and file creation. On Team and Enterprise, an owner verifies the equivalent settings in Organization settings."
  - name: "Package the skill as a ZIP"
    text: "Put the SKILL.md file in a folder named after the skill and compress that folder into a ZIP file. The folder, not the loose file, is what gets zipped."
  - name: "Open the skills manager"
    text: "In Claude, go to Customize, then Skills."
  - name: "Create and upload"
    text: "Click the plus button, select Create skill, choose Upload a skill, and select your ZIP file."
  - name: "Toggle it on and test it"
    text: "The skill appears in your list where you can turn it on or off. Test it by describing a task that matches its description and confirming Claude picks it up without being told to."
faq:
  - q: "Do I need a paid plan to use skills?"
    a: "No. Anthropic's help center says skills are available across Free, Pro, Max, Team, and Enterprise, but they require code execution to be enabled. On Free, Pro, and Max you enable it yourself in Settings under Capabilities; on Team and Enterprise an owner controls it."
  - q: "Do these skills work in Claude Code as well as in the chat app?"
    a: "Yes. A skill is a SKILL.md file, and the same file works as a ZIP upload on claude.ai, as a folder in a Claude Code project, and inside Cowork. Skills you enable in your Claude settings also apply automatically inside the Claude for Excel, PowerPoint, Word, and Outlook add-ins."
  - q: "What is the difference between a skill and a slash command?"
    a: "A skill is loaded by Claude when your request matches its description, so you do not have to remember it exists. A slash command is something you invoke deliberately by name in Claude Code. The same procedure often deserves both: the skill for when you forget, the command for when you know exactly what you want."
  - q: "Should I write a skill that generates Excel files?"
    a: "No. Anthropic ships built-in skills for Excel, Word, PowerPoint, and PDF that activate automatically when a task needs them, and they already produce real files with working formulas. Write skills for judgment and procedure, not for file production."
related: ["guide:claude-for-data-analysis", "guide:what-are-claude-skills", "guide:claude-document-skills", "guide:check-an-ai-data-analysis", "guide:claude-code-for-data-analysts", "tool:claude"]
---

A skill is a folder with a `SKILL.md` file in it that describes how you want a recurring job done. Claude loads it when a request matches its description, which means the procedure you would otherwise retype every Monday becomes something the model already knows. For an analyst the payoff is consistency: the same profiling pass, the same chart logic, the same caveats section, every time. If skills are new to you, start with [What Are Claude Skills](/guides/skills/what-are-claude-skills); this guide is the five worth having and how to load them.

## Upload once, use everywhere

Skills are available on Free, Pro, Max, Team, and Enterprise, and they require code execution to be enabled first. On Free, Pro, and Max that is a toggle in Settings under Capabilities called "Code execution and file creation"; on Team and Enterprise an owner verifies it in organization settings. Once that is on, you package the skill folder as a ZIP, go to Customize, then Skills, click the plus button, select "Create skill," choose "Upload a skill," and pick the file. The skill appears in your list with a toggle. The step-by-step version with screenshots of the install paths for other surfaces is [How to Install Claude Skills](/guides/skills/how-to-install-claude-skills).

The reason to bother is portability. The same file runs on [claude.ai](/tools/claude), in Cowork, and inside the Claude for Excel add-in, because skills you enable in your Claude settings apply automatically when Claude works in the Office apps. Write the procedure once, and it follows the work.

Two practical notes before you upload anything. Claude decides whether to load a skill from its description, so the description has to name the trigger ("use when the user uploads a new dataset and asks what is in it") rather than describe the skill in the abstract. And a skill that depends on the network, a shell, or a specific repository will not run everywhere; keep these five to pure reasoning over what you paste or upload and they stay portable across every surface.

## The five

### dataset-first-look

Point it at a CSV or a table and it produces the profile you should always read before a conclusion: row count, columns with types, null counts, cardinality, date ranges, duplicate keys, and the specific things that look wrong. [dataset-first-look](/skills/analytics/dataset-first-look) exists because the most common analysis failure is not bad math, it is a confident answer over a population nobody checked.

```text
Run dataset-first-look on transactions_q3.csv. Flag anything that would
change how I aggregate: mixed types, duplicate order IDs, dates outside
the quarter, and currency columns stored as text.
```

In Claude Code, [/first-look](/commands/analytics/first-look) is the same pass as a slash command, which is what you want when it is the first thing you run on every new extract.

### chart-chooser

Given a description of what you are trying to show and the shape of the data, [chart-chooser](/skills/analytics/chart-chooser) picks the chart type, states the encoding, and names what the chart would mislead about. It also refuses the ones that flatter: truncated axes, dual axes implying a correlation, pie charts with eleven slices.

```text
Use chart-chooser: I want to show monthly recurring revenue by plan tier
over 18 months for a board deck. Give me the chart type, the axis choices,
and what this view will hide.
```

### analysis-memo-writer

The last mile of analysis is a document somebody reads without you in the room. [analysis-memo-writer](/skills/analytics/analysis-memo-writer) turns findings into a memo with a stated question, method, result, caveats, and what would change the conclusion. The caveats section is the point; a memo that does not say what it assumed is not finished.

### sql-explainer

Inherited queries are the analyst's technical debt. [sql-explainer](/skills/analytics/sql-explainer) reads a query and explains what it actually returns: the grain of the result, which joins can drop or duplicate rows, what the filters exclude, and where a `NULL` will quietly change a total. Use it before you trust a dashboard whose query you did not write, and pair it with [/define-metric](/commands/analytics/define-metric) when the disagreement turns out to be about what the metric means rather than what the SQL does.

```text
Use sql-explainer on this query. Tell me the grain of the output, whether
any join can fan out, and which rows the WHERE clause silently drops.
```

### spreadsheet-formula-auditor

The Excel counterpart. [spreadsheet-formula-auditor](/skills/analytics/spreadsheet-formula-auditor) walks a sheet's formulas and reports hardcoded values inside calculation chains, ranges that do not cover what they claim to, inconsistent formulas within a row or column, and circular or fragile references. It runs in chat over an uploaded workbook and inside the Excel add-in over the open one, which is the practical way to review a model somebody handed you.

## Two commands and a reviewer

Skills cover judgment; commands cover the things you run on purpose. [/first-look](/commands/analytics/first-look) profiles a new dataset in one line, and [/define-metric](/commands/analytics/define-metric) writes down a metric definition (grain, filters, edge cases, who owns it) so the next argument about churn is short.

The third piece is a subagent. [analysis-reviewer](/agents/analytics/analysis-reviewer) reads a finished analysis and reports what was assumed rather than shown: unstated filters, unverified joins, numbers in the prose that never appeared in the output. Run it before a human reviews the work, not instead of one. What it looks for, and the manual version of the same pass, is in [How to Check an AI Data Analysis](/guides/analytics/check-an-ai-data-analysis).

## What not to build

Anthropic ships built-in skills for Excel, Word, PowerPoint, and PDF that activate automatically when a task calls for them, and they produce real files rather than CSV approximations. Do not spend an afternoon writing a skill that formats a spreadsheet; write skills for the judgment you keep repeating and let the document skills handle production. What each built-in skill does and when it fires is in [Claude's document skills](/guides/skills/claude-document-skills).

Where these five fit in the wider picture of surfaces, sandboxes, and verification is [Claude for Data Analysis](/guides/analytics/claude-for-data-analysis). Load the first-look skill today and the others as the work demands them.
