import Link from "next/link";
import { Clock, Wrench, ExternalLink } from "lucide-react";
import type { ContentItem } from "@/lib/content/types";
import { contentTypes } from "@/lib/content/registry";
import { Badge } from "@/components/ui/badge";

function Footer({ item }: { item: ContentItem }) {
  const mono = "font-mono text-xs text-muted-foreground";
  switch (item.type) {
    case "agent":
      return (
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="lowercase">
            {item.model}
          </Badge>
          {item.tools && item.tools.length > 0 && (
            <span className={`inline-flex items-center gap-1 ${mono}`}>
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
          {item.version && <span className={mono}>v{item.version}</span>}
        </div>
      );
    case "guide":
      return (
        <div className={`inline-flex items-center gap-1.5 ${mono}`}>
          <Clock className="size-3" />
          {item.readingTime}m read
          {item.author && <span>· {item.author}</span>}
        </div>
      );
    case "tool":
      return (
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="lowercase">
            {item.pricing.replace("-", " ")}
          </Badge>
          <span className={`inline-flex items-center gap-1 ${mono}`}>
            <ExternalLink className="size-3" />
            {item.category}
          </span>
        </div>
      );
    case "command":
      return (
        <div className={`inline-flex items-center gap-2 ${mono}`}>
          <span className="rounded-sm bg-secondary px-1.5 py-0.5 text-primary">
            /{item.slug}
          </span>
          {item.argumentHint && <span>{item.argumentHint}</span>}
        </div>
      );
  }
}

export function ContentCard({ item }: { item: ContentItem }) {
  const def = contentTypes[item.type];
  const Icon = def.icon;

  return (
    <div className="group relative flex flex-col rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/50">
      <div className="mb-2.5 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5 text-primary" />
        {def.singular}
      </div>

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

      <div className="mt-3 border-t border-border pt-3">
        <Footer item={item} />
      </div>
    </div>
  );
}
