import { DateFilter } from "@/components/admin/DateFilter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import type { Status } from "@/types/admin";
import { ChevronDown, Filter, Search } from "lucide-react";

export function FilterBar({ query, setQuery, statuses, setStatuses, showChannel = false, actions }: { query: string; setQuery: (v: string) => void; statuses: Status[]; setStatuses: (v: Status[]) => void; showChannel?: boolean; actions?: React.ReactNode }) {
  const options: Status[] = showChannel ? ["Active", "Inactive"] : ["Pending", "Approved", "Rejected", "Requested", "Paid"];
  return <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center"><div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" placeholder={showChannel ? "Search merchants or categories…" : "Search cashback, order, or merchant…"} /></div><DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline"><Filter />Status{statuses.length > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] text-primary-foreground">{statuses.length}</span>}<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44">{options.map((status) => <DropdownMenuCheckboxItem key={status} checked={statuses.includes(status)} onCheckedChange={() => setStatuses(statuses.includes(status) ? statuses.filter((s) => s !== status) : [...statuses, status])}>{status}</DropdownMenuCheckboxItem>)}</DropdownMenuContent></DropdownMenu>{showChannel ? <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Channel<ChevronDown /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuCheckboxItem checked>Online</DropdownMenuCheckboxItem><DropdownMenuCheckboxItem>Offline</DropdownMenuCheckboxItem></DropdownMenuContent></DropdownMenu> : <DateFilter />}{(query || statuses.length > 0) && <Button variant="ghost" onClick={() => { setQuery(""); setStatuses([]); }}>Clear</Button>}{actions}</div>;
}
