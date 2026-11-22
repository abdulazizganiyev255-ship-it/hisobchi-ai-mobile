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

process.stdout.write('Transactions model tests passed.\n');
