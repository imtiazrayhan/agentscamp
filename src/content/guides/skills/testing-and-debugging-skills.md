---
title: "Testing and Debugging Claude Code Skills"
description: "Verify a Claude Code skill triggers on the right prompts, check its output, and fix the five common failures — from vague triggers to broken paths."
author: "AgentsCamp"
date: 2026-06-20
color: "red"
topics: ["workflow-prompting", "review-qa"]
tags: ["claude-code", "skills", "debugging", "testing", "troubleshooting"]
featured: false
summary: "A skill firing means Claude found it, not that it worked. Test two things separately: does it trigger on the right prompts and skip the wrong ones, and is the output correct when it does. Most failures trace to the description (never fires, over-fires) or the body (does the wrong thing). Debug with fresh sessions and baseline comparison, not the session where you wrote it."
keyTakeaways:
  - "Triggering and behavior are separate tests — a skill can fire perfectly and still do the wrong thing, or do the right thing only when you invoke it by hand."
  - "Never-fires is almost always the description: too vague or written in implementation language instead of the words a user actually types."
  - "Over-fires is the opposite — a description so broad it matches unrelated prompts; tighten it or set disable-model-invocation for manual-only skills."
  - "Fires-but-wrong is a body problem: missing steps, no canonical example, or no explicit boundary telling the skill where to stop."
  - "Debug in a fresh session, not the one where you authored the skill — leftover context masks gaps in the written instructions."
  - "Editing a SKILL.md is picked up live within the session; only creating a brand-new top-level skills directory needs a restart."
howtoSteps:
  - name: "Confirm the skill is even loaded"
    text: "Before debugging triggers, ask Claude 'what skills are available?' or run /doctor. If your skill is not in the list, the problem is file placement or frontmatter, not the description — check the path is .claude/skills/<name>/SKILL.md (uppercase), the YAML is valid, and the top-level skills directory existed when the session started."
  - name: "Test that it triggers on the right prompts"
    text: "Collect three or four prompts a real user would type for this task, open a fresh session, and ask each one without naming the skill. Claude should load it on its own. If it doesn't, the description is the suspect."
  - name: "Test that it does NOT trigger on the wrong prompts"
    text: "Write a few adjacent-but-different prompts the skill should ignore. Run them in a fresh session. If the skill fires on these, the description is too broad and is poaching unrelated requests."
  - name: "Verify the behavior, not just the activation"
    text: "Run the should-trigger prompts in a fresh session with the skill, then again with it disabled, and compare the outputs. The skill earns its place only if the with-skill result is meaningfully better and matches what you intended."
  - name: "Fix the description for trigger problems"
    text: "Never fires: rewrite the description to lead with what it does plus when to use it, in the verbs people actually say. Over-fires: make it more specific, or add disable-model-invocation: true so only /name activates it."
  - name: "Fix the body for behavior problems"
    text: "Fires but does the wrong thing: the body is unclear or missing a boundary. Add numbered steps, point to a canonical example in the repo, and state explicitly where the skill stops ('create the file; do not run the migration')."
  - name: "Clear path and permission friction"
    text: "Tool-permission prompts: add the tools to allowed-tools so the skill runs without asking. Bundled file not found: reference supporting files with ${CLAUDE_SKILL_DIR} so paths resolve regardless of where the skill is installed or what the working directory is."
  - name: "Iterate one change at a time"
    text: "Change a single thing — the description OR one body instruction — re-run the same prompt set in a fresh session, and compare. Repeat until both the trigger set and the skip set are green and the output holds."
faq:
  - q: "How do I test whether a Claude Code skill triggers correctly?"
    a: "Run it in a fresh session with realistic prompts you did not write the skill with. Use two prompt sets: should-trigger (what a user would type for this task) and should-not-trigger (adjacent requests it must ignore). The skill passes only if it fires on the first set and stays quiet on the second. A fresh session matters because leftover authoring context makes the skill look like it triggers when it really didn't on the words alone."
  - q: "Why does my skill never fire even though it's installed?"
    a: "The description. It is the routing signal Claude matches against your request, and if it is vague ('helps with code') or written in implementation language, nothing matches. Rewrite it to lead with what the skill does and when to use it, using the phrasing people actually type. Also run /doctor — with many skills installed, descriptions get truncated to fit a budget and the keywords Claude needed can get cut."
  - q: "My skill fires on the wrong requests. How do I stop it?"
    a: "The description is too broad, so it matches prompts you never meant it for. Make it more specific about the task and the context. If the skill is something you only ever want to launch by hand — a deploy or a commit — add disable-model-invocation: true so Claude never auto-loads it and only /name activates it."
  - q: "The skill triggers but does the wrong thing — what now?"
    a: "That is a body problem, not a description problem. The instructions are unclear or missing a boundary. Add concrete numbered steps, point to a canonical example so the model copies the right shape, and state explicitly where the work ends. Verify by comparing the output against a run with the skill disabled in a fresh session."
  - q: "Do I have to restart Claude Code to pick up skill edits while debugging?"
    a: "Usually no. Claude Code watches skill directories, so adding, editing, or removing a SKILL.md under a watched skills folder takes effect within the current session. The one case that needs a restart is creating a top-level skills directory that did not exist when the session started, so it can begin being watched. Note that an already-invoked skill's content stays in context as written — re-invoke it to pick up edits mid-task."
related: ["what-are-claude-skills", "skill-auditor", "writing-your-first-skill", "claude-code-skills-best-practices", "skills-vs-agents-vs-commands", "packaging-and-sharing-skills"]
---

A skill that fires is not a skill that works. Seeing Claude pick up your skill tells you the routing matched — it says nothing about whether the skill did what you meant. So test two things, separately: **does it trigger on the prompts it should (and stay quiet on the ones it shouldn't), and is the output correct when it does.** Most failures collapse into a handful of causes, and almost all of them live in one of two places — the `description` (which controls firing) or the body (which controls behavior).

The one rule that makes all of this reliable: **debug in a fresh session, not the one where you wrote the skill.** Leftover context from authoring — the files you had open, the explanation you just typed — masks gaps in the written instructions and makes a half-broken skill look fine. If you're new to authoring, start with [Writing Your First Skill](/guides/skills/writing-your-first-skill); this guide is about confirming one works and fixing it when it doesn't.

## First: is the skill even loaded?

Before you debug triggering, rule out that the skill never made it into Claude's list at all. Ask `what skills are available?` or run `/doctor`. If your skill isn't there, the problem is mechanical, not semantic:

- **Wrong path or filename.** Project skills live at `.claude/skills/<name>/SKILL.md`; personal ones at `~/.claude/skills/<name>/SKILL.md`. The filename must be exactly `SKILL.md` — uppercase.
- **Double-nested folder.** Unzipping a shared skill often leaves `skills/<name>/<name>/SKILL.md`. Flatten it by one level.
- **Invalid frontmatter.** The YAML block must open and close with `---` on their own lines and be valid YAML.
- **New directory created mid-session.** If the top-level skills directory didn't exist when the session started, Claude Code can't watch it yet — restart once.

If the skill **is** in the list but isn't doing its job, the issue is description matching or body content. That's the rest of this guide.

## Test triggering: both directions

Triggering is a two-sided test. A skill that never fires is useless; a skill that fires on everything is worse than useless because it burns context and derails unrelated work.

**Should-trigger set.** Collect three or four prompts a real user would actually type for this task — not the prompt you used while writing the skill. Open a fresh session and run each one *without naming the skill*. Claude should load it on its own.

**Should-not-trigger set.** Write a few adjacent prompts the skill must ignore. A release-notes skill should fire on "write the changelog for this release" but not on "explain what this commit does." Run these in a fresh session too. If the skill activates here, it's poaching.

You can do this by hand, or automate it. The official [`skill-creator` plugin](/guides/skills/claude-code-skills-best-practices) runs the loop for you: it generates should-trigger and should-not-trigger prompts, measures the hit rate, and proposes description edits when the skill activates on the wrong requests — each test case in its own isolated subagent so there's no context bleed.

## Verify behavior, not just activation

Once it triggers correctly, check the output. The test is a **baseline comparison**: run each should-trigger prompt in a fresh session with the skill, then again with the skill disabled, and compare. The skill earns its place only if the with-skill result is meaningfully better and matches your intent. If the two runs are identical, the skill is adding nothing — usually because the body restates what the model already knew.

## The five failure modes and their fixes

### 1. Never fires — description too vague or implementation-worded

The description is the routing signal. Claude sees each skill's name and description and decides from that text alone whether to load the full body. A description like "helps with code" or one phrased in implementation terms ("runs the AST transform") gives nothing to match against.

**Fix:** lead with what the skill does *and* when to use it, in the words people actually type. "Reviews a diff for security issues, logic errors, and style violations. Use when asked to review code or check a change before merging." Specific about the task, general about the context.

One non-obvious cause: with many skills installed, descriptions get truncated to fit a context budget, which can strip the very keywords Claude needed. Run `/doctor` to see how many descriptions are being shortened or dropped, then trim low-priority skills or raise the budget.

### 2. Over-fires — description too broad

The mirror image. A description so general it matches prompts you never intended pulls the skill into unrelated work.

**Fix:** make the description more specific about both task and context. And if the skill is one you only ever want to launch deliberately — a deploy, a commit, anything with side effects — add `disable-model-invocation: true`. That removes it from Claude's auto-trigger pool entirely; only typing `/name` runs it. You don't want Claude deciding to deploy because the code looks ready.

### 3. Fires but does the wrong thing — body unclear or missing a boundary

This one isn't a description problem at all, and chasing the description will waste your time. The skill loaded; the instructions are the issue. Either they're ambiguous, or — most often — they're **missing a boundary that tells the skill where to stop.**

**Fix:** write the body as a runbook. Concrete numbered steps. A pointer to a canonical example in the repo so the model copies the right shape instead of inventing one. And an explicit stop line: "Create the migration file. Do **not** run it — generating the file is the whole job." Cut anything the model already knows; every line you leave in is a recurring token cost, because invoked skill content stays in context for the rest of the session.

### 4. Tool-permission friction — missing allowed-tools

The skill works but stops every few steps to ask permission to run a command. Annoying in normal use, fatal for anything you want to run unattended.

**Fix:** list the tools the skill needs in `allowed-tools` (a space- or comma-separated string, or a YAML list). That pre-approves them so Claude uses them without prompting while the skill is active. Note it's a *grant*, not a sandbox — every other tool is still callable under your normal permission settings; to genuinely keep a tool out, use `disallowed-tools`. For a project skill checked into `.claude/skills/`, `allowed-tools` only takes effect after you accept the workspace trust dialog, so review project skills before trusting a repo.

### 5. Bundled file not found — path issues

The skill references a script or template next to its `SKILL.md` and Claude can't find it, because the path was written relative to the working directory rather than the skill.

**Fix:** reference bundled files with `${CLAUDE_SKILL_DIR}` — it expands to the directory containing the skill's `SKILL.md`, so a line like `python3 ${CLAUDE_SKILL_DIR}/scripts/run.py` resolves correctly whether the skill is installed at the personal, project, or plugin level, and regardless of where you launched Claude. Hardcoded or cwd-relative paths break the moment the skill moves.

## The iterative debugging loop

Don't shotgun fixes. Change **one thing** — the description, or a single body instruction — then re-run the same prompt sets in a fresh session and compare. Resist editing the description and the body in the same pass; if behavior changes you won't know which edit did it.

A practical detail while you iterate: editing a `SKILL.md` is picked up live within the session, so you don't restart between attempts. But an already-invoked skill's content stays in context exactly as it was rendered — Claude doesn't re-read the file mid-task — so after an edit, re-invoke the skill (or start a fresh session) to load the new version. Loop until both sets are green: it fires on everything it should, ignores everything it shouldn't, and the output holds up against the disabled-baseline run.

Once it survives that loop, it's ready to share — see [Packaging and Sharing Skills](/guides/skills/packaging-and-sharing-skills). And if testing keeps surfacing the same friction, the problem might be the format itself: [Skills vs Agents vs Commands](/guides/skills/skills-vs-agents-vs-commands) covers when a skill is the wrong tool for the job.
