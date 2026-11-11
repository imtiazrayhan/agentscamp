---
name: "Profound"
description: "Enterprise AI-search visibility platform tracking prompts across up to nine answer engines, with citations, sentiment, prompt volumes, and AI-crawler analytics."
seoDescription: "Profound for marketers: prompt tracking across nine answer engines, prompt volumes, Agent Analytics, FactCheck, hosted MCP and API, trial and Enterprise plans."
date: 2026-10-16
url: "https://www.tryprofound.com"
pricing: "enterprise"
category: "marketing"
color: "purple"
os: ["Web"]
topics: ["ai-at-work"]
audience: ["marketers"]
tags: ["ai-visibility", "geo", "aeo", "citation-tracking", "answer-engines", "mcp", "enterprise"]
featured: false
alternativeTo: ["peec-ai", "surfer", "clearscope"]
sameAs: ["https://docs.tryprofound.com/", "https://www.tryprofound.com/newsroom", "https://www.linkedin.com/company/tryprofound/", "https://x.com/profound"]
related: ["tool:peec-ai", "tool:surfer", "tool:clearscope", "guide:best-ai-visibility-tools-2026", "guide:ai-content-and-search-2026", "guide:best-ai-tools-for-marketers-2026", "glossary:ai-visibility", "glossary:generative-engine-optimization", "glossary:answer-engine-optimization", "glossary:ai-overviews"]
keywords: ["Profound", "Profound AI visibility", "Profound pricing", "answer engine optimization platform", "Profound vs Peec AI"]
summary: "Profound is an enterprise AI-search visibility platform. It runs structured prompts daily across up to nine answer engines, reports where a brand is mentioned and cited, estimates prompt volumes, and tracks AI-crawler traffic. A free seven-day trial covers three engines; the rest is custom-priced Enterprise with an API and a hosted MCP server."
faq:
  - q: "What does Profound cost?"
    a: "Profound publishes no list price. As of October 2026 the brands tab of its pricing page shows two cards: a free Trial (50 prompts run daily for seven days across ChatGPT, Gemini, and Google AI Overviews, one language, one region, unlimited seats, no API) and Enterprise, which is custom-priced and adds up to nine engines, API access, CSV and JSON exports, ChatGPT Shopping tracking, and the MCP server. The agencies tab mentions a self-serve Agency Growth plan with 400 credits per month per client workspace, but the page does not render its price in a form we could read."
  - q: "Peec AI vs Profound?"
    a: "Profound is sold enterprise-only after a short free trial, tracks up to nine engines including Perplexity, Claude, Copilot, DeepSeek, and Exa, and bundles ChatGPT Shopping tracking plus a credit-metered marketing agent. Peec AI is self-serve with three monthly tiers plus Enterprise, unlimited users on every plan, up to 13 models on Enterprise, and an MCP server on the product. Both offer citation reports and server-log bot analytics; Profound's MCP and Peec's API are each Enterprise-only."
  - q: "Which AI engines does Profound track?"
    a: "The pricing table lists ChatGPT, Perplexity, Google AI Mode, Gemini, Microsoft Copilot, DeepSeek, Anthropic Claude, Google AI Overviews, and Exa Search, with up to nine tracked on Enterprise and daily tracking. The free trial covers ChatGPT, Gemini, and Google AI Overviews."
  - q: "Does Profound have an API or MCP server?"
    a: "Yes. Profound documents a REST API with SDKs, CSV and JSON exports, and a hosted MCP server at mcp.tryprofound.com/mcp whose tools cover visibility, sentiment, citations, shopping, agent analytics, workflows, prompts, and knowledge bases. The docs mark the MCP server as available on the Enterprise plan, and the trial has no API."
---

Profound is the AI-search measurement platform that large marketing teams have standardised on, and it is sold that way: a free seven-day trial, then a custom Enterprise contract. The product runs structured prompts across answer engines daily, records where and how a brand appears in the responses, and layers citation analysis, sentiment, prompt-volume estimates, and AI-crawler analytics on top. In 2026 it added credit-metered agents, branded AI Marketer, that act on that data. The company is based in New York; its newsroom lists a first round in August 2024, and its September 2026 Series D release says it "serves over 1,000 enterprise brands" and "over one third of the Fortune 100," which are vendor claims rather than audited figures.

For a marketing team the pitch is coverage and governance rather than price: more engines than the self-serve trackers, SKU-level shopping visibility, bot-traffic attribution, and the RBAC, SCIM, and SOC 2 Type II controls a security review asks for.

## Highlights

- **Answer Engine Insights.** Profound's own description of the method: it "runs structured prompts across AI platforms, analyzing where and how your brand appears in responses." The feature page lists Prompt Tracking, Query Fanout, Benchmarking, Sentiment, Citation Tracking & Analysis, FactCheck, and AEO Dashboards.
- **Up to nine engines on Enterprise.** The pricing table names ChatGPT, Perplexity, Google AI Mode, Gemini, Microsoft Copilot, DeepSeek, Anthropic Claude, Google AI Overviews, and Exa Search, tracked daily. The trial covers ChatGPT, Gemini, and Google AI Overviews only.
- **Prompt Volumes.** Estimates are "pulled from millions of conversations in answer engines like ChatGPT, Gemini, Claude, and Perplexity," and the API returns "weekly and monthly volume projections" per keyword. No standalone methodology page was found as of October 2026, so treat the numbers as modelled estimates.
- **Agent Analytics.** "See which AI systems are crawling your site, how they interpret content, and whether that activity is converting to real traffic." Integrations include Akamai, AWS, Cloudflare, Fastly, Google Analytics, Google Cloud, Netlify, Vercel, and WordPress, and Profound benchmarks citation performance "against 2 million+ pages."
- **FactCheck and Shopping.** FactCheck "shows you inaccurate claims and their sources, so your team can correct the narrative." ChatGPT Shopping tracking, Enterprise-only, gives "SKU-level granularity across merchants and retailers."
- **API and hosted MCP.** A REST API with SDKs, CSV and JSON exports, and a hosted MCP server at `mcp.tryprofound.com/mcp` that the docs mark as "available on the Enterprise plan," with tools for visibility, sentiment, citations, shopping, agent analytics, workflows, and knowledge bases.
- **AI Marketer.** Agents that "research, write, report, and collaborate," priced on credits rather than seats.

## In an AI-assisted workflow

Profound's MCP server is the piece that turns a dashboard into an input. Take a fictional example: Harrow & Finch, an invented B2B payroll vendor on an Enterprise plan, connects the hosted MCP to Claude Code and asks for a weekly pass over its tracked prompts.

```text
Using the Profound MCP tools, pull the citation report for our "payroll
software for small business" prompt group over the last 30 days. List the
domains cited where a competitor is named and we are not, group them by
page type (review site, vendor blog, forum, news), and draft three
content briefs for the gaps we can realistically fill. Put any FactCheck
items about our pricing in a separate list; do not invent figures.
```

The agent writes the briefs into the content repo, and the FactCheck list goes to whoever owns the pricing page. The [SEO content workflow with Claude Code](/guides/marketing/seo-content-workflow-with-claude-code) guide turns that into a repeatable command, and [AI content and search in 2026](/guides/marketing/ai-content-and-search-2026) covers what the briefs should ask for.

> [!TIP]
> Judge trends, not single runs. Answer engines vary from day to day, and Profound's own research hub publishes a study titled "Is once a day enough?" Compare a prompt group's citation share week over week before you act on a dip.

## Good to know

Profound publishes no self-serve list price. As of October 2026 the brands tab of the pricing page shows exactly two cards: a Trial, free, with 50 prompts run daily for seven days across ChatGPT, Gemini, and Google AI Overviews, one language, one region, unlimited seats, limited AI Marketer credits, and no API; and Enterprise, custom-priced, with up to nine engines, daily tracking, API access, CSV and JSON exports, ChatGPT Shopping, and the MCP server. The agencies tab describes a self-serve Agency Growth plan with 400 credits per month per client workspace, but its price does not render in a form we could read, so it is not quoted here. Self-serve tiers that third-party sites still describe are no longer on the vendor page.

Funding comes from the vendor newsroom: a $96 million Series C at a $1 billion valuation led by Lightspeed (February 24, 2026) and a $180 million Series D at a $1.8 billion valuation co-led by Sequoia Capital and Kleiner Perkins (September 15, 2026), which is the funding history as of October 2026. The Series C release says the company reached that point "one day shy of its 18-month anniversary," which places its start in late summer 2024; its co-founder and CEO is James Cadwallader. Profound is a web application with no mobile apps found on the vendor site. It describes itself as SOC 2 Type II certified with RBAC and SCIM, and lists "200+ integrations."

Against the alternatives: [Peec AI](/tools/peec-ai) is the self-serve counterpart, with published tiers, unlimited users on every plan, and up to 13 models on Enterprise, and it is a German company under German law, which matters to EU teams. [Surfer](/tools/surfer) and [Clearscope](/tools/clearscope) are content-optimization suites that added prompt tracking as a module; neither offers prompt-volume estimates or server-log bot analytics, and both publish self-serve prices. The [best AI visibility tools in 2026](/guides/comparisons/best-ai-visibility-tools-2026) roundup sets all nine trackers side by side, the [generative engine optimization](/glossary/generative-engine-optimization), [answer engine optimization](/glossary/answer-engine-optimization), and [AI Overviews](/glossary/ai-overviews) entries cover the vocabulary, and the [best AI tools for marketers in 2026](/guides/comparisons/best-ai-tools-for-marketers-2026) roundup places the category in the full stack.
