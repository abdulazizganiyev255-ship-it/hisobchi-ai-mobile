const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function transpile(relativePath, requireLocal) {
  const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022},
  }).outputText;
  const sandbox = {
    module: {exports: {}},
    require: requireLocal || (() => {throw new Error('Unexpected runtime import');}),
  };
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(compiled, sandbox, {filename: relativePath});
  return sandbox.module.exports;
}

const periods = transpile('src/data/periods.ts');
const analytics = transpile('src/data/analytics.ts', name => {
  if (name === './periods') return periods;
  throw new Error('Unexpected dependency: ' + name);
});

const t = (id, occurredOn, amount, title) => ({
  id, occurredOn, amount, title, category: title,
  date: occurredOn, icon: 'wallet', iconBg: '#eee', iconColor: '#444',
});
const sample = [
  t('1','2026-11-19',-120000,'Salomatlik'),
  t('2','2026-11-20', 3000000,'Ish haqi'),
  t('3','2026-11-21',-42000,'Kafe'),
  t('4','2026-11-22',-85000,'Oziq-ovqat'),
  t('5','2026-11-22',-12000,'Transport'),
];

const all = analytics.calculateAnalytics(sample, 'all', '2026-11-22');
assert.equal(all.income, 3000000);
assert.equal(all.expense, 259000);
assert.equal(all.net, 2741000);
assert.equal(all.transactionsCount, 5);
assert.equal(all.expensesCount, 4);
assert.equal(all.categories.length, 4);
assert.equal(all.categories[0].name, 'Salomatlik');
assert.equal(all.categories[0].amount, 120000);
assert.equal(all.days.length, 4, 'Only recorded days should be included');
assert.equal(all.chartTruncated, false);
assert.equal(analytics.formatDayCompact('2026-11-22'), '22.11');
assert.equal(analytics.analyticsRangeLabel(all), 'Barcha qayd etilgan sanalar');

const week = analytics.calculateAnalytics(sample, 'week', '2026-11-22');
assert.equal(week.start, '2026-11-16');
assert.equal(week.end, '2026-11-22');
assert.equal(week.income, 3000000);
assert.equal(week.expense, 259000);

const month = analytics.calculateAnalytics(sample, 'month', '2026-11-22');
assert.equal(month.start, '2026-11-01');
assert.equal(month.expense, 259000);

const old = t('0', '2026-10-01', -800000, 'Oziq-ovqat');
assert.equal(analytics.calculateAnalytics([...sample, old], 'month', '2026-11-22').expense, 259000);
assert.equal(analytics.calculateAnalytics([...sample, old], 'all', '2026-11-22').expense, 1059000);

const rolling = analytics.calculateAnalytics([...sample, t('old', '2026-10-23', -10000, 'Kafe')], 'last30', '2026-11-22');
assert.equal(rolling.start, '2026-10-24');
assert.equal(rolling.expense, 259000, 'Outside-window transaction should not count');

const empty = analytics.calculateAnalytics(sample, 'week', '2027-05-12');
assert.equal(empty.transactionsCount, 0);
assert.equal(empty.days.length, 0);
assert.equal(empty.net, 0);
assert.equal(empty.categories.length, 0);

const eightDays = Array.from({length: 8}, (_, i) =>
  t('d'+i, '2026-11-' + String(i + 10).padStart(2, '0'), -1000, 'Kafe'),
);
const truncated = analytics.calculateAnalytics(eightDays, 'all', '2026-11-22');
assert.equal(truncated.days.length, 7);
assert.equal(truncated.days[0].date, '2026-11-11');
assert.equal(truncated.chartTruncated, true);

console.log('Analytics aggregation tests passed.');
