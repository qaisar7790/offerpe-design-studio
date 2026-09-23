import { MerchantLogo } from "@/components/admin/MerchantLogo";
import { RejectReviewDialog } from "@/components/admin/RejectReviewDialog";
import { ReviewPhoto } from "@/components/admin/ReviewPhoto";
import { Stars } from "@/components/admin/Stars";
import { Button } from "@/components/ui/button";
import type { Review } from "@/types/admin";
import { Check, ShieldCheck, Store, X } from "lucide-react";

export function PendingReviewCard({ review, showMerchant, onApprove, onReject }: { review: Review; showMerchant: boolean; onApprove: (review: Review) => void; onReject: (review: Review, reason: string, note: string) => void }) {
  return <article className="flex min-h-88 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
    <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40"><MerchantLogo name={review.merchant} /></div>
    <div className="flex flex-1 flex-col p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-sm font-bold">{review.user}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-primary"><ShieldCheck className="h-3 w-3" />Verified Purchaser</span>
          <span className="text-xs text-muted-foreground">{review.submitted}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          {showMerchant && <span className="inline-flex items-center gap-1.5 text-sm font-medium"><span className="flex h-5 w-5 items-center justify-center rounded bg-accent text-primary"><Store className="h-3 w-3" /></span>{review.merchant}</span>}
          <Stars rating={review.rating} />
          <span className="font-mono text-xs text-muted-foreground">{review.id}</span>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button size="sm" onClick={() => onApprove(review)}><Check />Approve</Button>
        <RejectReviewDialog review={review} onReject={onReject}><Button size="sm" variant="destructive"><X />Reject</Button></RejectReviewDialog>
      </div>
    </div>
    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{review.comment}</p>
    {review.photos.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{review.photos.map((photo) => <ReviewPhoto key={photo} src={photo} user={review.user} />)}</div>}
    </div>
  </article>;
}
