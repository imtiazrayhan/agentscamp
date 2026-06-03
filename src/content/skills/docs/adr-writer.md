---
name: "adr-writer"
description: "Write an Architecture Decision Record capturing a decision the user describes, in Michael Nygard ADR format (Status, Context, Decision, Consequences) with an added Considered Alternatives section. Use when recording a significant architectural or technology choice."
allowed-tools: "Read, Grep, Glob, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["architecture"]
related: ["system-architect", "documentation-engineer"]
featured: false
---

Turn an architectural decision into a durable, reviewable record. The skill takes the decision the user describes, gathers the real constraints that shaped it from the repository, and writes a Nygard-style Architecture Decision Record — context and problem, the decision and its status, the consequences, and the alternatives that were considered and rejected. The result is a numbered, immutable document that explains *why* a choice was made to whoever reads the code in two years.

## When to use this skill

- You made a consequential, hard-to-reverse choice (datastore, framework, auth model, sync vs. async, monorepo vs. polyrepo) and want the reasoning captured before it's forgotten.
- You're starting an ADR log in a repo that has none, or adding the next record to an existing `docs/adr/` directory.
- A pull request changes architecture and a reviewer asked "where is this written down?"
- You're revisiting an old decision and need to supersede it with a new record instead of silently editing history.

> [!NOTE]
> An ADR is immutable once merged. You don't edit a decision to change it — you write a new ADR that supersedes it and flip the old one's status to `Superseded by ADR-NNNN`. Editing the substance of a merged record erases the history the log exists to preserve.

## Instructions

1. **Locate the ADR log.** Search for an existing directory — `docs/adr/`, `docs/decisions/`, `doc/adr/`, or `adr/`. Read one or two existing records to match the local heading set, status vocabulary, and front-matter (some logs use `MADR`, some `Nygard`, some carry a `date:`/`deciders:` block). If no log exists, default to `docs/adr/`.
2. **Assign the number and slug.** Find the highest existing `NNNN-*.md` and increment it, zero-padded to four digits (`0001`, `0002`, ...). Build the filename as `docs/adr/NNNN-kebab-title.md` from a short, decision-focused title (`0007-use-postgres-for-primary-store.md`). Never reuse or renumber an existing file.
3. **Detect the real constraints — don't invent them.** Mine the repo for evidence that shaped the decision instead of writing generic pros and cons:
   - Read `package.json` / `requirements.txt` / `go.mod` / `Cargo.toml` for the current stack and what's already a dependency.
   - Grep for the systems in play (`grep -ri "mongoose\|prisma\|pg\|sqlalchemy"`) to see what's actually wired up.
   - Check `docker-compose.yml`, `*.tf`, CI config, and any `README`/`CLAUDE.md` for deployment targets, scale signals, and stated team conventions.
   - Note the requirement that forces the decision (transactions, relational queries, a managed offering already in the cloud account, an existing team skillset).
4. **Write the record.** Use the Nygard section order: `# NNNN. Title`, then `## Status`, `## Context`, `## Decision`, `## Consequences` (split into *positive* and *negative* — be honest about the costs you're accepting), and `## Considered Alternatives` (an added section not in Nygard's original — list each rejected option with the specific reason it lost). Write in past/decided tense, name concrete tradeoffs, and cite the constraints from step 3 rather than restating textbook definitions.
5. **Set the status deliberately.** Use `Proposed` for an open decision under review, `Accepted` once it's agreed, `Deprecated` for an outdated record, or `Superseded by ADR-NNNN` when replaced. If this record retires an older one, update that file's status line to point here.
6. **Verify and report.** Confirm the filename number is unique, the title slug matches the heading, and every alternative has a stated reason for rejection. List the file you wrote, and flag any section you filled from assumption rather than repo evidence so the user can correct it before merging.

> [!WARNING]
> Don't pad the Consequences with only upsides. An ADR that lists no negative consequences is a sales pitch, not a decision record — the reviewer can't weigh a tradeoff you hid. Name the lock-in, the operational cost, or the capability you gave up.

## Examples

For the decision "choose Postgres over MongoDB for the primary datastore," the skill detects no `mongoose`/`prisma` is wired yet, sees a managed Postgres already in the cloud account, and writes `docs/adr/0001-use-postgres-as-primary-datastore.md`:

```markdown
# 0001. Use PostgreSQL as the primary datastore

## Status

Accepted — 2026-06-03

## Context

The billing and account services need ACID transactions across orders,
invoices, and ledger entries, and most read paths join three or more
entities. Our data is strongly relational with a stable schema. The team
already operates a managed Postgres instance in the existing cloud account
and knows SQL; no one has run MongoDB in production here.

## Decision

We will use PostgreSQL 16 as the primary datastore for all transactional
services, accessed through a single connection pool per service. Document-
shaped, schemaless data (audit blobs, webhook payloads) will live in
`jsonb` columns rather than a separate document database.

## Consequences

**Positive**

- Multi-row transactions and foreign keys enforce invariants in the
  database instead of in application code.
- One datastore to operate, back up, and monitor — reuses the managed
  instance and the team's existing SQL skills.
- `jsonb` covers the few semi-structured cases without a second system.

**Negative**

- Horizontal write scaling requires deliberate work (partitioning, read
  replicas) if write volume outgrows a single primary.
- Schema changes need migrations and review; less forgiving than a
  schemaless store during rapid early iteration.

## Considered Alternatives

- **MongoDB** — rejected: our access patterns are relational and need
  cross-document transactions, which fight against its document model and
  would push join logic into the application.
- **Postgres + a separate document DB** — rejected: doubles operational
  surface for a small amount of semi-structured data that `jsonb` handles.
- **SQLite** — rejected: no managed multi-writer story for our concurrency
  and availability needs.
```

After writing, report the path and note any section (e.g. projected write volume) that came from an assumption rather than a measured constraint, so the user can verify it before merging.
