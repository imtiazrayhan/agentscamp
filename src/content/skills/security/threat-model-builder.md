---
name: "threat-model-builder"
title: "Threat Model Builder"
description: "Build a practical threat model for a feature or system using STRIDE — diagram the data flow, mark trust boundaries, enumerate concrete threats where data crosses them, and prioritize by likelihood × impact so security is reasoned about before shipping instead of bolted on after. Use when designing a feature that touches auth, money, or sensitive data, running a security design review, or hardening before a launch."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-06-17
topics: ["review-qa"]
related: ["auth-flow-reviewer", "contract-test-designer", "dependency-audit"]
featured: false
summary: "Security bolted on after design is the expensive kind. This skill makes threat modeling concrete: draw the data flow, mark where data crosses trust boundaries, walk STRIDE at each crossing, and rank threats by likelihood × impact so you mitigate the few that matter and accept the rest in writing."
faq:
  - q: "Do I need the running system, or just the design?"
    a: "Just the design — a description, an architecture doc, or the code paths. Threat modeling is most valuable before code exists. If code is present, use it to confirm where trust boundaries actually sit versus where the design assumed they were."
  - q: "STRIDE or attack trees or PASTA?"
    a: "STRIDE per element, anchored on trust boundaries, is the highest-leverage default for a feature-sized scope: it is exhaustive enough to catch the common classes and cheap enough to actually finish. Reach for attack trees only when modeling one specific high-value asset in depth."
---

Most threat models fail in one of two ways: they list every conceivable attack until the team is paralyzed and ships nothing, or they skip straight to "we use HTTPS and JWTs" without ever asking where an attacker actually sits. This skill does neither. It forces a data-flow diagram with explicit **trust boundaries**, walks **STRIDE** only where data crosses those boundaries, and ranks every threat by **likelihood × impact** so you mitigate the handful that matter and consciously accept the rest. The output is a diagram, a threat table, and a signed-off list of residual risk — not a vibe.

## When to use this skill
- Designing a feature that handles authentication, authorization, money/payments, PII, or anything multi-tenant.
- Running a security design review before a launch, or as a gate on a new external-facing endpoint or integration.
- A pen-test or incident keeps surfacing the same class of bug and you need to find the whole class, not the one instance.
- Adding a new external entity (third-party webhook, partner API, file upload from users) that data now flows to or from.

## Instructions
1. **Draw the system as a data-flow first — not a box diagram.** Identify four element types: **external entities** (users, partner services, the browser), **processes** (your API, workers, lambdas), **data stores** (DB, cache, queue, blob storage), and the **data flows** (arrows) between them, each labeled with what it carries (`login creds`, `session token`, `tenant_id`, `payment amount`). Express it as Mermaid `flowchart`. If you cannot name what flows on an arrow, you do not understand the system well enough to model it yet.
2. **Mark trust boundaries — these are the whole point.** A trust boundary is any place data crosses from less-trusted to more-trusted, or between principals that should not see each other's data: internet → your API, your API → DB, unauthenticated → authenticated, tenant A → tenant B, your code → a third-party SDK, user input → a SQL/shell/template interpreter. Draw them as dashed `subgraph` borders. Number each crossing — those numbers are the only places you do STRIDE.
3. **Walk STRIDE at each boundary crossing, and enumerate CONCRETE threats.** For each element or flow that crosses a boundary, ask all six and write down the specific attack, not the category:
   - **S — Spoofing** (authentication): "Attacker replays a captured session cookie because tokens have no `exp`." Not "ensure authentication."
   - **T — Tampering** (integrity): "Client sends `amount: -100` and the refund flow trusts it." 
   - **R — Repudiation** (audit): "A user disputes a transfer and there is no signed, append-only log tying the action to their identity."
   - **I — Information disclosure** (confidentiality): "`GET /users/:id` returns any id without an ownership check — IDOR across tenants."
   - **D — Denial of service** (availability): "The export endpoint runs an unbounded query; one request pins the DB."
   - **E — Elevation of privilege** (authorization): "A `viewer` role can call the admin mutation because authz is checked in the UI, not the API."
4. **Rate each threat by likelihood × impact and SORT — you cannot fix everything.** Score likelihood (how reachable/easy: High/Med/Low) and impact (blast radius if it lands: High/Med/Low) independently, then derive priority (e.g. High×High = P0, anything with a Low dimension = P3). Sort the table by priority. An unprioritized list of forty threats gets you forty half-done mitigations; a ranked list gets the top five done properly.
5. **Propose a specific, falsifiable mitigation per high-priority threat.** "Validate input" is not a mitigation. "Reject `amount` server-side unless it matches the stored invoice total; add a contract test" is. Tie each mitigation to where it lives (which middleware, which check, which migration) so it becomes a work item, not an aspiration.
6. **Write down the residual risk you are accepting — explicitly.** For every threat you are NOT mitigating now, record it as *accepted* (with a one-line rationale and who accepted it) or *deferred* (with the trigger that reopens it: "revisit when we add a second tenant"). Silent acceptance is how a known risk becomes a postmortem line item.

> [!WARNING]
> A threat model with no trust boundaries marked is just a feature list with extra steps. The boundaries are where the threats live — if you skipped step 2, the STRIDE walk in step 3 has nothing to anchor to and will produce generic mush.

> [!NOTE]
> The two highest-yield STRIDE letters for typical web/SaaS features are **E (authz)** and **I (info disclosure)** — IDOR and missing object-level authorization cause more real breaches than exotic crypto failures. If time is short, do those two at every boundary first.

## Output
A self-contained threat model document with three parts:

1. **Data-flow diagram** (Mermaid `flowchart`) with external entities, processes, stores, labeled flows, and dashed trust-boundary subgraphs with numbered crossings.
2. **STRIDE threat table**, sorted by priority:

   | # | Threat (concrete) | Element / flow | STRIDE | Likelihood | Impact | Priority | Mitigation (specific, where it lives) |
   |---|-------------------|----------------|--------|-----------|--------|----------|----------------------------------------|
   | 1 | `GET /users/:id` returns any tenant's record | API → DB read | I / E | High | High | P0 | Add ownership check in `requireOwner` middleware; contract test for cross-tenant 403 |

3. **Accepted residual risks** — a short list of threats not being mitigated now, each tagged *accepted* (rationale + owner) or *deferred* (reopen trigger), so the decision is on the record rather than implied.
