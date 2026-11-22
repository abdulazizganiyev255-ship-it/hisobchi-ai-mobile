# Hisobchi AI — Analytics ixtiyoriy muddat v1.7

## Maqsad

Analytics (Tahlil) muddat tanlagichi `Barchasi / Hafta / Oy / 30 kun / Oraliq` rejimlarini taqdim etadi. Istalgan o'tgan sanalar oralig'ida moliyaviy natija, grafik va kategoriya ulushlari yagona manbadan qayta hisoblanadi.

## UI oqimi
1. Tahlil → muddat tugmasi → `Oraliq` tanlash.
2. Ochilgan ixcham panelda `Boshlanish` va `Tugash` sanalarini `DateCalendar` modalidan tanlash.
3. `Oraliqni qo‘llash` tanlangan sanalarni `validateCustomRange` bilan tekshiradi; ikkalasi ham kalendar kunini **o'z ichiga oladi**.
4. Oraliq to‘g‘ri bo‘lsa: `period='custom'`, `appliedRange` saqlanadi; sof farq, kirim, chiqim, aylanma, xarajat toifalari va kunlik grafik shu oraliq uchun hisoblanadi.
5. Oraliq xato bo‘lsa (boshlanish tugashdan keyin, kelajakdagi yoki noto‘g‘ri sana), foydalanuvchiga xabar chiqadi, avvalgi natijalar o‘zgarmaydi.
6. `Bekor qilish` avval tanlangan davrni saqlaydi. `Barchasi` va tayyor davrlarga qaytish oldingi custom oraliqni avtomatik hisoblamaydi, lekin keyinroq yana tanlash uchun uning sanalarini sessiyada saqlaydi.
7. Davr o‘zgarganda avval tanlangan grafik kuni tozalanadi, grafik alohida daromad/chiqim/aylanma rejimlarida ishlashni davom ettiradi.

## Hisoblash xavfsizligi
- `calculateAnalytics` faqat tasdiqlangan `customRange` qiymatini qabul qiladi. `period='custom'` va oraliq bo‘lmagan holatda barcha yozuvlarni yashirincha ko‘rsatib yubormaydi — xato beradi.
- Bir xil `src/data/periods.ts` filtrlash mexanizmi ishlatiladi. Biznes formulalar va boshqa default davrlar o‘zgarmadi.
- Ma’lumot bo‘lmasa mavjud bo‘sh-holat ko‘rinishi chiqadi: 0 summalar, bo‘sh grafik va xarajat tarkibi.
- Yaqin kelajakdagi ma’lumotlar, tarixiy taqqoslash va ehtimoliy foizlar uydirilmaydi.

## QA
Automatik:
```powershell
npm run typecheck
npm run test:transactions
npm run test:analytics
npm run test:calendar
npm run test:design-system
npm run test:ui-contract
```

Manual Chrome 320, 360 va 393 px:
1. `Oraliq` tugmasi ko‘rinsin, `Boshlanish` va `Tugash` kalendarlari ishlasin.
2. `20.11.2026—21.11.2026` qamrovi: 3 000 000 kirim, 42 000 chiqim, 2 958 000 sof farq, 3 042 000 aylanma (faqat boshlang'ich demo yozuvlari bo'lsa).
3. Xato oraliq (masalan, 22 noyabrdan 20 noyabrgacha): oldingi natija saqlansin.
4. Bir kunlik oraliq, bo‘sh oraliq va oldingi davrlarga qaytish ishlasin.
5. Kichik ekran, grafik pastki navigatsiya ostida qolmasin; Chrome konsolda runtime exception bo‘lmasin.
6. Android/iOS native qurilma/emulyator sinovi alohida talab etiladi.

## Release cheklovlari

- Ushbu PR avvalgi `fix/transactions-fab-calendar-v16` (#17) ustida.
- Faqat demo frontend o'zgardi, `main` va Supabase bazasiga tegilmadi.
- Vizual mobil tekshiruvdan o'tmasdan merge va production-ready statusi berilmaydi.
