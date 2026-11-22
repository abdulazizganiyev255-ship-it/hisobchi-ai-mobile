# 01 — Hisobchi AI Design System

## Muhandislik chegaralari (v0.6.4)

- **React** allaqachon ishlatilmoqda: `.tsx` komponentlar — React Native UI.
- **TypeScript** komponent state, props va moliyaviy modellarni tip bilan tekshiradi.
- **React Native StyleSheet** ilovaning rang, spacing, radius va layoutini belgilaydi; React Native Web brauzer uchun ularni CSS ga aylantiradi. Keyinroq alohida Java yoki React qatlamini qo‘shish shart emas.
- **Kotlin/Java** faqat alohida native Android modul zarur bo‘lsa ishlatiladi. Hozir Expo boshqaruvidagi standart UI bilan davom etamiz.
- **Tokenlar** `src/theme/tokens.ts`da markazlashadi; UI ekranlarda imkon qadar takroriy hardcoded rang, spacing va radius ishlatmaslik kerak. Keyingi refaktorda barcha ekranlar uchun qayta ishlatiladigan `MetricCard`, `PeriodPicker`, `SectionHeader` kabi komponentlar ajratiladi.
- **Dizayn iteratsiyasi tartibi:** 1) ekranning asosiy savoli; 2) bloklarning ustuvorligi; 3) takroriy qiymatlarni kamaytirish; 4) tugmalar va touch-targetlar; 5) bo‘shliq/typography; 6) rang/gradient; 7) Web + native QA. Har mayda detal uchun alohida patch emas, ekran maqsadiga ko‘ra qaror.
- **Tahlil v0.6.4 IA:** davrni tanlash → bitta KPI karta (sof farq, kirim, chiqim, jami aylanma) → Kunlik dinamika (filtr + ustunlar + tanlangan kun summasi) → kategoriya taqsimoti → oldingi davr cheklovi.
- Joriy ekran uchun `Barchasi/Hafta/Oy/30 kun` doim ochiq emas: bir dona davr tugmasi ichida. Kunlik dinamikaning `Chiqim/Kirim/Aylanma` rejimlari grafikga tegishli, jami raqamlar ikkinchi marta katta bloklarda qaytarilmaydi.
- **Responsive gate:** 320, 360 va 393 dp/px kengliklarda summalar kesilmasin, boshqaruvlar foydalaniladigan bo‘lsin; dinamik shrift 1.3x/1.5x va Android/iOS real qurilma alohida tekshirilsin.
- Demo tranzaksiyalar sessiya xotirasida. `main` va Supabase schema ushbu dizayn refaktoridan o‘zgarmaydi.

## Ish jarayoni

1. Ekranning asosiy savolini aniqlash: "Bugun qancha pulni xavfsiz sarflash mumkin?"
2. Axborot iyerarxiyasi: safe-to-spend, umumiy balans, oy xarajati, operatsiyalar.
3. Rang tokenlarini bir joyda saqlash: `src/theme/tokens.ts`.
4. 8pt spacing grid: 8/16/24/32; zarur joylarda 12 va 20.
5. Yagona komponentlar: `AppIcon`, `TransactionRow`, `ExpenseChart`.
6. Real qurilmada sinab ko‘rish: 360dp va 393dp kenglik; kichik matnlar; uzun summalar.
7. Tasdiqlangandan keyin integratsiya: faqat tekshirilgan Supabase schema va deterministic Safe-to-Spend funksiyasi bilan.

## Kompozitsiya qoidalari

- Asosiy axborot oldinga, yordamchi matn ikkinchi qatlamga.
- Kontentning aksariyati 20dp horizontal gutter bilan hizalanadi.
- Oqish karta (`safeCard`) eng muhim qaror uchun, to‘q kartalar umumiy ma’lumotlar uchun.
- Yorqin effektlar boshqaruvni yutib yubormasligi kerak.
- Barcha raqamlar demo ekanligi ko‘rinib turishi kerak.

## Keyingi QA

- Katta summalar (masalan `1 000 000 000 so‘m`) kesilib qolmasligi.
- Screen-reader label va bosiladigan targetlar.
- Android system font scale bilan 1.2x va 1.5x tekshiruv.
- Empty/loading/error states va offline holat keyingi bosqichda.

## Hozirgi chegaralar

- Ishlayotgan dizayn branchida Analytics UI v0.6.4 gacha yetdi; auth/API integratsiyasi hali yo‘q. Bu ishlab chiqarish versiyasi emas.
- Grafik ko‘rsatkichlari va safe-to-spend moliyaviy hisoblashga asoslanmagan.
- Runtime screenshot yoki haqiqiy qurilmada render ushbu muhitda sinovdan o‘tmagan.
