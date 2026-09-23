import { PageHeader } from "@/components/admin/PageHeader";
import { ReviewsPanel } from "@/components/admin/ReviewsPanel";
import type { Merchant, Review } from "@/types/admin";
import { Store } from "lucide-react";

export function ReviewsPage(props: { reviews: Review[]; merchantNames: string[]; onApprove: (review: Review) => void; onReject: (review: Review, reason: string, note: string) => void; onRevert: (review: Review) => void; onDelete: (review: Review) => void }) {
  return <><PageHeader title="Merchant Reviews" description="Vendor/store reviews submitted by verified purchasers. Approving makes the review (and any photos) publicly visible on the store's Store Detail page; rejecting requires a reason from the Rejection Reasons list." /><ReviewsPanel {...props} /></>;
}
