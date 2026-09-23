import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { compareVersions, semverPattern } from "@/lib/admin-utils";
import type { AppBuild, Merchant } from "@/types/admin";
import { AlertTriangle, Check, Smartphone, Store, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AppVersionCard({ build, onSave }: { build: AppBuild; onSave: (build: AppBuild) => void }) {
  const [draft, setDraft] = useState(build);
  const dirty = JSON.stringify(draft) !== JSON.stringify(build);
  const update = <K extends keyof AppBuild>(key: K, value: AppBuild[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const minValid = semverPattern.test(draft.minVersion);
  const latestValid = semverPattern.test(draft.latestVersion);
  const orderValid = !minValid || !latestValid || compareVersions(draft.minVersion, draft.latestVersion) <= 0;
  const canSave = dirty && minValid && latestValid && orderValid;
  const blocking = draft.forceUpdate && minValid && latestValid;

  return <section className="flex flex-col rounded-lg border border-border bg-card shadow-card">
    <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-primary"><Smartphone className="h-4 w-4" /></span>
        <div>
          <h2 className="font-heading text-sm font-bold uppercase tracking-wide">{build.app} — {build.platform}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Live: v{build.latestVersion} · minimum v{build.minVersion}</p>
        </div>
      </div>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${blocking ? "status-rejected" : "status-active"}`}>{blocking ? "Force update" : "Soft prompt"}</span>
    </div>
    <div className="grid gap-4 p-5 sm:grid-cols-2">
      <label className="space-y-1.5 text-sm font-medium">Minimum supported version <span className="text-destructive">*</span>
        <Input value={draft.minVersion} onChange={(event) => update("minVersion", event.target.value)} placeholder="1.0.0" aria-invalid={!minValid} />
        {!minValid && <span className="block text-xs font-normal text-destructive">Use a semantic version like 3.4.0</span>}
      </label>
      <label className="space-y-1.5 text-sm font-medium">Latest version <span className="text-destructive">*</span>
        <Input value={draft.latestVersion} onChange={(event) => update("latestVersion", event.target.value)} placeholder="1.0.0" aria-invalid={!latestValid} />
        {!latestValid && <span className="block text-xs font-normal text-destructive">Use a semantic version like 3.6.2</span>}
      </label>
      {!orderValid && <p className="sm:col-span-2 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"><AlertTriangle className="h-3.5 w-3.5" />Minimum version cannot be higher than the latest version.</p>}
      <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Update message (shown to the user)
        <Textarea className="min-h-24 leading-6" maxLength={240} value={draft.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell users why they should update…" />
        <span className="block text-right text-xs font-normal text-muted-foreground">{draft.message.length}/240</span>
      </label>
      <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Store URL <span className="font-normal text-muted-foreground">(leave blank until a real store listing exists)</span>
        <Input value={draft.storeUrl} onChange={(event) => update("storeUrl", event.target.value)} placeholder="https://…" />
      </label>
      <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2.5 sm:col-span-2">
        <div>
          <p className="text-sm font-semibold">Block older builds</p>
          <p className="text-xs text-muted-foreground">Users below v{draft.minVersion || "—"} see a full-screen prompt they cannot dismiss.</p>
        </div>
        <Switch checked={draft.forceUpdate} onCheckedChange={(checked) => update("forceUpdate", checked)} aria-label={`Block older ${build.app} ${build.platform} builds`} />
      </div>
      <div className="sm:col-span-2 rounded-lg border border-border bg-muted/40 p-4">
        <div className="mb-2 text-xs font-bold uppercase text-muted-foreground">In-app preview</div>
        <p className="font-heading text-sm font-bold">{blocking ? "Update required" : "Update available"}</p>
        <p className="mt-1 text-sm leading-6 text-foreground">{draft.message || "No update message set."}</p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Update now</span>
          {!blocking && <span className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">Later</span>}
        </div>
      </div>
    </div>
    <div className="mt-auto flex flex-col gap-2 border-t border-border px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">Last updated {build.updatedAt} by {build.updatedBy}</p>
      <div className="flex gap-2">
        <Button variant="destructiveSoft" disabled={!dirty} onClick={() => setDraft(build)}>Cancel</Button>
        <Button disabled={!canSave} onClick={() => { onSave({ ...draft, updatedAt: "21 Sep 2026, 07:47 PM", updatedBy: "Qaisar Farooq" }); toast.success(`${build.app} ${build.platform} versions saved`, { description: `Minimum v${draft.minVersion} · latest v${draft.latestVersion}.` }); }}><Check />Save</Button>
      </div>
    </div>
  </section>;
}

export function AppVersionsPage({ builds, onSave }: { builds: AppBuild[]; onSave: (build: AppBuild) => void }) {
  const blockingCount = builds.filter((build) => build.forceUpdate).length;
  const missingStore = builds.filter((build) => !build.storeUrl).length;
  return <>
    <PageHeader title="App Versions" description="Checked by both apps at boot, before login. A minimum supported version above a user's installed build shows a full-screen prompt they cannot dismiss. A latest version above their build shows a dismissible banner instead." />
    <div className="mb-6 grid gap-3 sm:grid-cols-3">
      {[
        { label: "Build targets", value: `${builds.length}`, hint: "Consumer and Merchant apps across iOS and Android" },
        { label: "Forcing update", value: `${blockingCount}`, hint: "Older builds blocked at boot" },
        { label: "Store URL pending", value: `${missingStore}`, hint: "Update prompt has no store link yet" },
      ].map((stat) => <div key={stat.label} className="rounded-lg border border-border bg-card p-4 shadow-card">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
        <p className="mt-1 font-heading text-2xl font-bold">{stat.value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
      </div>)}
    </div>
    <div className="grid gap-5 xl:grid-cols-2">
      {builds.map((build) => <AppVersionCard key={build.id + build.updatedAt} build={build} onSave={onSave} />)}
    </div>
  </>;
}
