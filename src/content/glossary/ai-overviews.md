---
term: "AI Overviews"
description: "AI Overviews are Google's AI-generated summaries at the top of Search results, with source links; AI Mode is the fuller conversational version."
date: 2026-09-10
topics: ["ai-at-work"]
audience: ["marketers"]
tags: ["ai-overviews", "google", "ai-search", "seo", "marketing"]
related: ["glossary:generative-engine-optimization", "glossary:answer-engine-optimization", "glossary:llms-txt", "guide:ai-content-and-search-2026", "guide:claude-code-for-marketers", "guide:surfer-vs-clearscope", "glossary:grounding"]
faq:
  - q: "How do I get my page into AI Overviews?"
    a: "The same way you get it into Search. Google's documentation says there are no additional requirements to appear in AI Overviews or AI Mode, no special optimizations, and no new machine-readable files or markup. Pages that are indexed, eligible for snippets, and answer the question directly are the candidates. Query fan-out means a page can be pulled in for a subtopic the user never typed."
  - q: "Can I keep my content out of AI Overviews?"
    a: "Yes, with the same controls that govern snippets. Google lists nosnippet, data-nosnippet, max-snippet, and noindex as the ways to limit or remove content from AI features. There is no separate opt-out for AI Overviews alone; whatever you block from snippets is blocked from the summary too."
  - q: "Does Search Console show AI Overviews traffic?"
    a: "Only in aggregate. Google says clicks and impressions from AI features are included in the overall search traffic in Search Console and appear in the Performance report under the Web search type. There is no separate filter, which is why third-party prompt-tracking tools exist."
summary: "AI Overviews are the AI-generated summaries Google shows at the top of Search results for many queries, composed from multiple sources and accompanied by links, so a searcher gets the gist before deciding which page to open."
---

**AI Overviews are the AI-generated summaries Google shows at the top of Search results for many queries, composed from multiple sources and accompanied by links, so a searcher gets the gist before deciding which page to open.**

Google's developer documentation describes AI Overviews as a way to "get to the gist of a complicated topic or question more quickly" with "a jumping off point to explore links," and AI Mode as the fuller version for queries that need "further exploration, reasoning, or complex comparisons." Both use a technique Google calls query fan-out: the system issues several related searches across subtopics and data sources, then assembles the answer from what comes back. That is why a page can be cited for a question it never targeted, and why the set of links in an overview is often wider than the ten blue links below it.

For marketers the practical facts are these. There are no extra requirements to appear: no markup, no AI text file, no separate submission. The preview controls that govern snippets (nosnippet, data-nosnippet, max-snippet, noindex) also govern AI features. And traffic from AI Overviews is counted inside the Web search type in Search Console rather than broken out, which is the gap that prompt-tracking tools from [Surfer and Clearscope](/guides/comparisons/surfer-vs-clearscope) fill. The disciplines built around this surface are [answer engine optimization](/glossary/answer-engine-optimization) and [generative engine optimization](/glossary/generative-engine-optimization).

The [AI content and search in 2026](/guides/marketing/ai-content-and-search-2026) guide covers what to change in a content plan, and [Claude Code for marketers](/guides/marketing/claude-code-for-marketers) shows how to audit a site for it with an agent.
