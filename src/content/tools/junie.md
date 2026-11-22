---
name: "Junie"
description: "JetBrains' AI coding agent. The Junie IDE plugin is retiring as Junie moves into JetBrains Air; Junie CLI and the free Junie Lite tier continue."
seoDescription: "Junie by JetBrains in November 2026: the IDE plugin retires into JetBrains Air (2026.2 stops December 3, 2026), plus Junie CLI, Junie Lite and pricing."
date: 2026-11-15
reviewed: 2026-11-22
url: "https://junie.jetbrains.com/"
pricing: "freemium"
category: "agent"
color: "purple"
os: ["macOS", "Windows", "Linux"]
topics: ["workflow-prompting", "ai-agents-systems"]
audience: ["developers"]
tags: ["junie", "jetbrains", "coding-agent", "jetbrains-air", "cli", "code-review"]
featured: false
alternativeTo: ["github-copilot", "cursor", "claude-code", "windsurf"]
sameAs: ["https://github.com/JetBrains/junie", "https://x.com/jetbrains", "https://www.linkedin.com/company/jetbrains/"]
related: ["tool:claude-code", "tool:github-copilot", "tool:cursor", "tool:windsurf", "guide:best-claude-code-alternatives-2026", "guide:best-github-copilot-alternatives-2026", "guide:ai-code-review-workflow", "glossary:coding-agent"]
keywords: ["Junie", "JetBrains Junie", "Junie plugin", "Junie CLI", "JetBrains Air", "Junie Lite"]
summary: "Junie is JetBrains' AI coding agent. Its IDE plugin is retiring: it is already off in 2026.3 IDEs and stops working in 2026.2 on December 3, 2026, as Junie moves into JetBrains Air with your account, AI plan and .junie/ files. Junie CLI keeps running in any terminal and in CI, and Junie Lite is a free model tier as of November 2026."
faq:
  - q: "Is the Junie plugin being discontinued?"
    a: "Yes. JetBrains' answer to 'What happens to the Junie plugin?' is: 'It's retiring. On 2026.3 it's already off, and on 2026.2 it stops working on December 3, 2026. Junie moves into Air, and your account, AI plan and .junie/ files come with it.' Junie itself continues as the coding agent in JetBrains Air and as Junie CLI."
  - q: "Do I need JetBrains Air to use Junie?"
    a: "No. JetBrains says 'Air is the easiest place to start if you work in a JetBrains IDE. Junie CLI runs in any terminal, and the same agent runs in GitHub Actions and GitLab CI/CD.' Air is optional if you only want the agent in a terminal or a pipeline."
  - q: "Is Junie free?"
    a: "There is a free option as of November 2026. Junie Lite is 'a free baseline model tier for Junie', with no published quota, and it is not available inside JetBrains AI Assistant. JetBrains' homepage says the offer is valid until 31 Dec 2026 while its docs say Lite is not a trial and does not expire, so check the current terms. You can also bring your own model key, and JetBrains AI plans add monthly credits."
  - q: "How do I install Junie CLI?"
    a: "On macOS or Linux run curl -fsSL https://junie.jetbrains.com/install.sh | bash, or use Homebrew (brew tap jetbrains-junie/junie, then brew install junie) or npm (npm install -g @jetbrains/junie). Windows has a PowerShell installer in the JetBrains/junie repository. You then sign in with a JetBrains Account, a Junie API key, or your own key for Anthropic, OpenAI, Google, xAI, OpenRouter or Copilot."
---

**Junie's IDE plugin is retiring.** JetBrains' FAQ says so directly: "It's retiring. On 2026.3 it's already off, and on 2026.2 it stops working on December 3, 2026." Junie itself is not going away. It is now "the coding agent in Air, inside your JetBrains IDE", and "your account, AI plan and .junie/ files come with it". Junie CLI keeps running "in any terminal, and the same agent runs in GitHub Actions and GitLab CI/CD". Junie Lite remains a free model tier as of November 2026. If you use the plugin on a 2026.2 IDE, plan the move to JetBrains Air before December 3.

Junie is JetBrains' AI [coding agent](/glossary/coding-agent). It left beta on June 17, 2026, and "the same agent is behind the AI chat, the dedicated Junie tool window, and Junie CLI". JetBrains Air, its new home, is described as "one system for building software with agents". Air also runs Claude Agent, Codex, Copilot, OpenCode and any agent you can connect through ACP, so choosing Air does not tie you to Junie.

## Highlights

- **Plan mode.** "Before Junie writes code, it produces a structured document with tabs for product requirements, technical design, delivery stages." Plans are saved in `.junie/plans`.
- **Agentic debugging.** "Junie can drive your IDE's debugger the way you would." JetBrains says this works end to end in JetBrains IDEs with an AI subscription.
- **Code review in CI.** "Trigger a review from GitHub Actions or GitLab (including on-prem), or by using the /review command in the CLI or the plugin."
- **Database work.** "Junie connects to the databases configured in your IDE through DataGrip and the JetBrains Database plugin."
- **Model choice.** Junie CLI "supports all the top-performing models from OpenAI, Anthropic, Google, and Grok". You can bring your own key for Anthropic, OpenAI, Google, xAI, OpenRouter or Copilot, or point it at custom endpoints through LiteLLM, Ollama or LM Studio.
- **Junie Local.** "A local inference engine that runs a large coding model on your own machine", on Apple Silicon Macs (M4 or newer, with 48 GB of RAM or more) or on Windows with an NVIDIA RTX GPU.
- **Vendor-reported numbers.** JetBrains says Junie "spends up to 35% less per task" on the same model and tasks. Its out-of-beta announcement quotes a Nebius research lead reporting 61.6% resolved and 72.7% pass@5 on SWE-Rebench. Both figures come from JetBrains' own pages, and benchmark results move from run to run.

## In an AI-assisted workflow

Junie CLI continues unchanged by the plugin retirement, so it is the stable way to script Junie:

```bash
# macOS / Linux
curl -fsSL https://junie.jetbrains.com/install.sh | bash
# or Homebrew
brew tap jetbrains-junie/junie
brew install junie
# or npm
npm install -g @jetbrains/junie
```

Windows has a PowerShell installer documented in the [JetBrains/junie](https://github.com/JetBrains/junie) README. Sign in with a JetBrains Account, a Junie API key, or your own provider key. "Junie asks before it runs a command [that] isn't on your allowlist", so keep the allowlist short at first and widen it as you learn what the agent does. In teams, admins manage policy through Air Governance.

A practical first step is review rather than authorship. Wire Junie's review into GitHub Actions or GitLab so every merge request gets an agent pass before a human looks at it. The [AI code review workflow](/guides/workflow/ai-code-review-workflow) shows how to split that work between agent and reviewer, and [running Claude Code in CI](/guides/advanced/claude-code-ci-github-actions) covers the same pattern with Anthropic's agent.

> [!TIP]
> Keep your `.junie/` files under version control if your team allows it. JetBrains says they move with you into Air, and a saved plan from `.junie/plans` gives reviewers the intent behind a change, not just the diff.

## Pricing

Junie is billed through JetBrains AI plans. As of November 2026, AI Free is free with 3 monthly AI credits and unlimited AI completion, only for commercial IDE versions. As of November 2026, AI Pro costs $100 per user per year (or $10 a month) with 10 monthly AI credits, covers Junie, Claude Agent, Codex and Gemini, and has a free 30-day trial. As of November 2026, AI Ultimate costs $300 per user per year (or $30 a month) with 35 monthly AI credits. One AI credit equals USD 1.00 of AI use, and third-party models are "billed at public API rates, with no surcharge". Credits renew every 30 days and "Unused credits don't roll over", while top-ups are valid for 12 months.

Organizations do not get fixed credit plans. Governance plans are Basic (free), Business (free during early access as of November 2026) and Enterprise. Bringing your own key runs "without additional platform charges", per JetBrains' March 2026 announcement.

## Good to know

- **License.** Proprietary. The GitHub repository holds installers and the README, and use is "subject to JetBrains AI Service Terms of Service".
- **Platforms.** macOS, Windows and Linux, in JetBrains IDEs and the CLI. "Junie is also available in Android Studio."
- **Junie Lite terms.** Lite currently runs OpenAI GPT-6 Luna, which JetBrains calls "an implementation detail, not a commitment". It "does not publish a quota number" and "is not available inside JetBrains AI Assistant". The homepage says the offer is valid until 31 Dec 2026, while the docs say Lite is not a trial and does not expire.
- **CLI history.** Junie CLI entered beta on March 9, 2026 as "the evolution of Junie into a fully standalone AI agent".

Since Air runs several agents, leaving the Junie plugin does not have to mean leaving JetBrains. If you are moving off JetBrains IDEs altogether, the usual alternatives are [GitHub Copilot](/tools/github-copilot), [Cursor](/tools/cursor), [Claude Code](/tools/claude-code) and [Windsurf](/tools/windsurf). See all [Junie alternatives](/tools/junie/alternatives), or the [best Claude Code alternatives](/guides/comparisons/best-claude-code-alternatives-2026) for the wider field of coding agents.
