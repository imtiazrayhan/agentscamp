---
name: "Granola"
description: "Granola is a bot-free AI meeting notepad that transcribes from device audio, merges your notes with the transcript, and shares them via MCP and integrations."
seoDescription: "Granola in 2026: bot-free meeting notes on Mac, Windows, iOS and Android, plan prices as of October 2026, the MCP connector, and alternatives."
date: 2026-10-12
url: "https://www.granola.ai"
pricing: "freemium"
category: "assistant"
color: "green"
os: ["macOS", "Windows", "iOS", "Android"]
topics: ["ai-at-work"]
audience: ["founders", "sales", "marketers"]
tags: ["granola", "meeting-notes", "ai-notetaker", "bot-free", "mcp", "transcription"]
featured: false
alternativeTo: ["fireflies", "otter-ai", "fathom"]
sameAs: ["https://www.linkedin.com/company/meetgranola", "https://twitter.com/meetgranola", "https://docs.granola.ai/help-center"]
related: ["tool:otter-ai", "tool:fathom", "tool:fireflies", "tool:dia-browser", "guide:best-ai-meeting-note-takers-2026", "guide:ai-meeting-notes-action-items", "glossary:conversation-intelligence", "glossary:model-context-protocol"]
keywords: ["Granola", "Granola AI notes", "Granola pricing", "bot-free meeting notes", "Granola MCP"]
summary: "Granola is an AI meeting notepad that transcribes from your device audio instead of sending a bot into the call, then merges your notes with the transcript into structured notes you can chat across and push to Slack, Notion, HubSpot or any MCP client. It runs on macOS, Windows, iOS and Android, keeps no audio, and its free tier keeps 30 days of history."
faq:
  - q: "Is Granola free?"
    a: "Partly. As of October 2026 Granola's pricing page lists a Basic plan at $0 per user per month that keeps 30 days of meeting history and limits AI chat to the automatic model, a Business plan at $14 per user per month with unlimited history, integrations and API access, and an Enterprise plan at $35 per user per month with Salesforce, SSO, SCIM and HIPAA-compliant workspaces, and the page does not say whether those figures assume monthly or annual billing."
  - q: "Does Granola use a bot to record meetings?"
    a: "No. Granola transcribes from your computer's audio, so nothing joins the call as a participant, and it works with Zoom, Google Meet, Teams and any other meeting app without an integration. Because there is no visible bot, Granola offers an automatic chat message when transcription starts, a persistent watermark on your video, and a reminder to ask for consent each time you start taking notes."
  - q: "Does Granola store the audio from my meetings?"
    a: "No. Granola's security page says it does not store meeting audio; what it keeps are the transcript and your notes, stored encrypted in its US-hosted AWS environment. Summaries come from OpenAI and Anthropic models and transcription from providers such as Deepgram and AssemblyAI, and Granola says those providers are not allowed to use your data to train their models."
  - q: "Does Granola have an MCP server?"
    a: "Yes. Granola MCP, released in February 2026, is a first-party connector at https://mcp.granola.ai/mcp that brings your meeting notes into Claude, ChatGPT, Cursor and other MCP clients. On the Basic plan the connector reaches your personal notes from the last 30 days; Business adds personal and public workspace notes."
---

Granola is the notetaker that stays out of the call. Instead of sending a bot that appears as a participant, it runs as an app on your Mac, Windows PC or phone, listens to the device audio, and merges the rough notes you type during the meeting with the transcript into a clean, structured set of notes once the call ends. Launched in May 2024 as a Mac-only notepad, it has grown into a cross-platform product with a chat layer across all your meetings and a first-party [MCP](/glossary/model-context-protocol) connector.

It is aimed at people who run a lot of meetings and dislike the social cost of a recorder joining them: founders in investor calls, salespeople in discovery, marketers in agency check-ins. The trade is explicit. You get no visible recording bot and no stored audio; you give up the shared live transcript that bot-based tools such as [Otter.ai](/tools/otter-ai) provide. The [best AI meeting note takers roundup](/guides/comparisons/best-ai-meeting-note-takers-2026) sets it against the rest of the field.

## Highlights

- **Bot-free capture.** Granola's own line is that it "uses your computer audio, so doesn't invite a bot", and it works with Zoom, Google Meet, Teams and every other meeting app because there is nothing to integrate.
- **Your notes plus the transcript.** The whole premise is the merge: you jot fragments during the call and Granola turns them, with the transcript, into structured notes afterwards.
- **No stored audio.** Granola's security page states that it does not store the audio from meetings.
- **Chat across meetings.** Agentic Chat, added in April 2026, answers questions across your meeting history with inline citations; Recipes are saved prompts for jobs you repeat.
- **Briefs before external meetings.** Since May 2026 Granola preps a Brief on Mac and Windows before every external meeting: who is attending and what you discussed last time.
- **Granola MCP.** A first-party connector (endpoint `https://mcp.granola.ai/mcp`) brings notes into Claude, ChatGPT and Cursor; the Basic plan reaches the last 30 days of notes.
- **Everywhere you take calls.** macOS, Windows (since June 2025), iOS, Android (July 2026) and Apple Watch (July 2026), with 32 supported languages since September 2026.

## In an AI-assisted workflow

The useful pattern is to treat Granola as the record of what was said and a general assistant as the place where you reason about it. With the MCP connector enabled in Claude, a founder preparing for a board call (a made-up example) might ask:

```text
Using my Granola notes from the last 30 days, list every commitment I made
to a customer or investor, with the meeting it came from and the date. Mark
any I have not closed out in a later meeting. Do not invent commitments that
are not in the notes.
```

The answer is only as good as the notes behind it, so keep Granola's citations visible and check anything you intend to send. Once you have the structured notes, the [AI meeting notes workflow](/guides/workflow/ai-meeting-notes-action-items) shows how to separate confirmed decisions from proposals before the minutes go out.

> [!NOTE]
> Consent still applies when there is no bot. Granola can post a message in the meeting chat when transcription begins and show a persistent watermark on your video, and it reminds you to ask every time you start taking notes. On Basic and Business plans the announcement is a per-user setting; Enterprise admins can enforce it.

## Good to know

As of October 2026 Granola's pricing page lists Basic at $0 per user per month, Business at $14 per user per month and Enterprise at $35 per user per month, and the page does not say whether those are monthly or annual billing rates. Basic keeps 30 days of meeting history and limits AI chat to the automatic model; Business adds unlimited history, model selection, API access, and the Notion, Zapier, HubSpot, Attio and Affinity integrations; Enterprise adds Salesforce, SSO, SCIM, an audit API and HIPAA-compliant workspaces. Slack is on every tier. SOC 2 Type II applies to all plans, and Granola says notes live in a US-hosted AWS environment, encrypted at rest and in transit.

Granola is a desktop and mobile app rather than a web app, and there is no Linux build. Summaries come from OpenAI and Anthropic models and transcription from providers such as Deepgram and AssemblyAI; Granola says it does not let those providers train on your data, trains its own models on anonymized data with an opt-out, and turns training off by default for Enterprise. The company is an independent startup with offices in London and San Francisco, and it announced a Series C in March 2026. [Dia](/tools/dia-browser) lists Granola among its connected apps, which is a fair sign of where the product sits: a source that other tools read from.

Against the alternatives, the choice is about capture. [Fireflies](/tools/fireflies) and [Otter.ai](/tools/otter-ai) are bot-first with desktop apps for bot-free capture; they give you a shared live transcript, longer language lists and, in Fireflies' case, a larger integration surface, at the cost of a visible participant. [Fathom](/tools/fathom) records full video with a bot by default and keeps its bot-free modes Mac-only. If what you want is notes without a recorder in the room, and you are content to keep the transcript private by default, Granola is the cleanest version of that idea.
