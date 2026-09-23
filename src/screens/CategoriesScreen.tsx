import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { IconButton } from "@/components/admin/IconButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { tabTriggerClass } from "@/lib/admin-utils";
import { cn } from "@/lib/utils";
import type { Category, RawMapping } from "@/types/admin";
import { ChevronDown, Pencil, Plus, Search, Store, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Categories({
  categories,
  mappedCount,
  tab,
  onTabChange,
  mappings,
  onSaveMapping,
  onEdit,
  onCreate,
  onDelete,
}: {
  categories: Category[];
  mappedCount: (category: Category) => number;
  tab: "categories" | "mapping";
  onTabChange: (tab: "categories" | "mapping") => void;
  mappings: RawMapping[];
  onSaveMapping: (raw: string, mappedTo: string) => void;
  onEdit: (category: Category) => void;
  onCreate: () => void;
  onDelete: (category: Category) => void;
}) {
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");
  const [status, setStatus] = useState("all");
  const [ascending, setAscending] = useState(true);
  const rows = categories
    .filter(
      (category) =>
        (!query || category.name.toLowerCase().includes(query.toLowerCase())) &&
        (channel === "all" || category.channel === channel) &&
        (status === "all" || (category.active ? "Active" : "Inactive") === status),
    )
    .sort((a, b) => (ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
  return (
    <>
      <PageHeader
        title="Categories"
        description="Manage online and offline shopping categories, display sequences, and promotional copy."
        actions={
          tab === "categories" ? (
            <Button onClick={onCreate}>
              <Plus />
              Add new category
            </Button>
          ) : undefined
        }
      />
      <Tabs value={tab} onValueChange={(value) => onTabChange(value as "categories" | "mapping")}>
        <TabsList className="mb-5 h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger value="categories" className={tabTriggerClass}>
            Categories
          </TabsTrigger>
          <TabsTrigger value="mapping" className={tabTriggerClass}>
            Category Mapping
          </TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="mt-0">
          <div className="filter-bar mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
            <div className="relative min-w-[280px] flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by category name…"
              />
            </div>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="lg:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All channels</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="lg:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-215 text-left text-sm">
                <thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground">
                  <tr>
                    <th>Channel</th>
                    <th>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-7 text-[11px] uppercase"
                        onClick={() => setAscending(!ascending)}
                      >
                        Name
                        <ChevronDown
                          className={cn("transition-transform", !ascending && "rotate-180")}
                        />
                      </Button>
                    </th>
                    <th>Mapped Merchants</th>
                    <th>Display Order</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((category) => (
                    <tr key={category.id} className="border-t border-border hover:bg-muted/50">
                      <td>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                            category.channel === "Online"
                              ? "bg-success-soft text-success"
                              : "bg-info-soft text-info",
                          )}
                        >
                          {category.channel}
                        </span>
                      </td>
                      <td className="font-semibold">{category.name}</td>
                      <td>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          <Store className="h-3 w-3" />
                          {mappedCount(category)} stores
                        </span>
                      </td>
                      <td>{category.order}</td>
                      <td>
                        <StatusBadge status={category.active ? "Active" : "Inactive"} />
                      </td>
                      <td className="text-right">
                        <span className="inline-flex">
                          <IconButton
                            className="h-7 w-7"
                            label={`Edit ${category.name}`}
                            onClick={() => onEdit(category)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </IconButton>
                          <ConfirmDeleteDialog
                            itemType="Category"
                            name={category.name}
                            onConfirm={() => onDelete(category)}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              aria-label={`Delete ${category.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </ConfirmDeleteDialog>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Showing {rows.length} of {categories.length} categories
          </p>
        </TabsContent>
        <TabsContent value="mapping" className="mt-0">
          <CategoryMapping categories={categories} mappings={mappings} onSave={onSaveMapping} />
        </TabsContent>
      </Tabs>
    </>
  );
}

export function CategoryMapping({
  categories,
  mappings,
  onSave,
}: {
  categories: Category[];
  mappings: RawMapping[];
  onSave: (raw: string, mappedTo: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const valueFor = (item: RawMapping) => drafts[item.raw] ?? (item.mappedTo || "none");
  const rows = mappings.filter(
    (item) =>
      (!query || item.raw.includes(query.toLowerCase())) &&
      (status === "all" || (item.mappedTo ? "Mapped" : "Unmapped") === status),
  );
  const save = (item: RawMapping) => {
    const value = valueFor(item);
    const next = value === "none" ? "" : value;
    onSave(item.raw, next);
    const category = categories.find((entry) => entry.id === next);
    toast.success(
      category
        ? `Category mapped: "${item.raw}" → "${category.name}"`
        : `Mapping cleared for "${item.raw}"`,
    );
  };
  return (
    <>
      <p className="mb-5 max-w-4xl text-sm leading-6 text-muted-foreground">
        Raw category strings as Trackier reports them, resolved to this catalog&apos;s own
        categories. A raw category is added here automatically the first time a sync run sees it —
        unmapped ones are never silently dropped, but the merchants under them won&apos;t have a
        real category_id until mapped.
      </p>
      <div className="filter-bar mb-5 flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-card lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative min-w-[280px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search raw category…"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="lg:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Mapped">Mapped</SelectItem>
            <SelectItem value="Unmapped">Unmapped</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-muted/70 text-[11px] uppercase text-muted-foreground">
              <tr>
                <th>Raw Category</th>
                <th>Status</th>
                <th>Mapped To</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.raw} className="border-t border-border hover:bg-muted/50">
                  <td className="font-mono text-xs font-semibold">{item.raw}</td>
                  <td>
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                        item.mappedTo ? "bg-success-soft text-success" : "status-pending",
                      )}
                    >
                      {item.mappedTo ? "Mapped" : "Unmapped"}
                    </span>
                  </td>
                  <td>
                    <Select
                      value={valueFor(item)}
                      onValueChange={(value) =>
                        setDrafts((current) => ({ ...current, [item.raw]: value }))
                      }
                    >
                      <SelectTrigger className="h-8 w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Not mapped</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name} ({category.channel.toUpperCase()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="text-right">
                    <Button size="sm" className="h-8" onClick={() => save(item)}>
                      Save
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Showing {rows.length} of {mappings.length} raw categories
      </p>
    </>
  );
}
