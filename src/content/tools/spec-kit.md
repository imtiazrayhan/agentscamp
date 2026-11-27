---
name: "Spec Kit"
description: "GitHub's open-source toolkit for spec-driven development — a specify CLI and /speckit slash commands that walk any coding agent from spec to implementation."
date: 2026-06-11
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://github.com/github/spec-kit"
pricing: "open-source"
category: "cli"
repo: "https://github.com/github/spec-kit"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "purple"
topics: ["workflow-prompting"]
audience: ["developers"]
tags: ["spec-driven", "sdd", "workflow", "cli", "github"]
featured: false
sameAs:
  - "https://github.com/github/spec-kit"
  - "https://github.github.io/spec-kit/"
related: ["guide:spec-driven-development", "guide:vibe-coding-guide", "command:plan-feature", "command:breakdown-task", "tool:claude-code", "tool:github-copilot"]
alternativeTo: ["claude-code", "codex-cli", "aider", "opencode"]
summary: "Spec Kit (GitHub, MIT, about 152k stars as of November 2026) productized spec-driven development: specify init scaffolds a project, then /speckit.constitution, .specify, .plan, .tasks, .implement and .converge walk your coding agent through the pipeline, each phase emitting a markdown artifact that feeds the next. It works with 40+ agent integrations."
faq:
  - q: "What is Spec Kit?"
    a: "GitHub's open-source toolkit that turns spec-driven development into slash commands for your existing coding agent. The specify CLI scaffolds the structure; then inside Claude Code, Copilot, Cursor, or 40+ other integrations you run /speckit-specify (what and why), /speckit-plan (tech and architecture), /speckit-tasks (actionable list), /speckit-implement and /speckit-converge (the dotted /speckit.specify form is reference notation) — with a constitution file carrying project principles into every stage."
  - q: "How do I install Spec Kit?"
    a: "Run uv tool install specify-cli (Python 3.11+ and uv required), then specify init my-project --integration claude, or another key such as copilot, codex or gemini. Templates change between releases, so pin a version with uv tool install specify-cli==1.4.5 if you need repeatable setups. Older tutorials use an --ai flag that no longer works; use --integration."
  - q: "Does Spec Kit write the code?"
    a: "No — your agent does. Spec Kit's contribution is structure: phase templates, the artifacts each phase emits, and gates like /speckit.clarify (de-vague the spec before planning), /speckit.analyze (consistency check between tasks and implementation), and /speckit.checklist ('unit tests for English'). It's the workflow layer; the model and agent stay yours."
---

Spec Kit is GitHub's answer to the chaos question of agentic coding — *piecemeal prompting produces piecemeal software* — and the answer landed: about 152,000 stars by November 2026 made it the standard expression of [spec-driven development](/guides/workflow/spec-driven-development). It doesn't replace your agent; it gives your agent a process.

## Highlights

- **The core pipeline** — `/speckit.constitution` (principles) → `.specify` (the what/why, deliberately no tech stack) → `.plan` (architecture and stack) → `.tasks` (actionable, checkable list) → `.implement` → `.converge` (assess the implementation against the artifacts and append remaining work) — each phase a reviewed markdown artifact feeding the next. In Claude Code and Copilot they install as skills invoked as `/speckit-specify`; the dotted form is reference notation.
- **Quality gates** — `/speckit.clarify` interrogates vague specs before planning; `/speckit.analyze` cross-checks artifacts for drift; `/speckit.checklist` generates requirement checklists.
- **Beyond feature work** — two bundled extensions are separate entry points, not extra phases: `specify extension add bug` adds an assess, fix and test process for bugs that ends in a `verified`, `partial` or `failed` verdict, and `specify extension add assess` adds an idea-assessment process that ends in `go`, `needs-clarification` or `kill`.
- **Agent-agnostic** — 40+ integrations (Claude Code, Copilot, Gemini CLI, Codex CLI, Cursor, Zed…); commands install as the agent's native slash commands or as skills, and `--integration none` scaffolds an agent-neutral project for mixed teams.
- **Extensible** — extensions add commands, quality gates or whole processes; presets override templates for compliance formats or house terminology, with project-local overrides; workflows automate prompts, gates and shell tasks; bundles package a setup for a team. `specify extension search` and its siblings search community catalogs, which the README warns are not audits or endorsements.
- **Brownfield too** — built for greenfield, parallel exploratory implementations, and iterative modernization of existing systems.

## In an AI-assisted workflow

```bash
uv tool install specify-cli    # from PyPI; pin with specify-cli==1.4.5
specify init my-project --integration claude
# then, inside Claude Code (commands install as skills):
# /speckit-specify → /speckit-plan → /speckit-tasks → /speckit-implement → /speckit-converge
```

The artifacts are the point: a `spec.md` and `plan.md` you review before code exists, and that re-anchor any future session — the [persistence that prompts lack](/guides/configuration/claude-code-memory-context).

> [!NOTE]
> It moves fast: v1.0.0 shipped on August 21, 2026 and v1.4.5 is current as of November 2026, templates change between releases, and the old `--ai` flag is gone — pin a tag, and prefer `specify self upgrade` for updates. Community extensions are third-party; review before installing.

## Good to know

MIT, Python 3.11+ with `uv`, with a repository history that begins on August 21, 2025; it snowballed as the antidote-to-vibe-coding narrative took hold. The cost is ceremony: the README tells you to run the steps one at a time and review each result, which is overhead a one-line fix does not need. The methodology it implements — when specs pay, when they're theater — is our [Spec-Driven Development guide](/guides/workflow/spec-driven-development); the lighter-weight in-Claude-Code version of the same instinct is [plan mode plus plan-feature](/commands/plan/plan-feature). For other tools, see [Kiro](/tools/kiro), [Taskmaster](/tools/taskmaster) and the [best spec-driven development tools of 2026](/guides/comparisons/best-spec-driven-development-tools-2026).
