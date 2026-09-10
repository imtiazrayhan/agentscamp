import { Panel } from "@/components/ui/panel";
import { Eyebrow } from "@/components/ui/eyebrow";
import type { GuideItem } from "@/lib/content/types";

/**
 * The two inset blocks that open a long-form page.
 *
 * "Key takeaways" used to render three different ways — bordered-card with a
 * muted heading in ArtifactDetail, mint-tinted with a mint heading in
 * GuideDetail, and a third combination for the steps box beside it. One recipe
 * now, and the mint tint goes: it was the only accented box on the site, and a
 * per-type accent means "this is a guide", not "this is important".
 *
 * The headings are <p>, not <h2>. They named a box rather than a region, and as
 * <h2> they sat in the document outline between the h1 and the article's own
 * headings while being absent from the table of contents — so the outline and
 * the ToC disagreed about the shape of the page.
 */
export function StepsAtAGlance({ steps }: { steps: GuideItem["howtoSteps"] }) {
  if (!steps.length) return null;
  return (
    <Panel variant="recessed" className="mb-6">
      <Eyebrow className="mb-3">Steps at a glance</Eyebrow>
      <ol className="ml-4 list-decimal space-y-2 text-sm">
        {steps.map((s, i) => (
          <li key={i}>
            <span className="font-medium text-foreground">{s.name}.</span>{" "}
            <span className="text-muted-foreground">{s.text}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export function KeyTakeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <Panel variant="recessed" className="mb-6">
      <Eyebrow className="mb-3">Key takeaways</Eyebrow>
      <ul className="ml-4 list-disc space-y-1.5 text-sm text-foreground">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </Panel>
  );
}
