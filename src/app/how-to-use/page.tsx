import type { Metadata } from "next";
import { proseClasses } from "@/components/ui/prose";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { faqPageGraph } from "@/lib/seo/jsonld";
import { FaqSection } from "@/components/content/FaqSection";
import { PageHeader } from "@/components/content/PageHeader";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";

export const metadata: Metadata = buildPageMetadata({
  title: "How to use",
  description:
    "How to use AgentsCamp: start with the guides, tool directory, and glossary, then copy, download, or install agents, skills, and slash commands into Claude Code.",
  path: "/how-to-use",
});

const faq = [
  {
    q: "Are AgentsCamp agents and skills free to use?",
    a: "Yes. Everything on AgentsCamp is free to read, copy, download, and install. Agents, skills, and commands are plain Markdown files you drop into your .claude directory.",
  },
  {
    q: "Where should I start on AgentsCamp?",
    a: "Pick your role on the Start here page — developer, founder, marketer, designer, or analyst — for a short reading order followed by the tools, skills, and agents curated for that work. Developers new to coding agents begin with What Is Claude Code? and Installing Claude Code. Use the tools directory to compare products and the glossary to decode terms.",
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
  {
    q: "How do I install a Claude Code agent?",
    a: "Copy or download the agent's Markdown file from its page into .claude/agents/ (project) or ~/.claude/agents/ (personal). Claude Code delegates to it automatically based on its description, or you can invoke it explicitly. If you prefer the terminal, npx agentscamp add agents/<name> does the same (add -g for ~/.claude).",
  },
  {
    q: "Can I install AgentsCamp content from the command line?",
    a: "Yes. The agentscamp npm package bundles the full catalog. Run npx agentscamp to pick what to install interactively, npx agentscamp --all to install everything into ~/.claude, or npx agentscamp add <type>/<name> to install specific items into your project. npx agentscamp list and search explore the catalog offline.",
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
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "How to use" }]}
      />
      <PageHeader
        className="measure"
        title="How to use AgentsCamp"
        lead="A reading-first hub: start with the guides, use the tool directory to compare options, and the glossary to decode terms."
      />
      <article className={cn(proseClasses, "measure")}>
        <p>
          AgentsCamp is a reading-first hub. Start with the guides, use the tool
          directory to compare options, and the glossary to decode terms. When
          you&apos;re ready to act, every agent, skill, and command page has copy
          and download actions in Claude Code&apos;s real file format — and an
          optional CLI if you&apos;d rather install from the terminal.
        </p>

        <h2>Start with the guides</h2>
        <p>
          Guides are tutorials and deep-dives, each opening with a summary, steps
          at a glance, and key takeaways. If you&apos;re new, read{" "}
          <Link href="/guides/getting-started/what-is-claude-code">
            What Is Claude Code?
          </Link>
          , then{" "}
          <Link href="/guides/getting-started/installing-claude-code">
            Installing Claude Code
          </Link>{" "}
          and{" "}
          <Link href="/guides/getting-started/getting-started-with-agents">
            Getting Started with Claude Code Agents
          </Link>
          . From there, <Link href="/guides">browse all guides</Link> or explore{" "}
          <Link href="/topics">by topic</Link>. Not a developer? The{" "}
          <Link href="/for">Start here</Link> page has a curated path for
          founders, marketers, designers, and analysts.
        </p>

        <h2>Tools</h2>
        <p>
          The tools directory points you to editors, CLIs, extensions, and SDKs
          for AI-assisted development. Each entry links to the official site and
          source where available.
        </p>

        <h2>Glossary</h2>
        <p>
          The <Link href="/glossary">glossary</Link> gives plain-language,
          answer-first definitions of the AI and LLM-engineering terms you&apos;ll
          meet across the hub. Each term links to the deeper guide when you want
          more than the definition.
        </p>

        <h2>Agents</h2>
        <p>
          Claude Code subagents are Markdown files with frontmatter. Copy or
          download the file from its page, then save it to your project at{" "}
          <code>.claude/agents/&lt;name&gt;.md</code> (committed to version
          control) or personally at <code>~/.claude/agents/&lt;name&gt;.md</code>{" "}
          (available across all your projects). Claude delegates to it
          automatically based on its <code>description</code>, or you can invoke
          it explicitly.
        </p>

        <h2>Skills</h2>
        <p>
          Copy or download the skill from its page, then save it to{" "}
          <code>.claude/skills/&lt;name&gt;/SKILL.md</code> (project, committed to
          version control) or <code>~/.claude/skills/&lt;name&gt;/SKILL.md</code>{" "}
          (personal, available across all your projects). Skills load on demand
          (progressive disclosure) so they only consume context when relevant.
          Multi-file skills bundle additional resources alongside the SKILL.md.
        </p>

        <h2>Slash commands</h2>
        <p>
          Copy or download the command from its page, save it to{" "}
          <code>.claude/commands/&lt;name&gt;.md</code>, and invoke it with{" "}
          <code>/&lt;name&gt;</code>. Commands can take arguments via{" "}
          <code>$ARGUMENTS</code>.
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

        <h2 id="cli">Optional: install with the CLI</h2>
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
      </article>

      <div className="measure">
        <FaqSection faq={faq} />
      </div>
    </>
  );
}
