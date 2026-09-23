import { CopyButton } from "@/components/admin/CopyButton";
import { ImportModal } from "@/components/admin/ImportModal";
import { PageHeader } from "@/components/admin/PageHeader";
import { TransactionPagination } from "@/components/admin/TransactionPagination";
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
import { Textarea } from "@/components/ui/textarea";
import { inr } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";
import type { Withdrawal, WithdrawalStatus } from "@/types/admin";
import {
  ArrowDown,
  ArrowUp,
  BadgeIndianRupee,
  Check,
  ChevronDown,
  Download,
  Filter,
  RotateCcw,
  Search,
  UploadCloud,
  WalletCards,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function WithdrawalDecisionDialog({
  withdrawal,
  mode,
  onClose,
  onSave,
}: {
  withdrawal: Withdrawal | null;
  mode: "paid" | "failed" | null;
  onClose: () => void;
  onSave: (withdrawal: Withdrawal, status: WithdrawalStatus, utr: string, notes: string) => void;
}) {
  const [utr, setUtr] = useState("");
  const [notes, setNotes] = useState("");
  if (!withdrawal || !mode) return null;
  const paid = mode === "paid";
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {paid ? "Mark withdrawal as paid" : "Mark withdrawal as failed"}
          </DialogTitle>
          <DialogDescription>
            {paid
              ? `Record the payout reference for ${withdrawal.id}.`
              : `Record why ${withdrawal.id} could not be processed.`}
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-border bg-muted/60 p-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono font-semibold">{withdrawal.userId}</span>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <span className="text-muted-foreground">Amount</span>
            <strong>{inr(withdrawal.amount)}</strong>
          </div>
        </div>
        <div className="space-y-4">
          {paid && (
            <label className="block space-y-1.5 text-sm font-medium">
              UTR / reference number <span className="text-destructive">*</span>
              <Input
                aria-label="UTR / reference number"
                value={utr}
                onChange={(event) => setUtr(event.target.value)}
                placeholder="Enter bank or payment reference"
              />
            </label>
          )}
          <label className="block space-y-1.5 text-sm font-medium">
            Notes {paid && <span className="font-normal text-muted-foreground">(optional)</span>}
            <Textarea
              aria-label="Processing notes"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={paid ? "Add processing context…" : "Explain why the payout failed…"}
            />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={paid ? "default" : "destructive"}
            disabled={paid ? !utr.trim() : !notes.trim()}
            onClick={() => onSave(withdrawal, paid ? "Paid" : "Failed", utr.trim(), notes.trim())}
          >
            {paid ? <Check /> : <X />}
            {paid ? "Confirm paid" : "Mark failed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function Withdrawals({ initialWithdrawals }: { initialWithdrawals: Withdrawal[] }) {
  const [rows, setRows] = useState(initialWithdrawals);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<WithdrawalStatus | "all">("all");
  const [mode, setMode] = useState<Withdrawal["mode"] | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [sortDesc, setSortDesc] = useState(true);
  const [selected, setSelected] = useState<Withdrawal | null>(null);
  const [decision, setDecision] = useState<"paid" | "failed" | null>(null);
  const filtered = rows
    .filter(
      (row) =>
        (!query ||
          [row.id, row.userId, row.utr].join(" ").toLowerCase().includes(query.toLowerCase())) &&
        (status === "all" || row.status === status) &&
        (mode === "all" || row.mode === mode) &&
        (!from || row.date >= from) &&
        (!to || row.date <= to),
    )
    .sort((a, b) => (sortDesc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  const hasFilters = Boolean(query || status !== "all" || mode !== "all" || from || to);
  const reset = () => {
    setQuery("");
    setStatus("all");
    setMode("all");
    setFrom("");
    setTo("");
  };
  const exportRows = () => {
    const headings = [
      "Withdrawal ID",
      "User ID",
      "Amount",
      "Mode",
      "Payout Details",
      "Status",
      "Requested",
      "Resolved",
      "UTR",
      "Notes",
    ];
    const values = filtered.map((row) => [
      row.id,
      row.userId,
      row.amount,
      row.mode,
      row.payoutDetails,
      row.status,
      row.requested,
      row.resolved,
      row.utr,
      row.notes,
    ]);
    const csv = [headings, ...values]
      .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "offerpe-withdrawals.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Withdrawals exported", {
      description: `${filtered.length} filtered records downloaded as CSV.`,
    });
  };
  const processCsv = (file: File) => {
    toast.success("CSV processed", {
      description: `${file.name} was validated and queued. Each row is handled independently.`,
    });
  };
  const saveDecision = (
    withdrawal: Withdrawal,
    nextStatus: WithdrawalStatus,
    utr: string,
    notes: string,
  ) => {
    setRows((current) =>
      current.map((row) =>
        row.id === withdrawal.id
          ? {
              ...row,
              status: nextStatus,
              utr: utr || "—",
              notes: notes || row.notes,
              resolved: "21 Sep 2026, 6:08 pm",
            }
          : row,
      ),
    );
    toast.success(nextStatus === "Paid" ? "Withdrawal marked paid" : "Withdrawal marked failed", {
      description: `${withdrawal.id} was updated.`,
    });
    setSelected(null);
    setDecision(null);
  };
  const statusBadge = (value: WithdrawalStatus) => (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
        value === "Paid"
          ? "status-paid"
          : value === "Failed"
            ? "status-rejected"
            : "status-requested",
      )}
    >
      {value}
    </span>
  );
  return (
    <>
      <PageHeader
        title="Withdrawals"
        description="Review payout requests and securely record transfer outcomes."
      />
      <div className="filter-bar mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative min-w-[280px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search withdrawals"
            className="w-full pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search withdrawal ID, User ID, or UTR…"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <Filter />
              Status: {status === "all" ? "All" : status}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(["all", "Requested", "Paid", "Failed"] as const).map((item) => (
              <DropdownMenuItem key={item} onSelect={() => setStatus(item)}>
                Status: {item === "all" ? "All" : item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <WalletCards />
              Mode: {mode === "all" ? "All" : mode}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(["all", "Bank Account", "UPI", "Gift Card"] as const).map((item) => (
              <DropdownMenuItem key={item} onSelect={() => setMode(item)}>
                Mode: {item === "all" ? "All" : item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          aria-label="From date"
          type="date"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          className="w-full shrink-0 lg:w-38"
        />
        <Input
          aria-label="To date"
          type="date"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="w-full shrink-0 lg:w-38"
        />
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw />
            Reset
          </Button>
        )}
        <Button variant="outline" className="shrink-0" onClick={() => setImportOpen(true)}>
          <UploadCloud />
          Import
        </Button>
        <Button variant="outline" className="shrink-0" onClick={exportRows}>
          <Download />
          Export CSV
        </Button>
      </div>
      <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="table-scrollbar overflow-x-auto">
          <table className="w-full min-w-390 text-left text-sm">
            <thead className="text-[11px] uppercase text-muted-foreground">
              <tr>
                <th className="sticky left-0 top-0 z-30 bg-muted/95 shadow-sticky-left">
                  Withdrawal ID
                </th>
                <th>User ID</th>
                <th>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-7 text-[11px] uppercase"
                    onClick={() => setSortDesc(!sortDesc)}
                  >
                    Amount{" "}
                    {sortDesc ? (
                      <ArrowDown className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowUp className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </th>
                <th>Mode</th>
                <th>Payout Details</th>
                <th>Status</th>
                <th>Requested</th>
                <th>Resolved</th>
                <th>UTR</th>
                <th>Notes</th>
                <th className="sticky right-0 top-0 z-30 bg-muted/95 text-right shadow-sticky-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="group border-t border-border hover:bg-muted/50">
                  <td className="sticky left-0 z-20 bg-card font-mono text-xs font-semibold shadow-sticky-left group-hover:bg-muted">
                    <span className="flex items-center gap-1">
                      {row.id}
                      <CopyButton value={row.id} />
                    </span>
                  </td>
                  <td className="font-mono text-xs text-muted-foreground">{row.userId}</td>
                  <td className="font-semibold">{inr(row.amount)}</td>
                  <td>
                    <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium">
                      {row.mode}
                    </span>
                  </td>
                  <td className="max-w-96">
                    <span className="flex items-center gap-1.5 font-mono text-xs">
                      {row.payoutDetails}
                      <CopyButton value={row.payoutDetails} />
                    </span>
                  </td>
                  <td>{statusBadge(row.status)}</td>
                  <td className="whitespace-nowrap text-xs">{row.requested}</td>
                  <td className="whitespace-nowrap text-xs text-muted-foreground">
                    {row.resolved}
                  </td>
                  <td className="font-mono text-xs">{row.utr}</td>
                  <td className="max-w-44 truncate text-muted-foreground" title={row.notes}>
                    {row.notes}
                  </td>
                  <td className="sticky right-0 z-20 bg-card text-right shadow-sticky-right group-hover:bg-muted">
                    {row.status === "Requested" ? (
                      <span className="inline-flex gap-1">
                        <Button
                          size="sm"
                          className="h-7 px-2.5 text-xs"
                          onClick={() => {
                            setSelected(row);
                            setDecision("paid");
                          }}
                        >
                          <Check />
                          Paid
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 px-2.5 text-xs"
                          onClick={() => {
                            setSelected(row);
                            setDecision("failed");
                          }}
                        >
                          <X />
                          Fail
                        </Button>
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="px-6 py-14 text-center">
              <BadgeIndianRupee className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-3 font-heading font-semibold">No withdrawal requests found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try changing or resetting the current filters.
              </p>
            </div>
          )}
        </div>
      </div>
      <TransactionPagination count={filtered.length} />
      <ImportModal
        open={importOpen}
        onOpenChange={setImportOpen}
        title="Import Withdrawal Report"
        description="Upload a CSV to process withdrawal outcomes in bulk. Invalid rows do not block valid records."
        requiredColumns="withdrawal_request_id, status, utr_reference_number, notes"
        onImport={processCsv}
      />
      <WithdrawalDecisionDialog
        key={`${selected?.id ?? "none"}-${decision ?? "none"}`}
        withdrawal={selected}
        mode={decision}
        onClose={() => {
          setSelected(null);
          setDecision(null);
        }}
        onSave={saveDecision}
      />
    </>
  );
}
