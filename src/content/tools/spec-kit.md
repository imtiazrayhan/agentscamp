---
name: "Spec Kit"
description: "GitHub's open-source toolkit for spec-driven development — a specify CLI and /speckit slash commands that walk any coding agent from spec to implementation."
date: 2026-06-11
url: "https://github.com/github/spec-kit"
pricing: "open-source"
category: "cli"
repo: "https://github.com/github/spec-kit"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "purple"
topics: ["workflow-prompting"]
tags: ["spec-driven", "sdd", "workflow", "cli", "github"]
featured: false
sameAs:
  - "https://github.com/github/spec-kit"
  - "https://github.github.io/spec-kit/"
related: ["spec-driven-development", "vibe-coding-guide", "plan-feature", "breakdown-task", "claude-code", "github-copilot"]
alternativeTo: ["claude-code", "codex-cli", "aider", "opencode"]
summary: "Spec Kit (GitHub, MIT, ~111k stars since its September 2025 launch) productized spec-driven development: specify init scaffolds a project, then /speckit.constitution, .specify, .plan, .tasks, and .implement walk your coding agent through the pipeline — each phase emitting a markdown artifact that feeds the next. Works with 30+ agents including Claude Code, Copilot, and Cursor."
faq:
  - q: "What is Spec Kit?"
    a: "GitHub's open-source toolkit that turns spec-driven development into slash commands for your existing coding agent. The specify CLI scaffolds the structure; then inside Claude Code, Copilot, Cursor, or 30+ other agents you run /speckit.specify (what and why), /speckit.plan (tech and architecture), /speckit.tasks (actionable list), and /speckit.implement — with a constitution file carrying project principles into every stage."
  - q: "How do I install Spec Kit?"
    a: "uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@<release-tag> (Python 3.11+, uv, Git required), then specify init my-project --integration claude (or copilot, cursor…). Pin a release tag — templates evolve fast — and note older tutorials' --ai flag was removed in v0.10 in favor of --integration."
  - q: "Does Spec Kit write the code?"
    a: "No — your agent does. Spec Kit's contribution is structure: phase templates, the artifacts each phase emits, and gates like /speckit.clarify (de-vague the spec before planning), /speckit.analyze (consistency check between tasks and implementation), and /speckit.checklist ('unit tests for English'). It's the workflow layer; the model and agent stay yours."
---

Spec Kit is GitHub's answer to the chaos question of agentic coding — *piecemeal prompting produces piecemeal software* — and the answer landed: ~111k stars in nine months made it the standard expression of [spec-driven development](/guides/workflow/spec-driven-development). It doesn't replace your agent; it gives your agent a process.

## Highlights

- **The five-phase pipeline** — `/speckit.constitution` (principles) → `.specify` (the what/why, deliberately no tech stack) → `.plan` (architecture and stack) → `.tasks` (actionable, checkable list) → `.implement` — each phase a reviewed markdown artifact feeding the next.
- **Quality gates** — `/speckit.clarify` interrogates vague specs before planning; `/speckit.analyze` cross-checks artifacts for drift; `/speckit.checklist` generates requirement checklists; `.taskstoissues` turns tasks into GitHub issues.
- **Agent-agnostic** — 30+ integrations (Claude Code, Copilot, Gemini CLI, Codex, Cursor, Windsurf…); commands install as the agent's native slash commands or as skills.
- **Extensible** — extensions add commands/workflows (Jira, code review), presets override templates for compliance formats or house terminology, with project-local overrides.
- **Brownfield too** — built for greenfield, parallel exploratory implementations, and iterative modernization of existing systems.

## In an AI-assisted workflow

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.10.2
specify init my-project --integration claude
# then, inside Claude Code:
# /speckit.specify → /speckit.plan → /speckit.tasks → /speckit.implement
```

The artifacts are the point: a `spec.md` and `plan.md` you review before code exists, and that re-anchor any future session — the [persistence that prompts lack](/guides/configuration/claude-code-memory-context).

> [!NOTE]
> It moves fast: releases ship weekly-ish (v0.10.x as of June 2026), templates change between them, and the old `--ai` flag is gone — pin a tag, and prefer `specify self upgrade` for updates. Community extensions are third-party; review before installing.

## Good to know

MIT, Python 3.11+ with `uv`, launched September 2, 2025 via the GitHub blog and snowballed as the antidote-to-vibe-coding narrative took hold. The methodology it implements — when specs pay, when they're theater — is our [Spec-Driven Development guide](/guides/workflow/spec-driven-development); the lighter-weight in-Claude-Code version of the same instinct is [plan mode plus plan-feature](/commands/plan/plan-feature).
