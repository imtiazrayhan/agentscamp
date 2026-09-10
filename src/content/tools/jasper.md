---
name: "Jasper"
description: "An enterprise marketing AI workspace with 100+ purpose-built agents, Jasper IQ brand context, Canvas, and an MCP server for other AI tools."
seoDescription: "Jasper for marketing teams: agents, Jasper IQ brand voice and style guides, Canvas, Studio, integrations, and Pro vs Business plans as of September 2026."
date: 2026-09-10
url: "https://www.jasper.ai"
pricing: "paid"
category: "marketing"
color: "purple"
os: ["Web"]
topics: ["ai-at-work", "workflow-prompting"]
audience: ["marketers"]
tags: ["marketing", "brand-voice", "content", "agents", "enterprise", "mcp"]
featured: false
alternativeTo: ["copy-ai", "claude", "chatgpt"]
sameAs: ["https://developers.jasper.ai", "https://help.jasper.ai/hc/en-us"]
related: ["guide:claude-code-for-marketers", "guide:best-ai-tools-for-marketers-2026", "guide:best-ai-writing-tools-2026", "guide:brand-voice-with-claude-skills", "tool:copy-ai", "tool:claude", "glossary:brand-voice", "skill:brand-voice-profiler"]
keywords: ["Jasper AI", "Jasper marketing AI", "Jasper IQ", "Jasper agents", "enterprise AI content"]
summary: "Jasper is an enterprise marketing AI platform that runs 100+ specialized agents on top of Jasper IQ, a layer holding your brand voices, style guides, audiences, and product knowledge, so every draft comes out on-brand. Marketers work in Canvas, scale with Grid and Studio, and can pull that brand context into Claude or Cursor through the Jasper MCP server."
faq:
  - q: "What is Jasper?"
    a: "Jasper describes itself as the agent workspace built for modern marketing teams. It combines purpose-built marketing agents (optimization, research, translation, and more) with Jasper IQ, which stores your brand voice, style guide, audiences, and product knowledge, and applies them to every output. Canvas is the workspace, Grid handles bulk content, and Studio lets Business customers build custom agents without code."
  - q: "How much does Jasper cost?"
    a: "As of September 2026 the Pro plan is 69 dollars per seat per month, or 59 on annual billing, with a 7-day free trial, one seat included, 2 brand voices, 5 knowledge assets, and 3 audiences. Business is custom priced with a 12-month minimum, unlimited seats, brand voices, and knowledge assets, custom agents in Jasper Studio, Grid, and admin controls. There is no permanent free plan."
  - q: "Does Jasper work with Claude Code or other AI tools?"
    a: "Yes. Jasper hosts a remote MCP server at mcp.jasper.ai that exposes brand voices, audiences, style guides, knowledge base search, agents, and content generation as tools. It supports OAuth 2.0 dynamic client registration or an API key, and Jasper documents setups for Claude Desktop, Cursor, VS Code, and Windsurf."
  - q: "Jasper vs Copy.ai: which should a marketer pick?"
    a: "Jasper is built around brand governance and content production for marketing teams, with agents, Canvas, and image pipelines. Copy.ai is positioned as a go-to-market platform whose workflows and tables cross sales, marketing, and ops. If your problem is on-brand content at scale, start with Jasper; if it is codifying a GTM process that touches the CRM, start with Copy.ai."
---

Jasper is a marketing-specific AI platform that positions itself as "the agent workspace built for modern marketing teams." The core idea is governance: instead of pasting a brand guide into a chat window every time, you load brand voices, style guides, audience profiles, and product knowledge into Jasper IQ once, and every agent, canvas, and bulk job draws on it automatically.

For a content team that is tired of re-explaining tone to a general chatbot, that is the pitch. Jasper is less a writing assistant than a system of record for how your brand sounds, with the writing tools attached.

## Highlights

- **100+ marketing agents.** Jasper lists purpose-built agents for end-to-end workflows, with named examples for optimization, research, and translation. Business plans add agents for complex work such as GEO, translations, and deep research.
- **Jasper IQ.** The context layer: Brand IQ, Marketing IQ, and Product IQ, plus Style Guide, Visual Guidelines, and a Knowledge Base. Pro includes 2 brand voices, 5 knowledge assets, and 3 audiences; Business removes the caps.
- **Canvas, Grid, and Studio.** Canvas is the working surface for planning and drafting. Grid scales content production in a spreadsheet-like layout. Studio (Business only) is a no-code builder for custom agents.
- **Image pipelines.** Jasper's image APIs cover background removal, cleanup, upscaling, and decomposition, and the vendor claims on-brand product imagery "up to 10x faster" than traditional production.
- **Integrations where marketers already work.** The integrations page lists Google Docs, Sheets, and Drive, a Chrome extension, a Microsoft Word add-in, SharePoint, Salesforce, Webflow, Adobe Workfront, Asana, Monday.com, Box, Semrush, Slack, Zapier, Make, and Google BigQuery.
- **An MCP server.** Jasper hosts a remote MCP server so its brand context travels into Claude Desktop, Cursor, VS Code, or Windsurf.

## In a marketer's workflow

The interesting pattern for this site's readers is using Jasper as the brand source of truth while an agent such as Claude Code does the file-heavy work. Jasper's MCP server exposes seven tools, including `get-jasper-brand-voices`, `get-jasper-style-guides`, `search-knowledge-base`, `run-jasper-agent`, and `generate-content`. Register it once, then a repurposing session looks like this:

```text
Using the Jasper MCP server, fetch the "Product launch" brand voice
and our style guide. Rewrite the six draft emails in ./campaign/
to match, keep every product claim exactly as written, and flag
any sentence the style guide would reject.
```

The model reads the voice definition from Jasper rather than from a pasted paragraph, so the same rules apply whether the work happens in Jasper Canvas or in your repo. The [Claude Code for marketers](/guides/marketing/claude-code-for-marketers) guide covers the MCP setup and where to keep campaign files, and [brand voice with Claude skills](/guides/marketing/brand-voice-with-claude-skills) shows the lighter-weight alternative of encoding the voice as a skill when you do not have a Jasper seat.

> [!NOTE]
> Jasper's MCP server authenticates with OAuth 2.0 dynamic client registration for interactive clients or an `X-API-KEY` header for agentic software. The knowledge-base and voice tools are read-only; only `generate-content` and `run-jasper-agent` produce output.

## Good to know

Jasper is a hosted web app with a Chrome and Edge extension; there is no desktop client. As of September 2026 the Pro plan costs $69 per seat per month on monthly billing or $59 on annual, with a 7-day free trial, and includes Canvas plus the core marketing agents. Business is custom priced with a 12-month minimum commitment, unlimited seats, brand voices, knowledge assets, and audiences, the Studio agent builder, Grid, enterprise governance (admin controls and Groups), and dedicated account management. There is no free tier, which is the main reason solo marketers compare it against [Claude](/tools/claude) or [ChatGPT](/tools/chatgpt) with a well-written brand prompt.

The closest like-for-like competitor is [Copy.ai](/tools/copy-ai), which has moved toward go-to-market workflows across sales and marketing rather than content governance. If your bottleneck is CRM-side automation rather than copy, [HubSpot Breeze](/tools/hubspot-breeze) covers agents inside the CRM. The [best AI writing tools in 2026](/guides/comparisons/best-ai-writing-tools-2026) and [best AI tools for marketers](/guides/comparisons/best-ai-tools-for-marketers-2026) roundups place Jasper against both.
