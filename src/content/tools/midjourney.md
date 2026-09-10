---
name: "Midjourney"
description: "An image and video generator with a web app and a Discord bot, known for strong aesthetic defaults, style references, an inpainting editor, and paid-only plans."
seoDescription: "Midjourney for designers: web app and Discord, style and omni references, the editor, image-to-video, plan tiers, and the commercial-use rules in 2026."
date: 2026-09-10
url: "https://www.midjourney.com"
pricing: "paid"
category: "design"
color: "pink"
os: ["Web"]
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
tags: ["image-generation", "midjourney", "style-reference", "inpainting", "video"]
featured: false
alternativeTo: ["ideogram", "recraft"]
sameAs: ["https://docs.midjourney.com"]
related: ["tool:recraft", "tool:ideogram", "tool:fal", "guide:best-ai-image-generators-2026", "guide:best-ai-tools-for-designers-2026", "guide:claude-design-guide", "glossary:text-to-image"]
keywords: ["Midjourney", "style reference sref", "Midjourney editor", "Midjourney commercial use", "Midjourney plans"]
summary: "Midjourney generates images and short videos through a web app at midjourney.com and a Discord bot. Style References, Omni Reference, an inpainting and outpainting editor, and Style Creator give it more art direction than a plain prompt box. Plans are Basic, Standard, Pro, and Mega, all paid, and the commercial-use terms depend on your company's revenue."
faq:
  - q: "Do I still need Discord to use Midjourney?"
    a: "No. Midjourney has a web app at midjourney.com with its own creation flow, gallery, and editor. Discord still works and the docs still document Discord syntax such as the --sref parameter for style references, so teams that built a Discord workflow can keep it."
  - q: "What are Midjourney's plans?"
    a: "Basic, Standard, Pro, and Mega. Each includes a monthly amount of Fast GPU time that resets on renewal and does not carry over. Relax Mode gives unlimited image generations on Standard, Pro, and Mega, and unlimited video generations on Pro and Mega. Stealth Mode, which keeps your images and videos private, is only on Pro and Mega. Midjourney's docs list a 20 percent discount for committing to an annual plan paid upfront."
  - q: "Can I use Midjourney images commercially?"
    a: "Midjourney's terms say you own all assets you create with the service to the fullest extent possible under applicable law, subject to the agreement and to third-party rights. There is a revenue condition: if you are a company, or an employee of a company, with more than 1,000,000 US dollars a year in revenue, you must be subscribed to a Pro or Mega plan to own your assets. Images you upscale that were made by others remain owned by the original creators."
  - q: "Can Midjourney make video?"
    a: "Yes, from an image. The Animate Image buttons under any image in your gallery generate a five-second video, with high-motion and low-motion options, an automatic mode, a loop mode where the first and last frames match, and a manual mode that lets you adjust the text prompt first. Videos download for social, as a raw file, or as an animated GIF."
---

Midjourney is the image generator that made aesthetic defaults a feature. Given a plain prompt it produces something composed rather than something literal, which is either the reason you use it or the reason you do not. For designers the useful surface is not the prompt box, it is the direction controls layered on top of it: style references, character and object references, a real editor, and saved styles.

It runs as a web app at midjourney.com and as the original Discord bot. The web app carries the gallery, the editor, and the animation controls; Discord keeps the parameter syntax that the docs still describe, including `--sref` for style references.

## Highlights

- **Style Reference.** Point at an image and Midjourney matches its look and feel. In Discord that is `--sref` plus an image URL, and it needs a text prompt alongside it rather than replacing one.
- **Omni Reference.** Puts a specific person or object into your images. It is compatible with version 7 and costs twice the GPU time of a regular V7 image.
- **The Edit Model.** On versions 8.1 and 8.2 it generates from up to four reference images and replaces the older Omni Reference and Character Reference flow, and it drives inpainting inside the frame and outpainting beyond it.
- **The editor.** A web interface for adjusting Midjourney images and your own uploads, combining Remix, inpainting through Vary Region, Pan, and Zoom Out in one place.
- **Style Creator.** Build and reuse a style rather than re-describing it in every prompt, which is what turns a generator into something a brand can use twice.
- **Image to video.** Any gallery image gets Animate Image buttons for a five-second clip, with high-motion, low-motion, auto, loop, and manual prompt modes.

## In a designer's workflow

Midjourney is a mood and texture engine, not a layout engine. It will not put legible copy in a banner and it will not hand you an editable file. Use it where those things do not matter: exploration, texture, environment plates, and reference imagery you will composite or paint over.

The workflow that holds up is to fix the style once and then vary only the subject.

```text
--sref <url to your approved style plate> --sw 100
product photography of a matte ceramic mug on a linen surface,
soft north light, shallow depth of field, no text
```

Lock the style reference and weight, keep it in a shared note next to the brand kit, and every teammate generating for the same campaign starts from the same look. When the deliverable needs real type in the image, hand that job to [Ideogram](/tools/ideogram). When it needs to leave as an editable vector, hand it to [Recraft](/tools/recraft).

> [!WARNING]
> Images are public by default unless you are on a plan with Stealth Mode. If you are exploring a product that has not been announced, Stealth Mode is on Pro and Mega only, and it is the plan decision that matters more than the GPU hours.

## Good to know

There is no free tier: Basic, Standard, Pro, and Mega are all subscriptions. Fast time is a fixed monthly amount of GPU time that resets each renewal without rollover, and extra Fast hours can be bought by the hour. Relax Mode covers unlimited image generations from Standard up and unlimited video generations from Pro up, which is the practical answer to running out of Fast time mid-project.

The commercial terms deserve a read before a client project. Midjourney says you own your assets to the fullest extent possible under applicable law, but a company, or an employee of a company, with more than 1,000,000 US dollars a year in revenue must be on Pro or Mega to own them. That makes plan choice a legal question at agency scale, not a budget one, and it is worth confirming the current wording on Midjourney's own commercial-use page before signing off.

Against the alternatives: [Recraft](/tools/recraft) is the one that outputs editable vectors and enforces a reusable brand style, and [Ideogram](/tools/ideogram) is the one that renders text you can actually ship. See [best AI image generators in 2026](/guides/comparisons/best-ai-image-generators-2026) for the head-to-head, [best AI tools for designers in 2026](/guides/comparisons/best-ai-tools-for-designers-2026) for the wider set, and the [Claude Design guide](/guides/design/claude-design-guide) for putting generated imagery into a layout.
