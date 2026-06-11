---
name: "Vercel AI SDK"
title: "Vercel AI SDK"
description: "An open-source TypeScript toolkit for building AI apps — unified model API, streaming, structured output, tool calling, and UI hooks."
url: "https://ai-sdk.dev"
date: 2026-06-03
pricing: "open-source"
category: "sdk"
repo: "https://github.com/vercel/ai"
license: "Apache-2.0"
sameAs: ["https://github.com/vercel/ai", "https://ai-sdk.dev/docs"]
color: "cyan"
topics: ["llm-app-dev"]
tags: ["typescript", "streaming", "structured-output", "open-source", "react"]
featured: false
alternativeTo: ["litellm", "instructor"]
summary: "The Vercel AI SDK is the de facto TypeScript toolkit for AI apps: one provider-agnostic API for text, structured objects, and tool calls, first-class streaming, and framework UI hooks (React, Svelte, Vue) for building chat and generative interfaces fast."
related: ["litellm", "openrouter", "structured-output-2026", "calling-any-model-gateways", "add-streaming-endpoint"]
faq:
  - q: "What is the Vercel AI SDK?"
    a: "The Vercel AI SDK is an open-source TypeScript toolkit for building AI-powered applications. It provides one provider-agnostic API for generating text, generating structured objects, tool calling, and streaming — generateText, streamText, generateObject — plus React, Svelte, and Vue hooks like useChat for wiring chat and generative UI into your app."
  - q: "Is the Vercel AI SDK free?"
    a: "Yes — open source under Apache-2.0 and free; you pay your model provider for tokens. Despite the Vercel name it's framework-agnostic and runs anywhere Node or edge runtimes run."
  - q: "Vercel AI SDK vs LiteLLM?"
    a: "They overlap on provider-switching but live at different layers: the AI SDK is a TypeScript application toolkit with streaming and UI hooks, while LiteLLM is a Python library/self-hosted gateway for routing all LLM traffic. They also pair well — put OpenRouter or LiteLLM behind the AI SDK when you want centralized routing and cost control."
  - q: "Does the Vercel AI SDK support structured output?"
    a: "Yes — generateObject and streamObject produce schema-validated output (Zod and friends), with streaming supported. For Python backends, libraries like Instructor or BAML fill the same niche."
---

The Vercel AI SDK is an open-source TypeScript toolkit for building AI-powered applications. It gives you one **provider-agnostic** API for the things every LLM app needs — generating text, generating **structured objects**, **tool calling**, and **streaming** — plus framework hooks for wiring those into a UI. It has become the default way to build AI features in the TypeScript/JavaScript ecosystem.

It is aimed at full-stack and frontend developers who want to ship chat and generative-UI features without gluing together a provider SDK, a streaming layer, and a state library by hand. Swap models with a one-line change, and stream tokens or structured data to the browser with first-class primitives.

## Highlights

- **Unified model API** — `generateText`, `streamText`, `generateObject`, and tool calling across many providers; change models via config.
- **Streaming-first** — stream tokens and structured output to the client with backpressure handled.
- **Structured output** — `generateObject`/`streamObject` with schema validation (Zod and friends).
- **UI hooks** — React, Svelte, and Vue hooks (`useChat`, `useCompletion`) for chat and generative interfaces.
- **Tool calling & agents** — define tools the model can call, with multi-step loops.

## In an AI-assisted workflow

```ts
import { streamText } from "ai";
const result = streamText({ model: "anthropic/claude", prompt });
return result.toUIMessageStreamResponse(); // stream straight to the browser
```

> [!TIP]
> The AI SDK overlaps with both structured-output libraries and gateways: it does typed output like [Instructor](/tools/instructor) and provider-switching like a gateway. Pair it with [OpenRouter](/tools/openrouter) or [LiteLLM](/tools/litellm) when you want centralized routing/cost control behind it.

## Good to know

The Vercel AI SDK is open source (Apache-2.0) and free; you pay your model provider for tokens. It's TypeScript-first — the natural choice in JS/TS apps, less so for Python backends (where Instructor/BAML fit better). It's framework-agnostic despite the Vercel name and runs anywhere Node/edge runs.
