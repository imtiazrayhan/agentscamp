---
name: "Figma Make"
description: "Figma's prompt-to-app tool: describe an idea or paste a design and get a working, code-backed prototype you can keep editing inside Figma."
seoDescription: "Figma Make for designers: prompt-to-prototype inside Figma, Make kits for your design system, AI credits, publishing, and code export as of September 2026."
date: 2026-09-10
url: "https://www.figma.com/make/"
pricing: "freemium"
category: "design"
color: "purple"
os: ["Web", "macOS", "Windows"]
topics: ["ai-at-work", "multimodal-ai"]
audience: ["designers"]
tags: ["figma", "prototyping", "prompt-to-app", "design-system", "react"]
featured: false
alternativeTo: ["claude-design", "v0", "lovable"]
sameAs: ["https://help.figma.com/hc/en-us/articles/31722591905559-Figma-Make-FAQs"]
related: ["tool:claude-design", "tool:stitch", "tool:framer-ai", "tool:v0", "tool:lovable", "tool:figma-mcp", "guide:claude-design-guide", "guide:claude-design-vs-figma-make", "guide:best-ai-tools-for-designers-2026", "guide:figma-to-code-with-claude"]
keywords: ["Figma Make", "prompt to prototype", "Make kits", "Figma AI credits", "Figma Make export code"]
summary: "Figma Make turns a prompt, an image, or an existing frame into a code-backed prototype that lives next to your Figma Design files. Make kits bring a real React design system in through npm packages and published libraries. It runs on Full seats on paid plans, is metered in AI credits, and exports as a published link, a zip, or a push to GitHub."
faq:
  - q: "Which Figma plans and seats include Figma Make?"
    a: "Figma's help center states that Figma Make is available for Full seats on paid plans, and that you can try Figma Make on other seats and plans. Dev, Collab, and View seats can only create Make files in drafts rather than in team folders, and cannot share those files. Starter plans cannot pull style context from a Figma Design team library, because team libraries are a paid feature."
  - q: "How is Figma Make billed?"
    a: "Through Figma's AI credits. Every seat includes a monthly allocation that depends on the plan and seat type, credits reset monthly and do not roll over, and each AI action consumes a variable number of credits based on the action, the complexity of the request, and the model used. When a team runs past its included credits, admins can buy more on a subscription package or through pay-as-you-go billing with a monthly spending limit."
  - q: "Can Figma Make use my design system?"
    a: "Yes, through Make kits. A Make kit can point at an npm package containing your production React design system, import variables and styles from published Figma libraries, and carry written guidelines for how those assets should be used. Make kits currently support only React codebases, and a package has to be published publicly or, on Organization and Enterprise plans, privately."
  - q: "What can I get out of a Figma Make file?"
    a: "A published web link with its own URL that is not discoverable by search engines by default, a password-protected or organization-only share, a template, a code download as a zip, or a direct push to a GitHub repository. You can also use Copy design to paste the prototype's current state into Figma Design as editable layers."
---

Figma Make is Figma's prompt-to-app surface. You describe an interface, paste in a frame, or point it at a design system, and it builds a working prototype that is backed by real code and stays visually editable. Figma's own pitch for it is "Prompt to code anything you can imagine," and the product page frames the loop as "Prototype. Polish. Ship."

For a working designer the interesting part is not that it generates a screen. It is where the screen lives. A Make file sits alongside your Figma Design files, can read styles and variables from your published libraries, and can push its current state back into Figma Design as editable layers with Copy design. That makes it a prototyping tool that happens to emit code, rather than a code tool you have to leave Figma to use.

## Highlights

- **Prompt, image, or existing frame as input.** Make accepts attachments, comments, annotations, and voice-to-text prompting, so a screenshot or an annotated frame can carry as much of the brief as the prompt does.
- **Make kits carry your real design system.** A kit can bring in an npm package holding your production React components, import variables and styles from published design libraries, and add written guidelines for how they should be used. Figma's docs describe the goal as prototypes that "use the exact same code as your production apps." React only, for now.
- **Point-and-edit alongside the code.** Select an element and change it directly instead of re-prompting, with version history behind you, and ask Make to explain its own code without changing it.
- **A backend when a prototype needs one.** Make connects to Supabase for secret storage, compute, and a Postgres database, which is what makes sign-in flows and saved state demoable rather than faked.
- **Real handoff paths.** Publish to a public URL, a password-protected link, or an organization-only share; download the code as a zip; or push straight to a GitHub repository.
- **Extensible.** Custom skills and MCP connectors let a Make file reach the same context your other agent tools use.

## In a designer's workflow

Make earns its place when the question is behavioral rather than visual: does this flow feel right, does this empty state read, does this table survive 200 rows. Give it the design system first, then the flow, then the states.

```text
Use our Make kit. Build the team invite flow: an empty state, an
invite modal with role select, a pending-invites table, and an error
state for an invalid email. Use only components from the kit. Then
write plan.md describing what you would change to support bulk invites.
```

Asking for a `plan.md` before a complex change is Figma's own suggested pattern: you review the strategy before it is implemented, rather than after. When the prototype is settled, Copy design brings it back into Figma Design for redlines, or the zip and GitHub push hand it to engineering. If your source of truth is a repo rather than a Figma file, [Figma MCP](/tools/figma-mcp) and the [Figma to code with Claude](/guides/design/figma-to-code-with-claude) guide cover the other direction.

> [!TIP]
> Credit spend is unpredictable per request, and you cannot know the cost in advance. After a task completes, hover the AI credits icon to see what it consumed, and check your balance from the file's main menu before starting a long generation session.

## Good to know

Figma Make runs wherever Figma runs: the browser, and the desktop app on macOS 12 or later and Windows 10 or later. Availability is by seat, not just by plan. Figma's FAQ states that Make "is available for Full seats on paid plans," with Dev, Collab, and View seats limited to drafts and unable to share Make files, and Starter plans unable to pull team-library style context. Usage is metered in AI credits that reset monthly without rollover.

How it compares: [Claude Design](/tools/claude-design) covers a wider surface (decks, one-pagers, landing pages) and hands a bundle to Claude Code to build, where Make keeps everything inside Figma; the [Claude Design vs Figma Make](/guides/comparisons/claude-design-vs-figma-make) comparison sets them side by side. [Stitch](/tools/stitch) is Google's take on the same prompt-to-UI idea and pastes into Figma rather than living there. [v0](/tools/v0) and [Lovable](/tools/lovable) start from code and aim at a deployed app. For the full picture, see the [Claude Design guide](/guides/design/claude-design-guide) and [best AI tools for designers in 2026](/guides/comparisons/best-ai-tools-for-designers-2026).
