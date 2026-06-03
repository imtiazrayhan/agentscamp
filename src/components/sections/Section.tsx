import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  description?: string;
  count?: number;
  browseHref?: string;
  browseLabel?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  title,
  description,
  count,
  browseHref,
  browseLabel = "Browse all",
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn("py-10", className)}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            {title}
            {count !== undefined && (
              <span className="text-base font-normal text-muted-foreground">
                {count}
              </span>
            )}
          </h2>
          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
        {browseHref && (
          <Link
            href={browseHref}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {browseLabel}
            <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
