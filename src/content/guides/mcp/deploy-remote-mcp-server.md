---
title: "Deploying a Remote MCP Server: Stateless, Streamable HTTP, and Horizontal Scaling"
description: "Take an MCP server from local stdio to a remote, multi-user HTTP service — Streamable HTTP, stateless vs. stateful sessions, OAuth, and horizontal scaling."
author: "AgentsCamp"
date: 2026-06-04
color: "green"
topics: ["architecture"]
tags: ["mcp", "deployment", "scaling", "architecture", "oauth"]
featured: true
summary: "A local stdio MCP server serves one user; to serve many, deploy it as a remote HTTP service over the Streamable HTTP transport. Design it stateless so any replica can handle any request, put OAuth 2.1 in front, and scale it horizontally behind a load balancer like any API — the protocol is easy; auth and state are where remote servers are won or lost."
keyTakeaways:
  - "Remote MCP servers use the Streamable HTTP transport — a single /mcp endpoint that handles JSON-RPC over POST, with optional SSE streaming for server-initiated messages."
  - "Default to stateless: make every request self-contained so any replica can serve it, which makes horizontal scaling and serverless deployment trivial."
  - "Stateful sessions (held server-side, keyed by Mcp-Session-Id) need sticky routing or an externalized session store — only take that on when you genuinely need server-side session state."
  - "A remote server is a public API exposing tools with side effects: put OAuth 2.1 in front of it, validate every input, and scope what each token can do."
  - "Once stateless and authenticated, scaling is ordinary web ops — multiple replicas, a load balancer, health checks, autoscaling, rate limits, and tracing."
howtoSteps:
  - name: "Switch to Streamable HTTP"
    text: "Expose a single HTTP endpoint (conventionally /mcp) that accepts JSON-RPC requests over POST and can optionally stream responses via Server-Sent Events. This replaces stdio's child-process model with a network service multiple clients can reach."
  - name: "Design it stateless"
    text: "Make each request fully self-contained so any server instance can handle any request. Avoid in-memory per-session state; if a tool needs context, derive it from the authenticated identity and the request, not from a session held in one process."
  - name: "Put OAuth 2.1 in front"
    text: "Protect the endpoint with OAuth 2.1, advertise protected-resource metadata so clients can discover how to authenticate, validate the access token on every request, and map token scopes to the tools and data each caller may use."
  - name: "Externalize any unavoidable state"
    text: "If you must keep server-side sessions (keyed by the Mcp-Session-Id header), store them in a shared backend like Redis rather than process memory, so a request can be served by any replica and a restart doesn't drop sessions."
  - name: "Scale behind a load balancer"
    text: "Run multiple stateless replicas behind a load balancer with health checks and autoscaling. Stateless means no session affinity is required; stateful means you need sticky routing or the shared store from the previous step."
  - name: "Add limits and observability"
    text: "Treat it like any public API: rate-limit per token, set request timeouts, validate and bound tool inputs, and log/trace every tool call with its caller, arguments, and latency so you can debug and audit."
faq:
  - q: "What is a remote MCP server?"
    a: "A remote MCP server is an MCP server deployed as a network-accessible HTTP service rather than launched locally as a child process over stdio. It uses the Streamable HTTP transport, can be shared by many users and clients at once, is deployed and updated centrally, and — because it's network-exposed — must handle its own authentication and authorization. It's the right model for capabilities you want to offer as a service instead of bundling on each user's machine."
  - q: "What is the Streamable HTTP transport in MCP?"
    a: "Streamable HTTP is the MCP transport for remote servers, introduced in the 2025-03-26 spec revision to replace the older HTTP+SSE transport. The server exposes a single endpoint that accepts JSON-RPC messages over HTTP POST and can optionally upgrade a response to a Server-Sent Events stream for server-initiated messages. A single endpoint (instead of separate POST and SSE endpoints) makes it far simpler to deploy behind standard infrastructure and to run in stateless, serverless environments."
  - q: "Should my MCP server be stateless or stateful?"
    a: "Default to stateless. A stateless server treats each request as self-contained, so any replica can serve any request — which makes horizontal scaling, load balancing, and serverless deployment straightforward and crash-safe. Choose stateful (server-side sessions keyed by Mcp-Session-Id) only when you genuinely need to carry state across requests within a session, and then externalize that state to a shared store like Redis so you don't tie a session to one process."
  - q: "How do I authenticate a remote MCP server?"
    a: "The MCP spec uses OAuth 2.1 for remote (HTTP) servers. The server advertises protected-resource metadata so clients can discover the authorization server, the client obtains an access token, and the MCP server validates that token on every request and enforces scopes — mapping them to which tools and data the caller is allowed to use. Never expose a remote MCP server without auth: it's a public endpoint exposing tools that can have real side effects."
related: ["building-an-mcp-server", "govern-mcp-servers", "mcp-server-engineer", "fastmcp", "mcp-inspector", "add-mcp-server"]
---

[Building an MCP server](/guides/advanced/building-an-mcp-server) gets you a working server over **stdio** — a child process the client launches on the user's own machine, with no ports, no network, and no auth. That's the right model for local capabilities. But the moment you want **one** server shared across a team, deployed once and updated centrally, or offered as a product, you cross into a different problem: a **remote** MCP server, exposed over HTTP. The protocol part of that is small. The deployment part — state, auth, and scaling — is where remote servers actually succeed or fail.

This guide covers the transport you'll use, the single design decision that determines how easily you scale, how to secure it, and how to run more than one of it.

## The transport: Streamable HTTP

Remote MCP servers speak the **Streamable HTTP** transport. Introduced in the 2025-03-26 spec revision to replace the older HTTP+SSE design, it collapses everything to a **single endpoint** (conventionally `/mcp`): the client sends JSON-RPC messages over HTTP `POST`, and the server replies either with a plain JSON response or, when it needs to stream, by upgrading the response to a **Server-Sent Events** stream for server-initiated messages.

The single-endpoint design is the important part. The old two-endpoint (POST + long-lived SSE) approach was awkward to put behind a load balancer and hostile to serverless platforms that don't love long-lived connections. One endpoint that can answer a request and close fits ordinary web infrastructure — and, crucially, fits a **stateless** deployment.

## The one decision that determines scaling: stateless vs. stateful

This is the choice everything else hangs on.

- **Stateless** — every request is self-contained. The server keeps no per-session memory between requests; whatever a tool needs, it derives from the authenticated identity plus the request itself. Because no request depends on which instance handled the last one, **any replica can serve any request.** That makes horizontal scaling, load balancing, autoscaling, and serverless deployment trivial, and it survives restarts and crashes without dropping anyone.
- **Stateful** — the server holds session state in memory, keyed by the `Mcp-Session-Id` header the client carries across requests. This buys you continuity within a session but costs you the easy scaling: now a session is pinned to one process, so you need **sticky routing** (session affinity at the load balancer) or you must **externalize the session state** to a shared store.

> [!TIP]
> Default to stateless. Most MCP servers are request/response tool calls that don't actually need server-side session memory — the model carries the conversational state, not your server. Reach for stateful only when you have a concrete reason, and even then, put the state in Redis (or similar) rather than process memory so you keep the scaling properties.

## Securing it: a remote server is a public API

A stdio server inherits the user's machine and trust. A remote server inherits **the internet.** It exposes tools that can create records, spend money, and read private data, to anyone who can reach the URL. So:

- **Put OAuth 2.1 in front of it.** The MCP spec defines OAuth 2.1 for remote servers: advertise protected-resource metadata so clients can discover the authorization server, validate the access token on every request, and map token **scopes** to the specific tools and data each caller may touch.
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

If you're deploying to serverless or Fluid Compute, stateless is what makes it work cleanly: short-lived, self-contained requests with no long-lived connections to keep warm.

## Putting it together

Take your working stdio server, expose it over **Streamable HTTP** at one endpoint, design every request to be **stateless**, put **OAuth 2.1** and input validation in front of it, and run **multiple replicas behind a load balancer** with rate limits and tracing. The protocol negotiation and tool dispatch are unchanged from the local server — what you're really doing is operating a secured, scalable API that happens to speak MCP.

For the build-and-harden work, the [mcp-server-engineer](/agents/developer-tools/mcp-server-engineer) owns exactly this transition; frameworks like [FastMCP](/tools/fastmcp) handle much of the Streamable HTTP, session, and auth plumbing for you; and once you're running more than a handful of servers, [governing them](/guides/mcp/govern-mcp-servers) — registries, gateways, and tool sprawl — becomes the next problem.
