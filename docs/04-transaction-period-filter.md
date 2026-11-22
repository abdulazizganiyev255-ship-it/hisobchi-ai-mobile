# Hisobchi AI — Operatsiyalar muddat filtri v0.4 (demo)

## UX auditdan keyingi o‘zgarish

Foydalanuvchi screenshotda operatsiyalarning muddati bo‘yicha saralashni so‘radi. Tanlangan davrga mos summa va operatsiyalar ko‘rinishi kerak.

**Hozir amalga oshirilgan:**
- `Muddat` tanlovi: Barchasi, Hafta, Oy, 30 kun, Oraliq.
- Bu hafta: dushanbadan bugungacha (masalan, 2026-11-22 uchun 2026-11-16 ... 2026-11-22).
- Bu oy: shu oyning 1-sanasi ... bugun.
- Oxirgi 30 kun: bugun qo‘shilgan holda to‘liq 30 kalendar kun.
- Maxsus oraliq: YYYY-MM-DD dan YYYY-MM-DD gacha, ikkala chegara ham hisobga olinadi. Noto‘g‘ri va kelajak sana bloklanadi.
- Kirim/chiqim kartalari **tanlangan davr bo‘yicha barcha demo yozuvlardan** hisoblanadi. Qidiruv yoki `Xarajat/Daromad` filtri ro‘yxatni toraytiradi, lekin ikki summani o‘zgartirmaydi. Shu tafovut UI’da aniq yozilgan.
- Qancha operatsiya topilgani va `Tozalash` tugmasi.
- Bo‘sh natijada muddat/qidiruv filtri sababini tushuntiruvchi matn.
- `+ Qo‘shish` endi ro‘yxat ustida suzib yurmaydi: scroll sohasidan tashqaridagi pastki action dock’da. U ro‘yxat summalarini yopmasligi kerak.

**Chegaralar:**
- Faqat demo sessiya; `occurredOn` asosida qayta hisoblanadi. Dashboard balans/safe-to-spend/analitika hali real summaga ulanmagan.
- Sana bugungi kun bo‘yicha **qurilmaning lokal kalendar sanasi** bilan hisoblanadi; keyinchalik asosiy vaqt zonasini (Asia/Tashkent) backend bilan kelishtirish kerak.
- Maxsus oraliq boshqaruvi hozir matnli sana inputi; native kalendar date picker keyinroq amalga oshiriladi.
- Issue #3 dagi **oldingi davr bilan ustma-ust grafik** buning ichiga kirmaydi. Unda ma’lumot qamrovi va bir xil qiymat shkalasi alohida audit qilinadi.

## Qabul sinovlari
1. 393×852 va 360×800 viewportda muddat chiplar gorizontal aylansin; sahifa kesilib qolmasin.
2. 22-noyabr 2026 uchun: Hafta: 16–22 noyabr; Oy: 1–22 noyabr; 30 kun: 24 oktabr–22 noyabr.
3. Oraliq: 20–22 noyabr 2026 → 4 ta demo yozuv, jami kirim 3 000 000, chiqim 139 000 so‘m.
4. Oraliq: 21–22 noyabr 2026 → 3 ta yozuv, kirim 0, chiqim 139 000.
5. Noto‘g‘ri sana (2026-11-31), teskari davr, kelajak sanasi: xato ko‘rsatsin, avvalgi qo‘llangan filtrni o‘zgartirmasin.
6. `Xarajat` filtri faqat chiqimlarni ko‘rsatsin; daromad jamisi tanlangan muddat bo‘yicha qolishini tushuntiruvchi label aniq.
7. `Tozalash` → muddat barcha vaqt, tur barchasi, qidiruv bo‘sh; operatsiyalar qaytsin.
8. Barcha ro‘yxat elementlarini pastga scroll qilganda `Qo‘shish` ularni yopmasin.
9. Yangi operatsiya kiritilsa, shu sana tegishli muddat ichida bo‘lsa filtrda ko‘rinsin; aksi bo‘lsa faqat barcha va mos muddatda.
10. TypeScript va `npm run test:transactions` xatosiz bo‘lsin.

## GitHub tartibi

Bu branch `feat/transactions-v03` dan chiqarilgan. PR #6 hali `feat/dashboard-premium-v02` branchiga bog‘langan, PR #2 esa `main`ga. Merge tartibi: #2 → #6 → muddat filtri PR, tegishli CI + ekran testi o‘tgach.
