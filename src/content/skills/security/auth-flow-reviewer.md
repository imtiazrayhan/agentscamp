---
name: "auth-flow-reviewer"
description: "Read-only review of authentication AND authorization flows — session/token model, cookie flags, CSRF, token rotation, password-reset/email-verification, OAuth redirect/state, and per-route object-level access checks — for exploitable gaps. Use before shipping login/session/token code, when adding a protected route or sharing-by-URL feature, or during a security pass. Reports findings by severity with location, impact, and the concrete fix; never edits code."
allowed-tools: "Read, Grep, Glob"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Auth Flow Reviewer"
date: 2026-06-17
topics: ["review-qa"]
related: ["skill:secret-scanner", "skill:dependency-audit"]
featured: false
summary: "Read-only review of auth code: session/token model, cookie flags, CSRF, token expiry/rotation, password-reset and email-verification flows, and OAuth redirect_uri/state. Its sharpest focus is authorization — confirming every protected route enforces an object-level check, since the common real bug is a logged-in user reaching another user's data. Output: findings by severity, each with a fix."
faq:
  - q: "Why does this skill keep flagging authorization when my login works fine?"
    a: "Authentication (proving who you are) and authorization (what you may touch) are separate. A working login does nothing to stop user A from requesting user B's resource by changing an ID in the URL — that IDOR is the single most common real-world auth bug, so the skill audits every protected route's object-level check, not just the login form."
  - q: "Will it change my code?"
    a: "No. It is restricted to Read, Grep, and Glob. It produces a severity-grouped findings report with file:line locations and concrete fixes; you apply the changes."
---

Review authentication and authorization code for exploitable gaps without touching a line of it. The skill walks the session/token model, cookie flags, CSRF defenses, token lifecycle, password-reset and email-verification flows, and OAuth parameter validation — then spends most of its effort on the part teams routinely skip: confirming that **every protected route enforces an object-level access check**. A login form that works tells you nothing about whether user A can read user B's invoice by editing an ID. Output is a findings list grouped by severity, each with a location, the concrete impact, and the fix.

## When to use this skill

- Before shipping login, signup, session, JWT, or refresh-token code.
- When adding a new protected route, an admin action, or a "share by link / by ID" feature — anywhere a request carries an object identifier.
- Reviewing a password-reset, email-verification, or OAuth/SSO integration.
- During a scheduled security pass, or after a pentest/bug report mentioning broken access control.

> [!WARNING]
> Authentication ≠ authorization. The most common, highest-impact real bug is a fully logged-in, legitimate user accessing another user's object (IDOR) — `GET /api/orders/123` returning order 123 to whoever asks, regardless of owner. If you only verify that login works, you will miss it. Audit the per-object check on every route, not just the session.

## Instructions

1. **Map the surface first.** Glob for routers, middleware, controllers, and guards (`**/routes/**`, `**/middleware/**`, `**/*controller*`, `**/*guard*`, `**/auth/**`). Build a list of every endpoint and tag each as public, authenticated-only, or authorized (requires ownership/role). You cannot review what you have not enumerated — an unlisted route is the one that ships unprotected.
2. **Classify the session model.** Determine whether the app uses server-side sessions (cookie holds an opaque session id) or stateless tokens (cookie/header holds a JWT). The two have different failure modes: sessions need a server store and explicit invalidation on logout; JWTs cannot be revoked before expiry without a denylist. Flag any hybrid where a JWT is treated as revocable but no denylist exists.
3. **Audit cookie flags on every auth cookie.** Confirm `HttpOnly` (blocks JS/XSS theft), `Secure` (HTTPS-only), and an explicit `SameSite` (`Lax` minimum; `Strict` for the session cookie when feasible; `None` requires `Secure` and a CSRF defense). Grep for cookie-setting calls (`set-cookie`, `res.cookie`, `Set-Cookie`, framework session config) and report any auth cookie missing a flag, with the exact line.
4. **Verify CSRF protection on state-changing requests.** Any cookie-authenticated `POST`/`PUT`/`PATCH`/`DELETE` needs a CSRF defense: a per-session synchronizer token, double-submit cookie, or strict `SameSite` plus origin checking. Token/`Authorization: Bearer` flows in headers are not CSRF-prone, but cookie flows are. Flag every mutating, cookie-authed endpoint with no token check or origin/referer validation.
5. **Trace the token lifecycle.** For JWTs/access tokens, check: signing algorithm is pinned (reject `alg: none` and confirm the verifier does not accept attacker-chosen algorithms), expiry is short (minutes, not days), the secret/key is not hardcoded, and the payload carries no secrets. For refresh tokens, require server-side storage, **rotation on use** (old token invalidated when a new one is issued), and reuse-detection that revokes the family on replay. Flag tokens stored in `localStorage` (XSS-readable) where a cookie would be safer.
6. **Review password reset and email verification as untrusted token flows.** For each, confirm: the token is high-entropy (CSPRNG, not a sequential id, timestamp, or weak hash), **single-use** (consumed/invalidated after first use), short-lived (minutes to an hour), and bound to the target user. Critically, confirm the flow does **not enumerate users** — the "reset email sent" and "verify" responses must be identical for existing and non-existing accounts (same body, same status, same timing). Flag any reset that returns "no such user".
7. **Validate OAuth/SSO parameters.** Confirm `redirect_uri` is checked against an exact-match allowlist (not a prefix/substring/regex that an attacker can satisfy with `evil.com?x=trusted.com`), and that the `state` parameter is generated, stored, and verified on callback to stop CSRF/login-fixation. For authorization-code flows, confirm PKCE is used for public clients and the code is exchanged server-side.
8. **Enforce object-level authorization on every protected route — the core check.** For each endpoint that accepts an object id (path param, query, or body), confirm the handler verifies the current principal is allowed to act on *that specific object* (e.g. `WHERE owner_id = session.user.id`, or an explicit policy/ability check), not merely that someone is logged in. Look for the anti-pattern: authentication middleware present, but the query fetches by id alone. Also check privilege escalation: role/permission read from the request body or a client-supplied field instead of the server-trusted session; missing `isAdmin` gates on admin endpoints; mass-assignment that lets a user set their own `role`.
9. **Report; do not modify.** Produce the severity-grouped findings (see Output). The skill is read-only — propose the fix, leave the change to the author.

> [!NOTE]
> Test the negative path in your reasoning, not just the happy path: for every "user can see their data" check, ask "what stops them from seeing someone else's?" and "what happens if I delete the auth header / swap the id / replay the token?". Findings come from the requests the code forgot to reject.

## Output

A findings report grouped by severity, with a one-line scope header (what was reviewed) and, for each finding, a `file:line` location, the impact in attacker terms, and the concrete fix. Nothing is edited.

```text
Auth flow review — scope: src/routes/**, src/middleware/auth.ts, src/auth/oauth.ts
12 endpoints enumerated (3 public, 5 authenticated, 4 authorized)

CRITICAL
- IDOR on invoice fetch — src/routes/invoices.ts:41
  Impact: any logged-in user reads any invoice; `findById(req.params.id)` has no
          owner check. GET /api/invoices/123 returns 123 to anyone.
  Fix:    scope the query — findOne({ id, ownerId: req.session.userId }); 404 on miss.

- Privilege escalation via body — src/routes/users.ts:88
  Impact: PATCH /api/users/me accepts { role } from the request body (mass assignment);
          a user can set role: "admin".
  Fix:    whitelist updatable fields; derive role only from server state, never the body.

HIGH
- Refresh token not rotated — src/auth/tokens.ts:53
  Impact: a stolen refresh token works until expiry and is never invalidated on reuse.
  Fix:    rotate on each use, persist the new token, and revoke the family on replay.

- User enumeration on password reset — src/routes/auth.ts:120
  Impact: reset endpoint returns 404 "no such user", letting attackers harvest valid emails.
  Fix:    return an identical 200 "if an account exists, an email was sent" in all cases.

MEDIUM
- Session cookie missing SameSite — src/middleware/session.ts:17
  Impact: cookie sent on cross-site requests; widens CSRF exposure.
  Fix:    add SameSite=Lax (or Strict) alongside HttpOnly and Secure.

- OAuth redirect_uri prefix match — src/auth/oauth.ts:34
  Impact: startsWith() allows https://trusted.com.evil.com — open redirect / token theft.
  Fix:    exact-match redirect_uri against a registered allowlist.

Summary: 2 critical, 2 high, 2 medium. No code modified.
```
