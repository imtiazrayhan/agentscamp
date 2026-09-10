import { Markdown } from "./Markdown";
import { Breadcrumbs } from "./Breadcrumbs";
import { RelatedItems } from "./RelatedItems";
import { InstallActions } from "./InstallActions";
import { ShareRow } from "./ShareRow";
import { FaqSection } from "./FaqSection";
import { Toc } from "./Toc";
import { MobileToc } from "./MobileToc";
import { ArticleMeta } from "./ArticleMeta";
import { FiledUnder } from "./FiledUnder";
import { extractToc } from "@/lib/toc";
import { breadcrumbsFor, graphFor } from "@/lib/seo/jsonld";
import { canonicalUrl } from "@/lib/seo/artifact";
import type { GuideItem, ContentItem } from "@/lib/content/types";

/** Distilled procedural steps shown for guides that declare `howtoSteps` (AEO render-parity). */
function StepsAtAGlance({ steps }: { steps: GuideItem["howtoSteps"] }) {
  if (!steps.length) return null;
  return (
    <section className="mb-8 rounded-lg border border-border bg-card p-5">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Steps at a glance
      </h2>
      <ol className="ml-4 list-decimal space-y-2 text-sm">
        {steps.map((s, i) => (
          <li key={i}>
            <span className="font-medium text-foreground">{s.name}.</span>{" "}
            <span className="text-muted-foreground">{s.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function KeyTakeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <section className="mb-8 rounded-lg border border-type-mint/30 bg-type-mint/5 p-5">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-type-mint-ink">
        Key takeaways
      </h2>
      <ul className="ml-4 list-disc space-y-1.5 text-sm text-foreground/90">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </section>
  );
}

function Sources({ sources }: { sources: GuideItem["sources"] }) {
  if (!sources.length) return null;
  return (
    <section
      className="mt-10 border-t border-border pt-8"
      aria-labelledby="sources-heading"
    >
      <h2 id="sources-heading" className="text-xl font-bold tracking-tight">
        Sources and further reading
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Primary documentation used to verify this guide.
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              {source.title}
            </a>{" "}
            <span className="text-muted-foreground">— {source.publisher}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The long-form article template. Split out of the old six-type DetailView
 * because a guide is a different document from an installable's spec sheet:
 * byline, reading measure, contents, standfirst and share placement all differ.
 *
 * JSON-LD (`graphFor`) and breadcrumbs are carried over verbatim — that is where
 * the SEO lives and it is entirely type-driven.
 */
export function GuideDetail({
  item,
  related,
}: {
  item: GuideItem;
  related: ContentItem[];
}) {
  const toc = item.body ? extractToc(item.body) : [];
  const withToc = toc.length >= 2;
  const updated = item.updated ?? item.date;

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphFor(item)) }}
      />
      <Breadcrumbs items={breadcrumbsFor(item)} />

      {/* No type/category kicker here — the breadcrumb directly above already
          reads Home > Guides > Getting Started > Title. */}
      <header className="mb-8 measure">
        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-3 text-pretty text-lg text-muted-foreground">
          {item.description}
        </p>

        <ArticleMeta
          author={item.author}
          updated={updated}
          readingTime={item.readingTime}
          cornerstone={item.depth === "cornerstone"}
        />
      </header>

      <div
        className={
          withToc
            ? "lg:grid lg:grid-cols-[minmax(0,41rem)_15rem] lg:gap-14"
            : undefined
        }
      >
        <div className="min-w-0 measure">
          <MobileToc items={toc} />

          {item.summary && (
            <p className="mb-8 text-lg leading-relaxed text-foreground/90">
              {item.summary}
            </p>
          )}

          <StepsAtAGlance steps={item.howtoSteps} />
          {item.keyTakeaways.length > 0 && (
            <KeyTakeaways items={item.keyTakeaways} />
          )}

          {item.body && <Markdown source={item.body} />}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
            <ShareRow url={canonicalUrl(item)} title={item.title} />
            <InstallActions item={item} />
          </div>

          <Sources sources={item.sources} />
          <FaqSection faq={item.faq} />
          <FiledUnder item={item} />
        </div>

        {withToc && (
          <aside className="hidden lg:block">
            {/* max-h + overflow: the longest guide has 20 headings, which
                overflowed a short viewport with no way to reach the rest. */}
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain pr-2">
              <Toc items={toc} />
            </div>
          </aside>
        )}
      </div>

      <RelatedItems items={related} />
    </article>
  );
}
