---
term: "Computer Use"
description: "Computer use is an AI agent operating software through its real interface — reading the screen, moving the cursor, clicking, and typing like a person would."
date: 2026-06-11
topics: ["ai-agents-systems"]
tags: ["computer-use", "browser-agents", "automation", "agents"]
related: ["ai-agent", "vision-language-model", "playwright-mcp", "chrome-devtools-mcp", "human-in-the-loop"]
faq:
  - q: "How does computer use actually work?"
    a: "A perception-action loop: the agent receives a screenshot (or accessibility/DOM data), a vision-language model decides the next action — click these coordinates, type this text, scroll — the action executes, and a fresh screenshot comes back as the observation. Reliability comes from grounding (finding the right element) and recovery (noticing a mis-click and correcting)."
  - q: "When is computer use the right tool versus an API?"
    a: "Last resort by design: APIs and structured tools (like browser automation via Playwright MCP) are faster, cheaper, and far more reliable when they exist. Computer use earns its keep where there's no API — legacy desktop software, arbitrary websites, vendor portals — or where the task is inherently visual. If an MCP server covers it, use that first."
---

**Computer use is the agent capability of operating a computer the way a person does — perceiving the screen visually and acting through mouse and keyboard, with no API required.**

It's the generalization of tool use to interfaces never designed for machines: a [VLM](/glossary/vision-language-model) reads the screenshot, the [agent](/glossary/ai-agent) loop issues primitive actions (click, type, scroll), and each new frame is the observation that drives the next step. Anthropic shipped the first frontier version of the capability in late 2024; by 2026 it powers browser-using agents in products from coding tools to Google's Antigravity, with dedicated frameworks (Browser Use, Stagehand, Skyvern) industrializing the browser case.

Its engineering reality is honest: slower, costlier, and less reliable than structured automation — every step is a model call over an image. So the hierarchy holds: use an API when one exists, structured browser tools like [Playwright MCP](/tools/playwright-mcp) or [Chrome DevTools MCP](/tools/chrome-devtools-mcp) when the DOM is reachable, and pixel-level computer use for everything else — with [human gates](/glossary/human-in-the-loop) on anything that spends money or sends email, since a mis-grounded click is this modality's signature failure.
