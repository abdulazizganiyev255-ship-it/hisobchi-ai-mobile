---
name: component-quality-gate
description: Enforce measurable component state, accessibility, React Native behavior and screenshot quality before accepting any Hisobchi AI UI component.
---
# Component Quality Gate
## Inputs
Component contract, associated tokens, source target and rendered implementation, device/QA evidence.
## Checklist
1. Required states: default, pressed/focused/selected, disabled, loading, empty, error, success, where meaningful.
2. Accessible name, TalkBack/VoiceOver order and clear state announcements.
3. Text and visual contrasts measured against WCAG 2.2; target >=44dp app design threshold.
4. Layout without cropping at 320/360/393dp, with 1.3x/2x scaling.
5. Native keyboard, date modal Back, scrolling, safe area and Reduce Motion.
6. Finance data-source labels and chart summaries accurate.
7. `npm run typecheck` plus appropriate existing model/contract/E2E tests; review native screenshots independently.
## Scoring
20 financial correctness + 20 hierarchy + 15 accessibility + 15 states + 10 consistency + 10 native/performance + 10 craft. Minimum 90 for *S+ review*, not auto-approval.
## Output
Evidence IDs, pass/fail matrix, measured contrast, image-diff refs, P0/P1/P2 issues, score if testable, exact remediation plan.
## STOP
Any P0/P1 blocks approval regardless of score. Unknown native test = NOT_TESTED, never PASS.
