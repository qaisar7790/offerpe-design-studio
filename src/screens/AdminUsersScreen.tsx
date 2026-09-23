import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { CopyButton } from "@/components/admin/CopyButton";
import { IconButton } from "@/components/admin/IconButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allPermissionKeys } from "@/data/mockData";
import { cn } from "@/lib/utils";
import type { AdminRole, AdminUser, AdminUserStatus, Status } from "@/types/admin";
import { ArrowDown, ArrowUp, Check, ChevronDown, Filter, Mail, Pencil, Plus, RotateCcw, Search, ShieldCheck, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AdminUserDialog({ open, onOpenChange, admin, roles, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; admin: AdminUser | null; roles: AdminRole[]; onSave: (admin: AdminUser, isNew: boolean) => void }) {
  const isNew = !admin;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [ready, setReady] = useState(false);
  if (open && !ready) { setReady(true); setName(admin?.name ?? ""); setEmail(admin?.email ?? ""); setRole(admin?.role ?? ""); }
  const close = (nextOpen: boolean) => { onOpenChange(nextOpen); if (!nextOpen) setReady(false); };
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit = Boolean(name.trim() && role && (isNew ? emailValid : true));
  return <Dialog open={open} onOpenChange={close}><DialogContent className="max-w-xl bg-card">
    <DialogHeader><DialogTitle className="font-heading text-xl">{isNew ? "Invite admin" : "Edit admin"}</DialogTitle><DialogDescription>{isNew ? "They'll receive an email invite to set their own password. Public email sign-up stays disabled for everyone else." : admin?.email}</DialogDescription></DialogHeader>
    <div className="grid gap-5">
      {isNew && <label className="space-y-1.5 text-sm font-medium">Email <span className="text-destructive">*</span><Input aria-label="Admin email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@offerpe.com" /></label>}
      <label className="space-y-1.5 text-sm font-medium">Full name <span className="text-destructive">*</span><Input aria-label="Admin full name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Neha Pillai" /></label>
      <div className="space-y-1.5 text-sm font-medium">Role <span className="text-destructive">*</span>
        <Select value={role} onValueChange={setRole}><SelectTrigger aria-label="Admin role"><SelectValue placeholder="Select a role" /></SelectTrigger><SelectContent>{roles.map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}</SelectContent></Select>
        {role && <p className="text-xs font-normal text-muted-foreground">{roles.find((item) => item.name === role)?.permissions.length ?? 0} of {allPermissionKeys.length} permissions granted by this role.</p>}
      </div>
    </div>
    <DialogFooter><Button variant="destructiveSoft" onClick={() => close(false)}>Cancel</Button><Button disabled={!canSubmit} onClick={() => { onSave({ id: admin?.id ?? `ADM-${String(Date.now()).slice(-4)}`, name: name.trim(), email: isNew ? email.trim() : admin!.email, role, status: admin?.status ?? "Invited", lastActive: admin?.lastActive ?? "—", created: admin?.created ?? "21 Sep 2026" }, isNew); close(false); }}>{isNew ? <><Mail />Send invite</> : <><Check />Save</>}</Button></DialogFooter>
  </DialogContent></Dialog>;
}

export function AdminUsersPage({ admins, roles, onSave, onDelete }: { admins: AdminUser[]; roles: AdminRole[]; onSave: (admin: AdminUser, isNew: boolean) => void; onDelete: (admin: AdminUser) => void }) {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState<AdminUserStatus | "all">("all");
  const [sortDesc, setSortDesc] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const search = query.toLowerCase();
  const rows = admins
    .filter((admin) => (!search || `${admin.name} ${admin.email} ${admin.id}`.toLowerCase().includes(search)) && (role === "all" || admin.role === role) && (status === "all" || admin.status === status))
    .sort((a, b) => sortDesc ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
  const hasFilters = Boolean(query || role !== "all" || status !== "all");
  const openInvite = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (admin: AdminUser) => { setEditing(admin); setDialogOpen(true); };
  const statusClass = (value: AdminUserStatus) => value === "Active" ? "status-active" : value === "Invited" ? "status-requested" : "status-rejected";
  return <><PageHeader title="Admins" description="Portal accounts with invite-only access. Assign a role to control exactly what each admin can reach." actions={<Button onClick={openInvite}><Plus />Invite admin</Button>} />
    <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
      <div className="relative min-w-[280px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input aria-label="Search admins" className="w-full pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, or admin ID…" /></div>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><ShieldCheck className="mr-2 h-4 w-4 text-muted-foreground" />Role: {role === "all" ? "All" : role}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-52 border-border bg-card"><DropdownMenuItem onSelect={() => setRole("all")}>Role: All</DropdownMenuItem>{roles.map((item) => <DropdownMenuItem key={item.id} onSelect={() => setRole(item.name)}>{item.name}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
      <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" className="shrink-0"><Filter className="mr-2 h-4 w-4 text-muted-foreground" />Status: {status === "all" ? "All" : status}<ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-44 border-border bg-card">{(["all", "Active", "Invited", "Disabled"] as const).map((item) => <DropdownMenuItem key={item} onSelect={() => setStatus(item === "all" ? "all" : item)}>Status: {item === "all" ? "All" : item}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
      {hasFilters && <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setRole("all"); setStatus("all"); }} className="shrink-0 text-muted-foreground hover:text-foreground"><RotateCcw className="mr-1 h-3.5 w-3.5" />Reset</Button>}
    </div>
    <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar max-w-full overflow-x-auto"><table className="w-max min-w-260 border-separate border-spacing-0 text-left text-sm"><thead className="text-[11px] uppercase text-muted-foreground"><tr>
      <th className="sticky left-0 top-0 z-30 border-b border-border bg-muted/95 px-4 py-2 backdrop-blur shadow-sticky-left"><Button variant="ghost" size="sm" className="-ml-3 h-7 text-[11px] uppercase" onClick={() => setSortDesc(!sortDesc)}>Name {sortDesc ? <ArrowDown className="h-3.5 w-3.5" /> : <ArrowUp className="h-3.5 w-3.5" />}</Button></th>
      {["Admin ID", "Email", "Role", "Status", "Last Active", "Created"].map((label) => <th key={label} className="sticky top-0 z-10 border-b border-border bg-muted/95 px-4 py-2 backdrop-blur">{label}</th>)}
      <th className="sticky right-0 top-0 z-30 border-b border-border bg-muted/95 pr-4 text-right backdrop-blur shadow-sticky-right">Actions</th>
    </tr></thead><tbody>{rows.map((admin) => <tr key={admin.id} className="group hover:bg-muted/50">
      <td className="sticky left-0 z-20 border-b border-border bg-card px-4 py-2 shadow-sticky-left group-hover:bg-muted"><span className="font-heading font-bold">{admin.name}</span></td>
      <td className="border-b border-border font-mono text-xs">{admin.id}</td>
      <td className="border-b border-border"><span className="flex items-center gap-1 text-muted-foreground">{admin.email}<CopyButton value={admin.email} /></span></td>
      <td className="border-b border-border font-semibold">{admin.role}</td>
      <td className="border-b border-border"><span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", statusClass(admin.status))}>{admin.status}</span></td>
      <td className="whitespace-nowrap border-b border-border text-xs text-muted-foreground">{admin.lastActive}</td>
      <td className="whitespace-nowrap border-b border-border text-xs text-muted-foreground">{admin.created}</td>
      <td className="sticky right-0 z-20 border-b border-border bg-card pr-3 text-right shadow-sticky-right group-hover:bg-muted"><span className="inline-flex items-center">
        <IconButton className="h-7 w-7" label={`Edit ${admin.name}`} onClick={() => openEdit(admin)}><Pencil className="h-3.5 w-3.5" /></IconButton>
        {admin.status === "Invited" && <IconButton className="h-7 w-7" label={`Resend invite to ${admin.name}`} onClick={() => toast.success("Invite resent", { description: `A fresh invite email is on its way to ${admin.email}.` })}><Mail className="h-3.5 w-3.5" /></IconButton>}
        {admin.role !== "Owner" && <ConfirmDeleteDialog itemType="Admin" name={admin.name} onConfirm={() => onDelete(admin)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete ${admin.name}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog>}
      </span></td>
    </tr>)}</tbody></table>{!rows.length && <div className="px-6 py-14 text-center"><Users className="mx-auto h-8 w-8 text-muted-foreground" /><h3 className="mt-3 font-heading font-semibold">No admins found</h3><p className="mt-1 text-sm text-muted-foreground">Try changing or resetting the current filters.</p></div>}</div></div>
    <p className="mt-4 text-sm text-muted-foreground">Showing <strong className="text-foreground">{rows.length}</strong> of <strong className="text-foreground">{admins.length}</strong> admins</p>
    <AdminUserDialog open={dialogOpen} onOpenChange={setDialogOpen} admin={editing} roles={roles} onSave={onSave} />
  </>;
}
