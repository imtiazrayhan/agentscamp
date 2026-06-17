---
name: "Google Antigravity"
title: "Google Antigravity"
description: "Google's agentic development platform — an agent-first IDE and Manager surface where multiple agents work across editor, terminal, and browser, on Gemini 3."
date: 2026-06-11
url: "https://antigravity.google"
pricing: "freemium"
category: "ide"
os: ["macOS", "Windows", "Linux"]
color: "blue"
topics: ["coding-languages"]
tags: ["ide", "agent", "multi-agent", "google", "browser-automation"]
featured: false
alternativeTo: ["gemini-cli", "cursor", "windsurf"]
sameAs:
  - "https://github.com/google-antigravity"
  - "https://en.wikipedia.org/wiki/Google_Antigravity"
  - "https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/"
related: ["gemini-cli", "cursor", "windsurf", "claude-code", "cursor-vs-claude-code-vs-copilot-vs-windsurf-2026"]
summary: "Google Antigravity is Google's agentic development platform: an agent-first IDE (a VS Code fork) plus a Manager surface that spawns and oversees multiple asynchronous agents working across editor, terminal, and browser. Launched with Gemini 3 in November 2025 and expanded at I/O 2026 with a desktop app, the Antigravity CLI, and an SDK. Free public preview; it succeeds Gemini CLI."
faq:
  - q: "Is Google Antigravity free?"
    a: "As of mid-2026 it's in public preview at no cost for individuals, with Gemini 3 Pro access at generous rate limits. Google AI paid subscriptions advertise higher Antigravity usage limits, so expect the free tier to be the entry point rather than the whole story — check antigravity.google/pricing for current terms."
  - q: "Is Antigravity replacing Gemini CLI?"
    a: "Yes. Google announced in May 2026 that it is unifying its developer-agent efforts into Antigravity, and Gemini CLI stops serving requests for free, Google AI Pro, and Ultra users on June 18, 2026 (enterprise Gemini Code Assist licenses keep access). The Antigravity CLI is the designated migration path."
  - q: "Is Antigravity open source?"
    a: "No. Unlike Gemini CLI (Apache-2.0), Antigravity is proprietary — free to use during the preview, but the IDE and CLI ship without source. Only the Python SDK is open (Apache-2.0). The closed-source CLI has drawn criticism from former Gemini CLI contributors."
---

Google Antigravity is Google's **agentic development platform**, launched alongside Gemini 3 in November 2025. It pairs an agent-first IDE (a heavily modified VS Code fork) with a **Manager surface** — a mission-control view where you spawn, orchestrate, and observe multiple agents working asynchronously across different workspaces. Agents don't just edit code: they act **across the editor, the terminal, and a browser**, and report back with **Artifacts** — task lists, implementation plans, screenshots, and browser recordings you can verify instead of reading raw logs.

At I/O 2026 (May 19), Google expanded it from an IDE into a product family — **Antigravity 2.0** added a standalone desktop app, the **Antigravity CLI** for terminal-first work, and an SDK for custom agent behaviors. It is also the designated successor to [Gemini CLI](/tools/gemini-cli), whose free-tier service ends June 18, 2026.

## Highlights

- **Manager surface** — run several agents in parallel on different tasks and supervise them from one board, rather than babysitting a single chat.
- **Browser-using agents** — agents can drive a browser to verify the UI they just built, attaching screenshots and recordings as evidence.
- **Artifacts over logs** — plans, task lists, and recordings designed for human verification of agent work.
- **Gemini 3 models, plus others** — launched with Gemini 3 Pro at generous rate limits, alongside Claude Sonnet 4.6 and GPT-OSS; the agent harness is co-optimized with newer Gemini releases.
- **A whole product family** — IDE, desktop app, terminal CLI sharing the same Core Agent Engine, and a Python SDK (Apache-2.0).

## In an AI-assisted workflow

The IDE and desktop app install from the site; the CLI is one line:

```bash
# Antigravity CLI (terminal surface)
curl -fsSL https://antigravity.google/cli/install.sh | bash

# IDE / desktop app: download from https://antigravity.google/download
```

Coming from Gemini CLI, the CLI keeps the concepts you've built around — agent skills, hooks, subagents, and extensions (as plugins) — and can sync sessions with the GUI surfaces.

> [!TIP]
> Antigravity's distinctive bet is *verification*: agents produce screenshots and browser recordings of what they did. Lean into it — ask for browser-verified evidence on UI tasks instead of trusting the diff alone.

## Good to know

Antigravity runs on macOS, Windows, and Linux and is **proprietary** — free for individuals during the public preview, with paid Google AI subscriptions advertising higher usage limits. The closed source is a real change from Gemini CLI's Apache-2.0 openness and has drawn criticism from contributors; weigh it if open tooling matters to your team ([OpenCode](/tools/opencode) and [Codex CLI](/tools/codex-cli) are the open terminal-agent alternatives). Preview products move fast: expect pricing, limits, and model lineup to shift.
