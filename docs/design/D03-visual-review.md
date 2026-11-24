# D03 Visual QA — evidence-based review

Review basis: 8 actual **Expo Web / Chromium** captures at 320×720 from GitHub Actions run
[45342608973](https://github.com/abdulazizganiyev255-ship-it/hisobchi-ai-mobile/actions/runs/45342608973) artifact `hisb-d03-responsive-screenshots`.
This is **not** an iOS Simulator or Android hardware capture.

## Observed defects and corrections

| ID | Severity | Screenshot evidence | Corrected source | Status |
|---|---|---|---|---|
| VIS-01 | Serious | `home-320.png`: balance amount crossed the bright decorative ribbon at narrow width | `DashboardScreen.tsx`: moved ribbon to right, reduced opacity, added limited shadow for legibility and reduced narrow-width font | Fix applied, needs re-render |
| VIS-02 | Serious | `home-320.png` and `profile-320.png`: AI tab icon absent while other icons visible | `AppIcon.tsx`: replaced overly complex sparkles path with explicit simple SVG shapes | Fix applied, needs re-render |
| VIS-03 | Moderate | `goal-calendar-320.png`: future-deadline flow incorrectly asked `Qachon bo‘lgan?` | `CalendarSheet.tsx`: future mode now says `Qachongacha?` with `MAQSAD MUDDATI` | Fix applied, needs re-render |
| VIS-04 | QA harness | Visual-smoke test stopped after 8 screenshots because `Yopish` matched two accessible buttons | `tests/visual-smoke.mjs`: exact locator and future-date selection tests | Corrected, rerun pending |
| VIS-05 | Accessibility | Tertiary text previously had 3.50:1 contrast on ivory | `tokens.ts`: `faint` to #75646B giving 4.94:1 on ivory | Source-level fix applied |

## Screen-level review at 320px

- **Home:** section order, card hierarchy and navigation render; VIS-01, VIS-02 flagged.
- **Profile:** accessible entries to Accounts and Goals; navigation icon issue VIS-02 remains on old capture.
- **Accounts:** three clearly marked sample accounts, balanced horizontal layout, no observed horizontal overflow.
- **Add account:** optional opening balance copy differentiates unknown from zero; input and submit fit 320.
- **Account created:** success message, count 4 and new item in scrollable list visible; footer content below viewport scrolls.
- **Goals:** two sample cards with progress indicators and no compulsory deadline.
- **Add goal:** target, saved progress, optional date and action fit 320.
- **Goal calendar:** future-mode past dates visually disabled; wording incorrect (VIS-03), fixed.
- **Goal created / Expense form / 360 / 393 / 430:** not captured in this first run.

## Remaining gates

- [ ] Repeat screenshot run on corrected commit and review all 4 widths.
- [ ] Verify AI icon and balance text in rendered corrected screenshots.
- [ ] Confirm future-date selection, optional removal and goal save.
- [ ] Run native iPhone/Android simulator screenshot and accessibility audit.
- [ ] Do not merge D03 / D02 / D01 solely on web screenshot green.

All user financial data and production infrastructure remained untouched.
