// Cross-module integration regression for the demo app's finance data flow.
// This is model-level verification. It does NOT run Expo UI, browser or native device tests.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function load(relativePath, dependencies = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
  }).outputText;
  const sandbox = {
    module: {exports: {}},
    require: name => {
      if (Object.prototype.hasOwnProperty.call(dependencies, name)) return dependencies[name];
      throw new Error('Undeclared integration dependency ' + name + ' in ' + relativePath);
    },
  };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(transpiled, sandbox, {filename: relativePath});
  return sandbox.module.exports;
}

const fixture = load('src/data/demo.ts');
const model = load('src/data/transactions.ts');
const periods = load('src/data/periods.ts');
const analytics = load('src/data/analytics.ts', {'./periods': periods});

const baseline = fixture.demo.transactions.map(item => ({...item}));
const day = '2026-11-22';
const current = items => analytics.calculateAnalytics(items, 'all', day);
const baselineTotals = current(baseline);

assert.equal(baseline.length, 5);
assert.equal(baselineTotals.transactionsCount, 5);
assert.equal(baselineTotals.income, 3_000_000);
assert.equal(baselineTotals.expense, 259_000);
assert.equal(baselineTotals.turnover, 3_259_000);
assert.equal(baselineTotals.net, 2_741_000);

// Create an expense in the transaction form; verify Transactions + Analytics agree.
const draft = {
  kind: 'expense', amountText: '100 000', category: 'Oziq-ovqat',
  occurredOn: '2026-11-21', note: 'integratsiya testi',
};
assert.equal(Object.keys(model.validateDraft(draft)).length, 0);
const created = model.transactionFromDraft(draft, 'session-1000');
assert.equal(created.amount, -100_000);
const afterCreate = [created, ...baseline];
assert.equal(model.filterAndSortTransactions(afterCreate, 'expense', '').length, 5);
assert.equal(model.filterAndSortTransactions(afterCreate, 'income', '').length, 1);
assert.equal(model.filterAndSortTransactions(afterCreate, 'expense', 'oziq').length, 2);
assert.equal(periods.sumTransactionTotals(afterCreate).expense, 359_000);
const createdTotals = current(afterCreate);
assert.equal(createdTotals.transactionsCount, 6);
assert.equal(createdTotals.expense, 359_000);
assert.equal(createdTotals.income, 3_000_000);
assert.equal(createdTotals.net, 2_641_000);
assert.equal(createdTotals.turnover, 3_359_000);

// Same created transaction must appear in an inclusive calendar range.
const customRange = {start: '2026-11-20', end: '2026-11-21'};
const customTotals = analytics.calculateAnalytics(afterCreate, 'custom', day, customRange);
assert.equal(customTotals.transactionsCount, 3);
assert.equal(customTotals.income, 3_000_000);
assert.equal(customTotals.expense, 142_000);
assert.equal(customTotals.net, 2_858_000);
assert.equal(customTotals.turnover, 3_142_000);
assert.equal(customTotals.days.length, 2);
assert.equal(customTotals.days.find(x => x.date === '2026-11-21').expense, 142_000);
assert.equal(customTotals.categories.reduce((s, c) => s + c.amount, 0), customTotals.expense);

// Edit, including date change: the old day's chart must lose the edited amount.
const editedDraft = {...draft, amountText: '50 000', occurredOn: '2026-11-22'};
const edited = model.transactionFromDraft(editedDraft, created.id, created);
const afterEdit = afterCreate.map(item => item.id === edited.id ? edited : item);
assert.equal(afterEdit.length, afterCreate.length);
const editedTotals = current(afterEdit);
assert.equal(editedTotals.expense, 309_000);
assert.equal(editedTotals.turnover, 3_309_000);
assert.equal(editedTotals.net, 2_691_000);
assert.equal(editedTotals.days.find(x => x.date === '2026-11-21').expense, 42_000);
assert.equal(editedTotals.days.find(x => x.date === '2026-11-22').expense, 147_000);
const editedCustom = analytics.calculateAnalytics(afterEdit, 'custom', day, customRange);
assert.equal(editedCustom.expense, 42_000);
assert.equal(editedCustom.net, 2_958_000);

// Delete and reset: all financial model totals return to baseline.
const afterDelete = afterEdit.filter(item => item.id !== created.id);
assert.equal(afterDelete.length, 5);
assert.equal(current(afterDelete).expense, baselineTotals.expense);
assert.equal(current(afterDelete).net, baselineTotals.net);
const afterReset = fixture.demo.transactions.map(item => ({...item}));
assert.deepEqual(afterReset, baseline);
assert.equal(current(afterReset).turnover, baselineTotals.turnover);

// Invalid and empty custom ranges must never reuse all-transaction totals.
assert.throws(
  () => analytics.calculateAnalytics(baseline, 'custom', day, null),
  /Custom analytics range must be validated/,
);
assert.throws(
  () => analytics.calculateAnalytics(baseline, 'custom', day, {start: '2026-11-23', end: '2026-11-24'}),
  /Custom analytics range must be validated/,
);
const noEntries = analytics.calculateAnalytics(baseline, 'custom', day, {
  start: '2026-11-01', end: '2026-11-02',
});
assert.equal(noEntries.transactionsCount, 0);
assert.equal(noEntries.turnover, 0);
assert.equal(noEntries.net, 0);
assert.equal(noEntries.categories.length, 0);
assert.equal(noEntries.days.length, 0);

console.log('Cross-module demo finance lifecycle passed (create, edit, delete, reset, filters, custom range).');
