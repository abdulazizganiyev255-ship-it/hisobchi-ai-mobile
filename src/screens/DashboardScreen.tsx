import React, {useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {AppIcon} from '../components/AppIcon';
import {BalanceRibbon} from '../components/BalanceRibbon';
import {ExpenseChart} from '../components/ExpenseChart';
import {TransactionRow} from '../components/TransactionRow';
import {demo, formatMoney, Transaction} from '../data/demo';
import {EntryKind} from '../data/mockEntry';
import {colors, radius, shadow, spacing} from '../theme/tokens';

export function DashboardScreen({onOpenTransactions,onAddTransaction,transactions}: {onOpenTransactions:()=>void;onAddTransaction:(kind:EntryKind)=>void;transactions:Transaction[]}) {
  const [visible,setVisible] = useState(true);
  const [period,setPeriod] = useState<'current'|'previous'>('current');
  const {width} = useWindowDimensions();
  const narrow = width < 360;
  const month = demo.months[period];

  const explainDemo = (feature:string) => Alert.alert(
    'Dizayn prototipi',
    `${feature} keyingi bosqichda ulanadi. Hozir real hisobga yozilmaydi.`
  );

  return <ScrollView
    style={styles.scroll}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.header}>
      <View style={styles.brandMark}><Text style={styles.brandMonogram}>h.</Text></View>
      <View style={styles.heading}>
        <Text style={styles.appName}>Hisobchi <Text style={styles.brandAccent}>AI</Text></Text>
        <Text style={styles.greeting}>Moliyaviy xotirjamlik, har kuni.</Text>
      </View>
      <Pressable
        style={styles.bell}
        accessibilityRole="button"
        accessibilityLabel="Bildirishnomalar"
        onPress={()=>explainDemo('Bildirishnomalar')}
      ><AppIcon name="bell" color={colors.primary} size={20}/></Pressable>
    </View>

    <View style={styles.welcome}>
      <Text style={styles.eyebrow}>XAYRLI KUN ✦</Text>
      <Text style={[styles.welcomeTitle,narrow&&{fontSize:25}]}>Pul rejangiz — bir qarashda.</Text>
    </View>

    <View style={styles.demoLine}>
      <View style={styles.demoDot}/>
      <Text style={styles.demoText}>NAMUNA MA’LUMOT · HAQIQIY BALANS EMAS</Text>
    </View>

    <LinearGradient
      colors={['#844263','#6D2C4E','#4A1F36']}
      start={{x:0,y:0}}
      end={{x:1,y:1}}
      style={styles.balanceCard}
    >
      <View pointerEvents="none" style={styles.ribbon}><BalanceRibbon/></View>
      <View style={styles.balanceTop}>
        <View style={styles.balanceTitleRow}>
          <View style={styles.balanceIcon}><AppIcon name="wallet" color="#FFE8DD" size={16}/></View>
          <Text style={styles.balanceTitle}>Umumiy balans</Text>
        </View>
        <Pressable
          style={styles.eyeBtn}
          accessibilityRole="button"
          accessibilityLabel={visible?'Balansni yashirish':'Balansni ko‘rsatish'}
          onPress={()=>setVisible(v=>!v)}
        ><AppIcon name={visible?'eye':'eye-off'} color="#FFEBE9" size={21}/></Pressable>
      </View>
      <Text
        style={[styles.balanceValue,narrow&&{fontSize:27}]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
      >{visible?formatMoney(demo.balance):'••• ••• so‘m'}</Text>
      <Text style={styles.balanceFoot}>Barcha hisoblar · namuna</Text>
      <View style={styles.cardSeal}><Text style={styles.cardSealText}>HISOBCHI / DEMO</Text></View>
    </LinearGradient>

    <View style={styles.quickActions}>
      <Pressable
        style={[styles.action,styles.primaryAction]}
        accessibilityRole="button"
        accessibilityLabel="Xarajat qo‘shish"
        onPress={()=>onAddTransaction('expense')}
      >
        <View style={styles.primaryActionIcon}><AppIcon name="plus" color={colors.white} size={20}/></View>
        <Text style={styles.primaryActionText}>Xarajat</Text>
      </Pressable>
      <Pressable
        style={[styles.action,styles.secondaryAction]}
        accessibilityRole="button"
        accessibilityLabel="Kirim qo‘shish"
        onPress={()=>onAddTransaction('income')}
      >
        <View style={styles.secondaryActionIcon}><AppIcon name="wallet" color={colors.primary} size={18}/></View>
        <Text style={styles.secondaryActionText}>Kirim</Text>
      </Pressable>
    </View>

    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Bugungi sarf rejasi haqida"
      onPress={()=>Alert.alert(
        'Sarf rejasi · demo',
        '145 000 so‘m namuna qiymat. Haqiqiy Safe-to-Spend tasdiqlangan hisob qoldig‘i, majburiyatlar va rezervlardan Finance Engine orqali hisoblanadi.'
      )}
    >
      <View style={styles.safeCard}>
        <View style={styles.safeIcon}><AppIcon name="shield" size={23} color={colors.primary}/></View>
        <View style={styles.safeBody}>
          <Text style={styles.safeEyebrow}>KUNLIK SARF REJASI</Text>
          <Text style={[styles.safeAmount,narrow&&{fontSize:23}]} numberOfLines={1} adjustsFontSizeToFit>{formatMoney(demo.safeToSpendToday)}</Text>
          <Text style={styles.safeSubtitle}>Namuna · hisoblab chiqilmagan</Text>
        </View>
        <View style={styles.safeChevron}><AppIcon name="chevron" color={colors.primary} size={16}/></View>
      </View>
    </Pressable>

    <View style={styles.chartCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionIcon}><AppIcon name="chart" color={colors.primary} size={17}/></View>
          <Text style={styles.sectionTitle}>Xarajatlar</Text>
        </View>
        <Pressable
          style={styles.periodBtn}
          accessibilityRole="button"
          accessibilityLabel="Tahlil davrini almashtirish"
          onPress={()=>setPeriod(x=>x==='current'?'previous':'current')}
        >
          <Text style={styles.periodText}>{month.label}</Text>
          <AppIcon name="chevron-down" color={colors.primary} size={13}/>
        </Pressable>
      </View>
      <Text style={styles.chartAmount}>{formatMoney(month.total)}</Text>
      <Text style={styles.chartDetail}>Namuna tendensiya · {month.change<0?'−':'+'}{Math.abs(month.change)}%</Text>
      <ExpenseChart values={month.chart}/>
    </View>

    <View style={styles.transactionsCard}>
      <View style={styles.transactionsHeader}>
        <View>
          <Text style={styles.transactionsTitle}>So‘nggi operatsiyalar</Text>
          <Text style={styles.transactionsHint}>Namuna yozuvlar · sessiya davomida</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Barcha operatsiyalar"
          onPress={onOpenTransactions}
          style={styles.arrow}
        ><AppIcon name="chevron" color={colors.primary} size={19}/></Pressable>
      </View>
      {transactions.slice(0,3).map((item,i)=><React.Fragment key={item.id}>
        {i>0&&<View style={styles.separator}/>}
        <TransactionRow item={item} light/>
      </React.Fragment>)}
    </View>

    <Text style={styles.disclaimer}>Hisobchi AI · D02 mock prototip · real hisob emas</Text>
  </ScrollView>;
}

const styles=StyleSheet.create({
  scroll:{flex:1},
  content:{paddingHorizontal:spacing.lg,paddingTop:16,paddingBottom:32,gap:16},
  header:{flexDirection:'row',gap:11,alignItems:'center'},
  brandMark:{width:43,height:43,borderRadius:15,backgroundColor:colors.primary,alignItems:'center',justifyContent:'center'},
  brandMonogram:{fontSize:23,fontWeight:'800',color:'#FDF3EC',letterSpacing:-1.2},
  heading:{flex:1},
  appName:{fontWeight:'800',fontSize:19,letterSpacing:-0.45,color:colors.text},
  brandAccent:{color:colors.primary},
  greeting:{color:colors.muted,fontSize:11,marginTop:3},
  bell:{width:44,height:44,backgroundColor:colors.surface,borderRadius:21,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.divider},
  welcome:{gap:5,marginTop:8},
  eyebrow:{color:colors.primary,fontSize:10,fontWeight:'800',letterSpacing:2},
  welcomeTitle:{color:colors.text,fontSize:29,fontWeight:'800',letterSpacing:-1.1,maxWidth:320,lineHeight:37},
  demoLine:{flexDirection:'row',alignItems:'center',gap:7,marginTop:-5},
  demoDot:{height:5,width:5,borderRadius:3,backgroundColor:colors.primary},
  demoText:{fontSize:9,letterSpacing:0.6,color:colors.faint,fontWeight:'700'},
  balanceCard:{minHeight:194,borderRadius:radius.hero,padding:21,overflow:'hidden',...shadow.card},
  ribbon:{position:'absolute',right:-48,top:-7,opacity:0.7},
  balanceTop:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',zIndex:1},
  balanceTitleRow:{flexDirection:'row',alignItems:'center',gap:9},
  balanceIcon:{width:31,height:31,borderRadius:11,backgroundColor:'rgba(255,239,230,0.17)',alignItems:'center',justifyContent:'center'},
  balanceTitle:{color:'#FDEFE9',fontSize:14,fontWeight:'600'},
  eyeBtn:{minHeight:44,minWidth:44,alignItems:'center',justifyContent:'center',margin:-8},
  balanceValue:{color:'#FFFFFF',fontWeight:'800',fontSize:31,letterSpacing:-0.8,marginTop:22,zIndex:1,paddingRight:12,textShadowColor:'rgba(38,7,25,0.52)',textShadowOffset:{width:0,height:1},textShadowRadius:4},
  balanceFoot:{color:'#F6D7E1',fontSize:11,marginTop:8,zIndex:1},
  cardSeal:{marginTop:20,alignSelf:'flex-start',zIndex:1},
  cardSealText:{fontSize:8,color:'#E6BFCF',fontWeight:'700',letterSpacing:2},
  quickActions:{flexDirection:'row',gap:11},
  action:{flex:1,minHeight:56,borderRadius:radius.lg,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10},
  primaryAction:{backgroundColor:colors.primary},
  secondaryAction:{backgroundColor:colors.surface,borderWidth:1,borderColor:colors.divider},
  primaryActionIcon:{height:28,width:28,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(255,255,255,0.14)'},
  secondaryActionIcon:{height:28,width:28,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:colors.primarySoft},
  primaryActionText:{fontSize:14,fontWeight:'800',color:colors.white},
  secondaryActionText:{fontSize:14,fontWeight:'800',color:colors.primary},
  safeCard:{minHeight:118,borderRadius:radius.xl,padding:17,backgroundColor:'#F5E5DF',borderWidth:1,borderColor:'#EBD5D0',flexDirection:'row',alignItems:'center',gap:14},
  safeIcon:{height:45,width:45,backgroundColor:'#FFF8F5',borderRadius:15,alignItems:'center',justifyContent:'center'},
  safeBody:{flex:1,minWidth:0},
  safeEyebrow:{color:colors.primary,fontWeight:'800',fontSize:10,letterSpacing:0.8},
  safeAmount:{color:colors.ink,fontWeight:'800',fontSize:26,letterSpacing:-0.8,marginTop:5},
  safeSubtitle:{color:colors.muted,fontSize:10,marginTop:4},
  safeChevron:{alignItems:'center',justifyContent:'center'},
  chartCard:{borderRadius:radius.xl,backgroundColor:colors.surface,padding:18,borderWidth:1,borderColor:colors.divider},
  sectionHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:8},
  sectionTitleRow:{flexDirection:'row',alignItems:'center',gap:8,flexShrink:1},
  sectionIcon:{width:29,height:29,borderRadius:11,backgroundColor:colors.primarySoft,alignItems:'center',justifyContent:'center'},
  sectionTitle:{color:colors.text,fontWeight:'800',fontSize:17,letterSpacing:-0.3},
  periodBtn:{backgroundColor:colors.background,borderRadius:radius.pill,minHeight:44,paddingVertical:9,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:6},
  periodText:{color:colors.primary,fontSize:11,fontWeight:'700'},
  chartAmount:{fontWeight:'800',fontSize:23,color:colors.text,marginTop:15,letterSpacing:-0.5},
  chartDetail:{fontSize:11,color:colors.muted,marginTop:4},
  transactionsCard:{backgroundColor:colors.surface,borderRadius:radius.xl,paddingHorizontal:16,paddingVertical:15,borderWidth:1,borderColor:colors.divider},
  transactionsHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:7},
  transactionsTitle:{color:colors.ink,fontWeight:'800',fontSize:17,letterSpacing:-0.3},
  transactionsHint:{fontSize:10,color:colors.muted,marginTop:4},
  arrow:{width:44,height:44,borderRadius:22,backgroundColor:colors.primarySoft,justifyContent:'center',alignItems:'center'},
  separator:{height:1,backgroundColor:colors.line,marginLeft:57},
  disclaimer:{color:colors.faint,textAlign:'center',fontSize:10,marginTop:1},
});
