---
name: "Base44"
description: "A Wix-owned AI app builder that turns a plain-English prompt into a working web app with database, auth, and hosting built in."
seoDescription: "Base44 for founders: what the Wix-owned AI app builder includes (database, auth, hosting, integrations), plans as of September 2026, and alternatives."
date: 2026-09-10
url: "https://base44.com"
pricing: "freemium"
category: "app-builder"
color: "purple"
os: ["Web"]
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
tags: ["app-builder", "no-code", "vibe-coding", "wix", "founders"]
featured: false
alternativeTo: ["lovable", "bolt", "softr"]
sameAs: ["https://docs.base44.com"]
related: ["guide:base44-vs-lovable", "guide:best-ai-app-builders-2026", "guide:claude-code-for-non-developers", "tool:lovable", "tool:emergent", "glossary:ai-app-builder"]
keywords: ["Base44", "AI app builder", "Wix Base44", "no-code app builder", "vibe coding"]
summary: "Base44 is a prompt-to-app builder owned by Wix since June 2025. You describe an app in plain English and it generates the interface, data model, and logic, with a managed backend, user authentication, hosting, and one-click integrations included, so a non-technical founder can ship an internal tool, portal, or MVP without wiring up any infrastructure."
faq:
  - q: "What is Base44?"
    a: "Base44 is an AI platform for building working apps from a text description. You type what you want, it generates the structure, design, and logic, and the app runs on Base44's own managed backend with a database, user authentication, email, payments, and hosting already connected. It is aimed at people who do not want to assemble those pieces themselves."
  - q: "Who owns Base44?"
    a: "Wix. Wix announced the acquisition on June 18, 2025, for initial consideration of approximately 80 million dollars plus earn-out payments through 2029. Base44 was founded by Maor Shlomo and continues to operate under its own name; the site footer reads Wix.com Ltd."
  - q: "How much does Base44 cost?"
    a: "As of September 2026 there is a free plan with 25 message credits a month and up to 5 apps, then Starter at 16 dollars, Builder at 40, Pro at 80, and Elite at 160 per month on annual billing (monthly billing costs about 20 percent more). Paid plans unlock unlimited apps, in-app code edits, AI model selection, and a custom domain; GitHub integration starts on Builder."
  - q: "Can I get the code out of Base44?"
    a: "Yes on paid plans. In-app code editing starts on Starter; GitHub integration and ZIP export need Builder or higher, per Base44's docs. Base44 also publishes an SDK, a CLI, and an MCP server for developers who want to work outside the visual builder."
---

Base44 is a prompt-to-app builder: you describe what you want in plain English and it generates the screens, the data model, and the logic, then runs the result on its own managed backend. The pitch is that nothing needs to be assembled. A database, user login, email, payments, file storage, and hosting are all there the moment the app exists, which is the part that usually stalls a non-technical founder on other tools.

Wix bought the company in June 2025, and Base44 now sits inside the Wix portfolio while keeping its own product and domain. For founders that mostly means a well-funded roadmap and a Wix-style emphasis on getting something live today rather than getting a codebase you will maintain.

## Highlights

- **Backend and storage built in.** Every app gets a managed database, authentication, and hosting without configuration. When the app is ready, it is instantly live on a Base44 URL, with custom domains on paid plans.
- **Payments, email, and analytics included.** You can charge customers directly through Base44, send email from the app, and watch usage from a built-in analytics and SEO dashboard.
- **One-click integrations.** Connect Google Calendar, Gmail, Slack, Notion, HubSpot, and Salesforce from inside the builder instead of through a separate automation tool.
- **AI agents inside your apps.** Base44 lets you build AI agents into the apps you generate, and its "Superagents" act across your connected tools on your behalf.
- **A developer path when you need it.** Starter adds in-app code editing and AI model selection; Builder and up add GitHub integration and ZIP export; the docs also cover an SDK, a CLI, and a Base44 MCP server.
- **Built for internal tools and portals.** The vendor's own examples are dashboards, customer portals, CRMs, training platforms, and trackers, which is a good guide to where it is strongest.

## In a founder's workflow

Base44 is the shortest path from "I need a tool for this" to a link you can send to a customer or teammate. A typical first build is an internal system of record that would otherwise live in a spreadsheet:

```text
Build a customer onboarding tracker. Customers sign in with email,
see their own checklist and uploaded documents, and get an email
when a step is marked complete. I need an admin view of all customers
with status filters and a CSV export.
```

Iterate in chat until the flows work, connect your domain, and share it. Because auth and the database are already wired, you spend your credits on product decisions rather than plumbing.

> [!TIP]
> Decide early whether the app is a throwaway or a keeper. If it is a keeper, move to the Builder plan or higher so GitHub sync captures the code from the start, then read the [Base44 vs Lovable comparison](/guides/comparisons/base44-vs-lovable) to understand what you are trading for the convenience.

The natural next step once an app outgrows the builder is to hand the repo to a developer, or to keep going yourself with an agent that edits real code. The [Claude Code for non-developers](/guides/founders/claude-code-for-non-developers) guide covers that transition; [Lovable](/tools/lovable) and [Emergent](/tools/emergent) are the closest alternatives if you would rather start on a mainstream, exportable stack from day one.

## Good to know

Base44 is a hosted web platform with no local install. As of September 2026 the free plan gives 25 message credits and 100 integration credits a month and up to 5 apps. Paid plans on annual billing are Starter at $16/month (100 message credits), Builder at $40 (250), Pro at $80 (500), and Elite at $160 (1,200); the vendor states that annual billing is a 20 percent discount on monthly rates. Message credits are consumed per AI turn, and integration credits meter connected-service calls, so a busy app with many integrations can run through the second pool faster than the first.

The trade-off is lock-in. The backend is Base44's, not a stack you pick, so a migration later means re-platforming rather than just moving a repo. Airtable-style operators who mainly need a front end on existing data will find [Softr](/tools/softr) a closer fit, and the [best AI app builders in 2026](/guides/comparisons/best-ai-app-builders-2026) roundup places Base44 against the full field. Wix acquired Base44 for initial consideration of approximately $80 million plus earn-outs through 2029, per the June 18, 2025 press release.
