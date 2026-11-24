import Link from "next/link";
import { formatDate, pageDates } from "@/lib/format";

/**
 * The guide byline. Previously the author rendered as a grey outline Badge next
 * to a reading-time Badge — but the site's E-E-A-T rests on a named author, and
 * `authorNode()` in lib/seo/jsonld.ts emits a Person with url /about#who-writes-this.
 * This makes the visible byline and the structured data agree.
 */
export function ArticleMeta({
  author,
  date,
  updated,
  reviewed,
  readingTime,
  cornerstone,
}: {
  author?: string;
  date?: string;
  updated?: string;
  reviewed?: string;
  readingTime: number;
  cornerstone: boolean;
}) {
  const dates = pageDates({ date, updated, reviewed });
  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
      {author && (
        <>
          <span>
            By{" "}
            <Link
              href="/about#who-writes-this"
              className="font-medium text-foreground hover:underline"
            >
              {author}
            </Link>
          </span>
          <span aria-hidden>·</span>
        </>
      )}
      {dates.date && (
        <>
          <span>
            {dates.label}{" "}
            <time dateTime={dates.date}>{formatDate(dates.date)}</time>
          </span>
          <span aria-hidden>·</span>
        </>
      )}
      {dates.reviewed && (
        <>
          <span>
            Reviewed{" "}
            <time dateTime={dates.reviewed}>{formatDate(dates.reviewed)}</time>
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
