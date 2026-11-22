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
assert.equal(all.turnover, 3259000, 'Turnover = income + expense; not net');
assert.equal(all.days.find(day => day.date === '2026-11-20').income, 3000000);
assert.equal(all.days.find(day => day.date === '2026-11-20').expense, 0);
assert.equal(all.days.find(day => day.date === '2026-11-20').turnover, 3000000);
assert.equal(all.days.find(day => day.date === '2026-11-22').expense, 97000);
assert.equal(all.days.find(day => day.date === '2026-11-22').turnover, 97000);
assert.equal(all.days.reduce((total, day) => total + day.turnover, 0), all.turnover);
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
assert.equal(week.turnover, 3259000);

const month = analytics.calculateAnalytics(sample, 'month', '2026-11-22');
assert.equal(month.start, '2026-11-01');
assert.equal(month.expense, 259000);
assert.equal(month.turnover, 3259000);

const old = t('0', '2026-10-01', -800000, 'Oziq-ovqat');
assert.equal(analytics.calculateAnalytics([...sample, old], 'month', '2026-11-22').expense, 259000);
assert.equal(analytics.calculateAnalytics([...sample, old], 'all', '2026-11-22').expense, 1059000);

const rolling = analytics.calculateAnalytics([...sample, t('old', '2026-10-23', -10000, 'Kafe')], 'last30', '2026-11-22');
assert.equal(rolling.start, '2026-10-24');
assert.equal(rolling.expense, 259000, 'Outside-window transaction should not count');

// Custom date range is inclusive at both ends, and reuses the exact aggregation pipeline.
const custom = analytics.calculateAnalytics(sample, 'custom', '2026-11-22', {
  start: '2026-11-20', end: '2026-11-21',
});
assert.equal(custom.period, 'custom');
assert.equal(custom.start, '2026-11-20');
assert.equal(custom.end, '2026-11-21');
assert.equal(custom.transactionsCount, 2);
assert.equal(custom.income, 3000000);
assert.equal(custom.expense, 42000);
assert.equal(custom.turnover, 3042000);
assert.equal(custom.net, 2958000);
assert.equal(custom.days.length, 2);
assert.equal(custom.categories[0].name, 'Kafe');
assert.equal(analytics.analyticsRangeLabel(custom), '20.11.26 — 21.11.26');

const customOneDay = analytics.calculateAnalytics(sample, 'custom', '2026-11-22', {
  start: '2026-11-22', end: '2026-11-22',
});
assert.equal(customOneDay.income, 0);
assert.equal(customOneDay.expense, 97000);
assert.equal(customOneDay.transactionsCount, 2);

const customEmpty = analytics.calculateAnalytics(sample, 'custom', '2026-11-22', {
  start: '2026-11-01', end: '2026-11-02',
});
assert.equal(customEmpty.expense, 0);
assert.equal(customEmpty.income, 0);
assert.equal(customEmpty.days.length, 0);
assert.equal(customEmpty.categories.length, 0);

assert.throws(
  () => analytics.calculateAnalytics(sample, 'custom', '2026-11-22'),
  /Custom analytics range must be validated/,
  'Custom without a confirmed range cannot silently show all transactions',
);
assert.throws(
  () => analytics.calculateAnalytics(sample, 'custom', '2026-11-22', {
    start: '2026-11-23', end: '2026-11-23',
  }),
  /Custom analytics range must be validated/,
);
assert.throws(
  () => analytics.calculateAnalytics(sample, 'custom', '2026-11-22', {
    start: '2026-11-22', end: '2026-11-20',
  }),
  /Custom analytics range must be validated/,
);
assert.ok(analytics.ANALYTICS_PERIODS.some(option => option.key === 'custom'));

const empty = analytics.calculateAnalytics(sample, 'week', '2027-05-12');
assert.equal(empty.transactionsCount, 0);
assert.equal(empty.days.length, 0);
assert.equal(empty.net, 0);
assert.equal(empty.turnover, 0);
assert.equal(empty.categories.length, 0);

const eightDays = Array.from({length: 8}, (_, i) =>
  t('d'+i, '2026-11-' + String(i + 10).padStart(2, '0'), -1000, 'Kafe'),
);
const truncated = analytics.calculateAnalytics(eightDays, 'all', '2026-11-22');
assert.equal(truncated.days.length, 7);
assert.equal(truncated.days[0].date, '2026-11-11');
assert.equal(truncated.chartTruncated, true);
assert.equal(truncated.turnover, 8000, 'Turnover counts whole selected period, not only charted days');

const withMoreExpenses = analytics.calculateAnalytics(
  [...sample, t('6', '2026-11-22', -100000, 'Kafe')],
  'all', '2026-11-22',
);
assert.equal(withMoreExpenses.turnover, 3359000);
assert.equal(withMoreExpenses.expense, 359000);
assert.equal(withMoreExpenses.net, 2641000);
assert.equal(withMoreExpenses.days.find(day => day.date === '2026-11-22').turnover, 197000);

const incomeOnly = analytics.calculateAnalytics(
  [t('only', '2026-11-20', 500000, 'Ish haqi')], 'all', '2026-11-22',
);
assert.equal(incomeOnly.turnover, 500000);
assert.equal(incomeOnly.net, 500000);
assert.equal(incomeOnly.expense, 0);
assert.equal(incomeOnly.days[0].expense, 0);

console.log('Analytics aggregation tests passed.');
