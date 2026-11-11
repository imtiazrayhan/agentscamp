---
name: "AnythingLLM"
title: "AnythingLLM"
description: "An MIT-licensed private AI app for chatting with documents and running agents with MCP tools on any local or cloud LLM, as a desktop app or Docker server."
seoDescription: "AnythingLLM in October 2026: MIT license, free desktop and Docker, hosted cloud prices, MCP transports, and how it compares with Open WebUI, NotebookLM and Jan."
date: 2026-10-07
url: "https://anythingllm.com"
pricing: "open-source"
category: "platform"
repo: "https://github.com/Mintplex-Labs/anything-llm"
license: "MIT"
os: ["Web", "macOS", "Windows", "Linux", "Android"]
color: "purple"
topics: ["mlops-ai-infra", "rag-retrieval"]
audience: ["ai-engineers", "founders"]
tags: ["anythingllm", "rag", "local-llm", "mcp", "agents", "self-hosted"]
featured: false
alternativeTo: ["open-webui", "notebooklm", "jan"]
sameAs:
  - "https://github.com/Mintplex-Labs/anything-llm"
  - "https://docs.anythingllm.com"
  - "https://x.com/anythingllm"
  - "https://hub.docker.com/r/mintplexlabs/anythingllm"
related: ["tool:open-webui", "tool:notebooklm", "tool:jan", "tool:ollama", "tool:sglang", "guide:best-local-llm-tools-2026", "glossary:rag", "agent:rag-pipeline-engineer"]
keywords: ["AnythingLLM", "AnythingLLM pricing", "AnythingLLM vs Open WebUI", "chat with documents locally", "AnythingLLM MCP", "private AI assistant"]
summary: "AnythingLLM is Mintplex Labs' MIT-licensed all-in-one private AI app: chat with your documents, run built-in agents with MCP tools, and use most local or cloud LLMs, as a free desktop app or a multi-user Docker server. About 67,400 GitHub stars as of October 2026; latest release v1.18.0. The hosted cloud and a desktop Pro add-on are the paid options."
faq:
  - q: "Is AnythingLLM free?"
    a: "The core is MIT-licensed, the desktop app is a free download and the Docker server is free to self-host. As of October 2026 the hosted cloud lists Basic at $50 per month and Pro at $99 per month, each a private instance, with Enterprise on request for on-premise deployment, SSO and RBAC. A separate AnythingLLM Pro desktop subscription unlocks the Magic features; its price sits behind a checkout page, so we do not quote it."
  - q: "AnythingLLM vs Open WebUI?"
    a: "Both self-host with Docker and both support MCP. AnythingLLM is MIT-licensed, ships a free desktop app and a paid hosted cloud, and organises work into workspaces with agents configured from a JSON file over stdio, SSE or Streamable transports. Open WebUI is web-server-first with the broader enterprise surface (LDAP, SCIM 2.0, nested groups) and native MCP over Streamable HTTP only, under a custom license with a branding clause."
  - q: "Does AnythingLLM work with Claude and MCP?"
    a: "Anthropic is a first-class cloud LLM provider in the setup docs, and any OpenAI-compatible endpoint works through the generic OpenAI provider. MCP servers are added by editing anythingllm_mcp_servers.json in the storage plugins directory; stdio is the default transport, with SSE and Streamable transports selected through a type field, and the UI shows server status and lets you stop or start them."
  - q: "Can AnythingLLM run models without Ollama?"
    a: "Yes. The README says it runs local models on CPU or GPU (NVIDIA via CUDA, AMD and Intel via Vulkan) with no extra setup, powered by Lemonade and llama.cpp. It also connects to Ollama, LM Studio, LocalAI, KoboldCPP and a long list of cloud providers if you would rather keep inference elsewhere."
---

AnythingLLM is the "all-in-one" answer to a question many teams ask after their first week with a local model: now that it runs, how do we chat with our own documents, give it tools, and share it? Mintplex Labs' app bundles document RAG, a no-code agent builder with MCP tools, and connectors for most local and cloud LLMs into one package that runs as a desktop app (macOS, Windows, Linux) or as a multi-user Docker server. The README's pitch is "Chat with your docs. Automate complex workflows with AI Agents. Hyper-configurable, multi-user ready, battle-tested" and "runs locally by default with zero setup friction."

It is MIT-licensed, with the LICENSE unchanged since the first commit in June 2023, and it has about 67,400 GitHub stars as of October 2026. The latest release, v1.18.0, shipped on 2026-10-13.

## Highlights

- **Documents in, answers out.** Workspaces hold your files; chat is grounded in them through [RAG](/glossary/rag) over a choice of vector databases.
- **Built-in local engine.** Run models on CPU or GPU (NVIDIA via CUDA, AMD and Intel via Vulkan) with no extra setup, powered by Lemonade and llama.cpp; or point it at Ollama, LM Studio, LocalAI, KoboldCPP or oMLX.
- **Broad provider list.** OpenAI, Azure OpenAI, Anthropic, AWS Bedrock, Cohere, Gemini, Vertex, Groq, Hugging Face, Mistral, OpenRouter, Perplexity, LiteLLM, Z.AI, SambaNova and more, plus a generic OpenAI-compatible option.
- **Dynamic model routing.** Route each chat to the best provider and model under rules you define.
- **Agents with MCP.** A no-code agent builder, MCP compatibility, scheduled tasks on a cron schedule with full agent capabilities, and "Intelligent Skill Selection", which the vendor says enables unlimited tools while cutting token usage by up to 80 percent per query.
- **Multi-user (Docker only).** Instance-wide users and permissions, plus an embeddable chat widget for your website.
- **Mobile.** An open-source Android app lives in its own repository; there is no iOS app.

## In an AI-assisted workflow

The desktop app is a one-file install. For a shared server, the Docker quickstart is:

```bash
docker run -d -p 3001:3001 \
  --cap-add SYS_ADMIN \
  -v ${STORAGE_LOCATION}:/app/server/storage \
  -v ${STORAGE_LOCATION}/.env:/app/server/.env \
  -e STORAGE_DIR="/app/server/storage" \
  mintplexlabs/anythingllm:latest
```

(A Postgres-backed variant uses the `mintplexlabs/anythingllm:pg` image.) Pick a provider in settings, create a workspace, drop in documents, and the chat is grounded. For tools, add MCP servers to `anythingllm_mcp_servers.json` in the storage plugins directory and start them from the UI; the agent can then call them during a conversation. A fictional example of the kind of request that works once a filesystem or document agent is enabled:

```text
Example prompt (illustrative):
"Read the three vendor contracts in this workspace, list each renewal date,
and draft a one-paragraph summary of the auto-renewal terms."
```

Behind it you can run any engine with an OpenAI-compatible server, including [Ollama](/tools/ollama) on a laptop or [SGLang](/tools/sglang) on a GPU box; the [best local LLM tools](/guides/comparisons/best-local-llm-tools-2026) roundup compares the runtimes.

> [!TIP]
> Multi-user permissions and the embeddable chat widget are Docker-only features. If a team needs to share one instance, start with the Docker image rather than the desktop app, even for a pilot.

> [!NOTE]
> The v1.14.0 notes (June 2026) say "All model providers are now opt-out of tool calling by default", and v1.15.0 enabled the Intelligent Tool Selection reranker by default. If an agent stops calling tools after an upgrade, check those two settings before rewriting prompts.

## Good to know

**License and versions.** MIT throughout. 2026 releases: v1.12.0 (April) brought an automatic mode for native tool calling, intelligent tool selection, a filesystem agent, a document-generation agent and a Telegram bot; v1.14.0 (June) added STT for Deepgram, generic OpenAI, Lemonade and OpenAI, and TTS via KokoroTTS; v1.15.0 (June) introduced the Magic features (Magic Echo, Magic Beacon, Magic Tab) under AnythingLLM Pro; v1.16.0 (August) added image generation, a better file picker, mid-session tool toggles and support for an OpenAI-compatible Whisper API; v1.17.0 and v1.18.0 (October) are fix-heavy.

**Pricing.** The hosted cloud, as of October 2026, lists Basic at $50 per month (private instance, custom subdomain, bring your own LLM API key) and Pro at $99 per month (private instance, 72-hour support SLA, "great for large teams"), with Enterprise on a contact-us basis for on-premise deployment, custom SLA, custom integrations, SSO and RBAC. The pricing page also says "Self-host with Docker for free". AnythingLLM Pro, the desktop subscription, is available on Desktop v1.15.0 and later for Windows and macOS; its price is not shown on the docs pages, so we do not quote it.

**Platforms.** Desktop downloads for Apple Silicon and Intel Macs, Windows (x64 and ARM) and Linux; Docker for servers, with deploy buttons for AWS, GCP, DigitalOcean, Render, Railway and others plus a bare-metal guide; an Android app; no iOS.

Against the alternatives: [Open WebUI](/tools/open-webui) is the other self-hosted workspace, with deeper enterprise auth but a custom license and no free desktop build. [NotebookLM, now Gemini Notebook](/tools/notebooklm), is Google's hosted, source-grounded notebook tied to Gemini; AnythingLLM gives you the same chat-with-sources idea on any model, self-hosted, plus agents and multi-user workspaces, at the cost of running it yourself. [Jan](/tools/jan) is a lighter open-source desktop chat client for local models; AnythingLLM adds document workspaces, agent flows, MCP, a Docker server and a hosted cloud on top.
