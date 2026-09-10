---
name: "Claude for Chrome"
description: "Anthropic's Chrome extension that lets Claude read pages, click, fill forms, and run tasks in your signed-in browser, with site permissions and action checks."
seoDescription: "Claude for Chrome (Claude in Chrome) is Anthropic's browser agent extension: what it does, which plans include it, the Cowork side panel, and safety controls."
date: 2026-09-10
url: "https://claude.com/claude-in-chrome"
pricing: "paid"
category: "extension"
color: "pink"
topics: ["ai-at-work", "ai-agents-systems"]
audience: ["developers", "founders", "marketers"]
tags: ["claude", "chrome", "browser-agent", "extension", "computer-use", "anthropic"]
featured: false
related: ["tool:claude", "tool:claude-cowork", "tool:claude-code", "tool:browser-use", "tool:skyvern", "tool:claude-for-excel", "guide:browser-agents-compared-2026", "guide:how-computer-use-agents-work", "glossary:computer-use", "glossary:prompt-injection"]
alternativeTo: ["browser-use", "skyvern"]
os: ["macOS", "Windows"]
sameAs: ["https://claude.com/blog/claude-for-chrome"]
summary: "Claude for Chrome (branded Claude in Chrome) is Anthropic's browser agent extension. Claude sees the page you are on and clicks, types, navigates, and fills forms using your existing logins, with per-site permissions, blocked categories, and confirmation before risky actions. Piloted with 1,000 Max users in August 2025, it is now on all paid plans."
faq:
  - q: "What is Claude for Chrome?"
    a: "Claude for Chrome, called Claude in Chrome by Anthropic, is a Chrome Web Store extension that lets Claude act inside your browser: read the page you are signed in to, click links and buttons, type, fill forms, take screenshots, and work across a group of tabs. On Max and Team plans (Pro rolling out) the side panel runs as a full Claude Cowork session with skills, plugins, and saved history."
  - q: "Which plans include Claude for Chrome?"
    a: "All paid plans: Pro, Max, Team, and Enterprise. It is not on the Free plan. It launched as a pilot for 1,000 Max users via waitlist on August 25, 2025 and opened in beta to all paid plans on December 18, 2025; Anthropic's product page now describes it as generally available, with the Cowork side panel in beta."
  - q: "Which browsers are supported?"
    a: "Google Chrome, installed from the Chrome Web Store. Anthropic's help center says Claude in Chrome is not supported on other Chromium-based browsers or on mobile devices. Claude Code has its own Chrome integration for testing web apps."
  - q: "How does Claude for Chrome protect against prompt injection?"
    a: "Layers. You grant or revoke access per site; adult and pirated-content sites are blocked and financial sites need permission; high-risk actions such as purchases, publishing, sharing personal data, downloading files, or entering sensitive information require confirmation; and content classifiers scan untrusted page content for injections. Anthropic still says protections are not foolproof and advises against financial transactions or password management."
  - q: "Can it run tasks on a schedule?"
    a: "Yes. Claude in Chrome supports scheduled recurring tasks and background workflows, and because side-panel sessions live with your account rather than the machine, conversations and results save to your history. Team and Enterprise admins can restrict which sites Claude may visit with allowlists and blocklists."
---

Claude for Chrome, which Anthropic brands as Claude in Chrome, is a browser extension that turns [Claude](/tools/claude) into an agent inside your signed-in browser. Claude sees the page you are on, then clicks, types, navigates between pages, and fills forms using your existing logins, while you watch or step away. It is the consumer counterpart to computer-use agents developers build with [Browser Use](/tools/browser-use) or [Skyvern](/tools/skyvern), packaged with permissions and safety checks rather than an API.

It is aimed at anyone who spends the day in web apps that have no connector: booking, admin portals, CRM data entry, research across many tabs. Developers also use it for quick checks on a staging site, though [Claude Code](/tools/claude-code) has its own Chrome integration for that job.

## Highlights

- **Acts on the page you are already in.** Reads content, clicks, types, fills forms, takes screenshots, and works across the tabs you drag into its tab group.
- **A Cowork session in the side panel.** On Max and Team plans (rolling out to Pro; Enterprise with admin enablement) the side panel is a full [Claude Cowork](/tools/claude-cowork) session: conversations save to your history, sync across devices, and can use skills and plugins.
- **Scheduled and background tasks.** Set recurring tasks and let Claude complete work while you focus elsewhere.
- **Per-site permissions.** Grant or revoke Claude's access to specific sites in settings. Adult and pirated-content sites are blocked; financial sites require permission before access.
- **Confirmation before consequential actions.** Purchases, publishing, sharing personal data, downloading a file, or entering sensitive information trigger a check. In "automatically approve" mode Claude screens each action for risk and hidden instructions and pauses only when something needs you.
- **Admin controls.** Team and Enterprise organizations can apply allowlists and blocklists to restrict where Claude can go.

## In an AI-assisted workflow

The reliable pattern is narrow, read-mostly tasks on sites you would be comfortable letting a contractor use, with the write step left to you. For example, with the side panel open on a vendor portal:

```text
Open each of the six invoices listed on this page, pull the invoice
number, date, amount, and PO reference into a table, and flag any
whose amount differs from the PO. Do not download anything or change
any invoice status. Stop and show me the table before doing anything else.
```

Because the side panel is a Cowork session, the same [plugins](/glossary/claude-plugins) and skills you use elsewhere apply here, and a recurring version of this task can be scheduled.

> [!WARNING]
> Anthropic is direct about the risk: browser agents face prompt-injection attacks from page content, and the protections are not foolproof. Its own guidance is to avoid financial transactions, password management, and anything involving sensitive personal, legal, or medical data. Prefer a separate browser profile with only the accounts a task needs.

## Good to know

Availability, as of September 2026: all paid plans (Pro, Max, Team, Enterprise); not Free. Install from the Chrome Web Store and sign in with your Claude account. The pilot ran from August 25, 2025 with 1,000 Max users on a waitlist; on December 18, 2025 it opened in beta to all paid plans with Claude Code integration and admin controls. The product page now calls it generally available, while the Cowork side-panel mode is still labeled beta in the help center. Supported browser is Google Chrome; the help center says other Chromium browsers and mobile are not supported. A 1Password integration for logins is in beta on macOS.

On safety numbers: Anthropic's launch post reported that its mitigations cut the attack success rate in autonomous mode from 23.6% to 11.2%, and browser-specific attacks from 35.7% to 0%, in its red-teaming at the time. Anthropic's general-availability post of August 26, 2026 reported that, with probes plus the automatic-approval safety classifiers, no attacks succeeded against Claude Sonnet 5 or Opus 5 and 0.3% succeeded against Fable 5, against a 3.8% baseline for Opus 5 without those safeguards. Treat those as Anthropic's own figures, not independent ones. For deeper background on how these agents work, see [how computer-use agents work](/guides/concepts/how-computer-use-agents-work) and the [browser agents comparison](/guides/comparisons/browser-agents-compared-2026). If the data you need is in a spreadsheet rather than a web page, [Claude for Excel](/tools/claude-for-excel) is the better fit.
