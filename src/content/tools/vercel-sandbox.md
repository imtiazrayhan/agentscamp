---
name: "Vercel Sandbox"
description: "Ephemeral Firecracker microVMs on Vercel for untrusted and AI-generated code — millisecond startup, Node and Python runtimes, persistent by default."
date: 2026-06-11
url: "https://vercel.com/docs/sandbox"
pricing: "freemium"
category: "platform"
repo: "https://github.com/vercel/sandbox"
license: "Apache-2.0"
os: ["Web"]
color: "pink"
topics: ["ai-agents-systems"]
tags: ["sandbox", "code-execution", "vercel", "firecracker"]
featured: false
alternativeTo: ["e2b", "modal", "daytona"]
sameAs:
  - "https://github.com/vercel/sandbox"
  - "https://www.npmjs.com/package/@vercel/sandbox"
related: ["sandboxing-ai-generated-code", "e2b", "modal", "daytona", "vercel-ai-sdk", "v0"]
summary: "Vercel Sandbox (GA January 2026) runs untrusted and AI-generated code in ephemeral Firecracker microVMs: millisecond startup, Node and Python runtimes with sudo, sandboxes persistent by default via automatic filesystem snapshots, up to 2,000 concurrent on Pro. The SDK and CLI are open-source Apache-2.0; Hobby gets a real free monthly allotment, Pro is usage-billed."
faq:
  - q: "What is Vercel Sandbox for?"
    a: "Running code you didn't write and can't trust — user submissions and, overwhelmingly, agent-generated code — in isolation: each sandbox is a Firecracker microVM with its own filesystem and network, unable to reach your env vars, databases, or cloud resources. It's the execution backend pattern v0 and AI-coding products use in production."
  - q: "What runtimes and limits does it support?"
    a: "Node (26/24/22) and Python 3.13 on Amazon Linux 2023, with sudo — install anything, including system-level workloads. Default timeout 5 minutes, extendable to 45 minutes on Hobby and 5 hours on Pro+; up to 8 vCPUs/16GB (Pro) or 32 vCPUs/64GB (Enterprise) per sandbox, with 2,000 concurrent sandboxes on Pro."
  - q: "How does persistence work?"
    a: "It's on by default: stopping a sandbox auto-snapshots the filesystem, and resuming by name restores it — dependency installs survive between runs. Snapshots count toward billed storage and expire 30 days after last use; pass persistent: false for true one-offs."
---

Vercel Sandbox is the platform answer to the agent-code-execution problem: if your stack already lives on Vercel — AI SDK apps, v0 output, Next.js products — the sandbox is *right there*, with the same OIDC auth, billing, and SDK ergonomics as everything else you deploy.

## Highlights

- **Firecracker isolation** — each sandbox is a microVM with its own filesystem and network; sandboxed code can't touch your environment, data, or cloud resources.
- **Real runtimes with root** — Node 26/24/22 and Python 3.13 on Amazon Linux, sudo included: package installs, Docker-in-sandbox, even VPN clients and FUSE.
- **Persistent by default** — automatic filesystem snapshots on stop; resume by name and skip the reinstall; explicit snapshots and beta Drives for attachable storage.
- **Serious ceilings** — millisecond startup, timeouts to 5 hours, 32 vCPUs/64GB at the top tier, 2,000 concurrent sandboxes on Pro.
- **Open SDK + CLI** — `@vercel/sandbox` (and a Python SDK) open-sourced Apache-2.0 at GA, with a CLI for scripting fleets.
- **Honest free tier** — Hobby includes monthly Active-CPU hours, creations, and storage at no charge (it pauses rather than bills when exhausted).

## In an AI-assisted workflow

```bash
npm i @vercel/sandbox     # auth via your linked project's OIDC: vercel link && vercel env pull
# const sandbox = await Sandbox.create(); await sandbox.runCommand("python", ["analyze.py"])
```

The canonical loop: your agent (likely on the [AI SDK](/tools/vercel-ai-sdk)) generates code → executes it in a sandbox → reads results as observations. Billing nuance worth knowing: I/O wait isn't billed as Active CPU, so long-running-but-idle agent sessions cost less than wall-clock suggests.

> [!NOTE]
> Two setup quirks: it currently runs in a single region (`iad1`), and auth wants a linked Vercel project even if you deploy nothing. And remember persistence-by-default means snapshots accrue storage — clean up or opt out for throwaways.

## Good to know

Beta June 2025, **GA January 30, 2026**, with v0, Blackbox AI, and Roo Code cited in production. The ecosystem gravity is the real differentiator — outside Vercel, [E2B](/tools/e2b) (code-interpreter ergonomics, open infra), [Daytona](/tools/daytona) (speed, multi-OS), and [Modal](/tools/modal) (sandboxes inside a GPU platform) each pull differently: [Sandboxing AI-Generated Code](/guides/advanced/sandboxing-ai-generated-code) maps the choice.
