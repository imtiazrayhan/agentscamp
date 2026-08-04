---
title: "The SKILL.md Reference: Every Frontmatter Field Explained"
description: "A complete reference for the SKILL.md format — all frontmatter fields, naming rules, argument substitution, limits, and where skill files live."
author: "AgentsCamp"
date: 2026-07-18
color: "purple"
topics: ["workflow-prompting"]
tags: ["skills", "skill-md", "claude-code", "reference", "frontmatter"]
featured: false
seoTitle: "SKILL.md Reference: Every Claude Skill Field Explained"
seoDescription: "The complete SKILL.md frontmatter reference: name, description, allowed-tools, context: fork, paths, arguments, and every other field — with limits."
keywords: ["SKILL.md", "claude skills frontmatter", "skill.md format", "agent skills spec", "claude skills reference"]
summary: "A SKILL.md is YAML frontmatter plus a Markdown body. Only name and description are required, but the full field set is larger than most posts document: triggering controls (when_to_use, paths, disable-model-invocation), execution controls (allowed-tools, model, effort, context: fork), argument plumbing, and distribution metadata from the open Agent Skills spec."
keyTakeaways:
  - "Two fields are required: name (max 64 chars, lowercase-numbers-hyphens, matching the folder name) and description (the routing signal, max ~1,024 chars)."
  - "Triggering is tunable: when_to_use adds trigger context, paths restricts auto-activation to matching files, disable-model-invocation makes a skill manual-only, user-invocable: false hides it from the / menu."
  - "allowed-tools and disallowed-tools apply only for the turn that invokes the skill and clear on the next user message — they reduce prompts, they don't sandbox."
  - "context: fork runs the skill in an isolated subagent (pick which with agent:), and model/effort can override the session's settings for that skill alone."
  - "Skills take arguments — $ARGUMENTS, positional $0/$1, or named variables declared in an arguments field, with argument-hint for autocomplete."
  - "There is no version field in the spec — versioning lives at the distribution layer (plugins, the /v1/skills API)."
faq:
  - q: "Which SKILL.md fields are required?"
    a: "Only name and description. name must be lowercase letters, numbers, and hyphens (max 64 characters) and match the parent directory; description tells Claude what the skill does and when to use it. Everything else is optional tuning."
  - q: "How long can a skill description be?"
    a: "The spec caps description at 1,024 characters, and Claude Code budgets about 1,536 characters for the combined description plus when_to_use shown in the skill listing — anything longer is truncated. In practice the best descriptions are two sentences: the job, then the trigger."
  - q: "Does allowed-tools make a skill safe?"
    a: "No — it's the opposite direction. allowed-tools pre-approves tools so the skill runs without permission prompts during the turn that invoked it; the grant clears on your next message. To restrict, use disallowed-tools, which removes tools from the pool while the skill is active."
  - q: "Can a skill run in its own context window?"
    a: "Yes — context: fork executes the skill in an isolated subagent instead of the main conversation, and agent: picks which subagent type runs it (Explore, Plan, general-purpose, or one of your custom agents). Use it for skills that do heavy reading you don't want polluting the main context."
  - q: "Is there a version field?"
    a: "No. Some older examples carry one, but it isn't part of the Agent Skills spec — clients ignore unknown fields. Version your skills at the distribution layer instead: plugin releases, git tags, or version IDs on the Claude API's /v1/skills endpoint."
  - q: "Do these fields work outside Claude Code?"
    a: "The core (name, description, license, metadata, compatibility) is the open agentskills.io standard that 40+ tools read. Execution fields like allowed-tools, context, model, and hooks are Claude Code behaviors — other tools, including the Claude Agent SDK, may ignore them."
related: ["guide:what-are-claude-skills", "guide:writing-your-first-skill", "guide:claude-skills-examples", "guide:claude-code-skills-best-practices", "guide:testing-and-debugging-skills", "skill:hook-writer"]
---

Most write-ups of the SKILL.md format stop at `name`, `description`, and `allowed-tools`. The actual field set is roughly twice that size. This is the field-by-field reference, current as of July 2026, drawn from the Claude Code docs and the open Agent Skills specification (agentskills.io). If you're new to skills, start with [What Are Claude Skills?](/guides/skills/what-are-claude-skills) — this page assumes you know why you're writing one.

## The file

```text
.claude/skills/<name>/
├── SKILL.md          # required
├── scripts/          # optional, loaded only when referenced
└── references/       # optional, same
```

`SKILL.md` is YAML frontmatter between `---` fences, then a Markdown body. The body is the procedure; the frontmatter is everything below.

## Required fields

| Field | Rules |
|---|---|
| `name` | Max 64 chars. Lowercase letters, numbers, hyphens only. Must match the parent directory name — the directory is what defines the `/name` invocation. |
| `description` | What the skill does **and** when to use it. Spec cap: 1,024 chars. This is the only text Claude sees until the skill fires, so it carries the entire triggering decision. |

```yaml
---
name: release-notes
description: Draft user-facing release notes from merged PRs since the last tag.
  Use when cutting a release or asked to write release notes or a changelog.
---
```

## Triggering fields

These control *when* the skill activates:

| Field | Default | What it does |
|---|---|---|
| `when_to_use` | — | Extra trigger context (example phrasings, situations) appended to the description in the skill listing. The combined text is budgeted to ~1,536 chars — front-load what matters. |
| `paths` | — | Glob patterns (string or list). The skill auto-activates only when the task involves matching files — e.g. `paths: "migrations/**"` keeps a migration skill quiet everywhere else. |
| `disable-model-invocation` | `false` | `true` = Claude can never auto-invoke it; only your explicit `/name` runs it. Use for deploy runbooks and anything destructive. Also keeps the skill out of subagents. |
| `user-invocable` | `true` | `false` = hidden from the `/` menu; the skill exists purely as background knowledge Claude applies when relevant. |

## Execution fields

These control *how* the skill runs once triggered:

| Field | Default | What it does |
|---|---|---|
| `allowed-tools` | — | Tools Claude may use **without asking**, only during the turn that invoked the skill; the grant clears on your next message. String or list; supports scoped forms like `Bash(git diff:*)`. Friction reduction, not sandboxing. Ignored by the Agent SDK (use its own `allowedTools`). |
| `disallowed-tools` | — | The restrictive counterpart: tools removed from Claude's pool while the skill is active. Same turn-scoped duration. |
| `model` | session model | Run this skill on a specific model (same values as `/model`). Reverts to the session model on your next prompt. |
| `effort` | session effort | Override reasoning effort for this skill: `low` through `max`. A mechanical formatting skill can run at `low` while your session stays at `high`. |
| `context` | — | `context: fork` runs the skill in an isolated subagent context instead of the main conversation — the skill's reading and tool calls never touch your main window. Requires a body that's an explicit task, not passive guidelines. |
| `agent` | `general-purpose` | With `context: fork`: which subagent executes it — `Explore`, `Plan`, `general-purpose`, or a custom agent from `.claude/agents/`. |
| `shell` | `bash` | Shell used for inline `` !`command` `` output injection in the body: `bash` or `powershell`. |
| `hooks` | — | Hooks scoped to this skill's lifecycle — fire on events only while the skill runs, instead of registering globally in settings. See [Claude Code hooks](/guides/configuration/claude-code-hooks). |

## Argument fields

Skills invoked as `/name arg1 arg2` receive their arguments in the body:

| Field | What it does |
|---|---|
| `argument-hint` | Autocomplete hint shown in the `/` menu — e.g. `[issue-number]` or `[filename] [format]`. |
| `arguments` | Declares **named** positional arguments (space-separated string or list), so the body can use `$name` instead of `$1`. |

In the body: `$ARGUMENTS` is everything passed, `$0`/`$1`/`$ARGUMENTS[N]` index individual (shell-quoted) arguments, and named variables come from the `arguments` declaration:

```markdown
---
name: fix-issue
description: Fix a GitHub issue by number. Use when asked to fix issue #N.
arguments: issue
argument-hint: "[issue-number]"
---

Fetch issue #$issue with `gh issue view $issue`, reproduce it, fix it, and
reference "Fixes #$issue" in the commit message.
```

## Distribution fields (open spec)

From the agentskills.io standard — metadata for sharing, read by any conforming tool:

| Field | What it does |
|---|---|
| `license` | License name or a pointer to a bundled file: `"Apache-2.0"`, or `"Proprietary — see LICENSE.txt"`. |
| `metadata` | Arbitrary key-value map for client-specific extensions; no standard keys. |
| `compatibility` | Max 500 chars describing environment requirements (target product, required packages, network access). Most skills omit it. |

> [!NOTE]
> **No `version` field.** It appears in older examples around the web, but it's not in the spec, and clients ignore it. Version at the distribution layer instead: [plugin](/guides/skills/packaging-and-sharing-skills) releases, git tags, or the epoch-stamped version IDs the Claude API assigns on `/v1/skills`.

## Where skill files live

| Scope | Path | Notes |
|---|---|---|
| Personal | `~/.claude/skills/<name>/SKILL.md` | Follows you across all projects |
| Project | `.claude/skills/<name>/SKILL.md` | Checked in, shared with the team |
| Nested (monorepo) | `packages/*/.claude/skills/` | Qualified as `/dir:name` when names collide |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Namespaced as `/plugin:name` |
| Enterprise | Managed by org admins | Distributed org-wide via managed settings |

Changes are picked up live — adding or editing a SKILL.md takes effect in the current session, no restart. If a skill and a legacy `.claude/commands/` file share a name, the skill wins.

## Limits cheat sheet

- `name`: 64 chars, `[a-z0-9-]`, must equal the folder name
- `description`: 1,024 chars (spec); combined with `when_to_use`, ~1,536 chars shown in the listing before truncation
- `compatibility`: 500 chars
- Tool grants and restrictions (`allowed-tools`/`disallowed-tools`): duration is the invoking turn only
- Claude API requests: max 8 skills attached per request, 30 MB per uploaded skill

For how these fields behave outside Claude Code — claude.ai upload, the `/v1/skills` API, the Agent SDK — see [Claude Skills on claude.ai and the API](/guides/skills/claude-skills-on-claude-ai-and-api).
