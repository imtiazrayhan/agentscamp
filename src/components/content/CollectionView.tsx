import { ContentGrid } from "./ContentGrid";
import { ContentCard } from "./ContentCard";
import { Breadcrumbs } from "./Breadcrumbs";
import { collectionGraph, type Crumb, jsonLdHtml } from "@/lib/seo/jsonld";
import { latestDate } from "@/lib/content";
import type { ContentItem } from "@/lib/content/types";
import { PageHeader } from "./PageHeader";
import { Eyebrow } from "@/components/ui/eyebrow";
import { contentTypes } from "@/lib/content/registry";

/** "64 guides", "1 tool", "355 items" — the grid's heading. */
function countLabel(items: ContentItem[]): string {
  const n = items.length;
  const types = new Set(items.map((i) => i.type));
  if (types.size !== 1) return `${n} ${n === 1 ? "item" : "items"}`;
  const def = contentTypes[items[0].type];
  const plural = def.id === "glossary" ? "terms" : def.label;
  return `${n} ${(n === 1 ? def.singular : plural).toLowerCase()}`;
}

/**
 * Server-rendered collection page (category / topic / facet landings). Emits the
 * CollectionPage + ItemList + BreadcrumbList graph and the visible grid from the
 * same item set, so structured data and content never disagree.
 */
export function CollectionView({
  title,
  description,
  path,
  items,
  crumbs,
  intro,
  list,
}: {
  title: string;
  description: string;
  path: string;
  items: ContentItem[];
  crumbs: Crumb[];
  intro?: React.ReactNode;
  /** Replaces the default card grid; must render the same `items` in the same order. */
  list?: React.ReactNode;
}) {
  // Category/pricing pages are single-type; topics and role paths are mixed.
  const mixedTypes = new Set(items.map((i) => i.type)).size > 1;

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdHtml(
            collectionGraph({
              path,
              name: title,
              description,
              items,
              crumbs,
              lastModified: latestDate(items),
            }),
          ),
        }}
      />
      <Breadcrumbs items={crumbs} />
      <PageHeader title={title} lead={description}>
        {intro}
      </PageHeader>
      {list ?? (
        <>
          {/* Keeps the outline h1 > h2 > h3: cards are h3s. */}
          <Eyebrow as="h2" className="mb-4">
            {countLabel(items)}
          </Eyebrow>
          <ContentGrid>
            {items.map((item) => (
              <ContentCard key={item.href} item={item} showType={mixedTypes} />
            ))}
          </ContentGrid>
        </>
      )}
    </div>
  );
}
