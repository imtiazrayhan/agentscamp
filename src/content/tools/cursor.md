---
name: "Cursor"
description: "An AI code editor built on VS Code with parallel agents, cloud agents, a CLI, and its own Grok and Composer models. Part of SpaceX since August 2026."
date: 2026-06-03
updated: "2026-11-27"
reviewed: "2026-11-27"
url: "https://cursor.com"
pricing: "freemium"
category: "ide"
color: "blue"
topics: ["coding-languages"]
tags: ["ide", "editor"]
featured: true
alternativeTo: ["windsurf", "github-copilot", "zed", "void", "antigravity"]
summary: "Cursor is an AI code editor forked from VS Code, with an Agents Window for parallel agents, cloud agents, and a CLI. SpaceX acquired it in August 2026, and plans now share one subscription with Grok and X: Free, Plus, Premium, Super and Ultra. Paid plans include a weekly pool of Grok and Composer usage; Claude, GPT and Gemini bill separately."
faq:
  - q: "How much does Cursor cost?"
    a: "As of November 2026, cursor.com/pricing lists Free at $0, Plus at $8 a month, Premium at $30, Super at $100 and Ultra at $200, with annual billing at $80, $300, $1,000 and $2,000 a year. Teams seats are $30, $100 or $200 per seat per month and Enterprise is custom. Third-party model usage is not included in those prices."
  - q: "Are Claude and GPT models included in a Cursor plan?"
    a: "No. As of November 2026 the included weekly pool covers Cursor's own models: Grok 4.7, Grok 4.6, Grok 4.5 and Composer 2.5. Claude, GPT and Gemini models are available on Premium and above at the model's API list price, paid from prepaid credit from the first request. Plus and Free do not include third-party models at all."
  - q: "Who owns Cursor?"
    a: "SpaceX. Cursor's blog announced on August 14, 2026 that Cursor had officially been acquired by SpaceX. Since then the subscription has been shared with Grok and X, usage is managed at grok.com/dashboard, and Cursor's blog is where new Grok models are announced."
  - q: "Does Cursor have a CLI?"
    a: "Yes. Install it on macOS, Linux or Windows under WSL with curl https://cursor.com/install -fsS | bash. The docs cover a shell mode, ACP support and a headless mode for CI, and CLI usage draws from the same weekly pool as the editor."
audience: ["developers"]
related: ["tool:claude-code", "tool:windsurf", "tool:continue", "guide:vibe-coding-guide", "guide:testing-ai-generated-code", "glossary:vibe-coding"]
---

Cursor is a code editor forked from VS Code with AI built into every part of the editing loop. Because it shares the VS Code codebase, extensions, themes, keybindings and settings carry over. What it adds is tab completion, inline edits, and agents that read, write and run commands across a repository.

SpaceX acquired Cursor in August 2026, and the product has changed shape since. A Cursor subscription is now the same subscription as [Grok](/tools/grok) and X, the default models are Grok and Cursor's in-house Composer, and the editor is one surface among several: an Agents Window, cloud agents, a CLI, a web app and an iOS app.

## Highlights

- **Tab and inline edits.** Multi-line, context-aware completion, plus select-and-describe edits in natural language. Reference files, symbols or docs with `@` mentions.
- **Agents Window.** Introduced with Cursor 3.0 on April 2, 2026: run many agents in parallel across repos and environments, locally, in git worktrees, in the cloud, or on remote SSH.
- **Cloud agents and Automations.** Agents that run on Cursor's infrastructure instead of your machine. Available on Premium and above.
- **Bugbot and Origin.** Bugbot reviews pull requests; Origin is Cursor's own code hosting, which can also mirror GitHub. Both start at Premium.
- **Customization.** Rules, skills, subagents, hooks, plugins and [MCP](/glossary/model-context-protocol) servers, with a marketplace and, on Teams, a private team marketplace.
- **Voice chat.** A realtime voice call with an agent, powered by Grok Voice, in the Agents Window, the IDE, the web app and Cursor for iOS.
- **Agent SDK.** Define an agent as a folder of code, test it with evals and deploy it: `npx @cursor/agent-sdk init ./my-bot`.
- **Models.** Cursor's own Grok 4.7, 4.6, 4.5 and Composer 2.5, plus third-party models from Anthropic, OpenAI, Google and others on Premium and above.

## In an AI-assisted workflow

In the editor, the common loop is to describe a change, let the agent draft edits across files, and review the diff before accepting:

```text
@components/Button.tsx Refactor this to accept a `variant` prop
and update all call sites in @app/.
```

The same agent runs from a terminal:

```bash
# macOS, Linux and Windows (WSL)
curl https://cursor.com/install -fsS | bash
```

For work that splits cleanly, start several agents in the Agents Window, each in its own worktree, and review them one at a time. For anything that should outlive your laptop session, hand it to a cloud agent.

> [!NOTE]
> Agents can run shell commands. Auto-run, browser and network controls that an admin can enforce are an Enterprise feature; on individual plans the guardrails are your own settings and review.

## Pricing

As of November 2026, from cursor.com/pricing and Cursor's pricing docs:

| Plan | Price | Usage and what it adds |
| --- | --- | --- |
| Free | $0 | Limited agent and chat requests |
| Plus | $8/month | Base pool; Cursor's own models only, at fixed settings |
| Premium | $30/month | 4x Plus; cloud agents and Automations, Origin, Bugbot, third-party models, Grok Bot |
| Super | $100/month | 15x Plus; priority model access at peak times |
| Ultra | $200/month | 50x Plus; earliest access to new products and models |
| Teams | $30, $100 or $200 per seat/month | Seat matches the Premium, Super or Ultra tier; adds central billing, analytics, SAML/OIDC SSO |
| Enterprise | Custom | Pooled usage, SCIM, invoicing, granular spend and security controls |

Each paid plan includes one pool of usage for Cursor's models, shared across the editor, the CLI, cloud agents, Grok Bot and the Grok apps. The pool refreshes weekly. When it runs out you wait for the reset, buy prepaid credit, or upgrade; Cursor says requests are never downgraded in quality or speed.

Third-party models such as Claude, GPT and Gemini sit outside the pool. On Premium and above they bill at the provider's API list price from prepaid credit, and Teams and Enterprise add a Cursor Token Rate on eligible models.

## Good to know

The plan you remember is gone. The Hobby and Pro names no longer appear on the pricing page, and the cheapest paid plan, Plus, is narrower than it looks: Cursor's docs say it has no Auto mode, cloud agents, Automations, Bugbot, Origin, third-party models, or use of your own API key.

Budgeting is harder than a flat price suggests if you prefer Claude or GPT models, because every such request is metered on top of the subscription. Set the monthly additional-usage limit before you start.

Cursor is a separate application, not an extension, so it runs alongside a standard VS Code install. It is closed source, and since the acquisition the account, billing dashboard and bundled benefits are tied to Grok and X.

Alternatives: [Claude Code](/tools/claude-code) is a terminal-first agent on Anthropic's models; [GitHub Copilot](/tools/github-copilot) stays inside stock VS Code and JetBrains; [Google Antigravity](/tools/antigravity) has a free individual plan built around Gemini; [Zed](/tools/zed) is an open-source editor that is not a VS Code fork. Head-to-heads: [Claude Code vs Cursor](/guides/comparisons/claude-code-vs-cursor), [GitHub Copilot vs Cursor](/guides/comparisons/github-copilot-vs-cursor) and [Cursor vs Windsurf](/guides/comparisons/cursor-vs-windsurf).
