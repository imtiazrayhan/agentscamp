---
name: "Taskmaster"
title: "Taskmaster (task-master-ai)"
description: "Taskmaster (task-master-ai) turns a PRD into dependency-ordered tasks and subtasks that your coding agent works through, from a CLI or an MCP server."
seoDescription: "Taskmaster (task-master-ai) in November 2026: PRD-to-tasks CLI and MCP server, Claude Code setup, MIT WITH Commons-Clause license, and release status."
date: 2026-11-14
reviewed: 2026-11-22
url: "https://github.com/eyaltoledano/claude-task-master"
pricing: "free"
category: "cli"
repo: "https://github.com/eyaltoledano/claude-task-master"
license: "MIT WITH Commons-Clause"
os: ["macOS", "Windows", "Linux"]
color: "green"
topics: ["ai-agents-systems", "workflow-prompting"]
audience: ["developers"]
tags: ["taskmaster", "task-master-ai", "spec-driven", "prd", "mcp", "task-management"]
featured: false
alternativeTo: ["spec-kit", "kiro"]
sameAs:
  - "https://www.npmjs.com/package/task-master-ai"
  - "https://tryhamster.com/docs/taskmaster"
related: ["tool:spec-kit", "tool:kiro", "tool:claude-code", "guide:best-spec-driven-development-tools-2026", "guide:spec-driven-development", "glossary:spec-driven-development", "command:breakdown-task", "guide:claude-code-mcp-setup"]
keywords: ["Taskmaster", "task-master-ai", "Taskmaster AI", "Taskmaster MCP", "Taskmaster Claude Code", "PRD to tasks"]
summary: "Taskmaster (npm task-master-ai) is a free task manager for AI coding agents. It parses a PRD into tasks with dependencies, scores their complexity, expands them into subtasks and tells the agent what to do next, through a CLI or an MCP server. Its license is MIT WITH Commons-Clause, and the last release was 0.43.1 on March 31, 2026."
faq:
  - q: "Is Taskmaster open source?"
    a: "It is source-available rather than OSI open source. The LICENSE is MIT plus the Commons Clause, and package.json declares MIT WITH Commons-Clause. You can use and modify it for free, but the clause removes the right to sell the software, and the README lists offering Task Master as a hosted service or building competing products on it as not allowed."
  - q: "How do I install Taskmaster?"
    a: "With npm: npm install -g task-master-ai, then task-master init in your project (or npx task-master init without a global install). It needs Node.js 20 or later. To use it as an MCP server in Claude Code instead, run claude mcp add taskmaster-ai -- npx -y task-master-ai."
  - q: "Does Taskmaster need an API key?"
    a: "Usually, but not always. Taskmaster calls a model to parse PRDs, expand tasks and run research, and you put provider keys in your project's root .env file or in the env section of the MCP config. Its Claude Code provider needs no API key, only the Claude Code CLI, and its Codex CLI provider uses OAuth through a ChatGPT subscription."
  - q: "Is Taskmaster still maintained?"
    a: "Activity has slowed. The latest npm release is 0.43.1, published March 31, 2026, a 1.0.0-rc.1 build has carried the rc tag since February 18, 2026, and the last commit on GitHub was on April 23, 2026. The documentation has moved to tryhamster.com, home of Hamster, which offers team sync and hosted AI on top of Taskmaster."
---

Taskmaster is the task layer for AI-assisted coding. Its README introduces it as "a task management system for AI-driven development, designed to work seamlessly with any AI chat", and the product page sums up the flow as "PRD → Tasks → Subtasks → Done". You write a product requirements document. Taskmaster has a model turn it into numbered tasks with dependencies, and your coding agent then works through them one at a time, asking Taskmaster what comes next instead of guessing from a long chat. It is built by Eyal Toledano and Ralph Khreish, ships on npm as `task-master-ai`, and runs both as a CLI and as an MCP server, so [Claude Code](/tools/claude-code), Cursor and other agents can call it directly.

Taskmaster sits in the [spec-driven development](/guides/workflow/spec-driven-development) family, but it starts later in the loop than most. [Spec Kit](/tools/spec-kit) and [Kiro](/tools/kiro) help you write the spec and plan. Taskmaster assumes you have a PRD and concentrates on decomposing it and tracking progress. Two caveats matter before you adopt it. The license is MIT WITH Commons-Clause, not plain MIT. And development has slowed: the last release was 0.43.1 on March 31, 2026. It had about 28,500 GitHub stars as of November 2026.

## Highlights

- **PRD in, task graph out.** For new projects the README says to "create your PRD at `.taskmaster/docs/prd.txt`", then run `task-master parse-prd`. Use `--num-tasks=10` to cap how many tasks it creates.
- **Complexity before code.** `analyze-complexity` scores each task (its `--threshold` runs from 1 to 10), `complexity-report` shows the results, and `expand` splits heavy tasks into subtasks, for one task, `--all`, or with `--research`.
- **Dependencies you can check.** `add-dependency`, `remove-dependency`, `validate-dependencies` and `fix-dependencies` keep the order honest, and `next` returns the next task that is ready to work on.
- **Three model roles.** "You can define 3 types of models to be used: the main model, the research model, and the fallback model."
- **Many providers.** Provider modules include Anthropic, Azure, Bedrock, Google Vertex, OpenAI, OpenRouter, Ollama, LM Studio, Groq, Perplexity and xAI. Its Claude Code provider runs with "no API key required - requires Claude Code CLI".
- **Tags for parallel work.** "Use tags to keep task lists separate", and `move --from= --from-tag= --to-tag=` shifts tasks between them.
- **Control over context cost.** "By default, all 36 tools are loaded (~21,000 tokens)." Set `TASK_MASTER_TOOLS` to `standard` (15 tools, about 10,000 tokens), `core` or `lean` (7 tools, about 5,000 tokens), or a custom list, so the MCP server takes less of your [context window](/glossary/context-window).

## In an AI-assisted workflow

Install the CLI globally and initialize a project. Taskmaster needs Node.js 20 or later.

```bash
npm install -g task-master-ai
task-master init                        # or: npx task-master init
task-master init --rules cursor,windsurf,vscode   # add editor rule files
task-master parse-prd .taskmaster/docs/prd.txt --num-tasks=10
task-master analyze-complexity
task-master expand --all
task-master next
```

To let Claude Code drive it, register the MCP server. Put your provider keys in the project's root `.env` or in the MCP config's `env` section:

```bash
claude mcp add taskmaster-ai -- npx -y task-master-ai
```

From then on the loop is conversational. Ask the agent for the next task, have it implement and test that one task, then mark it with `task-master set-status --id=<id> --status=done` or the matching MCP tool. Keep each task small enough for one focused session. If you would rather stay inside Claude Code's own commands, the [breakdown-task](/commands/plan/breakdown-task) command gives a lighter version of the same decomposition. [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup) covers scopes if you want the server shared through `.mcp.json`.

> [!TIP]
> Start with `TASK_MASTER_TOOLS=core` in the server's `env`: 7 tools at about 5,000 tokens instead of all 36 at about 21,000. Move to `standard` only if the agent keeps reaching for a tool the core set leaves out.

## Good to know

**License.** The LICENSE file is the MIT License plus the "Commons Clause" License Condition v1.0, which states that "the grant of rights under the License will not include … the right to Sell the Software". The README's "Not Allowed" list adds offering Task Master as a hosted service and creating competing products based on it. That is fine for using it on your own projects. It is not OSI open source, which is why this page lists it as free rather than open source.

**Release status.** The latest npm release is 0.43.1 (March 31, 2026). `1.0.0-rc.1` has held the `rc` tag since February 18, 2026, and the last commit landed on April 23, 2026. Pin the version you test.

**Hamster.** The docs now live at `tryhamster.com`. Taskmaster's own line is that it "works standalone with your own API keys. Connect to Hamster for team sync and hosted AI." Hamster Studio, which has free and paid plans, is separate from Taskmaster, which has no price.

**API keys.** Parsing, expanding and research all call a model, so expect token costs from whichever provider you configure, unless you route through the Claude Code or Codex CLI providers and their subscriptions.

Against the alternatives, [Spec Kit](/tools/spec-kit) covers the earlier spec and plan stages with slash commands, and [Kiro](/tools/kiro) builds specs into its own IDE and CLI. Taskmaster is the narrow tool for teams that already have a PRD. See the [Taskmaster alternatives](/tools/taskmaster/alternatives) and the [best spec-driven development tools of 2026](/guides/comparisons/best-spec-driven-development-tools-2026).
