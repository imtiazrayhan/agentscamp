---
name: "Serena"
title: "Serena"
description: "An MCP toolkit that gives coding agents IDE-grade powers — symbol-level retrieval and editing via language servers, across 40+ languages."
date: 2026-06-11
url: "https://oraios.github.io/serena"
pricing: "open-source"
category: "mcp"
repo: "https://github.com/oraios/serena"
license: "MIT"
os: ["macOS", "Windows", "Linux"]
color: "cyan"
topics: ["mcp"]
tags: ["mcp", "lsp", "refactoring", "code-intelligence", "symbols"]
featured: false
sameAs:
  - "https://pypi.org/project/serena-agent/"
related: ["best-mcp-servers-2026", "claude-code-mcp-setup", "refactoring-specialist", "dead-code-finder", "extract-function", "claude-code"]
summary: "Serena (MIT, ~25k stars) is 'the IDE for your agent': an MCP server backed by language servers giving agents symbol-level tools — find symbol, find references, replace symbol body, rename — across 40+ languages. Precise, token-efficient edits at the symbol level instead of regex surgery, plus a project memory for cross-session knowledge."
faq:
  - q: "What does Serena add that Claude Code doesn't have?"
    a: "Symbol-level semantics. Claude Code's built-in search and edit work on text; Serena works on the language server's understanding — find a symbol, list everything referencing it, replace exactly its body, rename it project-wide. On large codebases that's both more precise and more token-efficient than reading whole files to locate one function."
  - q: "How do I add Serena to Claude Code?"
    a: "Install once: uv tool install -p 3.13 serena-agent && serena init. Then globally: claude mcp add --scope user serena -- serena start-mcp-server --context claude-code --project-from-cwd, or per-project with --project \"$(pwd)\". The --context claude-code flag tunes its toolset for the harness (its generic file/shell tools stay disabled to avoid overlap)."
  - q: "Is Serena free?"
    a: "Yes — MIT core with the free LSP backend covering 40+ languages. The optional JetBrains-plugin backend (which adds IDE-exclusive operations like move/inline refactorings and interactive debugging) is a paid plugin with a free trial."
---

Serena's tagline — "the IDE for your agent" — is accurate. Where coding agents normally navigate by text search, Serena plugs language servers underneath and exposes **symbol-level tools**: find this function, list every reference to it, replace exactly its body, rename it everywhere. On a large codebase, that's the difference between surgical edits and regex archaeology.

## Highlights

- **Symbolic retrieval** — find symbol, file symbol overview, find referencing symbols, diagnostics: the agent locates code by meaning, not string-matching.
- **Symbolic editing** — replace symbol body, insert before/after symbol, safe deletes, and LSP-powered rename refactoring.
- **40+ languages** — Python, TypeScript/JS, Java, C/C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, Elixir, and more via the LSP backend.
- **Token-efficient by design** — symbol overviews and targeted reads keep big-repo work inside a sane context budget.
- **Project memory** — a cross-session knowledge store, so what the agent learns about the codebase persists.
- **Contexts and modes** — `--context claude-code`, `ide-assistant`, and others tune the toolset to the host; stdio or HTTP transport.

## In an AI-assisted workflow

```bash
uv tool install -p 3.13 serena-agent
serena init
claude mcp add --scope user serena -- serena start-mcp-server \
  --context claude-code --project-from-cwd
# then:
# > Find every caller of resolveSession, then rename it to resolveUserSession
# > and update the call sites — use Serena's symbol tools
```

It shines on exactly the work the [refactoring-specialist](/agents/developer-tools/refactoring-specialist) agent does: cross-cutting renames, signature changes, dead-code sweeps — now with reference-accurate ground truth instead of grep confidence.

> [!TIP]
> Slow first start? Language servers take a moment to warm up on big repos — launch with `MCP_TIMEOUT=60000 claude` and let `serena init`'s indexing finish once per project.

## Good to know

MIT, Python-based (installed via `uv`; PyPI package `serena-agent`), v1.0 landed April 2026 with the streamlined install flow. Inside Claude Code, Serena's generic file/shell tools are deliberately disabled — its value there is purely the symbolic layer. The optional JetBrains-plugin backend (paid, free trial) unlocks IDE-exclusive operations: move/inline refactorings, type hierarchies, and interactive debugging.
