# Hisobchi AI — Android emulator native runtime QA (v2.2)

## Scope

The current Expo UI has passed TypeScript/model, mobile Chromium, and Android/iOS JavaScript export tests. Those tests **do not compile an Android binary or test Android’s hardware Back key**. This branch introduces a native Android debug APK build and an instrumented *system-level* emulator smoke test.

## Implementation

- `App.tsx`: an Android-only `BackHandler` listener with cleanup. Priority: dismiss optional onboarding, then dismiss transaction editor, then return non-Home tab to Home. When already on Home, return `false` to preserve system Back behavior. Calendar Modal already has its own `onRequestClose` callback, so Android Back dismisses it before the parent screen.
- `scripts/test-android-emulator.py`: Python standard library + Android SDK `adb`. Installs debug APK, connects emulator to Metro via `adb reverse tcp:8081 tcp:8081`, starts the real package, inspects accessibility/UIAutomator hierarchy, taps Transactions and Add, opens the calendar, exercises Android Back three times, captures screenshots, and checks fatal app logs.
- `.github/workflows/android-emulator-smoke.yml`: on the stacked PR, Node 22 + JDK 17 + Android SDK, generate native Android project through Expo prebuild, build debug APK with Gradle, start Metro, boot a Pixel emulator (API 35), execute native smoke and upload screenshots/logs.
- Existing JS/TS integration, Chromium and native Metro export tests also run.

## Acceptance

Native job is green only when: APK actually built and installed; Home `Umumiy balans` rendered; Transactions `Jami kirim` rendered; Add opened the editor; calendar Modal opened and closed by hardware Back; second hardware Back returned to Transactions; third returned Home; no native fatal or bundle failure.

If UIAutomator cannot find a label on a particular React Native build, inspect screenshots/hierarchy and repair the test; **do not mark the app as verified merely because Gradle compiled**.

## Manual Windows (PowerShell 5.1) — Android Studio emulator

1. Install Android Studio, Android SDK Platform 36, Build-Tools and Android Emulator (official Expo reference: https://docs.expo.dev/workflow/android-studio-emulator/).
2. Android Studio → Device Manager → Create Device → select a phone (e.g. Pixel) and a downloaded system image → Start.
3. Set `ANDROID_HOME` to your SDK (default `$env:LOCALAPPDATA\Android\Sdk`) and add the SDK's `platform-tools` to PATH.
4. In project directory:

```powershell
cd C:\Users\ASUS\Projects\hisobchi-ai-mobile
npm ci
$env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA "Android\Sdk"
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:Path"
adb devices
npx expo run:android
```

This compiles and installs the debug app and starts Metro. Emulator must be running before `npx expo run:android`.

## Limits and release gate

- This CI uses one Android emulator image only. It does not verify real phones, iOS device behavior, keyboard avoidance, font scaling, TalkBack, unhandled user-specific edge cases, or production account/security flows.
- App is still an **in-memory financial demo**. No Supabase, bank accounts, authentication or persistent storage are connected.
- CI/debug APK is **not a signed release**. Do not distribute as production software.
- PR is stacked on `test/native-bundle-release-gate-v21` (#22) and remains Draft pending visual and native-device QA.
- No `main`, Supabase or production data mutation.
