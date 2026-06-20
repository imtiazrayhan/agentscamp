import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { faqPageGraph } from "@/lib/seo/jsonld";
import { FaqSection } from "@/components/content/FaqSection";

export const metadata: Metadata = buildPageMetadata({
  title: "How to use",
  description:
    "How to install and use AI agents, skills, and slash commands from AgentsCamp — plus machine-readable Markdown for LLMs and agents.",
  path: "/how-to-use",
});

const faq = [
  {
    q: "Are AgentsCamp agents and skills free to use?",
    a: "Yes. Everything on AgentsCamp is free to copy, download, and install. Agents, skills, and commands are plain Markdown files you drop into your .claude directory.",
  },
  {
    q: "How do I install a Claude Code agent?",
    a: "Run npx agentscamp add agents/<name> to install one into your project's .claude/agents/ directory (add -g for ~/.claude/agents/), or run npx agentscamp to pick from the full catalog interactively. You can also copy the agent's Markdown file there manually. Claude Code delegates to it automatically based on its description, or you can invoke it explicitly.",
  },
  {
    q: "Can I install AgentsCamp content from the command line?",
    a: "Yes. The agentscamp npm package bundles the full catalog. Run npx agentscamp to pick what to install interactively, npx agentscamp --all to install everything into ~/.claude, or npx agentscamp add <type>/<name> to install specific items into your project. npx agentscamp list and search explore the catalog offline.",
  },
  {
    q: "What is the difference between an agent, a skill, and a slash command?",
    a: "Agents are specialized subagents with their own system prompt and isolated context window. Skills are capabilities Claude loads on demand via progressive disclosure. Slash commands are reusable prompts you invoke with /name.",
  },
  {
    q: "Can I use AgentsCamp content with tools other than Claude Code?",
    a: "The agents, skills, and commands follow Claude Code's file format, so they install directly into Claude Code. The guides and the tools directory are useful for any AI-assisted coding workflow.",
  },
  {
    q: "Does AgentsCamp offer machine-readable content for LLMs and agents?",
    a: "Yes. Every page has a clean Markdown version at the same URL with a .md suffix, and the entire catalog is available at /llms.txt (an index) and /llms-full.txt (every page concatenated).",
  },
];

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqPageGraph("/how-to-use", faq)),
        }}
      />
      <article className="prose prose-neutral max-w-3xl dark:prose-invert">
        <h1>How to use AgentsCamp</h1>
        <p>
          Everything here is copy-paste ready. Each agent, skill, and command
          page has install actions — copy the file or download it, then drop it
          into the right folder. Or skip the copying entirely and use the CLI.
        </p>

        <h2>Quick install with the CLI</h2>
        <p>
          The <code>agentscamp</code> npm package bundles the full catalog, so
          you can install anything in one command with npx — nothing to set up.
          Run it with no arguments to pick what you want, or install everything
          at once:
        </p>
        <pre>
          <code>
            {`npx agentscamp              # interactive picker
npx agentscamp --all        # install the whole catalog
npx agentscamp install agents   # all agents
npx agentscamp add skills/dependency-audit commands/plan-feature
npx agentscamp search "code review"`}
          </code>
        </pre>
        <p>
          Bulk installs (<code>--all</code>, <code>install</code>, or the picker)
          default to <code>~/.claude/</code> so the items work in every project;
          targeted <code>add</code> writes into the current project&apos;s{" "}
          <code>.claude/</code> directory. Pass <code>-g</code> or{" "}
          <code>--project</code> anywhere to override. Every agent, skill, and
          command page on this site also shows its exact <code>add</code>{" "}
          command.
        </p>

        <h2>Agents</h2>
        <p>
          Claude Code subagents are Markdown files with frontmatter. Save an agent
          to your project at <code>.claude/agents/&lt;name&gt;.md</code> (committed
          to version control) or personally at{" "}
          <code>~/.claude/agents/&lt;name&gt;.md</code> (available across all your
          projects). Claude delegates to it automatically based on its{" "}
          <code>description</code>, or you can invoke it explicitly.
        </p>

        <h2>Skills</h2>
        <p>
          Skills live at <code>.claude/skills/&lt;name&gt;/SKILL.md</code>{" "}
          (project, committed to version control) or{" "}
          <code>~/.claude/skills/&lt;name&gt;/SKILL.md</code> (personal, available
          across all your projects). They load on demand (progressive disclosure)
          so they only consume context when relevant. Multi-file skills bundle
          additional resources alongside the SKILL.md.
        </p>

        <h2>Slash commands</h2>
        <p>
          Save a command to <code>.claude/commands/&lt;name&gt;.md</code> and
          invoke it with <code>/&lt;name&gt;</code>. Commands can take arguments
          via <code>$ARGUMENTS</code>.
        </p>

        <h2>Tools</h2>
        <p>
          The tools directory points you to editors, CLIs, extensions, and SDKs
          for AI-assisted development. Each entry links to the official site and
          source where available.
        </p>

        <h2>Guides</h2>
        <p>
          Guides are tutorials and deep-dives. Start with{" "}
          <Link href="/guides/getting-started/getting-started-with-agents">
            Getting Started with Claude Code Agents
          </Link>
          .
        </p>

        <h2>For AI agents &amp; LLMs</h2>
        <p>
          AgentsCamp is built to be read by machines as well as people. Every page
          has a clean Markdown twin at the same URL plus a <code>.md</code> suffix
          — for example, <code>/agents/&lt;category&gt;/&lt;slug&gt;.md</code>. For
          the whole catalog, fetch{" "}
          <a href="/llms.txt">
            <code>/llms.txt</code>
          </a>{" "}
          (a linked index) or{" "}
          <a href="/llms-full.txt">
            <code>/llms-full.txt</code>
          </a>{" "}
          (every page concatenated as Markdown).
        </p>
      </article>

      <div className="mx-auto max-w-3xl">
        <FaqSection faq={faq} />
      </div>
    </>
  );
}
