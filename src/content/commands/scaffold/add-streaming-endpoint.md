---
description: "Scaffold a token-streaming LLM endpoint — server-side streaming plus the client handler — so responses render incrementally instead of after a long wait."
argument-hint: "<the route/feature to stream, or the framework>"
allowed-tools: "Read, Grep, Glob, Edit, Write, Bash"
model: "sonnet"
title: "Add a Streaming LLM Endpoint"
color: "cyan"
date: 2026-06-03
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["llm-app-dev"]
audience: ["developers", "ai-engineers"]
related: ["guide:calling-any-model-gateways", "tool:vercel-ai-sdk", "agent:llm-integration-engineer", "command:new-component"]
featured: false
summary: "Scaffolds an LLM endpoint that streams tokens over SSE or a Web Stream, plus the client code that renders them as they arrive. It detects the stack, reuses the project's existing LLM client, forwards client aborts to the provider call, defines what happens on a mid-stream error, and proves the stream with curl -N before finishing."
---

## Scope

Treat `$ARGUMENTS` as the route or feature to stream ("the chat endpoint") or the framework in use. Restate what you are streaming in one sentence. If `$ARGUMENTS` is empty, Grep for the project's non-streaming LLM calls, list them, and ask which to convert.

Goal: turn a blocking "wait, then return the whole answer" call into one where tokens reach the UI as they are produced, with errors and cancellation handled.

## When to use

- A user-facing response takes more than a second or two to generate and is read by a person as it arrives (chat, drafting, summaries).
- Not for machine-consumed output such as JSON a caller must parse whole, background jobs, or webhooks. Streaming adds failure modes there and no benefit; say so and stop.

## Step 1: Detect the stack and the existing call

1. Read the manifest (`package.json`, `pyproject.toml`, `requirements.txt`) for the framework and the LLM client: Next.js, Express, Fastify, Hono, FastAPI, Flask; `ai` (the [Vercel AI SDK](/tools/vercel-ai-sdk)), a provider SDK, or raw `fetch`.
2. Find the current blocking call and its route. Reuse its model id, auth, prompt assembly, and logging. Do not introduce a second LLM client or change the model.
3. Read the **installed** SDK version and use that version's streaming API. Streaming helper names differ between major versions of the AI SDK and of provider SDKs, so check the package's own docs or its files under `node_modules/` / site-packages before writing a call you only remember.
4. Pick the transport the framework supports natively: Server-Sent Events (`text/event-stream`) for one-way token streams, or the SDK's own stream protocol if the client uses that SDK's hooks. Do not invent a protocol.

## Step 2: Server — stream the model output

Whatever the stack, the handler must do four things: call the model in streaming mode, write each delta as it arrives, send headers that prevent buffering, and close the stream explicitly.

A framework-neutral handler using Web standard APIs (works in Next.js route handlers, Hono, and other Fetch-style runtimes). `streamCompletion` stands for the project's existing provider call in streaming mode:

```ts
export async function POST(req: Request) {
  const { prompt } = await req.json();
  const encoder = new TextEncoder();
  const send = (event: string, data: unknown) =>
    encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Pass req.signal so a client disconnect cancels the provider call.
        for await (const delta of streamCompletion(prompt, { signal: req.signal })) {
          controller.enqueue(send("token", { text: delta }));
        }
        controller.enqueue(send("done", {}));
      } catch (err) {
        if (!req.signal.aborted) {
          controller.enqueue(send("error", { message: "Generation failed" }));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no", // tells nginx not to buffer this response
    },
  });
}
```

Equivalents in other stacks:

- **Vercel AI SDK**: call `streamText({ model, messages, abortSignal: req.signal })` and return the response with the helper that matches the installed major version and the client hook in use.
- **Express**: set the same headers, call `res.flushHeaders()`, `res.write()` each event, `res.end()` at the finish, and abort the provider call in `req.on("close", ...)`.
- **FastAPI**: return `StreamingResponse(generator(), media_type="text/event-stream")` from an async generator that yields `data: ...\n\n` lines.

## Step 3: Errors and aborts

Decide each case explicitly and implement it:

| Case | Required behavior |
| --- | --- |
| Provider fails before the first token | Return a normal error status (4xx/5xx) with a JSON body, not a 200 stream |
| Provider fails mid-stream | Status is already 200, so send an `error` event, then close. The client keeps the partial text and marks it incomplete |
| Client disconnects or presses stop | Abort the upstream call through the request's abort signal so it stops consuming tokens |
| Stream ends normally | Send a terminal `done` event so the client can tell "finished" from "connection dropped" |

Log an internal error id server-side and send only a generic message to the client. Do not stream provider error bodies or stack traces.

## Step 4: Client — consume and render

If the project uses an SDK hook (`useChat` / `useCompletion` from `@ai-sdk/react`), use it and wire its `stop` function to a button. Otherwise read the stream directly:

```ts
const controller = new AbortController(); // call controller.abort() from the Stop button

const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt }),
  signal: controller.signal,
});
if (!res.ok || !res.body) throw new Error(`Request failed: ${res.status}`);

const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
let buffer = "";
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  buffer += value;
  const events = buffer.split("\n\n");
  buffer = events.pop() ?? ""; // keep the incomplete trailing event
  for (const raw of events) {
    const event = raw.match(/^event: (.+)$/m)?.[1];
    const data = JSON.parse(raw.match(/^data: (.+)$/m)?.[1] ?? "{}");
    if (event === "token") appendText(data.text);
    if (event === "error") showError(data.message);
    if (event === "done") markComplete();
  }
}
```

The UI needs three states: generating (with a Stop control), complete, and failed or interrupted (partial text kept, with a retry). Buffer on `\n\n` as above; a network chunk can end in the middle of an event. `EventSource` only issues GET requests, so use `fetch` when the prompt is sent in a POST body.

## Step 5: Verify

Start the dev server with the project's script and test the route from the shell:

```bash
curl -N -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Count slowly from 1 to 20"}'
```

`-N` disables curl's output buffering. Pass criteria:

1. Events print progressively over the generation, not all at once at the end.
2. The stream ends with the `done` event.
3. Pressing Ctrl-C mid-stream stops the provider call (confirm in server logs).
4. With an invalid API key, the route returns an error status and JSON, not an empty 200.

If the port, path, or body shape differs, adapt the command. If you cannot run the server (missing credentials), say so and list these checks as not run. Run the project's typecheck and lint before finishing.

## Output

```markdown
## Streaming endpoint: <route>
- Stack: <framework>, <LLM client and installed version>, transport: <SSE | SDK stream protocol>
- Files changed: <list>
- Events: token / done / error (<payload shapes>)
- Abort: <how a client disconnect reaches the provider call>
- Verified: <curl result per criterion, or "not run" with the reason>
- Deployment notes: <buffering, timeouts, platform cancellation settings>
```

> [!TIP]
> If the stream works locally and arrives in one piece in production, something in front of the app is buffering: a reverse proxy, a CDN, or compression middleware. Also check the platform's function timeout and whether it propagates client disconnects. On Vercel, request cancellation works only in the Node.js runtime and must be enabled per function with `supportsCancellation` in `vercel.json`.
