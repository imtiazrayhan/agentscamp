---
name: "Serena"
title: "Serena"
description: "An MCP toolkit that gives coding agents IDE-grade powers — symbol-level retrieval and editing via language servers, across 40+ languages."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://oraios.github.io/serena"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/oraios/serena"
license: "GPL-3.0-or-later"
os: ["macOS", "Windows", "Linux"]
color: "cyan"
topics: ["mcp"]
audience: ["developers"]
tags: ["mcp", "lsp", "refactoring", "code-intelligence", "symbols"]
featured: false
sameAs:
  - "https://pypi.org/project/serena-agent/"
related: ["guide:best-mcp-servers-2026", "guide:claude-code-mcp-setup", "agent:refactoring-specialist", "skill:dead-code-finder", "command:extract-function", "tool:claude-code"]
alternativeTo: ["claude-context", "context7", "claude-code", "aider"]
summary: "Serena is an MCP server that gives coding agents symbol-level tools backed by language servers: find a symbol, list its references, replace its body, rename it, across 40+ languages. Version 2.0 in October 2026 moved the application from MIT to GPL-3.0-or-later and added a REPL interface where one tool runs Python against Serena's operations."
faq:
  - q: "What does Serena add that Claude Code doesn't have?"
    a: "Symbol-level semantics. Text search and edit work on strings; Serena works on the language server's model of the code. It can find a symbol, list every symbol that references it, replace exactly its body and rename it throughout the codebase. On large codebases that is more precise than text matching and uses fewer tokens than reading whole files to locate one function."
  - q: "How do I add Serena to Claude Code?"
    a: 'Install uv, then run uv tool install -p 3.13 serena-agent and serena init. The quickest setup is serena setup claude-code. To add it by hand for all projects: claude mcp add --scope user serena -- serena start-mcp-server --context claude-code --project-from-cwd. For one project, drop --scope user and pass --project "$(pwd)" instead. Serena warns against installing from an MCP or plugin marketplace because those carry outdated commands.'
  - q: "Is Serena still MIT-licensed?"
    a: "Not as a whole. Since version 2.0.0, released October 13, 2026, the Serena application is licensed under GPL-3.0-or-later, and the serena-agent package as distributed is GPL. SolidLSP, the language-server client library inside it, remains MIT. The change is not retroactive: earlier releases stay available under MIT. Running Serena as a local tool is unaffected, but check with your legal team before embedding or redistributing it."
  - q: "Is Serena free?"
    a: "The server and its default language-server backend are free and open source. The alternative backend, the Serena JetBrains Plugin, is a paid plugin with a free trial. It adds operations the language-server backend lacks, including move and inline refactorings, type hierarchy, search in project dependencies and interactive debugging."
---

Serena calls itself "the IDE for your coding agent." Coding agents usually find code by text search and change it by string replacement. Serena puts language servers underneath and exposes symbol-level operations instead: find this function, list every symbol that references it, replace exactly its body, rename it everywhere. On a large codebase that replaces a chain of greps and whole-file reads with one precise call.

It is built by Oraios AI, runs locally, and connects over MCP to terminal agents such as [Claude Code](/tools/claude-code), Codex and Gemini CLI, to IDE assistants in VS Code, Cursor and JetBrains, and to desktop clients. It pays off most on big, multi-file codebases and matters least on small scripts.

## Highlights

- **Symbolic retrieval.** `find_symbol`, `get_symbols_overview` (a file outline), `find_referencing_symbols`, `find_declaration`, `find_implementations` and `get_diagnostics_for_file`.
- **Symbolic editing.** `replace_symbol_body`, `insert_before_symbol`, `insert_after_symbol`, `safe_delete_symbol` and `rename_symbol`, which renames through the language server's refactoring support.
- **40+ languages.** The language-server backend covers Python, TypeScript, JavaScript, Java, C/C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, Elixir and many more, down to Terraform, Solidity and Zig.
- **Two agent interfaces.** The classic one exposes each operation as an MCP tool. The REPL interface, new in version 2, gives the agent a single tool that executes Python and can combine several operations in one call. The `serena_repl` tool is marked BETA in Serena's tool list as of November 2026.
- **Memory.** A simple project memory for knowledge that should survive across sessions, which you can disable.
- **Contexts and modes.** `--context claude-code`, `ide`, `codex` and others tune the tool set to the host. Inside a harness such as Claude Code, Serena's basic file, search and shell tools are disabled by default because the harness already has them.
- **Transports.** stdio by default, or `--transport streamable-http` when you want to run the server yourself and point clients at a URL.

## In an AI-assisted workflow

```bash
uv tool install -p 3.13 serena-agent
serena init
serena setup claude-code        # one-command Claude Code setup

# or add it manually, for all projects:
claude mcp add --scope user serena -- serena start-mcp-server \
  --context claude-code --project-from-cwd
```

Confirm the connection with `/mcp` in Claude Code. Then ask for work where references matter:

```text
Find every caller of resolveSession, rename it to resolveUserSession
and update the call sites. Use Serena's symbol tools.
```

This is the work the [refactoring-specialist](/agents/developer-tools/refactoring-specialist) agent does: cross-cutting renames, signature changes, dead-code sweeps. With Serena the agent gets reference-accurate results from the language server instead of trusting a grep.

> [!TIP]
> If Serena does not start fast enough, its docs say to raise `MCP_TIMEOUT`, for example with `export MCP_TIMEOUT=60000` in your shell profile. Running `serena project index` in a project directory indexes it ahead of time.

Serena also ships optional Claude Code hooks (`serena-hooks remind`, `activate`, `cleanup` and `auto-approve`) that nudge the agent toward the symbol tools in long sessions. The docs call hooks an alpha feature as of November 2026 and say they are "not generally recommended for standard use."

## Good to know

- **License change.** Serena 2.0.0 (October 13, 2026) relicensed the application to GPL-3.0-or-later; SolidLSP stays MIT, and contributions now require a CLA. Releases before 2.0.0 remain MIT.
- **Versions.** The latest release is 2.1.0, from October 19, 2026. Version 1.0.0 shipped on April 3, 2026. The GitHub repository has about 31,700 stars as of November 2026.
- **Python and uv.** `uv` is the only prerequisite. The PyPI package `serena-agent` requires Python 3.11 or newer and below 3.15.
- **Extra language dependencies.** Some languages need their language server or toolchain installed separately; check Serena's language support page.
- **Language-server limits.** On the free backend, rename covers symbols only, find-declaration generally does not reach into external dependencies, and find-implementations works for some languages only. Move, inline and type hierarchy need the JetBrains plugin, which does not support Rider or CLion.
- **The REPL is not a sandbox.** Serena's docs note that restricting which operations the REPL can call "is a means of steering the agent, not a security mechanism."

Among alternatives, [Claude Context](/tools/claude-context) takes the other route to code retrieval: it indexes your codebase into a vector database for semantic search and does not edit. [Context7](/tools/context7) supplies documentation for third-party libraries, not your own symbols. [Aider](/tools/aider) is a full terminal coding agent with its own repository map, a replacement for the harness and not an add-on to it. Many setups run Serena inside [Claude Code](/tools/claude-code) and leave everything except symbol work to the harness.
