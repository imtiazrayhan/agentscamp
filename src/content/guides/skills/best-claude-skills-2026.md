---
title: "The Best Claude Skills to Install in 2026"
description: "A skills-only tour of the AgentsCamp library — the Claude Code skills that earn a permanent slot, organized by the job they do."
author: "AgentsCamp"
date: 2026-07-18
color: "green"
topics: ["workflow-prompting"]
tags: ["skills", "claude-code", "best-of", "starter-kit", "workflow"]
featured: false
seoTitle: "Best Claude Skills in 2026: The Ones Worth Installing"
seoDescription: "The best Claude Code skills in 2026, organized by job: git, testing, databases, performance, security, LLM work. Every one installs as a SKILL.md file."
summary: "The skills that earn a permanent slot do one recurring job worth encoding: conventional-commits and pr-description for the git loop, migration-writer for databases, secret-scanner before pushes, memory-leak-hunter for performance, hook-writer to extend Claude Code itself. Install for friction you actually have — each is one SKILL.md away."
keyTakeaways:
  - "A skill earns its slot through repetition: if you keep re-typing the same multi-step instructions, that procedure belongs in a SKILL.md that loads itself when the task matches."
  - "Daily-driver tier: conventional-commits, pr-description, and branch-rebaser automate the git loop; test-scaffolder and coverage-gap-finder do the same for testing."
  - "Specialist tier pays off in the moment of need: deadlock-diagnoser, memory-leak-hunter, and flamegraph-analyzer are rarely invoked but save hours when they are."
  - "Skills that extend Claude Code itself — hook-writer, claude-settings-auditor, plugin-scaffolder — compound: they make every other session better."
  - "Skills sit dormant until triggered, so twenty installed skills cost a few dozen tokens each at session start — curation matters less for context than for trigger clarity."
faq:
  - q: "What is the best way to install these skills?"
    a: "Each library page has the full SKILL.md with a copy button and install path — personal skills go in ~/.claude/skills/<name>/SKILL.md, project skills in .claude/skills/. Or install from the terminal: npx agentscamp add skills/<slug> drops the file in place, and npx agentscamp picks interactively."
  - q: "How many Claude skills should I install?"
    a: "More than you'd think is fine — unlike subagents, skills are cheap at rest. Only each skill's name and description load at session start; the body loads when a task matches. The real limit is trigger clarity: two skills with overlapping descriptions will misfire, so prefer distinct jobs over near-duplicates."
  - q: "Do these skills work outside Claude Code?"
    a: "The SKILL.md format is portable: the same folder-plus-frontmatter shape works in Claude Code, on claude.ai as a capability, and on the Claude API via the /v1/skills endpoint and code execution. The library's skills are written for Claude Code's tools but the procedure body carries over with light editing."
  - q: "What's the difference between a skill and a subagent?"
    a: "A skill is a procedure loaded into the current conversation — same context, same permissions, just added instructions. A subagent is a separate context window with its own system prompt and tool policy. Encode how-to knowledge as skills; delegate isolated jobs to agents."
related: ["what-are-claude-skills", "how-to-install-claude-skills", "best-claude-code-agents-skills", "writing-your-first-skill", "conventional-commits", "hook-writer", "secret-scanner", "migration-writer"]
---

This is the skills-only companion to our mixed [starter kit of agents, skills, and commands](/guides/getting-started/best-claude-code-agents-skills). Everything here is a `SKILL.md` from the AgentsCamp library: a procedure that sits dormant until your task matches its description, then loads and runs like a checklist Claude actually follows. New to the format? Start with [What Are Claude Skills?](/guides/skills/what-are-claude-skills)

What earns a slot on this list: the skill encodes a *procedure* (not trivia the model already knows), the job recurs, and getting it wrong by hand is expensive. Here's the list, by the job each one does.

## The git loop (install these first)

The highest-frequency wins, because you commit more often than you do anything else:

- **[conventional-commits](/skills/git/conventional-commits)** — reads staged changes and writes a correct Conventional Commits message. The gateway skill: one job, fires on "commit this," never needs babysitting.
- **[pr-description](/skills/git/pr-description)** — turns a branch diff into a PR description reviewers actually read.
- **[branch-rebaser](/skills/git/branch-rebaser)** — rebases onto main and walks each conflict by understanding both sides instead of clobbering one.
- **[commit-splitter](/skills/git/commit-splitter)** — splits a mixed working tree into atomic commits that each build and pass tests.
- **[git-blame-investigator](/skills/git/git-blame-investigator)** — reconstructs *why* a line exists from history before you delete it. Cheap insurance against re-introducing the bug the line was fixing.

## Testing and review

- **[test-scaffolder](/skills/testing/test-scaffolder)** — scaffolds test files that match your project's framework and conventions instead of a generic template.
- **[coverage-gap-finder](/skills/testing/coverage-gap-finder)** — runs your coverage tool and names the highest-value untested paths, not just the percentage.
- **[mutation-test-runner](/skills/testing/mutation-test-runner)** — answers the question coverage can't: would the suite actually *catch* a bug?
- **[integration-test-designer](/skills/testing/integration-test-designer)** — designs tests against real collaborators at a deliberate seam, for the bugs that slip past mocked-everything unit suites.

## Databases and SQL

The specialist tier: rarely triggered, disproportionately valuable when they are.

- **[migration-writer](/skills/database/migration-writer)** — expand-contract migrations that stay reversible and never lock a live table. The single most "I should not free-hand this" job in the list.
- **[query-plan-analyzer](/skills/database/query-plan-analyzer)** — reads `EXPLAIN` output and turns it into a concrete fix.
- **[postgres-index-strategist](/skills/database/postgres-index-strategist)** — picks the right index type for the query shape instead of defaulting to btree-everything.
- **[deadlock-diagnoser](/skills/database/deadlock-diagnoser)** — reconstructs the lock cycle from the engine's own deadlock report and fixes the ordering.

## Performance

- **[memory-leak-hunter](/skills/performance/memory-leak-hunter)** — heap-snapshot diffing to name the growing object and cut its retention path.
- **[flamegraph-analyzer](/skills/performance/flamegraph-analyzer)** — reads a CPU profile correctly (width is time, depth isn't) and fixes the widest leaf.
- **[web-vitals-optimizer](/skills/performance/web-vitals-optimizer)** — treats field data at p75 as truth and applies one targeted fix per metric.
- **[bundle-analyzer](/skills/performance/bundle-analyzer)** — ranks the JS bundle's biggest size wins instead of guessing.

## Security

- **[secret-scanner](/skills/security/secret-scanner)** — scans for committed keys and tokens before they reach a public remote. Pair it with a pre-push [hook](/guides/configuration/claude-code-hooks).
- **[dependency-audit](/skills/security/dependency-audit)** — turns noisy scanner output into a triaged, prioritized upgrade plan.
- **[threat-model-builder](/skills/security/threat-model-builder)** — builds a STRIDE model from the actual architecture, not a template.

## LLM and RAG work

If you build AI features, these encode the eval-first discipline that separates working pipelines from demos:

- **[prompt-optimizer](/skills/workflow/prompt-optimizer)** — diagnoses *why* a prompt underperforms before rewriting it, and tells you what to measure.
- **[llm-eval-suite-scaffolder](/skills/data/llm-eval-suite-scaffolder)** — stands up a real eval suite (dataset, metrics, baseline, CI gate) for a feature that has none.
- **[chunking-strategy-optimizer](/skills/data/chunking-strategy-optimizer)** — sweeps chunk configurations against a fixed eval set instead of guessing at 512-with-overlap.
- **[hallucination-evaluator](/skills/data/hallucination-evaluator)** — decomposes answers into atomic claims and checks each for grounding.

## Skills that extend Claude Code itself

The compounding tier — each one makes every future session better:

- **[hook-writer](/skills/workflow/hook-writer)** — turns "always format after edits" into an enforced hook with the right event, matcher, and exit-code plumbing.
- **[claude-settings-auditor](/skills/workflow/claude-settings-auditor)** — audits every settings layer before you trust a new repo's checked-in config.
- **[plugin-scaffolder](/skills/workflow/plugin-scaffolder)** — packages your accumulated skills, agents, and commands into one installable plugin for the team.
- **[agent-memory-designer](/skills/workflow/agent-memory-designer)** — writes a CLAUDE.md from the repo's real commands and gotchas, sized to stay in context.

> [!TIP]
> Install in one command: `npx agentscamp add skills/conventional-commits` (project scope) or add `-g` for `~/.claude/`. Running bare `npx agentscamp` opens an interactive picker across the whole library.

## How to choose from the other sixty

The full library is at [/skills](/skills) — 90+ skills across twelve categories. The selection rule that holds up: install for friction you've felt twice, and check the new skill's description doesn't overlap one you already have. Overlapping descriptions are the main failure mode — Claude routes by description, and two skills claiming the same job means the wrong one fires half the time. When you outgrow the library versions, [edit them](/guides/skills/claude-code-skills-best-practices) — they're plain Markdown, and the frontmatter `description` is the tuning knob.
