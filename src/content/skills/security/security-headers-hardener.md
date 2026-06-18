---
name: "security-headers-hardener"
description: "Audit and harden a web app's or API's HTTP security headers — Content-Security-Policy, HSTS, X-Content-Type-Options, frame-ancestors, Referrer-Policy, Permissions-Policy, and CORS — and produce a staged rollout that won't break the site. Use before a launch, during a security pass, or when a scanner (Mozilla Observatory, securityheaders.com, a pentest) flags missing or weak headers. Audits and edits header config; rolls CSP out Report-Only first."
allowed-tools: "Read, Grep, Glob, Edit"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "Security Headers Hardener"
date: 2026-06-17
topics: ["review-qa"]
related: ["auth-flow-reviewer", "secret-scanner", "dependency-audit"]
featured: false
summary: "Audits and hardens HTTP security headers for a web app or API: a real Content-Security-Policy (the top XSS mitigation) rolled out Report-Only first, HSTS with care around preload, nosniff, frame-busting, Referrer-Policy, Permissions-Policy, and tightly-scoped CORS. Output: a current→recommended table per header, exact values to apply, and a Report-Only→enforce rollout plan."
faq:
  - q: "Why roll out CSP in Report-Only mode instead of just enforcing it?"
    a: "A real CSP almost always blocks something on first deploy — an inline script, a third-party widget, an analytics beacon. Report-Only sends the same policy but only reports violations to a collector instead of blocking, so you discover every breakage with zero user impact. You enforce only after the violation stream goes quiet for representative traffic. Shipping CSP straight to enforce is how teams white-screen production."
  - q: "Is HSTS preload safe to turn on?"
    a: "HSTS itself is safe and reversible-ish (you can lower max-age). The `preload` directive is not: submitting to the browser preload list bakes HTTPS-only into shipped browsers for that domain and all subdomains, and removal takes months to propagate. Only preload once every subdomain serves valid HTTPS and you're certain none will ever need plain HTTP. Treat it as one-way."
---

Audit the HTTP security headers a web app or API actually sends, then harden them without taking the site down. The single highest-value header is a real **Content-Security-Policy** — it is the strongest in-band mitigation for XSS — but it is also the one most likely to break your site if shipped carelessly, so this skill always stages CSP through **Report-Only** first. Around it: enforce HTTPS with HSTS (carefully, because `preload` is effectively one-way), stop MIME sniffing, block framing, tighten `Referrer-Policy` and `Permissions-Policy`, scope CORS so it can't be turned into a credential-leaking open door, and strip headers that advertise your stack and version. Output is a per-header `current → recommended` audit, the exact values to paste, and a rollout plan that goes Report-Only before enforce.

## When to use this skill

- Before a public launch or a major release that changes the frontend, third-party scripts, or the CDN/proxy in front of the app.
- When a scanner (securityheaders.com, Mozilla Observatory, Lighthouse, a pentest report) flags missing or weak headers.
- When standing up a new service, edge config, or reverse proxy and you want headers right from day one.
- After adding a third-party embed, analytics, payment iframe, or auth widget — anything that changes what origins the page must trust.

> [!WARNING]
> Never ship an enforcing `Content-Security-Policy` you have not first run as `Content-Security-Policy-Report-Only` against real traffic. A directive like `script-src 'self'` will silently kill every inline `<script>`, injected analytics snippet, and third-party widget the moment it enforces — that's a white-screened production site, not a hardened one.

## Instructions

1. **Find where headers are actually set, then observe what ships.** Glob and grep the layers that can emit headers — app middleware (`helmet`, `setHeader`, `res.headers`, `add_header`), framework config (`next.config`, `vercel.json`, `netlify.toml`, `**/middleware*`), and edge config (`nginx.conf`, `*.htaccess`, Cloudflare/CDN rules, `**/*.conf`). Multiple layers may set the same header; the proxy can override the app, or duplicate it. Establish the *effective* response (e.g. `curl -sI https://host` against a deployed instance, or read the proxy config) before changing anything — you can't harden what you can't see, and a header set twice with different values is its own bug.

2. **Set a real Content-Security-Policy — the core control.** Start from a default-deny base: `default-src 'self'`. Then open *only* what the app needs: `script-src` and `style-src` for trusted origins, `img-src`, `connect-src` for your APIs/websockets, `font-src`, `frame-src` for embeds. Avoid `'unsafe-inline'` and `'unsafe-eval'` in `script-src` — they neuter the whole policy against XSS. For unavoidable inline scripts, use a per-response **nonce** (`script-src 'nonce-<random>'`, regenerated each request) or a **SHA-256 hash** of the script body, not a blanket allow. Always add `object-src 'none'` (kills Flash/plugin vectors) and `base-uri 'self'` (stops `<base>`-tag injection that reroutes relative script URLs). Add a `report-uri`/`report-to` endpoint so violations are collected.

3. **Roll CSP out Report-Only before enforcing.** Deploy the policy as `Content-Security-Policy-Report-Only` first — same directives, but violations are reported to your collector instead of blocked. Watch the violation stream across representative traffic (all major pages, logged-in and out, the third-party flows) until it goes quiet or shows only known-benign noise (browser extensions inject inline styles — scope by `document-uri`/`blocked-uri`, don't widen the policy for them). Only then flip the header name to `Content-Security-Policy`. Keep `report-to` on after enforcing to catch regressions.

4. **Enforce HTTPS with HSTS — and be deliberate about preload.** Set `Strict-Transport-Security: max-age=31536000; includeSubDomains`. Add `; preload` **only** once every subdomain serves valid HTTPS, because preload submission bakes HTTPS-only into shipped browsers and is slow and painful to undo. When first introducing HSTS, consider starting with a shorter `max-age` (e.g. a day) to confirm nothing breaks, then raise it. HSTS only takes effect on a response served over HTTPS, so also ensure a plain-HTTP→HTTPS redirect exists.

5. **Stop MIME sniffing and clickjacking.** Set `X-Content-Type-Options: nosniff` (stops the browser from re-interpreting a response's type, a classic way to execute an uploaded "image" as script). Block framing with a frame-busting policy: prefer `Content-Security-Policy: frame-ancestors 'self'` (or an explicit allowlist of origins permitted to frame you), which supersedes the legacy `X-Frame-Options: DENY/SAMEORIGIN` — set both for older-browser coverage, but make them agree.

6. **Tighten Referrer-Policy and Permissions-Policy.** Set `Referrer-Policy: strict-origin-when-cross-origin` (sends the full URL same-origin, only the origin cross-origin over HTTPS, nothing on downgrade) — this stops tokens or PII in query strings from leaking via the `Referer` header to third parties. Set `Permissions-Policy` to disable powerful features the app doesn't use, e.g. `camera=(), microphone=(), geolocation=(), payment=()` — an empty allowlist `()` means "no origin, not even self." Only grant features the app actually calls.

7. **Scope CORS tightly — never the wildcard-plus-credentials trap.** If the API serves cross-origin requests, reflect or allowlist **specific** trusted origins for `Access-Control-Allow-Origin`; never reflect an arbitrary `Origin` header back unchecked (that's "allow everyone" with a disguise). The exploitable misconfiguration to hunt for: `Access-Control-Allow-Origin: *` together with `Access-Control-Allow-Credentials: true` — browsers forbid the literal combination, so a server that *needs* credentials will instead reflect the caller's Origin, and if that reflection is unchecked, any site can make authenticated cross-origin requests and read the response. Pin `Allow-Methods`/`Allow-Headers` to what's used, and set `Vary: Origin` when reflecting so caches don't serve one origin's CORS response to another.

8. **Remove headers that leak the stack.** Strip or blank `Server` version detail, `X-Powered-By`, `X-AspNet-Version`, `X-Generator`, and framework banners — they hand attackers a version to match against known CVEs and cost nothing to remove. (`X-XSS-Protection` is deprecated and best set to `0` or omitted; do not rely on it — CSP replaces it.)

9. **Apply the changes, keeping each layer's edit minimal and consistent.** Use Edit to set the recommended values in the right layer (prefer the single source of truth — usually the proxy/edge or one central middleware — over scattering headers across the app). Don't introduce a header in two places with conflicting values. Leave CSP as Report-Only in the committed config if the violation-watch window hasn't completed; note clearly in the rollout plan when to flip it.

> [!NOTE]
> Test against a real response, not the config file. A header in `helmet()` or `next.config` can be silently overridden, dropped, or duplicated by a CDN, load balancer, or framework default. Confirm the effective `curl -sI` output before and after — the wire is the source of truth.

## Output

A per-header audit table (`current → recommended` for every header in scope), the exact header/config values to apply in the identified layer, and a staged rollout plan that puts CSP through Report-Only before enforce. Edits are applied to the header config; CSP stays Report-Only until the violation window is clear.

```text
Security headers — scope: next.config.ts, middleware.ts, effective response for https://app.example.com

Header                       Current                          Recommended
---------------------------------------------------------------------------------------------------
Content-Security-Policy      (none)                           default-src 'self'; script-src 'self'
                                                              'nonce-{n}'; style-src 'self'; img-src
                                                              'self' data:; connect-src 'self'
                                                              https://api.example.com; object-src
                                                              'none'; base-uri 'self'; frame-ancestors
                                                              'self'; report-to csp
                                                              → ship as -Report-Only first
Strict-Transport-Security    (none)                           max-age=31536000; includeSubDomains
                                                              (add ;preload only after subdomain audit)
X-Content-Type-Options       (none)                           nosniff
X-Frame-Options              (none)                           DENY        (CSP frame-ancestors is primary)
Referrer-Policy              unsafe-url                       strict-origin-when-cross-origin
Permissions-Policy           (none)                           camera=(), microphone=(), geolocation=(),
                                                              payment=()
Access-Control-Allow-Origin  * (reflected, with credentials)  https://app.example.com (allowlist) + Vary: Origin
X-Powered-By                 Next.js                          (removed)
Server                       nginx/1.25.3                     nginx (version suppressed)

Rollout plan
1. Deploy all headers above; CSP as Content-Security-Policy-Report-Only with report-to=csp.
2. Watch violation reports across all pages + third-party flows for one full traffic cycle.
3. Resolve real violations (add the specific origin/nonce); ignore extension noise.
4. When the stream is quiet, rename the header to Content-Security-Policy (enforce). Keep report-to on.
5. After every subdomain is verified HTTPS-only, add ;preload to HSTS and submit (one-way).

Fixed now: CORS wildcard+credentials misconfiguration removed; X-Powered-By/Server stripped;
nosniff, frame-ancestors, Referrer-Policy, Permissions-Policy, HSTS applied. CSP pending enforce.
```