---
title: "Codex MCP Setup: Connect Tools and Live Context"
description: "Connect OpenAI Codex to MCP servers through the CLI, desktop app, IDE, or config.toml — with practical scoping, OAuth, and tool-approval guidance."
author: "AgentsCamp"
date: 2026-08-04
color: "cyan"
topics: ["mcp", "architecture", "workflow-prompting"]
tags: ["codex", "mcp", "openai", "tools", "configuration"]
featured: true
summary: "Codex uses Model Context Protocol servers to reach live documentation, developer tools, and external systems. Local clients support STDIO and Streamable HTTP servers and share config.toml. Add only the servers a workflow needs, keep secrets in environment variables or OAuth, constrain exposed tools, and require approval for writes or sensitive side effects."
keyTakeaways:
  - "Use MCP when Codex needs live external data or controlled actions; use AGENTS.md for rules and skills for reusable procedure."
  - "Codex supports local STDIO servers and remote Streamable HTTP servers, including bearer-token and OAuth authentication."
  - "The desktop app, CLI, and IDE extension share MCP configuration on the same Codex host."
  - "Scope servers to a trusted project when the integration is repository-specific; use user configuration only for tools needed across projects."
  - "Prefer allowlists and prompt-on-write approvals over exposing a server's entire action surface automatically."
faq:
  - q: "What is MCP in Codex?"
    a: "Model Context Protocol is the standard Codex uses to connect to external tools and context. An MCP server can expose functions, resources, prompts, and server-level instructions so Codex can search documentation, inspect designs, read issues, or perform controlled actions."
  - q: "How do I add an MCP server to Codex?"
    a: "For a local STDIO server, run codex mcp add <name> -- <command>. You can also add STDIO or Streamable HTTP servers from the desktop app or IDE settings, or define them directly under mcp_servers in config.toml."
  - q: "Where is Codex MCP configuration stored?"
    a: "User-level configuration lives in ~/.codex/config.toml. Trusted repositories can add project-scoped settings in .codex/config.toml. The desktop app, CLI, and IDE extension on the same host share these configuration layers."
  - q: "Is it safe to connect Codex to an MCP server?"
    a: "Treat an MCP server like any integration with data and permissions: verify who operates it, limit credentials and exposed tools, require approval for writes or side effects, and avoid putting secrets directly in checked-in configuration."
related: ["model-context-protocol", "claude-code-mcp-setup", "building-an-mcp-server", "codex-skills-guide", "codex-agents-md", "openai-codex-guide", "mcp-server-scaffolder"]
howtoSteps:
  - name: "Choose the scope"
    text: "Decide whether the server belongs in user configuration for every project or in a trusted project's .codex/config.toml for repository-specific use."
  - name: "Add the server"
    text: "Configure a local STDIO command or a remote Streamable HTTP URL through codex mcp add, the desktop or IDE settings, or config.toml."
  - name: "Configure authentication safely"
    text: "Use environment-variable references for bearer tokens or run codex mcp login for OAuth; do not commit credential values."
  - name: "Limit tools and approvals"
    text: "Allow only the tools the workflow needs and require prompts for writes or sensitive side effects."
  - name: "Restart and verify"
    text: "Restart the relevant Codex client, inspect the server with /mcp or codex mcp list, and test one read-only call before enabling actions."
---

**Model Context Protocol gives Codex a standard way to use live tools and data outside the repository.** An MCP server can expose search, issue trackers, design files, browser controls, observability data, databases, or internal APIs as typed tools the agent can select during a task.

MCP is the integration layer, not the instruction layer. Use [`AGENTS.md`](/guides/configuration/codex-agents-md) to tell Codex how a repository works, and a [skill](/guides/skills/codex-skills-guide) to teach a repeatable procedure. Use MCP when that procedure needs information that changes or an action in another system.

## Choose the transport

Codex supports two MCP server types for local clients:

- **STDIO** — Codex starts a local process and communicates through standard input and output. This is common for developer tools installed with npm, Python, or a local binary.
- **Streamable HTTP** — Codex connects to a stable remote URL. This suits hosted and team services and can use bearer tokens or OAuth.

The ChatGPT desktop app, Codex CLI, and Codex IDE extension share MCP configuration on the same host. Hosted ChatGPT Work uses plugins for remote MCP-backed tools rather than reading the local machine's config file.

## Add a local server from the CLI

The fastest path for a local STDIO server is `codex mcp add`:

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
codex mcp list
```

The name comes before `--`; everything after it is the command Codex launches. Pass environment values with `--env` when the server needs them, but avoid leaving secrets in shell history. Prefer forwarding a pre-existing environment variable or using the authentication mechanism supported by the server.

In the interactive terminal UI, `/mcp` shows active servers. The desktop app and IDE extension provide an **MCP servers** settings screen where you can add either transport, authenticate, enable or disable servers, and restart the client.

## Configure with `config.toml`

User-level configuration lives at `~/.codex/config.toml`. A trusted repository can carry project-specific configuration in `.codex/config.toml`; use that when the server exists only to support this codebase.

Local STDIO server:

```toml
[mcp_servers.docs]
command = "npx"
args = ["-y", "@example/docs-mcp"]
env_vars = ["DOCS_TOKEN"]
startup_timeout_sec = 20
tool_timeout_sec = 45
```

Remote Streamable HTTP server:

```toml
[mcp_servers.issues]
url = "https://mcp.example.com/api"
bearer_token_env_var = "ISSUES_MCP_TOKEN"
enabled_tools = ["search_issues", "get_issue", "add_comment"]
default_tools_approval_mode = "writes"
```

`env_vars` forwards named variables to a local process. `bearer_token_env_var` tells Codex which environment variable contains the remote token; the credential value stays outside the configuration file.

For OAuth-capable servers, add the server and run:

```bash
codex mcp login issues
```

## Treat the tool list as a permission surface

Connecting a server is not only a context decision. Every exposed tool expands what the agent can attempt. A read-only search tool and a “delete production deployment” tool should not share the same friction.

Codex configuration can narrow and govern that surface:

- `enabled_tools` creates an allowlist.
- `disabled_tools` removes tools after the allowlist is applied.
- `default_tools_approval_mode` sets the server-wide behavior.
- Per-tool approval settings can make a sensitive action stricter than the rest.

A safe default is to expose the small set of read operations the workflow needs, prompt for writes, and require explicit approval for destructive or externally visible actions. Do not rely only on a tool description to enforce security; the MCP server itself must validate authorization and arguments.

## Verify in layers

When a server does not appear or a call fails, check the stack from the bottom up:

1. **Process or URL** — can the local command start, or can the host reach the remote endpoint?
2. **Authentication** — is the expected environment variable present, or has OAuth login completed?
3. **Configuration scope** — is the project trusted, and did this client load the intended user or project config?
4. **Server initialization** — does `/mcp` or `codex mcp list` show it as enabled?
5. **Tool policy** — is the requested tool allowed and does its approval mode permit the call?
6. **Workflow routing** — does the prompt or skill make clear when Codex should use the tool?

Test one harmless read operation before enabling writes. That separates transport and auth problems from side-effect policy, and it gives you a known-good baseline.

> [!WARNING]
> Tool output is still external input. Documentation pages, issue bodies, and web content can contain instructions aimed at the model. Keep permissions scoped and ask Codex to treat retrieved content as data, not authority over the task.

## A good integration boundary

Start with one integration that removes a repeated manual loop: current library docs, a design source, issue context, or error traces. Pair it with a focused skill only if the organization needs a consistent multi-step method around those tools. Add more servers after you can explain the data, actions, credentials, and approval policy of the ones already installed.

Official reference: [Model Context Protocol in Codex](https://learn.chatgpt.com/docs/extend/mcp).
