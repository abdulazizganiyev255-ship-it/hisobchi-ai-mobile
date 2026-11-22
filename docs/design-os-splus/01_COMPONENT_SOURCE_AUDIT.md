# HISOBCHI AI — Baseline Component Audit / v2.4
**Audited source:** `fix/mvp-fab-period-v24` as at 2026-11-22. **Method:** code and test-document review, NOT a fresh live-device screenshot audit.
**Status key:** PRESENT = component exists in source; PARTIAL = implemented but has relevant unverified state/UX condition; MISSING = no verified implementation; HOLD = must not describe it as released.
**Severity:** P0 block (financial lie/security); P1 primary task or accessibility failure; P2 quality improvement. A *risk* is not a proven runtime bug. Scores deferred until artifact is rendered and independently reviewed.

## Source-based atom, molecule and domain-component inventory
| ID | Component / source | Existing evidence | Risk / design debt | Priority | Next audit / acceptance |
|---|---|---|---|---|---|
| C01 | `src/theme/tokens.ts` — color, spacing, type | central tokens present | many screen-local hex colors; 10dp micro and 12dp values risk legibility | P1 | semantic DTCG tokens, contrast matrix, scalable fonts |
| C02 | `src/components/AppIcon.tsx` and `.web.tsx` | shared custom SVG icon switch, web variant | two implementations drift; consistency and screen-reader decorative semantics need review | P2 | visual icon sheet and cross-platform glyph parity |
| C03 | `ds/SurfaceCard.tsx` | dark/light card | only tone variants; no semantic financial variants and interactive states | P2 | prefer meaning-based surfaces not generic repeated cards |
| C04 | `ds/ScreenHeader.tsx` | reusable screen heading | single-line shrink-to-fit may reduce legibility with long Uzbek strings and large fonts | P1 risk | text-scale 1.3x/2x, wrap and truncation audit |
| C05 | `ds/SectionHeader.tsx` | section heading/trailing slot | hardcoded light icon blue, narrow title + trailing collision risk | P2 | token-only colors, 320px plus long section title |
| C06 | `ds/FormHeader.tsx` | accessible back action | back caption in 12dp; pressed/focus feedback not specified | P2 | touch, focus, pressed and font scaling states |
| C07 | `ds/ActionRow.tsx` | 58dp action row, accessible label | no explicit pressed/disabled/long-content contracts | P2 | interaction, multiline, destructive semantics |
| C08 | `ds/ChoiceChip.tsx` | >=44dp and selected state | color reliance and selected description should be checked with reader | P2 | high contrast + TalkBack selected announcement |
| C09 | `ds/PeriodPicker.tsx` | expanded state and menu close logic | expanded chips can wrap and alter layout/scroll; focus behavior unverified | P1 risk | 320px + 2x type, focus order, open/close/Back |
| C10 | `ds/DateRangeFields.tsx` | click-to-calendar, 46dp | formatting and collision with large scale/long year values | P2 | localization, 320px, invalid range copy |
| C11 | `src/components/DateCalendar.tsx` | modal, disabled dates, month navigation, onRequestClose | real-device focus/keyboard, cell target size, 2000–today limit need validation | P1 risk | tap every date, disabled semantics, Android Back |
| C12 | `ds/EmptyState.tsx` | real optional action (only when callback exists) | empty is covered; loading/error/offline states not generalized | P1 | distinct loading, empty, error, retry, disabled, success |
| C13 | `src/components/TransactionRow.tsx` | shared row, date, title, amount | 11dp metadata/12dp amounts too small for financial hierarchy; number width at 320px | P1 design debt | right-aligned tabular figures, 2x text, +/- not only color |
| C14 | `ExpenseChart.tsx` | native SVG curve, labels, fill | missing verified spoken chart summary; `values.length-1` and `points[0]` require input preconditions | P1 risk | zero/one data guards; VoiceOver summary; units |
| C15 | `ExpenseChart.web.tsx` | separate web SVG implementation | web/native rendering split, height and style divergence possible | P1 risk | screenshot parity + consistent semantic legends |
| C16 | Dashboard balance hero | demo balance, eye control >=44dp | large gradient/ornamental curves dominate; total balance may outrank the core decision | P1 | compare 3 new layouts; preserve demo disclosure |
| C17 | Dashboard Safe-to-Spend | explicit `Namuna · hisoblanmagan`, opens demo Alert | currently not a real formula/explanation flow; financial promise must not be invented | P0 product block | no real claim until finance engine and provenance audited |
| C18 | Dashboard monthly chart period | **Bu oy / O‘tgan oy** explicit dropdown in v2.4 | demo chart disconnected from session activity; check user comprehension | P1 product clarity | two options ONLY on Home, label sample vs transactions |
| C19 | Transactions list/search/filters | filter, search, period, add CTA and date selectors | visual reflow with keyboard and FAB overlay; no verified current native screenshots | P1 risk | no blue strip, final row visible, live search and reset |
| C20 | Floating Add CTA | v2.4 removes artificial bottom 64dp rail; bottom padding 116dp | topological overlay may obscure content on different device sizes | P1 risk | manual Android screenshots + 320/360/393 E2E |
| C21 | Transaction editor | validators, categories, date calendar, add/edit/delete | numeric keypad + 2x text + submit visibility need native QA | P1 risk | CRUD regression, error announcement, keyboard |
| C22 | Analytics | period picker, custom date range, session-derived totals | chart labels and actual vs demo source consistency need truth audit | P1 | compare totals after add/edit/delete + screen reader |
| C23 | Profile | demo disclosure, reset confirmation, actions | identity and unreleased features must never imply authenticated account | P1 | action truth, reset cancel/confirm, privacy label |
| C24 | Onboarding | optional 3-step tutorial, separate exit/complete | no persistent completed state; 2x text and Back unverified | P2 | first-run logic only when real onboarding exists |
| C25 | App tab navigation / `App.tsx` | selected tab semantics, Android Back handler | route restoration, safe area, focus shift, native gestures not proven | P1 risk | TalkBack tabs, native Back, safe area screenshots |
| C26 | loading/error/success/permission states | scattered form/empty/reset messages | not a shared state model for every domain component | P1 | cross-component state catalogue and prototypes |
| C27 | test / CI pipeline | source contracts + Chromium E2E; recent v24 Web & TS successes | CI cannot prove hardware GPU, keyboard, accessibility, visual quality or backend security | P0 release gate | hardware screenshots and independent visual QA |

## Six screens: dedicated quality gates
1. **Home:** Safe-to-Spend dominant; explainable provenance; no accidental similarity between demo balance and real money; period only 2 options; clear hierarchy without purely ornamental cards.
2. **Transactions:** search/filter, scroll-to-last-row, single Add CTA, no full-width blue strip; empty/error/loading.
3. **Add/Edit:** valid UZS amount, categories, tapped calendar, today shortcut, cancel, save, deletion confirmation, keyboard-safe layout.
4. **Analytics:** actual session model totals; no fake forecasts; correct chart axes, date filters, empty history, accessible trend summary.
5. **Profile:** honest account state, working navigation, reset confirmation; cannot imply bank sync or paid features.
6. **Onboarding:** meaningful optional 3-step explanation; independent exit/finish; large text and scroll reset; not yet stored as persistent completion.

## Evidence and review status
- **VERIFIED_SOURCE:** v24 document describes removal of an artificial 64dp list bottom margin and 116dp scroll padding; 2-option Home month picker; screen/component files exist.
- **CI_VERIFIED:** latest GitHub Actions listing shows TypeScript validation and Expo Web mobile smoke succeeded on `fix/mvp-fab-period-v24` (2026-11-22 15:16 UTC). This is not a rerun performed in this audit.
- **NOT_TESTED HERE:** current native screenshot diff, Android Pixel 6 or iPhone behavior, TalkBack/VoiceOver, keyboard overlap, 2x text, backend/RLS, end-user comprehension.
- **RELEASE BLOCKS:** secure user data integration and real Safe-to-Spend remain separate P0 before production.
- **DESIGN SCORE:** **NOT ASSIGNED**. Do not fabricate 92/100 or percentages based on source inspection.

## QA acceptance cases for every component
- Normal / Loading / Empty / Error / Disabled / Success (where semantically applicable); selected/pressed/focus states for controls.
- Normal and 1.3x/2x font scale; 320, 360 and 393 logical pixel widths; 16:9 presentations are never substituted for device screenshots.
- W3C WCAG AA text contrast **4.5:1** (regular) or **3:1** (large text); non-text component contrast where applicable **3:1**. Aim for >=44dp app touch targets; these are internal design thresholds, not a restatement of WCAG's 24 CSS pixel minimum.
- No horizontal clipping; amounts do not truncate silently; consistent dates/locale; no color-only trend meaning; properly labeled screen-reader announcements.
- Performance budget must be measured on actual supported devices before accepting complex animation/blur.

## Recommended first redesign slice
`tokens/type` → `money/amount` → `safe-spend-summary` → `source-disclosure` → `add-transaction` → `activity-feedback`.
Do not start production data integration until domain contract and threat model are approved.
