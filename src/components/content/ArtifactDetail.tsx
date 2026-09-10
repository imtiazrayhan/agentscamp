import Link from "next/link";
import { Markdown } from "./Markdown";
import { Breadcrumbs } from "./Breadcrumbs";
import { RelatedItems } from "./RelatedItems";
import { InstallActions } from "./InstallActions";
import { FaqSection } from "./FaqSection";
import { FiledUnder } from "./FiledUnder";
import { contentTypes } from "@/lib/content/registry";
import { getColorClasses, cn } from "@/lib/utils";
import { titleCaseLabel, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { breadcrumbsFor, graphFor } from "@/lib/seo/jsonld";
import type { ContentItem } from "@/lib/content/types";

/**
 * Spec-sheet template for the five non-guide types (agent, skill, command, tool,
 * glossary). They differ only in the chip row and their install action, both of
 * which are already switch-based — so one component, not five.
 *
 * JSON-LD (`graphFor`) and breadcrumbs are carried over verbatim from the old
 * DetailView.
 */
function Meta({
  item,
  toolCategoryHref,
  toolPricingHref,
}: {
  item: ContentItem;
  toolCategoryHref?: string;
  toolPricingHref?: string;
}) {
  const chips: React.ReactNode[] = [];
  if (item.type === "agent") {
    chips.push(
      <Badge key="m" variant="primary" className="capitalize">
        {item.model}
      </Badge>,
    );
    if (item.tools?.length)
      chips.push(
        <Badge key="t" variant="outline">
          {item.tools.length} tools
        </Badge>,
      );
  } else if (item.type === "skill") {
    if (item.userInvocable) chips.push(<Badge key="i">User-invocable</Badge>);
    if (item.multiFile) chips.push(<Badge key="mf">Multi-file</Badge>);
    if (item.version)
      chips.push(
        <Badge key="v" variant="outline">
          v{item.version}
        </Badge>,
      );
  } else if (item.type === "tool") {
    chips.push(
      toolPricingHref ? (
        <Link key="p" href={toolPricingHref}>
          <Badge variant="primary" className="capitalize">
            {item.pricing.replace("-", " ")}
          </Badge>
        </Link>
      ) : (
        <Badge key="p" variant="primary" className="capitalize">
          {item.pricing.replace("-", " ")}
        </Badge>
      ),
      toolCategoryHref ? (
        <Link key="c" href={toolCategoryHref}>
          <Badge variant="outline" className="capitalize">
            {item.category}
          </Badge>
        </Link>
      ) : (
        <Badge key="c" variant="outline" className="capitalize">
          {item.category}
        </Badge>
      ),
    );
  } else if (item.type === "command") {
    chips.push(
      <Badge key="s" variant="outline">
        <code className="font-mono">/{item.slug}</code>
      </Badge>,
    );
    if (item.argumentHint)
      chips.push(
        <Badge key="ah" variant="outline">
          {item.argumentHint}
        </Badge>,
      );
  }
  return <div className="flex flex-wrap items-center gap-2">{chips}</div>;
}

export function ArtifactDetail({
  item,
  related,
  toolCategoryHref,
  toolPricingHref,
  toolAlternativesHref,
}: {
  item: ContentItem;
  related: ContentItem[];
  toolCategoryHref?: string;
  toolPricingHref?: string;
  toolAlternativesHref?: string;
}) {
  const def = contentTypes[item.type];
  const accent = getColorClasses(item.type);
  const Icon = def.icon;
  const categoryHref =
    item.type === "tool"
      ? `/tools/category/${item.category}`
      : `${def.basePath}/${item.category}`;
  const updated = item.updated ?? item.date;

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphFor(item)) }}
      />
      <Breadcrumbs items={breadcrumbsFor(item)} />

      <header className="mb-8 measure">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-md",
              accent.chip,
            )}
          >
            <Icon className="size-4" />
          </span>
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
        </div>

        <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-3 text-pretty text-lg text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Meta
            item={item}
            toolCategoryHref={toolCategoryHref}
            toolPricingHref={toolPricingHref}
          />
          {updated && (
            <span className="text-xs text-muted-foreground">
              Updated <time dateTime={updated}>{formatDate(updated)}</time>
            </span>
          )}
        </div>

        {item.summary && (
          <p className="mt-6 text-lg leading-relaxed text-foreground/90">
            {item.summary}
          </p>
        )}

        {/* The install action is the primary CTA for these types, so it stays high. */}
        <div className="mt-6">
          <InstallActions item={item} />
          {toolAlternativesHref && (
            <Link
              href={toolAlternativesHref}
              className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
            >
              Compare {item.title} alternatives
            </Link>
          )}
        </div>
      </header>

      <div className="min-w-0 measure">
        {item.keyTakeaways.length > 0 && (
          <section className="mb-8 rounded-lg border border-border bg-card p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Key takeaways
            </h2>
            <ul className="ml-4 list-disc space-y-1.5 text-sm text-foreground/90">
              {item.keyTakeaways.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </section>
        )}

        {item.body && <Markdown source={item.body} />}
        <FaqSection faq={item.faq} />
        <FiledUnder item={item} />
      </div>

      <RelatedItems items={related} />
    </article>
  );
}
