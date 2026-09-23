import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { IconButton } from "@/components/admin/IconButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AffiliateNetwork } from "@/types/admin";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function AffiliateNetworksPage({
  networks,
  onCreate,
  onEdit,
  onDelete,
}: {
  networks: AffiliateNetwork[];
  onCreate: () => void;
  onEdit: (network: AffiliateNetwork) => void;
  onDelete: (network: AffiliateNetwork) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [ascending, setAscending] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const filtered = networks
    .filter(
      (network) =>
        (!query ||
          `${network.name} ${network.propertyId}`.toLowerCase().includes(query.toLowerCase())) &&
        (status === "all" || (network.active ? "Active" : "Inactive") === status),
    )
    .sort((a, b) => (ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  const reset = () => {
    setQuery("");
    setStatus("all");
    setPage(1);
  };
  return (
    <>
      <PageHeader
        title="Affiliate Networks"
        description="Configure affiliate network identifiers and URL templates used to generate tracked store, voucher, and product links."
        actions={
          <Button onClick={onCreate}>
            <Plus />
            Add new
          </Button>
        }
      />
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
        <div className="relative min-w-[280px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="w-full pl-9"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by network name or property ID…"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              Status: {status === "all" ? "All" : status}
              <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 border-border bg-card">
            <DropdownMenuItem
              onSelect={() => {
                setStatus("all");
                setPage(1);
              }}
            >
              Status: All
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setStatus("Active");
                setPage(1);
              }}
            >
              Status: Active
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setStatus("Inactive");
                setPage(1);
              }}
            >
              Status: Inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {(query || status !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground">
              <tr>
                <th>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-7 text-[11px] uppercase"
                    onClick={() => setAscending(!ascending)}
                  >
                    Name
                    <ChevronDown
                      className={cn("transition-transform", !ascending && "rotate-180")}
                    />
                  </Button>
                </th>
                <th>Property ID</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((network) => (
                <tr key={network.id} className="border-t border-border hover:bg-muted/50">
                  <td className="py-2 font-semibold">{network.name}</td>
                  <td className="py-2 font-mono text-xs text-muted-foreground">
                    {network.propertyId || "—"}
                  </td>
                  <td className="py-2">
                    <StatusBadge status={network.active ? "Active" : "Inactive"} />
                  </td>
                  <td className="py-2 text-right">
                    <span className="inline-flex">
                      <IconButton
                        className="h-7 w-7"
                        label={`Edit ${network.name}`}
                        onClick={() => onEdit(network)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </IconButton>
                      <ConfirmDeleteDialog
                        itemType="affiliate network"
                        name={network.name}
                        onConfirm={() => onDelete(network)}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          aria-label={`Delete ${network.name}`}
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
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong> to{" "}
          <strong className="text-foreground">{Math.min(start + pageSize, filtered.length)}</strong>{" "}
          of <strong className="text-foreground">{filtered.length}</strong> results
        </span>
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
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((item) => (
            <Button
              key={item}
              variant={item === currentPage ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(item)}
            >
              {item}
            </Button>
          ))}
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
