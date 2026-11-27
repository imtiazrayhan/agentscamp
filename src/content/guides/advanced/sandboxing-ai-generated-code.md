---
title: "Sandboxing AI-Generated Code: E2B vs Modal vs Daytona vs Vercel Sandbox"
description: "Where should agent-written code run? E2B vs Modal vs Daytona vs Vercel Sandbox compared on isolation, persistence, and cost, plus rules for safe execution."
seoTitle: "E2B vs Modal vs Daytona vs Vercel Sandbox: AI Agent Sandboxes Compared"
seoDescription: "Where should agent-written code run? E2B, Modal, Daytona, and Vercel Sandbox compared on isolation, persistence, and cost, plus rules for safe execution."
author: "Imtiaz Rayhan"
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["ai-agents-systems", "ai-safety-security"]
audience: ["developers", "ai-engineers", "devops", "security"]
tags: ["sandboxing", "code-execution", "agents", "comparison", "security"]
featured: true
summary: "Run agent-written code in a disposable sandbox with a default-deny network policy. E2B and Vercel Sandbox use Firecracker microVMs, Modal uses gVisor or microVMs, and Daytona defaults to Linux containers with VM classes on request. All four leave outbound internet open unless you restrict it."
keyTakeaways:
  - "Code a model wrote runs in isolation, with its own filesystem and network, never in your application's process or on your host."
  - "Isolation is not uniform: E2B and Vercel Sandbox run Firecracker microVMs, Modal uses gVisor or microVMs, and Daytona's default sandbox is a Linux container, with Linux and Windows VM classes when you need a separate kernel."
  - "Outbound internet is open by default on E2B, Modal and Vercel Sandbox, and on Daytona's higher tiers. Every one of them has a block-all switch and a domain or CIDR allowlist; none of them turns it on for you."
  - "Default lifetimes are short (5 minutes on E2B, Modal and Vercel Sandbox; a 15-minute inactivity auto-stop on Daytona) and the ceiling for one continuous run is 24 hours on E2B Pro, Modal and Vercel Pro."
  - "Only Modal and Daytona offer GPU sandboxes. E2B is CPU-only."
  - "Daytona's public AGPL-3.0 repository has been unmaintained since June 2026, so E2B's Apache-2.0 runtime is the only actively developed self-host option of the four."
faq:
  - q: "Why can't the agent just run code on my server?"
    a: "Because generated code is untrusted by definition. It is not necessarily malicious, but nobody reviewed it: it can read your environment variables, exhaust memory, or follow instructions injected through content the model read. A sandbox gives it a real computer with nothing of yours inside, disposable by design. This is least privilege applied to execution."
  - q: "Which sandbox platform should I pick?"
    a: "Pick E2B for a code-interpreter tool with rich outputs and pause/resume, or if you need to self-host an actively maintained runtime. Pick Modal if the generated code needs a GPU or you already run inference there. Pick Daytona for Windows or macOS targets. Pick Vercel Sandbox if your app deploys on Vercel and you want credentials brokered at the firewall."
  - q: "Do these sandboxes block network access by default?"
    a: "No. E2B, Modal and Vercel Sandbox all start with unrestricted outbound internet, and Daytona does on Tier 3 and above. You opt in to restriction: allow_internet_access=False or network deny/allow lists on E2B, block_network=True or outbound allowlists on Modal, network_block_all or allow lists on Daytona, and networkPolicy 'deny-all' or an allow list on Vercel Sandbox."
  - q: "Is a domain allowlist enough to stop data exfiltration?"
    a: "It narrows the path but does not close it. E2B, Modal and Vercel Sandbox match HTTPS traffic on the TLS SNI hostname, and Modal's and Vercel's docs both warn that a client can send an allowlisted SNI with a different Host header (domain fronting) when two sites share a TLS endpoint. Allowlist narrow, single-purpose hostnames and keep secrets out of the sandbox."
  - q: "Do I need a sandbox for code the agent writes into my repo?"
    a: "That is a different threat. Repo code gets reviewed and tested before it runs with privileges. Sandboxes are for code that executes immediately inside the agent loop (analysis snippets, generated scripts, tool-built programs) where review before run is impossible by design."
related: ["tool:e2b", "tool:daytona", "tool:modal", "tool:vercel-sandbox", "guide:how-computer-use-agents-work", "glossary:guardrails", "glossary:agent-engineering", "guide:owasp-agentic-top-10"]
---

Generated code is **untrusted input that executes**. The standard answer is to give every agent a disposable computer, and four platforms sell that: [E2B](/tools/e2b), [Modal](/tools/modal), [Daytona](/tools/daytona) and [Vercel Sandbox](/tools/vercel-sandbox). They differ more than their marketing suggests on isolation technology, GPU support and self-hosting, and they agree on one thing that matters for safety: the network is open until you close it.

Everything in the table was read from each vendor's documentation in November 2026.

## Side by side

| | E2B | Modal Sandboxes | Daytona | Vercel Sandbox |
| --- | --- | --- | --- | --- |
| Isolation | Firecracker microVM | gVisor or microVMs | Linux container by default; Linux VM and Windows VM classes with their own kernel | Firecracker microVM |
| Guest OS | Linux | Linux | Linux, Windows, macOS | Linux (default image is Ubuntu-based with Node.js and Python) |
| SDKs | Python, JavaScript/TypeScript | Python, JavaScript, Go | Python, TypeScript, Ruby, Go, Java | JavaScript/TypeScript, Python, CLI |
| Default lifetime | 5-minute timeout | 5-minute timeout | Auto-stop after 15 minutes of inactivity | 5-minute timeout |
| Longest continuous run | 1 hour on Hobby, 24 hours on Pro; pausing resets the clock | 24 hours | No fixed cap; set the auto-stop interval to `0` | 45 minutes on Hobby, 24 hours on Pro |
| State between runs | Pause/resume with memory, snapshots, volumes | Filesystem snapshots, volumes | Snapshots, volumes; pause/resume and fork on VM classes | Persistent by default (state saved on stop), snapshots, Drives |
| GPU | No, CPU-only | Yes | Yes (NVIDIA and AMD) | Not documented |
| Outbound network default | Open | Open | Open on Tier 3 and 4, restricted on Tier 1 and 2 | Open (`allow-all`) |
| Egress controls | On/off switch, CIDR and domain allow/deny lists | Block all, CIDR allowlist, domain allowlist | Block all, CIDR allowlist, domain allowlist | `deny-all`, domain and CIDR allow rules, credentials brokering |
| Self-host | Apache-2.0 runtime, actively developed | No | AGPL-3.0 repository, unmaintained since June 2026 | No |
| Billing model | Per second of running sandbox | Per second, on max(requested, used) CPU and memory | Per second of vCPU, memory and storage | Active CPU time plus provisioned memory |
| Free allowance | One-time credits on the Hobby plan | Monthly credits on the Starter plan | Free compute credits at signup | Monthly Hobby allotment |

Current rates are on each tool page: [E2B](/tools/e2b), [Modal](/tools/modal), [Daytona](/tools/daytona), [Vercel Sandbox](/tools/vercel-sandbox).

## What the rows mean in practice

**Isolation is not table stakes.** A Firecracker microVM gives each sandbox its own kernel, so a kernel exploit in generated code has to cross a hypervisor boundary. E2B and Vercel Sandbox do this for every sandbox. Modal's security documentation says each container is isolated "using primitives like gVisor or microVMs". Daytona's default class is a container with dedicated namespaces and enforced resource limits, which shares the host kernel; its Linux VM and Windows classes are full virtual machines. If you run hostile code rather than merely unreviewed code, choose a VM-backed class on purpose.

**Startup time is mostly vendor claims.** Daytona advertises container sandboxes in under 90 ms. Treat that as its number, not a measurement, and benchmark your own image: a custom template with heavy dependencies dominates cold-start time on every platform.

**Persistence changes the product.** E2B pauses a sandbox with its memory, so running processes resume, and a paused sandbox has no expiry. Vercel Sandbox saves state when a sandbox stops and resumes it by default. Modal's route for work longer than 24 hours is a filesystem snapshot restored into a new sandbox. Daytona separates stop, archive and delete, each with its own inactivity interval. Idle but running sandboxes bill on E2B, Modal and Daytona; Vercel bills CPU only while code is using it, though provisioned memory accrues for the whole run.

**Billing shapes differ more than rates.** Modal charges on the larger of what you requested and what you used, and bills sandboxes at its non-preemptible rate. Vercel's Active CPU model favours agents that spend most of their time waiting on a model call. E2B's Pro plan raises limits (runtime, concurrency) without adding credits.

## A locked-down sandbox on each platform

The same policy four times: no network except one API host, a short lifetime, and explicit teardown. `api.example.com` is a placeholder.

**E2B** (Python, `pip install e2b-code-interpreter`, key in `E2B_API_KEY`):

```python
from e2b_code_interpreter import Sandbox

sbx = Sandbox.create(
    timeout=120,  # seconds; the default is 5 minutes
    network={
        "allow_out": ["api.example.com"],
        "deny_out": lambda ctx: [ctx.all_traffic],
    },
)
try:
    execution = sbx.run_code("print(sum(range(10)))")
    print(execution.logs)
finally:
    sbx.kill()
```

Domain rules require denying all other traffic, and they filter HTTP on port 80 and TLS on port 443 only. When any domain is listed, E2B also allows the `8.8.8.8` nameserver so names resolve.

**Modal** (Python, `pip install modal`):

```python
import modal

app = modal.App.lookup("agent-sandbox", create_if_missing=True)
sb = modal.Sandbox.create(
    app=app,
    timeout=120,
    outbound_domain_allowlist=["api.example.com"],
)
p = sb.exec("python", "-c", "print(sum(range(10)))", timeout=10)
print(p.stdout.read())
sb.terminate()
```

Modal's domain allowlist is in beta as of November 2026 and covers TLS on port 443. For a hard block use `block_network=True`, or `outbound_cidr_allowlist` for IP ranges. DNS stays open unless all outbound traffic is blocked.

**Daytona** (Python, `pip install daytona`):

```python
from daytona import Daytona
from daytona.v0 import CreateSandboxFromSnapshotParams

daytona = Daytona()
sandbox = daytona.v0.create(CreateSandboxFromSnapshotParams(
    domain_allow_list="api.example.com",
    auto_stop_interval=5,  # minutes of inactivity
))
```

`network_allow_list`, `domain_allow_list` and `network_block_all` are mutually exclusive. On Tier 1 and Tier 2 organizations the network is already restricted and sandbox-level settings cannot override it.

**Vercel Sandbox** (TypeScript, `@vercel/sandbox`):

```ts
import { Sandbox } from '@vercel/sandbox';

const sandbox = await Sandbox.create({
  networkPolicy: {
    allow: ['api.example.com'],
  },
});

// Later, once dependencies are installed, cut the network entirely:
await sandbox.update({ networkPolicy: 'deny-all' });
```

Policies can change at runtime without restarting the sandbox, which gives you a useful two-phase pattern: install packages with the network open, then switch to `deny-all` before the generated code touches user data.

## The rules that keep it safe

A sandbox contains the blast; configuration decides the radius.

1. **Egress is policy.** Start from deny-all and allow the specific hosts the task needs. Isolation alone does not stop exfiltration, and every platform here ships with the network open.
2. **No ambient secrets.** Never copy your environment into the sandbox. Prefer injection at the egress proxy, where the credential is added to outbound requests and never enters the sandbox: Vercel Sandbox calls this credentials brokering, E2B has stored secrets referenced from network rules, and Modal has secret injection (beta as of November 2026).
3. **Budget everything.** Set the timeout explicitly, cap CPU and memory, and limit agent steps. A runaway loop then costs a bounded amount.
4. **Treat outputs as untrusted too.** Results feed back into the model, and [prompt injection](/glossary/prompt-injection) can ride a return value or a file the code downloaded.
5. **Log execution.** Record what ran, what it wrote and which hosts it contacted. That is your audit trail when something odd happens.
6. **Kill, don't abandon.** Call `kill()`, `terminate()` or `stop()` in a `finally` block. Forgotten sandboxes are the most common source of surprise bills.

This is [guardrails](/glossary/guardrails) discipline applied to the execution layer, and it covers the unexpected-code-execution entry on the [OWASP agentic top 10](/guides/ai-safety/owasp-agentic-top-10).

## Where each one loses

- **E2B**: no GPUs, and the Hobby plan caps a continuous run at one hour. Domain filtering does not cover UDP protocols such as QUIC.
- **Modal**: no self-host option, sandboxes are billed above its base compute rate, and the domain allowlist is still beta as of November 2026.
- **Daytona**: the default sandbox is a container, not a VM, and the open-source repository stopped receiving updates in June 2026 when development moved to a private codebase. Self-hosting now means running a frozen AGPL-3.0 release without fixes.
- **Vercel Sandbox**: no documented GPU option, tied to a Vercel account and its plan limits, and the Hobby plan stops creating sandboxes once the monthly allotment is used.

## How to choose

Start from the constraint you cannot work around. Need a GPU inside the sandbox: Modal or Daytona. Need Windows or macOS: Daytona. Must self-host on maintained code: E2B. Need every sandbox behind a hypervisor without choosing a class: E2B or Vercel Sandbox. Already deploying on Vercel with the AI SDK: Vercel Sandbox, for the shared auth and billing.

If none of those apply, pick by what the agent does. A data-analysis tool that returns charts fits E2B's code-interpreter SDK. An agent that mostly waits on model calls is cheapest under Vercel's Active CPU billing. Thousands of short parallel evaluation runs fit Modal. For [computer-use](/glossary/computer-use) agents, E2B has Linux desktop sandboxes and Daytona covers Windows and macOS desktops.
