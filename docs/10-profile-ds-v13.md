# Hisobchi AI — Profil / Design System v1.3

## Intent
Convert the former one-card static Profile placeholder into a practical **demo-only** profile and settings screen, consistent with DS v1.0 components, without pretending unavailable banking, authentication or AI integrations work.

## Layout hierarchy
1. `ScreenHeader`: Profil / Hisobchi AI / demo and DS version.
2. Light identity surface: `Namoyish profili`, `Hisobga kirilmagan`, Demo tag. No invented real name, avatar photo or email.
3. Status surface: real in-memory transaction count; `Vaqtincha` state and session-reset explanation.
4. Quick actions: reusable `ActionRow` to Operatsiyalar and Tahlil, connected to App navigation.
5. Capabilities: bank accounts not connected, AI analysis not enabled, cloud saving unavailable; these are informational rows, not inert buttons.
6. Demo reset: **two-step confirm**, restores `demo.transactions` in App session and shows status. Never claims to delete server or bank data.
7. Compact footer: honest feature limitations.

## App wiring
- `App.tsx` passes `transactionCount={transactions.length}`, navigation callbacks and `onResetDemo`.
- Reset sets current session transactions to a fresh clone of baseline demo records and resets the in-memory new-record ID counter; edited / added / deleted session records are overwritten after confirmation.
- Dashboard's static balance / safe-to-spend / standalone monthly graph remain independent and must not be described as recomputed after reset.
- `ActionRow` is a reusable 58dp minimum press target exported from the DS index.

## Automated checks
- `npm run typecheck`
- `npm run test:transactions`
- `npm run test:analytics`
- `npm run test:design-system`
- `npm run test:ui-contract`

UI contract tests check wiring, accessible actions, displayed truth about demo mode, and presence of confirmation before reset. They **do not** prove real interactive behavior or mobile rendering.

## Manual QA acceptance
1. Chrome responsive widths: 320, 360, 393 logical pixels and approx. 640/800/852px viewport height.
2. `Profil` header, light identity card, status, quick links, capabilities and reset are all visible via scroll; bottom navigation never covers last card/footer.
3. Create a 100 000 so‘m expense in Operatsiyalar → Profil shows 6 session records. Navigate to Tahlil → total expense increases by 100 000; return to Profil.
4. Tap demo reset → confirmation appears. Cancel leaves records unchanged. Confirm restores exactly 5 baseline transactions; revisit Analytics, expense 259 000 and income 3 000 000.
5. Settings/status text cannot be mistaken for working login, notification push, bank sync or production persistence.
6. Screen-reader accessible labels, 44dp+ action targets, 1.3x font scale and scroll behavior. Check web runtime log and later Android/iOS native devices.
7. App navigation and all other screens unchanged.

## Out of scope
- Real login and user identity / sign-out.
- Bank connection, cloud sync, automatic AI advice, settings persistence, server deletion.
- Changing the Supabase project or its production RLS policies.
- Release to main before visual and interaction QA.

## Dependencies
Stacked on `feat/design-system-v1-transaction-editor` (PR #13), then PR #12, #11, #10, #7, etc. This PR stays Draft.
