import { cn } from "@/lib/utils";
import type { Review } from "@/types/admin";

export function ReviewStatusBadge({ review }: { review: Review }) {
  const tone = review.status === "Approved" ? "bg-success-soft text-success" : review.status === "Rejected" ? "bg-destructive-soft text-destructive" : "status-pending";
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", tone)}>{review.status}</span>;
}
