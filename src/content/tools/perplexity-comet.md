---
name: "Perplexity Comet"
description: "Comet is Perplexity's free Chromium browser with a built-in assistant that reads pages, works across tabs and runs agent tasks on Mac, Windows, iOS and Android."
seoDescription: "Perplexity Comet in 2026: what the free AI browser does, which agent features need Max, the Brave and Trail of Bits prompt-injection findings, and alternatives."
date: 2026-10-14
url: "https://www.perplexity.ai/comet"
pricing: "freemium"
category: "browser"
color: "cyan"
os: ["macOS", "Windows", "iOS", "Android"]
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["founders", "marketers", "developers"]
tags: ["comet", "perplexity", "ai-browser", "agentic-browser", "browser-agent", "prompt-injection"]
featured: false
alternativeTo: ["claude-for-chrome", "dia-browser"]
sameAs: ["https://x.com/comet", "https://en.wikipedia.org/wiki/Comet_(browser)", "https://comet-help.perplexity.ai/en/", "https://www.linkedin.com/company/perplexity-ai/"]
related: ["tool:dia-browser", "tool:claude-for-chrome", "tool:perplexity", "guide:best-ai-browsers-2026", "guide:browser-agents-compared-2026", "guide:defending-prompt-injection", "glossary:agentic-browser", "glossary:prompt-injection"]
keywords: ["Perplexity Comet", "Comet browser", "AI browser", "Comet Assistant", "agentic browser", "Comet prompt injection"]
summary: "Comet is Perplexity's Chromium-based browser with a sidebar assistant that reads the page you are on, works across your open tabs and can act for you: drafting email, comparing products, booking. It is free on Mac, Windows, iOS and Android, runs most Chrome extensions, and reserves Background Assistants and the Email Assistant for Perplexity Max subscribers."
faq:
  - q: "Is Comet free?"
    a: "Yes. Perplexity made Comet free for everyone worldwide on October 2, 2025, after a limited release that began on July 9, 2025, and the browser and its assistant stay free on every platform. What is not free: Background Assistants, which run many agent tasks in parallel, and the Email Assistant need a Perplexity Max subscription, and the Comet Plus publisher bundle is included with Pro and Max. For the Pro and Max plan prices, see the vendor's pricing page."
  - q: "Which platforms is Comet on?"
    a: "Mac, Windows, iOS and Android. Desktop shipped first, Android followed on November 21, 2025, and Perplexity launched Comet to all iOS users in March 2026, at which point it described Comet as available on all major platforms. No Linux build is listed, and desktop and mobile share data through Comet device sync."
  - q: "Is Comet safe to use?"
    a: "Treat its agent features as a risk you manage rather than a solved problem. Brave's researchers showed in August 2025 that hidden instructions in a Reddit comment could make Comet read a user's Perplexity email and a Gmail one-time code, and in October 2025 that near-invisible text inside an image could be processed as commands. Trail of Bits reported in February 2026 that its pre-launch audit found four prompt-injection techniques that could extract private information from Gmail. Perplexity has published a layered defence, including classifiers trained to detect malicious instructions, and open-sourced BrowseSafe. Keep the assistant paused on sites that hold money or credentials."
  - q: "What is Comet Plus?"
    a: "A subscription bundle that pays participating publishers for the content Comet users read, announced alongside the free launch. As of October 2026 Perplexity's announcement describes Comet Plus as a $5 standalone subscription that Pro and Max subscribers get included."
---

Comet is Perplexity's answer to the question of what a browser looks like when the address bar is an answer engine. It is a Chromium-based browser, so it runs most Chrome extensions and feels familiar, with Perplexity's assistant in a sidebar that can read the page you are on, pull together what is across your open tabs, and take actions on your behalf: draft a reply, compare three listings, fill in a booking form. Perplexity's own description is that you can see exactly what actions the Comet Assistant is taking and step in at any time, and there is a control to pause it.

Perplexity first launched Comet to limited release on July 9, 2025, made it free for everyone on October 2, 2025, shipped Android on November 21, 2025 and iOS in March 2026. That makes it the most widely available of the [AI browsers](/guides/comparisons/best-ai-browsers-2026) and the one security researchers have studied most, which cuts both ways.

## Highlights

- **Free on four platforms.** Perplexity's page says Comet is "Available for Mac, Windows, iOS, and Android", and the changelog entry for the free launch says it is "available to download for everyone in the world for free".
- **Chromium underneath.** Perplexity's help center describes Comet as "a Chromium-based browser that integrates advanced AI capabilities powered by Perplexity", with support for most Chrome extensions.
- **An assistant that acts in tabs.** The Comet Assistant reads pages, works across tabs and carries out multi-step tasks while you watch, with a pause control.
- **Background Assistants on Max.** Since the free launch, "Max subscribers can now launch many agentic tasks in parallel"; the Email Assistant is also Max-only.
- **Its own model menu.** Comet has its own model selection, and the models available may differ from those in Perplexity's search tables.
- **Credentials stay local.** Perplexity says the browser stores sign-in information "locally on your device with encryption".
- **Ad blocking on Android.** The Android build includes a built-in ad blocker.
- **Enterprise controls.** Admins can manage Comet Assistant permissions, and a Comet for Enterprise offering exists with SOC 2 Type II and MDM support, per the help center.

## In an AI-assisted workflow

The reliable pattern is read-mostly work across tabs you opened yourself, with the write step left to you. A marketer tracking competitor plan changes (an invented example) might open six pricing pages and ask the sidebar:

```text
Across the six tabs I have open, build a table of each competitor's plan
names, what each includes, and any change the page notes since last quarter.
Cite the tab for each row. Do not fill any forms or sign in to anything;
stop and show me the table.
```

That keeps the task scoped to content you chose and leaves nothing for a hostile page to do with your sessions. The developer-side equivalents, frameworks such as [Browser Use](/tools/browser-use), are compared in [browser agents in 2026](/guides/comparisons/browser-agents-compared-2026); Comet is the consumer version of the same loop.

> [!WARNING]
> Independent researchers have broken Comet's agent more than once. Brave reported on August 20, 2025 that hidden instructions in a Reddit comment made Comet read the user's Perplexity email and a Gmail one-time code, and on October 21, 2025 that "malicious instructions embedded as nearly-invisible text within the image are processed as commands". Trail of Bits wrote on February 20, 2026 that its pre-launch audit found four prompt injection techniques that could extract users' private information from Gmail. Perplexity's response, in its October 2025 post on mitigating prompt injection, describes a four-layer defence including machine learning classifiers trained to detect malicious instructions. Treat [prompt injection](/glossary/prompt-injection) as live risk and keep the assistant away from banking, email and anything with a password.

## Good to know

The browser and its assistant are free; the paid parts are Perplexity's plans. Background Assistants and the Email Assistant need Perplexity Max, and as of October 2026 Perplexity's Comet Plus announcement describes it as a $5 standalone subscription that Pro and Max subscribers get included. We could not read the Pro and Max plan prices from Perplexity's pricing page, so see the vendor's pricing page for those. Comet is owned by Perplexity AI and runs on macOS, Windows, iOS and Android, with no Linux build listed.

On security, Perplexity's own timeline is a pre-launch audit by Trail of Bits in April 2025, publication of its defence architecture in October 2025, and the open-sourcing of BrowseSafe in December 2025, whose BrowseSafe-Bench holds 14,719 examples across 11 attack types. The models used inside Comet are not listed in the help article we read. For the defensive side of the problem, see [defending against prompt injection](/guides/ai-safety/defending-prompt-injection).

Against the alternatives: [Claude in Chrome](/tools/claude-for-chrome) is an extension inside the Chrome you already use, desktop-only, on paid Claude plans, with a safety classifier on each action. [Dia](/tools/dia-browser) is a separate browser built around connected work apps and local memory, owned by Atlassian, desktop-only and without an advertised click-and-type agent. ChatGPT Atlas, the other obvious comparison, was retired on August 9, 2026. Pick Comet if you want a free, cross-platform browser whose assistant can act, and you are disciplined about where you let it.
