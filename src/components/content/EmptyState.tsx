import { SearchX } from "lucide-react";
import { Panel } from "@/components/ui/panel";

export function EmptyState({
  title = "Nothing here yet",
  description,
  children,
}: {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <Panel
      variant="quiet"
      padding="none"
      className="flex flex-col items-center justify-center px-6 py-12 text-center"
    >
      <SearchX className="mb-3 size-8 text-muted-foreground" />
      <p className="font-medium">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </Panel>
  );
}
