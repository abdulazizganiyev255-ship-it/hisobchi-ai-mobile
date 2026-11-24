/**
 * Chromium smoke test of the actual Expo Web bundle at three phone viewport sizes.
 *
 * Run after starting "npx expo start --web --port 8090" and installing Playwright.
 * This is browser E2E coverage, NOT native Android/iOS or screenshot-diff QA.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

const BASE_URL = process.env.SMOKE_URL || 'http://127.0.0.1:8090';
const SIZES = [
  {width: 320, height: 640},
  {width: 360, height: 800},
  {width: 393, height: 852},
];
const IMAGE_DIR = path.join(__dirname, '..', 'artifacts', 'web-smoke');
fs.mkdirSync(IMAGE_DIR, {recursive: true});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const failures = [];

async function serverReady() {
  for (let attempt = 0; attempt < 90; attempt++) {
    try {
      const response = await fetch(BASE_URL, {signal: AbortSignal.timeout(5000)});
      if (response.ok) return;
    } catch (_) {}
    await sleep(2000);
  }
  throw new Error('Expo web server did not become ready at ' + BASE_URL);
}

async function visible(locator, message) {
  await locator.first().waitFor({state: 'visible', timeout: 30000});
  assert.ok(await locator.first().isVisible(), message);
}

async function checkWidth(page, size, label) {
  const stats = await page.evaluate(() => ({
    viewport: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));
  assert.ok(
    stats.documentWidth <= stats.viewport + 2 && stats.bodyWidth <= stats.viewport + 2,
    label + ': horizontal overflow ' + JSON.stringify(stats) + ' at ' + size.width,
  );
}

async function capture(page, size, name) {
  await page.screenshot({
    path: path.join(IMAGE_DIR, size.width + 'x' + size.height + '-' + name + '.png'),
    animations: 'disabled',
    timeout: 30000,
  });
}

async function smoke(browser, size) {
  const context = await browser.newContext({
    viewport: size, deviceScaleFactor: 1, hasTouch: true, isMobile: true,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  const label = size.width + 'x' + size.height;
  const nav = title => page.getByRole('tab', {name: title, exact: true});

  try {
    await page.goto(BASE_URL, {waitUntil: 'domcontentloaded', timeout: 90000});
    await visible(nav('Bosh sahifa'), 'Tab bar on Home');
    await visible(page.getByText('Umumiy balans', {exact: true}), 'Dashboard visible');
    await checkWidth(page, size, 'Dashboard');
    const monthlyPeriod = page.getByRole('button', {name: /Oylik xarajat muddatini tanlash/});
    await monthlyPeriod.click();
    await visible(page.getByRole('button', {name: 'Oylik xarajat: Bu oy'}), 'Current month available');
    await visible(page.getByRole('button', {name: 'Oylik xarajat: O‘tgan oy'}), 'Previous month available');
    await page.getByRole('button', {name: 'Oylik xarajat: O‘tgan oy'}).click();
    await visible(page.getByText('4 180 000 so‘m', {exact: true}), 'Previous-month sample loaded');
    await monthlyPeriod.click();
    await page.getByRole('button', {name: 'Oylik xarajat: Bu oy'}).click();
    await visible(page.getByText('3 840 000 so‘m', {exact: true}), 'Current-month sample restored');
    await capture(page, size, 'dashboard');

    await nav('Faoliyat').click();
    await visible(page.getByRole('button', {name: 'Yangi operatsiya qo‘shish'}), 'Add transaction CTA');
    await visible(page.getByText('259 000 so‘m', {exact: true}), 'Baseline expenses');
    await checkWidth(page, size, 'Transactions');
    await capture(page, size, 'transactions');

    const add = page.getByRole('button', {name: 'Yangi operatsiya qo‘shish'});
    const tab = nav('Faoliyat');
    const addBox = await add.boundingBox();
    const tabBox = await tab.boundingBox();
    const listBox = await page.getByTestId('transactions-scroll').boundingBox();
    assert.ok(addBox && tabBox && listBox, 'Add CTA, list viewport and bottom tab have bounding boxes');
    assert.ok(listBox.y + listBox.height > addBox.y + 8, 'Operations list must extend behind FAB: no reserved full-width bottom strip');
    assert.ok(addBox.x >= 0 && addBox.x + addBox.width <= size.width + 1, 'Add CTA within width');
    const list = page.getByTestId('transactions-scroll');
    const scrolled = await list.evaluate(element => {
      element.scrollTop = element.scrollHeight;
      return element.scrollHeight > element.clientHeight;
    });
    assert.ok(scrolled, 'Transactions list needs to be scrollable');
    await page.waitForTimeout(150);
    const lastRow = await page.getByText('Salomatlik', {exact: true}).boundingBox();
    assert.ok(lastRow && lastRow.y + lastRow.height < addBox.y - 3,
      'At bottom of list, last transaction must be fully visible above Add CTA');
    await capture(page, size, 'transactions-bottom');
    await list.evaluate(element => {element.scrollTop = 0;});
    assert.ok(addBox.y + addBox.height <= tabBox.y + 2, 'Add CTA must sit above bottom tabs');

    const search = page.getByRole('textbox', {name: 'Kategoriya yoki izoh bo‘yicha qidirish'});
    await search.fill('hech-narsa-topilmasin-qa');
    await visible(page.getByText('Mos operatsiya topilmadi', {exact: true}), 'Search empty state');
    await page.getByRole('button', {name: 'Filtrlarni tozalash'}).click();
    await visible(page.getByText('5 ta operatsiya topildi', {exact: true}), 'Reset restores list');

    await add.click();
    await visible(page.getByText('Yangi operatsiya', {exact: true}), 'Transaction editor');
    await page.getByRole('button', {name: /Operatsiya sanasi:.*Kalendarni ochish/}).click();
    await visible(page.getByText('Sanani tanlang', {exact: true}), 'Date picker modal');
    await capture(page, size, 'calendar');
    await page.getByRole('button', {name: 'Sana tanlashni bekor qilish'}).click();
    await page.getByRole('textbox', {name: 'Operatsiya summasi, so‘m'}).fill('100000');
    await page.getByRole('button', {name: 'Operatsiyani qo‘shish'}).click();

    await visible(page.getByText('6 ta operatsiya topildi', {exact: true}), 'Created transaction appears');
    await visible(page.getByText('359 000 so‘m', {exact: true}), 'Expenses recalculate');
    await nav('Tahlil').click();
    await visible(page.getByText('2 641 000 so‘m', {exact: true}), 'Net total updates');
    await visible(page.getByText('3 359 000 so‘m', {exact: true}), 'Turnover updates');
    await checkWidth(page, size, 'Analytics');
    await capture(page, size, 'analytics');

    await page.getByRole('button', {name: /Muddatni tanlash\. Hozir:/}).click();
    await page.getByRole('button', {name: 'Tahlil davri: Oraliq'}).click();
    await visible(page.getByText('Ixtiyoriy muddat', {exact: true}), 'Custom range editor');
    await page.getByRole('button', {name: /Boshlanish sanasi:.*Kalendarni ochish/}).click();
    await visible(page.getByText('Sanani tanlang', {exact: true}), 'Analytics calendar');
    await page.getByRole('button', {name: 'Sana tanlashni bekor qilish'}).click();
    await page.getByRole('button', {name: 'Tanlangan sana oralig‘ini tahlilga qo‘llash'}).click();
    await checkWidth(page, size, 'Analytics custom range');
    await capture(page, size, 'analytics-custom');

    await nav('Profil').click();
    await visible(page.getByText('Namoyish profili', {exact: true}), 'Profile');
    await visible(page.getByText('6 ta', {exact: true}), 'Profile count reflects created transaction');
    await page.getByRole('button', {name: 'Demo ma’lumotlarini tiklashni boshlash'}).click();
    await page.getByRole('button', {name: 'Demo yozuvlarini tiklashni tasdiqlash'}).click();
    await visible(page.getByText('5 ta demo yozuv tiklandi.', {exact: true}), 'Reset confirms');
    await visible(page.getByText('5 ta', {exact: true}), 'Profile count resets');

    await page.getByRole('button', {name: 'Ilova bo‘yicha qo‘llanma'}).click();
    await visible(page.getByText('1 / 3', {exact: true}), 'Onboarding step one');
    await page.getByRole('button', {name: 'Keyingi qadam'}).click();
    await visible(page.getByText('2 / 3', {exact: true}), 'Onboarding step two');
    await page.getByRole('button', {name: 'Keyingi qadam'}).click();
    await visible(page.getByText('3 / 3', {exact: true}), 'Onboarding step three');
    await capture(page, size, 'onboarding');
    await page.getByRole('button', {name: 'Qo‘llanmani tugatib bosh sahifani ochish'}).click();
    await visible(nav('Bosh sahifa'), 'Finish returns Home');
    await visible(page.getByText('Umumiy balans', {exact: true}), 'Home after onboarding');
    assert.deepEqual(pageErrors, [], 'No unhandled browser errors: ' + pageErrors.join(' ; '));

    console.log('PASS ' + label + ' — navigation, add, calendar, filters, financial totals, reset, onboarding');
  } catch (error) {
    try {await capture(page, size, 'failure');} catch (_) {}
    failures.push(label + ': ' + String(error) + (pageErrors.length ? '; runtime: ' + pageErrors.join('; ') : ''));
    console.error('FAIL ' + label + ': ' + String(error));
  } finally {
    await context.close();
  }
}

(async () => {
  await serverReady();
  const browser = await chromium.launch({headless: true, args: ['--no-sandbox']});
  try {
    for (const size of SIZES) await smoke(browser, size);
  } finally {
    await browser.close();
  }
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('All three Expo Web responsive smoke runs completed.');
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});