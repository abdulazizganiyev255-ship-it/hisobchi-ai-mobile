# D02 — Mock Transaction Entry & Calendar

Status: **implemented on stacked branch; CI + device visual QA required before merge**.

Base: `design/d01-ivory-plum-foundation`. Do not merge D02 directly into `main` before the D01 foundation has been reviewed and merged.

## Approved UI goal

1. From **Bosh** choose **Xarajat** or **Kirim**.
2. Dedicated full-screen entry form in the approved ivory/plum design.
3. Input positive integer UZS; select category and occurrence date; optionally enter note.
4. Tap the date to open the Monday-first calendar, navigate months and choose a non-future date.
5. Save a **mock** transaction into **Tarix**; recent-transaction list on **Bosh** updates.
6. Show clear success feedback, while being explicit: no real API write, no session persistence, no change to the demo balance.

## Code inventory

- `src/data/calendar.ts`: date-only ISO helpers (never `toISOString` for calendar days).
- `src/data/mockEntry.ts`: entry categories, input normalization, positive integer validation and demo row mapping.
- `src/components/CalendarSheet.tsx`: native modal calendar, prev/next, today, selected/future dates.
- `src/screens/TransactionEntryScreen.tsx`: expense/income, amount, category, date, note, validation, cancel/discard.
- `App.tsx`: screen entry mode, in-memory list and callbacks, preserving existing tabs.
- `src/screens/DashboardScreen.tsx`: expense/income CTA navigation + newest items.
- `src/screens/OtherScreens.tsx`: in-memory history + mock-only success feedback.

## Acceptance criteria

- [ ] `npm ci && npm run typecheck` succeeds on GitHub Actions.
- [ ] Calendar unit tests pass for leap dates, invalid dates, Monday-first rows, year boundaries.
- [ ] Native/iPhone screenshot at 320, 360, 393 and 430 dp: no clipping or overlap.
- [ ] Both CTAs open the form with correct selected entry kind.
- [ ] Date picker opens, selects day, closes, and uses device-local calendar date.
- [ ] Future date cannot be selected.
- [ ] Empty amount, zero, invalid and oversized amounts are blocked with inline text.
- [ ] Categories switch per expense/income and preserve other draft fields.
- [ ] Cancel with entered data prompts before discarding.
- [ ] Save adds one mock item to Bosh and Tarix without changing the demonstration balance.
- [ ] New item appears correctly signed, positive for income and negative for expenses.
- [ ] App reload loses in-memory added items as documented — **this is expected for D02**.
- [ ] Screen-reader labels, focus, keyboard and scroll are checked on real devices.
- [ ] No Supabase, AI, STT, banking or real finance engine integration.

## Known limitations

- D01 lacks actual device screenshot verification; D02 does not magically satisfy it.
- The calendar is a native RN `Modal` for the mock flow and should be tested for Android hardware Back and VoiceOver/TalkBack.
- Demo balance and chart are static samples. In-memory transactions must not be interpreted as updating real account balances.
- Real account selection, ledger, persistence, recurring payments, voice approval, offline queue and other screens are future work.

## Gate

Mark D02 complete only after TS CI, calendar tests, interactive navigation test, and actual native screenshots succeed. A PR with passing typecheck alone is **not visually approved**.
