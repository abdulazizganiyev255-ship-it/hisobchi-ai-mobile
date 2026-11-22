# Hisobchi AI — Full UI/UX QA Gate (v1.5)

**Basis:** Screenshots of Dashboard, Transactions, Transaction Editor, Analytics, Profile and all three Onboarding steps, plus GitHub source audit. This is an audit of the **demo prototype**, not a production readiness certificate.

## Issues confirmed by code and screenshots

| Severity | Screen | Finding | Treatment |
|---|---|---|---|
| P1 | Onboarding | Final `Boshlash` and `Yopish` previously both returned to Profile; misleading completion action | **Fixed:** `Yopish` returns to Profile; `Boshlash` sets Home tab then closes guide |
| P1 | Onboarding | Step changes could preserve ScrollView offset | **Fixed:** reset vertical scroll to top on Next/Back |
| P2 | Transactions | Period option chips 37dp and apply 43dp were below DS 44dp target | **Fixed:** 44dp from layout token, including filter reset and empty-state reset |
| P2 | Transactions | Date-range validation text was not marked as live region | **Fixed:** accessible polite announcement, explicit Apply/Clear labels |
| P2 | Dashboard vs Analytics | Dashboard graph is static separate demo data, while Analytics totals are calculated from session transactions; identical-looking “Xarajatlar tahlili” could imply shared data | **Fixed label:** Dashboard `Oylik xarajat namunasi`. Existing distinct data sources and disclosure preserved |
| P2 | Demo persistence | Reload resets changes and banking/account not connected | Accurate disclosure remains; no production backend implied |

## Screen audit and remaining manual criteria

| Screen | Current structure | Acceptance gate |
|---|---|---|
| Dashboard | Demo balance/Safe-to-Spend; static monthly chart and session recent transactions | Eye toggle and demo disclaimer; 320/360/393 widths; no score/status presented as real |
| Transactions | Search and period filters, summary, grouped list, reserved Add CTA | 44dp picker/reset; custom date error; no row obscured; Save/Edit/Delete navigation |
| Transaction Editor | DS form with kind, amount, category, date/Today, notes, confirmation | Numeric validation, future date and invalid range rejected; keyboard + scrolling at 320px |
| Analytics | Session-derived income/expense/turnover, per-day chart and categories | Totals match transactions after add/edit/delete; no fabricated historical comparison |
| Profile | Session count and status, quick links, reset with confirmation | Reset cancel/confirm and navigations; no fake account or cloud sync |
| Onboarding | Optional 3-step walkthrough from Profile | Close returns Profile; final Begin returns Home; progress/back and scroll-to-top; records not reset |

## Test matrix

Run on desktop:
```powershell
npm ci
npm run typecheck
npm run test:transactions
npm run test:analytics
npm run test:design-system
npm run test:ui-contract
```

Manual checks:
1. Chrome responsive at **320×640**, **360×800** and **393×852**, including 1.3x text scale.
2. Explore every tab; no clipping, horizontal overflow, or navigation covering a last card.
3. Add a 100000 UZS expense; Analytics expense should increase accordingly; Profile count should increase by 1.
4. Edit and delete test record; verify totals adjust appropriately.
5. Custom date invalid/future rejected and errors announced. Filter reset restores list.
6. Open Profile's guide → Next/Back across 3 pages → Finish: Home displayed. Repeat guide → Yopish: Profile displayed.
7. Reset demo with cancellation and confirmation. Confirm restores demo baseline, not a real remote store.
8. Browser runtime logs have no uncaught error. Android/iOS real-device QA required separately.

## Known release blockers

- **Not verified**: manual browser QA at 320/360/393 and font scaling. CI source contracts do not prove pixels, keyboard behavior or screen reader announcements.
- **Not built**: secure Supabase mobile auth/data access, storage, complete onboarding persisted state and real financial balance calculation.
- **Still draft/staged**: stacked PRs upstream of this branch; safe merge order needed.
- **Security gate**: prior independent Supabase audit uncovered permissive role grants/RLS. This public document deliberately does not disclose exploit specifics. No database policy or project changed.
- **Release rule**: do not merge to `main` or call production-ready until QA and upstream integration checks pass.
