import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/types/admin";

import { useState } from "react";

export function RejectReviewDialog({
  review,
  rejectionReasons,
  onReject,
  children,
}: {
  review: Review;
  rejectionReasons: readonly string[];
  onReject: (review: Review, reason: string, note: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(rejectionReasons[0] as string);
  const [note, setNote] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">Reject review</DialogTitle>
          <DialogDescription>
            Rejecting keeps the review hidden from {review.merchant}&apos;s Store Detail page. A
            reason is required.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium">
            Rejection reason <span className="text-destructive">*</span>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rejectionReasons.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            Admin note <span className="font-normal text-muted-foreground">(optional)</span>
            <Textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add internal context for this decision…"
            />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onReject(review, reason, note);
              setOpen(false);
            }}
          >
            Reject review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
