# D09 — Living Ledger Analytics v0.3 / Source + Browser Visual Audit
**Date:** 2026-11-22
**Code reference:** `7480195c507e5eb056d48c19c6c738df5ba3207e` (test locator refinement only).
**Status:** CODED + WEB-RENDERED + CI-PASSED; NATIVE/A11Y/S+ RELEASE NOT APPROVED.

## Why this composition is distinct
The previous Analytics used a glossy blue gradient panel, a mixture of dark and light cards, tiny 10–11dp annotations, and a mostly decorative chart. Living Ledger Analytics now uses editorial reading order:
1. Date/provenance header (session, not bank account).
2. **Sof farq** (computed income – expense, explicitly not bank balance).
3. Income, expense, turnover (all deterministic in-memory session aggregates).
4. Daily activity chart (last seven recorded dates, shared date axis, metric-specific relative scales).
5. Expense category composition (amount, label, percent and semantic progress).
6. Honest comparison notice when historical coverage is insufficient.

**No invented trend, bank link, or AI-predicted spending limits.**

## Data contract / invariants verified
- Source: `calculateAnalytics(transactions, period, todayLocal(), appliedRange)` from existing validated domain module. No model modification.
- Seeded 5 demo entries: income 3,000,000 UZS; expense 259,000; turnover 3,259,000; net 2,741,000.
- Add 100,000 UZS expense in existing Editor: entries 6; expense 359,000; turnover 3,359,000; net 2,641,000.
- Home fixed **DEMO** Safe-to-Spend 145,000 UZS and fixed month demo chart 3,840,000 UZS remain unaffected.
- Inclusive custom 2026-11-19 only: one expense 120,000; no income; net **−120,000 UZS**; income metric chart displays an empty, non-fabricated state.
- Category percent and progress = category amount / selected period total expense.
- Chart day collection max 7 recorded days; chart shows the last 7 but KPI uses all transactions within the selected period. A visible chart disclosure distinguishes them.

## Rendered evidence
**GitHub Actions latest passing run:** [45051373294](https://github.com/abdulazizganiyev255-ship-it/hisobchi-ai-mobile/actions/runs/45051373294).
- model-and-bundle: PASS — TypeScript, existing transaction/analytics/date/DS/UI/finance integration tests, new Analytics source assertions, Expo Web & Android JS exports.
- responsive-browser: PASS — current Home, Transactions/Editor, and new Analytics workflows at 320×640, 360×800 and 393×852 in headless Chromium.
- For each screen width, tests checked default report, income/turnover/expense chart switching, calendar input, inclusive custom date, no-income state, create expense, correct KPI updates, unchanged Home demo values and horizontal page width.
- Screen captures: 42 browser PNGs in the CI artifact `living-ledger-responsive-screens`; 15 specifically tagged `analytics`. Selected 320px and 393px renders were visually audited.

## Observed visual audit
- 393×852 initial: clear net and financial provenance; category and secondary narrative scroll below first fold, as expected. The last chart-day and selected-day summary are visible without overflowing the viewport.
- 320×640: main KPI and chart metric controls are visible initially; actual bars need vertical scroll; no observed horizontal clipping. Long overline `SOF FARQ · SESSIYADAN HISOBLANGAN` wraps into two lines without shrinking the main number.
- 320×640 custom range / no income: negative net and zero income clearly distinct; empty state exists; the action may sit below the viewport and requires ordinary vertical scroll rather than overlapping nav.
- 393×852 post-creation: 2,641,000 net, 359,000 expense and 3,359,000 turnover are reflected in the same composition. Fixed DEMO balance is not recomputed.
- Source-level accessible chart buttons announce date, metric amount and turnover, and category rows announce amount plus percent. This does NOT prove actual TalkBack/VoiceOver runtime behavior.

## Issues caught and corrections
| Priority | Finding | Resolution |
|---|---|---|
| P2 test, not app | Initial CI had a non-unique Playwright locator for date 2026-11-19: matched both field and calendar cell | Scoped exact locator to `ledger-calendar-sheet`; rerun PASS |
| P1 financial truth | Prior UI said “SOF FARQ · NAMUNA”, risking confusion with fixed sample Safe-to-Spend | New label “SESSIYADAN HISOBLANGAN”; explanatory text says not account balance |
| P1 chart truth | Cross-metric bar heights were liable to misinterpretation | New note clearly states each metric has a separate vertical scale; dates shared |
| P2 visual density | 320px chart starts below the fold | Accepted scroll behavior for current pilot; native user test still required |
| P1 accessibility | Live reader focus order, touch target size under 2× type and OS screen-reader charts untested | BLOCKED: physical device QA |
| P1 integration | Profile and Onboarding still use old blue theme | D10 next, not part of D09 |

## Release gates NOT satisfied
- Real Android/iOS tested rendering and keyboard/screen-reader focus: NOT_TESTED.
- 1.3× and 2× system font scaling, 320dp horizontal and custom long category labels: NOT_TESTED outside baseline browser size.
- Performance under lower-end physical devices: NOT_TESTED.
- Production backend, Auth/RLS, real Safe-to-Spend engine: not implemented.
- Final creative design lock or S+ score: NOT ASSIGNED.

## References
- [Draft PR #31](https://github.com/abdulazizganiyev255-ship-it/hisobchi-ai-mobile/pull/31)
- [S+ Issue Board #26](https://github.com/abdulazizganiyev255-ship-it/hisobchi-ai-mobile/issues/26)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Handoff
Next D10 Profile/Onboarding, then D11 all-screen accessibility/device tests and D12 independent review. Keep old source modules while source contract tests rely on them; do not merge draft stacks to main until release gates are green.
