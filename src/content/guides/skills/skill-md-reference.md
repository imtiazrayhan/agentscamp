---
title: "The SKILL.md Reference: Every Frontmatter Field Explained"
description: "A complete reference for the SKILL.md format — all frontmatter fields, naming rules, argument substitution, limits, and where skill files live."
author: "Imtiaz Rayhan"
date: 2026-07-18
updated: 2026-11-27
reviewed: 2026-11-27
color: "purple"
topics: ["workflow-prompting"]
tags: ["skills", "skill-md", "claude-code", "reference", "frontmatter"]
featured: false
seoTitle: "SKILL.md Reference: Every Claude Skill Field Explained"
seoDescription: "The complete SKILL.md frontmatter reference: name, description, allowed-tools, context: fork, paths, arguments, and every other field — with limits."
keywords: ["SKILL.md", "claude skills frontmatter", "skill.md format", "agent skills spec", "claude skills reference"]
summary: "A SKILL.md is YAML frontmatter plus a Markdown body. The open Agent Skills spec defines six fields and requires two, name and description. Claude Code accepts those six plus fourteen of its own for triggering, tool grants, model and effort, forked subagents, arguments and hooks, and treats every field as optional."
keyTakeaways:
  - "The Agent Skills spec requires name (max 64 chars, lowercase letters, numbers and hyphens, matching the folder) and description (max 1,024 chars). Claude Code itself treats every field as optional and falls back to the directory name."
  - "Triggering is tunable: when_to_use adds trigger context, paths limits activation to matching files, disable-model-invocation makes a skill manual-only, user-invocable: false hides it from the / menu."
  - "allowed-tools and disallowed-tools last only for the turn that invokes the skill and clear on your next message. They reduce prompts; they do not sandbox."
  - "context: fork runs the skill as the prompt of a fresh subagent (chosen with agent:), in the background by default; set background: false to wait for the result."
  - "Skills take arguments: $ARGUMENTS, positional $0/$1, or named variables declared in an arguments field, with argument-hint for autocomplete."
  - "claude.ai uploads and the Skills API accept only the six spec fields; any other key fails the upload with an 'Unexpected key(s)' error."
  - "There is no top-level version field. Version at the distribution layer: plugin releases, git tags, or the version IDs the Skills API assigns."
faq:
  - q: "Which SKILL.md fields are required?"
    a: "The Agent Skills spec requires name and description. Claude Code is looser: every field is optional, name defaults to the directory name, and a missing description falls back to the first non-empty line of the body. Write both anyway, because the spec, claude.ai uploads and the Skills API all expect them."
  - q: "How long can a skill description be?"
    a: "The spec caps description at 1,024 characters. In Claude Code, the combined description plus when_to_use text for each skill is truncated at 1,536 characters in the skill listing, and the whole listing has a budget of 1% of the model's context window. Put the main use case first."
  - q: "Does allowed-tools make a skill safe?"
    a: "No. allowed-tools pre-approves tools so the skill runs without permission prompts during the turn that invoked it, and the grant clears on your next message. It does not restrict anything: every other tool stays callable under your normal permission settings. To remove tools while the skill is active, use disallowed-tools."
  - q: "Can a skill run in its own context window?"
    a: "Yes. context: fork starts a new subagent and hands it the SKILL.md content as its prompt, and agent: picks the type (Explore, Plan, general-purpose, or a custom agent). The subagent does not see your conversation history, and it runs in the background unless you set background: false."
  - q: "Is there a version field?"
    a: "No top-level one. The spec's own example puts a version string inside the metadata map, which is the portable place for it. Claude Code silently ignores unrecognized top-level keys, while claude.ai uploads and the Skills API reject them. Releases are versioned at the distribution layer: plugins, git tags, or Skills API version IDs."
  - q: "Do these fields work outside Claude Code?"
    a: "Six do: name, description, license, compatibility, metadata and allowed-tools are the open agentskills.io spec, and they are the only fields claude.ai uploads and the Skills API accept. The rest (context, model, effort, paths, hooks, arguments and so on) are Claude Code fields and cause an 'Unexpected key(s)' error on upload."
related: ["guide:what-are-claude-skills", "guide:writing-your-first-skill", "guide:claude-skills-examples", "guide:claude-code-skills-best-practices", "guide:testing-and-debugging-skills", "skill:hook-writer"]
audience: ["developers"]
---

Most write-ups of the SKILL.md format stop at `name`, `description`, and `allowed-tools`. The actual field set is 20 fields: six from the open [Agent Skills specification](https://agentskills.io/specification) and fourteen more that only Claude Code reads. Every field and limit below was checked against the [Claude Code skills docs](https://code.claude.com/docs/en/skills), the spec, and the Claude API Skills guide in November 2026. If you're new to skills, start with [What Are Claude Skills?](/guides/skills/what-are-claude-skills).

## The file

```text
.claude/skills/<name>/
├── SKILL.md          # required
├── scripts/          # optional, loaded only when referenced
├── references/       # optional, same
└── assets/           # optional, same
```

`SKILL.md` is YAML frontmatter between `---` fences, then a Markdown body. The opening `---` must be the file's first line, or Claude Code treats the whole file as body. If the YAML doesn't parse, the skill still loads, with no fields set. Claude Code's docs recommend keeping `SKILL.md` under 500 lines and moving reference material into separate files.

## Name and description

The spec and Claude Code disagree on how strict these two are, so the table shows both.

| Field | Agent Skills spec | Claude Code |
|---|---|---|
| `name` | Required. 1-64 chars, `a-z`, `0-9` and hyphens, no leading, trailing or consecutive hyphens, must match the parent directory name. | Optional. Defaults to the directory name. If set, it becomes the command shown in the `/` menu; the directory name also still invokes the skill. |
| `description` | Required. 1-1,024 chars, saying what the skill does and when to use it. | "Recommended". If omitted, the first non-empty line of the body is used. |

The Claude API adds two rules of its own for uploaded skills: `name` cannot contain the reserved words `anthropic` or `claude`, and neither field can contain XML tags.

```yaml
---
name: release-notes
description: Draft user-facing release notes from merged PRs since the last tag.
  Use when cutting a release or asked to write release notes or a changelog.
---
```

Write both fields and keep `name` equal to the folder name. That satisfies the spec, the API, and Claude Code at once.

## Triggering fields (Claude Code)

These control *when* the skill activates:

| Field | Default | What it does |
|---|---|---|
| `when_to_use` | — | Extra trigger context (example phrasings, situations) appended to the description in the skill listing. The combined text is truncated at 1,536 characters per skill. The only field spelled with underscores. |
| `paths` | — | Glob patterns (comma-separated string or YAML list), relative to the working directory, for the files that activate the skill. `paths: "migrations/**"` keeps a migration skill quiet everywhere else. Not available in `.claude/commands/` files. |
| `disable-model-invocation` | `false` | `true` means Claude cannot invoke the skill on its own; only your `/name` runs it. The description is also left out of context, the skill is not preloaded into subagents, and it won't run from a session-scoped scheduled task. Use it for deploys and anything with side effects. |
| `user-invocable` | `true` | `false` hides the skill from the `/` menu, and typing `/name` does not run it. The skill is background knowledge that only Claude loads. |

Boolean fields also accept `yes`, `no`, `on`, `off`, `1` and `0`.

## Execution fields (Claude Code)

These control *how* the skill runs once triggered:

| Field | Default | What it does |
|---|---|---|
| `allowed-tools` | — | Tools Claude may use **without asking** during the turn that invokes the skill; the grant clears when you send your next message. Space- or comma-separated string, or a YAML list, with scoped forms like `Bash(git add *)`. It does not restrict the tool pool. Claude Code applies a project skill's grant even in a `-p` run in a folder you have never trusted, so read this field before running Claude Code in someone else's repo. |
| `disallowed-tools` | — | The restrictive counterpart: tools removed from Claude's pool while the skill is active. Also clears on your next message. |
| `model` | session model | Model for the turn when *you* run the skill with `/name`. Takes `/model` values or `inherit`. When Claude invokes the skill on its own, the session keeps its model. With `context: fork`, it sets the subagent's model. |
| `effort` | session effort | Effort level for the rest of the current turn: `low`, `medium`, `high`, `xhigh` or `max` (available levels depend on the model). The `CLAUDE_CODE_EFFORT_LEVEL` environment variable still wins. |
| `context` | — | `context: fork` starts a new subagent and gives it the skill content as its prompt. The subagent does not see your conversation history, so the body has to be a complete task, not passive guidelines. |
| `agent` | `general-purpose` | With `context: fork`: which subagent runs it. `Explore`, `Plan`, `general-purpose`, or a custom agent from `.claude/agents/`. Explore and Plan start without your CLAUDE.md. |
| `background` | `true` | Only with `context: fork`. The fork runs in the background and its result arrives when it finishes; `false` waits for the result in the invoking turn and keeps the full tool set. Non-interactive runs (`-p`, the Agent SDK) always wait. |
| `shell` | `bash` | Shell for inline `` !`command` `` injection in the body: `bash` or `powershell`. |
| `hooks` | — | Hooks Claude Code registers when the skill is invoked; they keep running for the rest of the session. See [Claude Code hooks](/guides/configuration/claude-code-hooks). |

One lifecycle detail explains several of these rows. When a skill is invoked, its rendered content enters the conversation once and stays there for later turns, but its tool grant does not. Instructions persist; permissions are per turn.

## Argument fields (Claude Code)

Skills invoked as `/name arg1 arg2` receive their arguments in the body:

| Field | What it does |
|---|---|
| `argument-hint` | Autocomplete hint shown in the `/` menu, such as `[issue-number]` or `[filename] [format]`. |
| `arguments` | Declares **named** positional arguments (space-separated string or YAML list), so the body can use `$issue` instead of `$0`. |

In the body, `$ARGUMENTS` is everything passed, and `$ARGUMENTS[N]` or the shorthand `$N` picks one argument by 0-based index, so `$0` is the first. Indexed arguments use shell-style quoting: `/my-skill "hello world" second` makes `$0` expand to `hello world`. Named variables come from the `arguments` declaration:

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

A missing indexed argument leaves the placeholder as literal text (`$2` stays `$2`); a missing named argument expands to an empty string. Escape a literal dollar amount as `\$1.00`. The body can also use `${CLAUDE_SKILL_DIR}`, `${CLAUDE_PROJECT_DIR}`, `${CLAUDE_SESSION_ID}` and `${CLAUDE_EFFORT}`, and the first two are substituted inside `allowed-tools` as well, which lets a skill pre-approve its own bundled script:

```yaml
allowed-tools: Bash(${CLAUDE_SKILL_DIR}/scripts/render.sh *)
```

## Spec fields (portable)

These come from the agentskills.io standard and are read by any conforming client. Claude Code accepts all of them but acts only on `allowed-tools`.

| Field | What it does |
|---|---|
| `license` | License name or a pointer to a bundled file, for example `Apache-2.0` or `Proprietary. LICENSE.txt has complete terms`. |
| `compatibility` | 1-500 chars describing environment requirements (intended product, system packages, network access). Most skills omit it. |
| `metadata` | A map of string keys to string values for anything the spec doesn't define. The spec's example stores `author` and `version` here. |
| `allowed-tools` | In the spec, a space-separated string of pre-approved tools, marked experimental as of November 2026, with support that varies between agents. |

> [!NOTE]
> **No top-level `version` field.** It appears in older examples around the web, but it isn't in the spec. Claude Code ignores a field it doesn't recognize without reporting an error; claude.ai uploads and the Skills API fail on it. Put a version string in `metadata` if you want one in the file, and version releases at the distribution layer: [plugin](/guides/skills/packaging-and-sharing-skills) releases, git tags, or the `skver_…` version IDs the Claude API assigns to custom skills.

## What survives outside Claude Code

| Where the skill goes | Fields accepted |
|---|---|
| Claude Code, at any level, including plugin skills | All 20 |
| claude.ai uploads, the Skills API, `package_skill.py` from anthropics/skills | `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` |

An extra key is a hard error on the second row, not a warning:

```text
Unexpected key(s) in SKILL.md frontmatter: argument-hint. Allowed properties are: allowed-tools, compatibility, description, license, metadata, name
```

If one skill has to ship to both, keep the frontmatter to the six spec fields. Body features such as `` !`command` `` injection are also Claude Code only. In Agent SDK sessions a project or personal skill's `allowed-tools` is honored, alongside the SDK's own `allowedTools` option.

## Where skill files live

| Scope | Path | Notes |
|---|---|---|
| Enterprise | `.claude/skills/<name>/SKILL.md` in the managed settings directory | Every user on machines the organization deploys to |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects on this machine |
| Project | `.claude/skills/<name>/SKILL.md` | Checked in, shared with the team |
| Nested (monorepo) | `<subdir>/.claude/skills/<name>/SKILL.md` | Loads once Claude reads or edits a file in that subdirectory; qualified as `/apps/web:deploy` when the name clashes |
| Added directory | `.claude/skills/` in a directory passed with `--add-dir` | That session only |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Namespaced as `/plugin-name:skill-name` |

When the same name exists at several levels, enterprise beats personal and personal beats project. A skill beats a legacy `.claude/commands/` file with the same name, and plugin skills never collide because of their namespace. Do not name a skill folder `synced` or `anthropic-skills`; both are reserved for skills synced from a claude.ai account.

Changes are picked up live: adding, editing or removing a skill under the personal, project or `--add-dir` locations takes effect in the current session. If a new skill doesn't appear, run `/reload-skills`.

## Limits cheat sheet

- `name`: 64 chars, `[a-z0-9-]`, no leading, trailing or double hyphens, equal to the folder name (spec); no `anthropic` or `claude` (API)
- `description`: 1,024 chars (spec and API)
- `description` + `when_to_use` in Claude Code's listing: 1,536 chars per skill, adjustable with the `skillListingMaxDescChars` setting
- Whole skill listing in Claude Code: 1% of the model's context window, adjustable with `skillListingBudgetFraction`; when it overflows, descriptions of the least-used skills are dropped first
- `compatibility`: 500 chars
- `SKILL.md` length: under 500 lines recommended
- After auto-compaction: the first 5,000 tokens of each invoked skill are re-attached, within a combined 25,000 tokens
- `allowed-tools` and `disallowed-tools`: the invoking turn only
- Claude API: up to 20 skills per request, 30 MB per uploaded skill (all files, uncompressed)

For how skills behave on the other surfaces (claude.ai upload, the `/v1/skills` API, the Agent SDK), see [Claude Skills on claude.ai and the API](/guides/skills/claude-skills-on-claude-ai-and-api).
