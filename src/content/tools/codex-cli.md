---
name: "Codex CLI"
description: "OpenAI's open-source terminal coding agent with sandboxed execution and two-layer approval controls."
date: 2026-06-03
url: "https://openai.com/codex/"
pricing: "open-source"
category: "cli"
repo: "https://github.com/openai/codex"
color: "cyan"
topics: ["coding-languages"]
tags: ["cli", "agent", "terminal"]
featured: true
related: ["claude-code", "aider", "gemini-cli"]
summary: "Codex CLI is OpenAI's open-source (Apache-2.0) coding agent that runs entirely in your terminal: it reads files, edits them on disk, and runs shell commands inside an OS-level sandbox that defaults to no network and workspace-scoped writes. Sandbox modes and approval policies control what it can do and when it must ask; auth is a ChatGPT plan or API key."
faq:
  - q: "What is Codex CLI?"
    a: "Codex CLI is OpenAI's open-source coding agent that runs entirely in your terminal. You point it at a repository, describe a task in plain language, and it reads files, edits them on disk, and runs shell commands — all inside an OS-level sandbox that defaults to no network access and write permissions scoped to your workspace. It is written in Rust."
  - q: "Is Codex CLI free?"
    a: "The tool itself is free and open source under Apache-2.0, but model usage is not: you either consume your ChatGPT plan's included Codex allowance (Plus, Pro, Business, Edu, or Enterprise) or pay per token with an OPENAI_API_KEY."
  - q: "How do I install Codex CLI?"
    a: "Install it with npm install -g @openai/codex — it also ships via Homebrew or a one-line shell installer — then run it in a repo, e.g. codex 'Add a retry with backoff to the API client and a test for it'. The same binary works on macOS, Linux, and Windows (natively or via WSL)."
  - q: "Codex CLI vs Aider?"
    a: "One concrete difference: unlike Aider, Codex does not auto-commit each change. It edits the working tree and leaves staging and committing to you, so review the diff before committing."
---

Codex CLI is OpenAI's open-source coding agent that runs entirely in your terminal. You point it at a repository, describe a task in plain language, and it reads files, edits them on disk, and runs shell commands to get the job done — all inside an OS-level sandbox that defaults to no network access and write permissions scoped to your workspace. It is written in Rust and ships as a binary installable via npm, Homebrew, or a one-line shell installer.

It is aimed at developers who live in the terminal and want an agent backed by OpenAI's frontier models without leaving the shell. You can authenticate with a ChatGPT plan (Plus, Pro, Business, Edu, or Enterprise) or an `OPENAI_API_KEY`, and the same binary works on macOS, Linux, and Windows (natively or via WSL).

## Highlights

- **Two-layer security model** — sandbox modes (`read-only`, `workspace-write`, `danger-full-access`, via `--sandbox`) control what the agent can technically do; approval policies (`on-request`, `untrusted`, `never`) control when it must stop and ask before acting.
- **Sandboxed by default** — the `workspace-write` mode limits writes to the active workspace and blocks outbound network, so edits stay local until you explicitly widen the boundary.
- **Model switching** — use `/model` to move between GPT-5.5, GPT-5.4, GPT-5.4-mini, and other available models, and adjust reasoning effort per task.
- **MCP support** — connect external tools by configuring Model Context Protocol servers (STDIO or streaming HTTP) in the config file.
- **Non-interactive `codex exec`** — run Codex headlessly in scripts and CI, piping the final result to stdout.
- **Session resume and image input** — pick up past transcripts with `codex resume`, and attach screenshots or design specs as context.

## In an AI-assisted workflow

Codex CLI fits where you already run Git and your build. A typical loop is to start it in a repo with the default `workspace-write` sandbox mode and `on-request` approval policy, let it draft edits, and approve anything that reaches outside the workspace or touches the network. It reads `AGENTS.md` files for project-specific context, so you can encode conventions and commands once and have them apply on every run.

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

Codex CLI is free and open source under the Apache-2.0 license, available on macOS and Linux natively and on Windows (natively via PowerShell or under WSL2). Model usage is not free: you either consume your ChatGPT plan's included Codex allowance or pay per token with an API key. The `danger-full-access` sandbox mode removes network and filesystem guardrails — use it only on repositories and tasks you fully trust.
