import { getContentByType } from "@/lib/content";
import { contentTypes } from "@/lib/content/registry";
import { getColorClasses, cn } from "@/lib/utils";
import { collectionGraph } from "@/lib/seo/jsonld";
import { ListingView } from "./ListingView";
import type { ContentTypeId } from "@/lib/content/types";

export function TypeListing({ type }: { type: ContentTypeId }) {
  const def = contentTypes[type];
  const accent = getColorClasses(type);
  const Icon = def.icon;
  const all = getContentByType(type);
  // strip body for client payload
  const items = all.map(({ body: _body, ...rest }) => rest);

  const graph = collectionGraph({
    path: def.basePath,
    name: def.label,
    description: def.description,
    items: all,
    crumbs: [{ label: "Home", href: "/" }, { label: def.label }],
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
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
      </header>
      <ListingView items={items} />
    </div>
  );
}
