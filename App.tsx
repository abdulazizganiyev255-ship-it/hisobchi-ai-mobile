import {useRef,useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {AppIcon, IconName} from './src/components/AppIcon';
import {DashboardScreen} from './src/screens/DashboardScreen';
import {OtherScreen, Tab} from './src/screens/OtherScreens';
import {TransactionEntryScreen} from './src/screens/TransactionEntryScreen';
import {demo,Transaction} from './src/data/demo';
import {EntryKind,makeMockTransaction,MockEntryDraft} from './src/data/mockEntry';
import {colors, radius, shadow} from './src/theme/tokens';

const tabs: {key:Tab;label:string;icon:IconName}[] = [
  {key:'home',label:'Bosh',icon:'home'},
  {key:'transactions',label:'Tarix',icon:'receipt'},
  {key:'ai',label:'AI',icon:'sparkles'},
  {key:'analytics',label:'Tahlil',icon:'chart'},
  {key:'profile',label:'Profil',icon:'user'},
];

function AppContent() {
  const [tab,setTab]=useState<Tab>('home');
  const [entryKind,setEntryKind]=useState<EntryKind|null>(null);
  const [transactions,setTransactions]=useState<Transaction[]>(demo.transactions);
  const [notice,setNotice]=useState('');
  const nextMockId=useRef(0);

  const openEntry=(kind:EntryKind)=>{
    setNotice('');
    setEntryKind(kind);
  };

  const saveEntry=(draft:MockEntryDraft)=>{
    nextMockId.current+=1;
    const saved=makeMockTransaction(draft,`d02-${Date.now()}-${nextMockId.current}`);
    setTransactions(existing=>[saved,...existing]);
    setEntryKind(null);
    setTab('transactions');
    setNotice('Namuna qo‘shildi. Yozuv faqat ushbu ochiq sessiyada saqlanadi.');
  };

  return <SafeAreaView style={styles.safe} edges={['top','bottom']}>
    <StatusBar style="dark"/>
    {entryKind!==null
      ? <TransactionEntryScreen
          initialKind={entryKind}
          onCancel={()=>setEntryKind(null)}
          onSave={saveEntry}
        />
      : <>
        <View style={styles.body}>
          {tab==='home'
            ? <DashboardScreen
                onOpenTransactions={()=>setTab('transactions')}
                onAddTransaction={openEntry}
                transactions={transactions}
              />
            : <OtherScreen
                tab={tab}
                transactions={transactions}
                demoCount={transactions.length-demo.transactions.length}
                notice={notice}
                onAddTransaction={openEntry}
              />
          }
        </View>
        <View style={styles.navOuter}>
          <View style={styles.nav}>
            {tabs.map(item=>{
              const active=tab===item.key;
              return <Pressable
                key={item.key}
                accessibilityRole="tab"
                accessibilityState={{selected:active}}
                accessibilityLabel={item.label}
                onPress={()=>{setTab(item.key);setNotice('');}}
                style={[styles.navItem,active&&styles.navActive]}
              >
                <AppIcon
                  name={item.icon}
                  color={active?colors.primary:colors.faint}
                  size={21}
                  strokeWidth={active?2.2:1.8}
                />
                <Text style={[styles.navLabel,active&&styles.navLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{item.label}</Text>
              </Pressable>;
            })}
          </View>
        </View>
      </>
    }
  </SafeAreaView>;
}

export default function App(){
  return <SafeAreaProvider><AppContent/></SafeAreaProvider>;
}

const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:colors.background},
  body:{flex:1},
  navOuter:{paddingHorizontal:16,paddingBottom:6,paddingTop:6,backgroundColor:colors.background},
  nav:{
    minHeight:70,
    borderRadius:radius.xl,
    backgroundColor:colors.surface,
    borderWidth:1,
    borderColor:colors.divider,
    flexDirection:'row',
    alignItems:'stretch',
    padding:5,
    ...shadow.light,
  },
  navItem:{flex:1,minWidth:0,alignItems:'center',justifyContent:'center',gap:4,borderRadius:radius.md},
  navActive:{backgroundColor:colors.primarySoft},
  navLabel:{fontSize:10,color:colors.muted,fontWeight:'600'},
  navLabelActive:{color:colors.primary,fontWeight:'800'},
});
