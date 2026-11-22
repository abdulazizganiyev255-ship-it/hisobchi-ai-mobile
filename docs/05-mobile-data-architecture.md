# Hisobchi AI — Mobile data architecture (draft, no live integration)

## Goal and current scope

This repository currently contains a demo-only Expo/React Native frontend. The next milestone is verified per-user persistence of transactions and a reliable single source of truth for dashboards.

**This document intentionally contains no live project IDs, private schema details, credentials, or sensitive security findings.**

## Recommended system boundary

1. **Dedicated Supabase mobile environment (preferred).** Separation from unrelated services reduces accidental coupling and permissions risk. If isolation is infeasible, a shared database requires an explicit access-control design and dependency review before modifications.
2. **Authentication:** Supabase Auth identity (UUID), stable owner ID stored server-side. Client-provided usernames/Telegram IDs are never sufficient for authorization. Map any legacy identity only after authenticated ownership proof.
3. **Database access:** Expo client uses a publishable key only, authenticated sessions, and tightly scoped row-level security. Secret/service role keys live only in trusted server components.
4. **Transactions:** canonical records use positive amounts plus an explicit `kind` of `income` or `expense`, ownership key, currency (UZS), event date/time, created/updated times, category, note, and UUID id. The current demo uses signed UI amounts and should be mapped in an adapter. Exact schema is subject to approval.
5. **Source of truth:** all balance, monthly totals and Safe-to-Spend values must derive from validated backend data. UI must not imply that demo totals are real or dynamically linked when they are not.
6. **Timezones:** UTC timestamp storage and `Asia/Tashkent` user-facing calendar buckets. Date-only inputs should preserve their intended local calendar day.
7. **Money:** use integer UZS units or constrained NUMERIC in storage, never floating point for financial arithmetic.
8. **Requests:** async loading/error/empty states, optimistic updates only with rollback, idempotency for imports, server-side validation, strong session handling, and audit-friendly event metadata.

## Row isolation acceptance tests (staging only)

- Anonymous user cannot read or mutate private transaction rows.
- Authenticated user A can SELECT, INSERT, UPDATE, DELETE only rows they own.
- Authenticated user B cannot view or alter user A records.
- Attempts to set/change a record owner to another user are rejected on INSERT/UPDATE.
- Each exposed table has reviewed grants **and** policies (these are separate security checks).
- Security-definer functions and views undergo permission review before exposing.
- No private keys or access tokens are present in Git commits, artifacts or client bundles.

## Dependency sequence

- **Gate A:** existing environment security review privately; do not publish vulnerabilities in public issues.
- **Gate B:** select isolated staging project, auth & permissions design, safe rollback/backup.
- **Gate C:** schema/migration approval (no destructive changes).
- **Gate D:** implement a typed read-only transactions repository and prove cross-user isolation.
- **Gate E:** implement create/update/delete with tests; switch UI away from ephemeral demo only after end-to-end checks.
- **Gate F:** calculated balances, spending limits, and the period comparison backlog.

## Out of scope until approved

- Connecting this app directly to any currently shared production project.
- Running live migrations, modifying RLS policies, or reading customer transaction details.
- Replacing existing apps' identity mechanisms.
- AI-driven transaction totals or financial calculations.

## Current blockers

- Auth target and database environment need explicit selection.
- Exact approved schema and policies not yet implemented or tested.
- v0.2/v0.3/v0.4 UI PRs remain separate and should be merged only after their functional QA.

Related tracking: issue #8.
