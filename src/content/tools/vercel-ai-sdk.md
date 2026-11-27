---
name: "Vercel AI SDK"
title: "Vercel AI SDK"
description: "An open-source TypeScript toolkit for building AI apps — unified model API, streaming, structured output, tool calling, and UI hooks."
url: "https://ai-sdk.dev"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
pricing: "open-source"
category: "sdk"
repo: "https://github.com/vercel/ai"
license: "Apache-2.0"
sameAs: ["https://github.com/vercel/ai", "https://ai-sdk.dev/docs"]
color: "cyan"
topics: ["llm-app-dev"]
audience: ["ai-engineers"]
tags: ["typescript", "streaming", "structured-output", "open-source", "react"]
featured: false
alternativeTo: ["litellm", "instructor"]
summary: "The Vercel AI SDK is an Apache-2.0 TypeScript toolkit with one provider-agnostic API for text, structured output, tool calls and streaming, plus agent classes and UI hooks. AI SDK 7, the current major, requires Node.js 22 and is ESM-only. A plain model string routes through the Vercel AI Gateway; provider packages call each API directly."
related: ["tool:litellm", "tool:openrouter", "guide:structured-output-2026", "guide:calling-any-model-gateways", "command:add-streaming-endpoint"]
faq:
  - q: "Is the Vercel AI SDK free?"
    a: "Yes. It is open source under Apache-2.0 and you pay for model usage. Note where that usage goes: passing a plain model string such as 'anthropic/claude-sonnet-5.5' routes through the Vercel AI Gateway, which is a Vercel service with its own billing, while a provider package such as @ai-sdk/anthropic calls the provider with your own API key."
  - q: "Do I need Vercel or Next.js to use the AI SDK?"
    a: "No. The README describes it as a toolkit for Next.js, React, Svelte, Vue, Angular and runtimes like Node.js, and the core ai package has no dependency on Vercel hosting. Two parts do tie to Vercel: the default AI Gateway routing for plain model strings, and WorkflowAgent, which runs inside Vercel's Workflow."
  - q: "What changed in AI SDK 7?"
    a: "AI SDK 7 was announced on June 25, 2026. Per the migration guide it requires Node.js 22 or later and is ESM-only, so require() no longer works. OpenTelemetry moved out of the core package into @ai-sdk/otel, and the streamText result methods such as toUIMessageStreamResponse() are deprecated in favor of stateless helpers exported from ai. It also added agent-level tool approvals and WorkflowAgent for durable agents."
  - q: "Does the Vercel AI SDK support structured output?"
    a: "Yes. Pass output: Output.object({ schema }) to generateText or streamText with a Zod, Valibot or JSON schema, and the result is validated against it; it can be combined with tool calling in the same request. generateObject and streamObject were deprecated in AI SDK 6 and will be removed in a future version."
---

The Vercel AI SDK is an open-source TypeScript toolkit for building AI features into applications. It gives you one **provider-agnostic** API for generating text, **structured output**, **tool calling** and **streaming**, agent classes that run a tool loop for you, and UI hooks that connect all of it to a frontend. The repository is Apache-2.0 with about 28,300 GitHub stars as of November 2026, and the `ai` package is at 7.0.183 on npm.

It is aimed at full-stack and frontend developers who would otherwise glue together a provider SDK, a streaming protocol and client state by hand.

## Highlights

- **Unified model API.** `generateText` and `streamText` work the same across OpenAI, Anthropic, Google and other providers, either through per-provider packages (`@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`) or through the Vercel AI Gateway with a plain model string.
- **Structured output.** `output: Output.object({ schema })` on `generateText` or `streamText`, with Zod, Valibot or JSON Schema. It runs in the same call as tools.
- **Agents.** `ToolLoopAgent` handles the loop, context and stopping conditions, and is the docs' recommended starting point. `WorkflowAgent`, from `@ai-sdk/workflow`, adds persisted state and resumability by running inside a workflow.
- **Tool approvals.** Agent-level approval that can be automatic or wait for a person, per tool.
- **UI hooks.** `useChat` and related hooks from framework packages such as `@ai-sdk/react`, with Svelte, Vue and Angular equivalents. `@ai-sdk/tui` runs an agent in a terminal UI.
- **Telemetry.** Optional OpenTelemetry integration through `@ai-sdk/otel`, using the GenAI semantic conventions.

## In an AI-assisted workflow

Install the core package and one provider, then stream from a route handler using the AI SDK 7 helpers:

```bash
npm install ai @ai-sdk/anthropic zod    # Node.js 22+, ESM only
```

```ts
// app/api/summarize/route.ts  (reads ANTHROPIC_API_KEY)
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, toUIMessageStream, createUIMessageStreamResponse } from "ai";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const result = streamText({ model: anthropic("claude-sonnet-5-5"), prompt });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
```

Structured output uses the same function:

```ts
import { anthropic } from "@ai-sdk/anthropic";
import { generateText, Output } from "ai";
import { z } from "zod";

const { output } = await generateText({
  model: anthropic("claude-sonnet-5-5"),
  output: Output.object({
    schema: z.object({
      title: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    }),
  }),
  prompt: "Classify this bug report: checkout button does nothing on Safari.",
});
```

To scaffold the endpoint in an existing project, see the [add-streaming-endpoint](/commands/scaffold/add-streaming-endpoint) command. If you use a coding agent, `npx skills add vercel/ai` installs the SDK's own skill so the agent writes current v7 code instead of older patterns.

> [!WARNING]
> `model: "anthropic/claude-sonnet-5.5"` (a string) and `model: anthropic("claude-sonnet-5-5")` (a provider call) are not the same path. The string form goes through the Vercel AI Gateway by default, with Gateway credentials and billing. Use provider packages if you want requests to go straight to the provider on your own key.

## Good to know

**Major versions move fast and break things.** AI SDK 7 dropped Node.js 18 and 20, removed CommonJS support, renamed core APIs and deprecated the `result.toUIMessageStreamResponse()` family that most v5 and v6 tutorials use. Those methods still work in v7 with warnings and are due for removal in the next major. Budget migration time per major, and check which version a tutorial targets.

**TypeScript only.** There is no Python SDK. For a Python backend, [Instructor](/tools/instructor) covers validated structured output and [Pydantic AI](/tools/pydantic-ai) covers agents.

**`ToolLoopAgent` is in-memory.** The docs say so directly: if the process crashes, progress is lost. Durable agents mean `WorkflowAgent`, and that ties you to Vercel's Workflow runtime.

**It is a library, not a gateway.** Switching providers is a code change, and there are no shared keys, budgets or cross-app spend tracking in the SDK itself. Put [LiteLLM](/tools/litellm) or [OpenRouter](/tools/openrouter) behind it (both expose OpenAI-compatible endpoints) when you need central control, as [Calling Any Model](/guides/concepts/calling-any-model-gateways) describes.

**Provider features are not uniform.** One API does not make every model support every feature; structured output, tool streaming and image input vary by provider, and the docs keep a capability table per provider.

Against the alternatives: [LiteLLM](/tools/litellm) solves provider-switching at the network layer for any language, with keys and budgets, but gives you no streaming UI primitives. [Instructor](/tools/instructor) does one thing, schema-validated output with retries, mainly for Python. [Mastra](/tools/mastra) is a TypeScript agent framework for teams that want workflows and memory included. For the patterns behind typed output, see [Structured Output in 2026](/guides/concepts/structured-output-2026).
