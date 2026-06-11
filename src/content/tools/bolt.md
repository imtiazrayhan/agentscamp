---
name: "Bolt"
description: "StackBlitz's in-browser AI agent that builds, runs, and deploys full-stack web apps in a WebContainer."
date: 2026-06-03
url: "https://bolt.new"
repo: "https://github.com/stackblitz/bolt.new"
pricing: "freemium"
category: "platform"
color: "yellow"
topics: ["coding-languages", "workflow-prompting"]
tags: ["web", "generation", "in-browser"]
featured: false
related: ["v0", "lovable", "replit-agent"]
summary: "Bolt (bolt.new) is StackBlitz's AI app builder that turns a prompt into a running full-stack web app. The dev environment — Node.js runtime, terminal, dev server, and preview — runs in a WebContainer in your browser tab, so the agent can run the app, read errors, and fix them in the loop. Freemium, metered by tokens, with deploys to a live URL from chat."
faq:
  - q: "What is Bolt?"
    a: "Bolt (bolt.new) is StackBlitz's AI app builder that turns a prompt into a running full-stack web application. The whole dev environment — Node.js runtime, package manager, terminal, dev server, and preview — runs inside a WebContainer in your browser tab, so there's nothing to install and the agent controls the full filesystem and processes."
  - q: "How much does Bolt cost?"
    a: "Bolt is freemium. The free tier caps at 300K tokens/day and 1M tokens/month; Pro ($25/month) lifts the daily cap and raises the monthly allowance to a 10M-token baseline with rollover; Teams is $30/member/month and Enterprise is custom-quoted. Every prompt, iteration, and fix consumes tokens, so vague or repeated re-prompts get expensive fast."
  - q: "Is Bolt open source?"
    a: "StackBlitz open-sourced the original bolt.new codebase under MIT, but the live, fully-featured product at bolt.new is the hosted, token-metered service — not a self-host target for most users. It's also distinct from the Bolt.diy / oTToDev community fork and from unrelated apps called Bolt."
---

Bolt (bolt.new) is StackBlitz's AI app builder that turns a prompt into a running full-stack web application. The twist is where it executes: the entire dev environment — Node.js runtime, package manager, terminal, dev server, and preview — runs inside a WebContainer in your browser tab, so there's nothing to install and the agent has full control of the filesystem and processes.

It is aimed at people who want to go from idea to a live URL quickly: founders prototyping, developers spinning up a starting point, and non-developers who can iterate by describing changes in chat. Because the stack runs in-browser, the loop from prompt to preview to deploy is unusually short.

## Highlights

- **WebContainer runtime** — the app's Node server, npm install, terminal, and browser console all run client-side in the tab; the AI agent drives the whole environment, not just a code panel.
- **Full-stack generation** — scaffolds frontend, backend logic, and database wiring from a natural-language prompt, then iterates on follow-up requests.
- **Framework-aware** — works with popular JS frameworks and component libraries (React, Vite, Tailwind, shadcn/ui, and more) rather than a locked-in template.
- **Import and export** — start from a Figma design or a GitHub repo, and push generated projects back out to GitHub.
- **Built-in hosting and deploy** — ship to a live URL directly from chat using Bolt's own hosting (custom domains on paid plans); optionally connect to Netlify instead.
- **Error-aware iteration** — the agent reads the running console and terminal output, so it can detect and fix runtime errors in the loop instead of guessing blind.

## In an AI-assisted workflow

Bolt sits at the very start of a project, before a local repo exists. A common loop is to describe the app, watch it build and run live in the preview, then refine by prompting against the running result:

```text
Build a task tracker with a Postgres-backed API, a board view,
and email/password auth. Use React + Tailwind.

> add drag-and-drop between columns and persist the order
```

When the prototype is solid, export to GitHub and continue in a full editor or agent such as [Cursor](/tools/cursor) or [Claude Code](/tools/claude-code) — Bolt is strongest for the zero-to-one phase, while disk-based agents are better for sustained work on a large existing codebase.

> [!TIP]
> Build in small, verifiable steps. WebContainer runs the app for real, so asking for one feature at a time lets the agent catch and fix runtime errors against actual output instead of accumulating broken state.

## Good to know

Bolt is a hosted, browser-based product — no install, runs anywhere a modern browser does. Pricing is freemium: the free tier caps at 300K tokens/day and 1M tokens/month. The Pro plan ($25/month) lifts the daily cap, raises the monthly allowance to a baseline of 10M tokens (a starting allotment, with unused tokens rolling over), and adds custom domains and SEO tooling. A Teams plan ($30/member/month) adds collaboration and centralized billing; Enterprise is custom-quoted. Every prompt, iteration, and fix consumes tokens — a single multi-page app with auth and a database can burn through a large share of a day's allowance, so vague or repeated re-prompts get expensive fast.

> [!WARNING]
> "Bolt" is an overloaded name — this is bolt.new by StackBlitz, distinct from the Bolt.diy / oTToDev community fork and from unrelated apps called Bolt. The browser-based hosted product is what's metered by tokens.

StackBlitz also open-sourced the original bolt.new codebase (MIT) on GitHub, but the live, fully-featured product at bolt.new is the hosted service described here, not a self-host target for most users.
