import { IconButton } from "@/components/admin/IconButton";
import { Button } from "@/components/ui/button";
import { groups } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Dashboard } from "@/screens/DashboardScreen";
import type { View } from "@/types/admin";
import { ChevronLeft, ChevronRight, LayoutDashboard, X } from "lucide-react";
import { useState } from "react";

export function Sidebar({ view, setView, open, setOpen }: { view: View; setView: (v: View) => void; open: boolean; setOpen: (v: boolean) => void }) {
  const [expanded, setExpanded] = useState<string | null>(() => {
    const activeView = view === "merchant-edit" ? "merchants" : view === "offer-edit" ? "offers" : view === "promo-banner-edit" || view === "promo-banner-new" ? "promo-banners" : view === "category-edit" || view === "category-new" ? "categories" : view === "affiliate-network-edit" || view === "affiliate-network-new" ? "affiliate-networks" : view === "role-edit" ? "roles" : view === "onboarding-slide-edit" || view === "onboarding-slide-new" ? "onboarding-screens" : view;
    const activeGroup = groups.find((group) => group.items.some((item) => item.view === activeView));
    return activeGroup?.label ?? "Catalog";
  });
  const choose = (next: View) => { setView(next); setOpen(false); };
  const chooseGroupedItem = (next: View, groupLabel: string) => {
    setExpanded(groupLabel);
    choose(next);
  };
  return (
    <>
      {open && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-overlay md:hidden" onClick={() => setOpen(false)} />}
      <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform md:static md:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-18 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground">O</div>
          <div className="min-w-0"><div className="truncate font-heading text-[15px] font-bold text-sidebar-foreground">OfferPe Admin</div><div className="text-xs text-muted-foreground">Owner</div></div>
          <IconButton label="Close navigation" className="ml-auto md:hidden" onClick={() => setOpen(false)}><X /></IconButton>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <Button variant="ghost" className={cn("mb-3 h-10 w-full justify-start gap-3 px-3", view === "dashboard" && "bg-sidebar-accent text-sidebar-primary hover:bg-sidebar-accent")} onClick={() => choose("dashboard")}><LayoutDashboard />Dashboard</Button>
          <div className="space-y-1">
            {groups.map((group) => {
              const isOpen = expanded === group.label;
              return <div key={group.label}>
                <Button variant="ghost" className="h-9 w-full justify-start gap-2 px-3 text-[11px] font-bold uppercase text-muted-foreground hover:bg-sidebar-accent" onClick={() => setExpanded(isOpen ? null : group.label)} aria-expanded={isOpen}>
                  <group.icon className="h-3.5 w-3.5" /><span className="flex-1 text-left">{group.label}</span><ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isOpen && "rotate-90")} />
                </Button>
                {isOpen && <div className="ml-4 border-l border-sidebar-border pl-2">
                   {group.items.map((item) => <Button key={item.label} variant="ghost" disabled={!item.view} className={cn("my-0.5 h-auto min-h-9 w-full justify-start gap-2.5 whitespace-normal px-3 py-1.5 text-[13px] text-sidebar-foreground disabled:opacity-55", (item.view === view || (view === "merchant-edit" && item.view === "merchants") || (view === "offer-edit" && item.view === "offers") || ((view === "promo-banner-edit" || view === "promo-banner-new") && item.view === "promo-banners") || ((view === "category-edit" || view === "category-new") && item.view === "categories") || ((view === "affiliate-network-edit" || view === "affiliate-network-new") && item.view === "affiliate-networks") || (view === "role-edit" && item.view === "roles") || ((view === "onboarding-slide-edit" || view === "onboarding-slide-new") && item.view === "onboarding-screens")) && "bg-sidebar-accent font-semibold text-sidebar-primary hover:bg-sidebar-accent")} onClick={() => item.view && chooseGroupedItem(item.view, group.label)}><item.icon className="h-4 w-4 shrink-0" /><span className="min-w-0 break-words text-left leading-tight">{item.label}</span></Button>)}
                </div>}
              </div>;
            })}
          </div>
        </nav>
        <div className="border-t border-sidebar-border p-3"><Button variant="ghost" className="w-full justify-start text-muted-foreground"><ChevronLeft />Sign out</Button></div>
      </aside>
    </>
  );
}
