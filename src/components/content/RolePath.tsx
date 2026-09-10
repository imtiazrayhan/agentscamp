import Link from "next/link";
import { contentTypes } from "@/lib/content/registry";
import type { ContentItem } from "@/lib/content/types";
import type { AudienceGroup } from "@/lib/seo/collections";
import { Section } from "@/components/sections/Section";
import { ContentGrid } from "./ContentGrid";
import { ContentCard } from "./ContentCard";
import { Panel } from "@/components/ui/panel";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * Body of a role path (/for/<role>): the numbered "Start here" sequence, then
 * every other curated item grouped by type. Renders exactly the collection's
 * `items` in the same order, so the page's ItemList and the visible page agree.
 */
export function RolePath({
  startHere,
  groups,
}: {
  startHere: ContentItem[];
  groups: AudienceGroup[];
}) {
  return (
    <div className="space-y-2">
      {startHere.length > 0 && (
        <Section
          title="Start here"
          description="Read these in order — each one assumes the last."
          className="pt-0"
        >
          <ContentGrid cols={2} asChild>
            <ol>
            {startHere.map((item, i) => (
              <li key={item.href}>
                <Panel variant="interactive" padding="sm" asChild>
                  <Link
                    href={item.href}
                    className="group flex h-full gap-4"
                  >
                    <span className="text-2xl font-bold tabular-nums leading-none text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <Eyebrow as="span" className="block">
                        {contentTypes[item.type].singular}
                      </Eyebrow>
                      <span className="mt-1 block font-semibold leading-snug group-hover:text-primary">
                        {item.title}
                      </span>
                      <span className="mt-1.5 line-clamp-2 block text-sm text-muted-foreground">
                        {item.seoDescription ?? item.description}
                      </span>
                    </span>
                  </Link>
                </Panel>
              </li>
            ))}
          </ol>
        </ContentGrid>
        </Section>
      )}

      {groups.map(({ def, items, total }) => (
        <Section
          key={def.id}
          title={def.label}
          count={total}
          description={def.tagline}
          browseHref={def.basePath}
          browseLabel={`All ${def.label.toLowerCase()}`}
        >
          <ContentGrid>
            {items.map((item) => (
              <ContentCard key={item.href} item={item} showType={false} />
            ))}
          </ContentGrid>
        </Section>
      ))}
    </div>
  );
}
