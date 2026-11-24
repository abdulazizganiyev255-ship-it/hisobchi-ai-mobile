# D03 — Profile, Accounts, Goals and Visual QA

## Scope

- Preserve D01 approved ivory/plum design tokens and five-tab shell.
- Preserve D02 mock expense/income entry and calendar.
- Add Profile → Accounts and Profile → Goals, with in-memory mock creation.
- Allow an unknown account opening balance (null) **distinct from** an explicitly entered 0 UZS.
- Goal target and saved amount are validated as bounded whole UZS.
- Goal due date is **optional**; when requested, calendar allows current/future dates.
- Past expense calendar remains current/past only.
- Keep all data sample-only; do not write to Supabase or change the fixed demo dashboard balance.

## Audit/corrections

| ID | Finding | Correction | Evidence |
| --- | --- | --- | --- |
| D03-01 | Old profile account row had no action | Added accessible accounts and goals navigation | source/CI |
| D03-02 | Unknown opening balances could be displayed as 0 | Use `number|null` and explicit Noma’lum state | unit tests |
| D03-03 | Goal deadlines might become mandatory | Nullable due date + validation | unit tests |
| D03-04 | Expense date picker blocks future dates | Added explicit `mode='future'` while keeping default past | unit tests |
| D03-05 | Unsaved new-account/goal input could be discarded without notice | Added discard confirmation | source check |
| D03-06 | Tertiary text contrast only 3.50:1 on ivory | Changed `faint` from #8E7C82 to #75646B; ratio 4.94:1 on ivory, 5.38:1 on warm-white | WCAG numeric computation |
| D03-07 | D01-D02 lacked screenshots at target widths | Added Playwright responsive web screenshots & interactions in GitHub Actions | pending CI |
| D03-08 | Playwright 1.56.1 failed to install on runner ubuntu26.04 | Pin visual job to ubuntu-24.04 | pending CI |

## Quality gates

- [ ] GitHub typecheck (D03)
- [ ] Date, amount and finance-setup unit tests
- [ ] Expo web export
- [ ] Browser screenshot/artifacts at widths 320, 360, 393 and 430
- [ ] Visual scrutiny of actual screenshots (not just CI green)
- [ ] Native iPhone / Android screenshot, back navigation, keyboard and screen reader
- [ ] Check PR base chain #35 → #37 → #38 before merging

## Security and financial trust

This is **not** a ledger. Mock account and goal lists live in React state and vanish after a reload. The Home balance remains a labelled sample and is *not* recalculated from account cards or newly saved mock transactions.

Backend P0 RLS, Auth and ledger isolation must be remediated before any release with user finance data. No user data, service role credentials, or real payments are stored in the frontend.

## Known gaps

- No account-to-transaction mapping, real recurring bills, account reconciliation, debt management, profile settings persistence, voice ingestion or backend.
- No actual native screenshots so native design status remains *unverified*.
- Screenshot workflow is responsive Expo Web, **not** a substitute for a simulator/device audit.

## Next

Finish D03 visual verification and fix any blocking layout defects. Only then proceed to D04 advanced profile/settings or other 31-screen inventory gaps.
