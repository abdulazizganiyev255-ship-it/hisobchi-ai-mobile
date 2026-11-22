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

const editor = screen('src/screens/TransactionEditorScreen.tsx');
assert.match(editor, /<FormHeader\b/, 'Form must use shared FormHeader');
assert.match(editor, /<ChoiceChip\b/, 'Income/expense selector must use DS ChoiceChip');
assert.match(editor, /<SurfaceCard tone="light"/, 'Amount must use shared light card');
assert.match(editor, /validateDraft\(draft\)/, 'Save must retain model validation');
assert.match(editor, /onSave\(draft\)/, 'Valid saves must preserve callback');
assert.match(editor, /onPress=\{onDelete\}/, 'Delete confirmation must preserve deletion callback');
assert.match(editor, /onPress=\{\(\) => change\('occurredOn', todayLocal\(\)\)\}/, 'Today shortcut must set local date');
assert.match(editor, /accessibilityLiveRegion="polite"/, 'Form errors must be announced');

const profile = screen('src/screens/OtherScreens.tsx');
const app = screen('App.tsx');
const actionRow = screen('src/components/ds/ActionRow.tsx');

assert.match(profile, /<ScreenHeader\b/, 'Profile must use shared ScreenHeader');
assert.ok((profile.match(/<SurfaceCard\b/g) || []).length >= 3, 'Profile must use shared card surfaces');
assert.ok((profile.match(/<ActionRow\b/g) || []).length >= 2, 'Profile navigation must use shared ActionRow');
assert.match(profile, /<SectionHeader\b/, 'Profile sections must use DS SectionHeader');
assert.match(profile, /setConfirmReset\(true\)/, 'Reset must require explicit confirmation');
assert.match(profile, /onResetDemo\(\)/, 'Confirmed reset must invoke the real app callback');
assert.match(profile, /accessibilityLabel="Demo yozuvlarini tiklashni tasdiqlash"/, 'Reset confirm must be screen-reader labeled');
assert.match(profile, /Hisobga kirilmagan/, 'Demo must not pretend auth is available');
assert.match(profile, /Mavjud emas/, 'Demo must not pretend remote saving exists');

assert.match(actionRow, /accessibilityRole="button"/, 'Profile navigation actions must be interactive');
assert.match(actionRow, /minHeight: 58/, 'Navigation action touch target must be at least 44dp');
assert.match(app, /transactionCount=\{transactions.length\}/, 'Profile count must reflect session transactions');
assert.match(app, /onOpenTransactions=\{\(\) => setTab\('transactions'\)\}/, 'Profile operations link must navigate');
assert.match(app, /onOpenAnalytics=\{\(\) => setTab\('analytics'\)\}/, 'Profile analytics link must navigate');
assert.match(app, /setTransactions\(\[...demo.transactions\]\)/, 'Profile reset must restore demo transactions');

const onboarding = screen('src/screens/OnboardingScreen.tsx');
assert.match(onboarding, /const STEPS: readonly Step\[\]/, 'Guide uses a typed static step model');
assert.match(onboarding, /setIndex\(previous => Math.min/, 'Guide Next must advance within bounds');
assert.match(onboarding, /setIndex\(previous => Math.max/, 'Guide Back must stay within bounds');
assert.match(onboarding, /onExit\(\)/, 'Guide completion must return to the app');
assert.match(onboarding, /accessibilityLabel="Qo‘llanmadan chiqish"/, 'Guide must have an accessible exit');
assert.match(onboarding, /accessibilityLabel=\{isLast \? 'Qo‘llanmani tugatish' : 'Keyingi qadam'\}/, 'Guide completion CTA must be labeled');
assert.match(onboarding, /minHeight: 52/, 'Primary guide action has >=44dp tap target');
assert.match(profile, /onOpenOnboarding/, 'Profile must expose guide open callback');
assert.match(profile, /Ilova bo‘yicha qo‘llanma/, 'Guide entry has visible label');
assert.match(app, /<OnboardingScreen onExit=\{\(\) => setShowOnboarding\(false\)\}/, 'App must render dismissible guide');
assert.match(app, /!showOnboarding/, 'Bottom navigation must be hidden during guide');
assert.match(app, /onOpenOnboarding=\{\(\) => setShowOnboarding\(true\)\}/, 'Profile guide entry must navigate');
assert.doesNotMatch(onboarding, /setTransactions\(/, 'Guide must not modify transaction state');

console.log('UI, transaction form, profile and onboarding source contracts passed. Mobile QA remains manual.');
