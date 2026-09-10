import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { audiences, getByAudience } from "@/lib/content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { hubGraph } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { EmptyState } from "@/components/content/EmptyState";
import { Panel } from "@/components/ui/panel";
import { PageHeader } from "@/components/content/PageHeader";
import { Button } from "@/components/ui/button";
import { ContentGrid } from "@/components/content/ContentGrid";

const DESCRIPTION =
  "Pick your role — developer, AI engineer, DevOps, security, founder, marketer, designer, or analyst — for a curated path through the guides, tools, skills, and agents that fit the work you do.";

export const metadata: Metadata = buildPageMetadata({
  title: "Start here",
  description: DESCRIPTION,
  path: "/for",
});

export default function Page() {
  const entries = audiences
    .map((a) => ({ ...a, count: getByAudience(a.slug).length }))
    .filter((a) => a.count > 0);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            hubGraph({
              path: "/for",
              name: "Start here",
              description: DESCRIPTION,
              entries: entries.map((a) => ({
                href: `/for/${a.slug}`,
                label: a.label,
              })),
            }),
          ),
        }}
      />
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Start here" }]}
      />
      <PageHeader title="Start here" lead={DESCRIPTION} />
      {entries.length === 0 ? (
        <EmptyState
          title="Role paths are on the way"
          description="We are curating a reading order for each role. The topic index covers the same ground in the meantime."
          action={
            <Button asChild variant="outline">
              <Link href="/topics">Browse by topic</Link>
            </Button>
          }
        />
      ) : (
        <ContentGrid cols={2} asChild>
          <ul>
          {entries.map((a) => (
            <li key={a.slug}>
              <Panel variant="interactive" asChild>
                <Link
                  href={`/for/${a.slug}`}
                  className="group flex h-full items-start justify-between gap-4"
                >
                  <span>
                    <span className="block font-semibold group-hover:text-primary">
                      {a.label}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {a.description}
                    </span>
                    <span className="mt-2 block text-xs tabular-nums text-muted-foreground">
                      {a.count} resources
                    </span>
                  </span>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Panel>
            </li>
          ))}
        </ul>
      </ContentGrid>
      )}
    </div>
  );
}
