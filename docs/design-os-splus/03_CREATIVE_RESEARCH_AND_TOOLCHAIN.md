# HISOBCHI AI — Creative Research + Open-Source Toolchain
**Status:** visual research/design-brief concepts only. None of the three directions is an approved, rendered mockup yet.

## Creative strategy
Avoid generic finance app with 5 equal glowing cards. Make the user's next financial decision the primary typographic object, and treat every secondary metric as contextual evidence rather than decoration. The design should communicate **decision → reason → action → outcome**.

### Three original directions to prototype (not copy)
**A. Editorial Control — recommended first exploration.** Calm paper / ink surfaces, strong asymmetrical number typography, restrained warm-accent action line, categorical rule lines and financial time axis. Home starts with one number and a visible explanation of what is and is not included. Transaction list is a precise ledger, not a pile of identical cards. Restrained motion only to express state changes. Primary advantage: clarity and trust. Risk: overly editorial layouts must still feel native and fit 320px.

**B. Kinetic Ledger.** Deep neutral charcoal, subtle amber progress/timeline, one focused highlight at a time, interlocking expense history and micro-data views. Primary advantage: premium depth and interactive character without glass overload. Risk: dark-mode contrast and power consumption; test actual Android GPU.

**C. Spatial Cashflow.** Spacious split-layout with compact chart rails and neutral tile rhythm, an inline visual balance equation `available = funds - obligations - reserve` (illustrative only, not the approved finance formula). Primary advantage: transparent calculation. Risk: too much density on small devices; cannot publish a false arithmetic model.

**Creative selection criteria:** user can identify Safe-to-Spend in 3 seconds, distinguish actual from demo or estimated, locate Add action, read a long UZS amount without shrinking it, and understand chart units. "3 seconds" is a proposed usability test target, not an observed metric.

## First-page visual composition brief
- Header: short product mark + contextual timeframe, not an ornate multi-icon banner.
- Primary surface: `Bugun xavfsiz sarflash`, large UZS amount, provenance status, expandable `Qanday hisoblandi?` explanation. Demo mode clearly labelled until finance engine exists.
- Action: one dominant `Xarajat qo‘shish` control, reachable without blocking the last row. Avoid full-width bottom add dock.
- Context: reserved obligations/next income (only if real sourced/labelled), simple horizon/timeline; distinguish uncertain planned items.
- Trend: semantic accessible graphical display with labels, no visually fabricated financial certainty.
- Auditability: latest transactions and an explicit link to complete activity.
- Bottom navigation: compact, predictable, accessible. No decorative floating controls.
- All sample figures must carry demo label.

## Toolchain decisions: adopt for purpose, never for tier reputation
| Resource | Exact role | Decision / constraint |
|---|---|---|
| [Expo design system skill](https://github.com/expo/skills/blob/main/plugins/expo/skills/expo-design-system/SKILL.md) | diagnose token drift and native-feeling UI | USE as audit procedure; verify instructions in current Expo SDK |
| [DTCG community spec](https://github.com/design-tokens/community-group) | platform-neutral token data model | USE as format reference |
| [Style Dictionary](https://github.com/style-dictionary/style-dictionary) | generate TS/web token targets if multi-platform output truly needed | OPTIONAL; do not add build complexity before tokens stabilized |
| [Storybook React Native](https://github.com/storybookjs/react-native) | interactive component-state catalog | CONSIDER for stage 04 after compatibility check |
| [lucide-react-native](https://github.com/lucide-icons/lucide) | consistent icons instead of custom SVG branches | OPTIONAL; replace only if reduces web/native drift; test package and icon parity |
| [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) | efficient meaningful UI motion | OPTIONAL after motion spec and Expo compatibility |
| [react-native-reusables](https://github.com/founded-labs/react-native-reusables) | reference accessible primitive patterns | STUDY, not bulk-install: Nativewind/Uniwind migrations may be disproportionate |
| [react-native-unistyles](https://github.com/jpudysz/react-native-unistyles) | responsive styling candidate | DEFER: v3 involves native code and no Expo Go support; not a free upgrade for StyleSheet prototype |
| [Apple HIG Charts](https://developer.apple.com/design/human-interface-guidelines/charts) | visual data disclosure/legends and accessible charts | USE as design constraints, not code |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | measurable accessibility gates | REQUIRED; supplement with native TalkBack/VoiceOver |

**Current stack should remain React Native + TypeScript + Expo + StyleSheet + installed react-native-svg.** More languages do not independently create higher visual quality; complexity must buy measurable capability.

## External visual reference anatomy (inspiration only)
- [Novbank mobile fintech concept](https://dribbble.com/shots/26747562-Novbank-Mobile-Fintech-Banking-Overview-Dashboard): study whitespace, graphic scale, restrained chart. Concept shot is not a verified usable app.
- [Vaultly personal wealth concept](https://vinaysinghchouhan.com/): study first impression, single primary next action. Do not import brand or artwork.
- [Savings & Cash Flow Analytics concept](https://dribbble.com/shots/27149000-Savings-Cards-Cash-Flow-Analytics-Fintech-Dashboard-Screens): study chart-to-timeline integration. Concept shot is not evidence of actual finance calculation.
References are for pattern analysis; images and visual assets must not be repackaged without checking licenses and usage rights.

## Prototype approach
1. Explore 3 concept screenshots *with identical truthful content*.
2. Choose one direction after comparing clarity, originality, feasibility, and accessibility.
3. Build DTCG semantic tokens and 12-component sample sheet (normal, loading, error, disabled, pressed, 2x type).
4. Implement the single critical Home→add→review interaction under separate draft PR.
5. Compare rendered screenshots at 320/360/393 and on real Android. Keep old production demo code until replacement has tested parity.

## Hard engineering filters
- No npm upgrade frenzy; run `npm ci`, `npm run typecheck`, existing `scripts/test-*.cjs` and relevant Chromium/native smoke scripts.
- Record exact library versions and license before adding.
- Touch surface internally >=44dp; no invisible hover-only actions; keyboard and back must work.
- All transitions support Reduce Motion and safe state interruption.
- Do not assume visual AI mockup text, metrics or interactions are production-correct without engineering and product review.
