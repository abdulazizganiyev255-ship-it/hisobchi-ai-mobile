# D01 — Design Foundation · acceptance review

Status: **implemented on design branch, pending automated and visual QA**

## Decisions preserved

- Five tab order: Bosh / Tarix / AI / Tahlil / Profil
- Approved ivory + plum palette and sculptural balance-card aesthetic
- Mock UI first; real Auth, Finance Engine, AI and Voice later
- Money must not be represented as verified if sourced from mock data
- Existing show/hide balance, chart period switch and history shortcut remain

## Design tokens

| Token | Value |
| --- | --- |
| Background | `#F7F1EB` |
| Surface | `#FFFBF7` |
| Primary plum | `#6D2C4E` |
| Ink | `#19191D` |
| Secondary text | `#65575E` |

## QA checklist (not yet verified)

- [ ] Run `npm ci` and `npm run typecheck`
- [ ] Render at 320dp, 360dp, 393dp and 430dp widths
- [ ] Confirm five-tab labels do not clip
- [ ] Confirm iPhone safe area / Android edge-to-edge spacing
- [ ] Show/hide balance works and hides demo amount
- [ ] Period switch changes chart and sample amount
- [ ] Recent transaction shortcut opens history
- [ ] All actions either work in mock mode or explicitly state unimplemented demo behavior
- [ ] No blue legacy design fragments remain
- [ ] Screen-reader labels and large text scaling verified
- [ ] Reduce-motion setting tested once animations are introduced
- [ ] No real keys, real financial data or live backend requests

## Out-of-scope for D01

All 31 screens, transaction input form, calendar, audio capture, AI responses, persisted navigation, production backend, payments and app-store release are **not** complete.

## Implementation audit notes

1. Legacy app shipped dark-blue theme, only four tabs and misleading graph y-axis labels. D01 moves to the approved tokens, adds the AI tab and removes unsupported fixed monetary y-axis labels.
2. Expense and income quick actions currently open clear demo messaging. D02 should replace them with a real mock transaction form.
3. Design ribbon is drawn locally with react-native-svg; no licensed or externally downloaded artwork.
4. Ledger-related data remains untouched. Supabase production RLS must be remediated independently.

## Definition of D01 Done

D01 can be marked **Done** only after a successful typecheck and visual comparison against the approved iPhone reference, with any blocking issues fixed. A successful Git commit alone is not sufficient.
