# Hisobchi AI Mobile — React Native / Expo demo

**Status (2026-11-22):** demo UI prototip, ishlab chiqarish ilovasi emas. Development feature branch `test/integration-release-gate-v18` Design System v1.x, transaction manager va Analytics v1.7 funksiyalarini o'z ichiga oladi. `main` hali ilk v0.1 holatida; ochiq Draft PRlar tekshirilmasdan unga birlashtirilmagan.

**Muhim:** hech qanday bank hisoblari ulanmagan, kirish/ro'yxatdan o'tish yo'q, real balans yoki Safe-to-Spend hisoblanmayapti, Supabase yoki AI API ulanmagan. Operatsiyalar faqat ishlayotgan sessiyada saqlanadi; sahifani yangilashda boshlang'ich demo qiymatlar tiklanadi. Dashboard balansi va oylik grafiki **mustaqil namuna**, Analytics esa sessiya operatsiyalaridan qayta hisoblanadi.

## Mavjud imkoniyatlar (feature branch)

- **Bosh sahifa:** demo balans, Safe-to-Spend namunasi, mustaqil oylik grafik, sessiya operatsiyalari ro'yxati.
- **Operatsiyalar:** xarajat va daromadni qo'shish, tahrirlash, tasdiqlab o'chirish, qidiruv, tur va davr bo'yicha filtrlash.
- **Yangi operatsiya:** xarajat/daromad kategoriyasi, summani tekshirish, kalendardan sana tanlash (2000-01-01 dan bugungacha), izoh.
- **Tahlil:** sessiyadan sof farq, kirim, chiqim, aylanma, kundalik dinamika va xarajat kategoriyalari. Muddatlar: Barchasi, Hafta, Oy, 30 kun, Oraliq (ikki kalendar).
- **Profil:** sessiya operatsiyalari soni, real holat indikatorlari, navigatsiya va tasdiqlanadigan demo reset.
- **Onboarding:** Profildan ochiladigan 3-qadamli majburiy bo'lmagan qo'llanma.
- **Design System:** `src/theme/tokens.ts`, `src/components/ds/`, asosiy kartalar/filtrlar/typography uchun umumiy qoidalar.

## Windows PowerShell 5.1 — brauzerda tekshirish

Talablar: Node.js 22 (LTS), npm, Git.

```powershell
cd C:\Users\ASUS\Projects\hisobchi-ai-mobile
git status --short
git fetch origin
git switch --track origin/test/integration-release-gate-v18
npm ci
npm run typecheck
npm run test:transactions
npm run test:analytics
npm run test:calendar
npm run test:design-system
npm run test:ui-contract
npm run test:integration
npx expo start --web --clear --port 8090
```

Brauzer: `http://localhost:8090`. Agar filial/branch avval yaratilgan bo'lsa: `git switch test/integration-release-gate-v18`, so'ng `git pull --ff-only`. Agar `git status --short` bo'sh bo'lmasa, avval lokal o'zgarishlarni tekshiring. `npm audit fix --force` ni avtomatik ishlatmang.

## Loyihaning tarkibi

| Joylashuv | Vazifasi |
|---|---|
| `App.tsx` | tab navigatsiya, sessiya state, create/edit/delete/reset |
| `src/screens/` | Dashboard, Transactions, TransactionEditor, Analytics, Profile, Onboarding |
| `src/components/ds/` | qayta ishlatiladigan UI elementlari |
| `src/components/DateCalendar.tsx` | RN Web/native modal kalendar |
| `src/data/transactions.ts` | demo operatsiya modeli va validatsiya |
| `src/data/periods.ts` | sana muddatlari va filtr |
| `src/data/analytics.ts` | daromad, chiqim, sof farq, aylanma, kategoriya va grafik |
| `src/data/demo.ts` | namuna ma'lumotlar va valyuta formatlash |
| `scripts/` | TypeScript tashqarisidagi model, UI contract va integratsiya testlari |
| `docs/` | dizayn, QA va integratsiya bo'yicha bosqichma-bosqich qaydlar |

## Qo'lda bajariladigan release tekshiruvlari

1. Chrome Responsive: 320×640, 360×800, 393×852; scroll, tugmalar, summaa, izohlar kesilmasin.
2. Operatsiya qo'shib/tahrirlab/o'chirib, Tahlil va Profil ko'rsatkichlari yangilanishini tekshiring.
3. `Tahlil → Muddat → Oraliq`: kalendar sanalari, xato oraliq, bo'sh oraliq va qadamlarni bekor qilish.
4. `Profil → Ilova bo'yicha qo'llanma`: `Boshlash` Home'ga, `Yopish` Profile'ga qaytishi kerak.
5. Form xatolari, noto'g'ri sana, Android hardware back, klaviatura va font scaling'ni sinang.
6. iOS va Android native emulyator/qurilmalari, screen-reader sinovi va barcha PR review talab qilinadi.

**CI Success production tayyor degani emas.** `main`ga UI stack faqat Draft PR'lar tekshirilib, vizual QA va funksional testlar o'tgandan keyin kiradi.

## Xavfsizlik va backend chegaralari

- Frontend demo uchun real parol, service-role yoki boshqa maxfiy kalitni kiritmang.
- Backend arxitekturasi `docs/05-mobile-data-architecture.md` loyihasi bilan alohida **Draft PR #9** orqali muhokama qilinmoqda; u hali `main`ga kiritilmagan.
- Supabase integratsiyasidan oldin Auth, ownership, Row-Level Security, data mapping, izolyatsiya va migratsiya rollback talablari tasdiqlanishi kerak.
- React Native / TypeScript va StyleSheet hozirgi frontend texnologiyalari; boshqa dasturlash tiliga ko'chish dizayn sifatini avtomatik oshirmaydi.
