---
name: "Google Antigravity"
title: "Google Antigravity"
description: "Google's agentic development platform — an agent-first IDE and Manager surface where multiple agents work across editor, terminal, and browser, on Gemini 3."
date: 2026-06-11
updated: "2026-09-11"
url: "https://antigravity.google"
pricing: "freemium"
category: "ide"
os: ["macOS", "Windows", "Linux"]
color: "blue"
topics: ["coding-languages"]
audience: ["developers"]
tags: ["ide", "agent", "multi-agent", "google", "browser-automation"]
featured: false
alternativeTo: ["gemini-cli", "cursor", "windsurf"]
sameAs:
  - "https://github.com/google-antigravity"
  - "https://en.wikipedia.org/wiki/Google_Antigravity"
  - "https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/"
related: ["tool:gemini-cli", "tool:cursor", "tool:windsurf", "tool:claude-code", "guide:cursor-vs-claude-code-vs-copilot-vs-windsurf-2026"]
summary: "Google Antigravity is Google's agentic development platform: an agent-first IDE plus a Manager surface that oversees multiple agents across editor, terminal, and browser. It launched with Gemini 3 in November 2025; I/O 2026 added a desktop app, CLI, and SDK. Its free Individual plan is generally available; it replaced Gemini CLI's free tier in June 2026."
faq:
  - q: "Is Google Antigravity free?"
    a: "Yes, for individuals. As of September 2026 the $0 Individual plan is labeled Generally Available, with basic weekly rate limits; Google AI Pro and Ultra subscriptions add more generous limits plus a flexible AI credit pool, and organizations pay consumption-based API pricing through Google Cloud. Check antigravity.google/pricing for current terms."
  - q: "Is Antigravity replacing Gemini CLI?"
    a: "Yes. Google announced at I/O 2026 (May 19, 2026) that it was unifying its developer-agent efforts into Antigravity, and as of June 18, 2026 Gemini CLI stopped serving requests for free, Google AI Pro, and Ultra users (enterprise Gemini Code Assist licenses and paid API keys keep access). The Antigravity CLI is the designated migration path."
  - q: "Is Antigravity open source?"
    a: "No. Unlike Gemini CLI (Apache-2.0), Antigravity is proprietary — free for individuals, but the IDE and CLI ship without source. Only the Python SDK is open (Apache-2.0). The closed-source CLI has drawn criticism from former Gemini CLI contributors."
---

Google Antigravity is Google's **agentic development platform**, launched alongside Gemini 3 in November 2025. It pairs an agent-first IDE with a **Manager surface** — a mission-control view where you spawn, orchestrate, and observe multiple agents working asynchronously across different workspaces. Agents don't just edit code: they act **across the editor, the terminal, and a browser**, and report back with **Artifacts** — task lists, implementation plans, screenshots, and browser recordings you can verify instead of reading raw logs.

At I/O 2026 (May 19, 2026), Google expanded it from an IDE into a product family — **Antigravity 2.0** added a standalone desktop app, the **Antigravity CLI** for terminal-first work, and an SDK for custom agent behaviors. It is also the designated successor to [Gemini CLI](/tools/gemini-cli): as of June 18, 2026, Gemini CLI's free, Pro, and Ultra service stopped, and Google points those users to Antigravity CLI.

## Highlights

- **Manager surface** — run several agents in parallel on different tasks and supervise them from one board, rather than babysitting a single chat.
- **Browser-using agents** — agents can drive a browser to verify the UI they just built, attaching screenshots and recordings as evidence.
- **Artifacts over logs** — plans, task lists, and recordings designed for human verification of agent work.
- **Gemini models, plus others** — launched with Gemini 3 Pro; as of September 2026 the agent models include Gemini 3.8, 3.7, and 3.6 Flash, Gemini 3.1 Pro, Claude Sonnet and Opus 4.6, and gpt-oss-120b, and the agent harness is co-optimized with newer Gemini releases.
- **A whole product family** — IDE, desktop app, terminal CLI sharing the same Core Agent Engine, and a Python SDK (Apache-2.0).

## In an AI-assisted workflow

The IDE and desktop app install from the site; the CLI is one line:

```bash
# Antigravity CLI (terminal surface)
curl -fsSL https://antigravity.google/cli/install.sh | bash

# IDE / desktop app: download from https://antigravity.google/download
```

Coming from Gemini CLI, the CLI keeps the concepts you've built around — agent skills, hooks, subagents, and extensions (as plugins) — and can export terminal sessions to the Antigravity 2.0 desktop app, with settings synced between the two.

> [!TIP]
> Antigravity's distinctive bet is *verification*: agents produce screenshots and browser recordings of what they did. Lean into it — ask for browser-verified evidence on UI tasks instead of trusting the diff alone.

## Good to know

Antigravity runs on macOS, Windows, and Linux and is **proprietary** — free for individuals on a generally available plan, with paid Google AI subscriptions adding higher usage limits. The closed source is a real change from Gemini CLI's Apache-2.0 openness and has drawn criticism from contributors; weigh it if open tooling matters to your team ([OpenCode](/tools/opencode) and [Codex CLI](/tools/codex-cli) are the open terminal-agent alternatives). Expect pricing, limits, and the model lineup to keep shifting.
