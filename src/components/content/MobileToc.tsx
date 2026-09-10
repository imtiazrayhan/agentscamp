import type { TocItem } from "@/lib/toc";

/**
 * Server-rendered collapsible contents for tablet and phone. The desktop <Toc>
 * is `hidden lg:block`, so until now 209 long-form guides had no in-page
 * navigation at all on the widths most search traffic arrives at.
 *
 * Deliberately plain <details> — no JS, no observer, and the heading anchors sit
 * in the static HTML where Google can use them for jump-to SERP links.
 */
export function MobileToc({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;

  return (
    <details className="mb-8 rounded-lg border border-border bg-card lg:hidden">
      <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold">
        On this page
      </summary>
      <ol className="border-t border-border px-4 py-3 text-sm">
        {items.map((i) => (
          <li key={i.id} style={{ paddingLeft: i.depth === 3 ? 12 : 0 }}>
            <a
              href={`#${i.id}`}
              className="block py-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
