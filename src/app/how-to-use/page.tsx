import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to use",
  description:
    "How to install and use AI agents, skills, and slash commands from AgentsCamp.",
  alternates: { canonical: "/how-to-use" },
};

export default function Page() {
  return (
    <article className="prose prose-neutral max-w-3xl dark:prose-invert">
      <h1>How to use AgentsCamp</h1>
      <p>
        Everything here is copy-paste ready. Each agent, skill, and command page
        has install actions — copy the file or download it, then drop it into the
        right folder.
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
        Skills live at <code>.claude/skills/&lt;name&gt;/SKILL.md</code> (project,
        committed to version control) or{" "}
        <code>~/.claude/skills/&lt;name&gt;/SKILL.md</code> (personal, available
        across all your projects). They load on demand (progressive disclosure) so
        they only consume context when relevant. Multi-file skills bundle
        additional resources alongside the SKILL.md.
      </p>

      <h2>Slash commands</h2>
      <p>
        Save a command to <code>.claude/commands/&lt;name&gt;.md</code> and invoke
        it with <code>/&lt;name&gt;</code>. Commands can take arguments via{" "}
        <code>$ARGUMENTS</code>.
      </p>

      <h2>Tools</h2>
      <p>
        The tools directory points you to editors, CLIs, extensions, and SDKs for
        AI-assisted development. Each entry links to the official site and source
        where available.
      </p>

      <h2>Guides</h2>
      <p>
        Guides are tutorials and deep-dives. Start with{" "}
        <Link href="/guides/getting-started/getting-started-with-agents">
          Getting Started with Claude Code Agents
        </Link>
        .
      </p>
    </article>
  );
}
