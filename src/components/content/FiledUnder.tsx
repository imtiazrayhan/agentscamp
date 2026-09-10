import Link from "next/link";
import { topicBySlug } from "@/lib/content/registry";
import { titleCaseLabel } from "@/lib/format";
import type { ContentItem } from "@/lib/content/types";

/**
 * Topics, role paths and tags, moved out of the pre-article header and into the
 * article's foot. Every href is unchanged — only the DOM position moves — so the
 * internal-link graph is identical.
 */
export function FiledUnder({ item }: { item: ContentItem }) {
  if (!item.topics.length && !item.audience.length && !item.tags.length)
    return null;

  return (
    <section className="mt-10 border-t border-border pt-6">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Filed under
      </h2>

      <div className="flex flex-wrap items-center gap-2">
        {item.topics.map((topic) => (
          <Link
            key={topic}
            href={`/topics/${topic}`}
            className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-sm transition-colors hover:border-foreground/25"
          >
            {topicBySlug.get(topic)?.label ?? titleCaseLabel(topic)}
          </Link>
        ))}
        {item.audience.map((role) => (
          <Link
            key={role}
            href={`/for/${role}`}
            className="inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            For {titleCaseLabel(role)}
          </Link>
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
