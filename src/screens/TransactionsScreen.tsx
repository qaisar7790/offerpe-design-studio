import { PageHeader } from "@/components/admin/PageHeader";
import { TransactionPagination } from "@/components/admin/TransactionPagination";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ledgerEntries, offlineTransactions, onlineTransactions } from "@/data/mockData";
import { downloadCsv, inr, tabTriggerClass } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";
import { Conversions } from "@/screens/OnlineConversionsScreen";
import type { Merchant, Offer, Status, TransactionStatus } from "@/types/admin";
import { ArrowDown, ArrowUp, ChevronDown, Download, Filter, RotateCcw, Search } from "lucide-react";
import { useState } from "react";

export function TransactionBadge({ status }: { status: TransactionStatus }) {
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", status === "Approved" ? "status-approved" : status === "Rejected" ? "status-rejected" : "status-pending")}>{status}</span>;
}

export function Transactions() {
  const [tab, setTab] = useState<"online" | "offline" | "ledger">("online");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  const search = query.toLowerCase();
  const online = onlineTransactions.filter((row) => (!search || Object.values(row).join(" ").toLowerCase().includes(search)) && (status === "all" || row.status === status));
  const offline = offlineTransactions.filter((row) => (!search || Object.values(row).join(" ").toLowerCase().includes(search)) && (status === "all" || row.status === status));
  const ledger = ledgerEntries.filter((row) => !search || Object.values(row).join(" ").toLowerCase().includes(search)).sort((a, b) => sortDesc ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));
  const reset = () => { setQuery(""); setStatus("all"); setFrom(""); setTo(""); };
  const filterBar = <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
    <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tab === "ledger" ? "Search type, user ID, merchant, or offer…" : "Search transaction, merchant, user ID, or click…"} /></div>
    {tab !== "ledger" && <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Status: {status === "all" ? "All" : status}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-48 border-border bg-card"><DropdownMenuItem onSelect={() => setStatus("all")}>Status: All</DropdownMenuItem>{["Pending", "Pending Bill", "Approved", "Rejected"].map((item) => <DropdownMenuItem key={item} onSelect={() => setStatus(item)}>Status: {item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
    <Input aria-label="From date" title="From date" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="w-full shrink-0 lg:w-38" />
    <Input aria-label="To date" title="To date" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="w-full shrink-0 lg:w-38" />
    {(query || status !== "all" || from || to) && <Button variant="ghost" size="sm" onClick={reset} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    <Button variant="outline" size="sm" className="shrink-0" onClick={() => downloadCsv(tab === "online" ? online : tab === "offline" ? offline : ledger, `offerpe-transactions-${tab}.csv`)}><Download className="mr-1 h-3.5 w-3.5" />Export CSV</Button>
  </div>;
  return <><PageHeader title="Transactions" description="Review online conversions, in-store redemptions, and the unified customer transaction ledger." />
    <Tabs value={tab} onValueChange={(value) => { setTab(value as "online" | "offline" | "ledger"); reset(); }}>
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="online" className={tabTriggerClass}>Online Conversions</TabsTrigger><TabsTrigger value="offline" className={tabTriggerClass}>Offline Conversions</TabsTrigger><TabsTrigger value="ledger" className={tabTriggerClass}>Ledger</TabsTrigger></TabsList>
      {filterBar}
      <TabsContent value="online" className="mt-0"><div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-280 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Status", "User ID", "Order Value", "Commission (Reported / Calculated)", "Rejection Reason", "Click", "Created", "Updated", "Resolve"].map((label) => <th key={label} className="sticky top-0 border-b border-border bg-muted/90 py-2 backdrop-blur">{label}</th>)}</tr></thead><tbody>{online.map((row) => <tr key={row.id} className="border-t border-border hover:bg-muted/50"><td><TransactionBadge status={row.status} /></td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td className="font-semibold">{inr(row.orderValue)}</td><td><span className="font-medium">{inr(row.reported)}</span><span className="mx-1.5 text-muted-foreground">/</span><span className="font-semibold text-primary">{inr(row.calculated)}</span></td><td className="max-w-56 truncate text-muted-foreground" title={row.rejection}>{row.rejection}</td><td className="font-mono text-xs">{row.click}</td><td className="whitespace-nowrap text-xs text-muted-foreground">{row.created}</td><td className="whitespace-nowrap text-xs text-muted-foreground">{row.updated}</td><td><Button size="sm" variant="outline" className="h-7 px-2.5 text-xs">Resolve</Button></td></tr>)}</tbody></table></div></div><TransactionPagination count={online.length} /></TabsContent>
      <TabsContent value="offline" className="mt-0"><div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-300 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Status", "User ID", "Bill Amount", "Discount", "Final Payable", "Commission", "Confirmed By", "Merchant", "Occurred"].map((label) => <th key={label} className="sticky top-0 border-b border-border bg-muted/90 py-2 backdrop-blur">{label}</th>)}</tr></thead><tbody>{offline.map((row) => <tr key={row.id} className="border-t border-border hover:bg-muted/50"><td><TransactionBadge status={row.status} /></td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td className="font-semibold">{row.billAmount === null ? "—" : inr(row.billAmount)}</td><td>{row.discount === null ? "—" : inr(row.discount)}</td><td className="font-semibold">{row.payable === null ? "—" : inr(row.payable)}</td><td>{row.commission === null ? "—" : inr(row.commission)}</td><td>{row.confirmedBy}</td><td className="font-semibold">{row.merchant}</td><td className="whitespace-nowrap text-xs">{row.occurred}</td></tr>)}</tbody></table></div></div><TransactionPagination count={offline.length} /></TabsContent>
      <TabsContent value="ledger" className="mt-0"><div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-260 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th>Type</th><th><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortDesc(!sortDesc)}>Amount {sortDesc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}</Button></th><th>User ID</th><th>Merchant</th><th>Offer</th><th>Pending / Resolution Chain</th><th>Occurred</th></tr></thead><tbody>{ledger.map((row) => <tr key={row.id} className={cn("border-t border-border hover:bg-muted/50", row.type === "ONLINE_PENDING" && "bg-accent/40")}><td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", row.type === "ONLINE_PENDING" ? "status-pending" : "bg-info-soft text-info")}>{row.type}</span></td><td className="font-semibold">{inr(row.amount)}</td><td className="font-mono text-xs text-muted-foreground">{row.userId}</td><td className="font-semibold">{row.merchant}</td><td>{row.offer}</td><td className={cn(row.type === "ONLINE_PENDING" && "font-medium text-primary")}>{row.resolution}</td><td className="whitespace-nowrap text-xs font-medium">{row.occurred}</td></tr>)}</tbody></table></div></div><TransactionPagination count={ledger.length} /></TabsContent>
    </Tabs>
  </>;
}
