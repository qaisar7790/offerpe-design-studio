import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { IconButton } from "@/components/admin/IconButton";
import { LayoutToggle } from "@/components/admin/LayoutToggle";
import { MerchantLogo } from "@/components/admin/MerchantLogo";
import { OfferTable } from "@/components/admin/OfferTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadCsv, inr } from "@/lib/admin-utils";
import type { LayoutMode, Merchant, Offer, Status } from "@/types/admin";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Pencil,
  Plus,
  Search,
  Store,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function OffersPage({
  offers,
  onEdit,
  onCreate,
  onDelete,
  merchants,
}: {
  offers: Offer[];
  onEdit: (offer: Offer) => void;
  onCreate: () => void;
  onDelete: (offer: Offer) => void;
  merchants: readonly Merchant[];
}) {
  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [merchantFilter, setMerchantFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [layout, setLayout] = useState<LayoutMode>("list");
  const filtered = offers.filter(
    (offer) =>
      (!query ||
        `${offer.headline} ${offer.merchant}`.toLowerCase().includes(query.toLowerCase())) &&
      (!statuses.length || statuses.includes(offer.active ? "Active" : "Inactive")) &&
      (merchantFilter === "all" || offer.merchant === merchantFilter),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  return (
    <>
      <PageHeader
        title="Offers"
        description="Manage customer cashback, merchant commissions, validity, and visibility."
        actions={
          <>
            <LayoutToggle value={layout} onChange={setLayout} />
            <Button onClick={onCreate}>
              <Plus />
              Add new offer
            </Button>
          </>
        }
      />
      <div className="filter-bar mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative min-w-[280px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search offer headline or merchant…"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter />
              Status{statuses.length ? ` (${statuses.length})` : ""}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(["Active", "Inactive"] as Status[]).map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={statuses.includes(status)}
                onCheckedChange={() => {
                  setStatuses(
                    statuses.includes(status)
                      ? statuses.filter((item) => item !== status)
                      : [...statuses, status],
                  );
                  setPage(1);
                }}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Select
          value={merchantFilter}
          onValueChange={(value) => {
            setMerchantFilter(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full lg:w-52">
            <SelectValue placeholder="All merchants" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All merchants</SelectItem>
            {merchants.map((merchant) => (
              <SelectItem key={merchant[0]} value={merchant[0]}>
                {merchant[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => downloadCsv(filtered, "offerpe-offers.csv")}
        >
          <Download className="mr-1 h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>
      {layout === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((offer) => (
            <article
              key={offer.id}
              className="flex min-h-88 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card"
            >
              <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40">
                <MerchantLogo name={offer.merchant} />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-heading text-base font-bold">{offer.headline}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Store className="h-3 w-3" />
                      {offer.merchant}
                    </div>
                  </div>
                  <StatusBadge status={offer.active ? "Active" : "Inactive"} />
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{offer.subtext}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
                    Cashback{" "}
                    {offer.discountType === "Percentage"
                      ? `${offer.discountValue}%`
                      : inr(offer.discountValue)}
                  </span>
                  <span className="rounded-full border border-border bg-muted px-2 py-0.5 font-semibold">
                    Commission{" "}
                    {offer.commissionType === "Percentage"
                      ? `${offer.commissionValue}%`
                      : inr(offer.commissionValue)}
                  </span>
                  {offer.featured && (
                    <span className="rounded-full bg-success-soft px-2 py-0.5 font-semibold text-success">
                      Featured
                    </span>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-between pt-1 text-xs text-muted-foreground">
                  <span>
                    {offer.start} — {offer.end}
                  </span>
                  <span className="flex gap-1">
                    <IconButton
                      className="h-7 w-7"
                      label={`Edit ${offer.headline}`}
                      onClick={() => onEdit(offer)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </IconButton>
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
                </div>
              </div>
            </article>
          ))}
          {rows.length === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
              No offers match these filters.
            </div>
          )}
        </div>
      ) : (
        <OfferTable offers={rows} onEdit={onEdit} onDelete={onDelete} showMerchant />
      )}
      <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <span>
            Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong>{" "}
            to{" "}
            <strong className="text-foreground">
              {Math.min(start + pageSize, filtered.length)}
            </strong>{" "}
            of <strong className="text-foreground">{filtered.length}</strong> results
          </span>
          <div className="flex items-center gap-2">
            Rows per page
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeft />
            Previous
          </Button>
          <Button size="icon" className="h-8 w-8">
            {currentPage}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </>
  );
}
