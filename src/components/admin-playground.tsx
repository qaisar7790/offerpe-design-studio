"use client";

import { useMemo, useRef, useState } from "react";
import {
  AreaChart,
  BadgeIndianRupee,
  BarChart3,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Filter,
  LayoutDashboard,
  Megaphone,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  Tag,
  Trash2,
  UploadCloud,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type View = "dashboard" | "merchants" | "conversions";
type Status = "Active" | "Inactive" | "Pending" | "Approved" | "Rejected" | "Requested" | "Paid";

const groups = [
  { label: "Catalog", icon: ShoppingBag, items: [{ label: "Merchants", icon: Store, view: "merchants" as View }, { label: "Categories", icon: Tag }, { label: "Cities", icon: Building2 }] },
  { label: "Operations", icon: Settings2, items: [{ label: "Online Conversions", icon: CircleDollarSign, view: "conversions" as View }, { label: "Users", icon: Users }] },
  { label: "Financial", icon: WalletCards, items: [{ label: "Withdrawals", icon: BadgeIndianRupee }, { label: "Missing Claims", icon: FileSpreadsheet }] },
  { label: "Communication", icon: Megaphone, items: [{ label: "Notifications", icon: Megaphone }, { label: "Promo Banners", icon: AreaChart }] },
  { label: "System", icon: SlidersHorizontal, items: [{ label: "Admin Roles", icon: ShieldCheck }, { label: "Settings", icon: Settings2 }] },
];

const merchants = [
  ["Theobroma", "Offline", "Premium Bakeries", 0, "Active"],
  ["Absolute Barbecues", "Offline", "Restaurants", 0, "Active"],
  ["Croma", "Online", "Electronics", 0, "Active"],
  ["Withdrawal Test Merchant", "Online", "Testing", 0, "Inactive"],
  ["Nykaa", "Online", "Beauty", 1, "Active"],
  ["MakeMyTrip", "Online", "Travel", 1, "Active"],
  ["Myntra", "Online", "Fashion", 1, "Active"],
  ["Big Bazaar", "Offline", "Department Stores", 2, "Inactive"],
  ["Hummel", "Online", "Fashion", 2, "Active"],
  ["Nippon Paint FX10", "Online", "Home & Living", 3, "Active"],
] as const;

type Conversion = {
  cashback: string; click: string | null; order: string; merchant: string; status: Status;
  value: string; reported: string; calculated: string; orderDate: string; created: string;
  resolved: string | null; rejection: string | null; notes: string; withdrawal: string | null; invoice: string | null;
};

const conversionSeeds: Conversion[] = [
  { cashback: "CB-84921", click: "clk_72a9f4", order: "ORD-72194", merchant: "Myntra", status: "Pending", value: "₹3,499.00", reported: "₹279.92", calculated: "₹262.43", orderDate: "20 Sep 2026, 14:32", created: "20 Sep 2026, 14:42", resolved: null, rejection: null, notes: "Awaiting merchant validation", withdrawal: null, invoice: null },
  { cashback: "CB-84920", click: "clk_16bd03", order: "ORD-88217", merchant: "Nykaa", status: "Approved", value: "₹1,890.00", reported: "₹151.20", calculated: "₹151.20", orderDate: "20 Sep 2026, 10:57", created: "20 Sep 2026, 11:18", resolved: "20 Sep 2026, 17:05", rejection: null, notes: "Matched automatically", withdrawal: null, invoice: "INV-2026/09-0012" },
  { cashback: "CB-84918", click: "clk_b872ad", order: "ORD-59103", merchant: "Croma", status: "Rejected", value: "₹42,990.00", reported: "₹859.80", calculated: "₹0.00", orderDate: "19 Sep 2026, 17:44", created: "19 Sep 2026, 18:06", resolved: "20 Sep 2026, 09:11", rejection: "Cancelled by user", notes: "Cancellation confirmed by merchant", withdrawal: null, invoice: null },
  { cashback: "CB-84912", click: "clk_0cd721", order: "ORD-33819", merchant: "MakeMyTrip", status: "Requested", value: "₹16,420.00", reported: "₹492.60", calculated: "₹492.60", orderDate: "19 Sep 2026, 09:38", created: "19 Sep 2026, 09:51", resolved: "19 Sep 2026, 16:26", rejection: null, notes: "Included in current withdrawal batch", withdrawal: "WD-009821", invoice: "INV-2026/09-0009" },
  { cashback: "CB-84901", click: null, order: "ORD-44531", merchant: "Theobroma", status: "Paid", value: "₹860.00", reported: "₹68.80", calculated: "₹64.50", orderDate: "18 Sep 2026, 15:48", created: "18 Sep 2026, 16:20", resolved: "18 Sep 2026, 19:02", rejection: null, notes: "Settled via September payout", withdrawal: "WD-009806", invoice: "INV-2026/09-0004" },
  { cashback: "CB-84889", click: "clk_081af3", order: "ORD-10773", merchant: "Hummel", status: "Approved", value: "₹5,299.00", reported: "₹423.92", calculated: "₹397.43", orderDate: "18 Sep 2026, 09:57", created: "18 Sep 2026, 10:12", resolved: "18 Sep 2026, 14:38", rejection: null, notes: "Manual validation completed", withdrawal: null, invoice: "INV-2026/09-0001" },
  { cashback: "CB-84876", click: "clk_a841dc", order: "ORD-24018", merchant: "Big Bazaar", status: "Rejected", value: "₹2,140.00", reported: "₹85.60", calculated: "₹0.00", orderDate: "17 Sep 2026, 17:22", created: "17 Sep 2026, 17:44", resolved: "18 Sep 2026, 11:09", rejection: "Duplicate transaction", notes: "Duplicate of CB-84874", withdrawal: null, invoice: null },
  { cashback: "CB-84865", click: "clk_11f6b2", order: "ORD-90417", merchant: "Nippon Paint FX10", status: "Pending", value: "₹8,750.00", reported: "₹350.00", calculated: "₹350.00", orderDate: "17 Sep 2026, 12:03", created: "17 Sep 2026, 12:29", resolved: null, rejection: null, notes: "Invoice evidence requested", withdrawal: null, invoice: null },
  { cashback: "CB-84852", click: "clk_c38b92", order: "ORD-62281", merchant: "Absolute Barbecues", status: "Approved", value: "₹4,260.00", reported: "₹340.80", calculated: "₹319.50", orderDate: "16 Sep 2026, 20:11", created: "16 Sep 2026, 20:28", resolved: "17 Sep 2026, 08:40", rejection: null, notes: "Validated against offline report", withdrawal: null, invoice: "INV-2026/09-0098" },
  { cashback: "CB-84841", click: null, order: "ORD-56192", merchant: "Nykaa", status: "Paid", value: "₹2,599.00", reported: "₹207.92", calculated: "₹194.93", orderDate: "16 Sep 2026, 15:14", created: "16 Sep 2026, 15:39", resolved: "16 Sep 2026, 19:21", rejection: null, notes: "Settled successfully", withdrawal: "WD-009794", invoice: "INV-2026/09-0091" },
];

const conversions: Conversion[] = Array.from({ length: 148 }, (_, index) => {
  const seed = conversionSeeds[index % conversionSeeds.length];
  const cycle = Math.floor(index / conversionSeeds.length);
  return cycle === 0 ? seed : {
    ...seed,
    cashback: `CB-${84840 - index}`,
    click: seed.click ? `${seed.click}_${cycle}` : null,
    order: `ORD-${String(56192 - index * 37).padStart(5, "0")}`,
    withdrawal: seed.withdrawal ? `WD-${String(9794 - index).padStart(6, "0")}` : null,
    invoice: seed.invoice ? `INV-2026/09-${String(91 - index).padStart(4, "0")}` : null,
  };
});

const chartData = {
  users: [{ name: "Today", value: 7 }, { name: "Yesterday", value: 12 }, { name: "7d", value: 49 }, { name: "30d", value: 184 }],
  clicks: [{ name: "Today", value: 42 }, { name: "Yesterday", value: 57 }, { name: "7d", value: 319 }, { name: "30d", value: 1240 }],
  transactions: [{ name: "Today", value: 12 }, { name: "Yesterday", value: 18 }, { name: "7d", value: 94 }, { name: "30d", value: 382 }],
  withdrawals: [{ name: "Today", value: 4 }, { name: "Yesterday", value: 8 }, { name: "7d", value: 31 }, { name: "30d", value: 108 }],
  claims: [{ name: "Today", value: 2 }, { name: "Yesterday", value: 3 }, { name: "7d", value: 11 }, { name: "30d", value: 38 }],
};

function StatusBadge({ status }: { status: Status }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", `status-${status.toLowerCase()}`)}>{status}</span>;
}

function IconButton({ label, children, className, onClick }: { label: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <Button type="button" variant="ghost" size="icon" className={cn("h-8 w-8 text-muted-foreground", className)} onClick={onClick} title={label} aria-label={label}>{children}</Button>;
}

function Sidebar({ view, setView, open, setOpen }: { view: View; setView: (v: View) => void; open: boolean; setOpen: (v: boolean) => void }) {
  const [expanded, setExpanded] = useState(() => new Set(["Catalog", "Operations"]));
  const choose = (next: View) => { setView(next); setOpen(false); };
  return (
    <>
      {open && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-overlay md:hidden" onClick={() => setOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform md:static md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-18 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground">O</div>
          <div className="min-w-0"><div className="truncate font-heading text-[15px] font-bold text-sidebar-foreground">OfferPe Admin</div><div className="text-xs text-muted-foreground">Owner</div></div>
          <IconButton label="Close navigation" className="ml-auto md:hidden" onClick={() => setOpen(false)}><X /></IconButton>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <Button variant="ghost" className={cn("mb-3 h-10 w-full justify-start gap-3 px-3", view === "dashboard" && "bg-sidebar-accent text-sidebar-primary hover:bg-sidebar-accent")} onClick={() => choose("dashboard")}><LayoutDashboard />Dashboard</Button>
          <div className="space-y-1">
            {groups.map((group) => {
              const isOpen = expanded.has(group.label);
              return <div key={group.label}>
                <Button variant="ghost" className="h-9 w-full justify-start gap-2 px-3 text-[11px] font-bold uppercase text-muted-foreground hover:bg-sidebar-accent" onClick={() => setExpanded((current) => { const next = new Set(current); isOpen ? next.delete(group.label) : next.add(group.label); return next; })}>
                  <group.icon className="h-3.5 w-3.5" /><span className="flex-1 text-left">{group.label}</span><ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-90")} />
                </Button>
                {isOpen && <div className="ml-4 border-l border-sidebar-border pl-2">
                  {group.items.map((item) => <Button key={item.label} variant="ghost" disabled={!item.view} className={cn("my-0.5 h-9 w-full justify-start gap-2.5 px-3 text-[13px] text-sidebar-foreground disabled:opacity-55", item.view === view && "bg-sidebar-accent font-semibold text-sidebar-primary hover:bg-sidebar-accent")} onClick={() => item.view && choose(item.view)}><item.icon className="h-4 w-4" />{item.label}</Button>)}
                </div>}
              </div>;
            })}
          </div>
        </nav>
        <div className="border-t border-sidebar-border p-3"><Button variant="ghost" className="w-full justify-start text-muted-foreground"><ChevronLeft />Sign out</Button></div>
      </aside>
    </>
  );
}

function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return <header className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between"><div><h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>{description && <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>}</div>{actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}</header>;
}

function DonutCard({ title, total, data }: { title: string; total: number; data: { name: string; value: number; fill: string }[] }) {
  return <section className="rounded-lg border border-border bg-card p-5 shadow-card"><div className="flex items-start justify-between"><h2 className="font-heading text-sm font-semibold">{title}</h2><span className="font-heading text-2xl font-bold">{total}</span></div><div className="h-48"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={76} paddingAngle={2} stroke="var(--card)" strokeWidth={3}>{data.map((item) => <Cell key={item.name} fill={item.fill} />)}</Pie><Tooltip formatter={(value) => [value, "Stores"]} /></PieChart></ResponsiveContainer></div><div className="flex justify-center gap-5">{data.map((item) => <div key={item.name} className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2.5 w-2.5 rounded-full" style={{ background: item.fill }} />{item.name}</div>)}</div></section>;
}

function MetricCard({ title, total, data }: { title: string; total?: string; data: { name: string; value: number }[] }) {
  return <section className="rounded-lg border border-border bg-card p-5 shadow-card"><div className="mb-4 flex items-start justify-between"><h2 className="font-heading text-sm font-semibold">{title}</h2>{total && <span className="font-heading text-xl font-bold">{total}</span>}</div><div className="h-40"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 5, right: 0, left: -24, bottom: 0 }}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} /><Tooltip cursor={{ fill: "var(--muted)" }} /><Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></section>;
}

function Dashboard() {
  return <><PageHeader title="Dashboard" description="As of 21 Sep 2026, 11:25 IST · Refreshed hourly. A concise operational snapshot across the OfferPe platform." /><div className="mb-4 grid gap-4 lg:grid-cols-2"><DonutCard title="Stores — Status" total={38} data={[{ name: "Live", value: 33, fill: "var(--chart-1)" }, { name: "Inactive", value: 5, fill: "var(--chart-2)" }]} /><DonutCard title="Stores — Channel" total={38} data={[{ name: "Online", value: 31, fill: "var(--chart-1)" }, { name: "Offline", value: 7, fill: "var(--chart-3)" }]} /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><MetricCard title="Users Joined" total="2,486" data={chartData.users} /><MetricCard title="Clicks" data={chartData.clicks} /><MetricCard title="Transactions" data={chartData.transactions} /><MetricCard title="Withdrawal Requests" data={chartData.withdrawals} /><button onClick={() => undefined} className="rounded-lg border border-border bg-card p-5 text-left shadow-card transition-shadow hover:shadow-card-hover"><div className="font-heading text-sm font-semibold">Withdrawals — Currently Pending</div><div className="mt-7 font-heading text-4xl font-bold">14</div><div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">View pending <ChevronRight className="h-4 w-4" /></div></button><MetricCard title="Missing Claims" data={chartData.claims} /></div></>;
}

function DateFilter() {
  const [date, setDate] = useState<DateRange | undefined>({ from: new Date(2026, 8, 1), to: new Date(2026, 8, 21) });
  return <Popover><PopoverTrigger asChild><Button variant="outline" className="min-w-52 justify-start font-normal"><CalendarDays />{date?.from ? `${format(date.from, "dd MMM")} – ${date.to ? format(date.to, "dd MMM yyyy") : "…"}` : "Choose dates"}</Button></PopoverTrigger><PopoverContent className="pointer-events-auto w-auto p-0" align="end"><Calendar mode="range" selected={date} onSelect={setDate} numberOfMonths={1} /></PopoverContent></Popover>;
}

function FilterBar({ query, setQuery, statuses, setStatuses, showChannel = false }: { query: string; setQuery: (v: string) => void; statuses: Status[]; setStatuses: (v: Status[]) => void; showChannel?: boolean }) {
  const options: Status[] = showChannel ? ["Active", "Inactive"] : ["Pending", "Approved", "Rejected", "Requested", "Paid"];
  return <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:items-center"><div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder={showChannel ? "Search merchants or categories…" : "Search cashback, order, or merchant…"} /></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline"><Filter />Status{statuses.length > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{statuses.length}</span>}<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44">{options.map((status) => <DropdownMenuCheckboxItem key={status} checked={statuses.includes(status)} onCheckedChange={() => setStatuses(statuses.includes(status) ? statuses.filter((s) => s !== status) : [...statuses, status])}>{status}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>{showChannel ? <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Channel<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuCheckboxItem checked>Online</DropdownMenuCheckboxItem><DropdownMenuCheckboxItem>Offline</DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu> : <DateFilter />}{(query || statuses.length > 0) && <Button variant="ghost" onClick={() => { setQuery(""); setStatuses([]); }}>Clear</Button>}</div>;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return <IconButton label={copied ? "Copied" : `Copy ${value}`} onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1200); }}>{copied ? <Check /> : <Copy />}</IconButton>;
}

function MerchantModal({ merchant, open, onOpenChange }: { merchant: typeof merchants[number] | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle className="font-heading text-xl">Edit merchant</DialogTitle><DialogDescription>Update how this merchant appears across OfferPe.</DialogDescription></DialogHeader><div className="grid gap-4 py-2"><label className="space-y-1.5 text-sm font-medium">Merchant name<Input defaultValue={merchant?.[0]} /></label><label className="space-y-1.5 text-sm font-medium">Category<Input defaultValue={merchant?.[2]} /></label><div className="grid grid-cols-2 gap-3"><label className="space-y-1.5 text-sm font-medium">Channel<Input defaultValue={merchant?.[1]} /></label><label className="space-y-1.5 text-sm font-medium">Status<Input defaultValue={merchant?.[4]} /></label></div></div><DialogFooter><DialogClose asChild><Button variant="destructiveSoft">Cancel</Button></DialogClose><DialogClose asChild><Button>Save changes</Button></DialogClose></DialogFooter></DialogContent></Dialog>;
}

function Merchants() {
  const [query, setQuery] = useState(""); const [statuses, setStatuses] = useState<Status[]>([]); const [edit, setEdit] = useState<typeof merchants[number] | null>(null); const [sortAsc, setSortAsc] = useState(true);
  const rows = useMemo(() => merchants.filter((m) => (!query || `${m[0]} ${m[2]}`.toLowerCase().includes(query.toLowerCase())) && (!statuses.length || statuses.includes(m[4] as Status))).sort((a, b) => sortAsc ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0])), [query, statuses, sortAsc]);
  return <><PageHeader title="Merchants" description="Manage merchant availability, categorisation, and channel details." actions={<Button><Plus />Add new</Button>} /><FilterBar query={query} setQuery={setQuery} statuses={statuses} setStatuses={setStatuses} showChannel /><div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-205 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 z-10 bg-muted px-4 py-3"><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortAsc(!sortAsc)}>Name <ChevronDown className={cn("transition-transform", !sortAsc && "rotate-180")} /></Button></th><th>Channel</th><th>Category</th><th>Order</th><th>Status</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{rows.map((m) => <tr key={m[0]} className="group border-t border-border hover:bg-muted/50"><td className="sticky left-0 bg-card px-4 py-3 font-semibold group-hover:bg-muted">{m[0]}</td><td><span className="inline-flex items-center gap-1.5 font-medium"><span className={cn("h-2 w-2 rounded-full", m[1] === "Online" ? "bg-success" : "bg-info")} />{m[1]}</span></td><td>{m[2]}</td><td>{m[3]}</td><td><StatusBadge status={m[4] as Status} /></td><td className="pr-3 text-right"><IconButton label={`Edit ${m[0]}`} onClick={() => setEdit(m)}><Pencil /></IconButton><IconButton label={`Open ${m[0]}`}><ExternalLink /></IconButton></td></tr>)}</tbody></table></div></div><div className="mt-4 flex items-center justify-between text-sm text-muted-foreground"><span>Showing {rows.length} of {merchants.length} merchants</span><div className="flex gap-1"><Button variant="outline" size="icon" disabled><ChevronLeft /></Button><Button variant="outline" size="icon"><ChevronRight /></Button></div></div><MerchantModal merchant={edit} open={!!edit} onOpenChange={(v) => !v && setEdit(null)} /></>;
}

function ImportModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [file, setFile] = useState<File | null>(null); const inputRef = useRef<HTMLInputElement>(null);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-xl"><DialogHeader><DialogTitle className="font-heading text-xl">Import Offline Report</DialogTitle><DialogDescription>Upload a CSV to create and resolve offline conversions in one step.</DialogDescription></DialogHeader><div className="rounded-md bg-muted p-3 text-sm leading-6 text-muted-foreground"><span className="mr-2 inline-flex rounded bg-info-soft px-2 py-0.5 text-xs font-semibold text-info">Required columns</span><code>click_token, order_id, order_amount, reported_commission, status</code></div><button type="button" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0] ?? null); }} className="flex min-h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed border-strong bg-muted/40 px-6 text-center hover:border-primary hover:bg-accent"><UploadCloud className="mb-3 h-8 w-8 text-primary" /><span className="font-semibold text-primary">{file ? file.name : "Choose a file"}</span><span className="mt-1 text-sm text-muted-foreground">or drag and drop a CSV here</span><input ref={inputRef} className="hidden" type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></button><DialogFooter><DialogClose asChild><Button variant="destructiveSoft">Cancel</Button></DialogClose><Button disabled={!file} onClick={() => onOpenChange(false)}><UploadCloud />Import report</Button></DialogFooter></DialogContent></Dialog>;
}

function ConversionModal({ row, mode, onClose }: { row: Conversion | null; mode: "edit" | "delete" | null; onClose: () => void }) {
  return <Dialog open={!!row && !!mode} onOpenChange={(v) => !v && onClose()}><DialogContent><DialogHeader><DialogTitle className="font-heading text-xl">{mode === "delete" ? "Delete conversion" : "Edit conversion"}</DialogTitle><DialogDescription>{mode === "delete" ? "This record will be hidden everywhere and retained for audit." : `Update internal details for ${row?.cashback ?? "this conversion"}.`}</DialogDescription></DialogHeader>{mode === "delete" ? <label className="space-y-1.5 text-sm font-medium">Reason <Textarea placeholder="Add a reason for this deletion…" /></label> : <div className="grid gap-4"><label className="space-y-1.5 text-sm font-medium">Internal notes<Textarea placeholder="Add an internal note…" /></label><label className="space-y-1.5 text-sm font-medium">Invoice number<Input placeholder="e.g. INV-2026/09" /></label></div>}<DialogFooter><DialogClose asChild><Button variant="destructiveSoft">Cancel</Button></DialogClose><DialogClose asChild><Button variant={mode === "delete" ? "destructive" : "default"}>{mode === "delete" ? <><Trash2 />Delete conversion</> : "Save changes"}</Button></DialogClose></DialogFooter></DialogContent></Dialog>;
}

function Conversions() {
  const [query, setQuery] = useState(""); const [statuses, setStatuses] = useState<Status[]>([]); const [importOpen, setImportOpen] = useState(false); const [selected, setSelected] = useState<Conversion | null>(null); const [mode, setMode] = useState<"edit" | "delete" | null>(null); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  const filtered = conversions.filter((r) => (!query || Object.values(r).join(" ").toLowerCase().includes(query.toLowerCase())) && (!statuses.length || statuses.includes(r.status)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  const setSearch = (value: string) => { setQuery(value); setPage(1); };
  const setStatusFilter = (value: Status[]) => { setStatuses(value); setPage(1); };
  const act = (row: Conversion, next: "edit" | "delete") => { setSelected(row); setMode(next); };
  const pageItems = Array.from(new Set([1, 2, currentPage - 1, currentPage, currentPage + 1, pageCount - 1, pageCount])).filter((item) => item >= 1 && item <= pageCount).sort((a, b) => a - b);
  return <><PageHeader title="Online Conversions" description="Review conversion lifecycle, commission values, and settlement status." actions={<><Button variant="outline"><Download />Export CSV</Button><Button onClick={() => setImportOpen(true)}><UploadCloud />Import & Export</Button></>} /><FilterBar query={query} setQuery={setSearch} statuses={statuses} setStatuses={setStatusFilter} /><div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar max-w-full overflow-x-auto"><table className="w-max min-w-520 border-separate border-spacing-0 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Cashback ID", "Click ID", "Order ID", "Merchant", "Status", "Order Value", "Commission Reported", "Commission Calculated", "Order Date", "Date Created", "Date Approved/Rejected", "Rejection Reason", "Internal Notes", "Withdrawal ID", "Invoice Number"].map((label, index) => <th key={label} className={cn("sticky top-0 z-10 border-b border-border bg-muted/90 px-4 py-3 backdrop-blur", index === 0 && "left-0 z-30 shadow-sticky-left")}>{label}</th>)}<th className="sticky right-0 top-0 z-30 border-b border-border bg-muted/90 pr-4 text-right backdrop-blur shadow-sticky-right">Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.cashback} className="group hover:bg-muted/50"><td className="sticky left-0 z-20 border-b border-border bg-card px-4 py-3 shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1 font-mono text-xs font-semibold">{r.cashback}<CopyButton value={r.cashback} /></span></td><td className="border-b border-border font-mono text-xs">{r.click ?? "—"}</td><td className="border-b border-border font-mono text-xs">{r.order}</td><td className="border-b border-border"><span className="inline-flex items-center gap-2 font-medium"><span className="flex h-6 w-6 items-center justify-center rounded bg-accent text-primary"><Store className="h-3.5 w-3.5" /></span>{r.merchant}</span></td><td className="border-b border-border"><StatusBadge status={r.status} /></td><td className="border-b border-border font-medium">{r.value}</td><td className="border-b border-border">{r.reported}</td><td className="border-b border-border font-semibold">{r.calculated}</td><td className="border-b border-border text-muted-foreground">{r.orderDate}</td><td className="border-b border-border text-muted-foreground">{r.created}</td><td className="border-b border-border text-muted-foreground">{r.resolved ?? "—"}</td><td className="border-b border-border">{r.rejection ?? "—"}</td><td className="max-w-52 truncate border-b border-border text-muted-foreground" title={r.notes}>{r.notes}</td><td className="border-b border-border font-mono text-xs">{r.withdrawal ?? "—"}</td><td className="border-b border-border font-mono text-xs">{r.invoice ?? "—"}</td><td className="sticky right-0 z-20 border-b border-border bg-card pr-3 text-right shadow-sticky-right group-hover:bg-muted"><span className="inline-flex items-center"><IconButton label={`Edit ${r.cashback}`} onClick={() => act(r, "edit")}><Pencil /></IconButton><CopyButton value={r.cashback} /><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`More actions for ${r.cashback}`}><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => act(r, "edit")}><Pencil />Edit details</DropdownMenuItem><DropdownMenuItem><ExternalLink />Open conversion</DropdownMenuItem>{!(["Requested", "Paid"] as Status[]).includes(r.status) && <><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:bg-destructive-soft focus:text-destructive" onSelect={() => act(r, "delete")}><Trash2 />Delete</DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu></span></td></tr>)}</tbody></table></div></div><div className="mt-4 grid gap-4 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div className="flex min-w-0 flex-wrap items-center gap-4"><span>Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong> to <strong className="text-foreground">{Math.min(start + pageSize, filtered.length)}</strong> of <strong className="text-foreground">{filtered.length}</strong> results</span><div className="flex shrink-0 items-center gap-2"><span>Rows per page</span><Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger><SelectContent>{[10, 25, 50, 100].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select></div></div><div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 lg:justify-end"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft />Previous</Button>{pageItems.map((item, index) => <span key={item} className="contents">{index > 0 && item - pageItems[index - 1] > 1 && <span className="px-1">…</span>}<Button variant={item === currentPage ? "default" : "outline"} size="icon" className="h-8 w-8 shrink-0" onClick={() => setPage(item)} aria-current={item === currentPage ? "page" : undefined}>{item}</Button></span>)}<Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight /></Button></div></div><ImportModal open={importOpen} onOpenChange={setImportOpen} /><ConversionModal row={selected} mode={mode} onClose={() => { setSelected(null); setMode(null); }} /></>;
}

export function AdminPlayground() {
  const [view, setView] = useState<View>("dashboard"); const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="flex h-screen overflow-hidden bg-background text-foreground"><Sidebar view={view} setView={setView} open={sidebarOpen} setOpen={setSidebarOpen} /><div className="min-w-0 flex-1 overflow-y-auto"><div className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-card/95 px-4 backdrop-blur md:hidden"><IconButton label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu /></IconButton><span className="ml-2 font-heading font-bold">OfferPe Admin</span></div><main className="mx-auto w-full max-w-400 p-4 sm:p-6 lg:p-8">{view === "dashboard" ? <Dashboard /> : view === "merchants" ? <Merchants /> : <Conversions />}</main></div></div>;
}