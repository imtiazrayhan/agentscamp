---
name: "Replit Agent"
description: "Replit's AI agent that builds, runs, and deploys full-stack apps from a prompt inside the Replit cloud IDE."
date: 2026-06-03
updated: 2026-09-10
reviewed: 2026-09-10
url: "https://replit.com"
pricing: "freemium"
category: "app-builder"
color: "orange"
topics: ["coding-languages"]
tags: ["cloud-ide", "agent"]
featured: false
related: ["tool:bolt", "tool:lovable", "tool:v0"]
alternativeTo: ["bolt", "lovable", "v0", "devin"]
summary: "Replit Agent is the AI builder inside Replit's browser-based cloud IDE: describe an app and it scaffolds the project, writes code, installs packages, runs it, and deploys to a live URL with database, auth, and hosting provisioned for you. Agent 4 adds a Design Canvas, concurrent task forks, and checkpoint-based effort billing on freemium plans."
faq:
  - q: "What is Replit Agent?"
    a: "Replit Agent is the AI builder inside Replit's browser-based cloud IDE. You describe an app in plain language and the agent scaffolds the project, writes the code, installs packages, runs the app, and can publish it to a live URL — with database, auth, hosting, and monitoring provisioned for you. The current generation is Agent 4."
  - q: "How much does Replit Agent cost?"
    a: "Pricing is freemium, as of September 2026 from replit.com/pricing. The free Starter tier includes daily Agent credits and lets you publish one live project. Core is $20/month, or $18/month billed annually, and adds more agent usage plus $20 toward the most powerful models, plan mode, and unlimited workspaces. Pro is $100/month, or $90/month annually, with $100 toward the most powerful models, 10 parallel agents, up to 15 collaborators, 50 viewers, and database rollback up to 28 days. Enterprise is custom, adding SSO/SAML, advanced privacy controls, single-tenant environments, and static outbound IPs."
  - q: "Do Replit credits roll over?"
    a: "On Core, no — credits are a shared pool covering Agent runs, hosting, database compute, and data transfer, and they expire each billing cycle. Replit bills per checkpoint with effort-based pricing: simple edits are cheap, while complex multi-component builds cost proportionally more."
audience: ["founders"]
---

Replit Agent is the AI builder inside Replit's browser-based cloud IDE. You describe an app in plain language and the agent scaffolds the project, writes the code, installs packages, runs the app, and can push it to a live URL — all without leaving the browser or configuring a local environment. The infrastructure (database, auth, hosting, monitoring) is provisioned for you, so a prompt can go from idea to deployed app in one session.

It is aimed at builders who want the whole loop — generation, execution, and hosting — in one place: founders prototyping a product, non-developers shipping internal tools, and developers who want a throwaway environment that is already wired up. The current generation ships as **Agent 4**.

## Highlights

- **Prompt to running app** — describe what you want and the agent generates a full-stack project, installs dependencies, and runs it so you can see it working immediately.
- **Built-in deployment and hosting** — publish to a live URL, attach a custom domain, and let Replit handle scaling, with auth and a PostgreSQL database available out of the box.
- **Design Canvas** — Agent 4 adds an infinite design board for tweaking layouts and UI visually while the agent builds other parts of the app concurrently; changes apply directly to the codebase.
- **Concurrent task execution** — Agent 4 splits work into independent forks that run in parallel (authentication, database, frontend), then merges the results, so complex apps build faster.
- **Checkpoints** — the agent works in reviewable steps you can roll back to, with effort-based billing per checkpoint (simple changes cost less; complex multi-step tasks are bundled into a single, proportionally priced checkpoint).
- **Integrations** — connect to external services (Stripe, OpenAI, Notion, Linear, and others) so generated apps can call real APIs through a credential-management UI rather than manual key pasting.

## In an AI-assisted workflow

Replit Agent fits the "zero to deployed" end of the spectrum, where you want infrastructure handled for you rather than editing files on your own machine. A typical loop is to prompt the agent for a first version, watch it build and run, then iterate in plain language and ship.

```text
Build a feedback board where users sign in, post ideas,
and upvote them. Use a Postgres table for ideas and votes,
then deploy it.
```

The agent scaffolds the app, provisions the database, runs it for review, and — once you confirm — publishes it to a live URL.

> [!TIP]
> Treat the first prompt like a spec: name the data model, the auth requirement, and whether you want it deployed. The more concrete the prompt, the fewer checkpoints the agent burns getting there.

## Good to know

Replit runs entirely in the browser (plus a mobile app), so there is nothing to install. Pricing is **freemium**, as of September 2026 from replit.com/pricing: a free Starter tier includes daily Agent credits and lets you publish one live project, while **Core** ($20/month, or $18/month billed annually) adds more agent usage, **$20 toward the most powerful models**, plan mode, and unlimited workspaces. **Pro** ($100/month, or $90/month annually) raises that to **$100 toward the most powerful models**, 10 parallel agents, up to 15 collaborators plus 50 viewers, database rollback up to 28 days, and premium support. **Enterprise** adds SSO/SAML, advanced privacy controls, single-tenant environments, and static outbound IPs on custom pricing.

> [!WARNING]
> Credits are a shared pool covering Agent runs, hosting, database compute, and data transfer — and on Core they expire each billing cycle rather than rolling over. Replit uses effort-based pricing per checkpoint: simple edits are cheap, but complex multi-component builds cost proportionally more, so real monthly spend depends heavily on how much you build and how ambitious your prompts are.
