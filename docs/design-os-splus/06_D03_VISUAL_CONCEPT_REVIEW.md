# D03 — Visual Concepts / review v0.1
**Status:** Exploratory board generated; no creative direction selected, no implementation started.
**Evidence:** 16:9 image board rendered inside ChatGPT conversation on 2026-11-22. Its binary is NOT currently committed to this repository. All text and figures in image outputs require source verification; do not treat AI-generated pixels as production assets.

## Product baseline for a fair A/B/C
- Demo balance: 12,850,000 UZS (fixed).
- Demo Safe-to-Spend: 145,000 UZS (fixed, NOT calculated).
- Home graph current: 3,840,000 UZS, previous: 4,180,000 UZS; two-option picker only.
- Most recent seeded transactions: food −85,000 on 2026-11-22 at 08:24, transport −12,000 same date 07:51.
- User action: Add expense. Actual write is to current in-memory session; Analytics derives totals from current session.
- Every concept must display DEMO at Safe-to-Spend; graph sample clearly disclosed and not accidentally mixed into Analytics.

## Concept A — Editorial Control (initial recommendation)
- Editorial ivory/ink base, botanical/forest accent, deliberate type scale.
- Financial hierarchy: Safe-to-Spend SHOULD rank first, with demo-status visible; total demo balance is context, not dominant hero.
- Interaction: accessible Add expense CTA, compact expense chart, minimal bottom navigation, no full-width dock.
- Strength: legible and calm, differentiated from generic blue gradient.
- Risk: current concept board places total demo balance first. Before locking, swap primary emphasis and enlarge “DEMO · hisoblanmagan” beyond a tiny pill.

## Concept B — Kinetic Ledger
- Rich near-black, concentrated amber, strong cashflow motion motif, precise transaction rows.
- Strength: visually distinctive, premium and focused.
- Risk: overly decorative line graph could imply real trend; contrast and color-only coding need measurement. Avoid GPU-intensive glow and bright gradients over small text.

## Concept C — Spatial Cashflow
- Clean warm white, muted teal and hierarchical paired financial surfaces.
- Strength: side-by-side amounts clarify context and provenance.
- Risk: side-by-side cards at 320dp can truncate long UZS figures; sample Safe-to-Spend should still receive first visual priority.

## Generated image board source-fidelity review
The generated board is a **concept visualization** only; source values and microcopy must be mechanically checked before engineering:
- Some displayed timestamp metadata differ from demo.ts; the code source is authoritative for test fixtures.
- Some user-facing labels say “hisobdagi mablag‘” without strong enough warning that there is no real bank account.
- High-level board scoring bars are *decorative*, not measured QA outcomes; do NOT quote them as pass scores.
- Charts are not verified to reproduce the underlying demo series or scales.
- None of the generated controls have yet been interactively or accessibly tested.
- Type contrast and 320dp/2x font scaling are unknown.
- The image may approximate Uzbek typography; copy must be corrected in source rather than baked into images.

## Decision
Recommend carrying **A: Editorial Control** to D04 human visual review, but not locking it. A's hierarchy requires revision: DEMO Safe-to-Spend first; balance second; expense CTA next; source explanation obvious; recent activity and chart below. Keep the same component/content requirements across alternative visual mocks.
Current gate: D03=concept visual evidence produced, QA unverified. D04=BLOCKED pending approved visual target.

## Acceptance before design lock
1. One high-resolution chosen mobile mockup with 320dp and 393dp variants.
2. Correct Uzbek content, exact fixture amounts and honest demo provenance.
3. Contrast check (normal 4.5:1, large 3:1 as relevant), screen-reader reading order, >=44dp design touch targets.
4. Header Safe-to-Spend and Add expense surfaced before a discretionary ornament.
5. No “calculated/real bank balance” claims; no blue dock or unrelated floating decorations.
6. Visual compare against 6-screen architecture; feasibility check against Expo SDK 58 / RN 0.88.1.

## Handoff / next task
D04: refine selected visual mockup and choose its locked tokens. D05: implement semantic design tokens only after the visual target is approved. All runtime app code remains untouched in this branch.
