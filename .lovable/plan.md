# Standardize filter bars

## Scope
- Audit every admin screen that contains search, select, date, import, or export controls.
- Keep search fields white; give all other filter controls a consistent light-grey fill.
- Standardize filter controls and Import/Export CSV buttons to the same height, typography, border, and spacing.
- Standardize date filtering to two explicit fields—start date and end date—where a range is required, while preserving existing filtering behavior.
- Bring Cashback Claims and Merchant Onboarding Queue into the same shared visual pattern as the other dense list screens.

## Implementation
- Add reusable semantic filter-control styling through the existing design system rather than duplicating colors in each screen.
- Update the shared filter bar/date controls first, then migrate custom screen-specific filter bars to those same classes.
- Preserve existing tabs, filters, imports, exports, layouts, and data flows.

## Verification
- Type-check the project.
- Review every affected screen at desktop width, including both tabs where filter bars differ.
- Confirm consistent fills and heights, correct date controls, no overflow, and working Import/Export dialogs.
