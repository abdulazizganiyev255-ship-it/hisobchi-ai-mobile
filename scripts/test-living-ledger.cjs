/**
 * Source contract + real token contrast for the in-progress Living Ledger pilot.
 * This supplements TypeScript, model-level integration tests and visual E2E;
 * passing it does NOT mean a production/native approval.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

function loadTokens(file) {
  const js = ts.transpileModule(read(file), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const sandbox = {module: {exports: {}}};
  sandbox.exports = sandbox.module.exports;
  vm.runInNewContext(js, sandbox, {filename: file});
  return sandbox.module.exports.ledger;
}

function brightness(hex) {
  assert.match(hex, /^#[0-9a-fA-F]{6}$/);
  const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map(n =>
    n <= 0.04045 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const values = [brightness(a), brightness(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
const c = loadTokens('src/theme/livingLedger.ts');
const pairs = [
  ['ink / paper text', c.ink, c.paper, 4.5],
  ['subtext / paper', c.subtext, c.paper, 4.5],
  ['badge text / badge', c.badgeText, c.badge, 4.5],
  ['CTA ink / coral', c.ink, c.coral, 4.5],
  ['white / dark', '#FFFFFF', c.dark, 4.5],
  ['sample bars / paper', c.barFaint, c.paper, 3.0],
];
for (const [label, foreground, background, minimum] of pairs) {
  const ratio = contrast(foreground, background);
  assert.ok(ratio >= minimum, label + ' contrast ' + ratio.toFixed(2) + ':1 < ' + minimum);
  console.log('PASS ' + label + ' contrast: ' + ratio.toFixed(2) + ':1');
}

const app = read('App.tsx');
const screen = read('src/screens/LivingLedgerDashboardScreen.tsx');
const primitives = read('src/components/living/LedgerPrimitives.tsx');

assert.match(app, /<LivingLedgerDashboardScreen/, 'New Home must be mounted');
assert.match(app, /onAdd=\{\(\) => setEditor\('new'\)\}/, 'Home Add must open actual editor');
assert.match(app, /ledgerShell \? 'dark' : 'light'/, 'Migrated screens need correct light status bar');
assert.match(screen, /<SourceTag label="DEMO · hisoblanmagan"/, 'SafeSpend must say not calculated');
assert.match(screen, /DEMO MUHIT — HAQIQIY HISOB EMAS/, 'Home must disclose demo mode');
assert.match(screen, /const month = demo\.months\[period\]/, 'Monthly display must use fixed demo fixture');
assert.match(screen, /\['current', 'previous'\] as const/, 'Home month selector has two options');
assert.match(screen, /<LedgerMiniBars/, 'Home chart uses accessible sample bars');
assert.match(screen, /filterAndSortTransactions\(transactions, 'all', ''\)/, 'Recent items read session transactions');
assert.match(primitives, /accessibilityRole="image"/, 'Bars require chart alternative');
assert.match(screen, /setExplanationOpen\(true\)/, 'Explanation action must be real');
assert.match(screen, /onRequestClose=\{closeExplainer\}/, 'Native Back must close explanation');
assert.match(screen, /testID="living-ledger-add-expense"/, 'Add is E2E testable');
assert.match(screen, /testID="living-ledger-period-total"/, 'Month total is E2E testable');
assert.match(screen, /Sessiya tugasa yoki ilova qayta ishga tushsa/, 'Persistence disclosure required');
assert.match(primitives, /item\.occurredOn\.slice\(8, 10\)/, 'Date must be derived from immutable ISO date');
assert.doesNotMatch(primitives, /\{item\.date\}/, 'Avoid stale hardcoded Bugun/Kecha fixtures');
assert.doesNotMatch(screen, /\bSupabase\b|\bbankka ulandi\b/i, 'No simulated backend claim');
console.log('PASS Living Ledger wiring, truth labels and semantics source contracts');


// D08 Ledger Transactions and Editor source contracts (runtime tests remain separate).
const history = read('src/screens/LedgerTransactionsScreen.tsx');
const editor = read('src/screens/LedgerTransactionEditorScreen.tsx');
const calendar = read('src/components/living/LedgerDateCalendar.tsx');
assert.match(app, /<LedgerTransactionsScreen/, 'Ledger history must be mounted');
assert.match(app, /<LedgerTransactionEditorScreen/, 'Ledger editor must be mounted');
assert.match(app, /ledgerShell = !showOnboarding/, 'Home, history and editor use light shell');
assert.match(history, /sumTransactionTotals\(visible\)/,
  'Displayed history totals must reflect the complete active filters');
assert.match(history, /validateCustomRange\(customStart, customEnd, today\)/,
  'Custom transaction range must validate before applying');
assert.match(history, /testID="ledger-transactions-add"/, 'Add action must be E2E accessible');
assert.doesNotMatch(history, /fab:\s*\{/, 'No floating rail or FAB on Ledger history');
assert.match(history, /<LedgerDateCalendar/, 'History date-range picker uses themed calendar');
assert.match(editor, /validateDraft\(draft\)/, 'Save uses original finance validation');
assert.match(editor, /onSave\(draft\)/, 'Editor writes via existing transaction state callback');
assert.match(editor, /onDelete/, 'Editor retains confirmed delete callback');
assert.match(editor, /<LedgerDateCalendar/, 'Editor date is selected using calendar');
assert.match(calendar, /onRequestClose=\{onCancel\}/, 'Calendar Android Back cancel required');
assert.match(calendar, /!cell\.enabled/, 'Future and invalid day selection stays disabled');
assert.match(calendar, /minHeight: 44/, 'Calendar day cells must meet 44dp design target');
console.log('PASS Ledger Transactions/Editor/Calendar component source contracts');
