---
name: "Jan"
description: "An open-source desktop app that runs LLMs offline on llama.cpp or MLX, with a model hub, MCP tools, cloud providers by key and a local OpenAI-compatible API."
date: 2026-06-11
updated: 2026-11-27
reviewed: 2026-11-27
url: "https://jan.ai"
pricing: "open-source"
category: "platform"
repo: "https://github.com/janhq/jan"
license: "Apache-2.0"
os: ["macOS", "Windows", "Linux"]
color: "cyan"
topics: ["mlops-ai-infra"]
audience: ["ai-engineers"]
tags: ["local-llm", "desktop", "privacy", "open-source"]
featured: false
alternativeTo: ["lm-studio", "ollama"]
sameAs:
  - "https://github.com/janhq/jan"
  - "https://huggingface.co/janhq"
  - "https://x.com/jandotai"
related: ["tool:lm-studio", "tool:ollama", "tool:llama-cpp", "guide:best-local-llm-tools-2026", "glossary:quantization", "glossary:model-context-protocol"]
summary: "Jan is an Apache-2.0 desktop app from Menlo Research that downloads and runs open-weight models on your own machine, using a bundled llama.cpp engine or MLX on Apple Silicon. It adds MCP tools, optional cloud providers with your own keys, and an OpenAI-compatible server on 127.0.0.1:1337. There is no hosted Jan service and nothing to pay for."
faq:
  - q: "Does Jan have an API other apps can use?"
    a: "Yes. Settings > Local API Server starts an OpenAI-compatible server whose default base URL is http://127.0.0.1:1337/v1. You can set an API key, which clients then send as a bearer token, change the host to 0.0.0.0 to reach it from your network, and list Trusted Hosts for browser origins. A local model has to be loaded before the server will start."
  - q: "Does Jan work on Intel Macs?"
    a: "Not for local models. Jan's docs say that as of v0.8.5 the bundled llama.cpp engine does not load models on Intel Macs, and MLX needs Apple Silicon too. The README asks for macOS 13.6 or newer and suggests 8 GB of RAM for 3B models, 16 GB for 7B and 32 GB for 13B."
  - q: "Can Jan use cloud models too?"
    a: "Optionally. The README lists OpenAI, Anthropic, Mistral, Groq and MiniMax among the providers you can connect with your own API keys, alongside local models in one interface. The local API server can also route requests to those configured remote providers once it is running."
  - q: "Which GPUs does Jan support?"
    a: "Since v0.8.5 the llama.cpp engine ships inside the installer. On Windows and Linux, NVIDIA cards use the bundled CUDA 13 build; other GPUs, and NVIDIA cards or drivers that cannot run CUDA 13 such as the GTX 10 series, fall back to Vulkan. macOS uses Metal. The older option of downloading a CUDA 11 or 12 backend is gone."
---

[Jan](https://jan.ai) is an open-source desktop app for running language models on your own computer, described by the project as an open-source alternative to ChatGPT that runs 100% offline. It is built by Menlo Research as a Tauri app, licensed Apache-2.0, and wraps model download, chat, tools and a local API in a single installer. The [repository](https://github.com/janhq/jan) has about 46,000 GitHub stars as of November 2026, and jan.ai reports more than 7.4 million downloads.

## Highlights

- **Local models from Hugging Face.** Browse and download open-weight models such as Llama, Gemma, Qwen and gpt-oss inside the app.
- **Two local engines.** llama.cpp is bundled with the app and runs in its own worker process; MLX is available on Apple Silicon Macs.
- **OpenAI-compatible local server.** Default base URL `http://127.0.0.1:1337/v1`, with an optional API key, a configurable host and port, and CORS and Trusted Hosts controls.
- **MCP host.** Jan connects to [Model Context Protocol](/glossary/model-context-protocol) servers so a local model can call tools. Tool calls that arrive through the API are returned to the client unless you turn on server-side execution, which is off by default.
- **Cloud providers by key.** Connect OpenAI, Anthropic, Mistral, Groq, MiniMax and others and use them next to local models.
- **Custom assistants and an agent.** Create assistants for specific tasks. v0.8.7 added built-in subagents for the Jan agent (explore, research, review and debug), each with its own model, and a switch that withholds the shell tool from the model.

## In an AI-assisted workflow

Install from [jan.ai](https://jan.ai), the Microsoft Store, Flathub or GitHub Releases (Windows `.exe`, a universal macOS `.dmg`, Linux `.deb` and AppImage). Download a model that fits your RAM, where a grasp of [quantization](/glossary/quantization) pays off, then start the server under **Settings > Local API Server** and call it like any OpenAI endpoint:

```bash
curl http://127.0.0.1:1337/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "YOUR_MODEL_ID",
    "messages": [{"role": "user", "content": "Tell me a joke."}]
  }'
# omit the Authorization header if you have not set an API key
```

Any tool that accepts a custom OpenAI base URL can point at that address, which makes Jan a private backend for scripts, editors and agent experiments. Jan also has a Claude Code integration that sets the needed environment variables in your shell profile.

> [!TIP]
> Jan with MCP servers is a fully local agent playground: local model, local tools, no API bill. It is a good way to learn how tool calling behaves before you spend money on a hosted model.

## Good to know

Jan is free and there is no hosted version, so there is no pricing to track. The latest release as of November 2026 is v0.8.8, published October 28, 2026: a security update that makes links in chat open in the system browser, checks the origin of browser requests to the local API, and confines the agent's file tools to their workspace. If you run an older build with the API server enabled, update.

Trade-offs and limits:

- **Intel Macs are out** for local models as of v0.8.5.
- **Old NVIDIA cards lose CUDA.** GPUs that cannot run CUDA 13 use Vulkan from v0.8.5 on.
- **Binding to `0.0.0.0` exposes the server** to your network. Set an API key before you do.
- **It is a single-user desktop app**, not a serving stack for many concurrent users.
- **Licence metadata quirk.** GitHub's API reports the licence as unrecognised because the `LICENSE` file opens with a Menlo Research copyright header, but the text is standard Apache 2.0.

Against the alternatives: [LM Studio](/tools/lm-studio) is the closest desktop equivalent and is free but closed-source, so pick Jan when open source is a requirement. [Ollama](/tools/ollama) is the headless, CLI-first choice for scripting and servers. [Open WebUI](/tools/open-webui) is the option when several people need a browser workspace in front of the same models. [Ollama vs LM Studio](/guides/comparisons/ollama-vs-lm-studio) and [the local LLM tools roundup](/guides/comparisons/best-local-llm-tools-2026) place Jan among them.
