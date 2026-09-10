import Link from "next/link";
import type { ContentItem } from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";
import { getColorClasses, cn } from "@/lib/utils";
import { sectionHeading } from "@/components/ui/typography";
import { ContentGrid } from "./ContentGrid";

export function RelatedItems({ items }: { items: ContentItem[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-14">
      <h2 className={cn("mb-4", sectionHeading)}>Related</h2>
      <ContentGrid cols={2} asChild>
        <ul>
        {items.map((item) => {
          const accent = getColorClasses(item.type);
          const Icon = contentTypes[item.type].icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-start gap-3 rounded-lg bg-secondary p-4 transition-colors hover:bg-secondary-hover"
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
    </ContentGrid>
    </section>
  );
}
