---
title: "9 Best Claude Skills for Frontend Development"
description: "Compare Claude skills for accessibility, Web Vitals, React renders, bundles, localization, browser security, test data, tests, and caching."
author: "Imtiaz Rayhan"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
color: "cyan"
topics: ["coding-languages", "review-qa"]
audience: ["developers"]
tags: ["claude-skills", "frontend", "accessibility", "react", "web-performance", "localization"]
featured: true
seoTitle: "9 Best Claude Skills for Frontend Development"
seoDescription: "Find Claude skills for frontend accessibility, Core Web Vitals, React rendering, JavaScript bundles, localization, security headers, tests, and caching."
summary: "Pick by symptom: web-vitals-optimizer for a failing LCP, CLS, or INP; react-render-profiler for a janky interaction; bundle-analyzer for heavy JavaScript; accessibility-regression-auditor after a UI change; localization-readiness-auditor before translating. test-scaffolder and mock-data-factory write tests and fixtures; two more cover headers and caching."
keyTakeaways:
  - "Four picks report without editing (accessibility, localization, bundle analysis, cache policy); web-vitals-optimizer, react-render-profiler, and security-headers-hardener apply edits; test-scaffolder and mock-data-factory write new files."
  - "web-vitals-optimizer works from p75 field data and uses Lighthouse only to find the element, shift, or long task at fault."
  - "react-render-profiler names one of five cause classes per slow component and reverts any memoization that does not lower the render count."
  - "accessibility-regression-auditor separates what was automated, what was checked by hand, and what was not tested; a clean scan is not a pass."
  - "security-headers-hardener always ships Content-Security-Policy as Report-Only first, because an enforcing policy can block inline scripts and third-party widgets."
faq:
  - q: "What Claude skills should a frontend developer install first?"
    a: "test-scaffolder and mock-data-factory are useful on day one in any codebase. Add accessibility-regression-auditor for UI reviews and bundle-analyzer once the app has a production build worth measuring. web-vitals-optimizer needs field data, so it pays off after the site has real traffic, and react-render-profiler applies only to React apps."
  - q: "Can accessibility-regression-auditor certify WCAG compliance?"
    a: "No. It audits the journey a change touched, combining the project's own linters and scanners with semantic, keyboard, announcement, and visual checks, and it reports automated, manual, and untested coverage separately. Its instructions say not to claim device or screen-reader coverage that was not performed."
  - q: "Should I use bundle-analyzer or react-render-profiler?"
    a: "bundle-analyzer when the page is slow to load: it measures gzip sizes in the production build and ranks cuts. react-render-profiler when the page is loaded but an interaction lags: it reads a React DevTools Profiler recording and fixes the cause of extra renders. A slow INP can need both, since heavy scripts and wasted renders both block the main thread."
  - q: "Why audit localization before translating?"
    a: "Translators cannot fix strings built by concatenation, missing plural rules, hard-coded date and number formats, fixed-width layouts that clip longer text, or broken right-to-left layout. localization-readiness-auditor finds those in code and with a lengthened pseudolocale, so they are fixed before translation work is paid for."
related: ["guide:best-claude-skills-for-performance", "skill:accessibility-regression-auditor", "skill:localization-readiness-auditor", "skill:web-vitals-optimizer", "skill:react-render-profiler", "skill:bundle-analyzer"]
---

Frontend work fails in ways a compiler does not catch: a dialog that traps keyboard focus, a hero image that loads late, a list that stutters on every keystroke, a layout that clips German strings. Each skill below targets one of those with a method and a defined output.

Selection criteria: each pick works from evidence you can produce in a browser or a build (a trace, a stats report, a scan, a real response header), each states what it will not claim, and the set covers a UI change from interaction through delivery. Four of the nine also appear in the [performance roundup](/guides/skills/best-claude-skills-for-performance); this page covers what they change in frontend code, and that page walks through the measurements.

## Start from the symptom

| What you see | Run | What it asks you for |
| --- | --- | --- |
| Search Console or RUM flags LCP, CLS, or INP | [web-vitals-optimizer](/skills/performance/web-vitals-optimizer) | p75 field data for the URL |
| Typing or clicking lags after the page has loaded | [react-render-profiler](/skills/performance/react-render-profiler) | A React DevTools Profiler recording |
| First-load JavaScript is over budget | [bundle-analyzer](/skills/performance/bundle-analyzer) | A production build |
| A UI change shipped and nobody tested it with a keyboard | [accessibility-regression-auditor](/skills/testing/accessibility-regression-auditor) | The changed journey and its states |
| A second language is planned | [localization-readiness-auditor](/skills/workflow/localization-readiness-auditor) | Target surfaces and locales |
| A scanner flags missing security headers, or you added a third-party script | [security-headers-hardener](/skills/security/security-headers-hardener) | The deployed URL |
| A component or util has no tests | [test-scaffolder](/skills/testing/test-scaffolder) | The source file |
| Specs repeat the same object literal | [mock-data-factory](/skills/testing/mock-data-factory) | The type or schema |
| Users see stale pages, or pages are never cached | [cache-policy-designer](/skills/performance/cache-policy-designer) | The response and who writes to it |

## 1. accessibility-regression-auditor: the changed journey, not the score

> "We replaced the checkout address form with a modal. Audit the change for accessibility regressions."

[accessibility-regression-auditor](/skills/testing/accessibility-regression-auditor) first defines the affected journey, including loading, empty, error, validation, success, and disabled states. It runs whatever linters, component tests, or scanners the project already has and keeps the raw violations. Then it checks what automation cannot: heading order and labels, ARIA that contradicts native behavior, keyboard reachability and focus return after a dialog closes, whether validation errors and async results are announced, contrast, 200% zoom, narrow reflow, target size, and reduced motion.

Findings are ranked by the task they block. The report lists scope, tools, element or file evidence, severity, fix, and a verification step, and it separates automated, manual, and untested coverage. It does not edit code. For a full WCAG pass of a page, the [accessibility-auditor agent](/agents/quality-security/accessibility-auditor) is the broader tool.

## 2. web-vitals-optimizer: fix the field metric

> "Search Console says LCP is poor on mobile for /pricing. Lighthouse looks fine. Fix it."

[web-vitals-optimizer](/skills/performance/web-vitals-optimizer) starts by pulling p75 LCP, CLS, and INP from CrUX or your RUM, split by phone and desktop, and compares them with the Core Web Vitals targets: LCP within 2.5 seconds, CLS of 0.1 or less, INP of 200 milliseconds or less. Lab tools come second, only to name the culprit. The fixes are specific:

- **LCP:** the hero image must not be `loading="lazy"`; add `fetchpriority="high"`, preload it, and serve a right-sized AVIF or WebP.
- **CLS:** set `width` and `height` or `aspect-ratio` on images, embeds, and ad slots; never inject banners above existing content.
- **INP:** split long tasks and yield to the main thread; defer heavy third-party scripts; keep handlers cheap.

It changes one thing, confirms the mechanism in a lab trace, and gives you the field target to watch. The skill notes that CrUX data lags, so RUM is the fast check.

## 3. react-render-profiler: why did it render

> "Typing in the search box re-renders the whole results table. Find out why."

[react-render-profiler](/skills/performance/react-render-profiler) will not edit until a Profiler recording names a component and a render count. It assigns each culprit one cause class and applies the matching fix:

| Cause | Fix |
| --- | --- |
| State held too high in the tree | Move the state into the smallest component that uses it |
| Unstable object, array, or function props | `useCallback` or `useMemo` at the source, only if the child is memoized |
| Context provider with a fresh `value` each render | Memoize the value or split the context |
| Expensive calculation in render | `useMemo` on the computation, or move it out of render |
| Long list | Virtualize with `@tanstack/react-virtual` or `react-window` |

It re-records the same interaction and reports before and after render counts. If the count did not drop, the change is reverted, so no memoization is left behind that bought nothing. It is React-only.

## 4. bundle-analyzer: where the bytes go

> "First Load JS on /dashboard is over budget. What can we cut?"

[bundle-analyzer](/skills/performance/bundle-analyzer) detects the bundler, builds for production, and reads the project's own analyzer (the Next.js route table, `rollup-plugin-visualizer`, webpack stats) or falls back to `source-map-explorer`. It attributes gzip weight to packages and looks for duplicates at different versions, whole-library imports, modules in the entry chunk that one route needs, polyfills for browsers you dropped, and server-only code pulled into a client component.

The output is a plan ranked by estimated gzip savings. An entry from the skill's example report:

```text
3. recharts loaded eagerly in entry chunk ..... 38 KB  [HIGH]
   Only rendered below the fold on /dashboard. Move behind
   next/dynamic({ ssr: false }). Est. -38 KB from First Load.
   Effort: S, Risk: low.
```

It reports and does not apply the cuts.

## 5. localization-readiness-auditor: find the English-only assumptions

> "We're adding German and Arabic next quarter. Audit the account settings flow for localization blockers."

[localization-readiness-auditor](/skills/workflow/localization-readiness-auditor) inventories user-facing text across components, emails, notifications, metadata, and accessibility labels, flagging hard-coded strings and sentences assembled from fragments. It checks plural and select rules, date, number, currency, and address formatting, Unicode handling in validation, search, and truncation, and layout under a lengthened pseudolocale at a narrow viewport. For right-to-left it checks mirroring, mixed-direction text, and directional icons. It also reviews locale detection, fallback chains, and whether caches vary by locale.

The report groups blockers by user journey and separates product copy questions from technical defects. It recommends regression checks such as pseudolocale builds and missing-key tests.

## 6. security-headers-hardener: CSP without breaking the page

> "Our scanner flagged missing headers on app.example.com. Harden them without breaking the analytics script."

[security-headers-hardener](/skills/security/security-headers-hardener) finds every layer that sets headers (middleware, framework config, proxy, CDN) and checks the effective response, since one layer can override another. It writes a Content-Security-Policy from `default-src 'self'` outward, using nonces for unavoidable inline scripts, and deploys it as `Content-Security-Policy-Report-Only` until the violation reports go quiet. Around it: HSTS (with `preload` only after every subdomain serves HTTPS), `X-Content-Type-Options: nosniff`, `frame-ancestors`, `Referrer-Policy: strict-origin-when-cross-origin`, a `Permissions-Policy` that disables unused features, and removal of `X-Powered-By` and server version banners.

The output is a current-to-recommended table per header plus a staged rollout plan. It edits the config, and leaves CSP in Report-Only if the watch window is not complete.

## 7. test-scaffolder: a first test file in the repo's own style

> "Write tests for src/utils/slugify.ts."

[test-scaffolder](/skills/testing/test-scaffolder) reads the target's public functions, detects the runner from `package.json` or equivalent, and mirrors the existing test location, naming, and assertion style. For each function it writes the happy path, boundary inputs, and invalid input that should throw, then runs the file so imports and syntax are known to work. From the skill's example, for a Vitest project:

```ts
it("collapses runs of non-alphanumerics into one hyphen", () => {
  expect(slugify("a  --  b!!c")).toBe("a-b-c");
});
it("throws TypeError on non-string input", () => {
  // @ts-expect-error testing runtime guard
  expect(() => slugify(42)).toThrow(TypeError);
});
```

It tests through the public API and avoids asserting on internals. Read the generated assertions before trusting them: a failing one may be exposing real behavior.

## 8. mock-data-factory: one factory in place of copied literals

> "Create a factory for the User type for our component tests."

[mock-data-factory](/skills/testing/mock-data-factory) reads a TypeScript type, Zod schema, Prisma model, or Pydantic model and writes a typed `build()` function with believable defaults inferred from field names (`email` becomes a valid address, `createdAt` a recent ISO timestamp) and a partial override. It reuses a faker library if one is installed and otherwise writes deterministic values without adding a dependency.

```ts
const admin = buildUser({ role: "admin", email: "ada@example.com" });
```

The data is schema-valid, not business-valid. If a story depends on `endsAt` being after `startsAt`, pass both as overrides. For loading, empty, error, and long-text states, build each as an explicit override so the variations are visible in the test.

## 9. cache-policy-designer: what the browser and CDN may keep

> "Users see an old dashboard after saving. Design the cache policy for /api/dashboard and the page that renders it."

[cache-policy-designer](/skills/performance/cache-policy-designer) names the cached response, its source, writers, and the cost of serving it stale, then maps every layer that can hold it: browser, service worker, CDN, proxy, framework, application. It defines the complete cache key (tenant, user or authorization class, locale, encoding, version), sets max age from the business freshness bound, decides on `stale-while-revalidate` and `stale-if-error`, and lists every write that must invalidate. It marks values that must never enter a shared cache.

The output is a layer-by-layer policy with verification cases and metrics. It is a design, and it calls out unknown writers that block safe caching.

## Recommended frontend stack

```bash
npx agentscamp add skills/test-scaffolder
npx agentscamp add skills/mock-data-factory
npx agentscamp add skills/accessibility-regression-auditor
npx agentscamp add skills/bundle-analyzer
npx agentscamp add skills/web-vitals-optimizer
```

Add `react-render-profiler` for React apps, `localization-readiness-auditor` one release before translation starts, and `security-headers-hardener` before a public launch or after adding a third-party embed.

## Continue exploring

- [New Component](/commands/scaffold/new-component) — Scaffold a new UI component matching the project conventions.
- [Web Performance Budgets: Turn Speed Into a Release Gate](/guides/performance/web-performance-budgets) — Define and enforce web performance budgets for Core Web Vitals, JavaScript, images, fonts, third parties, and critical journeys in CI and production.
- [9 Best Claude Skills for Performance Engineering](/guides/skills/best-claude-skills-for-performance) — A symptom-to-skill table and a slow-page walkthrough across the performance skills.
