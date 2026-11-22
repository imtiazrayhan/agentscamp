---
name: "DeepSeek"
description: "DeepSeek is a free AI chat app and a pay-as-you-go API running the V4.1-Flash and V4-Pro models, whose weights are published under the MIT License."
seoDescription: "DeepSeek in 2026: the free chat app, API prices as of November 2026, V4.1-Flash and V4-Pro, MIT-licensed weights, data stored in China, and alternatives."
date: 2026-11-20
reviewed: 2026-11-22
url: "https://www.deepseek.com"
pricing: "freemium"
category: "assistant"
color: "blue"
os: ["Web", "iOS", "Android"]
license: "MIT"
topics: ["ai-at-work", "llm-app-dev"]
audience: ["developers", "founders", "ai-engineers"]
tags: ["deepseek", "assistant", "chatbot", "open-weights", "llm-api", "mit-license"]
featured: false
alternativeTo: ["chatgpt", "claude", "gemini", "grok", "mistral-vibe"]
sameAs: ["https://github.com/deepseek-ai", "https://x.com/deepseek_ai", "https://en.wikipedia.org/wiki/DeepSeek"]
related: ["tool:chatgpt", "tool:claude", "tool:grok", "tool:mistral-vibe", "tool:claude-code", "guide:best-chatgpt-alternatives-2026", "guide:best-open-source-llms-2026", "guide:claude-code-with-other-models", "glossary:open-weights", "glossary:mixture-of-experts"]
keywords: ["DeepSeek", "DeepSeek app", "DeepSeek API pricing", "DeepSeek V4.1-Flash", "DeepSeek V4-Pro", "DeepSeek open weights", "DeepSeek MIT license"]
summary: "DeepSeek is a free AI chat app for web, iOS and Android plus a pay-as-you-go API. The app runs DeepSeek-V4.1-Flash and the API adds DeepSeek-V4-Pro, with a 1M-token context, thinking and non-thinking modes, and built-in web search, and the weights are published under the MIT License. The catch is privacy: DeepSeek stores personal data in China."
faq:
  - q: "Is DeepSeek free?"
    a: "The chat app is. DeepSeek describes it as a way to chat with leading AI models for free on the web, iOS and Android, and no paid consumer plan was listed as of November 2026. The API is separate and pay-as-you-go: you top up a balance and pay per million tokens, with off-peak rates at half the peak rates."
  - q: "How much does the DeepSeek API cost?"
    a: "As of November 2026, DeepSeek's pricing page lists deepseek-flash (V4.1-Flash-1017) at $0.30 per million input tokens on a cache miss and $1.20 per million output tokens at peak, and deepseek-v4-pro (V4-Pro-0813) at $1.32 input and $3.96 output at peak. Off-peak rates are half. Peak hours are 01:00 to 04:00 and 06:00 to 10:00 UTC on weekdays, excluding Chinese public holidays."
  - q: "Is DeepSeek open source?"
    a: "The model weights are. The Hugging Face cards for DeepSeek-V4.1-Flash, V4.1-Flash-1017, V4-Pro, V4-Pro-0813 and V4-Flash all carry the MIT License, and the V4.1-Flash card says the repository and the model weights are licensed under the MIT License. The hosted app and API are DeepSeek's own service. DeepSeek Harness, its agent desktop app, is also open source under MIT."
  - q: "Where does DeepSeek store my data?"
    a: "In China. DeepSeek's privacy policy, last updated February 10, 2026, says it collects, processes and stores personal data in the People's Republic of China and uses data to train and improve its models, with a right to opt out of training. It also asks users not to provide sensitive personal data. For confidential work, the open weights let you run the models on infrastructure you control instead."
---

DeepSeek is two products under one name: a free AI chat assistant on the web, iOS and Android, and a pay-as-you-go API platform for developers. Both run the same model line. As of November 2026 the app runs DeepSeek-V4.1-Flash, called `deepseek-flash` in the API, and the API also offers DeepSeek-V4-Pro, called `deepseek-v4-pro`; DeepSeek publishes the weights of both under the MIT License. The company is Hangzhou DeepSeek Artificial Intelligence Co., Ltd., the seller listed on the iOS app.

That mix of a free chatbot, [open weights](/glossary/open-weights) and an API that speaks both the OpenAI and Anthropic formats is why DeepSeek appears on so many shortlists. Developers and AI engineers use the API as a low-cost backend, including for coding agents; founders use the app as a capable free assistant. The trade-off sits in the privacy policy: DeepSeek stores personal data in the People's Republic of China. The [best ChatGPT alternatives roundup](/guides/comparisons/best-chatgpt-alternatives-2026) sets it against the rest of the field.

## Highlights

- **Thinking and non-thinking modes.** The API supports both, with thinking as the default. In the app, the switches are labelled DeepThink and Search.
- **A million tokens of context.** DeepSeek says "1M context is now the default across all official DeepSeek services," and the API allows up to 384K output tokens.
- **Search from DeepSeek's own engine.** Web search in the app and the API runs on DeepSeek's in-house search engine, and DeepSeek also sells standalone Search and Fetch APIs.
- **App features in the API.** In November 2026 DeepSeek opened the pieces behind the chat app, namely web search, file input, URL reading and voice interaction, to API developers.
- **Two API formats.** "The DeepSeek API uses an API format compatible with OpenAI/Anthropic," with base URLs `https://api.deepseek.com` and `https://api.deepseek.com/anthropic`.
- **Vision on Flash.** V4.1-Flash, a 552B-parameter [mixture-of-experts](/glossary/mixture-of-experts) model, has native visual understanding. V4-Pro does not accept images.
- **DeepSeek Harness.** An open-source (MIT) agent desktop app with composable plugins for macOS on Apple silicon and 64-bit Windows, in public preview as of November 2026. The code is at github.com/deepseek-ai/deepseek-harness.

## In an AI-assisted workflow

DeepSeek's documentation is direct about the main developer use: "If you use tools like Claude Code, GitHub Copilot, or OpenCode, you can use DeepSeek as the backend model directly — no code required." The Anthropic-compatible base URL is what makes that work for [Claude Code](/tools/claude-code); the guide to [running Claude Code with other models](/guides/configuration/claude-code-with-other-models) covers the setup and what changes when the model behind it is not Claude.

For your own code, point an OpenAI-compatible client at `https://api.deepseek.com` and set the model to `deepseek-flash`, or to `deepseek-v4-pro` when you want the larger model and do not need image input. Bulk jobs are where the pricing structure matters most. A made-up example for Acme's support queue:

```text
Classify each ticket below into one of: billing, bug, feature request,
account access, other. Return JSON lines with ticket_id, category, and a
one-sentence reason. If a ticket fits two categories, pick the one that
needs the faster response and say so in the reason.
```

Schedule a job like this outside the peak windows (01:00 to 04:00 and 06:00 to 10:00 UTC on weekdays) and every rate is half. Use non-thinking mode for plain labelling and keep thinking mode for the tickets the first pass marks as unclear.

## Pricing

The chat app is free. DeepSeek describes it as a way to "chat with leading AI models for free," and no paid consumer plan was listed as of November 2026. The API is billed per token from a topped-up or granted balance.

As of November 2026, DeepSeek's pricing page lists `deepseek-flash` (DeepSeek-V4.1-Flash-1017) at $0.30 per million input tokens on a cache miss, $0.006 on a cache hit, and $1.20 per million output tokens at peak rates. As of November 2026, `deepseek-v4-pro` (DeepSeek-V4-Pro-0813) costs $1.32 per million input tokens on a cache miss, $0.044 on a cache hit, and $3.96 per million output tokens at peak. Off-peak rates are half of peak, so off-peak `deepseek-flash` comes to $0.15 input and $0.60 output per million tokens as of November 2026. Peak hours are 01:00 to 04:00 and 06:00 to 10:00 UTC, Monday to Friday, excluding Chinese public holidays. The Search API and the Fetch API cost $0.75 per 1,000 successful requests each as of November 2026, and searches the model runs during a call are billed as tokens rather than per call.

## Good to know

DeepSeek's privacy policy (last updated February 10, 2026) says the company collects, processes and stores personal data "in People's Republic of China," uses it "to train and improve our technology, such as our machine learning models," and gives users "the right to opt-out" of training. It also says "you should not provide sensitive Personal Data to the Services." If that rules out the hosted app for your work, the MIT-licensed weights are the way around it, but these are very large models: V4-Pro has 1.6 trillion total parameters with 49 billion active, and V4.1-Flash has 552 billion. Read the hardware notes on the model cards before you plan a self-hosted deployment; the [open-source LLMs roundup](/guides/comparisons/best-open-source-llms-2026) covers the serving options.

Model names changed this year. `deepseek-chat` and `deepseek-reasoner` were "fully retired and inaccessible after Jul 24th, 2026," so older integrations and tutorials that use those names need updating. A September news post said V4-Pro requests would be routed to V4.1-Flash, but DeepSeek's changelog later said it would "continue providing API services for DeepSeek V4 Pro after September 14, 2026," and the pricing page still lists V4-Pro-0813. A few API features carry caveats too: FIM completion works in non-thinking mode only, and both FIM completion and Chat Prefix Completion are marked beta as of November 2026.

If the China data location or the API-first focus does not fit, [Mistral Vibe](/tools/mistral-vibe) is the European option with a coding agent built in, and [Grok](/tools/grok) is the pick for live news. See all [DeepSeek alternatives](/tools/deepseek/alternatives), or the [best ChatGPT alternatives in 2026](/guides/comparisons/best-chatgpt-alternatives-2026) for the full comparison.
