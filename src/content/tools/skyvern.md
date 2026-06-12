---
name: "Skyvern"
description: "Open-source vision + LLM browser automation aimed at replacing brittle RPA — workflow builder, CAPTCHA/2FA handling, and self-host or cloud."
date: 2026-06-11
url: "https://www.skyvern.com"
pricing: "open-source"
category: "platform"
repo: "https://github.com/Skyvern-AI/skyvern"
license: "AGPL-3.0"
os: ["macOS", "Windows", "Linux"]
color: "purple"
topics: ["ai-agents-systems"]
tags: ["browser-agents", "rpa", "automation", "workflows"]
featured: false
alternativeTo: ["browser-use", "stagehand"]
sameAs:
  - "https://github.com/Skyvern-AI/skyvern"
  - "https://app.skyvern.com"
  - "https://www.ycombinator.com/companies/skyvern"
related: ["browser-agents-compared-2026", "browser-use", "stagehand", "how-computer-use-agents-work", "human-in-the-loop"]
summary: "Skyvern (AGPL-3.0, ~22k stars, YC-backed) is the business-workflow take on browser agents: computer vision + LLMs operating websites without site-specific scripts, with native CAPTCHA solving and 2FA support, a workflow builder, and a code-generation mode that writes its own Playwright to cut vision costs. Self-host (Postgres required) or cloud with monthly free credits."
faq:
  - q: "What makes Skyvern different from Browser Use and Stagehand?"
    a: "Audience and packaging. Browser Use and Stagehand are developer SDKs; Skyvern is built toward operational workflows — the RPA-replacement jobs: form filling at scale, invoice processing, portal automation — with a workflow builder fed by chat, SOP documents, or browser recordings, plus the unglamorous essentials those jobs need: CAPTCHA solving and 2FA/TOTP."
  - q: "Can I self-host Skyvern?"
    a: "Yes — it's AGPL-3.0: pip install skyvern, skyvern quickstart, with PostgreSQL and your own LLM keys. The AGPL matters if you embed it in proprietary SaaS. The cloud offering removes the ops and currently advertises 5,000 free credits monthly (detailed pricing isn't public)."
  - q: "Isn't vision-based automation expensive?"
    a: "Token-hungry, yes — every step can mean a vision-model call. Skyvern's own answer is its code-generation mode: the agent writes and maintains Playwright code from prompts, running deterministic script where the page is stable and falling back to vision where it isn't (the company claims large cost/speed wins from this hybrid)."
---

Skyvern aims at the automation graveyard: every RPA script that died when a website changed its layout. Its bet is **vision + LLM instead of selectors** — the agent looks at the page like a person, so the workflow survives redesigns — packaged not as an SDK demo but as a platform for the workflows businesses actually run.

## Highlights

- **Selector-free automation** — computer vision and language models operate arbitrary sites; layout changes that kill classic RPA don't kill the run.
- **The operational essentials** — native CAPTCHA solving and 2FA/TOTP support, the two walls real-world portal automation hits first.
- **Workflow builder, many inputs** — define automations via chat, SOP documents, browser recordings, a visual builder, or the Python/TypeScript SDKs.
- **Hybrid execution** — the newer code-gen mode writes and maintains its own Playwright from prompts, mixing cheap deterministic steps with vision where needed.
- **Built for volume** — form filling at scale, document processing, data extraction; SOC 2 and HIPAA posture for the enterprise cases.
- **Self-host or cloud** — full AGPL stack (`pip install skyvern`, Postgres required) or the managed app with monthly free credits.

## In an AI-assisted workflow

```bash
pip install skyvern && skyvern quickstart
# or: point the SDK at the cloud — launch_cloud_browser() — and skip the ops
```

The fit test is the task's shape: if it reads like an SOP — "every Monday, log into these five vendor portals and download statements" — Skyvern's platform framing pays. If it reads like code, the [SDK-first frameworks](/guides/comparisons/browser-agents-compared-2026) fit better.

> [!WARNING]
> Automating logins, CAPTCHAs, and 2FA is powerful precisely because it's sensitive: scope credentials per workflow, prefer dedicated service accounts, and keep [human gates](/glossary/human-in-the-loop) on actions that move money or submit legal forms.

## Good to know

AGPL-3.0 (copyleft — relevant for embedding), Python 3.11–3.13, YC-backed with a claimed 30k+ users. Cloud pricing beyond the free monthly credits isn't published — budget via a pilot. For the conceptual loop underneath all these tools, see [How Computer-Use Agents Work](/guides/concepts/how-computer-use-agents-work).
