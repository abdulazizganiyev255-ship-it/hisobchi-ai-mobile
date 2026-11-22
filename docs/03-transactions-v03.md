# Hisobchi AI — Transactions v0.3

## Scope

This is a **demo-only, in-memory** CRUD prototype for the Transactions tab. It does not connect to Supabase or persist data.

Implemented:
- UI refinement after mobile screenshot audit: large top CTA replaced by a floating thumb-reachable `+ Qo‘shish` above bottom navigation; list gets extra scroll-bottom clearance.
- Income and expense totals moved under search/filter to two compact cards and explicitly labeled as **all demo records** (not filtered totals).
- Grouped transaction history by ISO date.
- Search by title, category, date text, or note.
- Filters: All / Expenses / Income.
- Add transaction form: kind, integer UZS amount, category, date YYYY-MM-DD, optional note.
- Edit existing transaction.
- Delete with an in-app confirmation step (does not rely on web Alert).
- Deterministic display type and date rules, accessible buttons.
- Realtime transaction list and Dashboard latest three rows share the session state.

Explicit limitations:
- Existing Dashboard **balance, safe-to-spend, monthly chart** and Analytics totals are fixed demo sample values. User-created entries do **not** recompute them. Do not misrepresent them as actual account balances.
- Refresh/reopen resets to initial sample transactions. No backend, auth, bank account or AI.
- Original sample transaction dates are pinned to November 2026. Subsequent user edits receive their chosen date.
- Dates are local device calendar dates. Production date boundaries and timezone require Supabase audit.

## Quality gates

Automated:
- `npm run typecheck`
- `npm run test:transactions` (integer amount parsing, invalid dates incl. leap year, positive/negative mapping, filter/search)
- GitHub Actions run both on pull requests to main and on stacked PRs targeting the v0.2 feature branch.

Manual browser QA (Chrome Device Toolbar 393 x 852, then 360 x 800):
- New `Qo‘shish` floating action is visible above bottom navigation during scrolling and opens the same editor; **must not obstruct the last row or footer** when scrolled to the bottom.
- Two compact monetary summary cards appear below search/filter with income then expense; their totals reflect the whole demo session even when search/filter is active.

1. **Operatsiyalar** → **Operatsiya qo‘shish**.
2. Xarajat: **85 000 so‘m**, kategoriya **Kafe**, today's date, note. Save. It appears in the list and the expenses subtotal increases by 85 000.
3. Open that row: edit to **120 000**, save. List and subtotal update (not double-count).
4. Open row → **Operatsiyani o‘chirish** → **Bekor qilish**. Row must remain. Repeat → **Ha, o‘chirish**. Row must disappear and subtotal recalculate.
5. Add income **500 000 so‘m** with **Ish haqi**. Income filter shows it; expense filter excludes it.
6. Search `kafe`; then search gibberish: empty-state appears and **Filtrni tozalash** resets.
7. Dashboard latest operations include new/edited entries; balance & chart remain sample.
8. Enter `0`, `-10`, `22.5`, empty amount, `2025-02-29`, future date: form must show validation and not save.
9. Form content is scrollable with keyboard opened; nav hidden during editing. Other four tabs remain usable.
10. Refresh page: reset to initial sample and demo reminder visible.

Do not merge this branch until Chrome screenshots, interaction smoke test and CI pass.

## Next

After v0.3 demo acceptance, start **read-only Supabase schema / RLS audit** before creating migrations or claiming persistent transactions.
