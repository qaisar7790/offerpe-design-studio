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

const conversions = [
  { cashback: "CB-84921", click: "clk_72a9f4", order: "ORD-72194", merchant: "Myntra", value: "₹3,499.00", commission: "₹279.92", date: "20 Sep 2026, 14:42", status: "Pending" as Status },
  { cashback: "CB-84920", click: "clk_16bd03", order: "ORD-88217", merchant: "Nykaa", value: "₹1,890.00", commission: "₹151.20", date: "20 Sep 2026, 11:18", status: "Approved" as Status },
  { cashback: "CB-84918", click: "clk_b872ad", order: "ORD-59103", merchant: "Croma", value: "₹42,990.00", commission: "₹859.80", date: "19 Sep 2026, 18:06", status: "Rejected" as Status },
  { cashback: "CB-84912", click: "clk_0cd721", order: "ORD-33819", merchant: "MakeMyTrip", value: "₹16,420.00", commission: "₹492.60", date: "19 Sep 2026, 09:51", status: "Requested" as Status },
  { cashback: "CB-84901", click: "clk_fe2921", order: "ORD-44531", merchant: "Theobroma", value: "₹860.00", commission: "₹68.80", date: "18 Sep 2026, 16:20", status: "Paid" as Status },
  { cashback: "CB-84889", click: "clk_081af3", order: "ORD-10773", merchant: "Hummel", value: "₹5,299.00", commission: "₹423.92", date: "18 Sep 2026, 10:12", status: "Approved" as Status },
];

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

function ConversionModal({ row, mode, onClose }: { row: typeof conversions[number] | null; mode: "edit" | "delete" | null; onClose: () => void }) {
  return <Dialog open={!!row && !!mode} onOpenChange={(v) => !v && onClose()}><DialogContent><DialogHeader><DialogTitle className="font-heading text-xl">{mode === "delete" ? "Delete conversion" : "Edit conversion"}</DialogTitle><DialogDescription>{mode === "delete" ? "This record will be hidden everywhere and retained for audit." : `Update internal details for ${row?.cashback ?? "this conversion"}.`}</DialogDescription></DialogHeader>{mode === "delete" ? <label className="space-y-1.5 text-sm font-medium">Reason <Textarea placeholder="Add a reason for this deletion…" /></label> : <div className="grid gap-4"><label className="space-y-1.5 text-sm font-medium">Internal notes<Textarea placeholder="Add an internal note…" /></label><label className="space-y-1.5 text-sm font-medium">Invoice number<Input placeholder="e.g. INV-2026/09" /></label></div>}<DialogFooter><DialogClose asChild><Button variant="destructiveSoft">Cancel</Button></DialogClose><DialogClose asChild><Button variant={mode === "delete" ? "destructive" : "default"}>{mode === "delete" ? <><Trash2 />Delete conversion</> : "Save changes"}</Button></DialogClose></DialogFooter></DialogContent></Dialog>;
}

function Conversions() {
  const [query, setQuery] = useState(""); const [statuses, setStatuses] = useState<Status[]>([]); const [importOpen, setImportOpen] = useState(false); const [selected, setSelected] = useState<typeof conversions[number] | null>(null); const [mode, setMode] = useState<"edit" | "delete" | null>(null);
  const rows = conversions.filter((r) => (!query || Object.values(r).join(" ").toLowerCase().includes(query.toLowerCase())) && (!statuses.length || statuses.includes(r.status)));
  const act = (row: typeof conversions[number], next: "edit" | "delete") => { setSelected(row); setMode(next); };
  return <><PageHeader title="Online Conversions" description="Review conversion lifecycle, commission values, and settlement status." actions={<><Button variant="outline"><Download />Export CSV</Button><Button onClick={() => setImportOpen(true)}><UploadCloud />Import & Export</Button></>} /><FilterBar query={query} setQuery={setQuery} statuses={statuses} setStatuses={setStatuses} /><div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-280 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 z-10 bg-muted px-4 py-3">Cashback ID</th><th>Click ID</th><th>Order ID</th><th>Merchant</th><th>Order Value</th><th>Commission</th><th>Created</th><th>Status</th><th className="sticky right-0 bg-muted pr-4 text-right">Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.cashback} className="group border-t border-border hover:bg-muted/50"><td className="sticky left-0 bg-card px-4 py-3 group-hover:bg-muted"><span className="flex items-center gap-1 font-mono text-xs font-semibold">{r.cashback}<CopyButton value={r.cashback} /></span></td><td><span className="flex items-center gap-1 font-mono text-xs">{r.click}<CopyButton value={r.click} /></span></td><td className="font-mono text-xs">{r.order}</td><td className="font-medium">{r.merchant}</td><td>{r.value}</td><td className="font-semibold">{r.commission}</td><td className="text-muted-foreground">{r.date}</td><td><StatusBadge status={r.status} /></td><td className="sticky right-0 bg-card pr-3 text-right group-hover:bg-muted"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" aria-label={`Actions for ${r.cashback}`}><MoreHorizontal /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => act(r, "edit")}><Pencil />Edit details</DropdownMenuItem><DropdownMenuItem><ExternalLink />Open conversion</DropdownMenuItem>{!(["Requested", "Paid"] as Status[]).includes(r.status) && <><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:bg-destructive-soft focus:text-destructive" onSelect={() => act(r, "delete")}><Trash2 />Delete</DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu></td></tr>)}</tbody></table></div></div><div className="mt-4 flex items-center justify-between text-sm text-muted-foreground"><span>Showing {rows.length} of {conversions.length} conversions</span><div className="flex gap-1"><Button variant="outline" size="icon" disabled><ChevronLeft /></Button><Button variant="outline" size="icon"><ChevronRight /></Button></div></div><ImportModal open={importOpen} onOpenChange={setImportOpen} /><ConversionModal row={selected} mode={mode} onClose={() => { setSelected(null); setMode(null); }} /></>;
}

export function AdminPlayground() {
  const [view, setView] = useState<View>("dashboard"); const [sidebarOpen, setSidebarOpen] = useState(false);
  return <div className="flex h-screen overflow-hidden bg-background text-foreground"><Sidebar view={view} setView={setView} open={sidebarOpen} setOpen={setSidebarOpen} /><div className="min-w-0 flex-1 overflow-y-auto"><div className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-card/95 px-4 backdrop-blur md:hidden"><IconButton label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu /></IconButton><span className="ml-2 font-heading font-bold">OfferPe Admin</span></div><main className="mx-auto w-full max-w-400 p-4 sm:p-6 lg:p-8">{view === "dashboard" ? <Dashboard /> : view === "merchants" ? <Merchants /> : <Conversions />}</main></div></div>;
}