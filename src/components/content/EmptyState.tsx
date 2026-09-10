import { SearchX } from "lucide-react";
import { Panel } from "@/components/ui/panel";

/**
 * `description` and `action` are required, and that is the point: every empty
 * state on this site used to be a dead end. /for said "Role paths are being
 * curated." and stopped; the listing filter said "No matches" without offering
 * to clear itself; /search stranded people on a bare lowercase line. Making the
 * exit part of the type means typecheck refuses the dead end rather than a
 * reviewer having to notice it.
 */
export function EmptyState({
  title = "Nothing here yet",
  description,
  action,
}: {
  title?: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <Panel
      variant="quiet"
      padding="none"
      className="flex flex-col items-center justify-center px-6 py-12 text-center"
    >
      <SearchX className="mb-3 size-8 text-muted-foreground" />
      <p className="font-semibold">{title}</p>
      <p className="measure mt-1.5 text-sm text-muted-foreground">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">{action}</div>
    </Panel>
  );
}
