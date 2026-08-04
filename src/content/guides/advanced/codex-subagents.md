---
title: "Codex Subagents: Parallel Work Without Losing Control"
description: "Use Codex subagents for parallel exploration, review, tests, and implementation — including decomposition, custom agents, permissions, and merge discipline."
author: "AgentsCamp"
date: 2026-08-04
color: "cyan"
topics: ["ai-agents-systems", "workflow-prompting"]
tags: ["codex", "subagents", "multi-agent", "parallel", "custom-agents"]
featured: true
summary: "Codex subagents move bounded work into separate agent threads and return distilled results to the main conversation. They help when tasks are independent or generate noisy context, such as exploration, test analysis, and multi-angle review. Good orchestration assigns one outcome per agent, limits concurrent writes, preserves a single integration owner, and accounts for higher token use."
keyTakeaways:
  - "Parallelize independent work, not sequential dependencies; decomposition quality matters more than agent count."
  - "Read-heavy exploration, review, tests, and log analysis are safer first uses than several agents editing the same files."
  - "Give each subagent a bounded deliverable and require evidence or a compact summary back to the main thread."
  - "Subagents inherit the parent turn's live permission boundary unless a custom agent further narrows it."
  - "Keep one integration owner responsible for reconciling results, resolving conflicts, running checks, and reviewing the final diff."
faq:
  - q: "What is a Codex subagent?"
    a: "A subagent is a separate agent thread spawned by the main Codex conversation to handle a bounded task. It performs its own model and tool work, then returns a result or summary that the main thread can combine with other work."
  - q: "When should I use multiple Codex agents?"
    a: "Use them when work is genuinely independent or when intermediate output would clutter the main context: mapping separate subsystems, reviewing security and tests from different angles, running independent analyses, or researching several questions in parallel."
  - q: "Do Codex subagents use more tokens?"
    a: "Yes. Each subagent performs separate model and tool work, so multi-agent workflows generally consume more tokens than a comparable single-agent run. Use parallelism when faster completion, cleaner context, or specialist perspectives justify that cost."
  - q: "Can I create custom Codex agents?"
    a: "Yes. Put TOML agent files under .codex/agents for a project or ~/.codex/agents for personal use. Each file defines a name, description, and developer instructions, and can override settings such as model, reasoning effort, sandbox, MCP servers, and skills."
related: ["subagent", "multi-agent-orchestration", "building-multi-step-workflows", "codex-config-toml", "openai-codex-guide", "workflow-orchestrator", "context-engineering"]
---

**Codex subagents are separate agent threads that handle bounded parts of a larger task.** The main thread delegates work, subagents operate with their own context and tools, and the main thread collects their results into one response or implementation.

The feature is useful for two reasons. First, independent work can happen concurrently. Second, noisy exploration, test logs, and research stay out of the main conversation, where requirements and decisions need room to remain legible.

The trap is assuming more agents automatically means more progress. Parallelism amplifies the quality of your decomposition: clean boundaries become faster work; vague or overlapping boundaries become duplicated investigation, conflicting edits, and a larger review queue.

## What to delegate first

Good early subagent tasks are read-heavy and independently verifiable:

- Map three unrelated subsystems before planning a refactor.
- Review one diff separately for security, correctness, and missing tests.
- Run or inspect independent test suites and return only failures with likely owners.
- Research separate framework questions against official documentation.
- Triage logs from independent services or time windows.

Write-heavy delegation needs stronger boundaries. Two agents editing the same component tree or shared schema can create a conflict that costs more than the parallel run saved. Assign disjoint files, use isolated worktrees, or keep one agent as the sole editor while others return evidence and recommendations.

## Ask for a shape, not just “use agents”

A strong orchestration prompt defines roles, outputs, and the join point:

```text
Review this branch against main with three subagents:

1. Security reviewer: find exploitable behavior changes and cite files and lines.
2. Test reviewer: map changed behavior to existing tests and identify concrete gaps.
3. Maintainer: find correctness or maintainability risks, ignoring style-only issues.

All three are read-only. Wait for every result, deduplicate overlapping findings,
then return one severity-ordered report. Do not edit files.
```

This is better than “spawn three reviewers” because each worker has one lens, one artifact, and one boundary. The parent knows when to wait and how to consolidate.

## Design tasks around dependencies

Before delegating, draw the dependency shape:

```text
independent research ─┐
test inventory ───────┼─> implementation owner ─> verification ─> final review
API investigation ───┘
```

The first three tasks can run concurrently. Implementation cannot responsibly begin until their contracts are clear. Verification depends on the integrated change. Spawning all five at once would create speculative work rather than useful parallelism.

Use subagents for the branches, not every box. Keep the main thread responsible for requirements, architectural decisions, and the final acceptance criteria.

## Manage agent threads

In Codex CLI, `/agent` lets you inspect and switch between agent threads. Supported app and IDE surfaces expose subagent status and let you open individual threads. You can also ask Codex to steer a running agent, stop it, or close completed threads.

Do not monitor every line of output by default. Ask workers to return compact evidence:

- files and symbols inspected
- findings with severity or confidence
- commands run and results
- unresolved questions
- a recommendation to the parent, not a transcript

The point is to protect the main context from intermediate noise while preserving enough provenance to audit the conclusion.

## Permissions propagate

Subagents inherit the parent turn's live sandbox and approval choices. Select the parent permission boundary before delegating. A custom agent can narrow itself further — for example, a reviewer can set `sandbox_mode = "read-only"` — but do not assume a child will magically receive access the parent lacks.

Interactive approval requests can surface from an inactive thread. In headless workflows that cannot ask for a new approval, the protected action fails and the failure returns to the parent. Unattended multi-agent plans therefore need all required permissions and dependencies established before the fan-out begins.

## Create a custom agent

Codex includes general-purpose built-in roles. For repeatable specialization, create a TOML file in `.codex/agents/` for the repository or `~/.codex/agents/` for personal use:

```toml
# .codex/agents/security-reviewer.toml
name = "security_reviewer"
description = "Read-only reviewer for exploitable behavior, trust boundaries, and unsafe data flow."
sandbox_mode = "read-only"
model_reasoning_effort = "high"
developer_instructions = """
Review only for security-relevant behavior.
Trace untrusted input to sensitive sinks, cite concrete files and symbols,
and distinguish exploitable findings from hardening suggestions.
Do not edit files. Return findings ordered by severity with reproduction steps.
"""
```

The required fields are `name`, `description`, and `developer_instructions`. Other supported Codex settings can specialize the model, reasoning effort, sandbox, MCP servers, or enabled skills. If a custom agent omits them, Codex resolves them from explicit spawn values, agent defaults, and the parent configuration.

Keep the description about when the role should be used. Keep `developer_instructions` about how it behaves once selected. A narrow role is easier for the parent to route and easier for a reviewer to trust.

## Put global limits in config

Configure the overall system under `[agents]` in [`config.toml`](/guides/configuration/codex-config-toml):

```toml
[agents]
enabled = true
max_concurrent_threads_per_session = 4
default_subagent_reasoning_effort = "medium"
```

Cap concurrency at the number of useful independent tasks, not the largest number the client permits. Every agent creates token cost, tool load, coordination work, and output someone must review.

## One owner integrates

A successful multi-agent workflow ends with a single owner who:

1. Waits for the required results.
2. Reconciles contradictions and removes duplicate findings.
3. Applies or merges changes in a controlled order.
4. Runs the complete verification suite on the integrated state.
5. Reviews the final diff against the original goal.

Subagents can accelerate branches of work. They do not remove the need for one coherent definition of done.

> [!TIP]
> If two agent prompts contain the same files, the same verbs, and the same deliverable, the work probably is not parallel. Redraw the boundary before you spawn them.

Official reference: [Codex subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents).
