---
title: "9 Best Claude Skills for Performance Engineering"
description: "Compare Claude skills for caching, Web Vitals, bundles, React renders, load tests, cold starts, CPU profiles, memory leaks, and prompt caches."
author: "Imtiaz Rayhan"
date: 2026-08-04
updated: 2026-11-27
reviewed: 2026-11-27
color: "orange"
topics: ["devops-infra", "coding-languages"]
audience: ["developers"]
tags: ["claude-skills", "performance", "web-performance", "profiling", "caching", "load-testing"]
featured: true
seoTitle: "9 Best Claude Skills for Performance Engineering"
seoDescription: "Find Claude skills for cache policy, Core Web Vitals, bundle analysis, React profiling, load testing, cold starts, flamegraphs, memory, and prompt caching."
summary: "Choose by symptom and the measurement you can capture: web-vitals-optimizer for failing field LCP, CLS, or INP; bundle-analyzer for heavy JavaScript; react-render-profiler for laggy interactions; flamegraph-analyzer for high CPU; memory-leak-hunter for growing memory; cold-start-optimizer for slow first requests; load-test-designer before a traffic peak."
keyTakeaways:
  - "Every pick starts with a measurement step and ends by re-measuring the same workload; none of them optimizes from a guess."
  - "Each skill needs a specific input: p75 field data, a production build, a Profiler recording, a sampling profile, two heap snapshots, or an init timeline."
  - "flamegraph-analyzer reads frame width as CPU time and warns that a CPU profile shows nothing for time spent waiting on I/O or locks."
  - "memory-leak-hunter confirms a leak under constant load first, then diffs two heap snapshots; one snapshot proves nothing."
  - "cold-start-optimizer treats provisioned concurrency as the last step, after the init phases have been measured and shortened."
faq:
  - q: "Which Claude performance skill should I use first?"
    a: "Match the symptom to the measurement you can capture. A failing field metric goes to web-vitals-optimizer; a CPU-bound slow request to flamegraph-analyzer; memory that never plateaus to memory-leak-hunter; a slow first request on serverless to cold-start-optimizer. If you have no measurement yet, load-test-designer produces one for a backend."
  - q: "Can cache-policy-designer fix stale data?"
    a: "It finds the cause. It maps every cache layer, the full cache key, and every write that should invalidate, and calls out unknown writers that block safe caching. The output is a policy with verification cases; it does not edit code, so applying the headers or purge logic is a follow-up step."
  - q: "Is Lighthouse enough for web performance?"
    a: "No. web-vitals-optimizer treats Lighthouse as a way to locate the element, shift, or long task at fault. The pass condition is the 75th percentile of real-user data: LCP within 2.5 seconds, INP of 200 milliseconds or less, and CLS of 0.1 or less."
  - q: "Do these skills change code automatically?"
    a: "Four can edit: web-vitals-optimizer, react-render-profiler, and cold-start-optimizer apply targeted fixes, and prompt-cache-optimizer restructures prompts. load-test-designer writes new test files. bundle-analyzer, flamegraph-analyzer, memory-leak-hunter, and cache-policy-designer report a diagnosis and a proposed fix without editing."
related: ["guide:best-claude-skills-for-frontend-development", "skill:cache-policy-designer", "skill:web-vitals-optimizer", "skill:load-test-designer", "skill:flamegraph-analyzer", "skill:memory-leak-hunter"]
---

Performance work goes wrong when the fix is chosen before the measurement. A field metric, a bundle report, a React trace, a load-test curve, a flamegraph, a heap diff, and a cold-start timeline each describe a different system, and each of the nine skills below is built around exactly one of them.

They were chosen because each one refuses to act without its measurement, names the bottleneck with evidence, makes one targeted change, and re-measures. Use the table to route a symptom to a skill.

## Symptom, measurement, skill

| Symptom | Capture this first | Skill | Edits code? |
| --- | --- | --- | --- |
| LCP, CLS, or INP fails in Search Console or RUM | p75 field data per URL, phone and desktop | [web-vitals-optimizer](/skills/performance/web-vitals-optimizer) | Yes |
| First-load JavaScript is too large | Production build and analyzer report | [bundle-analyzer](/skills/performance/bundle-analyzer) | No |
| An interaction lags after load (React) | React DevTools Profiler recording | [react-render-profiler](/skills/performance/react-render-profiler) | Yes |
| A request or job pins the CPU | Sampling profile under realistic load | [flamegraph-analyzer](/skills/performance/flamegraph-analyzer) | No |
| Memory climbs until restart or OOM | Memory over time, then two heap snapshots | [memory-leak-hunter](/skills/performance/memory-leak-hunter) | No |
| First request after idle is slow (serverless) | Init timeline split into phases | [cold-start-optimizer](/skills/performance/cold-start-optimizer) | Yes |
| A launch or sale is coming; capacity unknown | Production traffic mix | [load-test-designer](/skills/performance/load-test-designer) | Writes test files |
| Origin is hit for the same response, or users see stale data | Cache layers and writers | [cache-policy-designer](/skills/performance/cache-policy-designer) | No |
| LLM input tokens repeat across calls | Cached and uncached token counts | [prompt-cache-optimizer](/skills/performance/prompt-cache-optimizer) | Yes |

If the latency is high but the CPU profile is nearly idle, the time is being waited, not computed. flamegraph-analyzer says to switch to an off-CPU or wall-clock profile in that case, and the likely next stop is a database or downstream call, which the [database roundup](/guides/skills/best-claude-skills-for-database-work) covers.

## Walkthrough: a slow dashboard page

A fictional example: Acme's `/dashboard` is flagged for poor mobile LCP. The numbers below reuse the sample figures from the two skills' own example reports, so read them as the shape of the work, not a benchmark.

**Step 1, prompt:** "Search Console says LCP is poor on mobile for /dashboard. Find the cause."

web-vitals-optimizer pulls p75 field data, then runs a lab trace to name the LCP element. Suppose the trace shows the hero chart rendering late because the main chunk is large and render-blocking. That is a JavaScript-size problem, so the next step is the bundle.

**Step 2, prompt:** "Analyze the production bundle for /dashboard and rank what to cut."

bundle-analyzer builds for production and returns a ranked plan:

```text
Bundle analysis — route /dashboard (First Load JS: 412 KB gzip → target 180 KB)
1. moment + moment-timezone .................. 71 KB  [HIGH]
   Imported in 3 files for formatting only. Replace with date-fns
   named imports (tree-shakeable). Est. -64 KB. Effort: M, Risk: low.
2. Duplicate react (18.2.0 + 18.3.1) .......... 44 KB  [HIGH]
3. recharts loaded eagerly in entry chunk ..... 38 KB  [HIGH]
...
Estimated total reduction: ~198 KB gzip (412 → ~214 KB).
```

**Step 3:** apply the top three cuts one at a time, rebuilding after each to confirm the measured size dropped.

**Step 4, prompt:** "Re-check LCP for /dashboard."

web-vitals-optimizer re-runs the lab trace to confirm the mechanism (the LCP element now paints earlier) and states the field target to watch: p75 LCP within 2.5 seconds. Only the field number confirms the fix, and RUM shows it sooner than CrUX.

| | Before | After the plan |
| --- | --- | --- |
| First Load JS (gzip), from the skill's example | 412 KB | about 214 KB |
| Lab check | Hero chart blocked by main chunk | Chart chunk loads on demand |
| Field check | p75 LCP failing | Watch p75 LCP against 2.5 s |

## 1. web-vitals-optimizer: field data decides

[web-vitals-optimizer](/skills/performance/web-vitals-optimizer) writes down the failing metric and the gap to target before opening a file. Targets are LCP within 2.5 seconds, CLS of 0.1 or less, and INP of 200 milliseconds or less, at the 75th percentile. Per metric it applies one fix: for LCP, remove `loading="lazy"` from the hero image, add `fetchpriority="high"`, preload it, and right-size the format; for CLS, reserve space with `width`, `height`, or `aspect-ratio` and stop late insertions above content; for INP, split long tasks, yield to the main thread, and defer heavy third-party scripts.

Output per metric: the named culprit, the fix as an edit, and how to verify. It will not chase a higher Lighthouse score for its own sake.

## 2. bundle-analyzer: measured bytes, ranked cuts

[bundle-analyzer](/skills/performance/bundle-analyzer) always measures the production build and compares gzip or brotli sizes. It uses the analyzer the project already has, maps large modules back to npm packages, runs `npm ls`, `pnpm why`, or `yarn why` to find duplicate versions, and checks for missing code-splitting, polyfills aimed at dropped browsers, and server-only modules imported from client components. Every finding cites the measured pre-change size, and anything it could not measure is flagged.

It warns that tree-shaking only works on side-effect-free ESM, so importing one helper from a CommonJS package can still ship the whole library.

## 3. react-render-profiler: one cause, one fix

[react-render-profiler](/skills/performance/react-render-profiler) records the slow interaction in the React DevTools Profiler with "Record why each component rendered" turned on, then classifies each culprit: state held too high, unstable prop identity, context churn, expensive render work, or a long unvirtualized list. State problems are fixed by moving state down, before any memoization. It re-records and reports render counts before and after, with a kept or reverted verdict per fix.

> "Typing in the filter re-renders all 400 rows. Profile it and fix the cause."

Its position on `memo`, `useMemo`, and `useCallback` is that each costs a comparison and retained memory on every render, so none is added without a Profiler reading that justifies it.

## 4. flamegraph-analyzer: find the widest leaf

[flamegraph-analyzer](/skills/performance/flamegraph-analyzer) captures a sampling profile under a production-like workload with the tool for the runtime: `perf record -F 99 -g` on Linux, async-profiler on the JVM, `py-spy record` for Python, `go tool pprof` for Go, or `--cpu-prof` for Node. It reads width as time in a frame and its callees, and the y-axis as stack depth, not a timeline. Hotspots are ranked by self-time, and each is classified as unnecessary work, redundant work (called too often), or an algorithmic problem.

> "The nightly export job takes 40 minutes at 100% CPU. Profile it and tell me where the time goes."

It optimizes the single largest contributor and then profiles again from scratch, because the bottleneck moves after every fix. The report includes capture conditions, hotspots with their share of samples, the proposed fix, and the re-profile result.

## 5. memory-leak-hunter: growth that never plateaus

[memory-leak-hunter](/skills/performance/memory-leak-hunter) first drives a steady, repeating workload and records RSS and heap-used at intervals with forced GC between samples. Growth during warmup or cache fill is expected; a leak is growth under constant load that does not recover. It then takes two heap snapshots spaced apart (`v8.writeHeapSnapshot()` in Node, `jmap` on the JVM, `tracemalloc` in Python), diffs them, and sorts by what grew in count and retained size. The retention path is followed to the root holding the reference: an unbounded cache, a listener never removed, a timer never cleared.

> "Memory on the API pods climbs about 50 MB an hour until they restart. Confirm whether it's a leak and find it."

The fix bounds the lifetime at that root (eviction or TTL, unsubscribe, a weak reference), and the same workload is re-run to confirm a plateau.

## 6. cold-start-optimizer: split init into phases

[cold-start-optimizer](/skills/performance/cold-start-optimizer) forces a cold start and attributes milliseconds to four phases: runtime boot, dependency and module load, framework init, and first-connection setup. From the skill's example breakdown:

```text
Total cold init: 2,840 ms   (warm: 38 ms)
  runtime boot ................   210 ms   7%   (platform; fixed)
  dependency/module load ......  1,520 ms  54%  <- DOMINANT
  framework init ..............    180 ms   6%
  first-connection setup ......    930 ms  33%
```

Fixes follow the dominant phase: bundle and tree-shake the artifact, lazy-load heavy dependencies off the first-request path, construct clients at module scope but connect on first use, keep the per-instance connection pool at one or two, and sweep memory settings where CPU scales with memory. Provisioned concurrency comes last and only for paths that cannot tolerate any cold tail, because it hides a slow init and bills continuously.

## 7. load-test-designer: a test with a pass condition

[load-test-designer](/skills/performance/load-test-designer) builds a workload model from production logs: weighted journeys, payloads, and randomized think-time, preferring an open arrival-rate model. You pick one question per test: load (hold expected peak for 15-30 minutes), stress (ramp until it breaks), soak (hours at moderate load), or spike. It defaults to k6, with Locust or Gatling as alternatives, and encodes SLOs as thresholds so the run exits non-zero on breach:

```javascript
thresholds: {
  http_req_failed:   ["rate<0.001"],
  http_req_duration: ["p(95)<300", "p(99)<800"],
},
```

It requires a production-like, isolated environment and enough load generators that the client is not the bottleneck. Results are read by p95, p99, error rate, and the knee where latency starts climbing faster than load. It writes the design and script; you run the test.

## 8. cache-policy-designer: correctness first

[cache-policy-designer](/skills/performance/cache-policy-designer) inventories the cached object and every layer that can hold it, from browser and service worker through CDN, proxy, framework, application, and database. It specifies the full cache key including tenant, authorization class, and locale; sets max age from the business freshness bound; chooses revalidation, `stale-while-revalidate`, or `stale-if-error`; lists every invalidating write; and adds stampede controls such as request coalescing or jitter. Values that must never enter a shared cache are marked.

> "Design caching for GET /api/catalog. Prices change a few times a day and are different per region."

The output is a layer-by-layer policy with verification cases (hit, miss, invalidation, authorization variation, origin failure) and metrics. It will not add `public` caching or drop authorization from a key to raise hit rate.

## 9. prompt-cache-optimizer: keep the LLM prefix identical

[prompt-cache-optimizer](/skills/performance/prompt-cache-optimizer) first checks how your provider caches: automatic or explicit breakpoints, minimum cacheable length, cache window, and discount. Those rules differ per provider and change, so it reads them instead of assuming. It reorders the prompt static-to-dynamic, moves timestamps, request IDs, and per-user values out of the preamble, sets breakpoints where supported, and optionally adds a response cache for exact repeats.

> "Our support bot sends the same 6,000-token system prompt on every call. Restructure it for prompt caching and measure the hit rate."

It reports cache-hit rate, input-token cost, and time-to-first-token before and after. To put ceilings on LLM latency and cost afterwards, the [set-perf-budget](/commands/perf/set-perf-budget) command turns p95 and cost-per-request targets into a CI or runtime gate.

## Recommended performance stack

For a web application:

```bash
npx agentscamp add skills/web-vitals-optimizer
npx agentscamp add skills/bundle-analyzer
npx agentscamp add skills/load-test-designer
npx agentscamp add skills/cache-policy-designer
```

For a backend service, swap the first two for `flamegraph-analyzer` and `memory-leak-hunter`, and add `cold-start-optimizer` if it runs on serverless.

A finished performance report states the baseline, the workload, the evidence for the bottleneck, the exact change, the measurement after, and what got worse. Each of these skills produces most of that list by design.

## Continue exploring

- [9 Best Claude Skills for Frontend Development](/guides/skills/best-claude-skills-for-frontend-development) — The browser-side picks with the exact code changes each one makes, plus accessibility, localization, and testing.
- [Web Performance Budgets: Turn Speed Into a Release Gate](/guides/performance/web-performance-budgets) — Enforce Core Web Vitals, JavaScript, and third-party budgets in CI and production.
