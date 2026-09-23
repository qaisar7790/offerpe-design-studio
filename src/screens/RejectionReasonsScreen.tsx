import { IconButton } from "@/components/admin/IconButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TransactionPagination } from "@/components/admin/TransactionPagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Textarea } from "@/components/ui/textarea";
import type { RejectionCategory, RejectionReason } from "@/types/admin";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Filter,
  Flag,
  Pencil,
  Plus,
  RotateCcw,
  Search,
} from "lucide-react";
import { useState } from "react";

export function RejectionReasonDialog({
  reason,
  nextOrder,
  onClose,
  onSave,
  rejectionCategories,
}: {
  reason: RejectionReason | null;
  nextOrder: number;
  onClose: () => void;
  onSave: (reason: RejectionReason) => void;
  rejectionCategories: readonly RejectionCategory[];
}) {
  const [text, setText] = useState(reason?.reason ?? "");
  const [category, setCategory] = useState<RejectionCategory>(
    reason?.category ?? "Transaction Rejection Reason",
  );
  const [order, setOrder] = useState(reason?.order ?? nextOrder);
  const [active, setActive] = useState(reason?.active ?? true);
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {reason ? "Edit rejection reason" : "New rejection reason"}
          </DialogTitle>
          <DialogDescription>
            {reason
              ? "Update the label, ordering, or deactivate this reason."
              : "Add a reason to the whitelist used when conversions are rejected."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5">
          <label className="space-y-1.5 text-sm font-medium">
            Reason <span className="text-destructive">*</span>
            <Textarea
              aria-label="Reason"
              rows={3}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="e.g. Payment failed"
            />
            <span className="block text-xs font-normal text-muted-foreground">
              Long reasons wrap onto multiple lines and stay fully visible.
            </span>
          </label>
          <label className="space-y-1.5 text-sm font-medium">
            Rejection reason category <span className="text-destructive">*</span>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as RejectionCategory)}
            >
              <SelectTrigger aria-label="Rejection reason category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rejectionCategories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="block text-xs font-normal text-muted-foreground">
              Decides which admin flow offers this reason in its dropdown.
            </span>
          </label>
          <label className="space-y-1.5 text-sm font-medium">
            Display order <span className="text-destructive">*</span>
            <Input
              aria-label="Display order"
              type="number"
              min={0}
              className="w-40"
              value={order}
              onChange={(event) => setOrder(Math.max(0, Number(event.target.value)))}
            />
            <span className="block text-xs font-normal text-muted-foreground">
              Lower numbers appear first in dropdowns and export templates.
            </span>
          </label>
          <label className="flex items-start gap-2.5 text-sm font-medium">
            <Checkbox
              checked={active}
              onCheckedChange={(checked) => setActive(checked === true)}
              aria-label="Active"
              className="mt-0.5"
            />
            <span className="space-y-0.5">
              Active
              <span className="block text-xs font-normal text-muted-foreground">
                Inactive reasons stay on historical conversions but can't be newly assigned.
              </span>
            </span>
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!text.trim()}
            onClick={() =>
              onSave({
                id: reason?.id ?? `RR-${Date.now()}`,
                reason: text.trim(),
                category,
                order,
                active,
              })
            }
          >
            <Check />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RejectionReasons({
  reasons,
  onSave,
  rejectionCategories,
  rejectionCategoryShort,
}: {
  reasons: RejectionReason[];
  onSave: (reason: RejectionReason, isNew: boolean) => void;
  rejectionCategories: readonly RejectionCategory[];
  rejectionCategoryShort: Record<RejectionCategory, string>;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | RejectionCategory>("all");
  const [sortKey, setSortKey] = useState<"reason" | "category" | "order">("order");
  const [sortAsc, setSortAsc] = useState(true);
  const [editing, setEditing] = useState<RejectionReason | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const search = query.toLowerCase();
  const rows = reasons
    .filter(
      (item) =>
        (!search ||
          item.reason.toLowerCase().includes(search) ||
          item.category.toLowerCase().includes(search)) &&
        (statusFilter === "all" || (statusFilter === "active") === item.active) &&
        (categoryFilter === "all" || item.category === categoryFilter),
    )
    .sort((a, b) => {
      const result =
        sortKey === "reason"
          ? a.reason.localeCompare(b.reason)
          : sortKey === "category"
            ? a.category.localeCompare(b.category) || a.order - b.order
            : a.order - b.order;
      return sortAsc ? result : -result;
    });
  const toggleSort = (key: "reason" | "category" | "order") => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };
  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (item: RejectionReason) => {
    setEditing(item);
    setDialogOpen(true);
  };
  return (
    <>
      <PageHeader
        title="Rejection Reasons"
        description="The whitelist resolve_online_conversion / approve_conversion_resolution validate a rejection reason against. Deactivate a reason instead of deleting it — historical conversions rejected under it keep displaying its text correctly either way."
        actions={
          <Button onClick={openAdd}>
            <Plus />
            Add new
          </Button>
        }
      />
      <div className="filter-bar mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative min-w-[280px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search reasons"
            className="w-full pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by reason text or category…"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              Category: {categoryFilter === "all" ? "All" : rejectionCategoryShort[categoryFilter]}
              <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 border-border bg-card">
            <DropdownMenuItem onSelect={() => setCategoryFilter("all")}>
              Category: All
            </DropdownMenuItem>
            {rejectionCategories.map((item) => (
              <DropdownMenuItem key={item} onSelect={() => setCategoryFilter(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              Status:{" "}
              {statusFilter === "all" ? "All" : statusFilter === "active" ? "Active" : "Inactive"}
              <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 border-border bg-card">
            {["all", "active", "inactive"].map((item) => (
              <DropdownMenuItem key={item} onSelect={() => setStatusFilter(item)}>
                Status: {item === "all" ? "All" : item === "active" ? "Active" : "Inactive"}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {(query || statusFilter !== "all" || categoryFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setStatusFilter("all");
              setCategoryFilter("all");
            }}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
      <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="table-scrollbar overflow-x-auto">
          <table className="w-full min-w-140 text-left text-sm">
            <thead className="text-[11px] uppercase text-muted-foreground">
              <tr>
                <th className="sticky top-0 bg-muted/95 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-7 text-[11px] uppercase"
                    onClick={() => toggleSort("reason")}
                  >
                    Reason{" "}
                    {sortKey === "reason" &&
                      (sortAsc ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ))}
                  </Button>
                </th>
                <th className="sticky top-0 bg-muted/95 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-7 text-[11px] uppercase"
                    onClick={() => toggleSort("category")}
                  >
                    Category{" "}
                    {sortKey === "category" &&
                      (sortAsc ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ))}
                  </Button>
                </th>
                <th className="sticky top-0 bg-muted/95 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-7 text-[11px] uppercase"
                    onClick={() => toggleSort("order")}
                  >
                    Order{" "}
                    {sortKey === "order" &&
                      (sortAsc ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ))}
                  </Button>
                </th>
                <th className="sticky top-0 bg-muted/95 py-2">Status</th>
                <th className="sticky top-0 bg-muted/95 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id} className="border-t border-border hover:bg-muted/50">
                  <td className="font-semibold">{item.reason}</td>
                  <td>
                    <span
                      className="inline-block rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary"
                      title={item.category}
                    >
                      {rejectionCategoryShort[item.category]}
                    </span>
                  </td>
                  <td className="text-muted-foreground">{item.order}</td>
                  <td>
                    <StatusBadge status={item.active ? "Active" : "Inactive"} />
                  </td>
                  <td className="text-right">
                    <IconButton
                      className="h-7 w-7"
                      label={`Edit ${item.reason}`}
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <div className="px-6 py-14 text-center">
              <Flag className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-3 font-heading font-semibold">No rejection reasons found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try changing or resetting the current filters.
              </p>
            </div>
          )}
        </div>
      </div>
      <TransactionPagination count={rows.length} />
      {dialogOpen && (
        <RejectionReasonDialog
          reason={editing}
          nextOrder={reasons.reduce((max, item) => Math.max(max, item.order), 0) + 1}
          onClose={() => setDialogOpen(false)}
          onSave={(reason) => {
            onSave(reason, !editing);
            setDialogOpen(false);
          }}
          rejectionCategories={rejectionCategories}
        />
      )}
    </>
  );
}
