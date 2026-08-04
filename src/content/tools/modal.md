---
name: "Modal"
description: "Serverless AI infrastructure in pure Python — GPU functions with sub-second cold starts, secure sandboxes for agent code, batch jobs, and per-second billing."
date: 2026-06-11
url: "https://modal.com"
pricing: "freemium"
category: "platform"
repo: "https://github.com/modal-labs/modal-client"
license: "Apache-2.0"
os: ["Web"]
color: "cyan"
topics: ["ai-agents-systems", "mlops-ai-infra"]
tags: ["serverless", "gpu", "sandbox", "inference", "python"]
featured: false
alternativeTo: ["e2b", "daytona", "vercel-sandbox"]
sameAs:
  - "https://github.com/modal-labs"
  - "https://modal.com/docs"
  - "https://pypi.org/project/modal/"
related: ["guide:sandboxing-ai-generated-code", "tool:e2b", "tool:daytona", "tool:vllm", "agent:llm-inference-engineer", "guide:self-host-vs-api-llm"]
summary: "Modal is serverless compute that feels like writing Python: decorate a function, declare its container image and GPU in code, and it runs in the cloud with sub-second cold starts and per-second billing. For agent builders, Sandboxes execute untrusted LLM-generated code in secure containers; for ML teams, it's GPU inference and massive batch jobs without Kubernetes."
faq:
  - q: "What is Modal in one sentence?"
    a: "A serverless platform where infrastructure is Python code — @app.function(gpu='h100', image=...) deploys a GPU function with autoscaling, no YAML, no cluster — billed per second of actual use."
  - q: "How do Modal Sandboxes compare to E2B?"
    a: "Same job — secure containers for executing agent-generated code, with exec, timeouts up to 24h, and reattachment by ID — different center of gravity. E2B is sandbox-first with code-interpreter ergonomics and an open infra stack; Modal's sandboxes live inside a broader compute platform, which wins when the same team also needs GPU inference, batch pipelines, and scheduled jobs in one place."
  - q: "What does Modal cost?"
    a: "Per-second usage against vendor-listed rates (e.g. H100s by the second, CPU cores and GiB-seconds likewise), with plan credits softening it: the free Starter tier includes $30/month of credits, Team $100/month on top of its subscription. You pay for compute you use and nothing while idle."
---

Modal's pitch collapsed an entire DevOps stack into a decorator: **infrastructure as Python**. Container images, GPUs, autoscaling, schedules — all declared in the code that uses them, deployed in seconds, billed per second. It became a default substrate for AI teams — and, through its Sandboxes, for agents that need somewhere safe to run the code they write.

## Highlights

- **Functions with GPUs in one line** — `@app.function(gpu="h100")`; container images defined in Python, cold starts in sub-second territory.
- **Sandboxes for agent code** — secure containers created at runtime: `sandbox.exec()`, timeouts from 5 minutes to 24 hours, readiness probes, tags, and reattach via `from_id()` — built for LLM-generated code execution.
- **Scale without ceremony** — autoscaling inference endpoints, massively parallel batch jobs, scheduled functions, web endpoints.
- **Storage that follows the code** — Volumes (distributed filesystems), secrets, and env vars usable across functions and sandboxes.
- **Beyond Python callers** — define apps in Python, invoke from JavaScript/TypeScript or Go; GPU notebooks with live collaboration round it out.

## In an AI-assisted workflow

```bash
pip install modal && modal setup
# @app.function(gpu="a100", image=image)
# def embed(batch): ...
# modal run pipeline.py
```

Two agent-era fits: the **sandbox tool** (the agent's `execute_code` pointed at a Modal Sandbox), and the **self-serve inference layer** — serving open-weight models with [vLLM](/tools/vllm) on per-second GPUs is a canonical Modal workload, directly relevant to the [self-host economics question](/guides/mlops/self-host-vs-api-llm).

> [!TIP]
> The platform's killer property for spiky AI workloads is scale-to-zero with fast cold starts: experiments and bursty pipelines pay only for seconds used — the failure mode it eliminates is the idle GPU.

## Good to know

The client SDK is Apache-2.0; the platform is proprietary SaaS. Python-first by design (3.10+). Momentum is unambiguous: an $87M Series B (September 2025) followed by a **$355M Series C at $4.65B** (May 2026, General Catalyst and Redpoint) with $300M+ annualized revenue claimed. Against the sandbox-pure specialists: [Sandboxing AI-Generated Code](/guides/advanced/sandboxing-ai-generated-code).
