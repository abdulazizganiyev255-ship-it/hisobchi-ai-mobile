// Run with Node.js: npm run test:transactions
// The transaction model uses only type-only imports, so transpile it in memory.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/data/transactions.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
}).outputText;

const sandbox = {module: {exports: {}}};
sandbox.exports = sandbox.module.exports;
vm.runInNewContext(compiled, sandbox, {filename: 'transactions.js'});
const m = sandbox.module.exports;

assert.equal(m.parseUZS('1 250 000'), 1250000);
assert.equal(m.parseUZS('10.5'), null);
assert.equal(m.parseUZS('-42'), null);
assert.equal(m.parseUZS('0'), null);
assert.equal(m.parseUZS('999999999999'), 999999999999);
assert.equal(m.parseUZS('1000000000000'), null);
assert.equal(m.isValidISODate('2024-02-29'), true);
assert.equal(m.isValidISODate('2025-02-29'), false);
assert.equal(m.isValidISODate('2026-11-31'), false);
assert.equal(m.isValidISODate('2026-11-22'), true);
assert.equal(m.isValidISODate('2026/11/22'), false);

const valid = {kind: 'expense', amountText: '85 000', category: 'Oziq-ovqat', occurredOn: '2024-02-29', note: '  test  '};
assert.equal(Object.keys(m.validateDraft(valid)).length, 0);
assert.ok(m.validateDraft({...valid, amountText: '0'}).amountText);
assert.ok(m.validateDraft({...valid, category: 'Qalbaki'}).category);
assert.ok(m.validateDraft({...valid, occurredOn: '2025-02-29'}).occurredOn);
assert.ok(m.validateDraft({...valid, occurredOn: '2100-12-31'}).occurredOn);

const food = m.transactionFromDraft(valid, 'test1');
assert.equal(food.amount, -85000);
assert.equal(food.note, 'test');
assert.equal(food.occurredOn, '2024-02-29');
assert.equal(food.icon, 'cart');
const salary = m.transactionFromDraft({...valid, kind: 'income', category: 'Ish haqi', amountText: '3 000 000'}, 'test2');
assert.equal(salary.amount, 3000000);
const filtered = m.filterAndSortTransactions([food, salary], 'income', '');
assert.equal(filtered.length, 1);
assert.equal(filtered[0].id, 'test2');
assert.equal(m.filterAndSortTransactions([food, salary], 'expense', 'oziq')[0].id, 'test1');
assert.equal(m.filterAndSortTransactions([food, salary], 'all', 'NOT FOUND').length, 0);
assert.equal(m.displayDay('2024-02-29'), '29 fevral');


const periodSource = fs.readFileSync(path.join(__dirname, '../src/data/periods.ts'), 'utf8');
const periodCode = ts.transpileModule(periodSource, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
}).outputText;
const periodSandbox = {module: {exports: {}}};
periodSandbox.exports = periodSandbox.module.exports;
vm.runInNewContext(periodCode, periodSandbox, {filename: 'periods.js'});
const p = periodSandbox.module.exports;

function sameRange(actual, start, end) {
  assert.equal(actual.start, start);
  assert.equal(actual.end, end);
}
assert.equal(p.getPeriodRange('all', '2026-11-22'), null);
sameRange(p.getPeriodRange('week', '2026-11-22'), '2026-11-16', '2026-11-22');
sameRange(p.getPeriodRange('week', '2026-11-23'), '2026-11-23', '2026-11-23');
sameRange(p.getPeriodRange('week', '2027-01-03'), '2026-12-28', '2027-01-03');
sameRange(p.getPeriodRange('month', '2024-02-29'), '2024-02-01', '2024-02-29');
sameRange(p.getPeriodRange('last30', '2026-11-22'), '2026-10-24', '2026-11-22');
sameRange(p.getPeriodRange('last30', '2024-03-01'), '2024-02-01', '2024-03-01');
assert.equal(p.shiftCalendarDate('2024-03-01', -1), '2024-02-29');
assert.equal(p.validateCustomRange('2026-11-01', '2026-11-22', '2026-11-22'), null);
assert.ok(p.validateCustomRange('2026-11-31', '2026-11-22', '2026-11-22'));
assert.ok(p.validateCustomRange('2026-11-23', '2026-11-22', '2026-11-22'));
assert.ok(p.validateCustomRange('2026-11-01', '2026-11-23', '2026-11-22'));
assert.ok(p.validateCustomRange('2025-02-29', '2025-03-01', '2026-11-22'));
const dateRange = {start: '2026-11-20', end: '2026-11-22'};
const periodFixture = [
  {...food, id: 'first', occurredOn: '2026-11-19', amount: -5000},
  {...salary, id: 'second', occurredOn: '2026-11-20', amount: 3000000},
  {...food, id: 'third', occurredOn: '2026-11-22', amount: -85000},
  {...food, id: 'future', occurredOn: '2026-11-23', amount: -1000},
];
const covered = p.transactionsInPeriod(periodFixture, dateRange);
assert.equal(covered.length, 2);
assert.equal(p.withinPeriod('2026-11-20', dateRange), true);
assert.equal(p.withinPeriod('2026-11-22', dateRange), true);
assert.equal(p.withinPeriod('2026-11-23', dateRange), false);
const totals = p.sumTransactionTotals(covered);
assert.equal(totals.income, 3000000);
assert.equal(totals.expense, 85000);
const empty = p.sumTransactionTotals([]);
assert.equal(empty.income, 0);
assert.equal(empty.expense, 0);

process.stdout.write('Transactions + date-period model tests passed.\n');
