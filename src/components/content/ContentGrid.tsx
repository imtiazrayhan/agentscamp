import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const COLS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
} as const;

/**
 * The card grid. `cols` is a prop rather than something call sites override
 * through className, because tailwind-merge treats `sm:grid-cols-2` and
 * `lg:grid-cols-3` as different modifier groups — passing one in would leave
 * the other standing.
 *
 * `asChild` is for the grids that are semantically lists — several of these
 * were hand-rolled copies of this exact string on a <ul>.
 */
export function ContentGrid({
  cols = 3,
  asChild = false,
  children,
  className,
}: {
  cols?: 2 | 3;
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp className={cn("grid grid-cols-1 gap-4", COLS[cols], className)}>
      {children}
    </Comp>
  );
}
