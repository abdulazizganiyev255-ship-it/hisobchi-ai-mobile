# Hisobchi AI Mobile — UI Prototype v0.1

A React Native (Expo + TypeScript) design prototype for the Hisobchi AI personal finance app in Uzbekistan.

> ⚠️ **Demo only.** All balances, budgets, graphs and transactions are hard-coded sample data. There is no authentication, bank connection, AI call, Supabase integration or network API.

## 1) Requirements

- Node.js 22.13+ (recommended Node.js 22 LTS), npm and Git
- Android smartphone with compatible Expo Go installed, or Android emulator
- Expo SDK 58 compatible Expo Go (check https://expo.dev/go for your device)

## 2) Run locally (Windows PowerShell)

```powershell
cd hisobchi-ai-mobile
npm install
npx expo install --fix
npm run typecheck
npx expo start --tunnel
```

Scan the displayed QR code in Expo Go. `--tunnel` may ask to install `@expo/ngrok`; consent and allow internet traffic. If local Wi-Fi is available, `npx expo start` is usually simpler.

> The package versions in this source are an initial SDK 58 set. `npx expo install --fix` aligns SDK native module versions with the installed Expo SDK before the first run; review any package changes before committing.

## 3) Upload to a new **private** GitHub repo

Create an **empty** GitHub repo named `hisobchi-ai-mobile` (no README, license or `.gitignore` checkbox). In PowerShell, run from the extracted project folder:

```powershell
git init
# If another Git remote already exists, inspect with: git remote -v
git add .
git commit -m "feat: initial Hisobchi AI mobile design prototype"
git branch -M main
git remote add origin https://github.com/abdulazizganiyev255-ship-it/hisobchi-ai-mobile.git
git push -u origin main
```

Sign into GitHub when Git asks. GitHub HTTPS does not accept a normal account password for Git pushes; use browser authentication / Git Credential Manager or a suitable token.

## 4) Project structure

- `App.tsx` — app entry, bottom navigation and base background
- `src/theme/tokens.ts` — colors, radii, spacing, shadows
- `src/data/demo.ts` — sample data and UZS formatting
- `src/components/AppIcon.tsx` — reusable SVG icon primitives
- `src/components/ExpenseChart.tsx` — sample graph
- `src/components/TransactionRow.tsx` — reusable transaction row
- `src/screens/DashboardScreen.tsx` — main home screen, balance visibility and month filter
- `src/screens/OtherScreens.tsx` — demo sections for navigation

## 5) What's interactive

- Balance show/hide eye control
- This month / last month switch (cycles)
- Bottom navigation between four tabs
- Transaction history shortcut
- Safe-to-spend explanatory dialog

## 6) Product quality and security notes

- **Do not** connect production Supabase or insert secrets into code.
- Safe-to-spend is **not** yet computed; the displayed limit must never be treated as financial advice or a real budget.
- Before production: validate data access controls, authenticated API integration, RLS, loading and error states, keyboard/screen-reader accessibility, edge cases, device previews and localized copy.
- The chart uses static demo values, not an expense aggregation implementation.
- This repository intentionally has no `.env` or real customer data.

## 7) Acceptance checks

1. Run `npm run typecheck` and `npx expo install --check` with packages installed.
2. Open in Expo Go and check 360dp / 393dp width devices.
3. Toggle eye icon, change chart period, switch tabs and open transaction history.
4. Verify long currency amounts do not clip, swipe works, navbar stays visible.

## Technology

Expo SDK 58 / React Native 0.88 / TypeScript / react-native-svg / expo-linear-gradient / react-native-safe-area-context.
