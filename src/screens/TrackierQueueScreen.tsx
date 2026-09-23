import { PageHeader } from "@/components/admin/PageHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { tabTriggerClass } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";
import type { Category, StagedCampaign, SyncRun } from "@/types/admin";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Filter,
  Lock,
  RefreshCw,
  RotateCcw,
  Search,
  Store,
  X,
} from "lucide-react";
import { useState } from "react";

export function RejectCampaignDialog({
  campaign,
  onReject,
  children,
  campaignRejectionReasons,
}: {
  campaign: StagedCampaign;
  onReject: (campaign: StagedCampaign, reason: string, note: string) => void;
  children: React.ReactNode;
  campaignRejectionReasons: readonly string[];
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(campaignRejectionReasons[0] as string);
  const [note, setNote] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg">Reject staged campaign</DialogTitle>
          <DialogDescription>
            Campaign {campaign.trackierId} ({campaign.name}) will be removed from the import queue
            and will not be published to the catalog.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium">
            Rejection reason <span className="text-destructive">*</span>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {campaignRejectionReasons.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            Rejection note <span className="font-normal text-muted-foreground">(optional)</span>
            <Textarea
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add internal context for this decision…"
            />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onReject(campaign, reason, note);
              setOpen(false);
            }}
          >
            Reject campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function StagedField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5 text-xs font-semibold uppercase text-muted-foreground">
      {label}
      <div className="font-sans text-sm normal-case">{children}</div>
    </label>
  );
}

export function CampaignCard({
  campaign,
  categories,
  onChange,
  onApprove,
  onReject,
  campaignRejectionReasons,
}: {
  campaign: StagedCampaign;
  categories: Category[];
  onChange: (campaign: StagedCampaign) => void;
  onApprove: (campaign: StagedCampaign) => void;
  onReject: (campaign: StagedCampaign, reason: string, note: string) => void;
  campaignRejectionReasons: readonly string[];
}) {
  const set = <K extends keyof StagedCampaign>(key: K, value: StagedCampaign[K]) =>
    onChange({ ...campaign, [key]: value });
  const mapped = Boolean(campaign.categoryId);
  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-card">
      <div className="flex flex-col gap-2 border-b border-border pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {campaign.logo ? (
            <img
              src={campaign.logo}
              alt=""
              className="h-8 w-8 rounded border border-border bg-muted object-contain"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded border border-border bg-muted text-muted-foreground">
              <Store className="h-4 w-4" />
            </span>
          )}
          <span className="font-heading text-base font-bold">{campaign.name}</span>
          <span className="font-mono text-xs text-muted-foreground">
            Trackier {campaign.trackierId}
          </span>
        </div>
        {!mapped && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold status-pending">
            <AlertTriangle className="h-3 w-3" />
            Category unmapped — raw: {campaign.rawCategory}
          </span>
        )}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <StagedField label="Name">
          <Input value={campaign.name} onChange={(event) => set("name", event.target.value)} />
        </StagedField>
        <StagedField label="Category">
          <Select
            value={campaign.categoryId || "none"}
            onValueChange={(value) => set("categoryId", value === "none" ? "" : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a category…</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category.channel.toUpperCase()})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </StagedField>
        <div className="md:col-span-2">
          <StagedField label="About (cleaned from Trackier's description)">
            <Textarea
              rows={3}
              value={campaign.about}
              onChange={(event) => set("about", event.target.value)}
            />
          </StagedField>
        </div>
        <StagedField label="Logo URL">
          <Input value={campaign.logo} onChange={(event) => set("logo", event.target.value)} />
        </StagedField>
        <StagedField label="Website URL">
          <Input
            value={campaign.website}
            onChange={(event) => set("website", event.target.value)}
          />
        </StagedField>
        <StagedField label="Tracking time (minutes)">
          <Input
            value={campaign.trackingTime}
            onChange={(event) => set("trackingTime", event.target.value)}
          />
        </StagedField>
        <StagedField label="Approval time (days)">
          <Input
            value={campaign.approvalTime}
            onChange={(event) => set("approvalTime", event.target.value)}
          />
        </StagedField>
        <StagedField label="Display order (from Trackier Priority)">
          <Input
            value={campaign.displayOrder}
            onChange={(event) => set("displayOrder", event.target.value)}
          />
        </StagedField>
        <StagedField label="Attribution">
          <Select value={campaign.attribution} onValueChange={(value) => set("attribution", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Web", "App", "Web & App"].map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </StagedField>
      </div>
      <p className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="h-3 w-3" />
        Network tracking URL (verbatim, not editable):{" "}
        <span className="font-mono text-foreground">{campaign.trackingUrl}</span>
      </p>
      <div className="mt-4">
        <h3 className="text-[11px] font-bold uppercase text-muted-foreground">
          Offers ({campaign.offers.length})
        </h3>
        <div className="mt-2 space-y-3">
          {campaign.offers.map((offer, index) => (
            <div key={index} className="rounded-lg border border-border bg-muted/40 p-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <StagedField label="Headline">
                    <Input readOnly value={offer.headline} className="bg-card" />
                  </StagedField>
                </div>
                <div className="md:col-span-2">
                  <StagedField label="Terms (cleaned from Trackier's kpi)">
                    <Textarea readOnly rows={3} value={offer.terms} className="bg-card" />
                  </StagedField>
                </div>
                <StagedField label="Discount">
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-border bg-card px-2 py-1 text-xs font-semibold">
                      {offer.discountType}
                    </span>
                    <span className="font-heading text-base font-bold">{offer.discountValue}</span>
                  </div>
                </StagedField>
                <StagedField label="Commission (informational)">
                  <div className="flex items-center gap-2">
                    <span className="rounded border border-border bg-card px-2 py-1 text-xs font-semibold">
                      {offer.commissionType}
                    </span>
                    <span className="font-heading text-base font-bold">
                      {offer.commissionValue}
                    </span>
                  </div>
                </StagedField>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-3">
        <Button size="sm" onClick={() => onApprove(campaign)}>
          <Check />
          Approve
        </Button>
        <RejectCampaignDialog
          campaign={campaign}
          onReject={onReject}
          campaignRejectionReasons={campaignRejectionReasons}
        >
          <Button size="sm" variant="destructive">
            <X />
            Reject
          </Button>
        </RejectCampaignDialog>
      </div>
    </article>
  );
}

export function SyncRunsTable({ runs }: { runs: SyncRun[] }) {
  const [status, setStatus] = useState("all");
  const [trigger, setTrigger] = useState("all");
  const rows = runs.filter(
    (run) =>
      (status === "all" || run.status === status) && (trigger === "all" || run.trigger === trigger),
  );
  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row">
        <label className="flex-1 space-y-1.5 text-xs font-semibold uppercase text-muted-foreground sm:max-w-52">
          Status
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="SUCCEEDED">Succeeded</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </label>
        <label className="flex-1 space-y-1.5 text-xs font-semibold uppercase text-muted-foreground sm:max-w-52">
          Triggered by
          <Select value={trigger} onValueChange={setTrigger}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="MANUAL">Manual</SelectItem>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="table-scrollbar overflow-x-auto">
          <table className="w-full min-w-215 text-left text-sm">
            <thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground">
              <tr>
                <th>Started</th>
                <th>Triggered by</th>
                <th>Status</th>
                <th>Fetched</th>
                <th>New staged</th>
                <th>Updated</th>
                <th>Field-locked skips</th>
                <th>Errors</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((run) => (
                <tr key={run.id} className="border-t border-border hover:bg-muted/50">
                  <td className="font-medium">{run.started}</td>
                  <td>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                        run.trigger === "MANUAL"
                          ? "bg-muted text-muted-foreground"
                          : "status-requested",
                      )}
                    >
                      {run.trigger}
                    </span>
                  </td>
                  <td>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                        run.status === "SUCCEEDED" ? "status-approved" : "status-rejected",
                      )}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td>{run.fetched}</td>
                  <td>{run.staged}</td>
                  <td>{run.updated}</td>
                  <td>{run.skips}</td>
                  <td>
                    {run.errors.length === 0 ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="rounded-full bg-destructive-soft px-2 py-0.5 text-xs font-semibold text-destructive">
                            {run.errors.length} error(s)
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg bg-card">
                          <DialogHeader>
                            <DialogTitle className="font-heading text-lg">Sync errors</DialogTitle>
                            <DialogDescription>
                              {run.started} · {run.trigger.toLowerCase()} run
                            </DialogDescription>
                          </DialogHeader>
                          <ul className="space-y-2 text-sm">
                            {run.errors.map((error) => (
                              <li
                                key={error}
                                className="rounded-md border border-destructive-border bg-destructive-soft p-2 text-destructive"
                              >
                                {error}
                              </li>
                            ))}
                          </ul>
                        </DialogContent>
                      </Dialog>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {rows.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">No sync runs match these filters.</p>
      )}
    </div>
  );
}

export function SyncConfirmDialog({
  syncing,
  onSync,
  children,
}: {
  syncing: boolean;
  onSync: () => void;
  children: React.ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="border-border bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading">
            Trigger Trackier campaign sync?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will query the Trackier API for newly active and updated campaigns. Staged
            campaigns and pending reviews will be updated. Do you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-teal-600 text-white hover:bg-teal-700" onClick={onSync}>
            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
            Confirm &amp; Sync
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function TrackierQueue({
  campaigns,
  runs,
  categories,
  syncing,
  onSync,
  onChange,
  onApprove,
  onReject,
  campaignRejectionReasons,
}: {
  campaigns: StagedCampaign[];
  runs: SyncRun[];
  categories: Category[];
  syncing: boolean;
  onSync: () => void;
  onChange: (campaign: StagedCampaign) => void;
  onApprove: (campaign: StagedCampaign) => void;
  onReject: (campaign: StagedCampaign, reason: string, note: string) => void;
  campaignRejectionReasons: readonly string[];
}) {
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");
  const [mapping, setMapping] = useState("all");
  const categoryLabel = (campaign: StagedCampaign) =>
    categories.find((category) => category.id === campaign.categoryId)?.name ??
    campaign.rawCategory;
  const pending = campaigns
    .filter(
      (campaign) =>
        !query ||
        `${campaign.name} ${campaign.trackierId} ${categoryLabel(campaign)}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .filter(
      (campaign) =>
        mapping === "all" ||
        (mapping === "mapped" ? Boolean(campaign.categoryId) : !campaign.categoryId),
    );
  return (
    <>
      <PageHeader
        title="Trackier Import Queue"
        description="Review and approve affiliate campaigns fetched from Trackier API before publishing them to the live catalog."
        actions={
          <SyncConfirmDialog syncing={syncing} onSync={onSync}>
            <Button disabled={syncing}>
              <RefreshCw className={cn(syncing && "animate-spin")} />
              {syncing ? "Syncing…" : "Sync Now"}
            </Button>
          </SyncConfirmDialog>
        }
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger value="pending" className={tabTriggerClass}>
            Pending Review ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="runs" className={tabTriggerClass}>
            Recent Sync Runs ({runs.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-0">
          <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
            <div className="relative min-w-[280px] flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="w-full pl-9"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by campaign name, Trackier ID, or category…"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="shrink-0">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  Mapping:{" "}
                  {mapping === "all" ? "All" : mapping === "mapped" ? "Mapped" : "Unmapped"}
                  <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-border bg-card">
                <DropdownMenuItem onSelect={() => setMapping("all")}>Mapping: All</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setMapping("mapped")}>
                  Mapping: Mapped
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setMapping("unmapped")}>
                  Mapping: Unmapped
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {(query || mapping !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setMapping("all");
                }}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" />
                Reset
              </Button>
            )}
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No staged campaigns waiting for review.</p>
          ) : (
            <div className="space-y-4">
              {pending.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  categories={categories}
                  onChange={onChange}
                  onApprove={onApprove}
                  onReject={onReject}
                  campaignRejectionReasons={campaignRejectionReasons}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="runs" className="mt-0">
          <SyncRunsTable runs={runs} />
        </TabsContent>
      </Tabs>
    </>
  );
}
