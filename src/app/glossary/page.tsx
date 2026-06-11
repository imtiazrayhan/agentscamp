import type { Metadata } from "next";
import Link from "next/link";
import { getContentByType } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { glossaryHubGraph } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";

const DESCRIPTION =
  "Plain-language definitions of the AI and LLM-engineering terms that matter — RAG, MCP, agents, fine-tuning, guardrails, and more — each linked to the deeper guide.";

export const metadata: Metadata = buildPageMetadata({
  title: "AI Glossary",
  description: DESCRIPTION,
  path: "/glossary",
});

export default function Page() {
  const items = [...getContentByType("glossary")].sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  // Group A–Z by first character of the display term.
  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const letter = item.title[0]?.toUpperCase() ?? "#";
    const arr = groups.get(letter) ?? [];
    arr.push(item);
    groups.set(letter, arr);
  }
  const letters = [...groups.keys()].sort();

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(glossaryHubGraph(items, DESCRIPTION)),
        }}
      />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Glossary" }]}
      />
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          AI Glossary
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          {items.length} AI and LLM-engineering terms, defined precisely —
          answer first, with the deeper guide linked.
        </p>
      </header>

      <nav aria-label="Jump to letter" className="mb-8 flex flex-wrap gap-2">
        {letters.map((l) => (
          <a
            key={l}
            href={`#${l}`}
            className="rounded-sm border border-border bg-card px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            {l}
          </a>
        ))}
      </nav>

      <div className="space-y-10">
        {letters.map((l) => (
          <section key={l} id={l} aria-label={`Terms starting with ${l}`}>
            <h2 className="mb-4 border-b border-border pb-2 font-mono text-sm text-primary">
              {l}
            </h2>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {(groups.get(l) ?? []).map((item) => (
                <li key={item.slug}>
                  <Link href={item.href} className="group block">
                    <span className="font-semibold group-hover:text-primary">
                      {item.title}
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">
                      {item.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
