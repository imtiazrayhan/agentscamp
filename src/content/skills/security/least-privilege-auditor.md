---
name: "least-privilege-auditor"
title: "Least Privilege Auditor"
description: "Audit application, CI, cloud, database, and agent permissions against observed usage, then produce a safe reduction plan with verification and rollback. Use when credentials have broad scopes, service roles grew organically, CI tokens can write too much, an agent or MCP server has excessive tools, or before a security review or compliance audit."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-08-04
topics: ["ai-safety-security", "devops-infra"]
related: ["best-claude-skills-for-code-review", "rbac-designer", "auth-flow-reviewer", "secret-scanner", "threat-model-builder", "prompt-injection-auditor"]
featured: true
summary: "Audits every principal, credential, role, CI token, database user, agent tool, and MCP integration against the actions it actually needs. It separates required, unused, and unverified privileges; identifies wildcard and cross-environment blast radius; then produces staged removals with tests, observability, rollback, and ownership rather than blindly tightening production access."
faq:
  - q: "Is least privilege just removing wildcard permissions?"
    a: "No. Wildcards are a strong signal, but a narrowly named permission can still be unnecessary or scoped to every resource. Least privilege aligns actions, resources, environments, duration, and delegation with a principal's real job."
  - q: "How can permissions be reduced without breaking production?"
    a: "Combine static policy review with runtime evidence, create a proposed reduced role, test critical workflows in a lower environment, canary the role for a small principal set, monitor denied actions, and retain a time-bounded rollback path."
---

Audit permission scope without changing access. Produce evidence and a staged reduction plan; do not revoke credentials or edit policy unless the user explicitly expands the task.

## Workflow

1. **Inventory principals and credentials.** Find application service accounts, cloud roles, database users, CI tokens, deploy identities, human groups, third-party apps, agents, MCP servers, and long-lived keys. Record owner, environment, authentication method, and expiry.
2. **Map granted capability.** Expand inherited roles, groups, wildcards, resource patterns, trust policies, and delegation. Include actions, resources, conditions, environments, and whether the identity may grant access onward.
3. **Map required behavior.** Trace code, workflows, infrastructure, queries, tool declarations, and documented operations. Use audit logs when supplied, but treat absence of observed use as evidence to investigate—not proof that a disaster-recovery permission is unnecessary.
4. **Classify each grant.** Mark `required`, `unused`, `excess scope`, `temporary`, or `unverified`. Explain the exact resource and action difference between current and required access.
5. **Prioritize blast radius.** Raise wildcard write/admin access, cross-tenant or cross-environment scope, secret and identity management, policy mutation, production data export, and unbounded agent tools above harmless read-only excess.
6. **Design the target role.** Prefer task-specific actions, named resources, environment separation, short-lived credentials, explicit conditions, and separate break-glass access with logging and expiry.
7. **Plan a safe rollout.** Create the reduced role alongside the old one, test known workflows, canary it, monitor denials, and define rollback. Remove the old role only after the observation window.
8. **Identify governance gaps.** Flag ownerless identities, unused long-lived keys, roles with no review date, shared credentials, missing audit logs, and exceptions without expiry.

> [!WARNING]
> Do not remove a permission solely because it was absent from a short log window. Rare maintenance, recovery, and failover paths need explicit owners and tests before removal.

## Output

Return:

- a principal-to-permission inventory with owners and environments
- findings ordered by blast radius, each showing current versus required scope
- a proposed least-privilege role or policy diff
- a staged test, canary, monitoring, and rollback plan
- time-bounded exceptions for rare required access
- governance gaps and the next review date
