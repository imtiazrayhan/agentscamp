---
title: "Claude Skills Not Working? Fixes for Every Failure Mode"
description: "Skill missing from the / menu, never auto-triggering, firing too often, or breaking mid-run — the symptom-by-symptom fix list for Claude skills."
author: "Imtiaz Rayhan"
date: 2026-07-18
updated: 2026-11-27
reviewed: 2026-11-27
color: "red"
topics: ["workflow-prompting"]
audience: ["developers"]
tags: ["skills", "claude-code", "troubleshooting", "debugging", "skill-md"]
featured: false
seoTitle: "Claude Skills Not Working? Fixes for Every Failure"
seoDescription: "Fix Claude skills that don't show up, never trigger, fire too often, or fail mid-run — symptom by symptom, from folder naming to description rewrites."
keywords: ["claude skills not working", "claude skill not triggering", "claude skill not showing up", "skill.md not loading"]
summary: "Work the symptom, not the whole system: a skill missing from the / menu is a path or naming problem; one that never auto-fires has a description (or broken-YAML) problem; one that fires too often has a too-broad description; one that fires but misbehaves has a body problem. Each has a two-minute check, and most fixes are one line of frontmatter."
keyTakeaways:
  - "Not in the / menu → wrong path, a refused or namespaced name, or a skill Claude Code hasn't picked up yet. Run /reload-skills before you restart anything."
  - "Never auto-triggers → the description doesn't match how you ask, or the frontmatter YAML is malformed (the skill still loads, but with no description). Also check disable-model-invocation and paths."
  - "Fires too often → the description claims too much. Narrow it, or set disable-model-invocation: true for manual-only skills."
  - "Fires but does the wrong thing → body problem: missing steps, no convention anchor, no boundary line. The description got it loaded; the body decides what happens."
  - "Permission prompts mid-skill → allowed-tools doesn't cover what the body actually runs; grants also clear on your next message, by design."
  - "On claude.ai, 'skill does nothing' is usually code execution disabled, a mis-structured ZIP, or Claude Code-only frontmatter fields that the upload rejects."
faq:
  - q: "Why is my skill not showing up in the slash menu?"
    a: "Check three things: the file is at .claude/skills/<name>/SKILL.md (or ~/.claude/skills/), the command you are typing is the right one (a frontmatter name overrides the folder name, and plugin skills are /plugin-name:skill-name), and the name has no characters Claude Code refuses, such as < or >, double spaces or invisible characters. If the skill is brand new, run /reload-skills."
  - q: "Why does my skill only work when I invoke it with /name?"
    a: "That's a triggering failure, not a loading failure. Either the description doesn't match your phrasing, or the frontmatter YAML is malformed, in which case Claude Code loads the body with empty metadata and has no description to match. Run claude plugin validate .claude/skills to find parse errors, then rewrite the description as what-it-does plus 'Use when…' in the words you actually type."
  - q: "Why did my skill stop asking before running commands — or start asking?"
    a: "allowed-tools pre-approves listed tools only for the turn that invoked the skill; the grant clears on your next message. If prompts appear mid-skill, the body is using tools the frontmatter doesn't list — add them, scoped (Bash(git diff:*)) rather than blanket."
  - q: "Why doesn't my uploaded skill do anything on claude.ai?"
    a: "Two usual causes: code execution isn't enabled (Settings → Capabilities — skills run inside it), or the ZIP is structured wrong — it must contain the skill folder with SKILL.md inside it. An upload also fails outright if the frontmatter uses Claude Code-only fields; claude.ai accepts only name, description, license, compatibility, metadata and allowed-tools."
  - q: "Do I need to restart Claude Code after editing a skill?"
    a: "No — skill directories are watched, and edits to SKILL.md apply in the current session. If a new skill doesn't appear, run /reload-skills. If an edit seems ignored, verify you edited the copy that's actually loading (project vs personal vs plugin namespace); a personal skill overrides a project skill of the same name."
related: ["guide:what-are-claude-skills", "guide:testing-and-debugging-skills", "guide:skill-md-reference", "guide:how-to-install-claude-skills", "skill:skill-auditor", "guide:claude-code-skills-best-practices"]
---

Skill failures sort cleanly by symptom, and each symptom has a short check list. Find your symptom below and work it top to bottom. (For the deeper test-and-iterate methodology once things basically work, see [Testing and Debugging Skills](/guides/skills/testing-and-debugging-skills).)

## Symptom 1: the skill doesn't appear in the `/` menu

The skill isn't loading, or it's loading under a name you aren't typing. In order of likelihood:

1. **Wrong path.** It must be `.claude/skills/<name>/SKILL.md` (project) or `~/.claude/skills/<name>/SKILL.md` (personal) — the file is `SKILL.md`, uppercase, inside a folder named for the skill. A bare `my-skill.md` directly in `skills/` doesn't load.
2. **It hasn't been picked up yet.** Claude Code watches skill directories and loads new and edited skills mid-session. If a new one doesn't show, run `/reload-skills` before reaching for a restart.
3. **The command isn't what you think.** In Claude Code the frontmatter `name` is optional: it defaults to the folder name, and when you set it, `name` becomes the command the menu shows. A folder `deploy-staging` with `name: deploy` appears as `/deploy`.
4. **Claude Code refused the name.** Folder names and `name` values containing `<` or `>`, two spaces in a row, a leading or trailing space, or invisible and control characters are rejected. Start with `claude --debug` and search the debug log for `[names]` to see which one. Also avoid a folder called `synced`; that name is reserved for skills downloaded from claude.ai.
5. **It's namespaced.** Plugin skills appear as `/plugin-name:skill-name`. A nested monorepo skill whose folder name clashes with another skill appears as `/apps/web:deploy`, and a skill synced from your claude.ai account as `/anthropic-skills:name`. Check the full menu, not just the bare name.
6. **It lives below where you started.** Skills in a `.claude/skills/` directory under a subdirectory don't load at startup. They load the first time Claude reads or edits a file in that subdirectory; run `/add-dir` with the subdirectory's path to load them sooner.
7. **`user-invocable: false` is set.** Then it's hidden from the menu *by design* and only auto-invocation runs it.

One thing that is *not* on this list any more: broken YAML. A SKILL.md whose frontmatter doesn't parse still loads and `/name` still works. It just has no metadata, which shows up as the next symptom.

## Symptom 2: it never triggers on its own

The skill loads (you can run `/name`) but Claude never picks it up automatically. This is a **description problem** in nearly every case — the description is the only thing Claude sees before the skill fires:

- **The frontmatter didn't parse.** An unclosed quote, a tab, or a `---` that isn't the file's first line means Claude Code loads the body with empty metadata, so there is no description to match. Find these with:

  ```bash
  claude plugin validate .claude/skills      # project skills
  claude plugin validate ~/.claude/skills    # personal skills
  ```

  The command needs Claude Code v2.1.233 or later; on older versions run `claude --debug` and read the parse error.
- **It's written in implementation language.** "Handles VCS metadata normalization" matches nothing anyone types. Rewrite as the job plus the trigger: *"Generate clear commit messages from staged changes. Use when committing code."*
- **It lacks a "Use when…" clause.** Add one with the verbs users actually say; add `when_to_use` with example phrasings if the description alone isn't enough surface.
- **It's being truncated.** Each skill's `description` plus `when_to_use` is cut at 1,536 characters in the listing — if your trigger phrasing lives at the end of a long description, it may never be seen. Front-load it.
- **You have too many skills.** The whole listing gets a character budget of 1% of the model's context window. When it overflows, Claude Code keeps every skill name but drops descriptions, starting with the skills you invoke least. Run `/doctor` to see the listing's cost, then disable skills you don't use or raise the budget with the `skillListingBudgetFraction` setting.
- **A frontmatter field is blocking it.** `disable-model-invocation: true` forbids auto-triggering entirely, and `paths:` globs restrict activation to matching files inside the working directory — check both before rewriting anything.

Test in a **fresh session** each time: the session where you wrote the skill has the whole conversation biasing the routing. Asking "What skills are available?" confirms whether Claude can see the skill and its description at all.

## Symptom 3: it fires when it shouldn't

The opposite failure, same field. A description like "Helps with git" claims half of all sessions. Narrow it to the one job, name what it does *not* cover if a sibling skill owns the neighboring job, and for skills that should only ever run deliberately — deploys, anything destructive — set `disable-model-invocation: true` and invoke by `/name`. If you have many skills and can't tell which descriptions collide, run the [skill-auditor](/skills/workflow/skill-auditor) skill over the folder — overlap detection is exactly its job.

## Symptom 4: it fires, but does the wrong thing

Loading and triggering are fine; the **body** is the problem:

- **Steps are vague.** "Write good tests" isn't a procedure. Number the steps, name the commands.
- **No convention anchor.** Point at a canonical example in the repo ("match the format of the last five entries") so output lands in your house style.
- **No boundary.** Skills inherit the model's helpfulness; without a closing line like *"creating the file is the whole job — do not run the migration,"* scope creep is the default.
- **A bundled script fails.** Check the script is referenced by a path relative to the skill folder, runs from an arbitrary working directory, and — if you copied the skill from elsewhere — kept its executable bit.
- **It worked at first, then drifted.** The skill's content enters the conversation once and is not re-read on later turns, and after auto-compaction only the first 5,000 tokens of each invoked skill are re-attached. Put the most important rules at the top of SKILL.md, invoke the skill again after a compaction, and move anything that must hold every single time into a hook.

## Symptom 5: permission prompts interrupt the skill

The body uses tools that `allowed-tools` doesn't pre-approve. Two subtleties: the grant is scoped to the **turn that invoked the skill** and clears on your next message — recurring prompts across turns are expected behavior, not a bug — and scoped forms matter: `Bash(git diff:*)` approves exactly that command family, while a body that also runs `git push` will still prompt. List what the procedure actually runs, no more. (See the [reference](/guides/skills/skill-md-reference) for the field's exact semantics.)

## Symptom 6: it works in Claude Code but not elsewhere

- **claude.ai:** code execution must be enabled (Settings → Capabilities), and the ZIP you upload under Customize → Skills must contain the skill *folder* with SKILL.md inside. The upload is stricter than Claude Code: `name` must be lowercase letters, numbers and hyphens, 64 characters at most; `description` tops out at 1,024 characters; and any Claude Code-only field (`argument-hint`, `disable-model-invocation`, `paths` and the rest) fails with `Unexpected key(s) in SKILL.md frontmatter`. Only `name`, `description`, `license`, `compatibility`, `metadata` and `allowed-tools` are accepted. Sync runs one way: skills enabled on your claude.ai account load in Claude Code (v2.1.273 or later) when you sign in with the same account, but claude.ai never sees your filesystem skills.
- **Claude API:** the container has **no network access and no runtime package installs** — a skill that fetches URLs or pip-installs works locally and fails there. Requests also need the code execution tool in `tools` and can attach at most 20 skills. As of November 2026 the Skills API is out of beta and needs no beta header; the old `skills-2025-10-02` header still works but keeps returning the beta response shapes. Details in [Skills on claude.ai and the API](/guides/skills/claude-skills-on-claude-ai-and-api).
- **Agent SDK:** discovered skills are enabled by default, so check that a `skills` option isn't narrowing the list (`[]` disables them all), and if you pass an explicit `tools` list, include `"Skill"` in it. Pre-approve tools with either the skill's `allowed-tools` frontmatter or the SDK's `allowedTools` option (`allowed_tools` in Python); both are ignored when your organization sets `allowManagedPermissionRulesOnly`.

> [!TIP]
> When nothing above fits, minimize: copy the skill, strip the body to one trivial step, confirm the stub loads and triggers, then add the real body back in halves. Loading, triggering, and behavior are three separate layers — the stub isolates which one is broken.
