---
name: "api-error-contract-designer"
title: "API Error Contract Designer"
description: "Design or normalize an API's error contract so clients get stable machine-readable codes, safe human messages, field-level validation details, correlation IDs, and consistent HTTP semantics. Use when adding endpoints, replacing ad hoc error strings, documenting SDK behavior, or fixing clients that branch on fragile message text."
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-08-04
topics: ["architecture", "llm-app-dev"]
related: ["best-claude-skills-for-api-development", "idempotency-designer", "pagination-designer", "openapi-doc-writer", "contract-test-designer", "api-architect"]
featured: false
summary: "Designs one stable API error envelope with documented HTTP status semantics, immutable machine codes, safe user-facing messages, structured field errors, retry hints, and correlation IDs. It inventories current failure paths, maps them into a compatibility table, updates the implementation and schema, and adds contract tests so clients never need to parse prose."
faq:
  - q: "Why does an API need both an HTTP status and an error code?"
    a: "The status communicates the broad protocol outcome; the application code identifies the stable business condition clients handle. Several distinct failures may all be 409 or 422, and clients should branch on a documented code rather than text that may be rewritten or localized."
  - q: "Should internal exception messages be returned to clients?"
    a: "No. Internal messages can expose implementation details, queries, paths, or secrets and are not a stable interface. Log the internal exception under a correlation ID, then return a safe public message and documented machine code."
---

Create a stable error interface that clients can depend on without parsing prose. Preserve compatibility where practical and make every change explicit.

## Workflow

1. **Inventory current errors.** Trace handlers, middleware, validators, domain errors, and exception fallbacks. Record status, body shape, machine code, message source, retry behavior, and whether sensitive detail can leak.
2. **Define one envelope.** Use the repository's conventions where they exist; otherwise design a minimal shape such as:

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

   Omit optional fields when irrelevant. Keep machine codes stable, uppercase, and domain-specific.
3. **Map semantics deliberately.** Assign statuses by protocol meaning: authentication, authorization, missing resource, conflict, validation, rate limit, upstream failure, and unexpected server error. Distinguish a safe retry from a permanent client error; add `Retry-After` only when the server can provide meaningful guidance.
4. **Separate public and internal detail.** Return safe messages. Log stack traces and internal context with the same request or correlation ID. Never expose SQL, filesystem paths, tokens, provider payloads, or raw exceptions.
5. **Model field errors structurally.** Use stable field paths and codes. Do not concatenate multiple validation problems into one sentence clients must parse.
6. **Preserve compatibility.** Build a before/after mapping. If existing clients depend on a legacy field, introduce the new envelope additively or version the breaking change; do not silently rename it.
7. **Implement centrally.** Prefer typed domain errors plus one translation layer over hand-built responses in every handler. Update the OpenAPI schema and SDK types from the same contract.
8. **Add contract tests.** Cover representative errors, the fallback 500 path, redaction, request IDs, field validation, and retry headers. Assert codes and structure rather than mutable message wording unless the message itself is contractual.

> [!WARNING]
> Never let clients branch on `message`. Prose changes for clarity and localization; machine codes are the compatibility surface.

## Output

Return:

- the proposed error schema and code-naming rules
- a current-to-target mapping table for every discovered error path
- implementation edits to the central translator and typed errors
- updated API schema or documentation
- contract tests proving status, code, redaction, field details, retry semantics, and fallback behavior
- compatibility or rollout notes for existing clients
