const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function screen(relativePath) {
  return fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
}

const transactions = screen('src/screens/TransactionsScreen.tsx');
const dashboard = screen('src/screens/DashboardScreen.tsx');

// Source-level contract. These checks complement, but do not replace,
// React Native Web/mobile screenshot and interaction smoke testing.
assert.match(transactions, /<ScreenHeader\b/, 'Transactions should use DS ScreenHeader');
assert.match(transactions, /<ChoiceChip\b/, 'Transaction filters should use DS ChoiceChip');
assert.match(transactions, /<View style=\{styles\.actionArea\}>/, 'Transactions CTA requires reserved bottom layout');
assert.doesNotMatch(transactions, /fab:\s*\{position:\s*'absolute'/, 'Add CTA cannot overlay transaction rows');
assert.match(transactions, /backgroundColor:\s*'transparent'/, 'CTA rail must remain transparent');
assert.match(transactions, /accessibilityLabel="Yangi operatsiya qo‘shish"/, 'Add CTA must have a screen-reader label');
assert.match(transactions, /paddingBottom: 32/, 'ScrollView should not retain large fake FAB padding');

assert.match(dashboard, /<SurfaceCard\b/g, 'Dashboard must use shared surface cards');
assert.ok((dashboard.match(/<SectionHeader\b/g) || []).length >= 2, 'Dashboard sections need shared headers');
assert.match(dashboard, /Mustaqil demo grafik/, 'Dashboard static graph must be clearly labeled as separate demo data');
assert.match(dashboard, /Balans va oylik grafik mustaqil demo qiymatlar/, 'Dashboard disclaimers should distinguish static demo figures');

console.log('UI integration source contracts passed. Rendered mobile QA remains manual.');
