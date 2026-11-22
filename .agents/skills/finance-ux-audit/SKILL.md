---
name: finance-ux-audit
description: Audit Hisobchi AI finance UI for truthful balance, Safe-to-Spend, demo, planned and AI-driven values; use for Home, Analytics, transactions and forecasts.
---
# Finance UX Audit
## Inputs
Product rules, data source and calculations, sample vs live flag, screen code and visual evidence.
## Procedure
1. For each shown amount identify source, time window, currency, certainty, rounding and last update.
2. Classify `actual | demo | reserved | expected | estimated | scenario`; reject unlabeled mixtures.
3. Distinguish total balance from amount safe to spend; compare with verified calculation engine, do not invent formula.
4. Trace transaction add/edit/delete → data state → Home / Analytics feedback.
5. Review AI explanations as **read-only**; demand evidence links and label uncertainty.
6. Generate screen-reader wording and empty/error/loading messages for each financial surface.
## Output
Financial truth table, misleading-content findings ranked P0/P1/P2, corrected copy, source provenance requirements and test scenarios.
## Gate
No P0 financial misrepresentation; all demo data visibly marked; ledger mutation requires user confirmation.
## STOP
Do not claim bank sync, real calculation, payments or secure backend if not directly verified.
