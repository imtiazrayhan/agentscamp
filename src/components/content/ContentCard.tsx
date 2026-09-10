import Link from "next/link";
import { Clock, Wrench, ExternalLink } from "lucide-react";
import type { CardItem } from "@/lib/content/card";
import { contentTypes } from "@/lib/content/registry";
import { getColorClasses, cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

function Footer({ item }: { item: CardItem }) {
  const meta = "text-xs text-muted-foreground";
  switch (item.type) {
    case "agent":
      return (
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="lowercase">
            {item.model}
          </Badge>
          {item.tools && item.tools.length > 0 && (
            <span className={`inline-flex items-center gap-1 ${meta}`}>
              <Wrench className="size-3" />
              {item.tools.length}
            </span>
          )}
        </div>
      );
    case "skill":
      return (
        <div className="flex flex-wrap items-center gap-1.5">
          {item.userInvocable && <Badge variant="outline">invocable</Badge>}
          {item.multiFile && <Badge variant="outline">multi-file</Badge>}
          {item.version && <span className={meta}>v{item.version}</span>}
        </div>
      );
    case "guide":
      return (
        <div className={`inline-flex items-center gap-1.5 ${meta}`}>
          <Clock className="size-3" />
          {item.readingTime}m read
          {item.date && <span>· {formatDate(item.date)}</span>}
          {item.author && <span>· {item.author}</span>}
        </div>
      );
    case "tool":
      return (
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="lowercase">
            {item.pricing.replace("-", " ")}
          </Badge>
          <span className={`inline-flex items-center gap-1 ${meta}`}>
            <ExternalLink className="size-3" />
            {item.category}
          </span>
        </div>
      );
    case "command":
      return (
        <div className={`inline-flex items-center gap-2 ${meta}`}>
          <span className="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-primary">
            /{item.slug}
          </span>
          {item.argumentHint && <span>{item.argumentHint}</span>}
        </div>
      );
  }
}

export function ContentCard({
  item,
  showType = true,
}: {
  item: CardItem;
  /** The type eyebrow only carries information on mixed-type grids. */
  showType?: boolean;
}) {
  const def = contentTypes[item.type];
  const Icon = def.icon;
  const accent = getColorClasses(item.type);
  const footer = Footer({ item });

  return (
    <div className="group relative flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-foreground/25 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background">
      {showType && (
        <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Icon className={cn("size-3.5", accent.text)} />
          {def.singular}
        </div>
      )}

      <h3 className="font-semibold leading-snug tracking-tight">
        <Link
          href={item.href}
          className="before:absolute before:inset-0 focus-visible:outline-none group-hover:text-primary"
        >
          {item.title}
        </Link>
      </h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {item.description}
      </p>

      {footer && (
        <div className="mt-3 border-t border-border pt-3">{footer}</div>
      )}
    </div>
  );
}
