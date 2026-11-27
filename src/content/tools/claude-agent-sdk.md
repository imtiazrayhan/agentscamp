---
name: "Claude Agent SDK"
description: "A toolkit for building custom agents on the same harness that powers Claude Code."
seoDescription: "The Claude Agent SDK runs Claude Code's agent loop from Python or TypeScript, with built-in tools, hooks, subagents, sessions and permission modes."
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://code.claude.com/docs/en/agent-sdk"
pricing: "free"
category: "sdk"
color: "purple"
topics: ["workflow-prompting"]
audience: ["ai-engineers"]
related: ["guide:claude-agent-sdk-tutorial", "tool:claude-code", "agent:agent-tool-integration-engineer", "guide:effective-tool-use", "glossary:agent-harness"]
tags: ["sdk", "anthropic"]
alternativeTo: ["openai-agents-sdk", "langgraph", "crewai", "autogen", "pydantic-ai"]
summary: "The Claude Agent SDK is Anthropic's library for running Claude Code's agent loop inside your own Python or TypeScript program. It ships the same built-in tools, hooks, subagents, sessions and permission modes as Claude Code, and adds custom tools through in-process MCP servers. The packages are free; usage is billed through your Claude API key."
faq:
  - q: "How do I install the Claude Agent SDK?"
    a: "Run pip install claude-agent-sdk for Python (3.10 or later) or npm install @anthropic-ai/claude-agent-sdk for TypeScript (Node.js 18.14 or later), then set ANTHROPIC_API_KEY in the environment. Both packages bundle a native Claude Code binary, so most installs need no separate Claude Code install. Amazon Bedrock, Google Cloud and Microsoft Foundry credentials work through environment variables instead of an Anthropic key."
  - q: "Is the Claude Agent SDK free?"
    a: "The packages cost nothing to install, and you pay for model usage at Claude API rates through your API key or cloud provider. Anthropic's docs say third-party developers may not offer claude.ai login or subscription rate limits in products built on the SDK without prior approval, so plan on API-key billing. The result message reports a total_cost_usd estimate, and max_budget_usd caps spend per call."
  - q: "What is the difference between the Claude Agent SDK and the Anthropic client SDK?"
    a: "The client SDK calls the Claude API and leaves the tool loop to you. The Agent SDK runs the Claude Code binary as a subprocess and gives you its loop, built-in file and shell tools, context compaction, permissions, sessions and hooks. Anthropic also offers Managed Agents, where it hosts the harness and sandbox for you."
  - q: "Was the Claude Agent SDK called something else before?"
    a: "Yes. It was the Claude Code SDK, published as @anthropic-ai/claude-code on npm and claude-code-sdk on PyPI. Anthropic renamed it to reflect uses beyond coding; the current packages are @anthropic-ai/claude-agent-sdk and claude-agent-sdk, and the docs include a migration guide."
---

The Claude Agent SDK is Anthropic's library for running the Claude Code agent loop inside your own program. It gives a Python or TypeScript application the same tools, context management and permission system that Claude Code uses in the terminal, so you write the prompt and the policy and the SDK handles tool execution, retries and compaction. It was previously named the Claude Code SDK.

It suits developers building agentic products: coding assistants, CI automation, internal tools, or any workflow where an agent works over a filesystem and a set of tools. When those tools are third-party apps, [Composio](/tools/composio) ships a Claude Agent SDK adapter and manages each user's OAuth connections.

## Highlights

- **Two official SDKs.** `claude-agent-sdk` on PyPI (Python 3.10+, latest 0.2.189 as of November 2026) and `@anthropic-ai/claude-agent-sdk` on npm (Node.js 18.14+, latest 0.3.332 as of November 2026). Both bundle a native Claude Code binary.
- **Built-in tools.** Read, Write, Edit, Glob, Grep, Bash and web search work without any tool code from you. `allowed_tools` pre-approves the ones you list, and `disallowed_tools` blocks tools or patterns such as `Bash(rm *)` in every mode.
- **Permission modes.** `default`, `dontAsk`, `acceptEdits`, `plan`, `auto` and `bypassPermissions`. Calls that are not auto-approved go to your `canUseTool` callback; `dontAsk` denies them instead, which is the mode for a locked-down headless agent.
- **Hooks.** Callbacks at lifecycle points such as `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `SubagentStart`, `SubagentStop` and `PreCompact`. A `PreToolUse` hook can allow, deny or rewrite a tool call, and a hook deny applies even in `bypassPermissions` mode. The TypeScript SDK supports more events than Python, including `SessionStart` and `SessionEnd`.
- **Subagents.** Define them in code with `AgentDefinition` (description, prompt, tools) or as files in `.claude/agents/`. Each runs in its own context and returns only its final message. Defaults cap nesting at 3 layers and concurrency at 20 subagents.
- **Sessions.** Transcripts are stored as JSONL under `~/.claude/projects/`. Continue the latest session, resume one by ID, or fork it to try an alternative. Python's `ClaudeSDKClient` holds a multi-turn session for you.
- **Custom tools and MCP.** Wrap your own functions with `@tool` and `create_sdk_mcp_server` (Python) or `tool()` and `createSdkMcpServer` (TypeScript) to run them in-process, or connect external [MCP](/glossary/model-context-protocol) servers.
- **Claude Code configuration.** Unless you pass `setting_sources=[]`, a query loads the same CLAUDE.md files, settings, skills, agents and commands the CLI would.

## How it fits an AI-assisted workflow

Install the SDK and set a key:

```bash
pip install claude-agent-sdk          # Python
npm install @anthropic-ai/claude-agent-sdk   # TypeScript
export ANTHROPIC_API_KEY=your-api-key
```

A minimal agent that reviews and fixes a file, from Anthropic's quickstart:

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage


async def main():
    async for message in query(
        prompt="Review utils.py for bugs that would cause crashes. Fix any issues you find.",
        options=ClaudeAgentOptions(
            allowed_tools=["Read", "Edit", "Glob"],  # auto-approve these tools
            permission_mode="acceptEdits",           # auto-approve file edits
        ),
    ):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if hasattr(block, "text"):
                    print(block.text)
        elif isinstance(message, ResultMessage):
            print(f"Done: {message.subtype}")


asyncio.run(main())
```

The TypeScript shape is the same: `for await (const message of query({ prompt, options: { allowedTools, permissionMode } }))`.

Use it when you want the agent's autonomy under your own control flow, such as a CI job, a web backend or a custom CLI. The [Claude Agent SDK tutorial](/guides/advanced/claude-agent-sdk-tutorial) walks through a fuller build.

## Good to know

**Cost.** The packages are free; model usage is billed at Claude API rates. Every subagent makes its own API requests, so one prompt can fan out into a tree of agents. Set `max_budget_usd` (Python) or `maxBudgetUsd` (TypeScript) to end a query at a spend cap, and read `total_cost_usd` on the result message, which the docs describe as a client-side estimate and not billing data.

**It is a subprocess, not an API wrapper.** Each `query()` spawns a `claude` CLI process that owns a shell, a working directory and session files on local disk. One session is one process, and session state does not survive a container restart unless you persist the transcript files or mirror them to external storage. Budget hosting accordingly.

**Permissions have sharp edges.** `allowed_tools` pre-approves tools but does not restrict `bypassPermissions`: with `allowed_tools=["Read"]` and `bypassPermissions`, Bash and Write calls are still approved. Use `disallowed_tools` or a `PreToolUse` hook to block, and run agents that can execute commands in a sandbox or container.

**Licensing and languages.** The Python SDK repository is MIT-licensed; overall use is governed by Anthropic's Commercial Terms of Service. Only Python and TypeScript have SDKs. From other languages, run the CLI as a subprocess with `-p` and `--output-format json`.

**Claude models only.** The SDK drives Claude through the Claude API, Amazon Bedrock, Google Cloud or Microsoft Foundry. If you need to swap model providers, the [OpenAI Agents SDK](/tools/openai-agents-sdk) and [Pydantic AI](/tools/pydantic-ai) are provider-flexible loops without the built-in file and shell tools. [LangGraph](/tools/langgraph) is the choice when you want to define control flow as an explicit graph with checkpoints, and [CrewAI](/tools/crewai) when you want role-based crews. The Agent SDK's advantage is that the coding-agent harness arrives finished.
