import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { CopyButton } from "@/components/admin/CopyButton";
import { IconButton } from "@/components/admin/IconButton";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Offer } from "@/types/admin";
import { format } from "date-fns";
import { Pencil, Store, Trash2 } from "lucide-react";

export function OfferTable({
  offers,
  onEdit,
  onDelete,
  showMerchant = false,
}: {
  offers: Offer[];
  onEdit: (offer: Offer) => void;
  onDelete: (offer: Offer) => void;
  showMerchant?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-245 text-left text-sm">
        <thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground">
          <tr>
            <th>Headline / Offer Name</th>
            {showMerchant && <th>Merchant</th>}
            <th>Customer Cashback</th>
            <th>Commission</th>
            <th>Validity</th>
            <th>Min Bill</th>
            <th>Sort</th>
            <th>Featured</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id} className="border-t border-border hover:bg-muted/50">
              <td>
                <div className="font-semibold">{offer.headline}</div>
                <div className="text-xs text-muted-foreground">{offer.subtext}</div>
              </td>
              {showMerchant && (
                <td>
                  <span className="inline-flex items-center gap-2 font-medium">
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-primary">
                      <Store className="h-3.5 w-3.5" />
                    </span>
                    {offer.merchant}
                  </span>
                </td>
              )}
              <td>
                {offer.discountType === "Percentage"
                  ? `${offer.discountValue}%`
                  : `₹${offer.discountValue}`}
              </td>
              <td>
                {offer.commissionType === "Percentage"
                  ? `${offer.commissionValue}%`
                  : `₹${offer.commissionValue}`}
              </td>
              <td className="whitespace-nowrap text-xs text-muted-foreground">
                {format(new Date(offer.start), "dd MMM yyyy")} –{" "}
                {offer.end ? format(new Date(offer.end), "dd MMM yyyy") : "Open"}
              </td>
              <td>₹{offer.minBill}</td>
              <td>{offer.sortOrder}</td>
              <td>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                    offer.featured ? "bg-info-soft text-info" : "bg-muted text-muted-foreground",
                  )}
                >
                  {offer.featured ? "Featured" : "Standard"}
                </span>
              </td>
              <td>
                <StatusBadge status={offer.active ? "Active" : "Inactive"} />
              </td>
              <td className="text-right">
                <span className="inline-flex">
                  <IconButton
                    className="h-7 w-7"
                    label={`Edit ${offer.headline}`}
                    onClick={() => onEdit(offer)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </IconButton>
                  {showMerchant && <CopyButton value={offer.id} />}
                  <ConfirmDeleteDialog
                    itemType="Offer"
                    name={offer.headline}
                    onConfirm={() => onDelete(offer)}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      aria-label={`Delete ${offer.headline}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </ConfirmDeleteDialog>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
