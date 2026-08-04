---
title: "Claude Skills Not Working? Fixes for Every Failure Mode"
description: "Skill missing from the / menu, never auto-triggering, firing too often, or breaking mid-run — the symptom-by-symptom fix list for Claude skills."
author: "AgentsCamp"
date: 2026-07-18
color: "red"
topics: ["workflow-prompting"]
tags: ["skills", "claude-code", "troubleshooting", "debugging", "skill-md"]
featured: false
seoTitle: "Claude Skills Not Working? Fixes for Every Failure"
seoDescription: "Fix Claude skills that don't show up, never trigger, fire too often, or fail mid-run — symptom by symptom, from folder naming to description rewrites."
keywords: ["claude skills not working", "claude skill not triggering", "claude skill not showing up", "skill.md not loading"]
summary: "Work the symptom, not the whole system: a skill missing from the / menu is a folder or naming problem; one that never auto-fires has a description problem; one that fires too often has a too-broad description; one that fires but misbehaves has a body problem. Each has a two-minute check — and most fixes are one line of frontmatter."
keyTakeaways:
  - "Not in the / menu → wrong folder, name/directory mismatch, or the skills directory didn't exist at session start (the one case that needs a restart)."
  - "Never auto-triggers → the description doesn't match how you ask. Rewrite it trigger-first; also check disable-model-invocation and paths aren't quietly blocking it."
  - "Fires too often → the description claims too much. Narrow it, or set disable-model-invocation: true for manual-only skills."
  - "Fires but does the wrong thing → body problem: missing steps, no convention anchor, no boundary line. The description got it loaded; the body decides what happens."
  - "Permission prompts mid-skill → allowed-tools doesn't cover what the body actually runs; grants also clear on your next message, by design."
  - "On claude.ai, 'skill does nothing' is usually code execution disabled or a mis-structured ZIP."
faq:
  - q: "Why is my skill not showing up in the slash menu?"
    a: "Check three things: the file is at .claude/skills/<name>/SKILL.md (or ~/.claude/skills/), the folder name exactly matches the frontmatter name (lowercase, numbers, hyphens, max 64 chars), and the frontmatter YAML parses — a stray tab or unclosed quote silently drops the skill. If the skills directory itself was created mid-session, restart once."
  - q: "Why does my skill only work when I invoke it with /name?"
    a: "That's a triggering failure, not a loading failure — the skill is installed fine, but its description doesn't match your phrasing. Rewrite the description as what-it-does plus 'Use when…' in the words you actually type, and add when_to_use with example phrasings if it needs more surface."
  - q: "Why did my skill stop asking before running commands — or start asking?"
    a: "allowed-tools pre-approves listed tools only for the turn that invoked the skill; the grant clears on your next message. If prompts appear mid-skill, the body is using tools the frontmatter doesn't list — add them, scoped (Bash(git diff:*)) rather than blanket."
  - q: "Why doesn't my uploaded skill do anything on claude.ai?"
    a: "Two usual causes: code execution isn't enabled (Settings → Capabilities — skills run inside it), or the ZIP is structured wrong — it must contain the skill folder with SKILL.md inside it. Also remember claude.ai doesn't see Claude Code skills; each surface needs its own upload."
  - q: "Do I need to restart Claude Code after editing a skill?"
    a: "No — skill files are watched, and edits apply in the current session. The single restart case is when the top-level skills directory didn't exist at session start. If an edit seems ignored, verify you edited the copy that's actually loading (project vs personal vs plugin namespace)."
related: ["guide:what-are-claude-skills", "guide:testing-and-debugging-skills", "guide:skill-md-reference", "guide:how-to-install-claude-skills", "skill:skill-auditor", "guide:claude-code-skills-best-practices"]
---

Skill failures sort cleanly by symptom, and each symptom has a short check list. Find your symptom below and work it top to bottom. (For the deeper test-and-iterate methodology once things basically work, see [Testing and Debugging Skills](/guides/skills/testing-and-debugging-skills).)

## Symptom 1: the skill doesn't appear in the `/` menu

The skill isn't loading at all. In order of likelihood:

1. **Wrong path.** It must be `.claude/skills/<name>/SKILL.md` (project) or `~/.claude/skills/<name>/SKILL.md` (personal) — the file is `SKILL.md`, uppercase, inside a folder named for the skill. A bare `my-skill.md` directly in `skills/` doesn't load.
2. **Name mismatch.** The frontmatter `name` must equal the folder name, and both must be lowercase letters, numbers, and hyphens only, max 64 characters. `Deploy_Checklist` fails on three counts.
3. **Broken YAML.** An unclosed quote, a tab, or a missing closing `---` makes the frontmatter unparseable and the skill is silently skipped. Paste the frontmatter into a YAML linter if in doubt.
4. **The skills directory was born mid-session.** Skill *files* are watched live, but if the top-level skills folder itself didn't exist when the session started, restart once so it gets watched.
5. **It's namespaced.** Plugin skills appear as `/plugin:name`, and nested monorepo skills as `/dir:name` — check the full menu, not just the bare name.
6. **`user-invocable: false` is set.** Then it's hidden from the menu *by design* and only auto-invocation runs it.

## Symptom 2: it never triggers on its own

The skill loads (you can run `/name`) but Claude never picks it up automatically. This is a **description problem** in nearly every case — the description is the only thing Claude sees before the skill fires:

- **It's written in implementation language.** "Handles VCS metadata normalization" matches nothing anyone types. Rewrite as the job plus the trigger: *"Generate clear commit messages from staged changes. Use when committing code."*
- **It lacks a "Use when…" clause.** Add one with the verbs users actually say; add `when_to_use` with example phrasings if the description alone isn't enough surface.
- **It's being truncated.** The listing budgets ~1,536 characters for description plus `when_to_use` combined — if your trigger phrasing lives at the end of a long description, it may never be seen. Front-load it.
- **A frontmatter field is blocking it.** `disable-model-invocation: true` forbids auto-triggering entirely, and `paths:` globs restrict activation to matching files — check both before rewriting anything.

Test in a **fresh session** each time: the session where you wrote the skill has the whole conversation biasing the routing.

## Symptom 3: it fires when it shouldn't

The opposite failure, same field. A description like "Helps with git" claims half of all sessions. Narrow it to the one job, name what it does *not* cover if a sibling skill owns the neighboring job, and for skills that should only ever run deliberately — deploys, anything destructive — set `disable-model-invocation: true` and invoke by `/name`. If you have many skills and can't tell which descriptions collide, run the [skill-auditor](/skills/workflow/skill-auditor) skill over the folder — overlap detection is exactly its job.

## Symptom 4: it fires, but does the wrong thing

Loading and triggering are fine; the **body** is the problem:

- **Steps are vague.** "Write good tests" isn't a procedure. Number the steps, name the commands.
- **No convention anchor.** Point at a canonical example in the repo ("match the format of the last five entries") so output lands in your house style.
- **No boundary.** Skills inherit the model's helpfulness; without a closing line like *"creating the file is the whole job — do not run the migration,"* scope creep is the default.
- **A bundled script fails.** Check the script is referenced by a path relative to the skill folder, runs from an arbitrary working directory, and — if you copied the skill from elsewhere — kept its executable bit.

## Symptom 5: permission prompts interrupt the skill

The body uses tools that `allowed-tools` doesn't pre-approve. Two subtleties: the grant is scoped to the **turn that invoked the skill** and clears on your next message — recurring prompts across turns are expected behavior, not a bug — and scoped forms matter: `Bash(git diff:*)` approves exactly that command family, while a body that also runs `git push` will still prompt. List what the procedure actually runs, no more. (See the [reference](/guides/skills/skill-md-reference) for the field's exact semantics.)

## Symptom 6: it works in Claude Code but not elsewhere

- **claude.ai:** code execution must be enabled (Settings → Capabilities), and the uploaded ZIP must contain the skill *folder* with SKILL.md inside. Surfaces don't sync — claude.ai never sees your filesystem skills.
- **Claude API:** the container has **no network access and no runtime package installs** — a skill that fetches URLs or pip-installs works locally and fails there. Also check both beta headers and the 8-skills-per-request cap. Details in [Skills on claude.ai and the API](/guides/skills/claude-skills-on-claude-ai-and-api).
- **Agent SDK:** `allowed-tools` frontmatter is ignored; tool permissions come from the SDK's own `allowedTools` option.

> [!TIP]
> When nothing above fits, minimize: copy the skill, strip the body to one trivial step, confirm the stub loads and triggers, then add the real body back in halves. Loading, triggering, and behavior are three separate layers — the stub isolates which one is broken.
