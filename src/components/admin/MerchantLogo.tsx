import { cn } from "@/lib/utils";
import { Store } from "lucide-react";

export function MerchantLogo({ name, compact = false }: { name: string; compact?: boolean }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return (
    <div
      aria-label={`${name} logo`}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg border border-border bg-card font-heading font-bold text-primary shadow-card",
        compact ? "h-11 w-11 text-sm" : "h-20 w-20 text-2xl",
      )}
    >
      {initials || <Store className={compact ? "h-4 w-4" : "h-7 w-7"} />}
    </div>
  );
}
