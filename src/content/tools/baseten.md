---
name: "Baseten"
title: "Baseten"
description: "Production inference platform for ML and LLM models — autoscaling GPU deployments, scale-to-zero, and packaging via the open-source Truss framework."
seoTitle: "Baseten: Pricing, Truss Deployments, and Alternatives"
seoDescription: "Baseten serves ML and LLM models on autoscaling GPUs with scale-to-zero and open-source Truss packaging. Its pricing model, who it fits, and top alternatives."
url: "https://www.baseten.co"
date: 2026-06-19
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "platform"
repo: "https://github.com/basetenlabs/truss"
sameAs: ["https://github.com/basetenlabs/truss", "https://docs.baseten.co"]
color: "purple"
topics: ["mlops-ai-infra", "llm-app-dev"]
audience: ["ai-engineers"]
tags: ["inference", "gpu", "deployment", "autoscaling", "truss", "mlops"]
featured: false
alternativeTo: ["modal", "replicate", "together-ai", "fireworks-ai"]
summary: "Baseten runs ML and LLM models in production. You describe a model in a Truss config, run truss push, and get an autoscaling GPU endpoint that can scale to zero. Dedicated deployments bill per minute of GPU time, from a T4 to a B200, and per-token Model APIs cover popular open models. It suits teams serving their own or fine-tuned models."
related: ["guide:deploying-llms-to-production", "guide:self-host-vs-api-llm", "skill:cold-start-optimizer", "guide:llm-cost-latency-engineering"]
faq:
  - q: "What is Baseten?"
    a: "Baseten is an inference platform for deploying ML and LLM models into production on autoscaling GPU infrastructure. You package a model with the open-source Truss framework, run truss push, and Baseten builds the container, serves it behind an API endpoint and scales replicas with traffic. It also sells per-token Model APIs, training compute and agent sandboxes."
  - q: "How much does Baseten cost?"
    a: "It is pay as you go with no contract. As of November 2026, the pricing page lists dedicated GPUs per minute: a T4 at $0.01052 (about $0.63 an hour), an L4 at $0.01414 (about $0.85), an A10G at $0.02012 (about $1.21), an H100 at $0.10833 (about $6.50) and a B200 at $0.16633 (about $9.98). Model APIs are priced per million tokens, and volume discounts and reserved capacity are negotiated with sales."
  - q: "How do I deploy a model on Baseten?"
    a: "Install uv, run uvx truss login, scaffold a project with uvx truss init, edit config.yaml to name the model, the GPU and the engine, then run uvx truss push. A default push creates a published deployment; add --watch for a development deployment that live-patches as you edit custom Python model code."
  - q: "Does Baseten scale to zero?"
    a: "Yes, and it is the default. Baseten's autoscaling docs list min replicas at 0 and max replicas at 1 by default, with a 900-second scale-down delay before idle replicas are removed. The first request after a scale-down pays a cold start while the container and weights load, so set min replicas to 1 or more for latency-sensitive endpoints."
---

Baseten is an **inference platform for putting your own ML and LLM models into production**. You bring a model (custom, fine-tuned or open-source), describe how to serve it, and Baseten runs it on GPU infrastructure as an autoscaling endpoint, handling containerization, scaling, observability and failover.

Packaging happens through **Truss**, Baseten's open-source framework (MIT). A Truss is a directory with a `config.yaml` and, for custom logic, a `model/` folder of Python. Alongside dedicated deployments, Baseten now sells per-token **Model APIs** for popular open models, **Training** compute, **Sandboxes** for agents and **Grid**, a control layer for model access and spend.

## Highlights

- **Truss packaging.** One `config.yaml` names the model, hardware and engine. For engine-based deployments that file is the whole specification; custom Python models add a `model/` directory.
- **Optimized engines.** Engine-Builder-LLM compiles a Hugging Face checkpoint with TensorRT-LLM and serves it behind an OpenAI-compatible API.
- **Autoscaling with scale-to-zero.** Min and max replicas, a concurrency target per replica and a target utilization (70% by default) control scaling; min replicas defaults to 0.
- **Development loop.** `truss push --watch` creates a development deployment that live-patches code changes; a plain `truss push` publishes.
- **Chains.** A framework for multi-step, multi-model pipelines where each step gets its own hardware, dependencies and scaling.
- **Multi-cloud capacity.** Baseten says dedicated inference draws on capacity across 20+ cloud providers with failover between them, region locking for data-location requirements, and 99.99% uptime.

## In an AI-assisted workflow

The Truss README's quick start deploys a small open model from a config file alone:

```bash
uvx truss login
uvx truss init qwen-2.5-3b && cd qwen-2.5-3b
```

```yaml
# config.yaml
model_metadata:
  tags:
    - openai-compatible
model_name: Qwen-2.5-3B
resources:
  accelerator: L4
  use_gpu: true
trt_llm:
  build:
    base_model: decoder
    checkpoint_repository:
      source: HF
      repo: "Qwen/Qwen2.5-3B-Instruct"
    max_seq_len: 8192
    quantization_type: fp8
    tensor_parallel_count: 1
    num_builder_gpus: 2
```

```bash
uvx truss push   # prints the model ID and endpoint
```

Once the deployment is active, any OpenAI SDK client works against it:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["BASETEN_API_KEY"],
    base_url="https://model-{model_id}.api.baseten.co/environments/production/sync/v1",
)
response = client.chat.completions.create(
    model="Qwen-2.5-3B",
    messages=[{"role": "user", "content": "What is machine learning?"}],
)
```

> [!TIP]
> Scale-to-zero saves money and costs latency. With the default 900-second scale-down delay, an endpoint that gets a request every ten minutes never goes cold, while one that is idle overnight will. Measure the cold start for your model size before choosing min replicas; [cold-start-optimizer](/skills/performance/cold-start-optimizer) covers ways to shorten cold starts.

## Pricing

Baseten is pay as you go, with no contract on the self-serve tier. As of November 2026, its pricing page lists dedicated inference per minute of replica time:

| GPU | Memory | Per minute | Approx. per hour |
| --- | --- | --- | --- |
| T4 | 16 GiB | $0.01052 | $0.63 |
| L4 | 24 GiB | $0.01414 | $0.85 |
| A10G | 24 GiB | $0.02012 | $1.21 |
| A100 | 80 GiB | $0.06667 | $4.00 |
| H100 MIG | 40 GiB | $0.0625 | $3.75 |
| H100 | 80 GiB | $0.10833 | $6.50 |
| B200 | 180 GiB | $0.16633 | $9.98 |

CPU-only instances start at $0.00058 per minute for 1 vCPU and 2 GiB of RAM. Model APIs are billed per million input, cached-input and output tokens at rates that vary by model, and Sandboxes are billed by CPU, memory and runtime. A "Production scale" arrangement with sales adds volume discounts, reserved and priority compute and custom terms.

## Good to know

**You pay for replica time, not requests.** A dedicated deployment bills every minute a replica is up, including idle minutes inside the scale-down delay. Low, spiky traffic can cost more here than on a per-token API; steady traffic on a well-utilized GPU usually costs less.

**Build-time needs can exceed run-time needs.** In the quick start above, FP8 quantization uses two GPUs during the build (`num_builder_gpus: 2`) even though the model serves on one L4. `--watch` development mode is not supported for TensorRT-LLM engine builds.

**Truss is open source; the platform is not.** Truss is MIT-licensed and at v0.18.44 as of November 26, 2026, but it deploys to Baseten's managed service. For a serving stack you run yourself, look at [vLLM](/tools/vllm).

**Alternatives.** [Modal](/tools/modal) is the closest match for code-first teams: Python-defined serverless GPU functions that also cover batch jobs. [Replicate](/tools/replicate) is simpler for running community models through an API. [Together AI](/tools/together-ai) and [Fireworks AI](/tools/fireworks-ai) lead with per-token serverless endpoints for open models and add dedicated deployments. Baseten fits best when you have your own or a fine-tuned model, steady enough traffic to keep GPUs busy, and a need for production controls. Compare the field in [Best LLM Inference Providers in 2026](/guides/comparisons/best-llm-inference-providers-2026), read [Self-Host vs API](/guides/mlops/self-host-vs-api-llm) to model unit economics, or review [Baseten alternatives](/tools/baseten/alternatives).
