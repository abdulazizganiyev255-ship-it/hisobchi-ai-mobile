# Hisobchi AI — Analytics UI v0.6

## v0.6.1 screenshot audit and chart fix
- Mobile QA observed that income 3 000 000 UZS dwarfed all smaller expense bars on a shared axis. Although mathematically valid, it made the spending trend visually unreadable.
- The Pul oqimi panel is now Kunlik dinamika, with a Chiqim / Kirim segmented selector. Default is Chiqim.
- The selected metric gets its own scale; the subtitle explicitly warns that bar heights from different modes are not directly comparable.
- Tap a day's bar to inspect the **exact UZS amount** and date; graph bars are derived from transaction totals, not mock-up percentages.
- Empty state is specific to the chosen metric. Categories' track widths now use exact expense proportions rather than an artificial minimum-width floor.
- Changed only AnalyticsScreen. Other UI branches and live Supabase data remain untouched.
- Manual test: toggle Chiqim (19.11=120000, 21.11=42000, 22.11=97000) and Kirim (20.11=3000000); check selected-day amount, category cards, and vertical scrolling at 393x852 and 360x800.

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
