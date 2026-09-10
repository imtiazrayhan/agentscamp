import { cn } from "@/lib/utils";

/**
 * The page title block, everywhere except the homepage hero.
 *
 * It replaces six h1 recipes and six lead recipes for what is visually one
 * element. The h1s differed by a stray `text-balance` (redundant — globals.css
 * balances h1/h2/h3 already), by an `mt-3` when an eyebrow sat above, and by
 * being 2xl on the error pages; the leads differed by max-w-2xl vs
 * max-w-[68ch] vs .measure vs nothing, and by whether they carried
 * `text-pretty`.
 *
 * One untyped `children` slot rather than a slot per variant, deliberately.
 * TypeListing's intro and facet navs and ArtifactDetail's chips and install
 * block go in there, which is what stops this forking again the next time a
 * page needs something extra.
 *
 * Must stay a Server Component: a "use client" here would pull every page lead
 * out of the static HTML on a site whose traffic is organic search.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  className,
  children,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={cn("mb-10", className)}>
      {eyebrow && <div className="mb-3">{eyebrow}</div>}
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {lead && (
        <p className="measure mt-3 text-pretty text-lg text-muted-foreground">
          {lead}
        </p>
      )}
      {children}
    </header>
  );
}
