import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { IconButton } from "@/components/admin/IconButton";
import { ImportModal } from "@/components/admin/ImportModal";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { claimRejectionReasons, merchants } from "@/data/mockData";
import { downloadCsv, inr, tabTriggerClass } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";
import { Conversions } from "@/screens/OnlineConversionsScreen";
import type { Claim, Merchant, Review, Status, View } from "@/types/admin";
import { Check, Download, ExternalLink, Image as ImageIcon, RotateCcw, Search, Trash2, UploadCloud, X } from "lucide-react";
import { useMemo, useState } from "react";

export function ClaimDetails({ claim }: { claim: Claim }) {
  return <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Customer</div><div className="mt-0.5 font-medium">{claim.user}</div><div className="font-mono text-xs text-muted-foreground">{claim.userId}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Order</div><div className="mt-0.5 font-mono text-xs">{claim.orderId}</div><div className="text-muted-foreground">Ordered {claim.orderDate}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Claim date</div><div className="mt-0.5">{claim.claimDate}</div><div className="text-muted-foreground">{claim.claimTime}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Click ID</div><div className="mt-0.5 font-mono text-xs">{claim.clickId || "—"}</div><div className="text-muted-foreground">{claim.clickId ? "Matched in click log" : "No click matched"}</div></div>
    <div><div className="text-xs font-semibold uppercase text-muted-foreground">Order value / expected cashback</div><div className="mt-0.5 font-heading text-lg font-bold">{inr(claim.orderValue)}</div><div className="font-semibold text-primary">{inr(claim.expectedCashback)} expected</div></div>
    <div className="sm:col-span-2 lg:col-span-4"><div className="text-xs font-semibold uppercase text-muted-foreground">Customer comment</div><p className="mt-0.5 leading-6">{claim.comment}</p><span className="mt-2 inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium"><ImageIcon className="h-3 w-3" />{claim.proof}</span></div>
  </div>;
}

export function RejectClaimDialog({ claim, onReject, children }: { claim: Claim; onReject: (claim: Claim, reason: string, note: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(claimRejectionReasons[0] as string);
  const [note, setNote] = useState("");
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild>{children}</DialogTrigger><DialogContent className="max-w-lg bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">Reject claim</DialogTitle><DialogDescription>{claim.user}&apos;s claim on order {claim.orderId} will be declined. A reason from the Rejection Reasons list is required and is shown to the customer.</DialogDescription></DialogHeader><div className="space-y-4"><label className="block space-y-1.5 text-sm font-medium">Rejection reason <span className="text-destructive">*</span><Select value={reason} onValueChange={setReason}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{claimRejectionReasons.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label><label className="block space-y-1.5 text-sm font-medium">Admin remarks <span className="font-normal text-muted-foreground">(optional)</span><Textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add internal context for this decision…" /></label></div><DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="destructive" onClick={() => { onReject(claim, reason, note); setOpen(false); }}>Reject claim</Button></DialogFooter></DialogContent></Dialog>;
}

export function CashbackClaims({ claims, onApprove, onReject, onRevert, onDelete }: { claims: Claim[]; onApprove: (claim: Claim) => void; onReject: (claim: Claim, reason: string, note: string) => void; onRevert: (claim: Claim) => void; onDelete: (claim: Claim) => void }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [merchant, setMerchant] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState("newest");
  const [tab, setTab] = useState<"pending" | "reviewed">("pending");
  const [claimImportOpen, setClaimImportOpen] = useState(false);
  const merchantNames = Array.from(new Set(claims.map((claim) => claim.merchant)));
  const pending = claims.filter((claim) => claim.status === "Pending");
  const reviewed = useMemo(() => {
    const parse = (value: string) => new Date(value.replace(",", "")).getTime();
    return claims.filter((claim) => claim.status !== "Pending")
      .filter((claim) => !query || `${claim.orderId} ${claim.id} ${claim.user} ${claim.userId}`.toLowerCase().includes(query.toLowerCase()))
      .filter((claim) => status === "all" || claim.status === status)
      .filter((claim) => merchant === "all" || claim.merchant === merchant)
      .filter((claim) => !from || parse(claim.claimDate) >= new Date(from).getTime())
      .filter((claim) => !to || parse(claim.claimDate) <= new Date(to).getTime() + 86_400_000)
      .sort((a, b) => sort === "oldest" ? parse(a.claimDate) - parse(b.claimDate) : sort === "value-high" ? b.orderValue - a.orderValue : sort === "value-low" ? a.orderValue - b.orderValue : parse(b.claimDate) - parse(a.claimDate));
  }, [claims, query, status, merchant, from, to, sort]);
  const pendingValue = pending.reduce((total, claim) => total + claim.expectedCashback, 0);
  const hasReviewedFilters = Boolean(query || status !== "all" || merchant !== "all" || from || to || sort !== "newest");
  const resetReviewedFilters = () => { setQuery(""); setStatus("all"); setMerchant("all"); setFrom(""); setTo(""); setSort("newest"); };
  return <><PageHeader title="Cashback Claims" description="Online missing-cashback claims raised by customers. Approving accepts a claim into the same online-conversion pipeline a real network webhook uses (source = CLAIM) — it does not itself credit the wallet. Resolve the resulting conversion from Online Conversions to actually credit it." />
    <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold shadow-card"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{pending.length} pending review</span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold shadow-card">Cashback at stake <span className="text-primary">{inr(pendingValue)}</span></span>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-semibold shadow-card">{claims.length - pending.length} reviewed</span>
    </div>
    <Tabs value={tab} onValueChange={(value) => setTab(value as "pending" | "reviewed")}>
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
        <TabsTrigger value="pending" className={tabTriggerClass}>Pending Review ({pending.length})</TabsTrigger>
        <TabsTrigger value="reviewed" className={tabTriggerClass}>Reviewed ({reviewed.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="pending" className="mt-0">
        <section>
        <div className="mb-3 flex flex-wrap items-center justify-end gap-2 rounded-lg border border-border bg-card p-3 shadow-card">
          <Button variant="outline" size="sm" onClick={() => setClaimImportOpen(true)}><UploadCloud className="mr-1 h-3.5 w-3.5" />Import</Button>
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => downloadCsv(pending, "offerpe-claims-pending.csv")}><Download className="mr-1 h-3.5 w-3.5" />Export CSV</Button>
        </div>
        {pending.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">No claims waiting for review.</p>
          : <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-330 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th>Claim ID</th><th>Claim Date</th><th>User ID</th><th>Customer</th><th>Merchant</th><th>Order ID</th><th>Order Date</th><th>Click match</th><th>Order value</th><th>Cashback</th><th>Proof</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{pending.map((claim) => <tr key={claim.id} className="border-t border-border hover:bg-muted/50">
            <td className="px-4 py-2 font-mono text-xs">{claim.id}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{claim.claimDate}<div>{claim.claimTime}</div></td>
            <td className="font-mono text-xs">{claim.userId}</td>
            <td className="font-medium">{claim.user}</td>
            <td className="font-medium">{claim.merchant}</td>
            <td className="font-mono text-xs">{claim.orderId}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{claim.orderDate}</td>
            <td>{claim.clickId ? <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2 py-0.5 text-xs font-semibold text-success"><Check className="h-3 w-3" />Matched</span> : <span className="inline-flex items-center gap-1 rounded-full status-pending px-2 py-0.5 text-xs font-semibold"><X className="h-3 w-3" />No match</span>}</td>
            <td className="whitespace-nowrap font-semibold">{inr(claim.orderValue)}</td>
            <td className="whitespace-nowrap font-semibold text-primary">{inr(claim.expectedCashback)}</td>
            <td><span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium"><ImageIcon className="h-3 w-3" />{claim.proof}</span></td>
            <td className="pr-3 text-right"><div className="flex justify-end gap-1">
              <Dialog><DialogTrigger asChild><IconButton className="h-7 w-7" label={`View claim ${claim.id}`}><ExternalLink className="h-3.5 w-3.5" /></IconButton></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{claim.merchant} · {claim.orderId}</DialogTitle><DialogDescription>Claim {claim.id} · {claim.claimDate}, {claim.claimTime}</DialogDescription></DialogHeader><ClaimDetails claim={claim} /></DialogContent></Dialog>
              <Button size="sm" className="h-7 px-2.5 text-xs" onClick={() => onApprove(claim)}><Check />Approve</Button>
              <RejectClaimDialog claim={claim} onReject={onReject}><Button size="sm" variant="destructive" className="h-7 px-2.5 text-xs"><X />Reject</Button></RejectClaimDialog>
            </div></td>
          </tr>)}</tbody></table></div></div>}
        </section>
      </TabsContent>
      <TabsContent value="reviewed" className="mt-0">
        <section>
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
          <div className="relative min-w-64 flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search order ID, claim ID, or customer…" /></div>
          <Select value={status} onValueChange={setStatus}><SelectTrigger className="lg:w-40"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All statuses</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Rejected">Rejected</SelectItem></SelectContent></Select>
          <Select value={merchant} onValueChange={setMerchant}><SelectTrigger className="lg:w-44"><SelectValue placeholder="Merchant" /></SelectTrigger><SelectContent><SelectItem value="all">All merchants</SelectItem>{merchantNames.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
          <Input type="date" className="lg:w-40" value={from} onChange={(event) => setFrom(event.target.value)} aria-label="Claimed from" />
          <Input type="date" className="lg:w-40" value={to} onChange={(event) => setTo(event.target.value)} aria-label="Claimed to" />
          <Select value={sort} onValueChange={setSort}><SelectTrigger className="lg:w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest submitted</SelectItem><SelectItem value="oldest">Oldest submitted</SelectItem><SelectItem value="value-high">Order value: High to Low</SelectItem><SelectItem value="value-low">Order value: Low to High</SelectItem></SelectContent></Select>
          {hasReviewedFilters && <Button variant="ghost" onClick={resetReviewedFilters}><RotateCcw />Reset</Button>}
          <Button variant="outline" size="sm" className="shrink-0" onClick={() => downloadCsv(reviewed, "offerpe-claims-reviewed.csv")}><Download className="mr-1 h-3.5 w-3.5" />Export CSV</Button>
        </div>
        {reviewed.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">Nothing reviewed yet.</p>
          : <div className="mt-3 overflow-hidden rounded-lg border border-border bg-card shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-330 text-left text-sm"><thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground"><tr><th>Claim ID</th><th>Claim Date</th><th>User ID</th><th>Customer</th><th>Merchant</th><th>Order ID</th><th>Order Date</th><th>Order value</th><th>Cashback</th><th>Status</th><th>Comment</th><th className="pr-4 text-right">Actions</th></tr></thead><tbody>{reviewed.map((claim) => <tr key={claim.id} className="border-t border-border align-top hover:bg-muted/50">
            <td className="px-4 py-2 font-mono text-xs">{claim.id}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{claim.claimDate}<div>{claim.claimTime}</div></td>
            <td className="font-mono text-xs">{claim.userId}</td>
            <td className="font-medium">{claim.user}</td>
            <td>{claim.merchant}</td>
            <td className="font-mono text-xs">{claim.orderId}</td>
            <td className="whitespace-nowrap text-xs text-muted-foreground">{claim.orderDate}</td>
            <td className="font-semibold">{inr(claim.orderValue)}</td>
            <td className="font-semibold text-primary">{inr(claim.expectedCashback)}</td>
            <td><span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-semibold", claim.status === "Approved" ? "status-approved" : "status-rejected")}>{claim.status}</span></td>
            <td className="max-w-48 text-xs text-muted-foreground">{claim.reason || "—"}</td>
            <td className="pr-3 text-right"><div className="flex justify-end gap-1">
              <Dialog><DialogTrigger asChild><IconButton className="h-7 w-7" label={`View claim ${claim.id}`}><ExternalLink className="h-3.5 w-3.5" /></IconButton></DialogTrigger><DialogContent className="max-w-2xl bg-card"><DialogHeader><DialogTitle className="font-heading text-lg">{claim.merchant} · {claim.orderId}</DialogTitle><DialogDescription>Claim {claim.id} · {claim.claimDate}, {claim.claimTime}</DialogDescription></DialogHeader><ClaimDetails claim={claim} />{claim.status === "Rejected" && <p className="mt-3 text-sm font-semibold text-destructive">Reason: {claim.reason}{claim.note && <span className="font-normal text-muted-foreground"> — {claim.note}</span>}</p>}{claim.status === "Approved" && claim.note && <p className="mt-3 text-sm text-muted-foreground">{claim.note}</p>}</DialogContent></Dialog>
              <IconButton className="h-7 w-7" label={`Re-evaluate claim ${claim.id}`} onClick={() => onRevert(claim)}><RotateCcw className="h-3.5 w-3.5" /></IconButton>
              <ConfirmDeleteDialog itemType="Claim" name={claim.id} onConfirm={() => onDelete(claim)}><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label={`Delete claim ${claim.id}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog>
            </div></td>
          </tr>)}</tbody></table></div></div>}
      </section>
      </TabsContent>
    </Tabs>
    <ImportModal open={claimImportOpen} onOpenChange={setClaimImportOpen} />
  </>;
}
