import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { SectionCard } from "@/components/admin/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { OnboardingApp, OnboardingSlide } from "@/types/admin";
import { Check, ChevronRight, Trash2, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function OnboardingSlidePreview({
  slide,
  index,
  total,
}: {
  slide: OnboardingSlide;
  index: number;
  total: number;
}) {
  return (
    <div className="mx-auto w-[260px] rounded-[2rem] border-8 border-foreground/85 bg-card shadow-card">
      <div className="relative flex h-[520px] flex-col overflow-hidden rounded-[1.4rem] bg-primary">
        <div className="absolute inset-0">
          {slide.image ? (
            <img src={slide.image} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-b from-primary to-primary/70" />
          )}
        </div>
        <div className="absolute inset-0 bg-overlay" />
        <div className="relative flex h-full flex-col justify-between p-5 text-primary-foreground">
          <div className="flex justify-end">
            <span className="rounded-full bg-card/90 px-2.5 py-1 text-[11px] font-semibold text-foreground">
              Skip
            </span>
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold leading-tight">
              {slide.title || "Slide title"}
            </h3>
            <p className="mt-2 text-sm leading-6 opacity-90">
              {slide.body || "Slide body text appears here."}
            </p>
            <div className="mt-5 flex items-center gap-1.5">
              {Array.from({ length: Math.max(total, 1) }).map((_, dot) => (
                <span
                  key={dot}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    dot === index ? "w-5 bg-primary-foreground" : "w-1.5 bg-primary-foreground/40",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OnboardingSlideEditPage({
  slide,
  app,
  total,
  index,
  onCancel,
  onSave,
  onDelete,
}: {
  slide: OnboardingSlide | null;
  app: OnboardingApp;
  total: number;
  index: number;
  onCancel: () => void;
  onSave: (slide: OnboardingSlide) => void;
  onDelete: (slide: OnboardingSlide) => void;
}) {
  const isNew = !slide;
  const [form, setForm] = useState<OnboardingSlide>(
    () => slide ?? { id: `OS-${Date.now()}`, app, title: "", body: "", image: "", active: true },
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const set = <K extends keyof OnboardingSlide>(key: K, value: OnboardingSlide[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const readFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("image", typeof reader.result === "string" ? reader.result : "");
    reader.readAsDataURL(file);
  };
  const save = () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and body text are required");
      return;
    }
    onSave(form);
    toast.success(isNew ? "Onboarding slide added" : "Onboarding slide updated", {
      description: `${form.title} was saved for the ${form.app} app.`,
    });
  };
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
          Onboarding Screens
        </Button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{isNew ? "New" : "Edit"}</span>
      </nav>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">
            {isNew ? "New onboarding slide" : "Edit onboarding slide"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {form.app} app · shown once before signup on a fresh install.
          </p>
        </div>
        {!isNew && (
          <ConfirmDeleteDialog
            itemType="Onboarding Slide"
            name={form.title}
            onConfirm={() => onDelete(form)}
          >
            <Button variant="destructive">
              <Trash2 />
              Delete
            </Button>
          </ConfirmDeleteDialog>
        )}
      </header>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
        <SectionCard
          title="Slide Content"
          description="Fields marked with an asterisk are required."
        >
          <div className="grid gap-4">
            <label className="space-y-1.5 text-sm font-medium">
              App <span className="text-destructive">*</span>
              <Select
                value={form.app}
                onValueChange={(value) => set("app", value as OnboardingApp)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consumer">Consumer</SelectItem>
                  <SelectItem value="Merchant">Merchant</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              Title <span className="text-destructive">*</span>
              <Input
                value={form.title}
                onChange={(event) => set("title", event.target.value)}
                placeholder="Welcome to OfferPe"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              Body text <span className="text-destructive">*</span>
              <Textarea
                rows={3}
                value={form.body}
                onChange={(event) => set("body", event.target.value)}
                placeholder="Earn real cashback every time you shop."
              />
            </label>
            <div>
              <span className="text-sm font-medium">
                {form.image ? "Replace image (optional)" : "Image (optional)"}
              </span>
              {form.image && (
                <div className="mt-2 h-28 w-28 overflow-hidden rounded-md border border-border">
                  <img
                    src={form.image}
                    alt="Current slide"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  readFile(event.dataTransfer.files[0]);
                }}
                className="mt-2 flex min-h-24 w-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center hover:border-primary hover:bg-accent"
              >
                <UploadCloud className="mb-2 h-6 w-6 text-primary" />
                <span className="text-sm font-semibold">Choose a file</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Full-bleed, shown behind the title and body text.
                </span>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(event) => readFile(event.target.files?.[0])}
                />
              </button>
              {form.image && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-destructive"
                  onClick={() => set("image", "")}
                >
                  <X />
                  Remove image
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold">Active</p>
                <p className="text-xs text-muted-foreground">
                  Inactive slides stay in the list but are skipped in the app.
                </p>
              </div>
              <Switch
                checked={form.active}
                onCheckedChange={(value) => set("active", value)}
                aria-label="Active slide"
              />
            </div>
          </div>
        </SectionCard>
        <aside className="xl:sticky xl:top-6">
          <SectionCard
            title="Live Preview"
            description="How this slide appears in the onboarding carousel."
          >
            <OnboardingSlidePreview
              slide={form}
              index={isNew ? total : index}
              total={isNew ? total + 1 : total}
            />
          </SectionCard>
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur md:left-64">
        <div className="mx-auto flex max-w-400 justify-end gap-2">
          <Button variant="destructiveSoft" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={save}>
            <Check />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
