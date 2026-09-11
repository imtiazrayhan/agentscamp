---
name: "Codex CLI"
description: "OpenAI's open-source terminal coding agent with sandboxed execution and two-layer approval controls."
date: 2026-06-03
updated: "2026-09-11"
url: "https://openai.com/codex/"
pricing: "open-source"
category: "cli"
repo: "https://github.com/openai/codex"
color: "cyan"
topics: ["workflow-prompting", "ai-agents-systems"]
tags: ["cli", "agent", "terminal", "openai", "codex"]
featured: true
related: ["guide:openai-codex-guide", "guide:codex-agents-md", "guide:codex-config-toml", "guide:codex-skills-guide", "guide:codex-mcp-setup", "guide:codex-subagents", "guide:codex-automations", "guide:codex-troubleshooting", "tool:claude-code", "tool:aider", "tool:gemini-cli"]
alternativeTo: ["claude-code", "aider", "gemini-cli", "opencode"]
summary: "Codex CLI is OpenAI's open-source (Apache-2.0) terminal coding agent: it reads files, edits them on disk, and runs shell commands in an OS-level sandbox with network off by default and, in trusted folders, workspace-scoped writes. Sandbox modes and approval policies control what it can do and when it must ask; sign in with a ChatGPT plan or API key."
faq:
  - q: "What is Codex CLI?"
    a: "Codex CLI is OpenAI's open-source coding agent that runs entirely in your terminal. You point it at a repository, describe a task in plain language, and it reads files, edits them on disk, and runs shell commands — all inside an OS-level sandbox that blocks network access by default and, once you trust the folder, scopes writes to your workspace (it can start read-only until then). It is written in Rust."
  - q: "Is Codex CLI free?"
    a: "The tool itself is free and open source under Apache-2.0. For model usage, you either draw on the Codex allowance included in your ChatGPT plan (Free, Go, Plus, Pro, Business, Edu, or Enterprise) or pay per token with an OPENAI_API_KEY."
  - q: "How do I install Codex CLI?"
    a: "Install it with npm install -g @openai/codex — it also ships via Homebrew or a one-line shell installer — then run it in a repo, e.g. codex 'Add a retry with backoff to the API client and a test for it'. The same binary works on macOS, Linux, and Windows (natively or via WSL2)."
  - q: "Codex CLI vs Aider?"
    a: "One concrete difference: unlike Aider, Codex does not auto-commit each change. It edits the working tree and leaves staging and committing to you, so review the diff before committing."
audience: ["developers"]
---

Codex CLI is OpenAI's open-source coding agent that runs entirely in your terminal. You point it at a repository, describe a task in plain language, and it reads files, edits them on disk, and runs shell commands to get the job done — all inside an OS-level sandbox that blocks network access by default and, once you trust the folder, scopes writes to your workspace. It is written in Rust and ships as a binary installable via npm, Homebrew, or a one-line shell installer.

It is aimed at developers who live in the terminal and want an agent backed by OpenAI's frontier models without leaving the shell. You can authenticate with a ChatGPT plan (Free, Go, Plus, Pro, Business, Edu, or Enterprise) or an `OPENAI_API_KEY`, and the same binary works on macOS, Linux, and Windows (natively or via WSL2). Beyond the terminal, Codex ships an IDE extension and the Codex cloud agent, and `codex app` opens the desktop experience, which has been part of the ChatGPT desktop app on macOS and Windows since July 2026.

## Highlights

- **Two-layer security model** — sandbox modes (`read-only`, `workspace-write`, `danger-full-access`, via `--sandbox`) control what the agent can technically do; approval policies (`on-request`, `never`, or a granular per-category policy) control when it must stop and ask before acting. The `untrusted` approval value was retired in August 2026 and now prevents Codex from starting, so remove it from older configs; the per-project `trust_level = "untrusted"` setting still works.
- **Sandboxed by default** — outbound network is blocked by default, and in a trusted project the default `workspace-write` mode limits writes to the active workspace (a folder you haven't trusted yet can start in `read-only`), so edits stay local until you explicitly widen the boundary.
- **Model switching** — use `/model` to choose among the models available to your account and adjust reasoning effort per task, or pass `--oss` to run local open-source models through Ollama or LM Studio.
- **[MCP support](/guides/mcp/codex-mcp-setup)** — connect external tools through STDIO or Streamable HTTP servers configured in `config.toml`.
- **Non-interactive `codex exec`** — run Codex headlessly in scripts and CI, piping the final result to stdout.
- **Session resume and image input** — pick up past transcripts with `codex resume`, and attach screenshots or design specs as context.

## In an AI-assisted workflow

Codex CLI fits where you already run Git and your build. A typical loop is to start it in a trusted repo with the default `workspace-write` sandbox mode and `on-request` approval policy, let it draft edits, and approve anything that reaches outside the workspace or touches the network. It reads [`AGENTS.md`](/guides/configuration/codex-agents-md) files for project-specific context, so you can encode conventions and commands once and have them apply on every run. Repeatable procedures can move into [Codex skills](/guides/skills/codex-skills-guide) instead of growing the always-on instruction file.

```bash
npm install -g @openai/codex
cd your-project
codex "Add a retry with backoff to the API client and a test for it"
```

> [!TIP]
> Start with the `read-only` sandbox mode on an unfamiliar repository to have Codex propose a plan before it edits anything, then widen to `workspace-write` once you trust the direction.

> [!NOTE]
> Unlike Aider, Codex does not auto-commit each change — it edits the working tree and leaves staging and committing to you, so review the diff before committing.

## Good to know

Codex CLI is free and open source under the Apache-2.0 license, available on macOS and Linux natively and on Windows (natively via PowerShell or under WSL2). Model usage draws on your ChatGPT plan's included Codex allowance (even the Free and Go plans include one) or is billed per token with an API key. The `danger-full-access` sandbox mode removes network and filesystem guardrails — use it only on repositories and tasks you fully trust.
