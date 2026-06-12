---
name: "Daytona"
description: "Sub-90ms agent sandboxes — isolated computers with snapshots, volumes, Git and LSP tools, on Linux, Windows, or Android; AGPL self-host or managed cloud."
date: 2026-06-11
url: "https://www.daytona.io"
pricing: "freemium"
category: "platform"
repo: "https://github.com/daytonaio/daytona"
license: "AGPL-3.0"
os: ["Web"]
color: "green"
topics: ["ai-agents-systems"]
tags: ["sandbox", "code-execution", "agents", "infrastructure"]
featured: false
alternativeTo: ["e2b", "modal", "vercel-sandbox"]
sameAs:
  - "https://github.com/daytonaio/daytona"
  - "https://www.daytona.io/docs/"
  - "https://app.daytona.io"
related: ["sandboxing-ai-generated-code", "e2b", "modal", "vercel-sandbox", "computer-use"]
summary: "Daytona pivoted from dev-environment manager to agent infrastructure and found its market: sandboxes that start in under 90ms — isolated computers with dedicated kernel, filesystem, and network, lifecycle primitives, shared volumes, and agent tools — on Linux, Windows, or Android, with GPUs available. AGPL-3.0 self-hostable; cloud is usage-billed with signup credits."
faq:
  - q: "Is this the same Daytona that managed dev environments?"
    a: "Same company, different product. Daytona refocused from Codespaces-style dev environments to AI agent runtimes starting late 2024, relaunched in 2025, and raised a $24M FirstMark-led Series A (February 2026) on the new identity — customers include LangChain and Writer. Anything written about Daytona before 2025 describes the old product, and the repo's high star count largely predates the pivot."
  - q: "What makes Daytona different from E2B?"
    a: "Three visible bets: startup speed (sub-90ms creation, the headline claim), multi-OS sandboxes (Windows and Android alongside Linux — rare in the category), and deployment flexibility (managed cloud, fully self-hosted AGPL stack via Docker Compose, or a hybrid where Daytona runs the control plane over your compute). E2B counters with the code-interpreter ergonomics, Apache licensing, and the desktop product."
  - q: "How is Daytona priced?"
    a: "Usage-based: per-hour rates for vCPU, memory, and storage (GPUs like H100s available hourly), with free compute credits on signup and startup-program credits beyond that. Self-hosting under AGPL-3.0 trades the meter for ops — with copyleft obligations if you modify and serve it."
---

Daytona is the category's speed-and-breadth play, and one of 2026's cleaner pivot stories: the dev-environment manager rebuilt itself as **infrastructure for agent code execution** — "give every agent a computer" — and the market answered (a FirstMark-led $24M Series A in February 2026, with LangChain among the customers).

## Highlights

- **Sub-90ms sandbox creation** — fast enough that agents treat computers as disposable per-step resources, not provisioned assets.
- **Real isolation** — dedicated kernel, filesystem, and network stack per sandbox, with configurable vCPU/RAM/disk and GPU options.
- **Lifecycle primitives** — start, stop, pause, **snapshot**; stateful sandboxes persist across runs, and volumes share data between them.
- **Multi-OS** — Linux by default, with Windows and Android sandboxes (priced per vCPU-hour) — the unusual capability for testing and automation beyond the Linux monoculture.
- **Agent-shaped tooling** — process exec, filesystem ops, Git operations, and LSP support exposed through SDKs in Python, TypeScript, Ruby, and Go.
- **Three deployment modes** — managed cloud, fully self-hosted AGPL stack, or hybrid control-plane over customer-managed compute.

## In an AI-assisted workflow

```bash
pip install daytona      # or: npm install @daytona/sdk
# sandbox = daytona.create(); sandbox.process.exec("python analyze.py")
```

The fit: agent systems that churn through many short-lived executions (where 90ms vs seconds compounds), need Windows/Android targets, or have compliance reasons to self-host the whole stack.

> [!NOTE]
> Two npm scopes exist from the transition — legacy `@daytonaio/sdk` and current `@daytona/sdk` (both published, README uses the new one). And per-second billing means idle sandboxes cost money until stopped: wire cleanup into the agent's lifecycle.

## Good to know

AGPL-3.0 (copyleft applies to self-host modifications), releases in fast lockstep across PyPI/npm. The honest caveat repeated from our research: the ~72k GitHub stars substantially predate the pivot — judge adoption by the 2026 product, not the counter. Category trade-offs versus [E2B](/tools/e2b), [Modal](/tools/modal), and [Vercel Sandbox](/tools/vercel-sandbox): [Sandboxing AI-Generated Code](/guides/advanced/sandboxing-ai-generated-code).
