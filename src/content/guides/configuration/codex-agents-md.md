---
title: "AGENTS.md for Codex: Project Instructions That Actually Work"
description: "Write an effective AGENTS.md for OpenAI Codex — what belongs in it, how nested overrides work, and how to verify the instructions Codex loaded."
author: "AgentsCamp"
date: 2026-08-04
color: "cyan"
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["codex", "agents-md", "configuration", "instructions", "open-standard"]
featured: true
summary: "AGENTS.md is the durable instruction layer for Codex: a versioned file containing repository layout, commands, constraints, and verification expectations. Codex combines global guidance with project files from the repository root down to the working directory, so closer instructions take precedence. The best files are short, concrete, and maintained from observed mistakes."
keyTakeaways:
  - "Put stable repository facts and commands in AGENTS.md; keep task-specific acceptance criteria in the prompt."
  - "Codex reads a global instruction file, then one instruction file per directory from the project root toward the current working directory."
  - "AGENTS.override.md wins over AGENTS.md within the same directory, while guidance closer to the working directory overrides broader guidance."
  - "Write executable commands and observable constraints; vague requests to use best practices add noise without changing behavior."
  - "Verify discovery from the directory where the work will run, because the working directory controls which nested files are included."
faq:
  - q: "What is AGENTS.md?"
    a: "AGENTS.md is an open-format instruction file for coding agents. Codex reads it before working so a repository can provide persistent context such as its layout, build and test commands, coding conventions, safety boundaries, and definition of done."
  - q: "Where should AGENTS.md go for Codex?"
    a: "Put shared project instructions at the repository root. Add another AGENTS.md or AGENTS.override.md inside a subdirectory only when that subtree genuinely needs different commands or constraints. Personal defaults can live in the Codex home directory."
  - q: "Does a nested AGENTS.md override the root file?"
    a: "Codex combines instruction files from the project root down to the current working directory. The closer file appears later, so its guidance wins when instructions conflict. Within one directory, AGENTS.override.md is selected before AGENTS.md."
  - q: "What should not go in AGENTS.md?"
    a: "Do not put one-off task requirements, secrets, long tutorials, or rules already enforced mechanically by a formatter or CI there. Keep it focused on durable information that helps an agent make or verify changes in this repository."
related: ["glossary:agents-md", "guide:openai-codex-guide", "guide:codex-skills-guide", "guide:context-engineering", "glossary:system-prompt", "glossary:agent-skills"]
howtoSteps:
  - name: "Inventory the repository"
    text: "Record only the layout, setup commands, checks, and constraints an agent needs to work safely; prefer commands you have actually run."
  - name: "Write the root AGENTS.md"
    text: "Add short sections for repository map, working agreements, verification, and boundaries, using explicit paths and copyable commands."
  - name: "Add scoped guidance only where needed"
    text: "Place nested AGENTS.md or AGENTS.override.md files in subdirectories whose tooling or conventions differ from the repository default."
  - name: "Verify instruction discovery"
    text: "Launch Codex from the intended working directory and ask it to summarize its active instruction sources and the commands it will run."
  - name: "Maintain from real friction"
    text: "When Codex repeats a mistake, add the smallest rule that prevents it; remove stale guidance as the repository evolves."
---

**`AGENTS.md` is the repository's durable instruction file for coding agents.** Codex reads it before starting work, giving every task the same map of the codebase, commands, constraints, and verification expectations without making you repeat them in each prompt.

Think of it as an agent-facing companion to `README.md`. The README helps a person understand and use the project; `AGENTS.md` tells an agent how to change it safely. It is plain Markdown, versioned with the code, reviewable in pull requests, and increasingly portable across coding tools.

## What belongs in the file

An effective root `AGENTS.md` answers four questions:

1. **Where is the relevant code?** Name important directories and architectural boundaries.
2. **How do I work here?** Give setup, generation, formatting, and test commands that actually run.
3. **What must remain true?** State compatibility rules, ownership boundaries, and dangerous operations to avoid.
4. **How do I prove a change is done?** Map change types to focused and broader checks.

```md
# Repository guide

## Map
- `apps/web/` is the Next.js application.
- `packages/api/` owns public request and response schemas.
- Generated clients live in `packages/sdk/generated/`; never edit them by hand.

## Working agreements
- Preserve the public API unless the task explicitly authorizes a breaking change.
- Reuse existing components from `apps/web/src/components/ui`.
- Add dependencies only when the standard library and current packages cannot do the job.

## Verification
- Web change: `npm run test:web` and `npm run lint`.
- API schema change: `npm run generate && npm run test:api`.
- Before finishing, review `git diff` for generated or unrelated files.
```

Notice what is missing: a manifesto, generic advice to write clean code, and a copy of every CI job. High-signal instructions are concrete enough to change what the agent does.

## How Codex discovers instructions

Codex builds an instruction chain once at the start of a run:

1. At global scope, it checks the Codex home directory for `AGENTS.override.md`, then `AGENTS.md`, using the first non-empty file.
2. At project scope, it walks from the repository root toward the current working directory.
3. In each directory, it selects at most one file: `AGENTS.override.md`, then `AGENTS.md`, then any configured fallback filename.
4. It concatenates the selected files from broadest to most specific. Guidance closer to the current directory appears later and wins when rules conflict.

```text
~/.codex/AGENTS.md                 personal defaults
repo/AGENTS.md                    project-wide commands and rules
repo/services/AGENTS.md           service conventions
repo/services/payments/
  AGENTS.override.md              payments-only override (closest wins)
```

If Codex starts in `repo/services/payments`, it can receive all four layers. If it starts at the repository root, it does not walk down into `services/payments` looking for instructions that do not govern the current directory.

## Root file versus nested file

Keep the root authoritative for things every contributor shares: repository map, package manager, global checks, safety rules, and pull-request expectations. Add a nested file only when a subtree is operationally different — a mobile app uses another test runner, an infrastructure directory forbids applying changes, or a generated SDK has its own workflow.

Nested instructions should describe the difference, not repeat the root. Duplication creates drift and spends context on text Codex already has.

Use `AGENTS.override.md` for a deliberate replacement in that directory. It is also useful as a temporary global override, but an override is easy to forget; remove it when the exceptional workflow ends.

## Write rules an agent can execute

Weak instructions describe taste:

```md
- Follow best practices.
- Test thoroughly.
- Keep changes clean.
```

Strong instructions name an action and a boundary:

```md
- Parse API payloads with the existing Zod schemas in `src/contracts/`; do not add parallel validation types.
- For changes under `src/billing/`, run `npm test -- billing` before the full suite.
- Do not edit files under `src/generated/`; run `npm run generate` from the schema source.
```

The second set affects search paths, implementation decisions, and verification. It also gives reviewers something objective to enforce.

## Keep task requirements out

`AGENTS.md` is not a substitute for a good prompt. “Add an export button without changing the mobile layout” belongs to one task. “All new icon-only controls require an accessible name” is a durable engineering rule and may belong in the repository file.

Likewise, a multi-step release or incident workflow belongs in a [skill](/guides/skills/codex-skills-guide), where it can carry detailed procedure and supporting files. Operational settings such as approval policy and MCP configuration belong in `.codex/config.toml`, not Markdown instructions.

## Verify what Codex loaded

After adding or moving instruction files, start a fresh run from the directory where work will happen and ask Codex to summarize the active instruction sources, build command, test command, and most important do-not rule. A fresh run matters because discovery happens when the session starts.

If guidance is missing, check the working directory, repository root detection, empty files, a closer `AGENTS.override.md`, custom fallback names, and the combined instruction-size limit. If behavior is wrong, inspect for a specific contradiction before adding more prose.

> [!TIP]
> Treat repeated agent mistakes as tests for your instructions. When the same failure happens twice, add one precise rule that would have prevented it — then see whether the next task passes.

The best `AGENTS.md` is not comprehensive. It is current, scoped, and operational: the smallest document that lets a new agent enter the repository and do verifiable work without relearning the same lessons.

Official reference: [Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md).

## Continue exploring

- [AGENTS.md](/glossary/agents-md) — AGENTS.md is a versioned instruction file that tells coding agents how to work in a repository — including commands, conventions, boundaries, and checks.
