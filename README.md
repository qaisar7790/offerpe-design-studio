# OfferPe Design Studio

Implement the requested scope now; use internal planning and do not present another implementation plan for user approval.

Create the OfferPe Admin visual redesign playground application.

Context & Objectives:
The user has an existing Next.js admin app deployed on Vercel/Railway alongside consumer and merchant apps. We are building a standalone visual playground in Lovable to revamp the admin portal's design, layout, and UI while preserving exact component signatures, data contracts, and workflows so they can easily drop the updated code back into their repo.

Key Design Decisions & Pain Points to Solve:
1. Palette: Light-mode only, crisp enterprise software aesthetic.
   - Background: Pure crisp white / subtle cool slate page background (#F8FAFC / #FFFFFF).
   - Sidebar: Clean white rail (#FFFFFF) with subtle border (#E2E8F0), dark slate text (#0F172A / #334155), completely removing the dark green background.
   - Ink: Deep slate/black ink (#0F172A) for high contrast and readability.
   - Accent: Refined Teal (#0D9488 / #0F766E) for primary CTA buttons, active route indicators, and key highlights.
   - Destructive / Dismissal: Cancel, Reject, and Delete actions must use reddish/rose colors (e.g. red-600 / rose-600, border-red-200, bg-red-50 hover) rather than generic teal or dim gray.
2. Typography:
   - Use 'Space Grotesk' font for H1 titles and the OfferPe Admin brand header.
   - Inter or clean sans-serif for tabular data, body text, and metrics.
3. Sidebar:
   - Grouped into Catalog, Operations, Financial, Communication, System plus pinned Dashboard.
   - Remove the redundant green status dots that appeared next to every single menu item.
   - Clean active item pill with subtle teal background tint and teal icon/text.
   - Collapsible groups with clean chevron indicators.
   - Admin badge: "OfferPe Admin - Owner" with a clean teal avatar/icon.
4. Data Tables & Listing Screens (Merchants and Online Conversions):
   - Replace raw hyperlink text ("Edit") with actual polished buttons or icon buttons (e.g., Pencil icon for Edit, Copy icon for copying IDs, Trash icon for Delete/Reject, external link icon where relevant).
   - Clean sortable table headers, sticky columns where appropriate, zebra or clean row dividers on hover.
   - Status badges: crisp rounded pills with distinct colors (Active: emerald, Inactive: slate/gray, Pending: amber, Approved: emerald, Rejected: rose/red, Requested: violet, Paid: blue).
   - Filter bar: Clean search input, multi-select status dropdown, date range picker, and "+ Add new" / "Import & Export" action menus.
5. Interactive Views to Showcase:
   - Dashboard: Store status & channel donut charts (Recharts), cadence bar charts (Users Joined, Clicks, Transactions, Withdrawals, Missing Claims), and pending stat cards.
   - Online Conversions: Full data table with sample rows showing different statuses, action dropdown/modals, and export button.
   - Merchants: Listing table with active/inactive badges, channel indicators (Online/Offline), and quick edit actions.
   - Import Offline Report Modal: Drag and drop CSV upload card, instruction badge, and clear primary + reddish Cancel buttons.
6. Make it interactive so the user can switch between Dashboard, Merchants, and Online Conversions, toggle filters, and open the edit modals to evaluate the UI.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/edf5722d-0ef6-4a0f-bff2-55a5187c6539).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
