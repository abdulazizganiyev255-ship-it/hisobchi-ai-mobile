# Dashboard v0.2 — design va QA

## Maqsad

Dashboard foydalanuvchiga quyidagilarni tez anglatishi kerak:
1. Umumiy balans (hozir demo).
2. Bugun xavfsiz sarflash mumkin bo‘lgan summa (hozir demo, hali hisoblanmaydi).
3. Oylik xarajatlar tendensiyasi va oxirgi operatsiyalar.

## O‘zgartirilgan qismlar

- Balans kartasi: yumshoq to‘q ko‘k gradient, aniqroq tipografika, namuna belgisi.
- Safe-to-spend: kontrasti balandroq och karta, ko‘rinadigan harakat indikatori.
- Grafika: xarajat jami, oldingi davrga nisbatan o‘zgarish va nisbiy demo dinamika alohida ko‘rsatiladi.
- Grafik o‘qlari: ilgari real hisobga mos kelmaydigan 6M/4M/2M olib tashlandi, endi 100%/50%/0% normalizatsiyalangan demo shkala.
- Operatsiyalar: bo‘lim sarlavhasi va “Oxirgi 3 ta namuna yozuv” izohi.
- React Native va Web variantlari alohida saqlanadi.

## Yaqinlashish mezonlari

- Ekran o‘lchamlari: 393 × 852, 360 × 800, 320 × 640 CSS px/dp.
- Dashboard: matn kesilmasligi; 1.5x font scaling keyingi haqiqiy qurilma sinovida baholanadi.
- Balans ko‘zcha tugmasi raqamni yashiradi va qayta ko‘rsatadi.
- “Bu oy” tugmasi “O‘tgan oy” bilan almashadi; farq ko‘rsatkichlari ham yangilanadi.
- Oxirgi operatsiyalar bo‘limi scroll bilan to‘liq ochiladi; pastki navigatsiya yopib qolmaydi.
- Browser console/terminalda WebShape yoki yangi runtime xato yo‘q.
- Barcha raqamlar demo sifatida belgilangan; real moliyaviy hisoblash deb talqin etilmasin.

## Tekshirish (Windows PowerShell 5.1)

```powershell
cd C:\Users\ASUS\Projects\hisobchi-ai-mobile
git fetch origin
git switch --track origin/feat/dashboard-premium-v02
npm run typecheck
npx expo start --web --clear
```

Brauzerda Chrome DevTools Device Toolbar: 393 × 852. Screenshotni yuqori va pastki holatda tekshirish.

## Chegaralar

- Supabase integratsiyasi, auth, AI tahlili, safe-to-spend hisoblash v0.2 ga kirmaydi.
- Native Android/iOS runtime hali sinovdan o‘tmagan.
- PR foydalanuvchi sinovidan so‘nggina main branchga merge qilinadi.
