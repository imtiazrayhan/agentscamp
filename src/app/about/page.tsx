import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { site } from "@/lib/site";

const title = "About & Editorial Standards";
const description =
  "How AgentsCamp researches, writes, verifies, updates, and corrects its AI agent guides, tool profiles, skills, commands, and glossary entries.";

export const metadata: Metadata = buildPageMetadata({
  title,
  description,
  path: "/about",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${site.url}/about#webpage`,
  url: `${site.url}/about`,
  name: title,
  description,
  isPartOf: { "@id": `${site.url}/#website` },
  about: { "@id": `${site.url}/#organization` },
  mainEntity: { "@id": `${site.url}/#organization` },
  inLanguage: "en",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-10">
        <p className="font-mono text-sm uppercase tracking-wide text-primary">
          About AgentsCamp
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Useful AI resources, with the work shown
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          AgentsCamp is a curated, public library for people building with AI
          coding agents. We publish practical guides and a collection of agents,
          skills, commands, tools, and definitions that readers can inspect before
          adopting.
        </p>
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert prose-a:text-primary prose-a:font-medium">
        <h2 id="editorial-standards">Editorial standards</h2>
        <p>
          Every page should help a reader complete a real job or make a better
          decision. We favor direct answers, working examples, explicit trade-offs,
          and primary documentation over keyword repetition or inflated word counts.
          Long-form guides are expanded when the subject benefits from setup,
          alternatives, failure modes, and verification—not merely to reach a target.
        </p>

        <h3>How guides are researched</h3>
        <p>
          Time-sensitive product claims are checked against first-party
          documentation, specifications, changelogs, or maintained source
          repositories. Cornerstone guides list the primary sources used for
          verification. We separate durable advice from details likely to change,
          avoid invented benchmarks and credentials, and date material so readers
          can judge freshness for themselves.
        </p>

        <h3>How installable resources are checked</h3>
        <p>
          Agents, skills, and commands are not ordinary blog posts. Their Markdown
          frontmatter mirrors the formats used by coding-agent tools, and the site
          strips editorial metadata from downloadable artifacts. A build-time
          validator checks frontmatter schemas, typed related links, internal links,
          heading fragments, dates, structured-data references, and route coverage.
          The search index and static pages are then rebuilt from the same loaders,
          which reduces drift between what a page describes and what a reader copies.
        </p>

        <h3>Tool profiles and comparisons</h3>
        <p>
          Tool pages describe the product category, pricing model, operating
          surfaces, strengths, limitations, and likely fit. Pricing and feature
          availability can change quickly, so readers should confirm purchasing
          decisions on the linked official site. Comparisons are organized around
          user intent and trade-offs; inclusion is not a claim that one product is
          universally best.
        </p>

        <h3>Updates and corrections</h3>
        <p>
          Material revisions receive an updated date. A changed date should reflect
          a real editorial change, not an automated build or cosmetic deployment.
          If you find an outdated claim, broken example, attribution problem, or
          security concern, contact AgentsCamp through the official profile linked
          below and include the page URL plus the evidence for the correction.
        </p>

        <h3>AI-assisted work</h3>
        <p>
          Automation and AI may assist research, drafting, formatting, or validation.
          The publication standard remains the same regardless of the tool: content
          must add practical value, fit the site&apos;s audience, pass repository checks,
          and avoid presenting unverified output as fact. We do not publish scaled
          pages whose only purpose is capturing search traffic.
        </p>

        <h3>Commercial independence</h3>
        <p>
          AgentsCamp does not currently label rankings as paid placements. If a page
          includes sponsorship, affiliate compensation, or another material
          commercial relationship in the future, that relationship should be
          disclosed where it can affect the reader&apos;s judgment.
        </p>

        <h2>Use the library</h2>
        <p>
          Start with the <Link href="/guides">guides</Link> for explanations and
          decision support, browse <Link href="/skills">skills</Link> and{" "}
          <Link href="/agents">agents</Link> for installable artifacts, compare the{" "}
          <Link href="/tools">tool directory</Link>, or read the clean machine-facing{" "}
          <Link href="/llms.txt">llms.txt index</Link>. You can also follow new
          additions in the <Link href="/feed.xml">RSS feed</Link>.
        </p>

        <h2>Contact</h2>
        <p>
          For corrections and editorial questions, contact{" "}
          <a href="https://x.com/agentscamp" target="_blank" rel="noopener noreferrer">
            @agentscamp on X
          </a>.
        </p>
      </div>
    </article>
  );
}
