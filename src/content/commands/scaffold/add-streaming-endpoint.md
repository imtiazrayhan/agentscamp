---
description: "Scaffold a token-streaming LLM endpoint — server-side streaming plus the client handler — so responses render incrementally instead of after a long wait."
argument-hint: "<the route/feature to stream, or the framework>"
allowed-tools: "Read, Grep, Glob, Edit, Write"
model: "sonnet"
title: "Add a Streaming LLM Endpoint"
color: "cyan"
date: 2026-06-03
topics: ["llm-app-dev"]
related: ["calling-any-model-gateways", "vercel-ai-sdk", "llm-integration-engineer", "new-component"]
featured: false
summary: "Scaffolds an LLM endpoint that streams tokens to the client (SSE / Web Streams) plus the matching client handler, so output appears as it's generated. Handles the streaming response, error/abort cases, and incremental rendering for the project's stack."
---

## Scope

Treat `$ARGUMENTS` as the route/feature to stream (e.g. "the chat endpoint") or the framework in use. Restate what you're streaming in one sentence, and detect the stack (Next.js, Express, FastAPI, etc.) before scaffolding.

Goal: turn a blocking "wait, then dump the whole answer" call into a **streaming** one where tokens render as they're produced — the difference between a 10-second blank screen and an instant, live response.

> [!NOTE]
> Match the transport to the stack. Most LLM streaming uses Server-Sent Events (SSE) or the Web Streams API; pick what the framework supports natively rather than inventing a protocol.

## Step 1 — Server: stream the model output

Scaffold the endpoint to call the model in streaming mode and forward chunks to the response as they arrive. Set the correct headers (e.g. `Content-Type: text/event-stream`, no buffering) and flush incrementally. If the project uses the [Vercel AI SDK](/tools/vercel-ai-sdk), use its streaming helpers; otherwise wire the provider's stream to the framework's streaming response.

## Step 2 — Handle errors and aborts

Stream errors mid-flight (a provider failure after tokens have started) and client disconnects (abort the upstream call to stop burning tokens). Decide how a partial response is surfaced — don't leave the client hanging on a half-stream.

## Step 3 — Client: consume and render incrementally

Scaffold the client side to read the stream and append tokens to the UI as they arrive, with a visible in-progress state and a stop/cancel control. For React, the AI SDK's `useChat`/`useCompletion` hooks handle this; otherwise consume the SSE/stream directly.

## Step 4 — Verify

Show the diff and confirm: tokens render progressively (not all at once at the end), errors surface, and cancelling the client aborts the server call. Note any backpressure or proxy-buffering caveats for the deployment target.

> [!TIP]
> If you're behind a proxy or serverless platform, check that response buffering is disabled on the streaming route — buffering silently turns a stream back into a single delayed response.
