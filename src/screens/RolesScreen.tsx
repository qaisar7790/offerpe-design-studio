import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { IconButton } from "@/components/admin/IconButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/types/admin";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export function AddRoleDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreate: (role: AdminRole) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const close = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      setName("");
      setDescription("");
    }
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-xl bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Create role</DialogTitle>
          <DialogDescription>
            Create the role first, then assign permissions on the full edit screen.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5">
          <label className="space-y-1.5 text-sm font-medium">
            Name <span className="text-destructive">*</span>
            <Input
              aria-label="Role name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Finance Reviewer"
            />
          </label>
          <label className="space-y-1.5 text-sm font-medium">
            Description
            <Textarea
              aria-label="Role description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Briefly describe who should receive this role…"
            />
          </label>
        </div>
        <DialogFooter>
          <Button variant="destructiveSoft" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button
            disabled={!name.trim()}
            onClick={() => {
              onCreate({
                id: `ROLE-${Date.now()}`,
                name: name.trim(),
                description:
                  description.trim() ||
                  "Custom admin role. Configure permissions before assigning admins.",
                permissions: [],
                admins: 0,
                system: false,
                updated: "21 Sep 2026, 7:06 pm",
              });
              close(false);
            }}
          >
            <Plus />
            Create role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RolesPage({
  roles,
  onCreate,
  onEdit,
  onDelete,
  allPermissionKeys,
}: {
  roles: AdminRole[];
  onCreate: (role: AdminRole) => void;
  onEdit: (role: AdminRole) => void;
  onDelete: (role: AdminRole) => void;
  readonly allPermissionKeys: string[];
}) {
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"all" | "system" | "custom">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [addOpen, setAddOpen] = useState(false);
  const search = query.toLowerCase();
  const rows = roles.filter(
    (role) =>
      (!search || `${role.name} ${role.description}`.toLowerCase().includes(search)) &&
      (scope === "all" || (scope === "system") === role.system),
  );
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const visibleRows = rows.slice(start, start + pageSize);
  const pageItems = Array.from(
    new Set([1, currentPage - 1, currentPage, currentPage + 1, pageCount]),
  )
    .filter((item) => item >= 1 && item <= pageCount)
    .sort((a, b) => a - b);
  const hasFilters = Boolean(query || scope !== "all");
  return (
    <>
      <PageHeader
        title="Roles"
        description="Compact role list with permission counts, admin assignments, and full-page editing for complex access control."
        actions={
          <Button onClick={() => setAddOpen(true)}>
            <Plus />
            Add new
          </Button>
        }
      />
      <div className="filter-bar mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative min-w-[280px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="w-full pl-9"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search role name or description…"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />
              Type: {scope === "all" ? "All" : scope === "system" ? "System" : "Custom"}
              <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 border-border bg-card">
            <DropdownMenuItem
              onSelect={() => {
                setScope("all");
                setPage(1);
              }}
            >
              Type: All
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setScope("system");
                setPage(1);
              }}
            >
              Type: System
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setScope("custom");
                setPage(1);
              }}
            >
              Type: Custom
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setScope("all");
              setPage(1);
            }}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
      <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="table-scrollbar max-w-full overflow-x-auto">
          <table className="w-max min-w-260 border-separate border-spacing-0 text-left text-sm">
            <thead className="text-[11px] uppercase text-muted-foreground">
              <tr>
                {["Role", "Description", "Permissions", "Admins", "Type", "Last Updated"].map(
                  (label, index) => (
                    <th
                      key={label}
                      className={cn(
                        "sticky top-0 z-10 border-b border-border bg-muted/95 px-4 py-2 backdrop-blur",
                        index === 0 && "left-0 z-30 shadow-sticky-left",
                      )}
                    >
                      {label}
                    </th>
                  ),
                )}
                <th className="sticky right-0 top-0 z-30 border-b border-border bg-muted/95 pr-4 text-right backdrop-blur shadow-sticky-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((role) => (
                <tr key={role.id} className="group hover:bg-muted/50">
                  <td className="sticky left-0 z-20 border-b border-border bg-card px-4 py-2 shadow-sticky-left group-hover:bg-muted">
                    <span className="flex items-center gap-2 font-heading font-bold">
                      {role.name}
                      {role.system && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                          System
                        </span>
                      )}
                    </span>
                  </td>
                  <td
                    className="max-w-160 truncate border-b border-border text-muted-foreground"
                    title={role.description}
                  >
                    {role.description}
                  </td>
                  <td className="border-b border-border">
                    <span className="font-heading text-lg font-bold text-foreground">
                      {role.permissions.length}
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      of {allPermissionKeys.length}
                    </span>
                  </td>
                  <td className="border-b border-border font-semibold">{role.admins}</td>
                  <td className="border-b border-border">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        role.system ? "bg-info-soft text-info" : "status-active",
                      )}
                    >
                      {role.system ? "Locked" : "Editable"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap border-b border-border text-xs text-muted-foreground">
                    {role.updated}
                  </td>
                  <td className="sticky right-0 z-20 border-b border-border bg-card pr-3 text-right shadow-sticky-right group-hover:bg-muted">
                    <span className="inline-flex items-center">
                      <IconButton
                        className="h-7 w-7"
                        label={`Edit ${role.name}`}
                        onClick={() => onEdit(role)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </IconButton>
                      {!role.system && (
                        <ConfirmDeleteDialog
                          itemType="Role"
                          name={role.name}
                          onConfirm={() => onDelete(role)}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            aria-label={`Delete ${role.name}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </ConfirmDeleteDialog>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleRows.length && (
            <div className="px-6 py-14 text-center">
              <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-3 font-heading font-semibold">No roles found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try changing or resetting the current filters.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 grid gap-4 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="flex min-w-0 flex-wrap items-center gap-4">
          <span>
            Showing <strong className="text-foreground">{rows.length ? start + 1 : 0}</strong> to{" "}
            <strong className="text-foreground">{Math.min(start + pageSize, rows.length)}</strong>{" "}
            of <strong className="text-foreground">{rows.length}</strong> roles
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <span>Rows per page</span>
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
                {[10, 25, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 lg:justify-end">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeft />
            Previous
          </Button>
          {pageItems.map((item) => (
            <Button
              key={item}
              variant={item === currentPage ? "default" : "outline"}
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setPage(item)}
              aria-current={item === currentPage ? "page" : undefined}
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
      <AddRoleDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onCreate={(role) => {
          onCreate(role);
          setAddOpen(false);
        }}
      />
    </>
  );
}
