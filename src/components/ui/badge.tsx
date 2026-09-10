import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Every chip on the site. Five hand-rolled pill shapes used to bypass this —
 * three radii (sm, md, full), three text sizes and three padding scales — and
 * two of them linked to the same /topics destinations at different sizes.
 *
 * `brand` replaced a `border-primary/30 bg-primary/10` tint. Besides being an
 * opacity-derived shade, that tint measured 4.41:1 against --secondary; on
 * --primary-soft it is 4.78:1.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        neutral: "bg-secondary text-secondary-foreground",
        outline: "border border-border text-muted-foreground",
        brand: "bg-primary-soft text-primary",
        code: "bg-primary-soft font-mono text-primary",
      },
      size: {
        sm: "px-1.5 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: { variant: "neutral", size: "sm" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Topic and role pills are links. */
  asChild?: boolean;
}

function Badge({ className, variant, size, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
