---
name: "Softr"
description: "A no-code builder for client portals and internal tools on top of Airtable, Google Sheets, or its own database, now with AI app generation."
seoDescription: "Softr for founders: build portals and internal tools on Airtable, Google Sheets, Notion, or Softr Databases, with AI app generation. Plans as of September 2026."
date: 2026-09-10
url: "https://www.softr.io"
pricing: "freemium"
category: "app-builder"
color: "blue"
os: ["Web"]
topics: ["ai-at-work", "workflow-prompting"]
audience: ["founders"]
tags: ["no-code", "internal-tools", "portals", "airtable", "founders"]
featured: false
alternativeTo: ["glide", "bubble", "base44"]
sameAs: ["https://docs.softr.io"]
related: ["guide:best-ai-app-builders-2026", "guide:claude-code-for-non-developers", "guide:automate-startup-ops-with-ai-agents", "tool:glide", "tool:bubble", "tool:base44", "glossary:no-code-ai"]
keywords: ["Softr", "no-code portal builder", "Airtable app builder", "internal tools", "AI app builder"]
summary: "Softr is a no-code builder for client portals, internal tools, and lightweight CRMs on data you already have, such as Airtable, Google Sheets, Notion, Supabase, or its own Softr Databases. Permissions, workflows, and forms are built in, and an AI app builder generates the interface, database, and workflows from one prompt. Every plan allows unlimited apps."
faq:
  - q: "What is Softr?"
    a: "Softr is a no-code platform for building secure portals and internal tools without a developer. You connect a data source or use Softr's own database, pick building blocks like lists, forms, and charts, set who can see what, and publish on a custom domain."
  - q: "What data can Softr connect to?"
    a: "Airtable, Google Sheets, Notion, Supabase, MySQL, and PostgreSQL, plus business tools such as HubSpot, monday.com, ClickUp, and Coda, with Salesforce on Enterprise. Softr Databases is the native option if you would rather not keep data elsewhere. Changes made in the app write back to the source."
  - q: "Does Softr have AI features?"
    a: "Yes. The AI app builder generates the interface, database, and workflows from a description, and Softr describes built-in AI agents that run in your databases and workflows. It also integrates OpenAI, Anthropic Claude, and Google Gemini models for AI steps inside your apps."
  - q: "How much does Softr cost?"
    a: "As of September 2026 the homepage lists four self-serve plans on annual billing: Free at 0, Basic at 19, Pro at 99, and Business at 329 dollars a month, all with unlimited apps, databases, workflows, and forms. Nonprofits and educational organizations get 50 percent off."
---

Softr is the app builder for founders whose data already lives somewhere. Where a prompt-to-app tool like [Base44](/tools/base44) invents a database for you, Softr assumes you have an Airtable base, a Google Sheet, a Notion workspace, or a Postgres table, and gives you a permissioned interface on top of it: a client portal, an internal admin tool, a team directory, an inventory view. Its own Softr Databases fill the gap when you would rather keep the data inside the product.

The company now describes itself as an AI-native platform that can generate a complete, connected app from a single prompt, and its site advertises built-in AI agents. The AI layer is an accelerator on top of the same building-block model, so what you get is still a conventional Softr app you can adjust visually afterward.

## Highlights

- **Data sources you already use.** Airtable, Google Sheets, Notion, Supabase, MySQL, and PostgreSQL, plus HubSpot, monday.com, ClickUp, and Coda; Salesforce is available on Enterprise. Softr Databases is the native store.
- **Permissions as a first-class feature.** User groups and per-record visibility rules are the core of the product, which is why client portals are its signature use case.
- **AI app builder.** Describe what you need and Softr generates the interface, database, and workflows, then hands you the editor.
- **Workflows and AI agents built in.** Automate steps inside the app, or pair Softr with Make, Zapier, or [n8n](/tools/n8n) for anything that reaches outside it. Softr lists OpenAI, Anthropic Claude, and Google Gemini as connectable AI models.
- **Unlimited apps on every plan.** The vendor states that every plan, including Free, includes unlimited apps, databases, workflows, and forms.
- **Mobile through PWA.** Softr's mobile option turns an app into an installable progressive web app rather than a native store listing.

## In a founder's workflow

The classic Softr pattern is the customer portal you would otherwise handle over email. Keep the operational data in Airtable or Softr Databases, then give each customer a login that shows only their records:

```text
Build a client portal on my Airtable base "Projects". Clients log in
and see only their projects, milestones, invoices, and shared files.
Add a request form that creates a new record with the client's email
attached, and an internal admin page with all projects and filters.
```

Because writes go back to the source, your team keeps working in Airtable while customers see a clean app. When you need something to happen outside the app, such as a Slack alert or a follow-up email, trigger it from Softr's workflows or from [Zapier Agents](/tools/zapier-agents).

> [!TIP]
> Model the data before you generate the app. Softr's AI builder produces much better results from a base with sensible tables and relationships than from a single flat sheet, and permissions are far easier to reason about when each entity has its own table.

## Good to know

Softr is a hosted web platform. As of September 2026 its homepage lists four self-serve plans on annual billing: Free at $0, Basic at $19, Pro at $99, and Business at $329 per month, with a 50 percent discount for nonprofits and educational organizations; monthly billing and per-plan user limits are on the pricing page. Custom domains and publishing are covered in the docs' publishing section.

The limit to keep in mind is that Softr is an interface and permission layer, not a general application runtime. Complex multi-step logic, custom algorithms, or a public consumer product with its own scaling needs push you toward [Bubble](/tools/bubble) or toward real code. [Glide](/tools/glide) is the closest sibling: also spreadsheet-backed, with a stronger tilt toward mobile-friendly field apps. For the broader category see the [no-code AI](/glossary/no-code-ai) glossary entry, and for the moment you outgrow all of these, [Claude Code for non-developers](/guides/founders/claude-code-for-non-developers).
