# Hisobchi AI — bosqichma-bosqich boshlash

**Maqsad:** Hisobchi AI dizayn prototipini kompyuterda ishga tushirish, Android telefonda ko‘rish, GitHub'ga xavfsiz joylash.

## 1. GitHub repo ochish (bir martalik ish)

1. GitHub hisobingga kir: https://github.com/new
2. **Repository name**: `hisobchi-ai-mobile`
3. **Private** rejimini tanla — moliyaviy ilova uchun xavfsizroq boshlanish.
4. **Add a README file**, `.gitignore` va **Choose a license** maydonlarini tanlama. Ular arxivda allaqachon bor.
5. **Create repository** tugmasini bos.

**Eslatma:** ChatGPT GitHub hisobidagi repo ro‘yxatini tekshirdi, lekin ulangan GitHub vositasi yangi repo yaratishni qo‘llamadi. Demak, 1-bosqich foydalanuvchi tomonidan bajariladi.

## 2. Loyiha fayllarini ochish

1. `hisobchi-ai-mobile-starter.zip` arxivini yuklab ol.
2. Windows File Explorer ichida **Extract All** bilan ajrat.
3. Ichkaridagi `hisobchi-ai-mobile` papkasiga kir.
4. Papkaning yuqorisidagi manzil qatoriga `powershell` yozib Enter bos. Terminal shu papkada ochiladi.

## 3. Paketlarni o‘rnatish

Kompyuterda Node.js 22 yoki undan yangi versiya bo‘lishi kerak. Tekshirish:

```powershell
node -v
npm -v
```

Keyin:

```powershell
npm install
npx expo install --fix
npm run typecheck
```

`npm install` kutubxonalarni olib keladi. `expo install --fix` Expo SDK bilan mos native dependency versiyalarini to‘g‘rilaydi. `typecheck` TypeScript turlarini tekshiradi.

**Agar xato bo‘lsa:** xatoning aynan matnini yubor. Uni taxmin bilan tuzatmaymiz.

## 4. Android telefoningda ko‘rish

1. Telefoningga Expo Go'ning Expo SDK 58 bilan mos versiyasini o‘rnat (https://expo.dev/go).
2. Kompyuter va telefonni bir Wi-Fi tarmog‘iga ula.
3. PowerShell'da:

```powershell
npx expo start
```

4. QR-kodni Expo Go bilan skanerla.
5. Wi-Fi ishlamasa `Ctrl+C` bilan jarayonni to‘xtat va `npx expo start --tunnel`ni sinab ko‘r. Bu tunnel uchun qo‘shimcha paket o‘rnatishni talab qilishi mumkin.

## 5. GitHub'ga birinchi push

**Papka ichida turganingni tekshir:** `dir` yozganda `App.tsx` va `package.json` ko‘rinishi kerak.

```powershell
git init
git add .
git commit -m "feat: initial Hisobchi AI dashboard UI"
git branch -M main
git remote add origin https://github.com/abdulazizganiyev255-ship-it/hisobchi-ai-mobile.git
git push -u origin main
```

Agar Git foydalanuvchi ismi yoki emailini talab qilsa, faqat o‘zingning Git profilingga mos ma’lumotni kirit. GitHub odatiy parol bilan `push` qabul qilmaydi; Git Credential Manager/browser autentifikatsiyasidan foydalan.

**Tekshir:** https://github.com/abdulazizganiyev255-ship-it/hisobchi-ai-mobile — `App.tsx`, `src`, `README.md` va `BOSHLASH_UZ.md` ko‘rinishi kerak. Private repo faqat tegishli ruxsatga ega foydalanuvchilarga ko‘rinadi.

## 6. Bizning 1-bosqich sinovimiz

- [ ] Asosiy Dashboard ekrani ochildi.
- [ ] Ko‘z belgisi balansni yashiradi va qayta ko‘rsatadi.
- [ ] `Bu oy` bosilganda grafikdagi demo qiymatlar o‘zgaradi.
- [ ] `Operatsiyalar` bo‘limiga o‘tish ishlaydi.
- [ ] Pastki navigatsiya boshqa ekranlarga o‘tadi.
- [ ] Matnlar ekran chetidan chiqmaydi, elementlar bir-birini yopmaydi.

**Keyingi bosqich:** QR-kod orqali haqiqiy telefonda ko‘rib, UI/UX audit qilamiz; keyin real Supabase sxemasi tekshiriladi. Real foydalanuvchi balansini demo ma’lumot bilan aralashtirmaymiz.
