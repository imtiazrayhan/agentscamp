---
name: "Replicate"
title: "Replicate"
description: "Run and deploy any open ML model — LLMs, image, video, audio — through one API with pay-per-second billing, and package your own with open-source Cog."
url: "https://replicate.com"
date: 2026-06-19
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
related: ["deploying-llms-to-production", "self-host-vs-api-llm", "cold-start-optimizer", "multimodal-rag-images-pdfs"]
summary: "Replicate is a hosted platform for running open machine-learning models — LLMs, image, video, audio, and more — behind a single API, billed per second of compute with scale-to-zero when idle. Thousands of community models run with one line of code, and you can package and deploy your own using Cog, its open-source container tool. Replicate joined Cloudflare in 2025."
faq:
  - q: "What is Replicate?"
    a: "Replicate is a cloud platform that runs and deploys open machine-learning models behind a single HTTP API. It hosts thousands of community-contributed models — LLMs, image, video, audio, and more — that you call with one line of code, no GPU provisioning or container plumbing required. You can also push your own model with Cog and serve it the same way."
  - q: "How does Replicate pricing work?"
    a: "Pay-per-use, not a flat subscription. Most models are billed by the second of compute they actually run, scaling to zero when idle, while some (e.g. certain image models) are billed per output. New accounts run a curated set of models free for a limited number of runs, then move to prepaid credit. There is no charge for time a model spends idle."
  - q: "What is Cog and how do I deploy a custom model?"
    a: "Cog is Replicate's open-source (Apache-2.0) tool for packaging an ML model into a standard, production-ready container — it generates the inference API and handles CUDA/dependency setup from a single config file. You define your model with Cog, push it to Replicate, and it becomes a deployable API endpoint with autoscaling, the same as any community model."
---

Replicate is a hosted platform for **running and deploying open machine-learning models through an API**. Instead of provisioning GPUs, building containers, and writing inference servers, you call a model — Stable Diffusion-style image generators, video and audio models, open LLMs, and thousands of other community-contributed models — with a single line of code and get results back. The platform handles the GPUs, scaling, and queuing.

Its defining design choice is **pay-per-second compute with scale-to-zero**: you are billed for the time your code actually runs and nothing while a model sits idle, which makes it well suited to spiky, experiment-heavy, or low-volume workloads where a dedicated endpoint would mostly burn money. Some models are billed per output (per image, for example) rather than per second. New accounts can try a curated collection of models free for a limited number of runs before moving to prepaid credit.

The bring-your-own-model path runs through **Cog**, Replicate's open-source (Apache-2.0) container tool. You describe a model's environment and inputs in a single config file, and Cog produces a reproducible container with an HTTP inference API and CUDA/dependency setup handled for you — then you push it to Replicate to get an autoscaling endpoint, identical in shape to the community models. Against infrastructure platforms like [Modal](/tools/modal) and Baseten, Replicate leans hardest on breadth of ready-to-run open models and the one-line API, where the others center custom code and deployment control.

Replicate **joined Cloudflare in 2025** (announced November 2025); the product continues to operate under its own brand. For weighing a hosted inference API against running models yourself, see [self-host vs. API LLM](/guides/mlops/self-host-vs-api-llm).
