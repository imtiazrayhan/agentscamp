---
title: "Claude Skills for Designers: 5 to Upload Today"
description: "Five Claude skills for designers: brief, critique, token extraction, component spec, and UX copy review. What each returns, a prompt for each, and upload steps."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
tags: ["skills", "designers", "claude", "design-critique", "design-tokens", "ux-writing"]
featured: false
seoTitle: "Claude Skills for Designers: 5 to Upload Today (2026)"
seoDescription: "Five designer skills for Claude: brief writer, critique checklist, token extractor, component spec writer, and UX copy reviewer, plus the upload steps."
keywords: ["claude skills for designers", "design critique ai", "design token extraction", "component spec ai", "upload claude skill"]
summary: "A Claude skill is a folder with a SKILL.md that teaches Claude one repeatable procedure and loads only when your request matches it. Five are built for design work: the brief, the critique, the token set, the component spec, and the UX copy pass. Upload each as a ZIP on claude.ai; the same files run in Cowork and Claude Code."
keyTakeaways:
  - "A skill is a SKILL.md describing a procedure. Claude reads only the description at session start and loads the instructions when your request matches."
  - "Upload on claude.ai: Customize > Skills > + > + Create skill > Upload a skill, with the skill folder at the root of the ZIP."
  - "Code execution and file creation must be on under Settings > Capabilities. On Team and Enterprise an owner enables Skills at the organization level."
  - "All five skills are pure instructions with no scripts or network calls, so the same file works on claude.ai, in Cowork, and in Claude Code."
  - "Claude Code users get the same jobs as /critique-screen and /design-tokens, plus the design-systems-librarian agent for questions about the repo."
howtoSteps:
  - name: "Turn on code execution"
    text: "On claude.ai, open Settings > Capabilities and enable Code execution and file creation. Skills require it. On Team and Enterprise plans, an owner must also enable Skills under Organization settings."
  - name: "Save the SKILL.md into a folder"
    text: "Open the skill's page on AgentsCamp and save its SKILL.md into a folder named exactly after the skill, for example design-critique-checklist/SKILL.md."
  - name: "Zip the folder"
    text: "Compress the folder so it is the root of the archive, not a subfolder inside another folder. Anthropic lists a missing SKILL.md and a folder name that does not match the skill name among the common upload failures."
  - name: "Upload it"
    text: "Go to Customize > Skills, click the + button, choose + Create skill, then Upload a skill, and select the ZIP."
  - name: "Toggle it on and test it"
    text: "Switch the skill on in the list, then start a chat that matches its description, such as pasting a screen and asking for a critique. Claude loads the skill on its own."
sources:
  - title: "Use skills in Claude"
    url: "https://support.claude.com/en/articles/12512180-use-skills-in-claude"
    publisher: "Anthropic"
  - title: "Extend Claude with skills (Claude Code)"
    url: "https://code.claude.com/docs/en/skills"
    publisher: "Anthropic"
  - title: "Design plugin (anthropics/knowledge-work-plugins)"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/design"
    publisher: "Anthropic"
faq:
  - q: "Do I need Claude Code to use these skills?"
    a: "No. All five are plain instructions with no scripts, no network calls, and no repository, so they run on claude.ai as a ZIP upload and in Cowork. Claude Code users get the same skills plus two slash commands and an agent that only make sense inside a project folder."
  - q: "Which plans can upload skills?"
    a: "Anthropic's help center lists skills on Free, Pro, Max, Team, and Enterprise, provided code execution and file creation is enabled under Settings and Capabilities. Team and Enterprise owners must also enable Skills at the organization level."
  - q: "Does a skill I upload to claude.ai show up in Claude Code?"
    a: "No. Each surface keeps its own copy. For Claude Code, put the same folder at .claude/skills/name/SKILL.md inside a project, or under your home directory at ~/.claude/skills/name/ to have it everywhere."
  - q: "Why is there no accessibility skill in this set?"
    a: "Because a checklist is the wrong shape for it. This site ships an accessibility-auditor agent and an audit-accessibility command that check against WCAG 2.2 AA covering semantics, keyboard, ARIA, contrast, forms, and motion. Use those instead of a five-line reminder inside a critique skill."
related: ["guide:claude-design-guide", "guide:what-are-claude-skills", "guide:how-to-install-claude-skills", "skill:design-brief-writer", "skill:design-critique-checklist", "skill:design-token-extractor", "skill:component-spec-writer", "skill:ux-copy-reviewer"]
---

A designer retypes the same five instructions all week: what a brief should contain, what to check on a screen, which values count as tokens, what an engineer needs in a spec, and what makes a piece of interface copy bad. A skill is how you write each of those down once. This guide covers what a skill is, the five-step upload, and the five built for design work.

## What a skill is, in one paragraph

A Claude skill is a folder containing a `SKILL.md`: a few lines of metadata (a name and a one-sentence description of when to use it) followed by Markdown instructions Claude follows once the skill loads. At the start of a session Claude reads only the descriptions, so a dozen installed skills cost almost nothing. When your request matches one, the full instructions load and Claude works through them like a runbook. Anthropic's Claude Code documentation puts it plainly: "Claude uses skills when relevant, or you can invoke one directly with `/skill-name`," and "a skill's body loads only when it's used." The complete explanation, including how skills differ from CLAUDE.md and plugins, is [What Are Claude Skills?](/guides/skills/what-are-claude-skills).

## How to upload one on claude.ai

Anthropic's help center lists skills as available on Free, Pro, Max, Team, and Enterprise, with one prerequisite. As of September 2026:

1. Open **Settings > Capabilities** and enable **Code execution and file creation**. On Team and Enterprise plans, an owner also enables Skills under **Organization settings**.
2. Put the `SKILL.md` into a folder named exactly after the skill (`ux-copy-reviewer/SKILL.md`) and zip that folder so it sits at the root of the archive.
3. Go to **Customize > Skills**, click **+**, then **+ Create skill**, then **Upload a skill**, and choose the ZIP.
4. Toggle the skill on. A disabled skill is invisible to Claude.

The failure list Anthropic publishes is short and predictable: a ZIP over the size limit, a folder name that does not match the skill name, a missing `SKILL.md`, or invalid characters in the name or description. Almost every real-world failure is the second or third one, caused by an extra layer of folder inside the archive.

Skills do not sync between surfaces. A skill on claude.ai is not in Claude Code and the reverse; each keeps its own copy, and the Claude Code layout is a folder at `.claude/skills/<name>/` in a project or `~/.claude/skills/<name>/` for every project. The full walkthrough for both is [How to install Claude skills](/guides/skills/how-to-install-claude-skills).

Every skill below is pure instruction: no scripts, no network, no repository. That is deliberate. It means the identical file works in all three places, and it means the whole skill is text you can read on its page before you upload it.

## The five skills

### 1. design-brief-writer

[design-brief-writer](/skills/design/design-brief-writer) turns a request from a stakeholder into a brief you can design against: the user and the job, the problem in one sentence, success criteria, the states that must exist, constraints, and an explicit list of what is out of scope. Its real value is the open-questions section, which surfaces what nobody decided before you spend a day on the wrong screen.

```text
Use design-brief-writer. The request is: "we need a better billing
page." Context: B2B SaaS, self-serve upgrades, our support inbox is
full of confusion about proration. Flag anything I have not specified
as an open question rather than assuming it.
```

### 2. design-critique-checklist

[design-critique-checklist](/skills/design/design-critique-checklist) runs a structured pass over a screen you paste or upload and returns findings grouped by severity: hierarchy, consistency with the system, state coverage, and copy. It is not taste. It is the list you would work through yourself if you had not been staring at the file for four hours.

```text
Use design-critique-checklist on this screen [attach]. It is the
onboarding step-two screen for a mobile-first web app. Group findings
by severity and tell me which ones block a build and which are polish.
```

### 3. design-token-extractor

[design-token-extractor](/skills/design/design-token-extractor) reads screenshots, CSS, or a style guide and returns a token set: colors with roles, spacing steps, type scale, radii, and shadows, plus the values that do not fit any scale. Run it on a product that grew without a system and the output is the argument for building one.

```text
Use design-token-extractor on this CSS file and these three
screenshots. Produce the token set as JSON, then list every value that
appears only once and every pair of near-duplicate colors.
```

### 4. component-spec-writer

[component-spec-writer](/skills/design/component-spec-writer) turns a component into the document an engineer can build from without asking you anything: anatomy, props and variants, every state, keyboard and focus behavior, the tokens it consumes, and the edge cases (long text, no data, error).

```text
Use component-spec-writer for our Combobox. Here are the designs and
the current behavior [paste]. Include keyboard interaction, focus
management, the empty and loading states, and what happens with 500
options.
```

### 5. ux-copy-reviewer

[ux-copy-reviewer](/skills/design/ux-copy-reviewer) reviews interface strings rather than prose: button labels, empty states, error messages, tooltips, onboarding text. It returns each string with a rewrite and the reason, and flags the ones that describe the system instead of the user's situation.

```text
Use ux-copy-reviewer on these strings [paste]. Product is a scheduling
tool for clinics. Rewrite each one, keep them under the character
limits noted, and tell me which errors do not say what to do next.
```

## For Claude Code users: two commands and an agent

Inside a repo, two of these jobs are one keystroke. [/critique-screen](/commands/design/critique-screen) runs the critique against a file, a route, or an image already in the project, and [/design-tokens](/commands/design/design-tokens) extracts or audits the token set across the codebase instead of a single file. Both are Markdown files you drop into `.claude/commands/`.

The [design-systems-librarian](/agents/design/design-systems-librarian) agent is different in kind. It is a subagent with its own instructions and a clean context, built for the question you cannot answer by looking: does this component already exist, which variants are duplicates, and what breaks if this token changes. Ask it before you add anything to the system. The setup for all of this is [Claude Code for Designers](/guides/design/claude-code-for-designers), and the differences between the three shapes are in [Skills vs Agents vs Commands](/guides/skills/skills-vs-agents-vs-commands).

Accessibility is deliberately absent from the five. A serious pass belongs to the [accessibility-auditor](/agents/quality-security/accessibility-auditor) agent and the [/audit-accessibility](/commands/analyze/audit-accessibility) command, which work against WCAG 2.2 AA rather than a reminder buried in a critique. Anthropic's own design plugin makes the same split, shipping `accessibility-review` as its own skill alongside `design-critique`.

## Making them yours

All five are starting points. The fastest improvement is to paste your own template under the instructions: the brief format your team uses, the spec sections your engineers ask for, the words your product never uses. Edit the `SKILL.md`, re-zip, re-upload. The third time you correct the output the same way, that correction belongs in the file. The canvas side of the workflow is [Claude Design](/guides/design/claude-design-guide), and the rest of the toolkit is at the [designers hub](/for/designers).
