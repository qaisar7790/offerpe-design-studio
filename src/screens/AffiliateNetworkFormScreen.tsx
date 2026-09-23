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
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { affiliateMacroNote } from "@/lib/admin-utils";
import type { AffiliateNetwork } from "@/types/admin";
import { ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AffiliateNetworkFormPage({
  network,
  onCancel,
  onSave,
  onDelete,
}: {
  network: AffiliateNetwork | null;
  onCancel: () => void;
  onSave: (network: AffiliateNetwork) => void;
  onDelete: (network: AffiliateNetwork) => void;
}) {
  const isNew = !network;
  const [form, setForm] = useState<AffiliateNetwork>(
    () =>
      network ?? {
        id: `NET-${Date.now()}`,
        name: "",
        propertyId: "",
        storeTemplate: "",
        voucherTemplate: "",
        productTemplate: "",
        active: true,
      },
  );
  const set = <K extends keyof AffiliateNetwork>(key: K, value: AffiliateNetwork[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const save = () => {
    if (!form.name.trim()) {
      toast.error("Network name is required");
      return;
    }
    onSave({ ...form, name: form.name.trim() });
    toast.success(isNew ? "Affiliate network created" : "Affiliate network updated", {
      description: `${form.name.trim()} was saved successfully.`,
    });
  };
  const templateField = (
    label: string,
    key: "storeTemplate" | "voucherTemplate" | "productTemplate",
    placeholder: string,
  ) => (
    <label className="block space-y-1.5 text-sm font-medium">
      {label}
      <Textarea
        className="font-mono text-xs"
        rows={3}
        value={form[key]}
        onChange={(event) => set(key, event.target.value)}
        placeholder={placeholder}
      />
      <span className="block text-xs font-normal leading-5 text-muted-foreground">
        {affiliateMacroNote}
      </span>
    </label>
  );
  return (
    <div className="pb-20">
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onCancel}>
          Dashboard
        </Button>
        <ChevronRight className="h-3.5 w-3.5" />
        <Button variant="link" className="h-auto p-0 text-muted-foreground" onClick={onCancel}>
          Affiliate Networks
        </Button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{isNew ? "New" : "Edit"}</span>
      </nav>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">
            {isNew ? "New affiliate network" : "Edit affiliate network"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure the network identity and tracked destination templates.
          </p>
        </div>
        {!isNew && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-border bg-card">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-heading">
                  Delete affiliate network?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Deleting &apos;{form.name}&apos; may affect merchants and offers that use its
                  tracking templates. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => onDelete(form)}
                >
                  <Trash2 />
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </header>
      <section className="rounded-lg border border-border bg-card p-6 shadow-card">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium">
            Name <span className="text-destructive">*</span>
            <Input
              value={form.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="Trackier"
            />
          </label>
          <label className="space-y-1.5 text-sm font-medium">
            Property ID <span className="font-normal text-muted-foreground">(optional)</span>
            <Input
              value={form.propertyId}
              onChange={(event) => set("propertyId", event.target.value)}
              placeholder="prop_102"
            />
          </label>
          <div className="sm:col-span-2">
            {templateField(
              "Store URL template",
              "storeTemplate",
              "https://network.example/click?click_id={click_id}&url={deeplink_encoded}",
            )}
          </div>
          <div className="sm:col-span-2">
            {templateField(
              "Voucher URL template",
              "voucherTemplate",
              "https://network.example/voucher?click_id={click_id}&url={voucher_deeplink}",
            )}
          </div>
          <div className="sm:col-span-2">
            {templateField(
              "Product URL template",
              "productTemplate",
              "https://network.example/product?click_id={click_id}&url={product_deeplink}",
            )}
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-3 sm:col-span-2">
            <div>
              <p className="text-sm font-semibold">Active</p>
              <p className="text-xs text-muted-foreground">
                Allow this network to generate tracked links.
              </p>
            </div>
            <Switch
              checked={form.active}
              onCheckedChange={(value) => set("active", value)}
              aria-label="Active affiliate network"
            />
          </div>
        </div>
      </section>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-400 justify-end gap-2">
          <Button variant="destructiveSoft" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={save}>Save</Button>
        </div>
      </div>
    </div>
  );
}
