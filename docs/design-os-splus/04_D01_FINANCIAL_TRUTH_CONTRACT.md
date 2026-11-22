# D01 — Financial Truth & Content Contract
**Scope:** Hisobchi AI mobile UI demo; source baseline fix/mvp-fab-period-v24.
**Owner work mode:** Finance UX Reviewer. **Status:** SOURCE-SPEC COMPLETE / Production finance contract BLOCKED.
**Last source review:** 2026-11-22.

## Verified from code
| Code anchor | Current value / behavior | Provenance and classification | UI implication |
|---|---|---|---|
| src/data/demo.ts: demo.balance | 12,850,000 UZS | fixed synthetic sample | Label “Namuna balans”; NEVER imply linked bank |
| demo.safeToSpendToday | 145,000 UZS | fixed synthetic sample, not calculated | Label “Hisoblanmagan namuna”; no formula claim |
| demo.months.current | Bu oy; 3,840,000 UZS; -8%; sample series | synthetic independent monthly series | Label “Namuna diagramma” and self-contained legend |
| demo.months.previous | O‘tgan oy; 4,180,000 UZS; +5% | synthetic independent monthly series | Home picker has exactly two options |
| App.tsx: transactions | starts as clone of demo.transactions, React state only | mutable **demo session ledger** | CRUD changes list and calculated Analytics in current session |
| src/data/analytics.ts | income, expense, turnover, net, categories, days | calculated deterministically from session transactions | Distinguish from independent Dashboard month chart |
| src/data/transactions.ts | parseUZS 1..999,999,999,999 whole UZS; valid ISO date ≤ today; category constrained | source-based form validation | Never accept zero, negative input or future expense date |
| App.tsx save/delete | save/add/delete updates session array; editor closes to Transactions | UI session only, no persistence | Success copy may say “Sessiyada saqlandi”, not “Cloudga saqlandi” |
| App.tsx reset | restores initial demo array | demo reset only | Must warn about local session changes |

## State and wording policy
Each monetary visual object MUST have:
1. state: DEMO_FIXED / SESSION_CALCULATED / REAL_VERIFIED / ESTIMATED / SCHEDULED / SCENARIO / UNAVAILABLE.
2. source: explicit provenance, e.g. “Namuna ma’lumot” or “Ushbu sessiyadagi operatsiyalar”.
3. period and UZS unit.
4. certainty and last-updated if real or projected.
5. user-readable explanation action when summary could be mistaken for advice.

| State | Suggested label | Permissible claims | Prohibited implication |
|---|---|---|---|
| DEMO_FIXED | Namuna · hisoblanmagan | Illustration of where value would appear | “Bugun sarflashingiz mumkin” as factual advice |
| SESSION_CALCULATED | Ushbu sessiya bo‘yicha | Computed from local demo entries | Bank balance, live sync, permanent record |
| REAL_VERIFIED | Tasdiqlangan moliyaviy ma’lumot | Only after secure backend, finance engine and provenance QA | Use in current demo without contract |
| ESTIMATED | Taxminiy prognoz | Assumptions, uncertainty, horizon shown | Guarantee or exact available cash |
| SCHEDULED | Rejalashtirilgan, hali to‘lanmagan | Obligation with date/amount if actually stored | Treat planned payments as already debited |
| SCENARIO | Sinov ssenariysi | Simulated future effect; no mutations | Changing ledger or cash balance |
| UNAVAILABLE | Hisoblash uchun ma’lumot yetarli emas | Clear reason and recovery CTA | Invent a zero or positive amount |

## Recommended Home copy (demo)
- Headline: “Bugun xavfsiz sarflash” and amount 145 000 so‘m.
- Strong adjacent pill: “DEMO · hisoblanmagan”.
- Supporting explanatory action: “Bu raqam nimani bildiradi?”
- On explanation: “145 000 so‘m faqat namuna. Hozir sizning haqiqiy daromadingiz, majburiy to‘lovlaringiz va hisoblaringiz asosida hisob-kitob qilinmayapti.”
- Independent balance: “Namuna balans · 12 850 000 so‘m”.
- Graph: “Oylik xarajat — namunaviy grafik”; “Bu oy / O‘tgan oy” only; show graph data unrelated to current session.
- Recent activity: “Ushbu sessiyadagi operatsiyalar”. Add/edit/delete results appear here.
- Analytics: “Ushbu sessiya ma’lumotlaridan hisoblangan”. Show dates and counts.
- Success: “Operatsiya ushbu sessiyada saqlandi.” Do NOT write “Saqlandi” with no persistence context.
- If permission or network unverified: do not suggest syncing is active.

## Exact seeded demo reconciliation
Demo transaction list: -85,000 / -12,000 / -42,000 / +3,000,000 / -120,000 UZS.
Derived session Analytics ALL:
- income: 3,000,000 UZS
- expense: 259,000 UZS
- net: 2,741,000 UZS
- turnover: 3,259,000 UZS
- records: 5.
Add 100,000 UZS expense:
- income unchanged 3,000,000
- expense 359,000
- net 2,641,000
- turnover 3,359,000
- records 6.
The Dashboard fixed demo balance (12,850,000), fixed sample safe-to-spend (145,000) and independent monthly graph SHOULD NOT change in v2.4 after that entry. If redesigned Home displays an “effect”, it must route or explain ONLY the session ledger/Analytics effect; the immutable demo values must remain independently tagged.

## Proposed typed provenance contract (NOT in runtime)
~~~ts
type MoneyDisplay =
  | { kind: 'demo'; amountUZS: number; label: string; calculated: false }
  | { kind: 'session'; amountUZS: number; period: string; source: 'transactions' }
  | { kind: 'unavailable'; reason: string }
  | { kind: 'verified'; amountUZS: number; sourceId: string; asOf: string }
  | { kind: 'estimate'; amountUZS: number; horizon: string; assumptions: string[] }
  | { kind: 'scenario'; amountUZS: number; scenarioId: string };
~~~
Do not allow a generic component to silently render a verified-looking amount when only a demo record exists.

## Product questions that remain blocked
- Safe-to-Spend exact deterministic finance engine formula, data model and boundaries.
- Reserved vs pending obligations; handling income uncertainty, negative balance, overdue charges, zero days, multiple accounts, currency and user-local timezone.
- Secure Supabase user identity, ownership, RLS and storage; no production readiness without separate security review.

## Hard-stop quality gates
P0: Any sample number presented as live; hidden source/uncertainty; AI presented as a ledger authority.
P1: Confusing dashboard fixed graph with Analytics; wrong UZS sign, dates or period; false success feedback.
Acceptance examples:
1. Tap Safe-to-Spend info → explanation explicitly says demo and calculated=false.
2. Add 100,000 UZS expense → session Analytics increases expense to 359,000, net 2,641,000; demo Safe-to-Spend stays 145,000.
3. Reload prototype → warning explains local-only persistence before user assumes permanent cloud save.
4. Currency/locale and screen reader describe amount without relying on red/green alone.
5. No real financial advice or calculated claim until secure engine contract approved.
