/**
 * Expo Web responsive smoke test for the new Home pilot. This is a browser
 * interaction test, not an iOS/Android or accessibility screen-reader pass.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

const URL = process.env.SMOKE_URL || 'http://127.0.0.1:8090';
const SIZES = [
  {width: 320, height: 640},
  {width: 360, height: 800},
  {width: 393, height: 852},
];
const output = path.join(__dirname, '..', 'artifacts', 'living-ledger');
fs.mkdirSync(output, {recursive: true});
const sleep = t => new Promise(resolve => setTimeout(resolve, t));

async function ready() {
  for (let i = 0; i < 90; i++) {
    try {
      const response = await fetch(URL, {signal: AbortSignal.timeout(4000)});
      if (response.ok) return;
    } catch (_) {}
    await sleep(1500);
  }
  throw new Error('No Expo Web server at ' + URL);
}
async function snap(page, size, step) {
  await page.screenshot({
    path: path.join(output, size.width + 'x' + size.height + '-' + step + '.png'),
    animations: 'disabled',
  });
}
async function assertNoHorizontalOverflow(page, label) {
  const {width, body, document} = await page.evaluate(() => ({
    width: window.innerWidth,
    body: document.body.scrollWidth,
    document: document.documentElement.scrollWidth,
  }));
  assert.ok(body <= width + 2 && document <= width + 2,
    label + ' horizontal overflow ' + JSON.stringify({width, body, document}));
}

async function check(browser, size) {
  const context = await browser.newContext({
    viewport: size, isMobile: true, hasTouch: true, deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(14000);
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  const name = size.width + 'x' + size.height;
  try {
    await page.goto(URL, {waitUntil: 'domcontentloaded', timeout: 90000});
    await page.getByTestId('living-ledger-demo-notice').waitFor({state: 'visible', timeout: 30000});
    await page.getByText('145 000', {exact: true}).waitFor({state: 'visible'});
    await page.getByTestId('living-ledger-period-total').waitFor({state: 'visible'});
    const safetyTitle = await page.getByTestId('plum-home-safety-title').boundingBox();
    assert.ok(safetyTitle && safetyTitle.height <= 25,
      name + ' safety heading should remain one line on compact screens');
    assert.equal((await page.getByTestId('living-ledger-period-total').textContent()).trim(), '3 840 000 so‘m');
    await assertNoHorizontalOverflow(page, name + ' Home');
    const homeAdd = await page.getByTestId('living-ledger-add-expense').boundingBox();
    const homeNav = await page.getByRole('tab', {name: 'Bosh sahifa'}).boundingBox();
    assert.ok(homeAdd && homeNav, 'Home Add and bottom navigation must have geometry');
    assert.ok(homeAdd.y + homeAdd.height <= homeNav.y - 12,
      name + ' Home CTA must be fully visible with >=12px breathing room above navigation');
    await snap(page, size, 'initial-home');

    // Date selector: exactly the two seeded monthly options.
    await page.getByTestId('living-ledger-period-previous').click();
    await page.getByText('4 180 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await page.getByTestId('living-ledger-period-current').click();
    await page.getByText('3 840 000 so‘m', {exact: true}).waitFor({state: 'visible'});

    // Financial truth disclosure must be a working modal, not fake affordance.
    await page.getByTestId('living-ledger-safe-explainer').click();
    await page.getByText('Bu raqam nimani bildiradi?', {exact: true}).waitFor({state: 'visible'});
    await page.getByText(/haqiqiy daromad|real daromad/).waitFor({state: 'visible'});
    await snap(page, size, 'explanation');
    await page.getByTestId('living-ledger-explainer-close').click();
    await page.getByText('Bu raqam nimani bildiradi?', {exact: true}).waitFor({state: 'hidden'});

    await page.getByTestId('living-ledger-home-scroll').evaluate(element => {element.scrollTop = 0;});
    await page.waitForTimeout(120);
    await snap(page, size, 'home');

    // Home action must open the existing validated editor, not a dummy click.
    await page.getByTestId('living-ledger-add-expense').click();
    await page.getByText('Yangi operatsiya', {exact: true}).waitFor({state: 'visible'});
    await page.getByRole('textbox', {name: 'Operatsiya summasi, so‘m'}).fill('100000');
    await page.getByRole('button', {name: 'Operatsiyani qo‘shish'}).click();
    await page.getByText('359 000 so‘m', {exact: true}).waitFor({state: 'visible'});

    await page.getByRole('tab', {name: 'Tahlil'}).click();
    await page.getByText('2 641 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await page.getByRole('tab', {name: 'Bosh sahifa'}).click();
    await page.getByText('145 000', {exact: true}).waitFor({state: 'visible'});
    await page.getByText('3 840 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await assertNoHorizontalOverflow(page, name + ' post-add Home');
    await snap(page, size, 'after-create');
    await page.getByText('−100 000 so‘m', {exact: true}).waitFor({state: 'visible'});
    await page.getByTestId('living-ledger-home-scroll').evaluate(element => {element.scrollTop = element.scrollHeight;});
    await page.waitForTimeout(120);
    await snap(page, size, 'after-create-activity');
    assert.deepEqual(errors, [], name + ' runtime errors: ' + errors.join('; '));
    console.log('PASS ' + name + ': Home, period, source explanation, Add, Analytics, demo invariants');
  } catch (err) {
    try {await snap(page, size, 'failure');} catch (_) {}
    throw new Error(name + ': ' + err + (errors.length ? '\nPage errors: ' + errors.join('\n') : ''));
  } finally {
    await context.close();
  }
}

(async () => {
  await ready();
  const browser = await chromium.launch({headless: true, args: ['--no-sandbox']});
  try {
    for (const size of SIZES) await check(browser, size);
    console.log('Living Ledger Web responsive scenarios passed at all three widths.');
  } finally {
    await browser.close();
  }
})().catch(err => {console.error(err); process.exitCode = 1;});
