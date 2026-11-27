---
name: "LM Studio"
title: "LM Studio"
description: "A free desktop app for downloading and running open-weight LLMs locally on llama.cpp or MLX, with an OpenAI-compatible server, SDKs and a headless daemon."
url: "https://lmstudio.ai"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "freemium"
category: "platform"
sameAs: ["https://lmstudio.ai/docs", "https://github.com/lmstudio-ai"]
os: ["macOS", "Windows", "Linux"]
color: "orange"
topics: ["mlops-ai-infra"]
tags: ["local-llm", "desktop", "gui", "inference"]
featured: false
related: ["tool:ollama", "tool:vllm", "guide:self-host-vs-api-llm", "agent:llm-inference-engineer"]
alternativeTo: ["ollama", "jan", "llama-cpp", "vllm"]
summary: "LM Studio is a desktop app for running open-weight LLMs on your own machine: search and download models, chat, connect MCP servers, then serve the loaded model on an OpenAI-compatible endpoint at localhost:1234. It runs GGUF models through llama.cpp and MLX models on Apple Silicon, and is free at home and at work. Bionic is its newer, separate agent app."
faq:
  - q: "Is LM Studio free?"
    a: "Yes, for local use. LM Studio has been free at work as well as at home since July 8, 2025, when the company dropped the separate commercial licence requirement. As of November 2026 the pricing page lists a Free plan at $0 for running local models, with paid Bionic+ and Pro plans that add cloud-hosted open models and higher limits. Teams can create an organization for centralized billing."
  - q: "What is LM Studio Bionic?"
    a: "Bionic is LM Studio's agent for coding, research and document work with open models. The docs describe it as a new, separate app from LM Studio: a Bionic session can use a local model, a remote model on another of your devices through LM Link, or an open model hosted in LM Studio's cloud with zero data retention. LM Studio itself remains the tool for low-level model configuration."
  - q: "How do I use LM Studio with my app?"
    a: "Load a model, start the server from the Developer tab or with lms server start, and point any OpenAI client at http://localhost:1234/v1. The server implements /v1/models, /v1/responses, /v1/chat/completions, /v1/embeddings and /v1/completions. For more control there are official SDKs: npm install @lmstudio/sdk for TypeScript and pip install lmstudio for Python."
  - q: "Can LM Studio run without the desktop app?"
    a: "Yes. llmster is LM Studio's core packaged as a headless daemon for servers, cloud instances and CI. Install it with curl -fsSL https://lmstudio.ai/install.sh | bash on Mac or Linux, or irm https://lmstudio.ai/install.ps1 | iex on Windows, then run lms daemon up, lms get <model> and lms server start."
audience: ["ai-engineers", "analysts"]
---

[LM Studio](https://lmstudio.ai) is a desktop application for running open-weight LLMs locally through a graphical interface. Where a CLI tool expects you to know the model name and flags, LM Studio lets you search for models, download them, chat, and adjust load and sampling settings in a UI. When you want to build, it serves the loaded model over an OpenAI-compatible API on your machine. The app itself is closed-source and free; its CLI and SDKs are MIT-licensed on GitHub.

It runs GGUF models through `llama.cpp` on macOS, Windows and Linux, and MLX models on Apple Silicon. The docs list support for Apple Silicon Macs, x64 and ARM64 Windows PCs, and x64 Linux PCs.

## Highlights

- **Model search and download.** Find models from Hugging Face inside the app, with format and hardware-fit filters, and manage them in a local library.
- **Chat with documents, offline.** Attach files to a chat and query them locally.
- **MCP servers.** Install MCP servers and use their tools with local models.
- **Local API server.** OpenAI-compatible endpoints at `http://localhost:1234/v1`, an Anthropic-compatible endpoint, and LM Studio's own REST API at `/api/v1` with stateful chats and MCP. The server can listen on localhost or on your network.
- **SDKs and CLI.** `lmstudio-js` and `lmstudio-python` for loading models, generating text and embedding from code, and the `lms` CLI for scripting.
- **llmster.** The same engine as a headless daemon, with no GUI, for servers and CI.
- **LM Link.** An end-to-end encrypted network between your own devices, built with Tailscale, so a laptop can use models loaded on a desktop GPU elsewhere.

## In an AI-assisted workflow

Download a model in the app, start the server, and change one line in existing OpenAI code:

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:1234/v1", api_key="lm-studio")  # placeholder; the OpenAI client just needs a non-empty string

response = client.chat.completions.create(
    model="openai/gpt-oss-20b",   # use the id of a model you have downloaded
    messages=[{"role": "user", "content": "Who are you, and what can you do?"}],
)
print(response.choices[0].message.content)
```

On a machine without a display, the daemon does the same job:

```bash
curl -fsSL https://lmstudio.ai/install.sh | bash
lms daemon up          # start the daemon
lms get <model>        # download a model
lms server start       # start the local server on port 1234
```

Because the endpoint speaks the OpenAI format, coding agents and frameworks that accept a custom base URL can use a local model with no code changes. [Self-host vs API](/guides/mlops/self-host-vs-api-llm) covers when that is worth doing.

> [!TIP]
> LM Studio and [Ollama](/tools/ollama) solve the same problem from opposite ends. Choose LM Studio to explore models and tune settings visually, Ollama when the model runner is a background service you script. [Ollama vs LM Studio](/guides/comparisons/ollama-vs-lm-studio) has the detailed comparison.

## Pricing

Running local models in LM Studio costs nothing. As of November 2026, lmstudio.ai/pricing lists three plans built around Bionic: Free at $0, which includes local LLMs on llama.cpp and MLX, the Bionic agent, offline voice transcription, limited web search and LM Link for up to 5 devices; Bionic+ at $20 a month, which adds US-hosted open-source models and LM Link for up to 20 devices; and Pro at $100 a month, with 5 times the usage limits and LM Link for up to 100 devices. The paid plans buy hosted inference, so you only need one if you want models your hardware cannot run.

## Good to know

The latest LM Studio release as of November 2026 is 0.4.29, dated November 25, 2026. Bionic ships on its own version line.

Trade-offs and limits:

- **Closed source.** You can audit the SDKs and CLI but not the app. If that matters, [Jan](/tools/jan) is the open-source desktop equivalent.
- **Not a production serving stack.** It is built for one machine and a handful of clients. For high-concurrency serving on GPUs, use [vLLM](/tools/vllm).
- **Cloud features are separate from the local promise.** Local chats and the local server keep data on your machine. Bionic's hosted models send prompts to LM Studio's cloud, which the company says runs with zero data retention.
- **Network exposure is opt-in.** Serving on the network or over LM Link makes your models reachable from other devices, so treat the server like any other service you expose.

Against the alternatives: [Ollama](/tools/ollama) is CLI-first and the usual pick for automation, [Jan](/tools/jan) is the open-source GUI, and [llama.cpp](/tools/llama-cpp) is the engine underneath if you want no wrapper at all. For a multi-user browser workspace in front of the same local models, see [Open WebUI](/tools/open-webui).
