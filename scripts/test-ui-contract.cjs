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
assert.doesNotMatch(transactions, /styles\.actionArea|actionDock:/, 'No full-width background dock behind Add CTA');
assert.match(transactions, /fab:\s*\{\s*position:\s*'absolute'/, 'Add CTA should float without an action rail');
assert.match(transactions, /accessibilityLabel="Yangi operatsiya qo‘shish"/, 'Add CTA must have a screen-reader label');
assert.match(transactions, /listViewport: \{flex: 1\}/, 'List must fill the viewport without a 64dp strip');
assert.doesNotMatch(transactions, /listViewport:\s*\{[^}]*marginBottom:/, 'Never recreate a full-width reserved FAB rail');
assert.match(transactions, /paddingBottom: 116/, 'List needs scrollable bottom clearance past the floating FAB');
assert.match(transactions, /testID="transactions-scroll"/, 'E2E must be able to check the actual list viewport');

assert.match(dashboard, /<SurfaceCard\b/g, 'Dashboard must use shared surface cards');
assert.ok((dashboard.match(/<SectionHeader\b/g) || []).length >= 2, 'Dashboard sections need shared headers');
assert.match(dashboard, /Mustaqil demo grafik/, 'Dashboard static graph must be clearly labeled as separate demo data');
assert.match(dashboard, /Balans va oylik grafik mustaqil demo qiymatlar/, 'Dashboard disclaimers should distinguish static demo figures');
const dashboardChart = screen('src/components/ExpenseChart.tsx');
assert.match(dashboard, /<ExpenseChart values=\{month\.chart\} compact\s*\/>/, 'Only Dashboard should request compact chart');
assert.match(dashboardChart, /compact = false/, 'Chart compact mode must be opt-in so existing usage is preserved');
assert.match(dashboardChart, /height=\{compact \? 126 : 143\}/, 'Compact dashboard chart must use a shorter physical height');
assert.match(dashboard, /balanceCard:\{minHeight:148/, 'Balance card density follows dashboard visual spec');
assert.match(dashboard, /safeCard:\{borderRadius:radius\.lg,padding:14,minHeight:98/, 'Safe-to-Spend card density follows visual spec');
assert.match(dashboard, /content:\{paddingHorizontal:layout\.screenGutter/, 'Dashboard spacing must use shared Design System gutter');
assert.match(dashboard, /demoText:\{fontSize:typography\.size\.micro/, 'Demo disclosure must not use a sub-10dp font');
assert.match(dashboard, /legendText:\{fontSize:typography\.size\.caption/, 'Demo chart disclosure should remain readable');
assert.match(dashboard, /eyeBtn:\{minWidth:44,minHeight:44/, 'Balance visibility button requires a 44dp target');
assert.match(dashboard, /Mustaqil demo grafik/, 'Compact dashboard chart must retain honest demo labeling');
assert.match(dashboard, /const \[periodOpen,setPeriodOpen\] = useState\(false\)/, 'Monthly picker requires explicit open state');
assert.match(dashboard, /accessibilityState=\{\{expanded: periodOpen\}\}/, 'Monthly period trigger must expose expanded state');
assert.match(dashboard, /\(\['current', 'previous'\] as const\)\.map/, 'Monthly dropdown limited to two supported demo months');
assert.match(dashboard, /setPeriod\(key\);\s*setPeriodOpen\(false\)/, 'Period selection must update model and close dropdown');
assert.match(dashboard, /accessibilityLabel=\{'Oylik xarajat: ' \+ demo\.months\[key\]\.label\}/, 'Monthly options require explicit accessible labels');


const analyticsUI = screen('src/screens/AnalyticsScreen.tsx');
assert.match(analyticsUI, /<PeriodPicker\b/, 'Analytics must retain the compact period dropdown');
assert.match(analyticsUI, /onChange=\{selectPeriod\}/, 'Analytics period selection must go through custom logic');
assert.match(analyticsUI, /next === 'custom'/, 'Choosing custom period must open a range editor');
assert.match(analyticsUI, /validateCustomRange\(customStart, customEnd, todayLocal\(\)\)/, 'Range must be validated before apply');
assert.match(analyticsUI, /setAppliedRange\(\{start: customStart, end: customEnd\}\)/, 'Validated range must update analytics');
assert.match(analyticsUI, /setPeriod\('custom'\)/, 'Custom period must be activated only on apply');
assert.match(analyticsUI, /setSelectedDay\(null\)/, 'Changing the period must clear selected chart day');
assert.match(analyticsUI, /<DateCalendar\b/, 'Analytics date fields must use a reusable calendar');
assert.match(analyticsUI, /accessibilityLabel="Tanlangan sana oralig‘ini tahlilga qo‘llash"/, 'Custom apply button needs an accessibility label');
assert.match(analyticsUI, /accessibilityLiveRegion="polite"/, 'Invalid ranges require accessible errors');

const editor = screen('src/screens/TransactionEditorScreen.tsx');
assert.match(editor, /<FormHeader\b/, 'Form must use shared FormHeader');
assert.match(editor, /<DateCalendar\b/, 'Editor must render a calendar date picker');
assert.match(editor, /setCalendarOpen\(true\)/, 'Date field must open the calendar');
assert.match(editor, /change\('occurredOn', iso\)/, 'Chosen date must update the transaction draft');
assert.match(editor, /setCalendarOpen\(false\)/, 'Calendar can be dismissed');
assert.doesNotMatch(editor, /onChangeText=\{value => change\('occurredOn', value\)\}/, 'Date should no longer require typing');

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
assert.match(app, /BackHandler\.addEventListener\('hardwareBackPress'/, 'Native Android Back handling must be installed');
assert.match(app, /if \(showOnboarding\) \{\s*setShowOnboarding\(false\);\s*return true;/, 'Android Back should leave optional onboarding first');
assert.match(app, /if \(editor !== null\) \{\s*setEditor\(null\);\s*return true;/, 'Android Back should close a transaction editor');
assert.match(app, /if \(tab !== 'home'\) \{\s*setTab\('home'\);\s*return true;/, 'Android Back should go Home from tabs');
assert.match(app, /return \(\) => listener\.remove\(\)/, 'Android hardware Back listener must be cleaned up');

const onboarding = screen('src/screens/OnboardingScreen.tsx');
assert.match(onboarding, /const STEPS: readonly Step\[\]/, 'Guide uses a typed static step model');
assert.match(onboarding, /setIndex\(Math.max\(0, Math.min\(nextIndex/, 'Guide must clamp all step changes');
assert.match(onboarding, /goToStep\(index - 1\)/, 'Guide Back must use bounded navigation');
assert.match(onboarding, /onFinish\(\)/, 'Guide completion must invoke distinct Home action');
assert.match(onboarding, /onPress=\{onExit\}/, 'Guide close must stay separate from completion');
assert.match(onboarding, /scrollRef.current\?\.scrollTo/, 'Guide step changes must reset scroll to top');
assert.match(onboarding, /accessibilityLabel="Qo‘llanmadan chiqish"/, 'Guide must have an accessible exit');
assert.match(onboarding, /accessibilityLabel=\{isLast \? 'Qo‘llanmani tugatib bosh sahifani ochish' : 'Keyingi qadam'\}/, 'Guide completion CTA must describe Home destination');
assert.match(onboarding, /minHeight: 52/, 'Primary guide action has >=44dp tap target');
assert.match(profile, /onOpenOnboarding/, 'Profile must expose guide open callback');
assert.match(profile, /Ilova bo‘yicha qo‘llanma/, 'Guide entry has visible label');
assert.match(app, /<OnboardingScreen\s+onExit=\{\(\) => setShowOnboarding\(false\)\}/, 'App must render dismissible guide');
assert.match(app, /onFinish=\{\(\) => \{\s*setTab\('home'\);\s*setShowOnboarding\(false\);/, 'Guide finish must open Home');
assert.match(app, /!showOnboarding/, 'Bottom navigation must be hidden during guide');
assert.match(app, /onOpenOnboarding=\{\(\) => setShowOnboarding\(true\)\}/, 'Profile guide entry must navigate');
assert.doesNotMatch(onboarding, /setTransactions\(/, 'Guide must not modify transaction state');

assert.match(transactions, /periodChip: \{minHeight: layout.touchTarget/, 'Date filter chips need >=44dp');
assert.match(transactions, /rangeApply: \{[^\n]*minHeight: layout.touchTarget/, 'Date range apply needs >=44dp');
assert.match(transactions, /resetButton: \{minHeight: layout.touchTarget/, 'Reset filters action needs >=44dp');
assert.match(transactions, /accessibilityLiveRegion="polite"/, 'Date range errors announced accessibly');

const rangeFields = screen('src/components/ds/DateRangeFields.tsx');
const emptyState = screen('src/components/ds/EmptyState.tsx');

assert.match(transactions, /<DateRangeFields\b/, 'Transactions custom range must reuse DS date fields');
assert.match(transactions, /<DateCalendar\b/, 'Transactions custom range must open the date calendar');
assert.match(transactions, /setCalendarTarget\('start'\)/, 'Start date can be opened');
assert.match(transactions, /setCalendarTarget\('end'\)/, 'End date can be opened');
assert.match(transactions, /setDateError\(null\)/, 'Calendar selection clears old range error');
assert.doesNotMatch(transactions, /onChangeText=\{setCustomStart\}|onChangeText=\{setCustomEnd\}/, 'Custom dates must not require typing');
assert.match(analyticsUI, /<DateRangeFields\b/, 'Analytics must reuse DS date fields');
assert.match(rangeFields, /accessibilityRole="button"/, 'Date range triggers must be accessible');
assert.match(rangeFields, /minHeight: layout.touchTarget \+ 2/, 'Date range must have >=44dp tap target');

assert.match(transactions, /<EmptyState\b/, 'Transactions should use shared actionable empty state');
assert.match(transactions, /onAction=\{hasFilters \? resetFilters : onAdd\}/, 'Empty action must reset filters or add a real transaction');
assert.match(dashboard, /<EmptyState tone="light"/, 'Dashboard must show shared light empty state');
assert.match(analyticsUI, /<EmptyState\b/, 'Analytics chart and categories must show shared empty state');
assert.match(emptyState, /onAction \? \(/, 'Empty state must not show an inert action');
assert.match(emptyState, /minHeight: layout.touchTarget/, 'Empty action must be tappable');

console.log('UI, transaction form, profile, onboarding and tap-target and polish contracts passed. Mobile QA remains manual.');
