import Link from "next/link";
import type { GuideItem, ToolItem } from "@/lib/content/types";
import { titleCaseLabel } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { pricingLabel } from "./AlternativesTable";

/**
 * Ranked per-alternative entries for a tool's alternatives page, built from
 * each tool's frontmatter summary plus any comparison guide that covers the
 * pair. Renders the same `items` as the page's ItemList, in the same order.
 */
export function AlternativesList({
  tool,
  items,
  guides,
}: {
  tool: ToolItem;
  items: ToolItem[];
  guides: Map<string, GuideItem[]>;
}) {
  if (items.length === 0) return null;
  const free = items.filter(
    (t) => t.pricing === "free" || t.pricing === "open-source",
  );
  const meta = "font-mono text-xs text-muted-foreground";
  return (
    <div className="space-y-10">
      {free.length > 0 && free.length < items.length && (
        <section>
          <h2 className="text-xl font-semibold tracking-tight">
            Free and open-source alternatives to {tool.title}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {free.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary"
                >
                  {t.title}
                  <Badge variant="primary" className="lowercase">
                    {pricingLabel(t.pricing)}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section>
        <h2 className="text-xl font-semibold tracking-tight">
          {tool.title} alternatives in detail
        </h2>
        <ol className="mt-2 divide-y divide-border">
          {items.map((t) => (
            <li key={t.href} className="py-5">
              <h3 className="text-lg font-semibold">
                <Link href={t.href} className="hover:underline">
                  {t.title}
                </Link>
              </h3>
              <div className={`mt-2 flex flex-wrap items-center gap-2 ${meta}`}>
                <Badge variant="primary" className="lowercase">
                  {pricingLabel(t.pricing)}
                </Badge>
                {t.license && <span>{t.license}</span>}
                {t.os.length > 0 && <span>{t.os.join(", ")}</span>}
                <span>{titleCaseLabel(t.category)}</span>
              </div>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                {t.summary ?? t.description}
              </p>
              {guides.get(t.slug)?.map((g) => (
                <p key={g.href} className="mt-2 text-sm">
                  Read:{" "}
                  <Link
                    href={g.href}
                    className="font-medium text-primary hover:underline"
                  >
                    {g.title}
                  </Link>
                </p>
              ))}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
