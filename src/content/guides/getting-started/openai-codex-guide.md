---
title: "OpenAI Codex: A Practical Guide for Developers"
description: "Learn how OpenAI Codex works across the terminal, IDE, desktop app, and cloud — then set up a safe, repeatable workflow for real repositories."
author: "AgentsCamp"
date: 2026-08-04
color: "cyan"
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["codex", "openai", "coding-agent", "cli", "workflow"]
featured: true
summary: "OpenAI Codex is a coding agent that can inspect a repository, edit files, run commands, review changes, and work across terminal, IDE, desktop, and cloud surfaces. The reliable workflow is the same everywhere: give it a concrete goal, the relevant context and constraints, and an observable definition of done; then let it implement, test, and review its own diff."
keyTakeaways:
  - "Codex is an agent, not autocomplete: give it outcomes and verification criteria, then let it inspect, edit, run, and iterate."
  - "Use the CLI for terminal-first local work, the IDE extension for editor-attached work, the desktop app for planning and parallel work, and cloud tasks for offloaded execution."
  - "A strong task prompt names the goal, relevant context, constraints, and what must be true before the task is done."
  - "Put durable repository rules in AGENTS.md; keep one-off requirements in the prompt and reusable procedures in skills."
  - "Start with scoped permissions, review the diff, and require the relevant tests or checks before accepting a change."
faq:
  - q: "What is OpenAI Codex?"
    a: "Codex is OpenAI's coding agent for understanding, changing, reviewing, and debugging software. It can work in a local repository through the terminal, IDE extension, or desktop app, and can also run hosted tasks in the cloud."
  - q: "Is Codex the same as ChatGPT?"
    a: "Codex is the software-development experience within OpenAI's product family. Chat is optimized for conversation; Codex adds repository context and developer tools so it can inspect files, edit code, run commands, test changes, and review diffs."
  - q: "Which Codex surface should I use?"
    a: "Use the CLI when the terminal is your center of gravity, the IDE extension when you want editor context, the desktop app for interactive planning and multiple workstreams, and cloud tasks when work should continue in a hosted environment. The same repository can use more than one surface."
  - q: "How do I get better results from Codex?"
    a: "State the goal, point to relevant files or errors, name constraints, and define done with observable checks. Add stable build commands and conventions to AGENTS.md, and ask Codex to run tests and review the final diff before it stops."
related: ["codex-cli", "claude-code-vs-codex-cli", "codex-agents-md", "codex-skills-guide", "codex-mcp-setup", "agents-md", "agent-skills"]
---

**OpenAI Codex is a software-development agent: it can inspect a repository, plan a change, edit files, run commands, test the result, and review its own diff.** The useful mental model is not “a chatbot that writes code snippets,” but a teammate operating inside a bounded development environment.

Codex is available through several surfaces. The [CLI](/tools/codex-cli) is terminal-first; the IDE extension stays close to the editor; the desktop app is suited to planning, review, and concurrent work; cloud tasks move execution to a hosted environment. The interface changes, but the core loop does not: give Codex a goal and enough context, let it work, then inspect evidence that the outcome is correct.

## Choose the surface around the work

| Surface | Best fit | What stays close |
| --- | --- | --- |
| **CLI** | Local repository work driven from the terminal | Shell commands, Git, logs, and the current working directory |
| **IDE extension** | Focused implementation while you are already editing | Open files, selections, diagnostics, and the editor diff |
| **Desktop app** | Planning, review, longer tasks, and parallel workstreams | Projects, chats, worktrees, files, and visual review |
| **Cloud** | Work you want to offload to a hosted environment | A configured repository and reproducible environment |

This is not a permanent choice. A task can begin as a plan in the app, move into a local implementation, and finish with review in the IDE. What matters is that the environment has the code, dependencies, permissions, and verification commands the task needs.

## Write a task Codex can finish

The most reliable prompt has four parts:

1. **Goal** — the observable outcome, not a vague activity.
2. **Context** — the files, errors, examples, issue, or existing behavior that matters.
3. **Constraints** — compatibility, architecture, safety, scope, and things that must not change.
4. **Done when** — tests, behavior, or checks that prove the work is complete.

```text
Add retry handling to the billing API client.

Context: src/billing/client.ts and its Vitest suite. Requests currently fail
immediately on a transient 429.

Constraints: preserve the public method signatures, retry only 429 and 5xx,
cap the delay, and do not add a dependency.

Done when: the focused tests cover success, retry, and non-retryable failure;
then run typecheck and review the final diff for unrelated changes.
```

That prompt gives the agent room to investigate while making the finish line hard to misunderstand. For a difficult or ambiguous change, start in Plan mode or explicitly ask for a plan before implementation. Planning is most valuable when the cost of choosing the wrong direction is much larger than the cost of reading a short design first.

## Put each kind of instruction in the right place

Codex has several customization layers, and reliability improves when each carries one kind of information:

- **Prompt** — requirements that belong only to this task.
- **[`AGENTS.md`](/guides/configuration/codex-agents-md)** — durable repository conventions, commands, boundaries, and definitions of done.
- **[Skill](/guides/skills/codex-skills-guide)** — a reusable workflow Codex should recognize and follow for a recurring job.
- **`.codex/config.toml`** — operational settings such as sandboxing, approvals, model defaults, and [MCP servers](/guides/mcp/codex-mcp-setup).
- **MCP** — live context or controlled actions in systems outside the repository.

Do not paste your entire engineering handbook into every request. Put the stable minimum in `AGENTS.md`, link to deeper reference files when necessary, and keep the task prompt about the task.

## Use a closed-loop workflow

The productive Codex loop has five steps:

1. **Orient.** Ask it to inspect the relevant code and existing conventions before editing.
2. **Plan when needed.** Review the proposed approach for cross-cutting or high-risk work.
3. **Implement.** Let it make the smallest cohesive change that reaches the goal.
4. **Verify.** Run focused tests first, then the broader lint, type, build, or integration checks appropriate to the risk.
5. **Review.** Read the diff for unintended scope, weak error handling, missing tests, and behavior that the checks did not exercise.

“Code written” is not a useful stopping condition. “The behavior changed, the regression test passes, the repository checks are green, and the diff contains no unrelated edits” is.

## Keep the execution boundary deliberate

Codex separates what it is technically allowed to do from when it must ask. Sandbox settings bound filesystem and network access; approval settings govern interruptions for actions outside the normal boundary. Begin with workspace-scoped access on repositories you know, and use read-only work when you only need analysis or a plan.

Broader access is sometimes necessary — installing packages, reaching a remote API, or working across directories — but it should follow from the task. Treat external content as untrusted, keep secrets out of prompts and logs, and use version control so every edit is inspectable and recoverable.

> [!TIP]
> The fastest improvement is usually not a longer prompt. Add the correct test command and the repository's sharpest constraint to `AGENTS.md`, then require Codex to verify both before it stops.

## A useful first week

Start with tasks whose results are easy to inspect: add a focused test, explain an unfamiliar module, fix a reproducible bug, or refactor a small boundary without changing behavior. Once that loop is predictable, encode repeated corrections in `AGENTS.md`, turn recurring procedures into [skills](/guides/skills/codex-skills-guide), and connect outside systems through [MCP](/guides/mcp/codex-mcp-setup) only when they remove a real copy-and-paste workflow.

The goal is not maximum autonomy. It is a system where you can state an outcome, let the agent work inside a clear boundary, and decide whether to accept the result from evidence rather than optimism.

Official references: [Codex best practices](https://learn.chatgpt.com/guides/best-practices), [Codex CLI](https://learn.chatgpt.com/docs/codex/cli), and [agent approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security).
