---
title: "Anthropic's Design Plugin for Claude: Every Skill Explained"
description: "Every skill in Anthropic's open-source design plugin for Claude Cowork and Claude Code, the connectors it expects, the install commands, and what it leaves out."
seoTitle: "Anthropic's Design Plugin for Claude: Every Skill Explained"
seoDescription: "All seven skills in Anthropic's design plugin for Claude Cowork and Claude Code, its .mcp.json connectors, the real install commands, and what it leaves out."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
tags: ["claude", "cowork", "plugins", "design", "skills", "figma", "accessibility"]
featured: false
keywords: ["Claude design plugin", "Anthropic design plugin", "Cowork design plugin", "knowledge-work plugins design", "design-critique skill"]
summary: "Anthropic's design plugin is an Apache-2.0 folder in the knowledge-work-plugins repo: seven SKILL.md files (design-critique, design-system, design-handoff, ux-copy, accessibility-review, user-research, research-synthesis) plus an .mcp.json of design connectors led by Figma. It installs from Cowork's Customize menu or with two claude plugin commands."
keyTakeaways:
  - "As of September 2026 the folder holds seven skills and no commands directory, though its README still describes six commands and six skills."
  - "Every skill works standalone from a screenshot or a description; connecting Figma is what turns critique and handoff from opinion into measurement."
  - "Cowork: Customize > Plugins > Browse plugins > Install. Claude Code: add the knowledge-work-plugins marketplace, then install design@knowledge-work-plugins."
  - "The .mcp.json pre-configures Slack, Figma, Linear, Asana, Atlassian, Notion, and Intercom; product analytics is a named category with no server included."
  - "accessibility-review targets WCAG 2.1 AA and says outright that an automated scan catches about 30 percent of issues."
  - "The plugin starts once a design exists. It has no brief, no research plan template beyond method tables, and no repo-side token work."
faq:
  - q: "What is in Anthropic's design plugin for Claude?"
    a: "Seven skills as of September 2026: design-critique, design-system, design-handoff, ux-copy, accessibility-review, user-research, and research-synthesis, plus an .mcp.json that pre-configures Slack, Figma, Linear, Asana, Atlassian, Notion, and Intercom connectors. It lives in the design folder of the anthropics/knowledge-work-plugins repository, which is Apache 2.0 licensed, and its manifest reports version 1.2.0."
  - q: "How do I install the design plugin in Claude Cowork?"
    a: "Open the Cowork tab in Claude Desktop, click Customize in the left sidebar, open the Plugins tab, click Browse plugins, and press Install on design. Plugins are available on all paid plans: Pro, Max, Team, and Enterprise. Bundled connectors are set up for you, though you still authorize each service the first time a skill reaches for it."
  - q: "How do I install it in Claude Code?"
    a: "Two terminal commands: claude plugin marketplace add anthropics/knowledge-work-plugins, then claude plugin install design@knowledge-work-plugins. The design README still shows an older claude plugins add knowledge-work-plugins/design form, which no longer matches the repository root README. Once installed, skills fire automatically and are also namespaced commands such as design colon design-critique."
  - q: "Does the plugin need Figma to be useful?"
    a: "No. The README is explicit that every skill works standalone: describe the design or paste a screenshot. Figma changes what the output is worth. Without it, a handoff spec repeats measurements you typed in; with it, the agent reads the real values, and a design-system audit can look at the actual component library rather than your description of it."
  - q: "Does it overlap with the design skills on this site?"
    a: "In two places. Anthropic's design-critique and ux-copy cover the same ground as our design-critique-checklist and ux-copy-reviewer, with a different shape: theirs are frameworks that adapt to whatever you share, ours are fixed checklists that produce the same report sections every run and need no connectors, which makes them easy to diff across weeks. There is no overlap at the front of the process, where our design-brief-writer sits."
related: ["guide:claude-design-guide", "guide:claude-knowledge-work-plugins", "guide:claude-code-for-designers", "guide:figma-to-code-with-claude", "skill:design-critique-checklist", "skill:ux-copy-reviewer", "tool:claude-cowork", "glossary:claude-plugins"]
sources:
  - title: "anthropics/knowledge-work-plugins: design plugin (README, skills/, .mcp.json, CONNECTORS.md, plugin.json)"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/design"
    publisher: "Anthropic"
  - title: "anthropics/knowledge-work-plugins: root README (install commands, plugin structure)"
    url: "https://github.com/anthropics/knowledge-work-plugins"
    publisher: "Anthropic"
  - title: "Use plugins in Claude"
    url: "https://support.claude.com/en/articles/13837440-use-plugins-in-claude"
    publisher: "Anthropic"
---

Anthropic's design plugin is one folder inside the open-source `knowledge-work-plugins` repository: seven Markdown skills, a JSON file of connectors, and a manifest. Install it in [Claude Cowork](/tools/claude-cowork) or Claude Code and Claude gains a repeatable procedure for critique, design-system work, developer handoff, UX copy, accessibility review, research planning, and research synthesis. This guide covers every skill, the connectors, the install commands that actually work, and where it stops.

It drills into a single plugin. The catalog of every role plugin and how the repo is organized is in [Anthropic's knowledge-work plugins, explained](/guides/getting-started/claude-knowledge-work-plugins); the term is defined in the glossary under [Claude plugins](/glossary/claude-plugins). If you are new to Claude for design work, start at the pillar, [Claude for design work](/guides/design/claude-design-guide).

## What is actually in the folder

Read the repository tree, not the README. As of September 2026 the `design/` folder contains `.claude-plugin/plugin.json` (name `design`, version `1.2.0`), `.mcp.json`, `CONNECTORS.md`, `README.md`, and `skills/`. There is no `commands/` directory, even though the README describes six slash commands and six skills.

The explanation is in the commit history: a March 13, 2026 commit bumped versions across fourteen plugins "to reflect the migration from commands/ to skills/ format," and the README was not rewritten. Two skills were renamed on the way through (`design-system-management` became `design-system`, `ux-writing` became `ux-copy`), and `research-synthesis`, listed as a command, is now a seventh skill. Since skills double as slash commands, nothing was lost; the names just moved. The last change to the folder was an April 23, 2026 fix adding a Slack OAuth client ID.

## Every skill

Descriptions are condensed from each `SKILL.md`'s frontmatter, which is the text Claude matches your request against.

| Skill | What it does | Triggers when you |
|---|---|---|
| `design-critique` | Structured feedback across five passes: first impression at two seconds, usability, visual hierarchy, consistency with the system, and accessibility | Ask to review or critique a design, or share a Figma link or screenshot for feedback at any stage |
| `design-system` | Audit, document, or extend a system. The audit mode reports components reviewed, issues found, and a score out of 100 across tokens, components, and patterns | Check for naming inconsistencies or hardcoded values, document a component's variants and states, or design a new pattern |
| `design-handoff` | Generates a developer spec: measurements, token references, variants and states, breakpoints, interaction and animation detail, content limits, edge cases, and accessibility notes | Have a design ready for engineering and need a spec sheet |
| `ux-copy` | Writes or reviews microcopy against five principles (clear, concise, consistent, useful, human) with patterns for CTAs, error messages, empty states, confirmations, tooltips, and loading states | Ask what a button should say, or hand over an error message or empty state to review |
| `accessibility-review` | A WCAG 2.1 AA audit with a criterion-level checklist: contrast ratios, keyboard operability, focus order and visibility, 44 by 44 pixel targets, error identification, name/role/value | Ask whether a design is accessible, or check contrast, keyboard flow, or screen reader behavior before handoff |
| `user-research` | Method selection (interviews, usability tests, surveys, card sorting, diary studies, A/B) with sample sizes and timelines, an interview guide structure, and analysis frameworks | Plan a study, write an interview guide, or choose between methods |
| `research-synthesis` | Turns transcripts, survey results, tickets, or NPS responses into themes with prevalence counts and quotes, an insight-to-opportunity table, and user segments | Have raw research data that needs to become findings |

Two details worth knowing before you rely on them. `design-handoff` insists on tokens over values ("reference `spacing-md` not `16px`") and on documenting every state including loading, empty, and error, which is exactly the discipline handoff usually loses. And `accessibility-review` is honest about its own ceiling: it puts an automated scan at roughly 30 percent of issues and lists keyboard-only navigation, screen reader testing, and a 200 percent zoom check as the rest of the work.

## Connectors the plugin expects

Skills never name a product. They refer to tool *categories* with a `~~` placeholder, and whatever MCP server you have connected in that category fills the slot. `CONNECTORS.md` maps them:

| Category | Placeholder | In `.mcp.json` | Other options the file names |
|---|---|---|---|
| Chat | `~~chat` | Slack | Microsoft Teams |
| Design tool | `~~design tool` | Figma | Sketch, Adobe XD, Framer |
| Knowledge base | `~~knowledge base` | Notion | Confluence, Guru, Coda |
| Project tracker | `~~project tracker` | Linear, Asana, Atlassian | Shortcut, ClickUp |
| User feedback | `~~user feedback` | Intercom | Productboard, Canny, UserVoice, Dovetail |
| Product analytics | `~~product analytics` | none included | Amplitude, Mixpanel, Heap, FullStory |

Every entry is a hosted HTTP server, so there is nothing to run locally, and `google calendar` and `gmail` appear with empty URLs as placeholders for Cowork's built-in connectors. The Figma entry points at `https://mcp.figma.com/mcp`, the same remote server covered in [Figma to code with Claude Code](/guides/design/figma-to-code-with-claude) and on the [Figma MCP](/tools/figma-mcp) tool page.

The README frames this as "standalone plus supercharged," and the framing is accurate. Critique, handoff, and system audits all run from a pasted screenshot; connecting Figma is what lets them read exact measurements, real tokens, and the actual component library instead of your summary of it.

## Installing in Cowork

Plugins are available on all paid plans: Pro, Max, Team, and Enterprise. In Claude Desktop, open the **Cowork** tab, click **Customize** in the left sidebar, open the **Plugins** tab, click **Browse plugins**, and press **Install** on design. Bundled connectors are configured for you, though each service still asks for authorization the first time a skill reaches for it. Type `/` in the composer to see the installed skills.

## Installing in Claude Code

```bash
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install design@knowledge-work-plugins
```

Inside a session, `/plugin marketplace add` and `/plugin install` do the same. Skills then fire automatically when a request matches and are also namespaced commands: `/design:design-critique`, `/design:design-handoff`, `/design:accessibility-review`. Ignore the `claude plugins add knowledge-work-plugins/design` line in the plugin's own README; it predates the current syntax in the repository root README. If the terminal itself is the obstacle, [Claude Code for designers](/guides/design/claude-code-for-designers) starts from zero, and [Claude Code plugins](/guides/configuration/claude-code-plugins) covers the format in depth.

Because the repository is Apache 2.0, forking is the expected move: copy `design/` into your own repo, rename it in `plugin.json`, trim `.mcp.json` to the tools you actually use, and paste your brand and system rules into the skill files. `claude --plugin-dir ./acme-design` loads a local folder for one session without installing it.

## Where our skills fit alongside it

Two of the design skills on this site cover ground Anthropic's plugin also covers, and the difference is shape rather than subject.

- **[design-critique-checklist](/skills/design/design-critique-checklist)** runs a fixed checklist and returns the same report sections every time, with no connectors involved. Anthropic's `design-critique` is a framework that adapts to whatever you share. Fixed output is worth more when you are comparing the same screen across three weeks; the adaptive version is better for a one-off second opinion.
- **[ux-copy-reviewer](/skills/design/ux-copy-reviewer)** takes existing interface copy and returns a rewrite table against a fixed rubric. Anthropic's `ux-copy` both writes and reviews, with strong pattern guidance for CTAs and error messages. Use theirs to draft, ours to audit a screen that already shipped.
- **[design-brief-writer](/skills/design/design-brief-writer)** has no counterpart in the plugin at all. Every skill there starts once a design exists; the brief is the step before that.

The repo-side work also stays outside the plugin: regenerating tokens from Figma variables and catching drift between the system in the file and the system in the code. That is covered in [maintaining a design system with Claude Code](/guides/design/maintain-a-design-system-with-claude-code).
