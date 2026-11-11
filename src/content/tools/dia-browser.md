---
name: "Dia"
description: "Dia is The Browser Company's Chromium browser, now part of Atlassian, with a chat sidebar that reads your tabs and connected work apps, plus local memory."
seoDescription: "Dia browser in 2026: Atlassian ownership, free on Mac and Windows, connected work apps, local memory, paid plans as of October 2026, and Arc's status."
date: 2026-10-15
url: "https://www.diabrowser.com"
pricing: "freemium"
category: "browser"
color: "pink"
os: ["macOS", "Windows"]
topics: ["ai-at-work"]
audience: ["founders", "marketers"]
tags: ["dia", "dia-browser", "ai-browser", "the-browser-company", "atlassian", "arc"]
featured: false
alternativeTo: ["perplexity-comet", "claude-for-chrome"]
sameAs: ["https://x.com/diabrowser", "https://www.linkedin.com/company/the-browser-company/", "https://en.wikipedia.org/wiki/Dia_(web_browser)", "https://thebrowser.company/"]
related: ["tool:perplexity-comet", "tool:claude-for-chrome", "tool:granola", "guide:best-ai-browsers-2026", "guide:defending-prompt-injection", "glossary:agentic-browser", "glossary:prompt-injection"]
keywords: ["Dia browser", "Dia AI browser", "The Browser Company Dia", "Atlassian Dia", "Arc browser successor", "Dia Windows"]
summary: "Dia is a Chromium browser from The Browser Company, part of Atlassian since October 2025, built around a chat sidebar that reads your open tabs and connected work apps such as Slack, Notion and Jira. It adds local memory and a daily Morning Brief, mixes OpenAI, Anthropic and Google models, and is free on macOS and Windows with paid tiers rolling out."
faq:
  - q: "Who owns Dia?"
    a: "Atlassian. The Browser Company of New York, which also made Arc, announced on September 4, 2025 that Atlassian was acquiring it, and the deal closed on October 21, 2025. Dia's security FAQ now says The Browser Company is part of Atlassian and that Dia uses Atlassian to sign you in. The company still lists both Dia and Arc, but Arc's site says it receives Chromium updates only and points people to Dia."
  - q: "Is Dia free?"
    a: "The browser is. Dia's site says to download it for free on macOS and Windows, and the free plan is called Better Browser. As of October 2026 the plans page lists Better Days at $100 per month with 6x more tasks and chats and the daily Morning Brief, sells extra usage in $20 blocks, gives every new user a 14-day trial of Better Days with no credit card required, and shows two different prices for the middle Better Answers tier, so see the vendor's plans page for that one. Paid plans started with new Mac users and are not yet offered on Windows."
  - q: "Is Dia available on Windows?"
    a: "Yes. Dia for Windows reached version 1.0 on October 6, 2026 after a staged rollout, and version 1.2.0 on October 15, 2026 brought Skills to Windows. There is no Linux build and no Dia mobile app; Arc Search is the legacy mobile app linked from Arc's site."
  - q: "What happened to Arc?"
    a: "Arc is in maintenance. Its homepage says Arc receives Chromium updates only, and that for active security patches and enterprise-grade protection you should download Dia instead, which it calls the next evolution of Arc. The Browser Company has not announced a shutdown date on the pages we read."
---

Dia is what The Browser Company built after Arc: a Chromium browser whose main feature is a chat sidebar that knows what is in your tabs and, with your permission, what is in your work apps. Ask it to summarise a thread, pull the decision out of three Slack channels and a Notion page, or draft a reply using the calendar invite and last week's [Granola](/tools/granola) notes, and it works from that context rather than from a web search. Since October 2025 the company has been part of Atlassian, which explains the Jira and Confluence connectors and the enterprise controls that arrived with them.

It is aimed at knowledge workers whose day is scattered across SaaS tabs: founders, marketers, product people. It is not, as of October 2026, an agent that drives the cursor; Dia's pages advertise no browse-and-click mode, and the model acts through connected-app tools and chat. That makes it a different bet from [Comet](/tools/perplexity-comet) and [Claude in Chrome](/tools/claude-for-chrome), both covered in the [best AI browsers roundup](/guides/comparisons/best-ai-browsers-2026).

## Highlights

- **Free on macOS and Windows.** The homepage says "Download Dia for free. Available for macOS and Windows"; Windows reached 1.0 on October 6, 2026.
- **Connected apps.** Dia's apps page lists Slack, Gmail, Google Calendar, Google Drive, Notion, Jira, Confluence, Amplitude, Granola, Loom, GitHub, LinkedIn, Linear, Figma and Teams, and the homepage says it "gathers what's scattered across your tools".
- **Morning Brief.** A daily brief that "lays it all out (calendar, inbox, key links)", included with the top paid tier.
- **Three model families.** Dia's security page names "GPT (OpenAI Azure), Claude (Anthropic, Vertex, AWS), Gemini (Vertex)", with small on-device models routing requests to a provider.
- **Local memory.** "Memory allows you to ask Dia about your previous activity"; it is stored locally on your device and can be disabled.
- **Skills, Profiles, Splits and Decks.** Custom Skills on Mac and now Windows, separate Profiles, side-by-side Splits, and Decks: "Ask Dia for a deck and your scattered context becomes real slides".
- **Private by default.** Ads are blocked natively, Sync is end-to-end encrypted, and Dia says it has zero-data-retention agreements with all its model partners.
- **Enterprise controls.** SAML SSO through Google, Okta and Entra, Chromium enterprise policies, and MDM controls that can disable all AI features on specific websites.

## In an AI-assisted workflow

Dia's strength is the brief, not the click. A founder on a Monday morning (an invented example) might ask the sidebar:

```text
Using my calendar, Slack and the Granola notes from last week's customer
calls, give me a brief for today's 10am with Acme: who is attending, what
we promised them last time, and any open Jira tickets tagged with their
account. Link each item to its source. Do not send anything.
```

Treat the result as a draft and open each linked source before you act on it; the value of the connected-app model is that the sources are one click away. For the meeting itself, Granola or another notetaker from the [meeting note takers roundup](/guides/comparisons/best-ai-meeting-note-takers-2026) produces the record Dia reads next week.

> [!NOTE]
> Two data defaults are worth changing deliberately. Content-data sharing to improve Dia is on by default, retained for 30 days, and can be turned off by the user or the organization; Dia says partners are contractually restricted from retaining or training on your data. Memory is stored locally and can be disabled too.

## Good to know

As of October 2026 Dia's plans page lists Better Browser as free and Better Days at $100 per month with usage limits, sells extra usage in $20 blocks, gives every new user a 14-day trial of Better Days with no credit card required, and shows two different prices on the same page for the middle Better Answers tier, so see the vendor's plans page for that one. The plans FAQ says paid plans began rolling out to most new Mac users on August 17, with no year on the page, and that Windows users cannot buy them yet; as of October 2026 the plan cards still carry a Join the Waitlist button, consistent with a staged rollout. Dia for Work has SOC 2 Type II coverage for calendar year 2025 and an enterprise waitlist of its own as of October 2026.

On security, Dia's own bulletin is unusually candid. Its `fetch_web_content` feature "could be exploited for data exfiltration via prompt injection", so the team removed it before Dia's public launch in June 2025 and brought it back two months later "rebuilt from the ground up with architectural controls", adding that "our team was able to bypass every LLM-based detection mechanism we tried". There is a HackerOne program and yearly outside audits. The lesson generalises to every tool on this page: see [defending against prompt injection](/guides/ai-safety/defending-prompt-injection).

Dia ships for macOS and Windows only, with Mac 1.53.0 and Windows 1.2.0 both released on October 15, 2026, and no Linux or mobile build. Ownership is The Browser Company of New York, part of Atlassian since the acquisition closed on October 21, 2025; Arc, the company's earlier browser, now "receives Chromium updates only".

Against the alternatives: [Perplexity Comet](/tools/perplexity-comet) is free on four platforms, answer-engine-first, and has an assistant that acts inside tabs. [Claude in Chrome](/tools/claude-for-chrome) is an extension that clicks and types inside desktop Chrome on a paid Claude plan. Dia needs no model-vendor subscription, mixes OpenAI, Anthropic and Google models, and reads your work apps rather than driving your cursor. Pick it if your work lives in Slack, Notion and Jira and you want the browser to understand that, not to act in it.
