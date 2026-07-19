---
title: "Writing Your First Skill"
description: "A step-by-step guide to packaging a reusable procedure as a Claude Code skill that loads exactly when it's needed."
author: "AgentsCamp"
date: 2026-06-03
color: "green"
topics: ["workflow-prompting"]
featured: true
related: ["what-are-claude-skills", "skill-md-reference", "writing-a-custom-agent", "skills-vs-agents-vs-commands", "test-scaffolder", "claude-code-plugins"]
summary: "A skill is a folder with a SKILL.md — frontmatter whose description decides when it fires, plus a runbook body. Progressive disclosure makes skills cheap: only name and description load at session start, the body loads when the task matches, and bundled files only when reached for. One job per skill, a trigger-first description, and deterministic work pushed into bundled scripts."
howtoSteps:
  - name: "Pick one repeatable procedure"
    text: "Skills earn their keep through repetition — if you've typed roughly the same multi-step instructions three times, that's a skill. One job per skill: an '…and it can also…' branch is a second skill."
  - name: "Create the folder and SKILL.md"
    text: "Project skills live in .claude/skills/<name>/SKILL.md, personal ones in ~/.claude/skills/<name>/. The directory name becomes the /command; the file is YAML frontmatter plus a Markdown body."
  - name: "Write a trigger-first description"
    text: "The description is the only thing loaded until the skill fires — write what it does plus when to use it, using the verbs people actually say ('Use when the user asks to create, add, or generate a component'). Too vague never triggers; too broad loads on everything."
  - name: "Scope tools and invocation"
    text: "allowed-tools pre-approves tools so the skill runs friction-free — it's about prompts, not sandboxing (use disallowed-tools to actually block). Add disable-model-invocation: true if the skill should only ever fire when you type its /name."
  - name: "Write the body as a runbook"
    text: "Concrete numbered steps, a pointer to a canonical example in the repo to anchor style, and an explicit boundary ('Do not run the migration — creating the file is the whole job'). Cut anything the model already knows."
  - name: "Bundle scripts for deterministic work"
    text: "Drop scripts, templates, and reference docs next to SKILL.md and reference them by relative path — they load only when the instructions reach for them. Ten lines of Python the skill runs beats prose the model interprets."
faq:
  - q: "What is a Claude Code skill?"
    a: "A reusable procedure packaged as a folder with a SKILL.md file — frontmatter that controls when it activates, plus a body of instructions Claude follows once it loads. Skills sit dormant until the task matches their description, which makes them the right home for 'the way we do X here' recipes without bloating CLAUDE.md."
  - q: "Do installed skills eat my context window?"
    a: "Barely — that's the point of progressive disclosure. At session start Claude reads only each skill's name and description (a few dozen tokens apiece); a skill's full body loads only when its description matches the task, and bundled files later still, when the instructions reference them. Twenty installed skills cost almost nothing until one is relevant."
  - q: "Why doesn't my skill trigger?"
    a: "The description — it's the routing signal and the only field Claude sees most of the time. Front-load it with trigger phrasing that matches how people actually ask ('Use when cutting a release or asked for release notes'), not implementation language. If it fires too often instead, the description is too broad."
  - q: "What does allowed-tools do in a skill?"
    a: "It pre-approves listed tools so Claude can use them without per-call permission prompts while the skill is active — friction reduction, not a sandbox. Every other tool remains callable under your normal permission settings; to genuinely keep a tool out of a skill's reach, use disallowed-tools."
  - q: "Do I need to restart Claude Code after adding a skill?"
    a: "Usually not — skill directories are watched live, so adding or editing a SKILL.md takes effect in the current session. The one exception: if the top-level skills directory itself didn't exist when the session started, restart once so it can be watched."
---

A skill is the cheapest way to give Claude Code a capability it doesn't already have — a recurring procedure, a house convention, a multi-step workflow — without bloating your context or your `CLAUDE.md`. Done well, a skill sits dormant until the moment its task comes up, then loads its instructions, runs the work, and gets out of the way. Done poorly, it either never triggers or it loads on every unrelated request and burns context you needed elsewhere.

This guide walks through authoring your first one: where it lives, the frontmatter that controls when it fires, the progressive-disclosure model that makes skills cheap, and how to bundle scripts and extra files when one Markdown page isn't enough.

## What a SKILL.md actually is

A skill is a folder containing a `SKILL.md` file. Project skills live in `.claude/skills/<name>/` at your repo root; personal skills live in `~/.claude/skills/<name>/` and follow you across every project. The `name` field is optional — it sets the display label in skill listings and defaults to the directory name. The command you invoke (`/<folder>`) always comes from the directory name, not from this field. The file has YAML frontmatter plus a Markdown body that becomes the skill's instructions.

```markdown
---
name: changelog-writer
description: Generates a release changelog from git history. Use when cutting a release or when the user asks for release notes.
---

# Changelog Writer

When asked to produce a changelog:

1. Run `git log <last-tag>..HEAD --oneline` to get the commits since the last tag.
2. Group commits into Added / Changed / Fixed / Removed by reading the message.
3. Write the result to `CHANGELOG.md` under a new `## [version] - date` heading,
   following Keep a Changelog format.
```

That's the whole format. A folder, a `SKILL.md`, a couple of key frontmatter fields, and a body. Every frontmatter field is technically optional — only `description` is genuinely recommended, since it's what decides when the skill fires. Everything below is about filling them in so the skill fires at the right time and does its job.

> [!NOTE]
> Don't confuse skills with the other two extension points. A **subagent** (`.claude/agents/`) is a delegate Claude calls in its own context window. A **slash command** (`.claude/commands/`) is a prompt *you* trigger by name. A **skill** is a procedure Claude pulls in on its own when the task matches — no separate context, no manual trigger. See [Skills vs Agents vs Commands](/guides/skills/skills-vs-agents-vs-commands) for the full decision tree.

## How progressive disclosure works

This is the idea that makes skills worth using, so it's worth understanding before you write one.

Claude does not load every skill's body into context up front. At the start of a session it reads only the `name` and `description` of each installed skill — a few dozen tokens apiece. The full body stays on disk. When the user's request matches a skill's description, Claude loads *that* skill's body, and only then. Bundled files (scripts, templates, reference docs) load later still, when the instructions actually reach for them.

So a skill costs almost nothing until it's relevant:

| Stage | What's loaded | When |
|-------|---------------|------|
| Session start | `name` + `description` only | Always |
| Skill triggered | The `SKILL.md` body | When the description matches the task |
| Resource used | A bundled script or file | When the body references it |

This is why you can install twenty skills without drowning your context window. It's also why the `description` carries so much weight — it's the only thing Claude sees most of the time, and it's the sole signal for whether the rest ever loads.

## Step 1: Pick one repeatable procedure

The best skills capture a task you do the same way every time and would rather not re-explain. "Generate a release changelog." "Scaffold a new React component with its test and story." "Convert a Figma export into our token format." Each has stable steps and a clear trigger.

Skip the skill if the task is a one-off, or if it's so simple a single sentence in your prompt covers it. Skills earn their keep through repetition. A quick test: if you've typed roughly the same multi-step instructions into Claude three times, that's a skill.

As with subagents, keep the scope to one job. If your skill body sprouts an "...and it can also..." branch, that's a second skill. Narrow skills trigger more reliably and stay easier to keep accurate.

## Step 2: Write a description that triggers at the right time

The `description` is not documentation — it's the routing signal, and the only field loaded until the skill fires. A vague description means the skill never triggers; an over-broad one means it loads on requests it has no business handling.

Write it as *what the skill does* plus *when to use it*, and name the concrete situations that should activate it:

```yaml
description: >
  Scaffolds a new React component with a colocated test and Storybook
  story following the repo's conventions. Use when the user asks to
  create, add, or generate a new component.
```

The trigger words — "create, add, or generate a new component" — are what Claude pattern-matches against the real request. Use the verbs and nouns people actually say.

> [!TIP]
> Front-load the description with the trigger, not the implementation. Claude is matching the user's phrasing against your words, so "Use when migrating a database schema" fires more reliably than "Employs a multi-phase reconciliation strategy for schema evolution." Save the mechanics for the body.

> [!WARNING]
> An over-eager description is a real cost. "Helps with code" will load on nearly every request and waste the budget you saved by using a skill at all. Make the description specific enough that it stays quiet when the task isn't yours.

## Step 3: Scope tools and invocation (optional)

Two optional frontmatter fields tune how the skill runs:

- **`allowed-tools`** — pre-approves a comma-separated list of tools so Claude can invoke them without a per-use permission prompt while the skill is active. It does *not* sandbox the skill: every other tool remains callable under your normal permission settings. Use it to make a frequently-run skill frictionless (e.g. one that calls `git`). To actually block tools from a skill, use `disallowed-tools`.
- **`user-invocable`** — skills are user-invocable by default (you can type `/<name>` to invoke them directly). Set it to `false` to hide a skill from the `/` menu when it holds background knowledge you don't want users triggering as a command. To stop Claude from auto-loading a skill while keeping it user-only, use `disable-model-invocation: true` instead.

```yaml
---
name: dependency-audit
description: Audits dependencies for known vulnerabilities and reports findings. Use when reviewing dependencies or before a release.
allowed-tools: Read, Grep, Glob, Bash
disable-model-invocation: false
---
```

Pre-approve only the tools the procedure runs often enough that a prompt each time would be annoying — pre-approval is about friction, not safety, so there's no harm in keeping the list short. When you genuinely need to keep a tool out of a skill's reach, that's what `disallowed-tools` is for.

## Step 4: Write a tight, instructional body

The body is the procedure Claude follows once the skill loads. Treat it like a runbook, not an essay. The same rule that governs subagent prompts applies here: long bodies dilute attention, accumulate quiet contradictions, and rot because nobody re-reads them.

Structure it as concrete steps:

```markdown
# New Component

When asked to create a component named `<Name>`:

1. Create `src/components/<Name>/<Name>.tsx` with a typed props interface
   and a named export.
2. Create `src/components/<Name>/<Name>.test.tsx` with a render smoke test.
3. Create `src/components/<Name>/index.ts` re-exporting the component.
4. Match the existing component style — check `src/components/Button/` for
   the canonical pattern before writing.

Do not add the component to any barrel file unless asked.
```

Notice the last two lines: point at a canonical example to anchor the style, and state the boundary so the skill doesn't overreach. Leave out generic advice the model already has. Spend the body only on what's specific to *this* procedure.

## Step 5: Bundle resources and scripts

When a single Markdown page isn't enough, a skill folder can hold more than `SKILL.md`. Drop scripts, templates, schemas, or reference docs alongside it, and reference them from the body by relative path. These files follow the same progressive-disclosure rule — they load only when the instructions reach for them, so a 300-line helper script costs nothing until it runs.

```
~/.claude/skills/changelog-writer/
├── SKILL.md
├── format.py          # deterministic formatter the body calls
└── template.md        # the changelog skeleton to fill in
```

Reference them plainly in the body so Claude knows they exist and how to use them:

```markdown
Run `python format.py <last-tag>` to produce the grouped commit list,
then fill `template.md` with the result.
```

> [!TIP]
> Push deterministic work into a bundled script rather than asking the model to do it by hand. Parsing git output, transforming JSON, or validating a format is more reliable as ten lines of Python the skill *runs* than as prose the model *interprets* — and it keeps the body short.

For larger skills, you can split reference material into separate Markdown files (`reference.md`, `examples.md`) and link to them from `SKILL.md`. This is the multi-file pattern: keep the entry point lean and let Claude pull deeper files only when a step needs them.

## A worked example

Here's a complete, installable skill that scaffolds a database migration following a house format. Save it as `~/.claude/skills/new-migration/SKILL.md`:

```markdown
---
name: new-migration
description: Creates a timestamped, reversible database migration following the repo's conventions. Use when adding, creating, or generating a migration.
allowed-tools: Read, Grep, Glob, Write, Bash
---

# New Migration

When asked to create a migration for `<change>`:

1. Generate the filename: `migrations/<UTC-timestamp>_<snake_case_change>.sql`.
   Get the timestamp with `date -u +%Y%m%d%H%M%S`.
2. Read the two most recent files in `migrations/` to match the house style
   (transaction wrapping, comment header, naming).
3. Write the migration with a clearly labeled `-- Up` and `-- Down` section.
   Every Up must have a corresponding Down; never write an irreversible
   migration without flagging it explicitly.
4. Print the path you created and a one-line summary of what it does.

Do not run the migration. Creating the file is the whole job.
```

Drop that folder in place and ask: "add a migration that adds a `last_login` column to users." The description matches "add a migration," the body loads, and Claude produces a correctly named, reversible file in your format — without you re-explaining the convention.

> [!NOTE]
> Claude Code watches skill directories live — adding or editing a `SKILL.md` under `~/.claude/skills/` or a project's `.claude/skills/` takes effect in the current session without restarting. The one exception: if you create a top-level skills directory that didn't exist when the session started, restart so it can be watched.

## Putting it together

If your skill never fires, the `description` is the first thing to fix — it's the lever that controls everything downstream. If it fires too often, the description is too broad. If it fires but does the wrong thing, the body is too long or too vague.

Start small and iterate. The best skills grow the way the best subagents do: a sharp description, the minimum tools, a body that reads like a runbook, and bundled scripts for anything deterministic. For the delegate-shaped counterpart to this pattern, see [Writing Your First Custom Agent](/guides/getting-started/writing-a-custom-agent).
