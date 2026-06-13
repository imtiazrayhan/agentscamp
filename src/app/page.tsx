import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getCountsByType,
  getFeatured,
  getNewest,
  contentTypeList,
} from "@/lib/content";
import type { ContentTypeId, ContentItem } from "@/lib/content/types";
import type { ContentTypeDef } from "@/lib/content/registry";
import { Hero } from "@/components/sections/Hero";
import { Section } from "@/components/sections/Section";
import { ContentGrid } from "@/components/content/ContentGrid";
import { ContentCard } from "@/components/content/ContentCard";
import { CopyButton } from "@/components/content/CopyButton";
import { cn } from "@/lib/utils";

// A skill here (the hero features an agent) so the two commands together show
// the CLI installs more than one kind of artifact.
const GETTING_STARTED_CMD = "npx agentscamp add skills/dependency-audit";

// 4-col bento; spans sum (with the col-span-2 CTA tile) to full rows.
const SPANS: Record<ContentTypeId, string> = {
  agent: "sm:col-span-2 sm:row-span-2",
  skill: "sm:col-span-1",
  guide: "sm:col-span-1",
  tool: "sm:col-span-1",
  glossary: "sm:col-span-1",
  command: "sm:col-span-2",
};

function BentoTile({
  def,
  count,
  featured,
  span,
}: {
  def: ContentTypeDef;
  count: number;
  featured: ContentItem[];
  span: string;
}) {
  const Icon = def.icon;
  const big = span.includes("row-span-2");
  return (
    <Link
      href={def.basePath}
      className={cn(
        "group relative flex flex-col rounded-md border border-border bg-card p-5 transition-colors hover:border-primary/50",
        span,
      )}
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Icon className="size-4 text-primary" />
          {def.label}
        </span>
        <span className="tabular-nums">{String(count).padStart(2, "0")}</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{def.tagline}</p>
      {big && featured.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {featured.map((f) => (
            <li
              key={f.href}
              className="truncate font-mono text-sm text-foreground/80"
            >
              <span className="text-primary">→</span> {f.title}
            </li>
          ))}
        </ul>
      )}
      <span className="mt-auto inline-flex items-center gap-1 pt-5 font-mono text-sm text-primary">
        browse
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export default function Home() {
  const counts = getCountsByType();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const newest = getNewest(6);

  const bootLines = contentTypeList.map((d) => ({
    label: d.label.toLowerCase(),
    count: counts[d.id],
  }));

  return (
    <div className="space-y-10">
      <Hero lines={bootLines} total={total} />

      <section className="grid grid-cols-1 gap-3 sm:auto-rows-[1fr] sm:grid-cols-4">
        {contentTypeList.map((def) => (
          <BentoTile
            key={def.id}
            def={def}
            count={counts[def.id]}
            featured={getFeatured(def.id, 3)}
            span={SPANS[def.id]}
          />
        ))}

        {/* CTA tile completes the bento — promotes the CLI */}
        <div className="flex flex-col rounded-md border border-border bg-secondary p-5 sm:col-span-2">
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            // getting started
          </div>
          <div className="mt-3">
            <p className="text-lg font-semibold">Install in one command</p>
            <p className="text-sm text-muted-foreground">
              The <code className="font-mono text-foreground">agentscamp</code>{" "}
              CLI drops any agent, skill, or command straight into Claude Code.
            </p>
          </div>
          <div className="mt-4 inline-flex max-w-full items-center gap-1 self-start rounded-md border border-primary/40 bg-background py-1.5 pl-3 pr-1.5">
            <code className="truncate font-mono text-xs">
              <span className="select-none text-primary">$ </span>
              {GETTING_STARTED_CMD}
            </code>
            <CopyButton
              text={GETTING_STARTED_CMD}
              iconOnly
              className="shrink-0 border-0 bg-transparent hover:bg-secondary"
            />
          </div>
          <Link
            href="/how-to-use"
            className="group/cta mt-auto inline-flex items-center gap-1 self-start pt-5 font-mono text-sm text-primary"
          >
            how it works
            <ArrowRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {newest.length > 0 && (
        <Section title="New & Featured" description="Fresh across the hub">
          <ContentGrid>
            {newest.map((item) => (
              <ContentCard key={item.href} item={item} />
            ))}
          </ContentGrid>
        </Section>
      )}
    </div>
  );
}
