---
title: "Best Spec-Driven Development Tools in 2026"
description: "GitHub Spec Kit, Kiro, OpenSpec, Taskmaster, BMAD Method, Agent OS and cc-sdd compared on workflow, artifacts, agent support and how much process each adds."
seoTitle: "Best Spec-Driven Development Tools 2026: Spec Kit, Kiro, OpenSpec"
seoDescription: "Best spec-driven development tools in 2026: GitHub Spec Kit, Kiro, OpenSpec, Taskmaster and BMAD Method compared on the spec, plan and tasks loop."
author: "Imtiaz Rayhan"
date: 2026-11-18
reviewed: 2026-11-22
color: "green"
depth: standard
topics: ["ai-agents-systems", "workflow-prompting"]
audience: ["developers"]
tags: ["comparison", "spec-driven", "sdd", "workflow", "coding-agents", "best-of"]
featured: false
keywords: ["spec-driven development tools", "best spec-driven development tools", "spec kit vs kiro", "openspec", "bmad method", "taskmaster ai"]
summary: "GitHub Spec Kit is the best spec-driven development tool for most teams: open source, integrated with 40+ agents including Claude Code, and covering the whole spec, plan, tasks and implement loop. Pick Kiro for specs inside an IDE, OpenSpec for changes to existing codebases, Taskmaster for PRD-to-task tracking, and BMAD Method for a full agile method."
keyTakeaways:
  - "Every tool here runs some version of the same loop: write the spec (what and why), derive a plan (how), break it into tasks, implement, then check the result against the spec."
  - "GitHub Spec Kit reached v1.0.0 on August 21, 2026. In Claude Code its commands install as skills you invoke as /speckit-specify; the dotted /speckit.specify form is now reference notation."
  - "Kiro builds specs into its IDE, CLI, web and mobile apps, with requirements written in EARS notation; property-based correctness checks run in the IDE only."
  - "OpenSpec is built for brownfield work: each change gets its own proposal, spec deltas, design and tasks under openspec/changes/."
  - "Taskmaster and BMAD Method sit at the edges. Taskmaster starts from a PRD and manages tasks; BMAD is a full agile method whose V7 is still preview alpha as of November 2026."
faq:
  - q: "What is the best spec-driven development tool?"
    a: "For most teams, GitHub Spec Kit. It is MIT-licensed, free, works inside the coding agent you already use, with more than 40 agent integrations including Claude Code, GitHub Copilot and Codex, and covers the full loop from constitution and spec through plan, tasks, implementation and a converge step that checks the work against the artifacts. Choose Kiro if you want specs built into the editor, and OpenSpec if most of your work changes an existing codebase."
  - q: "What is the difference between Spec Kit and Kiro?"
    a: "Spec Kit is a toolkit that adds spec-driven commands to an agent you already use; Kiro is a coding product with specs built in. Spec Kit produces markdown artifacts such as spec.md, plan.md and tasks.md through slash commands or skills. Kiro generates requirements.md (or bugfix.md), design.md and tasks.md inside its own IDE, CLI, web and mobile apps, writes requirements in EARS notation, and in the IDE can check code against them with property-based tests."
  - q: "How do I use Spec Kit with Claude Code?"
    a: "Install the CLI with uv tool install specify-cli, then run specify init my-project --integration claude. Spec Kit installs its commands as Claude Code skills under .claude/skills/speckit-<command>/SKILL.md, and you invoke them with a hyphen: /speckit-constitution, /speckit-specify, /speckit-plan, /speckit-tasks, /speckit-implement and /speckit-converge. The dotted names in Spec Kit's docs, such as /speckit.specify, are reference notation."
  - q: "Which spec-driven tool works best on an existing codebase?"
    a: "OpenSpec is designed for it. Its stated philosophy includes 'built for brownfield not just greenfield', and it organizes work as changes: each one gets a proposal.md, spec deltas, a design.md and a tasks.md under openspec/changes/, which you then apply and archive. That fits incremental work on a mature codebase better than a single up-front spec."
  - q: "Is Taskmaster a spec-driven development tool?"
    a: "Partly. Taskmaster does not help you write the spec; it starts from a product requirements document, parses it into tasks with dependencies, scores their complexity, expands them into subtasks and tells your agent what to work on next. Teams often pair it with a separate spec step. Note its license is MIT WITH Commons-Clause and its last release was 0.43.1 on March 31, 2026."
sources:
  - title: "github/spec-kit"
    url: "https://github.com/github/spec-kit"
    publisher: "GitHub"
  - title: "Agentic SDD reference"
    url: "https://github.github.io/spec-kit/reference/agentic-sdd.html"
    publisher: "GitHub"
  - title: "Spec Kit: Claude Code integration"
    url: "https://github.github.io/spec-kit/integrations/claude.html"
    publisher: "GitHub"
  - title: "Spec-driven development with AI: get started with a new open source toolkit"
    url: "https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/"
    publisher: "GitHub"
  - title: "Specs"
    url: "https://kiro.dev/docs/specs/"
    publisher: "Kiro"
  - title: "Feature specs"
    url: "https://kiro.dev/docs/specs/feature-specs/"
    publisher: "Kiro"
  - title: "Fission-AI/OpenSpec"
    url: "https://github.com/Fission-AI/OpenSpec"
    publisher: "Fission AI"
  - title: "eyaltoledano/claude-task-master"
    url: "https://github.com/eyaltoledano/claude-task-master"
    publisher: "Taskmaster"
  - title: "bmad-code-org/BMAD-METHOD"
    url: "https://github.com/bmad-code-org/BMAD-METHOD"
    publisher: "BMad Code"
  - title: "buildermethods/agent-os"
    url: "https://github.com/buildermethods/agent-os"
    publisher: "Builder Methods"
  - title: "gotalab/cc-sdd"
    url: "https://github.com/gotalab/cc-sdd"
    publisher: "gotalab"
related: ["tool:spec-kit", "tool:kiro", "tool:taskmaster", "guide:spec-driven-development", "glossary:spec-driven-development", "skill:spec-writer", "command:spec", "agent:spec-implementer", "command:plan-feature", "command:breakdown-task"]
---

**GitHub Spec Kit is the best spec-driven development tool for most teams in 2026.** It is open source, it works inside the coding agent you already use, and it covers the whole loop from spec to plan to tasks to implementation, with a final step that checks the code against the spec. [Kiro](/tools/kiro) is the pick if you want specs built into the editor rather than added to it. OpenSpec suits teams whose work is mostly changes to an existing codebase. [Taskmaster](/tools/taskmaster) is narrower: it turns a PRD into a tracked task list. BMAD Method packages a whole agile development method for teams that want more structure. Agent OS and cc-sdd are lighter add-ons for standards and long-running implementation.

*Last reviewed: November 2026.*

## The spec → plan → tasks loop

[Spec-driven development](/guides/workflow/spec-driven-development) moves your effort from correcting an agent mid-flight to writing down what you want first. GitHub's launch post for Spec Kit put it as "moving from 'code is the source of truth' to 'intent is the source of truth.'" Whatever the tool, the loop has the same stages:

1. **Specify.** Describe what to build and why: user stories, constraints and acceptance criteria. Spec Kit's `specify` step deliberately leaves out the tech stack, and Kiro writes requirements in EARS form ("WHEN [condition/event] THE SYSTEM SHALL [expected behavior]").
2. **Plan.** The agent proposes the how (architecture, components, data, trade-offs) and you review it before any code exists.
3. **Tasks.** The plan becomes small, ordered tasks with checkable outcomes, sized for one focused session each.
4. **Implement.** The agent works through the tasks against the spec.
5. **Verify.** Check the result against the artifacts. Spec Kit's `converge` step and Kiro's correctness checks both do this.

An article on Martin Fowler's site sorts tools into three levels: spec-first (write the spec, then use it for the task), spec-anchored (keep the spec after the task is done) and spec-as-source (humans edit only the spec). Most tools below are spec-first or spec-anchored. Tessl, which explored spec-as-source in 2025, has since repositioned as a "Software Factory" and no longer documents a spec-driven workflow, so it is not covered here. The [spec-driven development](/glossary/spec-driven-development) entry has the short definition.

Three questions separate the tools below. Where does the spec live: inside the agent you already use, or inside a separate product? Does the tool assume a new project, or changes to an existing one? And how much process does it add on top of the loop? Keep those in mind as you read; the answers matter more than feature lists.

## The summary table

| Tool | Form | Main artifacts | Works with | License |
| --- | --- | --- | --- | --- |
| [GitHub Spec Kit](/tools/spec-kit) | CLI plus agent commands or skills | constitution, spec, plan, tasks | 40+ integrations, including Claude Code, Copilot, Codex | MIT |
| [Kiro](/tools/kiro) | IDE, CLI, web and mobile product | requirements.md (or bugfix.md), design.md, tasks.md | Kiro's own agent | Proprietary |
| OpenSpec | CLI plus agent skills | proposal.md, specs/, design.md, tasks.md per change | 30+ tools | MIT |
| [Taskmaster](/tools/taskmaster) | CLI plus MCP server | PRD, task graph with subtasks | Any MCP client; Cursor, Windsurf, VS Code rules | MIT WITH Commons-Clause |
| BMAD Method | Installer (v6) or agent skills (V7) | Agile development workflows | Coding agents | MIT plus trademark notice |
| Agent OS | Standards and spec system | Codebase standards, specs | Coding agents | MIT |
| cc-sdd | SDD harness of agent skills | Approved specs, then implementation | Claude Code, Codex, Cursor, Copilot and more | MIT |

## GitHub Spec Kit

Spec Kit is GitHub's open-source toolkit, launched in September 2025. It reached v1.0.0 on August 21, 2026, and v1.4.3 is the latest release as of November 2026. It is MIT-licensed, had about 151,000 GitHub stars as of November 2026, and needs "Python 3.11+, uv, and a supported AI coding agent on Linux, macOS, or Windows". The core commands, in Spec Kit's reference notation, are `/speckit.constitution`, `/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement` and the newer `/speckit.converge`, which will "assess implementation against the artifacts and append remaining work". Optional gates `/speckit.clarify`, `/speckit.analyze` and `/speckit.checklist` catch vague or inconsistent specs.

The 1.x line changed how you call these in Claude Code. Spec Kit installs them as skills at `.claude/skills/speckit-<command>/SKILL.md`, and you invoke them with a hyphen:

```bash
uv tool install specify-cli
specify init my-project --integration claude
# then, in Claude Code:
# /speckit-constitution → /speckit-specify → /speckit-plan → /speckit-tasks → /speckit-implement → /speckit-converge
```

Copilot uses the same hyphenated form by default, and Codex uses `$speckit-specify`. PyPI is now an official install channel, and if you want a fixed version you can install from a release tag instead with `--from git+https://github.com/github/spec-kit.git@vX.Y.Z`. Pin one for team projects, because templates change between releases. The integrations directory lists 41 named agents. Turning tasks into GitHub issues (`taskstoissues`) now lives in a GitHub extension rather than in the core commands, and the project also ships bundled extensions for bug fixing and idea assessment, plus presets, workflows, bundles and catalogs.

**Verdict:** the default. It is free, agent-agnostic, and the most complete expression of the loop.

## Kiro specs

Kiro is a coding product with specs built in. Its docs define specs as "structured artifacts that formalize the development process", and every spec produces `requirements.md` (or `bugfix.md` for bugs), `design.md` and `tasks.md`. Feature specs come in "two workflow variants: Requirements-First and Design-First", and there is also a Quick Spec option. Requirements use EARS notation. Specs work across Kiro's IDE, CLI, web and mobile apps, and tasks run in dependency "waves". Two features vary by surface: Analyze Requirements runs in the IDE and CLI, while Correctness, which uses property-based testing, runs only in the IDE.

**Verdict:** the best fit if you want one product that owns the spec, the agent and the checks, and you are happy to work in Kiro rather than your current agent.

## OpenSpec

OpenSpec, from Fission AI, organizes spec work as changes. Each change gets a `proposal.md`, a `specs/` folder, a `design.md` and a `tasks.md` under `openspec/changes/`. You work through them with agent skills: `/openspec-explore`, `/openspec-propose`, `/openspec-apply-change` and `/openspec-archive-change`. Its stated philosophy is "fluid not rigid · iterative not waterfall · … built for brownfield not just greenfield", and it says "we support 30+ tools". It is MIT-licensed, at v2.1.1 as of November 2026, with about 75,000 stars as of November 2026. Install it with `npm install -g @fission-ai/openspec@latest` (Node.js 22.20.0 or higher), Homebrew (`brew install openspec`) or its install script, then run `openspec init`. Its Stores feature is in beta as of November 2026. It collects anonymous telemetry, which you can opt out of.

**Verdict:** the strongest choice for incremental changes to a mature codebase, where one up-front spec would go stale.

## Taskmaster

Taskmaster (npm `task-master-ai`) starts where a PRD ends. Put the PRD at `.taskmaster/docs/prd.txt`, run `task-master parse-prd`, and it produces tasks with dependencies. `analyze-complexity` and `expand` then split the heavy ones into subtasks, and `next` tells the agent what to do. It runs as a CLI and as an MCP server, so [Claude Code](/tools/claude-code) can call it directly, and its tool-loading modes cut the MCP server's footprint from about 21,000 tokens to about 5,000. Its license is MIT WITH Commons-Clause, which bars selling it or offering it as a hosted service. It also supports three model roles (main, research and fallback), and its Claude Code provider needs no API key, only the Claude Code CLI. Development has slowed: the last release was 0.43.1 on March 31, 2026.

**Verdict:** useful if your team already writes PRDs and wants task tracking the agent can follow. Pair it with a separate spec step, and watch its release activity.

## BMAD Method

BMAD Method describes itself as "Agile Ai Driven Development": a whole development method delivered as workflows for your agent, not a single command set. The stable line is v6.12, installed with `npx bmad-method install`, which needs Node.js 20.12 or later, Python 3.10 or later and uv. The README says "BMad is free and open source, with no paywalled workflows". The code is MIT, but the names "BMad" and "BMad Method" carry a trademark notice. V7, which installs as skills (`npx skills add bmad-code-org/BMAD-METHOD/skills/core-tools --skill '*'`, then the same command for `skills/method`), is still preview alpha as of November 2026, even though the README gave mid-November 2026 as its target.

**Verdict:** for teams that want to adopt a whole agile method, not just a spec step. Stay on the stable v6 line until V7 ships.

## Agent OS and cc-sdd

Two smaller projects fill specific gaps. Agent OS, from Builder Methods, is "a system for injecting your codebase standards and writing better specs for spec-driven development". It is MIT, and its latest release is v3.0.0 from January 2026. cc-sdd aims to "turn approved specs into long-running autonomous implementation", as "a minimal, adaptable SDD harness with Agent Skills for Claude Code, Codex, Cursor, Copilot, Windsurf, OpenCode, Gemini CLI, and Antigravity". It is MIT, at v3.1.0 from September 2026.

**Verdict:** add Agent OS when your specs keep missing house conventions, and cc-sdd when approved specs should run unattended for longer.

## How to choose

- **You want one default that works in your current agent.** Spec Kit.
- **You want specs, agent and checks in one product.** Kiro.
- **Most of your work changes an existing codebase.** OpenSpec.
- **You already write PRDs and need task tracking.** Taskmaster.
- **You want a whole agile method, not just a spec step.** BMAD Method, on the stable v6 line.
- **Your specs ignore house conventions.** Add Agent OS to whichever tool you pick.
- **You only need spec, plan and tasks for medium-sized work in Claude Code.** Skip the toolkits and use plan mode with the [plan-feature](/commands/plan/plan-feature) and [breakdown-task](/commands/plan/breakdown-task) commands.

## Continue exploring

The method matters more than the tool. [Spec-Driven Development with AI Agents](/guides/workflow/spec-driven-development) explains when specs pay off and when they are theater. If you would rather assemble the loop from installables inside Claude Code, start with the [spec-writer](/skills/workflow/spec-writer) skill, the [/spec](/commands/plan/spec) command and the [spec-implementer](/agents/core-development/spec-implementer) agent. The tool pages for [Spec Kit](/tools/spec-kit), [Kiro](/tools/kiro) and [Taskmaster](/tools/taskmaster) carry setup details.
