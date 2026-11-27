---
name: "Skyvern"
description: "Open-source browser automation that uses LLMs and computer vision in place of selectors, with a workflow builder, CAPTCHA and 2FA handling, and a cloud."
date: 2026-06-11
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://www.skyvern.com"
pricing: "open-source"
category: "platform"
repo: "https://github.com/Skyvern-AI/skyvern"
license: "AGPL-3.0"
os: ["macOS", "Windows", "Linux"]
color: "purple"
topics: ["ai-agents-systems"]
audience: ["ai-engineers"]
tags: ["browser-agents", "rpa", "automation", "workflows"]
featured: false
alternativeTo: ["browser-use", "stagehand"]
sameAs:
  - "https://github.com/Skyvern-AI/skyvern"
  - "https://app.skyvern.com"
  - "https://www.ycombinator.com/companies/skyvern"
related: ["guide:browser-agents-compared-2026", "tool:browser-use", "tool:stagehand", "guide:how-computer-use-agents-work", "glossary:human-in-the-loop"]
summary: "Skyvern automates browser workflows with LLMs and computer vision, so a run does not depend on site-specific selectors. It pairs a Playwright-compatible SDK with a no-code workflow builder and handles logins, CAPTCHAs and 2FA. The code is AGPL-3.0 and self-hostable; Skyvern Cloud is a paid service with a 14-day trial."
faq:
  - q: "What makes Skyvern different from Browser Use and Stagehand?"
    a: "Packaging and audience. Browser Use and Stagehand are developer SDKs. Skyvern ships an SDK too, but adds a no-code workflow builder, stored credentials, 2FA handling, scheduling and run recordings, aimed at the jobs RPA used to do: form filling, invoice downloads and portal work that an operations team owns."
  - q: "How much does Skyvern Cloud cost?"
    a: "As of November 2026, Hobby is $29 a month with 30,000 credits and 10 concurrent agents, Pro is $149 a month with 150,000 credits and 25 concurrent agents, and Enterprise is custom. Hobby and Pro start with a 14-day free trial that requires a card. One credit is $0.001: an AI action costs 30 credits, a cached action 15, and browser uptime 200 credits an hour."
  - q: "Can I self-host Skyvern?"
    a: "Yes. Run pip install \"skyvern[server]\" and then skyvern quickstart on Python 3.11, 3.12 or 3.13, with your own LLM keys. The pip path defaults to a SQLite database, so Postgres is optional. The pip package does not include the web UI; use Docker Compose for the full stack. The licence is AGPL-3.0, which matters if you offer a modified Skyvern as a network service."
  - q: "Does Skyvern work with Claude Code?"
    a: "Yes, through its hosted MCP server: claude mcp add --transport http skyvern https://api.skyvern.com/mcp/ --scope user, then sign in through the browser. Skyvern's docs also cover Cursor, Codex, Claude Desktop and Windsurf."
---

[Skyvern](https://www.skyvern.com) automates browser-based workflows using **LLMs and computer vision instead of selectors**. The agent looks at the page the way a person would, so a workflow is not tied to one site's markup and can survive a redesign that would break a scripted RPA bot. It ships as a Playwright-compatible SDK and as a no-code workflow builder, from a Y Combinator-backed company. The repository is AGPL-3.0 and had about 23,500 GitHub stars as of November 2026.

## Highlights

- **Tasks and workflows.** A task is one goal on one site: a URL, a prompt, and optionally a data schema for the output. A workflow chains tasks, for example "open the invoices page, filter by date, download each one".
- **Playwright plus AI.** In the SDK you mix ordinary Playwright calls with AI actions on the same page: `page.click("#login-button")` next to `page.click(prompt="Add first item to cart")` or `page.agent.run_task(...)`.
- **Logins and 2FA.** Stored credentials, password-manager integrations, and 2FA through authenticator apps, email codes and SMS codes.
- **CAPTCHA solving and proxies.** Cloud plans include a CAPTCHA solver and geo-targeted proxies, with residential proxies from the Pro plan.
- **Cached actions.** A step that has already succeeded can be replayed from generated code without calling the model, which Skyvern Cloud bills at half the price of an AI action.
- **Run visibility.** Livestreaming of the browser, recordings, screenshots and logs per run, plus schedules and webhooks.
- **Integrations.** A hosted MCP server for coding agents, and connectors for Zapier, Make and n8n.

## In an AI-assisted workflow

Self-host the API server (Python 3.11, 3.12 or 3.13). The pip quickstart uses SQLite by default:

```bash
pip install "skyvern[server]"
skyvern quickstart
```

Then run a task from Python. This example uses a Skyvern Cloud key; `Skyvern.local()` runs the browser on your own machine and needs `pip install "skyvern[local]"`:

```python
import asyncio
from skyvern import Skyvern

async def main():
    skyvern = Skyvern(api_key="your-api-key")  # or Skyvern.local()
    task = await skyvern.run_task(prompt="Find the top post on hackernews today")
    print(task)

asyncio.run(main())
```

To drive it from Claude Code, add the hosted MCP server and sign in when prompted:

```bash
claude mcp add --transport http skyvern https://api.skyvern.com/mcp/ --scope user
```

The fit test is the task's shape. If it reads like a standard operating procedure ("every Monday, log into these five vendor portals and download statements"), Skyvern's platform framing pays off. If it reads like code, the [SDK-first frameworks](/guides/comparisons/browser-agents-compared-2026) fit better.

> [!WARNING]
> Automating logins, CAPTCHAs and 2FA is sensitive by nature. Scope credentials per workflow, prefer dedicated service accounts, and keep [human gates](/glossary/human-in-the-loop) on actions that move money or submit legal forms.

## Pricing

Self-hosting is free under AGPL-3.0; you pay for LLM calls and your own infrastructure. As of November 2026, Skyvern Cloud lists three plans:

| | Hobby | Pro | Enterprise |
| --- | --- | --- | --- |
| Price | $29 a month | $149 a month | Custom |
| Included credits | 30,000 a month | 150,000 a month | Custom |
| Concurrent agents | 10 | 25 | Unlimited |
| CAPTCHA solver | Basic | Advanced | Elite |
| Proxy | Datacenter | Residential | Residential |
| 2FA / TOTP | No | Yes | Yes |

Hobby and Pro begin with a 14-day free trial of 30,000 credits that requires a card, as of November 2026; cancel before day 14 and nothing is charged. One credit is $0.001, as of November 2026: an AI action (a click, a keystroke, an extraction) costs 30 credits, a cached action 15, browser uptime 200 credits an hour, and reading a one-time code from email or SMS 10. Enterprise adds HIPAA compliance, a SOC 2 Type 2 report, SAML SSO, role-based access control and human-in-the-loop steps.

## Good to know

- **Cost scales with actions.** At 30 credits per AI action, a long multi-page run adds up; the Hobby allowance covers about 1,000 uncached actions a month before browser uptime. Estimate actions per run before you pick a plan.
- **AGPL is copyleft.** Running it internally is fine. Offering a modified version to others over a network obliges you to publish your changes, so check with counsel before embedding it in a product.
- **The pip install has no UI.** `pip install "skyvern[server]"` gives you the API server only; the web UI comes with Docker Compose or a source checkout.
- **Vision is slower than a selector.** For a stable page you control, a plain Playwright script is faster and cheaper. Skyvern earns its cost on sites you do not control and that change.
- **No free cloud tier.** There is a trial, not a permanent free plan.

Alternatives: [Browser Use](/tools/browser-use) is the open-source Python agent library to pick when you want to own the loop in code. [Stagehand](/tools/stagehand) adds AI primitives to Playwright and pairs with [Browserbase](/tools/browserbase) for hosted browsers. Skyvern is the one to choose when non-developers need to build and run the workflows too. For the loop underneath all of them, see [How Computer-Use Agents Work](/guides/concepts/how-computer-use-agents-work).
