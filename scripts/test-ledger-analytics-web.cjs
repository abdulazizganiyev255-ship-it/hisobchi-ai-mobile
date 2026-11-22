/**
 * Rendered Expo Web contract for Ledger Analytics, cross-screen finances,
 * chart semantics, period validation and custom range. NOT native/a11y QA.
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
  for (let attempt = 0; attempt < 90; attempt++) {
    try {
      const response = await fetch(BASE, {signal: AbortSignal.timeout(3500)});
      if (response.ok) return;
    } catch (_) {}
    await sleep(1500);
  }
  throw Error('Expo Web not ready: ' + BASE);
}
async function snap(page, size, name) {
  await page.screenshot({
    path: path.join(OUT, size.width + 'x' + size.height + '-analytics-' + name + '.png'),
    animations: 'disabled',
  });
}
async function noOverflow(page, label) {
  const widths = await page.evaluate(() => ({
    width: window.innerWidth,
    doc: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert.ok(widths.doc <= widths.width + 2 && widths.body <= widths.width + 2,
    label + ' overflow ' + JSON.stringify(widths));
}
async function verify(browser, size) {
  const context = await browser.newContext({
    viewport: size, isMobile: true, hasTouch: true, deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(16000);
  const runtimeErrors = [];
  page.on('pageerror', error => runtimeErrors.push(String(error)));
  const name = size.width + 'x' + size.height;
  try {
    await page.goto(BASE, {waitUntil: 'domcontentloaded', timeout: 90000});
    await page.getByRole('tab', {name: 'Tahlil'}).click();
    await page.getByText('SESSIYADAN HISOBLANGAN').first().waitFor({state: 'visible'});
    await page.getByTestId('ledger-analytics-net').waitFor({state: 'visible'});
    assert.equal((await page.getByTestId('ledger-analytics-net').textContent()).trim(), '2 741 000 so‘m');
    await page.getByText('3 259 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await noOverflow(page, name + ' initial');
    await snap(page, size, 'initial');

    // Changes of metric keep every recorded day while changing the scale.
    await page.getByTestId('ledger-metric-income').click();
    await page.getByTestId('ledger-chart-day-2026-11-20').click();
    await page.getByText('20.11 · Kirim', {exact: true}).waitFor({state: 'visible'});
    await page.getByTestId('ledger-metric-turnover').click();
    await page.getByText('20.11 · Aylanma', {exact: true}).waitFor({state: 'visible'});
    await page.getByTestId('ledger-metric-expense').click();
    await page.getByText('22.11 · Chiqim', {exact: true}).waitFor({state: 'visible'});
    await snap(page, size, 'chart');

    // Period picker and user-specified inclusive date range.
    await page.getByTestId('ledger-analytics-period-trigger').click();
    await page.getByRole('button', {name: 'Tahlil davri: Hafta'}).click();
    await page.getByText('2 741 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await page.getByTestId('ledger-analytics-period-trigger').click();
    await page.getByRole('button', {name: 'Tahlil davri: Oraliq'}).click();
    await page.getByText('Ixtiyoriy muddat', {exact: true}).waitFor({state: 'visible'});
    await page.getByRole('button', {name: /Boshlanish sanasi:.*Kalendarni ochish/}).click();
    await page.getByText('Sanani tanlang', {exact: true}).waitFor({state: 'visible'});
    await snap(page, size, 'calendar');
    await page.getByRole('button', {name: '2026-11-19'}).click();
    await page.getByRole('button', {name: /Tugash sanasi:.*Kalendarni ochish/}).click();
    await page.getByRole('button', {name: '2026-11-19'}).click();
    await page.getByTestId('ledger-analytics-apply-period').click();
    assert.equal((await page.getByTestId('ledger-analytics-net').textContent()).trim(), '−120 000 so‘m');
    await page.getByTestId('ledger-metric-income').click();
    await page.getByText('Bu davrda kirim yo‘q', {exact: true}).waitFor({state: 'visible'});
    await snap(page, size, 'custom-empty-income');
    await noOverflow(page, name + ' custom');

    // All restores full-session calculations; new expense updates report only.
    await page.getByTestId('ledger-analytics-period-trigger').click();
    await page.getByRole('button', {name: 'Tahlil davri: Barchasi'}).click();
    await page.getByRole('tab', {name: 'Bosh sahifa'}).click();
    await page.getByTestId('living-ledger-add-expense').click();
    await page.getByTestId('ledger-editor-amount').fill('100000');
    await page.getByTestId('ledger-editor-save').click();
    await page.getByRole('tab', {name: 'Tahlil'}).click();
    assert.equal((await page.getByTestId('ledger-analytics-net').textContent()).trim(), '2 641 000 so‘m');
    await page.getByText('359 000 so‘m', {exact: true}).first().waitFor({state: 'visible'});
    await page.getByText('3 359 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await snap(page, size, 'after-add');
    await page.getByRole('tab', {name: 'Bosh sahifa'}).click();
    await page.getByText('145 000', {exact: true}).waitFor({state: 'visible'});
    await page.getByText('3 840 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await noOverflow(page, name + ' back home');
    assert.deepEqual(runtimeErrors, [], 'Browser must not throw: ' + runtimeErrors.join('; '));
    console.log('PASS ' + name + ': KPI, chart, custom range, empty state, Add and demo invariant');
  } catch (error) {
    try {await snap(page, size, 'failure');} catch (_) {}
    throw Error(name + ': ' + String(error) +
      (runtimeErrors.length ? '\nBrowser errors: ' + runtimeErrors.join('\n') : ''));
  } finally {
    await context.close();
  }
}
(async () => {
  await serverReady();
  const browser = await chromium.launch({headless: true, args: ['--no-sandbox']});
  try {
    for (const size of SIZES) await verify(browser, size);
  } finally {
    await browser.close();
  }
  console.log('All Living Ledger Analytics responsive cases passed.');
})().catch(error => {console.error(error); process.exitCode = 1;});
