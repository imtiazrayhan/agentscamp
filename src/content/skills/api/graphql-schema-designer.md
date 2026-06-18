---
name: "graphql-schema-designer"
description: "Design a clean, evolvable GraphQL schema (SDL) that won't paint you into a corner — model the graph around domain types and their relationships rather than as RPC-over-GraphQL, set nullability deliberately, standardize lists with Relay connections, plan DataLoader batching for per-parent fields, and evolve by adding + @deprecated instead of versioning. Use when designing a new GraphQL API, reviewing an SDL, or migrating REST endpoints to a graph."
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["architecture"]
related: ["pagination-designer", "rate-limiter-designer", "idempotency-designer"]
featured: false
summary: "A GraphQL schema is a long-lived contract that evolves in place — no /v2 to escape to. This skill models the graph around domain types and edges (not RPC wrappers of your endpoints), sets nullability so one failing field doesn't blank its parent, standardizes lists with Relay connections, and names per-parent fields that need DataLoader before they N+1."
---

A GraphQL schema is not an afterthought over your endpoints — it's the public contract clients build against, and unlike REST there's no `/v2` to escape a bad decision: the graph evolves in place, forever. Two design mistakes dominate the post-launch pain. First, modeling the schema as a thin RPC wrapper of your existing endpoints (`getUserById`, `listOrdersForUser`) instead of a connected graph of types and relationships, which throws away the one thing GraphQL gives you. Second, sprinkling non-null (`!`) everywhere "to be safe," which is a trap — a single resolver error on a non-null field nulls its *entire parent object*, so a flaky downstream blanks out the whole response. This skill designs the SDL deliberately: types and edges, considered nullability, Relay connections for lists, a consistent mutation payload shape, and an explicit DataLoader plan for the fields that would otherwise N+1.

## When to use this skill

- You're designing a new GraphQL API from scratch and want an SDL that survives years of additive change without versioning.
- You're reviewing or refactoring an existing schema that reads like a list of RPC calls, has `!` on nearly every field, or returns bare arrays for lists.
- You're migrating REST endpoints to GraphQL and need to re-model resources as a connected graph rather than transcribing routes into queries one-for-one.
- Nested queries are slow and you suspect resolvers are firing one DB query per parent row (the N+1 storm).

## Instructions

1. **Model the graph around domain types and their relationships, not your endpoints.** Identify the nouns (`User`, `Order`, `Product`, `Review`) and the *edges* between them, then expose those edges as fields that return types — `User.orders`, `Order.lineItems`, `Review.author` — so a client can traverse `user { orders { lineItems { product { name } } } }` in one round trip. Do **not** transcribe REST routes into a flat field per endpoint (`getUserById`, `getOrdersForUser`, `getProductForLineItem`); that's RPC-over-GraphQL and forces clients back into client-side joins and N round trips. The query-graph shape, not your handler list, is the source of truth.

2. **Set nullability deliberately, field by field — non-null is a contract, not a default.** Mark a field non-null (`name: String!`) only when it *genuinely always resolves* — a column with a NOT NULL constraint, a synthesized value, the object's own `id`. Make a field nullable when a downstream failure (a separate service, a join that can return nothing, a slow API) shouldn't take down the rest of the response. The error-propagation rule is the whole reason this matters: when a non-null field's resolver throws or returns null, GraphQL can't put null there, so it nulls the *nearest nullable ancestor* — often the entire parent object — propagating upward until it hits a nullable field. So `Order.recommendedProducts` (computed by a flaky ML service) must be nullable, or one bad recommendation call blanks the whole order.

3. **Standardize every list as a Relay Connection, not a bare array.** Replace `orders: [Order!]!` with a connection: `orders(first: Int, after: String, last: Int, before: String): OrderConnection!`, where `OrderConnection { edges: [OrderEdge!]!, pageInfo: PageInfo! }`, `OrderEdge { node: Order!, cursor: String! }`, and `PageInfo { hasNextPage: Boolean!, hasPreviousPage: Boolean!, startCursor: String, endCursor: String }`. Cursor-based connections page correctly under inserts/deletes (each page is anchored to a real cursor, not an offset) and give you a uniform place to hang edge metadata later (e.g. `OrderEdge.addedAt`). Bare arrays can't paginate without a breaking change and force `first`/`offset` bolt-ons later. Use connections for any list that can grow unbounded; a small fixed enum-like list (a user's `roles`) can stay a plain array.

4. **Plan for the N+1 problem before you ship — name every field that needs a DataLoader.** Any field that resolves *per parent* — `Order.customer`, `Review.author`, `Product.category` — fires its resolver once per parent row in a list, so `orders(first: 50) { customer { name } }` becomes 1 query for orders plus 50 queries for customers. For each such field, specify a **DataLoader** that batches the per-parent keys into one query (`SELECT * FROM users WHERE id = ANY($1)`) and caches within the request. Walk the schema and list, explicitly, which fields are 1:1/1:N relationship fetches that must go through a batched loader; a schema with per-parent resolvers and no DataLoader will N+1 itself to death under nested queries.

5. **Evolve by adding fields and deprecating — never repurpose, never version the endpoint.** GraphQL evolves in place: add new fields, types, and optional arguments freely (additive changes are non-breaking because clients select only what they ask for). To retire a field, mark it `@deprecated(reason: "Use fullName instead")` and keep it resolving until usage drops to zero (check field-usage analytics), then remove. Never change an existing field's *meaning* or *type* (`price: Int` cents → `price: Float` dollars is a silent data corruption for every existing client), never tighten nullability from nullable to non-null on a live field, and never add a `/v2` schema — versioning the endpoint defeats the entire evolvability model.

6. **Constrain values with custom scalars and enums; never model a fixed set as a free string.** Use `enum OrderStatus { PENDING PAID SHIPPED CANCELLED }` instead of `status: String` so invalid values are rejected at the query layer and clients get the allowed set from introspection. Define custom scalars for formatted values (`DateTime`, `EmailAddress`, `URL`, `Money`) to centralize parse/serialize/validation and document the format in one place. Reserve `ID` for opaque identifiers (it serializes as a string — don't do math on it).

7. **Give mutations input types and a consistent payload/error shape.** Every mutation takes one `input` argument of a dedicated input type (`createOrder(input: CreateOrderInput!): CreateOrderPayload!`) — input types keep arguments cohesive and let you add optional fields without changing the signature. Return a **payload type**, not the bare entity: `CreateOrderPayload { order: Order, userErrors: [UserError!]! }`, where `userErrors` carries expected, recoverable validation failures (`{ field: ["input","email"], message: "already taken" }`) as *data* the client can render — distinct from unexpected exceptions, which belong in the top-level `errors` array. Keep this `{ entity, userErrors }` shape uniform across every mutation so clients handle errors one way.

> [!WARNING]
> Overusing non-null (`!`) is a trap, not a safety measure. When a non-null field's resolver errors, GraphQL nulls the nearest *nullable* ancestor — so one failing `User.subscription!` field can null the entire `User`, and if `User` is also non-null, it nulls *its* parent, cascading up to potentially blank the whole `data`. Model genuinely-fallible fields (anything backed by a separate service, an external API, or an optional relationship) as **nullable** so a partial failure degrades to one missing field instead of an empty response.

> [!WARNING]
> A schema with per-parent resolver fields and no DataLoader will N+1 itself to death. A query like `posts(first: 100) { author { name } comments(first: 10) { edges { node { id } } } }` fans out into hundreds or thousands of individual DB queries — fast in dev with 3 rows, a query storm in production. Decide the batching plan at design time, not after the first incident: every relationship field gets a request-scoped DataLoader, no exceptions.

> [!NOTE]
> Connections are worth the boilerplate even for lists that "will never be large," because there is no non-breaking path from `[T!]!` to a paginated connection later — clients have already coded against the array. If a list is truly bounded and fixed (status flags, a handful of roles), a plain list is fine; everything user-generated or growth-prone starts as a connection.

## Output

The deliverable is a designed SDL plus the decisions behind it:

- **The SDL** — object types and their relationship fields (edges), `enum`s and custom `scalar`s for constrained values, Relay **connection** types for every unbounded list (`*Connection` / `*Edge` / `PageInfo`), and mutations as `input`-arg + `*Payload` (with `userErrors`) pairs.
- **The nullability decisions** — a short table of the non-obvious fields marked nullable vs non-null, each with its rationale (this field can fail downstream → nullable; this field always resolves → non-null), so reviewers see the error-propagation reasoning.
- **The pagination decisions** — which lists became connections vs stayed plain arrays, and why.
- **The DataLoader / batching plan** — the explicit list of per-parent relationship fields (`Type.field`) that must resolve through a request-scoped batched loader, with the batch key and the batched query for each, so the schema doesn't N+1 under nested queries.