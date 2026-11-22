# DS v1.1 — Dashboard & Operatsiyalar visual QA

## Screenshot audit (2026-11-22)

Sakkiz ekran rasmi asosida:
- Analytics DS v1.0 migration to'g'ri render bo'lgan, `PeriodPicker` ochilgan/yopilgan ko'rinadi.
- Dashboard va Operatsiyalar eski lokal UI uslublarida qolgan.
- `+ Qo‘shish` pastki o'ngdagi absolute FAB 20/19-noyabr operatsiya kartasining matn/summasi ustiga chiqqan.
- Dashboard `3 840 000 so'm` grafik qiymati va Analytics `259 000 so'm` shu sessiya operatsiyalari summasi **turli demo manbalar**. Hozircha ulardan bitta mantiqiy hisobni keltirib chiqarib bo'lmaydi.
- Operatsiya formasi hali sana matnli inputdan foydalanadi, navigatsiya va screen-reader QA keyinroq qilinadi.

## v1.1 kod o'zgarishi

1. `TransactionsScreen` headeri `ScreenHeader` bilan, `Barchasi / Xarajat / Daromad` tanlovi `ChoiceChip` bilan birxillashtirildi. DS filtrlari minimum 44dp.
2. `+ Qo‘shish` absolute joylashuvdan olinib, scrollable operatsiyalar ro'yxatidan tashqaridagi **shaffof, border/fonsiz** `actionArea`ga joylandi. Shu bilan oxirgi karta ustiga chiqmasligi kerak. Oldingi ko'k `actionDock` qaytarilmadi.
3. `DashboardScreen`: `SectionHeader` va `SurfaceCard`ni grafik va so'nggi operatsiyalar uchun ishlatadi. Brend sarlavhasi, katta balans va Safe-to-Spend bloklari mustaqil tarkib bo'lib qoladi.
4. Dashboard diagramma *mustaqil demo* ekanligi aniqroq belgilandi; balans, safe-to-spend va oylik grafik real sessiya hisoblariga ulanmagan.
5. Eye toggle, period switch, chevron CTA asosiy bosish maydonlari kamida 44dp.
6. Nav, session data, analytics calculation, backend / Supabase o'zgarmadi.

## Automated checks

```powershell
npm run typecheck
npm run test:transactions
npm run test:analytics
npm run test:design-system
npm run test:ui-contract
```

`test:ui-contract` — strukturaviy source regression tekshiruv, vizual render emas.

## Manual acceptance checklist

- 393×852, 360×800, 320×640 browser mobile emulationda ko'rish.
- Operatsiyalarda pastga scroll qilish: birorta summa yoki CTA matni `Qo‘shish` ortida qolmasin.
- `Qo‘shish` pastda o'ngda va o'zining alohida **ko'k fon panelisiz** tursin.
- Operatsiyalar qidiruv, xarajat/daromad, hafta/oy/30 kun/oraliq filtrlari, filtrni bekor qilish va tahrirlash saqlansin.
- Dashboard balans ko'zchasi, muddat almashishi va So'nggi operatsiyalar CTA'si ishlasin.
- Analytics DS v1.0 grafigi, Tahlil / Operatsiyalar o'rtasidagi navigatsiya regressiya qilmasin.
- 1.3×/1.5× shrift masshtabi va native Android/iOS keyingi tekshiruv; boshqa screenlarning 44dp auditini keyingi migratsiyada qilish.
- Yangi operatsiya formasi / Profil onboarding hali mustaqil DS migratsiyalari.

## Merge tartibi

Ushbu branch `feat/design-system-v1-foundations` (PR #11) ustida. Oldingi analytics/transactions/dashboard PR chain hali ochiq; barchasi alohida QA'dan keyin to'g'ri tartibda birlashtiriladi. `main`ga bevosita merge qilinmaydi.
