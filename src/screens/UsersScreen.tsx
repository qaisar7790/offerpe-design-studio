import { CopyButton } from "@/components/admin/CopyButton";
import { IconButton } from "@/components/admin/IconButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
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
import { downloadCsv, inr } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";
import type { DeletedFilter, UserDateField, UserRecord, UserStatus } from "@/types/admin";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  MousePointerClick,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  UploadCloud,
  Users,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function UserImportDialog({
  open,
  onOpenChange,
  onImport,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onImport: (fileName: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const close = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) setFile(null);
  };
  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-xl bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Import users via CSV</DialogTitle>
          <DialogDescription>
            Stage customer user records from a CSV. Duplicate phone numbers are rejected row-by-row
            and valid rows continue.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md bg-muted p-3 text-sm leading-6 text-muted-foreground">
          <span className="mr-2 inline-flex rounded bg-info-soft px-2 py-0.5 text-xs font-semibold text-info">
            Required columns
          </span>
          <code>phone_number</code>
          <span className="mx-2 text-muted-foreground">Optional:</span>
          <code>user_id, full_name, email, city, status</code>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setFile(event.dataTransfer.files[0] ?? null);
          }}
          className="flex min-h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed border-strong bg-muted/40 px-6 text-center hover:border-primary hover:bg-accent"
        >
          <UploadCloud className="mb-3 h-8 w-8 text-primary" />
          <span className="font-semibold text-primary">
            {file ? file.name : "Choose a CSV file"}
          </span>
          <span className="mt-1 text-sm text-muted-foreground">
            or drag and drop the users CSV here
          </span>
          <input
            ref={inputRef}
            className="hidden"
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </button>
        <DialogFooter>
          <Button variant="destructiveSoft" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button
            disabled={!file}
            onClick={() => {
              if (file) onImport(file.name);
              close(false);
            }}
          >
            <UploadCloud />
            Upload &amp; import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UsersPage({ initialUsers }: { readonly initialUsers: UserRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [deleted, setDeleted] = useState<DeletedFilter>("all");
  const [dateField, setDateField] = useState<UserDateField>("signedUp");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [importOpen, setImportOpen] = useState(false);
  const search = query.toLowerCase();
  const getDate = (row: UserRecord) =>
    dateField === "lastLogin"
      ? row.lastLoginDate
      : dateField === "signedUp"
        ? row.signedUpDate
        : dateField === "deletedAt"
          ? row.deletedDate
          : row.reRegisteredDate;
  const filtered = initialUsers
    .filter(
      (row) =>
        (!search || `${row.id} ${row.phone} ${row.name}`.toLowerCase().includes(search)) &&
        (status === "all" || row.status === status) &&
        (deleted === "all" || row.deleted === (deleted === "yes")) &&
        (!from || (getDate(row) && getDate(row) >= from)) &&
        (!to || (getDate(row) && getDate(row) <= to)),
    )
    .sort((a, b) =>
      sortDesc
        ? b.signedUpDate.localeCompare(a.signedUpDate)
        : a.signedUpDate.localeCompare(b.signedUpDate),
    );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  const pageItems = Array.from(
    new Set([1, 2, currentPage - 1, currentPage, currentPage + 1, pageCount - 1, pageCount]),
  )
    .filter((item) => item >= 1 && item <= pageCount)
    .sort((a, b) => a - b);
  const hasFilters = Boolean(
    query || status !== "all" || deleted !== "all" || from || to || dateField !== "signedUp",
  );
  const reset = () => {
    setQuery("");
    setStatus("all");
    setDeleted("all");
    setDateField("signedUp");
    setFrom("");
    setTo("");
    setPage(1);
  };
  const csvCell = (cell: string | number | boolean) => `"${String(cell).replaceAll('"', '""')}"`;
  const downloadCsv = (includePi: boolean) => {
    const headings = includePi
      ? [
          "User ID",
          "Name",
          "Mobile",
          "Email",
          "Status",
          "Deleted",
          "Re-registered",
          "Last Login IP",
          "Last Login User Agent",
          "Last Login At",
          "Signed Up",
          "Deleted At",
          "City",
          "Source",
          "Wallet",
        ]
      : [
          "User ID",
          "Status",
          "Deleted",
          "Re-registered",
          "Last Login At",
          "Signed Up",
          "Deleted At",
          "City",
          "Source",
          "Wallet",
        ];
    const values = filtered.map((row) =>
      includePi
        ? [
            row.id,
            row.name,
            row.phone,
            row.email,
            row.status,
            row.deleted ? "Yes" : "No",
            row.reRegistered ? "Yes" : "No",
            row.lastLoginIp,
            row.lastLoginAgent,
            row.lastLoginAt,
            row.signedUp,
            row.deletedAt,
            row.city,
            row.source,
            row.wallet,
          ]
        : [
            row.id,
            row.status,
            row.deleted ? "Yes" : "No",
            row.reRegistered ? "Yes" : "No",
            row.lastLoginAt,
            row.signedUp,
            row.deletedAt,
            row.city,
            row.source,
            row.wallet,
          ],
    );
    const csv = [headings, ...values].map((line) => line.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = includePi ? "offerpe-users-with-pi.csv" : "offerpe-users-without-pi.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success(includePi ? "Users exported with PI data" : "Users exported without PI data", {
      description: `${filtered.length} filtered users downloaded.`,
    });
  };
  const importUsers = (fileName: string) =>
    toast.success("User import queued", {
      description: `${fileName} was staged for validation. Duplicate phone numbers will be rejected row-by-row.`,
    });
  return (
    <>
      <PageHeader
        title="Users"
        description="High-density customer account list for identity, lifecycle, login, and deletion review."
      />
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative min-w-[280px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search users"
            className="w-full pl-9"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search by User ID, mobile number, or name…"
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
          <DropdownMenuContent align="end" className="w-44 border-border bg-card">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <Trash2 className="mr-2 h-4 w-4 text-muted-foreground" />
              Deleted: {deleted === "all" ? "All" : deleted === "yes" ? "Yes" : "No"}
              <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 border-border bg-card">
            <DropdownMenuItem
              onSelect={() => {
                setDeleted("all");
                setPage(1);
              }}
            >
              Deleted: All
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setDeleted("yes");
                setPage(1);
              }}
            >
              Deleted: Yes
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setDeleted("no");
                setPage(1);
              }}
            >
              Deleted: No
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
              Date:{" "}
              {dateField === "lastLogin"
                ? "Last login"
                : dateField === "signedUp"
                  ? "Sign up"
                  : dateField === "deletedAt"
                    ? "Deleted"
                    : "Re-registered"}
              <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 border-border bg-card">
            <DropdownMenuItem
              onSelect={() => {
                setDateField("lastLogin");
                setPage(1);
              }}
            >
              Last login date
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setDateField("signedUp");
                setPage(1);
              }}
            >
              Sign up date
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setDateField("deletedAt");
                setPage(1);
              }}
            >
              Deleted date
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setDateField("reRegisteredAt");
                setPage(1);
              }}
            >
              Re-registered date
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          aria-label="From date"
          title="From date"
          type="date"
          value={from}
          onChange={(event) => {
            setFrom(event.target.value);
            setPage(1);
          }}
          className="w-full shrink-0 lg:w-38"
        />
        <Input
          aria-label="To date"
          title="To date"
          type="date"
          value={to}
          onChange={(event) => {
            setTo(event.target.value);
            setPage(1);
          }}
          className="w-full shrink-0 lg:w-38"
        />
        {hasFilters && (
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
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => setImportOpen(true)}
        >
          <UploadCloud className="mr-1 h-3.5 w-3.5" />
          Import
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0">
              <Download className="mr-1 h-3.5 w-3.5" />
              Export CSV
              <ChevronDown className="ml-1 h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-border bg-card">
            <DropdownMenuItem onSelect={() => downloadCsv(true)}>
              <Download />
              Download with PI data
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => downloadCsv(false)}>
              <ShieldCheck />
              Download without PI data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="table-scrollbar max-w-full overflow-x-auto">
          <table className="w-max min-w-520 border-separate border-spacing-0 text-left text-sm">
            <thead className="text-[11px] uppercase text-muted-foreground">
              <tr>
                {[
                  "User ID",
                  "Name",
                  "Mobile",
                  "Email",
                  "Status",
                  "Deleted",
                  "Re-registered",
                  "City",
                  "Source",
                  "Wallet",
                  "Last Login IP",
                  "Last Login User Agent",
                  "Last Login At",
                  "Signed Up",
                  "Deleted At",
                ].map((label, index) => (
                  <th
                    key={label}
                    className={cn(
                      "sticky top-0 z-10 border-b border-border bg-muted/95 px-4 py-2 backdrop-blur",
                      index === 0 && "left-0 z-30 shadow-sticky-left",
                    )}
                  >
                    {label === "Signed Up" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-7 text-[11px] uppercase"
                        onClick={() => setSortDesc(!sortDesc)}
                      >
                        Signed Up{" "}
                        {sortDesc ? (
                          <ArrowDown className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowUp className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    ) : (
                      label
                    )}
                  </th>
                ))}
                <th className="sticky right-0 top-0 z-30 border-b border-border bg-muted/95 pr-4 text-right backdrop-blur shadow-sticky-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="group hover:bg-muted/50">
                  <td className="sticky left-0 z-20 border-b border-border bg-card px-4 py-2 shadow-sticky-left group-hover:bg-muted">
                    <span className="flex items-center gap-1 font-mono text-xs font-semibold">
                      {row.id}
                      <CopyButton value={row.id} />
                    </span>
                  </td>
                  <td className="border-b border-border font-semibold">{row.name}</td>
                  <td className="border-b border-border font-mono text-xs">
                    <span className="flex items-center gap-1">
                      {row.phone}
                      <CopyButton value={row.phone} />
                    </span>
                  </td>
                  <td className="border-b border-border text-muted-foreground">{row.email}</td>
                  <td className="border-b border-border">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="border-b border-border">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        row.deleted ? "status-rejected" : "status-approved",
                      )}
                    >
                      {row.deleted ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="border-b border-border">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                        row.reRegistered ? "status-requested" : "bg-muted text-muted-foreground",
                      )}
                    >
                      {row.reRegistered ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="border-b border-border">{row.city}</td>
                  <td className="border-b border-border">
                    <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium">
                      {row.source}
                    </span>
                  </td>
                  <td className="border-b border-border font-semibold">{inr(row.wallet)}</td>
                  <td className="border-b border-border font-mono text-xs text-muted-foreground">
                    {row.lastLoginIp}
                  </td>
                  <td
                    className="max-w-64 truncate border-b border-border text-xs text-muted-foreground"
                    title={row.lastLoginAgent}
                  >
                    {row.lastLoginAgent}
                  </td>
                  <td className="border-b border-border whitespace-nowrap text-xs font-medium">
                    {row.lastLoginAt}
                  </td>
                  <td className="border-b border-border whitespace-nowrap text-xs text-muted-foreground">
                    {row.signedUp}
                  </td>
                  <td className="border-b border-border whitespace-nowrap text-xs text-muted-foreground">
                    {row.deletedAt}
                  </td>
                  <td className="sticky right-0 z-20 border-b border-border bg-card pr-3 text-right shadow-sticky-right group-hover:bg-muted">
                    <span className="inline-flex items-center">
                      <IconButton className="h-7 w-7" label={`View ${row.id}`}>
                        <Eye className="h-3.5 w-3.5" />
                      </IconButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            aria-label={`More actions for ${row.id}`}
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye />
                            Open user
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText />
                            View ledger
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MousePointerClick />
                            View clicks
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <div className="px-6 py-14 text-center">
              <Users className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-3 font-heading font-semibold">No users found</h3>
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
            Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong>{" "}
            to{" "}
            <strong className="text-foreground">
              {Math.min(start + pageSize, filtered.length)}
            </strong>{" "}
            of <strong className="text-foreground">{filtered.length}</strong> users
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
                {[10, 25, 50, 100].map((size) => (
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
          {pageItems.map((item, index) => {
            const previous = pageItems[index - 1];
            return (
              <span key={item} className="contents">
                {previous !== undefined && item - previous > 1 && <span className="px-1">…</span>}
                <Button
                  variant={item === currentPage ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setPage(item)}
                  aria-current={item === currentPage ? "page" : undefined}
                >
                  {item}
                </Button>
              </span>
            );
          })}
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
      <UserImportDialog open={importOpen} onOpenChange={setImportOpen} onImport={importUsers} />
    </>
  );
}
