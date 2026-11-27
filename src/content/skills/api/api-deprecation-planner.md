---
name: "api-deprecation-planner"
title: "API Deprecation Planner"
description: "Plan the retirement of an API endpoint, field, event, tool, or version without surprising active consumers. Use when replacing an interface, removing legacy behavior, publishing a sunset, migrating internal or external clients, or deciding whether observed traffic is safe to turn off."
allowed-tools: "Read, Grep, Glob, Bash"
user-invocable: true
version: "1.0.0"
color: "yellow"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["architecture", "devops-infra"]
audience: ["developers"]
related: ["guide:best-claude-skills-for-release-management", "skill:openapi-doc-writer", "skill:contract-test-designer", "skill:semver-advisor", "skill:changelog-from-prs", "skill:strangler-fig-migrator"]
featured: true
summary: "Plans API retirement from a verified consumer inventory through replacement parity, announcements, telemetry, migration support, compatibility gates, sunset criteria, shutdown, and cleanup. It treats zero recent traffic as evidence to investigate—not proof that unobserved or infrequent clients do not exist."
faq:
  - q: "How long should an API deprecation window be?"
    a: "Set it from the published compatibility policy, consumer release cadence, contract obligations, and the slowest legitimate usage cycle. A monthly or quarterly client cannot be judged from one quiet week."
  - q: "Is zero traffic enough to delete an endpoint?"
    a: "Not by itself. Confirm telemetry coverage, long-tail schedules, disabled clients, alternate regions, cached clients, and contractual support. Then use explicit owner sign-off and a reversible disablement stage."
---

Retire an interface through measured migration, not a deletion date alone. Produce the plan and the supporting evidence; do not remove routes, fields, or documentation unless the user asks for the change itself.

## Workflow

1. **Define the retiring surface.** Identify endpoints, methods, fields, event versions, SDK methods, agent tools, error codes, authentication modes, and undocumented behaviors consumers may rely on (default sort order, null versus absent fields, pagination limits, error message text that clients parse). List each one by its exact identifier, such as `GET /v1/orders/{id}` or `Order.legacyStatus`.

2. **Inventory consumers.** Combine sources, because each has blind spots:

   | Source | Finds | Misses |
   |---|---|---|
   | Repository search for the path, field, or SDK method (`grep -rn "/v1/orders"` across internal repos) | internal callers, including dormant ones | external clients, dynamically built URLs |
   | Gateway or access logs grouped by API key, client ID, or user agent | who actually calls, and how often | clients quieter than the log window, regions not logged |
   | SDK version telemetry and package download data | which client versions are still in use | hand-rolled HTTP clients |
   | Support tickets, partner contracts, integration docs | commitments and named dependents | anyone who never wrote in |

   State the observation window and why it is long enough: it must cover the slowest legitimate cycle (month-end, quarterly, annual renewal jobs). Give every consumer a row with an owner, contact, call volume, and last-seen date.

3. **Verify the replacement.** Build a parity table with one row per behavior from step 1: old behavior, replacement, and status (`same`, `different` with the difference stated, or `missing`). Include permissions, rate limits, latency, error codes, and pagination. Any `missing` row is either a migration prerequisite or a documented, announced loss.

4. **Set policy and timeline.** Apply versioning commitments, contractual notice, client release cadence, and rare usage cycles. Define dated milestones with owners: announcement, runtime warnings on, new-consumer freeze (no new keys may call the old surface), brownouts, disablement, and deletion. Mobile and on-premises clients need a window at least as long as their upgrade cycle.

5. **Make deprecation observable.** Add a usage metric labeled by consumer and by retiring surface, a dashboard, and an alert on traffic from a consumer marked as migrated. Signal it in-band so clients and tooling can detect it:

   ```http
   Deprecation: @1796083200
   Sunset: Wed, 31 Mar 2027 00:00:00 GMT
   Link: <https://api.example.com/docs/migrate-orders-v2>; rel="deprecation"; type="text/html"
   ```

   `Deprecation` (RFC 9745) carries the date the surface became or becomes deprecated as a Unix timestamp prefixed with `@`. `Sunset` (RFC 8594) carries the date it stops responding, as an HTTP date. In specs, mark the surface too: `deprecated: true` in OpenAPI, `@deprecated(reason: "Use totalCents")` in GraphQL, and a deprecation annotation in each SDK that names the replacement.

6. **Support migration.** Provide side-by-side request and response examples, SDK or codemod support, test environments, compatibility checks, and an escalation path. A consumer should be able to finish from the migration guide alone, and should be told what to do, not only that the old interface will disappear.

7. **Define exit criteria.** Write them as checks with numbers the team agrees to before the window starts. A reasonable starting point to adjust:

   - every `missing` parity row is closed or formally accepted
   - every consumer in the matrix is `migrated`, `acknowledged with date`, or `unreachable after N documented contact attempts`
   - traffic on the old surface is zero from known consumers, and unattributed traffic is below an agreed floor, for one full slowest-cycle window
   - contract tests pass against the replacement
   - re-enabling the old surface has been tested and takes minutes
   - a named approver signs off

8. **Disable reversibly before deletion.** Run scheduled brownouts first: short, announced windows where the old surface returns an error that names the replacement, increasing in length (for example 15 minutes, then 2 hours, then a day). Brownouts surface the consumers telemetry missed while recovery is still a flag flip. Then disable behind a feature flag or route rule, returning `410 Gone` with a body that links the migration guide. Observe for a full cycle before removing code, data, documentation, and operational dependencies.

> [!WARNING]
> Telemetry cannot prove absence when client identification, regions, long-running jobs, or rare workflows are missing. Document the coverage boundary before interpreting zero traffic.

## Output

Produce a consumer matrix, replacement gap analysis, milestone timeline, communication plan, telemetry design, migration aids, exit checklist, reversible shutdown procedure, rollback trigger, and final cleanup list.

Lead with the consumer matrix and timeline, in this shape (fictional):

```markdown
## Retiring: GET /v1/orders/{id}  ->  GET /v2/orders/{id}
Observation window: 2026-08-01 to 2026-11-15 (covers quarter-end). Blind spots: EU gateway logs keep 30 days only.

| Consumer | Owner | Calls / 30d | Last seen | Status | Risk |
|---|---|---|---|---|---|
| web-app | Storefront team | 4.1M | today | migrating, PR open | low |
| billing-export (quarterly job) | Finance eng | 312 | 2026-10-01 | not started | high: runs once a quarter |
| Partner "Acme Logistics" | Partnerships | 88k | today | notified, no reply | high: 90-day contractual notice |
| unattributed (no API key header) | none | 1.2k | yesterday | unknown | investigate before brownout |

| Milestone | Date | Owner | Gate |
|---|---|---|---|
| Announce + headers on | 2026-12-01 | API team | migration guide published |
| Freeze new consumers | 2026-12-15 | API team | key allowlist enforced |
| Brownout 1 (15 min) | 2027-02-02 | API team | all high-risk consumers acknowledged |
| Disable (410, flag) | 2027-03-31 | API team | exit checklist complete |
| Delete code and docs | 2027-05-01 | API team | one quarter-end observed with zero traffic |

Rollback trigger: any known consumer reports breakage during a brownout or after disablement; re-enable via flag `orders_v1_enabled`.
```
