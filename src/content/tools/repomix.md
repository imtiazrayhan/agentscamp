---
name: "Repomix"
title: "Repomix"
seoTitle: "Repomix: Pack a Whole Repo for AI, as a CLI or MCP Server"
description: "MIT tool that packs a local codebase or GitHub repo into one AI-friendly file, as a CLI or an MCP server your agent can grep and read in slices."
date: "2026-09-11"
url: "https://repomix.com"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/yamadashy/repomix"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "cyan"
topics: ["mcp"]
audience: ["developers"]
tags: ["mcp", "cli", "codebase-packing", "context", "tree-sitter"]
featured: false
sameAs:
  - "https://github.com/yamadashy/repomix"
  - "https://www.npmjs.com/package/repomix"
related: ["tool:serena", "tool:claude-context", "tool:claude-code", "guide:best-mcp-servers-2026", "guide:claude-code-plugins", "guide:claude-code-mcp-setup"]
alternativeTo: ["serena", "claude-code", "claude-context"]
summary: "Repomix is an MIT-licensed tool that packs an entire repository, local or on GitHub, into one AI-friendly file. Use it as a CLI, or as an MCP server (repomix --mcp) whose tools pack a codebase and let the agent grep and read the output in slices, with optional Tree-sitter compression and secret detection. It needs Node.js 22+ or Docker."
faq:
  - q: "What does Repomix add to Claude Code?"
    a: "Whole-repo snapshots the agent can grep and read in slices, packed from a local directory or a remote GitHub repo. It suits reviewing or onboarding onto an entire codebase, or studying a third-party library's source without cloning it yourself."
  - q: "How do I add Repomix to Claude Code?"
    a: "Run claude mcp add repomix -- npx -y repomix --mcp. Alternatively, install the official plugin with /plugin marketplace add yamadashy/repomix followed by /plugin install repomix-mcp@repomix."
  - q: "Is Repomix free?"
    a: "Yes. Repomix is MIT open source and needs no account or API key; you only need Node.js 22 or newer, or Docker."
---

**Repomix** packs a whole repository into **one AI-friendly file**, and its MCP mode lets your agent do that on demand, then grep and read the packed output in slices. It's the simplest way to hand an agent an entire codebase, yours or any GitHub repo, with no index or database to maintain. Reach for it for whole-repo reviews and onboarding; for day-to-day symbol-level edits, a language-server tool fits better.

## Highlights

- **CLI and MCP server in one** — the `repomix` CLI writes a packed file you can hand to any model, and `repomix --mcp` exposes the same packing to an agent over stdio.
- **Local or remote** — `pack_codebase` packs a directory, and `pack_remote_repository` accepts a GitHub URL or `user/repo`.
- **Read in slices** — `grep_repomix_output` and `read_repomix_output` (with line ranges) let the agent search a pack instead of loading all of it, and `attach_packed_output` attaches an existing pack.
- **Tree-sitter compression** — optional; Repomix says it "reduces token usage by ~70% while preserving semantic meaning."
- **Secret-aware** — Repomix refuses content that matches secret formats (a Secretlint-based heuristic), and `--sandbox` mode confines the file tools to one workspace root.
- **Built for Claude Code** — official plugins (`repomix-mcp`, `repomix-commands`, `repomix-explorer`), and the CLI can generate Claude Agent Skills into `.claude/skills/<name>/` with `--skill-generate`.

## In an AI-assisted workflow

Add the MCP server to [Claude Code](/tools/claude-code) with the command from the README:

```bash
claude mcp add repomix -- npx -y repomix --mcp
```

Or install the official plugin instead:

```text
/plugin marketplace add yamadashy/repomix
/plugin install repomix-mcp@repomix
```

Then ask for packs by task:

```text
Pack this repository with Repomix, then grep the output for every place we read environment variables.
Pack the remote repo for the HTTP client we depend on and explain how its retry logic works.
```

If you haven't installed from a plugin marketplace before, our guide to [Claude Code plugins](/guides/configuration/claude-code-plugins) walks through how it works.

> [!TIP]
> On a shared machine, or whenever the agent should stay inside one project, start the server with `repomix --mcp --sandbox [path]`. File tools stay under that root, and remote packing, skill generation, and attaching external outputs are switched off. Repomix calls this "an application-level confinement of the tool surface, not an OS-level sandbox."

## How it compares

[Serena](/tools/serena) is the main alternative for code context, with a different shape: Repomix takes a whole-repo snapshot and searches it with regex grep, while Serena makes incremental, symbol-level queries and edits through language servers, and Repomix has no editing tools. [Claude Context](/tools/claude-context) sits between them, querying a persistent vector index instead of a snapshot, at the cost of an embedding provider and a database. Repomix isn't a docs index like [Context7](/tools/context7): `pack_remote_repository` can pull a library's source, but you get raw code, not curated, version-matched docs.

## Good to know

Repomix is MIT licensed, maintained by Kazuki Yamada, and very active: v1.18.0 shipped in August 2026, commits continued into September 2026, and the repo has about 28k GitHub stars as of September 2026. It requires Node.js 22 or newer (its npm engines field says `>=22.0.0`), or Docker via the `ghcr.io/yamadashy/repomix` image. It runs locally over stdio, with no hosted endpoint, account, or API key.

The source also registers a `generate_skill` MCP tool that the README's tool list leaves out; sandbox mode disables skill generation along with remote packing. We couldn't confirm which languages Tree-sitter compression covers, so check it on your own stack before counting on the savings. For the rest of a context stack, see [the best MCP servers in 2026](/guides/mcp/best-mcp-servers-2026), and for scopes and `.mcp.json`, [adding MCP servers to Claude Code](/guides/mcp/claude-code-mcp-setup).
