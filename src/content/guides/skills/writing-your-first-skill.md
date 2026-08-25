---
title: "Writing Your First Skill"
description: "A step-by-step guide to packaging a reusable procedure as a Claude Code skill that loads exactly when it's needed."
author: "AgentsCamp"
date: 2026-06-03
updated: 2026-08-25
depth: cornerstone
color: "green"
topics: ["workflow-prompting"]
featured: true
related: ["guide:what-are-claude-skills", "guide:skill-md-reference", "guide:writing-a-custom-agent", "guide:skills-vs-agents-vs-commands", "skill:test-scaffolder", "guide:claude-code-plugins"]
summary: "A skill is a folder with a SKILL.md — frontmatter whose description decides when it fires, plus a runbook body. Progressive disclosure makes skills cheap: only name and description load at session start, the body loads when the task matches, and bundled files only when reached for. One job per skill, a trigger-first description, and deterministic work pushed into bundled scripts."
keyTakeaways:
  - "The description is the routing signal and usually the only part of your skill Claude ever sees — write what it does plus when to use it, in the words people actually say."
  - "Progressive disclosure is what makes skills cheap: roughly 100 tokens per installed skill at startup, the body only once triggered, bundled files only when read."
  - "Pre-approving tools with allowed-tools is friction reduction scoped to a single turn, not a sandbox — the grant clears when you send your next message, and disallowed-tools is what actually removes a tool."
  - "Push deterministic work into a bundled script: the script's code never enters context, only its output, which makes it both cheaper and more reliable than prose the model interprets."
  - "One job per skill. An '…and it can also…' branch is a second skill, and narrow skills trigger more reliably than broad ones."
  - "Skills are executable instructions from whoever wrote them — audit a third-party SKILL.md and everything bundled beside it before installing."
sources:
  - title: "Extend Claude with skills"
    url: "https://code.claude.com/docs/en/skills"
    publisher: "Anthropic"
  - title: "Agent Skills overview"
    url: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview"
    publisher: "Anthropic"
  - title: "Skill authoring best practices"
    url: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices"
    publisher: "Anthropic"
  - title: "Equipping agents for the real world with Agent Skills"
    url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills"
    publisher: "Anthropic"
  - title: "Agent Skills open standard"
    url: "https://agentskills.io"
    publisher: "Agent Skills"
howtoSteps:
  - name: "Pick one repeatable procedure"
    text: "Skills earn their keep through repetition — if you've typed roughly the same multi-step instructions three times, that's a skill. One job per skill: an '…and it can also…' branch is a second skill."
  - name: "Create the folder and SKILL.md"
    text: "Project skills live in .claude/skills/<name>/SKILL.md, personal ones in ~/.claude/skills/<name>/. The directory name becomes the /command; the file is YAML frontmatter plus a Markdown body."
  - name: "Write a trigger-first description"
    text: "The description is the only thing loaded until the skill fires — write what it does plus when to use it, using the verbs people actually say ('Use when the user asks to create, add, or generate a component'). Too vague never triggers; too broad loads on everything."
  - name: "Scope tools, paths, and invocation"
    text: "allowed-tools pre-approves tools for the invoking turn so the skill runs friction-free — it's about prompts, not sandboxing (use disallowed-tools to actually remove a tool). Add paths to limit a skill to the files it belongs to, and disable-model-invocation: true if it should only ever fire when you type its /name."
  - name: "Write the body as a runbook"
    text: "Concrete numbered steps, a pointer to a canonical example in the repo to anchor style, and an explicit boundary ('Do not run the migration — creating the file is the whole job'). Cut anything the model already knows."
  - name: "Bundle scripts for deterministic work"
    text: "Drop scripts, templates, and reference docs next to SKILL.md and reference them by relative path — they load only when the instructions reach for them, and a script's code never enters context at all. Ten lines of Python the skill runs beats prose the model interprets."
  - name: "Install it and watch it fire"
    text: "Skill directories are watched live, so a new SKILL.md takes effect in the current session. Phrase a request the way a real user would and check that it triggers — if it doesn't, the description is the first thing to fix."
faq:
  - q: "What is a Claude Code skill?"
    a: "A reusable procedure packaged as a folder with a SKILL.md file — frontmatter that controls when it activates, plus a body of instructions Claude follows once it loads. Skills sit dormant until the task matches their description, which makes them the right home for 'the way we do X here' recipes without bloating CLAUDE.md."
  - q: "Do installed skills eat my context window?"
    a: "Barely — that's the point of progressive disclosure. At session start Claude reads only each skill's name and description, which Anthropic's documentation puts at roughly 100 tokens per skill; the full body (targeted at under 5k tokens) loads only when the description matches the task, and bundled files later still, when the instructions reference them. Twenty installed skills cost almost nothing until one is relevant."
  - q: "Why doesn't my skill trigger?"
    a: "The description — it's the routing signal and the only field Claude sees most of the time. Front-load it with trigger phrasing that matches how people actually ask ('Use when cutting a release or asked for release notes'), not implementation language. Put the key use case first, too: Claude Code truncates the combined description and when_to_use text at 1,536 characters in the skill listing, so a buried trigger can be cut off entirely. If it fires too often instead, the description is too broad."
  - q: "What does allowed-tools do in a skill?"
    a: "It pre-approves listed tools so Claude can use them without per-call permission prompts during the turn that invokes the skill, and the grant clears when you send your next message. It's friction reduction, not a sandbox — every other tool remains callable under your normal permission settings. To genuinely remove a tool from a skill's reach, use disallowed-tools."
  - q: "Do I need to restart Claude Code after adding a skill?"
    a: "Usually not — Claude Code watches skill directories for changes, so adding or editing a SKILL.md under ~/.claude/skills/ or a project's .claude/skills/ takes effect in the current session. The one exception: if the top-level skills directory itself didn't exist when the session started, restart once so it can be watched."
  - q: "Is a skill different from a slash command?"
    a: "They've converged. Custom commands were merged into skills, so .claude/commands/deploy.md and .claude/skills/deploy/SKILL.md both give you /deploy and behave the same way; existing command files keep working. Skills add what a flat file can't: a directory for supporting scripts and references, frontmatter controlling whether you or Claude invokes it, and automatic loading when the task matches."
  - q: "Can a skill run in its own context window?"
    a: "Yes — set context: fork and the skill runs in a forked subagent context instead of your main one, so a research-heavy or file-scanning procedure burns tokens in the subagent's window and returns only its result. Pair it with agent to choose the subagent type, and background: false when you want the result in the same turn rather than in the background."
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
> Custom commands have been merged into skills. A file at `.claude/commands/deploy.md` and a skill at `.claude/skills/deploy/SKILL.md` both create `/deploy` and work the same way, and existing command files keep working. What a skill adds is a directory for supporting files, frontmatter controlling whether you or Claude invokes it, and automatic loading when the task matches. A **subagent** (`.claude/agents/`) is still a different thing — a delegate Claude calls in its own context window. See [Skills vs Agents vs Commands](/guides/skills/skills-vs-agents-vs-commands) for the full decision tree.

## How progressive disclosure works

This is the idea that makes skills worth using, so it's worth understanding before you write one.

Claude does not load every skill's body into context up front. At the start of a session it reads only the `name` and `description` of each installed skill — Anthropic's documentation puts this at roughly 100 tokens per skill. The full body stays on disk. When the user's request matches a skill's description, Claude reads *that* skill's `SKILL.md` from the filesystem, and only then. Bundled files (scripts, templates, reference docs) load later still, when the instructions actually reach for them.

| Stage | What's loaded | Token cost | When |
|-------|---------------|------------|------|
| Session start | `name` + `description` only | ~100 tokens per skill | Always |
| Skill triggered | The `SKILL.md` body | Target under 5k tokens | When the description matches the task |
| Resource used | A bundled script or file | None until accessed | When the body references it |

The third row hides the most useful detail. When Claude *reads* a bundled reference file, its contents enter context. When Claude *runs* a bundled script, the script's code never enters context at all — only its output does. That asymmetry is why a 300-line helper script is effectively free, and why deterministic work belongs in code rather than prose.

This is also why you can install twenty skills without drowning your context window, and why the `description` carries so much weight — it's the only thing Claude sees most of the time, and it's the sole signal for whether the rest ever loads.

## Step 1: Pick one repeatable procedure

The best skills capture a task you do the same way every time and would rather not re-explain. "Generate a release changelog." "Scaffold a new React component with its test and story." "Convert a Figma export into our token format." Each has stable steps and a clear trigger.

Skip the skill if the task is a one-off, or if it's so simple a single sentence in your prompt covers it. Skills earn their keep through repetition. A quick test: if you've typed roughly the same multi-step instructions into Claude three times, that's a skill. Another good signal is a section of `CLAUDE.md` that has quietly grown from a fact into a procedure — that content is paying full context cost on every single session, and it belongs in a skill that loads only when it's relevant.

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

Order matters as much as wording. Claude Code truncates the combined `description` and `when_to_use` text at 1,536 characters in the skill listing to keep context usage down, so put the key use case first and let the elaboration trail. If you want to keep the description itself short, the optional `when_to_use` field is the place for extra trigger phrases and example requests — it's appended to the description in the listing and counts toward the same cap. Skills destined for claude.ai or the Skills API face a tighter limit: the Agent Skills spec caps `description` at 1,024 characters and `name` at 64 lowercase-alphanumeric-and-hyphen characters.

> [!TIP]
> Front-load the description with the trigger, not the implementation. Claude is matching the user's phrasing against your words, so "Use when migrating a database schema" fires more reliably than "Employs a multi-phase reconciliation strategy for schema evolution." Save the mechanics for the body.

> [!WARNING]
> An over-eager description is a real cost. "Helps with code" will load on nearly every request and waste the budget you saved by using a skill at all. Make the description specific enough that it stays quiet when the task isn't yours.

## Step 3: Scope tools, paths, and invocation

Several optional frontmatter fields tune how and when the skill runs:

- **`allowed-tools`** — pre-approves a list of tools so Claude can invoke them without a permission prompt during the turn that invokes the skill. The grant clears when you send your next message. It does *not* sandbox anything: every other tool remains callable under your normal permission settings. Use it to make a frequently-run skill frictionless.
- **`disallowed-tools`** — removes tools from Claude's available pool while the skill is active, clearing on your next message. This is the field that actually keeps a tool out of reach — useful for an autonomous skill that should never stop to ask a question mid-loop.
- **`paths`** — glob patterns that limit when the skill activates at all. With `paths` set, Claude loads the skill automatically only when working with matching files, which is the cleanest fix for a skill that keeps firing in the wrong half of a monorepo.
- **`disable-model-invocation`** — set to `true` so only you can invoke the skill by typing `/name`. Use it for anything with side effects or timing you want to own, like `/deploy` or `/send-slack-message`. You don't want Claude deciding to deploy because the code looks ready.
- **`user-invocable`** — set to `false` when only Claude should invoke the skill. Use it for background knowledge that isn't a meaningful action for a user to take: a `legacy-system-context` skill explaining how an old system works should inform Claude when relevant, but `/legacy-system-context` isn't a command anyone wants to run.

```yaml
---
name: dependency-audit
description: Audits dependencies for known vulnerabilities and reports findings. Use when reviewing dependencies or before a release.
allowed-tools: Read, Grep, Glob, Bash
paths: ["package.json", "**/requirements.txt"]
---
```

Pre-approve only the tools the procedure runs often enough that a prompt each time would be annoying — pre-approval is about friction, not safety, so there's no harm in keeping the list short.

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

When a single Markdown page isn't enough, a skill folder can hold more than `SKILL.md`. Drop scripts, templates, schemas, or reference docs alongside it, and reference them from the body by relative path. These files follow the same progressive-disclosure rule — they load only when the instructions reach for them.

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
> Push deterministic work into a bundled script rather than asking the model to do it by hand. Parsing git output, transforming JSON, or validating a format is more reliable as ten lines of Python the skill *runs* than as prose the model *interprets* — and because a script's code never enters the context window, only its output does, it's cheaper too.

There's one wrinkle worth knowing when a skill runs its own bundled script: the path is only stable if you don't hardcode it. Claude Code substitutes `${CLAUDE_SKILL_DIR}` in both the skill's Markdown body and the Bash rules inside `allowed-tools`, so using the same variable in both places lets a bundled script run without a permission prompt no matter where the skill is installed:

```yaml
---
name: render-chart
description: Renders a metrics chart from a CSV. Use when asked to chart or visualize metrics data.
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/render.sh *)
---

Run `${CLAUDE_SKILL_DIR}/scripts/render.sh <csv-path>` to produce the chart.
```

Because the `allowed-tools` rule expands to exactly the command the body tells Claude to run, the two always match. For larger skills, split reference material into separate Markdown files (`reference.md`, `examples.md`) and link to them from `SKILL.md`: keep the entry point lean and let Claude pull deeper files only when a step needs them.

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

## Running a skill in its own context

Some procedures are expensive to *think* about even when the answer is short. A skill that scans forty files to find every call site, or reads a long changelog to summarize it, will fill your main context with material you don't need after the answer arrives.

Setting `context: fork` runs the skill in a forked subagent context instead of your main one. The exploration burns tokens in the subagent's window, and only the result comes back:

```yaml
---
name: find-callers
description: Finds every call site of a symbol and summarizes how it's used. Use when asked who calls or uses a function.
context: fork
background: false
---
```

Two companions matter here. `agent` picks which subagent type the fork uses, so you can route the work to a specialist rather than a general-purpose delegate. `background` defaults to `true`, meaning the fork runs in the background; set it to `false`, as above, when you want the result inside the turn that invoked the skill. Reach for `fork` when a skill's *research* is large but its *answer* is small — and leave it off for skills that edit files in your working tree, where you want the work happening in the context you're watching.

## Keeping a skill portable

Claude Code accepts every field described above, but most of them are Claude Code extensions rather than part of the cross-tool standard. Skills follow the [Agent Skills](https://agentskills.io) open standard, whose spec defines six fields: `name`, `description`, `license`, `compatibility`, `metadata`, and `allowed-tools`. Those are the only ones that survive a trip through claude.ai skill uploads or the Skills API — anything else triggers an unexpected-key validation error on those paths.

The practical rule: if a skill is for your repo or your machine, use whatever fields help. If you intend to publish it or run it on more than one surface, restrict the frontmatter to the spec's six fields, which Claude Code also accepts without changes. [The Agent Skills open standard](/guides/skills/agent-skills-open-standard) covers the portability rules in full, and [packaging and sharing skills](/guides/skills/packaging-and-sharing-skills) covers distribution.

## Before you install someone else's skill

A skill is executable instruction written by whoever authored it, and Anthropic's own guidance is blunt about the implication: use skills only from sources you trust — ones you wrote, or obtained from a source you'd extend the same trust you extend to installing software.

The audit is not just `SKILL.md`. Read everything bundled beside it — scripts, templates, reference files — and look for operations that don't match the stated purpose: unexpected network calls, file access outside the working area, credential reads. Skills that fetch data from external URLs deserve extra scrutiny, because fetched content can carry instructions of its own, and a dependency that's trustworthy today can change tomorrow. The blast radius of a malicious skill is whatever access Claude has when it runs, which is why `disallowed-tools` and narrow `paths` are worth setting on anything you didn't write yourself.

## Troubleshooting: why a skill doesn't fire

Almost every "my skill doesn't work" report resolves to one of four causes, and they're distinguishable by symptom:

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Never triggers | Description lacks the phrasing users actually use | Rewrite trigger-first, with real verbs and nouns |
| Triggers on everything | Description too broad | Narrow it, or add `paths` to scope activation |
| Triggers, wrong behavior | Body too long or vague | Cut to numbered steps, add an explicit boundary |
| Not listed at all | Skills directory created after session start | Restart once so the directory is watched |

Start with the description in the first three cases — it's the lever that controls everything downstream, and the trigger buried past 1,536 characters is a surprisingly common culprit. For a systematic approach, see [testing and debugging skills](/guides/skills/testing-and-debugging-skills).

## Putting it together

Start small and iterate. The best skills grow the way the best subagents do: a sharp description written in the user's words, the minimum tools, a body that reads like a runbook with an explicit boundary, and bundled scripts for anything deterministic. Add `paths` when a skill's territory is a subset of the repo, `context: fork` when the research is heavier than the answer, and spec-only frontmatter when the skill is meant to travel.

For the delegate-shaped counterpart to this pattern, see [Writing Your First Custom Agent](/guides/getting-started/writing-a-custom-agent).
