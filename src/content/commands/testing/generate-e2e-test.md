---
description: "Scaffold a resilient end-to-end test for a user flow grounded in the real UI."
seoDescription: "/generate-e2e-test scaffolds a resilient end-to-end test for a user flow, grounded in the real UI — a Claude Code slash command for E2E coverage."
date: 2026-06-17
argument-hint: "<user flow to test>"
allowed-tools: "Read, Write, Glob, Grep"
title: "Generate E2E Test"
color: "purple"
topics: ["review-qa"]
related: ["write-tests", "flaky-test-hunt", "test-engineer"]
featured: false
summary: "Scaffolds a resilient end-to-end test for a described user flow: detects the repo's E2E framework (Playwright/Cypress) or recommends one, reads the actual routes and UI to ground selectors, then writes a test using role/text/test-id locators, web-first auto-waiting assertions, and API-based setup/teardown — covering the happy path plus one key failure case."
faq:
  - q: "Why use API setup instead of clicking through the prerequisite steps in the UI?"
    a: "Driving prerequisites through the UI (logging in, seeding a record, navigating five screens) multiplies the test's surface area and runtime — a flake in any setup click fails a test that wasn't even exercising that flow. Creating state via API or a fixture is faster and isolates the test to the one behavior it asserts. Only drive through the UI the exact steps the test is verifying."
  - q: "Should every important flow get an E2E test?"
    a: "No. E2E is the slowest, flakiest, most expensive layer — keep it thin. Cover a few critical end-to-end journeys (signup, checkout, the core job-to-be-done) and push everything else down to integration and unit tests, which run faster and pinpoint failures better. A suite that's mostly E2E is a suite that's mostly red for the wrong reasons."
---

Scaffold one resilient end-to-end test for the user flow described in `$ARGUMENTS` (e.g. `"sign up, verify email, then create a project"`). The goal is a test that fails only when the flow is actually broken — not when a class name changed or a request was 50ms slow.

If `$ARGUMENTS` is empty, ask one question: *which user flow should the test cover, end to end?* Do not guess a flow.

> [!WARNING]
> The two top causes of E2E flake are **brittle selectors** (CSS like `.btn-primary > div:nth-child(2)`) and **fixed sleeps** (`waitForTimeout(2000)`). This command refuses both. Every locator targets a role, visible text, or a `data-testid`; every wait is a web-first assertion that auto-retries on a real condition.

## Step 1 — Detect the framework

Find what the repo already uses instead of imposing one.

1. `Glob` for config and specs: `**/playwright.config.{ts,js}`, `**/cypress.config.{ts,js}`, `cypress/`, `**/*.{spec,e2e}.{ts,js}`, `**/e2e/**`.
2. `Grep` the manifest (`package.json`) for `@playwright/test`, `cypress`, `webdriverio`, `puppeteer`.
3. Read the existing E2E config + one neighboring spec to learn the project's conventions: base URL, test directory, fixtures, custom commands, and the locator/test-id attribute already in use (`data-testid`, `data-test`, `data-cy`).

> [!NOTE]
> If no E2E framework exists, recommend **Playwright** (built-in auto-waiting, role locators, trace viewer, parallelism) and state the install command — but do not add dependencies yourself. Generate the spec in Playwright syntax and tell the user to run `npm init playwright@latest` first.

## Step 2 — Ground the test in the real UI

A test built from imagined selectors is worthless. Read what actually renders.

1. From the flow in `$ARGUMENTS`, identify each screen/route involved and `Grep`/`Glob` for the route definitions, page components, and forms (`**/routes/**`, `**/pages/**`, `**/app/**`, `<form`, `<button`, `role=`, `aria-label`, `data-testid`).
2. For each step, record the **real** anchor for each element you'll interact with, in this priority order:
   - Accessible role + name: `getByRole('button', { name: 'Sign up' })`.
   - Visible label/text: `getByLabel('Email')`, `getByText('Verify your email')`.
   - A `data-testid` that already exists in the markup.
3. If a critical element has no stable handle (no role, label, text, or test-id — only a generated class), note it in the Report and add a `data-testid` recommendation. Do not fall back to a positional CSS selector.

## Step 3 — Plan setup, the path, and teardown

Decide what to drive through the UI versus what to create out-of-band.

- **Setup via API/fixtures, not clicks.** Establish prerequisite state (an authenticated user, an existing org, a seeded record) by hitting the app's API or a test fixture/factory. The UI should only exercise the steps the test is *asserting*.
- **The flow itself** is the only part driven through the browser, step by step, as a real user would.
- **Teardown** removes the data the test created (delete the user/project via API) so reruns are idempotent and don't collide on unique constraints (e.g. duplicate email).

## Step 4 — Write the test

Produce one spec in the detected framework, following these rules without exception.

- **Locators:** role / text / label / test-id only. Never `nth-child`, never a brittle CSS chain, never XPath.
- **Waits:** web-first, auto-retrying assertions (`await expect(locator).toBeVisible()`, `toHaveURL`, `toHaveText`). Zero `waitForTimeout` / `sleep` / fixed delays.
- **Isolation:** the test sets up everything it needs and cleans up after itself; it must not depend on another test having run first or on leftover data.
- **One flow per test**, with a name stating the journey and outcome (e.g. `new user can sign up, verify email, and create their first project`).

```ts
import { test, expect } from "@playwright/test";
import { createUser, deleteUser } from "./helpers/api";

test("new user can sign up and create their first project", async ({ page, request }) => {
  // Setup via API — not by clicking through an admin screen.
  const user = await createUser(request, { plan: "free" });

  await page.goto("/signup");
  await page.getByLabel("Email").fill(user.email);
  await page.getByLabel("Password").fill(user.password);
  await page.getByRole("button", { name: "Create account" }).click();

  // Web-first assertion auto-waits for navigation — no sleep.
  await expect(page).toHaveURL(/\/onboarding/);
  await page.getByRole("button", { name: "New project" }).click();
  await page.getByLabel("Project name").fill("Launch plan");
  await page.getByRole("button", { name: "Create" }).click();

  await expect(page.getByRole("heading", { name: "Launch plan" })).toBeVisible();
});
```

## Step 5 — Cover one key failure case

A flow that only tests the happy path lies. Add **one** high-value negative or edge case for this flow — the one most likely to break a real user:

- Invalid input rejected with the expected error (duplicate email, wrong password, validation message visible).
- A guarded step blocked (unverified email can't reach the dashboard; unauthenticated user is redirected to login).

Assert the *specific* failure surface (the error text, the blocked URL), not merely that "nothing happened."

> [!NOTE]
> Keep E2E thin. This command writes one happy path plus one failure case for the named flow — not a matrix of every input. Logic-level branches belong in unit/integration tests, which run faster and point at the exact broken function. If you find yourself wanting ten E2E variants, push nine of them down a layer.

## Report

Deliver as your message:

- **Framework:** detected (and version) or recommended, with the install command if none existed.
- **File written:** the absolute path of the new spec.
- **Coverage:** the happy-path journey and the one failure case, each in a sentence.
- **Run command:** the exact invocation (e.g. `npx playwright test path/to/spec.ts --headed`).
- **Gaps:** any element that lacked a stable locator, with the `data-testid` you recommend adding.

End with the single command to run the new test.
