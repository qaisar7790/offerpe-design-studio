import { TransactionPagination } from "@/components/admin/TransactionPagination";
import { clickRecords } from "@/data/mockData";
import { inr } from "@/lib/admin-utils";
import type { ClickRecord } from "@/types/admin";
import { Filter } from "lucide-react";
import { useState } from "react";

export function Clicks() {
  const [userId, setUserId] = useState("");
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const merchantOptions = Array.from(new Set(clickRecords.map((row) => row.merchant))).sort();
  const rows = clickRecords
    .filter((row) => (!userId || row.userId.toLowerCase().includes(userId.toLowerCase())) && (!selectedMerchants.length || selectedMerchants.includes(row.merchant)) && (!from || row.date >= from) && (!to || row.date <= to))
    .sort((a, b) => sortDesc ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  const hasFilters = Boolean(userId || selectedMerchants.length || from || to);
  const reset = () => { setUserId(""); setSelectedMerchants([]); setFrom(""); setTo(""); };
  const toggleMerchant = (merchant: string) => setSelectedMerchants((current) => current.includes(merchant) ? current.filter((item) => item !== merchant) : [...current, merchant]);
  const rate = (type: ClickRecord["discountType"] | ClickRecord["commissionType"], value: number | null) => value === null || !type ? "Not set" : type === "Percentage" ? `${value}%` : inr(value);
  const exportRows = () => {
    const headings = ["Click Token", "Occurred", "User ID", "Merchant", "Offer", "Cashback", "Commission", "Minimum Bill", "Cashback Cap", "Commission Cap"];
    const values = rows.map((row) => [row.token, row.occurred, row.userId, row.merchant, row.offer, rate(row.discountType, row.discountValue), rate(row.commissionType, row.commissionValue), row.minBill === null ? "" : row.minBill, row.discountCap === null ? "" : row.discountCap, row.commissionCap === null ? "" : row.commissionCap]);
    const csv = [headings, ...values].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "offerpe-clicks.csv"; anchor.click(); URL.revokeObjectURL(url);
    toast.success("Clicks exported", { description: `${rows.length} filtered records downloaded as CSV.` });
  };
  return <><PageHeader title="Clicks" description="Track customer click-through activity and the exact offer pricing captured at click time." />
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
      <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Filter by User ID" className="w-full pl-9" value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="Filter by User ID…" /></div>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Store className="mr-2 h-4 w-4 text-muted-foreground" />Merchants{selectedMerchants.length ? ` (${selectedMerchants.length})` : ": All"}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-64 border-border bg-card"><DropdownMenuCheckboxItem checked={!selectedMerchants.length} onCheckedChange={() => setSelectedMerchants([])}>All merchants</DropdownMenuCheckboxItem><DropdownMenuSeparator />{merchantOptions.map((merchant) => <DropdownMenuCheckboxItem key={merchant} checked={selectedMerchants.includes(merchant)} onSelect={(event) => event.preventDefault()} onCheckedChange={() => toggleMerchant(merchant)}>{merchant}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>
      <Input aria-label="From date" title="From date" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="w-full shrink-0 lg:w-38" />
      <Input aria-label="To date" title="To date" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="w-full shrink-0 lg:w-38" />
      {hasFilters && <Button variant="ghost" size="sm" onClick={reset} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
      <Button variant="outline" size="sm" className="shrink-0" onClick={exportRows}><Download className="mr-1 h-3.5 w-3.5" />Export CSV</Button>
    </div>
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-360 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 top-0 z-30 bg-muted/95 shadow-sticky-left">Click Token</th><th className="sticky top-0 bg-muted/95"><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortDesc(!sortDesc)}>Occurred {sortDesc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}</Button></th><th className="sticky top-0 bg-muted/95">User ID</th><th className="sticky top-0 bg-muted/95">Merchant</th><th className="sticky top-0 bg-muted/95">Offer</th><th className="sticky top-0 bg-muted/95">Pricing Snapshot</th></tr></thead><tbody>{rows.map((row) => <tr key={row.token} className="group border-t border-border hover:bg-muted/50"><td className="sticky left-0 z-20 bg-card font-mono text-xs font-semibold shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1.5">{row.token}<CopyButton value={row.token} /></span></td><td className="whitespace-nowrap text-xs font-medium">{row.occurred}</td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td className="font-semibold">{row.merchant}</td><td>{row.offer}</td><td><div className="grid min-w-150 grid-cols-5 gap-2 py-1"><div><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Cashback</span><strong className="text-primary">{rate(row.discountType, row.discountValue)}</strong></div><div><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Commission</span><strong>{rate(row.commissionType, row.commissionValue)}</strong></div><div><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Min. bill</span><strong>{row.minBill === null ? "Not set" : inr(row.minBill)}</strong></div><div><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Cashback cap</span><strong>{row.discountCap === null ? "No cap" : inr(row.discountCap)}</strong></div><div><span className="block text-[10px] font-semibold uppercase text-muted-foreground">Commission cap</span><strong>{row.commissionCap === null ? "No cap" : inr(row.commissionCap)}</strong></div></div></td></tr>)}</tbody></table>{!rows.length && <div className="px-6 py-14 text-center"><MousePointerClick className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No clicks found</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>}</div></div>
    <TransactionPagination count={rows.length} />
  </>;
}
