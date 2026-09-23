import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { IconButton } from "@/components/admin/IconButton";
import { ImportModal } from "@/components/admin/ImportModal";
import { LayoutToggle } from "@/components/admin/LayoutToggle";
import { MerchantLogo } from "@/components/admin/MerchantLogo";
import { PendingReviewCard } from "@/components/admin/PendingReviewCard";
import { RejectReviewDialog } from "@/components/admin/RejectReviewDialog";
import { ReviewPhoto } from "@/components/admin/ReviewPhoto";
import { ReviewStatusBadge } from "@/components/admin/ReviewStatusBadge";
import { Stars } from "@/components/admin/Stars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { downloadCsv, tabTriggerClass } from "@/lib/admin-utils";
import type { LayoutMode, Review } from "@/types/admin";
import { Check, Download, RotateCcw, Store, Trash2, UploadCloud, X } from "lucide-react";
import { useMemo, useState } from "react";

export function ReviewsPanel({
  reviews,
  merchantNames,
  rejectionReasons,
  scopedMerchant,
  onApprove,
  onReject,
  onRevert,
  onDelete,
}: {
  reviews: Review[];
  merchantNames: string[];
  rejectionReasons: readonly string[];
  scopedMerchant?: string;
  onApprove: (review: Review) => void;
  onReject: (review: Review, reason: string, note: string) => void;
  onRevert: (review: Review) => void;
  onDelete: (review: Review) => void;
}) {
  const [tab, setTab] = useState("pending");
  const [status, setStatus] = useState("all");
  const [merchantFilter, setMerchantFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("newest");
  const scoped = scopedMerchant
    ? reviews.filter((review) => review.merchant === scopedMerchant)
    : reviews;
  const parse = (value: string) => new Date(value.replace(",", "")).getTime();
  const applyFilters = (rows: Review[]) =>
    rows
      .filter(
        (review) =>
          scopedMerchant || merchantFilter === "all" || review.merchant === merchantFilter,
      )
      .filter((review) => !from || parse(review.submitted) >= new Date(from).getTime())
      .filter((review) => !to || parse(review.submitted) <= new Date(to).getTime() + 86_400_000)
      .sort((a, b) =>
        sort === "oldest"
          ? parse(a.submitted) - parse(b.submitted)
          : sort === "rating-high"
            ? b.rating - a.rating
            : sort === "rating-low"
              ? a.rating - b.rating
              : parse(b.submitted) - parse(a.submitted),
      );
  const pending = useMemo(
    () => applyFilters(scoped.filter((review) => review.status === "Pending")),
    [scoped, merchantFilter, from, to, sort, scopedMerchant],
  );
  const reviewed = useMemo(
    () =>
      applyFilters(
        scoped.filter(
          (review) => review.status !== "Pending" && (status === "all" || review.status === status),
        ),
      ),
    [scoped, status, merchantFilter, from, to, sort, scopedMerchant],
  );
  const hasFilters =
    status !== "all" || merchantFilter !== "all" || from || to || sort !== "newest";
  const resetFilters = () => {
    setStatus("all");
    setMerchantFilter("all");
    setFrom("");
    setTo("");
    setSort("newest");
  };
  const [reviewImportOpen, setReviewImportOpen] = useState(false);
  const [layout, setLayout] = useState<LayoutMode>("grid");
  const reviewTable = (rows: Review[], mode: "pending" | "reviewed") => (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="table-scrollbar overflow-x-auto">
        <table className="w-full min-w-220 text-left text-sm">
          <thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Review ID</th>
              <th>Customer</th>
              {!scopedMerchant && <th>Merchant</th>}
              <th>Rating</th>
              <th>Comment</th>
              <th>Submitted</th>
              <th>Status</th>
              <th className="pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((review) => (
              <tr key={review.id} className="border-t border-border align-top hover:bg-muted/50">
                <td className="px-4 py-2 font-mono text-xs">{review.id}</td>
                <td className="font-medium">{review.user}</td>
                {!scopedMerchant && <td>{review.merchant}</td>}
                <td>
                  <Stars rating={review.rating} />
                </td>
                <td className="max-w-80 text-xs text-muted-foreground">
                  <span className="line-clamp-2">{review.comment}</span>
                  {review.status === "Rejected" && review.reason && (
                    <span className="mt-1 block text-xs font-semibold text-destructive">
                      Reason: {review.reason}
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap text-xs text-muted-foreground">
                  {review.submitted}
                </td>
                <td>
                  <ReviewStatusBadge review={review} />
                </td>
                <td className="pr-3 text-right">
                  <div className="flex justify-end gap-1">
                    {mode === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          className="h-7 px-2.5 text-xs"
                          onClick={() => onApprove(review)}
                        >
                          <Check />
                          Approve
                        </Button>
                        <RejectReviewDialog
                          review={review}
                          rejectionReasons={rejectionReasons}
                          onReject={onReject}
                        >
                          <Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs">
                            <X />
                            Reject
                          </Button>
                        </RejectReviewDialog>
                      </>
                    ) : (
                      <>
                        <IconButton
                          className="h-7 w-7"
                          label={`Re-evaluate review ${review.id}`}
                          onClick={() => onRevert(review)}
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </IconButton>
                        <ConfirmDeleteDialog
                          itemType="Review"
                          name={`${review.user} — ${review.merchant}`}
                          onConfirm={() => onDelete(review)}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            aria-label={`Delete review ${review.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </ConfirmDeleteDialog>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="pending" className={tabTriggerClass}>
          Pending Review ({pending.length})
        </TabsTrigger>
        <TabsTrigger value="reviewed" className={tabTriggerClass}>
          Reviewed ({reviewed.length})
        </TabsTrigger>
      </TabsList>
      <div className="filter-bar mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
        {tab === "reviewed" && (
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="lg:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        )}
        {!scopedMerchant && (
          <Select value={merchantFilter} onValueChange={setMerchantFilter}>
            <SelectTrigger className="lg:w-52">
              <SelectValue placeholder="Merchant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All merchants</SelectItem>
              {merchantNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Input
          type="date"
          className="lg:w-40"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          aria-label="Submitted from"
        />
        <Input
          type="date"
          className="lg:w-40"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          aria-label="Submitted to"
        />
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="lg:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest submitted</SelectItem>
            <SelectItem value="oldest">Oldest submitted</SelectItem>
            <SelectItem value="rating-high">Rating: High to Low</SelectItem>
            <SelectItem value="rating-low">Rating: Low to High</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" onClick={resetFilters}>
            Reset
          </Button>
        )}
        <LayoutToggle value={layout} onChange={setLayout} />
        {tab === "pending" && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => setReviewImportOpen(true)}
          >
            <UploadCloud className="mr-1 h-3.5 w-3.5" />
            Import
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() =>
            downloadCsv(tab === "pending" ? pending : reviewed, `offerpe-reviews-${tab}.csv`)
          }
        >
          <Download className="mr-1 h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>
      <ImportModal open={reviewImportOpen} onOpenChange={setReviewImportOpen} />
      <TabsContent value="pending" className="mt-4">
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews waiting for review.</p>
        ) : layout === "list" ? (
          reviewTable(pending, "pending")
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pending.map((review) => (
              <PendingReviewCard
                rejectionReasons={rejectionReasons}
                key={review.id}
                review={review}
                showMerchant={!scopedMerchant}
                onApprove={onApprove}
                onReject={onReject}
              />
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="reviewed" className="mt-4">
        {reviewed.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing reviewed yet.</p>
        ) : layout === "list" ? (
          reviewTable(reviewed, "reviewed")
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {reviewed.map((review) => (
              <article
                key={review.id}
                className="flex min-h-88 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card"
              >
                <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40">
                  <MerchantLogo name={review.merchant} />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-heading text-sm font-bold">{review.user}</span>
                        <ReviewStatusBadge review={review} />
                        <span className="text-xs text-muted-foreground">{review.submitted}</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3">
                        {!scopedMerchant && (
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                            <span className="flex h-5 w-5 items-center justify-center rounded bg-accent text-primary">
                              <Store className="h-3 w-3" />
                            </span>
                            {review.merchant}
                          </span>
                        )}
                        <Stars rating={review.rating} />
                        <span className="font-mono text-xs text-muted-foreground">{review.id}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button size="sm" variant="outline" onClick={() => onRevert(review)}>
                        <RotateCcw />
                        Re-evaluate
                      </Button>
                      <ConfirmDeleteDialog
                        itemType="Review"
                        name={`${review.user} — ${review.merchant}`}
                        onConfirm={() => onDelete(review)}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          aria-label={`Delete review ${review.id}`}
                        >
                          <Trash2 />
                        </Button>
                      </ConfirmDeleteDialog>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {review.comment}
                  </p>
                  {review.status === "Rejected" && (
                    <p className="mt-2 text-xs font-semibold text-destructive">
                      Reason: {review.reason}
                      {review.note && (
                        <span className="font-normal text-muted-foreground"> — {review.note}</span>
                      )}
                    </p>
                  )}
                  {review.photos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {review.photos.map((photo) => (
                        <ReviewPhoto key={photo} src={photo} user={review.user} />
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
