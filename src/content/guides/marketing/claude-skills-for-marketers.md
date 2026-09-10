---
title: "Claude Skills for Marketers: 6 to Upload Today"
description: "Six Claude skills for marketers (brand voice, SEO brief, repurposing, landing page, email sequence, documents), how to upload them, and a prompt for each."
author: "Imtiaz Rayhan"
date: 2026-09-10
color: "green"
depth: standard
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
tags: ["skills", "marketers", "claude", "brand-voice", "seo", "repurposing", "email"]
featured: false
seoTitle: "Claude Skills for Marketers: 6 to Upload Today (2026)"
seoDescription: "Six Claude skills for marketers: brand-voice-profiler, seo-content-brief-writer, content-repurposer, landing-page-copywriter, email-sequence-drafter, and more."
keywords: ["claude skills for marketers", "brand voice claude skill", "seo brief claude", "content repurposing claude", "upload claude skill"]
summary: "A Claude skill is a folder with a SKILL.md that teaches Claude a repeatable procedure, loaded only when your task matches. Five built for marketers cover the voice profile, the SEO brief, repurposing, landing-page copy, and email sequences; Anthropic's document skills are the sixth. Upload as a ZIP on claude.ai; they also run in Cowork and Claude Code."
keyTakeaways:
  - "A skill is a SKILL.md describing one procedure. Claude reads its description at the start and loads the full instructions when your request matches it."
  - "Upload on claude.ai: Customize > Skills > + > Create skill > Upload a skill, a ZIP with the skill folder inside. Code execution must be on under Capabilities."
  - "Build brand-voice-profiler first. Its output, a written voice file, is what the other four skills and the brand-check command are measured against."
  - "Every skill here is pure instruction with no scripts or network calls, so the identical file runs on claude.ai, in Cowork, and in Claude Code."
  - "Anthropic's document skills (Word, Excel, PowerPoint, PDF) are built in on claude.ai; ask for a .docx or .pptx and they load."
  - "Claude Code users get the same jobs as /repurpose and /brand-check, and a content-editor agent that returns unsupported claims and voice violations."
howtoSteps:
  - name: "Turn on code execution"
    text: "On claude.ai, open Settings > Capabilities and make sure Code execution and file creation is enabled. On Team and Enterprise plans an owner must also enable Code execution and file creation and Skills under Organization settings."
  - name: "Download the skill folder"
    text: "Open the skill's page on AgentsCamp and save the SKILL.md into a folder named exactly after the skill, for example brand-voice-profiler/SKILL.md. The folder name must match the skill name or the upload fails."
  - name: "Zip the folder"
    text: "Compress the skill folder so the folder itself is inside the ZIP. Anthropic's upload errors list a missing SKILL.md, a folder name that does not match the skill name, and a ZIP over the size limit."
  - name: "Upload it"
    text: "Go to Customize > Skills, click the + button, choose + Create skill, then Upload a skill, and select the ZIP."
  - name: "Toggle it on and test it"
    text: "Enable the skill with its switch, then start a chat that matches its description, such as pasting six posts and asking for a voice profile. Claude loads the skill on its own."
sources:
  - title: "Use skills in Claude"
    url: "https://support.claude.com/en/articles/12512180-use-skills-in-claude"
    publisher: "Anthropic"
  - title: "Extend Claude with skills (Claude Code)"
    url: "https://code.claude.com/docs/en/skills"
    publisher: "Anthropic"
  - title: "Marketing plugin (anthropics/knowledge-work-plugins)"
    url: "https://github.com/anthropics/knowledge-work-plugins/tree/main/marketing"
    publisher: "Anthropic"
faq:
  - q: "Do I need Claude Code to use these skills?"
    a: "No. All six run on claude.ai as a ZIP upload and in Cowork, because they are pure instructions with no scripts, no network calls, and no repository. Claude Code users get the same skills plus two slash commands and an agent that only make sense inside a project folder."
  - q: "Which plans can upload skills?"
    a: "Anthropic's help center lists skills as available on Free, Pro, Max, Team, and Enterprise, provided Code execution and file creation is enabled under Settings > Capabilities. Team and Enterprise owners must also enable Skills at the organization level. Enabled skills also apply in Cowork and in the Claude for Excel, PowerPoint, Word, and Outlook add-ins."
  - q: "Does a skill uploaded to claude.ai show up in Claude Code?"
    a: "No. Each surface keeps its own copy. For Claude Code, put the same folder at .claude/skills/<name>/SKILL.md inside the project, or at ~/.claude/skills/<name>/ to make it available in every project. Claude loads it when a task matches, or you invoke it as /name."
  - q: "How do these differ from Anthropic's marketing plugin?"
    a: "The plugin bundles eight skills plus connector configuration and is built for Cowork first. Its brand-review and email-sequence skills overlap with two of ours. The five here are smaller, single-job, and produce a file you can version; the plugin is broader and assumes connected tools. Many teams run both."
related: ["guide:claude-code-for-marketers", "guide:what-are-claude-skills", "guide:claude-document-skills", "guide:how-to-install-claude-skills", "guide:claude-marketing-plugin-guide", "skill:brand-voice-profiler", "skill:seo-content-brief-writer", "agent:content-editor"]
---

A marketer produces the same five things on a loop: a voice everything is checked against, a brief before a post, derivatives after it, a page for the campaign, and the emails that follow. Each one is a procedure, and a procedure is exactly what a Claude skill holds. This guide covers the mechanism in one paragraph, the upload steps, five skills built for marketers, Anthropic's document skills as the sixth, and the Claude Code commands and agent that go with them.

## What a skill is, in one paragraph

A skill is a folder containing a `SKILL.md` file: a short description of when it applies and a set of instructions for how to do the job. Claude sees only the description at the start of a session and loads the full instructions when your request matches it, or when you call it by name. That is why a skill costs nothing until it is needed and why you can have dozens installed. The longer explanation, including how skills differ from Projects and custom instructions, is [What Are Claude Skills?](/guides/skills/what-are-claude-skills). Every skill below is pure instruction: no scripts, no network, no repository. That is deliberate, because it means the identical file runs on claude.ai, in Cowork, and in Claude Code, and it means the whole skill is the text you can read on its page before you upload it.

## Uploading on claude.ai

The steps above are Anthropic's, from its skills article as of September 2026. The one that trips people is the folder name: the folder inside the ZIP must be named exactly after the skill, so `brand-voice-profiler/SKILL.md`, not `skill/SKILL.md`. Skills are available on Free, Pro, Max, Team, and Enterprise once code execution is on, and an enabled skill also applies in Cowork and the Microsoft 365 add-ins. If you are on Claude Code instead, the same folder goes in `.claude/skills/` inside your project; [How to Install Claude Skills](/guides/skills/how-to-install-claude-skills) covers every surface.

## The six skills

### 1. brand-voice-profiler

Build this one first. [brand-voice-profiler](/skills/marketing/brand-voice-profiler) reads a set of your best pieces and produces a written [brand voice](/glossary/brand-voice) document: tone attributes with evidence, sentence-level habits, vocabulary to use and to avoid, and before-and-after pairs. Save the output; the next four skills and the brand-check command all measure against it.

```text
Use brand-voice-profiler on these six posts: [paste]. Produce the
voice profile with ten banned phrases and the reason for each, and
three before/after pairs taken from the posts themselves.
```

How to keep the profile current and test it against new drafts is in [Brand Voice with Claude Skills](/guides/marketing/brand-voice-with-claude-skills).

### 2. seo-content-brief-writer

[seo-content-brief-writer](/skills/marketing/seo-content-brief-writer) turns a target query plus whatever data you paste (a Search Console export, a competitor's outline, a term list from your optimization tool) into a brief: intent, angle, outline with the questions each section answers, internal links to include, and what would make the piece different from what already ranks.

```text
Use seo-content-brief-writer. Target: "marketing attribution models".
Here are our current queries for the topic and the top three ranking
outlines: [paste]. Flag anything I have not given you as an open
question rather than guessing.
```

The full pipeline from export to published post is in [SEO Content Workflow with Claude Code](/guides/marketing/seo-content-workflow-with-claude-code).

### 3. content-repurposer

[content-repurposer](/skills/marketing/content-repurposer) takes one long piece and produces the derivatives you name, each with its own length and format rules, without inventing examples the source does not contain.

```text
Use content-repurposer on this post: [paste]. Outputs: a five-post
LinkedIn sequence, a newsletter section under 200 words, and three
hooks under 280 characters. Apply this voice profile: [paste].
```

### 4. landing-page-copywriter

[landing-page-copywriter](/skills/marketing/landing-page-copywriter) writes the blocks of a campaign page from a brief: headline options, subhead, the problem-and-outcome section, proof, objections, and the call to action, each labeled so a designer or a page builder can place them.

```text
Use landing-page-copywriter. Audience: finance leads at mid-market
SaaS. Offer: a live webinar on month-end close automation. CTA:
register. Three headline options; mark any claim that needs a source.
```

### 5. email-sequence-drafter

[email-sequence-drafter](/skills/marketing/email-sequence-drafter) drafts a multi-email sequence, one message per section with subject line, preview text, body, send timing, and the exit condition, in the voice you give it.

```text
Use email-sequence-drafter. Sequence: webinar registrant, four emails
(confirmation, two reminders, replay). Voice profile: [paste]. Keep
each body under 150 words.
```

### 6. Anthropic's document skills

The sixth is built in. Anthropic ships skills for Word, Excel, PowerPoint, and PDF creation, and the support article lists them as enhanced spreadsheet creation, professional Word documents, presentation generation, and PDF processing. Ask for the brief as a `.docx` or the campaign report as a `.pptx` and the relevant skill loads. What each produces and where they fall short is in [Claude Document Skills](/guides/skills/claude-document-skills).

## For Claude Code users: two commands and an agent

Inside Claude Code the same jobs are faster when the input already lives in the folder. Anthropic's docs note that "custom commands have been merged into skills," so a file in `.claude/commands/` and a skill folder both create a slash command. [/repurpose](/commands/marketing/repurpose) reads a post from the repo and writes each derivative as its own file, and [/brand-check](/commands/marketing/brand-check) runs a draft against your voice file and reports deviations by severity.

The [content-editor](/agents/marketing/content-editor) agent is different in kind: a subagent with its own instructions that reads a draft and returns every unsupported claim, every statistic without a source, and every sentence that breaks the voice profile. Run it before a human editor does. The differences between skills, commands, and agents are in [Skills vs Agents vs Commands](/guides/skills/skills-vs-agents-vs-commands), and how all of this fits into a content repo is the [marketers pillar](/guides/marketing/claude-code-for-marketers).

## Making them yours

All five are starting points. The third time you correct the output the same way, that correction belongs in the file: your persona names, your CTA conventions, the sections your briefs always have. Edit the `SKILL.md`, re-zip, re-upload. Anthropic's marketing plugin, covered in [Anthropic's Marketing Plugin: A Guide](/guides/marketing/claude-marketing-plugin-guide), overlaps with two of these and adds campaign planning, competitive briefs, and reporting; the rest of the toolkit is at the [marketers hub](/for/marketers).
