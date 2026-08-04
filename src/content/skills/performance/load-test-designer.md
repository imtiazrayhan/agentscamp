---
name: "load-test-designer"
description: "Design a defensible load test — a realistic workload model, a deliberate test type, and SLO-tied pass/fail thresholds — instead of a meaningless tight-loop script that hammers one endpoint. Use when validating capacity or SLOs before a launch or scaling event, when sizing infrastructure, or when an existing load test reports averages that nobody trusts."
title: "Load Test Designer"
date: 2026-06-17
allowed-tools: "Read, Grep, Glob, Write"
user-invocable: true
version: "1.0.0"
color: "cyan"
topics: ["devops-infra"]
related: ["agent:sre-engineer", "agent:performance-engineer", "command:set-perf-budget"]
featured: false
summary: "Most load tests hammer one URL in a tight loop and report a flattering average — they prove nothing. This skill designs a defensible test: a realistic workload model, a deliberately chosen test type (load/stress/soak/spike), SLO-tied thresholds set before running, and an interpretation by percentiles and saturation rather than means."
---

Most "load tests" hammer a single endpoint in a tight loop with no think-time, run from one laptop, and report an average response time that makes everyone feel good and predicts nothing. This skill designs a load test you can actually defend in a launch review. It builds a workload model from the real traffic mix, picks the test type that answers your actual question (Will we survive peak? Where do we break? Do we leak under sustained load? Can we absorb a surge?), writes thresholds tied to your SLOs *before* the run so the test has a pass/fail answer, and produces a runnable script plus a guide to reading the results by percentile and saturation point.

## When to use this skill

- You have a launch, marketing event, sale, or migration coming and need numbers to prove the system survives expected peak.
- You need to size infrastructure (instance count, DB connection pool, autoscaling thresholds) and want evidence, not a guess.
- You want to find the breaking point — the concurrency or RPS at which latency or error rate falls off a cliff — before users do.
- An existing load test reports a single average latency and nobody believes it represents real traffic.
- You suspect a slow leak (memory, connections, file handles) that only appears after the system runs hot for an hour.

## Instructions

1. **Build a workload model from real traffic, not a single URL.** A load test that loops on `GET /health` measures your load balancer, not your system. Derive the endpoint mix from production access logs, APM, or analytics: which routes, in what proportion, with which payloads. Capture the *journey* (e.g. browse 60%, search 25%, add-to-cart 10%, checkout 5%) because checkout hits the DB and payment provider while browse hits a cache — they are not interchangeable load. Write the mix down as weighted scenarios with a representative, **distinct** data set (rotating user IDs, search terms, cart contents) so you exercise cache misses and row contention instead of the one hot row that gets cached after the first request.

2. **Add think-time between actions.** Real users pause to read, type, and decide. A closed-loop test with zero think-time generates a firehose no human population produces and tells you about your queueing behavior at an impossible arrival rate. Insert randomized think-time (e.g. 1–5s) between steps in a journey, and prefer an **open model** (specify arrival rate — new users per second) over a **closed model** (fixed VU count) when you are modeling a real-world population, because closed models artificially throttle load as the system slows.

3. **Pick the test type deliberately — it determines the shape, not just the size.** Choose one question per test:
   - **Load test** — sustain *expected peak* (e.g. Black Friday 1.5×) for 15–30 min. Answers "do we meet SLOs at peak?"
   - **Stress test** — ramp past peak until something breaks. Answers "where is the cliff, and how does it fail — graceful 503s or a cascading meltdown?"
   - **Soak test** — hold a moderate, realistic load for hours. Answers "do we leak memory/connections/handles, and does latency drift upward over time?"
   - **Spike test** — jump from baseline to a large surge in seconds, then drop. Answers "can autoscaling and queues absorb a sudden surge, and do we recover cleanly?"

4. **Choose the tool to match the model.** Use **k6** (JS scenarios, first-class thresholds, scriptable open/closed models) as the default; **Locust** (Python, good for complex stateful user flows); **Gatling** (Scala/JVM, strong reporting, high single-node throughput). Match the tool to the team's language and to whether you need a closed VU model or an open arrival-rate model — k6 `scenarios` with `ramping-arrival-rate` is the cleanest open model.

5. **Set pass/fail thresholds tied to actual SLOs — before you run.** A test with no threshold is a demo, not a test. Translate each SLO into a machine-checkable pass condition and encode it so the tool exits non-zero on breach (k6 `thresholds`, Gatling `assertions`). Example bar: `http_req_duration: p(95)<300 AND p(99)<800`, `http_req_failed: rate<0.001` (0.1% errors), and per-scenario thresholds for the expensive journey (checkout p95 < 1s). Define these from the SLO doc, not from whatever the first run happened to produce.

6. **Run against a prod-like, isolated environment from enough generators.** The environment must match production in the dimensions that saturate: instance size/count, DB tier and connection limits, cache size, and rate limits. Isolate it so you are not loading a shared staging DB that other teams use. Generate load from multiple machines (or a distributed runner / k6 Cloud / a fleet of generator nodes) and **monitor the generators' own CPU, network, and open sockets** — if a generator saturates, you measured the generator, not the target. Capture server-side metrics in parallel (CPU, memory, DB connections, queue depth, GC) so you can locate the bottleneck, not just observe that latency rose.

7. **Interpret by percentiles and the saturation point, not the average.** Read p95/p99 (and the max), error rate, and throughput together. The headline result is the **knee**: the load level where latency percentiles start climbing super-linearly and/or error rate crosses the threshold — that is your real capacity, and anything below it with headroom is the number you size to. Correlate the knee with a server-side resource hitting its limit (CPU pegged, connection pool exhausted, GC thrashing) to name the actual bottleneck.

> [!WARNING]
> The average latency hides the tail, and the tail is what pages you. A 50ms mean can sit on top of a 2s p99 — meaning 1 in 100 requests is 40× slower, which at scale is thousands of furious users. Never let an average be the pass/fail metric; gate on p95/p99 and error rate.

> [!WARNING]
> Load-testing a tiny staging environment tells you nothing transferable. A 1-instance, free-tier-DB staging box breaks at numbers that say nothing about your 12-instance production fleet, and the bottleneck (e.g. a 5-connection pool) may not even exist in prod. Test against prod-like capacity, or test prod itself in a maintenance window — not a toy.

> [!CAUTION]
> A single under-powered load generator caps your result: you will report the *client's* ceiling as the *server's*. If generator CPU or network is pegged, or you exhaust ephemeral ports, the numbers are invalid. Distribute generators and watch their own metrics; treat a saturated generator as a failed run, not a finding.

## Output

A complete, defensible load-test design, written as files plus an interpretation guide:

1. **Workload model** — a table of weighted scenarios with endpoint mix, payloads, think-time ranges, and the data set strategy.

```text
Scenario        Weight  Steps (think-time)                         Data
browse          60%     GET /  -> GET /p/{id}  (2-5s)              rotate 5k product IDs
search          25%     GET /search?q={term}  (1-3s)               2k distinct terms
add-to-cart     10%     POST /cart  (1-4s)                         rotate user + product
checkout         5%     POST /cart -> POST /checkout  (3-8s)       unique cart per VU
```

2. **Test type + tool + load profile** — which of load/stress/soak/spike, the tool, the model (open arrival-rate vs closed VU), ramp shape, and duration, with the one question the test answers.

3. **The threshold-bearing script** (e.g. k6) — runnable, with SLO-tied thresholds that fail the run on breach:

```javascript
export const options = {
  scenarios: {
    peak: {
      executor: "ramping-arrival-rate",
      startRate: 50, timeUnit: "1s",
      preAllocatedVUs: 500, maxVUs: 2000,
      stages: [
        { target: 300, duration: "3m" },   // ramp to expected peak
        { target: 300, duration: "20m" },  // hold at peak
        { target: 0,   duration: "2m" },   // ramp down
      ],
    },
  },
  thresholds: {
    http_req_failed:   ["rate<0.001"],                  // < 0.1% errors
    http_req_duration: ["p(95)<300", "p(99)<800"],      // SLO latency
    "http_req_duration{scenario:checkout}": ["p(95)<1000"],
  },
};
```

4. **How to read the results** — the percentile/error/throughput table to produce, where the saturation knee is, which server-side metric to correlate it with, and the explicit pass/fail call against the thresholds, plus the recommended capacity number with headroom.
