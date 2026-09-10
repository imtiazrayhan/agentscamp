import Link from "next/link";
import type { ToolItem } from "@/lib/content/types";
import { titleCaseLabel } from "@/lib/format";

export const pricingLabel = (p: ToolItem["pricing"]) => p.replace("-", " ");

/**
 * Intro + comparison table for a tool's alternatives page — the site's
 * best-ranking format. Built purely from tool frontmatter so it can never
 * disagree with the tool pages themselves.
 */
export function AlternativesTable({
  tool,
  items,
}: {
  tool: ToolItem;
  items: ToolItem[];
}) {
  if (items.length === 0) return null;
  const th = "px-3 py-2 text-left font-mono text-xs uppercase tracking-wider text-muted-foreground";
  const td = "px-3 py-2 align-top";
  return (
    <div className="mt-6">
      <p className="max-w-2xl text-muted-foreground">
        Looking for a {tool.title} alternative?{" "}
        <Link href={tool.href} className="font-medium text-foreground hover:underline">
          {tool.title}
        </Link>{" "}
        is listed under {titleCaseLabel(tool.category)} (
        <span className="lowercase">{pricingLabel(tool.pricing)}</span>). The{" "}
        {items.length} {items.length === 1 ? "tool" : "tools"} below cover
        similar jobs, closest matches first — the table compares pricing,
        license, and platforms so you can shortlist quickly, and each entry
        further down adds a fuller summary and a link to the full profile.
      </p>
      <div className="mt-5 overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border bg-secondary/50">
            <tr>
              <th className={th}>Tool</th>
              <th className={th}>Pricing</th>
              <th className={th}>License</th>
              <th className={th}>Platforms</th>
              <th className={th}>Category</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.href} className="border-b border-border last:border-b-0">
                <td className={td}>
                  <Link href={t.href} className="font-medium text-primary hover:underline">
                    {t.title}
                  </Link>
                </td>
                <td className={`${td} capitalize`}>{pricingLabel(t.pricing)}</td>
                <td className={td}>{t.license ?? "—"}</td>
                <td className={td}>{t.os.length ? t.os.join(", ") : "—"}</td>
                <td className={td}>{titleCaseLabel(t.category)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
