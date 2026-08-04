---
name: "cors-configurator"
description: "Diagnose and fix a failing cross-origin browser request — read the exact console error, work out whether it's a simple or preflighted request, and set the minimal correct Access-Control-* response headers (including the wildcard-with-credentials trap and the OPTIONS preflight) on the server. Use when the browser blocks a fetch/XHR with a CORS error but the API itself works from curl or Postman."
allowed-tools: "Read, Grep, Glob, Edit, Bash"
user-invocable: true
version: "1.0.0"
color: "cyan"
title: "CORS Configurator"
date: 2026-07-01
topics: ["architecture"]
related: ["skill:security-headers-hardener", "skill:auth-flow-reviewer", "skill:rate-limiter-designer"]
featured: false
summary: "Fixes the case where a browser blocks a cross-origin request even though the API works from curl. It reads the exact CORS console error, works out whether the request is simple or preflighted, answers the OPTIONS preflight, and sets the minimal correct Access-Control-* headers — reflecting an allowlisted origin instead of the wildcard-plus-credentials combo browsers reject."
faq:
  - q: "Why can't I use Access-Control-Allow-Origin: * when my request sends cookies?"
    a: "Browsers forbid the wildcard when credentials (cookies, Authorization, or TLS client certs) are involved: a response with Access-Control-Allow-Credentials: true must name a specific origin in Access-Control-Allow-Origin, not `*`. The fix is to check the incoming Origin against an allowlist and echo that exact origin back, and add `Vary: Origin` so caches don't serve one origin's headers to another. Reflecting every origin unconditionally re-opens the hole the rule exists to close."
---

Fix the specific, maddening case where a request works from curl or Postman but the browser blocks it with a CORS error. CORS is enforced by the browser, not the server — so the failure is always that the server isn't returning the response headers the browser requires for a cross-origin request. This skill reads the exact error, determines what the browser is asking for, and sets the minimal correct headers on the server, without disabling the protection or opening the API to every origin.

> [!NOTE]
> CORS is a browser policy, not a server-side security control. Loosening it doesn't make your API safer or more dangerous to non-browser clients — but a wildcard-with-credentials or reflect-any-origin "fix" does expose authenticated users to malicious sites. Scope it to the origins you actually serve.

## When to use this skill

- A browser `fetch`/XHR fails with "No 'Access-Control-Allow-Origin' header" or "…does not pass access control check", but the same endpoint works from curl.
- A request started failing after you added `Authorization` headers, custom headers, cookies, or switched to `PUT`/`DELETE` (it became preflighted).
- The preflight `OPTIONS` request returns 404/405 or the wrong headers.
- You set `Access-Control-Allow-Origin: *` and it broke once credentials were involved.

## Instructions

1. **Read the exact error and the request.** Get the precise browser console message and the request's origin, method, and headers. The error text names what's missing (origin not allowed, method not allowed, header not allowed, credentials mismatch).
2. **Classify simple vs. preflighted.** A *simple* request (GET/HEAD/POST with only safelisted headers and content types) needs only the right headers on the actual response. A *preflighted* request (custom headers, `Authorization`, JSON body via non-safelisted content type, or `PUT`/`PATCH`/`DELETE`) first sends an `OPTIONS` preflight — the server must answer that too.
3. **Find where responses are produced.** Locate the CORS middleware or the place response headers are set (framework CORS package, a reverse proxy, or manual header code). Confirm whether a proxy in front is adding or stripping CORS headers — duplicated or conflicting headers are a common cause.
4. **Set the origin correctly.** For requests without credentials you may use `Access-Control-Allow-Origin: *`. For requests *with* credentials, you must echo a specific allowlisted origin (never `*`), add `Access-Control-Allow-Credentials: true`, and add `Vary: Origin` so caching stays correct. Check the incoming `Origin` against an explicit allowlist; don't reflect arbitrary origins.
5. **Answer the preflight.** Ensure `OPTIONS` on the route returns `204`/`200` with `Access-Control-Allow-Methods` (the methods you allow), `Access-Control-Allow-Headers` (echo or list the requested headers, e.g. `Authorization, Content-Type`), and `Access-Control-Max-Age` to cache the preflight and cut round-trips. Make sure the OPTIONS route isn't swallowed by auth middleware or a 404.
6. **Prefer the framework's CORS support.** Use the maintained CORS middleware (e.g. `cors` for Express, `CORSMiddleware` for FastAPI/Starlette, the framework's config) with an explicit origin allowlist rather than hand-writing headers on every route.
7. **Verify with a real preflight.** Reproduce the preflight from the shell and confirm the headers, then re-test in the browser:
   ```bash
   curl -i -X OPTIONS https://api.example.com/things \
     -H "Origin: https://app.example.com" \
     -H "Access-Control-Request-Method: PUT" \
     -H "Access-Control-Request-Headers: authorization,content-type"
   ```
   The response must include `Access-Control-Allow-Origin: https://app.example.com` (or `*` when credential-free), the allowed method, and the allowed headers.

## Examples

An Express API called from `https://app.example.com` with a cookie session, currently sending `Access-Control-Allow-Origin: *` and failing once credentials were added:

```js
import cors from "cors";

const allowedOrigins = ["https://app.example.com", "http://localhost:3000"];

app.use(
  cors({
    origin(origin, cb) {
      // allow same-origin/non-browser (no Origin) and allowlisted origins
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,                          // echoes a specific origin, not *
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);
```

Report the outcome: what the browser was actually rejecting (origin / method / header / credentials), the exact headers now returned, that the `OPTIONS` preflight succeeds, and the allowlist you scoped it to — plus a note that origins are an explicit list, not a reflect-all.
