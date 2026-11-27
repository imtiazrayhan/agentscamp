---
title: "7 Best Claude Skills for MCP Server Development"
description: "Claude skills, commands, and agents for building MCP servers: scaffolding, tool schemas, Inspector testing, safe registration, config audits, code review, and plugins."
author: "Imtiaz Rayhan"
date: "2026-11-13"
updated: 2026-11-27
reviewed: 2026-11-27
color: "cyan"
depth: standard
topics: ["mcp"]
audience: ["developers", "ai-engineers"]
tags: ["claude-skills", "mcp", "mcp-servers", "tool-calling", "security", "best-of"]
seoTitle: "7 Best Claude Skills for MCP Server Development"
seoDescription: "The best Claude skills for building MCP servers: scaffolding, tool schemas, Inspector testing, claude mcp add, config audits, security review, and plugins."
keywords: ["claude skills for mcp", "mcp server development claude code", "build an mcp server with claude", "mcp inspector testing", "mcp server scaffolder", "mcp config audit"]
summary: "Start with mcp-server-scaffolder for a runnable first server, tighten each tool with tool-definition-generator, and test it with mcp-server-tester. Register it with /add-mcp-server, audit configs with mcp-config-auditor or /mcp-audit, package it with plugin-scaffolder, and have the mcp-security-reviewer agent read the source before teammates connect."
keyTakeaways:
  - "Most of an MCP server's quality lives in its tool surface: verb-object names, descriptions that say when to call a tool, and strict schemas with honest required fields and enums."
  - "Scaffold one good tool first; the rest of the server copies its pattern."
  - "Default to stdio for a local prototype, and move to Streamable HTTP only with authentication, input validation, and stateless scaling in place."
  - "Config and code need separate reviews: mcp-config-auditor reads the files clients load, while the mcp-security-reviewer agent reads the server's source and tool text."
  - "Starting a server executes its code, so the review tools never launch a third-party server without your consent."
faq:
  - q: "Can Claude Code build an MCP server for me?"
    a: "Yes. The mcp-server-scaffolder skill turns a one-line description into a runnable skeleton: it picks the SDK and transport, generates one tool with a strict schema and a routing-quality description, and adds the MCP Inspector launch command and the claude mcp add line. For a larger server, or for taking one remote with OAuth, use the mcp-server-engineer agent."
  - q: "How do I test an MCP server with Claude?"
    a: "The mcp-server-tester skill tests a server with the MCP Inspector CLI and SDK clients, and the /test-mcp-server command runs a test pass from inside a session. The scaffolder also wires an Inspector launch command so you can list and call your first tool by hand, and /add-mcp-server confirms the connection with claude mcp list and /mcp."
  - q: "How do I add an MCP server to Claude Code safely?"
    a: "Use the /add-mcp-server command. It matches the project's existing MCP configuration, chooses stdio or Streamable HTTP and the local, project, or user scope, passes secrets through environment variables instead of writing them into .mcp.json, vets and pins third-party servers, and verifies the server actually connected before calling the job done."
  - q: "What is the difference between mcp-config-auditor and the mcp-security-reviewer agent?"
    a: "mcp-config-auditor reads configuration only: unpinned packages, inline secrets, wide filesystem roots, unprotected remote servers, duplicate tool names, and suspicious tool text it can find without running anything. The mcp-security-reviewer agent reads the server's source: every tool description, what result text carries back, file, shell, and network scope, HTTP authentication, secrets handling, and rug-pull risk. It ends with a connect, connect-with-constraints, or do-not-connect verdict."
  - q: "Should I build an MCP server or write a Claude skill?"
    a: "Skills inject a procedure into Claude's context; MCP servers expose tools and live data over a protocol. If the job is knowing how to do something, write a skill. If it needs to call an API or read a system Claude cannot otherwise reach, build a server. Many setups combine both."
sources:
  - title: "Specification"
    url: "https://modelcontextprotocol.io/specification/2026-07-28"
    publisher: "Model Context Protocol"
  - title: "Tools"
    url: "https://modelcontextprotocol.io/specification/2026-07-28/server/tools"
    publisher: "Model Context Protocol"
  - title: "Security Best Practices"
    url: "https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices"
    publisher: "Model Context Protocol"
  - title: "MCP Inspector"
    url: "https://modelcontextprotocol.io/docs/tools/inspector"
    publisher: "Model Context Protocol"
  - title: "modelcontextprotocol/inspector"
    url: "https://github.com/modelcontextprotocol/inspector"
    publisher: "GitHub"
  - title: "Connect Claude Code to tools via MCP"
    url: "https://code.claude.com/docs/en/mcp"
    publisher: "Anthropic"
  - title: "Plugins overview"
    url: "https://code.claude.com/docs/en/plugins"
    publisher: "Anthropic"
related: ["skill:mcp-server-scaffolder", "skill:tool-definition-generator", "skill:mcp-server-tester", "skill:mcp-config-auditor", "skill:plugin-scaffolder", "skill:claude-settings-auditor", "command:add-mcp-server", "command:mcp-audit", "command:test-mcp-server", "agent:mcp-server-engineer", "agent:mcp-security-reviewer", "agent:agent-tool-integration-engineer", "guide:building-an-mcp-server", "guide:claude-code-mcp-setup", "guide:mcp-troubleshooting", "guide:deploy-remote-mcp-server", "guide:govern-mcp-servers", "guide:skills-vs-mcp-servers", "guide:how-to-install-claude-skills", "tool:mcp-inspector", "tool:fastmcp", "glossary:model-context-protocol", "glossary:tool-poisoning"]
---

The best Claude skills for MCP development follow a server from its first file to a shared config: scaffold it, shape its tools, test it, register it, and review it before anyone else connects. Getting a [Model Context Protocol](/glossary/model-context-protocol) server to respond is the easy part. As the mcp-server-engineer agent's own brief puts it, the hard part is design (which capabilities to expose, and how to name and shape them so the model uses them correctly) and hardening once the server runs somewhere other than one laptop.

The seven picks below, five skills and two slash commands, cover that path in order. Two agents for larger builds and security review follow the list. If you are new to the protocol, read [Building an MCP Server](/guides/advanced/building-an-mcp-server) first; this page assumes you know what a tool, a resource, and a transport are.

## The summary table

| Pick | Type | Stage | What you get |
| --- | --- | --- | --- |
| [mcp-server-scaffolder](/skills/api/mcp-server-scaffolder) | Skill | Start | Runnable skeleton with one tool, an Inspector command, and the `claude mcp add` line |
| [tool-definition-generator](/skills/api/tool-definition-generator) | Skill | Shape the tools | Validated schemas with model-facing descriptions |
| [mcp-server-tester](/skills/testing/mcp-server-tester) | Skill | Test | A test run through the MCP Inspector CLI and SDK clients |
| [/add-mcp-server](/commands/workflow/add-mcp-server) | Command | Register | The exact registration command and a verified connection |
| [mcp-config-auditor](/skills/security/mcp-config-auditor) | Skill | Audit config | Findings by severity with file, line, and fix |
| [/mcp-audit](/commands/review/mcp-audit) | Command | Audit config | The same checks over the repo and home directory in one call |
| [plugin-scaffolder](/skills/workflow/plugin-scaffolder) | Skill | Distribute | A plugin carrying the server's `.mcp.json` that passes `claude plugin validate --strict` |

## 1. mcp-server-scaffolder: a runnable first server

[mcp-server-scaffolder](/skills/api/mcp-server-scaffolder) turns a one-line description into a skeleton you can run. It settles where the server will live first: stdio for a local server, Streamable HTTP for a remote or shared one, with stdio as the default for a prototype and a note on how to promote it later. It matches the project's language with the official Python or TypeScript SDK, or [FastMCP](/tools/fastmcp) for Python, and slots into an existing project's package manager and conventions instead of scaffolding in isolation.

The skeleton has exactly one tool, on purpose, because the first tool sets the pattern the rest copy. It gets a verb-object name, a description written as a routing signal (what it does, what it returns, when to use it), and a strict input schema with required and optional fields, enums, and per-field descriptions; the handler is a stub with a clear TODO. The skill adds the [MCP Inspector](/tools/mcp-inspector) launch command (`npx @modelcontextprotocol/inspector ...`) and the exact `claude mcp add` invocation, and it states plainly that a remote server still needs authentication and input validation before production, pointing to [Deploying a Remote MCP Server](/guides/mcp/deploy-remote-mcp-server).

## 2. tool-definition-generator: tools the model calls correctly

[tool-definition-generator](/skills/api/tool-definition-generator) is not specific to MCP, which is exactly why it belongs here: a tool's name, description, and input schema are the whole interface the model sees. The skill derives the schema from the real function signature, types, and docstring, or from an OpenAPI spec, and reads call sites to learn how the function is actually used.

Its rules are the ones that cut bad calls. Say what the tool does and when not to use it. Mark required fields honestly instead of making everything optional to be safe. Give each argument units and a format. Replace free strings with enums where the set is known, and add bounds and patterns where they apply. Merge or disambiguate tools that are easy to confuse. It emits the schema in the target framework's format and checks that it validates. Run it on every tool after the first so the surface stays consistent. Its own caveat stands: a good schema reduces bad calls but does not replace error handling or a [human-in-the-loop gate](/skills/workflow/human-in-the-loop-gate) for consequential actions.

## 3. mcp-server-tester: exercise the server before a client does

[mcp-server-tester](/skills/testing/mcp-server-tester) tests an MCP server with the MCP Inspector CLI and SDK clients. Where the scaffolder leaves you a command for opening the Inspector and calling your first tool by hand, the tester drives the server from the Inspector's command-line mode and from SDK clients, which is how you check a server again after every change to its tools. The [/test-mcp-server](/commands/testing/test-mcp-server) command runs a test pass from inside a Claude Code session.

Test your own server here rather than leaving it to a reviewer. The security agent below will only start a server with your explicit consent, and when something fails to connect, the [MCP troubleshooting guide](/guides/troubleshooting/mcp-troubleshooting) covers servers that will not connect, missing tools, OAuth loops, timeouts, and truncated output.

## 4. /add-mcp-server: register it at the right scope

[/add-mcp-server](/commands/workflow/add-mcp-server) connects a server to the current project and does not call the job done until the connection is verified. It first checks how the project already configures MCP, such as a checked-in `.mcp.json` or per-user config, and matches that rather than adding a second mechanism. Then it picks the transport (stdio for a local child process, Streamable HTTP with a URL for a remote server) and the scope: local for a personal addition, project for a committed `.mcp.json` the team shares, or user for every project you open. A project-scoped server prompts each teammate to approve it before its tools activate.

Secrets travel through environment variables and are never written into `.mcp.json`. The command produces the exact registration line with options before the server name, for example `claude mcp add --transport http --scope project linear https://mcp.linear.app/mcp`, then checks status with `claude mcp list` and `/mcp`, or calls a tool through the Inspector. For third-party servers it vets provenance and pins a version first. Every flag and scope is covered in [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup).

## 5. mcp-config-auditor: read the config before approving it

[mcp-config-auditor](/skills/security/mcp-config-auditor) is read-only: it never starts a server, edits a config, or rotates a credential. It finds every MCP config the common clients load (Claude Code's `.mcp.json` and `~/.claude.json`, Claude Desktop, Cursor, VS Code, and the Codex CLI's `config.toml`), normalizes the servers into one table, and checks for unpinned packages (`npx -y` with no version, `:latest` images), inline secrets in `env` or headers, filesystem roots at the home directory or above, remote servers over plain HTTP or without auth, duplicate tool names across servers, and tool descriptions that carry instructions to the model. It treats that last group as [tool poisoning](/glossary/tool-poisoning) signals and rates any hit High until a person has read it.

Findings come back by severity with the file, the line, and the fix, such as a `${VAR}` reference in place of a pasted token, since Claude Code expands environment variables in `.mcp.json`. Run it over your own server's checked-in config before asking teammates to approve it.

## 6. /mcp-audit: the same audit in one call

[/mcp-audit](/commands/review/mcp-audit) runs the auditor's procedure inside Claude Code over the repository and the home directory, or over a single file or server name when you pass one; right after `claude mcp add`, pass the server name to audit just that entry. It orders the checks from most to least dangerous: inline secrets, poisoned descriptions, filesystem roots, unprotected remote servers, unpinned packages, auto-approval of project servers, and duplicate tool names. It marks which project files are committed and reads only the `mcpServers` keys from `~/.claude.json`.

When a server's tool descriptions are not available without running it, the command reports them as not reviewed and names the mcp-security-reviewer agent as the next step. It ends with the single most urgent action, and credential exposure always comes first.

## 7. plugin-scaffolder: ship the server with its skills

Once a server works, [plugin-scaffolder](/skills/workflow/plugin-scaffolder) packages it with the skills, agents, commands, and hooks that use it. It writes `.claude-plugin/plugin.json` as the only file in that folder, puts `.mcp.json` and the component directories at the plugin root, and replaces hardcoded paths, which it names as the top cause of plugins breaking after install, with `${CLAUDE_PLUGIN_ROOT}`. It tests with `claude --plugin-dir`, exercises the MCP connection, and finishes with `claude plugin validate --strict`.

Its warning applies directly to MCP: a plugin's servers receive credentials on other people's machines, so do not bundle secrets, pin any third-party server the plugin pulls in, and keep the manifest's `repository` field honest so users can read the source they are trusting. [Claude Code plugins](/guides/configuration/claude-code-plugins) explains when a plugin is worth the versioning overhead.

## Agents for bigger builds and security review

[mcp-server-engineer](/agents/developer-tools/mcp-server-engineer) takes over when the job is more than a skeleton: wrapping an API or internal service with several tools, fixing a tool surface the model misuses, or taking a stdio server remote. It maps each capability to the right primitive (tools for model-controlled actions, resources for read-only data by URI, prompts for user-invoked templates), keeps the tool count small because the model reads every schema on every call, and hardens handlers with bounded inputs, concise results, and short error messages. For remote servers it adds stateless requests and OAuth 2.1 with token scopes mapped to tools, then verifies every capability in the Inspector.

[mcp-security-reviewer](/agents/quality-security/mcp-security-reviewer) reads the server's source rather than its config. It reads every tool and parameter description as the model will, traces where result text comes from (a fetched web page, an email body, or a database row is untrusted content landing in the agent's context), checks file, shell, and network scope against what the tools need, inspects HTTP authentication and `Origin` validation, follows secrets, and flags rug-pull risk where descriptions or the tool list can change after approval. It ends with a verdict: connect, connect with constraints, or do not connect. It is read-only and does not start a server without your explicit yes in that session.

Two neighbors are worth knowing. Permission rules around MCP tools, such as an `mcp__*` allow or `enableAllProjectMcpServers`, live in settings files, and [claude-settings-auditor](/skills/workflow/claude-settings-auditor) checks those; it is also the first step in the [codebase onboarding roundup](/guides/skills/best-claude-skills-for-codebase-onboarding) for a freshly cloned repo. For the consumer side, wiring tools into your own agent loop with retries and errors fed back as observations, use the [agent-tool-integration-engineer](/agents/data-ai/agent-tool-integration-engineer) agent.

## Recommended MCP stacks

To build and test your own server:

```bash
npx agentscamp add skills/mcp-server-scaffolder
npx agentscamp add skills/tool-definition-generator
npx agentscamp add skills/mcp-server-tester
npx agentscamp add commands/add-mcp-server
npx agentscamp add agents/mcp-server-engineer
```

To review servers before a team adopts them:

```bash
npx agentscamp add skills/mcp-config-auditor
npx agentscamp add commands/mcp-audit
npx agentscamp add agents/mcp-security-reviewer
```

Each command installs into the current project's `.claude/` directory; add `-g` for `~/.claude/`. Manual copying, plugins, and team distribution are covered in [how to install Claude skills](/guides/skills/how-to-install-claude-skills).

When a team runs many servers, discovery and access control become a fleet problem. [Connecting and Governing MCP Servers](/guides/mcp/govern-mcp-servers) covers registries, gateways, and tool sprawl, and the [MCP gateways roundup](/guides/comparisons/best-mcp-gateways-2026) compares options including the [Docker MCP Toolkit](/tools/docker-mcp-toolkit) and [Composio](/tools/composio); the [MCP gateway](/glossary/mcp-gateway) entry defines the term.

## Continue exploring

- [Building an MCP Server](/guides/advanced/building-an-mcp-server) — Server anatomy, transports, and connecting a first tool to Claude Code.
- [Adding MCP Servers to Claude Code](/guides/mcp/claude-code-mcp-setup) — The full `claude mcp add` reference: transports, scopes, `.mcp.json`, and OAuth.
- [MCP Troubleshooting](/guides/troubleshooting/mcp-troubleshooting) — Fixes for servers that fail to connect, missing tools, OAuth loops, and timeouts.
- [Skills vs MCP Servers](/guides/skills/skills-vs-mcp-servers) — When a procedure belongs in a skill and when it needs a server.
- [10 Best Claude Skills for API Development](/guides/skills/best-claude-skills-for-api-development) — Error contracts, idempotency, pagination, and the API work behind a server's tools.
- [How to install Claude skills](/guides/skills/how-to-install-claude-skills) — Every install path: manual copy, the agentscamp CLI, GitHub repos, plugins, and team distribution.
