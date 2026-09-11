---
name: "Fireflies"
description: "Fireflies joins Zoom, Meet and Teams calls, transcribes them, and turns transcripts into searchable notes, action items and CRM records for sales teams."
seoDescription: "Fireflies for sales teams: per-seat prices as of September 2026, the AI-credit footnote behind unlimited, and why its connector lists only three tools."
date: 2026-09-10
url: "https://fireflies.ai"
pricing: "freemium"
category: "sales"
color: "orange"
os: ["Web", "macOS", "Windows", "iOS", "Android"]
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["sales"]
tags: ["fireflies", "meeting-notes", "conversation-intelligence", "mcp", "transcription"]
featured: false
alternativeTo: ["gong"]
sameAs: ["https://fireflies.ai/pricing"]
related: ["guide:claude-for-sales-teams", "guide:best-ai-sales-tools-2026", "tool:gong", "tool:attio", "tool:close", "glossary:conversation-intelligence", "glossary:revenue-intelligence"]
keywords: ["Fireflies.ai", "Fireflies pricing", "Fireflies MCP server", "AskFred", "meeting transcription", "AI notetaker"]
summary: "Fireflies is a meeting recorder that joins Zoom, Google Meet and Microsoft Teams calls, transcribes them, and turns the transcript into searchable notes, action items and CRM records. AskFred, Live Assist and 200+ AI Skills are assistive; the Email Assistant and Voice Agents act on their own. Its MCP endpoint is live, but its Connectors Directory listing exposes only three tools."
faq:
  - q: "What does Fireflies cost?"
    a: "As of September 2026 Fireflies lists per-seat monthly pricing at annual and monthly rates respectively: Free at 0 dollars, Pro at 10 or 18, Business at 19 or 29, and Enterprise at 39 billed annually only. Storage differs sharply by tier: Free gives 400 minutes per team, Pro 8,000 minutes per seat, and Business and Enterprise are unlimited."
  - q: "Is unlimited transcription really unlimited?"
    a: "The transcription is. The product is not. Fireflies' own pricing footnote says certain features like AI Skills, personal assistant and voice agents require AI credits, which are a separate currency from the seat price. So the tiers where transcription stops being metered are the tiers where the interesting AI starts being metered."
  - q: "How many tools does the Fireflies MCP server expose?"
    a: "Depends on the source, and the gap is wide. The Connectors Directory listing, dated November 2025, exposes exactly three tools: get_user, get_transcript and get_transcripts. Fireflies' own documentation describes a broader surface. If you are planning a workflow, plan against the three you can actually see in the directory listing."
  - q: "Does Fireflies document its Claude integration?"
    a: "Yes, explicitly. Its blog post of 31 August 2026 is titled Fireflies MCP Server: How to Connect Your Meeting Data to Claude, ChatGPT, and More, and the endpoint is https://api.fireflies.ai/mcp. That is unusually direct for this category, where most vendors bury the MCP page in developer docs."
---

Fireflies is the notetaker that shows up. It joins Zoom, Google Meet and Microsoft Teams calls, records and transcribes them, and then does the part that actually saves time: turning the transcript into searchable notes, extracted action items and records pushed into the CRM. For a sales team, the value is not the transcript. It is that last week's objection is findable.

The AI splits cleanly into two kinds. AskFred, Live Assist and the library of 200-plus AI Skills are assistive — you ask, they answer or draft. The Email Assistant, which auto-drafts replies, and Voice Agents, which place calls, act without you in the loop for each step. Knowing which is which matters when you decide what to switch on for a team.

## Can a Claude user connect it?

Yes, and Fireflies is one of the few vendors here that says so on its marketing blog rather than only in developer docs. Its post of 31 August 2026 is titled "Fireflies MCP Server: How to Connect Your Meeting Data to Claude, ChatGPT, and More." The endpoint is `https://api.fireflies.ai/mcp` and the Connectors Directory listing dates to November 2025.

State the tool-count discrepancy plainly, because it changes what you can build. The **directory listing exposes three tools**: `get_user`, `get_transcript` and `get_transcripts`. Fireflies' **own documentation describes a broader surface**. Those are two first-party sources that do not match, and the honest planning assumption is the smaller one — build against the three you can see, and treat anything else as a bonus you verify in your own account.

Three read tools is still a useful shape for the most common job: pull a specific call, or a filtered set of calls, into Claude and ask questions the recorder's own summarisation does not answer. Objection patterns across ten calls, the exact language a champion used, whether a commitment was actually made. [Claude for sales teams](/guides/sales/claude-for-sales-teams) walks through wiring that up and where the approval gates belong.

We make no claim about Fireflies' verification badge. Anthropic's directory does mark some connectors verified, but its own page says Anthropic "does not control which tools developers make available and cannot verify that they will work as intended or that they won't change" — so a badge is not an assurance worth repeating.

## The seat price is not the bill

As of September 2026 Fireflies lists per-seat monthly pricing, annual rate first: Free at $0, Pro at $10 or $18, Business at $19 or $29, and Enterprise at $39 billed annually only. As of September 2026 storage differs sharply by tier, with Free at 400 minutes per team, Pro at 8,000 minutes per seat, and Business and Enterprise unlimited.

Then read the footnote, because "unlimited" is doing less work than it appears. Fireflies states that "certain features like AI Skills, personal assistant, voice agents require AI credits" — a separate currency from the seat price. The tiers where transcription stops being metered are precisely the tiers where the agentic features start being metered. Fireflies belongs with [Clay](/tools/clay), [Attio](/tools/attio) and [Apollo](/tools/apollo) in the group that meters AI apart from seats, and the seat price is the floor of your bill rather than the whole of it.

## Where it fits against the alternatives

Fireflies and [Gong](/tools/gong) get compared constantly and they are not the same purchase. Fireflies is [conversation intelligence](/glossary/conversation-intelligence): capture, transcribe, search, push to CRM, at a published price a team lead can expense. Gong is [revenue intelligence](/glossary/revenue-intelligence): analysis across an entire organisation, deal risk and forecast, bought by a VP with a budget and no public price at all.

If your requirement is "we want our calls searchable and our CRM notes written," Fireflies does it for a tenth of the procurement effort. If the requirement is "we want the forecast to be defensible," it does not. Plenty of teams run Fireflies alongside [Close](/tools/close) or Attio and never buy the larger system. The [best AI sales tools of 2026](/guides/comparisons/best-ai-sales-tools-2026) roundup sets out where that line falls.
