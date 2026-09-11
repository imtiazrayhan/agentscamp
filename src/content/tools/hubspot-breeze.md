---
name: "HubSpot Breeze"
description: "HubSpot's built-in AI: Breeze Assistant in every plan, pre-built Breeze agents for content, prospecting, and support, and a plain-language Agent Builder."
seoDescription: "HubSpot Breeze for marketers: Breeze Assistant, pre-built agents, Agent Hub and Agent Builder (July 2026), enrichment, and HubSpot Credits as of Sept 2026."
date: 2026-09-10
url: "https://www.hubspot.com/products/artificial-intelligence"
pricing: "freemium"
category: "marketing"
color: "orange"
os: ["Web", "iOS", "Android"]
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["sales", "marketers"]
tags: ["hubspot", "crm", "ai-agents", "marketing-automation", "breeze"]
featured: false
alternativeTo: ["claude-cowork", "zapier-agents", "lindy"]
sameAs: ["https://knowledge.hubspot.com/ai/use-breeze-assistant", "https://www.hubspot.com/products/artificial-intelligence/credits"]
related: ["guide:claude-code-for-marketers", "guide:best-ai-tools-for-marketers-2026", "guide:automate-startup-ops-with-ai-agents", "guide:claude-for-marketing-teams", "tool:claude-cowork", "tool:zapier-agents", "tool:lindy", "tool:copy-ai", "glossary:ai-agent"]
keywords: ["HubSpot Breeze", "Breeze Assistant", "HubSpot Agent Hub", "HubSpot AI agents", "HubSpot Credits"]
summary: "Breeze is HubSpot's AI. Breeze Assistant (formerly Copilot) ships with every HubSpot plan and works in the app, mobile apps, a Chrome extension, and Slack. Pre-built agents cover content, prospecting, support, data, campaigns, nurture, and revenue; Agent Hub and Agent Builder (July 2026) let Professional and Enterprise teams build custom agents on credits."
faq:
  - q: "What is HubSpot Breeze?"
    a: "Breeze is HubSpot's AI layer. It includes Breeze Assistant, a conversational assistant that answers questions, drafts content, summarizes records, and builds agents; pre-built agents such as the Content, Prospecting, Customer, Data, Campaign, Nurture, and Revenue agents; and, since July 2026, Agent Hub for managing agents and Agent Builder for creating custom ones. Data enrichment, buyer intent, and form shortening (previously marketed as Breeze Intelligence) sit alongside."
  - q: "Is Breeze Copilot the same as Breeze Assistant?"
    a: "Yes. HubSpot's community and knowledge base refer to Breeze Assistant as formerly Copilot. It is included with HubSpot subscriptions at no additional cost and the knowledge base lists it as available on all products and plans, with some features requiring additional subscriptions."
  - q: "How much do HubSpot's AI agents cost?"
    a: "Agents and several AI features run on HubSpot Credits. As of September 2026 HubSpot prices credits at 0.010 dollars each, sold up front in packs of 1,000 for 10 dollars or pay-as-you-go beyond the monthly allowance included with seats-based plans. HubSpot's example is the Customer Agent at 50 credits (50 cents) per resolved conversation. Data enrichment does not consume credits."
  - q: "Which HubSpot tiers include Agent Builder?"
    a: "HubSpot's knowledge base (July 2026) lists Agent Builder in the Professional and Enterprise editions of Marketing Hub, Sales Hub, Service Hub, Data Hub, Content Hub, and Smart CRM, with HubSpot Credits required. The Agent Hub product page separately says Agent Hub is included in all Starter, Professional, and Enterprise editions."
---

Breeze is HubSpot's umbrella name for its AI, and in 2026 it is three things: Breeze Assistant, the chat companion inside every HubSpot account; a set of pre-built Breeze agents that do specific jobs on your CRM data; and the new Agent Hub plus Agent Builder, announced July 23, 2026, where teams build their own agents by describing them in plain language. HubSpot's own framing is that agents get "shared context," meaning the contacts, deals, conversations, and content already in the CRM, with "no separate tools, no coding needed, no data to move."

For a marketer already running on HubSpot, that is the whole argument. The agent does not need an integration to know who a lead is.

## Highlights

- **Breeze Assistant everywhere.** Described as "your AI expert for every employee," it works in the HubSpot app, the iOS and Android apps, a Chrome extension, Slack, and Google Workspace and Microsoft 365. It is included with HubSpot subscriptions at no additional cost.
- **Pre-built agents.** The Agent Hub page lists a Content Agent ("blog posts, social content, and landing pages in your brand voice"), Prospecting Agent, Customer Agent, Data Agent, Campaign Agent, Nurture Agent, and Revenue Agent.
- **Agent Builder in plain language.** Describe the job to Breeze Assistant and it proposes the goal, tools, and knowledge sources. You then set instructions, actions (HubSpot, default, or MCP tools), knowledge, and inputs, and you can approve each action until you trust it.
- **Agent Hub for operations.** One place to see which agents are active, check performance, activate the ones you have not turned on, and set run limits that cap credit spend.
- **Data enrichment and buyer intent.** Enrichment fills company and contact records from HubSpot's dataset, form shortening hides fields it can already fill, and buyer intent flags companies showing signals. Enrichment does not consume credits; buyer intent and smart properties do.
- **Predictable metering.** HubSpot Credits are $0.010 each as of September 2026, bought in 1,000-credit packs for $10 or pay-as-you-go, with a published rate sheet per agent.

## In a marketer's workflow

The Content Agent and Campaign Agent are where most marketing teams start, but the more durable pattern is a custom agent that owns one recurring judgment call. HubSpot's builder wants a role, a goal, an approach, and an expected output, which is the same shape as a good Claude prompt:

```text
Role: campaign QA agent for the marketing team.
Goal: before any marketing email is scheduled, check it against
the brand guidelines in Knowledge and the offer terms on the
linked deal record.
Approach: read the draft, list every claim, verify each against
the knowledge source, and score tone against the guidelines.
Output: a pass/fail with the failing sentences quoted and a
suggested fix for each. Never edit the email directly.
```

Test runs do not consume credits; published runs do, so set a run limit before you switch it on. The [automate startup ops with AI agents](/guides/founders/automate-startup-ops-with-ai-agents) guide covers where approval gates belong in this kind of agent, and the [Claude Code for marketers](/guides/marketing/claude-code-for-marketers) pillar shows the same brief-and-check pattern for work that lives in files rather than in the CRM.

> [!NOTE]
> Breeze Assistant's content generation is rate-limited to 30 requests a minute and 1,000 a day per the knowledge base (updated August 17, 2026). Bulk jobs belong in an agent or a workflow, not in the assistant.

## Good to know

Breeze is not a separate product you buy; it is what HubSpot's AI is called across its hubs. The knowledge base lists Breeze Assistant as available on "all products and plans," with additional subscriptions required for certain features. Agent Builder requires Professional or Enterprise, and everything agentic runs on HubSpot Credits: seats-based plans include a monthly allowance, extra credits are $0.010 each (1,000 for $10) or pay-as-you-go as of September 2026, and HubSpot's rate sheet gives per-agent costs such as 50 credits per conversation the Customer Agent resolves. HubSpot's Breeze Intelligence Credits became HubSpot Credits in June 2025, so older pricing articles that mention the old name describe the same pool.

The comparison that matters is scope. Breeze is superb when the work is already in HubSpot and weak the moment it is not. [Claude Cowork](/tools/claude-cowork) is the choice when the job is documents, spreadsheets, and files on your own machine; [Zapier Agents](/tools/zapier-agents) and [Lindy](/tools/lindy) are the choices when the trigger or the action lives in a tool HubSpot does not own. [Copy.ai](/tools/copy-ai) overlaps on GTM workflows but brings its own data layer. The [best AI tools for marketers in 2026](/guides/comparisons/best-ai-tools-for-marketers-2026) roundup places them side by side, and the [AI agent](/glossary/ai-agent) entry explains the vocabulary HubSpot is borrowing.
