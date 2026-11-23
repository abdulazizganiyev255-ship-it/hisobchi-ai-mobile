import {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {AppIcon, IconName} from './src/components/AppIcon';
import {DashboardScreen} from './src/screens/DashboardScreen';
import {OtherScreen, Tab} from './src/screens/OtherScreens';
import {colors, radius} from './src/theme/tokens';
import {Stage06PreviewScreen} from './src/design-os06/Stage06PreviewScreen';

const tabs:{key:Tab;label:string;icon:IconName}[]=[
  {key:'home',label:'Bosh sahifa',icon:'home'},
  {key:'transactions',label:'Operatsiyalar',icon:'receipt'},
  {key:'analytics',label:'Tahlil',icon:'chart'},
  {key:'profile',label:'Profil',icon:'user'}
];

function AppContent() {
  const [tab,setTab]=useState<Tab>('home');
  return <SafeAreaView style={styles.safe} edges={['top','bottom']}>
    <StatusBar style="light"/>
    <LinearGradient style={StyleSheet.absoluteFill} colors={[colors.backgroundDeep,colors.background,'#103454']} start={{x:0,y:0}} end={{x:1,y:1}}/>
    <View style={styles.body}>{tab==='home'?<DashboardScreen onOpenTransactions={()=>setTab('transactions')}/>:<OtherScreen tab={tab}/>}</View>
    <View style={styles.navOuter}><View style={styles.nav}>
      {tabs.map(item=>{
        const active=tab===item.key;
        return <Pressable key={item.key} accessibilityRole="tab" accessibilityState={{selected:active}} accessibilityLabel={item.label} onPress={()=>setTab(item.key)} style={[styles.navItem,active&&styles.navActive]}>
          <AppIcon name={item.icon} color={active?colors.primarySoft:colors.faint} size={21} strokeWidth={active?2.3:1.8}/>
          <Text style={[styles.navLabel,active&&styles.navLabelActive]} numberOfLines={1} adjustsFontSizeToFit>{item.label}</Text>
        </Pressable>;
      })}
    </View></View>
  </SafeAreaView>;
}

export default function App(){return <SafeAreaProvider>{__DEV__ && process.env.EXPO_PUBLIC_HISOBCHI_DESIGN_OS === '1' ? <Stage06PreviewScreen/> : <AppContent/>}</SafeAreaProvider>}

const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:colors.background},body:{flex:1},navOuter:{paddingHorizontal:16,paddingBottom:8,paddingTop:5},nav:{height:70,borderRadius:radius.lg,backgroundColor:'#102F4C',borderWidth:1,borderColor:'rgba(151,220,255,0.14)',flexDirection:'row',alignItems:'stretch',padding:5},navItem:{flex:1,alignItems:'center',justifyContent:'center',gap:5,borderRadius:16,minWidth:0},navActive:{backgroundColor:'#1C537A'},navLabel:{fontSize:10,color:colors.muted,fontWeight:'600'},navLabelActive:{color:colors.text,fontWeight:'700'}
});

