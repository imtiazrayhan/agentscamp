import Link from "next/link";
import { formatDate } from "@/lib/format";

/**
 * The guide byline. Previously the author rendered as a grey outline Badge next
 * to a reading-time Badge — but the site's E-E-A-T rests on a named author, and
 * `authorNode()` in lib/seo/jsonld.ts already emits a Person with url:/about.
 * This makes the visible byline and the structured data agree.
 */
export function ArticleMeta({
  author,
  updated,
  readingTime,
  cornerstone,
}: {
  author?: string;
  updated?: string;
  readingTime: number;
  cornerstone: boolean;
}) {
  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
      {author && (
        <>
          <span>
            By{" "}
            <Link
              href="/about"
              className="font-medium text-foreground hover:underline"
            >
              {author}
            </Link>
          </span>
          <span aria-hidden>·</span>
        </>
      )}
      {updated && (
        <>
          <span>
            Updated <time dateTime={updated}>{formatDate(updated)}</time>
          </span>
          <span aria-hidden>·</span>
        </>
      )}
      <span>{readingTime} min read</span>
      {cornerstone && (
        <>
          <span aria-hidden>·</span>
          <span className="text-foreground">In-depth guide</span>
        </>
      )}
    </p>
  );
}
