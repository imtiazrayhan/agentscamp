---
name: "Nooks"
description: "Nooks is an AI sales workspace for outbound teams: a parallel dialer with answer detection, AI sequencing, account research, signals and call coaching."
seoDescription: "Nooks for sales teams: why there is no public price as of September 2026, how the parallel AI Dialer works, and the mcp.nooks.in connector for Claude."
date: 2026-09-10
url: "https://www.nooks.ai/"
pricing: "enterprise"
category: "sales"
color: "orange"
os: ["Web"]
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["sales"]
tags: ["nooks", "parallel-dialer", "outbound", "mcp", "sales-coaching"]
featured: false
alternativeTo: ["outreach", "apollo"]
sameAs: ["https://www.nooks.ai/pricing", "https://claude.com/connectors/nooks"]
related: ["guide:claude-for-sales-teams", "guide:best-ai-sales-tools-2026", "tool:outreach", "tool:apollo", "tool:gong", "glossary:ai-sdr", "glossary:sales-engagement-platform"]
keywords: ["Nooks", "Nooks AI dialer", "parallel dialer", "Nooks pricing", "Nooks MCP server", "AI sales workspace"]
summary: "Nooks is an AI sales workspace built around outbound calling: a parallel dialer with automated answer detection and phone-tree navigation, plus AI sequencing, account research, signals and coaching with roleplay. It is explicitly human-in-the-loop rather than an autonomous calling bot, holds SOC 2 Type 2 and ISO 27001, and publishes no pricing at all."
faq:
  - q: "How much does Nooks cost?"
    a: "Nooks does not say. As of September 2026 its pricing page is contact-sales only, telling you to get in touch with the team for a custom quote. There are no tiers, no figures and no trial listed, which makes it the only tool in this set with no public price anchor of any kind and no self-serve way to evaluate it."
  - q: "Does Nooks make calls on its own?"
    a: "No, and it says so explicitly. The AI Dialer parallel-dials, detects answers automatically and navigates phone trees so a rep is connected to a live human rather than waiting through dial tones. The rep still has the conversation. Nooks positions this as human-in-the-loop rather than autonomous calling bots, which is a meaningful distinction for compliance review."
  - q: "Can I connect Nooks to Claude?"
    a: "Yes. Nooks has a Connectors Directory listing dated June 2026 and the endpoint is https://mcp.nooks.in/mcp. Note the .in domain, not .ai - it is easy to mistype and easy to assume the marketing domain also serves the API. The endpoint accepts POST only, which is the normal shape for a Streamable HTTP MCP server."
  - q: "Is Nooks being acquired?"
    a: "The opposite. Nooks is an acquirer: it published a post titled Why Nooks acquired FullyRamped on 25 August 2026. That matters in a category where several page-one names changed hands in 2026, because it means the product and the URL are more likely to be where you left them at renewal."
---

Nooks is what happens when a team decides the bottleneck is not the message but the connect rate. It is an AI sales workspace for outbound teams, and the centre of it is the AI Dialer: parallel dialling with automated answer detection and phone-tree navigation, so a rep spends the hour talking rather than listening to ringtones. Around it sit AI Sequencing, Signals, account research and AI Coaching with roleplay.

Read the positioning carefully, because it is unusually restrained for this category. Nooks explicitly describes the product as human-in-the-loop rather than autonomous calling bots. The machine dials, detects and navigates; the human talks. That is a claim your compliance reviewer will care about, and it is the opposite of what [Close](/tools/close)'s Chloe does.

Nooks holds SOC 2 Type 2 and ISO 27001. It is also an acquirer rather than a target — its post "Why Nooks acquired FullyRamped" is dated 25 August 2026 — which is worth something in a year when several names on every "best AI sales tools" list quietly changed owners.

## Can a Claude user connect it?

Yes. Nooks has a listing in Anthropic's Connectors Directory dated June 2026, and the endpoint is:

```text
https://mcp.nooks.in/mcp
```

Note the domain. It is `nooks.in`, not `nooks.ai` — the marketing site and the MCP host are different domains, which is easy to mistype and easier to assume away. The endpoint accepts POST only, the normal shape for a Streamable HTTP MCP server, so a browser GET telling you nothing is not evidence that it is down.

We do not publish a tool count for Nooks, because we have no first-party number we can cite. That is a deliberate omission rather than an oversight: across this category the directory count and the vendor's docs count frequently disagree, and a page that quotes a number without naming its source is guessing. We also make no claim about the listing's verification badge. Anthropic's directory does mark some connectors verified, but its own page says Anthropic "does not control which tools developers make available and cannot verify that they will work as intended or that they won't change".

What you can do with the connection is the interesting part. Dialer data is call-outcome data — connects, conversations, dispositions, coaching scores — and that is exactly the shape of question Claude answers well: which lists produce conversations rather than connects, which openers precede a booked meeting, which reps' roleplay scores predict live performance. [Claude for sales teams](/guides/sales/claude-for-sales-teams) walks through wiring a connector like this up and keeping it read-only while you learn what it returns.

## No price, and no way to try it

As of September 2026 Nooks' pricing page is contact-sales only: "Get in touch with the team to get a custom quote." No tiers, no figures, no trial.

That makes Nooks the least evaluable product in this set. [Gong](/tools/gong) also publishes no price, but it at least publishes the *shape* of the bill — per-user licences plus a platform fee. Nooks publishes neither, so budget planning starts with a sales call and you have no anchor to negotiate against. We publish no number here, and neither should any page that has not shown you a source.

Scope the compliance question in the same conversation. Parallel dialling multiplies outbound call volume by design, and call-recording consent, dialling regulations and per-state rules are the buyer's problem, not the vendor's. Ask how the dialer handles answer detection failures and what the abandoned-call behaviour is, before volume is your problem.

## Where it fits against the alternatives

Nooks is a specialist. If your team's constraint is orchestration across an enterprise motion, [Outreach](/tools/outreach) owns the whole workflow and puts real agents on it. If you need data and sequencing in one affordable seat, [Apollo](/tools/apollo) is the mid-market default. If you want the calls analysed rather than placed, [Gong](/tools/gong) is the layer above.

Nooks is not an [AI SDR](/glossary/ai-sdr) and does not claim to be; it is a force multiplier on human dialling, which is a narrower and more defensible claim than most of the category makes. The [best AI sales tools of 2026](/guides/comparisons/best-ai-sales-tools-2026) roundup sets it against the [sales engagement platform](/glossary/sales-engagement-platform) options that try to do everything.
