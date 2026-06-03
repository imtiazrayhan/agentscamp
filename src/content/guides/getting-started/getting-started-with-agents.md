---
title: "Getting Started with Claude Code Agents"
description: "What Claude Code subagents are, why they help, and how to add your first one."
author: "AgentsCamp"
date: 2026-05-02
color: "green"
topics: ["workflow-prompting"]
featured: true
related: ["code-reviewer"]
---

If you have used Claude Code for a while, you have probably noticed your main conversation getting crowded. You are reviewing code, writing tests, and debugging a deploy all in the same thread, and the context fills with details that have nothing to do with the task in front of you. Subagents are the fix. They let you hand off well-scoped jobs to a separate Claude instance that runs in its own context window and reports back a clean result.

This guide explains what a subagent is, how the `.claude/agents` file format works, how delegation actually happens, and walks you through a working hello-world agent.

## What a subagent is

A subagent is a specialized assistant that Claude Code can delegate to. Each one is defined by a single Markdown file with two parts: YAML frontmatter that describes the agent, and a body that becomes the agent's system prompt.

The important thing to understand is that a subagent runs in its own context window. When the main agent delegates a task, the subagent does its work in isolation and returns only its final answer. Your primary conversation stays focused, and the subagent's intermediate exploration never pollutes it.

This gives you three concrete benefits:

- **Context isolation.** A noisy task (reading dozens of files, running a test suite) does not bloat your main thread.
- **Specialization.** A focused system prompt makes the subagent better at one kind of work than a general-purpose assistant.
- **Reusability.** Once an agent file exists, you and your teammates can invoke it across projects.

> [!NOTE]
> Subagents are not the same as skills or slash commands. Skills are defined in a `SKILL.md` file and bundle reusable instructions and resources. Slash commands live in `.claude/commands` as Markdown files you trigger by name. Subagents are autonomous helpers that Claude delegates to on your behalf.

## The .claude/agents file format

Subagents live in one of two places:

- `.claude/agents/` in your project, for agents shared with the repo and your team.
- `~/.claude/agents/` in your home directory, for personal agents available everywhere.

Project-level agents take precedence when names collide. Each file is plain Markdown with frontmatter:

```markdown
---
name: test-runner
description: Runs the test suite and explains failures. Use proactively after code changes.
model: sonnet
color: blue
---

You are a focused test-running assistant.

When invoked:
1. Run the project's test command.
2. If tests fail, read the relevant files and explain the root cause.
3. Suggest the smallest fix, but do not apply it unless asked.

Keep your final report short: what passed, what failed, and why.
```

Here is what each frontmatter field does:

- **`name`** — a unique, lowercase, hyphenated identifier. This is how the agent is referenced.
- **`description`** — a natural-language summary of when this agent should be used. This field is the most important one for delegation (more on that below).
- **`model`** — which model the subagent runs on: `haiku`, `sonnet`, `opus`, or `inherit`. This field is optional and defaults to `inherit` (the agent follows the main session's model). Set it explicitly to pin a tier — `haiku` for cheap, fast jobs, `opus` for hard reasoning.
- **`color`** — a display color for the terminal UI. Cosmetic, but handy for telling agents apart.

Everything after the closing `---` is the system prompt. This is where you define the agent's role, its step-by-step process, and any constraints. Treat it like a job description: the more specific you are, the more reliable the agent.

### Optional: limiting tools

You can also restrict which tools an agent may use by adding a `tools` field. If you omit it, the subagent inherits the full tool set. A read-only reviewer, for example, might only need a few:

```yaml
tools: Read, Grep, Glob
```

> [!TIP]
> Start without a `tools` field while you iterate. Lock it down once you know exactly what the agent needs. Restricting tools is a great safety measure for agents that should never write files or run shell commands.

## How delegation works

This is the part people miss. You usually do not call a subagent by name. Instead, Claude Code decides when to delegate based on the `description` field.

When you give the main agent a task, it looks at the descriptions of all available subagents and matches your request against them. A description like "Use proactively after code changes" signals that the agent should be invoked automatically in that situation. So writing a good description is really writing the routing logic.

Two practical tips:

- Make the description state both **what** the agent does and **when** to use it.
- Use trigger phrases like "use proactively" or "must be used for X" when you want automatic delegation.

You can still invoke an agent explicitly when you want to. Just ask in plain language:

```text
Use the test-runner subagent to check whether my last change broke anything.
```

Claude will route that request to the matching agent, run it in a fresh context, and surface the result back into your conversation.

## A hello-world example

Let's create the simplest useful agent from scratch. From your project root:

```bash
mkdir -p .claude/agents
```

Create `.claude/agents/greeter.md` with this content:

```markdown
---
name: greeter
description: A friendly hello-world agent. Use to confirm subagents are wired up correctly.
model: haiku
color: green
---

You are a cheerful greeter used to verify that subagents work.

When invoked:
1. Greet the user by name if one is provided, otherwise greet them generally.
2. State which model you are running on.
3. Confirm in one sentence that the subagent system is working.

Keep your reply to three short lines. Do not use any tools.
```

Now restart Claude Code (or start a new session) so it picks up the new file, then ask:

```text
Use the greeter subagent to say hi.
```

Claude will delegate to `greeter`, which runs on Haiku in its own context and returns a short greeting. If you see that reply, your subagent setup is working end to end.

> [!NOTE]
> If the agent does not get picked up, double-check that the file is inside `.claude/agents/`, that the frontmatter is valid YAML between two `---` lines, and that the `name` is unique. A malformed frontmatter block is the most common reason an agent fails to load.

## Where to go next

You now have the full mental model: a subagent is a Markdown file with frontmatter and a system prompt, it runs in an isolated context, and Claude delegates to it based on the `description`. From here, the natural next steps are:

- Write a real agent for a task you do often, such as code review or test running.
- Tune the `model` field per agent to balance cost and capability.
- Add a `tools` allowlist once an agent's job is well defined.

Browse the agents in the AgentsCamp library for ready-made examples you can copy into `.claude/agents/` and adapt. The fastest way to learn is to drop a working agent into your project and start editing the system prompt to fit your workflow.
