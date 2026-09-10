import { cn } from "@/lib/utils";

/**
 * The one page-width rule. Every full-width band (nav, main, footer) wraps its
 * content in this so the site has a single measure to change.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}
