const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

const home = read('src/screens/LivingLedgerDashboardScreen.tsx');
const ribbon = read('src/components/finance/SculpturalRibbon.tsx');
const primitives = read('src/components/living/LedgerPrimitives.tsx');
const app = read('App.tsx');
assert.match(home, /testID="plum-home-balance-card"/, 'New plum balance composition must be mounted');
assert.match(home, /<SculpturalRibbon\/>/, 'Hero must include signature ribbon');
assert.match(home, /DEMO MUHIT — HAQIQIY HISOB EMAS/, 'Demo provenance must remain visible');
assert.match(home, /SourceTag label="DEMO · hisoblanmagan" tone="plum"/);
assert.match(home, /testID="living-ledger-safe-explainer"/, 'Explanation action retained');
assert.match(home, /testID="living-ledger-add-expense"/, 'Existing add flow retained');
assert.match(home, /onPress={onAdd}/, 'Add CTA wired to existing editor');
assert.match(home, /onPress={onOpenTransactions}/, 'Recent list navigation retained');
assert.match(home, /const month = demo\.months\[period\]/, 'Sample chart independent');
assert.match(home, /filterAndSortTransactions\(transactions, 'all', ''\)/,
  'Recent rows still use local session data');
assert.match(home, /<LedgerMiniBars[\s\S]*tone="plum"/, 'Chart uses plum visual system');
assert.match(home, /<LedgerTransactionRow key={item\.id} item={item} tone="plum"/,
  'Activity rows use plum visual system');
assert.match(home, /onRequestClose={closeExplainer}/, 'Android Back closes explanation');
assert.match(home, /Sessiya tugasa yoki ilova qayta ishga tushsa/,
  'Persistence disclaimer retained');
assert.match(ribbon, /pointerEvents="none"/, 'Decoration must not steal touches');
assert.match(ribbon, /accessible={false}/, 'Decorative SVG is not a screen reader landmark');
assert.match(primitives, /tone === 'plum'/, 'Theme changes are scoped by prop');
assert.match(app, /plumHome && styles\.plumNav/, 'Home tab shell has matching plum tokens');
assert.match(app, /<LivingLedgerDashboardScreen/, 'App still routes to actual Home');
assert.doesNotMatch(home, /bankka ulandi|serverga saqlandi/i, 'No fake persistence promise');
console.log('PASS Plum Home structure, scoped design, unchanged demo truth and existing actions');
