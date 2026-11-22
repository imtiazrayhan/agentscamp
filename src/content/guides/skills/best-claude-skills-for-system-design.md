---
title: "9 Best Claude Skills for System Design"
description: "Claude skills, commands, and agents for system design: specs, design docs, ADRs, diagrams from code, threat models, idempotency, rate limits, caching, and migrations."
author: "Imtiaz Rayhan"
date: "2026-11-14"
reviewed: 2026-11-22
color: "purple"
depth: standard
topics: ["architecture"]
audience: ["developers"]
tags: ["claude-skills", "system-design", "architecture", "adr", "design-docs", "best-of"]
seoTitle: "9 Best Claude Skills for System Design and Architecture"
seoDescription: "The best Claude skills for system design: specs, design docs, ADRs, Mermaid diagrams from code, STRIDE threat models, idempotency, rate limits, and caching."
keywords: ["claude skills for system design", "claude code architecture skills", "adr writer claude", "design doc claude code", "architecture diagram from code", "threat model claude skill"]
summary: "Frame the change with spec-writer or /write-design-doc, record it with adr-writer, and draw the current system with architecture-diagram-generator. Stress it with threat-model-builder, settle retries, limits, and caching with idempotency-designer, rate-limiter-designer, and cache-policy-designer, and plan legacy replacement with strangler-fig-migrator."
keyTakeaways:
  - "Ground design work in the repository: the design-doc command, the ADR skill, and the diagram skill all read the code before proposing or drawing anything."
  - "A design is not finished without rejected alternatives; /write-design-doc, adr-writer, and the system-architect agent each require rejected alternatives and the reason each lost."
  - "Draw one diagram per question (container, sequence, ER, or state), using only the nodes and edges found in code or config."
  - "Retries, traffic spikes, and stale data are design decisions: idempotency keys, rate-limit algorithms, and cache invalidation belong in the design, not in a later patch."
  - "Replace a legacy system through an interception seam and shadow traffic, and delete old code only after it shows zero traffic over a full usage cycle."
faq:
  - q: "What is the best Claude skill for system design?"
    a: "It depends on the stage. Use spec-writer or the /write-design-doc command to frame a change, adr-writer to record the decision, architecture-diagram-generator to draw what exists, and threat-model-builder to stress the design. For cross-cutting behavior, idempotency-designer, rate-limiter-designer, and cache-policy-designer each own one decision. The system-architect agent runs the whole design and returns a document with ADRs."
  - q: "Can Claude Code write an architecture decision record?"
    a: "Yes. adr-writer finds the existing ADR log or starts one in docs/adr/, assigns the next four-digit number, mines the repository for the constraints behind the decision, and writes Status, Context, Decision, Consequences, and Considered Alternatives, with honest negative consequences. It flags any section filled from assumption rather than repository evidence."
  - q: "Can Claude generate architecture diagrams from my codebase?"
    a: "architecture-diagram-generator does. It chooses one view per question (container or component, sequence, ER, or state), reads entry points, HTTP clients, queue names, connection strings, and migrations, and draws only nodes and edges it found. The output is validated Mermaid with a caption saying what the diagram does and does not show."
  - q: "Should I use the system-architect agent or the /write-design-doc command?"
    a: "Use /write-design-doc for one feature or change in an existing codebase: it is read-only, grounds the design in the current code, and returns an RFC with alternatives, trade-offs, a rollout plan with a rollback path, and open questions. Use the system-architect agent for a new system or a structural change, such as a monolith-to-services split, where constraints, failure modes, and the scaling path need working out first."
  - q: "How is this different from the API development skills list?"
    a: "The API development list covers per-endpoint contracts in depth: error envelopes, pagination, CORS, webhooks, GraphQL schemas, and OpenAPI documents. This list stays at the level of the system: how a change is framed, decided, recorded, drawn, attacked, and migrated, plus the three cross-cutting designers that most affect system behavior."
sources:
  - title: "Documenting Architecture Decisions"
    url: "https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions"
    publisher: "Cognitect"
  - title: "Strangler Fig"
    url: "https://martinfowler.com/bliki/StranglerFigApplication.html"
    publisher: "martinfowler.com"
  - title: "About Mermaid"
    url: "https://mermaid.js.org/intro/"
    publisher: "Mermaid"
  - title: "Threat Modeling Cheat Sheet"
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"
    publisher: "OWASP"
  - title: "The Idempotency-Key HTTP Header Field"
    url: "https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/"
    publisher: "IETF"
  - title: "RateLimit header fields for HTTP"
    url: "https://datatracker.ietf.org/doc/draft-ietf-httpapi-ratelimit-headers/"
    publisher: "IETF"
  - title: "GraphQL Cursor Connections Specification"
    url: "https://relay.dev/graphql/connections.htm"
    publisher: "Relay"
related: ["skill:spec-writer", "command:write-design-doc", "skill:adr-writer", "skill:architecture-diagram-generator", "skill:threat-model-builder", "skill:idempotency-designer", "skill:rate-limiter-designer", "skill:cache-policy-designer", "skill:strangler-fig-migrator", "skill:pagination-designer", "skill:graphql-schema-designer", "skill:api-error-contract-designer", "skill:monorepo-boundary-auditor", "agent:system-architect", "agent:database-architect", "agent:api-architect", "agent:spec-implementer", "command:spec", "guide:best-claude-skills-for-api-development", "guide:spec-driven-development", "guide:how-to-install-claude-skills"]
---

The best Claude skills for system design write the artifacts a design review actually reads: a spec or design doc with honest alternatives, a decision record, a diagram drawn from the code, and a threat model. Around those sit the cross-cutting decisions that most often go wrong in production (retries that double-charge, rate limits that fail behind several replicas, caches that serve stale or cross-tenant data) and the plan for replacing what already exists.

Two habits set these apart from asking Claude to "design a system". Most read the repository first, so the design fits the code it changes. And the design-doc, ADR, and architect picks require rejected alternatives with reasons, which is what separates a design from a plan. For per-endpoint contracts such as error envelopes and pagination, the [API development roundup](/guides/skills/best-claude-skills-for-api-development) goes deeper; this list stays at the level of the system.

## The summary table

| Pick | Type | Stage | Main artifact |
| --- | --- | --- | --- |
| [spec-writer](/skills/workflow/spec-writer) | Skill | Frame | Requirements, design, and tasks documents |
| [/write-design-doc](/commands/plan/write-design-doc) | Command | Decide | Design doc or RFC, read-only |
| [adr-writer](/skills/docs/adr-writer) | Skill | Record | Numbered ADR with considered alternatives |
| [architecture-diagram-generator](/skills/docs/architecture-diagram-generator) | Skill | Explain | Mermaid diagram with a scope caption |
| [threat-model-builder](/skills/security/threat-model-builder) | Skill | Stress | Data-flow diagram, STRIDE table, accepted risks |
| [idempotency-designer](/skills/api/idempotency-designer) | Skill | Cross-cutting | Key scheme, atomic dedup, retention policy |
| [rate-limiter-designer](/skills/api/rate-limiter-designer) | Skill | Cross-cutting | Algorithm, key, tier limits, 429 contract |
| [cache-policy-designer](/skills/performance/cache-policy-designer) | Skill | Cross-cutting | Layer-by-layer cache policy |
| [strangler-fig-migrator](/skills/refactor/strangler-fig-migrator) | Skill | Evolve | Seam design and slice-by-slice migration plan |

## 1. spec-writer: requirements, design, and tasks before code

[spec-writer](/skills/workflow/spec-writer) writes a requirements document with EARS acceptance criteria, a design document, and a task list, in whichever layout the repository already uses: [Kiro](/tools/kiro)'s requirements.md, design.md, and tasks.md, or [Spec Kit](/tools/spec-kit)'s spec.md, plan.md, and tasks.md. The split is useful for system design because it forces agreement on what the change must do before anyone decides how, and it ends in a task list rather than a block of prose. The [/spec](/commands/plan/spec) command drafts the same files from a one-line feature description and stops for your review; once the spec is approved, the [spec-implementer](/agents/core-development/spec-implementer) agent builds it one task at a time, checking off a task only when its acceptance criteria pass.

The [spec-driven development guide](/guides/workflow/spec-driven-development) covers the workflow, the [spec-driven development](/glossary/spec-driven-development) glossary entry defines it, and the [spec-driven tools roundup](/guides/comparisons/best-spec-driven-development-tools-2026) compares the tools.

## 2. /write-design-doc: an RFC grounded in the code

[/write-design-doc](/commands/plan/write-design-doc) is read-only: it does not modify the repository, run migrations, or scaffold code, and if you give it no subject it asks one question instead of inventing a problem. It frames what is broken or missing, who is affected, and what is out of scope, then maps the real code: `README.md`, the manifest, and `CLAUDE.md` for conventions, a search for every module, route, model, and config the change touches, and a full read of the closest existing subsystem to decide whether the design follows that pattern or departs from it.

The doc it returns has context, goals and non-goals, the proposed design, alternatives each marked "Rejected because", trade-offs and risks, a rollout plan with a rollback path, an observability section (the [observability skills](/guides/skills/best-claude-skills-for-observability) fill it in), and open questions. Its own rule is the useful one: a design doc without honest alternatives is a plan in disguise.

## 3. adr-writer: record the decision and its costs

[adr-writer](/skills/docs/adr-writer) locates the existing log (`docs/adr/`, `docs/decisions/`, and similar), reads a record or two to match the local format, and assigns the next zero-padded number. It mines the repository for the constraints behind the decision (manifests, wired-up libraries, `docker-compose.yml`, Terraform files, CI config) rather than writing generic pros and cons, then writes Michael Nygard's sections, Status, Context, Decision, and Consequences, plus a Considered Alternatives section listing each rejected option and why it lost.

Two rules keep the log useful. Consequences must include the negatives you are accepting, because a record with only upsides is a sales pitch. And a merged ADR is never edited: a new record supersedes it, and the old one's status changes to point at the replacement. The skill reports any section it filled from assumption so you can correct it before merging.

## 4. architecture-diagram-generator: draw what exists

[architecture-diagram-generator](/skills/docs/architecture-diagram-generator) picks the view before drawing: container or component for "who calls whom", sequence for one request over time, ER for the data model, and state for an entity's lifecycle. If a question spans two of those, it draws two small diagrams. It finds evidence first, from entry points, `docker-compose.yml` and manifests, HTTP clients, queue names, `*_URL` environment variables, ORM models, and migrations, and a node or edge goes in only if it was found in code or config.

It splits a container view past about a dozen nodes into a map and a zoom-in, validates the Mermaid so GitHub does not render an error box, and captions each diagram with what it does and does not show. Use it to document the current system before proposing changes to it.

## 5. threat-model-builder: stress the design before shipping

[threat-model-builder](/skills/security/threat-model-builder) works from a design, before code exists if need be. It draws a data-flow diagram of external entities, processes, data stores, and labeled flows, then marks trust boundaries (internet to API, API to database, tenant to tenant, user input to an interpreter) and numbers each crossing. STRIDE is applied only at those crossings, and each threat is written as a concrete attack, such as a `GET /users/:id` that returns any tenant's record, rather than a category.

Threats are scored on likelihood and impact and sorted into priorities, mitigations are specific enough to become work items, and every threat not mitigated now is recorded as accepted, with a rationale and an owner, or deferred, with the trigger that reopens it. Its note on where to start is practical: authorization and information disclosure cause more real breaches than exotic failures, so check those two at every boundary first.

## 6. idempotency-designer: retries that cannot double-charge

[idempotency-designer](/skills/api/idempotency-designer) handles the case where a timeout means the client does not know whether the operation ran. The client mints one key per logical operation and sends it in an `Idempotency-Key` header; the server scopes it as `(account, endpoint, key)` and claims it in a single atomic step, a unique-constraint insert or a conditional write, before doing the work. Check-then-act is called out as a race that two concurrent retries win together.

The completed response is stored with the key, ideally in the same transaction as the side effect, and replayed on repeats. A retry that arrives mid-flight gets a `409` with `Retry-After`, downstream calls such as a payment processor get a derived key of their own, and keys expire on a deliberate TTL. The [idempotency keys guide](/guides/api/idempotency-keys-api-design) covers the pattern in full.

## 7. rate-limiter-designer: limits that hold behind replicas

[rate-limiter-designer](/skills/api/rate-limiter-designer) chooses the algorithm from the traffic shape: a token bucket for legitimate bursts, a sliding-window counter for smooth enforcement in front of a fragile dependency, and a fixed window only when simplicity beats correctness, since it can admit twice the limit across a window boundary. It picks the limiting key per route class (IP for unauthenticated traffic, API key or user once authenticated) and writes the limits per tier as a table.

The design-level warning is about state. An in-memory counter behind N replicas enforces roughly N times the limit, so the counter lives in shared storage with an atomic increment or a single Lua script. Responses carry `429` with `Retry-After` and `RateLimit-*` headers, and fail-open versus fail-closed is chosen deliberately for when the store is unreachable.

## 8. cache-policy-designer: caching as a correctness contract

[cache-policy-designer](/skills/performance/cache-policy-designer) treats a cache as a correctness decision first. It inventories the object (source, readers, writers, sensitivity, cost of serving it stale), maps every layer from browser and CDN to application and database caches, and defines the full key, including tenant and authorization class. Freshness comes from the business tolerance, not a round number, and invalidation is tied to every write or event that changes the value.

It adds stampede controls, outage behavior, and privacy rules, and it will not drop authorization from a cache key to raise the hit rate: serving one user's data to another is a security failure, not a tuning trade-off.

## 9. strangler-fig-migrator: replace the old system in slices

[strangler-fig-migrator](/skills/refactor/strangler-fig-migrator) plans the evolution half of system design: replacing a load-bearing legacy module or service without a big-bang rewrite. Its first deliverable is the interception seam, a facade, proxy route, or flag that can send each call to old or new code and be flipped at runtime. If callers reach into the legacy code in many ways, building that facade comes before any new implementation.

It then orders capability slices from smallest and safest, shadow-runs new code against old with a concrete definition of equivalence, and ramps traffic with rollback one flip away. Legacy code is deleted only after a full usage cycle on the new path with zero calls to the old one. The [refactoring roundup](/guides/skills/best-claude-skills-for-refactoring) covers its code-level neighbors.

## API contract skills for designs that expose an API

Three API skills fill in the contract once the system design is settled. [pagination-designer](/skills/api/pagination-designer) chooses keyset or offset paging, appends a unique tiebreaker so no row is skipped or repeated, makes the cursor opaque, and names the composite index the sort needs. [graphql-schema-designer](/skills/api/graphql-schema-designer) models the graph around domain types rather than endpoints, sets nullability field by field, uses Relay connections for unbounded lists, and lists every field that needs a DataLoader. [api-error-contract-designer](/skills/api/api-error-contract-designer) defines one error envelope with stable machine codes, safe messages, field errors, and request IDs, backed by contract tests.

## Agents and commands that pair with them

The [system-architect](/agents/core-development/system-architect) agent runs a full design: it writes down quantified constraints first and asks when they are missing, maps the domain and data flow, chooses components and names the alternative rejected for each, walks failure modes, states the first expected bottleneck, and returns a design document with a Mermaid diagram, a trade-offs table, ADRs, and open questions. It produces design artifacts, not code.

Two specialists take narrower slices. The [database-architect](/agents/core-development/database-architect) agent designs storage from the access patterns, chooses between relational, document, key-value, wide-column, and graph models, and includes a table mapping each access pattern to the schema element and index that serve it. The [api-architect](/agents/core-development/api-architect) agent models resources, chooses REST, GraphQL, or RPC with a stated reason, and writes OpenAPI 3.1 or SDL with versioning and deprecation plans. Once the design is built, [monorepo-boundary-auditor](/skills/workflow/monorepo-boundary-auditor) checks whether the code still respects the package boundaries and dependency direction the design drew.

## Recommended system design stacks

For design reviews on an existing codebase:

```bash
npx agentscamp add commands/write-design-doc
npx agentscamp add skills/adr-writer
npx agentscamp add skills/architecture-diagram-generator
npx agentscamp add skills/threat-model-builder
npx agentscamp add agents/system-architect
```

For a backend that takes payments, public traffic, or heavy reads, add the cross-cutting designers:

```bash
npx agentscamp add skills/idempotency-designer
npx agentscamp add skills/rate-limiter-designer
npx agentscamp add skills/cache-policy-designer
```

Each command installs into the current project's `.claude/` directory; add `-g` for `~/.claude/`. Manual copying, plugins, and team distribution are covered in [how to install Claude skills](/guides/skills/how-to-install-claude-skills).

Whichever you install, ask for the evidence: the file paths a design doc cites, the rejected alternatives, and the assumptions the ADR flagged.

## Continue exploring

- [10 Best Claude Skills for API Development](/guides/skills/best-claude-skills-for-api-development) — Error contracts, idempotency, pagination, rate limits, webhooks, CORS, GraphQL, and OpenAPI.
- [Spec-Driven Development with AI Agents](/guides/workflow/spec-driven-development) — Writing specs an agent can build from, and keeping code tied to them.
- [10 Best Claude Skills for Refactoring](/guides/skills/best-claude-skills-for-refactoring) — Module extraction, import cycles, dead code, upgrades, and strangler-fig migrations.
- [7 Best Claude Skills for Documentation](/guides/skills/best-claude-skills-for-documentation) — READMEs, OpenAPI docs, runbooks, onboarding guides, ADRs, and diagrams.
- [How to install Claude skills](/guides/skills/how-to-install-claude-skills) — Every install path: manual copy, the agentscamp CLI, GitHub repos, plugins, and team distribution.
