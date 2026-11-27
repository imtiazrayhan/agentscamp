---
name: AltText.ai
title: AltText.ai
description: "AltText.ai generates image alt text in bulk across WordPress, Shopify, Webflow and other platforms, through a REST API and MCP server, in 130+ languages."
date: '2026-09-04'
updated: '2026-11-27'
reviewed: '2026-11-27'
topics:
- ai-at-work
- workflow-prompting
audience:
- designers
- marketers
- developers
tags:
- alt-text
- accessibility
- image-descriptions
- seo
- api
featured: false
related:
- guide:ai-alt-text-context-review
- guide:ai-chart-long-descriptions
- glossary:alternative-text
summary: "AltText.ai is a service that writes alt text for images at scale. It plugs into WordPress, Shopify, Webflow, Contentful and other platforms, or runs through a REST API, an MCP server and browser extensions. One credit covers one image, with 25 free credits to start and paid plans after that."
url: https://alttext.ai/
pricing: paid
category: design
os:
- Web
color: green
alternativeTo:
- chatgpt
- claude
- gemini
sameAs:
- https://wordpress.org/plugins/alttext-ai/
- https://apps.shopify.com/alttext-ai
faq:
- q: "How much does AltText.ai cost?"
  a: "As of November 2026, AltText.ai's pricing page lists five monthly plans: Bronze at $5 for 100 credits, Silver at $19 for 500, Gold at $59 for 2,000, Titanium at $119 for 5,000 and Platinum at $229 for 10,000. Yearly billing is cheaper, from $49 a year for Bronze. A one-time pack of 50 credits is $3, and new accounts get 25 free credits with no card."
- q: "What does one AltText.ai credit buy?"
  a: "One credit generates alt text for one image in a standard format: JPG, PNG, GIF, WebP or BMP. AVIF, HEIC, HEIF, JP2, SVG and TIFF cost two credits and need a paid plan. Each additional language for the same image costs one more credit. Unused credits roll over when a plan renews normally."
- q: "Does AltText.ai keep my images?"
  a: "Its API documentation says no. When you send a URL, AltText.ai stores the URL, fetches the image temporarily for analysis and then deletes it. When you upload a file, the image is deleted immediately after analysis. The generated text and the image's metadata stay in your library."
- q: "Can AltText.ai write alt text that fits the page it is on?"
  a: "Only as far as you tell it. It can take up to six keywords, a text passage to draw keywords from, product name, brand and color for ecommerce images, and a Final Pass prompt that rewrites the first draft. It does not read your page layout or decide whether an image is decorative, so that judgment stays with an editor."
---

[AltText.ai](https://alttext.ai/) is a hosted service that writes alt text for images automatically. Its pitch is volume: connect it to the place your images live, and it describes new uploads as they arrive and backfills the ones that have no description. The company reports more than 38 million images processed for more than 97,000 sites, by its own count on the pricing page.

## Highlights

- **24 integrations.** WordPress (a plugin that writes alt text on upload and bulk-updates the existing media library), Shopify, WooCommerce, BigCommerce, Ecwid and Magento for stores; Contentful, DatoCMS, Storyblok and Webflow for content; Cloudinary, Dropbox, Google Drive and Pinterest for media libraries; and Zapier, Pabbly Connect, Albato and SureTriggers for automation.
- **InstantAlt.** A JavaScript snippet, also deployable through Google Tag Manager, that adds alt text on sites with no native integration, including Wix, Squarespace, Ghost, Drupal and HubSpot.
- **REST API.** Create an image record from a public URL or a base64 upload and get alt text back synchronously, or pass `async` and receive a webhook. There are also bulk-create and page-scrape endpoints.
- **Hosted MCP server.** `https://mcp.alttext.ai/mcp` gives Claude, ChatGPT, Cursor, Codex and other MCP clients ten tools for generating, translating, searching and updating alt text. You sign in with your account, so there is no API key to copy.
- **Controls on the output.** Five description styles from Elaborated to Terse, a `max_chars` limit between 80 and 500, up to six keywords and six negative keywords, ecommerce fields for product, brand and color, and a Final Pass prompt that rewrites the first draft.
- **130+ languages**, with several languages returned from one request.
- **Browser extensions** for Chrome and Firefox: right-click any image on a page and copy the generated text.
- **Free site scan.** A crawler that checks up to 25 pages for images missing alt text, with no account.

## In an AI-assisted workflow

To try it, sign up for the 25 free credits and install the plugin for your platform. Developers can call the API directly with a key from the account's API Keys page:

```bash
curl -X POST "https://alttext.ai/api/v1/images" \
  -H "X-API-Key: $ALTTEXT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "image": { "url": "https://example.com/photos/trail-map.jpg" },
    "keywords": ["trail map"],
    "lang": "en,es",
    "max_chars": 125
  }'
```

The response carries `alt_text`, an `alt_texts` object keyed by language, and an `asset_id` you can use to fetch or update the record later. Sending a URL that is already in your library returns the stored result and costs no credits. In Claude Code, the hosted server is one command:

```bash
claude mcp add --transport http alttext-ai https://mcp.alttext.ai/mcp
# then run /mcp inside Claude Code to sign in
```

A generator sees pixels, not purpose. The same photo needs different alt text as a product shot, a link, or a decoration that should have an empty `alt`, and the [W3C alt decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/) is the reference for that call. The [alt-text context review guide](/guides/design/ai-alt-text-context-review) shows how to check generated drafts against the page role before they are published, and [alternative text](/glossary/alternative-text) covers the basics. Charts and diagrams usually need more than one sentence; see the [chart long-description guide](/guides/design/ai-chart-long-descriptions).

## Pricing

As of November 2026, the [AltText.ai pricing page](https://alttext.ai/pricing) lists these plans. Every plan includes every integration and feature; the tiers differ only in credits.

| Plan | Monthly | Credits per month | Yearly |
| --- | --- | --- | --- |
| Bronze | $5 | 100 | $49 |
| Silver | $19 | 500 | $189 |
| Gold | $59 | 2,000 | $489 |
| Titanium | $119 | 5,000 | $1,179 |
| Platinum | $229 | 10,000 | $2,199 |

One credit is one image in JPG, PNG, GIF, WebP or BMP. AVIF, HEIC, HEIF, JP2, SVG and TIFF cost two credits each and are available on paid plans only, and each extra language costs one credit. As of November 2026, a one-time pack of 50 credits is $3, new accounts start with 25 free credits and no credit card, and unused credits roll over when a plan renews normally. Enterprise pricing is by quote.

## Good to know

The API accepts JPEG, PNG, GIF, WebP and BMP up to 16 MB and at least 50 by 50 pixels, and image creation is limited to four calls a second. Keywords, negative keywords and Final Pass prompts must be written in English even when the output language is not. An MCP connection lasts 90 days before you approve it again.

Automatic publishing is the risk as well as the feature. A plugin that writes straight to the live `alt` attribute will describe decorative images that should be skipped, and it cannot know that a photo is there to show a specific person or a specific defect. Run bulk jobs into a review queue where your platform allows it, and spot-check the first batch. Questions about how the service handles a particular platform go to [AltText.ai support](https://alttext.ai/support).

The alternative is a general assistant. [Claude](/tools/claude), [ChatGPT](/tools/chatgpt) and [Gemini](/tools/gemini) can all describe an uploaded image and can be told the page context in the same prompt, which often gives a better single description. What they lack is the plumbing: the CMS plugins, the bulk backfill, and the library that remembers which images are done. Use an assistant for a handful of important images and AltText.ai when the problem is thousands of them.
