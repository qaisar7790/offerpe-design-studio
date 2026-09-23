import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { SectionCard } from "@/components/admin/SectionCard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/admin";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CategoryFormPage({
  category,
  onCancel,
  onSave,
  onDelete,
}: {
  category: Category | null;
  onCancel: () => void;
  onSave: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  const isNew = !category;
  const [form, setForm] = useState<Category>(
    () =>
      category ?? {
        id: `CAT-${Date.now()}`,
        channel: "Online",
        name: "",
        order: 0,
        active: true,
        image: "",
        line1: "",
        line2: "",
      },
  );
  const set = <K extends keyof Category>(key: K, value: Category[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const save = () => {
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    onSave(form);
    toast.success(isNew ? "Category created" : "Category updated", {
      description: `${form.name} was saved successfully.`,
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
          Categories
        </Button>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">{isNew ? "New" : "Edit"}</span>
      </nav>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">
            {isNew ? "New category" : "Edit category"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure category placement, promotional copy, and availability.
          </p>
        </div>
        {isNew ? (
          <Button variant="outline" onClick={onCancel}>
            <ChevronLeft />
            Back to Categories
          </Button>
        ) : (
          <ConfirmDeleteDialog
            itemType="Category"
            name={form.name}
            onConfirm={() => onDelete(form)}
          >
            <Button variant="destructive">
              <Trash2 />
              Delete Category
            </Button>
          </ConfirmDeleteDialog>
        )}
      </header>
      <SectionCard
        title="Category Details"
        description="Fields marked with an asterisk are required."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium">
            Channel <span className="text-destructive">*</span>
            <Select
              value={form.channel}
              onValueChange={(value) => set("channel", value as Category["channel"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectContent>
            </Select>
          </label>
          <label className="space-y-1.5 text-sm font-medium">
            Display order <span className="text-destructive">*</span>
            <Input
              type="number"
              min="0"
              value={form.order}
              onChange={(event) => set("order", Number(event.target.value))}
            />
          </label>
          <label className="space-y-1.5 text-sm font-medium md:col-span-2">
            Name <span className="text-destructive">*</span>
            <Input
              value={form.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="Restaurants"
            />
          </label>
          <label className="space-y-1.5 text-sm font-medium md:col-span-2">
            Image URL
            <div className="flex gap-3">
              <Input
                type="url"
                value={form.image}
                onChange={(event) => set("image", event.target.value)}
                placeholder="https://…"
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Category preview"
                  className="h-10 w-16 shrink-0 rounded border border-border object-cover"
                />
              )}
            </div>
          </label>
          <label className="space-y-1.5 text-sm font-medium md:col-span-2">
            Text line 1
            <Input
              value={form.line1}
              onChange={(event) => set("line1", event.target.value)}
              placeholder="Marketing tagline"
            />
          </label>
          <label className="space-y-1.5 text-sm font-medium md:col-span-2">
            Text line 2
            <Input
              value={form.line2}
              onChange={(event) => set("line2", event.target.value)}
              placeholder="Supporting promotional copy"
            />
          </label>
          <label className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3 md:col-span-2">
            <Checkbox
              checked={form.active}
              onCheckedChange={(value) => set("active", value === true)}
            />
            <span className="text-sm font-semibold">Active</span>
          </label>
        </div>
      </SectionCard>
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
