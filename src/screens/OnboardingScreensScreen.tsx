import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { LayoutToggle } from "@/components/admin/LayoutToggle";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabTriggerClass } from "@/lib/admin-utils";
import type { LayoutMode, OnboardingApp, OnboardingSlide } from "@/types/admin";
import { ArrowDown, ArrowUp, Image as ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export function OnboardingSlidesPage({ slides, app, onAppChange, onCreate, onEdit, onToggle, onMove, onDelete }: { slides: OnboardingSlide[]; app: OnboardingApp; onAppChange: (app: OnboardingApp) => void; onCreate: () => void; onEdit: (slide: OnboardingSlide) => void; onToggle: (slide: OnboardingSlide) => void; onMove: (slide: OnboardingSlide, direction: -1 | 1) => void; onDelete: (slide: OnboardingSlide) => void }) {
  const rows = slides.filter((slide) => slide.app === app);
  const [layout, setLayout] = useState<LayoutMode>("list");
  return <>
    <PageHeader title="Onboarding Screens" description="The full-screen carousel shown once, before signup or login, on a fresh install of each app. Reorder with the arrows below — the same mechanism as Merchant Page Sections." actions={<><LayoutToggle value={layout} onChange={setLayout} /><Button onClick={onCreate}><Plus />Add slide</Button></>} />
    <Tabs value={app} onValueChange={(value) => onAppChange(value as OnboardingApp)}>
      <TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0"><TabsTrigger value="Consumer" className={tabTriggerClass}>Consumer</TabsTrigger><TabsTrigger value="Merchant" className={tabTriggerClass}>Merchant</TabsTrigger></TabsList>
      <TabsContent value={app} className="mt-0">
        {layout === "grid" && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((slide, index) => <article key={slide.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-card shadow-card">
            <div className="relative h-40 w-full border-b border-border bg-muted/40">{slide.image ? <img src={slide.image} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center"><ImageIcon className="h-6 w-6 text-muted-foreground" /></span>}<span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-md bg-card font-heading text-xs font-bold text-primary shadow-card">{index + 1}</span></div>
            <div className="flex min-h-44 flex-1 flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2"><span className="font-heading text-sm font-bold">{slide.title}</span><StatusBadge status={slide.active ? "Active" : "Inactive"} /></div>
              <p className="line-clamp-3 text-xs text-muted-foreground">{slide.body}</p>
              <div className="mt-auto flex flex-wrap items-center gap-1 pt-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Move ${slide.title} up`} disabled={index === 0} onClick={() => onMove(slide, -1)}><ArrowUp className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Move ${slide.title} down`} disabled={index === rows.length - 1} onClick={() => onMove(slide, 1)}><ArrowDown className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="h-8" onClick={() => onToggle(slide)}>{slide.active ? "Deactivate" : "Activate"}</Button>
                <Button variant="ghost" size="sm" className="h-8" onClick={() => onEdit(slide)}><Pencil className="h-3.5 w-3.5" />Edit</Button>
                <ConfirmDeleteDialog itemType="Onboarding Slide" name={slide.title} onConfirm={() => onDelete(slide)}><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" aria-label={`Delete ${slide.title}`}><Trash2 className="h-3.5 w-3.5" /></Button></ConfirmDeleteDialog>
              </div>
            </div>
          </article>)}
          {rows.length === 0 && <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">No onboarding slides for the {app} app yet.</div>}
        </div>}
        {layout === "list" && <div className="space-y-2">
          {rows.map((slide, index) => <div key={slide.id} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card sm:flex-row sm:items-center">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent font-heading text-xs font-bold text-primary">{index + 1}</span>
            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md border border-border bg-muted">{slide.image ? <img src={slide.image} alt="" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center"><ImageIcon className="h-4 w-4 text-muted-foreground" /></span>}</div>
            <div className="min-w-0 flex-1"><div className="truncate font-heading text-sm font-bold">{slide.title}</div><div className="truncate text-xs text-muted-foreground">{slide.body}</div></div>
            <StatusBadge status={slide.active ? "Active" : "Inactive"} />
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Move ${slide.title} up`} disabled={index === 0} onClick={() => onMove(slide, -1)}><ArrowUp className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Move ${slide.title} down`} disabled={index === rows.length - 1} onClick={() => onMove(slide, 1)}><ArrowDown className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => onToggle(slide)}>{slide.active ? "Deactivate" : "Activate"}</Button>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => onEdit(slide)}><Pencil className="h-3.5 w-3.5" />Edit</Button>
              <ConfirmDeleteDialog itemType="Onboarding Slide" name={slide.title} onConfirm={() => onDelete(slide)}><Button variant="ghost" size="sm" className="h-8 text-destructive"><Trash2 className="h-3.5 w-3.5" />Delete</Button></ConfirmDeleteDialog>
            </div>
          </div>)}
          {rows.length === 0 && <div className="rounded-lg border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">No onboarding slides for the {app} app yet.</div>}
        </div>}
      </TabsContent>
    </Tabs>
  </>;
}
