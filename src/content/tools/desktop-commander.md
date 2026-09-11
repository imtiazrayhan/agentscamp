---
name: "Desktop Commander"
title: "Desktop Commander"
seoTitle: "Desktop Commander MCP: Terminal and File Editing for Claude"
description: "MIT-licensed MCP server that gives Claude Desktop and other MCP clients terminal control, file system search, and diff-based file editing."
date: "2026-09-11"
url: "https://desktopcommander.app/"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/wonderwhy-er/DesktopCommanderMCP"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "cyan"
topics: ["mcp"]
audience: ["developers"]
tags: ["mcp", "terminal", "filesystem", "file-editing", "claude-desktop"]
featured: false
sameAs:
  - "https://github.com/wonderwhy-er/DesktopCommanderMCP"
related: ["tool:claude-code", "tool:serena", "tool:claude", "guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "guide:govern-mcp-servers"]
alternativeTo: ["claude-code", "serena"]
summary: "Desktop Commander is an MIT-licensed MCP server that gives Claude terminal control, file system search, and diff-based file editing. Built on the MCP Filesystem Server with extra search-and-replace editing, it turns a chat client like Claude Desktop into something closer to a coding agent. It installs through npx and needs Node.js 18 or newer."
faq:
  - q: "What does Desktop Commander add to Claude Code?"
    a: "Mostly a second set of shell and file tools, since Claude Code already reads, edits, and runs commands on its own. Its bigger payoff is in chat clients such as Claude Desktop, which it gives terminal control, file system search, and search-and-replace editing."
  - q: "How do I add Desktop Commander to Claude Code?"
    a: "Run claude mcp add --scope user desktop-commander -- npx -y @wonderwhy-er/desktop-commander@latest, which makes it available in every project. It needs Node.js 18 or newer."
  - q: "Is Desktop Commander free?"
    a: "The MCP server is MIT open source, so running it locally costs nothing. The README also points to a separate Desktop Commander App and a Remote MCP; check desktopcommander.app for how those are offered."
---

**Desktop Commander** is a **terminal and filesystem MCP server**: it lets Claude run terminal commands, search your file system, and edit files with diff-style search-and-replace. It isn't a docs or code-search server. Its natural home is a chat client like [Claude Desktop](/tools/claude), where it adds the shell and file access a coding agent takes for granted; inside [Claude Code](/tools/claude-code), which already has its own shell and file tools, it mostly duplicates what's built in.

## Highlights

- **Terminal control** — Claude can run commands in your shell, the first capability the repo's own description lists.
- **File system search** — the agent can search across your directories instead of waiting for you to paste paths.
- **Diff-based editing** — targeted search-and-replace edits rather than whole-file rewrites, which keeps each change small and easy to review.
- **Built on the MCP Filesystem Server** — the README describes it as that server plus additional search-and-replace editing.
- **More than one way to run it** — the npx package is a local server, and the README also lists a separate Desktop Commander App for macOS and Windows (in beta as of September 2026) and a Remote MCP at `mcp.desktopcommander.app`.
- **MIT and very active** — v0.2.50 shipped on September 9, 2026, and the repo has about 9.5k GitHub stars as of September 2026.

## In an AI-assisted workflow

The README's Claude Code command registers it at user scope, so it's available in every project:

```bash
claude mcp add --scope user desktop-commander -- npx -y @wonderwhy-er/desktop-commander@latest
```

Prompts that play to its strengths:

```text
Find every .env.example file under ~/projects and list the variables each one defines.
Run the test suite, then fix the failing assertion in the date parser with a minimal search-and-replace edit.
Read the last 200 lines of the dev server log and tell me which request is failing.
```

In other MCP clients, the same npx package runs as a local stdio server. [Adding MCP servers to Claude Code](/guides/mcp/claude-code-mcp-setup) explains the scope options, and [connecting and governing MCP servers](/guides/mcp/govern-mcp-servers) covers registries, gateways, and tool sprawl once you run several servers.

> [!TIP]
> A terminal server can do anything your user account can. If you only want it in one repo, add it at project or local scope instead of user scope, and keep approval prompts on for its tools until you trust the workflow; [Claude Code's permission rules](/guides/configuration/claude-code-settings-permissions) apply to MCP tools too.

## How it compares

The honest comparison is with [Claude Code](/tools/claude-code) itself: Claude Code ships its own shell, search, and file-editing tools, so Desktop Commander is an alternative to it mainly when you'd rather work from a chat client than a terminal agent. [Serena](/tools/serena) overlaps only at the edges: its basic file, search, and shell tools resemble Desktop Commander's (and are typically disabled by default inside Claude Code), but Serena's real value is its language-server symbol layer, which Desktop Commander doesn't have. It doesn't compete with docs servers like [Context7](/tools/context7) at all, since it fetches no documentation.

## Good to know

Desktop Commander is MIT licensed and maintained by Eduard Ruzga (GitHub `wonderwhy-er`). It's published on npm as `@wonderwhy-er/desktop-commander` and requires Node.js 18 or newer. The npx server runs locally over stdio, so every command it executes runs on your machine with your user's permissions.

The project is very active, and the install command pulls `@latest`, so behavior can change between sessions; pin a specific version if you need repeatable setups. The Desktop Commander App and the Remote MCP are separate offerings from the open-source server this page covers, so check desktopcommander.app for how they work and what they cost. For other servers worth adding, see [the best MCP servers in 2026](/guides/mcp/best-mcp-servers-2026).
