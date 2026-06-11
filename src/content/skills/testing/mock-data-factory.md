---
name: "mock-data-factory"
description: "Generate a typed mock/fixture factory for a given type, interface, or schema, inferring believable values from field names and types. Use when tests or local dev need realistic, type-safe sample data with per-field overrides."
date: 2026-06-03
allowed-tools: "Read, Grep, Glob, Write, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["review-qa"]
related: ["test-scaffolder", "test-engineer"]
featured: false
summary: "A skill that generates a typed mock-data factory for a type, interface, or schema: it reads the definition, infers believable values from field names and types (email, UUID, recent ISO date), matches the project's existing fixture conventions and faker library, and emits a build() returning a complete valid object with per-field overrides."
---

Generate a type-safe factory that produces realistic mock data for a named type, interface, or schema. The skill reads the target definition, infers each field's semantics from its name and type (an `email` becomes a valid address, `createdAt` a recent ISO date, `id` a UUID, `count` a small non-negative integer), and emits a `build()` factory that returns a complete, valid object while accepting a partial override for any field. It matches the project's existing fixture conventions instead of inventing a new one.

## When to use this skill

- A test or story needs a valid instance of a type and you don't want to hand-write every field.
- You keep copy-pasting and tweaking the same object literal across specs — centralize it in one factory.
- Local dev or a seed script needs believable sample records (users, orders, events) rather than `"foo"` / `123` placeholders.

> [!NOTE]
> The factory produces *plausible*, schema-valid data — not data that satisfies your business invariants. If a test depends on a specific relationship (e.g. `endsAt` after `startsAt`, or a total matching its line items), pass explicit overrides rather than trusting the defaults.

## Instructions

1. **Locate the target.** Read the type the user named — a TypeScript `interface`/`type`, a Zod/Yup schema, a Prisma model, a Python dataclass/Pydantic model. Resolve every field, its type, optionality, and any nested or referenced types so the factory returns a fully-populated object.
2. **Detect the project's conventions.** Inspect the repo before writing — do not guess:
   - Is a faker library already a dependency (`@faker-js/faker`, `faker`, `factory.ts`, `fishery`, `factory_boy`)? Reuse it. If none exists, generate deterministic values with plain code rather than adding a dependency.
   - Mirror existing factory/fixture file location and naming (`*.factory.ts`, `factories/`, `fixtures/`, `conftest.py`).
   - Match the override signature already in use (e.g. `build(overrides?: Partial<T>)` vs. a `fishery` `params` object).
3. **Infer field semantics from name + type.** Map fields to believable generators: `email` → valid address, `*Id`/`id`/`uuid` → UUID, `*At`/`*Date` → recent ISO timestamp, `name`/`firstName` → a real-looking name, `url`/`avatar` → a URL, `price`/`amount` → a positive decimal, `count`/`quantity` → a small int, `isActive`/`enabled` → boolean. For enums/unions, pick the first valid member. Fall back to the type's primitive default only when the name carries no signal.
4. **Write the factory.** Emit a `build()` that returns a complete object with sensible defaults, deep-merges a `Partial<T>` override, and is typed so the return value is the full `T`. Make defaults deterministic (or seedable) so snapshots stay stable. Populate nested objects via their own factories where they exist. Leave a `// TODO` only where a value needs genuine human judgment (a real foreign key, a domain-specific constraint).
5. **Verify it type-checks and runs.** Type-check the file (`tsc --noEmit`, or import it in a scratch test) and instantiate `build()` plus `build({ ...override })` to confirm both produce valid instances and the override actually wins.
6. **Report.** Summarize the fields and the generator chosen for each, and flag gaps — fields where the inferred value may violate a business rule, unresolved referenced types, or invariants the caller must enforce via overrides.

> [!WARNING]
> Keep generated values clearly synthetic (example.com emails, obviously fake names) and never commit real PII or production-shaped secrets into fixtures. A factory checked into the repo is shared sample data, not a place for live tokens or customer records.

## Examples

Given a `User` type:

```ts
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "member" | "guest";
  isActive: boolean;
  createdAt: string; // ISO 8601
}
```

The skill detects `@faker-js/faker` is already installed and writes `src/test/factories/user.factory.ts`:

```ts
import { faker } from "@faker-js/faker";
import type { User } from "../../types/user";

export function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email().toLowerCase(),
    displayName: faker.person.fullName(),
    role: "member",
    isActive: true,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    ...overrides,
  };
}
```

Use it in a test, overriding only what the case cares about:

```ts
const admin = buildUser({ role: "admin", email: "ada@example.com" });
expect(canDeleteWorkspace(admin)).toBe(true);
```

Seed the faker instance (`faker.seed(1)`) when you need byte-stable output for snapshots.
