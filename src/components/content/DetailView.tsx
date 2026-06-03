import Link from "next/link";
import { Markdown } from "./Markdown";
import { Breadcrumbs } from "./Breadcrumbs";
import { RelatedItems } from "./RelatedItems";
import { InstallActions } from "./InstallActions";
import { FaqSection } from "./FaqSection";
import { Toc } from "./Toc";
import { extractToc } from "@/lib/toc";
import { contentTypes } from "@/lib/content/registry";
import { getColorClasses, cn } from "@/lib/utils";
import { titleCaseLabel, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { breadcrumbsFor, graphFor } from "@/lib/seo/jsonld";
import type { ContentItem, GuideItem } from "@/lib/content/types";

function Meta({ item }: { item: ContentItem }) {
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
    if (item.userInvocable)
      chips.push(<Badge key="i">User-invocable</Badge>);
    if (item.multiFile) chips.push(<Badge key="mf">Multi-file</Badge>);
    if (item.version)
      chips.push(
        <Badge key="v" variant="outline">
          v{item.version}
        </Badge>,
      );
  } else if (item.type === "guide") {
    chips.push(
      <Badge key="r" variant="outline">
        {item.readingTime} min read
      </Badge>,
    );
    if (item.author) chips.push(<Badge key="a" variant="outline">{item.author}</Badge>);
  } else if (item.type === "tool") {
    chips.push(
      <Badge key="p" variant="primary" className="capitalize">
        {item.pricing.replace("-", " ")}
      </Badge>,
      <Badge key="c" variant="outline" className="capitalize">
        {item.category}
      </Badge>,
    );
  } else if (item.type === "command") {
    chips.push(
      <Badge key="s" variant="outline">
        <code className="font-mono">/{item.slug}</code>
      </Badge>,
    );
    if (item.argumentHint)
      chips.push(<Badge key="ah" variant="outline">{item.argumentHint}</Badge>);
  }
  return <div className="flex flex-wrap items-center gap-2">{chips}</div>;
}

/** Distilled procedural steps shown for guides that declare `howtoSteps` (AEO render-parity). */
function StepsAtAGlance({ steps }: { steps: GuideItem["howtoSteps"] }) {
  if (!steps.length) return null;
  return (
    <section className="mb-8 rounded-lg border border-border bg-card/50 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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
    <section className="mb-8 rounded-lg border border-primary/30 bg-primary/5 p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
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

export function DetailView({
  item,
  related,
}: {
  item: ContentItem;
  related: ContentItem[];
}) {
  const def = contentTypes[item.type];
  const accent = getColorClasses(item.type);
  const Icon = def.icon;

  const crumbs = breadcrumbsFor(item);
  const categoryHref =
    item.type === "tool"
      ? `/tools/category/${item.category}`
      : `${def.basePath}/${item.category}`;
  const updated = item.updated ?? item.date;

  const toc = item.type === "guide" && item.body ? extractToc(item.body) : [];
  const withToc = toc.length >= 2;

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graphFor(item)) }}
      />
      <Breadcrumbs items={crumbs} />

      <header className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-lg",
              accent.chip,
            )}
          >
            <Icon className="size-5" />
          </span>
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {def.singular}
            {item.type !== "tool" && (
              <>
                {" · "}
                <Link href={categoryHref} className="hover:text-foreground">
                  {titleCaseLabel(item.category)}
                </Link>
              </>
            )}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Meta item={item} />
          {updated && (
            <span className="font-mono text-xs text-muted-foreground">
              Updated {formatDate(updated)}
            </span>
          )}
        </div>

        {item.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span
                key={t}
                className="rounded-sm bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6">
          <InstallActions item={item} />
        </div>
      </header>

      <div
        className={cn(
          withToc && "lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10",
        )}
      >
        <div className="min-w-0">
          {item.summary && (
            <p className="mb-6 text-lg leading-relaxed text-foreground/90">
              {item.summary}
            </p>
          )}
          {item.type === "guide" && <StepsAtAGlance steps={item.howtoSteps} />}
          {item.keyTakeaways.length > 0 && (
            <KeyTakeaways items={item.keyTakeaways} />
          )}
          {item.body && <Markdown source={item.body} />}
          <FaqSection faq={item.faq} />
        </div>
        {withToc && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Toc items={toc} />
            </div>
          </aside>
        )}
      </div>

      <RelatedItems items={related} />
    </article>
  );
}
