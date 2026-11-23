# Hisobchi AI — Stage 06 Native Preview (feature branch)

**Status:** Native code committed on a feature branch; Android/iOS runtime and visual QA are **not yet verified**.

## Open in Expo

These changes preserve the existing app when the flag is absent. Use a development build or compatible Expo Go:

```powershell
git switch feature/hisobchi-design-os-native-06
npm install
npx expo install --check
npm run typecheck
node --experimental-strip-types --test tests/stage06-ledger.test.mjs
$env:EXPO_PUBLIC_HISOBCHI_DESIGN_OS = "1"
npx expo start --clear
```

When running on your phone, restart Metro after setting the environment variable. When unset, the original `AppContent` is rendered. The preview is **development-only**, behind `__DEV__`.

## What is included

- `src/design-os06/ledger.ts`: reconciled synthetic UZS ledger, separate internal transfers and strict amount parser.
- `src/design-os06/Stage06PreviewScreen.tsx`: Porcelain × Cobalt light-first native screen, four bottom tabs, budget and categories, accessible controls, privacy toggle, demo income/expense form, local-only transaction state.
- `tests/stage06-ledger.test.mjs`: checks amount parsing, reconciliation, transfers and new operations.
- `App.tsx`: **flagged preview only**, original app intact without flag.

## Product truth

The synthetic ledger starts with 3 600 000 UZS income and 1 150 000 UZS expenses, giving 2 450 000 UZS total (bank 2 150 000 + cash 300 000). Transfers are neither income nor expense. The budget has 1 800 000 UZS limit and 650 000 UZS left. **Budget remaining is not Safe-to-Spend.**

Safe-to-Spend displays `Finance Engine ulanmagan`, not a fabricated daily limit. No Supabase, bank integration or AI calls are enabled. Demo additions are not persisted.

## Required QA before merge

1. Install dependencies and pass `npm run typecheck` on real Expo SDK 58 environment; inspect exact Expo module compatibility.
2. Run on Android (320/360/390 dp) and iOS (small/standard/large) and capture real screenshots. Ensure no clipping with large monetary amounts.
3. Verify Android Back dismiss, keyboard avoidance, screen reader labels, focus management, 48 dp targets, text scaling and Reduce Motion.
4. Test real-world dates, localization, category changes, insufficient funds, long digits, transfer/refund edge cases.
5. Inspect Finance Engine/Supabase schemas, RLS and exact Safe-to-Spend contract **before** any backend integration.
6. Keep branch unmerged until tests and device screenshots are reviewed.

Do not display demo values as real financial advice; this is a UI development gate.
