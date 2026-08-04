---
name: "contract-test-designer"
description: "Design consumer-driven contract tests between services so an API provider can't break its consumers unnoticed — without slow, flaky full end-to-end environments. Use when independent services or teams integrate over an API, when integration bugs only surface in staging or prod, or when E2E suites are too slow and brittle to catch breaking API changes."
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Contract Test Designer"
topics: ["review-qa"]
related: ["contract-testing-microservices", "test-scaffolder", "openapi-doc-writer", "coverage-gap-finder"]
featured: false
summary: "Cross-service E2E tests are slow, flaky, and catch breaking API changes too late. This skill flips it: the consumer declares the requests it sends and the exact fields it depends on, the provider replays those expectations in its own CI, and a contract-violating change fails the provider's build before deploy — interface shape only, business logic stays in unit tests."
---

Cross-service E2E suites are slow, flaky, and tell you a provider broke a consumer only after both are deployed to a shared environment. This skill designs consumer-driven contract tests instead: the *consumer* declares the exact requests it sends and the precise response fields and types it actually reads, and the *provider* replays those expectations against its real handler in its own CI. A provider change that violates any consumer's contract fails the provider's build — before merge, before deploy, with no other service running. The deliverable is the consumer-defined contract(s), the provider-side verification wired into CI, and a sharing-plus-versioning approach so the two sides can evolve.

## When to use this skill

- Two or more independently deployed services (often owned by different teams) integrate over HTTP/JSON, gRPC, or a message queue, and a provider can ship a change that silently breaks a consumer.
- Integration regressions only appear in staging or prod because nothing in either repo's CI exercises the actual cross-service shape.
- The cross-service E2E suite is too slow or flaky to gate merges, so breaking API changes slip through.
- You're standing up a new client against an existing API and want to lock the dependency to *exactly* the fields you read, not the whole payload.

## Instructions

1. **Let the CONSUMER define the contract — and only the part it uses.** Write the contract from the consumer's test suite, not the provider's spec. For each interaction, state the *request* the consumer sends (method, path, query/body, headers that matter) and the *response shape it actually depends on*: the status code, the fields it reads, and their types. If the consumer parses `order.id` (string) and `order.total` (number) and ignores the other 20 fields, the contract asserts those two fields and nothing else. The contract is a description of *this consumer's* needs, never the provider's full API surface.
2. **Match on type and structure, not frozen example values.** Use matchers, not literals: assert `total` is a number, `status` is one of a set, `items` is a non-empty array of objects with `sku`/`qty` — not `total == 4250`. Frozen example values turn the contract into a snapshot test that breaks on every data change. Reserve exact-value matching for fields whose literal value is part of the contract (an enum the consumer branches on, a fixed `Content-Type`).
3. **Pick a tool/pattern and generate the artifact.** Match what the stack already uses before adding a dep. **Pact** (pact-js / pact-jvm / pact-python / pact-go) is the default for HTTP and async messages — the consumer test runs against a mock provider and emits a pact JSON file. **Spring Cloud Contract** suits a JVM-heavy shop. For simpler needs, a **shared JSON Schema / OpenAPI fragment** committed to both repos, validated on each side, is a legitimate lightweight contract. Whatever the tool, the output is a machine-checkable artifact of the consumer's expectations.
4. **Verify the PROVIDER against the contract in the PROVIDER's own CI.** This is the half teams skip and the half that earns the value. The provider's pipeline fetches every consumer contract and replays each recorded request against the real running provider (no consumer process involved), asserting the live response satisfies the matchers. Wire it as a required check: a provider change that drops `order.total` or renames `status` fails the provider build, so the break is caught at the source before merge. Use `provider states` (Pact) to set up the data each interaction needs (`given "order 42 exists"` → seed that fixture) rather than depending on ambient DB state.
5. **Share contracts via a broker or committed artifacts, and gate deploys on verification.** For more than a couple of services, run a **Pact Broker** (or PactFlow): consumers publish contracts tagged by branch/version, providers fetch and verify, and `can-i-deploy` blocks a release whose verified contracts don't cover the consumer versions currently in prod. For a small, co-located set, committing the contract artifact into a shared repo or the provider repo and verifying in CI is simpler and adequate — pick the lightest mechanism that still makes verification a required, automated gate, not a manual step.
6. **Version contracts so provider and consumer can evolve independently.** Tag each contract with the consumer's version and the environment where that consumer version runs. Additive provider changes (new optional field) keep old contracts passing — that's the point of matching only what the consumer reads. For a breaking change, support both shapes until every consumer has published a contract for the new one (verified via the broker), then retire the old. Never edit a published contract in place to make a failing provider build go green — that defeats the gate.
7. **Keep contracts to interface shape; push behavior into unit tests.** A contract verifies the *integration surface* — fields, types, status codes, error envelopes — not that the provider computes the right total or applies the right discount. That logic belongs in the provider's own unit/integration tests. A contract bloated with business assertions becomes a second, worse copy of the provider's logic suite and breaks on unrelated correct changes.

> [!WARNING]
> Contract tests verify the INTERFACE shape, not end-to-end behavior. They replace brittle cross-service E2E for catching *breaking API changes* — but they do not prove the provider's logic is correct or that the wired-up system works. Keep the provider's own logic tests, and a thin smoke E2E for the critical path; contracts shrink the E2E suite, they don't delete it.

> [!WARNING]
> A contract that asserts the provider's *entire* response — every field, exact values — instead of only the fields this consumer reads is an anti-pattern: it produces false breakages on unrelated, backward-compatible changes (a new field, a reordered key, a changed value the consumer never reads), and trains teams to ignore red builds. Assert the minimum the consumer actually depends on.

## Output

For the integration, the skill produces:

- **The consumer-defined contract(s)** — for each interaction, the request (method, path, body, key headers) and the response expectations as matchers (status code + only the fields/types this consumer reads), in the chosen tool's format.
- **The provider-side verification setup** — the CI step that fetches the contract(s) and replays them against the real provider, the provider-state fixtures each interaction needs, and the required-check wiring so a violation fails the provider build.
- **The sharing + versioning approach** — broker vs. committed artifact, how contracts are tagged by consumer version/environment, and the deploy gate (e.g. `can-i-deploy`) plus the rule for evolving through a breaking change.

Example — a consumer contract for an order-service client, in pact-js:

```js
const { PactV3, MatchersV3: M } = require("@pact-foundation/pact");

const provider = new PactV3({ consumer: "checkout-web", provider: "order-service" });

// The consumer reads only id (string), total (number), and status (one of two values).
// It ignores every other field on the order — so the contract asserts only these.
provider
  .given("order 42 exists")                       // provider state: seeded in provider CI
  .uponReceiving("a request for an order")
  .withRequest({ method: "GET", path: "/orders/42" })
  .willRespondWith({
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: {
      id: M.string("ord_42"),                     // type match, not the literal "ord_42"
      total: M.number(4250),
      status: M.regex(/^(open|closed)$/, "open"),  // enum the consumer branches on
    },
  });

await provider.executeTest(async (mock) => {
  const order = await fetchOrder(`${mock.url}/orders/42`);
  expect(order.status).toBe("open");
});
```

This test emits a pact file; the **provider's** pipeline then replays `GET /orders/42` against the real `order-service` (with state `order 42 exists` seeded) and fails the provider build if `total` stops being a number or `status` leaves the enum. Hand the request/response shapes to `openapi-doc-writer` to keep the published spec in sync, and use `test-scaffolder` to flesh out the provider-state fixtures.
