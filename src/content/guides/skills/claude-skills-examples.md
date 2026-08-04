---
title: "Claude Skills Examples: Annotated SKILL.md Files"
description: "Real SKILL.md examples you can copy — a minimal skill, a scoped-tools skill, a bundled-script skill — with the reasoning behind each line."
author: "AgentsCamp"
date: 2026-07-18
color: "cyan"
topics: ["workflow-prompting"]
tags: ["skills", "claude-code", "examples", "skill-md", "workflow"]
featured: false
seoTitle: "Claude Skills Examples: 5 Annotated SKILL.md Files"
seoDescription: "Five real Claude skill examples with annotations: a minimal SKILL.md, trigger-first descriptions, scoped tools, bundled scripts, and explicit boundaries."
summary: "Five working SKILL.md patterns, annotated: the minimal single-job skill (frontmatter plus a short runbook), the trigger-first description that decides when it fires, scoped allowed-tools for friction-free runs, a bundled script for deterministic steps, and an explicit boundary line that stops scope creep. Copy the shape, swap in your procedure."
keyTakeaways:
  - "Every skill is the same shape: a folder, a SKILL.md with name + description frontmatter, and a Markdown body Claude follows once the description matches the task."
  - "The description is the load-bearing line — write what it does plus when to use it, in the words people actually type."
  - "allowed-tools pre-approves the tools the procedure needs so the skill runs without permission prompts; it reduces friction, it isn't a sandbox."
  - "Push deterministic steps into a bundled script next to SKILL.md — ten lines of Python the skill runs beats prose the model interprets."
  - "End the body with an explicit boundary ('creating the file is the whole job') — it's the cheapest way to stop a skill from doing more than asked."
faq:
  - q: "What does a minimal Claude skill look like?"
    a: "A folder with one SKILL.md: YAML frontmatter carrying name and description, then a Markdown body with numbered steps. That's the whole format — no build step, no manifest, no registration. Save it under .claude/skills/<name>/ and it's live."
  - q: "Where do I find full, installable examples?"
    a: "Every skill page on AgentsCamp shows the complete SKILL.md with a copy button — the library has 90+ across git, testing, databases, security, and more. Anthropic's own examples live in the anthropics/skills repository on GitHub, including the document skills that ship with claude.ai."
  - q: "Why does my skill never trigger?"
    a: "Almost always the description. Claude sees only the name and description until the skill fires, so a description written in implementation language ('handles VCS metadata normalization') won't match how people ask ('write a commit message'). Front-load trigger phrasing: 'Use when committing changes or asked for a commit message.'"
  - q: "Can a skill include files besides SKILL.md?"
    a: "Yes — scripts, templates, and reference docs sit in the same folder and are referenced by relative path from the body. They load only when the instructions reach for them, so bundled files cost nothing until used. That's the progressive-disclosure design."
related: ["guide:what-are-claude-skills", "guide:writing-your-first-skill", "guide:claude-code-skills-best-practices", "guide:skill-md-reference", "guide:testing-and-debugging-skills", "skill:conventional-commits"]
---

The fastest way to learn the skill format is to read working ones. Below are five annotated patterns, from minimal to advanced — each is a real, runnable `SKILL.md` shape you can copy and refill with your own procedure. For the field-by-field spec, see the [SKILL.md reference](/guides/skills/skill-md-reference); for the concept itself, [What Are Claude Skills?](/guides/skills/what-are-claude-skills)

## Example 1: the minimal skill

One job, two frontmatter fields, a short runbook. This is the shape most skills should stay at:

```markdown
---
name: changelog-entry
description: Write a changelog entry for the current change. Use when the user asks to update the changelog, add a changelog entry, or notes a change worth recording.
---

Add one entry to CHANGELOG.md for the change in the working tree.

1. Run `git diff` (staged and unstaged) to see what actually changed.
2. Read the last five entries in CHANGELOG.md and match their format exactly —
   heading style, tense, and whether entries link to PRs.
3. Write one entry: what changed and why it matters to a user, not how.
4. Put it under the "Unreleased" heading; create that heading if missing.

Do not rewrite or reformat existing entries. Adding the new entry is the whole job.
```

What to notice: the description states the job *and* the trigger phrases ("update the changelog", "add a changelog entry"). The body reads like instructions to a competent new teammate — concrete steps, a convention anchor (match the last five entries), and a closing boundary.

## Example 2: the trigger-first description

The description is the only part of a skill Claude sees until it fires, which makes it the routing signal. The difference between a dead skill and a reliable one is usually this one line:

```yaml
# Never fires — implementation language, no trigger phrasing
description: Handles VCS metadata normalization for commit objects.

# Fires too often — claims every git task
description: Helps with git.

# Right — the job, then the trigger, in the user's words
description: Generate clear Conventional Commits messages from staged changes.
  Use when committing code and you want a well-structured, consistent commit message.
```

The pattern: *what it does* in the first sentence, *"Use when…"* with the verbs people actually type in the second. Our [conventional-commits](/skills/git/conventional-commits) skill is a live example of this exact structure.

## Example 3: scoped tools

`allowed-tools` pre-approves the tools the procedure needs, so the skill runs without stopping at permission prompts:

```markdown
---
name: secret-scan
description: Scan the working tree and staged changes for committed secrets — API keys, tokens, private keys. Use before pushing or when asked to check for leaked credentials.
allowed-tools: "Read, Grep, Glob, Bash(git diff:*), Bash(git log:*)"
---

1. Grep tracked files for high-signal patterns: `AKIA`, `sk-`, `-----BEGIN`,
   `ghp_`, `xox`, and `password\s*=` outside test fixtures.
2. Check `git diff --staged` separately — a secret staged but not committed
   is the cheapest catch.
3. For each hit, report file, line, and the credential type. Do not print the
   secret value itself.
```

Two things to notice. The `Bash(git diff:*)` form scopes the pre-approval to specific commands rather than all of Bash. And this is friction reduction, not sandboxing — tools outside the list still work under your normal permission settings. A skill like [secret-scanner](/skills/security/secret-scanner) in the library takes this pattern further.

> [!NOTE]
> If a skill should only ever run when *you* invoke it by name — a deploy runbook, anything destructive — add `disable-model-invocation: true` so it never auto-fires, and trigger it with `/secret-scan` style invocation instead.

## Example 4: the bundled script

Anything deterministic — parsing, validation, format checks — belongs in a script next to the SKILL.md, not in prose the model re-interprets each run:

```text
.claude/skills/license-check/
├── SKILL.md
└── check_licenses.py
```

```markdown
---
name: license-check
description: Audit dependency licenses against the allowlist. Use when adding a dependency or asked to check license compliance.
---

1. Run `python check_licenses.py` from this skill's directory. It prints one
   line per dependency: name, license, ALLOW or FLAG.
2. For each FLAG line, look up the package and summarize the license risk in
   one sentence.
3. Report: flagged packages first, then the count of clean ones. Suggest an
   alternative package for anything copyleft.
```

The script does the crawling and matching identically every time; Claude does the part that needs judgment — explaining risk and suggesting alternatives. Bundled files also cost nothing until step 1 reaches for them: that's [progressive disclosure](/guides/skills/what-are-claude-skills) doing its job.

## Example 5: the explicit boundary

Skills inherit the model's helpfulness, which on a multi-step procedure turns into scope creep — the migration skill that also runs the migration. The fix is one line, stated as part of the job:

```markdown
---
name: db-migration
description: Write a safe expand-contract database migration for a schema change. Use when adding, renaming, or dropping columns on a live table.
---

1. Identify the change and its blast radius: which queries read the old shape?
2. Write the expand step (new column/table, nullable, no backfill yet).
3. Write the batched backfill as a separate migration.
4. Write the contract step last, gated on a comment: "run only after deploy X".

Do NOT run any migration. Writing the files is the whole job — running them is
a human decision with its own review step.
```

The boundary line does two things: it stops the skill at the right edge, and it tells the *next reader* of the skill where the edge deliberately is. Compare [migration-writer](/skills/database/migration-writer) in the library, which pairs this with the full expand-contract procedure.

## Where to find more

- **The AgentsCamp library** — 90+ installable skills across [twelve categories](/skills); every page shows the full SKILL.md. Start with the [best-of list](/guides/skills/best-claude-skills-2026).
- **anthropics/skills on GitHub** — Anthropic's official examples, including the document skills (`docx`, `xlsx`, `pptx`, `pdf`) that also run on claude.ai and the API.
- **Your own transcripts** — the third time you type the same multi-step instructions, that's a skill. [Write it](/guides/skills/writing-your-first-skill), or run the [/create-skill](/commands/workflow/create-skill) command and let Claude scaffold it.
