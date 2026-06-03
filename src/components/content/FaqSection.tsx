import type { FaqEntry } from "@/lib/content/types";

/**
 * Visible Q&A. Pairs with the FAQPage JSON-LD (graphFor / faqPageGraph) — the
 * structured data is emitted ONLY when this renders, so there is never
 * hidden-only markup (a structured-data manual-action risk). Answer-engine /
 * AEO surface; FAQ rich results themselves were retired, so this is for AI
 * answers and snippet extraction, not a SERP widget.
 */
export function FaqSection({
  faq,
  heading = "Frequently asked questions",
}: {
  faq: FaqEntry[];
  heading?: string;
}) {
  if (!faq.length) return null;
  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-5 text-xl font-bold tracking-tight">{heading}</h2>
      <dl className="space-y-5">
        {faq.map((f, i) => (
          <div key={i}>
            <dt className="font-semibold text-foreground">{f.q}</dt>
            <dd className="mt-1.5 text-muted-foreground">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
