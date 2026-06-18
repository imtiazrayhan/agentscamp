import Link from "next/link";
import { getContentByType, latestDate } from "@/lib/content";
import { contentTypes } from "@/lib/content/registry";
import { getColorClasses, cn } from "@/lib/utils";
import { collectionGraph } from "@/lib/seo/jsonld";
import { listingSeo } from "@/lib/seo/listing";
import { titleCaseLabel } from "@/lib/format";
import { Breadcrumbs } from "./Breadcrumbs";
import { ListingView } from "./ListingView";
import { FaqSection } from "./FaqSection";
import type { ContentTypeId } from "@/lib/content/types";

// Category facets become indexable (and so worth crawl-linking) at >=2 items,
// matching MIN_INDEXABLE in lib/seo/collections.
const MIN_LINKABLE = 2;

export function TypeListing({ type }: { type: ContentTypeId }) {
  const def = contentTypes[type];
  const seo = listingSeo[type];
  const accent = getColorClasses(type);
  const Icon = def.icon;
  const all = getContentByType(type);
  // strip body for client payload
  let items = all.map(({ body: _body, ...rest }) => rest);

  // Guides display newest-first, paginated; other listings keep loader order.
  const paginated = type === "guide";
  if (paginated) {
    items = [...items].sort(
      (a, b) =>
        (b.date ?? "").localeCompare(a.date ?? "") ||
        a.title.localeCompare(b.title),
    );
  }

  // Real <a> links to indexable category landing pages — internal-linking /
  // crawl depth the client-side filter toggles can't provide.
  const counts = new Map<string, number>();
  for (const it of all) counts.set(it.category, (counts.get(it.category) ?? 0) + 1);
  const categoryLinks = [...counts.entries()]
    .filter(([, n]) => n >= MIN_LINKABLE)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([cat, n]) => ({
      label: titleCaseLabel(cat),
      count: n,
      href: type === "tool" ? `/tools/category/${cat}` : `${def.basePath}/${cat}`,
    }));

  const crumbs = [{ label: "Home", href: "/" }, { label: def.label }];
  const graph = collectionGraph({
    path: def.basePath,
    name: seo.seoTitle,
    description: def.description,
    items: all,
    crumbs,
    lastModified: latestDate(all),
    faq: seo.faq,
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <Breadcrumbs items={crumbs} />
      <header className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <span
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-xl",
              accent.chip,
            )}
          >
            <Icon className="size-6" />
          </span>
          <h1 className="text-3xl font-bold tracking-tight">{def.label}</h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {def.description}
        </p>
        <p className="mt-3 max-w-2xl text-muted-foreground">{seo.intro}</p>
        {categoryLinks.length > 1 && (
          <nav className="mt-5" aria-label={`Browse ${def.label} by category`}>
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              Browse by category
            </h2>
            <ul className="flex flex-wrap gap-2">
              {categoryLinks.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {c.label}
                    <span className="text-xs opacity-60">{c.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>
      <ListingView items={items} pageSize={paginated ? 9 : undefined} />
      <FaqSection faq={seo.faq} />
    </div>
  );
}
