---
title: "Claude's Document Skills: Excel, PowerPoint, Word, and PDF"
description: "How Anthropic's pre-built document skills let Claude produce real .xlsx, .pptx, .docx, and PDF files — on claude.ai, the API, and in Claude Code."
author: "Imtiaz Rayhan"
date: 2026-07-18
updated: 2026-11-27
reviewed: 2026-11-27
color: "yellow"
topics: ["workflow-prompting", "llm-app-dev"]
tags: ["skills", "document-skills", "xlsx", "pptx", "docx", "claude"]
featured: false
seoTitle: "Claude Document Skills: Excel, PowerPoint, Word, PDF"
seoDescription: "Claude's document skills produce real Excel, PowerPoint, Word, and PDF files. How they work, where they're available, and how to get better output."
keywords: ["claude excel skill", "claude create excel file", "claude powerpoint", "claude document skills", "claude xlsx"]
summary: "Anthropic ships four pre-built skills — xlsx, pptx, docx, and pdf — that turn 'make me a spreadsheet' into an actual file, built by code execution with real formatting. They're built into claude.ai, attachable by skill_id on the API, and open source (Apache 2.0) in the anthropics/skills repo. Templates, brand rules, and examples get better documents."
keyTakeaways:
  - "The document skills are ordinary Agent Skills, authored by Anthropic: procedures that drive code execution and Python document libraries to build real files, not markdown approximations."
  - "On claude.ai they're built in — ask for a spreadsheet or deck and the right skill activates. No install; the only switch is Code execution and file creation under Settings > Capabilities."
  - "On the API, attach them by literal skill_id (xlsx, pptx, docx, pdf) via the container parameter, and download the generated files through the Files API. As of November 2026 no beta header is needed."
  - "The skills encode format craft the model wouldn't reliably apply on its own: workbook structure, slide layout discipline, document styles."
  - "Output quality tracks input quality: give a template file, brand rules, or a reference example and ask for a verification pass at the end."
  - "They're open source in anthropics/skills — the best worked examples to study before writing your own skill."
faq:
  - q: "Can Claude create real Excel files?"
    a: "Yes. With the xlsx skill active — built into claude.ai, attached via container on the API — Claude builds actual .xlsx workbooks through code execution: multiple sheets, formulas, formatting. You download a working file, not a table pasted into chat."
  - q: "Can Claude edit a document I upload, or only create new ones?"
    a: "Both. Upload the file (claude.ai attachment, or Files API on the API side) and ask for the change — the skill reads the existing document with the same libraries it writes with. For substantial edits, describe the outcome rather than a cell-by-cell diff."
  - q: "How do I get the generated file via the API?"
    a: "The file is written inside the code-execution container and the response carries a file_id inside the code-execution result blocks. Download it with client.files.download. As of November 2026 the Skills API, the Files API, and the code execution tool are all out of beta, so the request needs only the container skills list and the code execution tool, with no beta headers."
  - q: "Why do my decks come out generic?"
    a: "The skill controls format mechanics, not your content strategy. Feed it structure: the narrative in bullets, a slide budget, brand colors and fonts, or an existing deck to match. 'Make a deck about X' produces a template-ish deck; a one-paragraph brief per slide produces yours."
  - q: "Are the document skills open source?"
    a: "Yes — they live in Anthropic's public anthropics/skills repository under skills/docx, skills/pdf, skills/pptx, and skills/xlsx, licensed Apache 2.0. Reading the xlsx or pptx SKILL.md is the single best education in how a production-grade skill is written: procedure, bundled helpers, and boundaries."
related: ["guide:what-are-claude-skills", "guide:claude-skills-on-claude-ai-and-api", "guide:claude-skills-examples", "guide:how-to-install-claude-skills", "skill:multimodal-document-extractor", "guide:claude-skills-use-cases"]
audience: ["sales", "marketers", "analysts"]
---

The most-used Claude skills are ones most people don't know are skills: ask claude.ai for a spreadsheet, a slide deck, a formatted Word document, or a filled PDF, and what answers isn't the base model winging it — it's one of four Anthropic-built **document skills** (`xlsx`, `pptx`, `docx`, `pdf`) loading and driving code execution to produce a real file. They're also the clearest demonstration of what the [skills format](/guides/skills/what-are-claude-skills) is for.

## What they actually do

Each document skill is a normal SKILL.md-plus-resources package that encodes *format craft*: how a workbook should be structured, what makes a slide layout hold up, how document styles and sections work. When one activates, Claude writes and runs code against the Python document stack in the execution sandbox — `openpyxl` for Excel, `python-pptx` for PowerPoint, `python-docx` for Word, PDF tooling for forms and extraction — following the skill's procedure instead of improvising.

The difference is visible in the output. Without the skill, "make me a budget spreadsheet" gets you a Markdown table. With it, you get an `.xlsx` with separate input and summary sheets, real formulas, and formatting — a file you open in Excel and keep using.

## Where they're available

| Surface | Status |
|---|---|
| claude.ai (web, desktop, mobile) | **Built in** on every plan — nothing to install; Code execution and file creation must be on |
| Claude API | Attach by `skill_id` via the `container` parameter |
| Managed Agents (beta as of November 2026) | Add to the agent's `skills` list (`{"type": "anthropic", "skill_id": "xlsx"}`) |
| Claude Code | Not bundled. Sessions signed in with a claude.ai account sync Anthropic's skills such as `pdf` and `xlsx` (v2.1.273 or later); otherwise copy them from the anthropics/skills repo |

On the API, a request looks like this. As of November 2026 it needs no beta headers:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=4096,
    container={"skills": [{"type": "anthropic", "skill_id": "pptx", "version": "latest"}]},
    messages=[{"role": "user", "content": "Create a 5-slide QBR deck from these notes: ..."}],
    tools=[{"type": "code_execution_20250825", "name": "code_execution"}],
)
```

The generated file lives in the container; the response carries its file ID, and you download it via the Files API. The full API mechanics — `/v1/skills`, limits, the no-network constraint — are in [Skills on claude.ai and the API](/guides/skills/claude-skills-on-claude-ai-and-api).

## Getting good documents, not just documents

The skills handle format mechanics; content quality is still yours to specify. The patterns that consistently raise output quality:

1. **Provide the skeleton.** A slide-by-slide brief, a column list with example rows, or the section outline. The skill turns structure into format; it can't invent your argument.
2. **Anchor to an existing file.** Upload last quarter's deck or your report template and ask Claude to match it — the skills read existing documents with the same libraries they write with.
3. **State the format rules once.** Brand colors, font, "no more than four bullets per slide", "currency to two decimals" — explicit constraints are followed reliably.
4. **Ask for a verification pass.** "Before finishing, re-open the file and check every formula resolves and no cell shows an error" — the skill runs code, so it can actually check its own artifact.
5. **Iterate on the file, not from scratch.** Follow-ups ("make sheet 2 a pivot by region") edit the existing artifact rather than regenerating.

For a report-to-deck task, the [AI presentation workflow](/guides/workflow/ai-presentation-from-report) adds a claim-to-slide map and a review of both slides and speaker notes.

## Limits worth knowing

On the API the execution container has **no network access** and cannot install packages, so a document skill can't pull live data mid-build — provide the data in the conversation or as an uploaded file. On claude.ai, network access depends on your settings: Team organizations default to package managers only, and new Enterprise organizations start with it off. On the API, input files go through the Files API, a request carries at most 20 skills, and files are capped at 30 MB each on claude.ai. And very large or intricate documents (hundred-tab workbooks, pixel-perfect design decks) still hit the ceiling of what code-built documents do well — the skills raise the floor dramatically; they don't replace a designer.

## Why they matter beyond documents

The document skills are the reference implementation for the whole format. If you're [writing your own skill](/guides/skills/writing-your-first-skill), read the `xlsx` SKILL.md in anthropics/skills first: one job, a tight procedure, deterministic work pushed into code, and boundaries stated plainly. Our [annotated examples](/guides/skills/claude-skills-examples) walk the same patterns at smaller scale.
