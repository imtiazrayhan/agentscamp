---
name: "Open WebUI"
title: "Open WebUI"
description: "Self-hosted AI workspace that fronts Ollama and any OpenAI-compatible API with chat, RAG, MCP tools, agents and enterprise auth, via pip, Docker or Kubernetes."
seoDescription: "Open WebUI in October 2026: the self-hosted chat and RAG workspace for Ollama and OpenAI-compatible APIs, its branding-clause license, MCP, and alternatives."
date: 2026-10-06
url: "https://openwebui.com"
pricing: "open-source"
category: "platform"
repo: "https://github.com/open-webui/open-webui"
license: "Open WebUI License (BSD-3-Clause + branding clause)"
os: ["Web", "macOS", "Windows", "Linux"]
color: "blue"
topics: ["mlops-ai-infra"]
audience: ["ai-engineers", "developers"]
tags: ["open-webui", "self-hosted", "local-llm", "rag", "mcp", "chat-ui"]
featured: false
alternativeTo: ["lm-studio", "jan", "anythingllm"]
sameAs:
  - "https://github.com/open-webui/open-webui"
  - "https://pypi.org/project/open-webui/"
  - "https://docs.openwebui.com"
  - "https://x.com/OpenWebUI"
related: ["tool:lm-studio", "tool:jan", "tool:anythingllm", "tool:ollama", "tool:sglang", "guide:best-local-llm-tools-2026", "guide:best-open-source-llms-2026", "glossary:model-context-protocol"]
keywords: ["Open WebUI", "Open WebUI license", "Open WebUI vs LM Studio", "self-hosted ChatGPT alternative", "Ollama web UI", "Open WebUI MCP"]
summary: "Open WebUI is a self-hosted, browser-based AI workspace (chat, RAG, tools, agents, admin and RBAC) that fronts Ollama and any OpenAI-compatible API. About 156,000 GitHub stars as of October 2026; latest release v0.12.3. Free to run with the branding intact: the license is BSD-3-Clause text plus a branding clause, so it is permissive but not OSI-approved."
faq:
  - q: "Is Open WebUI free?"
    a: "Yes for internal use with the original branding intact, which the enterprise page lists as Standard Use at no charge. White-labeling, rebranding or enterprise-only features such as Terminals need an enterprise license, and there is no public price list: openwebui.com/pricing returned a 404 when we checked on 2026-10-21. Enterprise pricing is quote-based."
  - q: "Is Open WebUI open source?"
    a: "The full source is on GitHub, but the license is the Open WebUI License: BSD-3-Clause text plus a fourth branding clause, added in v0.6.6 (April 2025). You may not alter or remove the Open WebUI branding unless your deployment stays under 50 end users in any rolling 30-day period, you have written permission from the copyright holder, or you hold an enterprise license. It is not OSI-approved, and GitHub's API reports the license as Other. Contributions up to v0.6.5 remain under plain BSD-3-Clause."
  - q: "Open WebUI vs LM Studio?"
    a: "LM Studio is a single-user desktop app that bundles its own local inference. Open WebUI is a multi-user web server with RBAC, SSO, SCIM provisioning and RAG that fronts Ollama or any OpenAI-compatible endpoint, with an optional desktop app since v0.9.0. Pick LM Studio to explore models on one machine, Open WebUI to give a team a shared, governed chat workspace."
  - q: "Does Open WebUI support MCP and Claude?"
    a: "Open WebUI natively supports MCP from v0.6.31 over Streamable HTTP, with OAuth 2.1 (dynamic client registration or static) for auth; stdio servers go through the MCPO bridge. The docs still recommend OpenAPI tool servers as the preferred integration path for most deployments. Anthropic is listed on the homepage as a connectable provider alongside Ollama and OpenAI-compatible APIs."
---

Open WebUI is the web front end most teams reach for when they want a ChatGPT-style workspace they host themselves. It is a Python server you run with pip, Docker or Kubernetes, and it speaks to [Ollama](/tools/ollama) and to any OpenAI-compatible API, so the same interface can sit in front of a local model, a self-hosted serving engine or a cloud provider. The README calls it a "powerful, provider-agnostic interface for both local and cloud-based models", and the homepage adds Anthropic to the list of things you can connect.

The scale is unusual for a self-hosted tool: about 156,000 GitHub stars as of October 2026, with the homepage claiming "338M+ downloads" and "518K+ community members". Releases are frequent; v0.12.3 landed on 2026-10-16.

## Highlights

- **Provider-agnostic.** Ollama and OpenAI-compatible APIs out of the box; the project's own examples point the API URL at LM Studio, GroqCloud, Mistral, OpenRouter and vLLM.
- **Plugins and MCP.** Extend it with Filters, Actions, Pipes, Tools and Skills, and connect external services through MCP, MCPO and OpenAPI tool servers.
- **Local RAG.** Retrieval backed by nine vector databases and several content-extraction engines (Tika, Docling, Document Intelligence, Mistral OCR, PaddleOCR-vl, external loaders), with hybrid BM25 plus vector search and reranking.
- **Web search.** Dozens of providers, from SearXNG, Google PSE, Brave and Kagi to Tavily, Perplexity, Firecrawl and Exa.
- **Enterprise auth.** LDAP and Active Directory, SSO via trusted headers and OAuth, and SCIM 2.0 provisioning for Okta, Azure AD and Google Workspace.
- **Agentic terminal.** Open Terminal gives agents a terminal and filesystem for multi-step tasks; the Enterprise "Terminals" variant adds per-user isolated environments and resource limits.
- **Voice and video calls.** Multiple STT providers (local Whisper, OpenAI, Deepgram, Azure) and TTS engines (Azure, ElevenLabs, OpenAI, Transformers, WebAPI); since v0.12.0, Realtime call mode talks through an OpenAI Realtime voice model.
- **Desktop app.** A native app for macOS, Windows and Linux with a system-wide chat bar, screenshot capture, push-to-talk voice and optional fully local inference through a built-in llama.cpp engine.

## In an AI-assisted workflow

The quickest path is pip (Python 3.11) or the Docker image; both serve the UI on port 8080.

```bash
pip install open-webui
open-webui serve                      # http://localhost:8080

# or Docker, talking to an Ollama on the host:
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data --name open-webui --restart always \
  ghcr.io/open-webui/open-webui:main
```

From there the workspace becomes the team's single door onto whatever you serve behind it: a local Ollama, a GPU box running [vLLM](/tools/vllm) or [SGLang](/tools/sglang) (both expose OpenAI-compatible endpoints), or a cloud key. The [best local LLM tools](/guides/comparisons/best-local-llm-tools-2026) roundup covers the runtimes; the [open-source LLM roundup](/guides/comparisons/best-open-source-llms-2026) covers what to run on them.

MCP servers are added under Admin Settings, External Tools, with the type set to "MCP (Streamable HTTP)". Skills arrived as experimental support in v0.8.0; v0.12.0 added multi-file skills with version history, so scripts, references and templates can sit next to a SKILL.md, and v0.12.1 added `.skill` files.

> [!TIP]
> Two image variants save setup time: `ghcr.io/open-webui/open-webui:ollama` bundles Ollama in the same container, and `:cuda` adds GPU acceleration.

> [!WARNING]
> Read the license before you roll it out widely. The branding clause allows removing or altering the Open WebUI branding only when a deployment stays under 50 end users in any rolling 30-day period, when you have written permission from the copyright holder, or under an enterprise license. Keeping the branding keeps you inside the free terms.

## Good to know

**License.** The project started MIT, moved to BSD-3-Clause, then added the branding clause in commit 60d84a3a (2025-04-18), shipped as v0.6.6; the docs say "The original BSD-3 license continues to apply for all contributions made to the codebase up to and including release v0.6.5." The copyright holder became "Open WebUI Inc." on 2025-12-03, the CLA was re-worded on 2026-02-28 to grant Open WebUI Inc. a perpetual, irrevocable license to use, sublicense and commercialize contributions, and the license text was reorganised on 2026-04-14 (shipped with v0.9.0) with the 50-user threshold and the enterprise exception unchanged. The docs' framing: "Want to use Open WebUI for free? Just keep the branding."

**Pricing.** There is no public price list. The enterprise page shows two rows, Standard Use (internal use with original branding intact) at no charge and Enterprise Use (white-labeling, rebranding or enterprise-exclusive features such as Terminals) requiring an enterprise license, and notes that enterprise licenses are "available exclusively to registered entities and organizations". Enterprise pricing is quote-based.

**2026 releases.** v0.7.0 (January) added native function calling with built-in tools; v0.8.0 (February) an analytics dashboard, experimental Skills and prompt version control; v0.9.0 (April) the official desktop app, scheduled chat automations and a calendar workspace; v0.10.0 (June) shared folders, automatic context compaction for long chats, external knowledge bases and webhooks; v0.11.0 (July) a redesigned interface and sub-agents; v0.12.0 (October) Realtime voice calls, two-factor sign-in, nested groups and tool search for large tool sets, followed by end-to-end encrypted channel chats in v0.12.3.

**Platforms.** Self-hosted web app and PWA on Linux, macOS and Windows; the separate desktop app (AGPL-3.0, about 3,000 stars as of October 2026) runs on macOS, Windows and Linux. There is no native iOS or Android app.

Against the alternatives: [LM Studio](/tools/lm-studio) and [Jan](/tools/jan) are desktop-first apps for one person exploring local models, while Open WebUI is a server for a team, with admin controls, plugins and enterprise auth. [AnythingLLM](/tools/anythingllm) is the closest rival in shape, also self-hosted via Docker with MCP support, but it is MIT-licensed and ships a free desktop app plus a hosted cloud; Open WebUI has the broader enterprise surface (LDAP, SCIM 2.0, nested groups) and a custom license with a branding clause.
