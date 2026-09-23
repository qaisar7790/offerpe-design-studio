import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { IconButton } from "@/components/admin/IconButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TransactionPagination } from "@/components/admin/TransactionPagination";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cityDirectory, cityStates, initialCities } from "@/data/mockData";
import type { CityRecord, Status } from "@/types/admin";
import { Building2, Check, ChevronDown, Filter, Pencil, Plus, RotateCcw, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CityDialog({ city, onClose, onSave }: { city: CityRecord | null; onClose: () => void; onSave: (city: CityRecord) => void }) {
  const [stateName, setStateName] = useState(city?.state ?? "");
  const [cityName, setCityName] = useState(city?.name ?? "");
  const [manual, setManual] = useState(false);
  const [lat, setLat] = useState(city ? String(city.lat) : "");
  const [lng, setLng] = useState(city ? String(city.lng) : "");
  const [active, setActive] = useState(city?.active ?? true);
  const cityOptions = stateName ? cityDirectory[stateName] ?? [] : [];
  const pickState = (value: string) => { setStateName(value); if (!manual) { setCityName(""); setLat(""); setLng(""); } };
  const pickCity = (value: string) => {
    setCityName(value);
    const match = cityOptions.find((item) => item.name === value);
    if (match) { setLat(String(match.lat)); setLng(String(match.lng)); }
  };
  const valid = Boolean(stateName && cityName.trim() && lat.trim() && lng.trim() && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng)));
  return <Dialog open onOpenChange={(open) => !open && onClose()}><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-xl">{city ? "Edit city" : "New city"}</DialogTitle><DialogDescription>Pick a state and city — latitude and longitude fill in automatically from the OfferPe city directory.</DialogDescription></DialogHeader><div className="space-y-5"><div><p className="mb-2 text-sm font-semibold">State &amp; city</p><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">State <span className="text-destructive">*</span><Select value={stateName} onValueChange={pickState}><SelectTrigger aria-label="State"><SelectValue placeholder="Select a state…" /></SelectTrigger><SelectContent>{cityStates.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><label className="space-y-1.5 text-sm font-medium">City <span className="text-destructive">*</span>{manual ? <Input aria-label="City" value={cityName} onChange={(event) => setCityName(event.target.value)} placeholder="Enter city name" /> : <Select value={cityName} onValueChange={pickCity} disabled={!stateName}><SelectTrigger aria-label="City"><SelectValue placeholder="Select a city…" /></SelectTrigger><SelectContent>{cityOptions.map((item) => <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select>}</label></div><Button variant="link" className="h-auto px-0 pt-2 text-sm text-primary" onClick={() => setManual(!manual)}>{manual ? "Back to the city list" : "City not listed? Enter manually"}</Button></div><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-1.5 text-sm font-medium">Latitude <span className="text-destructive">*</span><Input aria-label="Latitude" value={lat} onChange={(event) => setLat(event.target.value)} placeholder="12.9716" /></label><label className="space-y-1.5 text-sm font-medium">Longitude <span className="text-destructive">*</span><Input aria-label="Longitude" value={lng} onChange={(event) => setLng(event.target.value)} placeholder="77.5946" /></label></div><p className="text-xs text-muted-foreground">Coordinates are prefilled from the directory and stay editable for precise store-radius tuning.</p><label className="flex items-start gap-2.5 text-sm font-medium"><Checkbox checked={active} onCheckedChange={(checked) => setActive(checked === true)} aria-label="Active" className="mt-0.5" /><span className="space-y-0.5">Active<span className="block text-xs font-normal text-muted-foreground">Inactive cities stay on existing stores but can&apos;t be newly assigned.</span></span></label></div><DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!valid} onClick={() => onSave({ id: city?.id ?? `CITY-${Date.now()}`, name: cityName.trim(), state: stateName, lat: Number(lat), lng: Number(lng), active })}><Check />Save</Button></DialogFooter></DialogContent></Dialog>;
}

export function CitiesPage() {
  const [rowsState, setRowsState] = useState<CityRecord[]>(initialCities);
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState<CityRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const search = query.toLowerCase();
  const rows = rowsState.filter((item) => (!search || item.name.toLowerCase().includes(search) || item.state.toLowerCase().includes(search)) && (stateFilter === "all" || item.state === stateFilter) && (statusFilter === "all" || (statusFilter === "active") === item.active));
  const save = (city: CityRecord) => {
    setRowsState((current) => current.some((item) => item.id === city.id) ? current.map((item) => item.id === city.id ? city : item) : [city, ...current]);
    toast.success(editing ? "City updated" : "City added", { description: `${city.name}, ${city.state} at ${city.lat}, ${city.lng}.` });
    setDialogOpen(false);
  };
  return <>
    <PageHeader title="Cities" description="Serviceable cities with their coordinates — used for offline store discovery radius and city-level merchant targeting." actions={<Button onClick={() => { setEditing(null); setDialogOpen(true); }}><Plus />Add new</Button>} />
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
      <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search cities" className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by city or state…" /></div>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />State: {stateFilter === "all" ? "All" : stateFilter}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56 border-border bg-card"><DropdownMenuItem onSelect={() => setStateFilter("all")}>State: All</DropdownMenuItem>{cityStates.map((item) => <DropdownMenuItem key={item} onSelect={() => setStateFilter(item)}>{item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Status: {statusFilter === "all" ? "All" : statusFilter === "active" ? "Active" : "Inactive"}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44 border-border bg-card">{["all", "active", "inactive"].map((item) => <DropdownMenuItem key={item} onSelect={() => setStatusFilter(item)}>Status: {item === "all" ? "All" : item === "active" ? "Active" : "Inactive"}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
      {(query || stateFilter !== "all" || statusFilter !== "all") && <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setStateFilter("all"); setStatusFilter("all"); }} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    </div>
    <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-175 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr><th className="sticky top-0 bg-muted/95 py-2">City</th><th className="sticky top-0 bg-muted/95 py-2">State</th><th className="sticky top-0 bg-muted/95 py-2">Latitude</th><th className="sticky top-0 bg-muted/95 py-2">Longitude</th><th className="sticky top-0 bg-muted/95 py-2">Status</th><th className="sticky top-0 bg-muted/95 py-2 text-right">Actions</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id} className="border-t border-border hover:bg-muted/50"><td className="font-semibold">{item.name}</td><td className="text-muted-foreground">{item.state}</td><td className="font-mono text-xs">{item.lat}</td><td className="font-mono text-xs">{item.lng}</td><td><StatusBadge status={item.active ? "Active" : "Inactive"} /></td><td className="text-right"><span className="inline-flex"><IconButton className="h-7 w-7" label={`Edit ${item.name}`} onClick={() => { setEditing(item); setDialogOpen(true); }}><Pencil className="h-3.5 w-3.5" /></IconButton><ConfirmDeleteDialog itemType="City" name={item.name} onConfirm={() => { setRowsState((current) => current.filter((row) => row.id !== item.id)); toast.success("City deleted", { description: `${item.name} was removed.` }); }}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete ${item.name}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog></span></td></tr>)}</tbody></table>{!rows.length && <div className="px-6 py-14 text-center"><Building2 className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No cities found</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>}</div></div>
    <TransactionPagination count={rows.length} />
    {dialogOpen && <CityDialog key={editing?.id ?? "new"} city={editing} onClose={() => setDialogOpen(false)} onSave={save} />}
  </>;
}
