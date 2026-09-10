---
title: "Claude Skills for Founders: 5 to Upload Today"
description: "Five Claude skills built for founders (PRD, MVP scope, interview synthesis, competitor teardown, investor update), how to upload them, and a prompt for each."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
tags: ["skills", "founders", "claude", "prd", "mvp", "investor-update"]
featured: false
seoTitle: "Claude Skills for Founders: 5 to Upload Today (2026)"
seoDescription: "Five founder skills for Claude: prd-writer, mvp-scope-cutter, user-interview-synthesizer, competitor-teardown, investor-update-writer. Upload steps and prompts."
keywords: ["claude skills for founders", "claude skill prd", "investor update claude", "upload claude skill", "claude skills startup"]
summary: "A Claude skill is a folder with a SKILL.md that teaches Claude a repeatable procedure, loaded only when your task matches. Five built for founders cover the documents you write every month: a PRD, an MVP scope cut, interview synthesis, a competitor teardown, and an investor update. Upload each as a ZIP on claude.ai; they also run in Cowork and Claude Code."
keyTakeaways:
  - "A skill is a SKILL.md describing a procedure. Claude reads only its description at session start and loads the full instructions when your request matches."
  - "Upload on claude.ai: Customize > Skills > + > Create skill > Upload a skill, with the skill folder at the ZIP root. Code execution must be on in Capabilities."
  - "Each founder skill produces one artifact from what you paste: a PRD, a cut MVP scope, an interview synthesis, a competitor teardown, or an investor update."
  - "Every skill here runs with no network, shell, or repo, so the same file works on claude.ai, in Cowork, and in Claude Code."
  - "In Claude Code the same jobs are one keystroke away as /prd and /scope-mvp; the technical-cofounder agent answers engineering questions you cannot judge alone."
howtoSteps:
  - name: "Turn on code execution"
    text: "On claude.ai, open Settings > Capabilities and make sure Code execution and file creation is enabled. Skills require it. On Team and Enterprise plans an owner also has to enable Skills in the organization settings."
  - name: "Download the skill folder"
    text: "Open the skill's page on AgentsCamp and save the SKILL.md into a folder named after the skill, for example prd-writer/SKILL.md."
  - name: "Zip the folder"
    text: "Compress the skill folder so the folder itself is the root of the ZIP, not a subfolder inside it. The ZIP must contain the SKILL.md file."
  - name: "Upload it"
    text: "Go to Customize > Skills, click the + button, choose + Create skill, then Upload a skill, and select the ZIP."
  - name: "Toggle it on and test it"
    text: "Use the switch next to the skill to enable it, then start a chat that matches the skill's description, such as pasting interview notes and asking for a synthesis. Claude loads the skill automatically."
sources:
  - title: "Use skills in Claude"
    url: "https://support.claude.com/en/articles/12512180-use-skills-in-claude"
    publisher: "Anthropic"
  - title: "What are skills?"
    url: "https://support.claude.com/en/articles/12512176-what-are-skills"
    publisher: "Anthropic"
  - title: "Extend Claude with skills (Claude Code)"
    url: "https://code.claude.com/docs/en/skills"
    publisher: "Anthropic"
faq:
  - q: "Do I need Claude Code to use these skills?"
    a: "No. All five run on claude.ai as a ZIP upload, and in Cowork, because they are pure instructions: no scripts, no network calls, no repository. Claude Code users get the same skills plus two slash commands and an agent that only make sense inside a project folder."
  - q: "Which plans can upload skills?"
    a: "Anthropic's help center lists skills as available on Free, Pro, Max, Team, and Enterprise, provided code execution and file creation is enabled under Settings > Capabilities. Team and Enterprise owners must also enable Skills at the organization level."
  - q: "Does a skill uploaded to claude.ai appear in Claude Code?"
    a: "No. Each surface keeps its own copy. For Claude Code, put the same folder at .claude/skills/<name>/SKILL.md inside a project, or at ~/.claude/skills/<name>/ to make it available everywhere."
  - q: "Are these skills safe?"
    a: "They are plain Markdown with no bundled code, so the whole skill is the text you can read on its page before uploading. That is the habit to keep for any skill from anywhere: read the SKILL.md, and anything shipped beside it, before you install it."
related: ["guide:claude-code-for-non-developers", "guide:what-are-claude-skills", "guide:claude-skills-on-claude-ai-and-api", "guide:how-to-install-claude-skills", "skill:prd-writer", "skill:mvp-scope-cutter", "skill:investor-update-writer", "agent:technical-cofounder"]
---

A founder writes the same five documents on a loop: the requirements for the next feature, the argument about what to cut, the synthesis of what users said, the teardown of a competitor, and the monthly update to investors. Each one has a shape you have to re-explain to Claude every time. A skill is how you explain it once. This guide covers what a skill is, how to upload one to claude.ai in five steps, and the five we built for this job.

## What a skill is, in one paragraph

A Claude skill is a folder containing a `SKILL.md` file: a few lines of metadata (a name and a one-sentence description of when to use it) followed by Markdown instructions Claude follows once the skill is loaded. At the start of a session Claude reads only the descriptions of every installed skill, so twenty of them cost roughly a screenful of text. When your request matches one ("synthesize these interviews"), Claude loads the full instructions and works through them like a runbook. The same file format runs on claude.ai, in Cowork, in Claude Code, and, because Anthropic released it as an open standard, in a growing list of other tools. The complete explanation, including how skills differ from CLAUDE.md and plugins, is [What Are Claude Skills?](/guides/skills/what-are-claude-skills).

## How to upload a skill on claude.ai

Anthropic's help center lists skills as available on Free, Pro, Max, Team, and Enterprise, with one prerequisite: code execution has to be on. The steps, verified against the current article as of September 2026:

1. Open **Settings > Capabilities** and enable **Code execution and file creation**. On Team and Enterprise plans an owner must also enable Skills in the organization settings.
2. Put the `SKILL.md` into a folder named after the skill (`prd-writer/SKILL.md`) and zip that folder so the folder is the root of the archive. The most common upload error the article lists is "Missing required skill.md file," which almost always means the ZIP has an extra layer of folder around it.
3. Go to **Customize > Skills**, click **+**, then **+ Create skill**, then **Upload a skill**, and choose the ZIP.
4. Toggle the skill on with the switch next to it. Disabled skills are invisible to Claude.

Skills do not sync between surfaces. A skill on claude.ai is not in Claude Code and vice versa; each gets its own copy. The claude.ai and API side, including the `/v1/skills` endpoint for developers, is in [Skills on claude.ai and the API](/guides/skills/claude-skills-on-claude-ai-and-api). The Claude Code side, where a skill is a folder at `.claude/skills/<name>/` in a project or `~/.claude/skills/<name>/` for every project, is in [How to install Claude skills](/guides/skills/how-to-install-claude-skills). If you have never opened Claude Code, the non-developer walkthrough is [Claude Code for Non-Developers and Founders](/guides/founders/claude-code-for-non-developers).

Every skill below is pure instruction. No scripts, no network, no repository. That is deliberate: it means the identical file works in all three places, and it means the whole skill is the text you can read on its page before you upload it.

## The five skills

### 1. prd-writer

[prd-writer](/skills/product/prd-writer) turns a rough feature idea, a Slack thread, or a page of notes into a structured product requirements document: problem, target user, success metrics, scope, non-goals, open questions. The non-goals are the part founders skip and engineers need most.

```text
Use the prd-writer skill. Here is what I know about the feature:
[paste notes]. Our users are independent bookkeepers. The metric we
care about is time-to-first-reconciliation. Flag anything I have not
specified as an open question rather than guessing.
```

### 2. mvp-scope-cutter

[mvp-scope-cutter](/skills/product/mvp-scope-cutter) takes a feature list and argues it down to what must ship first, with a reason for each cut and the assumptions the remaining scope depends on. Paste it the PRD from the skill above and it will push back.

```text
Use mvp-scope-cutter on this feature list: [paste]. We have one
engineer for six weeks and need something a paying customer can use
by the end. Be aggressive; I will argue back.
```

### 3. user-interview-synthesizer

[user-interview-synthesizer](/skills/product/user-interview-synthesizer) turns a pile of interview notes or transcripts into a synthesis: recurring themes, supporting quotes, contradictions between participants, and what to ask next time. Its job is to separate what people said from what you hoped they said.

```text
Use user-interview-synthesizer. Here are notes from eight interviews
with clinic managers: [paste]. Tag each theme with which interviews
support it, quote people verbatim, and do not promote anything only
one person said into a theme.
```

### 4. competitor-teardown

[competitor-teardown](/skills/product/competitor-teardown) produces a structured breakdown of a rival product from whatever you give it: their pricing page, onboarding screenshots, changelog, reviews. Expect positioning, who they are built for, the pricing model, what they do better, what they do worse, and where the gap is.

```text
Use competitor-teardown on Acme. Here is their pricing page text,
their last six changelog entries, and twenty G2 reviews: [paste].
We sell to the same buyer at half the price. Mark anything you are
inferring rather than reading as an inference.
```

### 5. investor-update-writer

[investor-update-writer](/skills/product/investor-update-writer) drafts the monthly update from your numbers and a few bullet points: headline metrics with month-over-month change, what worked, what did not, the specific asks, and a closing line, in the plain, honest-about-bad-news tone investors actually want.

```text
Use investor-update-writer. MRR 41,200 (up from 37,900), 3 churned
logos, 2 new hires, runway 14 months. We missed the integrations
launch by three weeks. Asks: intros to fintech CFOs. Draft it.
```

## For Claude Code users: commands and an agent

Inside Claude Code, two of these jobs are also slash commands, which is faster when the input is already in the project folder. [/prd](/commands/product/prd) writes a PRD into the repo from a feature name or an issue, and [/scope-mvp](/commands/product/scope-mvp) reads an existing PRD or feature list from the folder and produces the cut. Both are Markdown files you drop into `.claude/commands/`.

The [technical-cofounder](/agents/product/technical-cofounder) agent is different in kind. It is a subagent, a specialist Claude delegates to with its own instructions and a clean context, built to answer the engineering questions a founder cannot judge alone: is this one service or two, should we buy or build the auth, what breaks first at ten times the load. Ask it before you commit an engineer to a direction, and keep its answers in the project for the engineer you eventually hire. The differences between skills, commands, and agents, and when each is the right shape, are in [Skills vs Agents vs Commands](/guides/skills/skills-vs-agents-vs-commands).

## Making them yours

All five are starting points. The fastest improvement is to add your own template under the skill's instructions: the PRD sections your team actually uses, the investor update format your lead wants, the interview question bank you always run. Edit the `SKILL.md`, re-zip, re-upload. The third time you find yourself correcting the output the same way, that correction belongs in the file. When you are ready to write one from scratch, [Writing Your First Skill](/guides/skills/writing-your-first-skill) is the walkthrough, and the rest of the founder toolkit is at the [founders hub](/for/founders).
