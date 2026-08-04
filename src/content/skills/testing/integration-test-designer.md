---
name: "integration-test-designer"
description: "Design integration tests that exercise components against REAL collaborators — actual database, queue, HTTP boundary — at a deliberately chosen seam, instead of a unit suite that mocks everything or a slow flaky full E2E. Use when bugs slip past green unit tests, when wiring or contracts between layers break in production, or when a mocked DB test passes but the real query/migration/serialization fails."
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Integration Test Designer"
topics: ["review-qa"]
related: ["skill:contract-test-designer", "skill:test-scaffolder", "skill:mock-data-factory", "skill:coverage-gap-finder"]
featured: false
summary: "Unit tests mock the database and prove the mock works, not the query. Full E2E is too slow to run. This skill designs integration tests at the right seam: a real slice (handler→service→repo + real DB/queue) against ephemeral infra, with per-test data isolation so tests stay hermetic and fast — asserting observable outcomes, not internal calls."
---

A unit suite that mocks the database, the queue, and the HTTP client proves your mocks are configured the way you configured them — it never runs your actual SQL, your migrations, your serialization, or the wiring between layers. That's exactly where bugs slip into production. A full E2E suite catches them but is too slow and flaky to gate merges. This skill designs the layer in between: an integration test that drives a deliberately chosen *slice* of the system through its real boundaries — a real database, a real broker, a real HTTP framework — while stubbing only the genuinely uncontrollable third parties. The deliverable is the chosen seam, an explicit real-vs-stubbed split, an ephemeral-infrastructure plus per-test data-isolation setup, and representative tests that assert on observable outcomes.

## When to use this skill

- A bug shipped despite a green unit suite because the suite mocked the very collaborator that broke — a wrong column name, a missing migration, a JSON field that serializes differently than the mock returned.
- The wiring or contract *between* layers fails (handler doesn't pass the tenant id to the repo; a queue message round-trips with the wrong shape) and no test exercises the layers together.
- The E2E suite is too slow or flaky to run on every PR, so cross-layer regressions are caught late, in staging or prod.
- You're standing up a new service and want a fast, real-infrastructure test for the persistence/messaging path before there's anything to E2E.

## Instructions

1. **Choose the seam deliberately — name what's inside the slice and what's outside.** Don't test "the whole app" and don't test one function; pick a coherent slice with real boundaries: handler→service→repository→**real DB**, or producer→**real broker**→consumer, or service→**real HTTP** of your own framework. State the entry point (the call that drives the test) and the exit boundary (the real collaborator whose effect you assert). Everything between them runs for real, unmocked; that is the integration you're proving works.
2. **Use REAL infrastructure via ephemeral instances — not a mock of it.** Run the actual database, broker, or cache the slice talks to, spun up disposably: **Testcontainers** (a throwaway Postgres/MySQL/Kafka/Redis container per suite), a disposable Docker service, an in-process real engine (embedded Postgres, an in-memory SQLite *only if prod is SQLite*), or a local broker (an embedded Kafka/Redpanda, LocalStack for SQS). Run your real migrations against it on startup. A mocked DB test proves the mock returns what you told it to; only a real instance proves your query compiles, your migration applied, and your row maps back to your object.
3. **Stub ONLY the truly external and uncontrollable.** Third parties you don't own and can't run locally — a payment processor, an email/SMS gateway, a partner API, a clock, a random source — get stubbed (or pointed at a fake server like WireMock / a captured-fixture HTTP mock). Drawing the line here, not at your own DB/queue, is the whole discipline: stub what you can't control or can't make deterministic; run everything you own for real.
4. **Make every test hermetic and isolated — own your data, depend on no other test.** The top source of integration flake is shared mutable state across tests. Pick one isolation strategy and hold it: **transaction-per-test** (open a transaction in setup, run the test, roll back in teardown — fastest, but breaks if the code under test commits or needs its own connection); **unique data per test** (every row keyed by a per-test tenant/run id so concurrent tests never collide); or **truncate/reset between tests** (clean tables in teardown — simplest, slower). Each test seeds exactly the data it reads. No test may rely on data left by another or on running in a particular order.
5. **Pay the slow cost once, not per test.** Starting a container or applying migrations is seconds; doing it per test makes the suite unrunnable. Spin infra up **once per suite/session** (a session-scoped fixture: `pytest` session fixture, JUnit `@Container static`, a global setup) and reuse it; reset only the *data* between tests (step 4), which is milliseconds. Keep the integration suite a separate, taggable target from the unit suite so it can run on its own cadence and developers still get a fast unit loop.
6. **Assert observable outcomes, not internal calls.** Verify what actually happened at the real boundary: the row that now exists in the DB (query it back), the HTTP status and body the handler returned, the message that landed on the queue, the record that did *not* get written on a rollback path. Do not assert `repository.save was called once` — that's a mock-interaction check masquerading as integration coverage, and it passes even when the save silently failed. Cover the failure and edge paths too (constraint violation, conflicting concurrent write, retry on a dropped message), because those are precisely what unit mocks can't reproduce.

> [!WARNING]
> Mocking the database or queue inside an "integration" test defeats the entire purpose — you are testing the mock's configuration, not the integration. A `when(repo.find(...)).thenReturn(...)` test never runs your SQL, never catches a renamed column, a broken migration, or a NULL-handling bug. If the collaborator is yours to run, run a real ephemeral instance; if it isn't yours (a payment API), that's a stub *and a separate contract test* — see `contract-test-designer`.

> [!WARNING]
> Integration tests that share one database without per-test isolation become order-dependent and flaky: a test passes alone, fails in the suite, and fails differently in parallel, because it sees rows another test wrote (or expected rows another test deleted). Isolate data per test (transaction rollback or a per-test run id) before adding more tests, or the flake compounds until the suite gets disabled.

## Output

For the chosen slice, the skill produces:

- **The seam** — the entry point that drives the test and the exit boundary whose effect is asserted, with everything in between named as in-slice (real).
- **Real vs. stubbed, with the reason** — a short table: each collaborator marked REAL (ephemeral instance, how it's provisioned) or STUBBED (why it's uncontrollable, what fake stands in).
- **The infra + isolation setup** — how the real instance is spun up once per suite (Testcontainers / disposable service / embedded engine), how migrations are applied, and the per-test data-isolation strategy (transaction rollback / unique run id / truncate).
- **Representative tests** — happy path plus the failure/edge paths mocks can't reach, each asserting an observable outcome at the real boundary.

Example — a service+repository slice against a real Postgres, in Python (pytest + Testcontainers), data isolated by transaction rollback:

```python
import pytest
from testcontainers.postgres import PostgresContainer
from sqlalchemy import create_engine, text
from app.orders import OrderService  # entry point of the slice

# Spin the REAL database ONCE per session, run real migrations against it.
@pytest.fixture(scope="session")
def engine():
    with PostgresContainer("postgres:16") as pg:
        eng = create_engine(pg.get_connection_url())
        run_migrations(eng)            # the actual migrations, not a hand-built schema
        yield eng

# Isolate every test: open a transaction, hand it to the service, roll back after.
@pytest.fixture
def db(engine):
    conn = engine.connect()
    tx = conn.begin()
    yield conn
    tx.rollback()                      # nothing persists; tests can't see each other's rows

def test_place_order_persists_row(db):
    svc = OrderService(db)             # real service -> real repository -> real Postgres
    order_id = svc.place_order(sku="widget", qty=3)
    # Assert the OBSERVABLE outcome: the row exists with the right state.
    row = db.execute(text("SELECT qty, status FROM orders WHERE id = :id"),
                     {"id": order_id}).one()
    assert (row.qty, row.status) == (3, "open")

def test_place_order_rejects_negative_qty_and_writes_nothing(db):
    svc = OrderService(db)
    with pytest.raises(ValueError):
        svc.place_order(sku="widget", qty=-1)   # path a mocked repo would never exercise
    count = db.execute(text("SELECT count(*) FROM orders")).scalar()
    assert count == 0                            # the failed write left no partial row
```

The negative-qty test is the kind a mocked repository can't reach — it proves the real `CHECK`/validation prevents a partial write, against the real schema. Hand the seam to `test-scaffolder` to flesh out the remaining paths, use `mock-data-factory` to build the per-test seed data, and for the third parties you stubbed here, write a `contract-test-designer` test so their real shape stays pinned.