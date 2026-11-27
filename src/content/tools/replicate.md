---
name: "Replicate"
title: "Replicate"
description: "Run and deploy any open ML model — LLMs, image, video, audio — through one API with pay-per-second billing, and package your own with open-source Cog."
url: "https://replicate.com"
date: 2026-06-19
updated: "2026-11-27"
reviewed: "2026-11-27"
pricing: "freemium"
category: "platform"
repo: "https://github.com/replicate/cog"
sameAs:
  - "https://github.com/replicate"
  - "https://replicate.com/docs"
color: "pink"
topics: ["mlops-ai-infra", "llm-app-dev"]
tags: ["inference", "open-models", "gpu", "image-generation", "api"]
featured: false
alternativeTo: ["baseten", "modal", "together-ai", "fireworks-ai"]
related: ["guide:deploying-llms-to-production", "guide:self-host-vs-api-llm", "skill:cold-start-optimizer", "guide:multimodal-rag-images-pdfs"]
summary: "Replicate is a hosted platform for running open machine-learning models — LLMs, image, video, audio, and more — behind a single API, billed per second of compute. Thousands of community models run with one line of code, and you can package and deploy your own using Cog, its open-source container tool. Replicate joined Cloudflare in 2025."
faq:
  - q: "What is Replicate?"
    a: "Replicate is a cloud platform that runs and deploys open machine-learning models behind a single HTTP API. It hosts thousands of community-contributed models — LLMs, image, video, audio, and more — that you call with one line of code, no GPU provisioning or container plumbing required. You can also push your own model with Cog and serve it the same way."
  - q: "How does Replicate pricing work?"
    a: "Pay-per-use, not a flat subscription. Most models are billed by the second of compute, while some (e.g. certain image models) are billed per output. You can run a selection of models for free before Replicate asks you to set up billing. Public models are billed only for the time they actually run, but most private models run on dedicated hardware and are billed for all the time their instances are online, including setup and idle time; fast-booting fine-tunes are the exception."
  - q: "What is Cog and how do I deploy a custom model?"
    a: "Cog is Replicate's open-source (Apache-2.0) tool for packaging an ML model into a standard, production-ready container — it generates the inference API and handles CUDA/dependency setup from a single config file. You define your model with Cog, push it to Replicate, and it becomes a deployable API endpoint with autoscaling, the same as any community model."
  - q: "How much do Replicate GPUs cost?"
    a: "As of November 2026, Replicate's pricing page lists $0.81 per hour for an Nvidia T4, $3.51 per hour for an L40S, $5.04 per hour for an 80GB A100, and $5.49 per hour for an H100, billed by the second. CPU instances are $0.36 per hour. Multi-GPU and H200 configurations need a committed-spend contract."
audience: ["ai-engineers", "designers"]
---

Replicate is a hosted platform for **running and deploying machine-learning models through an API**. Instead of provisioning GPUs, building containers, and writing inference servers, you call a model — image generators, video and audio models, open LLMs, and thousands of other community-contributed models — with a single line of code and get results back. The platform handles the GPUs, scaling, and queuing. Replicate is now part of Cloudflare and still runs under its own brand and API.

## Highlights

- **A large public catalog.** Thousands of open-source models contributed by the community, plus proprietary models that Replicate hosts. Each model page shows its hardware and an estimated cost per run.
- **Pay only for what runs.** Most public models are billed by the second of compute while they process your request; setup and idle time are free. Others are billed by input and output, such as per image, per second of video, or per token.
- **Cog for your own models.** [Cog](https://github.com/replicate/cog) is Replicate's open-source (Apache-2.0) packaging tool: describe the environment in `cog.yaml`, define the model's inputs in a Python class, and Cog builds a Docker image with an HTTP prediction server.
- **Deployments.** A deployment gives any model, public or private, its own instances and request queue with the hardware and scaling limits you choose. Instances scale down to zero by default.
- **Fast-booting fine-tunes.** Fine-tunes that run on a shared pool of base-model hardware are billed only while active, whether public or private.
- **One client, any model.** Official clients wrap the same HTTP API, so swapping models is a change of identifier and input fields.

## In an AI-assisted workflow

Install the client and set your token:

```bash
pip install replicate
export REPLICATE_API_TOKEN=r8_....
```

```python
import replicate

output = replicate.run(
    "black-forest-labs/flux-schnell",
    input={"prompt": "an iguana on the beach, pointillism"},
)

with open("output.png", "wb") as f:
    f.write(output[0].read())
```

That shape suits agent-built features well: a coding agent can add image, video, speech, or OCR to an app by calling one function, and you can swap the model later without touching infrastructure. For a custom model, `cog init` generates the config files, and `cog push` publishes the image to Replicate, where it becomes an API endpoint like any community model.

Because instances scale to zero, the first request after a quiet period waits for a cold boot; the [cold-start-optimizer](/skills/performance/cold-start-optimizer) skill covers the general fixes. For weighing a hosted inference API against running models yourself, see [self-host vs. API LLM](/guides/mlops/self-host-vs-api-llm) and [deploying LLMs to production](/guides/mlops/deploying-llms-to-production).

## Pricing

Replicate is pay-per-use with no subscription. As of November 2026, its pricing page lists hardware at $0.36 per hour for CPU, $0.81 per hour for an Nvidia T4, $3.51 per hour for an L40S, $5.04 per hour for an 80GB A100, and $5.49 per hour for an H100, all billed by the second. Examples of output-priced models on the same page, as of November 2026: `black-forest-labs/flux-schnell` at $3.00 per thousand images and `black-forest-labs/flux-1.1-pro` at $0.04 per image. You can run a selection of models for free before Replicate asks you to set up billing, and failed runs on public models are not charged.

## Good to know

**Private models are billed differently.** Most private models run on dedicated hardware, so you pay for all the time their instances are online: setup, idle, and active. Deployments are billed the same way. Fast-booting fine-tunes are the exception.

**Shared queues mean variable latency.** Public models share a hardware pool with other customers, so cold boots and scaling limits depend on what everyone else is running. A deployment fixes that at the cost of paying for idle time.

**Per-second billing suits spiky work.** For steady, high-volume traffic on one model, a dedicated endpoint elsewhere can be cheaper, so compare against your real request rate.

**The platform is being folded into Cloudflare.** Cloudflare announced the acquisition on November 17, 2025, and Replicate said it would carry on as a distinct brand with the same API. In April 2026 Cloudflare said the Replicate team had joined its AI Platform team and that it is bringing Replicate's models onto AI Gateway and replatforming the hosted models onto Cloudflare infrastructure.

Among alternatives, [Modal](/tools/modal) and [Baseten](/tools/baseten) center on deploying your own code and models with more control over the runtime, [fal](/tools/fal) focuses on fast image, video, and audio generation APIs, and [Together AI](/tools/together-ai) and [Fireworks AI](/tools/fireworks-ai) are the usual picks for per-token open LLM inference. Replicate leans hardest on breadth of ready-to-run models and the one-line API.
