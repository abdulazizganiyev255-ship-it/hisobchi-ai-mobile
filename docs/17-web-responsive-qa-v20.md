# Hisobchi AI — Expo Web mobile smoke gate (v2.0 QA)

## Purpose
Previous CI passed source-contract tests and pure finance model calculations; it did **not** render the mobile layout or execute browser touch interactions. Add Chromium smoke coverage for the actual **Expo Web** app at 320×640, 360×800 and 393×852.

## Tested flow per width
1. Home loads, summary visible, no document-level horizontal overflow.
2. Transactions opens; 5 baseline demo records and 259,000 UZS expense; floating Add CTA visible above tab bar **and below the clipped scroll viewport**, so the button never covers a row's amount (confirmed defect in first 320px screenshot, then fixed). No full-width blue dock was reintroduced.
3. Search an impossible term → actionable empty state; clear filters → 5 records.
4. Add operation: open the new editor, open and cancel date calendar, enter 100,000 UZS expense, save → 6 records, 359,000 UZS total expense.
5. Analytics displays net 2,641,000 UZS and turnover 3,359,000 UZS.
6. Analytics period picker: Oraliq → open beginning-date calendar, cancel, apply a valid current default range. No horizontal overflow.
7. Profile displays 6 session records; confirmed demo reset restores 5.
8. Optional onboarding Next ×2 → Finish navigates Home; no unhandled page errors.

The suite uploads PNGs for Dashboard, Transactions, Calendar, Analytics, custom date panel, Onboarding and failures. Uploading is a QA aid; screenshots are **not** automatically compared to golden images or reviewed by a person.

## CI
- File: \`.github/workflows/web-smoke.yml\`
- Node 22; \`npm ci\`; install pinned Playwright and Chromium in CI only (no Expo dependency changes).
- \`CI=1 npx expo start --web --port 8090 --clear\` is started in the background.
- Node script: \`scripts/test-web-smoke.cjs\`. Fails if no server, an assertion fails, document overflow is detected, or an uncaught runtime exception is observed.
- Artifacts: \`hisobot-web-smoke-screenshots\` retained for 7 days.

## Local Windows PowerShell
Install Playwright in **temporary testing-only dev context** after switching to the QA branch:
\`\`\`powershell
npm ci
npm install --no-save --package-lock=false playwright@1.56.1
npx playwright install chromium
npx expo start --web --port 8090
\`\`\`
In a second PowerShell:
\`\`\`powershell
cd C:\Users\ASUS\Projects\hisobchi-ai-mobile
node scripts/test-web-smoke.cjs
\`\`\`
For ordinary user viewing (without E2E) the existing \`npx expo start --web --port 8090\` is sufficient.

## Known limits
- Chromium/Expo Web is not Android or iOS native UI. Must still test native device keyboard, date modal back button, fonts, safe areas and screen readers.
- Only the three widths above are automated; UI visual judgment and 1.3×/1.5× text scaling still need manual review.
- No external service integration; browser app uses in-memory demo sessions, not real financial data.
- Date range default is relative to the test runtime; test checks flow, **not** a fixed-date historical forecast.
- GitHub CI credentials, installation, and browser screenshot generation are temporary runner actions; nothing is deployed to production.

## Merge gate
This PR is **stacked on** \`feat/ui-final-polish-v19\` (PR #20); keep Draft until both the normal source/model and responsive browser jobs pass. Do not merge \`main\` or modify Supabase without completed visual/manual QA.
