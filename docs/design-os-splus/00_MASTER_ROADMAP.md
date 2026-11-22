# HISOBCHI AI — S+ Design OS / Master Roadmap
**Version:** 0.1 • **Date:** 2026-11-22 • **Status:** Planning baseline (NOT design freeze or release)
**Code baseline:** `fix/mvp-fab-period-v24` (`c3f15e77030790e83382933f85238db71cb87217`). This document branch is based on it.
**Scope:** UI/UX redesign from fresh visual principles while retaining finance-domain functions, validation and tested user flows.
**Platforms:** mobile first (React Native / Expo / TypeScript); responsive web/desktop is secondary. Do not migrate languages for aesthetic reasons.

## Verified existing facts
- `main` is older prototype; six-screen demo plus component library and tests live on stacked draft branches. DO NOT merge or alter main as part of planning.
- Six screens: Dashboard, Transactions, Transaction Editor, Analytics, Profile, optional Onboarding.
- Data is local session demo. No real accounts, bank connectivity, Auth, production Safe-to-Spend engine or production AI. Dashboard sample chart and Analytics session calculations are different data sources.
- Latest branch v2.4 intentionally removes the full-width blue FAB band; Dashboard period choices must be precisely **Bu oy / O‘tgan oy**. No decorative floating background elements or unwanted dock.
- Recent branch CI includes successful TypeScript and Expo Web smoke runs; native physical-device visual verification and accessibility remain open.
- Prior work included Design OS and earlier visual directions, but user requires a distinct creative restart; do not equate previous aesthetic choices with approved new design.

## Product outcome
A person opens Home, recognizes **how much they can safely spend**, understands the source/assumptions of that number, adds an expense, and observes the effect without confusing estimates with actual ledger amounts. This is a design outcome, not yet an implemented real finance calculation.

## Design decision hierarchy
1. Truthfulness and financial safety.
2. Task clarity and information hierarchy.
3. Interaction design and error recovery.
4. Legibility and accessibility.
5. Coherent original visual identity.
6. Motion and delight (only after gates 1–5).

## 8-stage roadmap (dependency-ordered, not calendar promises)
| Stage | Work | Deliverable | Exit gate |
|---|---|---|---|
| 00 Evidence baseline | inspect repo, screenshots, CI, product logic, user needs | evidence register + audit inventory | all verified vs assumed marked |
| 01 UX architecture | task maps, content hierarchy, navigation, financial semantic states | flow diagram + six-screen inventory | primary flow and edge cases review |
| 02 Creative exploration | 3 visually distinct references translated into original layouts | 3 high-fidelity Home concepts and rationale | select one visually reviewed direction |
| 03 Foundation / Design System | DTCG-style semantic tokens: color, type, spacing, radius, motion, elevation, icon, chart | token spec + contrast report | all token pairs tested, no unknown financial semantics |
| 04 Component engineering | primitive → composite → domain-specific components | component contracts + interactive states | 100% required states + test cases |
| 05 Screen composition | implement Home then Transactions, Editor, Analytics, Profile, Onboarding | 6 production-shaped demo screens | per-screen behavior and data semantics verified |
| 06 Cross-platform QA | responsive, font-scaling, native accessibility, keyboard/Back, performance | screenshot diffs + QA reports | thresholds + zero critical defects |
| 07 Design freeze → release candidate | ADRs, handoff, implementation review, separate backend/security sign-off | approved version and change log | human sign-off, security & functional gates |

**Implementation order**: 1) Home Safe-to-Spend explanation, 2) create expense, 3) updated activity and Analytics, 4) filters and calendar, 5) profile/onboarding, 6) other ideas after core path passes. Do not expand to extra screens before this flow is coherent.

## Invariants (non-negotiable)
- Never imply sample balances, sample charts or forecasts are real; show explicit DEMO state.
- AI text is not the authority for Safe-to-Spend and cannot change the ledger.
- Actual, expected, estimated and scenario amounts require visually distinct labels and source semantics.
- No full-width blue FAB rail; a narrow, independent Add CTA may remain only when it does not obscure content.
- Dashboard month picker: only `Bu oy` and `O‘tgan oy`; Analytics may support other date ranges.
- Date tapping opens a real calendar; arbitrary custom range is validated, errors announced.
- No visual polish may break existing finance, form or navigation logic.
- `main` stays unchanged pending review of stacked PRs and native QA.

## Roles and governance
See `02_EXPERT_BOARD.md`; roles are capability definitions, **not claims that autonomous agents have been deployed**. Roles require an evidence input, defined output, critic and signoff.
Decision records: `[ID, problem, verified facts, hypotheses, alternatives, final choice, test, rollback]`.
Do not adopt a GitHub dependency wholesale. Check active maintenance, license, React Native / Expo SDK compatibility, peer deps, binary size and native build constraints.

## Scoring model (100 points, proposed for new design)
- Financial truth & task integrity 20
- Information hierarchy / reading speed 20
- Accessibility (contrast, scale, focus, target) 15
- Interactive states / failure recovery 15
- Design consistency / token fidelity 10
- Performance / native usability 10
- Distinctive craft / creative execution 10

**Score 90+ = eligible for S+ review, NOT automatically S+**. Hard blockers override score: any P0/P1 bug, false financial claim, inaccessible essential action, regressions in add/edit/delete, broken keyboard or focus path, or missing native QA means **NOT APPROVED**. Do not invent scores before tested artifact.
Evidence statuses: `VERIFIED_SOURCE`, `CI_VERIFIED`, `VISUALLY_VERIFIED`, `DEVICE_VERIFIED`, `ASSUMPTION`, `NOT_TESTED`.
Each component is approved only after requirement → spec → rendered proof → functional test → accessibility check → independent critique.

## First approved scope proposal
Design one end-to-end **Home → Safe-to-Spend explanation → Add expense → Activity/Analytics feedback** experience. The exact Safe-to-Spend formula must be separately verified before real data is displayed. Immediate outputs now: this master roadmap, baseline component audit, expert board and references. No change to production logic.

## Source anchors
- [Repo](https://github.com/abdulazizganiyev255-ship-it/hisobchi-ai-mobile)
- [v2.4 source notes](https://github.com/abdulazizganiyev255-ship-it/hisobchi-ai-mobile/blob/fix/mvp-fab-period-v24/docs/21-mvp-fab-period-v24.md)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Apple HIG charts](https://developer.apple.com/design/human-interface-guidelines/charts)
- [DTCG spec](https://github.com/design-tokens/community-group)
