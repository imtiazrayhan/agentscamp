import Link from "next/link";
import { topicBySlug } from "@/lib/content/registry";
import { titleCaseLabel } from "@/lib/format";
import type { ContentItem } from "@/lib/content/types";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Badge } from "@/components/ui/badge";

/**
 * Topics, role paths and tags, moved out of the pre-article header and into the
 * article's foot. Every href is unchanged — only the DOM position moves — so the
 * internal-link graph is identical.
 */
export function FiledUnder({ item }: { item: ContentItem }) {
  if (!item.topics.length && !item.audience.length && !item.tags.length)
    return null;

  return (
    <section className="mt-8">
      <Eyebrow as="h2" className="mb-3">
        Filed under
      </Eyebrow>

      <div className="flex flex-wrap items-center gap-2">
        {item.topics.map((topic) => (
          <Badge key={topic} size="md" asChild>
            <Link href={`/topics/${topic}`} className="hover:text-primary">
              {topicBySlug.get(topic)?.label ?? titleCaseLabel(topic)}
            </Link>
          </Badge>
        ))}
        {item.audience.map((role) => (
          <Badge key={role} size="md" asChild>
            <Link href={`/for/${role}`} className="hover:text-primary">
              For {titleCaseLabel(role)}
            </Link>
          </Badge>
        ))}
      </div>

      {item.tags.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {item.tags.join(" · ")}
        </p>
      )}
    </section>
  );
}
