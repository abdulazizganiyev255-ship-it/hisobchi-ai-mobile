# Hisobchi AI — Stage 06: Native Integration Gate

Status: **AUDITED DEMO → NATIVE INTEGRATION STARTED; device QA OPEN**.

This feature branch was created from main with permission after Stage 05 demo audit. Main was not modified.

## Stage 05 audit evidence
- 23/23 finance model tests: pass (synthetic ledger, no production data).
- 27/27 simulated DOM interactions: pass (not browser/device).
- 9/9 selected color contrast pairs: pass (not full accessibility).
- 27 TypeScript/TSX modules: syntax and local imports checked (not full Expo typecheck).
- 1600×900 marketing boards: verified size; not native screenshots.
- Android/iOS builds, actual browser visual QA, Supabase/RLS contracts: **not tested**.

## Stage 06 delivery
A separate downloadable file named `Hisobchi_Stage06_Native_Integration_Kit.zip` is attached in the originating ChatGPT conversation. It contains the complete native module overlay, a guarded integration installer, static auditor, acceptance criteria, test sources and design references.

**Important:** This Git branch currently holds this integration record, not a merged or fully compiled Design OS implementation. Do not claim runtime readiness from branch creation.

## Local integration protocol
1. Download and extract the kit **outside the repository**.
2. Checkout `feature/hisobchi-design-os-native-06`.
3. Use `node <kit>/scripts/stage06-integrate.mjs --repo .` for dry-run.
4. If safe, run the same command with `--apply`. The installer rejects main/master, detached HEAD, dirty tree, and existing source module collisions. It backs up App.tsx in `.git/stage06`.
5. Run `npm install`, `npx expo install --check`, `npm run typecheck`.
6. Enable **development-only** screen with `EXPO_PUBLIC_HISOBCHI_DESIGN_OS=1` and run `npx expo start`.
7. Perform Android and iOS device QA: 320/360/390dp layout, text scaling, keyboard, gestures, screen readers and safe areas. Do not merge before passing applicable gates.

## Financial truth boundary
Only synthetic data; no bank sync or Supabase writes. Safe-to-Spend figure in preview is a labelled scenario, not the verified Finance Engine RPC output. Server-side finance computations and security contracts remain uninspected.

## Decision
Approved to **continue engineering and native QA on the feature branch**, but **NOT approved to merge/deploy**.
