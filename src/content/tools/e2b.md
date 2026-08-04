---
name: "E2B"
description: "Open-source Firecracker-microVM sandboxes where AI agents safely run untrusted code — stateful interpreters, full Linux, pause/resume, desktop VMs."
date: 2026-06-11
url: "https://e2b.dev"
pricing: "freemium"
category: "platform"
repo: "https://github.com/e2b-dev/E2B"
license: "Apache-2.0"
os: ["Web"]
color: "orange"
topics: ["ai-agents-systems"]
tags: ["sandbox", "code-execution", "agents", "firecracker"]
featured: false
alternativeTo: ["daytona", "modal", "vercel-sandbox"]
sameAs:
  - "https://github.com/e2b-dev/E2B"
  - "https://e2b.dev/docs"
  - "https://github.com/e2b-dev/infra"
related: ["guide:sandboxing-ai-generated-code", "tool:daytona", "tool:modal", "tool:vercel-sandbox", "glossary:computer-use", "glossary:agent-engineering"]
summary: "E2B is the category-defining agent sandbox: Firecracker microVMs your agent spins up to run untrusted code — stateful Python/JS interpreters with rich outputs, full Linux terminals, package installs, pause/resume persistence, and a Desktop Sandbox for computer-use agents. SDKs and the production infra are Apache-2.0 (self-hostable); the hosted cloud is freemium with per-second billing."
faq:
  - q: "What is E2B used for?"
    a: "Giving agents a safe computer. The canonical case is the code interpreter: the LLM writes Python, E2B executes it in an isolated microVM and returns results (including charts), so generated code never touches your infrastructure. Beyond that: full Linux terminals for agent workflows, data analysis over uploaded files, and cloud desktops for computer-use agents."
  - q: "Is E2B open source?"
    a: "Genuinely, by sandbox-category standards: the SDKs AND the production cloud infrastructure are Apache-2.0 (e2b-dev/infra), so self-hosting the real stack is possible. The turnkey experience is their hosted cloud — free Hobby tier with one-time credits, then per-second compute billing and a Pro tier for longer sessions and more concurrency."
  - q: "How do sessions and persistence work?"
    a: "Sandboxes are stateful while running (Hobby caps sessions at 1 hour, Pro at 24), and pause/resume preserves the full filesystem and memory state indefinitely — so an agent can park a sandbox and pick it up days later. Two SDK layers exist: the base e2b SDK and e2b-code-interpreter with the run-code niceties."
---

E2B named the category: when agents started writing code that *had to run somewhere*, "somewhere" needed to be disposable, isolated, and fast. E2B's answer — Firecracker microVMs behind a two-line SDK — became the default pattern, with Perplexity, Hugging Face, and Groq among the users its Series A announced.

## Highlights

- **Code-interpreter sandboxes** — run LLM-generated Python/JS (Ruby and C++ too) with rich outputs including charts; the `e2b-code-interpreter` SDK makes it `Sandbox.create()` + `run_code(...)`.
- **A full Linux VM per sandbox** — terminal, package installation, filesystem, internet: agent workflows that need a real computer, not just an eval().
- **Pause/resume persistence** — full state preserved indefinitely; long-running agent jobs park and resume across the session caps.
- **Desktop Sandbox** — cloud Linux desktops with a GUI, purpose-built for [computer-use agents](/glossary/computer-use).
- **Open infrastructure** — SDKs and the production cloud stack are Apache-2.0; self-hosting the real thing is supported, not theoretical.
- **Per-second economics** — pay for CPU/RAM by the second; a free Hobby tier (with one-time credits) covers development.

## In an AI-assisted workflow

```bash
pip install e2b-code-interpreter   # or: npm i @e2b/code-interpreter
# export E2B_API_KEY=...
# sbx = Sandbox.create(); sbx.run_code("import pandas as pd; ...")
```

The integration point is the agent's "execute code" tool: generated code goes to the sandbox, stdout/results come back as observations — the [agent loop](/glossary/ai-agent) with the dangerous part outsourced.

> [!NOTE]
> Two SDK layers trip up first-timers: `e2b` is the base sandbox SDK; `e2b-code-interpreter` adds the run-code conveniences most agent builders want. (And the repo is uppercase `E2B`; packages are lowercase.)

## Good to know

$21M Series A led by Insight Partners (July 2025). Hobby sessions cap at one hour (pause/resume or Pro for longer); sandboxes are Linux-only including desktops. How it compares to [Daytona](/tools/daytona)'s multi-OS speed play, [Modal](/tools/modal)'s broader compute platform, and [Vercel Sandbox](/tools/vercel-sandbox)'s ecosystem integration: [Sandboxing AI-Generated Code](/guides/advanced/sandboxing-ai-generated-code).
