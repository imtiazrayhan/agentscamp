import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // No `focus-visible:outline-none` here. It used to be, with no variant adding
  // a ring back, so every Button on the site suppressed the global
  // `:focus-visible` outline in globals.css and showed no focus indicator at
  // all (WCAG 2.4.7). Letting the global rule through is the whole fix, and it
  // keeps one focus style everywhere instead of two.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        // border-input, not border-border: an outline button is a control, and
        // --input is the token that clears 3:1 for a control boundary. It is
        // also what keeps `outline` distinguishable from `ghost`, which shares
        // its hover fill.
        outline: "border border-input bg-card hover:bg-secondary",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        ghost: "hover:bg-secondary",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6 text-base",
        xs: "h-8 px-2.5 text-xs",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
