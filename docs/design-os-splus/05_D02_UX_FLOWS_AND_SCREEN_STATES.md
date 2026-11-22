# D02 — Information Architecture, User Journey and Screen-State Spec
**Depends on:** D01 Financial Truth. **Owner:** Information Architect. **Status:** UX-SPEC COMPLETE; interaction mockup and native validation pending.
**Code source:** fix/mvp-fab-period-v24.

## Product user job
In ≤ three actions, the user must (a) recognize this is a demonstration, (b) understand what the Safe-to-Spend card does *not* calculate, and (c) reliably add and review an expense without thinking the sampled balance was recalculated.
This is a DESIGN ACCEPTANCE TARGET, not an observed usability measurement.

## Six screens and their responsibilities
| Screen | Main task | Existing behavior | Proposed refinement | State gate |
|---|---|---|---|---|
| Home | Orient finances and discover primary action | demo balance, safe card (Alert explanation), sample monthly chart, recent session items | lead with clearly tagged Safe-to-Spend, promote first-class inline explanation and Add CTA | demo/disconnected/out-of-date distinguished |
| Transactions | Audit ledger history and find entry | session list, search, kind and period filters; independent narrow Add FAB | readable ledger grouped by date, clear Add and empty/filter actions | no FAB masking last entry, no faux cloud |
| Transaction Editor | create/edit/delete record | validated amount/category/date/note and confirm deletion | simpler form hierarchy, entered amount first, calendar on tap, sticky action keyboard-aware | invalid/valid/saving/success/cancel/undo (if later implemented) |
| Analytics | inspect session-derived figures | sums, category shares, date filters, daily chart | disclose session provenance, provide accessible text summary | empty, no-data, filtered, error/large values |
| Profile | explain app and settings | demo profile, guide, reset confirmation | clear Data & Privacy / Local demo / Help sections | no fictional identity, no fake sync |
| Onboarding | understand app once or via help | optional 3-step walkthrough from Profile | simple 3-step explanation, retain Exit versus Finish distinction | return stack, focus reset and large text |

## Main critical journey, including current versus proposed
~~~mermaid
flowchart TD
    A[Home: DEMO badges visible] --> B[Tap Safe-to-Spend info]
    B --> C[Explain sample value and missing real calculation]
    C --> D[Close explanation]
    D --> E[Tap Add expense]
    E --> F[Expense Editor]
    F --> G{Form valid?}
    G -- No --> H[Show inline field error and focus invalid field]
    H --> F
    G -- Yes --> I[Confirm save to current session]
    I --> J[Transactions: newly added row]
    J --> K[Analytics: derived session totals updated]
    K --> L[Home: recent row updated; demo sample untouched]
~~~
- **CURRENT v2.4:** Home info is Alert; Add is on Transactions tab; save navigates to Transactions; Analytics derives session totals.
- **PROPOSED after creative target approval:** Home direct Add CTA and readable Safe-to-Spend explainer (bottom sheet/inline section), without claiming real finance computation.

## Navigation and transitions (target)
| From | Event | Guard | Outcome | Back/cancel behavior |
|---|---|---|---|---|
| Home | info tap | none | read-only explanation sheet | close back to same scroll position |
| Home | Add expense | not in modal | Expense Editor | cancel returns Home; no data mutation |
| Transactions | add FAB | not in modal | Expense Editor | cancel returns Transactions |
| Transactions | select row | valid transaction ID | edit/delete detail | cancel returns Transactions |
| Editor | save | validates amount, category, ISO date (≤ today) | commit session entry, show sourced feedback | prevent accidental duplicate save |
| Editor | invalid save | validation errors | stay Editor; error announced | edits preserve other valid inputs |
| Editor | delete | explicit confirmation | remove session entry, return list | cancelled delete does nothing |
| Analytics | choose custom date | valid start/end before applying | recalc included session transactions | cancel picker keeps previous date range |
| Profile | open guide | none | Onboarding step 1 | close returns Profile |
| Onboarding | final Start | 3rd step | Home | no transaction reset |
| Profile | reset demo | explicit confirmation | seeded demo restored | cancel leaves state unchanged |

## State matrix (design coverage)
| View | Required states | Key acceptance |
|---|---|---|
| Home/amount | demo, hidden, unavailable, loading, source explanation | never imply bank link; hidden state exposed accessibly |
| Home/chart | 2-period menu closed/open/selected; demo disclosure; zero/one/multi-point future-proofing | two options only on Home; no invented historical relation |
| Transactions | populated, zero records, no search results, filtered, loading/error (when backend exists) | accessible reset and Add CTA; last row readable |
| Editor | untouched, dirty, invalid, valid, saving, saved, deletion confirm/cancel | date from calendar, keyboard-safe action, no double submit |
| Analytics | no records, all/filtered/custom date, invalid range, chart partial, data updated | figures sum from same transaction source |
| Profile | demo mode, reset confirm, reset success, guide | no fake premium or synced account status |
| Onboarding | first/middle/last, previous/next/close, enlarged text | footer visible, scroll resets, Back semantics |

## Component contract starts here
- MoneyAmount: currency, number formatting, source badge, amount privacy flag, accessible full UZS string, no silent truncation.
- SafeSpendCard: sample/verified/unavailable union; explanation and source detail required; no user investment/financial advice language.
- PrimaryAction: label, minimum 44dp touch, pressed/disabled, submit in-flight guard, platform haptics only where appropriate.
- DatePickerTrigger / DateCalendar: controlled ISO date, selected-disabled days, month navigation, focus return, Android Back.
- TransactionRow: positive/negative sign in text, title, date, source, right-aligned amount, 2x font resilience.
- ExpenseChart: data source and unit, sample label, text alternative, correct scales, 0/1 point safe fallback.
- BottomNav: 4 tabs, selected semantics, navigation restoration and safe area; no decorative full-width add rail.
- InlineError / EmptyState / LoadingState: names, messages, recovery action; no fake success.

## Auditable acceptance scenarios
A01 Home first glance: user can identify DEMO and distinguish total balance from sample safe spend in 3 seconds (needs usability test).
A02 Tap SafeSpend: disclosure persists after closing/reopening, no real-calculation statement.
A03 Add invalid sum 0: inline error, not saved, user retains category/date.
A04 Add valid 100,000 UZS expense: saved in session; 6 total records, total Analytics expense 359,000; Home demo fixed sample unchanged.
A05 Edit/delete: Analytics figures recalc and return navigation works; confirm deletion is not implicit.
A06 Calendar: tap date field opens calendar, cannot select future date, closes correctly via native Back.
A07 Analytics date custom invalid start>end: prior applied range preserved and error spoken.
A08 320/360/393dp + 1.3x/2x text: no clipped amounts, hidden Add or bottom nav overlap.
A09 VoiceOver/TalkBack: source provenance and units spoken; selected tab and menu semantics.
A10 Reset: explicit warning, cancellation preserves entries; confirmation seeds demo only.
A11 Actual bank/secure production UI remains out of scope; demo descriptions honest.

## Next handoff
D03 Creative Director prepares 3 **distinct** Home compositions using the exact same truthful demo dataset and journey. They are only visual explorations. D04 user selects one, D05 finalizes tokens, then D06+ implement gated reusable components. No code or database writes in D02.
