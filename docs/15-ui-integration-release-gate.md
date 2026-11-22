# Hisobchi AI — UI integration release gate (2026-11-22)

## GitHub audit — actual branch graph

- `main` → `feat/dashboard-premium-v02` (**PR #2**)
- → `feat/transactions-v03` (**PR #6**)
- → `feat/transactions-date-range-v04` (**PR #7**)
- → `feat/analytics-premium-v06` (**PR #10**)
- → `feat/design-system-v1-foundations` (**PR #11**)
- → `feat/design-system-v1-dashboard-operations` (**PR #12**)
- → `feat/design-system-v1-transaction-editor` (**PR #13**)
- → `feat/design-system-v1-profile` (**PR #14**)
- → `feat/design-system-v1-onboarding-demo` (**PR #15**)
- → `feat/design-system-v1-final-ui-qa` (**PR #16**)
- → `fix/transactions-fab-calendar-v16` (**PR #17**)
- → `feat/analytics-custom-date-range-v17` (**PR #18**)
- → `test/integration-release-gate-v18` (**this PR**)

These are stacked PRs, **not independent changes**. Each PR's base is the prior feature branch. Do not blindly merge them simultaneously. Re-evaluate base refs, CI and diff after each controlled integration step, especially if an earlier feature branch is deleted or modified.

There is a separate, unmerged **Draft PR #9**, `docs/mobile-supabase-security-architecture`, targeting `main`. It is documentation only and does **not** authorize connecting/mutating a Supabase project.

### Latest source comparison

The GitHub compare API reported current `feat/analytics-custom-date-range-v17` **115 commits ahead and 0 behind** `main`; its latest PR #18 GitHub Actions completed `success`. This fact reflects the compared refs at the time of review. It does *not* constitute visual mobile approval or guarantee of mergeability after concurrent changes.

## Cross-screen integration invariant tests

`npm run test:integration` executes the following **pure TypeScript model modules**: `demo.ts`, `transactions.ts`, `periods.ts`, `analytics.ts`.

Verified scenarios:
1. Baseline 5 demo operations → income 3,000,000 UZS, expense 259,000 UZS, net 2,741,000 UZS, turnover 3,259,000 UZS.
2. Create expense 100,000 UZS dated 2026-11-21 → count 6, expense 359,000, net 2,641,000, turnover 3,359,000.
3. Inclusive custom range Nov 20–21 → income 3,000,000, expense 142,000, net 2,858,000, turnover 3,142,000; category sums match.
4. Edit that expense to 50,000 dated Nov 22 → expense 309,000, net 2,691,000, original day recalculates.
5. Delete and reset → baseline values restored.
6. Invalid or absent custom range cannot silently display all entries. Empty valid range shows zero and empty breakdown.

These are **data-layer integration** checks, not simulated physical taps, DOM snapshots or native device end-to-end tests. Source-contract tests are separate and likewise do not prove pixel-perfect layout.

## Manual go/no-go gate

Before `main` merge, user or reviewer must confirm:

- Web responsive 320×640, 360×800, 393×852, zoomed text: no horizontal overflow or obstructed `+ Qo‘shish`.
- Transactions: add, edit, delete, search, category, date filter, custom range, time and sums.
- Editor modal calendar: date selection and cancel; future dates disabled; invalid form blocked.
- Analytics: custom range calculations match transactions and category breakdown; charts render with short and empty ranges.
- Profile: navigation and reset confirmation; Onboarding Next/Back/Finish and dismissal.
- Runtime: no Expo Web uncaught exception.
- Native mobile Android/iOS and accessibility checks if applicable to release target.
- GitHub branch protection, reviewer sign-off, CI completion and precise upstream integration order.

**Demo restrictions:** No authentication, bank sync, server storage, AI calls, or live Safe-to-Spend. UI displays independent sample Dashboard balance and monthly graph; Analytics uses session transactions.

## Recommended merge strategy (not executed)

1. Verify screenshots and all test steps above, then approve the UI scope.
2. Review PR #2 and its branch versus `main`. Merge first only if pass criteria met.
3. Continue upstream→downstream (#6, #7, #10, #11, #12, #13, #14, #15, #16, #17, #18, and this PR). At each step refresh base, check resulting diff and CI. Consider a single audited/squashed integration PR only after verifying all component dependencies; otherwise history and conflicts can be obscured.
4. PR #9 security architecture can be reviewed separately. Do not interpret it as a security remediation deployment.
5. Start new **staging** backend design only after authenticated ownership, isolation and RLS are reviewed and approved. Production data must not be modified by UI QA.

All changes in this branch are non-production: tests and documentation only; no backend/DB mutations.
