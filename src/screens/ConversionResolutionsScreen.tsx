import { CopyButton } from "@/components/admin/CopyButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { TransactionPagination } from "@/components/admin/TransactionPagination";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { resolutionQueueSeeds } from "@/data/mockData";
import { inr, tabTriggerClass } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";
import type { RejectionReason, ResolutionOutcome, ResolutionQueueItem } from "@/types/admin";
import { format } from "date-fns";
import { Check, ChevronDown, Download, FileSpreadsheet, Filter, RotateCcw, Search, ShieldCheck, Store, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function ResolutionOutcomeBadge({ outcome }: { outcome: ResolutionOutcome | null }) {
  if (!outcome) return <span className="inline-flex rounded-full border border-dashed border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">Unmapped</span>;
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", outcome === "APPROVED" ? "status-approved" : outcome === "REJECTED" ? "status-rejected" : "status-pending")}>{outcome}</span>;
}

export function ResolveQueueDialog({ item, mode, reasons, onClose, onSave }: { item: ResolutionQueueItem | null; mode: "approve" | "reject" | null; reasons: RejectionReason[]; onClose: () => void; onSave: (item: ResolutionQueueItem, decision: "approve" | "reject", outcome: ResolutionOutcome | null, reason: string, notes: string, override: string) => void }) {
  const [outcome, setOutcome] = useState<ResolutionOutcome>(item?.mappedOutcome && item.mappedOutcome !== "PENDING" ? item.mappedOutcome : "APPROVED");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [override, setOverride] = useState("");
  if (!item || !mode) return null;
  const approving = mode === "approve";
  const needsReason = approving ? outcome === "REJECTED" : true;
  const activeReasons = reasons.filter((entry) => entry.active);
  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent className="max-w-lg bg-card"><DialogHeader><DialogTitle className="font-heading text-xl">{approving ? "Approve resolution report" : "Reject resolution report"}</DialogTitle><DialogDescription>{approving ? `Applies the chosen outcome to conversion ${item.orderId}.` : `Dismisses ${item.id} without touching the underlying conversion.`}</DialogDescription></DialogHeader>
    <div className="rounded-lg border border-border bg-muted/60 p-3 text-sm"><div className="flex justify-between gap-4"><span className="text-muted-foreground">Order ID</span><span className="font-mono font-semibold">{item.orderId}</span></div><div className="mt-2 flex justify-between gap-4"><span className="text-muted-foreground">Reported status</span><span className="font-mono">{item.reportedStatus}</span></div><div className="mt-2 flex justify-between gap-4"><span className="text-muted-foreground">Mapped outcome</span><ResolutionOutcomeBadge outcome={item.mappedOutcome} /></div></div>
    <div className="space-y-4">
      {approving && <label className="block space-y-1.5 text-sm font-medium">Outcome to apply <span className="text-destructive">*</span><Select value={outcome} onValueChange={(value) => setOutcome(value as ResolutionOutcome)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="APPROVED">Approved</SelectItem><SelectItem value="REJECTED">Rejected</SelectItem></SelectContent></Select>{(!item.mappedOutcome || item.mappedOutcome === "PENDING") && <span className="block text-xs text-muted-foreground">This report is unmapped, so an outcome has to be chosen manually.</span>}</label>}
      {approving && outcome === "APPROVED" && <label className="block space-y-1.5 text-sm font-medium">Override commission amount <span className="font-normal text-muted-foreground">(optional)</span><Input inputMode="numeric" value={override} onChange={(event) => setOverride(event.target.value.replace(/[^\d.]/g, ""))} placeholder={String(item.reportedCommission)} /></label>}
      {needsReason && <label className="block space-y-1.5 text-sm font-medium">Rejection reason <span className="text-destructive">*</span><Select value={reason} onValueChange={setReason}><SelectTrigger><SelectValue placeholder="Select an active rejection reason" /></SelectTrigger><SelectContent>{activeReasons.map((entry) => <SelectItem key={entry.id} value={entry.reason}>{entry.reason}</SelectItem>)}</SelectContent></Select></label>}
      <label className="block space-y-1.5 text-sm font-medium">Admin notes <span className="font-normal text-muted-foreground">(optional)</span><Textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Context for the audit trail…" /></label>
    </div>
    <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button variant={approving ? "default" : "destructive"} disabled={needsReason && !reason} onClick={() => onSave(item, mode, approving ? outcome : null, reason, notes.trim(), override.trim())}>{approving ? <Check /> : <X />}{approving ? "Apply outcome" : "Dismiss report"}</Button></DialogFooter>
  </DialogContent></Dialog>;
}

export function ConversionResolutions({ reasons }: { reasons: RejectionReason[] }) {
  const [rows, setRows] = useState<ResolutionQueueItem[]>(resolutionQueueSeeds);
  const [tab, setTab] = useState<"pending" | "reviewed">("pending");
  const [query, setQuery] = useState("");
  const [merchant, setMerchant] = useState("all");
  const [mapped, setMapped] = useState("all");
  const [reviewStatus, setReviewStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fileName, setFileName] = useState("");
  const [selected, setSelected] = useState<ResolutionQueueItem | null>(null);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const merchantOptions = Array.from(new Set(resolutionQueueSeeds.map((row) => row.merchant))).sort();
  const search = query.toLowerCase();
  const matches = (row: ResolutionQueueItem) => (!search || `${row.id} ${row.orderId} ${row.userId} ${row.merchant} ${row.reportedStatus}`.toLowerCase().includes(search))
    && (merchant === "all" || row.merchant === merchant)
    && (mapped === "all" || (mapped === "unmapped" ? !row.mappedOutcome : row.mappedOutcome === mapped))
    && (!from || new Date(row.received.replace(",", "")).getTime() >= new Date(from).getTime())
    && (!to || new Date(row.received.replace(",", "")).getTime() <= new Date(to).getTime() + 86_400_000);
  const pending = rows.filter((row) => row.review === "Pending").filter(matches);
  const reviewed = rows.filter((row) => row.review !== "Pending").filter(matches).filter((row) => reviewStatus === "all" || row.review === reviewStatus);
  const hasFilters = Boolean(query || merchant !== "all" || mapped !== "all" || from || to || (tab === "reviewed" && reviewStatus !== "all"));
  const reset = () => { setQuery(""); setMerchant("all"); setMapped("all"); setReviewStatus("all"); setFrom(""); setTo(""); };
  const exportRows = (list: ResolutionQueueItem[], name: string) => {
    const headings = ["Queue ID", "Order ID", "Merchant", "User ID", "Reported Status", "Mapped Outcome", "Order Value", "Reported Commission", "Received", "Source", "Review", "Applied Outcome", "Reason", "Admin Notes", "Reviewed On", "Reviewed By"];
    const values = list.map((row) => [row.id, row.orderId, row.merchant, row.userId, row.reportedStatus, row.mappedOutcome ?? "Unmapped", row.orderValue, row.reportedCommission, row.received, row.source, row.review, row.appliedOutcome ?? "—", row.reason, row.notes, row.reviewedOn, row.reviewedBy]);
    const csv = [headings, ...values].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url);
    toast.success("Resolutions exported", { description: `${list.length} filtered records downloaded as CSV.` });
  };
  const processCsv = () => { if (!fileName) return; toast.success("CSV processed", { description: `${fileName} was validated and queued. Each row is processed independently — one bad row doesn't block the rest.` }); setFileName(""); if (fileRef.current) fileRef.current.value = ""; };
  const saveDecision = (item: ResolutionQueueItem, mode: "approve" | "reject", outcome: ResolutionOutcome | null, reason: string, notes: string, override: string) => {
    setRows((current) => current.map((row) => row.id === item.id ? { ...row, review: mode === "approve" ? "Approved" : "Rejected", appliedOutcome: outcome, reason, notes: notes || (override ? `Commission overridden to ${inr(Number(override))}.` : ""), reviewedOn: format(new Date(), "dd MMM yyyy, h:mm a"), reviewedBy: "Qaisar Farooq" } : row));
    toast.success(mode === "approve" ? "Resolution applied" : "Report dismissed", { description: mode === "approve" ? `${item.orderId} was resolved as ${outcome}.` : `${item.id} was dismissed without touching the conversion.` });
    setSelected(null); setDecision(null);
  };
  const filterBar = <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
    <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search resolutions" className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search queue ID, order ID, user ID, or merchant…" /></div>
    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Store className="mr-2 h-4 w-4 text-muted-foreground" />Merchant: {merchant === "all" ? "All" : merchant}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56 border-border bg-card"><DropdownMenuItem onSelect={() => setMerchant("all")}>Merchant: All</DropdownMenuItem>{merchantOptions.map((item) => <DropdownMenuItem key={item} onSelect={() => setMerchant(item)}>{item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Mapped: {mapped === "all" ? "All" : mapped === "unmapped" ? "Unmapped" : mapped}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52 border-border bg-card">{[{ value: "all", label: "All" }, { value: "APPROVED", label: "Approved" }, { value: "REJECTED", label: "Rejected" }, { value: "PENDING", label: "Pending" }, { value: "unmapped", label: "Unmapped" }].map((option) => <DropdownMenuItem key={option.value} onSelect={() => setMapped(option.value)}>Mapped: {option.label}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
    {tab === "reviewed" && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />Review: {reviewStatus === "all" ? "All" : reviewStatus}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48 border-border bg-card">{["all", "Approved", "Rejected"].map((item) => <DropdownMenuItem key={item} onSelect={() => setReviewStatus(item)}>Review: {item === "all" ? "All" : item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
    <Input aria-label="From date" title="From date" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="w-full shrink-0 lg:w-38" />
    <Input aria-label="To date" title="To date" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="w-full shrink-0 lg:w-38" />
    {hasFilters && <Button variant="ghost" size="sm" onClick={reset} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    <Button variant="outline" className="shrink-0" onClick={() => exportRows(tab === "pending" ? pending : reviewed, `offerpe-conversion-resolutions-${tab}.csv`)}><Download />Export CSV</Button>
  </div>;
  const emptyState = (label: string) => <div className="rounded-lg border border-border bg-card px-6 py-14 text-center shadow-card"><RotateCcw className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">{label}</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>;
  return <><PageHeader title="Conversion Resolutions" description="Resolution-type postbacks queued for review. Approving applies the mapped (or manually chosen) outcome to the conversion — the webhook itself never auto-applies anything, regardless of what status the network reports. Rejecting a report dismisses it without touching the underlying conversion." />
    <section className="mb-5 rounded-lg border border-border bg-card p-4 shadow-card"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div className="min-w-0"><div className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-primary" /><h2 className="font-heading text-sm font-bold">Bulk process via CSV</h2></div><p className="mt-1 max-w-4xl text-xs leading-5 text-muted-foreground">Columns: <span className="font-mono">queue_id</span>, <span className="font-mono">decision</span> (APPROVE or REJECT), <span className="font-mono">manual_outcome</span> (APPROVED or REJECTED — required when the row is unmapped or mapped to PENDING), <span className="font-mono">override_amount</span> (optional, APPROVE only), <span className="font-mono">rejection_reason_id</span> (must be an active Rejection Reasons row whenever the outcome being applied is REJECTED), <span className="font-mono">admin_notes</span> (optional). Each row is processed independently — one bad row doesn't block the rest.</p></div><div className="flex shrink-0 flex-wrap items-center gap-2"><input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} /><Button variant="outline" onClick={() => fileRef.current?.click()}><FileSpreadsheet />{fileName || "Choose CSV"}</Button><Button disabled={!fileName} onClick={processCsv}><UploadCloud />Upload &amp; process</Button></div></div></section>
    <Tabs value={tab} onValueChange={(value) => setTab(value as "pending" | "reviewed")}>
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="pending" className={tabTriggerClass}>Pending Review ({rows.filter((row) => row.review === "Pending").length})</TabsTrigger><TabsTrigger value="reviewed" className={tabTriggerClass}>Reviewed ({rows.filter((row) => row.review !== "Pending").length})</TabsTrigger></TabsList>
      {filterBar}
      <TabsContent value="pending" className="mt-0">
        {!pending.length ? emptyState("Nothing waiting for review")
          : <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-330 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 top-0 z-30 bg-muted/95 shadow-sticky-left">Queue ID</th><th>Order ID</th><th>Merchant</th><th>User ID</th><th>Reported Status</th><th>Mapped Outcome</th><th>Order Value</th><th>Reported Commission</th><th>Source</th><th>Received</th><th className="sticky right-0 top-0 z-30 bg-muted/95 text-right shadow-sticky-right">Actions</th></tr></thead><tbody>{pending.map((row) => <tr key={row.id} className="group border-t border-border hover:bg-muted/50">
            <td className="sticky left-0 z-20 bg-card font-mono text-xs font-semibold shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1">{row.id}<CopyButton value={row.id} /></span></td>
            <td className="font-mono text-xs"><span className="flex items-center gap-1">{row.orderId}<CopyButton value={row.orderId} /></span></td>
            <td className="font-semibold">{row.merchant}</td>
            <td className="font-mono text-xs text-muted-foreground">{row.userId}</td>
            <td className="font-mono text-xs">{row.reportedStatus}</td>
            <td><ResolutionOutcomeBadge outcome={row.mappedOutcome} /></td>
            <td className="whitespace-nowrap font-semibold">{inr(row.orderValue)}</td>
            <td className="whitespace-nowrap font-semibold text-primary">{inr(row.reportedCommission)}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{row.source}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{row.received}</td>
            <td className="sticky right-0 z-20 bg-card text-right shadow-sticky-right group-hover:bg-muted"><span className="inline-flex gap-1"><Button size="sm" className="h-7 px-2.5 text-xs" onClick={() => { setSelected(row); setDecision("approve"); }}><Check />Approve</Button><Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs" onClick={() => { setSelected(row); setDecision("reject"); }}><X />Reject</Button></span></td>
          </tr>)}</tbody></table></div></div>}
        <TransactionPagination count={pending.length} />
      </TabsContent>
      <TabsContent value="reviewed" className="mt-0">
        {!reviewed.length ? emptyState("Nothing reviewed yet")
          : <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-330 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 top-0 z-30 bg-muted/95 shadow-sticky-left">Queue ID</th><th>Order ID</th><th>Merchant</th><th>User ID</th><th>Reported Status</th><th>Review</th><th>Applied Outcome</th><th>Reason</th><th>Admin Notes</th><th>Reviewed On</th><th>Reviewed By</th></tr></thead><tbody>{reviewed.map((row) => <tr key={row.id} className="group border-t border-border hover:bg-muted/50">
            <td className="sticky left-0 z-20 bg-card font-mono text-xs font-semibold shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1">{row.id}<CopyButton value={row.id} /></span></td>
            <td className="font-mono text-xs">{row.orderId}</td>
            <td className="font-semibold">{row.merchant}</td>
            <td className="font-mono text-xs text-muted-foreground">{row.userId}</td>
            <td className="font-mono text-xs">{row.reportedStatus}</td>
            <td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", row.review === "Approved" ? "status-approved" : "status-rejected")}>{row.review}</span></td>
            <td><ResolutionOutcomeBadge outcome={row.appliedOutcome} /></td>
            <td className="max-w-56 truncate text-muted-foreground" title={row.reason}>{row.reason || "—"}</td>
            <td className="max-w-56 truncate text-muted-foreground" title={row.notes}>{row.notes || "—"}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{row.reviewedOn}</td>
            <td className="whitespace-nowrap text-xs">{row.reviewedBy}</td>
          </tr>)}</tbody></table></div></div>}
        <TransactionPagination count={reviewed.length} />
      </TabsContent>
    </Tabs>
    <ResolveQueueDialog key={`${selected?.id ?? "none"}-${decision ?? "none"}`} item={selected} mode={decision} reasons={reasons} onClose={() => { setSelected(null); setDecision(null); }} onSave={saveDecision} />
  </>;
}
