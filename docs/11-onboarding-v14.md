# Hisobchi AI — Onboarding UI v1.4 (demo guide)

## Goal
Existing UI screens remain accessible. Provide an optional, clear, three-step walkthrough from the Profile screen while authentication, onboarding persistence and cloud saving remain unavailable.

## Flow
1. **Moliyaviy holat bir ekranda:** Home cards; balance / Safe-to-Spend are static examples.
2. **Kirim va chiqimlarni kiriting:** in-memory add, edit, delete, category, search and date filters.
3. **Xarajatlaringizni tahlil qiling:** date filtering, daily chart, category breakdown and income / expense / turnover derived from demo session records.

## Navigation
- Profile → **Ilova bo‘yicha qo‘llanma** opens walkthrough.
- Guide has 3 dots/segments with 1/3, 2/3, 3/3 progress.
- `Davom etish` advances one page; `Ortga` returns one page; `Yopish` returns to Profile.
- On final step `Boshlash` exits back to Profile. It does not sign in, initialize a bank account or save onboarding to a server.
- Tab navigation is temporarily hidden during the guide.
- Optional by design; **never forces the user into an irreversible or unfinished onboarding flow.**

## Design
- Shared `ScreenHeader`, `SurfaceCard`, theme colors, spacing and 44dp+ primary/back/exit controls.
- Compact visual hero, clear onboarding goal, three direct facts per screen.
- Scrollable content for 320px viewport and text scaling; actions are outside scroll.
- Text states explicitly that no real accounts are connected and demo session is not persisted.

## Code contracts
- `src/screens/OnboardingScreen.tsx` contains onboarding UI and internal step state.
- `src/screens/OtherScreens.tsx` introduces profile guide action.
- `App.tsx` controls visibility with `showOnboarding` while keeping transaction/session state unchanged.
- `scripts/test-ui-contract.cjs` checks navigation wiring, text and non-mutating guide interface.
- CI includes TypeScript + model tests + DS contrast + UI source contracts.

## Manual acceptance
1. Responsive 320×640, 360×800 and 393×852: no horizontal overflow or buttons clipped by bottom safe area.
2. Profile → guide → Next → Back → Next → Next → Finish. Returns to Profile.
3. Any step → Yopish returns to Profile; opening again starts at step 1.
4. Transactions count before and after walkthrough stays unchanged.
5. Bottom tab bar hidden in the guide, visible after exit.
6. VoiceOver/TalkBack accessibility names; font scale 1.3×/1.5×.
7. Expo web runtime shows no uncaught exception, and other screens remain unaffected.

## Open decisions / not implemented
- A first-launch onboarding flag, login, secure persistent settings, notifications and banking permissions.
- Native device QA, automated visual screenshot comparisons.
- Real user data / production Supabase integration. Do **not** modify production database.

This PR stays Draft until manual QA and upstream Profile PR #14 are reviewed. Main remains unchanged.
