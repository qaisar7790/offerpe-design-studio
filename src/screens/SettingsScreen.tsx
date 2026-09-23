import { ConfirmSaveDialog } from "@/components/admin/ConfirmSaveDialog";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { Merchant, Withdrawal } from "@/types/admin";
import { Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SettingsCard({ title, description, children, footer }: { title: string; description: string; children: React.ReactNode; footer: React.ReactNode }) {
  return <section className="rounded-lg border border-border bg-card shadow-card">
    <div className="border-b border-border px-5 py-4">
      <h2 className="font-heading text-base font-bold">{title}</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
    <div className="grid gap-4 p-5 sm:grid-cols-2">{children}</div>
    <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3.5">{footer}</div>
  </section>;
}

export function OnboardingAppCard({ app }: { app: string }) {
  const [state, setState] = useState({ interval: "3", skip: true });
  const [saved, setSaved] = useState({ interval: "3", skip: true });
  const dirty = JSON.stringify(state) !== JSON.stringify(saved);
  return <div className="rounded-lg border border-border bg-background p-4">
    <h3 className="font-heading text-sm font-bold">{app}</h3>
    <label className="mt-3 block space-y-1.5 text-sm font-medium">Auto-swipe interval (seconds) <span className="text-destructive">*</span>
      <Input type="number" min="1" value={state.interval} onChange={(event) => setState((current) => ({ ...current, interval: event.target.value }))} />
    </label>
    <label className="mt-3 flex items-center gap-2 text-sm font-medium">
      <Checkbox checked={state.skip} onCheckedChange={(checked) => setState((current) => ({ ...current, skip: checked === true }))} aria-label={`Show Skip button on ${app}`} />
      Show Skip button
    </label>
    <div className="mt-4 flex items-center gap-2">
      <ConfirmSaveDialog title={`Save ${app} onboarding settings?`} disabled={!dirty} summary={[{ label: "Auto-swipe interval", value: `${state.interval || "0"} sec` }, { label: "Skip button", value: state.skip ? "Shown" : "Hidden" }]} onConfirm={() => { setSaved(state); toast.success(`${app} onboarding saved`, { description: `Auto-swipe every ${state.interval}s · Skip ${state.skip ? "shown" : "hidden"}.` }); }}>
        <Button disabled={!dirty}><Check />Save</Button>
      </ConfirmSaveDialog>
      <Button variant="destructiveSoft" disabled={!dirty} onClick={() => setState(saved)}>Cancel</Button>
    </div>
  </div>;
}

export function SettingsPage() {
  const [withdrawal, setWithdrawal] = useState({ minimum: "100", saved: "100" });
  const [referral, setReferral] = useState({ referrer: "50", referred: "50", active: true });
  const [referralSaved, setReferralSaved] = useState({ referrer: "50", referred: "50", active: true });
  const [sync, setSync] = useState({ passthrough: "60", hours: "2", enabled: false });
  const [syncSaved, setSyncSaved] = useState({ passthrough: "60", hours: "2", enabled: false });

  const withdrawalDirty = withdrawal.minimum !== withdrawal.saved;
  const referralDirty = JSON.stringify(referral) !== JSON.stringify(referralSaved);
  const syncDirty = JSON.stringify(sync) !== JSON.stringify(syncSaved);

  return <>
    <PageHeader title="Settings" description="Platform-wide defaults for payouts, referrals and the Trackier catalog sync. Every change asks for a second confirmation before it goes live." />
    <div className="grid gap-5">
      <SettingsCard title="Withdrawal Settings" description="Controls the smallest balance a user can cash out from their OfferPe wallet."
        footer={<>
          <Button variant="destructiveSoft" disabled={!withdrawalDirty} onClick={() => setWithdrawal((current) => ({ ...current, minimum: current.saved }))}>Cancel</Button>
          <ConfirmSaveDialog title="Save withdrawal settings?" disabled={!withdrawalDirty} summary={[{ label: "Minimum withdrawal amount", value: `₹${withdrawal.minimum || "0"}` }]} onConfirm={() => { setWithdrawal((current) => ({ ...current, saved: current.minimum })); toast.success("Withdrawal settings saved", { description: `Minimum withdrawal is now ₹${withdrawal.minimum}.` }); }}>
            <Button disabled={!withdrawalDirty}><Check />Save</Button>
          </ConfirmSaveDialog>
        </>}>
        <label className="space-y-1.5 text-sm font-medium">Minimum withdrawal amount (₹) <span className="text-destructive">*</span>
          <Input type="number" min="1" value={withdrawal.minimum} onChange={(event) => setWithdrawal((current) => ({ ...current, minimum: event.target.value }))} />
          <span className="block text-xs font-normal text-muted-foreground">Requests below this amount are blocked in the app.</span>
        </label>
      </SettingsCard>

      <SettingsCard title="Referral Settings" description="Bonus credited to the referrer and to the new user once their first qualifying order is confirmed."
        footer={<>
          <Button variant="destructiveSoft" disabled={!referralDirty} onClick={() => setReferral(referralSaved)}>Cancel</Button>
          <ConfirmSaveDialog title="Save referral settings?" disabled={!referralDirty} summary={[{ label: "Referrer bonus", value: `₹${referral.referrer || "0"}` }, { label: "Referred user bonus", value: `₹${referral.referred || "0"}` }, { label: "Program", value: referral.active ? "Active" : "Paused" }]} onConfirm={() => { setReferralSaved(referral); toast.success("Referral settings saved", { description: referral.active ? `Referrer ₹${referral.referrer} · new user ₹${referral.referred}.` : "Referral program is now paused." }); }}>
            <Button disabled={!referralDirty}><Check />Save</Button>
          </ConfirmSaveDialog>
        </>}>
        <label className="space-y-1.5 text-sm font-medium">Referrer bonus amount (₹) <span className="text-destructive">*</span>
          <Input type="number" min="0" value={referral.referrer} onChange={(event) => setReferral((current) => ({ ...current, referrer: event.target.value }))} />
        </label>
        <label className="space-y-1.5 text-sm font-medium">Referred (new user) bonus amount (₹) <span className="text-destructive">*</span>
          <Input type="number" min="0" value={referral.referred} onChange={(event) => setReferral((current) => ({ ...current, referred: event.target.value }))} />
        </label>
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2.5 sm:col-span-2">
          <div>
            <p className="text-sm font-semibold">Program active</p>
            <p className="text-xs text-muted-foreground">When paused, referral codes stop crediting new bonuses.</p>
          </div>
          <Switch checked={referral.active} onCheckedChange={(checked) => setReferral((current) => ({ ...current, active: checked }))} aria-label="Referral program active" />
        </div>
      </SettingsCard>

      <SettingsCard title="Trackier Sync Settings" description="Global defaults for the Trackier catalog sync. A merchant's own passthrough override always takes priority over the default set here."
        footer={<>
          <Button variant="destructiveSoft" disabled={!syncDirty} onClick={() => setSync(syncSaved)}>Cancel</Button>
          <ConfirmSaveDialog title="Save Trackier sync settings?" disabled={!syncDirty} summary={[{ label: "Default passthrough", value: `${sync.passthrough || "0"}%` }, { label: "Minimum hours between syncs", value: `${sync.hours || "1"} hrs` }, { label: "Scheduled sync", value: sync.enabled ? "Enabled" : "Disabled" }]} onConfirm={() => { setSyncSaved(sync); toast.success("Sync settings saved", { description: `Default passthrough ${sync.passthrough}% · scheduled sync ${sync.enabled ? "enabled" : "disabled"}.` }); }}>
            <Button disabled={!syncDirty}><Check />Save</Button>
          </ConfirmSaveDialog>
        </>}>
        <label className="space-y-1.5 text-sm font-medium">Default passthrough % <span className="text-destructive">*</span>
          <Input type="number" min="0" max="100" value={sync.passthrough} onChange={(event) => setSync((current) => ({ ...current, passthrough: event.target.value }))} />
          <span className="block text-xs font-normal text-muted-foreground">Applies to any merchant without its own override.</span>
        </label>
        <label className="space-y-1.5 text-sm font-medium">Minimum hours between scheduled syncs <span className="text-destructive">*</span>
          <Input type="number" min="1" value={sync.hours} onChange={(event) => setSync((current) => ({ ...current, hours: event.target.value }))} />
          <span className="block text-xs font-normal text-muted-foreground">A floor of 1 hour is enforced regardless of this value.</span>
        </label>
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/30 px-3 py-2.5 sm:col-span-2">
          <div>
            <p className="text-sm font-semibold">Scheduled sync enabled</p>
            <p className="text-xs text-muted-foreground">Runs the Trackier catalog import automatically on the interval above.</p>
          </div>
          <Switch checked={sync.enabled} onCheckedChange={(checked) => setSync((current) => ({ ...current, enabled: checked }))} aria-label="Scheduled sync enabled" />
        </div>
      </SettingsCard>

      <section className="rounded-lg border border-border bg-card shadow-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-heading text-base font-bold">Onboarding Settings</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">Per-app auto-swipe timing and whether the Skip button is offered on the onboarding carousel.</p>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <OnboardingAppCard app="Consumer App" />
          <OnboardingAppCard app="Merchant App" />
        </div>
      </section>
    </div>
  </>;
}
