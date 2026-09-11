import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { GuideItem } from "@/lib/content/types";
import { toolParams } from "@/lib/seo/params";
import {
  comparisonGuidesByAlt,
  toolAlternativesCollection,
} from "@/lib/seo/collections";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { CollectionView } from "@/components/content/CollectionView";
import { AlternativesTable } from "@/components/content/AlternativesTable";
import { AlternativesList } from "@/components/content/AlternativesList";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return toolParams();
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = toolAlternativesCollection(slug);
  if (!c) return {};
  return buildPageMetadata({
    title: c.title,
    description: c.description,
    path: `/tools/${slug}/alternatives`,
    noindex: c.noindex,
    // The parent tool's own accented card; this route has no colocated generator.
    image: `${c.tool.href}/opengraph-image`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const c = toolAlternativesCollection(slug);
  if (!c) notFound();
  const guides = comparisonGuidesByAlt(c.tool, c.items);
  const roundup = widestComparison(guides);
  return (
    <CollectionView
      title={c.title}
      description={c.description}
      path={`/tools/${slug}/alternatives`}
      items={c.items}
      crumbs={c.crumbs}
      intro={
        <>
          {roundup && (
            <p className="mt-4 text-sm">
              Full comparison:{" "}
              <Link
                href={roundup.href}
                className="font-medium text-primary hover:underline"
              >
                {roundup.title}
              </Link>
            </p>
          )}
          <AlternativesTable tool={c.tool} items={c.items} />
        </>
      }
      list={
        <AlternativesList tool={c.tool} items={c.items} guides={guides} />
      }
    />
  );
}

/**
 * The comparison guide covering the most of this page's alternatives, if it
 * covers at least two. A guide covering only one is already linked on that
 * alternative's row.
 */
function widestComparison(
  guides: Map<string, GuideItem[]>,
): GuideItem | undefined {
  const counts = new Map<string, { guide: GuideItem; n: number }>();
  for (const list of guides.values()) {
    for (const g of list) {
      const entry = counts.get(g.href) ?? { guide: g, n: 0 };
      entry.n += 1;
      counts.set(g.href, entry);
    }
  }
  let best: { guide: GuideItem; n: number } | undefined;
  for (const entry of counts.values()) {
    if (entry.n >= 2 && (!best || entry.n > best.n)) best = entry;
  }
  return best?.guide;
}
