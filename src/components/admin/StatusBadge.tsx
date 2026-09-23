import { cn } from "@/lib/utils";
import type { Status } from "@/types/admin";

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
        `status-${status.toLowerCase()}`,
      )}
    >
      {status}
    </span>
  );
}
