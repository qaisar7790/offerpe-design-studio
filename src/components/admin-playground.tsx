"use client";

import { useMemo, useRef, useState } from "react";
import {
  AreaChart,
  ArrowDown,
  ArrowUp,
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
  Lock,
  Image as ImageIcon,
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
import { toast } from "sonner";

type View = "dashboard" | "merchants" | "merchant-edit" | "offers" | "offer-edit" | "conversions";
type Status = "Active" | "Inactive" | "Pending" | "Approved" | "Rejected" | "Requested" | "Paid";
type Offer = { id: string; merchant: string; headline: string; subtext: string; details: string; terms: string; discountType: "Percentage" | "Flat amount"; discountValue: number; commissionType: "Percentage" | "Flat amount"; commissionValue: number; start: string; end: string; minBill: number; sortOrder: number; discountCap: number; commissionCap: number; redirectUrl: string; voucherLink: string; productLink: string; affiliate: string; featured: boolean; active: boolean };
type OfferOrigin = { type: "merchant"; merchant: typeof merchants[number] } | { type: "listing" };

const groups = [
  { label: "Catalog", icon: ShoppingBag, items: [{ label: "Merchants", icon: Store, view: "merchants" as View }, { label: "Cashback Offers", icon: Tag, view: "offers" as View }, { label: "Categories", icon: Tag }, { label: "Cities", icon: Building2 }] },
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

const initialOffers: Offer[] = [
  { id: "OFF-1042", merchant: "Theobroma", headline: "Flat 10% cashback", subtext: "On all bakery items", details: "Get 10% of your bill amount credited as OfferPe wallet balance.", terms: "Valid on in-store purchases only.", discountType: "Percentage", discountValue: 10, commissionType: "Percentage", commissionValue: 5, start: "2026-08-29T06:53", end: "2026-09-30T23:59", minBill: 299, sortOrder: 1, discountCap: 100, commissionCap: 50, redirectUrl: "https://offerpe.link/r/theobroma-bakery", voucherLink: "offerpe://voucher/{id}", productLink: "offerpe://product/{slug}", affiliate: "None", featured: true, active: true },
  { id: "OFF-1041", merchant: "Theobroma", headline: "Celebration cakes", subtext: "A sweeter celebration", details: "Earn a flat cashback on celebration cakes.", terms: "Minimum bill value applies.", discountType: "Flat amount", discountValue: 150, commissionType: "Flat amount", commissionValue: 220, start: "2026-09-01T00:00", end: "2026-10-15T23:59", minBill: 999, sortOrder: 2, discountCap: 150, commissionCap: 220, redirectUrl: "", voucherLink: "offerpe://voucher/{id}", productLink: "", affiliate: "None", featured: false, active: true },
  { id: "OFF-1040", merchant: "Theobroma", headline: "First order bonus", subtext: "New customers only", details: "Extra cashback on your first purchase.", terms: "One redemption per customer.", discountType: "Percentage", discountValue: 10, commissionType: "Percentage", commissionValue: 12, start: "2026-09-10T00:00", end: "2026-12-31T23:59", minBill: 499, sortOrder: 3, discountCap: 200, commissionCap: 250, redirectUrl: "", voucherLink: "", productLink: "offerpe://product/{slug}", affiliate: "None", featured: true, active: true },
  { id: "OFF-1039", merchant: "Croma", headline: "Electronics weekend cashback", subtext: "Selected electronics", details: "Cashback on eligible electronics purchased online.", terms: "Exclusions apply.", discountType: "Percentage", discountValue: 4, commissionType: "Percentage", commissionValue: 6, start: "2026-09-01T00:00", end: "2026-11-30T23:59", minBill: 4999, sortOrder: 1, discountCap: 1500, commissionCap: 2000, redirectUrl: "https://offerpe.link/r/croma", voucherLink: "", productLink: "", affiliate: "Trackier", featured: true, active: true },
  { id: "OFF-1038", merchant: "Nykaa", headline: "Beauty essentials cashback", subtext: "Across selected brands", details: "Earn cashback on qualifying beauty purchases.", terms: "Selected products only.", discountType: "Percentage", discountValue: 8, commissionType: "Percentage", commissionValue: 11, start: "2026-08-15T00:00", end: "2026-10-31T23:59", minBill: 799, sortOrder: 2, discountCap: 500, commissionCap: 650, redirectUrl: "https://offerpe.link/r/nykaa", voucherLink: "", productLink: "", affiliate: "Impact", featured: false, active: true },
  { id: "OFF-1037", merchant: "Myntra", headline: "Fashion season offer", subtext: "App-only savings", details: "Cashback on fashion orders.", terms: "Not valid with select coupons.", discountType: "Percentage", discountValue: 6, commissionType: "Percentage", commissionValue: 9, start: "2026-07-01T00:00", end: "2026-08-31T23:59", minBill: 999, sortOrder: 4, discountCap: 400, commissionCap: 600, redirectUrl: "https://offerpe.link/r/myntra", voucherLink: "", productLink: "", affiliate: "Involve Asia", featured: false, active: false },
];

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
  if (!seed) throw new Error("Conversion seed data is unavailable");
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
  return <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", `status-${status.toLowerCase()}`)}>{status}</span>;
}

function IconButton({ label, children, className, onClick }: { label: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <Button type="button" variant="ghost" size="icon" className={cn("h-8 w-8 text-muted-foreground", className)} onClick={onClick} title={label} aria-label={label}>{children}</Button>;
}

function Sidebar({ view, setView, open, setOpen }: { view: View; setView: (v: View) => void; open: boolean; setOpen: (v: boolean) => void }) {
  const [expanded, setExpanded] = useState<string | null>(() => {
    const activeView = view === "merchant-edit" ? "merchants" : view === "offer-edit" ? "offers" : view;
    const activeGroup = groups.find((group) => group.items.some((item) => item.view === activeView));
    return activeGroup?.label ?? "Catalog";
  });
  const choose = (next: View) => { setView(next); setOpen(false); };
  const chooseGroupedItem = (next: View, groupLabel: string) => {
    setExpanded(groupLabel);
    choose(next);
  };
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
              const isOpen = expanded === group.label;
              return <div key={group.label}>
                <Button variant="ghost" className="h-9 w-full justify-start gap-2 px-3 text-[11px] font-bold uppercase text-muted-foreground hover:bg-sidebar-accent" onClick={() => setExpanded(isOpen ? null : group.label)} aria-expanded={isOpen}>
                  <group.icon className="h-3.5 w-3.5" /><span className="flex-1 text-left">{group.label}</span><ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-90")} />
                </Button>
                {isOpen && <div className="ml-4 border-l border-sidebar-border pl-2">
                  {group.items.map((item) => <Button key={item.label} variant="ghost" disabled={!item.view} className={cn("my-0.5 h-9 w-full justify-start gap-2.5 px-3 text-[13px] text-sidebar-foreground disabled:opacity-55", (item.view === view || (view === "merchant-edit" && item.view === "merchants") || (view === "offer-edit" && item.view === "offers")) && "bg-sidebar-accent font-semibold text-sidebar-primary hover:bg-sidebar-accent")} onClick={() => item.view && chooseGroupedItem(item.view, group.label)}><item.icon className="h-4 w-4" />{item.label}</Button>)}
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
  return <><PageHeader title="Dashboard" description="As of 21 Sep 2026, 11:25 IST · Refreshed hourly. A concise operational snapshot across the OfferPe platform." /><section className="mb-4 flex flex-col gap-4 rounded-lg border border-border bg-card px-5 py-4 shadow-card sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-heading text-lg font-bold text-foreground">Welcome back, Qaisar <span className="font-semibold text-muted-foreground">(Owner)</span></h2><p className="mt-1 text-sm text-muted-foreground">Here’s the latest operational picture across OfferPe.</p></div><div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground"><ShieldCheck className="h-4 w-4 text-primary" /><span>All systems operational</span><span aria-hidden="true" className="text-muted-foreground">•</span><span className="font-normal text-muted-foreground">Last matview refresh 10:19 AM IST</span></div></section><div className="mb-4 grid gap-4 lg:grid-cols-2"><DonutCard title="Stores — Status" total={38} data={[{ name: "Live", value: 33, fill: "var(--chart-1)" }, { name: "Inactive", value: 5, fill: "var(--chart-2)" }]} /><DonutCard title="Stores — Channel" total={38} data={[{ name: "Online", value: 31, fill: "var(--chart-1)" }, { name: "Offline", value: 7, fill: "var(--chart-3)" }]} /></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"><MetricCard title="Users Joined" total="2,486" data={chartData.users} /><MetricCard title="Clicks" data={chartData.clicks} /><MetricCard title="Transactions" data={chartData.transactions} /><MetricCard title="Withdrawal Requests" data={chartData.withdrawals} /><button onClick={() => undefined} className="rounded-lg border border-border bg-card p-5 text-left shadow-card transition-shadow hover:shadow-card-hover"><div className="font-heading text-sm font-semibold">Withdrawals — Currently Pending</div><div className="mt-7 font-heading text-4xl font-bold">14</div><div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary">View pending <ChevronRight className="h-4 w-4" /></div></button><MetricCard title="Missing Claims" data={chartData.claims} /></div></>;
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
  return <IconButton label={copied ? `${value} copied` : `Copy ${value}`} className={cn("h-7 w-7", copied && "text-primary")} onClick={() => { navigator.clipboard?.writeText(value); setCopied(true); window.setTimeout(() => setCopied(false), 1200); }}>{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</IconButton>;
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-border bg-card shadow-card"><div className="border-b border-border px-5 py-4"><h2 className="font-heading text-base font-bold">{title}</h2>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</div><div className="p-5">{children}</div></section>;
}

function MerchantEditPage({ merchant, onBack }: { merchant: typeof merchants[number]; onBack: () => void }) {
  const [active, setActive] = useState(merchant[4] === "Active");
  const [cities, setCities] = useState(["Mumbai, Maharashtra", "Bengaluru, Karnataka"]);
  const [steps, setSteps] = useState(["Show your OfferPe QR code at billing", "Merchant scans and confirms the amount", "Cashback credits to your wallet instantly"]);
  const moveStep = (index: number, direction: -1 | 1) => setSteps((current) => { const target = index + direction; if (target < 0 || target >= current.length) return current; const next = [...current]; [next[index], next[target]] = [next[target] ?? "", next[index] ?? ""]; return next; });
  const save = () => { toast.success("Merchant updated", { description: `${merchant[0]} was saved successfully.` }); onBack(); };
  return <div className="pb-20"><nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={() => onBack()}>Dashboard</Button><ChevronRight className="h-3.5 w-3.5" /><Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onBack}>Merchants</Button><ChevronRight className="h-3.5 w-3.5" /><span className="font-medium text-foreground">{merchant[0]}</span></nav><header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap items-center gap-3"><h1 className="font-heading text-3xl font-bold">{merchant[0]}</h1><StatusBadge status={active ? "Active" : "Inactive"} /></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={onBack}><ChevronLeft />Back to Merchants</Button><Button variant="destructive" onClick={() => { toast.success("Merchant deleted", { description: `${merchant[0]} was removed from this playground.` }); onBack(); }}><Trash2 />Delete Merchant</Button></div></header><Tabs defaultValue="sections"><TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="sections" className="rounded-none border-b-2 border-transparent px-1 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">Page Sections</TabsTrigger><TabsTrigger value="banners" className="rounded-none border-b-2 border-transparent px-1 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">Banners</TabsTrigger><TabsTrigger value="offers" className="rounded-none border-b-2 border-transparent px-1 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none">Offers</TabsTrigger></TabsList><TabsContent value="sections" className="mt-0"><div className="grid gap-5 xl:grid-cols-2"><SectionCard title="Core Details" description="Primary merchant identity and publishing settings."><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium sm:col-span-2">Name <span className="text-destructive">*</span><Input defaultValue={merchant[0]} /></label><label className="space-y-1.5 text-sm font-medium">Category <span className="text-destructive">*</span><Select defaultValue={merchant[2]}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value={merchant[2]}>{merchant[2]}</SelectItem><SelectItem value="Restaurants">Restaurants</SelectItem><SelectItem value="Fashion">Fashion</SelectItem></SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">Display Order <span className="text-destructive">*</span><Input type="number" defaultValue={merchant[3]} /></label><label className="space-y-1.5 text-sm font-medium">Website URL<Input type="url" placeholder="https://merchant.example" /></label><label className="space-y-1.5 text-sm font-medium">Affiliate Network<Select defaultValue="none"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="trackier">Trackier</SelectItem><SelectItem value="impact">Impact</SelectItem></SelectContent></Select></label><div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2.5 sm:col-span-2"><div><p className="text-sm font-semibold">Active merchant</p><p className="text-xs text-muted-foreground">Visible to customers across OfferPe.</p></div><Switch checked={active} onCheckedChange={setActive} aria-label="Active merchant" /></div></div></SectionCard><SectionCard title="Operating Cities & Locations" description="Control where this merchant is available."><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">State<Select defaultValue="maharashtra"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="maharashtra">Maharashtra</SelectItem><SelectItem value="karnataka">Karnataka</SelectItem></SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">City<Select defaultValue="mumbai"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="mumbai">Mumbai</SelectItem><SelectItem value="bengaluru">Bengaluru</SelectItem></SelectContent></Select></label></div><div className="mt-4 flex flex-wrap gap-2">{cities.map((city) => <span key={city} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{city}<Button variant="ghost" size="icon" className="h-4 w-4" aria-label={`Remove ${city}`} onClick={() => setCities((current) => current.filter((item) => item !== city))}><X className="h-3 w-3" /></Button></span>)}</div><p className="mt-4 text-sm leading-6 text-muted-foreground">A chain can operate in more than one city — pick every city this merchant is live in.</p></SectionCard><SectionCard title="Brand & App Content" description="Customer-facing information and redemption guidance."><div className="space-y-5"><label className="block space-y-1.5 text-sm font-medium">About / Description<Textarea rows={4} defaultValue="Premium bakery and patisserie chain known for its brownies." /></label><div><span className="text-sm font-medium">Brand Logo</span><button type="button" className="mt-1.5 flex min-h-28 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center hover:border-primary hover:bg-accent"><UploadCloud className="mb-2 h-6 w-6 text-primary" /><span className="text-sm font-semibold">Upload brand logo</span><span className="mt-1 text-xs text-muted-foreground">Leave blank to keep the current logo or use the Trackier-synced logo.</span></button></div><div><div className="mb-2 flex items-center justify-between"><span className="text-sm font-medium">How to Avail</span><Button variant="ghost" size="sm" onClick={() => setSteps((current) => [...current, "New redemption step"])}><Plus />Add step</Button></div><div className="space-y-2">{steps.map((step, index) => <div key={`${step}-${index}`} className="flex items-center gap-2 rounded-md border border-border bg-muted/30 p-2"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-accent text-xs font-bold text-primary">{index + 1}</span><Input value={step} onChange={(event) => setSteps((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} className="h-8 bg-card" /><div className="flex shrink-0"><IconButton label="Move step up" className="h-7 w-7" onClick={() => moveStep(index, -1)}><ArrowUp className="h-3.5 w-3.5" /></IconButton><IconButton label="Move step down" className="h-7 w-7" onClick={() => moveStep(index, 1)}><ArrowDown className="h-3.5 w-3.5" /></IconButton><IconButton label="Delete step" className="h-7 w-7 text-destructive" onClick={() => setSteps((current) => current.filter((_, itemIndex) => itemIndex !== index))}><X className="h-3.5 w-3.5" /></IconButton></div></div>)}</div></div></div></SectionCard><SectionCard title="Commission & Tracking Rules" description="Default calculations and expected processing windows."><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Default Commission Type<Select defaultValue="percentage"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="flat">Flat amount</SelectItem><SelectItem value="none">No default commission</SelectItem></SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">Default Commission Value<Input type="number" defaultValue="8" /></label><label className="space-y-1.5 text-sm font-medium">Expected Tracking Time (minutes)<Input type="number" defaultValue="30" /></label><label className="space-y-1.5 text-sm font-medium">Expected Approval Time (days)<Input type="number" defaultValue="45" /></label></div></SectionCard></div></TabsContent><TabsContent value="banners" className="mt-0"><SectionCard title="Promo Banners" description="Campaign creative currently configured for this merchant."><div className="mb-4 flex justify-end"><Button><Plus />Add Banner</Button></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{["Festive gifting collection", "Brownie celebration box", "Weekend store offer"].map((banner, index) => <article key={banner} className="overflow-hidden rounded-lg border border-border"><div className="flex aspect-[16/7] items-center justify-center bg-muted"><ImageIcon className="h-8 w-8 text-muted-foreground" /></div><div className="flex items-center justify-between p-3"><div><p className="text-sm font-semibold">{banner}</p><p className="text-xs text-muted-foreground">Position {index + 1} · Active</p></div><IconButton label={`Edit ${banner}`}><Pencil className="h-4 w-4" /></IconButton></div></article>)}</div></SectionCard></TabsContent><TabsContent value="offers" className="mt-0"><SectionCard title="Cashback Offers" description="Active discounts and cashback rules for this merchant."><div className="mb-4 flex justify-end"><Button><Plus />Add Offer</Button></div><div className="overflow-x-auto rounded-lg border border-border"><table className="w-full min-w-180 text-left text-sm"><thead className="bg-muted/70 text-xs uppercase text-muted-foreground"><tr><th>Offer</th><th>Customer Cashback</th><th>Commission</th><th>Validity</th><th>Status</th><th className="text-right">Actions</th></tr></thead><tbody>{[["In-store purchase", "6%", "8%", "30 Sep 2026"], ["Celebration cakes", "₹150 flat", "₹220 flat", "15 Oct 2026"], ["First order bonus", "10%", "12%", "31 Dec 2026"]].map((offer) => <tr key={offer[0]} className="border-t border-border"><td className="font-semibold">{offer[0]}</td><td>{offer[1]}</td><td>{offer[2]}</td><td>{offer[3]}</td><td><StatusBadge status="Active" /></td><td className="text-right"><IconButton label={`Edit ${offer[0]}`}><Pencil className="h-4 w-4" /></IconButton></td></tr>)}</tbody></table></div></SectionCard></TabsContent></Tabs><div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 shadow-sticky-right backdrop-blur md:left-64"><div className="mx-auto flex max-w-400 justify-end gap-2"><Button variant="destructiveSoft" onClick={onBack}>Cancel</Button><Button onClick={save}>Save Changes</Button></div></div></div>;
}

function Merchants({ onEdit }: { onEdit: (merchant: typeof merchants[number]) => void }) {
  const [query, setQuery] = useState(""); const [statuses, setStatuses] = useState<Status[]>([]); const [sortAsc, setSortAsc] = useState(true);
  const rows = useMemo(() => merchants.filter((m) => (!query || `${m[0]} ${m[2]}`.toLowerCase().includes(query.toLowerCase())) && (!statuses.length || statuses.includes(m[4] as Status))).sort((a, b) => sortAsc ? a[0].localeCompare(b[0]) : b[0].localeCompare(a[0])), [query, statuses, sortAsc]);
  return <><PageHeader title="Merchants" description="Manage merchant availability, categorisation, and channel details." actions={<Button><Plus />Add new</Button>} /><FilterBar query={query} setQuery={setQuery} statuses={statuses} setStatuses={setStatuses} showChannel /><div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-205 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th className="sticky left-0 z-10 bg-muted px-4 py-2"><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortAsc(!sortAsc)}>Name <ChevronDown className={cn("transition-transform", !sortAsc && "rotate-180")} /></Button></th><th>Channel</th><th>Category</th><th>Order</th><th>Status</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{rows.map((m) => <tr key={m[0]} className="group border-t border-border hover:bg-muted/50"><td className="sticky left-0 bg-card px-4 py-2 font-semibold group-hover:bg-muted">{m[0]}</td><td><span className="inline-flex items-center gap-1.5 font-medium"><span className={cn("h-2 w-2 rounded-full", m[1] === "Online" ? "bg-success" : "bg-info")} />{m[1]}</span></td><td>{m[2]}</td><td>{m[3]}</td><td><StatusBadge status={m[4] as Status} /></td><td className="pr-3 text-right"><IconButton className="h-7 w-7" label={`Edit ${m[0]}`} onClick={() => onEdit(m)}><Pencil className="h-3.5 w-3.5" /></IconButton><IconButton className="h-7 w-7" label={`Open ${m[0]}`} onClick={() => onEdit(m)}><ExternalLink className="h-3.5 w-3.5" /></IconButton></td></tr>)}</tbody></table></div></div><div className="mt-4 flex items-center justify-between text-sm text-muted-foreground"><span>Showing {rows.length} of {merchants.length} merchants</span><div className="flex gap-1"><Button variant="outline" size="icon" disabled><ChevronLeft /></Button><Button variant="outline" size="icon"><ChevronRight /></Button></div></div></>;
}

function ImportModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [file, setFile] = useState<File | null>(null); const inputRef = useRef<HTMLInputElement>(null);
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-xl"><DialogHeader><DialogTitle className="font-heading text-xl">Import Offline Report</DialogTitle><DialogDescription>Upload a CSV to create and resolve offline conversions in one step.</DialogDescription></DialogHeader><div className="rounded-md bg-muted p-3 text-sm leading-6 text-muted-foreground"><span className="mr-2 inline-flex rounded bg-info-soft px-2 py-0.5 text-xs font-semibold text-info">Required columns</span><code>click_token, order_id, order_amount, reported_commission, status</code></div><button type="button" onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0] ?? null); }} className="flex min-h-40 w-full flex-col items-center justify-center rounded-lg border border-dashed border-strong bg-muted/40 px-6 text-center hover:border-primary hover:bg-accent"><UploadCloud className="mb-3 h-8 w-8 text-primary" /><span className="font-semibold text-primary">{file ? file.name : "Choose a file"}</span><span className="mt-1 text-sm text-muted-foreground">or drag and drop a CSV here</span><input ref={inputRef} className="hidden" type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></button><DialogFooter><DialogClose asChild><Button variant="destructiveSoft">Cancel</Button></DialogClose><Button disabled={!file} onClick={() => onOpenChange(false)}><UploadCloud />Import report</Button></DialogFooter></DialogContent></Dialog>;
}

function dateFromDisplay(value: string) {
  const match = value.match(/(\d{1,2}) (\w{3}) (\d{4})/);
  if (!match) return undefined;
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(match[2] ?? "");
  return month < 0 ? undefined : new Date(Number(match[3]), month, Number(match[1]));
}

function formatInrInput(value: string) {
  const amount = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(amount) : "₹0.00";
}

function ReadonlyField({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return <label className="min-w-0 space-y-1.5 text-xs font-semibold text-muted-foreground"><span>{label}</span><div className={cn("truncate rounded-md border border-border bg-muted px-3 py-2 text-sm font-medium text-foreground", mono && "font-mono text-xs")} title={value}>{value}</div></label>;
}

function ConversionModal({ row, mode, onClose, onSave }: { row: Conversion | null; mode: "edit" | "delete" | null; onClose: () => void; onSave: (row: Conversion) => void }) {
  const [status, setStatus] = useState<Status>(row?.status ?? "Pending");
  const [orderValue, setOrderValue] = useState(row?.value.replace(/[^0-9.]/g, "") ?? "");
  const [reported, setReported] = useState(row?.reported.replace(/[^0-9.]/g, "") ?? "");
  const [orderDate, setOrderDate] = useState<Date | undefined>(row ? dateFromDisplay(row.orderDate) : undefined);
  const [rejection, setRejection] = useState(row?.rejection ?? "Not applicable");
  const [notes, setNotes] = useState(row?.notes ?? "");
  const [invoice, setInvoice] = useState(row?.invoice ?? "");
  const invoiceLocked = Boolean(row?.invoice);
  const save = () => {
    if (!row) return;
    onSave({ ...row, status, value: formatInrInput(orderValue), reported: formatInrInput(reported), orderDate: orderDate ? format(orderDate, "dd MMM yyyy") : row.orderDate, rejection: status === "Rejected" && rejection !== "Not applicable" ? rejection : null, notes, invoice: invoice.trim() || null });
    toast.success("Conversion updated", { description: `${row.cashback} was saved successfully.` });
    onClose();
  };
  return <Dialog open={!!row && !!mode} onOpenChange={(v) => !v && onClose()}><DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto bg-card p-0"><DialogHeader className="border-b border-border px-6 py-5"><DialogTitle className="font-heading text-xl">{mode === "delete" ? "Delete Conversion" : "Edit Conversion"}</DialogTitle><DialogDescription>{mode === "delete" ? "This record will be hidden everywhere and retained for audit." : "Update the conversion details while preserving its source identifiers."}</DialogDescription></DialogHeader>{mode === "delete" ? <div className="px-6"><label className="space-y-1.5 text-sm font-medium">Reason <Textarea placeholder="Add a reason for this deletion…" /></label></div> : row && <div className="space-y-5 px-6"><section className="rounded-lg border border-border bg-muted/60 p-4"><h3 className="mb-3 text-xs font-bold uppercase text-muted-foreground">Conversion identifiers</h3><div className="grid gap-3 sm:grid-cols-2"><ReadonlyField label="Cashback ID" value={row.cashback} mono /><ReadonlyField label="Click ID" value={row.click ?? "—"} mono /><ReadonlyField label="Order ID" value={row.order} mono /><ReadonlyField label="Merchant" value={row.merchant} /></div></section><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Order Value<div className="relative"><span className="absolute left-3 top-2 text-sm text-muted-foreground">₹</span><Input aria-label="Order Value" type="number" min="0" step="0.01" className="pl-7" value={orderValue} onChange={(e) => setOrderValue(e.target.value)} /></div></label><label className="space-y-1.5 text-sm font-medium">Status<Select value={status} onValueChange={(value) => setStatus(value as Status)}><SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger><SelectContent>{(["Pending", "Approved", "Rejected", "Requested", "Paid"] as Status[]).map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">Commission Reported<div className="relative"><span className="absolute left-3 top-2 text-sm text-muted-foreground">₹</span><Input aria-label="Commission Reported" type="number" min="0" step="0.01" className="pl-7" value={reported} onChange={(e) => setReported(e.target.value)} /></div></label><label className="space-y-1.5 text-sm font-medium">Order Date<Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start font-normal"><CalendarDays />{orderDate ? format(orderDate, "dd MMM yyyy") : "Choose date"}</Button></PopoverTrigger><PopoverContent className="pointer-events-auto w-auto p-0" align="start"><Calendar mode="single" selected={orderDate} onSelect={setOrderDate} /></PopoverContent></Popover></label></div><label className={cn("block space-y-1.5 rounded-lg border text-sm font-medium transition-colors", status === "Rejected" ? "border-destructive-border bg-destructive-soft p-3" : "border-transparent")}><span>Rejection Reason{status === "Rejected" && <span className="ml-2 text-xs font-normal text-destructive">Required for rejected conversions</span>}</span><Select value={rejection} onValueChange={setRejection}><SelectTrigger aria-label="Rejection Reason" className="bg-card"><SelectValue /></SelectTrigger><SelectContent>{["Cancelled by customer", "Return / Exchange", "Payment failed", "Affiliate terms breached", "Duplicate transaction", "Not applicable"].map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select></label><label className="block space-y-1.5 text-sm font-medium">Internal Notes<Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Add context for other administrators…" /></label><label className="block space-y-1.5 text-sm font-medium">Invoice Number<div className="relative"><Input value={invoice} onChange={(e) => setInvoice(e.target.value)} readOnly={invoiceLocked} className={cn(invoiceLocked && "bg-muted pr-9 text-muted-foreground")} placeholder="INV-2026/09-XXXX" />{invoiceLocked && <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />}</div>{invoiceLocked && <span className="block text-xs font-normal text-muted-foreground">Invoice numbers are locked after assignment.</span>}</label></div>}<DialogFooter className="border-t border-border px-6 py-4"><DialogClose asChild><Button variant="destructiveSoft">Cancel</Button></DialogClose>{mode === "delete" ? <DialogClose asChild><Button variant="destructive"><Trash2 />Delete conversion</Button></DialogClose> : <Button onClick={save}>Save changes</Button>}</DialogFooter></DialogContent></Dialog>;
}
function Conversions() {
  const [conversionRows, setConversionRows] = useState(conversions); const [query, setQuery] = useState(""); const [statuses, setStatuses] = useState<Status[]>([]); const [importOpen, setImportOpen] = useState(false); const [selected, setSelected] = useState<Conversion | null>(null); const [mode, setMode] = useState<"edit" | "delete" | null>(null); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  const filtered = conversionRows.filter((r) => (!query || Object.values(r).join(" ").toLowerCase().includes(query.toLowerCase())) && (!statuses.length || statuses.includes(r.status)));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);
  const setSearch = (value: string) => { setQuery(value); setPage(1); };
  const setStatusFilter = (value: Status[]) => { setStatuses(value); setPage(1); };
  const act = (row: Conversion, next: "edit" | "delete") => { setSelected(row); setMode(next); };
  const saveConversion = (updated: Conversion) => setConversionRows((current) => current.map((item) => item.cashback === updated.cashback ? updated : item));
  const pageItems = Array.from(new Set([1, 2, currentPage - 1, currentPage, currentPage + 1, pageCount - 1, pageCount])).filter((item) => item >= 1 && item <= pageCount).sort((a, b) => a - b);
  return <><PageHeader title="Online Conversions" description="Review conversion lifecycle, commission values, and settlement status." actions={<><Button variant="outline"><Download />Export CSV</Button><Button onClick={() => setImportOpen(true)}><UploadCloud />Import & Export</Button></>} /><FilterBar query={query} setQuery={setSearch} statuses={statuses} setStatuses={setStatusFilter} /><div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar max-w-full overflow-x-auto"><table className="w-max min-w-520 border-separate border-spacing-0 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>{["Cashback ID", "Click ID", "Order ID", "Merchant", "Status", "Order Value", "Commission Reported", "Commission Calculated", "Order Date", "Date Created", "Date Approved/Rejected", "Rejection Reason", "Internal Notes", "Withdrawal ID", "Invoice Number"].map((label, index) => <th key={label} className={cn("sticky top-0 z-10 border-b border-border bg-muted/90 px-4 py-2 backdrop-blur", index === 0 && "left-0 z-30 shadow-sticky-left")}>{label}</th>)}<th className="sticky right-0 top-0 z-30 border-b border-border bg-muted/90 pr-4 text-right backdrop-blur shadow-sticky-right">Actions</th></tr></thead><tbody>{rows.map((r) => <tr key={r.cashback} className="group hover:bg-muted/50"><td className="sticky left-0 z-20 border-b border-border bg-card px-4 py-2 shadow-sticky-left group-hover:bg-muted"><span className="flex items-center gap-1 font-mono text-xs font-semibold">{r.cashback}<CopyButton value={r.cashback} /></span></td><td className="border-b border-border font-mono text-xs"><span className="flex items-center gap-1">{r.click ?? "—"}{r.click && <CopyButton value={r.click} />}</span></td><td className="border-b border-border font-mono text-xs"><span className="flex items-center gap-1">{r.order}<CopyButton value={r.order} /></span></td><td className="border-b border-border"><span className="inline-flex items-center gap-2 font-medium"><span className="flex h-5 w-5 items-center justify-center rounded bg-accent text-primary"><Store className="h-3 w-3" /></span>{r.merchant}</span></td><td className="border-b border-border"><StatusBadge status={r.status} /></td><td className="border-b border-border font-medium">{r.value}</td><td className="border-b border-border">{r.reported}</td><td className="border-b border-border font-semibold">{r.calculated}</td><td className="border-b border-border text-muted-foreground">{r.orderDate}</td><td className="border-b border-border text-muted-foreground">{r.created}</td><td className="border-b border-border text-muted-foreground">{r.resolved ?? "—"}</td><td className="border-b border-border">{r.rejection ?? "—"}</td><td className="max-w-52 truncate border-b border-border text-muted-foreground" title={r.notes}>{r.notes}</td><td className="border-b border-border font-mono text-xs">{r.withdrawal ?? "—"}</td><td className="border-b border-border font-mono text-xs">{r.invoice ?? "—"}</td><td className="sticky right-0 z-20 border-b border-border bg-card pr-3 text-right shadow-sticky-right group-hover:bg-muted"><span className="inline-flex items-center"><IconButton className="h-7 w-7" label={`Edit ${r.cashback}`} onClick={() => act(r, "edit")}><Pencil className="h-3.5 w-3.5" /></IconButton><CopyButton value={r.cashback} /><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`More actions for ${r.cashback}`}><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onSelect={() => act(r, "edit")}><Pencil />Edit details</DropdownMenuItem><DropdownMenuItem><ExternalLink />Open conversion</DropdownMenuItem>{!(["Requested", "Paid"] as Status[]).includes(r.status) && <><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:bg-destructive-soft focus:text-destructive" onSelect={() => act(r, "delete")}><Trash2 />Delete</DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu></span></td></tr>)}</tbody></table></div></div><div className="mt-4 grid gap-4 rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"><div className="flex min-w-0 flex-wrap items-center gap-4"><span>Showing <strong className="text-foreground">{filtered.length ? start + 1 : 0}</strong> to <strong className="text-foreground">{Math.min(start + pageSize, filtered.length)}</strong> of <strong className="text-foreground">{filtered.length}</strong> results</span><div className="flex shrink-0 items-center gap-2"><span>Rows per page</span><Select value={String(pageSize)} onValueChange={(value) => { setPageSize(Number(value)); setPage(1); }}><SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger><SelectContent>{[10, 25, 50, 100].map((size) => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select></div></div><div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 lg:justify-end"><Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft />Previous</Button>{pageItems.map((item, index) => { const previous = pageItems[index - 1]; return <span key={item} className="contents">{previous !== undefined && item - previous > 1 && <span className="px-1">…</span>}<Button variant={item === currentPage ? "default" : "outline"} size="icon" className="h-8 w-8 shrink-0" onClick={() => setPage(item)} aria-current={item === currentPage ? "page" : undefined}>{item}</Button></span>; })}<Button variant="outline" size="sm" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Next<ChevronRight /></Button></div></div><ImportModal open={importOpen} onOpenChange={setImportOpen} /><ConversionModal key={`${selected?.cashback ?? "none"}-${mode ?? "none"}`} row={selected} mode={mode} onSave={saveConversion} onClose={() => { setSelected(null); setMode(null); }} /></>;
}

export function AdminPlayground() {
  const [view, setView] = useState<View>("dashboard"); const [sidebarOpen, setSidebarOpen] = useState(false); const [editingMerchant, setEditingMerchant] = useState<typeof merchants[number] | null>(null);
  const editMerchant = (merchant: typeof merchants[number]) => { setEditingMerchant(merchant); setView("merchant-edit"); };
  const backToMerchants = () => { setEditingMerchant(null); setView("merchants"); };
  return <div className="flex h-screen overflow-hidden bg-background text-foreground"><Sidebar view={view} setView={(next) => { setView(next); if (next !== "merchant-edit") setEditingMerchant(null); }} open={sidebarOpen} setOpen={setSidebarOpen} /><div className="min-w-0 flex-1 overflow-y-auto"><div className="sticky top-0 z-20 flex h-14 items-center border-b border-border bg-card/95 px-4 backdrop-blur md:hidden"><IconButton label="Open navigation" onClick={() => setSidebarOpen(true)}><Menu /></IconButton><span className="ml-2 font-heading font-bold">OfferPe Admin</span></div><main className="mx-auto w-full max-w-400 p-4 sm:p-6 lg:p-8">{view === "dashboard" ? <Dashboard /> : view === "merchants" ? <Merchants onEdit={editMerchant} /> : view === "merchant-edit" && editingMerchant ? <MerchantEditPage merchant={editingMerchant} onBack={backToMerchants} /> : <Conversions />}</main></div></div>;
}