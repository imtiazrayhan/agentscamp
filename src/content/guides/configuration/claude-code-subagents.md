---
title: "Claude Code Subagents Explained: Built-ins, Frontmatter, Forks, and Limits"
seoTitle: "Claude Code Subagents: Built-ins, Frontmatter Fields, Forks, Limits"
description: "How Claude Code subagents work now: built-in agents, file locations and precedence, every frontmatter field, background runs, nesting, forks, and limits."
author: "Imtiaz Rayhan"
date: 2026-11-18
reviewed: 2026-11-22
color: "green"
depth: standard
topics: ["ai-agents-systems", "workflow-prompting"]
audience: ["developers"]
tags: ["claude-code", "subagents", "agents", "delegation", "configuration", "reference"]
keywords: ["Claude Code subagents", "Claude Code subagent frontmatter", "Claude Code /agents", "Claude Code fork subagent", "Claude Code background subagents", "Claude Code nested subagents"]
summary: "A Claude Code subagent is a delegate with its own context window, system prompt, tools and permissions, defined in a Markdown file under .claude/agents/ or ~/.claude/agents/. Subagents now run in the background by default, can nest three layers deep, and forks inherit the whole conversation. The /agents wizard is gone: ask Claude or edit the files."
keyTakeaways:
  - "The /agents wizard was removed in v2.1.198. Running /agents now prints a reminder; create and manage subagents by asking Claude or by editing .claude/agents/ and ~/.claude/agents/ directly."
  - "Only name and description are required. There are 19 frontmatter fields in all, from tools and model to isolation, memory and omitClaudeMd, and misspelled fields are silently ignored."
  - "Subagents spawned from the main conversation start in the background by default, 20 can run at once, and a subagent can spawn its own up to three layers below the main conversation."
  - "A non-fork subagent sees none of your chat history but does load the CLAUDE.md hierarchy and a git status snapshot. A fork inherits the entire conversation, and fork mode is on by default from v2.1.302."
  - "The model comes from the per-call model, then the file's model field, then CLAUDE_CODE_SUBAGENT_MODEL, then the parent's model. Before v2.1.251 the environment variable won."
  - "Plan around the limits: subagent requests count toward your usage limits, Bash can still change files in an agent without Edit or Write, plugin subagents ignore hooks, mcpServers and permissionMode, and subagent edits usually aren't checkpointed."
howtoSteps:
  - name: "Choose the scope"
    text: "Put the file in .claude/agents/ to share it with the project, or in ~/.claude/agents/ for all your projects. If two definitions share a name, the higher-priority location wins."
  - name: "Write the file or ask Claude to"
    text: "Ask Claude to create the subagent, or write a Markdown file with name and description in the frontmatter and the system prompt as the body. The filename doesn't have to match the name."
  - name: "Check that it loads"
    text: "Run claude plugin validate .claude/agents to catch parse errors. Claude Code watches the agents directories and picks up changes within a few seconds, with no restart."
  - name: "Invoke it explicitly once"
    text: "@-mention the agent or name it in plain language, then run /tasks to see it running and which model it uses. Once it works, tighten the description so automatic delegation picks it."
faq:
  - q: "Where did the /agents menu go in Claude Code?"
    a: "It was removed in v2.1.198. Running /agents now prints a reminder to ask Claude to create or manage subagents, or to edit .claude/agents/ and ~/.claude/agents/ directly. On v2.1.197 and earlier it opened an interactive wizard. The separate claude agents command opens agent view for background sessions, which is a different feature."
  - q: "Can a Claude Code subagent spawn other subagents?"
    a: "Yes. By default a subagent can spawn subagents of its own, up to three layers below the main conversation. CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH changes the limit, and setting it to 1 turns nesting off. The default was 1 in v2.1.217 and v2.1.218 and became 3 in v2.1.219."
  - q: "Do Claude Code subagents run in the background?"
    a: "Yes, by default. With nothing configured, a subagent other than web-fetch that Claude spawns from the main conversation starts in the background, and its permission prompts surface in your main session with the subagent's name. In claude -p and SDK runs, Claude can wait for a subagent on its own judgment or when you ask."
  - q: "What does a subagent inherit from the main conversation?"
    a: "A regular subagent doesn't see your conversation history, the files Claude has read or the skills already invoked. It starts with its own system prompt, the task message, the CLAUDE.md hierarchy, a git status snapshot and any preloaded skills; Explore, Plan and web-fetch skip CLAUDE.md. A fork is the exception: it inherits the entire conversation so far."
  - q: "What is a fork in Claude Code?"
    a: "A fork is a subagent that inherits the whole conversation instead of starting fresh, and it shares the parent's prompt cache. Start one yourself with /subtask followed by the task. Fork mode is on by default from v2.1.302 (v2.1.232 in interactive terminal sessions), a fork can't spawn further forks, and you can turn forks off with Agent(fork) in permissions.deny or CLAUDE_CODE_FORK_SUBAGENT=0."
  - q: "How many subagents can run at once?"
    a: "Twenty by default. When 20 subagents are running in a session, spawning another fails with Concurrent subagent limit reached. CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS changes the cap (v2.1.217 or later). There is no limit on the total number of subagents Claude can spawn over a session."
sources:
  - title: "Create custom subagents"
    url: "https://code.claude.com/docs/en/sub-agents"
    publisher: "Anthropic"
  - title: "Commands reference"
    url: "https://code.claude.com/docs/en/commands"
    publisher: "Anthropic"
  - title: "Environment variables"
    url: "https://code.claude.com/docs/en/env-vars"
    publisher: "Anthropic"
  - title: "Agent teams"
    url: "https://code.claude.com/docs/en/agent-teams"
    publisher: "Anthropic"
  - title: "Model configuration"
    url: "https://code.claude.com/docs/en/model-config"
    publisher: "Anthropic"
  - title: "Claude Code changelog"
    url: "https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md"
    publisher: "Anthropic"
related: ["guide:writing-a-custom-agent", "glossary:subagent", "guide:skills-vs-agents-vs-commands", "guide:multi-agent-orchestration", "agent:agent-architect", "command:create-subagent", "guide:getting-started-with-agents", "guide:claude-code-checkpoints", "guide:claude-code-headless-mode", "tool:claude-code"]
---

A [subagent](/glossary/subagent) is a delegate Claude hands work to. Anthropic's definition: "Each subagent runs in its own context window with a custom system prompt, specific tool access, and independent permissions. It also sends its own requests, which count toward the same usage limits as your main conversation."

This page is the reference for how subagents behave in [Claude Code](/tools/claude-code) as of November 2026 (release 2.1.330): what ships built in, where files load from, every frontmatter field, and how background, parallel, nested and forked runs work. It doesn't repeat the authoring walkthrough. For scoping a job, writing the description and keeping the prompt short, see [Writing your first custom agent](/guides/getting-started/writing-a-custom-agent).

## What changed in 2026

Many walkthroughs online predate these changes:

- **v2.1.63 (February 2026):** the Task tool was renamed Agent. "Existing `Task(...)` references in settings and agent definitions still work as aliases."
- **v2.1.77 (March 2026):** the Agent tool lost its `resume` parameter. Resuming goes through `SendMessage`.
- **v2.1.198 (July 2026):** "Removed the `/agents` wizard; ask Claude to create or manage subagents, or edit `.claude/agents/` directly." In the same release, subagents began running in the background by default.
- **v2.1.217 and v2.1.219 (July 2026):** a nesting depth limit and a concurrency cap arrived; the default depth went from 1 to 3.
- **v2.1.232 (August 2026):** forking on by default in interactive sessions, and everywhere from v2.1.302.
- **v2.1.251 (August 2026):** `CLAUDE_CODE_SUBAGENT_MODEL` stopped overriding the frontmatter and per-call model.

## Built-in subagents

| Name | Model | What it's for |
| --- | --- | --- |
| Explore | Parent's model (with exceptions for Fable) | "A fast, read-only agent optimized for searching and analyzing codebases"; Write and Edit are denied |
| Plan | Inherits from parent | "A research agent used during plan mode to gather context before presenting a plan" |
| general-purpose | Parent's model | "A capable agent for complex, multi-step tasks that require both exploration and action"; gets every tool available to subagents |
| claude | Follows the model order | Tasks that don't fit a more specialized agent; the default for dispatched background sessions |
| statusline-setup | Sonnet | Runs when you use `/statusline` |
| claude-code-guide | Haiku | Answers questions about Claude Code features |
| web-fetch | Haiku, or the parent's model if it can't use Haiku | Reads web pages in sessions that use it |

Explore takes a thoroughness level of "quick", "medium" or "very thorough". Explore and Plan "start without your CLAUDE.md files and the git status snapshot." To switch built-ins off, deny `Agent(Explore)` in `permissions.deny`, set `CLAUDE_CODE_DISABLE_EXPLORE_PLAN_AGENTS=1` (v2.1.198 or later), or, in `-p` and SDK runs only, set `CLAUDE_AGENT_SDK_DISABLE_BUILTIN_AGENTS=1`.

## Where subagent files live

| Location | Scope | Priority |
| --- | --- | --- |
| Managed settings (`.claude/agents/` in the managed settings directory) | Organization | 1 (highest) |
| `--agents` CLI flag | Current session | 2 |
| `.claude/agents/` | Current project | 3 |
| `~/.claude/agents/` | All your projects | 4 |
| A plugin's `agents/` directory | Where the plugin is enabled | 5 (lowest) |

Project discovery walks up from the working directory, and "when more than one of these nested directories defines the same `name`, Claude Code uses the definition closest to the working directory." Directories are scanned recursively, but "identity comes only from the `name` frontmatter field"; for plugins, subfolders become part of a scoped ID such as `my-plugin:review:security`.

Edits take effect without a restart: Claude Code "detects the change within a few seconds and the next delegation uses the updated definition." The exceptions are `--add-dir` directories and sessions started with `--disable-slash-commands`. Claude Code skips a file whose `---` isn't on the first line, whose YAML doesn't parse, or whose `name` is missing, starts with `-`, contains `:`, runs past 256 characters or has no `description`. `claude plugin validate .claude/agents` reports parse errors. Descriptions cost context: past 15,000 tokens of combined custom descriptions, you get a startup warning.

## Every frontmatter field

"Only `name` and `description` are required," and misspelled fields are silently ignored.

| Field | What it does |
| --- | --- |
| `name` | Unique ID, at most 256 characters, no `:`. "The filename doesn't have to match" |
| `description` | "When Claude should delegate to this subagent" |
| `tools` | Comma-separated or YAML list; inherits every tool available to subagents if omitted |
| `disallowedTools` | Removes tools; a scoped entry such as `Bash(git push *)` still removes the whole tool |
| `model` | `sonnet`, `opus`, `haiku`, `fable`, a full ID such as `claude-opus-5-5`, or `inherit` |
| `permissionMode` | `default`, `acceptEdits`, `auto`, `dontAsk`, `bypassPermissions`, `plan`, or `manual` |
| `maxTurns` | Turn cap; the subagent returns its output marked as partial |
| `autoCompactWindow` | Compaction threshold of `100000` tokens or more (v2.1.296 or later) |
| `skills` | Skills preloaded in full at startup (first 32 names) |
| `mcpServers` | Names of configured servers, or inline definitions |
| `hooks` | Lifecycle hooks scoped to this subagent |
| `memory` | `user`, `project` or `local` cross-session memory, stored under `agent-memory` folders |
| `background` | `true` keeps it in the background even when Claude asks to wait |
| `omitClaudeMd` | Start without CLAUDE.md files (v2.1.271 or later) |
| `effort` | `low`, `medium`, `high`, `xhigh` or `max` |
| `isolation` | `worktree` runs it in a temporary git worktree, branched by default from your default branch, removed if unchanged |
| `color` | `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink` or `cyan` |
| `initialPrompt` | Auto-submitted first turn when the agent runs as the main session agent |
| `experimental` | A map; `cacheTtl` accepts `5m` or `1h` (v2.1.248 or later) |

A fictional example that uses the newer fields:

```markdown
---
name: changelog-scout
description: Summarizes merged changes for release notes. Use proactively before a release.
tools: Read, Grep, Glob
model: haiku
maxTurns: 15
memory: project
background: true
omitClaudeMd: true
---

You read the git history and changed files for the current release
and return a grouped list of user-facing changes. Edit nothing.
```

**Model resolution.** Claude Code picks the model in this order: the per-invocation `model` parameter (aliases only), the file's `model` field (including `inherit`), `CLAUDE_CODE_SUBAGENT_MODEL`, then the main conversation's model, or the spawning subagent's model for nested runs. "Before v2.1.251, this variable overrode both the per-invocation model and the definition's `model` field." To force one model everywhere, set `CLAUDE_CODE_SUBAGENT_MODEL` with `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` (v2.1.257 or later). "There is no per-subagent thinking setting." `/tasks` shows which model a running subagent uses.

**Tools.** "Subagents inherit the built-in tools and MCP tools available in the main conversation, narrowed by two filters." Some tools are always removed, including `AskUserQuestion`, `EnterPlanMode`, `ScheduleWakeup` and `Workflow`, and `Agent` disappears at the depth limit. Background subagents get a fixed list: "Don't rely on other built-in tools in a background subagent." And Bash is not read-only. The docs' example with only Read, Grep, Glob and Bash "has no Edit, Write, or MCP tools but can still change files through Bash." Listing `Agent(worker, researcher)` in `tools` limits which agent types can be spawned, but only for an agent running as the main thread with `claude --agent`.

## Creating subagents now that /agents is gone

"Running `/agents` prints a reminder to ask Claude or edit `.claude/agents/` and `~/.claude/agents/` directly." The docs' quickstart is to "ask Claude to write it for you, or write the file yourself." The [create-subagent](/commands/workflow/create-subagent) command and the [agent-architect](/agents/meta-orchestration/agent-architect) agent help with both, and the [agents directory](/agents) has ready-made files.

For a session-only subagent, pass JSON:

```bash
claude --agents '{"code-reviewer": {"description": "Reviews diffs for bugs", "prompt": "You review code changes.", "tools": ["Read","Grep","Glob","Bash"], "model": "sonnet"}}'
```

The flag accepts the file fields as keys, with `prompt` for the body, but "`color` and `experimental` aren't accepted here and are ignored." With `-p`, the value can be a path to a JSON file; the [headless mode guide](/guides/configuration/claude-code-headless-mode) covers scripted runs.

"Subagents work within a single session," and two similarly named features are separate. `claude agents` opens agent view for background sessions. Agent teams are their own feature, and as of November 2026 they "are experimental and disabled by default" (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` turns them on).

## How delegation works

**Automatic.** "Claude automatically delegates tasks based on the task description in your request, the `description` field in subagent configurations, and current context. To encourage proactive delegation, include phrases like 'use proactively' in your subagent's description field."

**Explicit.** Name the agent in plain language ("Use the test-runner subagent to fix failing tests"), @-mention it as `@"code-reviewer (agent)"` or `@agent-<name>`, or run a whole session as one agent with `claude --agent code-reviewer` or `"agent": "code-reviewer"` in `.claude/settings.json`. In that last case the agent's prompt "replaces the default Claude Code system prompt entirely."

## What a subagent sees

"Each subagent starts with a fresh, isolated context window. It doesn't see your conversation history, the skills you've already invoked, or the files Claude has already read." A non-fork subagent starts with its own system prompt plus environment details, the task message, "every level of the CLAUDE.md hierarchy the main conversation loads", a git status snapshot, preloaded skills, and a roster of sibling agents when it has `SendMessage`. It doesn't inherit your output style, auto memory or the parent's context window size. Anything you agreed in conversation has to be restated in the task. [Skills vs agents vs commands](/guides/skills/skills-vs-agents-vs-commands) covers when that isolation is worth having.

## Background, parallel and nested runs

- **Background by default.** "With nothing configured, a subagent other than `web-fetch` that Claude spawns from your main conversation starts in the background." Its permission prompts surface in your main session with its name. Ctrl+B sends a waiting subagent to the background, and `CLAUDE_CODE_FORK_SUBAGENT=0` lets Claude wait for a subagent when you ask in interactive sessions. In `claude -p` and the SDK, "Claude can wait, on its own judgment or when you ask."
- **Parallel.** A prompt like "Research the authentication, database, and API modules in parallel using separate subagents" fans out. "Running many subagents that each return detailed results can consume significant context." When parallel agents edit files, `isolation: worktree` keeps them apart; see [parallel worktrees](/guides/advanced/parallel-claude-code-worktrees).
- **Concurrency.** At 20 running subagents, another spawn fails with `Concurrent subagent limit reached`. Change it with `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`. "There's no limit on the total number of subagents Claude can spawn over a session."
- **Nesting.** "By default, a subagent can spawn subagents of its own, up to three layers below the main conversation." `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=1` turns nesting off.

## Forks

"A fork is a subagent that inherits the entire conversation so far instead of starting fresh." Start one yourself with `/subtask <task>`. A fork shares the parent's prompt cache, and "a fork can't spawn further forks." "Fork mode is on by default from Claude Code v2.1.302, and in an interactive terminal session from v2.1.232." Turn it off with `"Agent(fork)"` in `permissions.deny` or `CLAUDE_CODE_FORK_SUBAGENT=0`.

## Resuming a subagent

"Each subagent invocation creates a new instance." To continue earlier work, ask Claude to resume it; Claude uses `SendMessage` with the agent's ID or name, and the subagent keeps its full history. Transcripts live at `~/.claude/projects/{project}/{sessionId}/subagents/agent-{agentId}.jsonl` and are deleted after `cleanupPeriodDays` (30 days by default). Explore and Plan "can finish without giving Claude an ID to resume them with."

## Limitations

- Subagent requests count toward the same usage limits as your conversation.
- A non-fork subagent "starts fresh and may need time to gather context."
- Thinking settings come from the parent; there's no per-subagent setting.
- Plugin subagents ignore `hooks`, `mcpServers` and `permissionMode`.
- When the parent runs in `bypassPermissions`, `acceptEdits` or auto mode, that mode overrides the subagent's `permissionMode`.
- Background subagents get a reduced tool set.
- Subagent edits usually aren't captured by checkpoints, so `/rewind` won't undo them. The [checkpoints guide](/guides/getting-started/claude-code-checkpoints) has the details, and [multi-agent orchestration](/guides/advanced/multi-agent-orchestration) covers patterns built on these pieces.
