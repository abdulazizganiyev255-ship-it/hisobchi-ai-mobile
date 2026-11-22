# Hisobchi AI — Design System v1.0 foundations

**Status:** v1.0 poydevori va Analytics ekranidagi birinchi migratsiya. Bu butun ilova bo‘yicha yakuniy vizual tasdiq emas.

## 1. Product tamoyili
Birinchi navbatda moliyaviy savolga javob: foydalanuvchi qancha pul borligi, qancha kirim/chiqim qilgani va nimaga sarflaganini darhol tushunsin.

Axborot qatlamlari:
1. Asosiy savol va asosiy summa (eng katta urg‘u).
2. Kirim/chiqim/aylanma kabi muhim metrikalar.
3. Grafik va toifalar.
4. Filtrlar va yordamchi izohlar.
5. Kengaytiriladigan sozlamalar.

## 2. Texnologik tuzilma

- `React` + `TypeScript` (`.tsx`): komponentlar, holat, hodisalar, aniq typed props.
- `React Native` + `StyleSheet`: Android/iOS interfeys uslubi.
- `React Native Web`: ayni RN uslublarini brauzerda CSS xususiyatlariga moslaydi; alohida CSS talab qilinmaydi.
- `Kotlin/Java`: faqat keyinchalik native modul ehtiyoji paydo bo‘lganda.
- `src/theme/tokens.ts`: UI tokenlari uchun yagona manba.

## 3. Tokenlar

| Turi | API | Qoidasi |
|---|---|---|
| Rang | `colors`, `semantic` | Light/Dark yuzalar ajratilgan |
| Bo‘shliq | `spacing` | 4/8/12/16/20/24/32 dp |
| Radius | `radius` | Kichik elementlar 12, karta 22, pill 999 |
| Matn | `typography` | Body 14, label 13, caption 12, section 16, page 24, amount 29 |
| Layout | `layout` | Gutter 18, gap 12, minimal tap 44dp |
| Soya | `shadow` | Minimal card/light elevation |

**Qoida:** umumiy UI komponentining hardcoded rangi yoki 39px bosiladigan maydoni paydo bo‘lsa, avval semantik token kerakligini tekshirish.

**Accessibility:** DS v1 light/dark asosiy va ikkilamchi matn kontrasti kamida 4.5:1 bo‘lishini avtomatik tekshiradi; kichik touch-target kamida 44dp. Bu **barcha** ekrandagi dynamic type, screen reader va native qurilma sinovini almashtirmaydi.

## 4. Komponentlar kutubxonasi

`src/components/ds/`:

- `ScreenHeader`: ikona, title, subtitle, trailing content.
- `SectionHeader`: bo‘lim nomi, izoh, icon, light/dark tonal variant.
- `SurfaceCard`: dark/light karta konteyneri.
- `ChoiceChip`: tanlov (selected/unselected) va accessible 44dp bosish.
- `PeriodPicker`: generik typed period dropdown, bitta trigger, ochilgan tanlovlar; dastlab yopiq turadi.

Misol:

```tsx
import {PeriodPicker, SectionHeader, SurfaceCard} from '../components/ds';

<PeriodPicker
  value={period}
  options={ANALYTICS_PERIODS}
  description={analyticsRangeLabel(report)}
  onChange={next => setPeriod(next)}
/>

<SurfaceCard tone="light">
  <SectionHeader icon="wallet" title="Xarajatlar tarkibi" tone="light"/>
</SurfaceCard>
```

## 5. Bosqichma-bosqich migratsiya

**Ushbu PR:**
- Analytics ekrani umumiy header, section header, surface card, metric chip, period picker’dan foydalanadi.
- Dizayn va hisoblash semantikasi saqlanadi, sun’iy qiymatlar qo‘shilmaydi.
- Faqat DS tokenlari va komponentlari kiritildi; Supabase/DB, PRlar va `main` o‘zgarmadi.

**Keyingi PRlar:**
1. Dashboard kartalarini DS bo‘ylab normalizatsiya qilish, responsive 320/360/393 sinovi.
2. Operatsiyalar ro‘yxati, create/edit form va navigation tap-target/typography standartlari.
3. Profil va Onboarding dizayni; loading/empty/error/disabled states.
4. UI library versioning, screenshot regression, accessibility audit, Android/iOS real devices.

## 6. QA va release gate

Avtomatik:
```powershell
npm run typecheck
npm run test:transactions
npm run test:analytics
npm run test:design-system
```

Manual:
- Chrome responsive 320×640, 360×800, 393×852.
- Period trigger yopiqligi, ochilishi, davr o‘zgarishi, selected state.
- Chiqim/Kirim/Aylanma chiplarning ishlashi va 44dp touch target.
- 3 000 000 kirim, 259 000 chiqim, 2 741 000 sof farq, 3 259 000 umumiy aylanma (boshlang‘ich demo).
- Category textning och fonda o‘qilishi, skroll oxirida barcha ma’lumotlar ko‘rinishi.
- RN Web runtime error yo‘qligi; keyin Android/iOS qurilmalarida tekshirish.
- Oldingi Transactions/Dashboard regressiya qilmasligi.

**Birlashtirish:** analytics PR #10 vizual QA’dan o‘tgandan so‘ng, DS branch bazasi qayta tekshiriladi. Ushbu PR hozircha draft; `main`ga birlashtirilmasin.
