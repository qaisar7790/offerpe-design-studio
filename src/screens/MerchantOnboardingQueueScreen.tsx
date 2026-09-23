import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { LayoutToggle } from "@/components/admin/LayoutToggle";
import { MerchantLogo } from "@/components/admin/MerchantLogo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { onboardingRejectionReasons } from "@/data/mockData";
import { tabTriggerClass } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";
import type { Application, Category, Merchant, Review, Status, View } from "@/types/admin";
import { Check, Download, ExternalLink, FileText, RotateCcw, Search, Store, Tag, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

export function ApplicationDetails({ application }: { application: Application }) {
  return <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Applicant</div><div className="mt-0.5 font-medium">{application.owner}</div><div className="text-muted-foreground">{application.phone}</div><div className="text-muted-foreground">{application.email}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Store address</div><div className="mt-0.5">{application.address}</div><div className="text-muted-foreground">{application.city}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Proposed commission</div><div className="mt-0.5 font-heading text-lg font-bold">{application.commission}</div></div>
    <div className="sm:col-span-2 lg:col-span-3"><div className="text-xs font-semibold uppercase text-muted-foreground">Documentation</div><div className="mt-1 flex flex-wrap gap-2">{application.documents.map((doc) => <span key={doc} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium"><FileText className="h-3 w-3" />{doc}</span>)}</div></div>
  </div>;
}

export function RejectApplicationDialog({ application, onReject, children }: { application: Application; onReject: (application: Application, reason: string, note: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(onboardingRejectionReasons[0] as string);
  const [note, setNote] = useState("");
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild>{children}</DialogTrigger><DialogContent className="max-w-lg bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">Reject application</DialogTitle><DialogDescription>{application.store} will not be onboarded. A reason from the Onboarding Rejection Reasons list is required.</DialogDescription></DialogHeader><div className="space-y-4"><label className="block space-y-1.5 text-sm font-medium">Rejection reason <span className="text-destructive">*</span><Select value={reason} onValueChange={setReason}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{onboardingRejectionReasons.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><label className="block space-y-1.5 text-sm font-medium">Admin remarks <span className="font-normal text-muted-foreground">(optional)</span><Textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add internal context for this decision…" /></label></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="destructive" onClick={() => { onReject(application, reason, note); setOpen(false); }}>Reject application</Button></DialogFooter></DialogContent></Dialog>;
}

export function ApplicationHeadline({ application }: { application: Application }) {
  return <div className="flex flex-wrap items-center gap-2">
    <span className="font-heading text-base font-bold">{application.store}</span>
    <span className="inline-flex rounded-full bg-info-soft px-2 py-0.5 text-xs font-semibold text-info">OFFLINE</span>
    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium"><Tag className="h-3 w-3" />{application.category}</span>
    <span className="font-mono text-xs text-muted-foreground">{application.id}</span>
    <span className="text-xs text-muted-foreground">Submitted {application.submitted}</span>
  </div>;
}

export function OnboardingQueue({ applications, onApprove, onReject, onRevert, onDelete }: { applications: Application[]; onApprove: (application: Application) => void; onReject: (application: Application, reason: string, note: string) => void; onRevert: (application: Application) => void; onDelete: (application: Application) => void }) {
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("newest");
  const categories = Array.from(new Set(applications.map((application) => application.category)));
  const parse = (value: string) => new Date(value.replace(",", "")).getTime();
  const applyFilters = (rows: Application[]) => rows
    .filter((application) => !query || `${application.store} ${application.owner} ${application.id} ${application.city}`.toLowerCase().includes(query.toLowerCase()))
    .filter((application) => category === "all" || application.category === category)
    .filter((application) => !from || parse(application.submitted) >= new Date(from).getTime())
    .filter((application) => !to || parse(application.submitted) <= new Date(to).getTime() + 86_400_000)
    .sort((a, b) => sort === "oldest" ? parse(a.submitted) - parse(b.submitted) : sort === "store" ? a.store.localeCompare(b.store) : parse(b.submitted) - parse(a.submitted));
  const pending = useMemo(() => applyFilters(applications.filter((application) => application.status === "Pending")), [applications, query, category, from, to, sort]);
  const reviewed = useMemo(() => applyFilters(applications.filter((application) => application.status !== "Pending" && (status === "all" || application.status === status))), [applications, status, query, category, from, to, sort]);
  const hasFilters = Boolean(query) || status !== "all" || category !== "all" || from || to || sort !== "newest";
  const resetFilters = () => { setQuery(""); setStatus("all"); setCategory("all"); setFrom(""); setTo(""); setSort("newest"); };
  const exportRows = (rows: Application[]) => {
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const header = ["Application ID", "Store", "Category", "Applicant", "Phone", "Email", "City", "Proposed Commission", "Submitted", "Status", "Rejection Reason"];
    const lines = rows.map((application) => [application.id, application.store, application.category, application.owner, application.phone, application.email, application.city, application.commission, application.submitted, application.status, application.reason].map(escape).join(","));
    const url = URL.createObjectURL(new Blob([[header.map(escape).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `offerpe-merchant-onboarding-${tab}.csv`; anchor.click(); URL.revokeObjectURL(url);
    toast.success(`${rows.length} application${rows.length === 1 ? "" : "s"} exported`);
  };
  const activeRows = tab === "pending" ? pending : reviewed;
  const [layout, setLayout] = useState<LayoutMode>("grid");
  const queueTable = (rows: Application[], mode: "pending" | "reviewed") => <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="table-scrollbar overflow-x-auto"><table className="w-full min-w-240 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th className="px-4 py-2">Application ID</th><th>Store</th><th>Category</th><th>Applicant</th><th>City</th><th>Commission</th><th>Submitted</th>{mode === "reviewed" && <th>Status</th>}<th className="pr-4 text-right">Actions</th></tr></thead><tbody>{rows.map((application) => <tr key={application.id} className="border-t border-border hover:bg-muted/50">
    <td className="px-4 py-2 font-mono text-xs">{application.id}</td>
    <td className="font-semibold">{application.store}</td>
    <td className="text-xs text-muted-foreground">{application.category}</td>
    <td>{application.owner}<div className="text-xs text-muted-foreground">{application.phone}</div></td>
    <td className="text-xs text-muted-foreground">{application.city}</td>
    <td className="whitespace-nowrap font-semibold">{application.commission}</td>
    <td className="whitespace-nowrap text-xs text-muted-foreground">{application.submitted}</td>
    {mode === "reviewed" && <td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", application.status === "Approved" ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive")}>{application.status}</span>{application.status === "Rejected" && application.reason && <div className="mt-1 text-xs text-muted-foreground">{application.reason}</div>}</td>}
    <td className="pr-3 text-right"><div className="flex justify-end gap-1">
      <Dialog><DialogTrigger asChild><IconButton className="h-7 w-7" label={`View application ${application.id}`}><ExternalLink className="h-3.5 w-3.5" /></IconButton></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{application.store}</DialogTitle><DialogDescription>Application {application.id} · submitted {application.submitted}</DialogDescription></DialogHeader><ApplicationDetails application={application} /></DialogContent></Dialog>
      {mode === "pending"
        ? <><Button size="sm" className="h-7 px-2.5 text-xs" onClick={() => onApprove(application)}><Check />Approve</Button><RejectApplicationDialog application={application} onReject={onReject}><Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs"><X />Reject</Button></RejectApplicationDialog></>
        : <><IconButton className="h-7 w-7" label={`Re-evaluate application ${application.id}`} onClick={() => onRevert(application)}><RotateCcw className="h-3.5 w-3.5" /></IconButton><ConfirmDeleteDialog itemType="Application" name={application.store} onConfirm={() => onDelete(application)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete application ${application.id}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog></>}
    </div></td>
  </tr>)}</tbody></table></div></div>;
  return <><PageHeader title="Merchant Onboarding Queue" description={'Applications submitted via the web form or the merchant app\'s "Register your store" path. Approving creates a live OFFLINE merchant and grants the applicant immediate merchant-app login — no separate invite step. Rejecting requires a reason from the Onboarding Rejection Reasons list.'} />
    <Tabs value={tab} onValueChange={setTab}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList><TabsTrigger value="pending" className={tabTriggerClass}>Pending Review ({pending.length})</TabsTrigger><TabsTrigger value="reviewed" className={tabTriggerClass}>Reviewed ({reviewed.length})</TabsTrigger></TabsList>
        <LayoutToggle value={layout} onChange={setLayout} />
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search store, applicant, or application ID…" /></div>
        {tab === "reviewed" && <Select value={status} onValueChange={setStatus}><SelectTrigger className="lg:w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select>}
        <Select value={category} onValueChange={setCategory}><SelectTrigger className="lg:w-44"><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All categories</SelectItem>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
        <Input type="date" className="lg:w-40" value={from} onChange={(event) => setFrom(event.target.value)} aria-label="Submitted from" />
        <Input type="date" className="lg:w-40" value={to} onChange={(event) => setTo(event.target.value)} aria-label="Submitted to" />
        <Select value={sort} onValueChange={setSort}><SelectTrigger className="lg:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest submitted</SelectItem><SelectItem value="oldest">Oldest submitted</SelectItem><SelectItem value="store">Store name: A to Z</SelectItem></SelectContent></Select>
        {hasFilters && <Button variant="ghost" onClick={resetFilters}>Reset</Button>}
        <Button variant="outline" size="sm" className="shrink-0" onClick={() => exportRows(activeRows)}><Download className="mr-1 h-3.5 w-3.5" />Export CSV</Button>
      </div>
      <TabsContent value="pending" className="mt-4">
        {pending.length === 0 ? <p className="text-sm text-muted-foreground">No submissions waiting for review.</p>
          : layout === "list" ? queueTable(pending, "pending")
          : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{pending.map((application) => <article key={application.id} className="flex min-h-88 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
            <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40"><MerchantLogo name={application.store} /></div>
            <div className="flex flex-1 flex-col p-4"><div className="flex flex-col gap-3">
              <ApplicationHeadline application={application} />
              <div className="mt-auto flex shrink-0 gap-2 pt-3">
                <Button size="sm" onClick={() => onApprove(application)}><Check />Approve</Button>
                <RejectApplicationDialog application={application} onReject={onReject}><Button size="sm" variant="destructive"><X />Reject</Button></RejectApplicationDialog>
              </div>
            </div>
            <div className="mt-4 grid gap-3 border-t border-border pt-3 text-xs sm:grid-cols-2">
              <div><div className="font-semibold uppercase text-muted-foreground">Applicant</div><div className="mt-1 font-medium text-foreground">{application.owner}</div><div className="text-muted-foreground">{application.phone}</div></div>
              <div><div className="font-semibold uppercase text-muted-foreground">Location</div><div className="mt-1 font-medium text-foreground">{application.city}</div><div className="line-clamp-2 text-muted-foreground">{application.address}</div></div>
              <div><div className="font-semibold uppercase text-muted-foreground">Commission</div><div className="mt-1 font-heading text-base font-bold text-foreground">{application.commission}</div></div>
              <div><div className="font-semibold uppercase text-muted-foreground">Documents</div><div className="mt-1 font-medium text-foreground">{application.documents.length} attached</div></div>
            </div>
            </div>
          </article>)}</div>}
      </TabsContent>
      <TabsContent value="reviewed" className="mt-4">
        {reviewed.length === 0 ? <p className="text-sm text-muted-foreground">Nothing reviewed yet.</p>
          : layout === "list" ? queueTable(reviewed, "reviewed")
          : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{reviewed.map((application) => <article key={application.id} className="flex min-h-88 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
            <div className="flex h-40 items-center justify-center border-b border-border bg-muted/40"><MerchantLogo name={application.store} /></div>
            <div className="flex flex-1 flex-col p-4"><div className="flex flex-col gap-3">
              <div className="min-w-0">
                <ApplicationHeadline application={application} />
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm">
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", application.status === "Approved" ? "bg-success-soft text-success" : "bg-destructive-soft text-destructive")}>{application.status}</span>
                  <span className="text-muted-foreground">{application.owner} · {application.city}</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Dialog><DialogTrigger asChild><Button size="sm" variant="outline"><ExternalLink />View details</Button></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{application.store}</DialogTitle><DialogDescription>Application {application.id} · submitted {application.submitted}</DialogDescription></DialogHeader><ApplicationDetails application={application} />{application.status === "Rejected" && <p className="mt-3 text-sm font-semibold text-destructive">Reason: {application.reason}{application.note && <span className="font-normal text-muted-foreground"> — {application.note}</span>}</p>}</DialogContent></Dialog>
                <Button size="sm" variant="outline" onClick={() => onRevert(application)}><RotateCcw />Re-evaluate</Button>
                <ConfirmDeleteDialog itemType="Application" name={application.store} onConfirm={() => onDelete(application)}><Button size="sm" variant="ghost" className="text-destructive" aria-label={`Delete application ${application.id}`}><Trash2 /></Button></ConfirmDeleteDialog>
              </div>
            </div>
            {application.status === "Rejected" && <p className="mt-2 text-xs font-semibold text-destructive">Reason: {application.reason}{application.note && <span className="font-normal text-muted-foreground"> — {application.note}</span>}</p>}
            </div>
          </article>)}</div>}
      </TabsContent>
    </Tabs>
  </>;
}
