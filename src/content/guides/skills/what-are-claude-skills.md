---
title: "What Are Claude Skills? The Complete Guide"
description: "Claude Skills explained: what a SKILL.md is, how progressive disclosure keeps skills cheap, where they run, and how to install or write your own."
author: "AgentsCamp"
date: 2026-07-18
color: "green"
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["skills", "claude-code", "skill-md", "agent-skills", "claude"]
featured: true
seoTitle: "What Are Claude Skills? The Complete 2026 Guide"
seoDescription: "Claude Skills are folders with a SKILL.md that teach Claude repeatable procedures. How they work, where they run, and how to install or write one."
keywords: ["claude skills", "what are claude skills", "agent skills", "SKILL.md", "claude code skills"]
summary: "A Claude Skill is a folder with a SKILL.md — frontmatter that tells Claude when to use it, plus a Markdown body of instructions it follows once loaded. Skills stay dormant until a task matches their description, so they cost almost nothing at rest. The same format runs in Claude Code, on claude.ai, on the Claude API, and — since Skills became an open standard — in 40+ other tools."
keyTakeaways:
  - "A skill is a folder containing a SKILL.md: YAML frontmatter (name, description) plus a Markdown body of instructions — no build step, no registration."
  - "Progressive disclosure is why skills scale: only each skill's name and description load at session start; the body loads on trigger; bundled files load only when the instructions reach for them."
  - "Skills fire three ways: Claude auto-invokes when your task matches the description, you type /skill-name directly, or Claude calls the Skill tool."
  - "The format runs everywhere: Claude Code, claude.ai (upload as ZIP), the Claude API (/v1/skills + code execution), the Agent SDK — and 40+ third-party tools via the agentskills.io open standard."
  - "Skills, slash commands, subagents, and MCP servers solve different problems: skills encode procedures, agents isolate context, MCP connects external systems."
  - "Treat skills like code you install: read a SKILL.md before adopting it — its instructions and bundled scripts run with your session's permissions."
faq:
  - q: "What are Claude Skills in one sentence?"
    a: "Reusable procedures packaged as folders with a SKILL.md file — Claude loads one automatically when your task matches its description, then follows its instructions like a runbook."
  - q: "Are Claude Skills free?"
    a: "The format is free and open (agentskills.io), Anthropic's official skills repo is public, and the AgentsCamp library is free to copy. Skills themselves are just Markdown — the only cost is the tokens they add when one activates."
  - q: "Do Claude Skills only work in Claude Code?"
    a: "No. The same SKILL.md format works on claude.ai (uploaded as a ZIP under Settings, with code execution enabled), on the Claude API via the /v1/skills endpoint and the code-execution container, in the Claude Agent SDK, and — since Agent Skills became an open standard in December 2025 — in tools like GitHub Copilot, Cursor, VS Code, and Gemini CLI."
  - q: "How are skills different from just putting instructions in CLAUDE.md?"
    a: "CLAUDE.md is loaded into every session whether relevant or not, so it should stay small. A skill loads only when its description matches the task — which makes it the right home for long, specialized procedures that would bloat always-on memory."
  - q: "Are Claude Skills safe to install?"
    a: "Treat them like dependencies. A skill's body is instructions Claude will follow and may include scripts it will run, all under your session's permission settings. Read the SKILL.md and any bundled files before installing from an unfamiliar source, and prefer skills that scope their allowed-tools narrowly."
  - q: "How many skills can I install?"
    a: "Practically, as many as stay distinguishable. Each installed skill costs a few dozen tokens of metadata at session start; the failure mode isn't context bloat but overlapping descriptions, which make Claude route tasks to the wrong skill."
related: ["writing-your-first-skill", "skill-md-reference", "how-to-install-claude-skills", "claude-skills-examples", "best-claude-skills-2026", "skills-vs-agents-vs-commands", "skills-vs-mcp-servers", "claude-skills-on-claude-ai-and-api"]
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

That's the entire format. No build step, no manifest, no registration call. The frontmatter's `description` decides *when* the skill activates; the body is *what* Claude does once it has. Optional extras — scripts, templates, reference docs — sit in the same folder and are referenced by relative path. The full field list (there are more than most posts document, including `context: fork` for running a skill in an isolated subagent) is in our [SKILL.md reference](/guides/skills/skill-md-reference).

## Progressive disclosure: why skills are cheap

The design insight that makes skills work is that they load in three stages:

| Stage | What loads | When | Approximate cost |
|---|---|---|---|
| 1. Metadata | `name` + `description` only | Session start, every skill | A few dozen tokens each |
| 2. Instructions | The full SKILL.md body | When the task matches the description | A few hundred tokens |
| 3. Resources | Bundled scripts, templates, docs | Only when the instructions reference them | Zero until used |

Twenty installed skills cost roughly a screenful of text at rest. Compare that with stuffing the same twenty procedures into [CLAUDE.md](/guides/configuration/claude-md-best-practices), where every word is paid for in every session, relevant or not. Skills are the overflow valve that keeps project memory small.

## How a skill gets invoked

Three paths:

1. **Automatic** — Claude reads every installed skill's name and description at startup. When your request matches one ("commit this" → the commit skill), it loads the body and follows it. This is why the description is the single most important line you'll write: it's the routing signal.
2. **Explicit** — type `/skill-name` (with optional arguments) to force it, bypassing description matching entirely.
3. **The Skill tool** — Claude can programmatically select and run a skill mid-task, the same way it invokes any other tool.

Skills also take arguments — `/release-notes v2.3` — exposed to the body via `$ARGUMENTS` and positional or named variables. And you can flip the defaults per skill: `disable-model-invocation: true` makes a skill manual-only (right for deploy runbooks), while `user-invocable: false` hides it from the `/` menu and leaves it as background knowledge Claude applies on its own.

## Where skills run

This is what changed in the last year: skills stopped being a Claude Code feature and became a portable format.

- **Claude Code** — the native home: personal skills in `~/.claude/skills/`, project skills in `.claude/skills/`, plus [plugin](/guides/skills/packaging-and-sharing-skills)-distributed and enterprise-managed skills.
- **claude.ai** — upload a skill as a ZIP (Settings → Capabilities to enable code execution first). Anthropic's document skills — Word, Excel, PowerPoint, PDF — are pre-built and always active there.
- **The Claude API** — upload custom skills to the `/v1/skills` endpoint and attach them to a Messages request through the code-execution container. Details and code in [Skills on claude.ai and the API](/guides/skills/claude-skills-on-claude-ai-and-api).
- **The Agent SDK** — skills load from the same `.claude/skills/` directories when you build your own agents.
- **Everywhere else** — in December 2025 Anthropic published Agent Skills as an open standard at agentskills.io. GitHub Copilot, Cursor, VS Code, Gemini CLI, and dozens of other tools now read the same SKILL.md format. A skill you write for Claude Code is no longer locked to it.

One caveat worth knowing: surfaces don't sync. A skill uploaded to claude.ai doesn't appear in Claude Code or the API — each surface gets its own copy.

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

## Getting skills

Three routes, in increasing order of effort:

1. **Install ready-made ones.** The [AgentsCamp skills library](/skills) has 90+ across git, testing, databases, performance, and security — each page shows the full SKILL.md with an install path, or use `npx agentscamp add skills/<name>` from the terminal. Our [picks for 2026](/guides/skills/best-claude-skills-2026) are the short list. Anthropic's own examples live in the public anthropics/skills repo on GitHub.
2. **Study the patterns.** [Annotated examples](/guides/skills/claude-skills-examples) walks through five SKILL.md shapes — minimal, scoped-tools, bundled-script — with the reasoning per line.
3. **Write your own.** The third time you type the same instructions, that's a skill. [Writing Your First Skill](/guides/skills/writing-your-first-skill) is the step-by-step; [best practices](/guides/skills/claude-code-skills-best-practices) covers the craft of descriptions that trigger reliably.

> [!WARNING]
> Install skills the way you'd install packages: from sources you trust, after reading them. A skill's instructions execute with your session's permissions, and bundled scripts are real code. The five-minute read of an unfamiliar SKILL.md is always worth it.
