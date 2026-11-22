# Living Ledger v0.2 — Transactions + Editor Visual Quality Gate
**Reviewed:** 2026-11-22 | **State:** Draft PR #30 / browser-tested pilot | **Target:** 320×640, 360×800, 393×852.
**Code branch:** design/splus-living-ledger-transactions-v02
**Parent:** design/splus-living-ledger-home-v01 / Draft PR #29.

## UX decisions (compared to old blue UI)
- History: one top-level solid coral action (“Yangi operatsiya”), no floating add rail covering records.
- Filters: one search, explicit date-period options, 3-way type filter; custom range validated before applying.
- Summary says “KO‘RINAYOTGAN YOZUVLAR BO‘YICHA”; sums computed from **visible filtered session entries**. This intentionally corrects ambiguous older period-only totals.
- Rows: ledger-style rules, stable ISO date formatting, signed UZS and editing action.
- Editor: dark primary save action, large amount input, category cards with selected icon/border, one calendar button and “Bugun” shortcut.
- Delete: explicit 2-step confirmation with cancel. No fake sync, no server request.
- Calendar: reused existing deterministic calendar functions; invalid/future days disabled; onRequestClose supports native modal Back.
- Light shell: migrated Home / History / Editor only; untouched Analytics and Profile remain old themed (known inconsistency pending migration).

## Source-of-truth behavior
- All transactions remain React state, initialized from deterministic demo dataset.
- Creation with amount 100,000 UZS: total visible expense on All 259,000→359,000 UZS and count 5→6.
- Edit new entry to 50,000 UZS: expense 309,000; count remains 6.
- Delete confirmed: expense returns to 259,000 and count returns 5.
- After returning Home: fixed demo Safe-to-Spend 145,000 and fixed sample monthly expense 3,840,000 remain unchanged.
- Search/type/date selections affect visible rows and the displayed totals only. They are not mutations.

## Actual GitHub Actions results
**Run [#45048100123](https://github.com/abdulazizganiyev255-ship-it/hisobchi-ai-mobile/actions/runs/45048100123): all jobs passed for commit f4552e353d0c72c0a20e6010007cab71a63d0698.**
- TypeScript strict compilation: passed.
- Existing transaction/date/Analytics/DS/source-contract/integration tests: passed.
- Living Ledger source assertions incl. 3 migrated components: passed.
- Expo Web and Android JavaScript bundle exports: passed.
- Chromium browser: 320×640, 360×800, 393×852, both prior Home E2E and new Transactions→Editor journey passed.
- Browser E2E specifically confirmed empty search, filter clear, type filter, custom date modal/cancel/apply, invalid amount, create/edit/delete confirmation/cancel, totals and Home invariants.

**Manual screenshot audit:** 27 Chromium screenshot files in "living-ledger-responsive-screens" artifact from the above run; visually reviewed selected 320px and 393px views including operations list, editor, calendar and post-create state:
- No observed horizontal clipping; 320px title, CTA, summary, tab nav fully visible.
- 320px calendar seven-column layout fits the width, disabled future dates and selected day visually distinguishable.
- List after creation shows 100,000 UZS entry and sum increase.
- Editor screenshot at 320px shows large input, form type, category; lower controls require vertical scroll and were exercised by browser E2E.
- 320px first viewport shows only top of first transaction below summary. This is a **P2 density trade-off**; can be improved after user testing, but no action appears obstructed by an overlay.
- Native font scaling/keyboard and screen-reader reading order remain unverified.

## Independent contrast sample (WCAG formula)
| Foreground | Background | Measured ratio | Target |
|---|---|---:|---:|
| #142821 primary text | #F7F5EF paper | 14.21:1 | 4.5:1 |
| #536159 secondary text | #F7F5EF paper | 5.98:1 | 4.5:1 |
| #1D4D3C active color | #E7EEE3 sage surface | 8.14:1 | 4.5:1 |
| #9C2738 error text | #F7F5EF paper | 6.98:1 | 4.5:1 |
| #142821 CTA text | #F27452 coral | 5.46:1 | 4.5:1 |

These validate selected palette roles only; they do not establish full WCAG compliance across all states.

## Identified risks / gates
| Level | Issue | Next action |
|---|---|---|
| P0 release | No real Safe-to-Spend engine, secure user persistence or Auth/RLS | Keep DEMO; separate data-security workstream |
| P1 native | TalkBack/VoiceOver, keyboard cover, focus restoration and 1.3×/2× font scaling untested | Native QA on representative Android and iOS |
| P1 product | Other Analytics/Profile/Onboarding screens remain old themed | Move to Living Ledger by separate staged PRs and test before merge |
| P2 UX | At 320px first transaction is below fold; too many blocks above it | Consider compact information architecture after usability evidence |
| P2 architecture | Parallel legacy screens remain in repo for transition/source-contract safety | Remove only after PR chain merges safely and tests are updated |
| P2 test | Existing legacy web smoke script targets old Home/Transactions texts | New Living Ledger suite is authoritative for new routes; update legacy suite when migration finishes |
| P1 QA | No signed APK, native end-to-end or device screenshot signoff | Block release/production designation |

## Next work
D09: migrate Analytics charts, period validation and all financial labels to Living Ledger while retaining exactly the same calculation model; add browser E2E and native accessibility review.
D10: Profile and optional Onboarding.
D11: multi-device/manual accessibility and performance tests.
D12: score only once full target is rendered and verified; current 90+/S+ claim is not justified.

No production data, bank or Supabase records changed in this PR.
