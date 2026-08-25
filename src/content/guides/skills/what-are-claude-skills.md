---
title: "What Are Claude Skills? The Complete Guide"
description: "Claude Skills explained: what a SKILL.md is, how progressive disclosure keeps skills cheap, where they run, and how to install or write your own."
author: "AgentsCamp"
date: 2026-07-18
updated: 2026-08-25
depth: cornerstone
color: "green"
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["skills", "claude-code", "skill-md", "agent-skills", "claude"]
featured: true
seoTitle: "What Are Claude Skills? The Complete 2026 Guide"
seoDescription: "Claude Skills are folders with a SKILL.md that teach Claude repeatable procedures. How they work, where they run, and how to install or write one."
keywords: ["claude skills", "what are claude skills", "agent skills", "SKILL.md", "claude code skills"]
summary: "A Claude Skill is a folder with a SKILL.md — frontmatter telling Claude when to use it, plus a Markdown body it follows once loaded. Skills stay dormant until a task matches their description, so they cost almost nothing at rest. The same format runs in Claude Code, claude.ai, the Claude API, and dozens of other tools via the open standard."
keyTakeaways:
  - "A skill is a folder containing a SKILL.md: YAML frontmatter (name, description) plus a Markdown body of instructions — no build step, no registration."
  - "Progressive disclosure is why skills scale: only each skill's name and description load at session start (~100 tokens each); the body loads on trigger; bundled files load only when the instructions reach for them."
  - "Skills fire three ways: Claude auto-invokes when your task matches the description, you type /skill-name directly, or Claude calls the Skill tool."
  - "The format runs everywhere: Claude Code, claude.ai (upload as ZIP), the Claude API (/v1/skills + code execution), the Agent SDK — and dozens of third-party tools via the agentskills.io open standard, including OpenAI's Codex, GitHub Copilot, Cursor, and Gemini CLI."
  - "A bundled script's code never enters context, only its output — which is why deterministic work belongs in a script rather than in prose."
  - "Skills, slash commands, subagents, and MCP servers solve different problems: skills encode procedures, agents isolate context, MCP connects external systems."
  - "Treat skills like code you install: read a SKILL.md before adopting it — its instructions and bundled scripts run with your session's permissions."
sources:
  - title: "Agent Skills open standard"
    url: "https://agentskills.io"
    publisher: "Agent Skills"
  - title: "Agent Skills overview"
    url: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview"
    publisher: "Anthropic"
  - title: "Extend Claude with skills"
    url: "https://code.claude.com/docs/en/skills"
    publisher: "Anthropic"
  - title: "Skill authoring best practices"
    url: "https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices"
    publisher: "Anthropic"
  - title: "Equipping agents for the real world with Agent Skills"
    url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills"
    publisher: "Anthropic"
faq:
  - q: "What are Claude Skills in one sentence?"
    a: "Reusable procedures packaged as folders with a SKILL.md file — Claude loads one automatically when your task matches its description, then follows its instructions like a runbook."
  - q: "Are Claude Skills free?"
    a: "The format is free and open (agentskills.io), Anthropic's official skills repo is public, and the AgentsCamp library is free to copy. Skills themselves are just Markdown — the only cost is the tokens they add when one activates."
  - q: "Do Claude Skills only work in Claude Code?"
    a: "No. The same SKILL.md format works on claude.ai (uploaded as a ZIP under Settings, with code execution enabled), on the Claude API via the /v1/skills endpoint and the code-execution container, in the Claude Agent SDK, and — since Anthropic released Agent Skills as an open standard — in dozens of other tools including OpenAI's Codex, GitHub Copilot, VS Code, Cursor, and Gemini CLI."
  - q: "How are skills different from just putting instructions in CLAUDE.md?"
    a: "CLAUDE.md is loaded into every session whether relevant or not, so it should stay small. A skill loads only when its description matches the task — which makes it the right home for long, specialized procedures that would bloat always-on memory. A good tell: a CLAUDE.md section that has grown from a fact into a procedure wants to be a skill."
  - q: "Are Claude Skills safe to install?"
    a: "Treat them like dependencies. A skill's body is instructions Claude will follow and may include scripts it will run, all under your session's permission settings. Anthropic's guidance is to use skills only from sources you trust, and to audit everything bundled beside the SKILL.md — not just the SKILL.md itself — before installing from an unfamiliar source."
  - q: "How many skills can I install?"
    a: "Practically, as many as stay distinguishable. Each installed skill costs roughly 100 tokens of metadata at session start; the failure mode isn't context bloat but overlapping descriptions, which make Claude route tasks to the wrong skill."
  - q: "What's the difference between a Claude Skill and an Agent Skill?"
    a: "Nothing structural — they're the same format under two names. 'Agent Skills' is the open standard Anthropic developed and released for the wider ecosystem; 'Claude Skills' is what that format is called inside Anthropic's own products. A skill written for one works in the other, provided you stick to the spec's fields."
related: ["guide:writing-your-first-skill", "guide:skill-md-reference", "guide:how-to-install-claude-skills", "guide:claude-skills-examples", "guide:best-claude-skills-2026", "guide:skills-vs-agents-vs-commands", "guide:skills-vs-mcp-servers", "guide:claude-skills-on-claude-ai-and-api"]
---

Claude Skills are the answer to a problem every heavy Claude user hits: you keep re-explaining the same procedure. How your team writes migrations. The exact steps of your release checklist. The way you want commit messages formatted. A **skill** packages that procedure once — as a folder with a `SKILL.md` file — and Claude loads it *by itself* whenever the task calls for it.

## The anatomy of a skill

A skill is a directory containing one required file:

```text
.claude/skills/conventional-commits/
└── SKILL.md
```

And `SKILL.md` is YAML frontmatter plus Markdown instructions:

```markdown
---
name: conventional-commits
description: Generate clear Conventional Commits messages from staged changes.
  Use when committing code and you want a well-structured, consistent message.
---

1. Run `git diff --staged` to see what's actually being committed.
2. Pick the type (feat, fix, refactor, docs, chore) from the dominant change.
3. Write `type(scope): summary` under 72 characters, imperative mood.
4. Add a body only if the "why" isn't obvious from the summary.
```

That's the entire format. No build step, no manifest, no registration call. The frontmatter's `description` decides *when* the skill activates; the body is *what* Claude does once it has.

When one file isn't enough, the standard describes a conventional layout for the rest:

```text
my-skill/
├── SKILL.md          # required: metadata + instructions
├── scripts/          # optional: executable code
├── references/       # optional: documentation
└── assets/           # optional: templates, resources
```

Nothing forces those directory names, but following them makes a skill legible to anyone who opens it. The full field list — there are more than most posts document, including `context: fork` for running a skill in an isolated subagent — is in our [SKILL.md reference](/guides/skills/skill-md-reference).

## Progressive disclosure: why skills are cheap

The design insight that makes skills work is that they load in three stages:

| Stage | What loads | When | Approximate cost |
|---|---|---|---|
| 1. Metadata | `name` + `description` only | Session start, every skill | ~100 tokens each |
| 2. Instructions | The full SKILL.md body | When the task matches the description | Target under 5k tokens |
| 3. Resources | Bundled scripts, templates, docs | Only when the instructions reference them | Zero until used |

Twenty installed skills cost roughly a screenful of text at rest. Compare that with stuffing the same twenty procedures into [CLAUDE.md](/guides/configuration/claude-md-best-practices), where every word is paid for in every session, relevant or not. Skills are the overflow valve that keeps project memory small.

Stage 3 hides the most useful asymmetry. When Claude *reads* a bundled reference file, its contents enter context. When Claude *runs* a bundled script, the code never enters context at all — only the output does. A skill can therefore ship a 300-line helper, comprehensive API documentation, or a large dataset and pay nothing for any of it until a step actually reaches for that file.

## How a skill gets invoked

Three paths:

1. **Automatic** — Claude reads every installed skill's name and description at startup. When your request matches one ("commit this" → the commit skill), it loads the body and follows it. This is why the description is the single most important line you'll write: it's the routing signal.
2. **Explicit** — type `/skill-name` (with optional arguments) to force it, bypassing description matching entirely.
3. **The Skill tool** — Claude can programmatically select and run a skill mid-task, the same way it invokes any other tool.

Skills also take arguments — `/release-notes v2.3` — exposed to the body via `$ARGUMENTS` and positional or named variables. And you can flip the defaults per skill: `disable-model-invocation: true` makes a skill manual-only (right for deploy runbooks), while `user-invocable: false` hides it from the `/` menu and leaves it as background knowledge Claude applies on its own.

## Writing a description that actually triggers

Since the description is the routing signal, it's worth stating what a good one looks like. The rule from Anthropic's own authoring guidance is that a description must say both **what the skill does** and **when to use it** — most failed skills only say the first.

```yaml
# Won't trigger reliably — describes mechanism, not occasion
description: Employs a multi-phase reconciliation strategy for schema evolution.

# Triggers — names the situation in the words a user would use
description: >
  Creates a reversible database migration in the repo's house format.
  Use when adding, creating, or generating a migration.
```

Order matters too. Claude Code truncates the combined `description` and `when_to_use` text at 1,536 characters in the skill listing to keep context usage down, so the key use case belongs first and the elaboration last. A trigger buried at the end of a long description can be cut off entirely.

The opposite failure is just as real. A description like "helps with code" will match nearly every request, loading a body you didn't need and spending the budget the skill was supposed to save.

## A skill that ships a script

Here's what stage 3 looks like in practice — a skill whose deterministic work lives in code rather than prose:

```text
~/.claude/skills/changelog-writer/
├── SKILL.md
├── format.py          # groups commits — runs, never loads into context
└── template.md        # the changelog skeleton to fill in
```

```markdown
---
name: changelog-writer
description: Generates a release changelog from git history. Use when cutting a release or when the user asks for release notes.
allowed-tools: Read, Bash
---

1. Run `python format.py $(git describe --tags --abbrev=0)` to produce
   the grouped commit list.
2. Fill `template.md` with the result.
3. Write it to `CHANGELOG.md` under a new version heading.
```

Parsing git output is exactly the kind of task a model can do but shouldn't: it's deterministic, it has a correct answer, and it's cheaper and more reliable as ten lines of Python the skill *runs* than as prose the model *interprets*.

## Where a skill lives — and which one wins

Skills load from four scopes, and where you put one decides who gets it:

| Scope | Path | Applies to |
|---|---|---|
| Enterprise | Set via managed settings | Everyone in the organization |
| Personal | `~/.claude/skills/<name>/SKILL.md` | All your projects |
| Project | `.claude/skills/<name>/SKILL.md` | That project only |
| Plugin | `<plugin>/skills/<name>/SKILL.md` | Wherever the plugin is enabled |

When two skills share a name, enterprise beats personal, and personal beats project — so a `deploy` skill in `~/.claude/skills/` shadows the one your repo ships. That ordering surprises people who expect the more specific location to win. Plugin skills sidestep the problem entirely by living under a `plugin-name:skill-name` namespace. And if a skill and a legacy command share a name, the skill takes precedence.

Skills also load from nested `.claude/skills/` directories below your working directory, which lets a monorepo package carry its own. A nested skill that collides with a root one stays available under a directory-qualified name like `apps/web:deploy`, and Claude picks the variant matching the files it's actually working on.

## Where skills run

This is what changed in the last year: skills stopped being a Claude Code feature and became a portable format.

- **Claude Code** — the native home: personal skills in `~/.claude/skills/`, project skills in `.claude/skills/`, plus [plugin](/guides/skills/packaging-and-sharing-skills)-distributed and enterprise-managed skills.
- **claude.ai** — upload a skill as a ZIP (Settings → Capabilities to enable code execution first). Anthropic's document skills — Word, Excel, PowerPoint, PDF — are pre-built and always active there.
- **The Claude API** — upload custom skills to the `/v1/skills` endpoint and attach them to a Messages request through the code-execution container. Details and code in [Skills on claude.ai and the API](/guides/skills/claude-skills-on-claude-ai-and-api).
- **The Agent SDK** — skills load from the same `.claude/skills/` directories when you build your own agents.
- **Everywhere else** — Anthropic developed the Agent Skills format and released it as an open standard, published at agentskills.io. Dozens of tools now read the same `SKILL.md`: OpenAI's Codex, GitHub Copilot, VS Code, Cursor, Gemini CLI, JetBrains' Junie, OpenCode, OpenHands, Goose, Roo Code, Amp, Factory, Kiro, Tabnine, and more, alongside data platforms like Databricks and Snowflake. A skill you write for Claude Code is no longer locked to it.

Two caveats worth knowing. Surfaces **don't sync**: a skill uploaded to claude.ai doesn't appear in Claude Code or the API — each surface gets its own copy, and each is managed separately. And portability has a boundary, covered next.

## Limits worth knowing

Most of these only bite once, but they bite hard:

| Constraint | Value |
|---|---|
| `name` | Max 64 characters, lowercase letters/numbers/hyphens; can't contain "anthropic" or "claude" |
| `description` | Max 1,024 characters per the spec; Claude Code truncates the listing at 1,536 |
| Portable frontmatter | Only six fields: `name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools` |
| API runtime | Sandboxed: no network access, no runtime package installation |
| Claude Code runtime | Full network access — the same as any program on your machine |

The frontmatter row is the one that surprises people. Claude Code accepts many more fields than the spec defines — `paths`, `context`, `model`, `hooks`, and others — but those are Claude Code extensions. Send a skill using them to claude.ai or the Skills API and validation rejects the unexpected keys. If a skill is meant to travel, restrict it to the six spec fields, which Claude Code also accepts unchanged.

The runtime rows matter for what a skill can *do*. A skill that fetches from an internal API works fine in Claude Code and fails on the API, where the container has no network.

## Skills vs. commands, subagents, and MCP

The extension points overlap less than they look like they do:

| You want to… | Reach for |
|---|---|
| Encode a repeatable procedure Claude applies when relevant | **Skill** |
| Trigger a specific prompt on demand with `/name` | **Skill** (user-invoked) — slash commands and skills have converged; a skill *is* invocable as `/name` |
| Run a job in an isolated context with its own tools and model | **[Subagent](/guides/getting-started/writing-a-custom-agent)** |
| Connect Claude to an external system (database, API, SaaS) | **[MCP server](/guides/skills/skills-vs-mcp-servers)** |
| Load facts and conventions into every session | **[CLAUDE.md](/guides/configuration/claude-md-best-practices)** |

The longer decision-table treatment is in [Skills vs. Agents vs. Commands](/guides/skills/skills-vs-agents-vs-commands).

## What skills are not for

The failure modes cluster into three shapes:

**One-off tasks.** Skills earn their keep through repetition. If you'll do it once, just ask — the skill is overhead you'll never amortize.

**Live external data.** A skill is static text and code on disk. It can't hold a database connection or authenticate to a SaaS API on its own. That's what an MCP server is for; the skill is the *procedure*, the MCP server is the *connection*.

**Guarantees.** A skill's body is instruction, not enforcement. If a step absolutely must happen — a check that gates a deploy, a validation that can't be skipped — put it in a bundled script the skill runs, or in a hook, rather than trusting prose to be followed every time. Instructions influence behavior; code determines it.

## Installing skills safely

A skill is executable instruction written by someone else, which puts it in the same trust category as a dependency you add to `package.json`. Anthropic's guidance is explicit: use skills only from sources you trust, and treat adopting one like installing software.

The audit is not just `SKILL.md`. Read everything bundled beside it — scripts, templates, reference files — and look for operations that don't match the stated purpose: unexpected network calls, file access outside the working area, credential reads. Skills that fetch from external URLs deserve extra scrutiny, since fetched content can carry instructions of its own, and a dependency that's safe today can change tomorrow. Prefer skills that scope `allowed-tools` narrowly, and consider `disallowed-tools` or a narrow `paths` on anything you didn't write.

## Getting skills

Three routes, in increasing order of effort:

1. **Install ready-made ones.** The [AgentsCamp skills library](/skills) has 110 across git, testing, databases, performance, and security — each page shows the full SKILL.md with an install path, or use `npx agentscamp add skills/<name>` from the terminal. Our [picks for 2026](/guides/skills/best-claude-skills-2026) are the short list. Anthropic's own examples live in the public anthropics/skills repo on GitHub.
2. **Study the patterns.** [Annotated examples](/guides/skills/claude-skills-examples) walks through five SKILL.md shapes — minimal, scoped-tools, bundled-script — with the reasoning per line.
3. **Write your own.** The third time you type the same instructions, that's a skill. [Writing Your First Skill](/guides/skills/writing-your-first-skill) is the step-by-step; [best practices](/guides/skills/claude-code-skills-best-practices) covers the craft of descriptions that trigger reliably.

> [!WARNING]
> Install skills the way you'd install packages: from sources you trust, after reading them. A skill's instructions execute with your session's permissions, and bundled scripts are real code. The five-minute read of an unfamiliar SKILL.md is always worth it.
