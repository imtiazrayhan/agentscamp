---
name: "Vercel Sandbox"
description: "Firecracker microVMs on Vercel for running untrusted and AI-generated code: millisecond startup, Node and Python, root access, persistent by default."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://vercel.com/docs/sandbox"
pricing: "freemium"
category: "platform"
repo: "https://github.com/vercel/sandbox"
license: "Apache-2.0"
os: ["Web"]
color: "pink"
topics: ["ai-agents-systems"]
audience: ["ai-engineers", "devops"]
tags: ["sandbox", "code-execution", "vercel", "firecracker"]
featured: false
alternativeTo: ["e2b", "modal", "daytona"]
sameAs:
  - "https://github.com/vercel/sandbox"
  - "https://www.npmjs.com/package/@vercel/sandbox"
related: ["guide:sandboxing-ai-generated-code", "tool:e2b", "tool:modal", "tool:daytona", "tool:vercel-ai-sdk", "tool:v0"]
summary: "Vercel Sandbox runs untrusted and AI-generated code in Firecracker microVMs, each with its own kernel, filesystem and network. Sandboxes start in milliseconds, run Linux images with root access, and are persistent by default: the filesystem is snapshotted on stop and restored on resume. Hobby includes a free monthly allotment and Pro is billed by usage."
faq:
  - q: "What is Vercel Sandbox for?"
    a: "Running code you did not write and cannot trust, mostly agent-generated code and user submissions, away from your application and its credentials. Typical uses are code interpreters, coding-agent workspaces that clone a repo and run its tests, and live previews of generated apps on an exposed port."
  - q: "What does Vercel Sandbox cost?"
    a: "As of November 2026, Hobby includes 5 Active CPU hours, 420 GB-hours of memory and 5,000 sandbox creations a month at no charge, and pauses sandbox creation when you run out; Pro and Enterprise pay $0.128 per Active CPU hour, $0.0212 per GB-hour of provisioned memory and $0.60 per million creations in the default iad1 region, charged first against the Pro plan's $20 monthly credit."
  - q: "How long can a sandbox run?"
    a: "The default timeout is 5 minutes. You can raise it at creation or extend it while running, up to 45 minutes per session on Hobby and 24 hours on Pro and Enterprise. The cap applies to a session, not the sandbox: a persistent sandbox that stops and resumes starts a new session, so its total lifetime is effectively unbounded."
  - q: "Do I need to deploy an app on Vercel to use it?"
    a: "No, but you need a Vercel project to authenticate against. Locally, vercel link and vercel env pull write a VERCEL_OIDC_TOKEN that lasts 12 hours. Outside Vercel, such as in external CI, you pass a team ID, a project ID and an access token instead."
---

Vercel Sandbox is Vercel's compute product for code you cannot trust: output from an AI agent, a user's upload, a third-party script. Each sandbox is a Firecracker microVM with a dedicated kernel, its own filesystem and its own network namespace, so the code inside cannot reach your environment variables, databases or cloud resources. It became generally available on January 30, 2026, when Vercel also open-sourced the SDK and CLI.

## Highlights

- **MicroVM isolation.** Unlike a Docker container, which shares the host kernel, every sandbox boots its own kernel inside a Firecracker microVM. Vercel's docs say sandboxes start in milliseconds, and resuming from a snapshot is faster than a fresh boot.
- **Linux with root.** The default image, `vercel/sandbox/universal`, is Ubuntu with the current Node.js LTS, Python 3.14, coding agents and common utilities. You can boot your own OCI image from Vercel Container Registry instead. Processes can run with system privileges, which covers Docker inside the sandbox, VPN clients and FUSE drivers.
- **Persistent by default.** When a sandbox stops, Vercel snapshots its filesystem; the next SDK call on that sandbox name starts a new session from the snapshot, so installed dependencies survive. Snapshots expire 30 days after last use unless you change the retention.
- **Drives.** Up to four persistent drives can be mounted per run for files that should outlive any one sandbox, such as cloned repos and dependency caches.
- **Plan limits.** Per sandbox: 4 vCPUs and 8 GB on Hobby, 8 vCPUs and 16 GB on Pro, 32 vCPUs and 64 GB on Enterprise, each with 64 GB of ephemeral disk and up to 15 open ports. Concurrency is 10 sandboxes on Hobby and 10,000 on Pro and Enterprise.
- **SDKs and CLI.** `@vercel/sandbox` for JavaScript and TypeScript, the `vercel-sandbox` package for Python, and a `sandbox` CLI. The [SDK repository](https://github.com/vercel/sandbox) is Apache-2.0.
- **Network and credential controls.** You can restrict outbound traffic, attach a sandbox to a Secure Compute network for static IPs and VPC peering, and let Vercel inject credentials from project or team configuration instead of handing secrets to the code.

## In an AI-assisted workflow

Link a Vercel project once, then create sandboxes from code. This is the quickstart from Vercel's docs (Node.js 22+):

```bash
npm i -g vercel
vercel link && vercel env pull     # writes VERCEL_OIDC_TOKEN to .env.local
npm i @vercel/sandbox dotenv
```

```ts
import { config } from 'dotenv';
config({ path: '.env.local' });
import { Sandbox } from '@vercel/sandbox';

const sandbox = await Sandbox.create();
const result = await sandbox.runCommand('echo', ['Hello from Vercel Sandbox!']);
console.log(await result.stdout());
await sandbox.stop();
```

The usual agent loop: the model (often running on the [AI SDK](/tools/vercel-ai-sdk)) writes code, your app writes it into a sandbox and runs it with `runCommand`, and stdout, stderr and the exit code go back to the model as the next observation. Name a sandbox and fetch it again later with `Sandbox.get()` or `Sandbox.getOrCreate()` to keep one workspace per user or per task.

> [!NOTE]
> The local OIDC token expires after 12 hours, so re-run `vercel env pull` when authentication starts failing. Call `sandbox.stop()` when the work is done: an idle sandbox uses little CPU, but its provisioned memory is billed for every minute it stays up.

## Pricing

As of November 2026, from Vercel's Sandbox pricing page, the Hobby plan includes 5 hours of Active CPU, 420 GB-hours of provisioned memory, 5,000 sandbox creations and 20 GB of data transfer a month, plus 15 GB of snapshot storage, at $0. When the allotment runs out, sandbox creation pauses and nothing is charged.

As of November 2026, Pro and Enterprise pay $0.128 per Active CPU hour, $0.0212 per GB-hour of provisioned memory, $0.60 per million creations and $0.08 per GB-month of snapshot storage in the default `iad1` region, and Pro usage draws down the plan's $20 monthly credit first. CPU, memory, transfer and drive rates differ by region.

Active CPU counts only the time your code is on the CPU, so waiting on a model call or a network request is not billed as CPU. Memory is billed for wall-clock time regardless. Vercel's own worked example, as of November 2026, puts a five-minute, 2-vCPU run at about $0.0092 and an idle 1-vCPU sandbox left up for 30 days at $31.45, nearly all of it memory.

## Good to know

Sandboxes are regional: 19 regions, `iad1` by default, chosen per sandbox or as a project default. Vercel's docs say the persistent filesystem is not a substitute for a database or object store, so push large or shared data elsewhere. The published limits cover vCPUs and memory only; there is no GPU option in the plan table.

Persistence has a cost side. Every stop writes a snapshot that counts toward billed storage, so throwaway runs should opt out of persistence at creation or shorten snapshot retention. Sandbox creation is also rate-limited by vCPUs allocated per minute (starting at 150 a minute on Pro and ramping to 5,000 with sustained use), which matters if you fan out hundreds of sandboxes at once.

The GA announcement named v0, Blackbox AI and Roo Code as production users. If your stack is already on Vercel, the shared auth and billing are the main reason to pick it. Otherwise compare [E2B](/tools/e2b), built around a code-interpreter SDK with open-source infrastructure, [Daytona](/tools/daytona), another sandbox platform built for agents, and [Modal](/tools/modal) when the sandbox needs a GPU. [Sandboxing AI-Generated Code](/guides/advanced/sandboxing-ai-generated-code) walks through the choice.
