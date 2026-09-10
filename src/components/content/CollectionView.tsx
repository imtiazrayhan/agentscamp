import { ContentGrid } from "./ContentGrid";
import { ContentCard } from "./ContentCard";
import { Breadcrumbs } from "./Breadcrumbs";
import { collectionGraph, type Crumb } from "@/lib/seo/jsonld";
import { latestDate } from "@/lib/content";
import type { ContentItem } from "@/lib/content/types";

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
          __html: JSON.stringify(
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
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          {description}
        </p>
        {intro}
      </header>
      {list ?? (
        <ContentGrid>
          {items.map((item) => (
            <ContentCard key={item.href} item={item} showType={mixedTypes} />
          ))}
        </ContentGrid>
      )}
    </div>
  );
}
