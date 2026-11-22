import {useEffect, useRef, useState} from 'react';
import {BackHandler, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {AppIcon, type IconName} from './src/components/AppIcon';
import {demo, type Transaction} from './src/data/demo';
import {transactionFromDraft, type TransactionDraft} from './src/data/transactions';
import {LivingLedgerDashboardScreen} from './src/screens/LivingLedgerDashboardScreen';
import {OtherScreen, type Tab} from './src/screens/OtherScreens';
import {TransactionsScreen} from './src/screens/TransactionsScreen';
import {AnalyticsScreen} from './src/screens/AnalyticsScreen';
import {TransactionEditorScreen} from './src/screens/TransactionEditorScreen';
import {OnboardingScreen} from './src/screens/OnboardingScreen';
import {colors, radius} from './src/theme/tokens';
import {ledger} from './src/theme/livingLedger';

const tabs: {key: Tab; label: string; icon: IconName}[] = [
  {key: 'home', label: 'Bosh sahifa', icon: 'home'},
  {key: 'transactions', label: 'Operatsiyalar', icon: 'receipt'},
  {key: 'analytics', label: 'Tahlil', icon: 'chart'},
  {key: 'profile', label: 'Profil', icon: 'user'},
];

type EditorState = 'new' | Transaction | null;

function AppContent() {
  const [tab, setTab] = useState<Tab>('home');
  const [transactions, setTransactions] = useState<Transaction[]>(() => [...demo.transactions]);
  const [editor, setEditor] = useState<EditorState>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const nextId = useRef(1000);
  const homeTheme = tab === 'home' && editor === null && !showOnboarding;

  // Native Android Back should leave overlays before returning to Home.
  // React Native Modal handles its own Back press via onRequestClose.
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showOnboarding) {
        setShowOnboarding(false);
        return true;
      }
      if (editor !== null) {
        setEditor(null);
        return true;
      }
      if (tab !== 'home') {
        setTab('home');
        return true;
      }
      return false;
    });
    return () => listener.remove();
  }, [showOnboarding, editor, tab]);

  const save = (draft: TransactionDraft) => {
    if (editor === null) return;
    const original = editor === 'new' ? undefined : editor;
    const id = original?.id ?? 'session-' + String(nextId.current++);
    const item = transactionFromDraft(draft, id, original);
    setTransactions(previous =>
      original
        ? previous.map(row => row.id === id ? item : row)
        : [item, ...previous],
    );
    setEditor(null);
    setTab('transactions');
  };

  const remove = () => {
    if (editor === null || editor === 'new') return;
    const id = editor.id;
    setTransactions(previous => previous.filter(item => item.id !== id));
    setEditor(null);
    setTab('transactions');
  };

  return (
    <SafeAreaView style={[styles.safe, homeTheme && styles.homeSafe]} edges={['top', 'bottom']}>
      <StatusBar style={homeTheme ? 'dark' : 'light'}/>
      {!homeTheme && <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={[colors.backgroundDeep, colors.background, '#103454']}
        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
      />}
      <View style={styles.body}>
        {showOnboarding ? (
          <OnboardingScreen
            onExit={() => setShowOnboarding(false)}
            onFinish={() => {
              setTab('home');
              setShowOnboarding(false);
            }}
          />
        ) : editor !== null ? (
          <TransactionEditorScreen
            key={editor === 'new' ? 'new' : editor.id}
            initial={editor === 'new' ? undefined : editor}
            onCancel={() => setEditor(null)}
            onSave={save}
            onDelete={remove}
          />
        ) : tab === 'home' ? (
          <LivingLedgerDashboardScreen
            transactions={transactions}
            onAdd={() => setEditor('new')}
            onOpenTransactions={() => setTab('transactions')}
          />
        ) : tab === 'transactions' ? (
          <TransactionsScreen
            transactions={transactions}
            onAdd={() => setEditor('new')}
            onEdit={item => setEditor(item)}
          />
        ) : tab === 'analytics' ? (
          <AnalyticsScreen
            transactions={transactions}
            onOpenTransactions={() => setTab('transactions')}
          />
        ) : (
          <OtherScreen
            tab={tab}
            transactionCount={transactions.length}
            onOpenTransactions={() => setTab('transactions')}
            onOpenAnalytics={() => setTab('analytics')}
            onOpenOnboarding={() => setShowOnboarding(true)}
            onResetDemo={() => {
              setTransactions([...demo.transactions]);
              nextId.current = 1000;
            }}
          />
        )}
      </View>
      {editor === null && !showOnboarding && (
        <View style={[styles.navOuter, homeTheme && styles.homeNavOuter]}>
          <View style={[styles.nav, homeTheme && styles.homeNav]}>
            {tabs.map(item => {
              const active = tab === item.key;
              return (
                <Pressable
                  key={item.key}
                  accessibilityRole="tab"
                  accessibilityState={{selected: active}}
                  accessibilityLabel={item.label}
                  onPress={() => setTab(item.key)}
                  style={[styles.navItem, active && styles.navActive, homeTheme && active && styles.homeNavActive]}
                >
                  <AppIcon
                    name={item.icon}
                    color={homeTheme ? (active ? ledger.dark : ledger.subtext) : (active ? colors.primarySoft : colors.faint)}
                    size={21}
                    strokeWidth={active ? 2.3 : 1.8}
                  />
                  <Text
                    style={[styles.navLabel, active && styles.navLabelActive, homeTheme && styles.homeNavLabel, homeTheme && active && styles.homeNavLabelActive]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return <SafeAreaProvider><AppContent/></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: colors.background},
  body: {flex: 1},
  homeSafe: {backgroundColor: ledger.paper},
  navOuter: {paddingHorizontal: 16, paddingBottom: 8, paddingTop: 5},
  homeNavOuter: {backgroundColor: ledger.paper, borderTopWidth: 1, borderTopColor: ledger.rule},
  homeNav: {backgroundColor: ledger.paper, borderWidth: 0, borderRadius: 0},
  homeNavActive: {backgroundColor: ledger.paleSage},
  homeNavLabel: {color: ledger.subtext, fontSize: 11},
  homeNavLabelActive: {color: ledger.dark},
  nav: {
    height: 70, borderRadius: radius.lg, backgroundColor: '#102F4C',
    borderWidth: 1, borderColor: 'rgba(151,220,255,0.14)',
    flexDirection: 'row', alignItems: 'stretch', padding: 5,
  },
  navItem: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 16, minWidth: 0},
  navActive: {backgroundColor: '#1C537A'},
  navLabel: {fontSize: 10, color: colors.muted, fontWeight: '600'},
  navLabelActive: {color: colors.text, fontWeight: '700'},
});
