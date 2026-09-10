import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { topics, getByTopic } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { hubGraph } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { Panel } from "@/components/ui/panel";
import { PageHeader } from "@/components/content/PageHeader";

const DESCRIPTION =
  "Browse AgentsCamp by topic — cross-cutting collections of agents, skills, guides, tools, and commands for building with AI coding agents.";

export const metadata: Metadata = buildPageMetadata({
  title: "Topics",
  description: DESCRIPTION,
  path: "/topics",
});

export default function Page() {
  const entries = topics
    .map((t) => ({ ...t, count: getByTopic(t.slug).length }))
    .filter((t) => t.count > 0);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            hubGraph({
              path: "/topics",
              name: "Topics",
              description: DESCRIPTION,
              entries: entries.map((t) => ({
                href: `/topics/${t.slug}`,
                label: t.label,
              })),
            }),
          ),
        }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Topics" }]} />
      <PageHeader
        title="Topics"
        lead="Cross-cutting collections spanning agents, skills, guides, tools, and commands."
      />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((t) => (
          <li key={t.slug}>
            <Panel variant="interactive" asChild>
              <Link
                href={`/topics/${t.slug}`}
                className="group flex h-full items-center justify-between"
              >
                <span>
                  <span className="block font-semibold group-hover:text-primary">
                    {t.label}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {t.count} resources
                  </span>
                </span>
                <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Panel>
          </li>
        ))}
      </ul>
    </div>
  );
}
