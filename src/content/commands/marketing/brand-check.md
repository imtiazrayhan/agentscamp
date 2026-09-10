---
description: "Score a draft file against the project's brand voice guide (brand-voice.md or a brand-voice skill) and list every violation with a rewrite, without editing it."
seoDescription: "/brand-check scores a draft against your project's brand-voice.md or brand-voice skill and lists each violation with a suggested rewrite. A Claude Code command."
date: 2026-09-10
argument-hint: "[draft file path]"
allowed-tools: "Read, Glob"
title: "Brand Check"
color: "purple"
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
featured: false
related: ["skill:brand-voice-profiler", "command:repurpose", "agent:content-editor", "guide:brand-voice-with-claude-skills", "guide:claude-skills-for-marketers"]
summary: "A read-only slash command that finds the project's voice guide (brand-voice.md or a brand-voice skill), reads the draft you pass, scores it on each dimension the guide defines, and lists every violation with the rule it breaks, a severity, and a rewrite. It changes nothing; if no guide exists it stops and tells you how to derive one."
---

Check a draft against the voice your team actually writes in, before it goes out. This command looks for the guide the [brand-voice-profiler](/skills/marketing/brand-voice-profiler) skill produces, scores the draft against each of that guide's dimensions, and lists what to change and how. It reads only, so it is safe to run on anything from a tweet file to a landing page. Anthropic's marketing plugin has a `/brand-review` command that reviews against a guide configured there; this one works from a guide that lives as a plain file or skill in your project.

## Scope

Interpret `$ARGUMENTS` in this order:

1. One path: `Read` it; that is the draft. Note its type (email, post, page, article); some guide rules apply per channel.
2. Several paths separated by spaces: check each and return one report per file, in the order given.
3. Empty: ask one question, "Which draft should I check?", and stop. Do not pick a file from the project.

If `Read` fails on a path, report it and continue with the others; do not guess at a similar filename.

> [!NOTE]
> This command scores voice: tone, vocabulary, rhythm, formatting, and the guide's dos and don'ts. It does not check facts, sources, or claims. For an edit that does both, and returns a corrected draft with a change log, use the [content-editor](/agents/marketing/content-editor) agent.

## Step 1 — Locate the voice guide

`Glob` in this order and use the first match: `brand-voice.md`, `docs/brand-voice.md`, `.claude/skills/brand-voice/SKILL.md`, `.claude/skills/*brand*voice*/SKILL.md`. If nothing matches, stop with a two-line reply: no voice guide was found at those paths, and to create one, paste five to ten published samples into the brand-voice-profiler skill and save its output as `brand-voice.md`. Never score against a guide you imagined or against general copywriting advice.

`Read` the guide and extract its dimensions: the tone axes and their target scores, the use and avoid vocabulary, the rhythm rules, the formatting rules, and the dos and don'ts. If the guide has only a rules block, treat each rule as a dimension.

## Step 2 — Read the draft

Read the draft in full once for sense, then once against the guide. Note channel-specific rules that apply ("no emoji on the blog, one in an email opener") based on the type identified in Scope.

## Step 3 — Score each dimension

For every dimension in the guide, give a score from 1 to 5 with one quoted line from the draft as evidence. A 5 means the draft would pass as a sample the guide was derived from; a 1 means the dimension is contradicted throughout. Compute the overall alignment as the mean score times 20, rounded, out of 100. Print the table before the violations.

## Step 4 — List the violations

One row per violation, in the order they appear in the draft: the quoted text, the rule it breaks (quoted from the guide, with the guide's section), a severity, and a rewrite that fixes only that violation. Severity is deterministic: **High** if the text does something the guide's don'ts forbid or uses an avoid-list word; **Medium** if a tone axis or rhythm rule is missed; **Low** if only a formatting habit differs. If a rewrite would change a factual claim, do not rewrite; note that the sentence needs an owner decision.

## Step 5 — Report

If the draft is clean on a dimension, say so; do not pad the table. If the guide itself is ambiguous on a point the draft raises, list it under "Guide gaps" so the owner can update the guide rather than the draft.

## Output

Per file: the score table, the overall alignment out of 100, the violations table with rewrites, the "Guide gaps" list, and the guide's path with its header comment (sample count and date) so the reader knows how current it is. Then one line suggesting the next step: apply the rewrites by hand, or hand the file to the [content-editor](/agents/marketing/content-editor) agent for a full edit with claim markers. Derivatives produced by [/repurpose](/commands/marketing/repurpose) are the usual input. Turning the guide into a shared skill is covered in [Brand voice with Claude skills](/guides/marketing/brand-voice-with-claude-skills), and the whole marketer set in [Claude skills for marketers](/guides/marketing/claude-skills-for-marketers).
