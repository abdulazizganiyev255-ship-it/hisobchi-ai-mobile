# Hisobchi AI — UI v1.6: Kalendar va Qo‘shish CTA

## Screenshot feedback (2026-11-22)

- Operatsiyalar ro'yxatidagi `+ Qo‘shish` tugmasi ortida keraksiz keng **to‘q-ko‘k action rail** saqlanib qolgan.
- Formadagi sanani tanlash uchun `YYYY-MM-DD` ni qo‘lda yozish majburiy edi; sanaga bosilganda taqvim ochilmagan.
- Skrinshotda **7 ta** operatsiya / **369 000 so‘m chiqim** ko‘rinmoqda. Oldingi 5 ta yozuvdagi 259 000 so‘mga 100 000 va 10 000 so‘mlik xarajatlar qo‘shilgan; bu matematik jihatdan to‘g‘ri.

## O‘zgarishlar

1. `TransactionsScreen`ning action-area wrapper'i olib tashlandi, faqat gradientli `+ Qo‘shish` CTA saqlandi. U pastki o‘ngda, navigatsiyadan yuqorida `position:absolute` bilan chiziladi. ScrollView `paddingBottom:118` bo‘lib, ro'yxatning **oxirgi yozuvini** tugma ostidan aylantirib chiqarish mumkin. **Muhim**: o‘rtada scroll qilinganda overlay button ustida kontent vaqtinchalik ko‘rinishi mumkin; bu skrinshot/interaction sinovidan o'tishi kerak. Qo‘shimcha fon qatori qaytarilmaydi.
2. `TransactionEditorScreen`dagi matnli sana inputi `Pressable`ga aylantirildi. U bosilganda `DateCalendar` modali ochiladi; sana tanlanganda `occurredOn` yangilanib, mavjud validatsiya saqlanadi.
3. Kalendar: o‘zbekcha oy nomlari, dushanba bilan boshlanadigan hafta, oldingi/keyingi oy, bugun, bekor qilish; tanlangan sana belgilanadi. 2000-01-01 dan oldingi va bugundan keyingi sanalar disabled. UZ/UTC translatsiyasini qilmaydi — sana stringi lokal kalendar kun sifatida qoladi.
4. Qo‘shimcha npm kutubxonasi kerak emas; RN Modal/Pressable web va native uchun bir xil UI implementatsiya.
5. Jami summalar, kirim/chiqim, kategoriyalar, saqlash/tahrirlash/o'chirish mantiqi va demo sessiya saqlash usuli o'zgarmadi.
6. `scripts/test-calendar.cjs` — grid, leap-year, kelajak sanasi, tarixiy minimum, oy navigatsiyasi; UI source contracts action dock yo‘qligi va taqvimga ulanganligini tekshiradi.

## Sinov bosqichlari

CI:
```powershell
npm run typecheck
npm run test:transactions
npm run test:analytics
npm run test:design-system
npm run test:calendar
npm run test:ui-contract
```

Manual Chrome (393×852; 360×800; 320×640):
1. Operatsiyalarni scroll qiling: `+ Qo‘shish` atrofida keng ko‘k gorizontal qator yo‘q, eng oxirgi karta va summa to‘liq ko‘rinadi.
2. `+ Qo‘shish` → Sana maydonini bosing → kalendar ochilsin; oldingi oyga o'ting; sana tanlab forma maydoni yangilansin.
3. Kelajak sanalari disabled, keyingi oy cheklangan; `Bekor qilish` qiymatni o'zgartirmasin; `Bugun` bugungi kunni tanlasin.
4. Operatsiyani qo‘shish va tahrirlash: eski model validatsiyasi ishlasin, sanalar va tahlildagi summalar to‘g‘ri o‘zgarsin.
5. 320px da kunlar panjarasi, oy sarlavhasi, footer tugmalari kesilmasin; keyboard/modal va Android back sinov.
6. RN web runtime logida yangi xato yo'qligi; native Android/iOS emulyator/test qurilma alohida tekshirilishi lozim.

## Release

Draft PR, `fix/transactions-fab-calendar-v16` branch `feat/design-system-v1-final-ui-qa` (#16) ustiga qurilgan. `main` va Supabase o‘zgartirilmagan. Manual QA bo‘lmasdan merge qilinmasin.
