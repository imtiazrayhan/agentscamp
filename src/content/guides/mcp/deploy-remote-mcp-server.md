---
title: "Deploying a Remote MCP Server: Stateless, Streamable HTTP, and Horizontal Scaling"
seoTitle: "Deploying a Remote MCP Server: Streamable HTTP and Scaling"
description: "Take an MCP server from local stdio to a remote, multi-user HTTP service — Streamable HTTP, stateless vs. stateful sessions, OAuth, and horizontal scaling."
author: "Imtiaz Rayhan"
date: 2026-06-04
updated: 2026-11-27
reviewed: 2026-11-27
color: "green"
topics: ["mcp", "architecture"]
audience: ["developers", "ai-engineers"]
tags: ["mcp", "deployment", "scaling", "architecture", "oauth"]
featured: true
summary: "To serve many users, deploy an MCP server as a remote HTTP service over Streamable HTTP. The current spec revision (2026-07-28) removed protocol-level sessions and the Mcp-Session-Id header, so keep any cross-call state behind explicit handles in a shared store, put OAuth 2.1 in front, and scale replicas behind a load balancer like any API."
keyTakeaways:
  - "Remote MCP servers use the Streamable HTTP transport: a single /mcp endpoint that takes each JSON-RPC request as its own POST and answers with JSON or an SSE stream scoped to that request."
  - "Default to stateless: make every request self-contained so any replica can serve it, which makes horizontal scaling and serverless deployment trivial."
  - "The 2026-07-28 spec revision removed protocol-level sessions and the Mcp-Session-Id header. State that must survive across calls now travels as a server-minted handle passed as an ordinary tool argument, backed by a shared store."
  - "A remote server is a public API exposing tools with side effects: put OAuth 2.1 in front of it, validate every input, and scope what each token can do."
  - "Once stateless and authenticated, scaling is ordinary web ops — multiple replicas, a load balancer, health checks, autoscaling, rate limits, and tracing."
howtoSteps:
  - name: "Switch to Streamable HTTP"
    text: "Expose a single HTTP endpoint (conventionally /mcp) that accepts each JSON-RPC request as its own POST and replies with a JSON object or a Server-Sent Events stream scoped to that request. This replaces stdio's child-process model with a network service multiple clients can reach."
  - name: "Design it stateless"
    text: "Make each request fully self-contained so any server instance can handle any request. Avoid in-memory per-session state; if a tool needs context, derive it from the authenticated identity and the request, not from a session held in one process."
  - name: "Put OAuth 2.1 in front"
    text: "Protect the endpoint with OAuth 2.1, advertise protected-resource metadata so clients can discover how to authenticate, validate the access token on every request, and map token scopes to the tools and data each caller may use."
  - name: "Externalize any unavoidable state"
    text: "If a workflow needs state across calls, mint an explicit handle, return it from a tool, accept it back as a tool argument, and keep what it points to in a shared backend like Redis rather than process memory. Only servers that still support pre-2026-07-28 clients deal with the Mcp-Session-Id header."
  - name: "Scale behind a load balancer"
    text: "Run multiple stateless replicas behind a load balancer with health checks and autoscaling. Stateless means no session affinity is required; in-memory sessions for legacy clients mean sticky routing or the shared store from the previous step."
  - name: "Add limits and observability"
    text: "Treat it like any public API: rate-limit per token, set request timeouts, validate and bound tool inputs, and log/trace every tool call with its caller, arguments, and latency so you can debug and audit."
faq:
  - q: "What is a remote MCP server?"
    a: "A remote MCP server is an MCP server deployed as a network-accessible HTTP service rather than launched locally as a child process over stdio. It uses the Streamable HTTP transport, can be shared by many users and clients at once, is deployed and updated centrally, and — because it's network-exposed — must handle its own authentication and authorization. It's the right model for capabilities you want to offer as a service instead of bundling on each user's machine."
  - q: "What is the Streamable HTTP transport in MCP?"
    a: "Streamable HTTP is the MCP transport for remote servers, introduced in the 2025-03-26 spec revision to replace the older HTTP+SSE transport. The server exposes a single endpoint; the client sends each JSON-RPC request as its own HTTP POST and the server answers with a JSON object or a Server-Sent Events stream scoped to that request. The 2026-07-28 revision removed the separate GET stream and protocol-level sessions, which makes it simpler to deploy behind standard infrastructure and in serverless environments."
  - q: "Should my MCP server be stateless or stateful?"
    a: "Stateless. A stateless server treats each request as self-contained, so any replica can serve any request, which makes horizontal scaling, load balancing, and serverless deployment straightforward and crash-safe. The 2026-07-28 spec revision made the protocol itself stateless by removing the initialize handshake and the Mcp-Session-Id header. When a workflow needs state across calls, return a server-minted handle from a tool, accept it back as a tool argument, and keep the data in a shared store like Redis."
  - q: "How do I authenticate a remote MCP server?"
    a: "The MCP spec uses OAuth 2.1 for remote (HTTP) servers. The server advertises protected-resource metadata so clients can discover the authorization server, the client obtains an access token, and the MCP server validates that token on every request and enforces scopes — mapping them to which tools and data the caller is allowed to use. Never expose a remote MCP server without auth: it's a public endpoint exposing tools that can have real side effects."
related: ["guide:building-an-mcp-server", "guide:govern-mcp-servers", "agent:mcp-server-engineer", "tool:fastmcp", "tool:mcp-inspector", "command:add-mcp-server"]
---

[Building an MCP server](/guides/advanced/building-an-mcp-server) gets you a working server over **stdio** — a child process the client launches on the user's own machine, with no ports, no network, and no auth. That's the right model for local capabilities. But the moment you want **one** server shared across a team, deployed once and updated centrally, or offered as a product, you cross into a different problem: a **remote** MCP server, exposed over HTTP. The protocol part of that is small. The deployment part — state, auth, and scaling — is where remote servers actually succeed or fail.

This guide covers the transport you'll use, the single design decision that determines how easily you scale, how to secure it, and how to run more than one of it.

## The transport: Streamable HTTP

Remote MCP servers speak the **Streamable HTTP** transport. Introduced in the 2025-03-26 spec revision to replace the older HTTP+SSE design, it collapses everything to a **single endpoint** (conventionally `/mcp`). In the current revision, 2026-07-28, the client sends every JSON-RPC request as its own HTTP `POST`, and the server replies either with a plain JSON object or with a **Server-Sent Events** stream scoped to that one request: progress notifications first, then the final response.

A `tools/call` on the wire looks like this (the example from the spec):

```http
POST /mcp HTTP/1.1
Host: example.com
Content-Type: application/json
Accept: application/json, text/event-stream
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: get_weather

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": { "location": "Seattle, WA" },
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": { "name": "ExampleClient", "version": "1.0.0" },
      "io.modelcontextprotocol/clientCapabilities": {}
    }
  }
}
```

Three details matter for deployment:

- **Every request is self-describing.** There is no `initialize` handshake in 2026-07-28. Each request carries its protocol version and client capabilities in `_meta`, and a client that wants to choose a version up front calls `server/discover`, which every server must implement.
- **Routing headers are required.** `MCP-Protocol-Version`, `Mcp-Method`, and (for tool calls, resource reads and prompt gets) `Mcp-Name` mirror the body, so a load balancer or gateway can route and inspect traffic without parsing JSON. A header that disagrees with the body gets a `400 Bad Request`.
- **The standalone stream is gone.** The 2026-07-28 revision removed the HTTP `GET` stream, resumable streams via `Last-Event-ID`, and server-initiated requests on SSE. A client that wants change notifications (a tool list changed, a resource updated) sends a `subscriptions/listen` request and keeps that response stream open. When a server needs sampling or elicitation, it returns an `InputRequiredResult` and the client retries the original request with the answer.

The single-endpoint design is the important part. The old two-endpoint (POST + long-lived SSE) approach was awkward to put behind a load balancer and hostile to serverless platforms that don't love long-lived connections. One endpoint that can answer a request and close fits ordinary web infrastructure — and, crucially, fits a **stateless** deployment.

## The one decision that determines scaling: stateless vs. stateful

This is the choice everything else hangs on, and the 2026-07-28 revision has made half of it for you: protocol-level sessions and the `Mcp-Session-Id` header were removed from Streamable HTTP. What is left to decide is how your own tools handle state.

- **Stateless** — every request is self-contained. The server keeps no per-session memory between requests; whatever a tool needs, it derives from the authenticated identity plus the request itself. Because no request depends on which instance handled the last one, **any replica can serve any request.** That makes horizontal scaling, load balancing, autoscaling, and serverless deployment trivial, and it survives restarts and crashes without dropping anyone.
- **Stateful** — some workflows do need continuity: a multi-step checkout, a long-running job, a browser the agent keeps driving. On 2026-07-28 the server mints an explicit **handle** (a job ID, a cart ID), returns it in a tool result, and accepts it back as an ordinary tool argument on later calls. Keep whatever the handle points to in a shared store and any replica can still serve the next request.

The older shape still exists in the wild. In revisions 2025-03-26 through 2025-11-25 a server could assign a session with the `Mcp-Session-Id` header and hold its state in process memory, which pins that session to one process and forces **sticky routing** (session affinity at the load balancer) or an **externalized session store**. Clients and SDKs adopt new revisions at different speeds, so check which revisions yours negotiate. A server that speaks only 2026-07-28 should answer `GET` or `DELETE` on the MCP endpoint with `405 Method Not Allowed` and ignore any `Mcp-Session-Id` it receives; a server that must keep serving older clients implements that revision's handshake and session behavior alongside the new one.

> [!TIP]
> Default to stateless. Most MCP servers are request/response tool calls that don't actually need server-side memory — the model carries the conversational state, not your server. Reach for handles only when you have a concrete reason, and even then, put the state in Redis (or similar) rather than process memory so you keep the scaling properties.

## Securing it: a remote server is a public API

A stdio server inherits the user's machine and trust. A remote server inherits **the internet.** It exposes tools that can create records, spend money, and read private data, to anyone who can reach the URL. So:

- **Put OAuth 2.1 in front of it.** The MCP spec defines OAuth 2.1 for remote servers: advertise protected-resource metadata (RFC 9728, which the spec requires servers to implement) so clients can discover the authorization server, validate the access token on every request, and map token **scopes** to the specific tools and data each caller may touch.
- **Validate the `Origin` header.** The transport spec requires it on all incoming connections, with HTTP 403 for an invalid origin, to block DNS-rebinding attacks.
- **Validate and bound every input.** The model fills tool arguments; treat them as untrusted. Enforce schemas, cap sizes, and reject anything out of range before it reaches your handler.
- **Scope least privilege.** A token that can read should not be able to write. Don't expose one all-powerful tool when three scoped ones will do.

> [!WARNING]
> The transport gives you no security for free. An unauthenticated remote MCP server is an open, model-callable API over your tools — assume it will be found. Auth, input validation, and per-token scoping are not optional hardening; they are the baseline for being remote at all.

## Scaling it: ordinary web ops, once it's stateless

Here's the payoff of the stateless decision: scaling a remote MCP server is just scaling a web service. Run several replicas behind a load balancer, add health checks and autoscaling, and you're done — no session affinity needed because any replica can serve any request. Layer on the operational basics you'd give any public API:

- **Rate limiting** per token, so one client can't exhaust the service.
- **Timeouts** on tool handlers, so a slow downstream call can't pin a worker.
- **Observability** — log and trace every tool call with its caller, arguments, and latency. This is how you debug a misbehaving client and how you audit what was done on whose behalf.
- **Health and readiness checks** so the load balancer routes only to replicas that can actually serve.

If you're deploying to serverless or Fluid Compute, stateless is what makes it work cleanly: short-lived, self-contained requests. The one long-lived connection left is a client's `subscriptions/listen` stream; for it the spec recommends sending `X-Accel-Buffering: no` so reverse proxies do not buffer events, and periodic SSE comment lines as keep-alives.

## Putting it together

Take your working stdio server, expose it over **Streamable HTTP** at one endpoint, design every request to be **stateless** (with explicit handles where a workflow needs continuity), put **OAuth 2.1** and input validation in front of it, and run **multiple replicas behind a load balancer** with rate limits and tracing. Tool dispatch is unchanged from the local server — what you're really doing is operating a secured, scalable API that happens to speak MCP.

For the build-and-harden work, the [mcp-server-engineer](/agents/developer-tools/mcp-server-engineer) owns exactly this transition; frameworks like [FastMCP](/tools/fastmcp) handle much of the Streamable HTTP, session, and auth plumbing for you; and once you're running more than a handful of servers, [governing them](/guides/mcp/govern-mcp-servers) — registries, [gateways](/guides/comparisons/best-mcp-gateways-2026), and tool sprawl — becomes the next problem.
