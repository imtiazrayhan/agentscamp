import Link from "next/link";
import { Markdown } from "./Markdown";
import { Breadcrumbs } from "./Breadcrumbs";
import { RelatedItems } from "./RelatedItems";
import { InstallActions } from "./InstallActions";
import { FaqSection } from "./FaqSection";
import { FiledUnder } from "./FiledUnder";
import { contentTypes } from "@/lib/content/registry";
import { titleCaseLabel, formatDate } from "@/lib/format";
import { breadcrumbsFor, graphFor } from "@/lib/seo/jsonld";
import type { ContentItem } from "@/lib/content/types";
import { KeyTakeaways } from "./ArticleBoxes";
import { PageHeader } from "./PageHeader";
import { DetailRail } from "./DetailRail";

/**
 * Spec-sheet template for the five non-guide types (agent, skill, command, tool,
 * glossary). They differ only in the rail spec sheet and their install action, both of
 * which are already switch-based — so one component, not five.
 *
 * JSON-LD (`graphFor`) and breadcrumbs are carried over verbatim from the old
 * DetailView.
 */
export function ArtifactDetail({
  item,
  related,
  toolCategoryHref,
  toolPricingHref,
  toolAlternativesHref,
  toolAlternatives,
}: {
  item: ContentItem;
  related: ContentItem[];
  toolCategoryHref?: string;
  toolPricingHref?: string;
  toolAlternativesHref?: string;
  toolAlternatives?: ContentItem[];
}) {
  const def = contentTypes[item.type];
  const categoryHref =
    item.type === "tool"
      ? `/tools/category/${item.category}`
      : `${def.basePath}/${item.category}`;
  const updated = item.updated ?? item.date;
  // Glossary entries are short definitions: no spec sheet, single column.
  const withRail = item.type !== "glossary";

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphFor(item)) }}
      />
      <Breadcrumbs items={breadcrumbsFor(item)} />

      {/* A right rail (spec sheet, alternatives, contents) sits beside the
          header and body. */}
      <div
        className={
          withRail
            ? "lg:grid lg:grid-cols-[minmax(0,41rem)_18rem] lg:justify-between lg:gap-x-12"
            : undefined
        }
      >
      <PageHeader
        className="measure"
        eyebrow={
          <span className="text-sm text-muted-foreground">
            <Link href={def.basePath} className="hover:text-foreground">
              {def.singular}
            </Link>
            {item.type !== "tool" && item.category && (
              <>
                {" · "}
                <Link href={categoryHref} className="hover:text-foreground">
                  {titleCaseLabel(item.category)}
                </Link>
              </>
            )}
          </span>
        }
        title={item.title}
        lead={item.description}
      >
        {/* With a rail, the type's facts and date live in its spec sheet. */}
        {!withRail && updated && (
          <p className="mt-4 text-xs text-muted-foreground">
            Updated <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
        )}

        {item.summary && (
          <p className="mt-6 text-lg leading-relaxed text-foreground">
            {item.summary}
          </p>
        )}

        {/* The install action is the primary CTA for these types, so it stays high. */}
        <div className="mt-6">
          <InstallActions item={item} />
          {toolAlternativesHref && (
            <Link
              href={toolAlternativesHref}
              className="mt-3 inline-flex text-sm font-medium text-primary hover:underline lg:hidden"
            >
              Compare {item.title} alternatives
            </Link>
          )}
        </div>
      </PageHeader>

      {withRail && (
        <DetailRail
          item={item}
          categoryHref={toolCategoryHref}
          pricingHref={toolPricingHref}
          alternatives={toolAlternatives}
          alternativesHref={toolAlternativesHref}
        />
      )}

      <div className="min-w-0 measure">
        <KeyTakeaways items={item.keyTakeaways} />

        {item.body && <Markdown source={item.body} />}
        <FaqSection faq={item.faq} />
        <FiledUnder item={item} />
      </div>
      </div>

      <RelatedItems items={related} />
    </article>
  );
}
