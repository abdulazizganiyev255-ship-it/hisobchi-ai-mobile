# Hisobchi AI — Android/iOS Metro bundle release gate v2.1

**Scope:** React Native / Expo demo UI on top of the fully tested Expo Web stack. This is a JavaScript bundle compatibility gate, not native-device, binary-build or production approval.

## What has actually been implemented
- `.github/workflows/native-bundle.yml` now runs a two-platform matrix: Android and iOS.
- Each job checks out the same branch, installs locked dependencies using `npm ci` on Node 22 / Ubuntu 24.04, and runs `npx expo export --platform android|ios --output-dir ... --clear`.
- A separate output directory is checked for exported files so an empty/no-op bundle cannot pass.
- Existing TypeScript, finance-model, calendar, UI-contract, Chromium responsive E2E checks also trigger for this stacked PR.

Expo explicitly recommends `npx expo export` to isolate Metro JavaScript bundle errors. See:
- https://docs.expo.dev/build-reference/troubleshooting/
- https://docs.expo.dev/more/expo-cli/

## What passing DOES NOT prove
- It does **not** produce a signed APK, Android App Bundle or iOS IPA.
- It does **not** compile Gradle/Android SDK or Xcode native binaries.
- It does **not** run on a real Android/iOS device, simulate an OS keyboard, validate modal hardware Back or safe areas, or test native accessibility.
- It does **not** connect user accounts, Supabase, banks or AI services.

## Windows PowerShell 5.1 commands
After switching to this feature branch:

```powershell
cd C:\Users\ASUS\Projects\hisobchi-ai-mobile
npm ci
npm run typecheck
npm run test:integration
npx expo export --platform android --output-dir .\tmp-android-bundle
npx expo export --platform ios --output-dir .\tmp-ios-bundle
```

**Note:** Expo export directories are generated artifacts; do not commit them to Git. For an ordinary preview without a phone, use `npx expo start --web --port 8090`. Actual Android app installation requires an emulator or device plus a native build process.

## Manual native QA before release
1. Android: open every screen; tap and scroll; keyboard must not cover amount field or save CTA.
2. Android: physical Back while editing, in the date modal, and during onboarding.
3. iOS: safe area / notch, calendar Modal, fonts, input focus and numeric keypad.
4. Accessibility: TalkBack/VoiceOver labels, font scaling, control order.
5. 320px+ small-device text and buttons must remain readable; automated Chromium screenshots don't substitute for device checks.

## Merge and security
This is Draft and stacked on `test/web-responsive-e2e-v20` (PR #21), which is stacked on earlier UI Draft PRs. Do not merge `main` without upstream review, CI and remaining manual checks. Supabase and production user data are untouched.
