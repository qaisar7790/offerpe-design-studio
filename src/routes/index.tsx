import { createFileRoute } from "@tanstack/react-router";
import { AdminPlayground } from "@/components/admin-playground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OfferPe Admin — Visual Playground" },
      { name: "description", content: "Interactive OfferPe admin portal design playground for dashboards, catalog operations, financial workflows, communication logs, users, and roles." },
      { property: "og:title", content: "OfferPe Admin — Visual Playground" },
      { property: "og:description", content: "Explore the redesigned OfferPe admin dashboard, catalog, financial, communication, user, and role workflows." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPlayground,
});
