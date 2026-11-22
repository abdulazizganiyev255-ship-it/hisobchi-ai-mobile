# Living Ledger / Home v0.1 — Rendered QA and Design Review
**Date:** 2026-11-22
**Status:** PILOT IMPLEMENTED; NOT DESIGN-LOCKED; NOT NATIVE-APPROVED.
**Branch:** design/splus-living-ledger-home-v01; Draft PR #29 stacked on D01-D03 documentation branch.
**Concept:** editorial ledger, not generic bank card stack; ample typography, structured rule lines, clear demo provenance, single warm action accent.

## Why prior A/B/C were rejected
All used the same generic banking hierarchy: logo + balance tile + separate safety card + chart + rows and glossy filler. Colorway differences did not alter the underlying information architecture. The new pilot:
- Puts Safe-to-Spend above the sample balance.
- Removes large gradient tiles / neon / decorative floating bars.
- Treats demo/provenance as primary typography.
- Makes one full-width, readable Add Expense interaction in the main scroll (not a separate unwanted FAB rail).
- Uses small flat normalized demo bars with non-visual accessible summary; does not claim days or currency on X-axis.
- Uses actual current-session rows, not static fake ledger rows.

## Files implemented
- src/theme/livingLedger.ts — palette and spacing.
- src/components/living/LedgerPrimitives.tsx — provenance tag, accessible normalized bars, session ledger rows.
- src/screens/LivingLedgerDashboardScreen.tsx — full Home, real modal, real Add button, sample-month picker, balance privacy.
- App.tsx — Home-only styling and direct Add editor route; other screens remain unchanged.
- scripts/test-living-ledger.cjs — source/provenance + numeric WCAG contrast checks.
- scripts/test-living-ledger-web.cjs — 320/360/393px real Chromium screen+flow smoke tests.
- .github/workflows/living-ledger-ci.yml — model / TypeScript / web bundle / Android JS bundle / Chromium E2E.

## Verified evidence
**Source:** implementation read from GitHub connector and current branch.
**Computed from palette** (local independent formula; values should also be asserted by CI):
| Pair | Contrast ratio | Gate |
|---|---:|---|
| #142821 on #F7F5EF (primary) | 14.21:1 | > 4.5 |
| #536159 on #F7F5EF (supporting) | 5.98:1 | > 4.5 |
| #713D2C on #F6D6CA (badge) | 6.40:1 | > 4.5 |
| #142821 on #F27452 (CTA) | 5.46:1 | > 4.5 |
| #FFFFFF on #1D4D3C (modal CTA) | 9.64:1 | > 4.5 |
| #6D8E74 on #F7F5EF (chart bars) | 3.34:1 | > 3 |

**CI:** GitHub Actions run 45046368355 (source commit dc450a9) passed TypeScript, finance tests, web and Android JS exports and actual 320/360/393 Chromium flow tests; that run predates later date-label and nav-label improvements. Subsequent latest-head run must be checked.
**Actual screenshot proof:** 9 browser captures in GitHub Actions artifact "living-ledger-responsive-screens" from run 45046368355 were downloaded and visually inspected. 393px Home amount and modal layout legible. 320px nav displayed truncated visible text "Operatsiya..." (P2) in this earlier screenshot, since corrected in App.tsx and pending re-screenshot. Screenshots are browser artifacts; they do not constitute real iPhone/Pixel or TalkBack tests.

## Issues found and specific remediations
| Priority | Issue | Remediation / status |
|---|---|---|
| P1 data honesty | Hardcoded seeded item.date displays stale "Bugun / Kecha" on future days | Switch LedgerTransactionRow to stable ISO-derived dd.mm.yyyy; code changed, latest CI pending |
| P1 trust | Monthly sample graph lacks prominent source disclosure above visualization | Overline now "OYLIK XARAJAT · NAMUNA"; existing below-graph disclosure remains |
| P2 visual | 320px bottom "Operatsiyalar" text shortened by screen clipping | Visible label changed to "Tarix" on Home; tab accessibility name remains "Operatsiyalar"; latest screenshot pending |
| P2 screenshot method | Earlier 320px screenshot after interactions captured mid-scroll | New E2E takes initial screenshot and post-add activity screenshot |
| P2 readability | Large amount and spacing may push chart / activity below the first fold | Expected on 320px: primary money & primary action above fold more important; confirm initial screenshot |
| P1 accessibility | 2x OS font scale, VoiceOver/TalkBack, focus restoration unverified | Manual native gate; do not approve production |
| P1 consistency | Other five screens still use old blue theme and 10–12dp metadata | Scoped migration by component; do not globally restyle before QA |
| P0 product | Safe-to-Spend still hardcoded 145,000 example | Keep explicit 'DEMO · hisoblanmagan' until finance engine and RLS independently approved |

## Scope discipline
- No production financial value, secure storage, bank integration, or Supabase operation changed.
- Session analytics uses existing source-model pipeline; fixed balance/clear-spend/month-graph untouched.
- Preserve DateCalendar, Editor CRUD, existing Analytics and navigation behavior.
- No new runtime dependencies; no wholesale third-party UI kit installed.

## Next stages
1. Check latest-head CI; inspect initial + post-add screenshots (320, 360, 393) and iterate layout issues.
2. Audit 1.3x/2x native type scaling, keyboard, Android Back and screen reader on device; resolve P1.
3. D06 component matrix: button/field/empty/error/disabled/pressed/loading, size and aria contract.
4. Migrate Transactions/Editor first using shared light tokens, then Analytics, Profile and Onboarding; per-screen PR and QA.
5. D12 independent design review and score only after entire flow is visually/device verified.

## References
- [Current GitHub Draft PR #29](https://github.com/abdulazizganiyev255-ship-it/hisobchi-ai-mobile/pull/29)
- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [React Native accessibility](https://reactnative.dev/docs/accessibility)
- [Expo fonts and scaling](https://docs.expo.dev/develop/user-interface/fonts/)
