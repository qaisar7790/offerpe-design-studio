import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            "h-3.5 w-3.5",
            value <= rating
              ? "fill-[oklch(0.78_0.15_80)] text-[oklch(0.78_0.15_80)]"
              : "text-border",
          )}
        />
      ))}
    </span>
  );
}
