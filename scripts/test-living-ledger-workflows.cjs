/**
 * Real Chromium E2E for Living Ledger Transactions and Editor.
 * This tests rendered semantics and session CRUD at 320/360/393 CSS pixels.
 * It is NOT a native mobile, keyboard IME, VoiceOver or TalkBack certification.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

const BASE = process.env.SMOKE_URL || 'http://127.0.0.1:8090';
const SIZES = [
  {width: 320, height: 640},
  {width: 360, height: 800},
  {width: 393, height: 852},
];
const OUT = path.join(__dirname, '..', 'artifacts', 'living-ledger');
fs.mkdirSync(OUT, {recursive: true});
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function serverReady() {
  for (let i = 0; i < 90; i++) {
    try {
      const response = await fetch(BASE, {signal: AbortSignal.timeout(3500)});
      if (response.ok) return;
    } catch (_) {}
    await sleep(1500);
  }
  throw Error('Expo Web server unreachable: ' + BASE);
}

async function screenshot(page, size, slug) {
  await page.screenshot({
    path: path.join(OUT, size.width + 'x' + size.height + '-ledger-' + slug + '.png'),
    animations: 'disabled',
  });
}

async function assertFits(page, label) {
  const stats = await page.evaluate(() => ({
    width: window.innerWidth,
    body: document.body.scrollWidth,
    html: document.documentElement.scrollWidth,
  }));
  assert.ok(stats.body <= stats.width + 2 && stats.html <= stats.width + 2,
    label + ' horizontal overflow: ' + JSON.stringify(stats));
}

async function verifySize(browser, size) {
  const context = await browser.newContext({
    viewport: size, deviceScaleFactor: 1, hasTouch: true, isMobile: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(16000);
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const label = size.width + 'x' + size.height;
  const tab = name => page.getByRole('tab', {name, exact: true});

  try {
    await page.goto(BASE, {waitUntil: 'domcontentloaded', timeout: 90000});
    await tab('Faoliyat').click();
    await page.getByText('Operatsiyalar', {exact: true}).first().waitFor({state: 'visible'});
    await page.getByTestId('ledger-transactions-add').waitFor({state: 'visible'});
    await page.getByText('259 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await assertFits(page, label + ' history');
    if (size.width === 320) {
      const firstRow = await page.getByRole('button', {name: /Transport, xarajat 12 000 so‘m. Tahrirlash/}).boundingBox();
      const bottomNav = await tab('Faoliyat').boundingBox();
      assert.ok(firstRow && bottomNav, '320px first ledger row and bottom navigation must be measurable');
      assert.ok(firstRow.y + firstRow.height <= bottomNav.y - 3,
        '320px first ledger row should be entirely readable above the bottom navigation without scrolling');
    }
    await screenshot(page, size, 'transactions');

    // Search, empty state and reset must match the totals shown for visible rows.
    const search = page.getByRole('textbox', {name: 'Kategoriya yoki izoh bo‘yicha qidirish'});
    await search.fill('not-a-real-demo-category');
    await page.getByText('Mos operatsiya topilmadi', {exact: true}).waitFor({state: 'visible'});
    await page.getByText('0 so‘m', {exact: true}).first().waitFor({state: 'visible'});
    await page.getByRole('button', {name: 'Filtrlarni tozalash'}).first().click();
    await page.getByText('5 ta operatsiya topildi', {exact: true}).waitFor({state: 'visible'});

    await page.getByRole('radio', {name: 'Xarajat'}).click();
    await page.getByText('4 ta operatsiya topildi', {exact: true}).waitFor({state: 'visible'});
    await page.getByText('0 so‘m', {exact: true}).first().waitFor({state: 'visible'});
    await page.getByRole('radio', {name: 'Barchasi'}).click();

    // Interactive calendar must be actual and cancel safely.
    await page.getByRole('button', {name: /Muddatni tanlash\. Hozir:/}).click();
    await page.getByRole('button', {name: 'Muddat: Oraliq'}).click();
    await page.getByText('Sana oralig‘i', {exact: true}).waitFor({state: 'visible'});
    await page.getByRole('button', {name: /Boshlanish sanasi:.*Kalendarni ochish/}).click();
    await page.getByText('Sanani tanlang', {exact: true}).waitFor({state: 'visible'});
    await screenshot(page, size, 'calendar');
    await page.getByRole('button', {name: 'Sana tanlashni bekor qilish'}).click();
    await page.getByRole('button', {name: 'Tanlangan sana oralig‘ini qo‘llash'}).click();
    await page.getByRole('button', {name: /Muddatni tanlash\. Hozir: Oraliq/}).waitFor({state: 'visible'});
    await page.getByRole('button', {name: 'Filtrlarni tozalash'}).first().click();

    // Editor validation and date selection use the same finance model as before.
    await page.getByTestId('ledger-transactions-add').click();
    await page.getByText('Yangi operatsiya', {exact: true}).waitFor({state: 'visible'});
    await assertFits(page, label + ' editor');
    await screenshot(page, size, 'editor');
    await page.getByTestId('ledger-editor-save').click();
    await page.getByText(/1 dan 999 999 999 999 so‘mgacha/).waitFor({state: 'visible'});
    await page.getByTestId('ledger-editor-calendar-trigger').click();
    await page.getByText('Sanani tanlang', {exact: true}).waitFor({state: 'visible'});
    await page.getByRole('button', {name: 'Sana tanlashni bekor qilish'}).click();
    await page.getByTestId('ledger-editor-amount').fill('100000');
    await page.getByTestId('ledger-editor-save').click();
    await page.getByText('6 ta operatsiya topildi', {exact: true}).waitFor({state: 'visible'});
    await page.getByText('359 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await screenshot(page, size, 'created');

    // Editing should replace the entry, not duplicate it.
    await page.getByRole('button', {name: /Oziq-ovqat, xarajat 100 000 so‘m. Tahrirlash/}).click();
    await page.getByText('Operatsiyani tahrirlash', {exact: true}).waitFor({state: 'visible'});
    await page.getByTestId('ledger-editor-amount').fill('50000');
    await page.getByRole('button', {name: 'O‘zgarishlarni saqlash'}).click();
    await page.getByText('309 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await page.getByText('6 ta operatsiya topildi', {exact: true}).waitFor({state: 'visible'});

    // Destructive action requires a confirmation step, with a working cancel.
    await page.getByRole('button', {name: /Oziq-ovqat, xarajat 50 000 so‘m. Tahrirlash/}).click();
    await page.getByRole('button', {name: 'Operatsiyani o‘chirishni tasdiqlash oynasini ochish'}).click();
    await page.getByText('Rostdan o‘chirasizmi?', {exact: true}).waitFor({state: 'visible'});
    await page.getByRole('button', {name: 'O‘chirishni bekor qilish'}).click();
    await page.getByRole('button', {name: 'Operatsiyani o‘chirishni tasdiqlash oynasini ochish'}).click();
    await page.getByRole('button', {name: 'Operatsiyani butunlay o‘chirish'}).click();
    await page.getByText('5 ta operatsiya topildi', {exact: true}).waitFor({state: 'visible'});
    await page.getByText('259 000 so‘m', {exact: true}).waitFor({state: 'visible'});

    await tab('Tahlil').click();
    await page.getByText('2 741 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await tab('Bosh sahifa').click();
    await page.getByText('145 000', {exact: true}).waitFor({state: 'visible'});
    await page.getByText('3 840 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await assertFits(page, label + ' home after CRUD');
    assert.deepEqual(errors, [], label + ': unexpected runtime errors');
    console.log('PASS ' + label + ': search, date, amount, add/edit/delete and source totals');
  } catch (error) {
    try {await screenshot(page, size, 'failure');} catch (_) {}
    throw new Error(label + ': ' + String(error) +
      (errors.length ? '\nRuntime errors: ' + errors.join('\n') : ''));
  } finally {
    await context.close();
  }
}

(async () => {
  await serverReady();
  const browser = await chromium.launch({headless: true, args: ['--no-sandbox']});
  try {
    for (const size of SIZES) await verifySize(browser, size);
  } finally {
    await browser.close();
  }
  console.log('All Living Ledger transaction / editor scenarios passed.');
})().catch(error => {console.error(error); process.exitCode = 1;});
