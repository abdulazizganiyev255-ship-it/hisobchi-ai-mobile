# Hisobchi AI Mobile — D01 Design Foundation

A React Native / Expo / TypeScript UI prototype for the Hisobchi AI finance app in Uzbekistan.

> **UI-only demo:** balances, transactions, insights and charts use local examples. There is **no** Supabase connection, authentication, AI model, speech-to-text or payment integration. Nothing in this branch writes financial data.

## Approved visual direction

- Warm ivory `#F7F1EB` and white `#FFFBF7` surfaces
- Plum `#6D2C4E` accent with a sculptural decorative balance-card ribbon
- iPhone-inspired minimalism: generous breathing room, rounded pills, restrained typography and warm chart colors
- Five tabs: **Bosh / Tarix / AI / Tahlil / Profil**
- Localized UZS formatting
- Demo/unknown financial values explicitly distinguished from live data

## Run on Windows PowerShell

```powershell
cd hisobchi-ai-mobile
npm ci
npm run typecheck
npx expo start
```

Scan the QR code using compatible Expo Go. The repo uses Expo SDK 58 and requires a compatible Node.js version (Node 22 recommended).

If dependencies are out of sync, review `npx expo install --check` output and reconcile them in a **separate reviewed change**, rather than changing dependencies automatically.

## Current D01 scope

- Shared visual tokens: `src/theme/tokens.ts`
- Five-tab navigation shell: `App.tsx`
- Premium dashboard: `src/screens/DashboardScreen.tsx`
- History, AI, analytics and profile: `src/screens/OtherScreens.tsx`
- Sculptural ribbon: `src/components/BalanceRibbon.tsx`
- Unified chart and transaction-row colors
- Preserved interactions: balance hide/show, month switch and history shortcut
- Add-expense, add-income and notifications currently show an explanatory demo alert rather than claim real functionality

## Design QA

See `docs/design/D01-foundation.md` for visual/interaction acceptance checks.

## Security & data integrity

Do not put production Supabase keys or actual financial transactions in this frontend. The backend security audit identified unsafe legacy anonymous-access policies. Production integration must be blocked until Auth, RLS, least-privilege API, financial ledger and negative isolation tests pass.

## Next milestones

- **D02:** transaction-entry UI, editable mock drafts, calendar, full navigation and all UI states
- **D03:** additional screens and accessibility QA
- **D04:** iPhone/device screenshots and targeted visual corrections
- **I01:** backend Auth + Ledger integration on isolated staging, after P0 security controls are fixed
