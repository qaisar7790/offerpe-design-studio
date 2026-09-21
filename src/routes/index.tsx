import { createFileRoute } from "@tanstack/react-router";
import { AdminPlayground } from "@/components/admin-playground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OfferPe Admin — Visual Playground" },
      { name: "description", content: "Interactive OfferPe admin portal design playground for dashboards, merchants, and online conversions." },
      { property: "og:title", content: "OfferPe Admin — Visual Playground" },
      { property: "og:description", content: "Explore the redesigned OfferPe admin dashboard, merchant listings, and conversion workflows." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPlayground,
});
