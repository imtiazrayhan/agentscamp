---
title: "10 Best Claude Skills for API Development"
description: "Choose Claude skills for error contracts, idempotency, pagination, limits, webhooks, CORS, GraphQL, OpenAPI, tools, and MCP servers."
author: "Imtiaz Rayhan"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
color: "cyan"
topics: ["architecture", "llm-app-dev"]
audience: ["developers"]
tags: ["claude-skills", "api-design", "openapi", "graphql", "webhooks", "mcp"]
featured: true
seoTitle: "10 Best Claude Skills for API Development"
seoDescription: "Compare Claude skills for API errors, idempotency, pagination, rate limits, webhooks, CORS, GraphQL, OpenAPI, AI tool definitions, and MCP."
summary: "For an HTTP API, install api-error-contract-designer, idempotency-designer, pagination-designer, and openapi-doc-writer first; each returns a concrete contract such as an error envelope or a cursor spec. Add the rate-limit, webhook, CORS, or GraphQL skill when that boundary exists, and tool-definition-generator or mcp-server-scaffolder for agents."
keyTakeaways:
  - "pagination-designer is read-only and returns a spec; the error, idempotency, rate-limit, and GraphQL skills can edit files; the webhook and MCP skills write new ones."
  - "idempotency-designer and rate-limiter-designer both reject check-then-act designs and require an atomic write (a unique-constraint INSERT, SET NX, INCR, or a Lua script)."
  - "webhook-handler-scaffolder always produces the same order: verify the signature on raw bytes, check for replay, dedupe on the provider's event ID, persist, acknowledge, then process asynchronously."
  - "cors-configurator is a debugging skill: it starts from the exact browser error and ends by replaying the preflight with curl."
  - "tool-definition-generator shapes one model-facing schema from a real function signature; mcp-server-scaffolder builds a runnable server around one such tool with a stub handler."
faq:
  - q: "What is the best Claude skill for REST API design?"
    a: "There is no single one. api-error-contract-designer covers failure responses, idempotency-designer covers retried writes, pagination-designer covers list endpoints, and openapi-doc-writer records the result as an OpenAPI 3.1 document. Run them in that order, because the OpenAPI document should describe the error envelope and pagination shape the first three decide."
  - q: "Which Claude skill helps with API error responses?"
    a: "api-error-contract-designer. It traces handlers, middleware, and validators to inventory current errors, defines one envelope with a stable machine code, request_id, structured field errors, and a retryable flag, then implements it through a central translation layer and adds contract tests that assert codes and structure instead of message wording."
  - q: "Do I need both OpenAPI and tool definitions for an AI agent?"
    a: "Usually yes. openapi-doc-writer documents every path and response for client developers and SDK generators. tool-definition-generator produces a smaller set of schemas written for a model, with descriptions that say when to call the tool and when not to, enums in place of free strings, and required fields marked honestly."
  - q: "Can these skills scaffold an MCP server?"
    a: "mcp-server-scaffolder generates the entrypoint, a stdio or Streamable HTTP transport, one tool with a strict input schema, the MCP Inspector command, and the claude mcp add line. The handler is a stub. The skill states that a remote server still needs authentication and input validation before it is exposed."
related: ["guide:best-claude-skills-2026", "skill:api-error-contract-designer", "skill:idempotency-designer", "skill:pagination-designer", "skill:openapi-doc-writer", "skill:mcp-server-scaffolder"]
---

Each skill below owns one contract that API clients depend on: the error shape, retry safety, list traversal, throttling signals, webhook authenticity, cross-origin policy, the GraphQL schema, the OpenAPI document, or a model-facing tool definition.

The ten were chosen from the AgentsCamp library because each returns an artifact you can review in a pull request (a schema, a table, DDL, a handler), each names the specific mistake it prevents, and none overlaps another's trigger. System-level decisions around the API are in the [system design roundup](/guides/skills/best-claude-skills-for-system-design).

| Skill | Run it when | What it returns | Changes files? |
| --- | --- | --- | --- |
| [api-error-contract-designer](/skills/api/api-error-contract-designer) | Endpoints return different error shapes | Envelope, current-to-target mapping, translator, contract tests | Edits |
| [idempotency-designer](/skills/api/idempotency-designer) | A retried POST can charge or create twice | Key scheme, atomic store, 409 handling, DDL, handler sketch | Edits |
| [pagination-designer](/skills/api/pagination-designer) | A list endpoint is new, slow at depth, or skips rows | Cursor spec, envelope, page-size bounds, required indexes | No |
| [rate-limiter-designer](/skills/api/rate-limiter-designer) | You need per-tier or per-endpoint limits | Algorithm, key, limits table, middleware sketch | Edits |
| [webhook-handler-scaffolder](/skills/api/webhook-handler-scaffolder) | You receive events from a third party | Handler, `webhook_events` schema, dead-letter policy | Writes |
| [cors-configurator](/skills/api/cors-configurator) | The browser blocks a call that works in curl | Allowlist config, verified preflight | Edits, runs curl |
| [graphql-schema-designer](/skills/api/graphql-schema-designer) | You design or refactor a GraphQL schema | SDL, nullability table, DataLoader plan | Edits |
| [openapi-doc-writer](/skills/docs/openapi-doc-writer) | The API has no spec, or the spec has drifted | Linted OpenAPI 3.1 document | Writes |
| [tool-definition-generator](/skills/api/tool-definition-generator) | An agent calls your functions badly | Validated tool schemas | Writes |
| [mcp-server-scaffolder](/skills/api/mcp-server-scaffolder) | You want a new MCP server | Runnable skeleton with one tool | Writes, runs commands |

The prompts below are examples. Each skill also runs as a slash command by name, such as `/pagination-designer`.

## 1. api-error-contract-designer: one error envelope

> "Our handlers return three different error shapes. Design one contract and migrate without breaking the mobile client."

[api-error-contract-designer](/skills/api/api-error-contract-designer) inventories what each handler, middleware, and validator returns today, then proposes an envelope. Its default, when the repo has no convention:

```json
{
  "error": {
    "code": "ORDER_ALREADY_PAID",
    "message": "This order has already been paid.",
    "request_id": "req_123",
    "fields": [{ "path": "email", "code": "INVALID_FORMAT" }],
    "retryable": false
  }
}
```

It maps statuses by protocol meaning, keeps SQL, file paths, tokens, and raw exceptions out of responses while logging them under the same request ID, and builds a before-and-after table for every discovered error path. Legacy fields that clients depend on are kept additively or versioned. The implementation goes through typed domain errors and one translator, with contract tests for the fallback 500 path and redaction.

Skip it for a single new endpoint in a codebase that already has a consistent envelope.

## 2. idempotency-designer: retries that cannot double-charge

> "POST /payments gets retried by the mobile SDK on timeout. Make it idempotent."

[idempotency-designer](/skills/api/idempotency-designer) has the client mint one key per logical operation and send it in an `Idempotency-Key` header. The server scopes it as `(account_id, endpoint, idempotency_key)` and claims it before doing any work in one atomic operation: a unique-constraint `INSERT` with status `in_progress`, Redis `SET ... NX`, or a conditional put. The response is stored with the key, ideally in the same transaction as the side effect, and replayed on repeats.

| Situation | Response the design specifies |
| --- | --- |
| Same key, first request finished | Stored response, replayed verbatim |
| Same key, first request still running | `409 Conflict` (or `425`) with `Retry-After` |
| Same key, different request body | `422` |
| First attempt crashed mid-flight | Retry allowed after the `in_progress` lease expires |

It also passes a derived key to any downstream payment or messaging call and sets a TTL matched to the client retry window, from minutes up to about 24 hours. The skill rejects any design with a `SELECT` before the `INSERT`. `GET`, `PUT`, and `DELETE` are designed to be naturally idempotent and get no key.

## 3. pagination-designer: stable list endpoints

> "GET /events is fast on page 1 and times out on page 500. Redesign the pagination."

[pagination-designer](/skills/api/pagination-designer) is read-only and returns a spec. It defaults to keyset pagination for large or changing data and allows offset only for small, stable, human-paged lists. The seek query it specifies:

```sql
WHERE (created_at, id) < (:last_created_at, :last_id)
ORDER BY created_at DESC, id DESC
LIMIT :n
```

The spec covers the unique tiebreaker on every sort, an opaque base64url cursor, a single envelope of `{ "data": [...], "next_cursor": "…", "has_more": true }`, `has_more` computed by fetching `n + 1` rows, a default page size of 20-50 with a hard maximum of 100-200, and the exact composite index, for example `(tenant_id, created_at, id)`. Changing any filter or sort parameter invalidates the cursor. Sortable columns are whitelisted, never interpolated from the client.

The trade-off is stated plainly: keyset pagination gives up random page jumps and total counts.

## 4. rate-limiter-designer: limits that hold across replicas

> "Add rate limits: free and pro tiers, with a tighter limit on /export."

[rate-limiter-designer](/skills/api/rate-limiter-designer) picks token bucket (the default, allows bursts), sliding-window counter (smooth), or fixed window (simple, but lets through up to twice the limit across a boundary). It keys authenticated routes on API key or user, often combined with the endpoint, and falls back to IP only for unauthenticated traffic. Limits come out as a per-tier table. State lives in a shared store such as Redis with an atomic `INCR` plus `EXPIRE`, or a single Lua script for token bucket.

Responses carry `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset` on every request, and `429` with `Retry-After` on breach. You must choose fail-open or fail-closed for when the store is unreachable. If a CDN, WAF, or gateway can enforce coarse IP limits at the edge, the skill tells you to do that there and keep app-level limiting for identity-aware quotas.

## 5. webhook-handler-scaffolder: verify, dedupe, acknowledge, process

> "Scaffold a handler for our payment provider's webhooks in this Express app."

[webhook-handler-scaffolder](/skills/api/webhook-handler-scaffolder) first looks up the provider's contract: signature header, the exact signed string, the event ID field. The generated handler always runs in this order:

1. Read the raw body and verify the HMAC with a constant-time comparison; `401` on failure.
2. Reject timestamps outside the provider's tolerance window.
3. Insert the provider's event ID under a unique constraint; on conflict return `200` and stop.
4. Persist the raw event with `processed = false`, then return `2xx`.
5. Enqueue the event for a worker that is safe to re-run and does not assume ordering.

It configures the route to keep the raw body, since JSON-parsing middleware breaks signature checks. Business logic is left as a marked TODO in the worker. The output ends with a list of provider details to confirm against the provider's own docs, so treat those as unverified until you check them.

## 6. cors-configurator: fix the browser error without opening the API

> "fetch from app.example.com fails with a CORS error after we added the Authorization header. curl works."

[cors-configurator](/skills/api/cors-configurator) reads the exact console message, classifies the request as simple or preflighted, and finds where headers are set, including any proxy that adds or strips them. For credentialed requests it echoes an allowlisted origin, never `*`, and adds `Access-Control-Allow-Credentials: true` and `Vary: Origin`. It makes the `OPTIONS` route answer with allowed methods, headers, and `Access-Control-Max-Age`, then replays the preflight:

```bash
curl -i -X OPTIONS https://api.example.com/things \
  -H "Origin: https://app.example.com" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: authorization,content-type"
```

It prefers the framework's maintained CORS middleware over hand-written headers and will not reflect arbitrary origins. It is a fix for a specific failure, not a general security review.

## 7. graphql-schema-designer: a graph, not RPC over GraphQL

> "Review this SDL. Every field is non-null and lists are bare arrays."

[graphql-schema-designer](/skills/api/graphql-schema-designer) models domain types and the edges between them (`User.orders`, `Order.lineItems`) instead of one field per REST route. It sets nullability field by field, because a failing non-null field nulls its nearest nullable ancestor and can blank a whole response. Unbounded lists become Relay connections:

```graphql
orders(first: Int, after: String): OrderConnection!
```

Mutations take one `input` argument and return a payload type with `userErrors`. Closed sets become enums, formatted values become custom scalars, and retired fields get `@deprecated` instead of a new endpoint version. The deliverable includes a nullability table and a DataLoader plan naming every per-parent field that needs batching.

It is a design skill. It does not write resolvers; the [graphql-architect](/agents/core-development/graphql-architect) agent covers implementation.

## 8. openapi-doc-writer: a spec that matches the code

> "Write an OpenAPI spec for the routes in src/routes. The code is the source of truth."

[openapi-doc-writer](/skills/docs/openapi-doc-writer) finds or creates `openapi.yaml` at version 3.1.0, reads the route definitions to list every method, path, parameter, and response, and defines shared shapes under `components/schemas` so nothing is inlined twice. Each operation gets a unique `operationId`, tags, and documented error responses. Nullability uses type arrays such as `type: [string, "null"]`, since 3.1 dropped the `nullable` keyword. Every request body and key response gets an example that validates against its schema, and the document is linted before the skill finishes:

```bash
npx @redocly/cli lint openapi.yaml
```

Do not use it for GraphQL or internal RPC, which OpenAPI does not model well.

## 9. tool-definition-generator: schemas a model can call correctly

> "Turn refundCharge() into a tool definition for our support agent."

[tool-definition-generator](/skills/api/tool-definition-generator) derives the schema from the real function signature, types, and call sites, or from an OpenAPI spec. The name and description are written for the model. The skill's own example description: "Refund a charge. Use only after confirming the charge exists and the amount; do not use for subscription cancellations." Arguments get precise JSON Schema types, honest `required` lists, units in descriptions ("USD cents"), and enums and bounds wherever the set is known. It merges or disambiguates tools that are easy to confuse and emits the format your framework expects.

It generates the interface only. Error handling and approval for consequential actions still belong in the runtime.

## 10. mcp-server-scaffolder: one good tool behind MCP

> "Scaffold a local MCP server that exposes order lookup from our Postgres database."

[mcp-server-scaffolder](/skills/api/mcp-server-scaffolder) decides between stdio (local) and Streamable HTTP (remote or shared), picks the official Python or TypeScript SDK or [FastMCP](/tools/fastmcp) to match the project, and generates the entrypoint, transport, and one tool with a verb-object name, a routing-quality description, and a strict input schema. It adds the [MCP Inspector](/tools/mcp-inspector) launch command and the exact `claude mcp add` invocation.

The handler is a stub with a TODO. Testing, registration, and security review after the first call are covered in the [MCP development roundup](/guides/skills/best-claude-skills-for-mcp-development).

## Recommended API stacks

For a conventional HTTP API:

```bash
npx agentscamp add skills/api-error-contract-designer
npx agentscamp add skills/idempotency-designer
npx agentscamp add skills/pagination-designer
npx agentscamp add skills/openapi-doc-writer
```

Add by condition, not by default:

| If the API... | Add |
| --- | --- |
| Is public or has paid tiers | `rate-limiter-designer` |
| Receives third-party events | `webhook-handler-scaffolder` (pair with `idempotency-designer`) |
| Is called from a browser on another origin | `cors-configurator` |
| Is GraphQL | `graphql-schema-designer` in place of the pagination and OpenAPI skills |
| Is called by an agent | `tool-definition-generator`, then `mcp-server-scaffolder` |

Point each skill at real routes, schemas, and tests. Several of them start with a grep through the codebase, and their output is only as accurate as what they find there.

## Continue exploring

- [Contract Testing for Microservices: Consumer, Provider, and CI](/guides/testing/contract-testing-microservices) — Catch breaking service changes before deployment with consumer-driven contracts, provider verification, state fixtures, compatibility gates, and schema tests.
- [10 Best Claude Skills for Building AI Applications](/guides/skills/best-claude-skills-for-ai-apps) — Structured output, fallbacks, evals, cost, and guardrails for the model call behind an API.
