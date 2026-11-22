import {useRef, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {AppIcon, type IconName} from './src/components/AppIcon';
import {demo, type Transaction} from './src/data/demo';
import {transactionFromDraft, type TransactionDraft} from './src/data/transactions';
import {DashboardScreen} from './src/screens/DashboardScreen';
import {OtherScreen, type Tab} from './src/screens/OtherScreens';
import {TransactionsScreen} from './src/screens/TransactionsScreen';
import {TransactionEditorScreen} from './src/screens/TransactionEditorScreen';
import {colors, radius} from './src/theme/tokens';

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
  const nextId = useRef(1000);

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
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light"/>
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={[colors.backgroundDeep, colors.background, '#103454']}
        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
      />
      <View style={styles.body}>
        {editor !== null ? (
          <TransactionEditorScreen
            key={editor === 'new' ? 'new' : editor.id}
            initial={editor === 'new' ? undefined : editor}
            onCancel={() => setEditor(null)}
            onSave={save}
            onDelete={remove}
          />
        ) : tab === 'home' ? (
          <DashboardScreen
            transactions={transactions}
            onOpenTransactions={() => setTab('transactions')}
          />
        ) : tab === 'transactions' ? (
          <TransactionsScreen
            transactions={transactions}
            onAdd={() => setEditor('new')}
            onEdit={item => setEditor(item)}
          />
        ) : (
          <OtherScreen tab={tab}/>
        )}
      </View>
      {editor === null && (
        <View style={styles.navOuter}>
          <View style={styles.nav}>
            {tabs.map(item => {
              const active = tab === item.key;
              return (
                <Pressable
                  key={item.key}
                  accessibilityRole="tab"
                  accessibilityState={{selected: active}}
                  accessibilityLabel={item.label}
                  onPress={() => setTab(item.key)}
                  style={[styles.navItem, active && styles.navActive]}
                >
                  <AppIcon
                    name={item.icon}
                    color={active ? colors.primarySoft : colors.faint}
                    size={21}
                    strokeWidth={active ? 2.3 : 1.8}
                  />
                  <Text
                    style={[styles.navLabel, active && styles.navLabelActive]}
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
  navOuter: {paddingHorizontal: 16, paddingBottom: 8, paddingTop: 5},
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
