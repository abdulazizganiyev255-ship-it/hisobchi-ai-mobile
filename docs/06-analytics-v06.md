# Hisobchi AI — Analytics UI v0.6

## Maqsad
Operatsiyalar ekranida kiritilgan demo tranzaksiyalardan foydalanuvchiga tushunarli, chiroyli va hisoblangan tahlil ko‘rsatish. Supabase va haqiqiy bank hisoblari bu iteratsiyaga kirmaydi.

## Yangi ekran
- 4 davr: Barchasi, Hafta, Oy, Oxirgi 30 kun. Barcha sanalar lokal kunlarga asosan, haftaning boshi dushanba; oxirgi 30 kun bugunni o‘z ichiga oladi.
- Sof farq: jami kirim minus jami chiqim; ikkalasi ham ochiq ko‘rsatiladi.
- Pul oqimi: oxirgi 7 tagacha faol kunlar uchun daromad va xarajat ustunlari. Ma’lumot mavjud bo‘lmagan kunlarga uydirma nol berilmaydi.
- Xarajat tarkibi: kategoriyalar bo‘yicha demo sessiya yig‘indilari, foizi, tartiblangan progress bars.
- Bo‘sh davr: maxsus empty-state va Operatsiyalar sahifasiga qaytish.
- Oldingi davr bilan ikki chiziqli taqqoslash: issue #3 bo‘yicha, faqat tarix qamrovi tasdiqlangandan keyin; hozir sababi izohlanadi.
- Yuqori qismdagi UI v0.6 yozuvi lokal buildni ajratib ko‘rsatadi.

## Ma’lumotlar oqimi
App.tsx da sessiya ichida saqlanadigan transactions state ikkala TransactionsScreen va AnalyticsScreen ga uzatiladi. Add/edit/delete amallari Tahlilda qayta hisoblanadi; sahifa yangilansa demo yozuvlar tiklanadi.
Dashboard balans/safe-to-spend va statik Dashboard grafigi hali mustaqil namunaviy qiymatlar — ularni bir xil manba sifatida talqin qilmaslik kerak.

## Automated QA
- npm run typecheck
- npm run test:transactions
- npm run test:analytics
- 259 000 chiqim, 3 000 000 kirim, 2 741 000 sof farq (5 ta demo yozuvdan).
- Haftalik, oylik va 30 kunlik davr chegaralari, bo‘sh davr, kategoriya tartiblash, faqat faol kunlar.

## Manual Chrome QA
1. 393×852, 360×800, 320×640 o‘lchamlarida Tahlil ekranini ko‘rish.
2. Pastki navigatsiya va 4 davr filtri; oq kategoriya kartasidagi qora matn kontrasti.
3. Operatsiyalar orqali 100 000 so‘mlik Kafe xarajati qo‘shish → Tahlil chiqimi 359 000 bo‘lishi, keyin tahrir/o‘chirish qayta hisoblanishi.
4. Scroll, nav joylashuvi, tor ekranda uzun summalar, empty-state.
5. Expo Web terminalida runtime error bo‘lmasligi, boshqa sahifalar regressiya qilmasligi.

## Release
Branch feat/transactions-date-range-v04 ustiga qurilgan (PR #7). PR #2 → #6 → #7 ketma-ketlikda sinovdan keyin merge; ushbu PR ham testdan keyin. Main hozircha o‘zgarmaydi.
Supabase xavfsizlik gate: issue #8.
