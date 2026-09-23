import { Button } from "@/components/ui/button";
import type { LayoutMode } from "@/types/admin";
import { LayoutGrid, List } from "lucide-react";

export function LayoutToggle({ value, onChange }: { value: LayoutMode; onChange: (mode: LayoutMode) => void }) {
  return <div className="inline-flex shrink-0 items-center gap-0.5 rounded-md border border-border bg-card p-0.5 shadow-card">
    <Button type="button" variant={value === "list" ? "default" : "ghost"} size="sm" className="h-7 px-2" aria-pressed={value === "list"} aria-label="List layout" onClick={() => onChange("list")}><List className="h-3.5 w-3.5" />List</Button>
    <Button type="button" variant={value === "grid" ? "default" : "ghost"} size="sm" className="h-7 px-2" aria-pressed={value === "grid"} aria-label="Grid layout" onClick={() => onChange("grid")}><LayoutGrid className="h-3.5 w-3.5" />Grid</Button>
  </div>;
}
