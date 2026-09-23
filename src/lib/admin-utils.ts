import type { Offer } from "@/types/admin";
import { toast } from "sonner";

export function createBlankOffer(merchant: string): Offer {
  return { id: `OFF-${Date.now()}`, merchant, headline: "", subtext: "", details: "", terms: "", discountType: "Percentage", discountValue: 10, commissionType: "Percentage", commissionValue: 5, start: "2026-09-21T09:00", end: "", minBill: 0, sortOrder: 1, discountCap: 0, commissionCap: 0, redirectUrl: "", voucherLink: "", productLink: "", affiliate: "None", featured: false, active: true };
}

export function legalContentToHtml(value: string) {
  if (value.trim().startsWith("<")) return value;
  const blocks: string[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) {
      blocks.push(`<ul>${bullets.map((item) => `<li>${item}</li>`).join("")}</ul>`);
      bullets = [];
    }
  };
  value.split("\n").forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) { flush(); return; }
    if (line.startsWith("-")) { bullets.push(line.replace(/^-\s*/, "")); return; }
    flush();
    if (/^\d+\./.test(line)) blocks.push(`<h2>${line}</h2>`);
    else blocks.push(`<p>${line}</p>`);
  });
  flush();
  return blocks.join("");
}

export const tabTriggerClass = "rounded-none border-b-2 border-transparent px-1 py-3 shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none";

export const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export function dateFromDisplay(value: string) {
  const match = value.match(/(\d{1,2}) (\w{3}) (\d{4})/);
  if (!match) return undefined;
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(match[2] ?? "");
  return month < 0 ? undefined : new Date(Number(match[3]), month, Number(match[1]));
}

export function formatInrInput(value: string) {
  const amount = Number(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 }).format(amount) : "₹0.00";
}

export function downloadCsv(rows: readonly object[], name: string) {
  if (rows.length === 0) { toast.error("Nothing to export", { description: "No rows match the current filters." }); return; }
  const headings = Object.keys(rows[0] as Record<string, unknown>);
  const body = rows.map((row) => headings.map((key) => {
    const value = (row as Record<string, unknown>)[key];
    return value && typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
  }));
  const csv = [headings, ...body].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); URL.revokeObjectURL(url);
  toast.success("Export ready", { description: `${rows.length} rows downloaded as CSV.` });
}

export const affiliateMacroNote = "Recognized macros: {click_id} {user_id} {deeplink} {deeplink_encoded} {property_id} {tracking_url} {voucher_deeplink} {product_deeplink} {utm_params}. Also supports {URLENCODE}...{/URLENCODE} and [optional ...] blocks.";

export function permissionDescription(key: string) {
  const [resource = "", action = ""] = key.split(".");
  const resourceLabel = resource.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase());
  const actionText: Record<string, string> = {
    ADD: "Create new records and start setup workflows.",
    EDIT: "Update records, review decisions, or operational settings.",
    VIEW: "Open the screen and inspect records without making changes.",
    DELETE: "Remove records or revoke access after confirmation.",
    IMPORT: "Upload CSV or network data for bulk processing.",
    EXPORT: "Download filtered records for reconciliation or reporting.",
  };
  return `${actionText[action] ?? "Manage this access area."} Scope: ${resourceLabel}.`;
}

export const semverPattern = /^\d+\.\d+\.\d+$/;

export function compareVersions(a: string, b: string) {
  const left = a.split(".").map(Number); const right = b.split(".").map(Number);
  for (let index = 0; index < 3; index += 1) { const diff = (left[index] ?? 0) - (right[index] ?? 0); if (diff !== 0) return diff; }
  return 0;
}
