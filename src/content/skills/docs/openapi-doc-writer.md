---
name: "openapi-doc-writer"
description: "Produce and maintain OpenAPI documentation for an HTTP API. Use when documenting endpoints, request/response schemas, or generating API reference docs."
date: 2026-06-03
version: "1.0.0"
color: "cyan"
topics: ["architecture"]
---

Author and maintain accurate, spec-compliant OpenAPI 3.1 documents that describe an HTTP API end to end — paths, operations, request bodies, responses, and reusable component schemas. This skill produces a single source of truth that drives reference docs, client SDK generation, and contract tests, while keeping the spec in sync with the actual code.

## When to use this skill

Use this skill when you need to:

- Document a new endpoint or a whole service in OpenAPI (YAML or JSON).
- Add or correct request/response schemas, parameters, headers, or status codes.
- Reconcile an existing spec with route handlers that have drifted from it.
- Generate a human-readable API reference or set up client/server code generation from the spec.

Skip it for internal RPC, GraphQL, or non-HTTP interfaces — OpenAPI does not model those well.

## Instructions

Follow these steps in order.

1. **Locate or create the spec.** Look for an existing `openapi.yaml`, `openapi.json`, or `swagger.*`. If none exists, create `openapi.yaml` with `openapi: 3.1.0`, an `info` block (`title`, `version`), and a `servers` list. Prefer YAML for readability.
2. **Inventory the endpoints.** Read the route definitions / controllers to enumerate every method + path, its parameters, request body shape, and all possible responses (including errors). Treat the code as the source of truth when it conflicts with stale docs.
3. **Model reusable schemas first.** Define shared object shapes under `components/schemas` and reference them with `$ref`. Never inline the same object twice. Mark fields `required` deliberately and express nullability with JSON Schema type arrays (e.g. `type: [string, "null"]`) — the `nullable` keyword was removed in OpenAPI 3.1.
4. **Write each operation.** Under `paths`, give every operation an `operationId` (unique, camelCase), a one-line `summary`, `tags` for grouping, typed parameters, a `requestBody` where applicable, and a `responses` map covering success and documented error codes (e.g. `400`, `401`, `404`, `422`).
5. **Add examples.** Provide at least one realistic `example` (or `examples`) per request body and key response. Examples must validate against their schema.
6. **Validate.** Run a linter such as `redocly lint` or `spectral lint` and fix every error and warning before finishing.
7. **Render or generate (if requested).** Produce reference HTML or client/server stubs from the validated spec.

> [!NOTE]
> When you need exact field placement, data-type keywords, or security-scheme syntax, consult the official OpenAPI 3.1 specification rather than guessing.

> [!WARNING]
> Keep `info.version` in step with releases and bump it on any breaking schema change. Downstream SDK generators and contract tests key off it.

## Examples

Documenting `GET /users/{id}` with a reusable schema and error response:

```yaml
paths:
  /users/{id}:
    get:
      operationId: getUserById
      summary: Retrieve a single user
      tags: [Users]
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        "200":
          description: The requested user
          content:
            application/json:
              schema: { $ref: "#/components/schemas/User" }
              example: { id: "9f1c...", email: "ada@example.com", active: true }
        "404":
          description: User not found
          content:
            application/json:
              schema: { $ref: "#/components/schemas/Error" }

components:
  schemas:
    User:
      type: object
      required: [id, email]
      properties:
        id: { type: string, format: uuid }
        email: { type: string, format: email }
        active: { type: boolean, default: true }
    Error:
      type: object
      required: [code, message]
      properties:
        code: { type: integer }
        message: { type: string }
```

Validate before committing:

```bash
npx @redocly/cli lint openapi.yaml
```
