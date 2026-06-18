---
name: "rbac-designer"
description: "Design the authorization model itself — fine-grained permissions on resources composed into roles, with the right amount of resource/tenant scoping — instead of scattering role-name checks through handlers. Use when building multi-user or multi-tenant authorization, when `if user.isAdmin` checks are sprawling across the codebase, or when 'who can do what' needs a real model rather than ad-hoc gates."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "RBAC Designer"
date: 2026-06-17
topics: ["architecture"]
related: ["auth-flow-reviewer", "threat-model-builder"]
featured: false
summary: "Designs the authorization model itself, not a review. Models permissions as fine-grained resource:action capabilities (invoice:approve), composes them into roles, picks granularity (pure RBAC, scoped RBAC, or ReBAC/ABAC), and centralizes enforcement so code asks \"can this actor do this on this resource?\" not \"is this an admin?\". Scopes every check to the tenant to stop IDOR."
faq:
  - q: "When do I actually need ABAC/ReBAC instead of plain roles?"
    a: "Only when permission depends on the specific object's relationship to the actor — 'the owner of THIS document', 'a member of THIS project', 'the assignee of THIS ticket'. If your rules are 'editors can edit anything in their org' the answer is scoped RBAC, and reaching for a full policy engine is over-engineering. Use ReBAC/ABAC for the per-object cases and let scoped RBAC cover the rest; most apps are mostly the latter."
  - q: "We already check roles everywhere — is migrating to permissions worth it?"
    a: "Yes, because role-name checks rot: every new role or rule means hunting `isAdmin`/`role ===` sites across handlers, and the one you miss is the security hole. Permissions let you change a role's grant in one place (the role→permission map) without touching call sites, and let you grep the single enforcement layer to prove coverage."
---

Design the authorization model — the permission system itself — rather than reviewing one that exists. The job is to decide *what capabilities exist*, *how they compose into roles*, *how far each check is scoped*, and *where enforcement lives* — so that application code asks one question, **"can this actor perform this action on this resource?"**, instead of the brittle `if (user.isAdmin)` checks that breed across handlers and rot the moment requirements change. The skill reads the codebase to find the resources, actions, and existing role checks, then produces a concrete permission/role model, a single central enforcement design, and explicit decisions on hierarchy, default-deny, tenant isolation, and audit.

## When to use this skill

- Building authorization for a multi-user or multi-tenant (SaaS) product, where access depends on both *who* the actor is and *which org/project/resource* they are touching.
- When ad-hoc role checks — `if (user.role === 'admin')`, `user.isManager`, `@RequireRole("OWNER")` — are sprawling through controllers and every new rule means a code hunt.
- When "who can do what" is tribal knowledge with no single model, or a customer/security review asks you to document the permission matrix.
- Before adding roles, a permissions UI, custom roles, or an admin-impersonation feature on top of a system that hardcodes role names.

> [!WARNING]
> Scattering role-name checks (`isAdmin`, `role === "manager"`) through the codebase instead of checking granular permissions makes every permission change a risky code hunt and guarantees missed spots — the endpoint you forget is the privilege-escalation bug. Model permissions, compose them into roles, and enforce in one place so a grant change is one edit and coverage is greppable.

## Instructions

1. **Inventory resources and actions before inventing roles.** Glob the routers, controllers, and data models (`**/routes/**`, `**/*controller*`, `**/models/**`, `**/entities/**`) and list every *resource* (invoice, project, user, billing-account) and every *action* on it (read, create, update, delete, approve, export, invite). Permissions are these `resource:action` pairs — `invoice:read`, `invoice:approve`, `member:invite`. Name them after the capability, not the role, so the same permission can be granted to many roles. This list is the vocabulary; everything else composes it.
2. **Compose permissions into roles — never the reverse.** Define roles as *named sets of permissions* (`viewer = {invoice:read, project:read}`, `approver = viewer ∪ {invoice:approve}`). Code checks `can(actor, "invoice:approve", invoice)`, never `actor.role === "approver"`. This is the whole point: when product says "approvers can now export", you edit one role→permission map, not every handler. Grep the codebase for existing `role ===`, `isAdmin`, `hasRole`, `@Role`, `@PreAuthorize` sites and list each as a call site to migrate to a permission check.
3. **Pick the granularity you actually need — and stop there.** Choose explicitly among three:
   - **Pure RBAC** (roles → permissions, global) — fine for single-tenant internal tools where a role means the same thing everywhere.
   - **Scoped RBAC** (role *within* an org/project/workspace) — the default for SaaS: a user is `admin` of org A and `viewer` of org B, and every check is scoped to the resource's tenant. Model the assignment as `(actor, role, scope)`.
   - **ReBAC / ABAC** (permission depends on the specific object's relationship or attributes — "owner of THIS document", "assignee of THIS ticket") — reach for this *only* for the per-object rules; let scoped RBAC carry the rest. Do **not** stand up a full policy engine if scoped RBAC suffices.
   State the choice and the reason; mixing scoped RBAC for the 90% with a handful of ReBAC ownership rules is usually correct.
4. **Centralize enforcement in one authorization layer.** Design a single policy function/middleware — `authorize(actor, action, resource)` (or a guard/policy class) — that every entry point routes through: HTTP handlers, GraphQL resolvers, queue/cron jobs, and admin scripts. No handler should make its own role decision. Specify *where* it sits (e.g. middleware that resolves the resource, computes the actor's permissions in that scope, and allows/denies) so coverage is provable by reading one module, not auditing hundreds.
5. **Default-deny, explicitly.** The policy layer returns deny unless a rule grants. A new route with no policy attached must fail closed (no access), never fall through to allowed. Specify how an un-annotated/un-checked endpoint is detected and rejected (e.g. a route-level assertion that a policy was declared) so "forgot to add a check" becomes a *deny*, not a hole.
6. **Decide role hierarchy and inheritance deliberately.** If `admin` should imply everything `editor` can do, model it as *permission inheritance* (admin's permission set ⊇ editor's) computed when permissions are resolved — not as a chain of `if role >= X` comparisons, which reintroduce role-name logic. Keep the hierarchy shallow and flatten to an effective permission set at check time; document the partial order so "what can role X do" is answerable from the model alone.
7. **Scope every check to the resource — at the API *and* data layer.** A valid role on tenant A must never act on tenant B's data. The permission check answers "may this actor approve invoices?"; the *data* layer must additionally bind the query to the resource's owner/tenant (`WHERE org_id = :actorOrg`, a tenant filter, or row-level security), so changing an id in the URL cannot reach another tenant's row. Specify both: the policy check *and* the scoped query. Skipping the data-layer scope is the classic IDOR — the permission passed, but the object belonged to someone else.
8. **Make it auditable.** Design the model so authorization decisions are explainable and logged: who has which role in which scope (queryable), what permissions a role grants (the map), and a decision log for sensitive actions (actor, action, resource, allow/deny, why). A model nobody can answer "who can approve invoices in org X?" about is not finished.

> [!NOTE]
> RBAC without per-tenant/resource scoping is the most common real failure: a legitimate `admin` of org A passes the `invoice:approve` permission check and then approves org B's invoice because the query fetched by id alone. The permission says *what* the actor may do; the scope says *to which objects*. Both are required — design them together, not as an afterthought.

## Output

A concrete authorization design with four parts:

1. **The permission/role model** — the resource×action permission list, the role→permission map (with inheritance), and the assignment shape (`(actor, role)` for pure RBAC or `(actor, role, scope)` for scoped/multi-tenant).
2. **The central enforcement design** — the single `authorize(actor, action, resource)` entry point, where it sits, what it resolves, and the list of existing scattered role checks to migrate into it.
3. **Granularity decision** — pure RBAC vs scoped RBAC vs ReBAC/ABAC, stated with the reason, including which specific rules (if any) need per-object relationship checks.
4. **The hardening decisions** — default-deny mechanism, role hierarchy/partial order, the API-and-data-layer scoping rule per resource, and the audit/decision-log plan.

```text
Authorization model — scope: src/routes/**, src/models/**  (multi-tenant SaaS)
Granularity: SCOPED RBAC (role within org) + ReBAC for document ownership

PERMISSIONS (resource:action)
  invoice: read, create, update, delete, approve, export
  member:  read, invite, remove
  doc:     read, edit  (edit also gated by ownership — see ReBAC)

ROLES → PERMISSIONS  (within an org)
  viewer   = {invoice:read, member:read, doc:read}
  editor   = viewer ∪ {invoice:create, invoice:update, doc:edit}
  approver = editor ∪ {invoice:approve, invoice:export}
  admin    = approver ∪ {member:invite, member:remove}     # inherits all above

ASSIGNMENT:  (user_id, role, org_id)        # scoped — same user differs per org

ENFORCEMENT (one layer)
  authorize(actor, action, resource):
    1. resolve actor's role in resource.org_id   -> effective permission set
    2. deny if action ∉ permissions              # DEFAULT-DENY
    3. ReBAC rule: doc:edit also requires resource.owner_id == actor.id
  Every route/resolver/job calls authorize(); routes with no policy → fail closed.

MIGRATE these scattered checks into authorize():
  - src/routes/invoices.ts:41   if (user.isAdmin)        -> can(..,"invoice:approve",inv)
  - src/routes/members.ts:88    user.role === "owner"    -> can(..,"member:invite",org)

DATA-LAYER SCOPING (prevents IDOR — required alongside the permission check)
  invoices:  WHERE id = :id AND org_id = :actorOrg     # not findById(id) alone
  docs:      WHERE id = :id AND org_id = :actorOrg      # + ReBAC owner check above

AUDIT
  - role assignments queryable: "who can invoice:approve in org X?"
  - decision log on approve/export/remove: actor, action, resource, allow/deny
```