---
name: "least-privilege-auditor"
title: "Least Privilege Auditor"
description: "Audit application, CI, cloud, database, and agent permissions against observed usage, then produce a safe reduction plan with verification and rollback. Use when credentials have broad scopes, service roles grew organically, CI tokens can write too much, an agent or MCP server has excessive tools, or before a security review or compliance audit."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
topics: ["ai-safety-security", "devops-infra"]
audience: ["developers", "devops", "security"]
related: ["guide:best-claude-skills-for-code-review", "skill:rbac-designer", "skill:auth-flow-reviewer", "skill:secret-scanner", "skill:threat-model-builder", "agent:prompt-injection-auditor"]
featured: true
summary: "Audits every principal, CI token, cloud role, database user, agent tool, and MCP integration against the actions it needs. It classifies each grant as required, unused, excess scope, or unverified, ranks findings by blast radius, and produces a policy diff with a staged rollout and rollback instead of blindly tightening production access."
faq:
  - q: "Is least privilege just removing wildcard permissions?"
    a: "No. Wildcards are a strong signal, but a narrowly named permission can still be unnecessary or scoped to every resource. Least privilege aligns actions, resources, environments, duration, and delegation with a principal's real job."
  - q: "How can permissions be reduced without breaking production?"
    a: "Combine static policy review with runtime evidence, create a proposed reduced role, test critical workflows in a lower environment, canary the role for a small principal set, monitor denied actions, and retain a time-bounded rollback path."
---

Audit permission scope without changing access. Produce evidence and a staged reduction plan; do not revoke credentials or edit policy unless the user explicitly expands the task.

## Workflow

1. **Inventory principals and credentials.** Find application service accounts, cloud roles, database users, CI tokens, deploy identities, human groups, third-party apps, agents, MCP servers, and long-lived keys. Record owner, environment, authentication method, and expiry. Start where grants are declared:

   | Surface | Where to look | Broad-grant signals |
   |---|---|---|
   | CI | `.github/workflows/*.yml`, other pipeline files | no `permissions:` block (the token falls back to the repository default), `permissions: write-all`, one deploy secret shared by every job |
   | Cloud IAM | Terraform, CloudFormation, Pulumi, policy JSON | `"Action": "*"`, `"Resource": "*"`, service-wide wildcards such as `s3:*`, trust policies open to a whole account |
   | Kubernetes | `Role`, `ClusterRole`, and binding manifests | `verbs: ["*"]`, `resources: ["*"]`, a `ClusterRoleBinding` to `cluster-admin`, workloads on the default service account |
   | Database | migrations, bootstrap SQL, connection strings | `GRANT ALL`, the app connecting as a superuser or schema owner, one user shared by app and migrations |
   | Agents and MCP | `.claude/settings.json`, `.mcp.json`, agent and skill frontmatter | unrestricted `Bash`, write tools on a read-only job, an MCP server holding an org-wide token |

2. **Map granted capability.** Expand inherited roles, groups, wildcards, resource patterns, trust policies, and delegation. Include actions, resources, conditions, environments, and whether the identity may grant access onward.

3. **Map required behavior.** Trace code, workflows, infrastructure, queries, tool declarations, and documented operations. For each principal, list the calls it makes: SDK client methods, SQL statements by table, `gh` or cloud CLI commands in pipeline steps, tools an agent invokes. Use audit logs when supplied, but treat absence of observed use as evidence to investigate, not proof that a disaster-recovery permission is unnecessary.

4. **Classify each grant.** Mark `required`, `unused`, `excess scope`, `temporary`, or `unverified`, and cite the evidence for the label:

   - `required`: a code path, workflow step, or runbook uses this action on this resource.
   - `excess scope`: the action is used, but on fewer resources or environments than granted.
   - `unused`: no caller found in code, and logs (if supplied) show no use across a window that covers the slowest legitimate cycle, such as month-end or a quarterly job.
   - `unverified`: you could not see the caller or the logs. Never promote `unverified` to `unused`.

5. **Prioritize blast radius.** Order findings by what a stolen or misused credential could do:

   1. Grant or change permissions, create identities, or read secrets (it can escalate to everything else).
   2. Write, delete, or export production data across tenants or environments.
   3. Write within one service or environment; unrestricted shell or deploy tools held by an agent.
   4. Read-only access broader than needed.

6. **Design the target role.** Prefer task-specific actions, named resources, environment separation, short-lived credentials, explicit conditions, and separate break-glass access with logging and expiry. Show it as a diff against the current grant.

7. **Plan a safe rollout.** Create the reduced role alongside the old one, test known workflows in a lower environment, canary it on one workload, monitor denied actions (access-denied events, 403 responses, permission errors in job logs), and define rollback as switching back to the old role. Remove the old role only after the observation window from step 4 has passed with zero unexplained denials.

8. **Identify governance gaps.** Flag ownerless identities, long-lived keys with no rotation or last-used record, roles with no review date, shared credentials, missing audit logs, and exceptions without expiry.

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

Write each finding like this (fictional example):

````markdown
### 1. Deploy workflow token can write to everything (blast radius: tier 1)
Principal: GITHUB_TOKEN in .github/workflows/deploy.yml, all jobs
Current: `permissions: write-all`
Required: read the repository, request an OIDC token for the cloud deploy role
Evidence: steps call actions/checkout and the cloud login action only; no step pushes, comments, or publishes packages
Classification: excess scope

```diff
-permissions: write-all
+permissions:
+  contents: read
+  id-token: write
```

Rollout: apply on a branch, run the deploy to staging, confirm no "Resource not accessible by integration" errors, then merge.
Rollback: revert the commit.
````
