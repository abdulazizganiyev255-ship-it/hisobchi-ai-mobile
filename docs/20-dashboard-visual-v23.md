# Dashboard Visual v2.3 — targeted first polish

## Source inspection
Analyzed `DashboardScreen.tsx`, `ExpenseChart.tsx`, `src/theme/tokens.ts`, `SectionHeader.tsx` and `SurfaceCard.tsx`, compared with the user's Android Pixel 6 screenshot. No domain data, navigation, Safe-to-Spend calculations, charts' demo numbers or Supabase were modified.

## Code changes

| Component | Before | v2.3 target |
|---|---|---|
| Screen padding | top 16dp, gap 15dp, horizontal 20dp | top 12dp, gap 12dp, horizontal shared 18dp token |
| Balance surface | min 158dp, padding 20dp | min 148dp, padding 18dp; value top margin 19→11dp |
| Balance typography | 31dp base, 27dp narrow | 29dp shared amount token, 26dp narrow |
| Safe-to-Spend | min 108dp, padding 16dp | min 98dp, padding 14dp, slightly tighter icons and gap |
| Dashboard chart SVG | 143dp height, wrapper top 16dp | opt-in compact mode: 126dp height, wrapper top 10dp |
| Chart labels and disclosures | 9–11dp | chart disclosure 12dp; metadata uses shared 10/12dp tokens |
| Balance visibility toggle | minimum 44dp | minimum 44dp retained, improved accessibility state |
| Chart period toggle | minimum 44dp | retained |
| Transaction list and empty state | Existing DS components | unchanged |

Dashboard remains **in-memory demo**. Balance and month chart are separate, unrelated sample values and labeled as such. The `ExpenseChart` default dimensions remain unchanged for other usages.

## Why no major new effects?
The current UI already has gradient hierarchy and decorative circular shapes. More gradients or glass effects would add noise and risk Android rendering performance. This iteration addresses legibility and visual density first.

## Acceptance gates
- `npm run typecheck` + transaction, calendar, Analytics and UI contracts.
- Chromium responsive interaction smoke at 320×640, 360×800, 393×852.
- Pixel 6 emulator **manual screenshot comparison** of Dashboard at top and scrolled: first screen should convey a clearer information hierarchy, no cropped balances, no card overlap, chart legend should stay legible and fully accessible by scroll.
- Android accessibility: focus order on balance eye, notification and monthly period; dynamic font scaling to 1.3× remains manual.

## Git safety
- Stacked Draft PR from `feat/android-emulator-smoke-v22` (PR #23), not merged to `main`.
- Local `C:\h` branch `feat/dashboard-visual-v23` already exists and was clean when created. Fetch from origin and set its upstream before `git pull --ff-only`.
- Test first; no Supabase or actual financial records affected.
