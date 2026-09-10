import * as React from "react";
import { cn } from "@/lib/utils";
import { label } from "./typography";

type EyebrowProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * The uppercase micro-label. It was already written identically in 12 of the 13
 * places that used it, which is the strongest possible argument for extracting
 * it — the system existed, it just had no name.
 */
export function Eyebrow<T extends React.ElementType = "p">({
  as,
  className,
  ...props
}: EyebrowProps<T>) {
  const Comp = as ?? "p";
  return <Comp className={cn(label, className)} {...props} />;
}
