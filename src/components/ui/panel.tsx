import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The one surface. Before this there were 26 hand-rolled
 * `rounded-* border border-border bg-card p-*` strings across the app, drifting
 * on radius (md/lg/xl), padding (3/4/5/6) and hover colour
 * (foreground/25 vs primary/50) along no product boundary at all.
 *
 * The variants encode the elevation rule the palette sets up:
 *   raised    sits ABOVE the page  — white card plus a hairline
 *   recessed  sits INTO the page   — a tinted ground, no border at all
 *   quiet     a placeholder outline, for empty states
 *
 * `recessed` is what replaces most of the borders removed in this pass. It is
 * only legible because --secondary now sits 1.26:1 below the card; at the old
 * values it would have been invisible.
 */
const panelVariants = cva("rounded-lg", {
  variants: {
    variant: {
      raised: "border border-border bg-card",
      // One hover treatment for every interactive surface on the site.
      interactive:
        "border border-border bg-card transition-colors hover:border-border-strong",
      recessed: "bg-secondary",
      quiet: "border border-dashed border-border",
    },
    // Two steps, and the rule is which kind of thing it is: md for a
    // standalone content surface, sm for one item among many in a list or
    // grid. Call sites do not get to pick a third.
    padding: {
      none: "",
      sm: "p-4",
      md: "p-5",
    },
  },
  defaultVariants: { variant: "raised", padding: "md" },
});

export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof panelVariants> {
  /** Render as the child element — ~10 surfaces are links, not divs. */
  asChild?: boolean;
}

export function Panel({
  className,
  variant,
  padding,
  asChild = false,
  ...props
}: PanelProps) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(panelVariants({ variant, padding }), className)}
      {...props}
    />
  );
}

export { panelVariants };
