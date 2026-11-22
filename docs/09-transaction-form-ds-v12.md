# Hisobchi AI — DS v1.2 / Transaction Editor

## Goal
Create/edit transaction form migration onto reusable Design System foundations, **without changing validation, the in-memory demo data model, or database services**.

## What changed
- Shared `FormHeader` with accessible 44dp Back CTA, title and demo subtitle.
- Shared `ChoiceChip` for Xarajat/Daromad with selected state; switching kind continues resetting category to the first category for that kind.
- Shared `SurfaceCard tone="light"` wraps UZS amount entry and validation feedback.
- Category options remain icon + label, preserving source list and existing selection logic.
- Date is still manually entered as `YYYY-MM-DD`. An accessible `Bugun` action fills the device-local current date; existing validation continues preventing invalid and future dates.
- Note textarea keeps its length limit; Save still validates before onSave. Edit-only delete confirm remains two-step with accessible cancel and confirm labels.
- Input field errors and save summary use live-region hints. Typography and touch-area sizes follow DS tokens.
- UI exposes `DS v1.2` marker to distinguish code from previous screenshots.
- No Supabase integration, real transactions or server persistence; demo session resets after reload.

## QA
Automated via `npm run typecheck`, `npm run test:transactions`, `npm run test:analytics`, `npm run test:design-system`, `npm run test:ui-contract`.

Manual acceptance:
1. Responsive Chrome width 320/360/393 and scroll to last element: nothing clipped behind keyboard or bottom bars.
2. Create expense: amount 85000, Oziq-ovqat, date today -> save and verify list/Analytics.
3. Create income: kind change resets category to Ish haqi; enter 3000000; verify correct sign.
4. Invalid: empty/zero/negative/huge amount, invalid date, future date: validation text visible; record not saved.
5. `Bugun`: overwrites date with device local day, clearing only date error.
6. Edit an existing record, cancel, save, delete via confirmation, and cancel deletion.
7. Tap target size >=44dp for kind choice, back, today and destructive buttons. Screen reader hints and 1.3x text scaling.
8. Verify no Expo Web runtime error. Native Android/iOS tests remain pending.

## Known limitations
- Calendar picker, localized currency input formatting, undo delete and server saving not yet implemented.
- Default device-local date is not forced to Asia/Tashkent: backend date semantics require later agreement.
- Form render/interaction QA is **not** proven by CI; source contracts and arithmetic tests are not substitutes.

## Branch dependency
This branch is stacked on `feat/design-system-v1-dashboard-operations` (PR #12), itself stacked on Design System PR #11. Keep Draft until visual QA and upstream merges are complete. No changes to `main`.
