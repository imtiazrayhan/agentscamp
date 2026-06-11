---
title: "Getting Started with Claude Code Agents"
description: "What Claude Code subagents are, why they help, and how to add your first one."
author: "AgentsCamp"
date: 2026-05-02
color: "green"
topics: ["workflow-prompting"]
featured: true
related: ["code-reviewer"]
summary: "Subagents are specialist assistants Claude Code delegates to — each a Markdown file in .claude/agents/ with frontmatter (name, description, optional model/tools) and a system-prompt body, running in its own context window and returning only its result. Delegation is routed by the description field, so writing it well is writing the routing logic."
keyTakeaways:
  - "A subagent runs in its own context window and returns a clean result — noisy exploration never pollutes your main thread."
  - "It's just a Markdown file: .claude/agents/ for the repo and team, ~/.claude/agents/ for personal agents everywhere; project files win on name collisions."
  - "The description field is the routing logic — state what the agent does AND when to use it; phrases like 'use proactively' trigger automatic delegation."
  - "model is optional and defaults to inherit; pin haiku for cheap mechanical jobs and opus for hard reasoning."
  - "A tools allowlist (e.g. Read, Grep, Glob) is the safety mechanism for agents that should never write files or run commands."
howtoSteps:
  - name: "Create the directory"
    text: "From your project root: mkdir -p .claude/agents — or use ~/.claude/agents for a personal agent available in every project."
  - name: "Write the agent file"
    text: "One Markdown file per agent: YAML frontmatter with name and description (plus optional model, color, tools), then a body that becomes the agent's system prompt. Treat the body like a job description — role, step-by-step process, constraints."
  - name: "Make the description route"
    text: "Claude delegates by matching your request against agent descriptions. Say what the agent does and when to use it; add 'use proactively after code changes' style triggers for automatic delegation."
  - name: "Reload and test"
    text: "Start a new session so the file is picked up, then invoke it explicitly: 'Use the test-runner subagent to check my last change.' If nothing happens, check the file path, the YAML frontmatter, and that the name is unique."
  - name: "Tighten over time"
    text: "Once the agent's job is well defined, pin the right model tier and add a tools allowlist. Start permissive while iterating; lock down when it stabilizes."
faq:
  - q: "What is a Claude Code subagent?"
    a: "A specialized assistant Claude Code can delegate work to — defined by a Markdown file whose frontmatter describes the agent and whose body is its system prompt. It runs in an isolated context window and returns only its final answer, which keeps your main conversation focused while a noisy task (reading dozens of files, running a suite) happens elsewhere."
  - q: "Where do subagent files live?"
    a: "Two places: .claude/agents/ inside a project (shared with the repo and your team) and ~/.claude/agents/ in your home directory (personal, available everywhere). When names collide, the project-level agent wins."
  - q: "How does Claude know when to use a subagent?"
    a: "It matches your request against every agent's description field — that one line is effectively the routing rule. Descriptions that state both the what and the when ('runs the test suite and explains failures; use proactively after code changes') get delegated to reliably. You can always invoke one explicitly by asking in plain language."
  - q: "Why isn't my subagent being picked up?"
    a: "The usual suspects: the file isn't actually in .claude/agents/, the frontmatter isn't valid YAML between two --- lines, the name isn't unique, or the session predates the file — start a new session so it loads. Malformed frontmatter is the most common cause."
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
