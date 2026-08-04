---
title: "Codex Skills: Build Reusable Workflows with SKILL.md"
description: "Create, install, and test Codex skills with SKILL.md — including trigger descriptions, repo and user paths, progressive disclosure, and distribution."
author: "AgentsCamp"
date: 2026-08-04
color: "cyan"
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["codex", "skills", "skill-md", "openai", "agent-skills"]
featured: true
summary: "Codex skills package a repeatable workflow as a directory with SKILL.md plus optional scripts, references, templates, and assets. Codex sees compact metadata first and loads the full instructions only when the user invokes the skill or the task matches its description. Store team skills under .agents/skills, personal skills under ~/.agents/skills, and distribute mature bundles as plugins."
keyTakeaways:
  - "A skill is a workflow, not a permanent rule: use AGENTS.md for always-on repository guidance and SKILL.md for tasks that trigger conditionally."
  - "The description is routing logic; front-load the job and concrete trigger phrases so Codex can select the skill from metadata alone."
  - "Repo skills live under .agents/skills from the current directory toward the repository root; personal skills live under ~/.agents/skills."
  - "Keep SKILL.md lean and move bulky references, deterministic scripts, and output templates into sibling files."
  - "Test both positive prompts that should activate the skill and near-miss prompts that should not."
faq:
  - q: "What is a Codex skill?"
    a: "A Codex skill is a folder containing a SKILL.md file with a name, trigger description, and workflow instructions. It can also include scripts, references, templates, and assets. Codex loads the full instructions when the skill is invoked or the user's task matches its description."
  - q: "Where do Codex skills go?"
    a: "Put shared repository skills in .agents/skills, either at the repository root or a relevant directory above the current working directory. Put personal cross-project skills in ~/.agents/skills. Administrators can provide machine-wide skills under /etc/codex/skills."
  - q: "How do I invoke a skill in Codex?"
    a: "Codex can choose a skill automatically from its description. In the CLI or IDE extension, use /skills to browse or type $ to mention one explicitly. Explicit invocation is useful for testing; good metadata enables reliable automatic selection."
  - q: "Should I use a skill or AGENTS.md?"
    a: "Use AGENTS.md for guidance that should affect nearly every task in a repository, such as commands and architecture boundaries. Use a skill for a recognizable workflow that is relevant only sometimes, such as triaging CI, drafting release notes, or planning a migration."
related: ["glossary:agent-skills", "guide:agent-skills-open-standard", "guide:writing-your-first-skill", "guide:skill-md-reference", "guide:codex-agents-md", "guide:openai-codex-guide", "skill:skill-auditor"]
howtoSteps:
  - name: "Choose one repeatable job"
    text: "Define a narrow workflow with recognizable inputs and a concrete output; do not combine unrelated capabilities in one skill."
  - name: "Create the skill directory"
    text: "Create .agents/skills/<name>/SKILL.md for a team skill or ~/.agents/skills/<name>/SKILL.md for a personal skill."
  - name: "Write routing metadata"
    text: "Add a kebab-case name and a concise description that states what the skill does, when it should trigger, and important boundaries."
  - name: "Write the workflow"
    text: "Use imperative steps with explicit inputs, checks, failure handling, and an output contract; move long or specialized material into sibling files."
  - name: "Test activation and results"
    text: "Try direct invocation, matching prompts, and near-miss prompts; verify both correct selection and the quality of the produced artifact."
---

**Codex skills are reusable workflows packaged as directories.** Each skill has a `SKILL.md` file containing a name, a description that controls when it should be considered, and instructions for completing the job. The directory can also hold scripts, reference material, templates, and assets.

Skills build on the open [Agent Skills](/glossary/agent-skills) standard. The same core format can travel across compatible agents, while Codex adds discovery paths, built-in creation and installation helpers, and plugin distribution.

## Skill, AGENTS.md, MCP, or prompt?

These surfaces solve different problems:

| Need | Use |
| --- | --- |
| A requirement for this task only | Prompt |
| A rule that should shape almost every change in this repository | [`AGENTS.md`](/guides/configuration/codex-agents-md) |
| A repeatable procedure that applies to a recognizable class of tasks | **Skill** |
| Live data or an action in an external system | [MCP](/guides/mcp/codex-mcp-setup) |
| Installable packaging for multiple skills and integrations | Plugin |

A release-note workflow is a skill. “Run lint before finishing” is repository guidance. Pulling the current issues from Linear needs MCP; the skill can define how to turn those issues into the release notes.

## The minimum skill

Create a folder whose name matches the skill, then add `SKILL.md`:

```text
.agents/
└── skills/
    └── summarize-incident/
        └── SKILL.md
```

```md
---
name: summarize-incident
description: >-
  Turn incident notes, alerts, and timeline events into a concise post-incident
  summary. Use when the user asks for an incident recap, customer-facing impact
  statement, or timeline synthesis. Do not perform root-cause analysis without evidence.
---

# Summarize an incident

1. Collect the incident window, affected services, user impact, and timeline.
2. Separate observed facts from hypotheses; label missing evidence.
3. Normalize timestamps to one timezone and order events chronologically.
4. Draft impact, timeline, mitigation, current status, and follow-up sections.
5. Return the summary plus a short list of unresolved questions.
```

Only `name` and `description` are required in the core format. The body is an instruction manual for the model, so write direct actions, not marketing copy.

## The description is the router

Codex initially sees skill metadata and loads the full body when a skill is selected. That makes the description load-bearing: it must distinguish this workflow from every neighboring skill before Codex has read the instructions.

A useful description contains three things in this order:

1. **Job** — what transformation or outcome the skill produces.
2. **Triggers** — concrete requests, artifacts, or situations that should select it.
3. **Boundary** — a close neighbor or risky action it should not absorb.

Weak: `Helps with incidents.`

Strong: `Turn incident notes, alerts, and timeline events into a concise post-incident summary. Use when the user asks for an incident recap, impact statement, or timeline synthesis. Do not infer root cause without evidence.`

Front-load the job and best trigger terms. Codex budgets the initial skills list, and very large installations may have descriptions shortened or some metadata omitted before any selected skill body is read.

## Where Codex finds skills

For repository skills, Codex scans `.agents/skills` directories from the current working directory upward to the repository root. This supports both project-wide and subtree-specific workflows. It also reads:

- `$HOME/.agents/skills` for personal skills across repositories.
- `/etc/codex/skills` for administrator-provided skills.
- System skills bundled with Codex.

The folder can be symlinked. If two discovered skills share a name, Codex does not merge them, so use distinct names rather than relying on one silently replacing the other.

In Codex CLI or the IDE extension, use `/skills` to browse skills or type `$` to mention one explicitly. Codex can also activate a skill implicitly when the request matches its description. Newly edited skills are normally detected automatically; restart Codex if an update does not appear.

## Use progressive disclosure

Keep the main `SKILL.md` focused on routing and procedure. Put supporting material beside it and tell the workflow exactly when to open or run it:

```text
summarize-incident/
├── SKILL.md
├── references/
│   └── severity-policy.md
├── templates/
│   └── postmortem.md
└── scripts/
    └── normalize_timeline.py
```

- **References** hold long policies, schemas, or product-specific details needed only for some cases.
- **Templates** make the output shape deterministic without bloating the instructions.
- **Scripts** are appropriate when exact parsing or transformation matters more than model judgment.
- **Assets** can provide images or other files the workflow consumes or emits.

This is progressive disclosure: metadata is always cheap, `SKILL.md` loads on selection, and heavyweight resources load only when a step needs them.

## Test selection, not just output

A skill can produce excellent work when manually invoked and still fail in daily use because its description never routes correctly. Test three layers:

1. **Explicit invocation** — mention the skill directly and confirm the workflow is internally sound.
2. **Positive routing** — try two or three natural user prompts that should select it automatically.
3. **Negative routing** — try near misses that belong to another skill or ordinary reasoning and confirm this skill stays out.

Then inspect the artifact: did it read the right inputs, respect its boundary, handle missing data, and return the promised output? Improve from observed misses, not imagined completeness.

> [!NOTE]
> Local folders are ideal while a workflow is evolving. Once it is stable and meant for other people — especially when it bundles multiple skills or MCP integration — package it as a plugin instead of asking users to copy directories by hand.

Official reference: [Build skills for ChatGPT and Codex](https://learn.chatgpt.com/docs/build-skills).

## Continue exploring

- [Codex Automations: Schedule Reliable Background Work](/guides/workflow/codex-automations) — Schedule Codex tasks for recurring checks and follow-ups — choose chat or standalone runs, local projects or worktrees, skills, permissions, and stopping rules.
