# 01 — Hisobchi AI Design System

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

- Bu v0.1 frontend prototipi; auth/API yo‘q.
- Grafik ko‘rsatkichlari va safe-to-spend moliyaviy hisoblashga asoslanmagan.
- Runtime screenshot yoki haqiqiy qurilmada render ushbu muhitda sinovdan o‘tmagan.
