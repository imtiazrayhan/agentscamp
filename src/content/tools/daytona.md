---
name: "Daytona"
description: "Agent sandboxes that start in under 90ms: Linux containers by default, plus Linux VM, Windows, macOS and GPU classes. Managed cloud; the AGPL repo is archived."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://www.daytona.io"
pricing: "freemium"
category: "platform"
repo: "https://github.com/daytonaio/daytona"
license: "AGPL-3.0"
os: ["Web"]
color: "green"
topics: ["ai-agents-systems"]
audience: ["ai-engineers", "devops"]
tags: ["sandbox", "code-execution", "agents", "infrastructure"]
featured: false
alternativeTo: ["e2b", "modal", "vercel-sandbox"]
sameAs:
  - "https://github.com/daytonaio/daytona"
  - "https://www.daytona.io/docs/"
  - "https://app.daytona.io"
related: ["guide:sandboxing-ai-generated-code", "tool:e2b", "tool:modal", "tool:vercel-sandbox", "glossary:computer-use"]
summary: "Daytona runs sandboxes for AI agents: Linux containers that start in under 90ms by default, plus Linux VM, Windows, macOS and GPU classes, with snapshots, volumes and SDKs in five languages. The cloud is usage-billed with signup credits. The AGPL-3.0 repository was archived in 2026 and gets no updates, so self-hosting means running unmaintained code."
faq:
  - q: "Is this the same Daytona that managed dev environments?"
    a: "Same company, different product. Daytona refocused from Codespaces-style dev environments to AI agent runtimes starting late 2024, relaunched in 2025, and raised a $24M FirstMark-led Series A (February 2026) on the new identity — customers include LangChain and Writer. Anything written about Daytona before 2025 describes the old product, and the repo's high star count largely predates the pivot."
  - q: "What makes Daytona different from E2B?"
    a: "Three visible bets: startup speed (sub-90ms creation for the default container class, the headline claim), OS breadth (Linux VM, Windows and macOS sandboxes alongside Linux containers, rare in the category), and Bring Your Own Compute, where Daytona's control plane manages runners on your infrastructure. The fully self-hosted route has faded: the open-source repository says development moved to a private codebase in June 2026 and it will get no further updates. E2B counters with the code-interpreter ergonomics, Apache licensing, and the desktop product."
  - q: "How is Daytona priced?"
    a: "Usage-based, as of November 2026 from daytona.io/pricing: $0.0504 per vCPU-hour, $0.0162 per GiB of memory per hour, and $0.000108 per GiB of storage per hour after the first 5 GiB free, all billed per second. Windows is listed at $0.0858 per vCPU-hour and macOS at $0.0082 per core-hour, and preemptible GPUs run hourly from $0.57 (RTX 4090) to $5.17 (Nvidia B300), with an H100 at $2.47. New accounts get $200 in free compute and the startup program grants up to $50k in credits. The archived AGPL-3.0 repository is still free to run, as is and without support, with copyleft obligations if you modify and serve it."
---

Daytona is the category's speed-and-breadth play, and one of 2026's cleaner pivot stories: the dev-environment manager rebuilt itself as **infrastructure for agent code execution** — "give every agent a computer" — and the market answered (a FirstMark-led $24M Series A in February 2026, with LangChain among the customers).

## Highlights

- **Sub-90ms sandbox creation** — fast enough that agents treat computers as disposable per-step resources, not provisioned assets.
- **Real isolation** — Daytona's docs promise a dedicated kernel, filesystem, and network stack per sandbox, with allocated vCPU/RAM/disk. The default class is a Linux container; Linux VM and GPU (NVIDIA and AMD) sandboxes are separate classes.
- **Lifecycle primitives** — start, stop, pause, **snapshot**; stateful sandboxes persist across runs, and volumes share data between them.
- **Multi-OS** — Linux containers by default, with Linux VM and Windows sandboxes and macOS sandboxes on dedicated Apple silicon hardware — the unusual capability for testing and automation beyond the Linux monoculture.
- **Agent-shaped tooling** — process exec, filesystem ops, Git operations, and LSP support exposed through SDKs in Python, TypeScript, Ruby, Go, and Java.
- **Two supported deployment modes** — managed cloud (US and EU regions), or Bring Your Own Compute, which attaches your own runner nodes to Daytona's control plane and has to be enabled for your organization. The self-hosted AGPL stack survives only in the archived repository.

## In an AI-assisted workflow

```bash
pip install "daytona[v0-sdk]>=2,<3"      # or: npm install @daytona/sdk@2
# sandbox = Daytona().v0.create(); sandbox.process.exec("python analyze.py")
```

The fit: agent systems that churn through many short-lived executions (where 90ms vs seconds compounds), need Windows or macOS targets, or have compliance reasons to keep compute on their own infrastructure through Bring Your Own Compute.

> [!NOTE]
> SDK 2.x connects to Daytona Cloud only; the docs say to stay on SDK 0.x (`pip install "daytona<1"`, `npm install @daytona/sdk@0`) if you need a custom API URL. Two npm scopes exist from the transition, legacy `@daytonaio/sdk` and current `@daytona/sdk` (both still published). And per-second billing means idle sandboxes cost money until stopped: wire cleanup into the agent's lifecycle.

## Good to know

The `daytonaio/daytona` repository is AGPL-3.0 and archived: its README says that as of June 2026 core development moved to a private codebase and the repo "will receive no further updates, fixes, or releases", though it stays free to use and fork. The SDKs keep shipping on PyPI and npm under Apache-2.0. The repo's roughly 71k GitHub stars (as of November 2026) substantially predate the pivot to agent sandboxes, so judge adoption by the 2026 product, not the counter. Category trade-offs versus [E2B](/tools/e2b), [Modal](/tools/modal), and [Vercel Sandbox](/tools/vercel-sandbox): [Sandboxing AI-Generated Code](/guides/advanced/sandboxing-ai-generated-code).
