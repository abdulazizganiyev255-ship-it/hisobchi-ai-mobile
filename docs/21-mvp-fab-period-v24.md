# Hisobchi AI MVP — floating Add and monthly period selector (v2.4)

## Verified cause from source
`TransactionsScreen.tsx` previously used `listViewport: {flex: 1, marginBottom: 64}`, which clipped the operation list 64dp above the floating Add button. On a dark navy gradient background this **looked like a full-width blue dock/strip** even though no explicit rail view existed.

## Changes
- Removed the artificial `marginBottom:64` from the list viewport.
- Increased scroll-content **bottom padding to 116dp**, letting the last transaction scroll fully above the floating CTA, without rendering an extra full-width component.
- Kept the existing narrow, independent cyan `+ Qo‘shish` button, its accessible label and 44+dp target.
- On Dashboard, replaced single-press month toggling with an actual dropdown. Only two options: **Bu oy** and **O‘tgan oy**. The chosen option is announced and visibly selected, and selecting closes the menu.
- The Dashboard remains a **sample** monthly expense graph. These two periods refer to fixed demo examples, not live current calendar expenses; other period ranges stay on the Analytics screen.

## Tests
- TypeScript and existing finance/integration source tests.
- UI contract refuses to reintroduce `listViewport.marginBottom`, requires bottom scroll clearance and explicit month menu.
- Chromium E2E on 320×640, 360×800, 393×852 checks both chart options, real demo amount changes, no horizontal overflow, no reserved bottom strip, and that the last transaction scrolls above the CTA.
- Native Android Pixel 6 visual screenshots, touch and font scaling still require manual review.

## Scope
No `main` merge, no Supabase/data model modifications. Branch stacks on `feat/dashboard-visual-v23` (Draft PR #24); keep Draft until real Android visual sign-off.

## PowerShell (local folder C:\h)
```powershell
cd C:\h
git status --short
git fetch origin fix/mvp-fab-period-v24:refs/remotes/origin/fix/mvp-fab-period-v24
git switch --track origin/fix/mvp-fab-period-v24
npm run typecheck
npx expo start --dev-client --clear
```
The clone originally used `--single-branch`, so explicit ref fetch may be needed. Do not use `git restore` on uncommitted work without reviewing it first.
