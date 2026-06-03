import Link from "next/link";
import type { ContentItem } from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";
import { getColorClasses, cn } from "@/lib/utils";

export function RelatedItems({ items }: { items: ContentItem[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-4 text-lg font-semibold">Related</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const accent = getColorClasses(item.type);
          const Icon = contentTypes[item.type].icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-secondary"
              >
                <span
                  className={cn(
                    "inline-flex size-7 shrink-0 items-center justify-center rounded-md",
                    accent.chip,
                  )}
                >
                  <Icon className="size-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">
                    {item.title}
                  </span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
